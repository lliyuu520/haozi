package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class SysMenu extends BaseEntity {
    /**
     * 上级ID，一级菜单为0
     */
    private Long parentId;
    /**
     * 菜单名称
     */
    private String name;
    /**
     * 菜单URL
     */
    private String url;
    /**
     * 授权标识(多个用逗号分隔，如：sys:menu:list,sys:menu:save)
     */
    private String perms;
    /**
     * 类型   0：菜单   1：按钮   2：接口
     */
    private Integer type;
    /**
     * 打开方式   0：内部   1：外部
     */
    private Integer openStyle;

    /**
     * 排序
     */
    private Integer weight;

    /**
     * 构建页面菜单
     */
    
    public  static SysMenu buildPageMenu(Long parentId, String name, String url  ) {
        final SysMenu sysMenu = new SysMenu();
        sysMenu.setParentId(parentId);
        sysMenu.setName(name);
        sysMenu.setUrl(url);
        sysMenu.setType(0);
        sysMenu.setOpenStyle(0);
        sysMenu.setPerms("");
        return sysMenu;

    }
    /**
     * 构建按钮菜单
     */

    public static SysMenu buildButtonMenu(Long parentId, String name, String perms ) {
        final SysMenu sysMenu = new SysMenu();
        sysMenu.setParentId(parentId);
        sysMenu.setName(name);
        sysMenu.setUrl("");
        sysMenu.setType(1);
        sysMenu.setOpenStyle(0);
        sysMenu.setPerms(perms);
        return sysMenu;
        
    }

}
