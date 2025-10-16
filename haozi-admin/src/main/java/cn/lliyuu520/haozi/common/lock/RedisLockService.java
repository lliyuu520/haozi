package cn.lliyuu520.haozi.common.lock;

import cn.hutool.core.util.StrUtil;
import cn.lliyuu520.haozi.common.exception.LockAcquisitionException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RReadWriteLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis分布式锁服务
 * 基于Redisson实现的分布式锁服务
 * 
 * @author liliangyu
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisLockService {
    
    private final RedissonClient redissonClient;
    
    /** 默认锁前缀 */
    private static final String LOCK_PREFIX = "distributed:lock:";
    
    /**
     * 尝试获取锁
     *
     * @param lockKey 锁的key
     * @param waitTime 等待时间
     * @param leaseTime 持有时间
     * @param timeUnit 时间单位
     * @param fair 是否公平锁
     * @return 是否获取成功
     */
    public boolean tryLock(String lockKey, long waitTime, long leaseTime, TimeUnit timeUnit, boolean fair) {
        String fullKey = buildLockKey(lockKey);
        RLock lock = fair ? redissonClient.getFairLock(fullKey) : redissonClient.getLock(fullKey);

        try {
            boolean acquired = lock.tryLock(waitTime, leaseTime, timeUnit);
            if (acquired) {
                log.debug("成功获取分布式锁: {}", fullKey);
            } else {
                log.warn("获取分布式锁失败: {}", fullKey);
            }
            return acquired;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("获取分布式锁被中断: {}", fullKey, e);
            return false;
        } catch (Exception e) {
            log.error("获取分布式锁异常: {}", fullKey, e);
            return false;
        }
    }

    /**
     * 尝试获取锁，获取失败抛出异常
     *
     * @param lockKey 锁的key
     * @param waitTime 等待时间
     * @param leaseTime 持有时间
     * @param timeUnit 时间单位
     * @param fair 是否公平锁
     * @throws LockAcquisitionException 当获取锁失败时抛出专门的锁获取异常
     */
    public void tryLockOrThrow(String lockKey, long waitTime, long leaseTime, TimeUnit timeUnit, boolean fair) {
        String fullKey = buildLockKey(lockKey);
        RLock lock = fair ? redissonClient.getFairLock(fullKey) : redissonClient.getLock(fullKey);

        try {
            boolean acquired = lock.tryLock(waitTime, leaseTime, timeUnit);
            if (acquired) {
                log.debug("成功获取分布式锁: {}", fullKey);
            } else {
                // 抛出专门的锁获取异常，提示调用方不要重复调用
                throw new LockAcquisitionException("获取分布式锁失败，请勿重复调用，稍后重试: " + fullKey);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LockAcquisitionException("获取分布式锁被中断: " + fullKey, e);
        } catch (Exception e) {
            throw new LockAcquisitionException("获取分布式锁异常: " + fullKey, e);
        }
    }

    /**
     * 简化版本的尝试获取锁，获取失败抛出异常（默认非公平锁）
     *
     * @param lockKey 锁的key
     * @param waitTime 等待时间
     * @param leaseTime 持有时间
     * @param timeUnit 时间单位
     * @throws RuntimeException 当获取锁失败时抛出异常
     */
    public void tryLockOrThrow(String lockKey, long waitTime, long leaseTime, TimeUnit timeUnit) {
        tryLockOrThrow(lockKey, waitTime, leaseTime, timeUnit, false);
    }

    /**
     * 释放锁
     *
     * @param lockKey 锁的key
     * @param fair 是否公平锁
     */
    public void unlock(String lockKey, boolean fair) {
        String fullKey = buildLockKey(lockKey);
        RLock lock = fair ? redissonClient.getFairLock(fullKey) : redissonClient.getLock(fullKey);
        
        try {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("成功释放分布式锁: {}", fullKey);
            } else {
                log.warn("尝试释放不属于当前线程的锁: {}", fullKey);
            }
        } catch (Exception e) {
            log.error("释放分布式锁异常: {}", fullKey, e);
        }
    }
    
    /**
     * 执行带锁的业务逻辑
     * 
     * @param lockKey 锁的key
     * @param waitTime 等待时间
     * @param leaseTime 持有时间
     * @param timeUnit 时间单位
     * @param fair 是否公平锁
     * @param business 业务逻辑
     * @param <T> 返回类型
     * @return 业务执行结果
     * @throws Exception 业务异常或锁获取失败异常
     */
    public <T> T executeWithLock(String lockKey, long waitTime, long leaseTime, 
                                TimeUnit timeUnit, boolean fair, LockBusiness<T> business) throws Exception {
        String fullKey = buildLockKey(lockKey);
        RLock lock = fair ? redissonClient.getFairLock(fullKey) : redissonClient.getLock(fullKey);
        
        boolean acquired = false;
        try {
            acquired = lock.tryLock(waitTime, leaseTime, timeUnit);
            if (!acquired) {
                throw new RuntimeException("获取分布式锁失败: " + fullKey);
            }
            
            log.debug("成功获取分布式锁，开始执行业务逻辑: {}", fullKey);
            return business.execute();
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("获取分布式锁被中断: " + fullKey, e);
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                try {
                    lock.unlock();
                    log.debug("成功释放分布式锁: {}", fullKey);
                } catch (Exception e) {
                    log.error("释放分布式锁异常: {}", fullKey, e);
                }
            }
        }
    }
    
    /**
     * 获取读写锁的读锁
     * 
     * @param lockKey 锁的key
     * @return 读锁
     */
    public RReadWriteLock getReadWriteLock(String lockKey) {
        String fullKey = buildLockKey(lockKey);
        return redissonClient.getReadWriteLock(fullKey);
    }
    
    /**
     * 检查锁是否存在
     * 
     * @param lockKey 锁的key
     * @return 是否存在
     */
    public boolean isLocked(String lockKey) {
        String fullKey = buildLockKey(lockKey);
        RLock lock = redissonClient.getLock(fullKey);
        return lock.isLocked();
    }
    
    /**
     * 检查锁是否被当前线程持有
     * 
     * @param lockKey 锁的key
     * @return 是否被当前线程持有
     */
    public boolean isHeldByCurrentThread(String lockKey) {
        String fullKey = buildLockKey(lockKey);
        RLock lock = redissonClient.getLock(fullKey);
        return lock.isHeldByCurrentThread();
    }
    
    /**
     * 强制释放锁（慎用）
     * 
     * @param lockKey 锁的key
     * @return 是否释放成功
     */
    public boolean forceUnlock(String lockKey) {
        String fullKey = buildLockKey(lockKey);
        RLock lock = redissonClient.getLock(fullKey);
        try {
            boolean result = lock.forceUnlock();
            if (result) {
                log.warn("强制释放分布式锁成功: {}", fullKey);
            } else {
                log.warn("强制释放分布式锁失败，锁可能不存在: {}", fullKey);
            }
            return result;
        } catch (Exception e) {
            log.error("强制释放分布式锁异常: {}", fullKey, e);
            return false;
        }
    }
    
    /**
     * 构建完整的锁key
     * 
     * @param lockKey 原始key
     * @return 完整key
     */
    private String buildLockKey(String lockKey) {
        if (StrUtil.isBlank(lockKey)) {
            throw new IllegalArgumentException("锁key不能为空");
        }
        return lockKey.startsWith(LOCK_PREFIX) ? lockKey : LOCK_PREFIX + lockKey;
    }
    
    /**
     * 业务逻辑接口
     * 
     * @param <T> 返回类型
     */
    @FunctionalInterface
    public interface LockBusiness<T> {
        /**
         * 执行业务逻辑
         * 
         * @return 执行结果
         * @throws Exception 业务异常
         */
        T execute() throws Exception;
    }
}