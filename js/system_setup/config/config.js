layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        table = layui.table,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/dataCenter/configure/save') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/configure/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/dataCenter/configure/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    var lan = localStorage.getItem('language');

    if (lan == '2') {
        $('.cogStatusRadio').html(
            '<input type="radio" name="cogStatus" lay-filter="cogStatus"  value="1" title="valid">' +
            '<input type="radio" name="cogStatus" lay-filter="cogStatus"  value="0" title="invalid">');
    } else {
        $('.cogStatusRadio').html(
            '<input type="radio" name="cogStatus" lay-filter="cogStatus"  value="1" title="有效">' +
            '<input type="radio" name="cogStatus" lay-filter="cogStatus"  value="0" title="无效">');
    }
    form.render();

    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };
    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');

    $('.screen-name').html(NAME || '配置名称');
    $('.screen-status').html(STATE || '状态');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');

    $('.cogName').attr('placeholder', SEARCHNAME || '请输入配置名称');

    tableInit(table, 'get/dataCenter/configure/select', [[
        {type: "checkbox", width: 50},
        {field: 'cogName', title: NAME || '名称', align: 'center', width: 200},
        {field: 'cogUrl', title: VALUE || 'value', align: 'center'},
        {field: 'cogTypeId', title: KEY || 'key', width: 100, align: 'center',},
        {
            field: 'cogStatus', title: STATE || '状态', align: 'center', width: 100, templet: function (d) {
                if (d.cogStatus == '0') {
                    return INVALID || '无效';
                } else if (d.cogStatus == '1') {
                    return VALID || '有效';
                }
            }
        },
        {field: 'cogRemark', title: DESCRIPTION || '描述', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 120, align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var cogStatus;
    form.on('radio(cogStatus)', function (data) {
        cogStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            cogName: $(".cogName").val(),
            cogStatus: cogStatus,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/config/configAdd.html", ADD || "新增配置");
    });

    //添加和编辑配置
    function addOrEdit(url, title, edit) {
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "650px"],
            content: url,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);

                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id).attr('cogImgType', edit.cogImgType);
                    body.find(".cogUrl").val(edit.cogUrl);
                    body.find(".cogName").val(edit.cogName);
                    body.find(".cogRemark").val(edit.cogRemark);
                    body.find(".cogTypeId").val(edit.cogTypeId);
                    body.find(".cogExtendOne").val(edit.cogExtendOne);
                    body.find(".cogExtendTwo").val(edit.cogExtendTwo);
                    body.find(".cogImgType").attr("cogImgType", edit.cogImgType);
                    body.find(".cogStatus").attr("cogStatus", edit.cogStatus);

                    if (edit.cogImgType == '1') {
                        body.find('.keyText').hide();
                        body.find('.keyImg').show();
                        body.find('.showImg img').attr('src', edit.cogUrl);
                        body.find('.showImg').show();
                        body.find('.upload-wrapper').hide();
                    } else if (edit.cogImgType == '2') {
                        body.find('.keyText').hide();
                        body.find('.keyFile').show();

                        if (edit.cogUrl != null) {
                            body.find('.fileShow').css('display', 'inline-block');
                            body.find('.fileName').html(edit.cogUrl.substr(edit.cogUrl.lastIndexOf('/') + 1));
                            body.find('#cogDown').attr('fileUrl', edit.cogUrl);
                        }
                    }
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
                btnAlign :'c',
            }, function (index) {
                param.url = 'get/dataCenter/configure/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的用户");
        }
    });


    //列表操作
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit("html/system_setup/config/configAdd.html", EDIT || '编辑', data);
        } else if (layEvent === 'see') {
            addOrEdit("html/system_setup/config/configSee.html", SEE || '查看', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
