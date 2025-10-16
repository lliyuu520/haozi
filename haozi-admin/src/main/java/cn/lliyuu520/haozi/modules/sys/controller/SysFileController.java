package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.lliyuu520.haozi.common.utils.AliyunOssUtil;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.common.vo.OssPolicyVO;
import cn.lliyuu520.haozi.modules.sys.vo.SysFileVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传
 *
 * @author lliyuu520
 */
@RestController
@RequestMapping("/sys/file")
@RequiredArgsConstructor
@SaIgnore
public class SysFileController {

    private final AliyunOssUtil aliyunOssUtil;


    /**
     * 上传文件
     *
     * @param file
     * @return
     * @throws Exception
     */
    @PostMapping("/uploadOss")
    public Result<SysFileVO> uploadOss(@RequestParam("file") final MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return Result.error("请选择需要上传的文件");
        }
        final String url = aliyunOssUtil.upload(file);


        final SysFileVO vo = new SysFileVO();
        vo.setUrl(url);
        vo.setName(file.getOriginalFilename());

        return Result.ok(vo);
    }


    /**
     * 获取OssPolicy
     */
    @GetMapping("/getOssPolicy")
    public Result<OssPolicyVO> getOssPolicy(final String fileName) {
        return Result.ok(aliyunOssUtil.getPolicy(fileName));
    }

}
