layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        table = layui.table,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/dataCenter/dictionaries/save') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/dictionaries/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/dataCenter/dictionaries/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '添加');
    $('.delAll_btn span').html(DELETE || '删除');

    $('.screen-key').html(KEY || 'key');
    $('.screen-name').html(ENUMNAME || '枚举名称');
    $('.screen-status').html(STATE || '状态');

    $('.dicKey').attr('placeholder', SEARCHKEY || '请输入key');

    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    if (lan == '2') {
        $('.dradio').html('<input type="radio" name="dicStatus" lay-filter="dicStatus" value="1" title="valid">' +
            '<input type="radio" name="dicStatus" lay-filter="dicStatus" value="0" title="invalid">');
    } else {
        $('.dradio').html('<input type="radio" name="dicStatus" lay-filter="dicStatus" value="1" title="有效">' +
            '<input type="radio" name="dicStatus" lay-filter="dicStatus" value="0" title="无效">');
    }

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/dataCenter/enum/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.enumId').append('<option value="">' + (CHOOSE || '请选择') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].enumName + '</option>';
            $('.enumId').append(str)
        }
        $('.enumId').val($('.enumId').attr('val'));
        form.render();
    });


    tableInit(table, 'get/dataCenter/dictionaries/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'dicKey', title: KEY || 'key', align: 'center'},
        {field: 'dicValue', title: VALUE || '值', align: 'center'},
        {field: 'enumName', title: ENUMNAME || '枚举名称', align: 'center'},
        {field: 'dicDdescription', title: DESCRIPTION || '描述', align: 'center'},
        {field: 'dicSeq', title: SEQUENCE || '序列', align: 'center'},
        {
            field: 'dicStatus', title: STATE || '状态', align: 'center', templet: function (d) {
                if (d.dicStatus == '0') {
                    return INVALID || '无效';
                } else if (d.dicStatus == '1') {
                    return VALID || '有效';
                }
            }
        },
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 100, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var enumId;
    form.on('select(enumId)', function (data) {
        enumId = data.value;
    });

    var dicStatus;
    form.on('radio(dicStatus)', function (data) {
        dicStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            dicKey: $(".dicKey").val(),
            enumId: enumId,
            dicStatus: dicStatus
        });
    });


    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/dictionary/dictionaryAdd.html", ADD || "新增字典");
    });

    //添加和编辑字典
    function addOrEdit(url, title, edit) {
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "550px"],
            content: url,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".dicKey").val(edit.dicKey).attr('disabled', 'true');
                    body.find(".dicValue").val(edit.dicValue);
                    body.find(".dicDdescription").val(edit.dicDdescription);
                    body.find(".dicSeq").val(edit.dicSeq);
                    body.find('.enumId').attr('val', edit.enumId);
                    body.find(".dicStatusRadio").attr("dicStatus", edit.dicStatus);

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
            layer.confirm(NOTDEL || '系统核心数据删除后可能造成不可修复的后果，相关责任将由操作人将承担，请谨慎操作！', {
                icon: 3,
                title: MESSAGE || '提示信息',
                btnAlign: 'c'
            }, function (index) {
                param.url = 'get/dataCenter/dictionaries/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的数据字典");
        }
    });

    //列表操作
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/system_setup/dictionary/dictionaryAdd.html", EDIT || '编辑', data);
        } else if (layEvent === 'see') { //删除
            addOrEdit("html/system_setup/dictionary/dictionarySee.html", SEE || '查看', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
