package com.mgm.hncsbj.modules.sys.query;

import com.mgm.hncsbj.common.base.query.BaseQuery;
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
