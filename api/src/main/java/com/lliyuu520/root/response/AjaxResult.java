package com.lliyuu520.root.response;

import lombok.Data;

/**
 * 自定义返回格式
 * @author lliyuu520* @date 2017年8月29日
 */
@Data
public class AjaxResult {
    private Integer code;
    private String message;
    private Object data;

    private AjaxResult() {
    }

    /**
     * 成功
     *
     * @return
     */
    public static AjaxResult success(Object o) {
        AjaxResult ajaxResult = AjaxResult.success();
        ajaxResult.setData(o);
        return ajaxResult;
    }

    /**
     * 成功
     *
     * @return
     */
    public static AjaxResult success() {
        AjaxResult ajaxResult = AjaxResult.newInstance();
        ajaxResult.setResult(AjaxResultEnum.SUCCESS);
        return ajaxResult;
    }

    private static AjaxResult newInstance() {
        return new AjaxResult();
    }

    /**
     * 设置枚举
     *
     * @param result
     * @return
     */
    private void setResult(AjaxResultEnum result) {
        this.setCode(result.getKey());
        this.setMessage(result.getValue());
    }

    /**
     * 服务器异常
     *
     * @return
     */
    public static AjaxResult serverException() {
        AjaxResult ajaxResult = AjaxResult.newInstance();
        ajaxResult.setResult(AjaxResultEnum.SERVER_EXCEPTION);
        return ajaxResult;
    }

    /**
     * 权限异常
     *
     * @return
     */
    public static AjaxResult accessDeniedException() {
        AjaxResult ajaxResult = AjaxResult.newInstance();
        ajaxResult.setResult(AjaxResultEnum.ACCESS_DENIED_EXCEPTION);
        return ajaxResult;
    }

    /**
     * 权限异常
     *
     * @return
     */
    public static AjaxResult accessException() {
        AjaxResult ajaxResult = AjaxResult.newInstance();
        ajaxResult.setResult(AjaxResultEnum.ACCESS_DENIED_EXCEPTION);
        return ajaxResult;
    }

    /**
     * 未登录
     *
     * @return
     */
    public static AjaxResult noAuth() {
        AjaxResult ajaxResult = AjaxResult.newInstance();
        ajaxResult.setResult(AjaxResultEnum.NO_AUTH);
        return ajaxResult;
    }





}
