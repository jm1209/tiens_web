layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/information/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/information/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/information/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');
    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    $('.title1').html(TITLE || '标题');
    $('.type').html(TYPE || '类型');
    $('.time').html(TIME || '时间');

    $('.infTitle').attr('placeholder', TITLE || '请输入标题');
    $('#createTime').attr('placeholder', SEARCHTIME || '请选择时间范围');


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/information/type/getEnum';

    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.infTypeId').append(' <option value="">' + (CHOOSE || "请选择类型") + '</option>')
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].infTypeName + '</option>';
            $('.infTypeId').append(str);
        }
        $('.infTypeId').val($('.infTypeId').attr('infTypeid'));
        form.render();
    });

    //数据表格渲染
    tableInit(table, 'get/complex/information/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'infTitle', title: TITLE || '标题', align: 'center'},
        {field: 'infTypeName', title: TYPE || '类型', align: 'center'},
        {field: 'infDescription', title: DIGEST || '摘要', align: 'center'},
        {field: 'createName', title: FOUNDER || '创建人', align: 'center'},
        {field: 'createTime', title: CREATENAME || '创建时间', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 150, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "view") + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "view") + '</a>';
                }
            }
        }
    ]]);

    var infTypeId;
    form.on('select(infTypeId)', function (data) {
        infTypeId = data.value;
    });

    laydate.render({
        elem: '#createTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime',
    });

    //搜索
    $(".search_btn").on("click", function () {
        var createStartTime = $('#createTime').val().split(' - ')[0];
        var createEndTime = $('#createTime').val().split(' - ')[1] || '';
        search($, table,form, {
            infTitle: $(".infTitle").val(),
            infTypeId: infTypeId,
            createStartTime: createStartTime,
            createEndTime: createEndTime,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit(ADD || "添加软文");
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "newsSoftAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".infTypeId").attr('infTypeId', edit.infTypeId);
                    body.find(".infTitle").val(edit.infTitle);
                    body.find(".infDescription").val(edit.infDescription);
                    body.find("#infDetail").attr('val', edit.infDetail);
                    if (see) {
                        body.find(".sign").attr("see", 'see');
                        body.find(".see").hide();
                        body.find("input").attr('disabled', 'true');
                        body.find("select").attr('disabled', 'true');
                        body.find("textarea").attr('disabled', 'true');
                    }
                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })

    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm(DEL_PROMPT || '确定删除选中的软文？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/complex/information/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的软文");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit(EDIT || '编辑软文', data);
        } else if (layEvent === 'see') {
            addOrEdit(SEE || '查看软文', data, 'see');
        }
    });
});

function goLogin() {
    parent.goLogin()
}
