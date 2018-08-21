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
        if (powerArr[i] == '/get/complex/suggest/info/reply') {
            isReply = true;
        }
    }
    $('.screen span').html(SCREEN || '筛选');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.title1').html(TITLE || '建议标题');
    $('.type').html(TYPE || '类型');
    $('.createtime').html(TIME || '创建时间');
    $('.sugtime').html(TIME || '建议时间');
    $('.isReply').html(ISREPLY || '是否回复');
    $('.see').html(SEE || '查看');
    $('.reply').html(REPLY || '回复');
    $('.vipname').html(NAME || '会员名称');
    $('.phone').html(PHONE || '手机号');
    $('.sugImage').html(IMAGE || '建议图片');
    $('.sugcontent').html(CONTENT || '建议内容');
    $('.replycontent').html(REPLYCONTENT || '回复内容');

    $('.sugTitle').attr('placeholder', INPUTTITLE || '请输入建议标题');
    $('#createTime').attr('placeholder', TIME || '请选择时间范围');

    if (lan == '2') {
        $('.replyradio').html(
            '<input type="radio" name="replyStatus" lay-filter="replyStatus" value="1" title="replied">' +
            '<input type="radio" name="replyStatus" lay-filter="replyStatus"  value="0" title="not reply">'
        );
    } else {
        $('.replyradio').html(
            '<input type="radio" name="replyStatus" lay-filter="replyStatus" value="1" title="已回复">' +
            '<input type="radio" name="replyStatus" lay-filter="replyStatus"  value="0" title="未回复">'
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
    tableInit(table, 'get/complex/suggest/info/select', [[
        {field: 'memberName', title: NAME || '会员名称', align: 'center'},
        {field: 'memberPhone', title: PHONE || '会员手机号', align: 'center'},
        {field: 'sugTitle', title: TITLE || '建议标题', align: 'center'},
        {field: 'sugTypeName', title: TYPE || '类型', align: 'center'},
        {field: 'createTime', title: TIME || '创建时间', align: 'center'},
        {
            field: 'sugReplyContent', title: ISREPLY || '是否回复', align: 'center', templet: function (d) {
                if (d.sugReplyContent == null || d.sugReplyContent == "" || typeof(d.sugReplyContent) == "undefined") {
                    return NOTREPLY || "否";
                } else {
                    return REPLY || "是";
                }
            }
        },
        {
            field: 'updateName', title: REPLIER || '回复人', align: 'center', templet: function (d) {
                if (d.updateName == null || d.updateName == "" || typeof(d.updateName) == "undefined") {
                    return "--"
                } else {
                    return d.updateName;
                }
            }
        },
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

    var createStartTime, createEndTime;

    param.url = 'get/complex/suggest/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.suggestType').append('<option value="">' + (CHOOSE || '请选择类型') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].dicValue + '">' + data[i].dicValue + '</option>';
            $('.suggestType').append(str);
        }
        $('.suggestType').val($('.suggestType').attr('val'));
        form.render();
    });


    laydate.render({
        elem: '#createTime',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {
            createStartTime = value.split(' - ')[0];
            createEndTime = value.split(' - ')[1];

        }
    });
    var replyStatus;
    form.on('radio(replyStatus)', function (data) {
        replyStatus = data.value;
    });
    //搜索
    $(".search_btn").on("click", function () {
        searchSuggest();
    });


    function searchSuggest() {
        search($, table,form, {
            sugTitle: $(".sugTitle").val(),
            createStartTime: createStartTime,
            createEndTime: createEndTime,
            replyStatus: replyStatus,
            suggestType: $(".suggestType option:selected").val(),
        });
    }

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'see') { //查看
            layer.open({
                title: SEE || '查看意见建议',
                type: 2,
                area: ["750px", "550px"],
                content: "html/suggest_setup/suggest/seeSug.html",
                resize: false,
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);


                    body.find(".memberName").val(data.memberName);
                    body.find(".sugTypeName").val(data.sugTypeName);
                    body.find(".sugTitle").val(data.sugTitle);
                    body.find(".sugContent").val(data.sugContent);
                    body.find(".sugReplyContent").val(data.sugReplyContent);
                    body.find(".createTime").val(data.createTime);
                    body.find(".memberPhone").val(data.memberPhone);

                    for (var i = 0; i < data.sugImage.length; i++) {
                        var img = '<li class="layui-inline"><img class="preview" src="' + data.sugImage[i] + '" width="100" height="100"></li>';
                        body.find(".sugImage ul").append(img);
                    }
                    form.render();

                }
            })
        } else if (layEvent === 'reply') { //回复
            if (data.sugReplyContent !== null) {
                layer.msg(lan == 2 ? 'you have returned' : '您已回复！');
                return;
            }
            layer.open({
                title: REPLY || '回复会员',
                type: 2,
                btn: [SUBMIT || "提交", CANCEL || "取消"],
                btn1: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
                    var data = {
                        id: body.find('.sign').attr('signid'),
                        sugReplyContent: body.find('.sugReplyContent').val()
                    };
                    var param = {
                        jquery: $,
                        layer: layer,
                        url: 'get/complex/suggest/info/reply',
                        type: 'post',
                        language: localStorage.getItem('language') || 1
                    };
                    ajaxJS(param, data, function (d) {
                        top.layer.msg(d.msg);
                        layer.closeAll("iframe");
                        //刷新父页面
                        //$(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                        searchSuggest();
                    });
                    return false;
                },
                btn2: function (index, layero) {
                    layer.closeAll("iframe");
                },
                area: ["750px", "400px"],
                skin: 'layui-blue',
                content: "html/suggest_setup/suggest/replySug.html",
                resize: false,
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);

                    body.find(".sign").val("data").attr("signid", data.id);

                    body.find(".sugMemberId span").html(data.memberName || data.memberPhone);
                    form.render();

                }
            })
        }
    });
});

function goLogin() {
    parent.goLogin()
}