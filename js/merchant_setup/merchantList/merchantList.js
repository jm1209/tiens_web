layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/shopsys/merchant/shop/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/shopsys/merchant/shop/exportMer') {
            $('.importShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/shopsys/merchant/shop/remove') {
            $('.delShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/shopsys/merchant/shop/disabled') {
            $('.merShow').css('display', 'inline-block');
        }

        if (powerArr[i] == '/get/shopsys/merchant/shop/update') {
            isUpdate = true;
        }

    }

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //数据表格渲染
    tableInit(table, 'get/shopsys/merchant/shop/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: 'logo', title:'商家LOGO', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.logo + '" height="56">';
            }
        },
        {field: 'name', title:'商家名称', align: 'center'},
        {field: 'admin', title:'商家管理员', align: 'center'},
        {field: 'phone', title:'联系电话', align: 'center'},
        {
            field: 'disabled', title:'状态', align: 'center', width: 100, templet: function (d) {
                if (d.disabled == '0') {
                    return '禁用';
                } else {
                    return '启用';
                }
            }
        },
        {field: 'createTime', title:'创建时间', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 150, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (lan != "2" ? "编辑" : "edit") + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (lan != "2" ? "查看" : "see") + '</a>';
                }
            }
        }
    ]]);

    var merStatus;
    form.on('radio(merStatus)', function (data) {
        merStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            phone: $(".merPhone").val(),
            name: $(".shopName").val(),
            admin: $(".managerName").val(),
            disabled: merStatus,

        });
    });

    $(".add_btn").click(function () {
        addOrEdit("添加商家");
    });

    //添加和编辑
    function addOrEdit(title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "merchantListAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".shopName").val(edit.name);
                    body.find(".latAndLon").val(edit.admin);
                    body.find(".shopMobile").val(edit.phone);
                    body.find(".shopAddress").val(edit.address);
                    body.find(".shopPointNumber").val(edit.createName);
                    body.find(".shopShareCount").val(edit.createTime);
                    body.find(".shopBusinessHour").attr('shopBusinessHour', edit.telemetry);
                    body.find("#event_upload_logo .showImg img").attr('src', edit.logo);
                    body.find("#event_upload_aptitude .showImg img").attr('src', edit.aptitudeId);
                    body.find('#event_upload_logo .showImg').show();
                    body.find('#event_upload_logo .upload-wrapper').hide();
                    body.find('#event_upload_aptitude .showImg').show();
                    body.find('#event_upload_aptitude .upload-wrapper').hide();

                    body.find("#shopDetail").attr('val', edit.introduce);
                    if(edit.label != ''){
                        var tagNameArr = edit.label.split(',');
                        var tagColorArr = edit.labelColor.split(',');
                        for (var i = 0; i < tagNameArr.length; i++) {
                            var name = tagNameArr[i];
                            var color = tagColorArr[i];
                            editTag(body, name, color)
                        }
                    }
                    setTimeout(function () {
                        form.render();
                    }, 500)
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

    function editTag(body, name, color) {
        var str = ' <li class="tag" style="background-color: ' + color + ';">' +
            '       <img src="../../../images/tag-cover.png">' +
            '       <span class="tagText">' + name + '</span>' +
            '       <i class="delTag">×</i>' +
            '       </li>';
        body.find(".tagList").append(str);

        body.find('.delTag').each(function () {
            $(this).click(function () {
                $(this).parents('.tag').remove()
            });
        });
    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm('确定删除选中的商家？', {icon: 3, title:'提示信息', btnAlign :'c'}, function (index) {
                param.url = '/get/shopsys/merchant/shop/disabled';
                ajaxJS(param, {ids: idArr}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的商家");
        }
    });


    //启动、禁用
    $(".merAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            merEdit_layer("html/merchant_setup/merchantList/merchantListStop.html", "启用/禁用",idArr.join(","));
        } else {
            layer.msg("请先选择数据");
        }

    });
    function merEdit_layer(url, title, idStr) {  //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["300px", "180px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    body.find(".ids").val(idStr);
                    form.render();
            }
        })
    }
    form.on("submit(merEdit)", function (data) {
        var field = data.field;
        var idStr =$(".ids").val();
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            ids: idStr.split(','),
            disabled: field.merStatus,
        };
        param.url = 'get/shopsys/merchant/shop/disabled';
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        })
        return false;
    });

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;
        if (layEvent === 'edit') { //编辑
            addOrEdit('编辑商家', data);
        }
    });


    //导出
    $('.importAll_btn').click(function () {
       if(merStatus == undefined){
           merStatus='';
       }
        var language = localStorage.getItem("language")||'1'
        var form = $("<form>");
        form.attr("style", "display:none");
        form.attr("target", "");
        form.attr("method", "post");
        form.attr("action", interfaceUrl + 'get/shopsys/merchant/shop/exportMer');
        form.append('<input type="hidden" name="phone" value="' + $(".merPhone").val() + '" />')
        form.append('<input type="hidden" name="name" value="' + $(".shopName").val() + '" />')
        form.append('<input type="hidden" name="admin" value="' + $(".managerName").val() + '" />')
        form.append('<input type="hidden" name="disabled" value="' + merStatus + '" />')
        form.append('<input type="hidden" name="language" value="' + language + '" />')
        $("body").append(form);
        form.submit();
    });
});

function goLogin() {
    parent.goLogin()
}