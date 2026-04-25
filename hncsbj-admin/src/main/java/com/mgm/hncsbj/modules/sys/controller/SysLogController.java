package com.mgm.hncsbj.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.mgm.hncsbj.common.base.page.PageVO;
import com.mgm.hncsbj.common.utils.Result;
import com.mgm.hncsbj.modules.sys.entity.SysLog;
import com.mgm.hncsbj.modules.sys.query.SysLogQuery;
import com.mgm.hncsbj.modules.sys.service.SysLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sys/log")
@RequiredArgsConstructor
public class SysLogController {

    private final SysLogService sysLogService;

    /**
     * @param query
     * @return
     */
    @GetMapping("/page")
    @SaCheckPermission(value = "sys:log:page")
    public Result<PageVO<SysLog>> page(SysLogQuery query) {
        PageVO<SysLog> page = sysLogService.pageVO(query);

        return Result.ok(page);
    }
    /**
     * @param id
     * @return
     */
    @GetMapping("/info")
    @SaCheckPermission(value = "sys:log:info")
    public Result<SysLog> info(Long id) {
        SysLog log = sysLogService.getById(id);

        return Result.ok(log);
    }


}
