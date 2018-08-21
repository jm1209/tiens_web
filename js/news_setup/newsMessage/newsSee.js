layui.use(['form', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery;

    $('.delTag').hide();
    $('.closeImg').hide();

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
    $('.media').html(MEDIA || '媒体文件');
    $('.uploadImg p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.submit').html(SUBMIT || '提交');
    $('.reset').html(RESET || '重置');
    $('.details').html(DETAILS || '资讯详情');

    $('.newsModelType').html(
        '<option value="">' + (lan == 2 ? "please choose" : "请选择") + '</option>' +
        '<option value="0">' + (lan == 2 ? "breviary" : "缩略图") + '</option>' +
        '<option value="1">' + (lan == 2 ? "banner" : "横图") + '</option>' +
        '<option value="2">' + (lan == 2 ? "video" : "视频") + '</option>'
    );
    setTimeout(function () {
        $(".newsModelType").val($('.newsModelType').attr('newsmodeltype'));
    },100);


    

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    ue.addListener("ready", function () {
        ue.setContent($('#newsDetail').attr('val') || '');
        ue.setDisabled()
    });

    param.url = 'get/complex/news/category/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].categoryName + '</option>';
            $('.newsCategoryId').append(str)
        }
        $('.newsCategoryId').val($('.newsCategoryId').attr('val'));
        form.render();
    });
});
