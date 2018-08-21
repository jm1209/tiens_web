layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');


    $('.phone1').html(PHONE || '手机号');
    $('.viplevel').html(VIPLEVEL || '会员等级');
    $('.createtime').html(CREATETIME || '注册时间');
    $('.invitationcode').html(INVITATIONCODE || '会员邀请码');
    $('.isautonym').html(ISAUTONYM || '是否实名');
    $('.completeinfo').html(ISCOMPLETEINFO || '完善资料');
    $('.sex1').html(SEX || '性别');
    $('.vipstatus').html(STATE || '会员状态');
    $('.selecttag').html(TAGSELECTED || '已选标签');
    $('.selecttemple').html(TEMPLESELECTED || '选择模板');
    $('.submit').html(SUBMIT || '提交');
    $('.content').attr('placeholder', INPUTCONTENT || '请输入内容');

    if (lan == '2') {
        $('.memIsRealName').html(
            '<option value="">please choose</option>' +
            '<option value="0">no real name</option>' +
            '<option value="1">real name</option>'
        );

        $('.memIsPerfectInfo').html(
            '<option value="">please choose</option>' +
            '<option value="0">not complete</option>' +
            '<option value="1">complete</option>'
        );

        $('.memSex').html(
            '<option value="">please choose</option>' +
            '<option value="0">man</option>' +
            '<option value="1">woman</option>'
        );

        $('.memStatus').html(
            '<option value="">please choose</option>' +
            '<option value="0">enable</option>' +
            '<option value="1">disable</option>'
        );

    } else {
        $('.memIsRealName').html(
            '<option value=""></option>' +
            '<option value="0">未实名</option>' +
            '<option value="1">已实名</option>'
        );

        $('.memIsPerfectInfo').html(
            '<option value=""></option>' +
            '<option value="0">未完善</option>' +
            '<option value="1">已完善</option>'
        );

        $('.memSex').html(
            '<option value=""></option>' +
            '<option value="0">男</option>' +
            '<option value="1">女</option>'
        );

        $('.memStatus').html(
            '<option value=""></option>' +
            '<option value="0">未冻结</option>' +
            '<option value="1">已冻结</option>'
        );
    }
    form.render();


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/sms/template/select';
    ajaxJS(param, {}, function (d) {
        var data = d.data.list;
        $('.smsTem').append('<option value="">' + (TEMPLESELECTED || '请选择模板') + '</option>');
        for (var i = 0; i < data.length; i++) {
            if (data[i].smsStatus == 0) continue;
            var str = ' <option id="' + data[i].id + '" value="' + data[i].smsTemplateContent + '">' + data[i].smsTemplatelTitle + '</option>';
            $('.smsTem').append(str)
        }
        $('.smsTem').val($('.smsTem').attr('val'));
        form.render();
    });
    form.on("select(smsTem)", function (data) {
        smsTem = data.value;
        $('.content').val(data.value)
    });


    param.url = 'get/complex/grade/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.memGradeId').append(' <option value="">' + (CHOOSE || '请选择') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = ' <option value="' + data[i].id + '">' + data[i].graName + '</option>';
            $('.memGradeId').append(str)
        }
        form.render();
    });

    //已选的标签
    $('.memPhone').blur(function () {
        if ($(this).val() != '') {
            $('.phone').css('display', 'inline-block').find('.tagText').html($(this).val());
        } else {
            $('.phone').hide().find('.tagText').html('');
        }
    });
    form.on("select(memGradeId)", function (res) {
        if (res.value != '') {
            param.url = 'get/complex/grade/info/getEnum';
            ajaxJS(param, {}, function (d) {
                var data = d.data;
                var gradeName = '';
                var gradeId = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == res.value) {
                        gradeName = data[i].graName;
                        gradeId = data[i].id;
                        break;
                    }
                }
                $('.grade').css('display', 'inline-block').find('.tagText').html(gradeName).attr('gradeid', gradeId);
            });
        } else {
            $('.grade').hide().find('.tagText').html('');
        }
    });
    $('.memInvitationCode').blur(function () {
        if ($(this).val() != '') {
            $('.code').css('display', 'inline-block').find('.tagText').html($(this).val());
        } else {
            $('.code').hide().find('.tagText').html('');
        }
    });
    form.on("select(memIsRealName)", function (res) {
        if (res.value != '') {
            $('.real').css('display', 'inline-block')
                .find('.tagText')
                .html(res.value == '0' ? NOTREAL || '未实名' : REAL || '已实名')
                .attr('real', res.value);
        } else {
            $('.real').hide().find('.tagText').html('');
        }
    });
    form.on("select(memIsPerfectInfo)", function (res) {
        if (res.value != '') {
            $('.perfect').css('display', 'inline-block')
                .find('.tagText')
                .html(res.value == '0' ? NOTPERFECT || '未完善' : PERFECT || '已完善')
                .attr('perfect', res.value);
        } else {
            $('.perfect').hide().find('.tagText').html('');
        }
    });
    form.on("select(memSex)", function (res) {
        if (res.value != '') {
            $('.sex').css('display', 'inline-block')
                .find('.tagText')
                .html(res.value == '0' ? MAN || '男' : WOMAN || '女')
                .attr('sex', res.value);
        } else {
            $('.sex').hide().find('.tagText').html('');
        }
    });
    form.on("select(memStatus)", function (res) {
        if (res.value != '') {
            $('.status').css('display', 'inline-block')
                .find('.tagText').html(res.value == '0' ? ENABLED || '未冻结' : NOTENABLED || '已冻结')
                .attr('status', res.value);
        } else {
            $('.status').hide().find('.tagText').html('');
        }
    });

    $('.delTag').each(function () {
        $(this).click(function () {
            event.stopPropagation();
            var parentClass = $(this).parents('.tag').attr('class');
            if (parentClass.indexOf('phone') != -1) {
                $(this).parents('.tag').hide();
                $('.memPhone').val('');
            }
            if (parentClass.indexOf('grade') != -1) {
                $(this).parents('.tag').hide();
                $('.memGradeId').val('');
                form.render();
            }
            if (parentClass.indexOf('time') != -1) {
                $(this).parents('.tag').hide();
                $('#createTime').val('');
            }
            if (parentClass.indexOf('code') != -1) {
                $(this).parents('.tag').hide();
                $('.memInvitationCode').val('');
            }
            if (parentClass.indexOf('real') != -1) {
                $(this).parents('.tag').hide();
                $('.memIsRealName').val('');
                form.render()
            }
            if (parentClass.indexOf('perfect') != -1) {
                $(this).parents('.tag').hide();
                $('.memIsPerfectInfo').val('');
                form.render()
            }
            if (parentClass.indexOf('sex') != -1) {
                $(this).parents('.tag').hide();
                $('.memSex').val('');
                form.render()
            }
            if (parentClass.indexOf('status') != -1) {
                $(this).parents('.tag').hide();
                $('.memStatus').val('');
                form.render()
            }
        });
    });

    $('.tag').each(function () {
        $(this).click(function () {
            event.stopPropagation();
            var parentClass = $(this).attr('class');
            if (parentClass.indexOf('phone') != -1) {
                vipTag('memPhone', $(this).find('.tagText').html())
            }
            if (parentClass.indexOf('grade') != -1) {
                vipTag('memGradeId', $(this).find('.tagText').attr('gradeid'))
            }
            if (parentClass.indexOf('time') != -1) {
                vipTag('memtime', $(this).find('.tagText').html())
            }
            if (parentClass.indexOf('code') != -1) {
                vipTag('memInvitationCode', $(this).find('.tagText').html())
            }
            if (parentClass.indexOf('real') != -1) {
                vipTag('memIsRealName', $(this).find('.tagText').attr('real'))
            }
            if (parentClass.indexOf('perfect') != -1) {
                vipTag('memIsPerfectInfo', $(this).find('.tagText').attr('perfect'))
            }
            if (parentClass.indexOf('sex') != -1) {
                vipTag('memSex', $(this).find('.tagText').attr('sex'))
            }
            if (parentClass.indexOf('status') != -1) {
                vipTag('memStatus', $(this).find('.tagText').attr('status'))
            }
        });
    });

    function vipTag(key, data) {
        var index = layer.open({
            title: SEE || '查看会员',
            type: 2,
            area: ["1000px", "600px"],
            content: "html/sms_setup/smsPush/vipTag.html?key=" + key + "&data=" + data
        })
    }


    laydate.render({
        elem: '#createTime',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value, date) {
            $('.time').css('display', 'inline-block').find('.tagText').html(value);
            if (value == '') {
                $('.time').hide();
            }
        }
    });

    form.on("submit(choose)", function (data) {
        var field = data.field;
        $('#select1').empty();
        $('#select2').empty();

        var data = {
            memPhone: field.memPhone,
            memGradeId: field.memGradeId,
            memIsRealName: field.memIsRealName,
            memIsPerfectInfo: field.memIsPerfectInfo,
            memSex: field.memSex,
            memStatus: field.memStatus,
            createStartTime: $('#createTime').val().split(' - ')[0] || '',
            createEndTime: $('#createTime').val().split(' - ')[1] || '',
            memInvitationCode: field.memInvitationCode
        };
        param.url = 'get/complex/member/select';
        search($, table,form, data);
        return false;
    });

    $('#addOrEdit').click(function () {
        if ($('.content').val() == '' || $('.content').val() == '请输入内容') {
            layer.msg(lan == 2 ? 'ending content is empty.' : '发送内容为空')
            return;
        }
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var memberIdArr = [];

        $('#select2 option').each(function () {
            memberIdArr.push($(this).val())
        });

        var mem = {
            memPhone: $(".memPhone").val(),
            memGradeId: $(".memGradeId option:selected").val(),
            memIsRealName: $(".memIsRealName option:selected").val(),
            memIsPerfectInfo: $(".memIsPerfectInfo option:selected").val(),
            memSex: $(".memSex option:selected").val(),
            memStatus: $(".memStatus option:selected").val(),
            createStartTime: $('#createTime').val().split(' - ')[0] || '',
            createEndTime: $('#createTime').val().split(' - ')[1] || '',
            memInvitationCode: $(".memInvitationCode option:selected").val()
        }

        param.url = 'get/complex/note/push';
        ajaxJS(param, {
            member: mem,
            memberIdList: memberIdArr,
            content: $('[name="content"]').val(),
            smsTemplateId: $('.smsTem option:selected').attr("id")
        }, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload()
        });
    });


    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});
