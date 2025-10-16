package cn.lliyuu520.haozi.common.exception;

/**
 * 分布式锁获取失败异常
 *
 * <p>当获取分布式锁失败时抛出此异常，通常用于提示调用方不要重复调用
 * 或稍后重试的场景。</p>
 *
 * @author liliangyu
 */
public class LockAcquisitionException extends BaseException {

    /**
     * 构造函数
     *
     * @param message 异常消息
     */
    public LockAcquisitionException(String message) {
        super(message);
    }

    /**
     * 构造函数
     *
     * @param message 异常消息
     * @param cause 原因异常
     */
    public LockAcquisitionException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常消息
     * @param code 错误码
     */
    public LockAcquisitionException(String message, String code) {
        super(message, code);
    }
}