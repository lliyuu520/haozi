package com.haozi.modules.sys.vo;

import com.haozi.common.dto.FileDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * React 参数配置记录。
 *
 * <p>新前端只暴露参数配置页需要展示和编辑的字段，避免直接返回旧实体上的审计字段和逻辑删除字段。</p>
 *
 * @param id 参数 ID
 * @param code 参数编码
 * @param descs 参数描述
 * @param type 参数类型
 * @param enabled 开关值
 * @param num 数字值
 * @param text 文本值
 * @param files 文件列表
 * @param images 图片列表
 */
@Schema(description = "参数配置记录")
public record ConfigRecordVO(
        @Schema(description = "参数 ID")
        Long id,
        @Schema(description = "参数编码")
        String code,
        @Schema(description = "参数描述")
        String descs,
        @Schema(description = "参数类型")
        String type,
        @Schema(description = "开关值")
        Boolean enabled,
        @Schema(description = "数字值")
        Integer num,
        @Schema(description = "文本值")
        String text,
        @Schema(description = "文件列表")
        List<FileDTO> files,
        @Schema(description = "图片列表")
        List<FileDTO> images
) {
}
