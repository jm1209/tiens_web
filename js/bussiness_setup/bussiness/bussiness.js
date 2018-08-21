layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/business/info/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/business/info/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/business/info/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.busname').html(NAME || '业态名称');
    $('.bustype').html(TYPE || '业态类型');
    $('.jumptype').html(JUMPTYPE || '跳转类型');
    $('.isenabled').html(ISENABLED || '是否启用');

    $('.busName').attr('placeholder', BUSNAME || '请输入业态名称');


    if (lan == '2') {
        $('.busType').html(
            '<option value="">please choose</option>' +
            '<option value="1">home page navigation</option>' +
            '<option value="2">reserved mall</option>' +
            '<option value="3">financial module</option>');

        $('.busTargetType').html(
            '<option value="">please choose</option>' +
            '<option value="0">rich text</option>' +
            '<option value="1">bussiness</option>' +
            '<option value="2">mini program</option>' +
            '<option value="3">outconnection</option>'
        );

        $('.adradio').html(
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="0" title="disable">' +
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="1" title="enabled">'
        );
    } else {
        $('.busType').html(
            '<option value="">请选择业态类型</option><option value="1">首页导航</option>' +
            '<option value="2">预留商城</option><option value="3">金融模块</option>'
        );

        $('.busTargetType').html(
            '<option value="">请选择跳转类型</option>' +
            '<option value="0">富文本</option>' +
            '<option value="1">业态</option>' +
            '<option value="2">小程序</option>' +
            '<option value="3">外连接</option>'
        );

        $('.adradio').html(
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="0" title="未启用">' +
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="1" title="启用">'
        );
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

    //初始化数据表格
    tableInit(table, 'get/complex/business/info/select', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'busName', title: BUSNAME || '业态名称', align: 'center'},
        {
            field: 'busLogo', title: BUSLOGO || '业态logo', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.busLogo + '" height="56">';
            }
        }, {
            field: 'busType', title: TYPE || '业态类型', align: 'center', templet: function (d) {
                if (d.busType == '1') {
                    return HOMEPAGENAVIGATION || '首页导航';
                } else if (d.busType == '2') {
                    return RESERVEDMALL || '预留商城';
                } else {
                    return FINANCIALMODULE || '金融模块';
                }
            }
        },

        {
            field: 'busUrl', title: LINKADRESS || '业态链接地址', align: 'center', templet: function (d) {
                if (d.busTargetType == 0) {
                    return ''
                } else {
                    return d.busUrl;
                }
            }
        },
        {field: 'busSort', title: SEQUENCE || '排序', align: 'center'},
        {
            field: 'busStatus', title: ISENABLED || '是否启用', align: 'center', templet: function (d) {
                return d.busStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        },
        {
            title: HANDLETYPE || '操作', width: 120, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑') + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>';
                }
            }
        }
    ]]);

    var busStatus, busTargetType, busType;
    form.on('radio(busStatus)', function (data) {
        busStatus = data.value;
    });
    form.on('select(busTargetType)', function (data) {
        busTargetType = data.value;
    });
    form.on('select(busType)', function (data) {
        busType = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            busName: $(".busName").val(),
            busStatus: busStatus,
            busType: busType,
            busTargetType: busTargetType
        });
    });

    $(".add_btn").click(function () {
        addOrEdit(ADD || "添加业态");
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "bussinessAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {

                    if (edit.busTargetType == 0) {
                        body.find('.bussShow').show();
                        body.find('.linkShow').hide();
                    } else {
                        body.find('.linkShow').show();
                        body.find('.bussShow').hide();
                    }

                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".busName").val(edit.busName);
                    body.find(".busUrl").val(edit.busUrl);
                    body.find(".busSort").val(edit.busSort);
                    body.find(".channelCode").val(edit.channelCode);
                    body.find(".busType").attr('busType', edit.busType);
                    body.find(".busTargetType").attr('busTargetType', edit.busTargetType);
                    body.find(".infDescription").val(edit.infDescription);
                    body.find(".showImg").show().find('img').attr('src', edit.busLogo);
                    body.find(".upload-wrapper").hide();
                    body.find("#busContent").attr('val', edit.busContent);
                    body.find(".channelCode").val(edit.channelCode);
                    body.find(".busStatus").attr("busStatus", edit.busStatus);
                    if (see) {
                        body.find(".see").hide()
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
            layer.confirm(DEL_PROMPT || '确定删除选中的业态？', {
                icon: 3,
                title: MESSAGE || '提示信息',
                btnAlign: 'c'
            }, function (index) {
                param.url = 'get/complex/business/info/delete';
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的业态");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'see') {//查看
            var index = layui.layer.open({
                title: SEE || '查看业态',
                type: 2,
                content: "bussinessSee.html",
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);

                    if (data.busTargetType == 0) {
                        body.find('.bussShow').show();
                        body.find('.linkShow').hide();
                    } else {
                        body.find('.linkShow').show();
                        body.find('.bussShow').hide();
                    }

                    body.find(".sign").val("see").attr("signid", data.id);
                    body.find(".busName").val(data.busName);
                    body.find(".busUrl").val(data.busUrl);
                    body.find(".busSort").val(data.busSort);
                    body.find(".channelCode").val(data.channelCode);
                    body.find(".busType").attr('busType', data.busType);
                    body.find(".busTargetType").attr('busTargetType', data.busTargetType);
                    body.find(".infDescription").val(data.infDescription);
                    body.find(".uploadImg img").attr('src', data.busLogo);
                    body.find("#busContent").attr('val', data.busContent);
                    body.find(".channelCode").val(data.channelCode);
                    body.find(".busStatus").attr("busStatus", data.busStatus);

                    setTimeout(function () {
                        form.render();
                    }, 500);


                    setTimeout(function () {
                        layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        } else if (layEvent === 'edit') { //编辑
            addOrEdit(EDIT || '编辑业态', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}