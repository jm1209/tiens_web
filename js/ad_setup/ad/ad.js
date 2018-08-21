layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/advertisement/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/advertisement/update') {
            isUpdate = true;
        }
        if (powerArr[i] == '/get/complex/advertisement/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.adtype').html(TYPE || '类型');
    $('.adtime').html(TIME || '时间');
    $('.isenabled').html(ISENABLED || '是否启用');
    $('.adsee').html(SEE || '查看');
    $('.adedit').html(EDIT || '编辑');


    $('#validityDate').attr('placeholder', SEARCHTIME || '请选择时间范围');


    if (lan == '2') {
        $('.advType').html(
            '<option value="">please choose</option>' +
            '<option value="1">carousel</option>' +
            '<option value="2">single image</option>'
        );

        $('.adradio').html(
            '<input type="radio" name="advStatus" lay-filter="advStatus" value="1" title="enabled">' +
            '<input type="radio" name="advStatus" lay-filter="advStatus" value="0" title="disable">'
        );
    } else {
        $('.advType').html(
            '<option value="">请选择类型</option>' +
            '<option value="1">轮播</option><option value="2">单图</option>'
        );

        $('.adradio').html(
            '<input type="radio" name="advStatus" lay-filter="advStatus" value="1" title=" 启用">' +
            '<input type="radio" name="advStatus" lay-filter="advStatus" value="0" title="未启用">'
        );
    }
    form.render();


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/advertisement/delete',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //初始化数据表格
    tableInit(table, 'get/complex/advertisement/select', [[
        {type: "checkbox", width: 50},
        {
            field: 'advImage', title: IMAGE || '图片', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.advImage + '" height="56">';
            }
        },
        {field: 'advTime', title: TIME || '轮播时间', align: 'center'},
        {
            field: 'advUrl', title: LINKADRESS || '链接地址', align: 'center', templet: function (d) {
                if(d.advTargetType == 0){
                    return ''
                }else{
                    return d.advUrl;
                }
            }
        },
        {
            field: 'advType', title: TYPE || '类型', align: 'center', width: 100, templet: function (d) {
                if (d.advType == '1') {
                    return CAROUSEL || '轮播'
                } else {
                    return SIMPLEGRAPH || '单图'
                }
            }
        },
        {
            field: 'advStatus', title: ISENABLED || '是否启用', align: 'center', width: 100, templet: function (d) {
                return d.advStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        },
        {field: 'advValidityDate', title: VALIDITY || '有效期', align: 'center'},
        {field: 'advSort', title: SEQUENCE || '排序', align: 'center'},
        {
            title: HANDLETYPE || '操作', width: 150, fixed: 'right', align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑') + '</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>';
                }
            }
        }
    ]]);

    var advType, advStatus, validityStartDate, validityEndDate;
    form.on('select(advType)', function (data) {
        advType = data.value;
    });
    form.on('radio(advStatus)', function (data) {
        advStatus = data.value;
    });

    laydate.render({
        elem: '#validityDate',
        range: true, type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {
            validityStartDate = value.split(' - ')[0];
            validityEndDate = value.split(' - ')[1];

        }
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            advType: advType,
            advStatus: advStatus,
            validityStartDate: validityStartDate,
            validityEndDate: validityEndDate,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit(ADDAD || "添加广告位");
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "adAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    if (edit.advType == '2') {
                        body.find(".advTimeBox").hide();
                    }
                    if (edit.advTargetType == '1') {
                        body.find('.adShow').hide();
                        body.find('.link').show();
                    }
                    body.find(".advUrl").val(edit.advUrl);
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".advTime").val(edit.advTime);
                    body.find(".advType").attr('advType', edit.advType);
                    body.find(".advTargetType").attr('advTargetType', edit.advTargetType);
                    body.find(".advTitle").val(edit.advTitle);
                    body.find(".advPageView").val(edit.advPageView);
                    body.find(".advPointNumber").val(edit.advPointNumber);
                    body.find(".advShareCount").val(edit.advShareCount);
                    body.find(".advSort").val(edit.advSort);
                    body.find(".advAbstract").text(edit.advAbstract);
                    body.find("#advContent").attr('val', edit.advContent);
                    body.find("#advValidityDate").val(edit.advValidityDate);
                    body.find(".advStatus").attr("advStatus", edit.advStatus);
                    body.find(".showImg").show().find('img').attr('src', edit.advImage);
                    body.find(".upload-wrapper").hide();
                    if (edit.advType == '2') {
                        body.find('.uploadImgSize b').html('690 * 300')
                    }
                    form.render();


                }
                setTimeout(function () {
                    layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3,
                        time: 5000
                    });
                }, 500)
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
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
            layer.confirm(DEL_PROMPT || '确定删除选中的广告位？', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                ajaxJS(param, {ids: idArr}, function (d) {
                    location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择需要删除的广告位");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit(EDITAD || '编辑广告位', data);
        } else if (layEvent === 'see') {
            var index = layui.layer.open({
                title: SEEAD || '查看广告位',
                type: 2,
                content: "adSee.html",
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    if (data.advType == '2') {
                        body.find(".advTimeBox").hide();
                    }
                    if (data.advTargetType == '1') {
                        body.find('.adShow').hide();
                        body.find('.link').show();
                    }
                    body.find(".advUrl").val(data.advUrl);
                    body.find(".advTime").val(data.advTime);
                    body.find(".advType").attr('advType',data.advType);
                    body.find(".advTargetType").attr('advTargetType',data.advTargetType);
                    body.find(".advTitle").val(data.advTitle);
                    body.find(".advPageView").val(data.advPageView);
                    body.find(".advPointNumber").val(data.advPointNumber);
                    body.find(".advShareCount").val(data.advShareCount);
                    body.find(".advSort").val(data.advSort);
                    body.find(".advAbstract").val(data.advAbstract);
                    body.find("#advContent").attr('val', data.advContent);
                    body.find(".advValidityDate").val(data.advValidityDate);
                    body.find(".advStatus").attr("advStatus", data.advStatus);
                    body.find(".uploadImg img").attr('src', data.advImage).show();
                    if (data.advType == '2') {
                        body.find('.uploadImgSize b').html('690 * 300')
                    }

                    form.render();


                    setTimeout(function () {
                        layui.layer.tips(RETURN || '点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3,
                            time: 5000
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
    });
});

function goLogin() {
    parent.goLogin()
}
function showImg(src) {
    parent.showImg(src)
}
