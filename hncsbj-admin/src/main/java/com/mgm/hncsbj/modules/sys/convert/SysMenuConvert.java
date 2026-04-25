package com.mgm.hncsbj.modules.sys.convert;

import com.mgm.hncsbj.modules.sys.dto.SysMenuDTO;
import com.mgm.hncsbj.modules.sys.entity.SysMenu;
import com.mgm.hncsbj.modules.sys.vo.SysMenuVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface SysMenuConvert {
    SysMenuConvert INSTANCE = Mappers.getMapper(SysMenuConvert.class);

    SysMenu convertFromDTO(SysMenuDTO sysMenuDTO);

    SysMenuVO convertToVO(SysMenu entity);

    List<SysMenuVO> convertList(List<SysMenu> list);
}
