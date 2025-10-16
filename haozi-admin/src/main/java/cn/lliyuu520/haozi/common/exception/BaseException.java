package cn.lliyuu520.haozi.common.exception;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 自定义异常类
 * 系统中所有自定义异常的基类，继承自RuntimeException
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class BaseException extends RuntimeException {

    private int code;
    private String msg;

    /**
     * 构造方法 - 只传入错误信息
     * 默认错误码为500
     * 
     * @param msg 错误信息
     */
    public BaseException(final String msg) {
        super(msg);
        this.code = 500;
        this.msg = msg;
    }

    /**
     * 构造方法 - 传入错误信息和异常对象
     * 默认错误码为500
     * 
     * @param msg 错误信息
     * @param e 异常对象
     */
    public BaseException(final String msg, final Throwable e) {
        super(msg, e);
        this.code = 500;
        this.msg = msg;
    }

    /**
     * 构造方法 - 使用模板和参数构建错误信息
     * 默认错误码为500
     * 
     * @param template 错误信息模板
     * @param message 模板参数
     */
    public BaseException(String template, Object... message) {
        super(StrUtil.format(template, message));
        code = 500;
        msg = StrUtil.format(template, message);
    }
}