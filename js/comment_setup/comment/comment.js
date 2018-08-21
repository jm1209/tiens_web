layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');
    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isReply = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/comment/info/reply') {
            isReply = true;
        }
        if (powerArr[i] == '/get/complex/comment/info/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.delAll_btn span').html(DELETE || '删除');

    $('.comment-time').html(TIME || '评论时间');
    $('.comment-type').html(TYPE || '类型');

    $('.comment-reply').html(ISREPLY || '是否回复');
    $('.applied').html(REPLY || '已回复');
    $('.not-apply').html(NOTREPLY || '未回复');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.seecomment').html(SEE || '查看');
    $('.replycomment').html(REPLY || '回复');
    $('.title').html(TITLE || '评论标题');
    $('.type').html(TYPE || '类型');
    $('.observer').html(OBSERVER || '评论人');
    $('.commenttime').html(TIME || '评论时间');
    $('.commentcontent').html(COMMENTCONTENT || '评论内容');
    $('.replycontent').html(REPLYCONTENT || '回复内容');


    $('#createTime').attr('placeholder', SEARCHTIME || '请选择时间范围');


    if (lan == '2') {
        $('.comType').html(
            '<option value="" class="select-type-please">please choose</option>' +
            '<option value="1">activity</option>' +
            '<option value="2">news</option>' +
            '<option value="3">advertising</option>' +
            '<option value="4">shop</option>');

        $('.reply-radio').html(
            '<input type="radio" name="comReplyStatus" lay-filter="comReplyStatus" value="1" title="reply">' +
            '<input type="radio" name="comReplyStatus" lay-filter="comReplyStatus"  value="0" title="not reply">');
    } else {
        $('.comType').html(
            '<option value="" class="select-type-please">请选择类型</option>' +
            '<option value="1">活动</option>' +
            '<option value="2">资讯</option>' +
            '<option value="3">广告位</option>' +
            '<option value="4">店铺</option>');

        $('.reply-radio').html(
            '<input type="radio" name="comReplyStatus" lay-filter="comReplyStatus" value="1" title="已回复">' +
            '<input type="radio" name="comReplyStatus" lay-filter="comReplyStatus"  value="0" title="未回复">');
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
    tableInit(table, 'get/complex/comment/info/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: 'comType', title: TYPE || '类型', align: 'center', templet: function (d) {
                if (d.comType == '1') {
                    return MANAGEACT || '活动';
                } else if (d.comType == '2') {
                    return INFORMATION || '资讯';
                } else if (d.comType == '3') {
                    return ADSPACE || '广告位';
                } else if (d.comType == '4') {
                    return SHOP || '店铺'
                } else {
                    return '';
                }
            }
        },
        {
            field: 'comReplyStatus', title: ISREPLY || '是否回复', align: 'center', templet: function (d) {
                return d.comReplyStatus == '0' ? NOTREPLY || '未回复' : REPLY || '已回复';
            }
        },
        {field: 'comMemberName', title: OBSERVER || '评论人', align: 'center'},
        {field: 'createTime', title: COMMENTTIME || '评论时间', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 150, fixed: "right", align: "center", templet: function () {
                if (isReply) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="reply">' + (REPLY || '回复') + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>';
                }
            }
        }
    ]]);

    var comType, comReplyStatus, createStartTime, createEndTime;
    form.on('select(comType)', function (data) {
        comType = data.value;
    });
    form.on('radio(comReplyStatus)', function (data) {
        comReplyStatus = data.value;
    });

    laydate.render({
        elem: '#createTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime',
    });

    //搜索
    $(".search_btn").on("click", function () {
        var createStartTime = $('#createTime').val().split(' - ')[0];
        var createEndTime = $('#createTime').val().split(' - ')[1];
        search($, table,form, {
            comType: comType,
            comReplyStatus: comReplyStatus,
            createStartTime: createStartTime,
            createEndTime: createEndTime
        });
    });

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(DEL_PROMPT || '确定删除选中的评论？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/complex/comment/info/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的评论");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'see') { //查看
            var index = layer.open({
                title: SEECOMMENT || '查看评论',
                type: 2,
                area: ["750px", "450px"],
                content: "html/comment_setup/comment/seeCom.html",
                resize: false,
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);

                    var comType;
                    if (data.comType == '1') {
                        comType = MANAGEACT || '活动';
                    } else if (data.comType == '2') {
                        comType = INFORMATION || '资讯';
                    } else if (data.comType == '4') {
                        comType = SHOP || '店铺';
                    } else if (data.comType == '3') {
                        comType = ADSPACE || '广告位'
                    }
                    body.find(".comType").val(comType);
                    body.find(".comTitle").val(data.comTitle);
                    body.find(".comMemberId").val(data.comMemberName);
                    body.find(".createTime").val(data.createTime);
                    body.find(".comContent").text(data.comContent);
                    body.find(".comReplyComment").text(data.comReplyComment || '');
                    form.render();
                }
            })
        } else if (layEvent === 'reply') { //回复
            if (data.comReplyStatus == '1') {
                layer.msg(REPLY || '您已回复！');
                return;
            }
            var index = layer.open({
                title: REPLYCOMMENT || '回复评论',
                type: 2,
                area: ["750px", "450px"],
                content: "html/comment_setup/comment/replyCom.html",
                resize: false,
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);

                    body.find(".sign").val("data").attr("signid", data.id);
                    body.find(".comTitle span").html(data.comMemberName);
                    form.render();
                }
            })
        }
    });
});

function goLogin() {
    parent.goLogin()
}
