layui.use(['form', 'layer', "jquery", "upload", "laydate"], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer
    var lan = localStorage.getItem('language');


    $('.shopname span').html(SHOPNAME || '店铺名称');
    $('.shopcode span').html(SHOPCODE || '店铺编号');
    $('.phone span').html(PHONE || '手机号');
    $('.shopadress span').html(SHOPADRESS || '店铺地址');
    $('.isenabled span').html(ISENABLED || '是否启用');
    $('.jingweidu span').html(JINGWEIDU || '经纬度');
    $('.shopadress span').html(SHOPADRESS || '联系地址');
    $('.shoppageview span').html(POINT || '浏览量');
    $('.pointnumber span').html(SHARE || '点赞量');
    $('.sharecount span').html(PAGEVIEW || '转发量');
    $('.salltime span').html(SALLTIME || '营业时间');
    $('.shoplogo span').html(SHOPLOGO || '店铺logo');
    $('#uploadImg p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.ewm-wrapper p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.uploadImgSize').html(SHOPBESTPIXEL || '图片最佳尺寸为 <b>200 * 200</b>像素');
    $('.qrcode span').html(QRCODE || '二维码');
    $('.shopimage span').html(IMAGE || '店铺图片');
    $('.view').html(PREVIEW || '预览图：');
    $('.details span').html(DETAILS || '店铺详情');
    $('#shopImage').html(UPLOADMULIMAGE || '多图片上传');
    $('.submit').html(SUBMIT || '提交');
    $('.reset').html(RESET || '重置');
    $('.selectbyprimarykey').html(PRIMARYKEY || '按关键字搜索：');
    $('.leftfight').html(LEFTCLICKFINDLATITUDEANDLONGITUDE || '左击获取经纬度：');


    $('.shopName').attr('placeholder', SHOPNAME || '请输入店铺名称');
    $('.shopCode').attr('placeholder', SHOPCODE || '请输入店铺编号');
    $('.shopMobile').attr('placeholder', PHONE || '请输入手机号');
    $('.shopAddress').attr('placeholder', SHOPADRESS || '请输入店铺地址');
    $('#latAndLon').attr('placeholder', JINGWEIDU || '点击获取经纬度');
    $('.shopMobile').attr('placeholder', PHONE || '请输入联系电话');
    $('.shopAddress').attr('placeholder', SHOPADRESS || '请输入联系地址');
    $('.shopPageView').attr('placeholder', POINT || '请输入浏览量');
    $('.shopPointNumber').attr('placeholder', SHARE || '请输入点赞量');
    $('.shopShareCount').attr('placeholder', PAGEVIEW || '请输入转发量');
    $('#shopBusinessHour').attr('placeholder', SALLTIME || '营业时间');
    $('#tipinput').attr('placeholder', PRIMARYKEY || '请输入关键字进行搜索');

    if (lan == '2') {
        $('.shopStatus').html(
            '<input type="radio" name="shopStatus" value="1" title="enable" checked>' +
            '<input type="radio" name="shopStatus" value="0" title="disable">');
    } else {
        $('.shopStatus').html(
            '<input type="radio" name="shopStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="shopStatus" value="0" title="未启用">');
    }
    form.render();


    $('#latAndLon').click(function () {
        var self = this;
        var index = layer.open({
            title: FINDSHOP || '寻找店铺',
            type: 2,
            area: ["1000px", "600px"],
            content: "html/shop_setup/shopMessage/shopMap.html",
            resize: false,
            btn: [SUBMIT || '确定'],
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.find('#myPageTop').attr('address', $(self).val())
            },
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                layer.close(index);
                $(self).val(body.find('#lnglat').val());
            }
        })
    });


    setTimeout(function () {
        if ($(".sign").val() == "edit") {
            $(".shopStatus input[value=" + $('.shopStatus').attr('shopstatus') + "]").prop("checked", "checked");
        }
        form.render()
    }, 200);

    $('.closeEwm').click(function () {
        $(this).parent('.layui-upload-img').remove()
    });


    form.verify({
        equal: function (value, item) {
            if (parseInt($('.shopPageView').val()) < parseInt(value)) {
                return THUMPUPGREATPAGEVIEW || "点赞量不能大于浏览量";
            }
        },
        rt: function (value, item) {
            if (parseInt($('.shopPageView').val()) < parseInt(value)) {
                return FORWARDGREATPAGEVIEW || "转发量不能大于浏览量";
            }
        },
        telephone: function (value, item) {
            if (!(new RegExp("^[0-9]*-[0-9]*$").test(value) || new RegExp("^[0-9]{11}$").test(value))) {
                return CHECKPHONENUMBER || '请输入正确的手机号';
            }
        }
    });

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/shop/info/saveUpdate',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //开始时间
    laydate.render({
        elem: '#shopBusinessHour',
        type: 'time',
        lang: lan == 2 ? 'en' : 'cn',
        range: true
    });


    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });


    ue.addListener("ready", function () {
        ue.setContent($('#shopDetail').attr('val') || '');
    });


    upload.render({
        elem: '#uploadImg',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        done: function (res, index, upload) {
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('.showImg img').attr('src', res.data.bigPic[0]);
            $('.showImg').show();
            $('.upload-wrapper').hide();

        }
    });

    upload.render({
        elem: '#ewmImg',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        done: function (res, index, upload) {
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            if (res.data.video.length != 0) {
                $('.showImg img').remove();
                $('.showImg').prepend('<video src="' + res.data.video[0] + '" width="100%" height="100%"/>')
            } else {
                $('.ewmImg img').attr('src', res.data.bigPic[0]);
            }
            $('.ewmImg').show();
            $('.ewm-wrapper').hide();

        }
    });

    upload.render({
        elem: '#shopImage',
        url: interfaceUrl + 'get/complex/upload',
        multiple: true,
        field: 'files',
        done: function (res) {
            var img = res.data.bigPic[0];
            var str = '<div class="layui-upload-img">' +
                '      <img src="' + img + '" width="90" height="90">' +
                '      <div class="layui-icon shopCloseImg">&#xe640;</div>' +
                '      </div>';
            $('#shopList').append(str);


            $('.shopCloseImg').click(function () {
                $(this).parent().remove();
            });
        }
    });

    $('.shopCloseImg').click(function () {
        $(this).parent().remove();
    });
    $('.closeEwmImg').click(function (e) {
        var e = e || event;
        e.cancelBubble = true;
        e.stopPropagation();

        $('.ewm-wrapper').show();
        $('.ewmImg').hide().find('img').attr('src', '');
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;


        if ($('.showImg img').attr('src') == undefined || $('.showImg img').attr('src') == '') {
            top.layer.msg(lan == 2 ? 'please upload shop logo' : '请上传店铺logo');
            return false;
        }


        if ($('.ewmImg img').attr('src') == undefined || $('.ewmImg img').attr('src') == '') {
            top.layer.msg(QRCODE || '请上传二维码');
            return false;
        }


        var shopImageArr = [];
        for (var i = 0; i < $('.layui-upload-img').length; i++) {
            shopImageArr.push($('.layui-upload-img').eq(i).find('img').attr('src'));
        }


        if (shopImageArr == undefined || shopImageArr.length < 1) {
            top.layer.msg(UPLOADIMAGE || '请上传店铺图片');
            return false;
        }

        if (UE.getEditor('editor').getContent() == '') {
            top.layer.msg(lan == 2 ? 'please fill in the store details.' : '请填写店铺详情');
            return false;
        }


        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            shopName: field.shopName,
            shopLogo: $('.showImg img').attr('src'),
            shopQrCode: $('.ewmImg img').attr('src'),
            shopImage: shopImageArr,
            shopLongitude: field.latAndLon.split(',')[0],
            shopLatitude: field.latAndLon.split(',')[1],
            shopMobile: field.shopMobile,
            shopAddress: field.shopAddress,
            shopPageView: field.shopPageView || 0,
            shopBusinessHour: $('#shopBusinessHour').val(),
            shopStatus: field.shopStatus,
            shopPointNumber: field.shopPointNumber || 0,
            shopDetail: UE.getEditor('editor').getContent(),
            shopShareCount: field.shopShareCount
        };


        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
        }
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        });
        return false;
    });

    $('.reset').click(function () {
        ue.setContent('');
        $('.tagList').empty();
        $('#shopList').empty();
        $('.upload-wrapper').show();
        $('.ewm-wrapper').show();
        $('.ewmImg').hide().find('img').attr('src', '');
        $('.showImg').hide().find('img').attr('src', '');
    });
});