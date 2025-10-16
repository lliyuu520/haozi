package cn.lliyuu520.haozi.modules.sys.service;

import cn.lliyuu520.haozi.modules.sys.dto.SysAccountLoginDTO;
import cn.lliyuu520.haozi.modules.sys.vo.SysTokenVO;

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
     * 退出登录
     */
    void logout();
}
