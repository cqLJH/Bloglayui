
layui.use(["flow", "jquery", "layer", "form", 'laytpl'], function () {
    var $ = layui.jquery,
        flow = layui.flow,
        laytpl = layui.laytpl,
        form = layui.form,
        layer = layui.layer;
    layer.config({
        extend: ['skin/style.css'],
        skin: 'layer-ext-pintuer' //采用pintuer皮肤。
    });
    getLinkList();
    function getLinkList() {
        flow.load({
            elem: "#LAY_linklist",
            isAuto: true,
            end: "没有更多了哦！╮(╯▽╰)╭",
            done: function (page, next) {
                var lis = [];
                $.ajax({
                    url: "https://api.icqcore.com//api/Link/Get",
                    type: "get",
                    dataType: "json",
                    data: {
                        "page": page,
                        "intTotalCount": 10
                    },
                    success: function (res) {
                        if (res.success == true) {
                            layui.each(res.data, function (index, item) {
                                var tpl = LinkView.innerHTML;
                                laytpl(tpl).render(item, function (html) {
                                    lis.push(html);
                                });
                            });
                            next(lis.join(''), page < res.pageCount)
                        } else {
                            layer.msg("参数错误！", {
                                icon: 2,
                                time: 2000,
                                shade: 0.5
                            })
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.msg("网络错误，请稍后尝试！")
                    }
                })
            }
        })

    }

    $("#PutLink").on("click", function () {
        console.log($("#loginout").length);
        console.log($("#login").length);

        if ($("#login").length == 0) {
            var i = '<form class="layui-form layui-form-pane" id="emailform" style="padding:20px;text-align: center;">';
            i += '<div class="layui-form-item"><p>邮箱只用来接收回复消息,不作他用,请放心填写<\/p><p style="color:red">暂时不支持修改,请谨慎填写<\/p><\/div>';

            i += '<div class="layui-form-item">';
            i += '<label class="layui-form-label">网站名称<\/label>';
            i += '<div class="layui-input-block">';
            i += '<input type="text" name="linkName" autocomplete="off" class="layui-input" placeholder="请填写网站名称,请谨慎填写" lay-verify="required" maxLength=50>';
            i += "<\/div>";
            i += "<\/div>";

            i += '<div class="layui-form-item">';
            i += '<label class="layui-form-label">网站链接<\/label>';
            i += '<div class="layui-input-block">';
            i += '<input type="text" name="linkUrl" autocomplete="off" class="layui-input" placeholder="请填写网站链接,请谨慎填写" lay-verify="required|link" maxLength=50>';
            i += "<\/div>";
            i += "<\/div>";

            i += '<div class="layui-form-item">';
            i += '<label class="layui-form-label">网站Logo<\/label>';
            i += '<div class="layui-input-block">';
            i += '<input type="text" name="linkLogo" autocomplete="off" class="layui-input" placeholder="请填写网站Logo链接,请谨慎填写" lay-verify="required|link" maxLength=50>';
            i += "<\/div>";
            i += "<\/div>";

            i += '<div class="layui-form-item">';
            i += '<label class="layui-form-label">站长邮箱<\/label>';
            i += '<div class="layui-input-block">';
            i += '<input type="text" name="linkEmail" autocomplete="off" class="layui-input" placeholder="暂时不支持修改邮箱,请谨慎填写" lay-verify="required|email" maxLength=50>';
            i += "<\/div>";
            i += "<\/div>";

            i += '<div class="layui-form-item">';
            i += '<label class="layui-form-label">描述<\/label>';
            i += '<div class="layui-input-block">';
            i += '<input type="text" name="linkExplain" autocomplete="off" class="layui-input" placeholder="请填写网站描述" lay-verify="required" maxLength=50>';
            i += "<\/div>";
            i += "<\/div>";
            i += ' <button class="layui-btn layui-btn-normal" lay-submit lay-filter="putlink">立即提交<\/button>';
            i += "<\/form>";
            var c = layer.open({
                type: 1,
                title: "友链申请",
                offset: "auto",
                area: "50%",
                id: "layeremail",
                skin: "layui-layer-lan",
                content: i
            });

            //链接验证
            layui.form.verify({
                link: [
                    /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
                    , '链接地址不正确'
                ]
            });
            form.on("submit(putlink)", function (data) {
                var loading = layer.msg("正在提交...", {
                    icon: 16,
                    time: 0
                });
                $.ajax({
                    type: "put",
                    url: "https://api.icqcore.com/api/Link/Add",
                    data: JSON.stringify(data.field),
                    contentType: 'application/json-patch+json',
                    dataType: "json",
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    success: function (res) {
                        layer.close(loading);
                        if (res.Status == 200) {
                            layer.msg("已提交", {
                                icon: 1
                            }),
                                setTimeout(function () {
                                    layer.close(c);
                                }, 1e3);
                        } else if (res.Status == 401) {
                            layer.confirm('您还没有登录，是否前往登录？', {
                                btn: ['是', '否'] //按钮
                            }, function () {
                                var loading = layer.msg("正在通过QQ登录", {
                                    icon: 16,
                                    time: 0
                                });
                                $.get("https://api.icqcore.com/api/QQLogin/Login", "", function (result) {
                                    layer.close(loading);
                                    if (result.Status == 200) {
                                        window.location.href = result.Data;
                                    } else {
                                        layer.msg(result.Message, { icon: 5 });
                                    }
                                });
                            });
                        } else {
                            layer.msg(res.Message);
                        }
                    },
                    error: function () {
                        layer.msg("请求异常", {
                            icon: 2
                        })
                    }
                });
                return false;
            })
        } else {
            layer.confirm('您还没有登录，是否前往登录？', {
                btn: ['是', '否'] //按钮
            }, function () {
                var loading = layer.msg("正在通过QQ登录", {
                    icon: 16,
                    time: 0
                });
                $.get("https://api.icqcore.com//api/QQLogin/Login", "", function (result) {
                    layer.close(loading);
                    if (result.Status == 200) {
                        window.location.href = result.Data;
                    } else {
                        layer.msg(result.Message, { icon: 5 });
                    }
                });
            });
        }
    });

    function AddLink() {
        var i = '<form class="layui-form layui-form-pane" id="emailform" style="padding:20px;text-align: center;">';
        i += '<div class="layui-form-item"><p>邮箱只用来接收回复消息,不作他用,请放心填写<\/p><p style="color:red">暂时不支持修改,请谨慎填写<\/p><\/div>';
        i += '<div class="layui-form-item">';
        i += '<label class="layui-form-label">邮箱<\/label>';
        i += '<div class="layui-input-block">';
        i += '<input type="text" name="Email" autocomplete="off" class="layui-input" placeholder="暂时不支持修改邮箱,请谨慎填写" lay-verify="required|email" maxLength=50>';
        i += "<\/div>";
        i += "<\/div>";
        i += ' <button class="layui-btn layui-btn-primary" lay-submit lay-filter="addlink">立即提交<\/button>';
        i += "<\/form>";
        layer.open({
            type: 1,
            title: "补填邮箱",
            offset: "auto",
            area: "50%",
            id: "layeremail",
            content: i
        });
        form.on("submit(emaillink)", function () {
            return $.ajax({
                type: "post",
                url: "https://api.icqcore.com//api/QQLogin/AddEmail",
                data: $("#emailform").serialize(),
                xhrFields: { withCredentials: true },
                crossDomain: true,
                success: function (n) {
                    n.Status == 200 ? (layer.msg(n.Message, {
                        icon: 6
                    }),
                        setTimeout(function () {
                            layer.closeAll()
                        }, 1e3)) : n.Message != "" ? layer.msg(n.Message, {
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
})