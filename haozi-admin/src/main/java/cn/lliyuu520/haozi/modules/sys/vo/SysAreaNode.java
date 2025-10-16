package cn.lliyuu520.haozi.modules.sys.vo;

import cn.hutool.core.collection.CollUtil;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 行政区划
 *
 * @author liliangyu
 */
@Data
public class SysAreaNode implements Serializable {

    /**
     * 行政区划代码
     */
    private String value;
    /**
     * 行政区划名称
     */
    private String label;
    /**
     * 是否有子级
     */
    private Boolean hasChildren;

    /**
     * 子级
     */
    private List<SysAreaNode> children=new ArrayList<>();

    public Boolean getHasChildren() {

        return CollUtil.size(children)>0;
    }







}
