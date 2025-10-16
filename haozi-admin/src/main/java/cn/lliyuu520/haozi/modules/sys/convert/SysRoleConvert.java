package cn.lliyuu520.haozi.modules.sys.convert;

import cn.lliyuu520.haozi.modules.sys.dto.SysRoleDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysRole;
import cn.lliyuu520.haozi.modules.sys.vo.SysRoleVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 系统角色转换器
 * 提供角色相关的数据转换功能
 *
 * @author lliyuu520
 */
@Mapper
public interface SysRoleConvert {
    SysRoleConvert INSTANCE = Mappers.getMapper(SysRoleConvert.class);

    /**
     * 将角色实体转换为角色视图对象
     *
     * @param entity 角色实体
     * @return 角色视图对象
     */
    SysRoleVO convertTOVO(SysRole entity);

    /**
     * 将角色数据传输对象转换为角色实体
     *
     * @param DTO 角色数据传输对象
     * @return 角色实体
     */
    SysRole convertFromDTO(SysRoleDTO DTO);

    /**
     * 将角色实体列表转换为角色视图对象列表
     *
     * @param list 角色实体列表
     * @return 角色视图对象列表
     */
    List<SysRoleVO> convertList(List<SysRole> list);
}
