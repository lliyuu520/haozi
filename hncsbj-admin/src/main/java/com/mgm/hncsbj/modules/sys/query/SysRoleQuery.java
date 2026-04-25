package com.mgm.hncsbj.modules.sys.query;

import com.mgm.hncsbj.common.base.query.BaseQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * 角色管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysRoleQuery extends BaseQuery {
    private String name;

}
