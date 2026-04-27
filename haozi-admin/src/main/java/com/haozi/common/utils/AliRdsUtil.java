package com.haozi.common.utils;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpUtil;
import com.aliyun.rds20140815.Client;
import com.aliyun.rds20140815.models.ModifySecurityIpsRequest;
import com.aliyun.rds20140815.models.ModifySecurityIpsResponse;
import com.aliyun.teaopenapi.models.Config;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * rds配置
 */
@Slf4j
public class AliRdsUtil {
    private static final String RDS_ENV_FILE_NAME = ".env.rds";
    private static final String IP_URL = "https://myip.ipip.net";
    private static final Pattern pattern = Pattern.compile("\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b");
    private static final List<Path> RDS_ENV_PATHS = List.of(
            Path.of(RDS_ENV_FILE_NAME),
            Path.of("haozi-admin", RDS_ENV_FILE_NAME)
    );

    /**
     * 配置阿里云数据库白名单
     *
     * @param ip
     */
    @SneakyThrows
    private static void run(final String ip) {
        if (ip == null || ip.isBlank()) {
            throw new IllegalStateException("未获取到公网 IP，无法配置阿里云 RDS 白名单");
        }
        log.info("ip:{}", ip);

        final RdsConfig rdsConfig = loadRdsConfig();

        final Config config = new Config()
                .setAccessKeyId(rdsConfig.accessKeyId)
                .setAccessKeySecret(rdsConfig.accessKeySecret)
                .setEndpoint(rdsConfig.endpoint)
                .setRegionId(rdsConfig.regionId);
        final Client client = new Client(config);
        final ModifySecurityIpsRequest modifySecurityIpsRequest = new ModifySecurityIpsRequest()
                .setDBInstanceIPArrayName(rdsConfig.dbInstanceIpArrayName)
                .setSecurityIps(ip)
                .setDBInstanceId(rdsConfig.instanceId)
                .setModifyMode("Append");
        final ModifySecurityIpsResponse modifySecurityIpsResponse = client.modifySecurityIps(modifySecurityIpsRequest);
        log.info("修改ip结果:{}", modifySecurityIpsResponse);
    }

    /**
     * RDS 管理密钥和实例配置独立放在 .env.rds，避免和本项目数据库、OSS 配置混用。
     *
     * @return
     * @throws IOException
     */
    private static RdsConfig loadRdsConfig() throws IOException {
        final Map<String, String> env = loadRdsEnv();
        return new RdsConfig(
                require(env, "RDS_ACCESS_KEY_ID"),
                require(env, "RDS_ACCESS_KEY_SECRET"),
                require(env, "RDS_REGION_ID"),
                require(env, "RDS_INSTANCE_ID"),
                require(env, "RDS_ENDPOINT"),
                require(env, "RDS_DB_INSTANCE_IP_ARRAY_NAME")
        );
    }

    /**
     * 支持从仓库根目录或 haozi-admin 目录运行工具。
     *
     * @return
     * @throws IOException
     */
    private static Map<String, String> loadRdsEnv() throws IOException {
        final Path envPath = resolveRdsEnvPath();
        final Map<String, String> env = new LinkedHashMap<>();
        final List<String> lines = Files.readAllLines(envPath, StandardCharsets.UTF_8);
        for (final String rawLine : lines) {
            final String line = rawLine.trim();
            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }
            final int delimiterIndex = line.indexOf('=');
            if (delimiterIndex <= 0) {
                throw new IllegalStateException(".env.rds 存在无法识别的配置行");
            }
            final String key = line.substring(0, delimiterIndex).trim();
            final String value = unquote(line.substring(delimiterIndex + 1).trim());
            env.put(key, value);
        }
        return env;
    }

    /**
     * 优先使用 RDS_ENV_FILE 指定的配置路径，否则按常见启动目录查找。
     *
     * @return
     */
    private static Path resolveRdsEnvPath() {
        final String customPath = System.getenv("RDS_ENV_FILE");
        if (customPath != null && !customPath.isBlank()) {
            final Path path = Path.of(customPath);
            if (Files.isRegularFile(path)) {
                return path;
            }
            throw new IllegalStateException("RDS_ENV_FILE 指定的 .env.rds 文件不存在");
        }
        for (final Path path : RDS_ENV_PATHS) {
            if (Files.isRegularFile(path)) {
                return path;
            }
        }
        throw new IllegalStateException("未找到 .env.rds 文件，请在项目根目录或 haozi-admin 目录创建");
    }

    /**
     * @param value
     * @return
     */
    private static String unquote(final String value) {
        if (value.length() < 2) {
            return value;
        }
        final char firstChar = value.charAt(0);
        final char lastChar = value.charAt(value.length() - 1);
        if ((firstChar == '"' && lastChar == '"') || (firstChar == '\'' && lastChar == '\'')) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }

    /**
     * @param env
     * @param key
     * @return
     */
    private static String require(final Map<String, String> env, final String key) {
        final String value = env.get(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(".env.rds 缺少配置：" + key);
        }
        return value;
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

    private static class RdsConfig {
        private final String accessKeyId;
        private final String accessKeySecret;
        private final String regionId;
        private final String instanceId;
        private final String endpoint;
        private final String dbInstanceIpArrayName;

        private RdsConfig(
                final String accessKeyId,
                final String accessKeySecret,
                final String regionId,
                final String instanceId,
                final String endpoint,
                final String dbInstanceIpArrayName) {
            this.accessKeyId = accessKeyId;
            this.accessKeySecret = accessKeySecret;
            this.regionId = regionId;
            this.instanceId = instanceId;
            this.endpoint = endpoint;
            this.dbInstanceIpArrayName = dbInstanceIpArrayName;
        }
    }
}
