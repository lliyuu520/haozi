package cn.lliyuu520.haozi.modules.sys.service;

import cn.lliyuu520.haozi.modules.sys.enums.SseNotifyType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * SSE服务接口
 *
 * @author liliangyu
 */
public interface SseService {

    /**
     * 发送下载通知给指定用户
     * @param userId 用户ID
     * @param sseNotifyType  通知类型
     *
     */
    void sendDownloadNotification(Long userId, SseNotifyType sseNotifyType,String uploadExcelUrl,String name);

    /**
     * 关闭用户SSE连接
     * @param userId 用户ID
     * @return 关闭结果
     */
    String closeConnection(Long userId);

    /**
     * 建立SSE连接（包含防重处理）
     * @param userId 用户ID
     * @return SSE发射器
     */
    SseEmitter createSseConnection(Long userId);

    /**
     * 检查用户是否已有活跃连接（防重处理）
     * @param userId 用户ID
     * @return 是否有活跃连接
     */
    boolean hasActiveConnection(Long userId);

    /**
     * 获取当前活跃连接数
     * @return 连接数
     */
    long getActiveConnectionsCount();


}