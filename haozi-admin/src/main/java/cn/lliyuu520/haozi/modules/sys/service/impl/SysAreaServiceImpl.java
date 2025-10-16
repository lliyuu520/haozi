package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.common.cache.SysAreaCache;
import cn.lliyuu520.haozi.common.exception.BaseException;
import cn.lliyuu520.haozi.modules.sys.entity.SysArea;
import cn.lliyuu520.haozi.modules.sys.mapper.SysAreaMapper;
import cn.lliyuu520.haozi.modules.sys.service.SysAreaService;
import cn.lliyuu520.haozi.modules.sys.vo.SysAreaNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 行政区划 接口实现
 *
 * @author lliyuu520
 */
@Service
@RequiredArgsConstructor
public class SysAreaServiceImpl extends BaseServiceImpl<SysAreaMapper, SysArea> implements SysAreaService {

    private final SysAreaCache sysAreaCache;

    /**
     * 刷新缓存
     */
    private List<SysAreaNode> refreshCache() {

        // 1. 一次性查询所有数据
        final List<SysArea> allAreas = list();

        // 2. 按 parentCode 分组
        final Map<String, List<SysArea>> areaMap = allAreas.stream().collect(Collectors.groupingBy(SysArea::getParentCode));

        // 3. 从根节点开始递归构建树
        final List<SysAreaNode> sysAreaNodeListDB = buildTree("0", areaMap);
        sysAreaCache.set(sysAreaNodeListDB);
        return sysAreaNodeListDB;
    }

    /**
     * 所有节点
     *
     * @return
     */
    @Override
    public List<SysAreaNode> getAllNode() {

        final List<SysAreaNode> sysAreaNodeList = sysAreaCache.get();
        if (CollUtil.isNotEmpty(sysAreaNodeList)) {
            return sysAreaNodeList;
        }

        return refreshCache();
    }

    /**
     * 递归构建区域树
     *
     * @param parentCode 父级编码
     * @param areaMap    按父级编码分组的区域数据
     * @return 子节点列表
     */
    private List<SysAreaNode> buildTree(final String parentCode, final Map<String, List<SysArea>> areaMap) {
        final List<SysArea> children = areaMap.get(parentCode);
        if (children == null || children.isEmpty()) {
            return Collections.emptyList();
        }

        return children.parallelStream().map(area -> {
            final SysAreaNode node = new SysAreaNode();
            node.setValue(area.getCode());
            node.setLabel(area.getName());
            node.setChildren(buildTree(area.getCode(), areaMap));
            return node;
        }).toList();
    }

    /**
     * 保存
     *
     * @param sysArea
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(SysArea sysArea) {
        sysArea.setCode(sysArea.getCode());
        this.save(sysArea);
        refreshCache();

    }

    /**
     * 修改
     *
     * @param sysArea
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOne(SysArea sysArea) {
        // 只能修改名称
        final String name = sysArea.getName();
        final String code = sysArea.getCode();
        final LambdaUpdateWrapper<SysArea> lambdaedUpdate = Wrappers.lambdaUpdate();
        lambdaedUpdate.eq(SysArea::getCode, code).set(SysArea::getName, name);
        this.update(lambdaedUpdate);
        refreshCache();


    }

    /**
     * 删除
     *
     * @param code
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOneByCode(String code) {
        // 先检查有没有子节点
        final long count = this.count(Wrappers.lambdaQuery(SysArea.class).eq(SysArea::getParentCode, code));
        if (count > 0) {
            throw new BaseException("请先删除子节点");
        }
        baseMapper.deleteByCode(code);
        refreshCache();


    }
}
