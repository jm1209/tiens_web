layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;
    var lan = localStorage.getItem('language');

    $('#valueType').html(TYPE || 'value 类型');
    $('.value').html(VALUE || 'value');
    $('#key').html(KEY || 'key');
    $('#name').html(NAME || '配置名称');
    $('#des').html(DESCRIPTION || '描述');
    $('#columeOne').html(EXTEND_COLUMN_ONE || '扩展字段1');
    $('#columntwo').html(EXTEND_COLUMN_TWO || '扩展字段2');
    $('#status').html(STATE || '配置状态');
    $('#cogUoload').html(UPLOADFILE || '上传文件');
    $('#cogDown').html(DOWN || '下载');
    $('.upload-wrapper p').html(lan == 2 ? 'click upload or drag files to here.' : '点击上传，或将文件拖拽到此处');

    $('.cogUrl').attr('placeholder', CREATE_VALUE || '请输入value');
    $('.cogTypeId').attr('placeholder', CREATE_KEY || '请输入key');
    $('.cogName').attr('placeholder', CREATE_NAME || '请输入配置名称');
    $('.cogRemark').attr('placeholder', CREATE_DES || '请输入描述');

    $('#submit').html(SUBMIT || '提交');
    $('.cancel').html(CANCEL || '取消');



    if (lan == '2') {
        $('.cogImgType').html('' +
            '<option value="0">text</option>' +
            '<option value="1">images</option>' +
            '<option value="2">file</option>' +
            '');

        $('.cogStatus').html(
            '<input type="radio" name="cogStatus" value="1" title="valid" checked>' +
            ' <input type="radio" name="cogStatus" value="0" title="invalid">');
    } else {
        $('.cogImgType').html('' +
            '<option value="0">文本</option>' +
            '<option value="1">图片</option>' +
            '<option value="2">文件</option>' +
            '');

        $('.cogStatus').html(
            '<input type="radio" name="cogStatus" value="1" title="有效" checked>' +
            '<input type="radio" name="cogStatus" value="0" title="无效">');
    }
    setTimeout(function () {
        $('.cogImgType').val($('.cogImgType').attr('cogImgType') || '0');
        $(".cogStatus input[value=" + $(".cogStatus").attr('cogstatus') + "]").attr("checked", "checked");
        form.render();
    }, 100)


    //全局设置ajax请求参数
    var param = {
        jquery: $,
        layer: layer,
        url: '',
        type: 'post',
        language: localStorage.getItem('language') || 1
    };

    var keyType;
    form.on('select(cogImgType)', function (data) {
        if (data.value == '1') {
            $('.keyText').hide();
            $('.keyImg').show();
            $('.keyFile').hide();
            keyType = 'img';
            $('.sign').attr('cogimgtype', '1');
        } else if (data.value == '2') {
            $('.keyText').hide();
            $('.keyFile').show();
            $('.keyImg').hide();
            keyType = 'file';
            $('.sign').attr('cogimgtype', '2');
        } else {
            $('.keyImg').hide();
            $('.keyText').show();
            $('.keyFile').hide();
            keyType = 'text';
            $('.sign').attr('cogimgtype', '0');
        }
    });


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

    upload.render({
        elem: '#cogUoload',
        url: interfaceUrl + 'get/complex/upload',
        field: 'files',
        accept: 'file',
        done: function (res, index, upload) {
            var result = res.data.bigPic[0];
            $('.fileShow').css('display', 'inline-block');
            $('.fileName').html(result.substr(result.lastIndexOf('/') + 1));
            $('#cogDown').attr('fileUrl', result);
        }
    });

    $('#cogDown').click(function () {
        var fileUrl = $(this).attr('fileurl');
        var form = $("<form>");
        form.attr("style", "display:none");
        form.attr("target", "");
        form.attr("method", "post");
        form.attr("action", interfaceUrl + 'get/complex/download');
        form.append('<input type="hidden" name="fileUrl" value="' + fileUrl + '"/>');
        form.append('<input type="hidden" name="isZip" value="false"/>');
        $("body").append(form);
        form.submit();
    });


    param.url = 'get/dataCenter/role/getEnum';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        for (var i = 0; i < data.length; i++) {
            var str = ' <option value="' + data[i].id + '">' + data[i].roleName + '</option>';
            $('.enumId').append(str)
        }
        $('.enumId').val($('.enumId').attr('val'));
        form.render();
    });

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg(DATASUBMIT || '数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            cogUrl: field.cogUrl,
            cogName: field.cogName,
            cogRemark: field.cogRemark,
            cogTypeId: field.cogTypeId,
            cogExtendOne: field.cogExtendOne,
            cogExtendTwo: field.cogExtendTwo,
            cogStatus: field.cogStatus,
            cogImgType: '0'
        };

        if (keyType == 'img' || $('.sign').attr('cogimgtype') == '1') {
            data.cogUrl = $('.showImg img').attr('src');
            data.cogImgType = '1';
            if (data.cogUrl == undefined) {
                layer.msg(PLEASEUPLOAD || '请上传图片')
                return false;
            }
        } else if (keyType == 'file' || $('.sign').attr('cogimgtype') == '2') {
            data.cogUrl = $('#cogDown').attr('fileurl');
            data.cogImgType = '2';
            if (data.cogUrl == undefined) {
                layer.msg(PLEASEUPLOAD || '请上传文件')
                return false;
            }
        }

        if ($(".sign").val() == "edit") {  //编辑
            data.id = $(".sign").attr("signid");
            param.url = 'get/dataCenter/configure/update';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload(); //刷新父页面

            })
        } else {  //新增
            param.url = 'get/dataCenter/configure/save';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        }
        return false;
    });

    $(".cancel").click(function () {
        layer.closeAll("iframe");
    });
});
