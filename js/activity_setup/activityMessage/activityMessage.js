layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');


    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/activity/info/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/activity/info/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/activity/info/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.classifyname').html(CLASSIFY || '分类名称');
    $('.isenable').html(ISENABLED || '是否启用');
    $('.title').html(TITLE || '标题');
    $('.jumptype').html(JUMPTYPE || '跳转类型');
    $('.starttime').html(STARTTIME || '开始时间');
    $('.endtime').html(ENDTIME || '结束时间');


    $('.actTitle').attr('placeholder', TITLE || '请输入标题');
    $('#actSDate').attr('placeholder', TIME || '请选择时间范围');
    $('#actEDate').attr('placeholder', TIME || '请选择时间范围');

    if (lan == '2') {
        $('.actTargetType').html(
            '<option value="">please choose</option>' +
            '<option value="0">rich text</option>' +
            '<option value="1">type of business</option>' +
            '<option value="2">small application</option>' +
            '<option value="3">out connection</option>'
        );
    } else {
        $('.actTargetType').html(
            '<option value="">请选择跳转类型</option>' +
            '<option value="0">富文本</option>' +
            '<option value="1">业态</option>' +
            '<option value="2">小程序</option>' +
            '<option value="3">外连接</option>'
        );
    }
    form.render();


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //初始化数据表格
    tableInit(table, 'get/complex/activity/info/select', [[
        {type: "checkbox", width: 50},
        {field: 'actTitle', title: TITLE || '标题', align: 'center'},
        {field: 'actCategoryName', title: CLASSIFY || '分类名称', align: 'center'},
        {
            field: 'actTargetType', width: 100, title: JUMPTYPE || '跳转类型', align: 'center', templet: function (d) {
                if (d.actTargetType == '0') {
                    return RICHTEXT || '富文本';
                } else if (d.actTargetType == '1') {
                    return BUSSINESSTYPE || '业态';
                } else if (d.actTargetType == '2') {
                    return SMALLAPP || '小程序';
                } else {
                    return OUTCONNECTION || '外连接';
                }
            }
        },
        {
            field: 'actIsTop', title: SETTOP || '是否置顶', align: 'center', width: 100, templet: function (d) {
                return d.actIsTop == '0' ? NOTSETTOP || '不置顶' : SETTOP || '置顶';
            }
        },
        {
            field: 'actStatus', title: ISENABLED || '是否启用', align: 'center', width: 100, templet: function (d) {
                return d.actStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        },
        {
            field: 'actImageBig', title: IMAGE || '活动主图', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.actImageBig + '" height="56">';
            }
        },
        {field: 'actStartTime', title: STARTTIME || '活动开始时间', align: 'center'},
        {field: 'actEndTime', title: ENDTIME || '活动结束时间', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 120, fixed: 'right', align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>' +
                        '   <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑') + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>';
                }
            }
        }
    ]]);

    var actTargetType, actSSDate, actSEDate, actESDate, actEEDate;
    form.on('select(actTargetType)', function (data) {
        actTargetType = data.value;
    });

    laydate.render({
        elem: '#actSDate',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {
            actSSDate = value.split(' - ')[0];
            actSEDate = value.split(' - ')[1];
        }
    });
    laydate.render({
        elem: '#actEDate',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {
            actESDate = value.split(' - ')[0];
            actEEDate = value.split(' - ')[1];
        }
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            actTitle: $(".actTitle").val(),
            actTargetType: actTargetType,
            actSSDate: actSSDate,
            actSEDate: actSEDate,
            actESDate: actESDate,
            actEEDate: actEEDate,
        });
    });
    $(".add_btn").click(function () {
        addOrEdit(ADD || "添加活动");
    });

    //添加和编辑
    function addOrEdit(title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "activityMessageAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".actCategoryId").attr('actCategoryId', edit.actCategoryId);
                    body.find(".actTitle").val(edit.actTitle);
                    body.find(".actDescription").val(edit.actDescription);
                    body.find(".actPageView").val(edit.actPageView);
                    body.find(".actPointNumber").val(edit.actPointNumber);
                    body.find(".actShareCount").val(edit.actShareCount);
                    body.find(".actKeyword").val(edit.actKeyword);
                    body.find("#actTime").val(edit.actStartTime + ' - ' + edit.actEndTime);
                    body.find(".actTargetType").attr('actTargetType', edit.actTargetType);
                    body.find(".actStatus").attr("actStatus", edit.actStatus);
                    body.find(".actIsTop").attr("actIsTop", edit.actIsTop);
                    body.find(".showImg").show().find('img').attr('src', edit.actImageBig);
                    body.find(".upload-wrapper").hide();
                    body.find("#actDetail").attr('val', edit.actDetail);
                    body.find(".actDetailUrl").val(edit.actDetailUrl);
                    if (edit.actTargetType != '0') {
                        body.find('.ueditor').hide();
                        body.find('.actAdress').show();
                    } else {
                        body.find('.ueditor').show();
                        body.find('.actAdractCategoryIdess').hide();
                    }
                    var tagNameArr = edit.actKeyword.split(',');
                    var tagColorArr = edit.actKeyColor.split(',');
                    for (var i = 0; i < tagNameArr.length; i++) {
                        var name = tagNameArr[i];
                        var color = tagColorArr[i];
                        editTag(body, name, color)
                    }
                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
        layui.layer.full(index);
        $(window).on("resize", function () {
            layui.layer.full(index);
        })

    }

    function editTag(body, name, color) {
        var str = ' <li class="tag" style="background-color: ' + color + ';">' +
            '       <img src="../../../images/tag-cover.png">' +
            '       <span class="tagText">' + name + '</span>' +
            '       <i class="delTag">×</i>' +
            '       </li>'
        body.find(".tagList").append(str);

        body.find('.delTag').each(function () {
            $(this).click(function () {
                $(this).parents('.tag').remove()
            });
        });
    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'),
            data = checkStatus.data,
            idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(DEL_PROMPT || '确定删除选中的活动？', {
                icon: 3,
                title: MESSAGE || '提示信息',
                btnAlign: 'c'
            }, function (index) {
                param.url = 'get/complex/activity/info/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的活动");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit(EDIT || '编辑活动', data);
        } else if (layEvent === 'see') {
            var index = layui.layer.open({
                title: SEE || '查看活动',
                type: 2,
                content: "activitySee.html",
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);

                    body.find(".actCategoryId").attr('actCategoryId', data.actCategoryId);
                    body.find(".actTitle").val(data.actTitle);
                    body.find(".actDescription").val(data.actDescription);
                    body.find("#actDetail").attr('val', data.actDetail);
                    body.find(".actPageView").val(data.actPageView);
                    body.find(".actPointNumber").val(data.actPointNumber);
                    body.find(".actShareCount").val(data.actShareCount);
                    body.find(".actKeyword").val(data.actKeyword);
                    body.find("#actTime").val(data.actStartTime + ' - ' + data.actEndTime);
                    body.find(".actTargetType").attr('actTargetType', data.actTargetType);
                    body.find(".actStatus").attr("actStatus", data.actStatus);
                    body.find(".actIsTop").attr("actIsTop", data.actIsTop);
                    body.find(".uploadImg img").attr('src', data.actImageBig);
                    body.find(".closeImg").hide();
                    body.find(".actDetailUrl").val(data.actDetailUrl);
                    if (data.actTargetType != '0') {
                        body.find('.ueditor').hide();
                        body.find('.actAdress').show();
                    } else {
                        body.find('.ueditor').show();
                        body.find('.actAdress').hide();
                    }
                    var tagNameArr = data.actKeyword.split(',');
                    var tagColorArr = data.actKeyColor.split(',');
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
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        }
    });
});

function goLogin() {
    parent.goLogin()
}
