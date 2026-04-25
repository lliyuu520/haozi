package com.mgm.hncsbj.modules.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mgm.hncsbj.common.base.page.PageVO;
import com.mgm.hncsbj.common.base.service.impl.BaseServiceImpl;
import com.mgm.hncsbj.common.cache.SysConfigCache;
import com.mgm.hncsbj.common.exception.BaseException;
import com.mgm.hncsbj.modules.sys.convert.SysConfigConvert;
import com.mgm.hncsbj.modules.sys.dto.SysConfigDTO;
import com.mgm.hncsbj.modules.sys.entity.SysConfig;
import com.mgm.hncsbj.modules.sys.mapper.SysConfigMapper;
import com.mgm.hncsbj.modules.sys.query.SysConfigQuery;
import com.mgm.hncsbj.modules.sys.service.SysConfigService;
import com.mgm.hncsbj.modules.sys.vo.SysConfigVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 系统参数服务实现
 *
 * @author Claude
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SysConfigServiceImpl extends BaseServiceImpl<SysConfigMapper, SysConfig> implements SysConfigService {

    private final SysConfigCache sysConfigCache;

    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    @Override
    public PageVO<SysConfigVO> pageVO(SysConfigQuery query) {
        final IPage<SysConfig> page = page(getPage(query), buildWrapper(query));

        // 转换为VO并返回
        return PageVO.of(SysConfigConvert.INSTANCE.convertToVOList(page.getRecords()), page.getTotal());
    }

    /**
     * 构建查询条件
     *
     * @param query
     * @return
     */
    private LambdaQueryWrapper<SysConfig> buildWrapper(SysConfigQuery query) {
        final LambdaQueryWrapper<SysConfig> queryWrapper = Wrappers.lambdaQuery();

        // 根据编码查询
        final String code = query.getCode();
        if (StrUtil.isNotBlank(code)) {
            queryWrapper.like(SysConfig::getCode, code);
        }
        // 根据类型查询
        final String type = query.getType();
        if (StrUtil.isNotBlank(type)) {
            queryWrapper.eq(SysConfig::getType, type);
        }
        // 默认按编码排序
        queryWrapper.orderByAsc(SysConfig::getCode);
        return queryWrapper;
    }

    /**
     * 保存系统参数
     *
     * @param sysConfigDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(SysConfigDTO sysConfigDTO) {
        final SysConfig entity = SysConfigConvert.INSTANCE.convertFromDTO(sysConfigDTO);

        // 检查编码是否已存在
        if (baseMapper.selectCount(Wrappers.<SysConfig>lambdaQuery().eq(SysConfig::getCode, entity.getCode())) > 0) {
            throw new BaseException("参数编码已存在：" + entity.getCode());
        }

        save(entity);
        sysConfigCache.set(entity);
    }

    /**
     * 编辑系统参数
     *
     * @param sysConfigDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOne(SysConfigDTO sysConfigDTO) {
        final SysConfig entity = SysConfigConvert.INSTANCE.convertFromDTO(sysConfigDTO);

        // 检查编码是否已存在（排除自己）
        if (baseMapper.selectCount(Wrappers.<SysConfig>lambdaQuery()
                .eq(SysConfig::getCode, entity.getCode())
                .ne(SysConfig::getId, entity.getId())) > 0) {
            throw new BaseException("参数编码已存在：" + entity.getCode());
        }

        updateById(entity);
        sysConfigCache.set(entity);
    }

    /**
     * 删除系统参数
     *
     * @param id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteIds(Long id) {
        final SysConfig sysConfig = getById(id);
        final String code = sysConfig.getCode();

        removeById(id);
        sysConfigCache.clean(code);
    }

    /**
     * 根据编码获取系统参数
     *
     * @param code
     * @return
     */
    @Override
    public SysConfig getByCode(String code) {
        return getOne(Wrappers.<SysConfig>lambdaQuery().eq(SysConfig::getCode, code));
    }

    /**
     * 初始化系统参数
     */
    @Override
    public void init() {
        sysConfigCache.clearAll();
        final List<SysConfig> sysConfigs = list();
        sysConfigs.forEach(sysConfigCache::set);

    }
}