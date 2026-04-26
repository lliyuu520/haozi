package com.haozi.modules.sys.service;

import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.dto.SysUserDTO;
import com.haozi.modules.sys.dto.SysUserPasswordDTO;
import com.haozi.modules.sys.entity.SysUser;
import com.haozi.modules.sys.query.SysUserQuery;
import com.haozi.modules.sys.vo.SysUserVO;

;

/**
 * 用户管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public interface SysUserService extends BaseService<SysUser> {
    /**
     * 分页
     *
     * @param query
     * @return
     */
    PageVO<SysUserVO> page(SysUserQuery query);

    /**
     * 保存用户
     *
     * @param sysUserDTO
     */
    void saveOne(SysUserDTO sysUserDTO);

    /**
     * 更新用户
     *
     * @param sysUserDTO
     */
    void updateOne(SysUserDTO sysUserDTO);

    /**
     * 删除用户
     *
     * @param id
     */
    void deleteOne(Long id);


    /**
     * 修改密码
     *
     * @param sysUserPasswordDTO 新密码
     */
    void updatePassword(SysUserPasswordDTO sysUserPasswordDTO);




}
