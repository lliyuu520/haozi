package cn.lliyuu520.haozi.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 系统参数
 *
 * @author miguoma
 */
@Component
@ConfigurationProperties(prefix = "project")
@Data
public class ProjectConfiguration {


    /**
     * 阿里云 云存储配置项
     */
    private final AliyunProperties aliyunProperties = new AliyunProperties();



    /**
     * 域名
     */
    private String domain;
    /**
     * 小程序追溯url
     */
    private String maUrl;
    /**
     * 核销url
     */
    private String writeOffUrl;
    /**
     * 高德地图key
     */
    private String amapKey;

    /**
     * 本地文件路径
     */
    private String localFilePath;


    /**
     * 阿里云云存储配置项
     */
    @Data
    public static class AliyunProperties {
        /**
         * 阿里云API的外网域名
         */
        private String endPoint;
        /**
         * 阿里云API的密钥Access Key ID
         */
        private String accessKeyId;
        /**
         * 阿里云API的密钥Access Key Secret
         */
        private String accessKeySecret;
        /**
         * 阿里云API的bucket名称
         */
        private String bucketName;
        /**
         * oss域名
         */
        private String cdnDomain;

        /**
         * 短信签名
         */
        private String signName;
        /**
         * 短信模板
         */
        private String templateCode;

        /**
         * 短信参数模板
         */
        private String templateParam;
    }


}
