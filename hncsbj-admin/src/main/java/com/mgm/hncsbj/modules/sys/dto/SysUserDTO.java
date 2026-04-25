package com.mgm.hncsbj.modules.sys.dto;

import com.mgm.hncsbj.modules.sys.entity.SysUser;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * @author liliangyu
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUserDTO extends SysUser {
    /**
     * 角色
     */
    private List<Long> roleIdList;
}
