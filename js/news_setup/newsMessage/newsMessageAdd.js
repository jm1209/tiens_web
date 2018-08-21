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

    var lan = localStorage.getItem('language');

    $('.classify').html(CLASSIFY || '资讯分类');
    $('.pageView').html(PAGEVIEW || '转发量');
    $('.title1').html(TITLE || '软文标题');
    $('.point').html(POINT || '浏览量');
    $('.share').html(SHARE || '点赞量');
    $('.author').html(AUTHOR || '作者');
    $('.enable').html(ENABLED || '是否启用');
    $('.type').html(TYPE || '模板类型');
    $('.setTop').html(SETTOP || '是否置顶');
    $('.setUp').html(SETUP || '标签设置');
    $('.desc').html(DESCRIBE || '资讯摘要');
    $('.media span').html(MEDIA || '媒体文件');
    $('.uploadImg p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.submit').html(SUBMIT || '提交');
    $('.reset').html(RESET || '重置');
    $('.details').html(DETAILS || '资讯详情');


    $('.newsShareCount').attr('placeholder', PAGEVIEW || '请输入转发量');
    $('.newsPageView').attr('placeholder', POINT || '请输入浏览量');
    $('.newsTitle').attr('placeholder', TITLE || '请输入软文标题');
    $('.newsPointNumber').attr('placeholder', SHARE || '请输入点赞量');
    $('.newsEditor').attr('placeholder', AUTHOR || '请输入作者');
    $('.newsDescription').attr('placeholder', DESCRIBE || '请输入内容');
    $('.uploadImgSize').html(BESTPIXEL || '文件最佳尺寸为 <b>250 * 250</b>像素');

    $('.newsModelType').html(
        '<option value="">' + (lan == 2 ? "please choose" : "请选择") + '</option>' +
        '<option value="0">' + (lan == 2 ? "breviary" : "缩略图") + '</option>' +
        '<option value="1">' + (lan == 2 ? "banner" : "横图") + '</option>' +
        '<option value="2">' + (lan == 2 ? "video" : "视频") + '</option>'
    );

    $('.newsIsTop').append(
        '<input type="radio" name="newsIsTop" value="1" title="' + (SETTOP || '置顶') + '" checked>' +
        '<input type="radio" name="newsIsTop" value="0" title="' + (NOTSETTOP || '不置顶') + '">');

    $('.newsStatus').append(
        '<input type="radio" name="newsStatus" value="1" title="' + (ENABLED || '启用') + '" checked>' +
        '<input id="disableinput" type="radio" name="newsStatus" value="0" title="' + (NOTENABLED || '未启用') + '">');

    setTimeout(function () {
        $(".newsModelType").val($('.newsModelType').attr('newsmodeltype'));

        $(".newsIsTop input[value=" + $('.newsIsTop').attr('newsistop') + "]").prop("checked", "checked");

        $(".newsStatus input[value=" + $('.newsStatus').attr('newsstatus') + "]").prop("checked", "checked");

        form.render();
    }, 100);


    param.url = 'get/complex/news/category/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.newsCategoryId').append('<option value="">' + (CHOOSE || "请选择资讯分类") + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].categoryName + '</option>';
            $('.newsCategoryId').append(str)
        }
        $('.newsCategoryId').val($('.newsCategoryId').attr('val'));
        form.render();
    });

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    ue.addListener("ready", function () {
        ue.setContent($('#newsDetail').attr('val') || '');
    });

    upload.render({
        elem: '#uploadBreviary',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        accept: 'images',
        size: 20000,
        done: function (res, index, upload) {
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('#uploadBreviary .showImg img').attr('src', res.data.bigPic[0]).attr('smallpic', res.data.smallPic[0]);
            $('#uploadBreviary .showImg').show();
            $('#uploadBreviary .upload-wrapper').hide();

        }
    });

    upload.render({
        elem: '#uploadBanner',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        accept: 'images',
        size: 20000,
        done: function (res, index, upload) {
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('#uploadBanner .showImg img').attr('src', res.data.bigPic[0]).attr('smallpic', res.data.smallPic[0]);
            $('#uploadBanner .showImg').show();
            $('#uploadBanner .upload-wrapper').hide();

        }
    });

    upload.render({
        elem: '#uploadVideo',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        accept: 'video',
        size: 20000,
        el: $('#uploadVideo'),
        choose: function () {
            $('#uploadVideo .progress-wrapper').show();
        },
        done: function (res, index, upload) {
            $('#uploadVideo .progress-wrapper').hide();
            layer.msg(res.msg);
            if (res.code !== '0') {
                return;
            }
            $('#uploadVideo video')
                .attr('src', res.data.video[0]).attr('smallpic', res.data.smallPic[0])
                .attr('bigPic', res.data.bigPic[0]);
            $('#uploadVideo .showImg').show();
            $('#uploadVideo .upload-wrapper').hide();
        }
    });

    form.verify({
        equal: function (value, item) {
            if (parseInt($('.newsPageView').val()) < parseInt(value)) {
                return THUMPUPGREATPAGEVIEW || "点赞量不能大于浏览量";
            }
        },
        rt: function (value, item) {
            if (parseInt($('.newsPageView').val()) < parseInt(value)) {
                return FORWARDGREATPAGEVIEW || "转发量不能大于浏览量";
            }
        }
    });

    form.on('select(newsModelType)', function (data) {
        $('.showImg').hide().find('img').attr('src', '');
        $('.showImg').find('img').attr('smallpic', '');
        $('.showImg').find('img').attr('video', '');

        if (data.value == '0') {
            $('.isBreviary').show();
            $('.isBanner').hide();
            $('.isVideo').hide();
            $('.uploadImgSize').html(BESTPIXEL || '文件最佳尺寸为 <b>250 * 250</b>像素');
        } else if (data.value == '1') {
            $('.isBreviary').hide();
            $('.isBanner').show();
            $('.isVideo').hide();
            $('.uploadImgSize').html(TAGGING || '文件最佳尺寸为 <b>690 * 310</b>像素');
        } else if (data.value == '2') {
            $('.isBreviary').hide();
            $('.isBanner').hide();
            $('.isVideo').show();
            $('.uploadImgSize').html(TAGGING || '文件最佳尺寸为 <b>690 * 310</b>像素');
        }
        return false;
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
        if (field.newsModelType == '0') {
            var newsImageBig = $('#uploadBreviary img').attr('src');
            var newsImageSmall = $('#uploadBreviary img').attr('smallpic');
            var newsVideo = '';
            if (newsImageBig == '') {
                layer.msg(lan == 2 ? 'please upload breviary.' : '请上传缩略图');
                return false;
            }
        } else if (field.newsModelType == '1') {
            var newsImageBig = $('#uploadBanner img').attr('src');
            var newsImageSmall = $('#uploadBanner img').attr('smallpic');
            var newsVideo = '';
            if (newsImageBig == '') {
                layer.msg(lan == 2 ? 'please upload banner.' : '请上传横图');
                return false;
            }
        } else if (field.newsModelType == '2') {
            var newsImageBig = $('#uploadVideo video').attr('smallpic');
            var newsImageSmall = $('#uploadVideo video').attr('bigpic');
            var newsVideo = $('#uploadVideo video').attr('src');
            if (newsVideo == '') {
                layer.msg(lan == 2 ? 'please upload video.' : '请上传视频');
                return false;
            }
        }

        var data = {
            newsCategoryId: field.newsCategoryId,
            newsTitle: field.newsTitle,
            newsPageView: field.newsPageView,
            newsPointNumber: field.newsPointNumber,
            newsKeyword: tagNameArr.join(','),
            newsKeyColor: tagColorArr.join(','),
            newsModelType: field.newsModelType,
            newsIsTop: field.newsIsTop,
            newsStatus: field.newsStatus,
            newsShareCount: field.newsShareCount,
            newsImageBig: newsImageBig,
            newsImageSmall: newsImageSmall,
            newsVideo: newsVideo,
            newsDescription: $('.newsDescription').val(),
            newsDetail: UE.getEditor('editor').getContent(),
            newsEditor: field.newsEditor
        };

        param.url = 'get/complex/news/info/saveUpdate';
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
})
;
