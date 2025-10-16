package cn.lliyuu520.haozi.common.vo;

import cn.hutool.core.annotation.Alias;
import lombok.Data;

/**
 * @ClassName : CityResponseJsonVO
 * @Description : json
 * @Author : zdw
 * @Date: 2020-09-14 16:10
 */
@Data
public class GeoResponseJsonVO {

    public final static String SUCCESS_STATUS = "1";

    public final static String SUCCESS_INFO = "OK";

    public final static String SUCCESS_INFO_CODE = "10000";


    /**
     * 1 成功 0 失败
     */
    private String status;
    /**
     * OK
     */
    private String info;
    /**
     * 10000
     */
    @Alias("infocode")
    private String infoCode;


    /**
     * 逆地理编码
     */
    private Regeocode regeocode = new Regeocode();


    @Data
    public static class Regeocode {
        /**
         * 地址元素列表
         */
        private AddressComponent addressComponent = new AddressComponent();
        /**
         * 地址
         */
        @Alias("formatted_address")
        private String formattedAddress;

        @Data
        public static class AddressComponent {
            /**
             * 行政区编码
             */
            private String adcode;

            /**
             * 城市编码
             */
            @Alias("citycode")
            private String cityCode;

            /**
             * 乡镇街道编码
             */
            @Alias("towncode")
            private String townCode;

            @Alias("township")
            private String townShip;


        }
    }
}
