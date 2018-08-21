layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/integral/rule/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/integral/rule/update') {
            isUpdate = true;
        }
    }

    var lan = localStorage.getItem('language');

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');

    $('.type').html(TYPE || '类型');
    $('.grade').html(GRADE || '会员等级');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    if (lan == '2') {
        $('.roleStatusRadio').html(
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="1" title="consume">' +
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="0" title="lachine">'
        );
    } else {
        $('.roleStatusRadio').html(
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="1" title="消费">' +
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="0" title="拉新">'
        );
    }
    form.render();


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/grade/info/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.ruleGradeId').append('<option value="">' + (CHOOSE || '请选择类型') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = ' <option value="' + data[i].id + '">' + data[i].graName + '</option>';
            $('.ruleGradeId').append(str)
        }
        form.render();
    });

    //初始化数据表格
    tableInit(table, 'get/complex/integral/rule/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'ruleGradeName', title: GRANT || '会员等级', align: 'center'},
        {
            field: 'ruleType', title: TYPE || '类型', align: 'center', templet: function (d) {
                if (d.ruleType == '0') {
                    return LACHINE || '拉新';
                } else {
                    return CONSUME || '消费';
                }
            }
        },
        {field: 'ruleCount', title: NUM || '积分数量', align: 'center'},
        {field: 'createName', title: FOUNDER || '创建人', align: 'center'},
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {
            title: HANDLE || '操作', width: 120, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var ruleGradeId, ruleType;
    form.on('select(ruleGradeId)', function (data) {
        ruleGradeId = data.value;
    });
    form.on('radio(roleStatus)', function (data) {
        ruleType = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            ruleType: ruleType,
            ruleGradeId: ruleGradeId,
        });
    });


    $(".add_btn").click(function () {
        addOrEdit("html/integral_setup/rule/ruleAdd.html", ADD || "添加规则");
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "400px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".ruleType").attr('ruleType',edit.ruleType).attr('disabled', 'true');
                    body.find(".ruleCount").val(edit.ruleCount);
                    body.find(".ruleGradeId").attr('ruleGradeId', edit.ruleGradeId).attr('disabled', 'true');
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
            layer.confirm(NOTDEL || '系统核心数据删除后可能造成不可修复的后果，相关责任将由操作人将承担，请谨慎操作！', {icon: 3, title: PROMPT || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/complex/integral/rule/delete';
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
            addOrEdit("html/integral_setup/rule/ruleAdd.html", EDIT || '编辑规则', data);
        } else if (layEvent === 'see') { //删除
            addOrEdit("html/integral_setup/rule/ruleSee.html", SEE || '查看规则', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
