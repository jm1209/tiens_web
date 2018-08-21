layui.use(['form', 'layer', "jquery", "upload", "laydate"], function () {
    var form = layui.form,
        $ = layui.jquery;
    var lan = localStorage.getItem('language');


    $('.shopname').html(SHOPNAME || '店铺名称');
    $('.phone').html(PHONE || '手机号');
    $('.shopadress').html(SHOPADRESS || '店铺地址');
    $('.isenabled').html(ISENABLED || '是否启用');
    $('.latitude').html(LATITUDE || '店铺纬度');
    $('.longitude').html(LONGITUDE || '店铺经度');
    $('.shoppageview').html(POINT || '浏览量');
    $('.pointnumber').html(SHARE || '点赞量');
    $('.sharecount').html(PAGEVIEW || '转发量');
    $('.salltime').html(SALLTIME || '营业时间');
    $('.shoplogo').html(SHOPLOGO || '店铺logo');
    $('.uploadImgSize').html(SHOPBESTPIXEL || '图片最佳尺寸为 <b>200 * 200</b>像素');
    $('.qrcode').html(QRCODE || '二维码');
    $('.shopimage').html(IMAGE || '店铺图片');
    $('.view').html(PREVIEW || '预览图：');
    $('.details').html(DETAILS || '店铺详情');

    

    if(lan == '2'){
        $('.shopisenabled').html('<input disabled type="radio" value="1" title="enable" >' +
            '<input disabled type="radio" value="0" title="disable">');
    }else{
        $('.shopisenabled').html('<input disabled type="radio" value="1" title="启用" >' +
            '<input disabled type="radio" value="0" title="未启用">');
    }
    form.render();


    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    setTimeout(function () {
        $(".shopStatus input[value=" + $('.shopStatus').attr('shopstatus') + "]").prop("checked", "checked");
        form.render()
    }, 200);


    ue.addListener("ready", function () {
        ue.setContent($('#shopDetail').attr('val') || '');
        ue.setDisabled()
    });
});
