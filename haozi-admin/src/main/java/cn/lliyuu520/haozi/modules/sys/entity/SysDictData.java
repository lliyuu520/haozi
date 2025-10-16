package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.NotNull;

/**
 * 数据字典
 *
 * @author lliyuu520
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SysDictData extends BaseEntity  implements Comparable<SysDictData>{

    /**
     * 字典标签
     */
    private String dictLabel;
    /**
     * 字典值
     */
    private String dictValue;
    /**
     * 备注
     */
    private String remark;

    private String dictType;

    private Integer weight;

    /**
     * 由大到小排序
     * @param o
     * @return
     */
    @Override
    public int compareTo(@NotNull SysDictData o) {
        return o.getWeight().compareTo(this.weight);
    }
}