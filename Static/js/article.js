/**
 * Created by 相守莫相望 on 2020/1/23.
 */
var article = {};
article.Init = function (n) {
    function r() {
        n(".category-toggle").addClass("layui-hide");
        n(".article-category").unbind("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend");
        n(".blog-mask").unbind("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend");
        n(".blog-mask").removeClass("maskOut").addClass("maskIn");
        n(".blog-mask").removeClass("layui-hide").addClass("layui-show");
        n(".article-category").removeClass("categoryOut").addClass("categoryIn");
        n(".article-category").addClass("layui-show")
    }
    function i() {
        n(".blog-mask").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            n(".blog-mask").addClass("layui-hide")
        });
        n(".article-category").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            n(".article-category").removeClass("layui-show");
            n(".category-toggle").removeClass("layui-hide")
        });
        n(".blog-mask").removeClass("maskIn").addClass("maskOut").removeClass("layui-show");
        n(".article-category").removeClass("categoryIn").addClass("categoryOut")
    }
    function u() {
        var i = n("#blogtypeid").val();
        i != 0 && (t = parseInt(i) * 40,
            n(".slider").css({
                top: t + "px"
            }));
        n("#category li").hover(function () {
            n(this).addClass("current");
            var t = n(this).attr("data-index");
            n(".slider").css({
                top: (parseInt(t) - 1) * 40 + "px"
            })
        }, function () {
            n(this).removeClass("current");
            n(".slider").css({
                top: t
            })
        });
        n(window).scroll(function () {
            var t = n(window).scrollTop();
            t > 750 ? n("#categoryandsearch").addClass("fixed") : n("#categoryandsearch").removeClass("fixed")
        })
    }
    var t = 0;
    u();
    n(".category-toggle").click(function (n) {
        n.stopPropagation();
        r()
    });
    n(".article-category").click(function () {
        i()
    });
    n(".blog-mask").click(function () {
        i()
    });
    n(".f-qq").on("click", function () {
        window.open("http://connect.qq.com/widget/shareqq/index.html?url=" + n(this).attr("href") + "&sharesource=qzone&title=" + n(this).attr("title") + "&pics=" + n(this).attr("cover") + "&summary=" + n(this).attr("desc") + "&desc=你的分享简述" + n(this).attr("desc"))
    });
    n("#searchtxt").on("keyup", function () {
        setTimeout(function () {
            "" == n("#searchtxt").val().trim() ? n(".search-result").empty().hide() : n.ajax({
                type: "post",
                url: "/Right/SearchResult",
                data: {
                    context: n("#searchtxt").val().trim()
                },
                success: function (a) {
                    0 != a ? (n(".search-result").show().empty(),
                        a = eval(a),
                        n.each(a, function (t, i) {
                            n(".search-result").append('<li class="child"><a href="/Blog/Read/' + i.ID + '" style="display:block">' + i.Title.toLowerCase().replace(n("#searchtxt").val().trim().toLowerCase(), '<b style="color:#6bc30d">' + n("#searchtxt").val().trim() + "<\/b>") + "<\/a><\/li>")
                        })) : n(".search-result").hide().empty()
                },
                complete: function () {
                    "" != n("#searchtxt").val().trim() && n(".search-icon i").removeClass("fa-search").addClass("fa-times")
                }
            })
        }, 500)
    });
    n("body").delegate(".fa-times", "click", function () {
        n(".search-result").hide().empty();
        n("#searchtxt").val("");
        n(".search-icon i").removeClass("fa-times").addClass("fa-search")
    })
}
