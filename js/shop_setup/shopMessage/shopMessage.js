layui.use(['form', 'layer', 'table', 'jquery', 'layedit',], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    var isUpdate = false;
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/complex/shop/info/saveUpdate') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/complex/shop/info/update') {
            isUpdate = true;
        }
    }

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.shopname').html(SHOPNAME || '店铺名称');
    $('.shopcode').html(SHOPCODE || '店铺编号');
    $('.phone').html(PHONE || '手机号');
    $('.shopadress').html(SHOPADRESS || '店铺地址');

    $('.shopName').attr('placeholder' , SHOPNAME || '请输入店铺名称');
    $('.shopCode').attr('placeholder' , SHOPCODE || '请输入店铺编号');
    $('.shopMobile').attr('placeholder' , PHONE || '请输入手机号');
    $('.shopAddress').attr('placeholder' , SHOPADRESS || '请输入店铺地址');

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //初始化数据表格
    tableInit(table, 'get/complex/shop/info/select', [[
        {field: 'shopName', title: SHOPNAME || '店铺名称', align: 'center'},
        {
            field: 'shopLogo', title: SHOPLOGO || '店铺logo', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.shopLogo + '" height="56">';
            }
        }, {
            field: '', title: JINGWEIDU || '经纬度', align: 'center', templet: function (d) {
                return d.shopLongitude + '-' + d.shopLatitude;
            }
        },

        {field: 'shopMobile', title: PHONE || '联系电话', align: 'center'},
        {field: 'shopAddress', title: SHOPADRESS || '店铺地址', align: 'center'},
        {field: 'shopCode', title: SHOPCODE || '店铺编号', align: 'center'},
        {field: 'shopBusinessHour', title: SALLTIME || '营业时间', align: 'center'},
        {
            field: 'shopStatus', title: ISENABLED || '是否启用', align: 'center', templet: function (d) {
                return d.shopStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        },
        {
            title: HANDLETYPE || '操作', width: 120, fixed: "right", align: "center", templet: function () {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看')+ '</a>' +
                        '   <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑')+ '</a>';
                }else{
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看')+ '</a>';
                }
            }
        }
    ]]);

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            shopName: $(".shopName").val(),
            shopCode: $(".shopCode").val(),
            shopMobile: $(".shopMobile").val(),
            shopAddress: $(".shopAddress").val(),
        });
    });

    $(".add_btn").click(function () {
        addOrEdit(ADD || "添加店铺");
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "shopMessageAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".shopName").val(edit.shopName);
                    body.find(".shopType").val(edit.shopType);
                    body.find(".shopPageView").val(edit.shopPageView);
                    body.find(".shopPointNumber").val(edit.shopPointNumber);
                    body.find(".shopShareCount").val(edit.shopShareCount);
                    body.find("#latAndLon").val(edit.shopLongitude + ',' + edit.shopLatitude);
                    body.find(".shopMobile").val(edit.shopMobile);
                    body.find(".shopAddress").val(edit.shopAddress);
                    body.find(".infDescription").val(edit.infDescription);
                    body.find("#shopDetail").attr('val', edit.shopDetail);
                    body.find(".showImg").show().find('img').attr('src', edit.shopLogo);
                    body.find(".ewmImg").show().find('img').attr('src', edit.shopQrCode);
                    body.find(".upload-wrapper").hide();
                    body.find(".ewm-wrapper").hide();
                    body.find("#shopBusinessHour").val(edit.shopBusinessHour);
                    body.find(".channelCode").val(edit.channelCode);
                    body.find(".shopStatus").attr("shopStatus", edit.shopStatus);
                    for (var i = 0; i < edit.shopImage.length; i++) {
                        var str = '<div class="layui-upload-img">' +
                            '      <img src="' + edit.shopImage[i] + '" width="90" height="90">' +
                            '      <div class="layui-icon shopCloseImg">&#xe640;</div>' +
                            '      </div>';
                        body.find('#shopList').append(str);
                    }
                    setTimeout(function () {
                        form.render();
                    }, 500)
                }
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

    }

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'see') {//查看
            var index = layui.layer.open({
                title: SEE || '查看店铺',
                type: 2,
                content: "shopSee.html",
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);

                    body.find(".shopName").val(data.shopName);
                    body.find(".shopType").val(data.shopType);
                    body.find(".shopPageView").val(data.shopPageView);
                    body.find(".shopPointNumber").val(data.shopPointNumber);
                    body.find(".shopShareCount").val(data.shopShareCount);
                    body.find(".shopLongitude").val(data.shopLongitude);
                    body.find(".shopLatitude").val(data.shopLatitude);
                    body.find(".shopMobile").val(data.shopMobile);
                    body.find(".shopAddress").val(data.shopAddress);
                    body.find(".infDescription").val(data.infDescription);
                    body.find("#shopDetail").attr('val', data.shopDetail);
                    body.find("#uploadImg img").attr('src', data.shopLogo);
                    body.find("#ewmImg img").attr('src', data.shopQrCode);
                    body.find("#shopBusinessHour").val(data.shopBusinessHour);
                    body.find(".channelCode").val(data.channelCode);
                    body.find(".shopStatus").attr("shopStatus", data.shopStatus);
                    debugger
                    for (var i = 0; i < data.shopImage.length; i++) {
                        var str = '<div class="layui-upload-img">' +
                            '      <img src="' + data.shopImage[i] + '" width="90" height="90">';
                        body.find('#shopList').append(str);
                    }
                    form.render();
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
            addOrEdit(EDIT || '编辑店铺', data);
        }
    });
});

function goLogin() {
    parent.goLogin()
}
