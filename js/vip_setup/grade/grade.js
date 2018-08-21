layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/grade/info/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/grade/info/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/grade/info/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.add_btn span').html(ADD || '添加');
    $('.delAll_btn span').html(DELETE || '删除');

    var lan = localStorage.getItem('language');

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };


    //表格数据初始化
    tableInit(table, 'get/complex/grade/info/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'graName', title: MEMLEVELNAME || '会员等级名称', align: 'center'},
        {field: 'graGrade', title: MEMLEVEL || '会员等级', align: 'center'},
        {
            field: 'graImage', title: MEMLEVELPIC || '会员等级图片', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.graImage + '" height="56" width="56">';
            }
        },
        {field: 'graGrowth', title: GROWTH || '成长值', align: 'center'},
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 100, fixed: "right", align: "center", templet: function (d) {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan == "2" ? "edit" : "编辑") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan == "2" ? "view" : "查看") + '</a>';
                }
            }
        }
    ]]);


    $(".add_btn").click(function () {
        addOrEdit("html/vip_setup/grade/gradeAdd.html", ADD || "添加会员等级");
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
                    body.find(".graGrowth").val(edit.graGrowth);
                    body.find(".graName").val(edit.graName);
                    body.find(".graGrade").val(edit.graGrade).attr('disabled', 'true');
                    body.find(".showImg").show().find('img').attr('src', edit.graImage);
                    body.find(".upload-wrapper").hide();
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
            layer.confirm(NOTDEL || '系统核心数据删除后可能造成不可修复的后果，相关责任将由操作人将承担，请谨慎操作！', {
                icon: 3,
                title: MESSAGE || '提示信息',
                btnAlign :'c'
            }, function (index) {
                param.url = 'get/complex/grade/info/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的会员等级");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/vip_setup/grade/gradeAdd.html", EDIT || '编辑会员等级', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/vip_setup/grade/gradeSee.html", SEE || '查看会员等级', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
