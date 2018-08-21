layui.use(['form', 'layer', "jquery",], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('.day').html(DAY || '签到天数');
    $('.num').html(NUM || '积分数量');
    $('.grade').html(GRADE || '会员等级');
    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');

    $('.signDay').attr('placeholder', DAY || '签到天数');
    $('.signCount').attr('placeholder', NUM || '积分数量');

    param.url = 'get/complex/grade/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.signGradeId').append('<option value="">' + (CHOOSE || '请选择会员等级') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].graName + '</option>';
            $('.signGradeId').append(str)
        }
        $('.signGradeId').val($('.signGradeId').attr('val'));
        form.render();
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            signDay: field.signDay,
            signCount: field.signCount,
            signGradeId: field.signGradeId
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
            param.url = 'get/complex/integral/sign/saveUpdate';
        } else {  //新增
            param.url = 'get/complex/integral/sign/saveUpdate';
        }
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        })
        return false;
    });

    $(".cancel").click(function () {
        layer.closeAll("iframe");
    });
});
