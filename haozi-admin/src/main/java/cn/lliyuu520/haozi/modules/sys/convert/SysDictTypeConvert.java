package cn.lliyuu520.haozi.modules.sys.convert;


import cn.lliyuu520.haozi.modules.sys.dto.SysDictTypeDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictType;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictTypeVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface SysDictTypeConvert {
    SysDictTypeConvert INSTANCE = Mappers.getMapper(SysDictTypeConvert.class);

    SysDictTypeVO convertToVO(SysDictType entity);

    SysDictType convertForDTO(SysDictTypeDTO dictTypeDTO);

    List<SysDictTypeVO> convertList(List<SysDictType> list);

}
