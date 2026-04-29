package com.haozi.modules.sys.vo;

import com.haozi.common.dto.FileDTO;

import java.io.Serializable;
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
public record ConfigRecordVO(
        Long id,
        String code,
        String descs,
        String type,
        Boolean enabled,
        Integer num,
        String text,
        List<FileDTO> files,
        List<FileDTO> images
) implements Serializable {
}
