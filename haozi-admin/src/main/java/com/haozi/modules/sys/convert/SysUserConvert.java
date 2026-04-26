package com.haozi.modules.sys.convert;

import com.haozi.modules.sys.dto.SysUserDTO;
import com.haozi.modules.sys.entity.SysUser;
import com.haozi.modules.sys.vo.SysUserVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface SysUserConvert {
    SysUserConvert INSTANCE = Mappers.getMapper(SysUserConvert.class);

    /**
     * 转换为用户信息
     *
     * @param entity
     * @return
     */
    SysUserVO convertToVO(SysUser entity);

    /**
     * 转换为用户信息
     *
     * @param sysUserDTO
     * @return
     */
    SysUser convertFromDTO(SysUserDTO sysUserDTO);

    List<SysUserVO> convertList(List<SysUser> list);
}
