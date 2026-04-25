package com.mgm.hncsbj.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.util.ObjUtil;
import cn.hutool.core.util.StrUtil;
import com.mgm.hncsbj.common.base.page.PageVO;
import com.mgm.hncsbj.common.exception.BaseException;
import com.mgm.hncsbj.common.satoken.user.UserDetail;
import com.mgm.hncsbj.common.utils.Result;
import com.mgm.hncsbj.common.utils.SysUserUtil;
import com.mgm.hncsbj.modules.sys.convert.SysUserConvert;
import com.mgm.hncsbj.modules.sys.dto.SysUserDTO;
import com.mgm.hncsbj.modules.sys.dto.SysUserPasswordDTO;
import com.mgm.hncsbj.modules.sys.entity.SysUser;
import com.mgm.hncsbj.modules.sys.query.SysUserQuery;
import com.mgm.hncsbj.modules.sys.service.SysUserRoleService;
import com.mgm.hncsbj.modules.sys.service.SysUserService;
import com.mgm.hncsbj.modules.sys.vo.SysUserVO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@RestController
@RequestMapping("/sys/user")
@AllArgsConstructor
public class SysUserController {
    private final SysUserService sysUserService;
    private final SysUserRoleService sysUserRoleService;

    /**
     * 分页查询用户列表
     *
     * @param query
     * @return
     */
    @GetMapping("page")
    @SaCheckPermission("sys:user:page")
    public Result<PageVO<SysUserVO>> page(final SysUserQuery query) {
        final PageVO<SysUserVO> page = this.sysUserService.page(query);
        return Result.ok(page);
    }

    /**
     * 获取用户信息
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    @SaCheckPermission("sys:user:info")
    public Result<SysUserVO> get(@PathVariable("id") final Long id) {
        final SysUser entity = this.sysUserService.getById(id);
        final SysUserVO vo = SysUserConvert.INSTANCE.convertToVO(entity);
        // 用户角色列表
        final List<Long> roleIdList = this.sysUserRoleService.getRoleIdList(id);
        vo.setRoleIdList(roleIdList);
        return Result.ok(vo);
    }

    /**
     * 详情
     *
     * @return
     */
    @GetMapping("info")
    public Result<SysUserVO> info() {
        final Long id = SysUserUtil.getUserInfo().getId();
        final SysUser entity = this.sysUserService.getById(id);
        final SysUserVO vo = SysUserConvert.INSTANCE.convertToVO(entity);
        // 用户角色列表
        final List<Long> roleIdList = this.sysUserRoleService.getRoleIdList(id);
        vo.setRoleIdList(roleIdList);
        return Result.ok(vo);
    }

    /**
     * 修改密码
     *
     * @param sysUserPasswordDTO
     * @return
     */
    @PutMapping("/password")
    public Result<String> password(@RequestBody final SysUserPasswordDTO sysUserPasswordDTO) {
        final UserDetail user = SysUserUtil.getUserInfo();
        sysUserPasswordDTO.setId(user.getId());
        // 修改密码
        this.sysUserService.updatePassword(sysUserPasswordDTO);
        return Result.ok();
    }

    /**
     * 修改他人密码
     */
    @PutMapping("/updatePassword")
    @SaCheckPermission("sys:user:update")
    public Result<String> resetPassword(@RequestBody final SysUserPasswordDTO sysUserPasswordDTO) {

        this.sysUserService.updatePassword(sysUserPasswordDTO);
        return Result.ok();
    }

    /**
     * 新增
     *
     * @param sysUserDTO
     * @return
     */
    @PostMapping
    @SaCheckPermission("sys:user:save")
    public Result<String> save(@RequestBody final SysUserDTO sysUserDTO) {
        // 保存
        this.sysUserService.saveOne(sysUserDTO);
        return Result.ok();
    }

    /**
     * 编辑
     *
     * @param sysUserDTO
     * @return
     */
    @PutMapping
    @SaCheckPermission("sys:user:update")
    public Result<String> update(@RequestBody final SysUserDTO sysUserDTO) {
        // 如果密码不为空，则进行加密处理
        if (StrUtil.isBlank(sysUserDTO.getPassword())) {
            sysUserDTO.setPassword(null);
        } else {
            sysUserDTO.setPassword(sysUserDTO.getPassword());
        }
        this.sysUserService.updateOne(sysUserDTO);
        return Result.ok();
    }

    /**
     * 删除用户
     *
     * @param id
     * @return
     */
    @DeleteMapping
    @SaCheckPermission("sys:user:delete")
    public Result<String> delete(final Long id) {
        final Long userId = SysUserUtil.getUserInfo().getId();
        if (ObjUtil.equal(userId, id)) {
            throw new BaseException("不能删除当前用户");
        }
        sysUserService.deleteOne(id);
        return Result.ok();
    }
}
