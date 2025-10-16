package cn.lliyuu520.haozi.modules.sys.query;

import cn.hutool.core.util.ArrayUtil;
import cn.lliyuu520.haozi.common.base.query.BaseQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;


/**
 * 日志查询条件
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysLogQuery extends BaseQuery {
    /**
     * 操作模块
     */
    private String moduleName;
    /**
     * 操作类型
     */
    private String typeName;

    /**
     * 操作时间
     */
    private LocalDateTime[] operateTimeRange;

    /**
     * 操作状态（0正常 1异常）
     */
    private Integer status;

    /**
     * 操作人用户名
     */
    private String operatorName;

    /**
     * 操作时间开始
     */
    private LocalDateTime operateTimeBegin;
    /**
     *  操作时间结束
     */
    private LocalDateTime operateTimeEnd;

    public LocalDateTime getOperateTimeBegin() {
        if(ArrayUtil.isNotEmpty(operateTimeRange)){
            return operateTimeRange[0];
        }
        return operateTimeBegin;
    }

    public LocalDateTime getOperateTimeEnd() {
        if(ArrayUtil.isNotEmpty(operateTimeRange)){
            return operateTimeRange[1];
        }
        return operateTimeEnd;
    }
}
