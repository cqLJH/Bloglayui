layui.use(["jquery", "layer", 'laytpl'], function () {
    var $ = layui.jquery,
        laytpl = layui.laytpl,
        layer = layui.layer;
    getDiaryList();

    function getDiaryList() {
        layer.load();
        $.ajax({
            url: "https://api.icqcore.com//api/Diary/Get",
            type: "get",
            dataType: "json",
            data: "",
            success: function (res) {
                if (res.success == true) {
                    var tpl = DiaryView.innerHTML;
                    laytpl(tpl).render(res.data, function (html) {
                        $("#Diary").append(html);
                    });
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
        });
        layer.closeAll('loading');
    }
})