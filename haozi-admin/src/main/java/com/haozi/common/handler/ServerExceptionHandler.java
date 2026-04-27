package com.haozi.common.handler;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import com.haozi.common.exception.BaseException;
import com.haozi.common.exception.LockAcquisitionException;
import com.haozi.common.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * 全局异常处理器
 * 统一处理系统中抛出的各种异常，并通过 HTTP 状态码表达错误语义。
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Slf4j
@RestControllerAdvice
public class ServerExceptionHandler {

    /**
     * 分布式锁获取失败异常处理
     * 处理分布式锁获取失败时的异常，给出友好的提示信息。
     *
     * @param ex 锁获取异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(LockAcquisitionException.class)
    public ResponseEntity<ErrorResponse> handleLockAcquisitionException(
            final LockAcquisitionException ex,
            final HttpServletRequest request
    ) {
        log.warn("锁获取失败: {}", ex.getMessage(), ex);
        return build(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage(), request);
    }

    /**
     * 处理自定义异常
     * 处理系统中抛出的 BaseException 自定义异常。
     *
     * @param ex 自定义异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleException(final BaseException ex, final HttpServletRequest request) {
        log.error(ex.getMessage(), ex);
        final HttpStatus status = resolveStatus(ex.getCode(), HttpStatus.BAD_REQUEST);
        return build(status, status.name(), ex.getMsg(), request);
    }

    /**
     * SpringMVC 参数绑定异常处理
     * 处理参数校验不通过时的绑定异常。
     *
     * @param ex 绑定异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> bindException(final BindException ex, final HttpServletRequest request) {
        return buildValidationError(ex.getFieldErrors(), request);
    }

    /**
     * 请求体参数校验异常处理。
     *
     * @param ex 请求体参数校验异常
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> methodArgumentNotValidException(
            final MethodArgumentNotValidException ex,
            final HttpServletRequest request
    ) {
        return buildValidationError(ex.getBindingResult().getFieldErrors(), request);
    }

    /**
     * 权限不足异常处理
     * 处理用户权限不足时的异常。
     *
     * @param ex 权限不足异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(NotPermissionException.class)
    public ResponseEntity<ErrorResponse> handleNotPermissionException(
            final NotPermissionException ex,
            final HttpServletRequest request
    ) {
        log.error(ex.getMessage(), ex);
        return build(HttpStatus.FORBIDDEN, "FORBIDDEN", "没有访问权限", request);
    }

    /**
     * 参数异常处理
     * 处理非法参数异常。
     *
     * @param ex 非法参数异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            final IllegalArgumentException ex,
            final HttpServletRequest request
    ) {
        log.error(ex.getMessage(), ex);
        return build(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage(), request);
    }

    /**
     * 数据不存在异常处理
     * 处理数据不存在时的异常。
     *
     * @param ex 数据不存在异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleException(
            final NoSuchElementException ex,
            final HttpServletRequest request
    ) {
        log.error(ex.getMessage(), ex);
        return build(HttpStatus.NOT_FOUND, "NOT_FOUND", "数据不存在", request);
    }

    /**
     * 处理用户未登录时的异常。
     *
     * @param ex 未登录异常
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(NotLoginException.class)
    public ResponseEntity<ErrorResponse> handleNotLoginException(
            final NotLoginException ex,
            final HttpServletRequest request
    ) {
        log.error(ex.getMessage(), ex);
        return build(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "登录失效，请重新登录", request);
    }

    /**
     * 请求方法不支持异常处理。
     *
     * @param ex 请求方法不支持异常
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            final HttpRequestMethodNotSupportedException ex,
            final HttpServletRequest request
    ) {
        log.error(ex.getMessage(), ex);
        return build(HttpStatus.METHOD_NOT_ALLOWED, "METHOD_NOT_ALLOWED", "请求方法不支持", request);
    }

    /**
     * 其他未处理异常处理
     * 处理系统中未被其他方法捕获的通用异常。
     *
     * @param ex 异常对象
     * @param request 当前请求
     * @return 错误响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(final Exception ex, final HttpServletRequest request) {
        log.error(ex.getMessage(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "服务器异常，请稍后再试", request);
    }

    /**
     * 构建普通错误响应。
     *
     * @param status HTTP 状态
     * @param code 错误编码
     * @param message 用户可读错误信息
     * @param request 当前请求
     * @return 错误响应
     */
    private ResponseEntity<ErrorResponse> build(
            final HttpStatus status,
            final String code,
            final String message,
            final HttpServletRequest request
    ) {
        return ResponseEntity.status(status).body(ErrorResponse.of(code, message, request.getRequestURI()));
    }

    /**
     * 构建字段校验错误响应。
     *
     * @param fieldErrors 字段错误列表
     * @param request 当前请求
     * @return 错误响应
     */
    private ResponseEntity<ErrorResponse> buildValidationError(
            final java.util.List<FieldError> fieldErrors,
            final HttpServletRequest request
    ) {
        final Map<String, String> details = new LinkedHashMap<>();
        for (final FieldError fieldError : fieldErrors) {
            details.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(
                ErrorResponse.of("VALIDATION_ERROR", "参数校验失败", request.getRequestURI(), details)
        );
    }

    /**
     * 将业务异常中的历史数字 code 映射为 HTTP 状态。
     *
     * @param code 历史错误码
     * @param defaultStatus 默认状态
     * @return HTTP 状态
     */
    private HttpStatus resolveStatus(final int code, final HttpStatus defaultStatus) {
        final HttpStatus status = HttpStatus.resolve(code);
        return status == null ? defaultStatus : status;
    }
}
