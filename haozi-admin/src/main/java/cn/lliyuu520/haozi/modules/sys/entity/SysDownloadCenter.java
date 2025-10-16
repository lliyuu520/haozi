package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 下载中心
 *
 * @author liliangyu
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysDownloadCenter extends BaseEntity {
    /**
     * url
     */
    private String url;
    /**
     * 文件名
     */
    private String name;
    /**
     * 下载次数
     */
    private Integer downloadTimes;
    /**
     * 完成时间
     */
    private LocalDateTime completedDateTime;






}