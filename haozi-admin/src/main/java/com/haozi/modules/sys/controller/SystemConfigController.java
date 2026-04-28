package com.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.haozi.common.base.page.PageVO;
import com.haozi.common.exception.BaseException;
import com.haozi.common.model.PageResult;
import com.haozi.modules.sys.dto.SysConfigDTO;
import com.haozi.modules.sys.entity.SysConfig;
import com.haozi.modules.sys.query.SysConfigQuery;
import com.haozi.modules.sys.service.SysConfigService;
import com.haozi.modules.sys.vo.ConfigRecordVO;
import com.haozi.modules.sys.vo.SysConfigVO;
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
 * React 参数配置接口。
 *
 * <p>该控制器面向新 React 前端，直接返回业务数据和 HTTP 状态码。
 * 旧 Vue 版本继续使用 /sys/config，迁移期间两套入口互不影响。</p>
 */
@RestController
@RequestMapping("/system/configs")
@RequiredArgsConstructor
public class SystemConfigController {

    private final SysConfigService sysConfigService;

    /**
     * 分页查询参数配置。
     *
     * @param code 参数编码
     * @param descs 参数描述
     * @param type 参数类型
     * @param page 当前页码
     * @param pageSize 每页数量
     * @return 参数配置分页数据
     */
    @GetMapping
    @SaCheckPermission("sys:config:page")
    public PageResult<ConfigRecordVO> page(
            @RequestParam(required = false) final String code,
            @RequestParam(required = false) final String descs,
            @RequestParam(required = false) final String type,
            @RequestParam(defaultValue = "1") final Integer page,
            @RequestParam(defaultValue = "10") final Integer pageSize
    ) {
        final SysConfigQuery query = new SysConfigQuery();
        query.setCode(code);
        query.setDescs(descs);
        query.setType(type);
        query.setPage(page);
        query.setLimit(pageSize);
        final PageVO<SysConfigVO> result = sysConfigService.pageVO(query);
        final List<ConfigRecordVO> items = result.getList().stream().map(this::toConfigRecord).toList();
        return new PageResult<>(items, result.getTotal(), page, pageSize);
    }

    /**
     * 获取参数配置详情。
     *
     * @param id 参数 ID
     * @return 参数配置详情
     */
    @GetMapping("{id}")
    @SaCheckPermission("sys:config:info")
    public ConfigRecordVO get(@PathVariable("id") final Long id) {
        final SysConfig entity = sysConfigService.getById(id);
        if (entity == null) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), "系统参数不存在");
        }
        return toConfigRecord(entity);
    }

    /**
     * 新增参数配置。
     *
     * @param dto 参数配置表单
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SaCheckPermission("sys:config:save")
    public void create(@RequestBody final SysConfigDTO dto) {
        sysConfigService.saveOne(dto);
    }

    /**
     * 更新参数配置。
     *
     * @param id 参数 ID
     * @param dto 参数配置表单
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:config:update")
    public void update(@PathVariable("id") final Long id, @RequestBody final SysConfigDTO dto) {
        dto.setId(id);
        sysConfigService.updateOne(dto);
    }

    /**
     * 删除参数配置。
     *
     * @param id 参数 ID
     */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SaCheckPermission("sys:config:delete")
    public void delete(@PathVariable("id") final Long id) {
        sysConfigService.deleteIds(id);
    }

    /**
     * 转换参数配置记录。
     *
     * @param config 参数实体
     * @return React 参数配置记录
     */
    private ConfigRecordVO toConfigRecord(final SysConfig config) {
        return new ConfigRecordVO(
                config.getId(),
                config.getCode(),
                config.getDescs(),
                config.getType(),
                config.getEnabled(),
                config.getNum(),
                config.getText(),
                config.getFiles(),
                config.getImages()
        );
    }
}
