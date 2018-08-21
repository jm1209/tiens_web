layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, type: 'post', url: '',
        language: localStorage.getItem('language') || 1
    };

    $('.num').html(NUM || '数量');
    $('.integralNumber').attr('placeholder', INTEGRALNUMBER || '积分（正整数） 余额（保留两位小数的正数）');
    $('.handle').html(HANDLETYPE || '操作类型');
    $('.type').html(TYPE || '类型');
    $('.noFrozen').html(UNFROZEN || '未冻结');
    $('.okFrozen').html(FROZEN || '已冻结');
    $('.submit-hook').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.memOperationType').html('<option value="">please choose</option>' +
            '                        <option value="0">frozen</option>' +
            '                        <option value="1">thaw</option>' +
            '                        <option value="2">grant</option>' +
            '                        <option value="3">deduction</option>');

        $('.memTypeRadio').html('<input type="radio" name="memType" lay-filter="memType" value="0" title="integral">' +
            '                    <input type="radio" name="memType" lay-filter="memType" value="1" title="present balance">' +
            '                    <input type="radio" name="memType" lay-filter="memType" value="2" title="non present balance">');
    } else {
        $('.memOperationType').html('<option value="">请选择操作类型</option>' +
            '                        <option value="0">冻结</option>' +
            '                        <option value="1">解冻</option>' +
            '                        <option value="2">发放</option>' +
            '                        <option value="3">扣除</option>');

        $('.memTypeRadio').html('<input type="radio" name="memType" lay-filter="memType" value="0" title="积分">' +
            '                    <input type="radio" name="memType" lay-filter="memType" value="1" title="可提现余额">' +
            '                    <input type="radio" name="memType" lay-filter="memType" value="2" title="不可提现余额">');
    }
    form.render();

    //积分冻结和未冻结数量
    setTimeout(function () {
        param.url = 'get/complex/member/getOne';
        ajaxJS(param,
            {memberId: $('.sign').attr('signId')}, function (d) {
                var data = d.data;
                $(".memPresentAmount").val((lan != "2" ? "可提现余额：" : "present balance:") + data.memPresentAmount);
                $(".memFreezeAmount").val((lan != "2" ? "冻结可提现余额：" : "freezing can be raised:") + data.memFreezeAmount);
                $(".memIntegral").val((lan != "2" ? "消费积分：" : "consumption integral:") + data.memIntegral);
                $(".memFreezeIntegral").val((lan != "2" ? "冻结积分：" : "freezing integral:") + data.memFreezeIntegral);
                $(".memNonPresentAmount").val((lan != "2" ? "不可提现余额：" : "non present balance:") + data.memNonPresentAmount);
                $(".memNonFreezeAmount").val((lan != "2" ? "冻结不可提现余额：" : "freezing cannot be raised:") + data.memNonFreezeAmount);
            });
    }, 200);

    form.on("select(memOperationType)", function (data) {
        if (data.value == '2' || data.value == '3') {
            $('.memTypeRadio').html('<input type="radio" name="memType" lay-filter="memType" value="0" title="' + (lan != "2" ? "积分" : "integral") + '">');
        } else {
            $('.memTypeRadio').html('<input type="radio" name="memType" lay-filter="memType" value="0" title="' + (lan != "2" ? "积分" : "integral") + '">' +
                '                    <input type="radio" name="memType" lay-filter="memType" value="1" title="' + (lan != "2" ? "可提现余额" : "present balance") + '">' +
                '                    <input type="radio" name="memType" lay-filter="memType" value="2" title="' + (lan != "2" ? "不可提现余额" : "non present balance") + '">');
        }
        form.render();
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        if (field.memType == undefined) {
            layer.msg(CHOOSETYPE || '请选择类型');
            return false;
        }
        if (field.integralNumber == undefined) {
            layer.msg(INPUTQUANTITY || '请输入数量');
            return false;
        }
        if (field.memOperationType == undefined || field.memOperationType == '') {
            layer.msg(CHOOSEOPERTYPE || '请选择操作类型');
            return false;
        }

        //积分
        if (field.memType == '0') {
            if (!checkInteger(field.integralNumber)) {
                layer.msg(ERRORQUANTITY || '数量只能输入正整数');
                return false;
            }
        }
        //余额
        if (field.memType != '0') {
            if (!checkMoneyFormat(field.integralNumber)) {
                layer.msg(ERRORQUANTITY || '请输入正确的数量');
                return;
            }
        }

        var data = {
            integralNumber: field.integralNumber,
            memberId: $('.sign').attr('signId'),
            memType: field.memType,
            memOperationType: field.memOperationType
        };

        param.url = 'get/complex/member/integral/freeze';
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            if (d.data == false) {
                return;
            }
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

//校验正整数
function checkInteger(tempNum) {
    var patrmE = /^[0-9]*[1-9][0-9]*$/;
    if (!patrmE.exec(tempNum)) {
        return false;
    } else {
        return true;
    }
}

//校验金额格式
function checkMoneyFormat(temp) {
    var patrm = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!patrm.exec(temp)) {
        return false;
    } else {
        num = temp.indexOf(".");
        if (num > 0) {
            var var1 = temp.substr(0, num);
            var var2 = temp.substr(num + 1, temp.length);
            if (var2 == "") {
                return false;
            }
            if (var1.length == 1) {
                if (var1 == 0) {
                    if (var2 == 0) {
                        return false;
                    }
                }
            }
            if (var1.length > 1) {
                if (var1.substr(0, 1) == 0) {
                    return false;
                }
            }
        } else {
            if (temp.length >= 1) {
                if (temp.substr(0, 1) == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}

function goLogin() {
    parent.goLogin()
}
