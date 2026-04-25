package com.mgm.hncsbj.modules.sys.convert;


import com.mgm.hncsbj.modules.sys.dto.SysDictTypeDTO;
import com.mgm.hncsbj.modules.sys.entity.SysDictType;
import com.mgm.hncsbj.modules.sys.vo.SysDictTypeVO;
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
