layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var lan = localStorage.getItem('language');

    $('.type').html(lan == 2 ? 'type' : '类型');
    $('.observer').html(lan == 2 ? 'commentator' : '评论人');
    $('.commenttime').html(lan == 2 ? 'time' : '评论时间');
    $('.commentcontent').html(lan == 2 ? 'content' : '评论内容');
    $('.replycontent').html(lan == 2 ? 'reply content' : '回复内容');
});

function goLogin() {
    parent.goLogin()
}
