var area, msg;
layui.use(["element", "jquery", "form", "layedit", "flow"], function () {
    function u() {
        var i = '<form class="layui-form layui-form-pane" id="emailform" style="padding:20px;text-align: center;">';
        i += '<div class="layui-form-item"><p>邮箱只用来接收回复消息,不作他用,请放心填写<\/p><p style="color:red">暂时不支持修改,请谨慎填写<\/p><\/div>';
        i += '<div class="layui-form-item">';
        i += '<label class="layui-form-label">邮箱<\/label>';
        i += '<div class="layui-input-block">';
        i += '<input type="text" name="Email" autocomplete="off" class="layui-input" placeholder="暂时不支持修改邮箱,请谨慎填写" lay-verify="required|email" maxLength=50>';
        i += "<\/div>";
        i += "<\/div>";
        i += ' <button class="layui-btn layui-btn-primary" lay-submit lay-filter="emaillink">立即提交<\/button>';
        i += "<\/form>";
        layer.open({
            type: 1,
            title: "补填邮箱",
            offset: "auto",
            area: "50%",
            id: "layeremail",
            content: i
        });
        t.on("submit(emaillink)", function () {
            return n.ajax({
                type: "post",
                url: "/User/AddEmail",
                data: n("#emailform").serialize(),
                success: function (n) {
                    n.success ? (layer.msg(n.message, {
                        icon: 6
                    }),
                        setTimeout(function () {
                            layer.closeAll()
                        }, 1e3)) : n.message != "" ? layer.msg(n.message, {
                            icon: 5
                        }) : layer.msg("程序异常", {
                            icon: 5
                        })
                },
                error: function () {
                    layer.msg("请求异常", {
                        icon: 2
                    })
                }
            }),
                !1
        })
    }
    var e = layui.element, t = layui.form, n = layui.jquery, i = layui.layedit, f = layui.flow, r;
    msg.initarea(n);
    r = i.build("remarkEditor", {
        height: 150,
        tool: ['strong' //加粗
        ,'italic' //斜体
        ,'underline' //下划线
        ,'del' //删除线
        
        ,'|' //分割线
        
        ,'left' //左对齐
        ,'center' //居中对齐
        ,'right' //右对齐
        ,'link' //超链接
        ,'unlink' //清除链接
        ,'face' //表情
    ]
    });
    t.verify({
        content: function (t) {
            if (t = n.trim(i.getContent(r)),
                t == "")
                return "请输入内容";
            i.sync(r)
        },
        replyContent: function (n) {
            if (n == "")
                return "请输入内容"
        }
    });
    f.load({
        elem: "#message-list",
        isAuto: true,
        done: function (t, i) {
            var u = n("#messagepagecount").val()
                , r = [];
            console.log(i);
            setTimeout(function () {
                n.ajax({
                    type: "POST",
                    url: "#",
                    data: {
                        page: t
                    },
                    success: function (n) {
                        r.push(n);
                        i(r.join(""), t < u)
                    }
                })
            }, 200)
        }
    });
    t.on("submit(formLeaveMessage)", function (t) {
        var i = layer.msg("正在提交留言...", {
            icon: 16,
            time: 0
        });
        return n.ajax({
            type: "post",
            url: "https://api.icqcore.com//api/Message/Comment",
            data: {
                content: filterXSS(t.field.editorContent),
            },
            success: function (n) {
                layer.close(i);
                n.success ? (layer.msg(n.Message, {
                    icon: 6
                }),
                    setTimeout(function () {
                        location.reload(!0)
                    }, 500)) : n.Message == "1" ? u() : n.Message != "" ? layer.msg(n.Message, {
                        icon: 5
                    }) : layer.msg("程序异常，请重试或联系作者", {
                        icon: 5
                    })
            },
            error: function () {
                layer.close(i);
                layer.msg("请求异常", {
                    icon: 2
                })
            }
        }),
            !1
    });
    n("#message-list").on("click", ".btn-reply", function () {
        var i = n(this).data("targetid")
            , r = n(this).data("targetname")
            , t = n(this).parent("p").parent().siblings(".replycontainer");
        n(this).text() == "回复" ? (t.find("textarea").attr("placeholder", "回复【" + r + "】"),
            t.removeClass("layui-hide"),
            t.find('input[name="fromid"]').val(i),
            n(this).parents(".message-list li").find(".btn-reply").text("回复"),
            n(this).text("收起")) : (t.addClass("layui-hide"),
                t.find('input[name="fromid"]').val(0),
                n(this).text("回复"))
    });
    t.on("submit(formReply)", function (t) {
        var i = layer.load(1);
        return console.log(t.field),
            n.ajax({
                type: "post",
                url: "https://api.icqcore.com//api/Message/Reply",
                data: {
                    parentId: t.field.rootid,
                    targetId: t.field.targetUserId,
                    contents: filterXSS(t.field.replyContent),
                },
                success: function (n) {
                    layer.close(i);
                    n.success ? (layer.msg(n.message, {
                        icon: 6
                    }),
                        setTimeout(function () {
                            location.reload(!0)
                        }, 500)) : n.message == "1" ? u() : n.message != "" ? layer.msg(n.message, {
                            icon: 5
                        }) : layer.msg("程序异常，请重试或联系作者", {
                            icon: 5
                        })
                },
                error: function () {
                    layer.close(i);
                    layer.msg("请求异常", {
                        icon: 2
                    })
                }
            }),
            !1
    })
});
msg = {};
msg.initarea = function (n) {
}
