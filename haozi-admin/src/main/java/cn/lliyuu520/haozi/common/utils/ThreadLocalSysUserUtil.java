package cn.lliyuu520.haozi.common.utils;

import cn.lliyuu520.haozi.common.satoken.user.UserDetail;
import lombok.experimental.UtilityClass;

/**
 * 用于异步线程获取用户信息
 *
 * @author liliangyu
 */
@UtilityClass
public class ThreadLocalSysUserUtil {

    private static final ThreadLocal<UserDetail> USER_DETAIL_THREAD_LOCAL = new ThreadLocal<>();

    /**
     * 获取用户信息
     *
     * @return
     */
    public UserDetail getUserInfo() {

        return USER_DETAIL_THREAD_LOCAL.get();
    }

    /**
     * 保存用户信息
     *
     * @param userDetail
     */
    public void setUserInfo(final UserDetail userDetail) {
        USER_DETAIL_THREAD_LOCAL.set(userDetail);
    }

    /**
     * 设置临时用户信息
     */
    public void setTempUserInfo() {
        final UserDetail userDetail = new UserDetail();
        USER_DETAIL_THREAD_LOCAL.set(userDetail);
    }

    /**
     * 清除用户信息
     */
    public void clearUserInfo() {
        USER_DETAIL_THREAD_LOCAL.remove();
    }


}
