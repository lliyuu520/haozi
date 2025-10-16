package cn.lliyuu520.haozi.modules.sys.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 账号登录
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SysAccountLoginDTO implements Serializable {

    
    /**用户名
     *  */
    private String username;

    /** 密码 */
    private String password;

}
