layui.use(["flow", "jquery", "layer", "form", 'laytpl'], function () {
    var $ = layui.jquery,
        flow = layui.flow,
        laytpl = layui.laytpl,
        form = layui.form,
        layer = layui.layer;
    getArticleList();
    getCategoryList();
    getHotTopList();
    getTopUserList();

    form.on("submit(searchForm)", function (data) {
        var keyword = $("#keywords").val();
        if (keyword == null || keyword == "") {
            layer.msg("请输入要搜索的关键字");
            return false
        }
        search(keyword);
        return false
    });


    function getArticleList(search, classify) {
        var searchWord = (search === undefined) ? "" : search;
        var searchClassify = (classify === undefined) ? "" : classify;
        flow.load({
            elem: "#LAY_bloglist",
            isAuto: true,
            end: "没有更多了哦！╮(╯▽╰)╭",
            done: function (page, next) {
                var lis = [];
                $.ajax({
                    url: "https://api.icqcore.com//api/Blog/GetByPage",
                    type: "get",
                    dataType: "json",
                    data: {
                        "key": searchWord,
                        "bcategory": searchClassify,
                        "page": page,
                        "intTotalCount": 5
                    },
                    success: function (res) {
                        if (res.success == true) {
                            layui.each(res.data, function (index, item) {
                                var tpl = ArticleView.innerHTML;
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

    function getCategoryList() {
        $.ajax({
            url: "https://api.icqcore.com//api/Blog/GetCategory",
            type: "get",
            dataType: "json",
            data: "",
            success: function (res) {
                if (res.success == true) {
                    var pctpl = pcCategoryView.innerHTML;
                    laytpl(pctpl).render(res.data, function (html) {
                        $("#category").append(html);
                    });
                    var phonetpl = phoneCategoryView.innerHTML;
                    laytpl(phonetpl).render(res.data, function (html) {
                        $(".phonecategory").append(html);
                    });

                    var slider = 0;
                    blogtype();

                    function blogtype() {
                        $('#category li').hover(function () {
                            $(this).addClass('current');
                            var num = $(this).attr('data-index');
                            $('.slider').css({
                                'top': ((parseInt(num) - 1) * 40) + 'px'
                            });
                        }, function () {
                            $(this).removeClass('current');
                            $('.slider').css({
                                'top': slider
                            });
                        });
                        $(window).scroll(function (event) {
                            var winPos = $(window).scrollTop();
                            if (winPos > 750)
                                $('#categoryandsearch').addClass('fixed');
                            else
                                $('#categoryandsearch').removeClass('fixed');
                        });
                    }


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
    }

    function getHotTopList() {
        $.ajax({
            url: "https://api.icqcore.com//api/Blog/HotTop",
            type: "get",
            dataType: "json",
            data: {
                "top": 5,
            },
            success: function (res) {
                if (res.success == true) {
                    var pctpl = hotArticleView.innerHTML;
                    laytpl(pctpl).render(res.data, function (html) {
                        $("#hot-list-article").append(html);
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
        $.ajax({
            url: "https://api.icqcore.com//api/Blog/HotTop",
            type: "get",
            dataType: "json",
            data: {
                "top": 10,
                "isAsc": "false"
            },
            success: function (res) {
                if (res.success == true) {
                    var pctpl = topArticleView.innerHTML;
                    laytpl(pctpl).render(res.data, function (html) {
                        $("#top-list-article").append(html);
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

    }
    function getTopUserList() {
        $.ajax({
            url: "https://api.icqcore.com//api/QQLogin/GetTopUser",
            type: "get",
            dataType: "json",
            data: "",
            success: function (res) {
                if (res.success == true) {
                    var usertpl = QQUserView.innerHTML;
                    laytpl(usertpl).render(res.data, function (html) {
                        $("#vistor").append(html);
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
    }


    function search(keyword) {
        $("#LAY_bloglist").empty();
        getArticleList(keyword)
    }

    window.getCategoryById = function (category) {
        $("#LAY_bloglist").empty();
        var keyword = $("#keywords").val();
        if (category == "") keyword = "";
        getArticleList(keyword, category)
    };
})

// function getCategoryById(category) {
//     $("#LAY_bloglist").empty();
//     var keyword = $("#keywords").val();
//     getArticleList(keyword, category)
// };