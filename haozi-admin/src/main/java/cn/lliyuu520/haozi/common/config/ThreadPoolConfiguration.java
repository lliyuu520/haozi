package cn.lliyuu520.haozi.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 线程池配置
 * 统一管理所有异步任务的线程池配置
 *
 * @author miguoma
 */
@Slf4j
@Configuration
@EnableAsync
public class ThreadPoolConfiguration implements AsyncConfigurer {
    public static final int cpuNum = Runtime.getRuntime().availableProcessors();

    /**
     * 默认异步线程池
     * 用于通用异步任务
     */
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // 核心线程大小 默认区 CPU 数量
        executor.setCorePoolSize(cpuNum);
        // 最大线程大小 默认区 CPU * 2 数量
        executor.setMaxPoolSize(cpuNum * 2);
        // 队列最大容量
        executor.setQueueCapacity(500);
        // 线程名前缀
        executor.setThreadNamePrefix("async-default-");
        // 拒绝策略：调用者运行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // 等待所有任务结束后再关闭线程池
        executor.setWaitForTasksToCompleteOnShutdown(true);
        // 等待时间
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }

    /**
     * 通用线程池执行器 (保持向后兼容)
     */
    @Bean
    public ThreadPoolExecutor createThreadPoolTaskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        // 核心线程大小 默认区 CPU 数量
        taskExecutor.setCorePoolSize(cpuNum);
        // 最大线程大小 默认区 CPU * 2 数量
        taskExecutor.setMaxPoolSize(cpuNum * 2);
        // 队列最大容量
        taskExecutor.setQueueCapacity(500);
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        taskExecutor.setWaitForTasksToCompleteOnShutdown(true);
        taskExecutor.setAwaitTerminationSeconds(60);
        taskExecutor.setThreadNamePrefix("Thread-");
        taskExecutor.initialize();

        return taskExecutor.getThreadPoolExecutor();
    }

    /**
     * 系统日志异步线程池
     * 用于处理系统日志和ERP日志等异步任务
     */
    @Bean("logExecutor")
    public Executor logExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // 核心线程数
        executor.setCorePoolSize(2);
        // 最大线程数
        executor.setMaxPoolSize(4);
        // 队列容量
        executor.setQueueCapacity(100);
        // 线程名前缀
        executor.setThreadNamePrefix("log-async-");
        // 拒绝策略：由调用线程处理
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // 等待所有任务结束后再关闭线程池
        executor.setWaitForTasksToCompleteOnShutdown(true);
        // 等待时间
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }



    /**
     * 异步任务异常处理
     */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            log.error("异步任务执行异常 - 方法: {}, 参数: {}", method.getName(), params, ex);
        };
    }
}
