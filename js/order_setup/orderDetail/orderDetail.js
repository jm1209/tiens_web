layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {
        jquery: $, layer: layer, url: '', type: 'post',
        language: localStorage.getItem('language') || 1
    };

    //初始化数据表格
    tableInit(table, 'get/complex/business/info/select', [[
        {field: 'busName', title: BUSNAME || '商品编号', align: 'center'},
        {
            field: 'busLogo', title: BUSLOGO || '商品名称', align: 'center', templet: function (d) {
                return '<img class="preview" src="' + d.busLogo + '" height="56">';
            }
        }, {
            field: 'busType', title: TYPE || '商品规格图描述', align: 'center', templet: function (d) {
                if (d.busType == '1') {
                    return HOMEPAGENAVIGATION || '首页导航';
                } else if (d.busType == '2') {
                    return RESERVEDMALL || '预留商城';
                } else {
                    return FINANCIALMODULE || '金融模块';
                }
            }
        },

        {field: 'busUrl', title: LINKADRESS || '规格参数', align: 'center'},
        {
            field: 'busStatus', title: ISENABLED || '单价', align: 'center', templet: function (d) {
                return d.busStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        }
    ]]);

});