package cn.lliyuu520.haozi.modules.sys.service;


import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.dto.SysDictDataDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictData;
import cn.lliyuu520.haozi.modules.sys.query.SysDictDataQuery;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictDataVO;

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