layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate;
    var lan = localStorage.getItem('language');


    $('.logScreen span').html(SCREEN || '筛选');

    $('.screen-ip').html(IP || 'IP地址');
    $('.screen-interface').html(INTERFACE || '请求接口');
    $('.screen-logTime').html(REQUESTTIME || '请求时间');
    $('.screen-ordType').html(REQUESTTYPE || '请求类型');
    $('.record').html(RECORD || '记录日志');
    $('.third').html(THIRD || '第三方接口请求日志');
    $('.error').html(ERROR || '异常信息日志');

    $('.ordIp').attr('placeholder', SEARCHIP || '请输入IP地址');
    $('.ordUrl').attr('placeholder', SEARCHINTERFACE || '请输入请求接口');
    $('.logTime').attr('placeholder', SEARCHTIME || '请选择时间范围');


    $('.log_btn').html(SEARCH || '搜索');
    $('.logReset').html(RESET || '重置');

    if(lan =='2'){
        $('.ordType').html(
            '<option value="">please choose</option>' +
            '<option value="1">APP</option>' +
            '<option value="2">PC</option>' +
            '<option value="3">H5</option>'
        );

        $('.httpType').html(
            '<option value="" >please choose</option>' +
            '<option value="1">通联</option>' +
            '<option value="2">中台</option>' +
            '<option value="3">业态</option>' +
            '<option value="4">极光</option>' +
            '<option value="5">梦网</option>')
        ;

        $('.logType').html(
            '<option value="">please choose</option>' +
            '<option value="1">APP</option>' +
            '<option value="2">PC</option>' +
            '<option value="3">H5</option>'
        );

    }else{
        $('.ordType').html(
            '<option value="" selected>请选择</option>' +
            '<option value="1">APP</option>' +
            '<option value="2">PC</option>' +
            '<option value="3">H5</option>'
        );

        $('.httpType').html(
            '<option value="" >请选择</option>' +
            '<option value="1">通联</option>' +
            '<option value="2">中台</option>' +
            '<option value="3">业态</option><' +
            'option value="4">极光</option>' +
            '<option value="5">梦网</option>'
        );

        $('.logType').html(
            '<option value="">请选择</option>' +
            '<option value="1">APP</option>' +
            '<option value="2">PC</option>' +
            '<option value="3">H5</option>'
        );

    }
    form.render();



    /********************************************记录日志************************************************/
    tableIns('#recordLog', 'get/dataCenter/log/ordinary/select', [[
        {field: 'ordIp', title: IP || 'IP地址', align: 'center'},
        {field: 'ordUrl', title: INTERFACE || '请求接口', align: 'center'},
        {field: 'ordName', title: INTERFACENAME || '接口名称', align: 'center'},
        {
            field: 'ordType', title: REQUESTTYPE || '请求类型', align: 'center', templet: function (d) {
                if (d.ordType == '1') {
                    return 'APP';
                }
                else if (d.ordType == '2') {
                    return 'PC';
                } else if (d.ordType == '3') {
                    return 'H5';
                }
                else {
                    return '';
                }
            }
        },
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        // {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
    ]])
    ;

    var logDown = true;
    $('.logScreen').click(function () {
        $('.layui-layer-content').remove();
        if (logDown) {
            $('.logScreen-wrapper').stop().slideDown();
            logDown = !logDown;
            $('.logScreen span').html(ROLLUP || '收起')
        } else {
            $('.logScreen-wrapper').stop().slideUp();
            logDown = !logDown;
            $('.logScreen span').html(SCREEN || '筛选')
        }
    });

    var ordType, logStart, logEnd;
    form.on('select(ordType)', function (data) {
        ordType = data.value;
    });

    laydate.render({
        elem: '#logTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime',
        done: function (value) {
            logStart = value.split(' - ')[0];
            logEnd = value.split(' - ')[1];

        }
    });

