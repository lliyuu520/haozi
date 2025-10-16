package cn.lliyuu520.haozi.common.utils;

import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import cn.lliyuu520.haozi.common.config.ProjectConfiguration;
import cn.lliyuu520.haozi.common.vo.GeoResponseJsonVO;
import cn.lliyuu520.haozi.modules.sys.entity.SysArea;
import cn.lliyuu520.haozi.modules.sys.mapper.SysAreaMapper;
import cn.lliyuu520.haozi.modules.sys.vo.SysAreaVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * @author liliangyu
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AreaUtil {

    /**
     * 省级
     */
    public static final int PROVINCE_LEVEL = 1;
    /**
     * 市级
     */
    public static final int CITY_LEVEL = 2;
    /**
     * 区级
     */
    public static final int AREA_LEVEL = 3;

    /**
     * 街道
     */
    public static final int TOWN_LEVEL = 4;

    /**
     * 逆地址解析
     */
    private static final String AMAP_GEO_URL = "https://restapi.amap.com/v3/geocode/regeo?location={}&key={}";

    private final ProjectConfiguration projectConfiguration;

    private final SysAreaMapper sysAreaMapper;






    /**
     * 通过经纬度查询 地址位置信息
     * </br>
     *
     * @param location 定位
     * @return
     */
    public SysAreaVO getByLocation(String location) {
        SysAreaVO sysAreaVO = new SysAreaVO();

        sysAreaVO.setLocation(location);
        if (StrUtil.equals("undefined,undefined", location) || StrUtil.isBlank(location)) {
            return sysAreaVO;
        }

        final String amapKey = projectConfiguration.getAmapKey();
        final String url = StrUtil.format(AMAP_GEO_URL, location, amapKey);

        final String jsonString = HttpUtil.get(url);
        final GeoResponseJsonVO cityResponseVO = JSONUtil.toBean(jsonString, GeoResponseJsonVO.class);

        if (StrUtil.equals(GeoResponseJsonVO.SUCCESS_STATUS, cityResponseVO.getStatus()) && StrUtil.equals(GeoResponseJsonVO.SUCCESS_INFO_CODE, cityResponseVO.getInfoCode()) && StrUtil.equals(GeoResponseJsonVO.SUCCESS_INFO, cityResponseVO.getInfo())) {
            //当且仅当
            final GeoResponseJsonVO.Regeocode regeocode = cityResponseVO.getRegeocode();
            if (regeocode != null) {
                final String formattedAddress = regeocode.getFormattedAddress();
                final GeoResponseJsonVO.Regeocode.AddressComponent addressComponent = regeocode.getAddressComponent();
                if (addressComponent != null) {
                    final String townCode = addressComponent.getTownCode();
                    final String adcodeTmp = addressComponent.getAdcode();
                    final String townShip = addressComponent.getTownShip();
                    final String adcode = StrUtil.sub(townCode, 0, 9);
                    final int length = StrUtil.length(adcode);
                    if (length != 9) {
                        log.error("无法识别的街道信息:{}", townCode);
                        sysAreaVO.setFormattedAddress(formattedAddress);
                        return sysAreaVO;
                    }

                    SysArea city = sysAreaMapper.getByCode(adcode);
                    if (city == null) {
                        log.warn("通过adcode:{}未查询到对应的地区信息,location:{}", adcode, location);
                        // 插入解析的数据
                        final SysArea sysArea = new SysArea();
                        sysArea.setLevel(AreaUtil.TOWN_LEVEL);
                        sysArea.setCode(adcode);
                        sysArea.setId(Long.parseLong(adcode));
                        sysArea.setName(townShip);
                        sysArea.setParentCode(adcodeTmp);
                        sysAreaMapper.insert(sysArea);
                        city = sysArea;
                    }

                    final Integer level = city.getLevel();
                    if (level == PROVINCE_LEVEL) {
                        sysAreaVO = sysAreaMapper.getByProvinceAdcode(adcode);
                    }
                    if (level == CITY_LEVEL) {
                        sysAreaVO = sysAreaMapper.getByCityAdcode(adcode);
                    }
                    if (level == AREA_LEVEL) {
                        sysAreaVO = sysAreaMapper.getByDistrictAdcode(adcode);
                    }
                    if (level == TOWN_LEVEL) {
                        sysAreaVO = sysAreaMapper.getByTownAdcode(adcode);
                    }

                    sysAreaVO.setAdcode(adcode);
                    sysAreaVO.setFormattedAddress(formattedAddress);
                }
            }

        } else {
            log.error("通过高德逆地址解析失败,请求url:{},返回结果:{}", url, jsonString);
        }

        return sysAreaVO;
    }


}
