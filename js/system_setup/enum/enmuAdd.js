layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    $('#name').html(NAME||'枚举名称')
    $('#des').html(DESCRIPTION||'枚举描述')

    $('.enumName').attr('placeholder',CREATE_NAME||'请输入枚举名称')
    $('.desc').attr('placeholder',CREATE_DES||'请输入内容')

    $('#submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');
    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: sessionStorage.getItem('language') || 1
    };

    form.on("submit(addOrEdit)", function (data) {
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            enumName: $(".enumName").val(),
            enumDescription: $(".desc").val(),
        };
        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
            param.url = 'get/dataCenter/enum/update';
            ajaxJS(param, data, function (d) {
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

            })
        } else {
            param.url = 'get/dataCenter/enum/save';
            ajaxJS(param, data, function (d) {
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

            })
        }
        return false;
    });

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});
