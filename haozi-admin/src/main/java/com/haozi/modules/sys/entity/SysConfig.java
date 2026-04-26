package com.haozi.modules.sys.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.haozi.common.base.entity.BaseEntity;
import com.haozi.common.dto.FileDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

/**
 * 系统参数
 *
 * @author liliangyu
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName(autoResultMap = true)
public class SysConfig extends BaseEntity {
    /**
     * 系统名称
     */
    public static final String SYSTEM_NAME = "SYSTEM_NAME";
    /**
     * 系统描述
     */
    public static final String SYSTEM_DESCRIPTION = "SYSTEM_DESCRIPTION";
    /**
     * 维护模式开关
     */
    public static final String SYSTEM_MAINTENANCE_ENABLED = "SYSTEM_MAINTENANCE_ENABLED";

    /**
     * 参数编码
     */
    private String code;
    /**
     * 参数描述
     */
    private String descs;


    /**
     * 参数类型(开关,数字,文本)
     * {@link com.haozi.modules.sys.enums.SysConfigType}
     */
    private String type;
    /**
     * 是否生效(仅用于开关类型)
     */
    private Boolean enabled;
    /**
     * 数值(仅用于数值类型)
     */
    private Integer num;
    /**
     * 文本内容(仅用于文本类型)
     */
    private String text;

    /**
     * 文件列表(仅用于文件类型)
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<FileDTO> files = new ArrayList<>();

    /**
     * 图片类型
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<FileDTO> images = new ArrayList<>();
}
