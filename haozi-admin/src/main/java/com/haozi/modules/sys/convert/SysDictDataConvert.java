package com.haozi.modules.sys.convert;


import com.haozi.modules.sys.dto.SysDictDataDTO;
import com.haozi.modules.sys.entity.SysDictData;
import com.haozi.modules.sys.vo.SysDictDataVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface SysDictDataConvert {
    SysDictDataConvert INSTANCE = Mappers.getMapper(SysDictDataConvert.class);

    SysDictDataVO convertToVO(SysDictData entity);

    SysDictData convertFromDTO(SysDictDataDTO dto);

    List<SysDictDataVO> convertList(List<SysDictData> list);

}
