package cn.lliyuu520.haozi.common.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import cn.lliyuu520.haozi.common.satoken.user.UserDetail;
import cn.lliyuu520.haozi.common.utils.SysUserUtil;
import org.apache.ibatis.reflection.MetaObject;

import java.time.LocalDateTime;

/**
 * mybatis-plus 自动填充字段
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
public class FieldMetaObjectHandler implements MetaObjectHandler {
    private final static String CREATE_TIME = "createTime";
    private final static String CREATOR = "creator";
    private final static String UPDATE_TIME = "updateTime";
    private final static String UPDATER = "updater";
    private final static String DELETED = "deleted";

    @Override
    public void insertFill(final MetaObject metaObject) {
        final UserDetail user = SysUserUtil.getUserInfo();
        final LocalDateTime now = LocalDateTime.now();

        // 创建者
        this.strictInsertFill(metaObject, CREATOR, Long.class, user.getId());
        // 创建时间
        this.strictInsertFill(metaObject,CREATE_TIME, LocalDateTime.class, now);
        // 更新者
        this.strictInsertFill(metaObject, UPDATER, Long.class, user.getId());
        // 更新时间
        this.strictInsertFill(metaObject, UPDATE_TIME, LocalDateTime.class, now);
        // 删除标识
        this.strictInsertFill(metaObject, DELETED, Integer.class, 0);
    }

    @Override
    public void updateFill(final MetaObject metaObject) {
        // 更新者
        this.strictUpdateFill(metaObject, UPDATER, Long.class, SysUserUtil.getUserInfo().getId());
        // 更新时间
        this.strictUpdateFill(metaObject, UPDATE_TIME, LocalDateTime.class, LocalDateTime.now());
    }
}
