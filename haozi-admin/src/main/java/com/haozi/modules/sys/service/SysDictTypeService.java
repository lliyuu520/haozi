package com.haozi.modules.sys.service;


import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.dto.SysDictTypeDTO;
import com.haozi.modules.sys.entity.SysDictType;
import com.haozi.modules.sys.query.SysDictTypeQuery;
import com.haozi.modules.sys.vo.SysDictTypeVO;
import com.haozi.modules.sys.vo.SysDictVO;

import java.util.List;

/**
 * 数据字典
 *
 * @author lliyuu520
 */
public interface SysDictTypeService extends BaseService<SysDictType> {

    PageVO<SysDictTypeVO> pageVO(SysDictTypeQuery query);

    void saveOne(SysDictTypeDTO dto);

    void updateOne(SysDictTypeDTO dto);

    void deleteById(Long id);

    /**
     * 获取全部字典列表
     */
    List<SysDictVO> getDictList();

}