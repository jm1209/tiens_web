if (localStorage.getItem('language') == '2') {
    //首页
    var USER_NAME = 'user name';
    var LANGUAGE_SWITCH = 'language switch';
    var CHINESE = 'Chinese';
    var ENGLISH = 'English';
    var PASSWORD = 'password';
    var SKIN = 'skin';
    var QUIT = 'quit';
    var HANDLE = 'operation';
    var REFRESH = 'refresh';
    var CLOSE_OTHER = 'close other';
    var CLOSE_All = 'close all';
    var SUBMIT = 'submit';
    var CANCEL = 'cancel';
    var no_window = 'there is no window to be closed';
    var HOME = 'home';
    var LOGO = 'tiens-wallet';
    var LOGINFIRST = 'please login first';
    var NOPERMISSION = 'no permission';
    var LOGINAGAIN = 'login again';
    var ERRORUSERNAME = 'error user name';


    var ADD = 'add';
    var EDIT = 'edit';
    var DELETE = 'delete';
    var THISURL = 'url';
    var ICON = 'icon';
    var TYPE = 'type';
    var STATE = 'state';
    var SEE = 'view';
    var TAKEUP = 'Take up';
    var UPLOAD = 'Click upload, or drag the file here';
    var MAN = 'man';
    var WOMAN = 'woman';
    var NUM = 'number';
    var AMOUNT = 'amount';
    var AGE = 'age';
    var FOUNDER = 'founder';
    var TITLE = 'title';
    var TIME = 'time';
    var NOTDEL = 'System core data deletion may cause irreparable consequences, the relevant responsibility will be borne by the operator, please be careful to operate!';

    //资源权限
    var RESOURCE = 'resource';
    var SUPERIOR = 'superior';

    var CHOOSE_NODE = 'please choose a node!';
    var DEL_NODE = 'root node is not allowed to delete!';
    var PROMPT = 'prompt';
    var DEL_PROMPT = 'Do you decide to delete the selected node?';
    var SCREEN = 'screening';
    var ROLLUP = 'tack up';
    var NAME = 'name';
    var ENNAME = 'En name';
    var DESCRIBE = 'describe';
    var VALID = 'valid';
    var INVALID = 'invalid';
    var SELECTINVERT = 'select Invert';
    var GRANT = 'level';
    //var DATA_PROMPT = 'data submission';
    var CHOOSE_ALL = 'check all';
    var ROLE = 'role';
    var ACCOUNT = 'account';
    var PHONE = 'phone';
    var SORT = 'sort';
    var SEARCH = 'search';
    var RESET = 'reset';
    //搜索
    var SEARCHNAME = 'Search name';
    var SEARCHACCOUNT = 'Search account';
    var SEARCHPHONE = 'Search phone';
    var SEARCHKEY = 'Search key';

    //日志管理
    var IP = 'ip';
    var INTERFACE = 'interface';
    var INTERFACENAME = 'interface';
    var REQUESTTYPE = 'request type';
    var CREATETIME = 'register time';
    var REGISTERTIME = 'register time';
    var CREATENAME = 'creator';
    var REQUESTMETHOD = 'request method';
    var REQUESTTIME = 'request time';
    var RESPONSETIME = 'reponse time';
    var STATUSCODE = 'status code';
    var REQUEST = 'request data';
    var RESPONSE = 'response data';
    var SERVICE = 'service';
    var CONTENT = 'content';

    var SEARCHIP = 'Search ip';
    var SEARCHINTERFACE = 'Search interface';
    var SEARCHINTERFACENAME = 'Search interface name';
    var SEARCHTIME = 'Search time';
    var SEARCHSTATUSCODE = 'Search status code';

    var RECORD = 'log';
    var THIRD = 'third party interface request log';
    var ERROR = 'exception information log';

    //配置管理
    var VALUE = 'value';
    var KEY = 'key';
    var DESCRIPTION = 'description';
    var EXTEND_COLUMN_ONE = 'extend column one';
    var EXTEND_COLUMN_TWO = 'extend column two';

    //员工管理
    var ROLETNAME = 'role name';

    //数据字典
    var ENUMNAME = 'enum name';
    var SEQUENCE = 'sequence';

    var CREATE_NAME = 'Create a name';
    var CREATE_DES = 'Create a description';
    var CREATE_ACCOUNT = 'Create a account';
    var CREATE_PHONE = 'Create a phone';
    var CREATE_SORT = 'Create a sort';
    var CREATE_VALUE = 'Create a value';
    var CREATE_KEY = 'Create a key';

    //会员管理
    var MEMLEVELNAME = 'level name';
    var MEMLEVEL = 'level';
    var MEMLEVELPIC = 'level pic';
    var GROWTH = 'growth';
    var CHOOSETYPE = 'choose type';
    var CHOOSEOPERTYPE = 'choose operation type';
    var ERRORQUANTITY = 'quantity is error';
    var INPUTQUANTITY = 'input quantity';

    var CREATE_LEVEL_NAME = 'Create level name';
    var CREATE_LEVEL_GROUTH = 'Create growth';
    var CREATE_LEVEL = 'Create level';

    var IMAGE = 'image';
    var NICKNAME = 'nickname';
    var SEX = 'sex';
    var INVITATIONCODE = 'invitgation';
    var REGISTERTIME = 'register time';

    var SEARCHNICKNAME = 'Search nickName';
    var SEARCHINVITATIONCODE = 'Search invitgation code';
    var PICSIZE = 'The best picture size is <b>120 * 120</b> pixels';
    var TAGGING = 'The best picture size is <b>690 * 310</b> pixels';

    var HANDLETYPE = 'operation';
    var UNFROZEN = 'unfrozen';
    var INTEGRALNUMBER = 'Integral (positive integer) balance (preserving the positive number of two decimal places)';
    var AVATAR = 'avatar';
    var BIRTHDAY = 'birthday';
    var GRADE = 'level';
    var ISREAL = 'be real';
    var MEMPRESENTAMOUNT = 'present balance';
    var MEMNONPRESENTAMOUNT = 'non present balance';
    var MEMINTEGRAL = 'point';
    var MEMINVITATIONCODE = 'invitation code';
    var MEMRELATEDINVITATIONCODE = 'relation code';
    var REAL = 'real name';
    var NOTREAL = 'no real name';
    var SIGN = 'sign in';
    var BIND = 'bind business';
    var BANK = 'bank card';
    var INFORMATION = 'news';
    var DOWNLINE = 'downline';
    var DOWN = 'down';
    var PLEASEUPLOAD = 'please upload';

    var FACADE = 'facade of ID card';
    var REVERSE = 'reverse photo of ID card';
    var IDNUMBER = 'ID number';
    var ATTESTATION = 'attestation time';
    var DAY = 'day';

    var BANKCARD = 'bank card';
    var DEFAULT = 'default';
    var NOTDEFAULT = ' not default';
    var PERFECT = 'perfect';
    var NOTPERFECT = 'not complete';
    var SECRETFREE = 'secret free';
    var NOTSECRETFREE = 'not secret free';
    var GESTURE = 'gesture';
    var DEPOSITCARD = 'deposit card';
    var CREDITCARD = 'credit card';
    var DISABLEVIP = 'Determine to disable current members';
    var ENABLEVIP = 'Determine to enable current members';

    /*积分管理*/
    var LACHINE = 'lachine';
    var CONSUME = 'consume';
    var SHARE = 'likes';//点赞量
    var COMMENT = 'comment';
    var UPPERLIMIT = 'upper limit';
    var INTEGRAL = 'integral flow';
    var FREEZEINTEGRAL = 'integral to freeze';
    var BALAN = 'balance water';
    var STREAM = 'stream';
    var INVITATION = 'invitation';
    var SHIFTTO = 'join in';
    var TURNOUT = 'shift to';
    var THAW = 'thaw';
    var DEDUCTION = 'deduction';
    var CONSUMPTION = 'spending';
    var MONEY = 'money';
    var RECHARGE = 'recharge';
    var PUTFORWARD = 'put forward';
    var RECEIVABLES = 'receivables';
    var PAYMENT = 'payment';
    var FROZENNUMBER = 'frozen number';
    var ISSUENUMBER = 'issue number';
    var SIGNNUMBER = 'sign number';
    var INVITENUMBER = 'invite number';
    var SHIFTNUMBER = 'shift number';
    var ROLLOUTNUMBER = 'roll out number';
    var FROZEN = 'frozen';
    var ISSUE = 'issue';
    var SIGN = 'sign';
    var INVITE = 'invite';
    var SHIFT = 'shift';
    var ROLLOUT = 'roll out';
    var ONLYOPEN = 'You can only open ';
    var SELECTIONS = 'selections,otherwise the system will get stuck!';

    var COUNTINTERGRAL = 'integral count';

    /*新闻资讯*/
    var ABSTRACT = 'abstract';
    var TEXT = 'text';
    var NOTENABLED = 'disable';
    var ISENABLED = 'be enabled';
    var ENABLED = 'enable';
    var CLASSIFY = 'classify';
    var BANNER = 'banner';
    var BREVIARY = 'breviary';
    var SETTOP = 'sticky ';
    var NOTSETTOP = 'common';
    var NEWS = 'news';
    var PAGEVIEW = 'repost';//转发量
    var POINT = 'views';//浏览量
    var AUTHOR = 'author';
    var SETUP = 'label';
    var MEDIA = 'media';
    var VIDEO = 'video';


    /*资讯管理*/
    var SEARCHTITLE = 'Search title';
    var THUMBNAIL = 'thumbnail';
    var TRANSVERSE = 'transverse';
    var DETAILS = 'details';
    var COLOUR = 'colour';
    var BESTPIXEL = 'The best pixel is 250 * 250';
    var EXSISTTAG = 'tag is exist';
    var MORETAG = 'too many tag';
    var NULLTAGNAME = 'It can not be empty here.';
    var MESSAGE = 'prompt message';
    var DATASUBMIT = 'data submit';
    var FORWARDGREATPAGEVIEW = 'Forwarding cannot be greater than page views';
    var THUMPUPGREATPAGEVIEW = 'Thumb up cannot be greater than page views';

    /*评价管理*/
    var NOTREPLY = 'to reply';
    var REPLY = 'reply';
    var ISREPLY = 'is reply';
    var OBSERVER = 'observer';
    var COMMENTTIME = 'comment time';
    var REPLYCOMMENT = 'reply comment';
    var SEECOMMENT = 'view comment';
    var COMMENTCONTENT = 'comment';
    var REPLYCONTENT = 'reply';
    var REPLYTO = 'reply to';
    var NULL = '  ';
    var SORTNUMBER = 'can only sort number';
    var ERRORLINK = 'illegal link address';
    var MANAGEACT = 'activity';

    /*广告管理*/
    var LINKADRESS = 'link';
    var VALIDITY = 'validity';
    var SHOP = 'shop';
    var ADDAD = 'Add advertising space';
    var ADSPACE = 'advertising';
    var RETURN = 'click to return';
    var SEEAD = 'See advertising space';
    var EDITAD = 'Edit advertising space';
    var JUMPTYPE = 'jump type';
    var INPUTTITLE = 'input title';
    var CAROUSELTIME = 'carousel time';
    var CAROUSEL = 'carousel';
    var SIMPLEGRAPH = 'single image';
    var FORWARDAMOUNT = 'forward amount';
    var THUMPUPAMOUNT = 'thump up amount';
    var READAMOUNT = 'read amount';
    var INPUTFORWARD = 'please input the forwarding quantity.';
    var INPUTREAD = 'please input your reading volume.';
    var INPUTJUMPUP = 'please input some points.';
    var ENABLETIME = 'enable time';
    var INPUTDATA = 'input validity date';
    var INPUTSEQUENCE = 'input sequence';
    var INPUTCONTENT = 'please input contents';
    var INPUTADRESS = 'input adress';
    var ADBESTPIXEL = 'The best pixel is 750 * 350';


    /*业态管理*/
    var BUSNAME = 'bussiness name';
    var BUSLOGO = 'logo';
    var BUSTYPE = 'bussiness type';
    var CHANNELCODE = 'source';
    var RESERVEDMALL = 'reserved mall';
    var FINANCIALMODULE = 'financial module';
    var HOMEPAGENAVIGATION = 'home page navigation';
    var BUSBESTPIXEL = 'The best pixel is 88 * 88';

    /*意见建议管理*/
    var REPLIER = 'replier';

    /*店铺管理*/
    var SHOPNAME = 'name';
    var SHOPCODE = 'shop code';
    var SHOPADRESS = 'address';
    var SHOPLOGO = 'logo';
    var FINDSHOP = 'find shop';
    var JINGWEIDU = 'coordinates';
    var SALLTIME = 'servie time';
    var QRCODE = 'QR code';
    var SHOPBESTPIXEL = 'The best pixel is 200 * 200';
    var PREVIEW = 'preview';
    var UPLOADMULIMAGE = 'multiple image upload';
    var UPLOADIMAGE = 'upload image';
    var UPLOADFILE = 'upload';
    var CHECKPHONENUMBER = 'check phone number';
    var PRIMARYKEY = 'primary key';
    var LEFTCLICKFINDLATITUDEANDLONGITUDE = 'left-click to get latitude and longitude';
    var LATITUDE = 'latitude';
    var LONGITUDE = 'longitude';
    var SHOPMANAGER = 'shop manager';

    /*活动管理*/
    var ACTIVITYNAME = 'category';
    var ACTIVITYADRESS = 'address';
    var ACTBESTPIXEL = 'The best pixel is 190 * 190';
    var ACTMAINBESTPIXEL = 'The best pixel is 630 * 300';
    var STARTTIME = 'start time';
    var ENDTIME = 'end time';
    var TAGSET = 'tag setting';
    var DIGEST = 'digest';
    var OUTCONNECTION = 'out connection';
    var SMALLAPP = 'small application';
    var BUSSINESSTYPE = 'type of business';
    var RICHTEXT = 'rich text';
    var CHOOSETIME = 'please choose time';
    var INPUTDETAIL = 'please input activity detail'

    /*消息管理*/
    var SMSPUSH = 'push sms';
    var RECEIVER = 'receiver';
    var PUSH = 'push';
    var PUSHFAIL = 'push fail';
    var PUSHSUCCESS = 'push success';
    var PUSHING = 'pushing';
    var NOTPUSH = 'not push';
    var VIPLEVEL = 'vip level';
    var INVITATIONCODE = 'invitation code';
    var ISAUTONYM = 'is autonym';
    var ISCOMPLETEINFO = 'complete infomation';
    var TAGSELECTED = 'label'
    var TEMPLESELECTED = 'select template'
    var SMSBESTPIXEL = 'The best pixel is 630 * 268';
    var ISREAD = 'be read';
    var READ = 'read';
    var NOTREAD = 'unread';
    var CHOOSE = 'please choose';

    /*修改密码*/
    var OLDPWD = 'old';
    var NEWPWD = 'new';
    var OKPWD = 'confirm';
    var MODIFY = 'modify';
}