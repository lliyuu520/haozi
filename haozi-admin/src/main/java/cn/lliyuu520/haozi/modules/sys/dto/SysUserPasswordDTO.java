package cn.lliyuu520.haozi.modules.sys.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 用户修改密码
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
public class SysUserPasswordDTO implements Serializable {

    /**
     * 用户ID
     */
    private Long id;
    /**
     * 新密码
     */
    private String newPassword;

}
