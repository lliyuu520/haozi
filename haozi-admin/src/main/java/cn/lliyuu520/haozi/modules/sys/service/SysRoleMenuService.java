package cn.lliyuu520.haozi.modules.sys.service;


import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.entity.SysRoleMenu;

import java.util.List;


/**
 * 角色与菜单对应关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public interface SysRoleMenuService extends BaseService<SysRoleMenu> {

    /**
     * 根据角色ID，获取菜单ID列表
     */
    List<Long> getMenuIdList(Long roleId);


    /**
     * 保存或修改
     *
     * @param roleId     角色ID
     * @param menuIdList 菜单ID列表
     */
    void saveOrUpdate(Long roleId, List<Long> menuIdList);

    /**
     * 根据角色id列表，删除角色菜单关系
     *
     * @param id 角色id列表
     */
    void deleteByRoleId(Long id);

    /**
     * 根据菜单id，删除角色菜单关系
     *
     * @param menuId 菜单id
     */
    void deleteByMenuId(Long menuId);


}
