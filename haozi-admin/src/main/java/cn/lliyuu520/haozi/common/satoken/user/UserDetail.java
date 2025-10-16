package cn.lliyuu520.haozi.common.satoken.user;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 登录用户信息
 *
 * @author lliyuu520
 */
@Data
@NoArgsConstructor
@Accessors(chain = true)
public class UserDetail implements Serializable {

    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    /**
     * 用户名
     */
    private String username;

    private List<Long> roleIdList;

    private List<Long> roleNameList;

    /**
     * 快速创建 UserDetail
     *
     * @param sysUser
     * @return
     */
    public static UserDetail of(final SysUser sysUser) {
        final UserDetail userDetail = new UserDetail();
        userDetail.setId(sysUser.getId());
        userDetail.setUsername(sysUser.getUsername());
        userDetail.setRoleIdList(new ArrayList<>());    
        userDetail.setRoleNameList(new ArrayList<>());
        return userDetail;

    }


}
