package cn.lliyuu520.haozi.common.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 文件DTO
 *
 * @author liliangyu
 */
@Data
public class FileDTO implements Serializable {
    /**
     * 名称
     */
    private String name;
    /**
     * 地址
     */
    private String url;
}
