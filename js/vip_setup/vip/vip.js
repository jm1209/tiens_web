layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isFrozen = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/member/integral/freeze') {
            isFrozen = true;
        }
    }
    var lan = localStorage.getItem('language');


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    laydate.render({
        elem: '#test6',
        lang: lan == 2 ? 'en' : 'cn',
        range: true
    });

    //会员等级枚举
    param.url = 'get/complex/grade/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.memGradeId').append('<option value="">' + (CHOOSE || '请选择会员等级') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].graName + '</option>';
            $('.memGradeId').append(str)
        }
        $('.memGradeId').val($('.memGradeId').attr('val'));
        form.render();
    });
    $('.screen-nickname').html(NICKNAME || '昵称');
    $('.screen-phone').html(PHONE || '手机号');
    $('.screen-invitgationCode').html(INVITATIONCODE || '邀请码');
    $('.screen-level').html(MEMLEVEL || '会员等级');
    $('.screen-registerTime').html(REGISTERTIME || '注册时间');
    $('.screen-status').html(STATE || '启用禁用');


    $('.screen span').html(SCREEN || '筛选');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    $('.memNickname').attr('placeholder', SEARCHNICKNAME || '请输入昵称');
    $('.memPhone').attr('placeholder', SEARCHPHONE || '请输入手机号');
    $('.memInvitationCode').attr('placeholder', SEARCHINVITATIONCODE || '请输入邀请码');
    $('#createTime').attr('placeholder', SEARCHTIME || '请选择时间范围');

    if (lan == '2') {
        $('.memBannedStatus').html(
            '<input type="radio" name="memBannedStatus" lay-filter="memBannedStatus" value="0" title="disable">' +
            '<input type="radio" name="memBannedStatus" lay-filter="memBannedStatus" value="1" title="enable">'
        );
    } else {
        $('.memBannedStatus').html(
            '<input type="radio" name="memBannedStatus" lay-filter="memBannedStatus" value="0" title="禁用">' +
            '<input type="radio" name="memBannedStatus" lay-filter="memBannedStatus" value="1" title="启用">'
        );
    }


    //数据表格初始化
    tableInit(table, 'get/complex/member/select', [[
        {
            field: 'memHeadImage', title: IMAGE || '头像', align: 'center', templet: function (d) {
                if (d.memHeadImage == undefined) {
                    return '';
                } else {
                    return '<img class="preview" src="' + d.memHeadImage + '" height="28">';
                }
            }
        },
        {field: 'memNickname', title: NICKNAME || '昵称', align: 'center'},
        {
            field: 'memSex', title: SEX || '性别', align: 'center', templet: function (d) {
                if (d.memSex == '0') {
                    return MAN || '男';
                } else if (d.memSex == '1') {
                    return WOMAN || '女';
                }
            }
        },
        {field: 'memGradeName', title: MEMLEVEL || '会员等级', align: 'center'},
        {field: 'memPhone', title: PHONE || '手机号', align: 'center'},
        {
            field: 'memBannedStatus', title: STATE || '启用禁用', align: 'center', templet: function (d) {
                var checked;
                if (d.memBannedStatus == '0') {
                    checked = '';
                } else {
                    checked = 'checked';
                }
                if (lan == 2) {
                    return '<input type="checkbox" memberId="' + d.id + '" name="memBannedStatus" lay-filter="memBannedStatus" lay-skin="switch" lay-text="enable|disable" ' + checked + '/>'
                } else {
                    return '<input type="checkbox" memberId="' + d.id + '" name="memBannedStatus" lay-filter="memBannedStatus" lay-skin="switch" lay-text="启用|禁用" ' + checked + '/>'
                }

            }
        },
        {field: 'memInvitationCode', title: INVITATIONCODE || '会员邀请码', align: 'center'},
        {field: 'createTime', title: REGISTERTIME || '注册时间', align: 'center'},
        {
            title: HANDLETYPE || '操作', minWidth: 150, fixed: "right", align: "center", templet: function () {
                if (isFrozen) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan == "2" ? "view" : "查看") + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="frozen">' + (lan == "2" ? "frozen" : "积分冻结") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan == "2" ? "view" : "查看") + '</a>';
                }
            }
        }
    ]]);


    var memBannedStatus, memGradeId, createStartTime, createEndTime;
    form.on('radio(memBannedStatus)', function (data) {
        memBannedStatus = data.value;
    });
    form.on('select(memGradeId)', function (data) {
        memGradeId = data.value;
    });

    laydate.render({
        elem: '#createTime',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {
            createStartTime = value.split(' - ')[0];
            createEndTime = value.split(' - ')[1];

        }
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            memNickname: $(".memNickname").val(),
            memPhone: $(".memPhone").val(),
            memInvitationCode: $(".memInvitationCode").val(),
            // memStatus: memStatus,
            memBannedStatus: memBannedStatus,
            memGradeId: memGradeId,
            createStartTime: createStartTime,
            createEndTime: createEndTime,
        });
    });


    //会员状态的启用和禁用
    form.on('switch(memBannedStatus)', function (data) {
        var elem = data.elem;
        var tipText = DISABLEVIP || '确定禁用当前会员？';
        if (data.elem.checked) {
            tipText = ENABLEVIP || '确定启用当前会员？'
        }
        layer.confirm(tipText, {
            icon: 3,
            title: MESSAGE || '系统提示',
            btnAlign: 'c',
            cancel: function (index) {
                data.elem.checked = !data.elem.checked;
                form.render();
                layer.close(index);
            }
        }, function (index) {
            layer.close(index);
            param.url = 'get/complex/member/updateStatus';
            var checked = elem.checked ? '1' : '0';
            ajaxJS(param, {memberId: $(elem).attr('memberId'), memBannedStatus: checked}, function (d) {
                form.render();
                layer.close(index);
                layer.msg(d.msg)
            })
        }, function (index) {
            data.elem.checked = !data.elem.checked;
            form.render();
            layer.close(index);
        });
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'see') { //编辑
            var index = layui.layer.open({
                title: INFORMATION || '会员信息',
                type: 2,
                content: "vipDetail.html",
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    body.find(".sign").val("edit").attr("signid", data.id);

                    setTimeout(function () {
                        layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        } else if (layEvent === 'frozen') {
            var index = layer.open({
                title: FREEZEINTEGRAL || '积分冻结',
                type: 2,
                area: ["750px", "500px"],
                content: "html/vip_setup/vip/vipFrozen.html",
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    body.find(".sign").val("edit").attr("signid", data.id);

                }
            })
        }
    });
});

function goLogin() {
    parent.goLogin()
}

function showImg(src) {
    parent.showImg(src)
}
