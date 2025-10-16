package cn.lliyuu520.haozi.modules.sys.query;

import cn.lliyuu520.haozi.common.base.query.BaseQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统参数 查询条件
 *
 * @author Claude
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysConfigQuery extends BaseQuery {
    /**
     * 参数编码
     */
    private String code;

    /**
     * 参数描述
     */
    private String descs;

    /**
     * 参数类型
     */
    private String type;


}