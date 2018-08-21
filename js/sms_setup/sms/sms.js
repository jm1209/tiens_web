layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');


    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/note/push') {
            $('.pushShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.pushShow span').html(PUSH || '推送');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $
    $('.createtime').html(TIME || '创建时间');
    $('.pushstatus').html(STATE || '推送状态');

    $('#createTime').attr('placeholder', TIME || '请选择时间范围');

    if (lan == '2') {
        $('.pushStatusList').html(
            '<option value="" >please choose</option>' +
            '<option value="0">not push</option>' +
            '<option value="2">pushing</option>' +
            '<option value="1">push success</option>' +
            '<option value="-1">push fail</option>'
        );
    } else {
        $('.pushStatusList').html(
            '<option value="" >请选择</option>' +
            '<option value="0">未推送</option>' +
            '<option value="2">推送中</option>' +
            '<option value="1">推送成功</option>' +
            '<option value="-1">推送失败</option>'
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
    tableInit(table, 'get/complex/note/push/select', [[
        {field: 'memberPhone', title: RECEIVER || '接收人', align: 'center'},
        {field: 'content', title: CONTENT || '短信内容', align: 'center'},
        {
            field: 'pushStatus', title: STATE || '推送状态', align: 'center', templet: function (d) {
                var pushStatus;
                var value = d.pushStatus;
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
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
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
            createStartTime: createStartTime,
            createEndTime: createEndTime,
            pushStatus: $('.pushStatus option:selected').val()
        });
    });

    $(".add_btn").click(function () {
        var index = layui.layer.open({
            title: SMSPUSH || '短信推送',
            type: 2,
            content: "smsAdd.html",
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
        });
    });
});

function goLogin() {
    parent.goLogin()
}
