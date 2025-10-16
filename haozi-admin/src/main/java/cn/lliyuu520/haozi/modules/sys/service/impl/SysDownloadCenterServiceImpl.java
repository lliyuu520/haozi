package cn.lliyuu520.haozi.modules.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.convert.SysDownloadCenterConvert;
import cn.lliyuu520.haozi.modules.sys.entity.SysDownloadCenter;
import cn.lliyuu520.haozi.modules.sys.mapper.SysDownloadCenterMapper;
import cn.lliyuu520.haozi.modules.sys.query.SysDownloadCenterQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysDownloadCenterService;
import cn.lliyuu520.haozi.modules.sys.vo.SysDownloadCenterVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 系统参数服务实现
 *
 * @author Claude
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SysDownloadCenterServiceImpl extends BaseServiceImpl<SysDownloadCenterMapper, SysDownloadCenter> implements SysDownloadCenterService {


    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    @Override
    public PageVO<SysDownloadCenterVO> pageVO(SysDownloadCenterQuery query) {
        final IPage<SysDownloadCenter> page = page(getPage(query), buildWrapper(query));

        // 转换为VO并返回
        return PageVO.of(SysDownloadCenterConvert.INSTANCE.convertToVOList(page.getRecords()), page.getTotal());
    }

    /**
     * 增加下载次数
     *
     * @param id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addDownloadTimes(Long id) {
        final SysDownloadCenter sysDownloadCenter = getById(id);
        sysDownloadCenter.setDownloadTimes(sysDownloadCenter.getDownloadTimes() + 1);
        updateById(sysDownloadCenter);

    }

    /**
     * 构建查询条件
     *
     * @param query
     * @return
     */
    private LambdaQueryWrapper<SysDownloadCenter> buildWrapper(SysDownloadCenterQuery query) {
        final LambdaQueryWrapper<SysDownloadCenter> queryWrapper = Wrappers.lambdaQuery();

        final Long creator = SysUserUtil.getUserInfo().getId();
        queryWrapper.eq(SysDownloadCenter::getCreator, creator);
        queryWrapper.orderByDesc(SysDownloadCenter::getId);
        return queryWrapper;
    }

}