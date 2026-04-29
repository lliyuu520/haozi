package com.haozi.common.model;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.io.Serializable;
import java.util.List;

/**
 * 统一分页响应模型。
 *
 * <p>React 前端从统一 Result.data 中消费该分页模型，因此分页数据需要携带列表、
 * 总数和当前分页参数，避免页面继续依赖旧的 PageVO 字段结构。</p>
 *
 * @param items 当前页数据
 * @param total 总记录数
 * @param page 当前页码
 * @param pageSize 每页数量
 * @param <T> 分页数据类型
 */
public record PageResult<T>(
        List<T> items,
        long total,
        long page,
        long pageSize
) implements Serializable {

    /**
     * 从 MyBatis-Plus 分页对象构建统一分页响应。
     *
     * @param page MyBatis-Plus 分页对象
     * @param <T> 分页数据类型
     * @return 统一分页响应
     */
    public static <T> PageResult<T> of(final IPage<T> page) {
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getCurrent(), page.getSize());
    }
}
