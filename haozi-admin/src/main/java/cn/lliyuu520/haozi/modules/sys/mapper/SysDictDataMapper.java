package cn.lliyuu520.haozi.modules.sys.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.mapper.IBaseMapper;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictData;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 字典数据
 *
 * @author lliyuu520
 */
@Repository
public interface SysDictDataMapper extends IBaseMapper<SysDictData> {

    /**
     * 根据字典类型查询字典数据
     *
     * @param dictType
     * @return
     */
    default List<SysDictData> listByType(String dictType) {
        final LambdaQueryWrapper<SysDictData> lambdaQuery = Wrappers.lambdaQuery();
        lambdaQuery.eq(SysDictData::getDictType, dictType);
        return selectList(lambdaQuery);
    }

}
