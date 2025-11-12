package cn.lliyuu520.haozi.modules.sys.vo;

import cn.hutool.core.lang.tree.Tree;
import cn.lliyuu520.haozi.common.satoken.user.SysUserCache;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * 用户Token
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
public class SysTokenVO implements Serializable {
    /**
     * token值
     */
    private String accessToken;

    /**
     * 用户缓存信息
     */
    private SysUserCache sysUserCache;

    /**
     * 菜单树
     */
    private List<Tree<Long>> menuTree;

    /**
     * 权限信息
     */
    private Set<String> permissions;
}
