package com.haozi.modules.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.impl.BaseServiceImpl;
import com.haozi.modules.sys.convert.SysDictDataConvert;
import com.haozi.modules.sys.dto.SysDictDataDTO;
import com.haozi.modules.sys.entity.SysDictData;
import com.haozi.modules.sys.mapper.SysDictDataMapper;
import com.haozi.modules.sys.query.SysDictDataQuery;
import com.haozi.modules.sys.service.SysDictDataService;
import com.haozi.modules.sys.vo.SysDictDataVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 数据字典
 *
 * @author lliyuu520
 */
@Service
@RequiredArgsConstructor
public class SysDictDataServiceImpl extends BaseServiceImpl<SysDictDataMapper, SysDictData> implements SysDictDataService {

    @Override
    public PageVO<SysDictDataVO> pageVO(final SysDictDataQuery query) {
        final IPage<SysDictData> page = baseMapper.selectPage(getPage(query), getWrapper(query));

        return PageVO.of(SysDictDataConvert.INSTANCE.convertList(page.getRecords()), page.getTotal());
    }

    private Wrapper<SysDictData> getWrapper(final SysDictDataQuery query) {
        final LambdaQueryWrapper<SysDictData> wrapper = new LambdaQueryWrapper<>();
        final String dictType = query.getDictType();
        if (StrUtil.isNotBlank(dictType)) {
            wrapper.eq(SysDictData::getDictType, dictType);
        }


        return wrapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(final SysDictDataDTO dto) {
        final SysDictData entity = SysDictDataConvert.INSTANCE.convertFromDTO(dto);

        save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOne(final SysDictDataDTO dto) {
        final SysDictData entity = SysDictDataConvert.INSTANCE.convertFromDTO(dto);

        updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(final Long id) {
        removeById(id);
    }

    /**
     * 查看
     *
     * @param dictType
     * @return
     */
    @Override
    public List<SysDictData> listByType(String dictType) {

        return baseMapper.listByType(dictType);
    }
}