layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('.type').html(TYPE || '软文类型');
    $('.title').html(TITLE || '软文标题');
    $('.desc').html(DIGEST || '软文摘要');
    $('.text span').html(TEXT || '正文');
    $('.submit').html(SUBMIT || '提交');
    $('.reset').html(RESET || '重置');

    $('.infTitle').attr('placeholder', TITLE || '请输入软文标题');
    $('.infDescription').attr('placeholder', ABSTRACT || '请输入内容');


    //实例化编辑器
    var ue = UE.getEditor('editor', {
        initialFrameWidth: "100%",   //初始化宽度
        initialFrameHeight: 400,     //初始化高度
    });

    //当从编辑打开时，给富文本赋值
    ue.addListener("ready", function () {
        ue.setContent($('#infDetail').attr('val') || '');
        if ($(".sign").attr('see') == "see") {
            ue.setDisabled()
        }
    });



    setTimeout(function () {
        param.url = 'get/complex/information/type/getEnum';
        ajaxJS(param, {}, function (d) {
            var data = d.data;
            $('.infTypeId').append('<option value="">' + (CHOOSE || "请选择软文类型") + '</option>');
            for (var i = 0; i < data.length; i++) {
                var str = '<option value="' + data[i].id + '">' + data[i].infTypeName + '</option>';
                $('.infTypeId').append(str)
            }
            $('.infTypeId').val($('.infTypeId').attr('inftypeid'));
            form.render();
        });
    }, 100)

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        if (UE.getEditor('editor').getContent() == '') {
            layer.msg(lan == 2 ? 'the text can not be empty.': '正文不能为空');
            return false;
        }
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            infTypeId: field.infTypeId,
            infTitle: field.infTitle,
            infDescription: $('.infDescription').val(),
            infDetail: UE.getEditor('editor').getContent()
        };

        param.url = 'get/complex/information/saveUpdate';
        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
        }
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        })
        return false;
    });

    $('.reset').click(function () {
        ue.setContent('');
    });
});
