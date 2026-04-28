package com.haozi.modules.sys.service;

import com.haozi.common.satoken.user.UserDetail;
import com.haozi.modules.auth.vo.AuthorizationVO;
import com.haozi.modules.auth.vo.CurrentUserVO;
import com.haozi.modules.sys.dto.SysAccountLoginDTO;
import com.haozi.modules.sys.vo.SysTokenVO;

/**
 * 权限认证服务
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public interface SysAuthService {

    /**
     * 账号密码登录
     *
     * @param sysAccountLoginDTO 登录信息
     */
    SysTokenVO loginByAccount(SysAccountLoginDTO sysAccountLoginDTO);

    /**
     * 获取当前登录用户上下文。
     *
     * @return 当前登录用户上下文
     */
    CurrentUserVO getCurrentUser();

    /**
     * 获取当前用户授权资源。
     *
     * @return 当前用户授权资源
     */
    AuthorizationVO getAuthorizations();

    /**
     * 获取当前已登录用户详情。
     *
     * <p>供需要按当前用户查询授权资源的业务接口复用，内部负责在会话丢失 UserDetail 时重建用户上下文。</p>
     *
     * @return 当前登录用户详情
     */
    UserDetail getRequiredUserDetail();

    /**
     * 退出登录
     */
    void logout();
}
