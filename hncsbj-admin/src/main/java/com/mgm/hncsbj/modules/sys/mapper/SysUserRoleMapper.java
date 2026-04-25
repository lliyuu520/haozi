package com.mgm.hncsbj.modules.sys.mapper;

import com.mgm.hncsbj.common.base.mapper.IBaseMapper;
import com.mgm.hncsbj.modules.sys.entity.SysUserRole;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 用户角色关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Repository
public interface SysUserRoleMapper extends IBaseMapper<SysUserRole> {

    /**
     * 角色ID列表
     *
     * @param userId 用户ID
     * @return 返回角色ID列表
     */
    List<Long> getRoleIdList(@Param("userId") Long userId);
}
