layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('#role').html(ROLE || '角色');
    $('#name').html(NAME || '姓名');
    $('#account').html(ACCOUNT || '账号');
    $('#desc').html(DESCRIBE || '描述');
    $('#phone').html(PHONE || '联系方式');
    $('#sort').html(SORT || '排序');
    $('#state').html(STATE || '状态');
    $('#submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');
    $('.tips').html(lan == 2 ? 'the initial password is 123456. Please login in time.' : '初始密码为123456，登录后请及时修改');

    $('.empName').attr('placeholder', CREATE_NAME || '请输入姓名');
    $('.empAccount').attr('placeholder', CREATE_ACCOUNT || '请输入账号');
    $('.empPhone').attr('placeholder', CREATE_PHONE || '请输入手机号');
    $('.empSeq').attr('placeholder', CREATE_SORT || '请输入排序');
    $('.empDesc').attr('placeholder', CREATE_DES || '请输入描述');

    if (lan == '2') {
        $('.empStatus').html(
            '<input type="radio" name="empStatus" value="1" title="valid" checked>' +
            '<input type="radio" name="empStatus" value="0" title="invalid">'
        );
    } else {
        $('.empStatus').html(
            '<input type="radio" name="empStatus" value="1" title="有效" checked>' +
            '<input type="radio" name="empStatus" value="0" title="无效">'
        );
    }

    setTimeout(function () {

        $(".empStatus input[value=" + $('.empStatus').attr('empstatus') + "]").prop("checked", "checked");
        form.render()
    }, 100)


    param.url = 'get/dataCenter/role/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.roleIds').append('<option value="">' + (CHOOSE || '请选择角色') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].roleName + '</option>';
            $('.roleIds').append(str)
        }
        $('.roleIds').val($('.roleIds').attr('val'));
        form.render();
    });

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        var roleIds = [];
        roleIds.push($('.roleIds').val());

        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            empAccount: field.empAccount,
            empName: field.empName,
            empPhoneno: field.empPhone,
            empStatus: field.empStatus,
            empSeq: field.empSeq,
            empDesc: field.empDesc,
            roleIds: roleIds,
        };

        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
            param.url = 'get/dataCenter/employee/update';
        } else {
            param.url = 'get/dataCenter/employee/save';
        }

        ajaxJS(param, data, function (d) {
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

        });
        return false;
    });
    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});
