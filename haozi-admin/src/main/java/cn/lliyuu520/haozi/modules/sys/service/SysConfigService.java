package cn.lliyuu520.haozi.modules.sys.service;

import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.dto.SysConfigDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysConfig;
import cn.lliyuu520.haozi.modules.sys.query.SysConfigQuery;
import cn.lliyuu520.haozi.modules.sys.vo.SysConfigVO;

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