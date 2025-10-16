package cn.lliyuu520.haozi.modules.sys.mapper;

import cn.lliyuu520.haozi.common.base.mapper.IBaseMapper;
import cn.lliyuu520.haozi.modules.sys.entity.SysMenu;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Repository
public interface SysMenuMapper extends IBaseMapper<SysMenu> {




    /**
     * 物理删除菜单
     * @param id
     * @return
     */
    void deleteMenu(@Param("id") Long id);  



    /**
     * 查询用户菜单列表
     *
     * @param userId 用户ID
     * @param type   菜单类型
     */
    List<SysMenu> getUserMenuList(@Param("userId") Long userId, @Param("type") Integer type);

    /**
     * 查询用户权限列表
     *
     * @param userId 用户ID
     */
    List<String> getUserAuthorityList(@Param("userId") Long userId);

    /**
     * 查询所有权限列表
     */
    List<String> getAuthorityList();

    /**
     * 查询角色权限
     *
     * @param roleId
     * @return
     */
    List<String> getRoleAuthorityList(@Param("roleId") Long roleId);
}
