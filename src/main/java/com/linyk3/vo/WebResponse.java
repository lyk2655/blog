package com.linyk3.vo;

import lombok.Data;

@Data
public class WebResponse<T> {
    private String code;
    private String msg;
    private T body;

    public WebResponse success(T body) {
        this.code = "Y";
        this.msg = "操作成功";
        this.body = body;
        return this;
    }

    public WebResponse success(T body, String msg) {
        this.code = "Y";
        this.msg = msg;
        this.body = body;
        return this;
    }

    public WebResponse fail(String msg) {
        this.code = "N";
        this.msg = "操作失败";
        this.body = null;
        return this;
    }

    public WebResponse fail(T body, String msg) {
        this.code = "N";
        this.msg = "操作失败";
        this.body = body;
        return this;
    }
}
