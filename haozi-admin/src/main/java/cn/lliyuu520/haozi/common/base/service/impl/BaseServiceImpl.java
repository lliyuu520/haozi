package cn.lliyuu520.haozi.common.base.service.impl;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import cn.lliyuu520.haozi.common.base.query.BaseQuery;
import cn.lliyuu520.haozi.common.base.service.BaseService;


/**
 * 基础服务类，所有Service都要继承
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public class BaseServiceImpl<M extends BaseMapper<T>, T> extends ServiceImpl<M, T> implements BaseService<T> {


    /**
     * 获取分页对象
     *
     * @param baseQuery 分页参数
     */
    protected IPage<T> getPage(final BaseQuery baseQuery) {
        final Page<T> page = new Page<>(baseQuery.getCurrent(), baseQuery.getPageSize());


        return page;
    }


}
