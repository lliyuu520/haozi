package cn.lliyuu520.haozi.modules.sys.entity;

import cn.lliyuu520.haozi.common.base.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 系统日志实体类
 * 用于记录系统操作日志，包括操作模块、类型、参数、结果等信息
 *
 * @author AI Assistant
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysLog extends BaseEntity {

    /**
     * 操作模块
     * 记录操作所属的系统模块，如用户、角色、菜单等
     */
    private String moduleName;

    /**
     * 操作类型
     * 记录具体的操作类型，如新增、修改、删除、查询等
     */
    private String typeName;

    /**
     * 请求参数
     * 记录操作请求的参数信息，以JSON字符串格式存储
     */
    private String requestParams;

    /**
     * 响应结果
     * 记录操作的响应结果，以JSON字符串格式存储
     */
    private String responseResult;

    /**
     * 操作人用户名
     * 记录执行操作的用户名称
     */
    private String operatorName;

    /**
     * 操作时间
     * 记录操作执行的具体时间
     */
    private LocalDateTime operateTime;

    /**
     * 操作状态（0正常 1异常）
     * 记录操作执行的状态，0表示成功，1表示失败
     */
    private Integer status;

    /**
     * 错误信息
     * 当操作失败时，记录具体的错误信息
     */
    private String errorMsg;

}