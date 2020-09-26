package com.lliyuu520.root.modular.system.dto;

import lombok.Data;

/**
 * 用户DTO
 *
 * @author liliangyu
 * @date 2019-08-05
 */
@Data
public class SysUserDTO {
    /**
     * ID
     */
    private String id;
    /**
     * 账户
     */
    private String username;
    /**
     * 中文名称
     */
    private String name;
    /**
     * 英文名称
     */
    private String eName;
    /**
     * 电话号码
     */
    private String phone;
    /**
     * 性别
     */
    private String sex;
    /**
     * 部门ID
     */
    private String deptId;
}
