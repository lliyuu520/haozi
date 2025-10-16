package cn.lliyuu520.haozi.modules.sys.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 角色管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
public class SysRoleVO implements Serializable {

    private Long id;

    private String name;

    private String remarks;


    private List<Long> menuIdList;


}
