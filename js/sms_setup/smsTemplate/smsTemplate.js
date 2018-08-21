layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/sms/template/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/sms/template/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/sms/template/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.templename').html(NAME || '模板名称');
    $('.type').html(TYPE || '类型');
    $('.isenabled').html(ISENABLED || '是否启用');

    $('.smsTemplatelTitle').attr('placeholder' , NAME || '请输入模板名称');

    if(lan =='2'){
        $('.smsStatus').html('<input type="radio" name="smsStatus" lay-filter="smsStatus" value="1" title="enable">' +
            '<input type="radio" name="smsStatus" lay-filter="smsStatus" value="0" title="disable">');
    }else{
        $('.smsStatus').html('<input type="radio" name="smsStatus" lay-filter="smsStatus" value="1" title="启用">' +
            '<input type="radio" name="smsStatus" lay-filter="smsStatus" value="0" title="未启用">');
    }
    form.render();



    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };


    param.url = 'get/complex/sms/templateEnum/select';
    ajaxJS(param, null, function (d) {
        var data = d.data;
        $('.smsType').append('<option value="">' + (CHOOSE || '请选择类型') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].dicKey + '">' + data[i].dicValue + '</option>';
            $('.smsType').append(str);
        }
        $('.smsType').val($('.smsType').attr('val'));
        form.render();
    });

    //初始化数据表格
    tableInit(table, 'get/complex/sms/template/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'smsTemplatelTitle', title: NAME || '模板名称', align: 'center'},
        {field: 'smsType', title: TYPE || '类型', align: 'center'},
        {
            field: 'smsStatus', title: ISENABLED || '是否启用', align: 'center', templet: function (d) {
                return d.smsStatus == "1" ? ENABLED || "启用" : NOTENABLED || "未启用";
            }
        },
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 100, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑')+ '</a>';
                }else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看')+ '</a>';
                }
            }
        }
    ]]);

    var smsType, smsStatus;
    form.on('select(smsType)', function (data) {
        smsType = data.value;
    });
    form.on('radio(smsStatus)', function (data) {
        smsStatus = data.value;
    });


    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            smsTemplatelTitle: $(".smsTemplatelTitle").val(),
            smsType: smsType,
            smsStatus: smsStatus,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/sms_setup/smsTemplate/smsTemplateAdd.html",ADD || "添加模板");
    });

    //添加和编辑
    function addOrEdit(url,title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
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
                    body.find(".smsTemplatelTitle").val(edit.smsTemplatelTitle);
                    body.find(".smsTemplateContent").val(edit.smsTemplateContent);
                    body.find(".smsType").attr('smsType', edit.smsType);
                    body.find(".smsStatus").attr("smsStatus", edit.smsStatus);
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
            layer.confirm(DEL_PROMPT || '确定删除选中的模板？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                param.url = 'get/complex/sms/template/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的模板");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/sms_setup/smsTemplate/smsTemplateAdd.html",EDIT || '编辑模板', data);
        }else if(layEvent === 'see'){
            addOrEdit("html/sms_setup/smsTemplate/smsTemplateSee.html",SEE || '查看模板', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
