package cn.lliyuu520.haozi.modules.sys.vo;

import cn.lliyuu520.haozi.modules.sys.entity.SysRole;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * 角色管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysRoleVO extends SysRole {


    /**
     *  菜单ID列表
     */
    private List<Long> menuIdList;


}