//搜索
    $(".log_btn").on("click", function () {
        table.reload("recordLog", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                ip: $('.ordIp').val(),
                url: $('.ordUrl').val(),
                ordType: ordType,
                createStartTime: logStart,
                createEndTime: logEnd,
            }
        });
        $('.logScreen-wrapper').stop().slideUp();
        logDown = true;
        $('.logScreen span').html(SCREEN || '筛选')
    });
    $(".logReset").on("click", function () {
        $('.logScreen-wrapper input').val('');
        $('.logScreen-wrapper select').val('');
        ordType = '';
        logStart = '';
        logEnd = '';
        form.render();
        table.reload("recordLog", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                ip: '',
                url: '',
                ordType: '',
                createStartTime: '',
                createEndTime: '',
            }
        });
        $('.logScreen-wrapper').stop().slideUp();
        logDown = true;
        $('.logScreen span').html(SCREEN || '筛选')
    });

    /********************************************第三方接口请求日志************************************************/
    $('.thirdLogScreen span').html(SCREEN || '筛选');

    $('.screen-thirdInterface').html(INTERFACE || '请求接口')
    $('.screen-thirdStatus').html(STATUSCODE || '状态码')
    $('.screen-thridRequest').html(REQUESTTIME || '请求时间')
    $('.screen-thirdResponse').html(RESPONSETIME || '返回时间')
    $('.screen-service').html(SERVICE || '服务商')

    $('.httpUrl').attr('placeholder', SEARCHINTERFACE || '请输入接口地址')
    $('.httpCode').attr('placeholder', STATUSCODE || '请输入状态码')
    $('#httpRequestTime').attr('placeholder', SEARCHTIME || '请选择时间范围')
    $('#httpResponseTime').attr('placeholder', SEARCHTIME || '请选择时间范围')

    $('.thirdLog_btn').html(SEARCH || '搜索')
    $('.thirdReset').html(RESET || '重置')

    tableIns('#thirdLog', 'get/dataCenter/log/http/select', [[
        {field: 'httpUrl', title: INTERFACE || '请求接口', align: 'center'},
        {field: 'httpMethod', title: REQUESTMETHOD || '请求方式', align: 'center'},
        {field: 'httpRequestTime', title: REQUESTTIME || '请求时间', align: 'center'},
        {field: 'httpResponseTime', title: RESPONSETIME || '返回时间', align: 'center'},
        {field: 'httpCode', title: SEARCHSTATUSCODE || '状态码', align: 'center'},
        // {field: 'httpConsumingTime', title: '请求耗时', align: 'center'},
        {field: 'httpRequest', title: REQUEST || '入参', align: 'center'},
        {field: 'httpResponse', title: RESPONSE || '返回参数', align: 'center'},
        {
            field: 'httpType', title: SERVICE || '服务商', align: 'center', templet: function (d) {
                if (d.httpType == '1') {
                    return '通联';
                } else if (d.httpType == '2') {
                    return '中台';
                } else if (d.httpType == '3') {
                    return '业态';
                } else if (d.httpType == '4') {
                    return '极光';
                }
                else if (d.httpType == '5') {
                    return '梦网';
                } else {
                    return '';
                }
            }
        },
        // {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
    ]]);

    var thirdLogDown = true;
    $('.thirdLogScreen').click(function () {
        $('.layui-layer-content').remove();
        if (thirdLogDown) {
            $('.thirdLogScreen-wrapper').stop().slideDown();
            thirdLogDown = !thirdLogDown;
            $('.thirdLogScreen span').html(ROLLUP || '收起')
        } else {
            $('.thirdLogScreen-wrapper').stop().slideUp();
            thirdLogDown = !thirdLogDown;
            $('.thirdLogScreen span').html(SCREEN || '筛选')
        }
    });

    var httpType;
    form.on('select(httpType)', function (data) {
        httpType = data.value;
    });

    laydate.render({
        elem: '#httpRequestTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime'
    });

    laydate.render({
        elem: '#httpResponseTime',
        range: true,
        lang: lan == 2 ? 'en' : 'cn',
        type: 'datetime'
    });

