layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');


    $('.cancel').html(CANCEL || '取消');
    $('.classifyname i').html(CLASSIFY || '分类名称');
    $('.isenable').html(ISENABLED || '是否启用');
    $('.magb15 label').html(ISENABLED || '是否启用');
    $('.sequence i').html(SEQUENCE || '分类排序');
    $('.submit').html(SUBMIT || '提交');
    $('.classiamge i').html(IMAGE || '分类图片');
    $('.uploadImg p').html(UPLOAD || '点击上传，或将文件拖拽到此处');
    $('.uploadImgSize').html(ACTBESTPIXEL || '图片最佳尺寸为 <b>190 * 190</b>像素');


    $('.actCategoryName').attr('placeholder', CLASSIFY || '请输入分类名称');
    $('.actSeq').attr('placeholder', SEQUENCE || '请输入分类排序');

    if (lan == '2') {
        $('.actStatus').html(
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="1" title="enabled" checked>' +
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="0" title="disable">'
        );
    } else {
        $('.actStatus').html(
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="1" title="启用" checked>' +
            '<input type="radio" name="actStatus" lay-filter="actStatus" value="0" title="未启用">'
        );
    }
    setTimeout(function () {
        $(".actStatus input[value=" + $(".actStatus").attr('actstatus') + "]").prop("checked", "checked");
        form.render();
    }, 100);


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/activity/category/saveUpdate',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

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
            cogImg = res.data.bigPic[0];

        }
    });

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            actCategoryName: field.actCategoryName,
            actStatus: field.actStatus,
            actSeq: field.actSeq,
            actCategoryImage: $('.showImg img').attr('src'),
        };
        if ($(".sign").val() == "edit") {
            data.id = $(".sign").attr("signid");
        }
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
