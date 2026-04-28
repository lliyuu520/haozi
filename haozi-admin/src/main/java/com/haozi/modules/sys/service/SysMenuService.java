package com.haozi.modules.sys.service;

import cn.hutool.core.lang.tree.Tree;
import com.haozi.common.base.service.BaseService;
import com.haozi.common.satoken.user.UserDetail;
import com.haozi.modules.sys.dto.SysMenuDTO;
import com.haozi.modules.sys.entity.SysMenu;

import java.util.List;
import java.util.Set;


/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public interface SysMenuService extends BaseService<SysMenu> {
    /**
     * 保存菜单
     *
     * @param sysMenuDTO
     */
    void saveOne(SysMenuDTO sysMenuDTO);

    /**
     * 更新菜单
     *
     * @param sysMenuDTO
     */
    void updateOne(SysMenuDTO sysMenuDTO);

    /**
     * 删除菜单
     *
     * @param id
     */
    void deleteOne(Long id);

    /**
     * 菜单列表
     *
     * @param type 菜单类型
     */
    List<Tree<Long>> getMenuList(Integer type);

    /**
     * 用户菜单列表
     *
     * @param user 用户
     * @param type 菜单类型
     */
    List<Tree<Long>> getUserMenuList(UserDetail user, Integer type);

    /**
     * 获取子菜单的数量
     *
     * @param pid 父菜单ID
     */
    Long getSubMenuCount(Long pid);

    /**
     * 获取用户权限列表
     */
    Set<String> getUserAuthority(UserDetail user);

    /**
     * 获取用户可访问的前端路由编码。
     *
     * <p>从菜单 URL 推导 route code，供 React route manifest 过滤动态菜单。</p>
     *
     * @param user 用户
     * @return route code 列表
     */
    List<String> getUserRouteCodes(UserDetail user);

    /**
     * 获取用户可使用的按钮和接口权限编码。
     *
     * @param user 用户
     * @return 权限编码列表
     */
    List<String> getPermissionCodes(UserDetail user);

    /**
     * 添加模块
     * @param moduleName
      * @param parentCode
     * @param parentId
     */
    void addModule(String moduleCode,String parentCode,String moduleName,Long parentId);
}
