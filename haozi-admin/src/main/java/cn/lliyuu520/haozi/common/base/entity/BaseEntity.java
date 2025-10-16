package cn.lliyuu520.haozi.common.base.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Entity基类
 * 所有实体类的基类，包含了通用的字段如ID、创建时间、更新时间等
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
public class BaseEntity implements Serializable {
    /**
     * 主键ID
     * 使用MyBatis Plus的ASSIGN_ID策略生成唯一标识
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 创建时间
     * 记录实体创建的时间戳
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     * 记录实体最后更新的时间戳
     */
    @JsonIgnore
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 创建者
     * 记录创建该实体的用户ID
     */
    @JsonIgnore
    @TableField(fill = FieldFill.INSERT)
    private Long creator;

    /**
     * 更新者
     * 记录最后更新该实体的用户ID
     */
    @JsonIgnore
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updater;

    /**
     * 删除标记
     * 逻辑删除标记，使用MyBatis Plus的@TableLogic注解实现逻辑删除
     */
    @TableLogic
    @JsonIgnore
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}