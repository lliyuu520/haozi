package cn.lliyuu520.haozi.common.base.page;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 分页工具类
 *
 * @author lliyuu520
 */
@Data
@NoArgsConstructor
public class PageVO<T> implements Serializable {

    /**
     * 数据
     */
    private List<T> list;
    /**
     * 总条数
     */
    private long total;
    /**
     * 当前页
     */
    private long current;

    /**
     * 每页条数
     */
    private long pageSize;

    public  static <T> PageVO<T> of(IPage<T> page) {
        final PageVO<T> objectPageVO = new PageVO<>();
        objectPageVO.setList(page.getRecords());
        objectPageVO.setTotal(page.getTotal());
        objectPageVO.setCurrent(page.getCurrent());
        objectPageVO.setPageSize(page.getSize());
        return objectPageVO;

    }

    public  static <T> PageVO<T> of(List<T> list,IPage page) {
        final PageVO<T> objectPageVO = new PageVO<>();
        objectPageVO.setList(list);
        objectPageVO.setTotal(page.getTotal());
        objectPageVO.setCurrent(page.getCurrent());
        objectPageVO.setPageSize(page.getSize());
        return objectPageVO;

    }



  



}
