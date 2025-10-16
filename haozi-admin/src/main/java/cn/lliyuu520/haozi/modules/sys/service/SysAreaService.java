package cn.lliyuu520.haozi.modules.sys.service;

import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.entity.SysArea;
import cn.lliyuu520.haozi.modules.sys.vo.SysAreaNode;

import java.util.List;

/**
 * 行政区划 接口
 *
 * @author lliyuu520
 */
public interface SysAreaService extends BaseService<SysArea> {

    /**
     * 所有节点
     * @return
     */
    List<SysAreaNode> getAllNode();

    /**
     *  保存
     * @param sysArea
     */
    void saveOne(SysArea sysArea);

    /**
     *  修改
     * @param sysArea
     */
    void updateOne(SysArea sysArea);

    /**
     *  删除
     * @param code
     */
    void deleteOneByCode(String code);


}
