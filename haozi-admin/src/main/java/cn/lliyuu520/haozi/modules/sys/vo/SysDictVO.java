package cn.lliyuu520.haozi.modules.sys.vo;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

/**
 * 全部字典
 *
 * @author lliyuu520
 */
@Data
public class SysDictVO {
    private String dictType;

    private List<DictData> dataList = new ArrayList<>();

    @Data
    @Accessors(chain = true)
    public static class DictData {
        private String dictLabel;

        private String dictValue;
    }
}
