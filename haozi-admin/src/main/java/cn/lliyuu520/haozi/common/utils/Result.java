package cn.lliyuu520.haozi.common.utils;

import lombok.Data;

/**
 * 统一响应结果封装类
 * 用于封装系统接口返回的数据，统一返回格式
 *
 * @author lliyuu520 lliyuu520@gmail.com
 * @param <T> 返回数据的类型
 */
@Data
public class Result<T> {
    /**
     * 响应状态码
     * 0表示成功，其他值表示失败
     */
    private int code = 0;

    /**
     * 响应消息
     * 描述响应结果的文字信息
     */
    private String msg = "success";

    /**
     * 响应数据
     * 实际返回的业务数据
     */
    private T data;

    /**
     * 成功响应 - 无数据返回
     * 
     * @param <T> 返回数据的类型
     * @return 成功的响应结果
     */
    public static <T> Result<T> ok() {
        return Result.ok(null);
    }

    /**
     * 成功响应 - 有数据返回
     * 
     * @param data 响应数据
     * @param <T> 返回数据的类型
     * @return 成功的响应结果
     */
    public static <T> Result<T> ok(final T data) {
        final Result<T> result = new Result<>();
        result.setData(data);
        return result;
    }

    /**
     * 错误响应 - 使用默认错误码500
     * 
     * @param msg 错误消息
     * @param <T> 返回数据的类型
     * @return 错误的响应结果
     */
    public static <T> Result<T> error(final String msg) {
        return Result.error(500, msg);
    }

    /**
     * 错误响应 - 指定错误码和错误消息
     * 
     * @param code 错误码
     * @param msg 错误消息
     * @param <T> 返回数据的类型
     * @return 错误的响应结果
     */
    public static <T> Result<T> error(final int code, final String msg) {
        final Result<T> result = new Result<>();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }
}