layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/growth/rule/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/growth/rule/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/growth/rule/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.groType').html('<option value="">please choose</option>' +
            '                       <option value="0">' + LACHINE + '</option>' +
            '                       <option value="1">' + SHARE + '</option>' +
            '                       <option value="2">' + COMMENT + '</option>' +
            '                       <option value="3">' + CONSUME + '</option>');
    } else {
        $('.groType').html('<option value="">请选择类型</option>' +
            '                       <option value="0">拉新</option>' +
            '                       <option value="1">分享</option>' +
            '                       <option value="2">评论</option>' +
            '                       <option value="3">消费</option>');
    }
    form.render();

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');

    $('.type').html(TYPE || '类型');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: 'get/complex/growth/rule/delete', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //数据表格初始化
    tableInit(table, 'get/complex/growth/rule/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: 'groType', title: TYPE || '类型', align: 'center', templet: function (d) {
                if (d.groType == '0') {
                    return LACHINE || '拉新'
                } else if (d.groType == '1') {
                    return SHARE || '分享'
                } else if (d.groType == '2') {
                    return COMMENT || '评论'
                } else if (d.groType == '3') {
                    return CONSUME || '消费'
                }
            }
        },
        {field: 'groGrowthCount', title: NUM || '成长值数量', align: 'center'},
        {field: 'groMaxCount', title: UPPERLIMIT || '每日上限', align: 'center'},
        {field: 'createName', title: FOUNDER || '创建人', align: 'center'},
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


    var groType;
    form.on('select(groType)', function (data) {
        groType = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            groType: groType,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/integral_setup/growth/growthAdd.html", ADD || "添加规则");
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
                    body.find(".groType").attr('groType', edit.groType);
                    body.find(".groGrowthCount").val(edit.groGrowthCount);
                    body.find(".groMaxCount").val(edit.groMaxCount);
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
                title: PROMPT || '提示信息',
                btnAlign :'c'
            }, function (index) {
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
            addOrEdit("html/integral_setup/growth/growthAdd.html", EDIT || '编辑规则', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/integral_setup/growth/growthSee.html", SEE || '查看规则', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
