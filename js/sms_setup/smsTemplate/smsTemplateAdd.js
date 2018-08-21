layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');


    $('.templename span').html(NAME || '模板名称');
    $('.type span').html(TYPE || '类型');
    $('.isenabled').html(ISENABLED || '是否启用');
    $('.content span').html(CONTENT || '模板内容');
    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');

    $('.smsTemplatelTitle').attr('placeholder', NAME || '请输入模板名称');
    $('.smsTemplateContent').attr('placeholder', INPUTCONTENT || '请输入内容');

    if (lan == '2') {
        $('.smsStatusisenbled').html(
            '<input type="radio" name="smsStatus" value="1" title="enable" checked>' +
            '<input type="radio" name="smsStatus" value="0" title="disable">'
        );
    } else {
        $('.smsStatusisenbled').html(
            '<input type="radio" name="smsStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="smsStatus" value="0" title="未启用">'
        );
    }

    setTimeout(function () {
        $(".smsStatus input[value=" + $('.smsStatus').attr('smsstatus') + "]").prop("checked", "checked");
        form.render();
    }, 100);


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    setTimeout(function () {
        param.url = 'get/complex/sms/templateEnum/select';
        ajaxJS(param, {}, function (d) {
            var data = d.data;
            $('.smsType').append('<option value="">' + (CHOOSE || '请选择类型') + '</option>');
            for (var i = 0; i < data.length; i++) {
                var str = '<option value="' + data[i].dicKey + '">' + data[i].dicValue + '</option>';
                $('.smsType').append(str)
            }
            var dicKey = '';
            for (var j = 0; j < data.length; j++) {
                if (data[j].dicValue == $('.smsType').attr('smsType')) {
                    dicKey = data[j].dicKey;
                    break;
                }
            }
            $('.smsType').val(dicKey);
            form.render();
        });
    }, 200);


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            smsTemplatelTitle: field.smsTemplatelTitle,
            smsType: field.smsType,
            smsStatus: field.smsStatus,
            smsTemplateContent: $('.smsTemplateContent').val(),
        };

        param.url = 'get/complex/sms/template/saveUpdate';
        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
        }
        ajaxJS(param, data, function (d) {
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

        })
        return false;
    })

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});
