layui.use(['jquery', 'util', 'laytpl',], function () {
    var $ = layui.jquery,
        laytpl = layui.laytpl,
        util = layui.util;
    $(window).load(function () {
        $("#loading").fadeOut(500);
        new WOW().init();
    })
    util.fixbar();;
    $('.next').click(function () {
        $('html,body').animate({
            scrollTop: $('#section1').outerHeight() + 1
        }, 600);
    });
    $('#menu').on('click', function () {
        var mark = $(this).attr('data-mark');
        if (mark === 'false') {
            $(this).removeClass('menu_open').addClass('menu_close');
            //open
            $('#navgation').removeClass('navgation_close').addClass('navgation_open');
            $(this).attr({ 'data-mark': "true" });
        } else {
            $(this).removeClass('menu_close').addClass('menu_open');
            //close
            $('#navgation').removeClass('navgation_open').addClass('navgation_close');
            $(this).attr({ 'data-mark': "false" });
        }
    });


    $(document).ready(function () {
        //显示主页的3条置顶数据
        showblogArticle();
    });

    function showblogArticle() {
        layer.load();
        $.ajax({
            type: "GET",
            dateType: 'jsonp',
            url: "https://api.icqcore.com//api/Blog/HotTop",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (res) {
                var hot = res.data;
                var getTpl = HotView.innerHTML;
                laytpl(getTpl).render(hot, function (html) {
                    $("#Hot").append(html);
                });
                layer.closeAll('loading');

            },
            error: function (data) {
                layer.closeAll('loading');
                layer.msg("网络错误，请稍后尝试！");
            }
        });
    }
});