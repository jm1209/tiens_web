layui.use(['form', 'layer', "jquery", "upload", "laydate"], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');


    $('.reset').html(RESET || '重置');
    $('.submit').html(SUBMIT || '提交');
    $('.classifyname span').html(CLASSIFY || '分类名称');
    $('.isenable').html(ISENABLED || '是否启用');
    $('.title1 span').html(TITLE || '活动标题');
    $('.jumptype span').html(JUMPTYPE || '跳转类型');
    $('.pageview span').html(POINT || '浏览量');
    $('.shraecount span').html(PAGEVIEW || '转发量');
    $('.pointnumber span').html(SHARE || '点赞量');
    $('.isenabled').html(ISENABLED || '是否启用');
    $('.issettop').html(SETTOP || '是否置顶');
    $('.acttime span').html(TIME || '活动时间');
    $('.actAdress span').html(ACTIVITYADRESS || '活动地址');
    $('.settag span').html(TAGSET || '标签设置');
    $('.desc').html(DIGEST || '活动摘要');
    $('.image span').html(IMAGE || '活动主图');
    $('.details span').html(DETAILS || '活动详情');
    $('.type span').html(TYPE || '活动分类');
    $('.uploadImgSize').html(ACTMAINBESTPIXEL || '最佳尺寸为 <b>690 * 300</b>像素');
    $('.uploadImg p').html(UPLOAD || '处点击上传，或将文件拖拽到此');

    $('.actPageView').attr('placeholder', POINT || '请输入浏览量');
    $('.actTitle').attr('placeholder', TITLE || '请输入活动标题');
    $('.actShareCount').attr('placeholder', PAGEVIEW || '请输入转发量');
    $('.actPointNumber').attr('placeholder', SHARE || '请输入点赞量');
    $('#actTime').attr('placeholder', TIME || '请选择活动时间');
    $('.actDetailUrl').attr('placeholder', ACTIVITYADRESS || '请输入活动详情地址');
    $('.actDescription').attr('placeholder', DIGEST || '请输入摘要内容');


    if (lan == '2') {
        $('.actTargetType').html('' +
            '<option value="">please choose</option>' +
            '<option value="0">rich text</option>' +
            '<option value="1">type of business</option>' +
            '<option value="2">small application</option>' +
            '<option value="3">out connection</option>'
        );

        $('.actStatus').html('' +
            '<input type="radio" name="actStatus" value="1" title="enable" checked>' +
            '<input type="radio" name="actStatus" value="0" title="disable">'
        );

        $('.actIsTop').html('' +
            '<input type="radio" name="actIsTop" value="1" title="sticky" checked>' +
            '<input type="radio" name="actIsTop" value="0" title="common">'
        );
    } else {
        $('.actTargetType').html('' +
            '<option value="">请选择跳转类型</option>' +
            '<option value="0">富文本</option>' +
            '<option value="1">业态</option>' +
            '<option value="2">小程序</option>' +
            '<option value="3">外连接</option>'
        );

        $('.actStatus').html('' +
            '<input type="radio" name="actStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="actStatus" value="0" title="未启用" >'
        );

        $('.actIsTop').html('' +
            '<input type="radio" name="actIsTop" value="1" title="置顶" checked>' +
            '<input type="radio" name="actIsTop" value="0" title="不置顶">'
        );
    }
    form.render();

    form.verify({
        equal: function (value, item) {
            if (parseInt($('.actPageView').val()) < parseInt(value)) {
                return THUMPUPGREATPAGEVIEW || "点赞量不能大于浏览量";
            }
        },
        rt: function (value, item) {
            if (parseInt($('.actPageView').val()) < parseInt(value)) {
                return FORWARDGREATPAGEVIEW || "转发量不能大于浏览量";
            }
        }
    });

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    //初始化select和radio
    setTimeout(function () {
        if ($(".sign").val() == "edit") {
            $('.actTargetType').val($('.actTargetType').attr('acttargettype'));

            $(".actIsTop input[value=" + $('.actIsTop').attr('actIstop') + "]").prop("checked", "checked");
            $(".actStatus input[value=" + $('.actStatus').attr('actstatus') + "]").prop("checked", "checked");
        }
        form.render();
    }, 200);

    laydate.render({
        elem: '#actTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime'
    });

    ue.addListener("ready", function () {
        ue.setContent($('#actDetail').attr('val') || '');
    });

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/activity/category/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.actCategoryId').append('<option value="">' + (TYPE || '请选择分类') + '</option>')
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].actCategoryName + '</option>';
            $('.actCategoryId').append(str)
        }
        $('.actCategoryId').val($('.actCategoryId').attr('actcategoryid'));
        form.render();
    });


    form.on('select(actTargetType)', function (data) {
        listenTargetType(data.value);
    });

    function listenTargetType(data) {
        if (data == '0') {
            $('.typeShow').hide();
            $('.actDetailUrl').attr('lay-verify', '');
            $('.detailShow').show().css('height', '520px');


        } else {
            $('.typeShow').show();
            $('.actDetailUrl').attr('lay-verify', 'required');
            $('.detailShow').hide();
        }
    }

    upload.render({
        elem: '#uploadImg',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        done: function (res, index, upload) {
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('.showImg img').attr('src', res.data.bigPic[0]).attr('smallPic', res.data.smallPic[0]);
            $('.showImg').show();
            $('.upload-wrapper').hide();

        }
    });
    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;

        //获取活动时间并判断
        var actStartTime = $('#actTime').val().split(' - ')[0];
        var actEndTime = $('#actTime').val().split(' - ')[1];

        if (actStartTime == undefined || actEndTime == undefined) {
            top.layer.msg(CHOOSETIME || "请选择时间");
            return false;
        }
        // 判断活动主图
        if ($('.showImg img').attr('src') == undefined && $('.showImg img').attr('smallpic') == undefined) {
            top.layer.msg(UPLOADIMAGE || "请上传活动主图");
            return false;
        }
        //判断活动详情
        if (UE.getEditor('editor').getContent() == '' && field.actTargetType == '0') {
            top.layer.msg(INPUTDETAIL || "请填写活动详情");
            return false;
        }

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
            actCategoryId: field.actCategoryId,
            actTitle: field.actTitle,
            actDescription: $('.actDescription').val(),
            actTargetType: field.actTargetType,
            actDetail: UE.getEditor('editor').getContent(),
            actPageView: field.actPageView,
            actPointNumber: field.actPointNumber,
            actShareCount: field.actShareCount,
            actIsTop: field.actIsTop,
            actStatus: field.actStatus,
            newsShareCount: field.newsShareCount,
            actImageBig: $('.showImg img').attr('src'),
            actImageSmall: $('.showImg img').attr('smallpic'),
            actStartTime: actStartTime,
            actEndTime: actEndTime,
            actKeyword: tagNameArr.join(','),
            actKeyColor: tagColorArr.join(','),
            actDetailUrl: field.actDetailUrl
        };

        param.url = 'get/complex/activity/info/saveUpdate';
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
        $('.showImg').hide();
    });
});
