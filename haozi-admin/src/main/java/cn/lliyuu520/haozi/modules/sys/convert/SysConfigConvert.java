package cn.lliyuu520.haozi.modules.sys.convert;

import cn.lliyuu520.haozi.modules.sys.dto.SysConfigDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysConfig;
import cn.lliyuu520.haozi.modules.sys.vo.SysConfigVO;
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