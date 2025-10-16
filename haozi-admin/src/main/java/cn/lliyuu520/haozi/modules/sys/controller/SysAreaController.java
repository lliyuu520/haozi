package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.modules.sys.entity.SysArea;
import cn.lliyuu520.haozi.modules.sys.service.SysAreaService;
import cn.lliyuu520.haozi.modules.sys.vo.SysAreaNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * 行政区划 控制层
 *
 * @author lliyuu520
 */
@RestController
@RequestMapping("/sys/area")
@RequiredArgsConstructor
@SaIgnore
public class SysAreaController {
    private final SysAreaService sysAreaService;


    /**
     * allNode
     */
    @GetMapping("/allNode")
    public Result<List<SysAreaNode>> allNode() {
        final List<SysAreaNode> allNode = sysAreaService.getAllNode();
        return Result.ok(allNode);
    }

    /**
     * 新增
     * @param sysArea
     * @return
     */
    @PostMapping("/saveOne")
    public Result<Void> saveOne(@RequestBody SysArea sysArea) {
        sysAreaService.saveOne(sysArea);
        return Result.ok();
    }
    /**
     * 修改
     * @param sysArea
     * @return
     */
    @PostMapping("/updateOne")
    public Result<Void> updateOne(@RequestBody SysArea sysArea) {
        sysAreaService.updateOne(sysArea);
        return Result.ok();
    }

    /**
     *  删除
     * @param code
     * @return
     */
    @PostMapping("/deleteOne/{code}")
    public Result<Void> deleteOne(@PathVariable String code) {
        sysAreaService.deleteOneByCode(code);
        return Result.ok();
    }


}
