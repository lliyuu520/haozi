package com.mgm.hncsbj.modules.sys.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mgm.hncsbj.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_role")
public class SysRole extends BaseEntity {
    /**
     * 角色名称
     */
    private String name;



}
