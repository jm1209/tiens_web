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
        url: interfaceUrl + 'get/complex/amount/record/select',
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
            {field: 'amoNumber', title: STREAM || '流水号', align: 'center'},
            {
                field: 'amoMemberHeadImage', title: AVATAR || '会员头像', align: 'center', templet: function (d) {
                    return '<img class="preview" src="'+d.amoMemberHeadImage+'" height="56">';
                }
            },
            {field: 'amoMemberName', title: NAME || '会员名称', align: 'center'},
            {field: 'amoAmount', title: MONEY || '金额', align: 'center'},
            {
                field: 'amoRecordType', title: TYPE || '获取类型', align: 'center', templet: function (d) {
                    if (d.recRecordType === '0') {
                        return '充值'
                    } else if (d.recRecordType === '1') {
                        return '提现'
                    } else if (d.recRecordType === '2') {
                        return '收款'
                    } else if (d.recRecordType === '3') {
                        return '付款'
                    } else if (d.recRecordType === '4') {
                        return '冻结'
                    } else {
                        return '发放'
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


    var amoRecordType;
    form.on('select(amoRecordType)', function (data) {
        amoRecordType = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table,form, {
            amoNumber: $(".amoNumber").val(),
            amoRecordType: amoRecordType,
        });
    });

});

function goLogin() {
    parent.goLogin()
}
