layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('.avater i').html(AVATAR || '头像');
    $('.memNickname i').html(NICKNAME || '昵称');
    $('.memPhone i').html(PHONE || '联系方式');
    $('.memSex i').html(SEX || '性别');
    $('.memAge i').html(AGE || '年龄');
    $('.memBirthday i').html(BIRTHDAY || '生日');
    $('.memGradeName i').html(GRADE || '会员等级');
    $('.memStatus i').html(STATE || '会员状态');
    $('.memIsRealName i').html(ISREAL || '是否实名');
    $('.memPresentAmount i').html(MEMPRESENTAMOUNT || '可提现余额');
    $('.memNonPresentAmount i').html(MEMNONPRESENTAMOUNT || '不可提现余额');
    $('.memIntegral i').html(MEMINTEGRAL || '消费积分');
    $('.createTime i').html(REGISTERTIME || '注册时间');
    $('.memInvitationCode i').html(MEMINVITATIONCODE || '会员邀请码');
    $('.memRelatedInvitationCode i').html(MEMRELATEDINVITATIONCODE || '关联邀请码');

    $('.real').html(REAL || '实名信息');
    $('.bind').html(BIND || '绑定业态');
    $('.signin').html(SIGN || '签到记录');
    $('.bank').html(BANK || '银行卡信息');
    $('.downline').html(DOWNLINE || '我的下线');

    param.url = 'get/complex/member/getOne';
    ajaxJS(param, {memberId: $('.sign').attr('signid')}, function (d) {
        var data = d.data;
        $('.memHeadImage img').attr('src', data.memHeadImage);
        $('.memNickname span').html(data.memNickname);
        $('.memPhone span').html(data.memPhone);
        $('.memNonPresentAmount span').html(data.memNonPresentAmount);
        $('.memOpenid span').html(data.memOpenid);
        $('.createTime span').html(data.createTime);
        $('.memIntegral span').html(data.memIntegral);
        $('.memGradeName span').html(data.memGradeName);
        $('.memIsRealName span').html(data.memIsRealName == '0' ? NOTREAL || '未实名' : REAL || '已实名');
        $('.memSex span').html(data.memSex == '0' ? MAN || '男' : WOMAN || '女');
        $('.memBirthday span').html(data.memBirthday);
        $('.memStatus span').html(data.memBannedStatus == '0' ? NOTENABLED || '禁用' : ENABLED || '启用');
        $('.memAge span').html(data.memAge);
        $('.memPresentAmount span').html(data.memPresentAmount);
        $('.memInvitationCode span').html(data.memInvitationCode);
        $('.memRelatedInvitationCode span').html(data.memRelatedInvitationCode);
    });

    setTimeout(function () {
        //实名信息
        tableList('#authentication', 'get/complex/authentication/info/select', [[
            {
                field: 'autCardImageFront', title: FACADE || '身份证正面照', align: 'center', templet: function (d) {
                    return '<img class="preview" src="' + d.autCardImageFront + '" height="28">';
                }
            },
            {
                field: 'autCardImageBack', title: REVERSE || '身份证反面照', align: 'center', templet: function (d) {
                    return '<img class="preview" src="' + d.autCardImageBack + '" height="28">';
                }
            },
            {field: 'autName', title: NAME || '姓名', align: 'center'},
            {field: 'autCardNo', title: IDNUMBER || '身份证号', align: 'center'},
            {field: 'autPhone', title: PHONE || '手机号', align: 'center'},
            {field: 'createTime', title: ATTESTATION || '认证时间', align: 'center'},
        ]]);

        //绑定业态
        tableList('#bussiness', 'get/complex/bussiness/relation/select', [[
            {
                field: 'bussinessLogo', title: 'LOGO', align: 'center', templet: function (d) {
                    return '<img src="' + d.bussinessLogo + '" height="28">';
                }
            },
            {field: 'bussinessName', title: NAME || '业态名称', align: 'center'},
            {field: 'accountPhone', title: ACCOUNT || '业态账号', align: 'center'},
            {
                field: 'boundType', title: TYPE || '绑定类型', align: 'center', templet: function (d) {
                    if (d.boundType == '0') {
                        return ACCOUNT || '账号';
                    } else {
                        return PHONE || '手机号';
                    }
                }
            },
            {field: 'createTime', title: CREATETIME || '绑定时间', align: 'center'}
        ]]);

        //签到信息
        tableList('#sign', 'get/complex/sign/info/select', [[
            {field: 'signDay', title: DAY || '连续签到天数', align: 'center'},
            {field: 'signDate', title: CREATETIME || '签到日期', align: 'center'}
        ]]);

        //银行卡信息
        tableList('#card', 'get/complex/card/info/select', [[
            {
                field: 'carBankLogo', title: 'LOGO', align: 'center', templet: function (d) {
                    return d.cardBankLogo ? '<div style="height:28px;width:28px; text-align: center;"><img style="width: 100%; height100%;" src="' + d.cardBankLogo + '"></div>' : null;
                }
            },
            {
                field: 'cardBankNo', title: BANKCARD || '银行卡号', align: 'center', templet: function (d) {
                    return '**** **** **** ' + d.cardBankNo
                }
            },
            {field: 'cardBankName', title: NAME || '银行名称', align: 'center'},
            {
                field: 'cardType', title: TYPE || '卡种类', align: 'center', templet: function (d) {
                    return d.cardType == '1' ? DEPOSITCARD || '储蓄卡' : CREDITCARD || '信用卡';
                }
            },
            {field: 'cardPhone', title: PHONE || '预留手机号', align: 'center'},
            {
                field: 'cardIsDefault', title: DEFAULT || '是否默认', align: 'center', templet: function (d) {
                    return d.cardIsDefault == '0' ? NOTDEFAULT || '否' : DEFAULT || '是';
                }
            }
        ]]);

        //我的下线
        tableList('#member', 'get/complex/member/select', [[
            {field: 'memPhone', title: PHONE || '手机号', align: 'center'},
            {field: 'memNickname', title: NICKNAME || '昵称', align: 'center'},
            {field: 'memGradeName', title: GRANT || '会员等级名称', align: 'center'},
            {
                field: 'memStatus', title: STATE || '会员状态', align: 'center', templet: function (d) {
                    return d.memStatus == '0' ? ENABLED || '未冻结' : NOTENABLED || '已冻结';
                }
            },
            {
                field: 'memIsFreePassword', title: SECRETFREE || '是否免密', align: 'center', templet: function (d) {
                    return d.memIsFreePassword == '0' ? NOTSECRETFREE || '否' : SECRETFREE || '是';
                }
            },
            {
                field: 'memIsHandPassword', title: GESTURE || '是否启用手势密码', align: 'center', templet: function (d) {
                    return d.memIsHandPassword == '0' ? NOTENABLED || '不启用' : ENABLED || '启用';
                }
            },
            {
                field: 'memIsRealName', title: ISREAL || '是否实名', align: 'center', templet: function (d) {
                    return d.memIsRealName == '0' ? NOTREAL || '未实名' : REAL || '已实名';
                }
            },
            {
                field: 'memIsPerfectInfo', title: PERFECT || '是否完善资料', align: 'center', templet: function (d) {
                    return d.memIsPerfectInfo == '0' ? NOTPERFECT || '未完善' : PERFECT || '已完善';
                }
            },
            {field: 'memInvitationCode', title: MEMINVITATIONCODE || '会员邀请码', align: 'center'},
            {field: 'createTime', title: REGISTERTIME || '注册时间', align: 'center'}
        ]]);

    }, 200);


    function tableList(id, url, colArr) {
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
            cols: colArr,
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                countName: 'total',
                dataName: 'list'
            },
            where: {
                memberId: $('.sign').attr('signid')
            }
        });
    }
});

function goLogin() {
    parent.goLogin()
}