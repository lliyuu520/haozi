package cn.lliyuu520.haozi.modules.sys.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.mapper.IBaseMapper;
import cn.lliyuu520.haozi.modules.sys.entity.SysArea;
import cn.lliyuu520.haozi.modules.sys.vo.SysAreaVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;


/**
 * 行政区域
 *
 * @author lliyuu520
 */
@Repository
public interface SysAreaMapper extends IBaseMapper<SysArea> {

    /**
     * 获取地址位置信息 街道
     */
    SysAreaVO getByTownAdcode(@Param("adcode") String adcode);


    /**
     * 获取地址位置信息  直管县
     *
     * @param adcode
     * @return
     */
    SysAreaVO getByCityAdcode(@Param("adcode") String adcode);

    /**
     * 获取地址位置信息  市管县
     *
     * @param adcode
     * @return
     */
    SysAreaVO getByDistrictAdcode(@Param("adcode") String adcode);


    /**
     * 获取省
     *
     * @param adcode
     * @return
     */
    SysAreaVO getByProvinceAdcode(@Param("adcode") String adcode);

    /**
     * getByCode
     *
     * @param code
     * @return
     */
    default SysArea getByCode(final String code) {
        final LambdaQueryWrapper<SysArea> lambdaQuery = Wrappers.lambdaQuery();
        lambdaQuery.eq(SysArea::getCode, code);
        return selectOne(lambdaQuery);
    }

    /**
     *  删除
     * @param code
     */
    void deleteByCode(String code);
}
