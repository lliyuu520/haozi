package cn.lliyuu520.haozi.common.handler;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.exception.LockAcquisitionException;
import cn.lliyuu520.haozi.common.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

/**
 * 全局异常处理器
 * 统一处理系统中抛出的各种异常，返回格式化的错误信息
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Slf4j
@RestControllerAdvice
public class ServerExceptionHandler {


    /**
     * 分布式锁获取失败异常处理
     * 处理分布式锁获取失败时的异常，给出友好的提示信息
     *
     * @param ex 锁获取异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(LockAcquisitionException.class)
    public Result<String> handleLockAcquisitionException(LockAcquisitionException ex) {
        log.warn("锁获取失败: {}", ex.getMessage(), ex);
        return Result.error(409, ex.getMessage()); // 409 Conflict 表示资源冲突
    }

    /**
     * 处理自定义异常
     * 处理系统中抛出的BaseException自定义异常
     *
     * @param ex 自定义异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(BaseException.class)
    public Result<String> handleException(BaseException ex) {
        log.error(ex.getMessage(), ex);

        return Result.error(ex.getCode(), ex.getMsg());
    }

    /**
     * SpringMVC参数绑定异常处理
     * 处理参数校验不通过时的绑定异常
     *
     * @param ex 绑定异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(BindException.class)
    public Result<String> bindException(BindException ex) {
        FieldError fieldError = ex.getFieldError();
        assert fieldError != null;
        return Result.error(fieldError.getDefaultMessage());
    }

    /**
     * 权限不足异常处理
     * 处理用户权限不足时的异常
     *
     * @param ex 权限不足异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(NotPermissionException.class)
    public Result<String> handleNotPermissionException(NotPermissionException ex) {
        log.error(ex.getMessage(), ex);
        return Result.error(ex.getMessage());
    }

    /**
     * 参数异常处理
     * 处理非法参数异常
     *
     * @param ex 非法参数异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public Result<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error(ex.getMessage(), ex);
        return Result.error(ex.getMessage());
    }

    /**
     * 数据不存在异常处理
     * 处理数据不存在时的异常
     *
     * @param ex 数据不存在异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(NoSuchElementException.class)
    public Result<String> handleException(NoSuchElementException ex) {
        log.error(ex.getMessage(), ex);
        return Result.error("数据不存在");
    }

    /**
     * NotLoginException
     * 处理用户未登录时的异常
     *
     */
    @ExceptionHandler(NotLoginException.class)
    public Result<String> handleNotLoginException(NotLoginException ex) {
        log.error(ex.getMessage(), ex);
        return Result.error(401,"登录失效,请刷新页面");
    }

    /**
     * 请求方法不支持 HttpRequestMethodNotSupportedException
     *
     * @param ex
     * @return
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<String> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        log.error(ex.getMessage(), ex);
        return Result.error(405, "请求方法不支持");
    }


    /**
     * 其他未处理异常处理
     * 处理系统中未被其他方法捕获的通用异常
     *
     * @param ex 异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception ex) {
        log.error(ex.getMessage(), ex);
        return Result.error(500, "服务器异常，请稍后再试");
    }


    //
}