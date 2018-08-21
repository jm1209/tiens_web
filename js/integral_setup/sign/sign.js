layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/integral/sign/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/integral/sign/update') {
            isUpdate = true;
        }
    }

    var lan = localStorage.getItem('language');

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');

    $('.day').html(DAY || '签到天数');
    $('.grade').html(GRADE || '会员等级');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.signDay').attr('placeholder', SEARCHNAME || '请输入角色名称');


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/grade/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.signGradeId').append('<option value="">' + (CHOOSE || '请选择会员等级') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].graName + '</option>';
            $('.signGradeId').append(str);
        }
        $('.signGradeId').val($('.signGradeId').attr('val'));
        form.render();
    });

    //初始化数据表格
    tableInit(table, 'get/complex/integral/sign/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'signGradeName', title: GRANT || '会员等级', align: 'center'},
        {field: 'signDay', title: DAY || '连续签到天数', align: 'center'},
        {field: 'signCount', title: NUM || '积分数量', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {
            title: HANDLE || '操作', width: 100, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return ' <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return ' <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var signGradeId;
    form.on('select(signGradeId)', function (data) {
        signGradeId = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            signDay: $(".signDay").val(),
            signGradeId: signGradeId,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/integral_setup/sign/signAdd.html", ADD || "添加规则");
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "500px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".signDay").val(edit.signDay).attr('disabled', 'true');

                    body.find(".signCount").val(edit.signCount);
                    body.find(".signGradeId").attr('val', edit.signGradeId).attr('disabled', 'true');
                    form.render();
                }
            }
        })

    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'),
            data = checkStatus.data,
            idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(NOTDEL || '系统核心数据删除后可能造成不可修复的后果，相关责任将由操作人将承担，请谨慎操作！', {
                icon: 3,
                title: MESSAGE || '提示信息',
                btnAlign :'c'
            }, function (index) {
                param.url = 'get/complex/integral/sign/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的规则");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/integral_setup/sign/signAdd.html", EDIT || '编辑规则', data);
        } else {
            addOrEdit("html/integral_setup/sign/signSee.html", SEE || '查看规则', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
