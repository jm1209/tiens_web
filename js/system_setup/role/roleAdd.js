layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };


    $('#name').html(NAME || '角色名称');
    $('#desc').html(DESCRIBE || '角色描述');
    $('#state').html(STATE || '状态');
    $('#submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');

    $('.roleName').attr('placeholder',CREATE_NAME||'请输入角色名称');
    $('.roleDes').attr('placeholder',CREATE_DES||'请输入角色描述');

    if (localStorage.getItem('language') == '2') {
        $('.roleStatus').html(
            '<input type="radio" name="roleStatus" value="1" title="valid" checked>' +
            '<input type="radio" name="roleStatus" value="0" title="invalid">'
        );
    } else {
        $('.roleStatus').html(
            '<input type="radio" name="roleStatus" value="1" title="有效" checked>' +
            '<input type="radio" name="roleStatus" value="0" title="无效">'
        );
    }

    setTimeout(function () {
        $(".roleStatus input[value=" + $('.roleStatus').attr('rolestatus') + "]").attr("checked", "checked");
        form.render();
    },100)


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            roleName: field.roleName,
            roleDes: field.roleDes,
            roleStatus: field.roleStatus,
        };
        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
            param.url = 'get/dataCenter/role/update';
        } else {
            param.url = 'get/dataCenter/role/save';
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
