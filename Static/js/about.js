var layedit;
layui.use(['jquery', 'form', 'layedit', 'flow', 'laytpl'], function () {
    var form = layui.form,
        laytpl = layui.laytpl,
        $ = layui.jquery,
        layedit = layui.layedit,
        flow = layui.flow;

    var w = $("body").width();

    function AddEmail() {
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

    $(document).ready(function () {
        showmsg();
        if ($("#time").length > 0) {
            systemTime();
        }
        if (w <= 450) {
            $("body").on("click", ".layedit-tool-face", function () {
                $(".layui-util-face").css("left", "0");
            });
        }
    });
    //评论和留言的编辑器
    var editIndex = layedit.build('remarkEditor', {
        height: 150,
        tool: ['strong' //加粗
            , 'italic' //斜体
            , 'underline' //下划线
            , 'del' //删除线

            , '|' //分割线

            , 'left' //左对齐
            , 'center' //居中对齐
            , 'right' //右对齐
            , 'link' //超链接
            , 'unlink' //清除链接
            , 'face' //表情
        ],
    });
    //评论和留言的编辑器的验证
    layui.form.verify({
        content: function (value) {
            value = $.trim(layedit.getText(editIndex));
            if (value == "") return "至少得有一个字吧";
            layedit.sync(editIndex);
        },
        replyContent: function (value) {
            if ($.trim(value) == "") {
                return "至少得有一个字吧!";
            }
        }
    });
    //评论显示
    function showmsg() {
        $("#message-list").children().remove();
        flow.load({
            elem: "#message-list",
            isAuto: true,
            end: "没有更多了哦！╮(╯▽╰)╭",
            done: function (page, next) {
                var lis = [];
                $.ajax({
                    url: "https://api.icqcore.com//api/Message/Get",
                    type: "get",
                    dataType: "json",
                    data: {
                        "page": page,
                        "climit": 5
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layui.each(res.data, function (index, item) {
                                var tpl = msgView.innerHTML;
                                laytpl(tpl).render(item, function (html) {
                                    lis.push(html);
                                });
                            });
                            next(lis.join(''), page < res.count)
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

    //监听留言提交
    form.on('submit(formLeaveMessage)', function (data) {
        var loading = layer.msg("正在提交留言...", {
            icon: 16,
            time: 0
        });
        var url = 'https://api.icqcore.com//api/Message/Comment';
        $.ajax({
            type: "POST",
            url: url,
            data: {
                content: filterXSS(data.field.editorContent),
            },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (res) {
                layer.close(loading);
                if (res.Status == 200) {
                    showmsg();
                    layedit.sync(editIndex);
                    $(window.frames["LAY_layedit_1"].document).find('body').html('');
                    layer.msg("评论成功", {
                        icon: 1
                    });

                } else if (res.Status == 401) {
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
                } else if (res.Status == 302) {
                    AddEmail();
                } else {
                    layer.msg(res.Message);
                }
            },
            error: function (data) {
                layer.close(loading);
                layer.msg("评论失败！");
            }
        });
        return false;
    });

    //监听留言回复提交
    form.on('submit(formReply)', function (data) {
       console.log(data.field.content);
        var loading = layer.msg("正在提交回复...", {
            icon: 16,
            time: 0
        });
        //模拟留言回复
        var url = 'https://api.icqcore.com//api/Message/Reply';
        $.ajax({
            type: "POST",
            url: url,
            data: {
                rootid: data.field.rootid,
                fromid: data.field.fromid,
                content: filterXSS(data.field.content),
            },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (res) {
                layer.close(loading);
                if (res.Status == 200) {
                    showmsg();
                    // btnReplyClick(this);
                    layer.msg("回复成功", {
                        icon: 1
                    });
                } else if (res.Status == 401) {
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
                } else if (res.Status == 302) {
                    AddEmail();
                } else {
                    layer.msg(res.Message);
                }
            },
            error: function (data) {
                layer.close(loading);
                layer.msg("回复失败！");
            }
        });
        return false;
    });


    $("#message-list").on("click", ".btn-reply", function () {
        var i = $(this).data("targetid")
            , r = $(this).data("targetname")
            , t = $(this).parent("p").parent().siblings(".replycontainer");
        $(this).text() == "回复" ? (t.find("textarea").attr("placeholder", "回复【" + r + "】"),
            t.removeClass("layui-hide"),
            t.find('input[name="fromid"]').val(i),
            $(this).parents(".message-list li").find(".btn-reply").text("回复"),
            $(this).text("收起")) : (t.addClass("layui-hide"),
                t.find('input[name="fromid"]').val(0),
                $(this).text("回复"))
    });

});
//加载更多回复
function nextpage(elem) {
    var $ = layui.jquery, laytpl = layui.laytpl;
    var $e = $(elem);
    var rootid = $e.attr("data-rootid");
    var page = $e.attr("data-page");
    var loading = layer.msg("正在加载中...", {
        icon: 16,
        time: 0
    });
    $.get("https://api.icqcore.com//api/Message/Replypage", { "pageindex": page, "rootid": rootid }, function (result) {
        var getTpl = moreView.innerHTML;
        laytpl(getTpl).render(result.data, function (html) {
            $e.parent().before(html)
        });
        if (result.count > page) {
            $e.attr("data-total", result.count);
            $e.attr("data-page", page + 1);
        } else {
            $e.parent().remove();
        }
        layer.close(loading);
    });
}

// function btnReplyClick(elem) {
//     var $ = layui.jquery;
//     $(elem).parent('p').parent('.comment-parent').siblings('.replycontainer').toggleClass('layui-hide');
//     if ($(elem).text() == '回复') {
//         $(elem).text('收起')
//     } else {
//         $(elem).text('回复')
//     }
//     var i = n(this).data("targetid")
//         , r = n(this).data("targetname")
//         , t = n(this).parent("p").parent().siblings(".replycontainer");
//     n(this).text() == "回复" ? (t.find("textarea").attr("placeholder", "回复【" + r + "】"),
//         t.removeClass("layui-hide"),
//         t.find('input[name="targetUserId"]').val(i),
//         n(this).parents(".message-list li").find(".btn-reply").text("回复"),
//         n(this).text("收起")) : (t.addClass("layui-hide"),
//             t.find('input[name="targetUserId"]').val(0),
//             n(this).text("回复"))
// }




function systemTime() {
    //获取系统时间。
    var dateTime = new Date();
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hh = dateTime.getHours();
    var mm = dateTime.getMinutes();
    var ss = dateTime.getSeconds();
    //分秒时间是一位数字，在数字前补0。
    mm = extra(mm);
    ss = extra(ss);

    //将时间显示到ID为time的位置，时间格式形如：19:18:02
    document.getElementById("time").innerHTML = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
    //每隔1000ms执行方法systemTime()。
    setTimeout("systemTime()", 1000);
}

//补位函数。
function extra(x) {
    //如果传入数字小于10，数字前补一位0。
    if (x < 10) {
        return "0" + x;
    } else {
        return x;
    }
}