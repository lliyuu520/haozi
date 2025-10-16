package cn.lliyuu520.haozi.modules.sys.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.hutool.core.lang.tree.Tree;
import cn.lliyuu520.haozi.common.constant.Constant;
import cn.lliyuu520.haozi.common.enums.MenuTypeEnum;
import cn.lliyuu520.haozi.common.satoken.user.UserDetail;
import cn.lliyuu520.haozi.common.utils.Result;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import cn.lliyuu520.haozi.modules.sys.convert.SysMenuConvert;
import cn.lliyuu520.haozi.modules.sys.dto.SysMenuDTO;
import cn.lliyuu520.haozi.modules.sys.entity.SysMenu;
import cn.lliyuu520.haozi.modules.sys.service.SysMenuService;
import cn.lliyuu520.haozi.modules.sys.vo.SysMenuVO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * 菜单管理
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@RestController
@RequestMapping("/sys/menu")
@AllArgsConstructor
public class SysMenuController {
    private final SysMenuService sysMenuService;

    /**
     * 菜单树
     *
     * @return
     */
    @GetMapping("/nav")
    public Result<List<Tree<Long>>> nav() {
        UserDetail user = SysUserUtil.getUserInfo();
        final List<Tree<Long>> list = this.sysMenuService.getUserMenuList(user, MenuTypeEnum.MENU.getValue());

        return Result.ok(list);
    }

    /**
     * 权限过滤后的菜单
     *
     * @return
     */
    @GetMapping("/authority")
    public Result<Set<String>> authority() {
        final UserDetail user = SysUserUtil.getUserInfo();
        final Set<String> set = this.sysMenuService.getUserAuthority(user);

        return Result.ok(set);
    }

    /**
     * 菜单列表
     *
     * @param type
     * @return
     */
    @GetMapping("/list")
    @SaCheckPermission("sys:menu:page")
    public Result<List<Tree<Long>>> list(final Integer type) {
        final List<Tree<Long>> list = this.sysMenuService.getMenuList(type);

        return Result.ok(list);
    }

    /**
     * 菜单详情
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    @SaCheckPermission("sys:menu:info")
    public Result<SysMenuVO> get(@PathVariable("id") final Long id) {
        final SysMenu entity = this.sysMenuService.getById(id);
        final SysMenuVO vo = SysMenuConvert.INSTANCE.convertToVO(entity);

        // 获取上级菜单名称
        if (!Constant.ROOT.equals(entity.getParentId())) {
            final SysMenu parentEntity = this.sysMenuService.getById(entity.getParentId());
            vo.setParentName(parentEntity.getName());
        }

        return Result.ok(vo);
    }

    /**
     * 新增菜单
     *
     * @param sysMenuDTO
     * @return
     */
    @PostMapping
    @SaCheckPermission("sys:menu:save")
    public Result<String> save(@RequestBody final SysMenuDTO sysMenuDTO) {
        this.sysMenuService.saveOne(sysMenuDTO);

        return Result.ok();
    }

    /**
     * 修改菜单
     *
     * @param sysMenuDTO
     * @return
     */
    @PutMapping
    @SaCheckPermission("sys:menu:update")
    public Result<String> update(@RequestBody final SysMenuDTO sysMenuDTO) {
        this.sysMenuService.updateOne(sysMenuDTO);

        return Result.ok();
    }

    /**
     * 删除菜单
     * @param id
     * @return
     */
    @DeleteMapping
    @SaCheckPermission("sys:menu:delete")
    public Result<String> delete( final Long id) {
        // 判断是否有子菜单或按钮
        final Long count = this.sysMenuService.getSubMenuCount(id);
        if (count > 0) {
            return Result.error("请先删除子菜单");
        }

        this.sysMenuService.deleteOne(id);

        return Result.ok();
    }
}
