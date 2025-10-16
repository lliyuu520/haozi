package cn.lliyuu520.haozi.common.cache;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 角色权限缓存
 *
 * @author liliangyu
 */
@Component
@RequiredArgsConstructor
public class RollPermissionCache {
    private final String ROLE_PERMISSION = "ROLE_PERMISSION:{}";
    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 获取角色权限
     *
     * @param roleId
     * @return
     */
    public List<String> getPermission(final Long roleId) {
        return redisTemplate.opsForList().range(StrUtil.format(ROLE_PERMISSION, roleId), 0, -1);
    }

    /**
     * 设置角色权限
     *
     * @param roleId
     * @param permission
     */
    public void setPermission(final Long roleId, final List<String> permission) {
        final String key = StrUtil.format(ROLE_PERMISSION, roleId);
        redisTemplate.delete(key);
        if (CollectionUtil.isNotEmpty(permission)) {
            redisTemplate.opsForList().leftPushAll(key, permission);
        }

    }

    /**
     * 删除角色权限
     *
     * @param roleId
     */

    public void deletePermission(final Long roleId) {
        final String key = StrUtil.format(ROLE_PERMISSION, roleId);
        redisTemplate.delete(key);
    }
}
