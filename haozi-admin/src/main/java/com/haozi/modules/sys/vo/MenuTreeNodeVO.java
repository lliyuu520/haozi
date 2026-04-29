package com.haozi.modules.sys.vo;

import java.io.Serializable;
import java.util.List;

/**
 * React 菜单权限树节点。
 *
 * <p>Hutool Tree 适合历史菜单接口直接消费，但 OpenAPI 类型不够稳定；
 * 新前端使用该固定结构渲染 Ant Design Tree。</p>
 *
 * @param id 菜单 ID
 * @param name 菜单名称
 * @param children 子节点
 */
public record MenuTreeNodeVO(
        Long id,
        String name,
        List<MenuTreeNodeVO> children
) implements Serializable {
}
