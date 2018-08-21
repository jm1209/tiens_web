layui.use(['form', 'layer', 'table', 'jquery', 'laydate','upload'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //上架时间选择
    laydate.render({
        elem: '#up',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {


        }
    });
    //下架时间
    laydate.render({
        elem: '#lower',
        range: true,
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {


        }
    });

    //
    upload.render({
        elem: '#breviary',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        done: function (res, index, upload) {
            if (res.code == "30002") {
                layer.msg(LOGINAGAIN || "您的登录信息已过期，请重新登录！");
                setTimeout(function () {
                    parent.goLogin();
                }, 500);
                return;
            }
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('.showImg img').attr('src', res.data.bigPic[0]);
            $('.showImg').show();
            $('.upload-wrapper').hide();
            backImg = res.data.bigPic[0];

        }
    });

    upload.render({
        elem: '.banner',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        done: function (res, index, upload) {
            var img = res.data.bigPic[0];
            var str = '<div class="layui-upload-img">' +
                '      <img src="' + img + '" width="183" height="90">' +
                '      <div class="layui-icon banCloseImg">&#xe640;</div>' +
                '      </div>';
            $('.banBox').append(str);


            $('.banCloseImg').click(function () {
                $(this).parent().remove();
            });
        }
    });

    $('.specList').delegate('.delSpec','click',function () {
        $(this).parents('tr').remove();
    });

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

});

function goLogin() {
    parent.goLogin()
}
