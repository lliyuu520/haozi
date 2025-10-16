package cn.lliyuu520.haozi.modules.sys.controller;

import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.modules.sys.query.SysDownloadCenterQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysDownloadCenterService;
import cn.lliyuu520.haozi.modules.sys.vo.SysDownloadCenterVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 下载中心 控制器
 *
 * @author Claude
 */
@RestController
@RequestMapping("/sys/download-center")
@RequiredArgsConstructor
public class SysDownloadCenterController {

    private final SysDownloadCenterService sysDownloadCenterService;

    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    @GetMapping("/page")
    public Result<PageVO<SysDownloadCenterVO>> page(SysDownloadCenterQuery query) {
        final PageVO<SysDownloadCenterVO> page = sysDownloadCenterService.pageVO(query);
        return Result.ok(page);
    }

    /**
     * 添加下载次数
     */
    @PostMapping("/add-download-times/{id}")
    public Result<String> addDownloadTimes(@PathVariable Long id) {
        sysDownloadCenterService.addDownloadTimes(id);
        return Result.ok();
    }


}