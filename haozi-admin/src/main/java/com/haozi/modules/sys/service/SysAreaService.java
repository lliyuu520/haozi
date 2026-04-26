package com.haozi.modules.sys.service;

import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.entity.SysArea;
import com.haozi.modules.sys.vo.SysAreaNode;

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

    /**
     *  刷新缓存
     */
    void refreshCache();
}
