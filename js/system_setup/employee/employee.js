layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/dataCenter/employee/save') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/employee/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/dataCenter/employee/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.empStatusRadio').html(
            '<input type="radio" name="empStatus" lay-filter="empStatus" value="1" title="effective">' +
            '<input type="radio" name="empStatus" lay-filter="empStatus" value="0" title="invalid">');
    } else {
        $('.empStatusRadio').html(
            '<input type="radio" name="empStatus" lay-filter="empStatus" value="1" title="有效">' +
            '<input type="radio" name="empStatus" lay-filter="empStatus" value="0" title="无效">');
    }
    form.render();

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '批量删除');

    $('.screen-title').html(ACCOUNT || '账号');
    $('.screen-name').html(NAME || '用户名');
    $('.screen-phone').html(PHONE || '联系方式');
    $('.screen-status').html(STATE || '状态');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    $('.empAccount').attr('placeholder', SEARCHACCOUNT || '请输入账号');
    $('.empName').attr('placeholder', SEARCHNAME || '请输入用户名');
    $('.empPhoneno').attr('placeholder', SEARCHPHONE || '请输入联系方式');

    //数据表格初始化
    tableInit(table, 'get/dataCenter/employee/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'empName', title: NAME || '用户名', align: 'center'},
        {field: 'empAccount', title: ACCOUNT || '账号', align: 'center'},
        {field: 'empPhoneno', title: PHONE || '手机号', align: 'center'},
        {
            field: 'empStatus', title: STATE || '状态', align: 'center', templet: function (d) {
                return d.empStatus == "1" ? '<span class="layui-blue">' + (VALID || "有效") + '</span>' : '<span class="layui-red">' + (INVALID || "无效") + '</span>';
            }
        },
        {field: 'roleNames', title: ROLETNAME || '角色类型', align: 'center'},
        {
            title: HANDLE || '操作', width: 100, align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var empStatus;
    form.on('radio(empStatus)', function (data) {
        empStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            empAccount: $(".empAccount").val(),
            empName: $(".empName").val(),
            empPhoneno: $(".empPhoneno").val(),
            empStatus: empStatus,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/employee/empAdd.html", ADD || "添加用户");
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "550px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".empName").val(edit.empName);
                    body.find(".empAccount").val(edit.empAccount).attr('disabled', 'true');
                    body.find(".empPhone").val(edit.empPhoneno);
                    body.find(".empSeq").val(edit.empSeq);
                    body.find(".empDesc").val(edit.empDesc);
                    body.find(".empStatus").attr("empStatus", edit.empStatus);
                    body.find(".roleIds").attr('val', edit.roleIds);
                    form.render();
                }
            }
        })
    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(DEL_PROMPT || '确定删除选中的用户？', {icon: 3, title: PROMPT || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/dataCenter/employee/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的用户");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/system_setup/employee/empAdd.html", EDIT || '编辑用户', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/system_setup/employee/empSee.html", EDIT || '查看用户', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
