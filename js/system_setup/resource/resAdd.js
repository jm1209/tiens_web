layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    $('.superior').html(SUPERIOR || '上级资源');
    $('.resName').html(NAME || '资源名称');
    $('.euName1').html(ENNAME || '英文名称');
    $('.resUrl').html(THISURL || '资源路径');
    $('.resIcon').html(ICON || '资源图标');
    $('.resType').html(TYPE || '资源类型');
    $('.resDesc').html(DESCRIBE || '描述');
    $('.resStats').html(STATE || '状态');
    $('.submit').html(SUBMIT || '提交');
    $('#cancel').html(CANCEL || '取消');


    if (localStorage.getItem('language') == '2') {
        $('.type').html('<option value="">please choose</option>' +
            '              <option value="1">module</option>' +
            '              <option value="2">page</option>' +
            '              <option value="3">button</option>');


        $('.status').html('<input type="radio" name="status" value="1" title="valid" checked>' +
            '              <input type="radio" name="status" value="0" title="invalid">');
    } else {
        $('.type').empty().append('<option value="">请选择</option>' +
            '                      <option value="1">模块</option>' +
            '                      <option value="2">页面</option>' +
            '                      <option value="3">按钮</option>');

        $('.status').html('<input type="radio" name="status" value="1" title="有效" checked>' +
            '              <input type="radio" name="status" value="0" title="无效">');
    }
    setTimeout(function () {
        $('.type').val($('.type').attr('restype'));
        $(".status input[value=" + $('.status').attr('status') + "]").prop("checked", "checked");
        form.render();
    }, 100);


    var param = {//全局设置ajax请求参数
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };


    form.on("submit(addOrEdit)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            name: data.field.name,
            pid: data.field.pid,
            pname: data.field.pname,
            ptype: data.field.ptype,
            description: data.field.remark,
            status: data.field.status,
            type: data.field.type,
            url: data.field.url,
            icon: data.field.icon,
            euName: data.field.euName
        };
        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
            param.url = 'get/dataCenter/resource/update';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

            })
        } else {
            param.url = 'get/dataCenter/resource/save';
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
    $("#cancel").click(function () {
        layer.closeAll("iframe");
    })
});
