package cn.lliyuu520.haozi.modules.sys.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 用户
 *
 * @author lliyuu520
 */
@Data
public class SysAreaVO implements Serializable {
    /**
     * 定位
     */
    private String location;
    /**
     * 省份编码
     */
    private String provinceCode;
    /**
     * 省份名称
     */
    private String provinceName;
    /**
     * 城市编码
     */
    private String cityCode;

    /**
     * 城市名称
     */
    private String cityName;
    /**
     * 区名称
     */
    private String districtName;

    /**
     * 区编码
     */
    private String districtCode;
    /**
     * 街道编码
     */
    private String townCode;

    /**
     * 街道编码
     */
    private String townName;
    /**
     * adcode 地理代码
     */
    private String adcode;

    /**
     * 地址
     */
    private String formattedAddress;



}
