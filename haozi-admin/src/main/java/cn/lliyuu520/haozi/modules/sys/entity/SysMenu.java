package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;


/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@TableName(autoResultMap = true)
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
     * 图标
     */
    private String icon;
    /**
     * 是否隐藏
     */
    private Boolean hidden;
    /**
     *  元数据
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private Meta meta =new Meta();

    /**
     * 元数据
     */
    @Data
    public static class Meta implements Serializable {
        /**
         * 是否使用deeplink
         */
        private Boolean deeplink;
        /**
         * 是否缓存
         */
        private Boolean keepAlive;
        /**
         * 模态框
         */
        private Modal modal;


    }

    /**
     * 模态框
     */
    @Data
    public static class Modal implements Serializable {

        private String present;

        private Integer width;

    }


}
