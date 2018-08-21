layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        table = layui.table,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/dataCenter/enum/save') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/enum/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/dataCenter/enum/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');


    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');

    $('.screen-title').html(NAME || '枚举名称');
    $('.enumName').attr('placeholder', SEARCHNAME || '请输入枚举名称')
    $('.search_btn').html(SEARCH || '搜索')
    $('.reset').html(RESET || '重置')
    //数据表格初始化
    tableInit(table, 'get/dataCenter/enum/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'enumName', title: NAME || '名称', align: 'center'},
        {field: 'enumDescription', title: DESCRIPTION || '描述', align: 'center'},
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 100, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return ' <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return ' <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            enumName: $(".enumName").val()
        });
    });


    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/enum/enumAdd.html", ADD || "新增枚举");
    });

    //添加和编辑枚举
    function addOrEdit(url, title, edit) {
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "385px"],
            content: url,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".enumName").val(edit.enumName).attr('disabled', 'true');
                    body.find(".desc").val(edit.enumDescription);
                    form.render();
                }
            }
        })
    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'),
            data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(NOTDEL || '系统核心数据删除后可能造成不可修复的后果，相关责任将由操作人将承担，请谨慎操作！', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/dataCenter/enum/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的枚举");
        }
    });

    //列表操作
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/system_setup/enum/enumAdd.html", EDIT || '编辑', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/system_setup/enum/enumSee.html", SEE || '查看', data);
        } else if (layEvent === 'del') { //删除
            layer.confirm(DEL_PROMPT || '确定删除此枚举？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/dataCenter/enum/delete';
                ajaxJS(param, {ids: [data.id]}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })

            });
        }
    });
});

function goLogin() {
    parent.goLogin()
}
