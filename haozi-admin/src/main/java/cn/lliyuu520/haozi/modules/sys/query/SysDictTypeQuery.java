package cn.lliyuu520.haozi.modules.sys.query;

import cn.lliyuu520.haozi.common.base.query.BaseQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 字典类型
 *
 * @author lliyuu520
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysDictTypeQuery extends BaseQuery {
    private String dictType;

    private String dictName;

}
