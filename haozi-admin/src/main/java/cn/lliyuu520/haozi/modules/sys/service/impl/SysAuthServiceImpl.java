package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.dev33.satoken.secure.SaSecureUtil;
import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.ArrayUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.satoken.user.UserDetail;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.dto.SysAccountLoginDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import cn.lliyuu520.haozi.modules.sys.service.SysAuthService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserRoleService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserService;
import cn.lliyuu520.haozi.modules.sys.vo.SysTokenVO;
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
     * 退出登录
     */
    @Override
    public void logout() {
        SysUserUtil.logout(SysUserUtil.getUserInfo().getId());

    }
}
