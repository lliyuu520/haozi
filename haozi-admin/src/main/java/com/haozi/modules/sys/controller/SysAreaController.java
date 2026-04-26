package com.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import com.haozi.common.utils.Result;
import com.haozi.modules.sys.entity.SysArea;
import com.haozi.modules.sys.service.SysAreaService;
import com.haozi.modules.sys.vo.SysAreaNode;
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
     * 刷新缓存
     */
    @PostMapping("/refreshCache")
    public Result<Void> refreshCache() {
        sysAreaService.refreshCache();
        return Result.ok();
    }


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
