package cn.lliyuu520.haozi.modules.sys.service;

import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.BaseService;
import cn.lliyuu520.haozi.modules.sys.entity.SysDownloadCenter;
import cn.lliyuu520.haozi.modules.sys.query.SysDownloadCenterQuery;
import cn.lliyuu520.haozi.modules.sys.vo.SysDownloadCenterVO;

/**
 * 系统参数 服务接口
 *
 * @author Claude
 */
public interface SysDownloadCenterService extends BaseService<SysDownloadCenter> {

    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    PageVO<SysDownloadCenterVO> pageVO(SysDownloadCenterQuery query);

    /**
     *  增加下载次数
     * @param id
     */
    void addDownloadTimes(Long id);







}