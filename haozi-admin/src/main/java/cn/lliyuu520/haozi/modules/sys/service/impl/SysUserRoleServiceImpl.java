package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.modules.sys.entity.SysRole;
import cn.lliyuu520.haozi.modules.sys.entity.SysUserRole;
import cn.lliyuu520.haozi.modules.sys.mapper.SysRoleMapper;
import cn.lliyuu520.haozi.modules.sys.mapper.SysUserRoleMapper;
import cn.lliyuu520.haozi.modules.sys.service.SysUserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户角色关系
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Service
@RequiredArgsConstructor
public class SysUserRoleServiceImpl extends BaseServiceImpl<SysUserRoleMapper, SysUserRole> implements SysUserRoleService {
    private final SysRoleMapper sysRoleMapper;

    /**
     * 保存或更新
     *
     * @param userId     用户ID
     * @param roleIdList 角色ID列表
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOrUpdate(final Long userId, final List<Long> roleIdList) {
        // 数据库角色ID列表
        final List<Long> dbRoleIdList = this.getRoleIdList(userId);

        // 需要新增的角色ID
        final Collection<Long> insertRoleIdList = CollUtil.subtract(roleIdList, dbRoleIdList);
        if (CollUtil.isNotEmpty(insertRoleIdList)) {
            final List<SysUserRole> roleList = insertRoleIdList.stream().map(roleId -> {
                final SysUserRole entity = new SysUserRole();
                entity.setUserId(userId);
                entity.setRoleId(roleId);
                return entity;
            }).collect(Collectors.toList());

            // 批量新增
            this.saveBatch(roleList);
        }

        // 需要删除的角色ID
        final Collection<Long> deleteRoleIdList = CollUtil.subtract(dbRoleIdList, roleIdList);
        if (CollUtil.isNotEmpty(deleteRoleIdList)) {
            final LambdaQueryWrapper<SysUserRole> queryWrapper = new LambdaQueryWrapper<>();
            this.remove(queryWrapper.eq(SysUserRole::getUserId, userId).in(SysUserRole::getRoleId, deleteRoleIdList));
        }
    }

    /**
     * 保存用户角色关系
     *
     * @param roleId     角色ID
     * @param userIdList 用户ID列表
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveUserList(final Long roleId, final List<Long> userIdList) {
        final List<SysUserRole> list = userIdList.stream().map(userId -> {
            final SysUserRole entity = new SysUserRole();
            entity.setUserId(userId);
            entity.setRoleId(roleId);
            return entity;
        }).collect(Collectors.toList());

        // 批量新增
        this.saveBatch(list);
    }

    @Override
    public void deleteByRoleId(final Long roleId) {
        this.remove(new LambdaQueryWrapper<SysUserRole>().eq(SysUserRole::getRoleId, roleId));
    }

    /**
     * 删除用户角色关系
     *
     * @param userId
     */
    @Override
    public void deleteByUserId(final Long userId) {
        this.remove(Wrappers.<SysUserRole>lambdaQuery().eq(SysUserRole::getUserId, userId));
    }

    @Override
    public void deleteByUserId(final Long roleId, final List<Long> userIdList) {
        final LambdaQueryWrapper<SysUserRole> queryWrapper = new LambdaQueryWrapper<>();
        this.remove(queryWrapper.eq(SysUserRole::getRoleId, roleId).in(SysUserRole::getUserId, userIdList));
    }

    @Override
    public List<Long> getRoleIdList(final Long userId) {
        return this.baseMapper.getRoleIdList(userId);
    }

    /**
     * 角色列表
     *
     * @param userId
     * @return
     */
    @Override
    public List<String> getRoleNameList(Long userId) {
        List<Long> roleIdList = baseMapper.getRoleIdList(userId);
        if (CollUtil.isNotEmpty(roleIdList)) {
            return sysRoleMapper.selectByIds(roleIdList).stream().map(SysRole::getName).collect(Collectors.toList());
        }
        return CollUtil.newArrayList();
    }
}
