package com.haozi.modules.monitor.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.util.StrUtil;
import com.haozi.common.utils.Result;
import com.haozi.modules.monitor.vo.Cache;
import jakarta.annotation.Resource;
import org.springframework.data.redis.connection.RedisServerCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 缓存监控
 *
 * @author Pure tea
 */
@RestController
@RequestMapping("/monitor/cache")
public class CacheController {
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * Redis详情
     */
    @GetMapping("info")
    @SaCheckPermission("monitor:cache:all")
    public Result<Map<String, Object>> getInfo() {
        Map<String, Object> result = new HashMap<>();
        // Step 1: 获取Redis详情
        Properties info = (Properties) redisTemplate.execute((RedisCallback<Object>) RedisServerCommands::info);
        result.put("info", info);
        // Step 2: 获取Key的数量
        Object dbSize = redisTemplate.execute((RedisCallback<Object>) RedisServerCommands::dbSize);
        result.put("keyCount", dbSize);
        // Step 3: 获取请求次数
        List<Map<String, Object>> pieList = new ArrayList<>();
        Properties commandStats = (Properties) redisTemplate.execute((RedisCallback<Object>) connection -> connection.serverCommands().info("commandStats"));
        if (commandStats != null && !commandStats.isEmpty()) {
            commandStats.stringPropertyNames().forEach(key -> {
                Map<String, Object> data = new HashMap<>();
                String property = commandStats.getProperty(key);
                data.put("name", StrUtil.subPre(key, 8));
                data.put("value", StrUtil.subBetween(property, "calls=", ",use"));
                pieList.add(data);
            });
        }
        result.put("commandStats", pieList);
        return Result.ok(result);
    }

    /**
     * 获取所有的Key
     */
    @GetMapping("getCacheKeys")
    @SaCheckPermission("monitor:cache:all")
    public Result<Set<String>> getCacheKeys() {
        Set<String> cacheKeys = redisTemplate.keys("*");
        return Result.ok(cacheKeys);
    }

    /**
     * 获取结构化键下的Key值
     *
     * @param cacheKey
     */
    @GetMapping("getCacheKeys/{cacheKey}")
    @SaCheckPermission("monitor:cache:all")
    public Result<Set<String>> getCacheKeys(@PathVariable String cacheKey) {
        Set<String> cacheKeys = redisTemplate.keys(cacheKey + "*");
        return Result.ok(cacheKeys);
    }

    /**
     * 获取指定键的值
     *
     * @param cacheKey
     */
    @GetMapping("getCacheValue/{cacheKey}")
    @SaCheckPermission("monitor:cache:all")
    public Result<Cache> getCacheValue(@PathVariable String cacheKey) {
        Object cacheValue = redisTemplate.opsForValue().get(cacheKey);
        Cache cache = new Cache(cacheKey, cacheValue);
        return Result.ok(cache);
    }

    /**
     * 删除指定键的缓存
     *
     * @param cacheKey > Key值
     */
    @DeleteMapping("delCacheKey/{cacheKey}")
    @SaCheckPermission("monitor:cache:all")
    public Result<String> delCacheKey(@PathVariable String cacheKey) {
        boolean flag = redisTemplate.delete(cacheKey);
        if (flag) {
            return Result.ok();
        } else {
            return Result.error(200, "处理失败!");
        }
    }

    /**
     * 删除结构化键下的缓存
     *
     * @param cacheKey > Key值
     */
    @DeleteMapping("delCacheKeys/{cacheKey}")
    @SaCheckPermission("monitor:cache:all")
    public Result<String> delCacheKeys(@PathVariable String cacheKey) {
        Collection<String> cacheKeys = redisTemplate.keys(cacheKey + "*");
        redisTemplate.delete(cacheKeys);
        return Result.ok();
    }

    /**
     * 删除全部缓存
     */
    @DeleteMapping("delCacheAll")
    @SaCheckPermission("monitor:cache:all")
    public Result<String> delCacheAll() {
        Collection<String> cacheKeys = redisTemplate.keys("*");
        redisTemplate.delete(cacheKeys);
        return Result.ok();
    }

}
