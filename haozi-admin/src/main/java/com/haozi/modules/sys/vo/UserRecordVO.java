package com.haozi.modules.sys.vo;

import java.io.Serializable;
import java.util.List;

/**
 * React 用户管理列表记录。
 *
 * <p>旧 SysUserVO 继承 SysUser，可能携带 password 字段。新前端接口使用该瘦身 VO，
 * 明确只暴露用户管理页面需要展示和编辑的字段。</p>
 *
 * @param id 用户 ID
 * @param username 用户名
 * @param roleIdList 用户关联角色 ID 列表
 */
public record UserRecordVO(
        Long id,
        String username,
        List<Long> roleIdList
) implements Serializable {
}
