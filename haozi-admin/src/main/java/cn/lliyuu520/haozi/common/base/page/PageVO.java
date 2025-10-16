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
@AllArgsConstructor
public class PageVO<T> implements Serializable {

    /**
     * 数据
     */
    private List<T> list;
    /**
     * 总条数
     */
    private long total;


    public static <T> PageVO<T> of(final List<T> list, final long total) {
        return new PageVO<>(list, total);
    }

    public static <T> PageVO<T> of(final IPage<T> page) {
        return new PageVO<>(page.getRecords(), page.getTotal());
    }

  

    /**
     * 空数据
     *
     * @param <T>
     * @return
     */
    public static <T> PageVO<T> empty() {
        return new PageVO<>(CollUtil.newArrayList(), 0L);
    }


}
