package cn.lliyuu520.haozi.modules.sys.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 文件上传
 *
 * @author lliyuu520
 */
@Data
public class SysFileVO implements Serializable {
    /**
     * 文件名称
     */
    private String name;

    /**
     * 文件地址
     */
    private String url;



}
