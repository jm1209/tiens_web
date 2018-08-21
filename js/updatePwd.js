layui.use(['form', 'layer', 'laydate', 'table', 'laytpl'], function () {
    var form = layui.form, $ = layui.jquery
    layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    $('.name').html(NAME || '用户名');
    $('.oldPwd').html(OLDPWD || '老密码');
    $('.newPwd').html(NEWPWD || '新密码');
    $('.okPwd').html(OKPWD || '确认密码');
    $('.change').html(SUBMIT || '立即修改');
    $('.reset').html(RESET || '重置');

    $('input[name="oldPwd"]').attr('placeholder', lan == 2 ? 'please input the old password.' : '请输入旧密码');
    $('input[name="newPwd"]').attr('placeholder', lan == 2 ? 'please enter a new password.' : '请输入新密码');
    $('input[name="okPwd"]').attr('placeholder', lan == 2 ? 'please enter confirmation password.' : '请输入确认密码');


    var param = {
        jquery: $,
        layer: layer,
        url: 'get/login/updatePwd',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('.reset').click(function () {
        $('input[type="password"]').val('');
        return false
    });

    $('#username').val(sessionStorage.getItem('loginName'));

    $(document).keydown(function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });
    //添加验证规则
    form.verify({
        newPwd: function (value, item) {
            if (value.length < 6 || value.length > 20) {
                return lan == 2 ? "Please keep the password length between 6 and 20." : "请保持密码长度在6到20位";
            }
        },
        confirmPwd: function (value, item) {
            if (!new RegExp($("input[name='newPwd']").val()).test(value)) {
                return lan == 2 ? "The two input password is different. Please re input it." : "两次输入密码不一致，请重新输入！";
            }
        }
    });

    //修改密码
    form.on("submit(changePwd)", function (data) {
        var field = data.field;
        var index = layer.msg(PROMPT || '提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            passwordOld: field.oldPwd,
            passwordNew: field.newPwd
        };
        ajaxJS(param, data, function (d) {
            layer.msg(d.msg);
            setTimeout(function () {
                parent.location.href = sessionStorage.getItem('loginUrl');
            }, 500)
        });
        return false;
    });

})