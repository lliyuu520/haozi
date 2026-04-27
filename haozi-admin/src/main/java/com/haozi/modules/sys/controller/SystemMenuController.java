package com.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.lang.tree.Tree;
import cn.hutool.core.util.StrUtil;
import com.haozi.common.constant.Constant;
import com.haozi.common.exception.BaseException;
import com.haozi.modules.sys.dto.SysMenuDTO;
import com.haozi.modules.sys.entity.SysMenu;
import com.haozi.modules.sys.service.SysMenuService;
import com.haozi.modules.sys.vo.MenuResourceVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * React 菜单资源接口。
 *
 * <p>该控制器面向新 React 前端，直接返回业务数据和 HTTP 状态码。
 * 旧 Vue 版本继续使用 /sys/menu，迁移期间两套入口互不影响。</p>
 */
@RestController
@RequestMapping("/system/menus")
@RequiredArgsConstructor
public class SystemMenuController {

    private final SysMenuService sysMenuService;

    /**
     * 查询菜单资源树。
     *
     * @param type 资源类型，空值表示全部
     * @return 菜单资源树
     */
    @GetMapping
    @SaCheckPermission("sys:menu:page")
    public List<MenuResourceVO> list(@RequestParam(required = false) final Integer type) {
        return sysMenuService.getMenuList(type).stream()
                .map(this::toMenuResource)
                .toList();
    }

    /**
     * 查询菜单资源详情。
     *
     * @param id 菜单 ID
     * @return 菜单资源详情
     */
    @GetMapping("{id}")
    @SaCheckPermission("sys:menu:info")
    public MenuResourceVO get(@PathVariable("id") final Long id) {
        final SysMenu entity = sysMenuService.getById(id);
        if (entity == null) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), "菜单资源不存在");
        }
        return toMenuResource(entity);
    }

    /**
     * 新增菜单资源。
     *
     * @param dto 菜单资源表单
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SaCheckPermission("sys:menu:save")
    public void create(@RequestBody final SysMenuDTO dto) {
        normalize(dto);
        sysMenuService.saveOne(dto);
    }

    /**
     * 更新菜单资源。
     *
     * @param id 菜单 ID
     * @param dto 菜单资源表单
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:menu:update")
    public void update(@PathVariable("id") final Long id, @RequestBody final SysMenuDTO dto) {
        dto.setId(id);
        normalize(dto);
        sysMenuService.updateOne(dto);
    }

    /**
     * 删除菜单资源。
     *
     * @param id 菜单 ID
     */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:menu:delete")
    public void delete(@PathVariable("id") final Long id) {
        final Long count = sysMenuService.getSubMenuCount(id);
        if (count > 0) {
            throw new BaseException(HttpStatus.CONFLICT.value(), "请先删除子菜单");
        }
        sysMenuService.deleteOne(id);
    }

    /**
     * 规范化菜单资源表单默认值。
     *
     * @param dto 菜单资源表单
     */
    private void normalize(final SysMenuDTO dto) {
        if (dto.getParentId() == null) {
            dto.setParentId(Constant.ROOT);
        }
        if (dto.getType() == null) {
            dto.setType(0);
        }
        if (dto.getOpenStyle() == null) {
            dto.setOpenStyle(0);
        }
        if (dto.getWeight() == null) {
            dto.setWeight(0);
        }
        if (dto.getUrl() == null) {
            dto.setUrl("");
        }
        if (dto.getPerms() == null) {
            dto.setPerms("");
        }
    }

    /**
     * 将旧实体转换为 React 菜单资源记录。
     *
     * @param entity 菜单实体
     * @return 菜单资源记录
     */
    private MenuResourceVO toMenuResource(final SysMenu entity) {
        return new MenuResourceVO(
                entity.getId(),
                entity.getParentId(),
                resolveParentName(entity.getParentId()),
                entity.getName(),
                entity.getType(),
                entity.getUrl(),
                entity.getPerms(),
                entity.getOpenStyle(),
                entity.getWeight(),
                Collections.emptyList()
        );
    }

    /**
     * 将 Hutool Tree 转换为固定的 React 菜单资源记录。
     *
     * @param tree 旧菜单树节点
     * @return 菜单资源记录
     */
    private MenuResourceVO toMenuResource(final Tree<Long> tree) {
        final List<MenuResourceVO> children = tree.getChildren() == null
                ? Collections.emptyList()
                : tree.getChildren().stream().map(this::toMenuResource).toList();
        return new MenuResourceVO(
                tree.getId(),
                tree.getParentId(),
                Objects.toString(tree.get("parentName"), "一级菜单"),
                Objects.toString(tree.getName(), ""),
                toInteger(tree.get("type")),
                Objects.toString(tree.get("url"), ""),
                Objects.toString(tree.get("perms"), ""),
                toInteger(tree.get("openStyle")),
                toInteger(tree.getWeight()),
                children
        );
    }

    /**
     * 查询父菜单名称。
     *
     * @param parentId 父菜单 ID
     * @return 父菜单名称
     */
    private String resolveParentName(final Long parentId) {
        if (parentId == null || Constant.ROOT.equals(parentId)) {
            return "一级菜单";
        }
        final SysMenu parent = sysMenuService.getById(parentId);
        return parent == null ? "一级菜单" : parent.getName();
    }

    /**
     * 将 Tree 扩展字段转换为整数。
     *
     * @param value 扩展字段值
     * @return 整数值
     */
    private Integer toInteger(final Object value) {
        if (value == null || StrUtil.isBlank(value.toString())) {
            return null;
        }
        return Integer.valueOf(value.toString());
    }
}
