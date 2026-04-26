package com.haozi.modules.monitor.controller;


import cn.dev33.satoken.annotation.SaCheckPermission;
import com.haozi.common.utils.Result;
import com.haozi.modules.monitor.model.*;
import com.haozi.modules.monitor.vo.Server;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 服务器监控
 *
 * @author Pure tea
 */
@RestController
@RequestMapping("/monitor/server")
public class ServerController {

    /**
     * 服务器相关信息
     */
    @GetMapping("info")
    @SaCheckPermission("monitor:server:all")
    public Result<Server> getServerInfo() {
        Server server = new Server();
        return Result.ok(server);
    }

    /**
     * CPU相关信息
     */
    @GetMapping("cpu")
    @SaCheckPermission("monitor:server:all")
    public Result<Cpu> getCpuInfo() {
        Cpu cpu = new Cpu();
        return Result.ok(cpu);
    }

    /**
     * 内存相关信息
     */
    @GetMapping("mem")
    @SaCheckPermission("monitor:server:all")
    public Result<Mem> getMemInfo() {
        Mem mem = new Mem();
        return Result.ok(mem);
    }

    /**
     * JVM相关信息
     */
    @GetMapping("jvm")
    @SaCheckPermission("monitor:server:all")
    public Result<Jvm> getJvmInfo() {
        Jvm jvm = new Jvm();
        return Result.ok(jvm);
    }

    /**
     * 系统相关信息
     */
    @GetMapping("sys")
    @SaCheckPermission("monitor:server:all")
    public Result<Sys> getSysInfo() {
        Sys sys = new Sys();
        return Result.ok(sys);
    }

    /**
     * 系统文件相关信息
     */
    @GetMapping("disk")
    @SaCheckPermission("monitor:server:all")
    public Result<List<Disk>> getSysFileInfo() {
        Server server = new Server(new Disk());
        return Result.ok(server.getDisks());
    }

}