//搜索
    $(".thirdLog_btn").on("click", function () {
        var thirdLogStart = $('#httpRequestTime').val().split(' - ')[0];
        var thirdLogEnd = $('#httpRequestTime').val().split(' - ')[1] || '';
        var responseLogStart = $('#httpResponseTime').val().split(' - ')[0];
        var responseLogEnd = $('#httpResponseTime').val().split(' - ')[1] || '';

        table.reload("thirdLog", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                url: $('.httpUrl').val(),
                httpCode: $('.httpCode').val(),
                httpType: httpType,
                requestStartTime: thirdLogStart,
                requestEndTime: thirdLogEnd,
                reponseStartTime: responseLogStart,
                responseEndTime: responseLogEnd
            }
        });
        $('.thirdLogScreen-wrapper').stop().slideUp();
        thirdLogDown = true;
        $('.thirdLogScreen span').html(SCREEN || '筛选')
    });


    $('.thirdReset').click(function () {
        $('.thirdLogScreen-wrapper input').val('');
        $('.thirdLogScreen-wrapper select').val('');
        httpType = '';
        form.render();
        table.reload("thirdLog", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                url: '',
                httpCode: '',
                httpType: '',
                requestStartTime: '',
                requestEndTime: '',
                reponseStartTime: '',
                responseEndTime: '',
            }
        });
        $('.thirdLogScreen-wrapper').stop().slideUp();
        thirdLogDown = true;
        $('.thirdLogScreen span').html(SCREEN || '筛选')
    });


    /********************************************异常信息日志***************************************/

    $('.errorLogScreen span').html(SCREEN || '筛选');

    $('.screen-errorInterface').html(INTERFACE || '请求接口')
    $('.screen-errorInterfaceName').html(INTERFACENAME || '接口名称')
    $('.screen-errorRequestTime').html(REQUESTTIME || '请求时间')
    $('.screen-errorType').html(REQUESTTYPE || '类型')


    $('.logUrl').attr('placeholder', SEARCHINTERFACE || '请输入接口地址')
    $('.logName').attr('placeholder', SEARCHINTERFACENAME || '请输入接口名称')
    $('#errorLogtTime').attr('placeholder', SEARCHTIME || '请选择时间范围')


    $('.errorLog_btn').html(SEARCH || '搜索')
    $('.errorReset').html(RESET || '重置')

    tableIns('#errorLog', 'get/dataCenter/log/exception/select', [[
        {field: 'logUrl', title: INTERFACE || '请求接口', align: 'center'},
        {field: 'logName', title: INTERFACENAME || '接口名称', align: 'center'},
        {field: 'logContent', title: CONTENT || '内容', align: 'center'},
        {
            field: 'logType', title: REQUESTTYPE || '请求类型', align: 'center', templet: function (d) {
                if (d.logType == '1') {
                    return 'APP';
                } else if (d.logType == '2') {
                    return 'PC';
                } else if (d.logType == '3') {
                    return 'H5';
                } else {
                    return '';
                }
            }
        },
        {field: 'createTime', title: CREATETIME || '创建时间', align: 'center'},
        {field: 'createName', title: CREATENAME || '创建人', align: 'center'},
    ]]);
    var errorLogDown = true;
    $('.errorLogScreen').click(function () {
        $('.layui-layer-content').remove();
        if (errorLogDown) {
            $('.errorLogScreen-wrapper').stop().slideDown();
            errorLogDown = !errorLogDown;
            $('.errorLogScreen span').html(ROLLUP || '收起')
        } else {
            $('.errorLogScreen-wrapper').stop().slideUp();
            errorLogDown = !errorLogDown;
            $('.errorLogScreen span').html(SCREEN || '筛选')
        }
    });

    var logType, errorLogStart, errorLogEnd;
    form.on('select(logType)', function (data) {
        logType = data.value;
    });

    laydate.render({
        elem: '#errorLogtTime',
        range: true, type: 'datetime',
        lang: lan == 2 ? 'en' : 'cn',
        done: function (value) {
            errorLogStart = value.split(' - ')[0];
            errorLogEnd = value.split(' - ')[1];

        }
    });

//搜索
    $(".errorLog_btn").on("click", function () {
        table.reload("errorLog", {
            page: {
                curr: 1
            },
            where: {
                url: $('.logUrl').val(),
                logName: $('.logName').val(),
                logType: logType,
                createStartTime: errorLogStart,
                createEndTime: errorLogEnd,
            }
        });
        $('.errorLogScreen-wrapper').stop().slideUp();
        errorLogDown = true;
        $('.errorLogScreen span').html(SCREEN || '筛选')
    });

    $(".errorReset").on("click", function () {
        $('.errorLogScreen-wrapper input').val('');
        $('.errorLogScreen-wrapper select').val('');
        logType = '';
        errorLogStart = '';
        errorLogEnd = '';
        form.render();
        table.reload("errorLog", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                url: '',
                logName: '',
                logType: '',
                createStartTime: '',
                createEndTime: '',
            }
        });
        $('.errorLogScreen-wrapper').stop().slideUp();
        errorLogDown = true;
        $('.errorLogScreen span').html(SCREEN || '筛选')
    });

    function tableIns(id, url, cols) {
        //初始化数据表格
        var tableIns = table.render({
            elem: id,
            url: interfaceUrl + url,
            method: 'post',
            contentType: "application/json",
            page: {
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                curr: 1,//设定初始在第 5 页
                groups: 10//只显示 1 个连续页码

            },
            limit: 10,
            limits: [10, 50, 100, 200],
            id: id.substr(1),
            cols: cols,
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                countName: 'total',
                dataName: 'list'
            }
        });
    }
})
;

function goLogin() {
    parent.goLogin()
}
