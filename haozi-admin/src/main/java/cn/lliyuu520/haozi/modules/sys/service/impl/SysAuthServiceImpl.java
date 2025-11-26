package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.dev33.satoken.secure.SaSecureUtil;
import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.lang.tree.Tree;
import cn.lliyuu520.haozi.common.enums.MenuTypeEnum;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.satoken.user.SysUserCache;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.dto.SysAccountLoginDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import cn.lliyuu520.haozi.modules.sys.service.SysAuthService;
import cn.lliyuu520.haozi.modules.sys.service.SysMenuService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserRoleService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserService;
import cn.lliyuu520.haozi.modules.sys.vo.SysTokenVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

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
    private final SysMenuService sysMenuService;

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
        final String shaed256 = SaSecureUtil.sha256(password);
        wrapper.eq(SysUser::getPassword, shaed256);


        final SysUser sysUser = sysUserService.getOne(wrapper);
        if (sysUser == null) {
            log.error("用户名或密码错误:{},{}", username, password);
            throw new BaseException("用户名或密码错误");
        }
        final SysUserCache sysUserCache = SysUserCache.of(sysUser);
        final Long userId = sysUserCache.getId();
        final List<Long> roleList = sysUserRoleService.getRoleIdList(userId);
        sysUserCache.setRoleIdList(roleList);
        StpUtil.login(sysUserCache.getId());
        SysUserUtil.setUserInfo(sysUserCache);
        final SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
        final String tokenValue = tokenInfo.getTokenValue();
        // 菜单
        final List<Tree<Long>> list = sysMenuService.getUserMenuList(sysUserCache, MenuTypeEnum.MENU.getValue());
// 权限
        final Set<String> set = this.sysMenuService.getUserAuthority(sysUserCache);

        final SysTokenVO sysTokenVO = new SysTokenVO();
        sysTokenVO.setAccessToken(tokenValue);
        sysTokenVO.setSysUserCache(sysUserCache);
        sysTokenVO.setMenuTree(list);
        sysTokenVO.setPermissions(set);

        return sysTokenVO;
    }

    /**
     * 退出登录
     */
    @Override
    public void logout() {
        SysUserUtil.logout(SysUserUtil.getUserInfo().getId());

    }
}
