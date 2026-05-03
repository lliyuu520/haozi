package com.haozi.modules.auth.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.dev33.satoken.stp.StpUtil;
import com.haozi.common.utils.Result;
import com.haozi.modules.auth.vo.AuthorizationVO;
import com.haozi.modules.auth.vo.CurrentUserVO;
import com.haozi.modules.auth.vo.LoginResultVO;
import com.haozi.modules.sys.dto.SysAccountLoginDTO;
import com.haozi.modules.sys.service.SysAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 新版认证接口。
 *
 * <p>登录态仍由 Sa-Token 维护，前端通过 /auth/me 恢复当前用户上下文。</p>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SysAuthService sysAuthService;

    /**
     * 账号密码登录。
     *
     * @param loginDTO 登录请求
     * @return 登录结果，包含 token 和当前用户信息
     */
    @PostMapping("login")
    @SaIgnore
    public Result<LoginResultVO> login(@RequestBody final SysAccountLoginDTO loginDTO) {
        sysAuthService.loginByAccount(loginDTO);
        String token = StpUtil.getTokenValue();
        CurrentUserVO user = sysAuthService.getCurrentUser();
        return Result.ok(new LoginResultVO(token, user));
    }

    /**
     * 获取当前登录用户上下文。
     *
     * @return 当前登录用户上下文
     */
    @GetMapping("me")
    public Result<CurrentUserVO> me() {
        return Result.ok(sysAuthService.getCurrentUser());
    }

    /**
     * 获取当前用户授权资源集合。
     *
     * @return 当前用户授权资源集合
     */
    @GetMapping("authorizations")
    public Result<AuthorizationVO> authorizations() {
        return Result.ok(sysAuthService.getAuthorizations());
    }

    /**
     * 退出登录。
     *
     * @return 空响应
     */
    @PostMapping("logout")
    public Result<Void> logout() {
        sysAuthService.logout();
        return Result.ok();
    }
}
