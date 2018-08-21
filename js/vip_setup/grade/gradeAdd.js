layui.use(['form', 'layer', "jquery", 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    $('.cancel').html(CANCEL || '取消');
    $('#submit').html(SUBMIT || '提交');

    $('#growth').html(GROWTH || '成长值');
    $('#levelName').html(MEMLEVELNAME || '等级名称');
    $('#level').html(MEMLEVEL || '会员等级');
    $('#levelPic').html(MEMLEVELPIC || '等级图片');

    $('.graName').attr('placeholder', CREATE_LEVEL_NAME || '请输入等级名称');
    $('.graGrade').attr('placeholder', CREATE_LEVEL || '请输入会员等级');
    $('.graGrowth').attr('placeholder', CREATE_LEVEL_GROUTH || '请输入成长值');

    $('.uploadImgSize').html(PICSIZE || '图片最佳尺寸为 <b>120 * 120</b>像素');
    $('.upload-wrapper p').html(UPLOAD || '点击上传，或将文件拖拽到此处');

    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: 'get/complex/grade/info/saveUpdate',
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

        }
    });


    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        if ($('.showImg img').attr('src') == '') {
            layer.msg(lan == 2 ? 'Please upload hierarchical pictures.' : '请上传等级图片');
            return false;
        }

        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            graGrowth: field.graGrowth,
            graName: field.graName,
            graGrade: field.graGrade,
            graImage: $('.showImg img').attr('src'),
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        } else {  //新增
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        }
        return false;
    });

    $(".cancel").click(function () {
        layer.closeAll("iframe");
    });
});
