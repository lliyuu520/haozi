package com.haozi.modules.sys.service;

import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.entity.SysDownloadCenter;
import com.haozi.modules.sys.query.SysDownloadCenterQuery;
import com.haozi.modules.sys.vo.SysDownloadCenterVO;

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