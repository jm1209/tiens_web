layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var $ = layui.jquery, layer = parent.layer === undefined ? layui.layer : top.layer;


    var param = {jquery: $, layer: layer, url: 'get/complex/integral/stat/select', type: 'post'};

    var lan = localStorage.getItem('language');
    $('.titleleft').html(lan == '1' ? '积分统计' : 'integral statistics');
    $('.week').html(lan == '1' ? '近7天' : '7 days');
    $('.month').html(lan == '1' ? '近30天' : '30 days');
    $('.other').html(lan == '1' ? '其他' : 'other');
    $('.searchBtn').html(SEARCH || '搜索');
    $('.dateNumber').attr('placeholder', lan == '1' ? '自定义天数' : 'custom days');

    $('.frozen').html(FROZEN || '冻结数量');
    $('.grant').html(lan == 2 ? 'grant' : '发放数量');
    $('.sign').html(SIGN || '签到数量');
    $('.invite').html(INVITATION || '邀请数量');
    $('.shiftTo').html(SHIFTTO || '转入数量');
    $('.turnOut').html(TURNOUT || '转出数量');

    getCount(7);

    $('.week').click(function () {
        $('.otherDate').hide();
        if ($(this).attr('class').indexOf('active') != -1) {
            return;
        }
        $(this).addClass('active').siblings().removeClass('active');
        getCount(7)
    });
    $('.month').click(function () {
        $('.otherDate').hide();
        if ($(this).attr('class').indexOf('active') != -1) {
            return;
        }
        $(this).addClass('active').siblings().removeClass('active');
        getCount(30)
    });
    $('.other').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.otherDate').show();
    });
    $('.searchBtn').click(function () {
        getCount($('.dateNumber').val())
    });

    function getCount(date) {
        ajaxJS(param, {pastDay: date}, function (d) {
            var detail = d.data.detail;
            var summary = d.data.summary;

            $('.amountcolor1').html(summary.freezeNumber);
            $('.amountcolor2').html(summary.grantNumber);
            $('.amountcolor3').html(summary.signNumber);
            $('.amountcolor4').html(summary.inviteNumber);
            $('.amountcolor5').html(summary.shiftNumber);
            $('.amountcolor6').html(summary.rollOutNumber);

            drawChart(detail)
        })
    }

    function drawChart(detail) {
        var myChart = echarts.init(document.getElementById('chart'));

        var series = detail.series;

        var colorArr = ['#ffa184', '#89cfff', '#75ddb0', '#75ddb0', '#74dded', '#fad21a'];

        var itemStyle = [
            {normal: {color: '#ffa184', lineStyle: {color: '#ffa184'}}},
            {normal: {color: '#89cfff', lineStyle: {color: '#89cfff'}}},
            {normal: {color: '#75ddb0', lineStyle: {color: '#75ddb0'}}},
            {normal: {color: '#F44D98', lineStyle: {color: '#F44D98'}}},
            {normal: {color: '#74dded', lineStyle: {color: '#74dded'}}},
            {normal: {color: '#fad21a', lineStyle: {color: '#fad21a'}}}
        ];
        for (var i = 0; i < series.length; i++) {
            series[i].itemStyle = itemStyle[i];
        }

        var
            option = {
                title: {
                    text: COUNTINTERGRAL || '积分统计'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    color: ['#ffa184', '#89cfff', '#75ddb0', '#75ddb0', '#74dded', '#fad21a']
                },
                legend: {
                    data: [FROZENNUMBER || '冻结数量', ISSUENUMBER || '发放数量', SIGNNUMBER || '签到数量', INVITENUMBER || '邀请数量',
                        SHIFTNUMBER || '转入数量', ROLLOUTNUMBER || '转出数量'],
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: detail.xaxis.data
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: series
            };

        myChart.setOption(option);
    }
});

function goLogin() {
    parent.goLogin()
}
