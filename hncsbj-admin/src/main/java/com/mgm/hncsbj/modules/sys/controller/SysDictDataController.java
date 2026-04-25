package com.mgm.hncsbj.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.mgm.hncsbj.common.base.page.PageVO;
import com.mgm.hncsbj.common.utils.Result;
import com.mgm.hncsbj.modules.sys.convert.SysDictDataConvert;
import com.mgm.hncsbj.modules.sys.dto.SysDictDataDTO;
import com.mgm.hncsbj.modules.sys.entity.SysDictData;
import com.mgm.hncsbj.modules.sys.query.SysDictDataQuery;
import com.mgm.hncsbj.modules.sys.service.SysDictDataService;
import com.mgm.hncsbj.modules.sys.vo.SysDictDataVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 字典数据
 *
 * @author lliyuu520
 */
@RestController
@RequestMapping("/sys/dict/data")
@RequiredArgsConstructor
public class SysDictDataController {
    private final SysDictDataService sysDictDataService;

    /**
     * 分页查询
     * @param query
     * @return
     */
    @GetMapping("/page")
    @SaCheckPermission("sys:dict:page")
    public Result<PageVO<SysDictDataVO>> page(SysDictDataQuery query) {
        PageVO<SysDictDataVO> page = sysDictDataService.pageVO(query);

        return Result.ok(page);
    }

    /**
     * 查看
     * @param id
     * @return
     */
    @GetMapping("info")
    @SaCheckPermission("sys:dict:info")
    public Result<SysDictDataVO> get( Long id) {
        SysDictData entity = sysDictDataService.getById(id);

        final SysDictDataVO data = SysDictDataConvert.INSTANCE.convertToVO(entity);
        return Result.ok(data);
    }

    /**
     * 新增
     * @param dto
     * @return
     */
    @PostMapping
    @SaCheckPermission("sys:dict:save")
    public Result<String> save(@RequestBody SysDictDataDTO dto) {
        sysDictDataService.saveOne(dto);

        return Result.ok();
    }

    @PutMapping
    @SaCheckPermission("sys:dict:update")
    public Result<String> update(@RequestBody SysDictDataDTO dto) {
        sysDictDataService.updateOne(dto);

        return Result.ok();
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping
    @SaCheckPermission("sys:dict:delete")
    public Result<String> delete( Long id) {
        sysDictDataService.deleteById(id);

        return Result.ok();
    }

    /**
     * 根据字典类型查询字典数据
     * @param dictType
     * @return
     */
    @GetMapping("/listDataByType")
    public Result<List<SysDictData>> listByType(String  dictType) {

        List<SysDictData> list = sysDictDataService.listByType(dictType);

        return Result.ok(list);
    }


}