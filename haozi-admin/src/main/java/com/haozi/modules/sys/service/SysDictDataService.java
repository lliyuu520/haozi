package com.haozi.modules.sys.service;


import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.dto.SysDictDataDTO;
import com.haozi.modules.sys.entity.SysDictData;
import com.haozi.modules.sys.query.SysDictDataQuery;
import com.haozi.modules.sys.vo.SysDictDataVO;

import java.util.List;

/**
 * 数据字典
 *
 * @author lliyuu520
 */
public interface SysDictDataService extends BaseService<SysDictData> {
    /**
     * 分页
     * @param query
     * @return
     */
    PageVO<SysDictDataVO> pageVO(SysDictDataQuery query);

    /**
     * 报错
     * @param dto
     */
    void saveOne(SysDictDataDTO dto);

    /**
     * 修改
     * @param dto
     */
    void updateOne(SysDictDataDTO dto);

    /**
     * 删除
     * @param id
     */
    void deleteById(Long id);

    /**
     * 查看
     * @param dictType
     * @return
     */
    List<SysDictData> listByType(String dictType);
}