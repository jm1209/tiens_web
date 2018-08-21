layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    $('.name').html(NAME || '分类名称');
    $('.state').html(STATE || '状态');
    $('.submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');

    $('.categoryName').attr('placeholder', NAME || '请输入分类名称');

    if (lan == '2') {
        $('.categoryStatus').html(
            '<input type="radio" name="categoryStatus" value="1" title="enable" checked>' +
            '<input type="radio" name="categoryStatus" value="0" title="disable">');
    } else {
        $('.categoryStatus').html(
            '<input type="radio" name="categoryStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="categoryStatus" value="0" title="未启用">');
    }
    setTimeout(function () {
        $(".categoryStatus input[value=" + $(".categoryStatus").attr('categorystatus') + "]").prop("checked", "checked");
        form.render();
    }, 100);


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/news/category/saveUpdate',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;

        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            categoryName: field.categoryName,
            categoryStatus: field.categoryStatus,
        };

        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
        }
        ajaxJS(param, data, function (d) {
            top.layer.msg(d.msg);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

        })

        return false;
    })

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});
