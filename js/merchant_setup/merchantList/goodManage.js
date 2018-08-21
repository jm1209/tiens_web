layui.use(['table','element','jquery','form'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        element  = layui.element ,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //初始化数据表格
    tableInit(table, 'get/complex/advertisement/select', [[
        
        {field: 'advTime', title: TIME || '规格名称', align: 'center'},
        {field: 'advTime', title: TIME || '规格属性', align: 'center'},
        {field: 'advTime', title: TIME || '创建人', align: 'center'},
        {
            field: 'advStatus', title: ISENABLED || '状态', align: 'center', width: 100, templet: function (d) {
                return d.advStatus == '0' ? NOTENABLED || '未启用' : ENABLED || '启用';
            }
        },
        {
            title: HANDLETYPE || '操作', width: 150, fixed: 'right', align: "center", templet: function () {
                if (5) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">' + (SEE || '查看') + '</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">' + (EDIT || '编辑') + '</a>';
                }
            }
        }
    ]]);

});
