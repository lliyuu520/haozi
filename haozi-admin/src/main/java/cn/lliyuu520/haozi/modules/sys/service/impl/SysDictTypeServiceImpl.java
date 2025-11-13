package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.modules.sys.convert.SysDictTypeConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysDictTypeDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictData;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictType;
import cn.lliyuu520.haozi.modules.sys.mapper.SysDictDataMapper;
import cn.lliyuu520.haozi.modules.sys.mapper.SysDictTypeMapper;
import cn.lliyuu520.haozi.modules.sys.query.SysDictTypeQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysDictTypeService;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictTypeVO;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 字典类型
 *
 * @author lliyuu520
 */
@Service
@RequiredArgsConstructor
public class SysDictTypeServiceImpl extends BaseServiceImpl<SysDictTypeMapper, SysDictType> implements SysDictTypeService {
    private final SysDictDataMapper sysDictDataMapper;

    @Override
    public PageVO<SysDictTypeVO> pageVO(final SysDictTypeQuery query) {
        final IPage<SysDictType> page = baseMapper.selectPage(getPage(query), getWrapper(query));
        return PageVO.of(SysDictTypeConvert.INSTANCE.convertList(page.getRecords()), page);
    }

    private Wrapper<SysDictType> getWrapper(final SysDictTypeQuery query) {
        final LambdaQueryWrapper<SysDictType> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StrUtil.isNotBlank(query.getDictType()), SysDictType::getDictType, query.getDictType());
        wrapper.like(StrUtil.isNotBlank(query.getDictName()), SysDictType::getDictName, query.getDictName());


        return wrapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(final SysDictTypeDTO dto) {
        final SysDictType entity = SysDictTypeConvert.INSTANCE.convertForDTO(dto);

        save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOne(final SysDictTypeDTO dto) {
        final SysDictType entity = SysDictTypeConvert.INSTANCE.convertForDTO(dto);

        updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Long id) {
        removeById(id);
    }

    @Override
    public List<SysDictVO> getDictList() {
        // 全部字典类型列表
        final List<SysDictType> typeList = list(Wrappers.emptyWrapper());

        // 全部字典数据列表
        final LambdaQueryWrapper<SysDictData> query = Wrappers.lambdaQuery();

        final List<SysDictData> dataList = sysDictDataMapper.selectList(query);

        // 全部字典列表
        final List<SysDictVO> dictList = new ArrayList<>(typeList.size());
        for (final SysDictType type : typeList) {
            final SysDictVO dict = new SysDictVO();
            dict.setDictType(type.getDictType());

            for (final SysDictData data : dataList) {
                if (StrUtil.equals(type.getDictType(), (data.getDictType()))) {
                    dict.getDataList().add(new SysDictVO.DictData().setDictLabel(data.getDictLabel()).setDictValue(data.getDictValue()));
                }
            }

            dictList.add(dict);
        }

        return dictList;
    }

}