package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.modules.sys.convert.SysDictDataConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysDictDataDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictData;
import cn.lliyuu520.haozi.modules.sys.query.SysDictDataQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysDictDataService;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictDataVO;
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