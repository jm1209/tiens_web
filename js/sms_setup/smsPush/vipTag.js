layui.use(['form', 'table', 'jquery'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery;

    setTimeout(function () {
        var key = UrlParm.parm('key');
        var data = UrlParm.parm('data');
        var where = {
            memPhone: '',
            memGradeId: '',
            memIsRealName: '',
            memIsPerfectInfo: '',
            memSex: '',
            memStatus: '',
            createStartTime: '',
            createEndTime: '',
            memInvitationCode: ''
        };
        for (var k in where) {
            if (k == key) {
                where[k] = data;
                break;
            }
        }
        if (key == 'memtime') {
            where.createStartTime = data.split(' - ')[0];
            where.createEndTime = data.split(' - ')[1];
        }


        tableIns = table.render({
            elem: '#tableList',
            url: interfaceUrl + 'get/complex/member/select',
            method: 'post',
            contentType: "application/json",
            page: {
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
                curr: 1,
                groups: 10
            },
            limit: 10,
            limits: [10, 50, 100, 200],
            id: "tableList",
            cols: [[
                {
                    field: 'memHeadImage', title: IMAGE || '头像', align: 'center', templet: function (d) {
                        if (d.memHeadImage == undefined) {
                            return '';
                        } else {
                            return '<img class="preview" src="' + d.memHeadImage + '" height="28">';
                        }
                    }
                },
                {field: 'memNickname', title: NAME || '昵称', align: 'center'},
                {
                    field: 'memSex', title: SEX || '性别', align: 'center', templet: function (d) {
                        return d.memSex == '0' ? MAN || '男' : WOMAN || '女';
                    }
                },
                {field: 'memGradeName', title: VIPLEVEL || '会员等级', align: 'center'},
                {field: 'memPhone', title: PHONE || '手机号', align: 'center'},
                {
                    field: 'memStatus', title: STATE || '会员状态', align: 'center', templet: function (d) {
                        var checked;
                        if (d.memStatus == '0') {
                            checked = ENABLED || '未冻结';
                        } else {
                            checked = NOTENABLED || '已冻结';
                        }
                        return checked;
                    }
                }, {
                    field: 'memIsRealName', title: ISREAL || '是否实名', align: 'center', templet: function (d) {
                        var checked;
                        if (d.memIsRealName == '0') {
                            checked = NOTREAL || '未实名';
                        } else {
                            checked = REAL || '已实名';
                        }
                        return checked;
                    }
                },
                {
                    field: 'memIsPerfectInfo', title: PERFECT || '完善资料', align: 'center', templet: function (d) {
                        var checked;
                        if (d.memIsPerfectInfo == '0') {
                            checked = NOTPERFECT || '未完善';
                        } else {
                            checked = PERFECT || '已完善';
                        }
                        return checked;
                    }
                },
                {field: 'memInvitationCode', title: INVITATIONCODE || '会员邀请码', align: 'center'},
                {field: 'createTime', title: REGISTERTIME || '注册时间', align: 'center'},
            ]],
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                countName: 'total',
                dataName: 'list'
            },
            where: where
        });
    }, 20);

});
