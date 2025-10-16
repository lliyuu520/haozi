package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import cn.lliyuu520.haozi.modules.sys.enums.SysConfigType;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统参数
 *
 * @author liliangyu
 */
@Data
@EqualsAndHashCode(callSuper = true)
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
    public static final String REPORT_MANAGER_CODE="REPORT_MANAGER_CODE";

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
     * {@link SysConfigType}
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
}