layui.use(["flow", "jquery", "layer", "form", 'laytpl'], function () {
    var $ = layui.jquery,
        flow = layui.flow,
        laytpl = layui.laytpl,
        form = layui.form,
        layer = layui.layer;
    var id = getQueryVariable("id");
    getArticeleById(id);

    

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }
    function getArticeleById(id) {
        $.ajax({
            url: "https://api.icqcore.com//api/Blog/"+id+"",
            type: "get",
            dataType: "json",
            data: "",
            success: function (res) {
                if (res.success == true&&res.data!=null) {
                     var tpl = articleView.innerHTML;
                     laytpl(tpl).render(res.data, function (html) {
                         $("#article-read").append(html);
                     });
                     $("#aid").val(res.data.bID);
                     console.log(res.data.bID);
                     
                } else {
                    layer.msg("参数错误！", {
                        icon: 2,
                        time: 2000,
                        shade: 0.5
                    })
                    var tpl = errorView.innerHTML;
                     laytpl(tpl).render("参数错误！", function (html) {
                         $("#article-read").append(html);
                     });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.msg("网络错误，请稍后尝试！")
            }
        });
    }
})
