package cn.lliyuu520.haozi.common.lock;

import cn.hutool.core.util.StrUtil;
import cn.lliyuu520.haozi.common.exception.LockAcquisitionException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * Redis分布式锁切面处理器
 * 实现基于注解的分布式锁功能
 * 
 * @author liliangyu
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class RedisLockAspect {
    
    private final RedisLockService redisLockService;
    
    /** SpEL表达式解析器 */
    private final ExpressionParser parser = new SpelExpressionParser();
    
    /** 参数名称发现器 */
    private final DefaultParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();
    
    /**
     * 环绕通知处理分布式锁
     */
    @Around("@annotation(redisLock)")
    public Object around(ProceedingJoinPoint joinPoint, RedisLock redisLock) throws Throwable {
        // 解析锁的key
        String lockKey = parseLockKey(redisLock.key(), joinPoint);
        
        log.debug("开始尝试获取分布式锁: {}", lockKey);
        
        // 尝试获取锁
        boolean acquired = redisLockService.tryLock(
            lockKey,
            redisLock.waitTime(),
            redisLock.leaseTime(),
            redisLock.timeUnit(),
            redisLock.fair()
        );
        
        if (!acquired) {
            log.warn("获取分布式锁失败: {}", lockKey);
            throw new LockAcquisitionException(redisLock.failMessage());
        }
        
        try {
            log.debug("成功获取分布式锁，开始执行业务方法: {}", lockKey);
            return joinPoint.proceed();
        } finally {
            // 释放锁
            redisLockService.unlock(lockKey, redisLock.fair());
            log.debug("释放分布式锁: {}", lockKey);
        }
    }
    
    /**
     * 解析锁的key，支持SpEL表达式
     * 
     * @param keyExpression key表达式
     * @param joinPoint 连接点
     * @return 解析后的key
     */
    private String parseLockKey(String keyExpression, ProceedingJoinPoint joinPoint) {
        if (StrUtil.isBlank(keyExpression)) {
            throw new IllegalArgumentException("锁key不能为空");
        }
        
        // 如果不包含SpEL表达式标记，直接返回
        if (!keyExpression.contains("#{")) {
            return keyExpression;
        }
        
        // 获取方法信息
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Object[] args = joinPoint.getArgs();
        
        // 获取参数名称
        String[] paramNames = discoverer.getParameterNames(method);
        if (paramNames == null) {
            throw new LockAcquisitionException("无法获取方法参数名称，请确保编译时保留参数名称信息");
        }
        
        // 创建SpEL上下文
        EvaluationContext context = new StandardEvaluationContext();
        
        // 将方法参数添加到上下文中
        for (int i = 0; i < paramNames.length; i++) {
            context.setVariable(paramNames[i], args[i]);
        }
        
        try {
            // 解析表达式
            Expression expression = parser.parseExpression(keyExpression);
            Object value = expression.getValue(context);
            return value != null ? value.toString() : keyExpression;
        } catch (Exception e) {
            log.error("解析锁key表达式失败: {}", keyExpression, e);
            throw new LockAcquisitionException("解析锁key表达式失败: " + keyExpression, e);
        }
    }
}