package com.haozi.modules.sys.service;

import com.haozi.common.base.page.PageVO;
import com.haozi.common.base.service.BaseService;
import com.haozi.modules.sys.entity.SysLog;
import com.haozi.modules.sys.query.SysLogQuery;
/**
 * 系统日志服务接口
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public interface SysLogService extends BaseService<SysLog> {

  
    /**
     * 分页查询
     *
     * @param sysLogQuery 日志查询条件
     * @return 日志列表
     */
    PageVO<SysLog> pageVO(SysLogQuery sysLogQuery);
}
