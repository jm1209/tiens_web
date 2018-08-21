layui.use(['form', 'layer', "jquery",], function () {
    var form = layui.form, $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    $('#key').html(KEY || 'key');
    $('#value').html(VALUE || '值');
    $('#name').html(NAME || '枚举名称');
    $('#des').html(DESCRIPTION || '描述');
    $('#sort').html(SORT || '序列号');
    $('#status').html(STATE || '状态');
    $('#submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');


    $('.dicKey').attr('placeholder', CREATE_KEY || '请输入key');
    $('.dicValue').attr('placeholder', CREATE_VALUE || '请输入值');
    $('.dicDdescription').attr('placeholder', CREATE_DES || '请输入描述');
    $('.dicSeq').attr('placeholder', CREATE_SORT || '请输入序列号');

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.dicStatusRadio').html(
            '<input type="radio" name="dicStatus" value="1" title="valid" checked>' +
            '<input type="radio" name="dicStatus" value="0" title="invalid">'
        );
    } else {
        $('.dicStatusRadio').html(
            '<input type="radio" name="dicStatus" value="1" title="有效" checked>' +
            '<input type="radio" name="dicStatus" value="0" title="无效">'
        );
    }
    setTimeout(function () {
        $(".dicStatusRadio input[value=" + $('.dicStatusRadio').attr('dicstatus') + "]").prop("checked", "checked");
        form.render();
    },100);

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/dataCenter/enum/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.enumId').append('<option value="">' + (CHOOSE || '请选择枚举名称') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].enumName + '</option>';
            $('.enumId').append(str)
        }
        $('.enumId').val($('.enumId').attr('val'));
        form.render();
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            dicKey: field.dicKey,
            dicValue: field.dicValue,
            enumId: field.enumId,
            dicDdescription: field.dicDdescription,
            dicSeq: field.dicSeq,
            dicStatus: field.dicStatus,
        };
        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
            param.url = 'get/dataCenter/dictionaries/update';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

            })
        } else {  //新增
            param.url = 'get/dataCenter/dictionaries/save';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        }
        return false;
    });

    $(".cancel").click(function () {
        layer.closeAll("iframe");
    });
});
