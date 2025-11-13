package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.dev33.satoken.secure.SaSecureUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.comparator.CompareUtil;
import cn.hutool.core.util.StrUtil;
import cn.lliyuu520.haozi.common.constant.Constant;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.convert.SysUserConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysUserDTO;
import cn.lliyuu520.haozi.modules.sys.dto.SysUserPasswordDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysUser;
import cn.lliyuu520.haozi.modules.sys.mapper.SysUserMapper;
import cn.lliyuu520.haozi.modules.sys.query.SysUserQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysUserRoleService;
import cn.lliyuu520.haozi.modules.sys.service.SysUserService;
import cn.lliyuu520.haozi.modules.sys.vo.SysUserVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Service
@AllArgsConstructor
@Slf4j
public class SysUserServiceImpl extends BaseServiceImpl<SysUserMapper, SysUser> implements SysUserService {
    private final SysUserRoleService sysUserRoleService;

    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    @Override
    public PageVO<SysUserVO> page(SysUserQuery query) {
        // 查询参数

        final IPage<SysUser> page = page(getPage(query), buildWrapper(query));
        final List<SysUserVO> voList = SysUserConvert.INSTANCE.convertList(page.getRecords());
        voList.forEach(vo -> {
            final Long userId = vo.getId();
            final List<Long> roleIdList = sysUserRoleService.getRoleIdList(userId);
            vo.setRoleIdList(roleIdList);
        });

        return PageVO.of(voList, page);
    }

    /**
     * 构建查询条件
     *
     * @param query
     * @return
     */
    private LambdaQueryWrapper<SysUser> buildWrapper(SysUserQuery query) {
        final LambdaQueryWrapper<SysUser> queryWrapper = Wrappers.lambdaQuery();
        final String username = query.getUsername();
        if (StrUtil.isNotBlank(username)) {
            queryWrapper.like(SysUser::getUsername, username);
        }

        final Boolean enabled = query.getEnabled();
        if (enabled != null) {
            queryWrapper.eq(SysUser::getEnabled, enabled);
        }
        queryWrapper.orderByAsc(SysUser::getId);
        return queryWrapper;

    }

    /**
     * 保存用户
     *
     * @param sysUserDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(SysUserDTO sysUserDTO) {
        SysUser entity = SysUserConvert.INSTANCE.convertFromDTO(sysUserDTO);

        // 判断用户名是否存在
        final String username = entity.getUsername();
        SysUser user = baseMapper.getByUsername(username);
        if (user != null) {
            log.error("用户名已经存在:{}", username);
            throw new BaseException("用户名已经存在:{}",username);
        }
        final String password = sysUserDTO.getPassword();
        final String shaed256 = SaSecureUtil.sha256(password);
        entity.setPassword(shaed256);

        // 保存用户
        baseMapper.insert(entity);

        // 保存用户角色关系
        sysUserRoleService.saveOrUpdate(entity.getId(), sysUserDTO.getRoleIdList());


    }

    /**
     * 编辑用户
     *
     * @param sysUserDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOne(SysUserDTO sysUserDTO) {

        final String username = sysUserDTO.getUsername();

        final Long userId = sysUserDTO.getId();
        // 判断用户名是否存在
        SysUser userDB = baseMapper.getByUsername(username);
        if (userDB != null) {
            final Long userDBId = userDB.getId();
            final int compare = CompareUtil.compare(userDBId, userId);
            if (compare != 0) {
                log.error("用户名已经存在:{}", username);
                log.error("userDBId:{},userId:{}", userDBId,userId);
                throw new BaseException("用户名已经存在");
            }
        }
        final SysUser sysUser = getById(userId);
        if (sysUser == null) {
            throw new BaseException("用户不存在");
        }
        sysUser.setUsername(sysUserDTO.getUsername());
        final String password = sysUserDTO.getPassword();
        if (StrUtil.isNotBlank(password)) {
            sysUser.setPassword(SaSecureUtil.sha256(password));
        }
        updateById(sysUser);
        // 更新用户角色关系
        final List<Long> roleIdList = sysUserDTO.getRoleIdList();
        sysUserRoleService.saveOrUpdate(userId, roleIdList);


    }

    /**
     * 删除用户
     *
     * @param id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOne(Long id) {
        // 删除用户
        removeById(id);
        // 删除用户角色关系
        sysUserRoleService.deleteByUserId(id);
        SysUserUtil.logout(id);



    }

    /**
     * 修改密码
     *
     * @param sysUserPasswordDTO 新密码
     */
    @Override
    public void updatePassword(SysUserPasswordDTO sysUserPasswordDTO) {
        // 修改密码
        final Long userId = sysUserPasswordDTO.getId();
        final String newPassword = sysUserPasswordDTO.getNewPassword();
        SysUser user = getById(userId);
        if (user == null) {
            log.error("用户不存在:{}", userId);
            throw new BaseException("用户不存在");
        }
        final String shaed256 = SaSecureUtil.sha256(newPassword);
        user.setPassword(shaed256);

        updateById(user);
        // 修改密码需要强制下线
        SysUserUtil.logout(userId);

    }

    /**
     * 重置密码
     *
     * @param id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resetPassword(Long id) {
        final SysUser user = getById(id);
        if (user == null) {
            log.error("用户不存在:{}", id);
            throw new BaseException("用户不存在");
        }
        user.setPassword(SaSecureUtil.sha256(Constant.DEFAULT_PASSWORD));
        updateById(user);

    }
}
