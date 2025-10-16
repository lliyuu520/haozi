package cn.lliyuu520.haozi.common.satoken.config;

import cn.dev33.satoken.stp.StpInterface;
import cn.lliyuu520.haozi.modules.sys.service.SysRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * 使用缓存会不会好点?
 *
 * @author liliangyu
 */
@Configuration
@RequiredArgsConstructor
public class StpInterfaceImpl implements StpInterface {


    private final SysRoleService sysRoleService;

    /**
     * @param loginId
     * @param loginType
     * @return
     */
    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {

        return sysRoleService.getPermission();
    }

    /**
     * 获取角色列表
     *
     * @param loginId
     * @param loginType
     * @return
     */
    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        return new ArrayList<>();
    }
}
