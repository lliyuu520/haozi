package cn.lliyuu520.haozi.common.utils;


import cn.hutool.core.codec.Base64;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import com.alibaba.excel.EasyExcel;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.MatchMode;
import com.aliyun.oss.model.PolicyConditions;
import cn.lliyuu520.haozi.common.config.ProjectConfiguration;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.vo.OssPolicyVO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDownloadCenter;
import cn.lliyuu520.haozi.modules.sys.enums.SseNotifyType;
import cn.lliyuu520.haozi.modules.sys.mapper.SysDownloadCenterMapper;
import cn.lliyuu520.haozi.modules.sys.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;


/**
 * OSS工具
 *
 * @author miguoma
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class AliyunOssUtil {

    private final ProjectConfiguration projectConfiguration;
    private final SysDownloadCenterMapper sysDownloadCenterMapper;
    private  final  SseService sseService;

    /**
     * 根据文件名，生成带时间戳的新文件名
     *
     * @param fileName 文件名
     * @return 返回带时间戳的文件名
     */
    private static String getNewFileName(final String fileName) {
        // 主文件名，不包含扩展名
        final String prefix = FileNameUtil.getPrefix(fileName);
        // 文件扩展名
        final String suffix = FileNameUtil.getSuffix(fileName);
        // 把当天HH:mm:ss，转换成秒
        final LocalDateTime now = LocalDateTimeUtil.now();
        final String time = LocalDateTimeUtil.format(now, DatePattern.PURE_TIME_PATTERN);
        // 新文件名
        return prefix + "_" + time + "." + suffix;
    }

    /**
     * 生成路径，不包含文件名
     *
     * @return 返回生成的路径
     */
    private static String getPath() {
        // 文件路径

        return LocalDateTimeUtil.format(LocalDateTimeUtil.now(), "yyyyMMdd");
    }

    /**
     * 根据文件名，生成路径
     *
     * @param fileName 文件名
     * @return 生成文件路径
     */
    private static String getPath(final String fileName) {
        return AliyunOssUtil.getPath() + "/" + AliyunOssUtil.getNewFileName(fileName);
    }


    /**
     * 上传文件
     *
     * @param multipartFile
     * @return
     */
    @SneakyThrows
    public String upload(final MultipartFile multipartFile) {
        final InputStream inputStream = multipartFile.getInputStream();
        final String originalFilename = multipartFile.getOriginalFilename();
        return upload(inputStream, originalFilename);
    }

    /**
     * 上传文件
     *
     * @param file
     * @return
     */
    @SneakyThrows
    public String upload(final File file) {
        final InputStream inputStream = FileUtil.getInputStream(file);
        final String originalFilename = FileUtil.getName(file);

        return upload(inputStream, originalFilename);
    }

    /**
     * 上传excel
     *
     * @param sysDownloadCenterId
     * @param list
     * @return
     */
    public <D> void uploadExcel(final Long sysDownloadCenterId, final List<D> list) {
        final SysDownloadCenter sysDownloadCenter = sysDownloadCenterMapper.selectById(sysDownloadCenterId);
        final String name = sysDownloadCenter.getName();

        final File file = FileUtil.newFile(name);
        EasyExcel.write(file,list.get(0).getClass()).sheet("Sheet1").doWrite(list);
        final String uploadExcelUrl = upload(file);
        sysDownloadCenter.setUrl(uploadExcelUrl);
        sysDownloadCenter.setCompletedDateTime(LocalDateTime.now());
        sysDownloadCenterMapper.updateById(sysDownloadCenter);
        // 删除文件
        FileUtil.del(file);

        sseService.sendDownloadNotification(sysDownloadCenter.getCreator(), SseNotifyType.FILE_DOWNLOAD_SUCCESS,"uploadExcelUrl",name);
    }

    /**
     * 上传文件
     *
     * @param inputStream
     * @param originalFilename
     * @return
     */
    private String upload(final InputStream inputStream, final String originalFilename) {
        final String path = AliyunOssUtil.getPath(originalFilename);
        final ProjectConfiguration.AliyunProperties aliyunProperties = projectConfiguration.getAliyunProperties();

        final String endPoint = aliyunProperties.getEndPoint();
        final OSS client = new OSSClientBuilder().build(endPoint, aliyunProperties.getAccessKeyId(), aliyunProperties.getAccessKeySecret());
        final String bucketName = aliyunProperties.getBucketName();
        try {
            client.putObject(bucketName, path, inputStream);
        } catch (final Exception e) {
            throw new BaseException("上传文件失败：", e);
        } finally {
            if (client != null) {
                client.shutdown();
            }
        }
        return aliyunProperties.getCdnDomain() + "/" + path;
    }


    /**
     * 获取上传策略
     *
     * @return
     * @throws UnsupportedEncodingException
     */
    @SneakyThrows
    public OssPolicyVO getPolicy(String fileName) {
        // 重命名文件名
        fileName = AliyunOssUtil.getNewFileName(fileName);
        final ProjectConfiguration.AliyunProperties aliyunProperties = projectConfiguration.getAliyunProperties();
        final DateTime now = DateUtil.date();
        final String dir = DateUtil.format(now, DatePattern.PURE_DATE_PATTERN) + "/";
        final String endPoint = aliyunProperties.getEndPoint();
        final String accessKeyId = aliyunProperties.getAccessKeyId();
        final OSS client = new OSSClientBuilder().build(endPoint, accessKeyId, aliyunProperties.getAccessKeySecret());
        final PolicyConditions policyConditions = new PolicyConditions();
        policyConditions.addConditionItem(PolicyConditions.COND_CONTENT_LENGTH_RANGE, 0, 1048576000);
        final String contentDisposition = getContentDisposition(fileName);
        policyConditions.addConditionItem(PolicyConditions.COND_CONTENT_DISPOSITION, contentDisposition);
        final String xOssContentType = getXOssContentType(fileName);
        policyConditions.addConditionItem(PolicyConditions.COND_CONTENT_TYPE, xOssContentType);
        policyConditions.addConditionItem(PolicyConditions.COND_SUCCESS_ACTION_STATUS, "200");
        policyConditions.addConditionItem(MatchMode.StartWith, PolicyConditions.COND_KEY, dir);
        final String postPolicy = client.generatePostPolicy(DateUtil.offsetMinute(now, 10), policyConditions);
        final String encodedPolicy = Base64.encode(postPolicy);
        final String signature = client.calculatePostSignature(postPolicy);

        return new OssPolicyVO(accessKeyId, encodedPolicy, signature, dir, "https://" + aliyunProperties.getBucketName() + "." + endPoint, xOssContentType, contentDisposition, aliyunProperties.getCdnDomain() + "/" + dir + fileName, fileName);


    }

    /**
     * 获取Content-Disposition
     *
     * @param fileName
     * @return
     */
    private String getContentDisposition(final String fileName) {
        //根据文件类型进行判断 图片,视频,采用inline,其他采用attachment
        //获取后缀名称
        final String suffix = FileNameUtil.getSuffix(fileName);
        //图片
        if ("jpg".equalsIgnoreCase(suffix) || "jpeg".equalsIgnoreCase(suffix) || "png".equalsIgnoreCase(suffix) || "gif".equalsIgnoreCase(suffix) || "bmp".equalsIgnoreCase(suffix)) {
            return "inline;filename=" + fileName;
        }
        //视频
        if ("mp4".equalsIgnoreCase(suffix) || "avi".equalsIgnoreCase(suffix) || "rmvb".equalsIgnoreCase(suffix) || "rm".equalsIgnoreCase(suffix) || "flv".equalsIgnoreCase(suffix) || "3gp".equalsIgnoreCase(suffix) || "wmv".equalsIgnoreCase(suffix) || "mkv".equalsIgnoreCase(suffix) || "mov".equalsIgnoreCase(suffix)) {
            return "inline;filename=" + fileName;
        }
        return "attachment";
    }

    /**
     * mime-Tye
     * 获取 x-oss-content-type
     */
    private String getXOssContentType(final String fileName) {
        //根据文件类型进行判断
        //获取后缀名称
        final String suffix = FileNameUtil.getSuffix(fileName);
        //图片
        if ("jpg".equalsIgnoreCase(suffix) || "jpeg".equalsIgnoreCase(suffix) || "png".equalsIgnoreCase(suffix) || "gif".equalsIgnoreCase(suffix) || "bmp".equalsIgnoreCase(suffix)) {
            return "image/" + suffix;
        }
        //视频
        if ("mp4".equalsIgnoreCase(suffix) || "avi".equalsIgnoreCase(suffix) || "rmvb".equalsIgnoreCase(suffix) || "rm".equalsIgnoreCase(suffix) || "flv".equalsIgnoreCase(suffix) || "3gp".equalsIgnoreCase(suffix) || "wmv".equalsIgnoreCase(suffix) || "mkv".equalsIgnoreCase(suffix) || "mov".equalsIgnoreCase(suffix)) {
            return "video/" + suffix;
        }
        //文本
        if ("txt".equalsIgnoreCase(suffix) || "doc".equalsIgnoreCase(suffix) || "docx".equalsIgnoreCase(suffix) || "xls".equalsIgnoreCase(suffix) || "xlsx".equalsIgnoreCase(suffix) || "ppt".equalsIgnoreCase(suffix) || "pptx".equalsIgnoreCase(suffix) || "pdf".equalsIgnoreCase(suffix)) {
            return "text/" + suffix;
        }
        //音频
        if ("mp3".equalsIgnoreCase(suffix) || "wav".equalsIgnoreCase(suffix) || "wma".equalsIgnoreCase(suffix) || "ogg".equalsIgnoreCase(suffix) || "ape".equalsIgnoreCase(suffix) || "flac".equalsIgnoreCase(suffix)) {
            return "audio/" + suffix;
        }
        return "application/octet-stream";
    }


}
