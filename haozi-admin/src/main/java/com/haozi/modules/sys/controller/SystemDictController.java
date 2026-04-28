package com.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.haozi.common.base.page.PageVO;
import com.haozi.common.exception.BaseException;
import com.haozi.common.model.PageResult;
import com.haozi.modules.sys.dto.SysDictDataDTO;
import com.haozi.modules.sys.dto.SysDictTypeDTO;
import com.haozi.modules.sys.entity.SysDictData;
import com.haozi.modules.sys.entity.SysDictType;
import com.haozi.modules.sys.query.SysDictDataQuery;
import com.haozi.modules.sys.query.SysDictTypeQuery;
import com.haozi.modules.sys.service.SysDictDataService;
import com.haozi.modules.sys.service.SysDictTypeService;
import com.haozi.modules.sys.vo.DictDataRecordVO;
import com.haozi.modules.sys.vo.DictTypeRecordVO;
import com.haozi.modules.sys.vo.SysDictDataVO;
import com.haozi.modules.sys.vo.SysDictTypeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * React 字典管理接口。
 *
 * <p>该控制器面向 React 前端，直接返回业务数据和 HTTP 状态码。
 * 历史 /sys/dict/type 与 /sys/dict/data 入口继续保留，迁移期间两套入口互不影响。</p>
 */
@RestController
@RequestMapping("/system/dicts")
@RequiredArgsConstructor
public class SystemDictController {

    private final SysDictTypeService sysDictTypeService;
    private final SysDictDataService sysDictDataService;

    /**
     * 分页查询字典类型。
     *
     * @param dictType 字典类型编码
     * @param dictName 字典名称
     * @param page 当前页码
     * @param pageSize 每页数量
     * @return 字典类型分页数据
     */
    @GetMapping("types")
    @SaCheckPermission("sys:dict:page")
    public PageResult<DictTypeRecordVO> pageTypes(
            @RequestParam(required = false) final String dictType,
            @RequestParam(required = false) final String dictName,
            @RequestParam(defaultValue = "1") final Integer page,
            @RequestParam(defaultValue = "10") final Integer pageSize
    ) {
        final SysDictTypeQuery query = new SysDictTypeQuery();
        query.setDictType(dictType);
        query.setDictName(dictName);
        query.setPage(page);
        query.setLimit(pageSize);
        final PageVO<SysDictTypeVO> result = sysDictTypeService.pageVO(query);
        final List<DictTypeRecordVO> items = result.getList().stream().map(this::toDictTypeRecord).toList();
        return new PageResult<>(items, result.getTotal(), page, pageSize);
    }

