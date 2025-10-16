package cn.lliyuu520.haozi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 启动器
 */
@Slf4j
@SpringBootApplication
@EnableScheduling
public class HaoziAdminApplication {
    /**
     *  启动方法
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(HaoziAdminApplication.class, args);
    }

}
