layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        element = layui.element,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    //导出
    $('.printing').click(function () {

        var form = $("<form>");
        form.attr("style", "display:none");
        form.attr("target", "");
        form.attr("method", "post");
        form.attr("action", interfaceUrl + 'picture-console/common/file/download');
        form.append('<input type="hidden" name="fileName" value="' + data.fileName + '" />')
        form.append('<input type="hidden" name="fileUrl" value="' + data.fileUrl + '" />')
        form.append('<input type="hidden" name="isOnLine" value="false" />')
        $("body").append(form);
        form.submit();
    });

    laydate.render({
        elem: '.searchTime',
        type: 'date',
        lang: lan == 2 ? 'en' : 'cn',
        range: true
    });

    drawChart('weekChart', 7);
    drawChart('halfChart', 15);
    drawChart('monthChart', 30);

    //数据表格初始化
    tableInit(table, 'get/complex/member/select', [[
        {field: 'memOpenid', title: TIME || '时间', align: 'center'},
        {field: 'memHeadImage', title: '订单总数', align: 'center'},
        {field: 'memNickname', title: SHOPNAME || '商家', align: 'center'},
        {field: 'memGradeName', title: '已处理', align: 'center'},
        {field: 'memPhone', title: '已支付数', align: 'center'},
        {field: 'memStatus', title: '待支付数', align: 'center'},
        {field: 'memInvitationCode', title: '累计金额(元)', align: 'center'},
    ]]);


    function drawChart(id, date) {
        var myChart = echarts.init(document.getElementById(id));

        var option = {
            title: {
                text: date + '日订单指标',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['已付款', '待付款', '作废']
            },
            color: ['#ffa184', '#89cfff', '#75ddb0'],
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '已付款'},
                        {value: 310, name: '待付款'},
                        {value: 234, name: '作废'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };


        myChart.setOption(option);
    }
});

function goLogin() {
    parent.goLogin()
}
