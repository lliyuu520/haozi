package cn.lliyuu520.haozi.modules.sys.controller;

import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.modules.sys.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * SSE控制器 - 简化版本，只负责连接管理
 * 推送消息由Service层业务代码直接调用
 *
 * @author Claude
 */
@RestController
@RequestMapping("/sys/sse")
@RequiredArgsConstructor
@Slf4j
public class SseController {

    private final SseService sseService;

    /**
     * 建立SSE连接（包含防重处理）
     *
     * @param userId 用户ID
     * @return SseEmitter
     */
    @GetMapping("/createSSEConnection/{userId}")
    public SseEmitter createSseConnection(@PathVariable Long userId) {
        log.info("用户{}请求建立SSE连接", userId);
        return sseService.createSseConnection(userId);
    }

    /**
     * 关闭指定用户的SSE连接
     *
     * @param userId 用户ID
     */
    @DeleteMapping("/closeConnection/{userId}")
    public Result<Void> closeConnection(@PathVariable Long userId) {
        try {
            String result = sseService.closeConnection(userId);
            log.info("用户{}SSE连接关闭: {}", userId, result);
            return Result.ok();
        } catch (Exception e) {
            log.error("关闭用户{}的SSE连接失败", userId, e);
            return Result.error("关闭SSE连接失败");
        }
    }

    /**
     * 获取当前在线连接数
     */
    @GetMapping("/status")
    public Result<Long> getStatus() {
        long count = sseService.getActiveConnectionsCount();
        return Result.ok(count);
    }
}