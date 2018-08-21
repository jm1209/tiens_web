layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    var isGrant = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/dataCenter/role/save') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/role/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/dataCenter/role/delete') {
            $('.delShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/role/authorization') {
            isGrant = true;
        }
    }

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.roleStatusRadio').html(
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="1" title="valid">' +
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="0" title="invalid">'
        );
    } else {
        $('.roleStatusRadio').html(
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="1" title="有效">' +
            '<input type="radio" name="roleStatus" lay-filter="roleStatus" value="0" title="无效">'
        );
    }
    form.render();

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '批量删除');

    $('.screen-roleName').html(NAME || '角色名称');
    $('.screen-roleStatus').html(STATE || '角色状态');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.roleName').attr('placeholder', SEARCHNAME || '请输入角色名称');

    //渲染数据表格
    tableInit(table, 'get/dataCenter/role/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'roleName', title: NAME || '角色名称', align: 'center'},
        {field: 'roleDes', title: DESCRIBE || '角色描述', align: 'center'},
        {
            field: 'roleStatusLabel', title: STATE || '角色状态', align: 'center', templet: function (d) {
                if (d.roleStatus == '0') {
                    return INVALID || '无效';
                } else if (d.roleStatus == '1') {
                    return VALID || '有效';
                }
            }
        },
        {
            title: HANDLE || '操作', width: 150, fixed: "right", align: "center", templet: function () {
                if (isUpdate && isGrant) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="grant">' + (lan != "2" ? "授权" : "grant") + '</a>' +
                        '   <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else if (isUpdate && !isGrant) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else if (!isUpdate && isGrant) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var roleStatus;
    form.on('radio(roleStatus)', function (data) {
        roleStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            roleName: $(".roleName").val(),
            roleStatus: roleStatus
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/role/roleAdd.html", ADD || "新增角色");
    });

    //添加和编辑角色
    function addOrEdit(url, title, edit) {  //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "385px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".roleName").val(edit.roleName);
                    body.find(".roleDes").val(edit.roleDes);
                    body.find(".roleStatus input[value=" + edit.roleStatus + "]").attr("checked", "checked");
                    body.find(".roleStatus").attr("roleStatus", edit.roleStatus);
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
            layer.confirm(DEL_PROMPT || '确定删除选中的角色？', {icon: 3, title: PROMPT || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/dataCenter/role/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的角色");
        }
    });

    //列表操作
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/system_setup/role/roleAdd.html", EDIT || '编辑角色', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/system_setup/role/roleSee.html", EDIT || '查看角色', data);
        } else if (layEvent === 'grant') {
            var index = layer.open({
                title: GRANT || "角色授权",
                type: 2,
                area: ["750px", "500px"],
                resize: false,
                content: "html/system_setup/role/roleGrant.html?roleId=" + data.id,
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    body.find(".grant_title span").html(data.roleName);
                }
            })
        }
    });
});

function goLogin() {
    parent.goLogin()
}
