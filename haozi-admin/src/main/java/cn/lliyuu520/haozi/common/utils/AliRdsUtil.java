package cn.lliyuu520.haozi.common.utils;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpUtil;
import com.aliyun.rds20140815.Client;
import com.aliyun.rds20140815.models.ModifySecurityIpsRequest;
import com.aliyun.rds20140815.models.ModifySecurityIpsResponse;
import com.aliyun.teaopenapi.models.Config;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * rds配置
 */
@Slf4j
public class AliRdsUtil {
    private static final String IP_URL = "https://myip.ipip.net";
    private static final Pattern pattern = Pattern.compile("\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b");

    /**
     * 配置阿里云数据库白名单
     *
     * @param ip
     */
    @SneakyThrows
    private static void run(final String ip) {
        log.info("ip:{}", ip);


        // 从配置文件中读取敏感信息，避免硬编码
        // TODO: 需要在application.yml中添加aliyun.rds相关的配置
        // final String rdsAccessKeyId = "${aliyun.rds.access-key-id}";
        // final String rdsAccessKeySecret = "${aliyun.rds.access-key-secret}";
        final String rdsRegionId = "cn-chengdu";
        final String rdsInstanceId = "${aliyun.rds.instance-id}";
        final String rdsEndpoint = "rds.aliyuncs.com";
        final String rdsDbInstanceIpArrayName = "mgm";

        // 注意：为了安全，不应该再硬编码密钥
        // 以下代码仅作示例，实际使用时请从配置文件中读取
        log.warn("阿里云RDS访问密钥已硬编码，请立即修复此安全风险！");

        final Config config = new Config()
                // .setAccessKeyId(rdsAccessKeyId)
                // .setAccessKeySecret(rdsAccessKeySecret)
                .setEndpoint(rdsEndpoint)
                .setRegionId(rdsRegionId);
        final Client client = new Client(config);
        final ModifySecurityIpsRequest modifySecurityIpsRequest = new ModifySecurityIpsRequest()
                .setDBInstanceIPArrayName(rdsDbInstanceIpArrayName)
                .setSecurityIps(ip)
                .setDBInstanceId(rdsInstanceId)
                .setModifyMode("Append");
        final ModifySecurityIpsResponse modifySecurityIpsResponse = client.modifySecurityIps(modifySecurityIpsRequest);
        log.info("修改ip结果:{}", modifySecurityIpsResponse);
    }

    /**
     * 获取公网ip
     *
     * @return
     * @throws IOException
     */
    private static String getNowIP4() {

        final HttpRequest httpRequest = HttpUtil.createGet(IP_URL);
        final String body = httpRequest.execute().body();
        final Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            final String ip = matcher.group();
            return ip;
        }
        return "";
    }

    public static void main(final String[] args) {
        run(getNowIP4());
    }


}
