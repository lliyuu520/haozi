package cn.lliyuu520.haozi.modules.sys.convert;


import cn.lliyuu520.haozi.modules.sys.dto.SysDictDataDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictData;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictDataVO;
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
