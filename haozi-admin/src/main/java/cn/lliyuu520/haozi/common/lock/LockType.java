package cn.lliyuu520.haozi.common.lock;

/**
 * 锁类型枚举
 * 
 * @author liliangyu
 */
public enum LockType {
    
    /**
     * 可重入锁（默认）
     */
    REENTRANT,
    
    /**
     * 公平锁
     */
    FAIR,
    
    /**
     * 读锁
     */
    READ,
    
    /**
     * 写锁
     */
    WRITE,
    
    /**
     * 红锁（多个Redis实例）
     */
    RED_LOCK
}