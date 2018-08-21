layui.use(['jquery'], function () {
    var $ = layui.jquery;

    $('.tagColor').minicolors({
        control: $('.tagColor').attr('data-control') || 'hue',
        defaultValue: $('.tagColor').attr('data-defaultValue') || '',
        inline: $('.tagColor').attr('data-inline') === 'true',
        letterCase: $('.tagColor').attr('data-letterCase') || 'lowercase',
        opacity: $('.tagColor').attr('data-opacity'),
        position: $('.tagColor').attr('data-position') || 'bottom left',
        change: function(hex, opacity) {
            if (!hex)
                return;
            if (opacity)
                hex += ', ' + opacity;
            try {
            } catch (e) {
            }
        },

    });
});

function goLogin() {
    parent.goLogin()
}
