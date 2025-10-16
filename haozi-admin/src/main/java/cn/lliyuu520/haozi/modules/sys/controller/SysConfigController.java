package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.modules.sys.convert.SysConfigConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysConfigDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysConfig;
import cn.lliyuu520.haozi.modules.sys.query.SysConfigQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysConfigService;
import cn.lliyuu520.haozi.modules.sys.vo.SysConfigVO;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统参数 控制器
 *
 * @author Claude
 */
@RestController
@RequestMapping("/sys/config")
@RequiredArgsConstructor
public class SysConfigController {

    private final SysConfigService sysConfigService;

    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    @GetMapping("/page")
    @SaCheckPermission("sys:config:page")
    public Result<PageVO<SysConfigVO>> page(SysConfigQuery query) {
        final PageVO<SysConfigVO> page = sysConfigService.pageVO(query);
        return Result.ok(page);
    }

    /**
     * 获取信息
     *
     * @param id
     * @return
     */
    @GetMapping("/info")
    @SaCheckPermission("sys:config:info")
    public Result<SysConfigVO> info(@RequestParam Long id) {
        final SysConfigVO sysConfig = SysConfigConvert.INSTANCE.convertToVO(sysConfigService.getById(id));
        return Result.ok(sysConfig);
    }

    /**
     * 新增
     *
     * @param sysConfigDTO
     * @return
     */
    @PostMapping
    @SaCheckPermission("sys:config:save")
    public Result<String> save(@RequestBody @Validated SysConfigDTO sysConfigDTO) {
        sysConfigService.saveOne(sysConfigDTO);
        return Result.ok();
    }

    /**
     * 编辑
     *
     * @param sysConfigDTO
     * @return
     */
    @PutMapping
    @SaCheckPermission("sys:config:update")
    public Result<String> update(@RequestBody @Validated SysConfigDTO sysConfigDTO) {
        sysConfigService.updateOne(sysConfigDTO);
        return Result.ok();
    }

    /**
     * 删除
     *
     * @param id
     * @return
     */
    @DeleteMapping
    @SaCheckPermission("sys:config:delete")
    public Result<String> delete(Long id) {
        sysConfigService.deleteIds(id);
        return Result.ok();
    }

    /**
     * 根据编码获取系统参数
     *
     * @param code
     * @return
     */
    @GetMapping("/code/{code}")
    public Result<SysConfig> getByCode(@PathVariable String code) {
        final SysConfig sysConfig = sysConfigService.getByCode(code);
        return Result.ok(sysConfig);
    }

    /**
     *  获取所有系统参数
     * @return
     */
    @GetMapping("/list")
    public Result<List<SysConfig>> list() {
        final List<SysConfig> list = sysConfigService.list();
        return Result.ok(list);
    }
}