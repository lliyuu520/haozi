package cn.lliyuu520.haozi.common.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * OssPolicyVO
 *
 * @author liliangyu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OssPolicyVO implements Serializable {
    /**
     * accessKeyId
     */
    private String accessKeyId;
    /**
     * policy
     */
    private String policy;
    /**
     * signature
     */
    private String signature;
    /**
     * dir
     */
    private String dir;
    /**
     * host
     */
    private String host;
    /**
     * contentType
     */
    private String contentType;
    /**
     * contentDisposition
     */
    private String contentDisposition;
    /**
     * 文件地址
     */
    private String fileUrl;
    /**
     * 文件名称
     */
    private String fileName;


}
