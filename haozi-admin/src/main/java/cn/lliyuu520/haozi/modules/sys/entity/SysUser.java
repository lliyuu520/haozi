package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统用户实体类
 * 用于表示系统中的用户信息，包括用户名和密码等基本信息
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysUser extends BaseEntity {
    /**
     * 用户名
     * 用于用户登录系统的唯一标识符
     */
    private String username;
    /**
     * 密码
     * 用户登录系统的密码，经过加密存储
     */
    private String password;

    /**
     * 昵称，用于展示友好名称
     */
    private String nickname;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 头像地址
     */
    private String avatar;

    /**
     * 用户状态 0-启用 1-禁用 2-锁定
     */
    private Integer status;




}
