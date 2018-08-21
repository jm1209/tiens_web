layui.use(['form', 'layer', "jquery",], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };
    var lan = localStorage.getItem('language');



    $('.num').html(NUM || '积分数量');
    $('.grade').html(GRADE || '会员等级');
    $('.type').html(TYPE || '类型');
    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');
    $('.ruleCount').attr('placeholder', NUM || '积分数量');

    if (lan == '2') {
        $('.ruleType').html(
            '<option value="">please choose</option>' +
            '<option value="0">LACHINE</option>' +
            '<option value="1">CONSUME</option>'
        );
    } else {
        $('.ruleType').html(
            '<option value="">选择</option>' +
            '<option value="0">拉新</option>' +
            '<option value="1">消费</option>'
        );
    }
    setTimeout(function () {
        $('.ruleType').val($('.ruleType').attr('ruletype'));
        form.render();
    },200)



    param.url = 'get/complex/grade/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.ruleGradeId').append('<option value="">' + (CHOOSE || '请选择类型') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].graName + '</option>';
            $('.ruleGradeId').append(str)
        }
        $('.ruleGradeId').val($('.ruleGradeId').attr('ruleGradeId'));
        form.render();
    });



    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;

        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            ruleType: field.ruleType,
            ruleCount: field.ruleCount,
            ruleGradeId: field.ruleGradeId
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
            param.url = 'get/complex/integral/rule/saveUpdate';
        } else {  //新增
            param.url = 'get/complex/integral/rule/saveUpdate';
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
