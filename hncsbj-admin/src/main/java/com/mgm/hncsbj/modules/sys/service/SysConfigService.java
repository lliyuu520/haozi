package com.mgm.hncsbj.modules.sys.service;

import com.mgm.hncsbj.common.base.page.PageVO;
import com.mgm.hncsbj.common.base.service.BaseService;
import com.mgm.hncsbj.modules.sys.dto.SysConfigDTO;
import com.mgm.hncsbj.modules.sys.entity.SysConfig;
import com.mgm.hncsbj.modules.sys.query.SysConfigQuery;
import com.mgm.hncsbj.modules.sys.vo.SysConfigVO;

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