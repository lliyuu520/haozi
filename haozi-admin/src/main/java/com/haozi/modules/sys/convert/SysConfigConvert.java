package com.haozi.modules.sys.convert;

import com.haozi.modules.sys.dto.SysConfigDTO;
import com.haozi.modules.sys.entity.SysConfig;
import com.haozi.modules.sys.vo.SysConfigVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 系统参数 转换器
 *
 * @author Claude
 */
@Mapper
public interface SysConfigConvert {
    SysConfigConvert INSTANCE = Mappers.getMapper(SysConfigConvert.class);

    SysConfig convertFromDTO(SysConfigDTO dto);

    SysConfigVO convertToVO(SysConfig entity);

    List<SysConfigVO> convertToVOList(List<SysConfig> entityList);

}