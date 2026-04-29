package com.haozi.modules.sys.vo;

import java.io.Serializable;

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
public record DictDataRecordVO(
        Long id,
        String dictType,
        String dictLabel,
        String dictValue,
        Integer weight,
        String remark
) implements Serializable {
}
