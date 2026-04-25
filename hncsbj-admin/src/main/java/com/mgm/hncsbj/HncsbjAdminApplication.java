package com.mgm.hncsbj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 启动器
 */
@Slf4j
@SpringBootApplication
public class HncsbjAdminApplication {
    /**
     *  启动方法
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(HncsbjAdminApplication.class, args);
    }

}
