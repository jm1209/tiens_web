layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');
    $('.prefix').html(REPLYTO  || '针对');
    $('.suffix').html(NULL || '的回复');
    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/comment/info/reply',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT ||'数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            id: $('.sign').attr('signid'),
            comReplyComment:$('.comReplyComment').val(),
            comReplyStatus:1
        };
        ajaxJS(param, data, function (d) {
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        });
        return false;
    });

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});

function goLogin() {
    parent.goLogin()
}
