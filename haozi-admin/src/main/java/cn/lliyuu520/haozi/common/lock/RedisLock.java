package cn.lliyuu520.haozi.common.lock;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

/**
 * Redis分布式锁注解
 * 用于方法级别的分布式锁控制
 * 
 * @author liliangyu
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RedisLock {
    
    /**
     * 锁的key，支持SpEL表达式
     * 例如：'qrcode:generate:#{#level}' 或 'order:#{#orderId}'
     */
    String key();
    
    /**
     * 锁的等待时间，默认3秒
     */
    long waitTime() default 3;
    
    /**
     * 锁的持有时间，默认10秒
     */
    long leaseTime() default 10;
    
    /**
     * 时间单位，默认秒
     */
    TimeUnit timeUnit() default TimeUnit.SECONDS;
    
    /**
     * 获取锁失败时的错误消息
     */
    String failMessage() default "系统繁忙，请稍后重试";
    
    /**
     * 是否公平锁，默认非公平锁
     */
    boolean fair() default false;
    
    /**
     * 是否自动续期，默认开启
     */
    boolean autoRenew() default true;
}