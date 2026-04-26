package com.haozi.modules.sys.query;

import com.haozi.common.base.query.BaseQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 字典数据
 *
 * @author lliyuu520
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysDictDataQuery extends BaseQuery {


    private String dictType;

}
