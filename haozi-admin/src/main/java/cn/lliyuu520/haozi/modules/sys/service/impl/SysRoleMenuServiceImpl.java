package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.modules.sys.entity.SysRoleMenu;
import cn.lliyuu520.haozi.modules.sys.mapper.SysRoleMenuMapper;
import cn.lliyuu520.haozi.modules.sys.service.SysRoleMenuService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色与菜单对应关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Service
public class SysRoleMenuServiceImpl extends BaseServiceImpl<SysRoleMenuMapper, SysRoleMenu>
        implements SysRoleMenuService {

    /**
     * 保存或更新角色菜单关系
     * 
     * @param roleId 角色ID
     * @param menuIdList 菜单ID列表
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOrUpdate(Long roleId, List<Long> menuIdList) {
        // 不那么麻烦,直接删除角色全部菜单关系,然后新增
        baseMapper.deleteByRoleId(roleId);
        if (CollUtil.isNotEmpty(menuIdList)) {
            List<SysRoleMenu> menuList = menuIdList.stream().map(menuId -> {
                SysRoleMenu entity = new SysRoleMenu();
                entity.setMenuId(menuId);
                entity.setRoleId(roleId);
                return entity;
            }).collect(Collectors.toList());
            saveBatch(menuList);
        }
    }

    /**
     * 根据角色ID获取菜单ID列表
     * 
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    @Override
    public List<Long> getMenuIdList(Long roleId) {
        return baseMapper.getMenuIdList(roleId);
    }

    /**
     * 根据角色ID删除角色菜单关系
     * 
     * @param id 角色ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByRoleId(Long id) {
        // 删除指定角色的所有菜单关系
        baseMapper.deleteByRoleId(id);
    }

    /**
     * 根据菜单ID删除角色菜单关系
     * 
     * @param menuId 菜单ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByMenuId(Long menuId) {
        // 删除包含指定菜单的所有角色关系
        baseMapper.deleteByMenuId(menuId);
    }

}
