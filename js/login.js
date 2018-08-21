layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    $('#account').html(lan == 2 ? 'account' : '账号');
    $('#pwd').html(lan == 2 ? 'password' : '密码');
    $('#codeTxt').html(lan == 2 ? 'code' : '验证码');
    $('.retrieve a').html(lan == 2 ? 'retrieve the password?' : '找回密码？');
    $('.login').html(lan == 2 ? 'login' : '登录');

    $('#password').attr('placeholder', lan == 2 ? 'please input a password' : '请输入密码');
    $('#loginAccount').attr('placeholder', lan == 2 ? 'please input a account' : '请输入账号');
    $('#code').attr('placeholder', lan == 2 ? 'please input a code' : '请输入验证码');

    sessionStorage.setItem('loginUrl', location.href);
    var loginOK = true;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };
    code();

    function code() {
        param.url = 'get/complex/getPictureVerificationCode';
        ajaxJS(param, {}, function (d) {
            $('#imgCode img').attr('src', 'data:image/jpeg;base64,' + d.data)
        });
    }

    $('#codeClick').click(function () {
        event.stopPropagation();
        code()
    });


    //获取选中的角色
    var roleType;
    form.on('select(roleName)', function (data) {
        roleType = data.value;

    });

    //登录按钮
    $(".login").click(function (data) {
        var data = {
            loginAccount: $("#loginAccount").val(),
            password: $("#password").val(),
            code: $('#code').val()
        };
        checkInput(data)
    });

    //键盘回车事件
    $(document).keydown(function (e) {
        var data = {
            loginAccount: $("#loginAccount").val(),
            password: $("#password").val(),
            code: $('#code').val()
        };
        if (e.keyCode == 13) {
            checkInput(data)
        }
    });


    //封装登录方法
    function login(data) {
        var serviceDate = new Date($.ajax({async: false}).getResponseHeader("Date")).getTime();
        var nonce = generateMixed(20);
        $.ajax({
            url: interfaceUrl + 'get/login/begin',
            type: 'post',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            xhrFields: {withCredentials: true},
            beforeSend: function (request) {
                request.setRequestHeader("X-Token", logToken);
                request.setRequestHeader("X-Signe", addMd5(data, serviceDate, nonce));
                request.setRequestHeader("X-Language", localStorage.getItem("language") || "1");
                request.setRequestHeader("timestamp", serviceDate);
                request.setRequestHeader("nonce", nonce);
            },
            success: function (d) {
                if (d.code == "0") {
                    sessionStorage.setItem("loginName", d.data.loginName);
                    sessionStorage.setItem("logToken", d.data.logToken);
                    sessionStorage.setItem("powerArr", JSON.stringify(d.data.buttonResource || []));
                    setTimeout(function () {
                        window.location.href = "index.html";
                    }, 500);
                    if (loginOK) {
                        layer.msg(d.msg);
                        loginOK = false;
                    }
                } else if (d.code == "30011") {
                    layer.msg(d.msg);
                    code();
                }
            }
        });

        function addMd5(data, serviceDate, nonce) {
            var key = "_TIANSHI#9q6w3e#!";
            return md5(md5(JSON.stringify(data) + serviceDate + nonce) + key)
        }

    }

    //验证输入框信息
    function checkInput(data) {
        if ($("#loginAccount").val() == "") {
            layer.msg(lan == 2 ? 'user name should not be empty!' : '用户名不能空！', {icon: 5});
            $(this).addClass("layui-input-focus").find(".layui-input").focus();
            return;
        }
        if ($("#password").val() == "") {
            layer.msg(lan == 2 ? 'password should not be empty!' : '密码不能空！', {icon: 5});
            $(this).addClass("layui-input-focus").find(".layui-input").focus();
            return;
        }
        if ($("#code").val() == "") {
            layer.msg(lan == 2 ? 'the verification code can not be empty!' : '验证码不能为空！', {icon: 5});
            $(this).addClass("layui-input-focus").find(".layui-input").focus();
            return;
        }
        login(data)
    }

    //表单输入效果
    $(".loginBody .input-item").click(function (e) {
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    });
    $(".loginBody .layui-form-item .layui-input").focus(function () {
        $(this).parent().addClass("layui-input-focus");
    });
    $(".loginBody .layui-form-item .layui-input").blur(function () {
        $(this).parent().removeClass("layui-input-focus");
        if ($(this).val() != '') {
            $(this).parent().addClass("layui-input-active");
        } else {
            $(this).parent().removeClass("layui-input-active");
        }
    })
});
var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateMixed(n) {
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}