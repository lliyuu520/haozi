package com.haozi.modules.sys.service;

import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.dto.SysConfigDTO;
import com.haozi.modules.sys.entity.SysConfig;
import com.haozi.modules.sys.query.SysConfigQuery;
import com.haozi.modules.sys.vo.SysConfigVO;

/**
 * 系统参数 服务接口
 *
 * @author Claude
 */
public interface SysConfigService extends BaseService<SysConfig> {
    
    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    PageVO<SysConfigVO> pageVO(SysConfigQuery query);

    /**
     * 新增
     *
     * @param sysConfigDTO
     */
    void saveOne(SysConfigDTO sysConfigDTO);

    /**
     * 编辑
     *
     * @param sysConfigDTO
     */
    void updateOne(SysConfigDTO sysConfigDTO);

    /**
     * 删除
     *
     * @param id
     */
    void deleteIds(Long id);

    /**
     * 根据编码获取系统参数
     *
     * @param code
     * @return
     */
    SysConfig getByCode(String code);

    /**
     *  初始化系统参数
     */
    void init();
}