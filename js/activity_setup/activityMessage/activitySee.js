layui.use(['form', 'layer', "jquery", "upload", "laydate"], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');


    $('.delTag').hide();

    $('.screen span').html(SCREEN || '筛选');
    $('.add_btn span').html(ADD || '新增');
    $('.delAll_btn span').html(DELETE || '删除');
    $('.search_btn').html(SEARCH || '搜索');
    $('.reset').html(RESET || '重置');
    $('.classifyname').html(CLASSIFY || '分类名称');
    $('.isenable').html(ISENABLED || '是否启用');
    $('.title1').html(TITLE || '标题');
    $('.jumptype').html(JUMPTYPE || '跳转类型');

    $('.pageview').html(POINT || '浏览量');
    $('.shraecount').html(PAGEVIEW || '转发量');
    $('.pointnumber').html(SHARE || '点赞量');
    $('.isenabled').html(ISENABLED || '是否启用');
    $('.issettop').html(SETTOP || '是否置顶');
    $('.acttime').html(TIME || '活动时间');
    $('.actAdress label').html(ACTIVITYADRESS || '活动地址');
    $('.settag').html(TAGSET || '标签设置');
    $('.desc').html(DIGEST || '活动摘要');
    $('.image').html(IMAGE || '活动主图');
    $('.details').html(DETAILS || '活动详情');
    $('.uploadImgSize').html(ACTMAINBESTPIXEL || '最佳尺寸为 <b>690 * 300</b>像素');




    if(lan == '2'){
        $('.actTargetType').html(
            '<option value="">please choose</option>' +
            '<option value="0">rich text</option>' +
            '<option value="1">type of business</option>' +
            '<option value="2">small application</option>' +
            '<option value="3">out connection</option>'
        );
        $('.actStatus').html(
            '<input disabled type="radio" value="1" title="enabled" >' +
            '<input disabled type="radio" value="0" title="disable">'
        );
        $('.actIsTop').html(
            '<input disabled type="radio" value="1" title="sticky" >' +
            '<input disabled type="radio" value="0" title="common">'
        );
    }else{
        $('.actTargetType').html(
            '<option value="">请选择跳转类型</option>' +
            '<option value="0">富文本</option>' +
            '<option value="1">业态</option>' +
            '<option value="2">小程序</option>' +
            '<option value="3">外连接</option>'
        );
        $('.actStatus').html(
            '<input disabled type="radio" value="1" title="启用" >' +
            '<input disabled type="radio" value="0" title="未启用">');
        $('.actIsTop').html(
            '<input disabled type="radio" value="1" title="置顶" >' +
            '<input disabled type="radio" value="0" title="不置顶">');


    }
    form.render();

    //初始化select和radio
    setTimeout(function () {
        $('.actTargetType').val($('.actTargetType').attr('acttargettype'));

        $(".actIsTop input[value=" + $('.actIsTop').attr('actIstop') + "]").prop("checked", "checked");
        $(".actStatus input[value=" + $('.actStatus').attr('actstatus') + "]").prop("checked", "checked");
        form.render();
    }, 200);



    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    param.url = 'get/complex/activity/category/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.actCategoryId').append('<option value="">' + (CHOOSE || '请选择分类') + '</option>');
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].actCategoryName + '</option>';
            $('.actCategoryId').append(str);
        }
        $('.actCategoryId').val($('.actCategoryId').attr('actcategoryid'));
        form.render();
    });

    ue.addListener("ready", function () {
        ue.setContent($('#actDetail').attr('val') || '');
        ue.setDisabled()
    });

});
