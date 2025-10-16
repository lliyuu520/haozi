package cn.lliyuu520.haozi.modules.sys.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * 角色菜单关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_role_menu")
@NoArgsConstructor
@AllArgsConstructor
public class SysRoleMenu extends BaseEntity {
    /**
     * 角色ID
     */
    private Long roleId;
    /**
     * 菜单ID
     */
    private Long menuId;

}
