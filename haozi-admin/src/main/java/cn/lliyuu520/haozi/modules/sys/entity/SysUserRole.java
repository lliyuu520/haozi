package cn.lliyuu520.haozi.modules.sys.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * 用户角色关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_user_role")
public class SysUserRole extends BaseEntity {

    /**
     * 角色ID
     */
    private Long roleId;
    /**
     * 用户ID
     */
    private Long userId;

}
