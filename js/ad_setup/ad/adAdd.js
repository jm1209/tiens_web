layui.use(['form', 'layer', "jquery", "upload", "laydate"], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    setTimeout(function () {
        $(".advStatus input[value=" + $('.advStatus').attr('advstatus') + "]").prop("checked", "checked");
        form.render();
    }, 200)

    form.on('select(advTargetType)', function (data) {
        if (data.value == '1' || data.value == '2' || data.value == '3') {
            $('.adShow').hide();
            $('.link').show();
            $('.advShareCount').attr('lay-verify', '');
            $('.advPointNumber').attr('lay-verify', '');
            $('.advUrl').attr('lay-verify', 'required');
        } else {
            $('.adShow').show();
            $('.link').hide();
            $('.advShareCount').attr('lay-verify', 'required|gt');
            $('.advPointNumber').attr('lay-verify', 'required|equal');
            $('.advUrl').attr('lay-verify', '');
            setTimeout(function () {
                var winHeight = document.body.scrollHeight;
                $('body').css('height', winHeight + 30 + 'px');
            }, 500)
        }
    });
    form.on('select(advType)', function (data) {
        if (data.value == '1') {
            $('.advTimeBox').show();
          $('.advTime').attr('lay-verify', 'required');

            $('.uploadImgSize b').html('750 * 350')
        } else {
            $('.advTime').val('');
            $('.advTimeBox').hide();
            $('.advTime').attr('lay-verify', '');
            $('.uploadImgSize b').html('690 * 300')
        }
    });

    $('.jumptype span').html(JUMPTYPE || '跳转类型');
    $('.type span').html(TYPE || '类型');
    $('.title1 span').html(TITLE || '标题');
    $('.carouseltime span').html(CAROUSELTIME || '轮播时间');
    $('.forward span').html(PAGEVIEW || '转发量');
    $('.thumbup span').html(SHARE || '点赞量');
    $('.read span').html(POINT || '阅读量');
    $('.enabledtime span').html(ENABLETIME || '有效期');
    $('.adadress span').html(LINKADRESS || '链接地址');
    $('.sequence span').html(SEQUENCE || '排序');
    $('.isenabled span').html(ISENABLED || '是否启用');
    $('.details').html(DETAILS || '摘要');
    $('.mainimage span').html(IMAGE || '广告主图');
    $('#uploadImg p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.uploadImgSize').html(ADBESTPIXEL || '图片最佳尺寸为 <b>750 * 350</b>像素');
    $('.submit').html(SUBMIT || '提交');
    $('.reset').html(RESET || '重置');
    $('.content span').html(CONTENT || '内容');

    $('.advTitle').attr('placeholder', INPUTTITLE || '请输入标题');
    $('.advTime').attr('placeholder', TIME || '请输入轮播时间(单位为s)');
    $('.advShareCount').attr('placeholder', INPUTFORWARD || '请输入转发量');
    $('.advPointNumber').attr('placeholder', INPUTJUMPUP || '请输入点赞量');
    $('.advPageView').attr('placeholder', INPUTREAD || '请输入阅读量');
    $('#advValidityDate').attr('placeholder', INPUTDATA || '请选择有效期');
    $('.advUrl').attr('placeholder', INPUTADRESS || '请输入链接地址');
    $('.advSort').attr('placeholder', INPUTSEQUENCE || '请输入排序');
    $('.advAbstract').attr('placeholder', INPUTCONTENT || '请输入内容');

    if (lan == '2') {
        $('.advTargetType').html(
            '<option value="">please choose</option>' +
            '<option value="0">rich text</option>' +
            '<option value="1">external links</option>'
        );

        $('.advType').html(
            '<option value="">please choose</option>' +
            '<option value="1">carousel</option>' +
            '<option value="2">single image</option>'
        );

        $('.advStatus').html(
            '<input type="radio" name="advStatus" value="1" title="enabled" checked>' +
            '<input type="radio" name="advStatus" value="0" title="disable">'
        );
    } else {
        $('.advTargetType').html(
            '<option value="">请选择跳转类型</option>' +
            '<option value="0">富文本</option>' +
            '<option value="1">外部链接</option>'
        );

        $('.advType').html(
            '<option value="">请选择类型</option>' +
            '<option value="1">轮播</option>' +
            '<option value="2">单图</option>'
        );

        $('.advStatus').html(
            '<input type="radio" name="advStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="advStatus" value="0" title="未启用">'
        );
    }
    setTimeout(function () {
        $('.advTargetType').val($('.advTargetType').attr('advtargettype'));
        $('.advType').val($('.advType').attr('advtype'));
        $(".advStatus input[value=" + $('.advStatus').attr('advstatus') + "]").prop("checked", "checked");
        form.render();
    }, 100);

    //开始时间
    laydate.render({
        elem: '#advValidityDate',
        type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn'
    });

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    ue.addListener("ready", function () {
        ue.setContent($('#advContent').attr('val') || '');
    });

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: 'get/complex/advertisement/saveUpdate', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    var backImg;
    upload.render({
        elem: '#uploadImg',
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


    form.verify({
        advSort: function (value) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return ERRORUSERNAME || '用户名不能有特殊字符';
            }
        },
        equal: function (value, item) {
            if (parseInt($('.advPageView').val()) < parseInt(value)) {
                return THUMPUPGREATPAGEVIEW || "点赞量不能大于阅读量";
            }
        },
        rt: function (value, item) {
            if (parseInt($('.advPageView').val()) < parseInt(value)) {
                return FORWARDGREATPAGEVIEW || "转发量不能大于阅读量";
            }
        },
        sort: function (value, item) {
            if (value != '' && !new RegExp("^[0-9]*$").test(value)) {
                return SORTNUMBER || '排序号只能填数字';
            }
        }
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;

        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        if (field.advTargetType == "0") {
            field.advUrl = 'https://www.taobao.com/';
            if (UE.getEditor('editor').getContent() == undefined || UE.getEditor('editor').getContent() == '') {
                top.layer.msg(INPUTCONTENT || "请输入内容");
                return false;
            }
        } else {
            if (!checkUrl(field.advUrl)) {
                top.layer.msg(ERRORLINK || "非法链接地址");
                return false;
            }
        }

        if ((backImg == undefined || backImg == '') && ($('.showImg img').attr('src') == undefined || $('.showImg img').attr('src') == '')) {
            top.layer.msg(UPLOADIMAGE || "请上传广告主图");
            return false;
        }

        var data = {
            advImage: backImg || $('.showImg img').attr('src'),
            advTime: field.advTime || 0,
            advType: field.advType,
            advAbstract: $('.advAbstract').val() || '',
            advContent: UE.getEditor('editor').getContent(),
            advPageView: field.advPageView || 0,
            advPointNumber: field.advPointNumber || 0,
            advShareCount: field.advShareCount || 0,
            advStatus: field.advStatus,
            advValidityDate: $('#advValidityDate').val(),
            advSort: field.advSort || 0,
            advTitle: field.advTitle,
            advTargetType: field.advTargetType,
            advUrl: field.advUrl
        };


        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
            })
        } else {  //新增
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
            })
        }
        return false;
    });

    $('.reset').click(function () {
        ue.setContent('');
        $('.upload-wrapper').show();
        $('.showImg').hide();
        $('.advAbstract').empty();
    });
});

function checkUrl(strUrl) {
    var Expression = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\\.){3}[0-9]{1,3}"                  // IP形式的URL- 199.194.52.184
        + "|"                                              // 允许IP和DOMAIN（域名）
        + "([0-9a-zA-Z_!~*'()-]+\\.)*"                     // 域名- www.
        + "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\\."          // 二级域名
        + "[a-zA-Z]{2,6})"                                         // first level domain- .com or .museum
        + "(:[0-9]{1,4})?"                                 // 端口-
        + "((/?)|"
        + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";

    var objExp = new RegExp(Expression);
    return objExp.test(strUrl);
}