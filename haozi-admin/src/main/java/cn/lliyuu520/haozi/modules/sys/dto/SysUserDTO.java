package cn.lliyuu520.haozi.modules.sys.dto;

import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
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
