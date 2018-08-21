layui.use(['layer', 'jquery'], function () {
    var $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var logToken = sessionStorage.getItem("logToken");//从本地缓存获取token
    var roleId = UrlParm.parm("roleId");//从链接地址获取roleId

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    $('.grant_title i').html(NAME || '角色名称');
    $('#allChoose').html(CHOOSE_ALL || '全选');
    $('#backChoose').html(SELECTINVERT || '反选');
    $('#cancelChoose').html(CANCEL || '取消全选');
    $('#grantBtn').html(SUBMIT || '提交');
    $('#cancel').html(CANCEL || '取消');

    var setting = {
        async: {
            enable: true,
            type: "post",
            contentType: "application/json",
            url: interfaceUrl + "get/dataCenter/resource/getByRole?roleId=" + roleId,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json'
        },
        check: {
            enable: true
        }
    };
    $.fn.zTree.init($("#tree"), setting);
    var treeObj = $.fn.zTree.getZTreeObj("tree");

    //全选
    var isAll = false;
    $('#allChoose').click(function () {
        treeObj.checkAllNodes(true);
        isAll = true;
    });
    //取消全选
    $('#cancelChoose').click(function () {
        treeObj.checkAllNodes(false);
    });

    //反选
    $('#backChoose').click(function () {
        function filter(node) {
            return (node.checked == false);
        }
        var treeArr = treeObj.getNodesByFilter(filter);
        if(treeArr.length == 0){
            treeObj.checkAllNodes(false);
        }else{
            var nodes = treeObj.getCheckedNodes(true);
            treeObj.checkAllNodes(true);
            for (var i = 0; i < nodes.length; i++) {
                if(nodes[i].level != 0 && nodes[i].level != 1 ){
                    treeObj.checkNode(nodes[i], false);
                }
            }
        }
        isAll = false;
    });

    $("#grantBtn").click(function () {
        var nodes = treeObj.getCheckedNodes(true);
        var values = [];
        for (var i = 0; i < nodes.length; i++) {
            values.push(nodes[i].id);
        }
        param.url = 'get/dataCenter/role/authorization';
        ajaxJS(param, {id: roleId, resourceIds: values}, function (d) {
            if (d.code = "200") {
                top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            } else {
                layer.msg(d.msg)
            }
        })
    });

    $("#cancel").click(function () {
        layer.closeAll("iframe");
    });
});

function goLogin() {
    parent.goLogin()
}

