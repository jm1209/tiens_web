UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
UE.Editor.prototype.getActionUrl = function(action) {
    if (action == 'uploadimage' || action == 'uploadscrawl') {
        return interfaceUrl+'upload';
    } else if (action == 'uploadvideo') {
        return interfaceUrl+'upload';
    }else {
        return this._bkGetActionUrl.call(this, action);
    }
}