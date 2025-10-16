package cn.lliyuu520.haozi.modules.sys.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;

/**
 * 行政区划
 *
 * @author liliangyu
 */
@Data
public class SysArea implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    /**
     * 行政区划代码
     */
    private String code;
    /**
     * 行政区划名称
     */

    private String name;
    /**
     * 父级行政区划代码
     */

    private String parentCode;
    /**
     * 层级
     */
    private Integer level;
}
