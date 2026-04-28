package com.haozi.modules.sys.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * React 字典类型记录。
 *
 * <p>新前端只需要字典类型、名称和备注等管理字段，使用独立 VO 固定接口契约，
 * 避免直接暴露旧实体继承的所有基础字段。</p>
 *
 * @param id 字典类型 ID
 * @param dictType 字典类型编码
 * @param dictName 字典名称
 * @param remark 备注
 */
@Schema(description = "字典类型记录")
public record DictTypeRecordVO(
        @Schema(description = "字典类型 ID")
        Long id,
        @Schema(description = "字典类型编码")
        String dictType,
        @Schema(description = "字典名称")
        String dictName,
        @Schema(description = "备注")
        String remark
) {
}
