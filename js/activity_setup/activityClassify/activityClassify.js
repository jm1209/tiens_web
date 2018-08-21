layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');


    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/activity/category/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/activity/category/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/activity/category/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.classifyname').html(CLASSIFY || '分类名称');
    $('.isenable').html(ISENABLED || '是否启用');
    $('#listBar a').html(EDIT || '编辑');


    $('.actCategoryName').attr('placeholder' , CLASSIFY || '请输入分类名称');

    if(lan == '2'){
        $('.actStatus').html(
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="1" title="enable">' +
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="0" title="disable">');
    }else{
        $('.actStatus').html(
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="1" title="启用">' +
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="0" title="未启用">');
    }
    form.render();

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/activity/category/delete',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };


    //初始化数据表格
    tableInit(table, 'get/complex/activity/category/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'actCategoryName', title: ACTIVITYNAME || '活动名称', align: 'center'},
        {
            field: 'actCategoryImage', title: IMAGE || '活动图片', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.actCategoryImage + '" height="56">';
            }
        },
        {
            field: 'actStatus', title: ISENABLED || '是否启用', align: 'center', templet: function (d) {
                return d.actStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        },
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 100, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑')+ '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看')+ '</a>';
                }
            }
        }
    ]]);


    var actStatus;
    form.on('radio(actStatus)', function (data) {
        actStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            actCategoryName: $(".actCategoryName").val(),
            actStatus: actStatus
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/activity_setup/activityClassify/activityClassifyAdd.html", ADD || "添加活动");
    });

    //封装添加和编辑
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
                    body.find(".actCategoryName").val(edit.actCategoryName);
                    body.find(".actSeq").val(edit.actSeq);
                    body.find(".showImg").show().find('img').attr('src', edit.actCategoryImage);
                    body.find(".upload-wrapper").hide();
                    body.find(".actStatus").attr("actStatus",edit.actStatus );
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
            layer.confirm(DEL_PROMPT || '确定删除选中的活动？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的活动");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/activity_setup/activityClassify/activityClassifyAdd.html", EDIT || '编辑活动', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/activity_setup/activityClassify/activityClassifySee.html", EDIT ||'编辑活动', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
