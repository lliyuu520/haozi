package cn.lliyuu520.haozi.common.utils;

import java.io.Serializable;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * 微信时间格式化
 *
 * @author liliangyu
 */
public class WxDateTimeFormatter implements Serializable {
    /**
     * 微信用时间格式化
     */
    public static final DateTimeFormatter FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss+08:00")
            .withZone(ZoneId.of("Asia/Shanghai"));
    /**
     * 序号时间格式化
     */
    public static final DateTimeFormatter SERIAL_FORMATTER = DateTimeFormatter
            .ofPattern("yyMMdd")
            .withZone(ZoneId.of("Asia/Shanghai"));

    public static final DateTimeFormatter YEAR_MONTH = DateTimeFormatter
            .ofPattern("yyMM")
            .withZone(ZoneId.of("Asia/Shanghai"));
}
