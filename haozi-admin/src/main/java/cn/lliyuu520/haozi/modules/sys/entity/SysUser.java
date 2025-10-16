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




}