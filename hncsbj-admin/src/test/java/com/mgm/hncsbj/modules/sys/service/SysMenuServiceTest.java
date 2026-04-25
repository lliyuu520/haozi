package com.mgm.hncsbj.modules.sys.service;

import cn.dev33.satoken.annotation.SaIgnore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @author liliangyu
 */
@SpringBootTest(args = {"--server.port=8081"},webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class SysMenuServiceTest {
    @Autowired
    private SysMenuService sysMenuService;

    @Autowired
    private SysRoleService sysRoleService;




    @Test
    @SaIgnore
    public void addMenu() {
        sysMenuService.addModule("feedbackRecord","qrCode", "反馈", 1L);

        sysRoleService.refreshPermission(1L);

    }

}