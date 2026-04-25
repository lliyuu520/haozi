package com.mgm.hncsbj.modules.sys.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mgm.hncsbj.common.base.mapper.IBaseMapper;
import com.mgm.hncsbj.modules.sys.entity.SysUser;
import org.springframework.stereotype.Repository;

/**
 * 系统用户
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Repository
public interface SysUserMapper extends IBaseMapper<SysUser> {


    /**
     * 根据用户名查询用户
     * @param username
     * @return
     */
    default SysUser getByUsername(final String username) {
        final LambdaQueryWrapper<SysUser> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(SysUser::getUsername, username);
        return selectOne(wrapper);
    }


}
