package cn.lliyuu520.haozi.common.base.query;

import lombok.Data;

import java.io.Serializable;

/**
 * 查询公共参数
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Data
public class BaseQuery implements Serializable {
    /**
     * 当前页
     */
    private Integer page = 1;

    /**
     * 每页条数
     */
    private Integer limit = 10;

    private String order;

    private boolean asc;


}
