package cn.lliyuu520.haozi.modules.sys.service;


import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.dto.SysDictTypeDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictType;
import cn.lliyuu520.haozi.modules.sys.query.SysDictTypeQuery;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictTypeVO;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictVO;

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