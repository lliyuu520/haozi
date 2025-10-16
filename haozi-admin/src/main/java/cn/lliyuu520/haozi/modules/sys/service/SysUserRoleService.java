package cn.lliyuu520.haozi.modules.sys.service;


import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.entity.SysUserRole;

import java.util.List;

/**
 * 用户角色关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public interface SysUserRoleService extends BaseService<SysUserRole> {

    /**
     * 保存或修改
     *
     * @param userId     用户ID
     * @param roleIdList 角色ID列表
     */
    void saveOrUpdate(Long userId, List<Long> roleIdList);

    /**
     * 分配角色给用户列表
     *
     * @param roleId     角色ID
     * @param userIdList 用户ID列表
     */
    void saveUserList(Long roleId, List<Long> userIdList);

    /**
     * 根据角色id列表，删除用户角色关系
     *
     * @param roleIdList 角色id
     */
    void deleteByRoleId(Long id);

    /**
     * 根据用户id列表，删除用户角色关系
     *
     * @param userIdList 用户id列表
     */
    void deleteByUserId(Long userId);

    /**
     * 根据角色id、用户id列表，删除用户角色关系
     *
     * @param roleId     角色id
     * @param userIdList 用户id列表
     */
    void deleteByUserId(Long roleId, List<Long> userIdList);

    /**
     * 角色ID列表
     *
     * @param userId 用户ID
     */
    List<Long> getRoleIdList(Long userId);

    /**
     * 角色列表
     *
     * @param userId
     * @return
     */
    List<String> getRoleNameList(Long userId);
}
