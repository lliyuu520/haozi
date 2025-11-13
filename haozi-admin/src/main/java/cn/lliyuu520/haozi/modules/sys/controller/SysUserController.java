package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.util.ObjUtil;
import cn.hutool.core.util.StrUtil;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.satoken.user.SysUserCache;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.convert.SysUserConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysUserDTO;
import cn.lliyuu520.haozi.modules.sys.dto.SysUserPasswordDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import cn.lliyuu520.haozi.modules.sys.query.SysUserQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysMenuService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserRoleService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserService;
import cn.lliyuu520.haozi.modules.sys.vo.SysUserVO;
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
    private final SysMenuService sysMenuService;

    /**
     * 分页查询用户列表
     *
     * @param query
     * @return
     */
    @GetMapping("/page")
    @SaCheckPermission("sys:user:page")
    public Result<PageVO<SysUserVO>> page(final SysUserQuery query) {
        final PageVO<SysUserVO> page = this.sysUserService.page(query);
        return Result.ok(page);
    }

    /**
     * 详情
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    @SaCheckPermission("sys:user:info")
    public Result<SysUserVO> get(@PathVariable final Long id) {
        final SysUser entity = this.sysUserService.getById(id);
        final SysUserVO vo = SysUserConvert.INSTANCE.convertToVO(entity);
        // 用户角色列表
        final List<Long> roleIdList = this.sysUserRoleService.getRoleIdList(id);
        vo.setRoleIdList(roleIdList);
        return Result.ok(vo);
    }

    /**
     * 当前用户详情
     *
     * @return
     */
    @GetMapping("/info")
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
        final SysUserCache user = SysUserUtil.getUserInfo();
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
    @DeleteMapping("/{id}")
    @SaCheckPermission("sys:user:delete")
    public Result<String> delete(@PathVariable("id") final Long id) {
        final Long userId = SysUserUtil.getUserInfo().getId();
        if (ObjUtil.equal(userId, id)) {
            throw new BaseException("不能删除当前用户");
        }
        sysUserService.deleteOne(id);
        return Result.ok();
    }
}
