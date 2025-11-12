package cn.lliyuu520.haozi.common.utils;

import cn.lliyuu520.haozi.common.satoken.user.SysUserCache;
import lombok.experimental.UtilityClass;

/**
 * 用于异步线程获取用户信息
 *
 * @author liliangyu
 */
@UtilityClass
public class ThreadLocalSysUserUtil {

    private static final ThreadLocal<SysUserCache> USER_DETAIL_THREAD_LOCAL = new ThreadLocal<>();

    /**
     * 获取用户信息
     *
     * @return
     */
    public SysUserCache getUserInfo() {

        return USER_DETAIL_THREAD_LOCAL.get();
    }

    /**
     * 保存用户信息
     *
     * @param sysUserCache
     */
    public void setUserInfo(final SysUserCache sysUserCache) {
        USER_DETAIL_THREAD_LOCAL.set(sysUserCache);
    }

    /**
     * 设置临时用户信息
     */
    public void setTempUserInfo() {
        final SysUserCache sysUserCache = new SysUserCache();
        USER_DETAIL_THREAD_LOCAL.set(sysUserCache);
    }

    /**
     * 清除用户信息
     */
    public void clearUserInfo() {
        USER_DETAIL_THREAD_LOCAL.remove();
    }


}
