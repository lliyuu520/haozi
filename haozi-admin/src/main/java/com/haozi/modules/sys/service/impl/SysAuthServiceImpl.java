package com.haozi.modules.sys.service.impl;

import cn.dev33.satoken.secure.SaSecureUtil;
import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.ArrayUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.haozi.common.exception.BaseException;
import com.haozi.common.satoken.user.UserDetail;
import com.haozi.common.utils.SysUserUtil;
import com.haozi.modules.auth.vo.AuthorizationVO;
import com.haozi.modules.auth.vo.CurrentUserVO;
import com.haozi.modules.sys.dto.SysAccountLoginDTO;
import com.haozi.modules.sys.entity.SysUser;
import com.haozi.modules.sys.service.SysAuthService;
import com.haozi.modules.sys.service.SysMenuService;
import com.haozi.modules.sys.service.SysUserRoleService;
import com.haozi.modules.sys.service.SysUserService;
import com.haozi.modules.sys.vo.SysTokenVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 权限认证服务
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Service
@AllArgsConstructor
@Slf4j
public class SysAuthServiceImpl implements SysAuthService {

    private final SysUserService sysUserService;
    private final SysUserRoleService sysUserRoleService;
    private final SysMenuService sysMenuService;
    private final Environment environment;

    /**
     * 账号密码登录
     *
     * @param sysAccountLoginDTO 登录信息
     * @return
     */
    @Override
    public SysTokenVO loginByAccount(final SysAccountLoginDTO sysAccountLoginDTO) {
        final String username = sysAccountLoginDTO.getUsername();
        final String password = sysAccountLoginDTO.getPassword();

        final LambdaQueryWrapper<SysUser> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(SysUser::getUsername, username);

        final String[] activeProfiles = environment.getActiveProfiles();
        if (ArrayUtil.contains(activeProfiles, "dev")) {
            log.info("测试环境启动,不检查密码 用户名:{},密码:{}", username, password);
        } else {
            final String shaed256 = SaSecureUtil.sha256(password);
            wrapper.eq(SysUser::getPassword, shaed256);
        }

        final SysUser sysUser = sysUserService.getOne(wrapper);
        if (sysUser == null) {
            log.error("用户名或密码错误:{},{}", username, password);
            throw new BaseException("用户名或密码错误");
        }
        final UserDetail userDetail = UserDetail.of(sysUser);
        final Long userId = userDetail.getId();
        final List<Long> roleList = sysUserRoleService.getRoleIdList(userId);
        userDetail.setRoleIdList(roleList);
        StpUtil.login(userDetail.getId());
        SysUserUtil.setUserInfo(userDetail);
        final SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
        return new SysTokenVO(tokenInfo.getTokenValue());
    }

    /**
     * 获取当前登录用户上下文。
     *
     * <p>React 前端启动、刷新和登录成功后都依赖该方法恢复用户身份、可访问路由和按钮权限。</p>
     *
     * @return 当前登录用户上下文
     */
    @Override
    public CurrentUserVO getCurrentUser() {
        final UserDetail user = getRequiredUserDetail();
        final AuthorizationVO authorizations = getAuthorizations(user);
        return new CurrentUserVO(
                user.getId(),
                user.getUsername(),
                user.getUsername(),
                null,
                user.getRoleIdList().stream().map(String::valueOf).toList(),
                authorizations.routeCodes(),
                authorizations.permissions()
        );
    }

    /**
     * 获取当前用户授权资源。
     *
     * @return 当前用户授权资源
     */
    @Override
    public AuthorizationVO getAuthorizations() {
        return getAuthorizations(getRequiredUserDetail());
    }

    /**
     * 退出登录
     */
    @Override
    public void logout() {
        SysUserUtil.logout(SysUserUtil.getUserInfo().getId());

    }

    /**
     * 根据当前 Sa-Token 会话获取用户信息。
     *
     * <p>如果 session 中缺失 UserDetail，则根据登录 ID 从数据库重建一份，
     * 以保证服务重启或会话恢复场景下 /auth/me 仍能返回完整上下文。</p>
     *
     * @return 当前登录用户
     */
    @Override
    public UserDetail getRequiredUserDetail() {
        StpUtil.checkLogin();
        UserDetail user = SysUserUtil.getUserInfo();
        if (user != null && user.getId() != null) {
            return user;
        }

        final Long userId = Long.valueOf(String.valueOf(StpUtil.getLoginId()));
        final SysUser sysUser = sysUserService.getById(userId);
        if (sysUser == null) {
            throw new BaseException(401, "登录用户不存在");
        }
        user = UserDetail.of(sysUser);
        user.setRoleIdList(sysUserRoleService.getRoleIdList(userId));
        SysUserUtil.setUserInfo(user);
        return user;
    }

    /**
     * 根据指定用户组装授权资源。
     *
     * @param user 用户
     * @return 授权资源
     */
    private AuthorizationVO getAuthorizations(final UserDetail user) {
        return new AuthorizationVO(
                sysMenuService.getUserRouteCodes(user),
                sysMenuService.getPermissionCodes(user)
        );
    }
}
