package com.haozi.modules.monitor.vo;

import com.haozi.modules.monitor.model.*;
import com.haozi.modules.monitor.utils.ArityUtil;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import oshi.SystemInfo;
import oshi.software.os.FileSystem;
import oshi.software.os.OSFileStore;

import java.util.LinkedList;
import java.util.List;

/**
 * Server Info
 *
 * @author Pure tea
 */
@Data
@Slf4j
public class Server {

    /**
     * Cpu Info
     */
    private Cpu cpu;

    /**
     * Mem Info
     */
    private Mem mem;

    /**
     * Jvm Info
     */
    private Jvm jvm;

    /**
     * Sys Info
     */
    private Sys sys;

    /**
     * SysFile Info
     */
    private List<Disk> disks = new LinkedList<>();

    public Server() {
        this.cpu = new Cpu();
        this.mem = new Mem();
        this.jvm = new Jvm();
        this.sys = new Sys();
        this.setDiskList();
        log.debug("Server Info => {}", this);
    }

    public Server(Disk disk) {
        this.setDiskList();
        log.debug("Server Info => {}", this);
    }

    /**
     * 字节转换
     *
     * @param size 字节大小
     * @return 转换后值
     */
    public static String convertFileSize(long size) {
        long kb = 1024;
        long mb = kb * 1024;
        long gb = mb * 1024;
        if (size >= gb) {
            return String.format("%.1f GB", (float) size / gb);
        } else if (size >= mb) {
            float f = (float) size / mb;
            return String.format(f > 100 ? "%.0f MB" : "%.1f MB", f);
        } else if (size >= kb) {
            float f = (float) size / kb;
            return String.format(f > 100 ? "%.0f KB" : "%.1f KB", f);
        } else {
            return String.format("%d B", size);
        }
    }

    /**
     * 设置磁盘信息
     */
    private void setDiskList() {
        SystemInfo systemInfo = new SystemInfo();
        FileSystem fileSystem = systemInfo.getOperatingSystem().getFileSystem();
        List<OSFileStore> fsArray = fileSystem.getFileStores();
        for (OSFileStore fs : fsArray) {
            long free = fs.getUsableSpace();
            long total = fs.getTotalSpace();
            long used = total - free;
            Disk disk = new Disk();
            disk.setDiskName(fs.getName());
            disk.setDiskType(fs.getType());
            disk.setDirName(fs.getMount());
            disk.setTotal(convertFileSize(total));
            disk.setFree(convertFileSize(free));
            disk.setUsed(convertFileSize(used));
            disk.setUsage(ArityUtil.mul(ArityUtil.div(used, total, 4), 100));
            this.disks.add(disk);
        }
    }

}
