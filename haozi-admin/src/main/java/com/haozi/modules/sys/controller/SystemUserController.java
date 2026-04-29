package com.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.util.ObjUtil;
import com.haozi.common.base.page.PageVO;
import com.haozi.common.exception.BaseException;
import com.haozi.common.model.PageResult;
import com.haozi.common.utils.Result;
import com.haozi.common.utils.SysUserUtil;
import com.haozi.modules.sys.convert.SysUserConvert;
import com.haozi.modules.sys.dto.SysUserDTO;
import com.haozi.modules.sys.dto.SysUserPasswordDTO;
import com.haozi.modules.sys.entity.SysUser;
import com.haozi.modules.sys.query.SysRoleQuery;
import com.haozi.modules.sys.query.SysUserQuery;
import com.haozi.modules.sys.service.SysRoleService;
import com.haozi.modules.sys.service.SysUserRoleService;
import com.haozi.modules.sys.service.SysUserService;
import com.haozi.modules.sys.vo.RoleOptionVO;
import com.haozi.modules.sys.vo.SysRoleVO;
import com.haozi.modules.sys.vo.SysUserVO;
import com.haozi.modules.sys.vo.UserRecordVO;
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

import java.util.List;

/**
 * React 用户管理接口。
 */
@RestController
@RequestMapping("/system/users")
@RequiredArgsConstructor
public class SystemUserController {

    private final SysUserService sysUserService;
    private final SysUserRoleService sysUserRoleService;
    private final SysRoleService sysRoleService;

    /**
     * 分页查询用户列表。
     *
     * @param username 用户名模糊查询
     * @param page 当前页码
     * @param pageSize 每页数量
     * @return 用户分页数据
     */
    @GetMapping
    @SaCheckPermission("sys:user:page")
    public Result<PageResult<UserRecordVO>> page(
            @RequestParam(required = false) final String username,
            @RequestParam(defaultValue = "1") final Integer page,
            @RequestParam(defaultValue = "10") final Integer pageSize
    ) {
        final SysUserQuery query = new SysUserQuery();
        query.setUsername(username);
        query.setPage(page);
        query.setLimit(pageSize);
        final PageVO<SysUserVO> result = sysUserService.page(query);
        final List<UserRecordVO> items = result.getList().stream()
                .map(this::toUserRecord)
                .toList();
        return Result.ok(new PageResult<>(items, result.getTotal(), page, pageSize));
    }

    /**
     * 获取用户详情。
     *
     * @param id 用户 ID
     * @return 用户详情
     */
    @GetMapping("{id}")
    @SaCheckPermission("sys:user:info")
    public Result<UserRecordVO> get(
            @PathVariable("id") final Long id
    ) {
        final SysUser entity = sysUserService.getById(id);
        if (entity == null) {
            throw new BaseException(404, "用户不存在");
        }
        final SysUserVO vo = SysUserConvert.INSTANCE.convertToVO(entity);
        vo.setRoleIdList(sysUserRoleService.getRoleIdList(id));
        return Result.ok(toUserRecord(vo));
    }

    /**
     * 获取角色下拉选项列表。
     *
     * @return 角色选项列表
     */
    @GetMapping("role-options")
    @SaCheckPermission("sys:user:page")
    public Result<List<RoleOptionVO>> roleOptions() {
        return Result.ok(sysRoleService.getList(new SysRoleQuery()).stream()
                .map(this::toRoleOption)
                .toList());
    }

    /**
     * 新增用户。
     *
     * @param dto 用户表单
     * @return 空响应
     */
    @PostMapping
    @SaCheckPermission("sys:user:save")
    public Result<Void> create(@RequestBody final SysUserDTO dto) {
        sysUserService.saveOne(dto);
        return Result.ok();
    }

    /**
     * 更新用户。
     *
     * @param id 用户 ID
     * @param dto 用户表单
     * @return 空响应
     */
    @PutMapping("{id}")
    @SaCheckPermission("sys:user:update")
    public Result<Void> update(@PathVariable("id") final Long id,
                               @RequestBody final SysUserDTO dto) {
        dto.setId(id);
        sysUserService.updateOne(dto);
        return Result.ok();
    }

    /**
     * 修改用户密码。
     *
     * @param id 用户 ID
     * @param dto 密码表单
     * @return 空响应
     */
    @PutMapping("{id}/password")
    @SaCheckPermission("sys:user:update")
    public Result<Void> updatePassword(
            @PathVariable("id") final Long id,
            @RequestBody final SysUserPasswordDTO dto
    ) {
        dto.setId(id);
        sysUserService.updatePassword(dto);
        return Result.ok();
    }

    /**
     * 删除用户。
     *
     * @param id 用户 ID
     * @return 空响应
     */
    @DeleteMapping("{id}")
    @SaCheckPermission("sys:user:delete")
    public Result<Void> delete(@PathVariable("id") final Long id) {
        final Long currentUserId = SysUserUtil.getUserInfo().getId();
        if (ObjUtil.equal(currentUserId, id)) {
            throw new BaseException("不能删除当前用户");
        }
        sysUserService.deleteOne(id);
        return Result.ok();
    }

    /**
     * 转换用户管理记录，避免向前端输出密码字段。
     *
     * @param vo 旧用户 VO
     * @return React 用户管理记录
     */
    private UserRecordVO toUserRecord(final SysUserVO vo) {
        return new UserRecordVO(vo.getId(), vo.getUsername(), vo.getRoleIdList());
    }

    /**
     * 转换角色选项。
     *
     * @param vo 角色 VO
     * @return 角色下拉选项
     */
    private RoleOptionVO toRoleOption(final SysRoleVO vo) {
        return new RoleOptionVO(vo.getId(), vo.getName());
    }
}
