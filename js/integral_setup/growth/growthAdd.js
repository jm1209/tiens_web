layui.use(['form', 'layer', "jquery",], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: 'get/complex/growth/rule/saveUpdate', type: 'post',
        language: localStorage.getItem('language') || 1
    };
    setTimeout(function () {
        if ($(".sign").val() == "edit") {
            $('.groType').val($('.groType').attr('grotype'));
            form.render()
        }
    }, 200);

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.groType').html('<option value="">please choose</option>' +
            '                       <option value="0">' + LACHINE + '</option>' +
            '                       <option value="1">' + SHARE + '</option>' +
            '                       <option value="2">' + COMMENT + '</option>' +
            '                       <option value="3">' + CONSUME + '</option>');
    } else {
        $('.groType').html('<option value="">请选择类型</option>' +
            '                       <option value="0">拉新</option>' +
            '                       <option value="1">分享</option>' +
            '                       <option value="2">评论</option>' +
            '                       <option value="3">消费</option>');
    }
    form.render();

    $('.type').html(TYPE || '类型');
    $('.growth').html(GROWTH || '成长值');
    $('.upperLimit').html(UPPERLIMIT || '每日上限');
    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');

    $('.groGrowthCount').attr('placeholder', GROWTH || '成长值');
    $('.groMaxCount').attr('placeholder', UPPERLIMIT || '每日上限');

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            groType: field.groType,
            groGrowthCount: field.groGrowthCount,
            groMaxCount: field.groMaxCount
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
        }
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        });
        return false;
    });

    $(".cancel").click(function () {
        layer.closeAll("iframe");
    });
});
