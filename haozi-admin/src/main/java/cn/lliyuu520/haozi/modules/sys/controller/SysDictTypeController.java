package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.modules.sys.convert.SysDictTypeConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysDictTypeDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysDictType;
import cn.lliyuu520.haozi.modules.sys.query.SysDictTypeQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysDictTypeService;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictTypeVO;
import cn.lliyuu520.haozi.modules.sys.vo.SysDictVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 字典类型
 *
 * @author lliyuu520
 */
@RestController
@RequestMapping("sys/dict/type")
@RequiredArgsConstructor
public class SysDictTypeController {
    private final SysDictTypeService sysDictTypeService;

    /**
     * 分页
     *
     * @param query
     * @return
     */
    @GetMapping("page")

    @SaCheckPermission("sys:dict:page")
    public Result<PageVO<SysDictTypeVO>> page(final SysDictTypeQuery query) {
        final PageVO<SysDictTypeVO> page = sysDictTypeService.pageVO(query);

        return Result.ok(page);
    }

    /**
     * 信息
     *
     * @param id
     * @return
     */
    @GetMapping("{id}")
    @SaCheckPermission("sys:dict:info")
    public Result<SysDictTypeVO> get(@PathVariable("id") final Long id) {
        final SysDictType entity = sysDictTypeService.getById(id);

        final SysDictTypeVO sysDictTypeVO = SysDictTypeConvert.INSTANCE.convertToVO(entity);
        return Result.ok(sysDictTypeVO);
    }

    /**
     * 保存
     *
     * @param dto
     * @return
     */
    @PostMapping
    @SaCheckPermission("sys:dict:save")
    public Result<String> save(@RequestBody final SysDictTypeDTO dto) {
        sysDictTypeService.saveOne(dto);

        return Result.ok();
    }

    /**
     * 修改
     *
     * @param dto
     * @return
     */
    @PutMapping
    @SaCheckPermission("sys:dict:update")
    public Result<String> update(@RequestBody final SysDictTypeDTO dto) {
        sysDictTypeService.updateOne(dto);

        return Result.ok();
    }

    /**
     * 删除
     *
     * @param id
     * @return
     */
    @DeleteMapping
    @SaCheckPermission("sys:dict:delete")
    public Result<String> delete( final Long id) {
        sysDictTypeService.deleteById(id);

        return Result.ok();
    }

    /**
     * 全部字典数据
     *
     * @return
     */
    @GetMapping("all")
    public Result<List<SysDictVO>> all() {
        final List<SysDictVO> dictList = sysDictTypeService.getDictList();

        return Result.ok(dictList);
    }

}