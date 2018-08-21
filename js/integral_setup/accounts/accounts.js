layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery;

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.recRecordType').html('<option value="">please choose</option>' +
            '                       <option value="0">frozen</option>' +
            '                       <option value="1">grant</option>' +
            '                       <option value="2">sign</option>' +
            '                       <option value="3">invitation</option>' +
            '                       <option value="4">join in</option>' +
            '                       <option value="5">shift to</option>' +
            '                       <option value="6">thaw</option>' +
            '                       <option value="7">deduction</option>' +
            '                       <option value="8">perfect</option>' +
            '                       <option value="9">spending</option>');

        $('.amoRecordType').html('<option value="">please choose</option>' +
            '                     <option value="0">recharge</option>' +
            '                     <option value="1">put forward</option>' +
            '                     <option value="2">receivables</option>' +
            '                     <option value="3">payment</option>' +
            '                     <option value="4">frozen</option>' +
            '                     <option value="6">thaw</option>');
    } else {
        $('.recRecordType').html('<option value="">请选择获取类型</option>' +
            '                       <option value="0">冻结</option>' +
            '                       <option value="1">发放</option>' +
            '                       <option value="2">签到</option>' +
            '                       <option value="3">邀请</option>' +
            '                       <option value="4">转入</option>' +
            '                       <option value="5">转出</option>' +
            '                       <option value="6">解冻</option>' +
            '                       <option value="7">扣除</option>' +
            '                       <option value="8">完善资料</option>' +
            '                       <option value="9">消费</option>');

        $('.amoRecordType').html('<option value="">请选择获取类型</option>' +
            '                     <option value="0">充值</option>' +
            '                     <option value="1">提现</option>' +
            '                     <option value="2">收款</option>' +
            '                     <option value="3">付款</option>' +
            '                     <option value="4">冻结</option>' +
            '                     <option value="6">解冻</option>');

    }
    form.render();

    $('.integral').html(INTEGRAL || '积分流水');
    $('.balan').html(BALAN || '余额流水');

    $('.record span,.balance span').html(SCREEN || '筛选');

    $('.stream').html(STREAM || '流水号');
    $('.name').html(NAME || '会员名称');
    $('.phone').html(PHONE || '手机号');
    $('.type').html(TYPE || '获取类型');
    $('.balance_btn,.record_btn').html(SEARCH || '搜索');
    $('.balReset,.recReset').html(RESET || '重置');

    $('.recNumber,.amoNumber').attr('placeholder', STREAM || '请输入流水号');
    $('.recMemName,.amoMemName').attr('placeholder', NAME || '请输入会员名称');
    $('.recPhone,.amoPhone').attr('placeholder', PHONE || '请输入手机号');

    //积分流水
    tableIns('#record', 'get/complex/integral/record/select', [[
        {field: 'recNumber', title: STREAM || '流水号', align: 'center'},
        {
            field: 'recMemberHeadImage', title: AVATAR || '会员头像', align: 'center', templet: function (d) {
                if (d.recMemberHeadImage == undefined || d.amoMemberHeadImage == '') {
                    return '';
                } else {
                    return '<img class="preview" src="' + d.recMemberHeadImage + '" height="28" width="28">';
                }
            }
        },
        {field: 'recMemberName', title: NAME || '会员名称', align: 'center'},
        {field: 'recMemberPhone', title: PHONE || '会员手机号', align: 'center'},
        {field: 'recCount', title: AMOUNT || '积分数量', align: 'center'},
        {
            field: 'recRecordType', title: TYPE || '获取类型', align: 'center', templet: function (d) {
                if (d.recRecordType == '0') {
                    return FROZEN || '冻结'
                } else if (d.recRecordType == '1') {
                    return GRANT || '发放'
                } else if (d.recRecordType == '2') {
                    return SIGN || '签到'
                } else if (d.recRecordType == '3') {
                    return INVITATION || '邀请'
                } else if (d.recRecordType == '4') {
                    return SHIFTTO || '转入'
                } else if (d.recRecordType == '5') {
                    return TURNOUT || '转出'
                } else if (d.recRecordType == '6') {
                    return THAW || '解冻'
                } else if (d.recRecordType == '7') {
                    return DEDUCTION || '扣除'
                } else if (d.recRecordType == '8') {
                    return PERFECT || '完善资料'
                } else if (d.recRecordType == '9') {
                    return CONSUMPTION || '消费'
                } else {
                    return '--'
                }
            }
        },
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
    ]]);

    var recordDown = true;
    $('.record').click(function () {
        if (recordDown) {
            $('.record-wrapper').stop().slideDown();
            recordDown = !recordDown;
            $('.record span').html(TAKEUP || '收起')
        } else {
            $('.record-wrapper').stop().slideUp();
            recordDown = !recordDown;
            $('.record span').html(SCREEN || '筛选')
        }
    });


    var recRecordType;
    form.on('select(recRecordType)', function (data) {
        recRecordType = data.value;
    });

    //搜索
    $(".record_btn").on("click", function () {
        table.reload("record", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                recNumber: $(".recNumber").val(),
                recRecordType: recRecordType,
                recMemberName: $(".recMemName").val(),
                recPhone: $(".recPhone").val()
            }
        });
        $('.record-wrapper').stop().slideUp();
        recordDown = true;
        $('.record span').html(SCREEN || '筛选')
    });

    $('.recReset').click(function () {
        $('.record-wrapper input').val('');
        $('.record-wrapper select').val('');
        table.reload("record", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                recNumber: '',
                recRecordType: '',
                recMemberName: '',
                recPhone: ''
            }
        });
        $('.record-wrapper').stop().slideUp();
        recordDown = true;
        $('.record span').html(SCREEN || '筛选')
    });


    //余额流水
    tableIns('#balance', 'get/complex/amount/record/select', [[
        {field: 'amoNumber', title: STREAM || '流水号', align: 'center'},
        {
            field: 'amoMemberHeadImage', title: AVATAR || '会员头像', align: 'center', templet: function (d) {
                if (d.amoMemberHeadImage == undefined || d.recMemberHeadImage == '') {
                    return '';
                } else {
                    return '<img class="preview" src="' + d.amoMemberHeadImage + '" height="28" width="28">';
                }
            }
        },
        {field: 'amoMemberName', title: NAME || '会员名称', align: 'center'},
        {field: 'amoMemberPhone', title: PHONE || '会员手机号', align: 'center'},
        {field: 'amoAmount', title: AMOUNT || '金额', align: 'center'},
        {
            field: 'amoRecordType', title: TYPE || '获取类型', align: 'center', templet: function (d) {
                if (d.amoRecordType == '0') {
                    return RECHARGE || '充值'
                } else if (d.amoRecordType == '1') {
                    return PUTFORWARD || '提现'
                } else if (d.amoRecordType == '2') {
                    return RECEIVABLES || '收款'
                } else if (d.amoRecordType == '3') {
                    return PAYMENT || '付款'
                } else if (d.amoRecordType == '4') {
                    return FROZEN || '冻结'
                } else if (d.amoRecordType == '5') {
                    return '发放'
                } else if (d.amoRecordType == '6') {
                    return THAW || '解冻'
                } else {
                    return '--'
                }
            }
        },
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
    ]]);

    var balanceDown = true;
    $('.balance').click(function () {
        if (balanceDown) {
            $('.balance-wrapper').stop().slideDown();
            balanceDown = !balanceDown;
            $('.balance span').html(TAKEUP || '收起')
        } else {
            $('.balance-wrapper').stop().slideUp();
            balanceDown = !balanceDown;
            $('.balance span').html(SCREEN || '筛选')
        }
    });

    var amoRecordType;
    form.on('select(amoRecordType)', function (data) {
        amoRecordType = data.value;
    });

    //搜索
    $(".balance_btn").on("click", function () {
        table.reload("balance", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                amoNumber: $(".amoNumber").val(),
                amoRecordType: amoRecordType,
                amoMemberName: $(".amoMemName").val(),
                amoPhone: $(".amoPhone").val()
            }
        });
        $('.balance-wrapper').stop().slideUp();
        balanceDown = true;
        $('.balance span').html(SCREEN || '筛选')
    });

    $('.balReset').click(function () {
        $('.balance-wrapper input').val('');
        $('.balance-wrapper select').val('');
        table.reload("balance", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                amoNumber: '',
                amoRecordType: '',
                amoMemberName: '',
                amoPhone: ''
            }
        });
        $('.balance-wrapper').stop().slideUp();
        balanceDown = true;
        $('.balance span').html(SCREEN || '筛选')
    });


    function tableIns(id, url, cols) {
        //初始化数据表格
        var tableIns = table.render({
            elem: id,
            url: interfaceUrl + url,
            method: 'post',
            contentType: "application/json",
            page: {
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                curr: 1,//设定初始在第 5 页
                groups: 10//只显示 1 个连续页码

            },
            limit: 10,
            limits: ['10', '50', '100', '200'],
            id: id.substr(1),
            cols: cols,
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                countName: 'total',
                dataName: 'list'
            }
        });
    }
});

function goLogin() {
    parent.goLogin()
}
