layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
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

    //数据表格初始化
    var tableIns = table.render({
        elem: '#tableList',
        url: interfaceUrl + 'get/complex/integral/record/select',
        method: 'post',
        contentType: "application/json",
        page: {
            layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
            curr: 1,//设定初始在第 5 页
            groups: 10//只显示 1 个连续页码

        },
        limit: 10,
        id: "tableList",
        cols: [[
            {field: 'recNumber', title: STREAM || '流水号', align: 'center'},
            {
                field: 'recMemberHeadImage', title: AVATAR || '会员头像', align: 'center', templet: function (d) {
                    return '<img class="preview" src="' + d.recMemberHeadImage + '" height="56" width="56">';
                }
            },
            {field: 'recMemberName', title: NAME || '会员名称', align: 'center'},
            {field: 'recCount', title: NUM || '积分数量', align: 'center'},
            {
                field: 'recRecordType', title: TYPE || '获取类型', align: 'center', templet: function (d) {
                    if (d.recRecordType === '0') {
                        return FROZEN || '冻结'
                    } else if (d.recRecordType === '1') {
                        return ISSUE || '发放'
                    } else if (d.recRecordType === '2') {
                        return SIGN || '签到'
                    } else if (d.recRecordType === '3') {
                        return INVITE || '邀请'
                    } else if (d.recRecordType === '4') {
                        return SHIFT || '转入'
                    } else {
                        return ROLLOUT || '转出'
                    }
                }
            },
            {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        ]],
        request: {
            pageName: 'pageNum', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            countName: 'total',
            dataName: 'list'
        }
    });


    var recRecordType;
    form.on('radio(recRecordType)', function (data) {
        recRecordType = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            recNumber: $(".recNumber").val(),
            recRecordType: recRecordType,
        });
    });

});

function goLogin() {
    parent.goLogin()
}