    /**
     * 查询字典类型详情。
     *
     * @param id 字典类型 ID
     * @return 字典类型详情
     */
    @GetMapping("types/{id}")
    @SaCheckPermission("sys:dict:info")
    public DictTypeRecordVO getType(@PathVariable("id") final Long id) {
        final SysDictType entity = sysDictTypeService.getById(id);
        if (entity == null) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), "字典类型不存在");
        }
        return toDictTypeRecord(entity);
    }

    /**
     * 新增字典类型。
     *
     * @param dto 字典类型表单
     */
    @PostMapping("types")
    @ResponseStatus(HttpStatus.CREATED)
    @SaCheckPermission("sys:dict:save")
    public void createType(@RequestBody final SysDictTypeDTO dto) {
        sysDictTypeService.saveOne(dto);
    }

    /**
     * 更新字典类型。
     *
     * @param id 字典类型 ID
     * @param dto 字典类型表单
     */
    @PutMapping("types/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:dict:update")
    public void updateType(@PathVariable("id") final Long id, @RequestBody final SysDictTypeDTO dto) {
        dto.setId(id);
        sysDictTypeService.updateOne(dto);
    }

    /**
     * 删除字典类型。
     *
     * <p>React 接口删除类型时同步清理该类型下的数据，避免双栏页面残留不可见的孤儿数据。
     * 历史删除接口保持原有服务行为不变。</p>
     *
     * @param id 字典类型 ID
     */
    @DeleteMapping("types/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:dict:delete")
    public void deleteType(@PathVariable("id") final Long id) {
        final SysDictType entity = sysDictTypeService.getById(id);
        if (entity == null) {
            return;
        }
        sysDictTypeService.deleteById(id);
        sysDictDataService.remove(Wrappers.lambdaQuery(SysDictData.class)
                .eq(SysDictData::getDictType, entity.getDictType()));
    }

    /**
     * 分页查询字典数据。
     *
     * @param dictType 字典类型编码
     * @param page 当前页码
     * @param pageSize 每页数量
     * @return 字典数据分页数据
     */
    @GetMapping("data")
    @SaCheckPermission("sys:dict:page")
    public PageResult<DictDataRecordVO> pageData(
            @RequestParam final String dictType,
            @RequestParam(defaultValue = "1") final Integer page,
            @RequestParam(defaultValue = "10") final Integer pageSize
    ) {
        final SysDictDataQuery query = new SysDictDataQuery();
        query.setDictType(dictType);
        query.setPage(page);
        query.setLimit(pageSize);
        final PageVO<SysDictDataVO> result = sysDictDataService.pageVO(query);
        final List<DictDataRecordVO> items = result.getList().stream().map(this::toDictDataRecord).toList();
        return new PageResult<>(items, result.getTotal(), page, pageSize);
    }

    /**
     * 查询字典数据详情。
     *
     * @param id 字典数据 ID
     * @return 字典数据详情
     */
    @GetMapping("data/{id}")
    @SaCheckPermission("sys:dict:info")
    public DictDataRecordVO getData(@PathVariable("id") final Long id) {
        final SysDictData entity = sysDictDataService.getById(id);
        if (entity == null) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), "字典数据不存在");
        }
        return toDictDataRecord(entity);
    }

    /**
     * 新增字典数据。
     *
     * @param dto 字典数据表单
     */
    @PostMapping("data")
    @ResponseStatus(HttpStatus.CREATED)
    @SaCheckPermission("sys:dict:save")
    public void createData(@RequestBody final SysDictDataDTO dto) {
        sysDictDataService.saveOne(dto);
    }

    /**
     * 更新字典数据。
     *
     * @param id 字典数据 ID
     * @param dto 字典数据表单
     */
    @PutMapping("data/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:dict:update")
    public void updateData(@PathVariable("id") final Long id, @RequestBody final SysDictDataDTO dto) {
        dto.setId(id);
        sysDictDataService.updateOne(dto);
    }

    /**
     * 删除字典数据。
     *
     * @param id 字典数据 ID
     */
    @DeleteMapping("data/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:dict:delete")
    public void deleteData(@PathVariable("id") final Long id) {
        sysDictDataService.deleteById(id);
    }

    /**
     * 转换字典类型记录。
     *
     * @param vo 字典类型 VO
     * @return React 字典类型记录
     */
    private DictTypeRecordVO toDictTypeRecord(final SysDictTypeVO vo) {
        return new DictTypeRecordVO(vo.getId(), vo.getDictType(), vo.getDictName(), vo.getRemark());
    }

    /**
     * 转换字典类型记录。
     *
     * @param entity 字典类型实体
     * @return React 字典类型记录
     */
    private DictTypeRecordVO toDictTypeRecord(final SysDictType entity) {
        return new DictTypeRecordVO(entity.getId(), entity.getDictType(), entity.getDictName(), entity.getRemark());
    }

    /**
     * 转换字典数据记录。
     *
     * @param vo 字典数据 VO
     * @return React 字典数据记录
     */
    private DictDataRecordVO toDictDataRecord(final SysDictDataVO vo) {
        return new DictDataRecordVO(
                vo.getId(),
                vo.getDictType(),
                vo.getDictLabel(),
                vo.getDictValue(),
                vo.getWeight(),
                vo.getRemark()
        );
    }

    /**
     * 转换字典数据记录。
     *
     * @param entity 字典数据实体
     * @return React 字典数据记录
     */
    private DictDataRecordVO toDictDataRecord(final SysDictData entity) {
        return new DictDataRecordVO(
                entity.getId(),
                entity.getDictType(),
                entity.getDictLabel(),
                entity.getDictValue(),
                entity.getWeight(),
                entity.getRemark()
        );
    }
}
