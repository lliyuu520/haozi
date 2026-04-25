package com.mgm.hncsbj.modules.sys.convert;

import com.mgm.hncsbj.modules.sys.dto.SysDownloadCenterDTO;
import com.mgm.hncsbj.modules.sys.entity.SysDownloadCenter;
import com.mgm.hncsbj.modules.sys.vo.SysDownloadCenterVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 系统参数 转换器
 *
 * @author Claude
 */
@Mapper
public interface SysDownloadCenterConvert {
    SysDownloadCenterConvert INSTANCE = Mappers.getMapper(SysDownloadCenterConvert.class);

    SysDownloadCenter convertFromDTO(SysDownloadCenterDTO dto);

    SysDownloadCenterVO convertToVO(SysDownloadCenter entity);

    List<SysDownloadCenterVO> convertToVOList(List<SysDownloadCenter> entityList);

}