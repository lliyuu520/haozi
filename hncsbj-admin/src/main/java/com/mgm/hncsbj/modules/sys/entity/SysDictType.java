package com.mgm.hncsbj.modules.sys.entity;

import com.mgm.hncsbj.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 字典类型
 *
 * @author lliyuu520
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysDictType extends BaseEntity {
    /**
     * 字典类型
     */
    private String dictType;
    /**
     * 字典名称
     */
    private String dictName;
    /**
     * 备注
     */
    private String remark;

}