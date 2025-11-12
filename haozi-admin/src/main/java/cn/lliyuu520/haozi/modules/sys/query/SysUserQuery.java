package cn.lliyuu520.haozi.modules.sys.query;

import cn.lliyuu520.haozi.common.base.query.BaseQuery;
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

    /**
     * 手机号
     */
    private String phone;

    /**
     * 状态
     */
    private Boolean enabled;


}
