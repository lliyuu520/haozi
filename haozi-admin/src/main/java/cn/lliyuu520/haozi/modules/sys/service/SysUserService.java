package cn.lliyuu520.haozi.modules.sys.service;

import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.dto.SysUserDTO;
import cn.lliyuu520.haozi.modules.sys.dto.SysUserPasswordDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import cn.lliyuu520.haozi.modules.sys.query.SysUserQuery;
import cn.lliyuu520.haozi.modules.sys.vo.SysUserVO;

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
