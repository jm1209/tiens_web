layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    $('.num').html(lan == 2 ? 'please input account number.' : '请输入账号');
    $('.phoneCode>p').html(lan == 2 ? 'mobile verification code' : '手机验证码');
    $('.code').html(lan == 2 ? 'get code' : '获取验证码');
    $('.retrieve').html(lan == 2 ? 'set up' : '设置密码');
    $('.next').html(lan == 2 ? 'next' : '下一步');

    var timer = null;
    var flag = true;
    $('.code').click(function () {
        if ($('.accountName').val() == '') {
            layer.msg(lan == 2 ? 'account can not be empty!' :'账号不能空！');
            return;
        }
        var sec = 60;
        if (flag) {
            var codeData = {
                accountName: $('.accountName').val(),
                codeType: '1',
                operationType: '1'
            };
            retAjax('get/login/checkAndSendCode', codeData, function (d) {
                layer.msg(d.msg);
                if (d.code != '0') {
                    return;
                }
                flag = false;
                $('.code').addClass('cur');
                $('.code').html(sec + 's');
                clearInterval(timer);
                timer = setInterval(function () {
                    sec--;
                    $('.code').html(sec + 's');
                    if (sec === 0) {
                        clearInterval(timer);
                        $('.code').html(lan == 2 ? 'gain code' : '获取验证码');
                        flag = true;
                        $('.code').removeClass('cur');
                        $('.code').addClass('code');
                    }
                }, 1000);
            });
        }
    });


    //下一步按钮
    $(".next").click(function (data) {
        if ($('.accountName').val() == '') {
            layer.msg(lan == 2 ? 'account can not be empty!' :'账号不能空！');
            return;
        }
        var checkCode = {
            accountName: $('.accountName').val(),
            codeType: '1',
            operationType: '2',
            code: $('.codeNum').val()
        };
        retAjax('get/login/checkAndSendCode', checkCode, function (d) {

            if (d.code == "0") {
                layer.msg(d.msg);
                $('.num').html(lan == 2 ? 'please input a password!' :'请输入密码！');
                $('.phoneCode').hide();
                $('.accountName').hide();
                $('.pwd').show();
                $('.next').hide();
                $('.retrieve').attr('sign', d.data.signCode).css('display', 'block');
            } else if (d.code == "30011") {
                layer.msg(d.msg);
            }
        });
    });

    //设置密码按钮
    $(".retrieve").click(function (data) {
        if ($('.pwd').val() == '') {
            layer.msg(lan == 2 ? 'account can not be empty!' :'账号不能空！');
            return;
        }
        if ($('.pwd').val().length < 6 || $('.pwd').val().length > 20) {
            layer.msg(lan == 2 ? 'please keep the password length at 6-20 bits.' :'请保持密码长度在6-20位');
            return;
        }
        var data = {
            password: $('.pwd').val(),
            sign: $('.retrieve').attr('sign')
        };
        retAjax('get/login/forgetPwd', data, function (d) {
            layer.msg(d.msg);
            setTimeout(function () {
                location.href = 'login.html';
            }, 500)
        });
    });


    function retAjax(url, data, callback) {
        var serviceDate = new Date($.ajax({async: false}).getResponseHeader("Date")).getTime();
        var nonce = generateMixed(20);
        $.ajax({
            url: interfaceUrl + url,
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
                callback(d)
            }
        });
    }


    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
});

