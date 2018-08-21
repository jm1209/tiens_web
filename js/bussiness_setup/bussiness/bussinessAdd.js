layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    $('.isenabled').html(ISENABLED || '是否启用');
    $('.busname span').html(NAME || '业态名称');
    $('.bustype span').html(TYPE || '业态类型');
    $('.jumptype span').html(JUMPTYPE || '跳转类型');
    $('.sequence span').html(SEQUENCE || '排序');
    $('.sourcecode span').html(CHANNELCODE || '来源编号');
    $('.content span').html(CONTENT || '正文');
    $('.uploadImgSize').html(BUSBESTPIXEL || '图片最佳尺寸为 <b>88 * 88</b>像素');
    $('#uploadImg p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(RESET || '重置');
    $('.bussinesslogo span').html(BUSLOGO || '业态logo');
    $('.link span').html(LINKADRESS || '链接地址');

    $('.busName').attr('placeholder', BUSNAME || '请输入业态名称');
    $('.channelCode').attr('placeholder', CHANNELCODE || '请输入编号');
    $('.busSort').attr('placeholder', SEQUENCE || '请输入排序');
    $('.busUrl').attr('placeholder', lan == 2 ? 'please enter a link address.' : '请输入链接地址');


    if (lan == '2') {
        $('.busType').html(
            '<option value="">please choose</option>' +
            '<option value="1">home page navigation</option>' +
            '<option value="2">reserved mall</option>' +
            '<option value="3">financial module</option>'
        );

        $('.busTargetType').html(
            '<option value="">please choose</option>' +
            '<option value="0">rich text</option>' +
            '<option value="1">bussiness</option>' +
            '<option value="2">mini program</option>' +
            '<option value="3">outconnection</option>'
        );

        $('.busStatus').html(
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="1" title="enable" checked>' +
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="0" title="disable">'
        );
    } else {
        $('.busType').html(
            '<option value="">请选择业态类型</option>' +
            '<option value="1">首页导航</option>' +
            '<option value="2">预留商城</option>' +
            '<option value="3">金融模块</option>'
        );

        $('.busTargetType').html(
            '<option value="">请选择跳转类型</option>' +
            '<option value="0">富文本</option>' +
            '<option value="1">业态</option>' +
            '<option value="2">小程序</option>' +
            '<option value="3">外连接</option>'
        );

        $('.busStatus').html(
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="busStatus" lay-filter="busStatus" value="0" title="未启用">'
        );
    }

    form.render()

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/business/info/saveUpdate',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    setTimeout(function () {
        $('.busType').val($('.busType').attr('bustype'));
        $('.busTargetType').val($('.busTargetType').attr('busTargettype'));
        $(".busStatus input[value=" + $('.busStatus').attr('busstatus') + "]").prop("checked", "checked");
        form.render()
    }, 500);

    form.on('select(busTargetType)', function (data) {
        if (data.value == '0') {
            $('.bussShow').show();
            $('.linkShow').hide();
            $('.busUrl').attr('lay-verify', '')
            setTimeout(function () {
                var winHeight = document.body.scrollHeight;
                $('body').css('height', winHeight + 30 + 'px');
            }, 500)
        } else {
            $('.bussShow').hide();
            $('.linkShow').show();
            $('.busUrl').attr('lay-verify', 'required')
        }
    });

    form.on('select(busType)', function (data) {
        if (data.value == '1') {
            $('.bussShow').show();
            $('.bustypeShow').show();
            $('.busName').attr('lay-verify', 'required');
            $('.channelCode').attr('lay-verify', 'required');
            setTimeout(function () {
                var winHeight = document.body.scrollHeight;
                $('body').css('height', winHeight + 30 + 'px');
            }, 500);

            if (lan == '2') {
                $('.busTargetType').html(
                    '<option value="">please choose</option>' +
                    '<option value="0">rich text</option>' +
                    '<option value="1">bussiness</option>' +
                    '<option value="2">mini program</option>' +
                    '<option value="3">outconnection</option>'
                );
            } else {

                $('.busTargetType').html(
                    '<option value="">请选择跳转类型</option>' +
                    '<option value="0">富文本</option>' +
                    '<option value="1">业态</option>' +
                    '<option value="2">小程序</option>' +
                    '<option value="3">外连接</option>'
                );
            }
            form.render()


        } else {
            $('.bussShow').hide();
            $('.bustypeShow').hide();
            $('.busName').attr('lay-verify', '');
            $('.channelCode').attr('lay-verify', '');

            if (lan == '2') {
                $('.busTargetType').html(
                    '<option value="">please choose</option>' +
                    '<option value="1">bussiness</option>' +
                    '<option value="2">mini program</option>' +
                    '<option value="3">outconnection</option>'
                );
            } else {
                $('.busTargetType').html(
                    '<option value="">请选择跳转类型</option>' +
                    '<option value="1">业态</option>' +
                    '<option value="2">小程序</option>' +
                    '<option value="3">外连接</option>'
                );
            }
            form.render()
        }
    });


    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    ue.addListener("ready", function () {
        ue.setContent($('#busContent').attr('val') || '');
        if ($('.sign').val() == 'see') {
            ue.setDisabled();
        }
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

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        debugger


        if (field.busTargetType == '1' && UE.getEditor('editor').getContent() == '') {
            layer.msg(INPUTCONTENT || '请输入正文');
            return false;
        }
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var busUrl = field.busUrl.indexOf('http://') == -1 ? 'http://' + field.busUrl : field.busUrl;

        var data = {
            busName: field.busName,
            busUrl: busUrl,
            busType: field.busType,
            busSort: field.busSort,
            busStatus: field.busStatus,
            channelCode: field.channelCode,
            busTargetType: field.busTargetType,
            busLogo: $('.showImg img').attr('src'),
            busContent: UE.getEditor('editor').getContent()
        };
        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
        }
        ajaxJS(param, data, function (d) {
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        });
        return false;
    });

    $('.cancel').click(function () {
        ue.setContent('');
        $('.upload-wrapper').show();
        $('.showImg').hide().find('img').attr('src', '');
    });
});