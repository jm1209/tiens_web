layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/news/category/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/news/category/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/news/category/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    $('.name').html(NAME || '分类名称');
    $('.type').html(TYPE || '类型');
    $('.time').html(TIME || '时间');

    $('.categoryName').attr('placeholder', NAME || '请输入分类名称');
    $('#createTime').attr('placeholder', SEARCHTIME || '请选择时间范围');

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //初始化数据表格
    tableInit(table, 'get/complex/news/category/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'categoryName', title: NAME || '分类名称', align: 'center'},
        {
            field: 'categoryStatus', title: STATE || '状态', align: 'center', templet: function (d) {
                if (d.categoryStatus == "1") {
                    return ENABLED || '启用';
                } else {
                    return NOTENABLED || '未启用';
                }
            }
        },
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 120, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

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
            categoryName: $(".categoryName").val(),
            createStartTime: createStartTime,
            createEndTime: createEndTime,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/news_setup/newsClassify/newsClassifyAdd.html", ADD || "添加分类");
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "450px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".categoryName").val(edit.categoryName);
                    body.find(".categoryStatus").attr("categoryStatus", edit.categoryStatus);
                    form.render();
                }
            }
        })

    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'),
            data = checkStatus.data,
            empIdArr = [];
        if (data.length > 0) {
            for (var i in data) {
                empIdArr.push(data[i].id);
            }
            layer.confirm(DEL_PROMPT || '确定删除选中的分类？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/complex/news/category/delete';
                ajaxJS(param, {ids: empIdArr}, function (d) {
                    layer.msg(d.msg);
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的分类");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/news_setup/newsClassify/newsClassifyAdd.html", EDIT || '编辑分类', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/news_setup/newsClassify/newsClassifySee.html", SEE || '查看分类', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
