layui.use(['jquery', 'layer', 'laytpl'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        laytpl = layui.laytpl;
        layer.config({
            extend: ['skin/style.css'], 
            skin: 'layer-ext-pintuer' //采用pintuer皮肤。
        });
    var url = location.pathname.split("?")[0];
    if (url == "/") {
        $("[lay-filter='nav'] a:eq(0)").parent().addClass("layui-this");
    } else {
        $("[lay-filter='nav'] a").each(function () {
            if ($(this).attr("href") == url) {
                $(this).parent().addClass("layui-this");
            }
        })
    }
    //获取Cookie
    function getCookie(userName) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(userName + "=");
            if (c_start != -1) {
                c_start = c_start + userName.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return document.cookie.substring(c_start, c_end);
            }
        }
        return "1";
    }
    //清除Cookie
    function clearAllCookie() {
        var keys = document.cookie.match(/[^ =;]+(?==)/g)
        if (keys) {
          for (var i = keys.length; i--;) {
              console.log(keys[i]);
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()
            document.cookie = keys[i] + '=0;path=/;domain=.icqcore.com;expires=' + new Date(0).toUTCString()
          }
        }
    }
    var user = unescape(decodeURI(getCookie('User')));


    var qqtpl = QQView.innerHTML;
    view = document.getElementById('qqlogin');
    var obj = JSON.parse(user);
    laytpl(qqtpl).render(obj, function (html) {
        view.innerHTML = html;
        $("#login").click(function () {
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

        $("#loginout").click(function () {
            layer.confirm('您确定要退出登录吗？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                $.get("https://api.icqcore.com//api/QQLogin/SignOut", "", function (data) {
                    if (data.Status == 200) {
                        clearAllCookie();
                        window.location.reload();
                    } else {
                        layer.msg("退出登录错误！", { icon: 5 });
                    }
                });
            });
        });
    });
});