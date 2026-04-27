package com.haozi.common.model;

import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * 统一分页响应模型。
 *
 * <p>React 前端直接消费 HTTP 2xx 响应中的业务数据，因此分页数据需要携带列表、
 * 总数和当前分页参数，避免前端继续依赖旧的 Result/PageVO 双层包装。</p>
 *
 * @param items 当前页数据
 * @param total 总记录数
 * @param page 当前页码
 * @param pageSize 每页数量
 * @param <T> 分页数据类型
 */
@Schema(description = "分页响应")
public record PageResult<T>(
        @Schema(description = "当前页数据")
        List<T> items,
        @Schema(description = "总记录数")
        long total,
        @Schema(description = "当前页码")
        long page,
        @Schema(description = "每页数量")
        long pageSize
) {

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
