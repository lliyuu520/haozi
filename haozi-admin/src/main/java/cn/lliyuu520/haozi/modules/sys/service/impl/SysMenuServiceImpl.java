package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.core.lang.tree.Tree;
import cn.hutool.core.lang.tree.TreeNode;
import cn.hutool.core.lang.tree.TreeUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.common.constant.Constant;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.satoken.user.UserDetail;
import cn.lliyuu520.haozi.modules.sys.convert.SysMenuConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysMenuDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysMenu;
import cn.lliyuu520.haozi.modules.sys.entity.SysRoleMenu;
import cn.lliyuu520.haozi.modules.sys.mapper.SysMenuMapper;
import cn.lliyuu520.haozi.modules.sys.service.SysMenuService;
import cn.lliyuu520.haozi.modules.sys.service.SysRoleMenuService;
import cn.lliyuu520.haozi.modules.sys.vo.SysMenuVO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Service
@AllArgsConstructor
public class SysMenuServiceImpl extends BaseServiceImpl<SysMenuMapper, SysMenu> implements SysMenuService {
    private final SysRoleMenuService sysRoleMenuService;

    /**
     * 保存菜单
     *
     * @param sysMenuDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(final SysMenuDTO sysMenuDTO) {
        final SysMenu entity = SysMenuConvert.INSTANCE.convertFromDTO(sysMenuDTO);

        // 保存菜单
        save(entity);
    }

    /**
     * 更新菜单
     *
     * @param sysMenuDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOne(final SysMenuDTO sysMenuDTO) {
        final SysMenu entity = SysMenuConvert.INSTANCE.convertFromDTO(sysMenuDTO);

        // 上级菜单不能为自己
        if (entity.getId().equals(entity.getParentId())) {
            throw new BaseException("上级菜单不能为自己");
        }

        // 更新菜单
        this.updateById(entity);
    }

    /**
     * 删除菜单
     *
     * @param id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOne(final Long id) {
        // 删除菜单
        baseMapper.deleteMenu(id);

        // 删除角色菜单关系
        this.sysRoleMenuService.deleteByMenuId(id);
    }

    /**
     * 菜单树
     *
     * @param type 菜单类型
     * @return
     */
    @Override
    public List<Tree<Long>> getMenuList(final Integer type) {
        final LambdaQueryWrapper<SysMenu> wrapper = Wrappers.lambdaQuery();
        if (type != null) {
            wrapper.eq(SysMenu::getType, type);
        }

        final List<SysMenu> menuList = list(wrapper);
        return getTreeList(menuList);

    }

    /**
     * 菜单树
     *
     * @param user 用户
     * @param type 菜单类型
     * @return
     */
    @Override
    public List<Tree<Long>> getUserMenuList(final UserDetail user, final Integer type) {
        final List<SysMenu> menuList;

        if (StrUtil.equals("admin", user.getUsername())) {
            return getMenuList(type);
        } else {
            menuList = baseMapper.getUserMenuList(user.getId(), type);
        }

        return getTreeList(menuList);
    }

    /**
     * 子菜单
     *
     * @param pid 父菜单ID
     * @return
     */
    @Override
    public Long getSubMenuCount(final Long pid) {
        return this.count(new LambdaQueryWrapper<SysMenu>().eq(SysMenu::getParentId, pid));
    }

    /**
     * 用户权限列表
     *
     * @param user
     * @return
     */
    @Override
    public Set<String> getUserAuthority(final UserDetail user) {
        // 系统管理员，拥有最高权限
        final List<String> authorityList;

        authorityList = this.baseMapper.getUserAuthorityList(user.getId());

        // 用户权限列表
        final Set<String> permsSet = new HashSet<>();
        for (final String authority : authorityList) {
            if (StrUtil.isBlank(authority)) {
                continue;
            }
            permsSet.addAll(Arrays.asList(authority.trim().split(",")));
        }

        return permsSet;
    }

    /**
     * 构建树形菜单
     *
     * @param menuList
     * @return
     */
    private List<Tree<Long>> getTreeList(final List<SysMenu> menuList) {
        final List<SysMenuVO> sysMenuVOList = SysMenuConvert.INSTANCE.convertList(menuList);
        final Map<Long, String> sysMenuNameMap = sysMenuVOList.stream().collect(Collectors.toMap(SysMenuVO::getId, SysMenuVO::getName));
        final List<TreeNode<Long>> treeNodeList = sysMenuVOList.stream().map(m -> {
            final Long id = m.getId();
            String name = m.getName();
            final Long parentId = m.getParentId();

            final TreeNode<Long> longTreeNode = new TreeNode<>(id, parentId, name, m.getWeight());
            final HashMap<String, Object> map = new HashMap<>();
            map.put("perms", m.getPerms());
            map.put("openStyle", m.getOpenStyle());
            map.put("type", m.getType());
            map.put("url", m.getUrl());

            if(parentId==0){
                map.put("parentName", "一级菜单");
            }else {
                map.put("parentName", sysMenuNameMap.get(parentId));
            }
            longTreeNode.setExtra(map);
            return longTreeNode;
        }).toList();

        return TreeUtil.build(treeNodeList, Constant.ROOT);
    }

    /**
     * 添加模块
     *
     * @param moduleName
     * @pa
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addModule(String moduleCode,String parentCode,String moduleName,Long parentId) {
        final SysMenu parentSysMenu = SysMenu.buildPageMenu(parentId, moduleName, parentCode+"/"+moduleCode+"/index");
        save(parentSysMenu);
        final Long id = parentSysMenu.getId();

        final SysMenu pageSysMenu = SysMenu.buildButtonMenu(id, "分页", parentCode+":"+moduleCode+":page");
//        final SysMenu saveSysMenu = SysMenu.buildButtonMenu(id, "添加", parentCode+":"+moduleCode+":save");
//        final SysMenu editSysMenu = SysMenu.buildButtonMenu(id, "编辑", parentCode+":"+moduleCode+":update,"+parentCode+":"+moduleCode+":info");
//        final SysMenu delSysMenu = SysMenu.buildButtonMenu(id, "删除", parentCode+":"+moduleCode+":delete");
        save(pageSysMenu);
//        save(saveSysMenu);
//        save(editSysMenu);
//        save(delSysMenu);
        // 保存角色菜单关系

        sysRoleMenuService.save(new SysRoleMenu(1L,id));
        sysRoleMenuService.save(new SysRoleMenu(1L,pageSysMenu.getId()));
//        sysRoleMenuService.save(new SysRoleMenu(1L,saveSysMenu.getId()));
//        sysRoleMenuService.save(new SysRoleMenu(1L,editSysMenu.getId()));
//        sysRoleMenuService.save(new SysRoleMenu(1L,delSysMenu.getId()));



    }
}
