layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var logToken = sessionStorage.getItem("logToken");//从本地缓存获取token值

    var powerArr = sessionStorage.getItem('powerArr') ? JSON.parse(sessionStorage.getItem('powerArr')) : [];
    for (var i = 0; i < powerArr.length; i++) {
        if (powerArr[i] == '/get/dataCenter/resource/save') {
            $('.addShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/resource/update') {
            $('.editShow').css('display', 'inline-block');
        }
        if (powerArr[i] == '/get/dataCenter/resource/delete') {
            $('.delShow').css('display', 'inline-block');
        }
    }

    $('.addPage span').html(ADD || '新增');
    $('.editPage span').html(EDIT || '编辑');
    $('.delPage span').html(DELETE || '删除');

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    treeInit();

    function treeInit() {
        param.url = "get/dataCenter/resource/getAll";
        ajaxJS(param, {}, function (d) {
            $('#treeview').treeview({
                data: d.data,
                levels: 1
            });
        });
    }

    $(".addPage").click(function () {
        addOrEdit()
    });

    $(".editPage").click(function () {
        addOrEdit("edit");
    });

    $(".delPage").click(function () {
        del();
    });

    function addOrEdit(edit) {
        var node = $('#treeview').treeview('getSelected');
        if (node.length == 1) {
            var index = layer.open({
                title: RESOURCE || "资源信息",
                type: 2,
                area: ["750px", "580px"],
                content: "html/system_setup/resource/resAdd.html",
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    if (edit) {
                        body.find(".sign").val("edit").attr("signid", node[0].id);
                        body.find(".pid").val(node[0].pid);
                        body.find(".pname").val(node[0].pname);
                        body.find(".name").val(node[0].name);
                        body.find(".euName").val(node[0].euName);
                        body.find(".ptype").val(node[0].ptype);
                        body.find(".url").val(node[0].url);
                        body.find(".icon").val(node[0].icon);
                        body.find(".type").attr('restype', node[0].type);
                        body.find(".remark").val(node[0].description);
                        body.find(".status").attr("status", node[0].status);
                        form.render();
                    } else {
                        body.find(".seq").val(5);
                        body.find(".pid").val(node[0].id);
                        body.find(".pname").val(node[0].name);
                        body.find(".ptype").val(node[0].type);
                    }
                }
            })
        } else {
            layer.msg(CHOOSE_NODE || "请选择一个节点！");
        }
    }

    // 删除操作
    function del() {
        var node = $('#treeview').treeview('getSelected');
        if (node.length == 1) {
            var pid = node[0].pid;
            if (pid == "0" || pid == 0) {
                layer.msg(DEL_NODE || "根节点不允许删除！");
                return false;
            }
            layer.confirm(NOTDEL || '系统核心数据删除后可能造成不可修复的后果，相关责任将由操作人将承担，请谨慎操作！', {icon: 3, title: MESSAGE || '提示信息', btnAlign :'c'}, function (index) {
                delInfo();
            });
        } else {
            layer.msg(CHOOSE_NODE || "请选择一个节点！");
        }
    }

    // 删除请求
    function delInfo() {
        var node = $('#treeview').treeview('getSelected');
        var id = node[0].id;
        param.url = 'get/dataCenter/resource/delete';
        ajaxJS(param, {ids: [id]}, function (d) {
            layer.closeAll('loading');
            layer.msg(d.msg);
            treeInit();
        })
    }
});

function goLogin() {
    parent.goLogin()
}
