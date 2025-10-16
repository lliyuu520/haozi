package cn.lliyuu520.haozi.modules.sys.mapper;

import cn.lliyuu520.haozi.common.base.mapper.IBaseMapper;
import cn.lliyuu520.haozi.modules.sys.entity.SysRoleMenu;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * 角色与菜单对应关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Repository
public interface SysRoleMenuMapper extends IBaseMapper<SysRoleMenu> {

    /**
     * 根据角色ID，获取菜单ID列表
     */
    List<Long> getMenuIdList(@Param("roleId") Long roleId);

    /**
     * 根据角色ID，获取接口ID列表
     *
     * @param roleId
     * @return
     */
    Set<String> getInterfaceMenuIdList(@Param("roleId") Long roleId);

    /**
     * 根据菜单ID，删除角色菜单关系
     *
     * @param menuId 菜单ID
     */
    void deleteByMenuId(@Param("menuId") Long menuId);

    /**
     * 根据角色ID，删除角色菜单关系
     *
     * @param roleId 角色ID
     */
    void deleteByRoleId(@Param("roleId") Long roleId);
}
