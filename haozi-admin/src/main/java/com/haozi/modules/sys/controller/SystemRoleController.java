package com.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.lang.tree.Tree;
import com.haozi.common.base.page.PageVO;
import com.haozi.common.exception.BaseException;
import com.haozi.common.model.PageResult;
import com.haozi.common.utils.Result;
import com.haozi.modules.sys.convert.SysRoleConvert;
import com.haozi.modules.sys.dto.SysRoleDTO;
import com.haozi.modules.sys.entity.SysRole;
import com.haozi.modules.sys.query.SysRoleQuery;
import com.haozi.modules.sys.service.SysMenuService;
import com.haozi.modules.sys.service.SysRoleMenuService;
import com.haozi.modules.sys.service.SysRoleService;
import com.haozi.modules.sys.vo.MenuTreeNodeVO;
import com.haozi.modules.sys.vo.RoleRecordVO;
import com.haozi.modules.sys.vo.SysRoleVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

/**
 * React 角色管理接口。
 */
@RestController
@RequestMapping("/system/roles")
@RequiredArgsConstructor
public class SystemRoleController {

    private final SysRoleService sysRoleService;
    private final SysRoleMenuService sysRoleMenuService;
    private final SysMenuService sysMenuService;

    /**
     * 分页查询角色列表。
     *
     * @param name 角色名称模糊查询
     * @param page 当前页码
     * @param pageSize 每页数量
     * @return 角色分页数据
     */
    @GetMapping
    @SaCheckPermission("sys:role:page")
    public Result<PageResult<RoleRecordVO>> page(
            @RequestParam(required = false) final String name,
            @RequestParam(defaultValue = "1") final Integer page,
            @RequestParam(defaultValue = "10") final Integer pageSize
    ) {
        final SysRoleQuery query = new SysRoleQuery();
        query.setName(name);
        query.setPage(page);
        query.setLimit(pageSize);
        final PageVO<SysRoleVO> result = sysRoleService.page(query);
        final List<RoleRecordVO> items = result.getList().stream()
                .map(role -> new RoleRecordVO(role.getId(), role.getName(), List.of()))
                .toList();
        return Result.ok(new PageResult<>(items, result.getTotal(), page, pageSize));
    }

    /**
     * 查询角色详情。
     *
     * @param id 角色 ID
     * @return 角色详情
     */
    @GetMapping("{id}")
    @SaCheckPermission("sys:role:info")
    public Result<RoleRecordVO> get(
            @PathVariable("id") final Long id
    ) {
        final SysRole entity = sysRoleService.getById(id);
        if (entity == null) {
            throw new BaseException(404, "角色不存在");
        }
        final SysRoleVO vo = SysRoleConvert.INSTANCE.convertTOVO(entity);
        return Result.ok(new RoleRecordVO(vo.getId(), vo.getName(), sysRoleMenuService.getMenuIdList(id)));
    }

    /**
     * 查询菜单权限树。
     *
     * @return 菜单权限树
     */
    @GetMapping("menu-tree")
    @SaCheckPermission("sys:role:page")
    public Result<List<MenuTreeNodeVO>> menuTree() {
        return Result.ok(sysMenuService.getMenuList(null).stream()
                .map(this::toMenuTreeNode)
                .toList());
    }

    /**
     * 新增角色。
     *
     * @param dto 角色表单
     * @return 空响应
     */
    @PostMapping
    @SaCheckPermission("sys:role:save")
    public Result<Void> create(@RequestBody final SysRoleDTO dto) {
        sysRoleService.save(dto);
        return Result.ok();
    }

    /**
     * 更新角色。
     *
     * @param id 角色 ID
     * @param dto 角色表单
     * @return 空响应
     */
    @PutMapping("{id}")
    @SaCheckPermission("sys:role:update")
    public Result<Void> update(@PathVariable("id") final Long id,
                               @RequestBody final SysRoleDTO dto) {
        dto.setId(id);
        sysRoleService.update(dto);
        return Result.ok();
    }

    /**
     * 删除角色。
     *
     * @param id 角色 ID
     * @return 空响应
     */
    @DeleteMapping("{id}")
    @SaCheckPermission("sys:role:delete")
    public Result<Void> delete(@PathVariable("id") final Long id) {
        sysRoleService.deleteOne(id);
        return Result.ok();
    }

    /**
     * 将 Hutool Tree 转换为稳定的 React 菜单树节点。
     *
     * @param tree Hutool 菜单树
     * @return React 菜单树节点
     */
    private MenuTreeNodeVO toMenuTreeNode(final Tree<Long> tree) {
        final List<MenuTreeNodeVO> children = tree.getChildren() == null
                ? Collections.emptyList()
                : tree.getChildren().stream().map(this::toMenuTreeNode).toList();
        return new MenuTreeNodeVO(tree.getId(), tree.getName().toString(), children);
    }
}
