package com.mgm.hncsbj.modules.sys.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.mgm.hncsbj.common.base.entity.BaseEntity;
import com.mgm.hncsbj.common.dto.FileDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

/**
 * 系统参数
 *
 * @author liliangyu
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName(autoResultMap = true)
public class SysConfig extends BaseEntity {
    /**
     * 每日领奖次数(数值类型)
     */
    public static final String DAY_RECEIVE_LIMIT = "DAY_RECEIVE_LIMIT";
    /**
     * 积分兑换金额比例(数值类型)
     */
    public static final String INTEGRAL_EXCHANGE_RATIO = "INTEGRAL_EXCHANGE_RATIO";
    /**
     * 订单有效天数(数值类型)
     */
    public static final String ORDER_VALID_DAYS = "ORDER_VALID_DAYS";
    /**
     * 报单专员编码(字符串)
     */
    public static final String REPORT_MANAGER_CODE = "REPORT_MANAGER_CODE";
    /**
     * 活动规则
     */
    public static final String TRACE_RULE = "TRACE_RULE";

    /**
     * 参数编码
     */
    private String code;
    /**
     * 参数描述
     */
    private String descs;


    /**
     * 参数类型(开关,数字,文本)
     * {@link com.mgm.hncsbj.modules.sys.enums.SysConfigType}
     */
    private String type;
    /**
     * 是否生效(仅用于开关类型)
     */
    private Boolean enabled;
    /**
     * 数值(仅用于数值类型)
     */
    private Integer num;
    /**
     * 文本内容(仅用于文本类型)
     */
    private String text;

    /**
     * 文件列表(仅用于文件类型)
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<FileDTO> files = new ArrayList<>();

    /**
     * 图片类型
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<FileDTO> images = new ArrayList<>();
}