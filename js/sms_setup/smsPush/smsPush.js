layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/message/push') {
            $('.pushShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.pushShow span').html(PUSH || '推送');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.title1').html(TITLE || '消息标题');
    $('.time').html(TIME || '选择时间');
    $('.isread').html(ISREAD || '是否已读');

    $('.createtime').html(TIME || '创建时间');
    $('.pushstatus').html(STATE || '推送状态');
    $('.layui-btn-primary').html(PUSH || '推送');

    $('#createTime').attr('placeholder' ,TIME || '请选择时间范围');
    $('.mesTitle').attr('placeholder' ,TITLE || '请输入消息标题');

    if(lan == '2'){
        $('.pushStatusList').html(
            '<option value="" >please choose</option>' +
            '<option value="0">not push</option>' +
            '<option value="2">pushing</option>' +
            '<option value="1">push success</option>' +
            '<option value="-1">push fail</option>'
        );

        $('.isRead').html(
            '<input type="radio" name="mesStatus" lay-filter="mesStatus" value="1" title="read">' +
            '<input type="radio" name="mesStatus" lay-filter="mesStatus"  value="0" title="unread">'
        );

    }else{
        $('.pushStatusList').html(
            '<option value="" >请选择</option>' +
            '<option value="0">未推送</option>' +
            '<option value="2">推送中</option>' +
            '<option value="1">推送成功</option>' +
            '<option value="-1">推送失败</option>'
        );

        $('.isRead').html(
            '<input type="radio" name="mesStatus" lay-filter="mesStatus" value="1" title="已读">' +
            '<input type="radio" name="mesStatus" lay-filter="mesStatus"  value="0" title="未读">'
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
    tableInit(table, 'get/complex/message/push/select', [[
        {field: 'mesTitle', title: TITLE || '消息标题', align: 'center'},
        {field: 'mesDescription', title: DIGEST || '消息摘要', align: 'center'},
        {field: 'mesReceiveMemberName', title: RECEIVER || '接收人', align: 'center'},
        {field: 'createTime', title: TIME || '发送时间', align: 'center'},
        {
            field: 'mesImage', title: IMAGE || '消息图片', align: 'center', templet: function (d) {
                if (d.mesImage) {
                    return '<img class="preview" src="' + d.mesImage + '" height="100%">';
                } else {
                    return ''
                }
            }
        }, {
            field: 'mesStatus', title: ISREAD || '是否已读', align: 'center', templet: function (d) {
                return d.mesStatus == "0" ? NOTREAD || "未读" : READ || "已读";
            }
        },
        {
            field: 'mesPushStatus', title: STATE || '推送状态', align: 'center', templet: function (d) {
                var pushStatus;
                var value = d.mesPushStatus;
                if (value == '0') {
                    pushStatus = NOTPUSH || "未推送";
                } else if (value == '1') {
                    pushStatus = PUSHSUCCESS || "推送成功";
                } else if (value == '2') {
                    pushStatus = PUSHING || "推送中";
                } else {
                    pushStatus = PUSHFAIL || "推送失败";
                }
                return pushStatus
            }
        },
    ]]);

    var mesStatus, createStartTime, createEndTime;
    form.on('radio(mesStatus)', function (data) {
        mesStatus = data.value;
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


    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            mesTitle: $(".mesTitle").val(),
            mesStatus: mesStatus,
            createStartTime: createStartTime,
            createEndTime: createEndTime,
            mesPushStatus: $('.mesPushStatus option:selected').val()
        });
    });


    $(".add_btn").click(function () {
        var index = layui.layer.open({
            title: PUSH || '消息推送',
            type: 2,
            content: "smsPushAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);


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


    });


});

function goLogin() {
    parent.goLogin()
}
