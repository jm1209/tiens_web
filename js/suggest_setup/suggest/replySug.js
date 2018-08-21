layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });

    var lan = localStorage.getItem('language');
    $('.sugMemberId i').html(lan == 2 ? 'reply' : '的回复');
});

function goLogin() {
    parent.goLogin()
}
