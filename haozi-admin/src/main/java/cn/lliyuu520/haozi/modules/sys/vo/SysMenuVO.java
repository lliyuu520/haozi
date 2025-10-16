package cn.lliyuu520.haozi.modules.sys.vo;

import cn.lliyuu520.haozi.modules.sys.entity.SysMenu;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysMenuVO extends SysMenu {
    
    /**
     * 父级名称
     */
    private String parentName;
   
}
