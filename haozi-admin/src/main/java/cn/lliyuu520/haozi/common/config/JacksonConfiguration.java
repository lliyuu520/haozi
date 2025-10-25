package cn.lliyuu520.haozi.common.config;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.PackageVersion;
import com.fasterxml.jackson.datatype.jsr310.deser.InstantDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.InstantSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.TimeZone;

/**
 * JacksonConfig
 *
 * @author lengleng
 * @author L.cm
 * @author lishangbu
 * @date 2020-06-17
 */
@Configuration
@ConditionalOnClass(ObjectMapper.class)
@AutoConfigureBefore(JacksonAutoConfiguration.class)
public class JacksonConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public Jackson2ObjectMapperBuilderCustomizer customizer() {
        return builder -> {
            builder.locale(Locale.CHINA);
            builder.timeZone(TimeZone.getTimeZone(ZoneId.systemDefault()));
            builder.simpleDateFormat(DatePattern.NORM_DATETIME_PATTERN);
            // 使用智能Long序列化器：只对超过JavaScript安全整数范围的Long转为字符串
            builder.serializerByType(Long.class, SmartLongSerializer.INSTANCE);
            builder.modules(new MiguomaJavaTimeModule());
        };
    }

    /**
     * 智能Long序列化器
     * 小于等于JavaScript安全整数最大值的Long保持数字类型
     * 超过JavaScript安全整数最大值的Long转为字符串
     */
    public static class SmartLongSerializer extends JsonSerializer<Long> {
        public static final SmartLongSerializer INSTANCE = new SmartLongSerializer();
        private static final long JS_MAX_SAFE_INTEGER = 9007199254740991L;

        @Override
        public void serialize(Long value, JsonGenerator gen, SerializerProvider provider) throws IOException {
            if (value == null) {
                gen.writeNull();
                return;
            }

            // 只有超过JavaScript安全整数范围才转为字符串
            if (Math.abs(value) > JS_MAX_SAFE_INTEGER) {
                gen.writeString(value.toString());
            } else {
                gen.writeNumber(value);
            }
        }
    }

    /**
     * 重写时间序列化规则
     */
    public static class MiguomaJavaTimeModule extends SimpleModule {

        public MiguomaJavaTimeModule() {
            super(PackageVersion.VERSION);

            // ======================= 时间序列化规则 ===============================
            // yyyy-MM-dd HH:mm:ss
            this.addSerializer(LocalDateTime.class,
                    new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
            // yyyy-MM-dd
            this.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ISO_LOCAL_DATE));
            // HH:mm:ss
            this.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ISO_LOCAL_TIME));
            // Instant 类型序列化
            this.addSerializer(Instant.class, InstantSerializer.INSTANCE);

            // ======================= 时间反序列化规则 ==============================
            // yyyy-MM-dd HH:mm:ss
            this.addDeserializer(LocalDateTime.class,
                    new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
            // yyyy-MM-dd
            this.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ISO_LOCAL_DATE));
            // HH:mm:ss
            this.addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ISO_LOCAL_TIME));
            // Instant 反序列化
            this.addDeserializer(Instant.class, InstantDeserializer.INSTANT);
        }

    }


}
