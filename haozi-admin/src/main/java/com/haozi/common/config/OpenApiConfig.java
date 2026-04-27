package com.haozi.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 文档配置。
 *
 * <p>React 前端会基于 /v3/api-docs 生成 TypeScript SDK，因此这里集中声明
 * API 文档基本信息和 Sa-Token 鉴权方案，避免前端手写接口类型。</p>
 */
@Configuration
public class OpenApiConfig {

    private static final String SA_TOKEN_SECURITY_SCHEME = "saToken";

    /**
     * 创建 OpenAPI 配置对象。
     *
     * @return OpenAPI 配置
     */
    @Bean
    public OpenAPI haoziOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Haozi Admin API")
                        .version("1.0.0")
                        .description("Haozi 管理脚手架接口文档"))
                .schemaRequirement(SA_TOKEN_SECURITY_SCHEME, new SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.COOKIE)
                        .name("Authorization"))
                .addSecurityItem(new SecurityRequirement().addList(SA_TOKEN_SECURITY_SCHEME));
    }
}
