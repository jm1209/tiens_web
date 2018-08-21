layui.use(['form', "jquery"], function () {
    var form = layui.form, $ = layui.jquery;

    var lan = localStorage.getItem('language');

    $('.jumptype').html(JUMPTYPE || '跳转类型');
    $('.type').html(TYPE || '类型');
    $('.title1').html(TITLE || '标题');
    $('.carouseltime').html(CAROUSELTIME || '轮播时间');

    $('.forward').html(PAGEVIEW || '转发量');
    $('.thumbup').html(SHARE || '点赞量');
    $('.read').html(POINT || '阅读量');

    $('.enabledtime').html(ENABLETIME || '有效期');
    $('.adadress').html(LINKADRESS || '链接地址');
    $('.sequence').html(SEQUENCE || '排序');
    $('.isenabled').html(ISENABLED || '是否启用');
    $('.details').html(DETAILS || '摘要');
    $('.mainimage').html(IMAGE || '广告主图');
    $('.uploadImgSize').html(ADBESTPIXEL || '图片最佳尺寸为 <b>750 * 350</b>像素');
    $('.content').html(CONTENT || '内容');

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
            '<option value="">请选择跳转类型</option>' +
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

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    ue.addListener("ready", function () {
        ue.setContent($('#advContent').attr('val') || '');
        ue.setDisabled();
    });

    setTimeout(function () {
        $(".advStatus input[value=" + $('.advStatus').attr('advstatus') + "]").prop("checked", "checked");
        form.render();
    }, 200)
});
