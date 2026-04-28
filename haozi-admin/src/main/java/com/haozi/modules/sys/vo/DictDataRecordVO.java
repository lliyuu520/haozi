package com.haozi.modules.sys.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * React 字典数据记录。
 *
 * <p>该对象用于右侧字典数据列表和表单回显，保持字段语义与旧 sys_dict_data 表一致。</p>
 *
 * @param id 字典数据 ID
 * @param dictType 字典类型编码
 * @param dictLabel 字典标签
 * @param dictValue 字典值
 * @param weight 排序
 * @param remark 备注
 */
@Schema(description = "字典数据记录")
public record DictDataRecordVO(
        @Schema(description = "字典数据 ID")
        Long id,
        @Schema(description = "字典类型编码")
        String dictType,
        @Schema(description = "字典标签")
        String dictLabel,
        @Schema(description = "字典值")
        String dictValue,
        @Schema(description = "排序")
        Integer weight,
        @Schema(description = "备注")
        String remark
) {
}
