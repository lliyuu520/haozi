package cn.lliyuu520.haozi.modules.sys.vo;

import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 系统用户VO类（View Object）
 * 用于用户信息的展示和传输，继承自SysUser实体类，扩展了角色ID列表属性
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUserVO extends SysUser {


    /**
     * 角色ID列表
     * 用于存储用户关联的角色ID集合
     */
    private List<Long> roleIdList;

    /**
     * 角色名称（逗号分隔）
     */
    private String roleName;


}
