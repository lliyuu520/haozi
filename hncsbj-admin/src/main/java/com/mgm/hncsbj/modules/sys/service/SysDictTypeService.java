package com.mgm.hncsbj.modules.sys.service;


import com.mgm.hncsbj.common.base.page.PageVO;
import com.mgm.hncsbj.common.base.service.BaseService;
import com.mgm.hncsbj.modules.sys.dto.SysDictTypeDTO;
import com.mgm.hncsbj.modules.sys.entity.SysDictType;
import com.mgm.hncsbj.modules.sys.query.SysDictTypeQuery;
import com.mgm.hncsbj.modules.sys.vo.SysDictTypeVO;
import com.mgm.hncsbj.modules.sys.vo.SysDictVO;

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