package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.json.JSONUtil;
import cn.lliyuu520.haozi.modules.sys.dto.SseNotifyDTO;
import cn.lliyuu520.haozi.modules.sys.enums.SseNotifyType;
import cn.lliyuu520.haozi.modules.sys.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SSE服务实现类
 *
 * @author liliangyu
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SseServiceImpl implements SseService {

    /**
     * 存储用户对应的SSE连接
     */
    private static final ConcurrentHashMap<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    /**
     *  发送下载通知
     * @param userId 用户ID
     * @param sseNotifyType  通知类型
     */
    @Override
    public void sendDownloadNotification(Long userId, SseNotifyType sseNotifyType,String uploadExcelUrl,String name) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                final SseNotifyDTO sseNotifyDTO = SseNotifyDTO.build(sseNotifyType);
                sseNotifyDTO.setMessage("您的导出文件已准备就绪");
                sseNotifyDTO.setUrl(uploadExcelUrl);
                sseNotifyDTO.setFileName(name);
                // 构建通知消息
                String notification = JSONUtil.toJsonStr(sseNotifyDTO);
                
                emitter.send(SseEmitter.event()
                        .data(notification)
                        .reconnectTime(3000));
                
                log.info("已发送下载通知给用户{}: {}", userId, notification);
            } catch (IOException e) {
                log.error("发送下载通知给用户{}失败", userId, e);
                emitters.remove(userId);
            }
        }
    }

    /**
     *是否有连接
     * @param userId 用户ID
     * @return
     */
    @Override
    public boolean hasActiveConnection(Long userId) {
        return emitters.containsKey(userId);
    }

    /**
     *  关闭SSE连接
     * @param userId 用户ID
     * @return
     */
    @Override
    public String closeConnection(Long userId) {
        SseEmitter emitter = emitters.remove(userId);
        if (emitter != null) {
            try {
                emitter.complete();
                log.info("已关闭用户{}的SSE连接", userId);
                return "SSE连接已关闭";
            } catch (Exception e) {
                log.error("关闭用户{}的SSE连接失败", userId, e);
                return "关闭SSE连接失败";
            }
        }
        return "连接不存在";
    }

    /**
     *  创建SSE连接
     * @param userId 用户ID
     * @return
     */
    @Override
    public SseEmitter createSseConnection(Long userId) {
        log.info("用户{}请求建立SSE连接", userId);
        
        // 防重处理：检查用户是否已有活跃连接
        if (hasActiveConnection(userId)) {
            SseEmitter existingEmitter = emitters.get(userId);
            log.info("用户{}复用现有SSE连接", userId);
            return existingEmitter;
        }
        
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // 设置超时时间为无限
        
        // 保存连接
        emitters.put(userId, emitter);
        
        // 连接关闭时的处理
        emitter.onCompletion(() -> {
            log.info("用户{}的SSE连接完成", userId);
            emitters.remove(userId);
        });
        
        emitter.onTimeout(() -> {
            log.warn("用户{}的SSE连接超时", userId);
            emitters.remove(userId);
        });
        
        emitter.onError((e) -> {
            log.error("用户{}的SSE连接出错", userId, e);
            emitters.remove(userId);
        });
        
        try {
            // 发送连接成功消息
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("SSE连接已建立")
                    .reconnectTime(3000));
            log.info("用户{}的SSE连接建立成功", userId);
        } catch (IOException e) {
            log.error("发送SSE连接失败消息失败", e);
            emitters.remove(userId);
        }
        
        return emitter;
    }

    /**
     *  获取当前活跃的SSE连接数
     * @return
     */
    @Override
    public long getActiveConnectionsCount() {
        return emitters.size();
    }


}