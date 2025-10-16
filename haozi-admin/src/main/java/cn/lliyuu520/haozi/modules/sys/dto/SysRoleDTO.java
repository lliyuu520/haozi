package cn.lliyuu520.haozi.modules.sys.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 角色DTO
 *
 * @author lliyuu520
 */
@Data
public class SysRoleDTO implements Serializable {
    /**
     * 角色ID
     */
    private Long id;

    /**
     * 角色名称
     */
    private String name;

    /**
     * 菜单ID列表
     */
    private List<Long> menuIdList;

    /**
     * 备注
     */
    private String remark;

    /**
     * 表字段ID列表
     */
    private List<Long> tableFieldIdList;

}
