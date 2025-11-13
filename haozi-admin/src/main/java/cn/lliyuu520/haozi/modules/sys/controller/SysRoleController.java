package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.lang.tree.Tree;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.satoken.user.SysUserCache;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.convert.SysRoleConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysRoleDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysRole;
import cn.lliyuu520.haozi.modules.sys.query.SysRoleQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysMenuService;
import cn.lliyuu520.haozi.modules.sys.service.SysRoleMenuService;
import cn.lliyuu520.haozi.modules.sys.service.SysRoleService;
import cn.lliyuu520.haozi.modules.sys.vo.SysRoleVO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@RestController
@RequestMapping("/sys/role")
@AllArgsConstructor
public class SysRoleController {
    private final SysRoleService sysRoleService;
    private final SysRoleMenuService sysRoleMenuService;
    private final SysMenuService sysMenuService;

    /**
     * 角色分页查询
     *
     * @param query 角色查询条件，包含分页参数和角色筛选条件
     * @return 返回分页后的角色列表数据
     */
    @GetMapping("/page")
//    @SaCheckPermission("sys:role:page")
    public Result<PageVO<SysRoleVO>> page(final SysRoleQuery query) {
        final PageVO<SysRoleVO> page = sysRoleService.page(query);

        return Result.ok(page);
    }

    /**
     * 获取角色列表
     *
     * @return 返回所有角色列表数据
     */
    @GetMapping("/list")
    public Result<List<SysRoleVO>> list() {
        final List<SysRoleVO> list = sysRoleService.getList(new SysRoleQuery());

        return Result.ok(list);
    }

    /**
     * 根据ID获取角色详情
     *
     * @param id 角色ID
     * @return 返回角色详细信息，包含角色基本信息和关联的菜单ID列表
     */
    @GetMapping("/{id}")
//    @SaCheckPermission("sys:role:info")
    public Result<SysRoleVO> get(@PathVariable final Long id) {
        final SysRole entity = sysRoleService.getById(id);

        // 转换对象
        final SysRoleVO role = SysRoleConvert.INSTANCE.convertTOVO(entity);

        // 查询角色对应的菜单
        final List<Long> menuIdList = sysRoleMenuService.getMenuIdList(id);
        role.setMenuIdList(menuIdList);

        return Result.ok(role);
    }

    /**
     * 新增角色
     *
     * @param dto 角色信息，包含角色基本信息和关联的菜单ID列表
     * @return 返回操作结果
     */
    @PostMapping
//    @SaCheckPermission("sys:role:save")
    public Result<String> save(@RequestBody final SysRoleDTO dto) {
        sysRoleService.save(dto);

        return Result.ok();
    }

    /**
     * 修改角色
     *
     * @param dto 角色信息，包含角色基本信息和关联的菜单ID列表
     * @return 返回操作结果
     */
    @PutMapping
//    @SaCheckPermission("sys:role:update")
    public Result<String> update(@RequestBody final SysRoleDTO dto) {
        sysRoleService.update(dto);

        return Result.ok();
    }

    /**
     * 删除角色
     *
     * @param id 角色ID
     * @return 返回操作结果
     */
    @DeleteMapping
//    @SaCheckPermission("sys:role:delete")
    public Result<String> delete(@PathVariable final Long id) {
        sysRoleService.deleteOne(id);

        return Result.ok();
    }

    /**
     * 获取当前用户的菜单树
     *
     * @return 返回当前用户有权限访问的菜单树结构
     */
    @GetMapping("/menu")
    public Result<List<Tree<Long>>> menu() {
        final SysUserCache user = SysUserUtil.getUserInfo();
        final List<Tree<Long>> list = sysMenuService.getUserMenuList(user, null);

        return Result.ok(list);
    }







}
