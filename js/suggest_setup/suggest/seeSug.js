layui.use(['jquery'], function () {
    var $ = layui.jquery;

    var lan = localStorage.getItem('language');

    $('.title1').html(TITLE || '建议标题');
    $('.type').html(TYPE || '类型');
    $('.vipname').html(NAME || '会员名称');
    $('.phone').html(PHONE || '手机号');
    $('.sugtime').html(TIME || '建议时间');
    $('.sugImage').html(IMAGE || '建议图片');
    $('.sugcontent').html(COMMENT || '建议内容');
    $('.replycontent').html(lan == '2'?'reply content' : '回复内容');


});

function goLogin() {
    parent.goLogin()
}

function showImg(url) {
    showImg(url);
}