package com.haozi.modules.sys.query;

import com.haozi.common.base.query.BaseQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * 用户查询
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysUserQuery extends BaseQuery {
    /**
     * 用户名
     */
    private String username;


}
