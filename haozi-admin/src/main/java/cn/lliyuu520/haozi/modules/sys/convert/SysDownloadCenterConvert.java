package cn.lliyuu520.haozi.modules.sys.convert;

import cn.lliyuu520.haozi.modules.sys.dto.SysDownloadCenterDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDownloadCenter;
import cn.lliyuu520.haozi.modules.sys.vo.SysDownloadCenterVO;
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