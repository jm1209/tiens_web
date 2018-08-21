layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };


    param.url = 'get/shopsys/merchant/shop/model';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.shopBusinessHour').append('<option value="">' + (CHOOSE || "请选择运费模板") + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].name + '</option>';
            $('.shopBusinessHour').append(str)
        }
        $('.shopBusinessHour').val($('.shopBusinessHour').attr('shopbusinesshour'));
        form.render();
    });
    $('.shopPointNumber').val(sessionStorage.getItem('loginName'));
    $('.shopShareCount').val(changeDateFormat(new Date().getTime()));


    function changeDateFormat(cellval) {
        if (cellval != null) {
            var date = new Date(cellval);
            date.toLocaleDateString()
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hour = date.getHours() <10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() <10 ? "0" + date.getMinutes() :date.getMinutes();
            return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" +minutes;
        }
    }


    setTimeout(function () {
        ue.addListener("ready", function () {
            ue.setContent($('#shopDetail').attr('val') || '');
        });
    }, 100);


    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });



    upload.render({
        elem: '#event_upload_logo',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        accept: 'images',
        size: 2000,
        done: function (res, index, upload) {
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('#event_upload_logo .showImg').show();
            $('#event_upload_logo .showImg img').attr('src', res.data.bigPic[0]).attr('smallPic', res.data.smallPic[0]);
            $('#event_upload_logo .upload-wrapper').hide();

        }
    });

    upload.render({
        elem: '#event_upload_aptitude',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        accept: 'video,images',
        size: 2000,
        done: function (res, index, upload) {

            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('#event_upload_aptitude .showImg').show();
            $('#event_upload_aptitude .showImg img').attr('src', res.data.bigPic[0]).attr('smallPic', res.data.smallPic[0]);
            $('#event_upload_aptitude .upload-wrapper').hide();
        }
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var tagNameArr = [], tagColorArr = [];
        $('.tagList li').each(function () {
            var index = $(this).attr('style').indexOf('#');
            var colorStr = $(this).attr('style');
            colorStr = colorStr.substr(index, 7);
            tagNameArr.push($(this).find('.tagText').html());
            tagColorArr.push(colorStr)
        });

        var data = {
            name: field.shopName,
            logo: $('#event_upload_logo .showImg img').attr('src'),
            admin: field.latAndLon,
            phone: field.shopMobile,
            aptutudeId: $('#event_upload_aptitude .showImg img').attr('src'),
            introduce: UE.getEditor('editor').getContent(),
            address: field.shopAddress,
            loginAccount:field.shopPointNumber,
            label: tagNameArr.join(','),
            labelColor:tagColorArr.join(','),
            loginDate:field.shopShareCount,
            telemetry: field.shopBusinessHour,
        };

        param.url = 'get/shopsys/merchant/shop/saveUpdate';
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
        $('.upload-wrapper').show();
        $('.showImg').hide().find('img').attr("src", '');
    });
});
