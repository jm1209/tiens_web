layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/news/info/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/news/info/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/news/info/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');

    $('.newsModelType').html(
        '<option value="">' + (lan == 2 ? "please choose" : "请选择") + '</option>' +
        '<option value="0">' + (lan == 2 ? "breviary" : "缩略图") + '</option>' +
        '<option value="1">' + (lan == 2 ? "banner" : "横图") + '</option>' +
        '<option value="2">' + (lan == 2 ? "video" : "视频") + '</option>'
    );

    form.render();

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    $('.delAll_btn span').html(DELETE || '批量删除');
    $('.title1').html(TITLE || '标题');
    $('.classify').html(CLASSIFY || '分类');
    $('.time').html(TIME || '时间范围');
    $('.type').html(TYPE || '类型');
    $('.roleName').attr('placeholder', SEARCHNAME || '请输入角色名称');
    $('.newsTitle').attr('placeholder', SEARCHTITLE || '请输入标题');
    $('#createTime').attr('placeholder', SEARCHTIME || '请选择时间范围');


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/news/category/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.newsCategoryId').append(' <option value="">' + (CHOOSE || "请选择类型") + '</option>')
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].categoryName + '</option>';
            $('.newsCategoryId').append(str)
        }
        $('.newsCategoryId').val($('.newsCategoryId').attr('val'));
        form.render();
    });

    //初始化数据表格
    tableInit(table, 'get/complex/news/info/select', [[
        {type: "checkbox", width: 50},
        {field: 'newsTitle', title: TITLE || '标题', align: 'center'},
        {field: 'newsCategoryName', title: CLASSIFY || '分类', align: 'center'},
        {
            field: 'newsModelType', title: TYPE || '模板类型', align: 'center', width: 100, templet: function (d) {
                if (d.newsModelType == '0') {
                    return BREVIARY || '缩略图';
                } else if (d.newsModelType == '1') {
                    return BANNER || '横向';
                } else if (d.newsModelType == '2') {
                    return VIDEO || '视频';
                } else {
                    return ''
                }
            }
        },
        {
            field: 'newsIsTop', title: SETTOP || '是否置顶', align: 'center', width: 100, templet: function (d) {
                if (d.newsIsTop == '0') {
                    return NOTSETTOP || '不置顶';
                } else {
                    return SETTOP || '置顶';
                }
            }
        },
        {
            field: 'newsStatus', title: ENABLED || '是否启用', align: 'center', width: 100, templet: function (d) {
                if (d.newsStatus == '0') {
                    return NOTENABLED || '未启用';
                } else {
                    return ENABLED || '启用';
                }
            }
        },
        {
            field: 'newsImageSmall', title: MEDIA || '资讯主题', align: 'center', templet: function (d) {
                if (d.newsImageSmall == null || d.newsImageSmall == '') {
                    return ''
                } else {
                    return '<img class="preview" src="' + d.newsImageSmall + '" height="56">';
                }
            }
        },
        {field: 'newsPageView', title: POINT || '浏览量', align: 'center', width: 100},
        {field: 'newsPointNumber', title: SHARE || '点赞量', align: 'center', width: 100},
        {field: 'newsShareCount', title: PAGEVIEW || '转发量', align: 'center', width: 100},
        {
            title: HANDLETYPE || '操作', width: 150, align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var newsModelType, newsCategoryId;
    form.on('select(newsCategoryId)', function (data) {
        newsCategoryId = data.value;
    });
    form.on('select(newsModelType)', function (data) {
        newsModelType = data.value;
    });

    laydate.render({
        elem: '#createTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime'
    });

    //搜索
    $(".search_btn").on("click", function () {
        var createStartTime = $('#createTime').val().split(' - ')[0];
        var createEndTime = $('#createTime').val().split(' - ')[1] || '';

        search($, table,form, {
            newsTitle: $(".newsTitle").val(),
            newsModelType: newsModelType,
            newsCategoryId: newsCategoryId,
            createStartTime: createStartTime,
            createEndTime: createEndTime,
        });
    });

    //添加和编辑
    function addOrEdit(title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "newsMessageAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".newsCategoryId").attr('val', edit.newsCategoryId);
                    body.find(".newsTitle").val(edit.newsTitle);
                    body.find(".newsDescription").val(edit.newsDescription);
                    body.find(".newsDetail").val(edit.newsDetail);
                    body.find(".newsPageView").val(edit.newsPageView);
                    body.find(".newsPointNumber").val(edit.newsPointNumber);
                    body.find(".newsShareCount").val(edit.newsShareCount);
                    body.find(".newsEditor").val(edit.newsEditor);
                    body.find(".newsModelType").attr('newsModelType', edit.newsModelType);
                    body.find(".newsIsTop").attr("newsIsTop", edit.newsIsTop);
                    body.find(".newsStatus").attr("newsStatus", edit.newsStatus);
                    body.find("#newsDetail").attr('val', edit.newsDetail);

                    if (edit.newsModelType == '0') {
                        body.find(".isBreviary").show();
                        body.find(".isBanner").hide();
                        body.find(".isVideo").hide();
                        body.find('#uploadBreviary .showImg').show();
                        body.find('#uploadBreviary .upload-wrapper').hide();
                        body.find("#uploadBreviary img").attr('src', edit.newsImageBig)
                            .attr('smallPic', edit.newsImageSmall);

                    } else if (edit.newsModelType == '1') {
                        body.find(".isBreviary").hide();
                        body.find(".isBanner").show();
                        body.find(".isVideo").hide();
                        body.find('#uploadBanner .showImg').show();
                        body.find('#uploadBanner .upload-wrapper').hide();
                        body.find("#uploadBanner img").attr('src', edit.newsImageBig)
                            .attr('smallPic', edit.newsImageSmall);

                    } else if (edit.newsModelType == '2') {
                        body.find(".isBreviary").hide();
                        body.find(".isBanner").hide();
                        body.find(".isVideo").show();
                        body.find('#uploadVideo .showImg').show();
                        body.find('#uploadVideo .upload-wrapper').hide();
                        body.find("#uploadVideo video").attr('src', edit.newsVideo)
                            .attr('smallPic', edit.newsImageSmall)
                            .attr('bigpic', edit.newsImageBig)
                    }

                    var tagNameArr = edit.newsKeyword.split(',');
                    var tagColorArr = edit.newsKeyColor.split(',');
                    for (var i = 0; i < tagNameArr.length; i++) {
                        var name = tagNameArr[i];
                        var color = tagColorArr[i];
                        editTag(body, name, color)
                    }
                    setTimeout(function () {
                        form.render();
                    }, 500)
                }
                setTimeout(function () {
                    layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }

    function editTag(body, name, color) {
        var str = ' <li class="tag" style="background-color: ' + color + ';">' +
            '       <img src="../../../images/tag-cover.png">' +
            '       <span class="tagText">' + name + '</span>' +
            '       <i class="delTag">×</i>' +
            '       </li>';
        body.find(".tagList").append(str);

        body.find('.delTag').each(function () {
            $(this).click(function () {
                $(this).parents('.tag').remove()
            });
        });
    }

    $(".add_btn").click(function () {
        addOrEdit(ADD || "添加资讯");
    });

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'),
            data = checkStatus.data,
            idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(DEL_PROMPT || '确定删除选中的资讯？', {
                icon: 3,
                title: COMMENT || '提示信息',
                btnAlign: 'c'
            }, function (index) {
                param.url = 'get/complex/news/info/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的资讯");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit(EDIT || '编辑资讯', data);
        } else if (layEvent === 'see') {
            see(data);
        }
    });

    function see(data) {
        var index = layui.layer.open({
            title: SEE || '查看资讯',
            type: 2,
            content: "newsSee.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

                body.find(".newsCategoryId").attr('val', data.newsCategoryId);
                body.find("#newsTitle").val(data.newsTitle);
                body.find("#newsDescription").val(data.newsDescription);
                body.find("#newsDetail").val(data.newsDetail);
                body.find("#newsPageView").val(data.newsPageView);
                body.find("#newsPointNumber").val(data.newsPointNumber);
                body.find("#newsShareCount").val(data.newsShareCount);
                body.find(".newsEditor").val(data.newsEditor);
                body.find(".newsModelType").attr('newsModelType', data.newsModelType);
                body.find("#newsIsTop").val(data.newsIsTop == '0' ? NOTSETTOP || '不置顶' : SETTOP || '置顶');
                body.find("#newsStatus").val(data.newsStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用');
                body.find("#newsDetail").attr('val', data.newsDetail);

                if (data.newsModelType == '0') {
                    body.find(".isBreviary").show();
                    body.find(".isBanner").hide();
                    body.find(".isVideo").hide();
                    body.find('#uploadBreviary .showImg').show();
                    body.find('#uploadBreviary .upload-wrapper').hide();
                    body.find("#uploadBreviary img").attr('src', data.newsImageSmall)
                        .attr('smallPic', data.newsImageBig);

                } else if (data.newsModelType == '1') {
                    body.find(".isBreviary").hide();
                    body.find(".isBanner").show();
                    body.find(".isVideo").hide();
                    body.find('#uploadBanner .showImg').show();
                    body.find('#uploadBanner .upload-wrapper').hide();
                    body.find("#uploadBanner img").attr('src', data.newsImageBig)
                        .attr('smallPic', data.newsImageSmall);

                } else if (data.newsModelType == '2') {
                    body.find(".isBreviary").hide();
                    body.find(".isBanner").hide();
                    body.find(".isVideo").show();
                    body.find('#uploadVideo .showImg').show();
                    body.find('#uploadVideo .upload-wrapper').hide();
                    body.find("#uploadVideo video").attr('src', data.newsVideo)
                        .attr('smallPic', data.newsImageSmall)
                        .attr('bigpic', data.newsImageBig)
                }

                var tagNameArr = data.newsKeyword.split(',');
                var tagColorArr = data.newsKeyColor.split(',');
                for (var i = 0; i < tagNameArr.length; i++) {
                    var name = tagNameArr[i];
                    var color = tagColorArr[i];
                    editTag(body, name, color)
                }
                form.render();

                setTimeout(function () {
                    layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }
});

function goLogin() {
    parent.goLogin()
}
function showImg(src) {
    parent.showImg(src);
}