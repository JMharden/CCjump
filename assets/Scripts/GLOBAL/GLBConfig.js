/* 存放全局变量 */
var _GLBConfig = {
    URL: 'http://tt.wapwei.com',

    MAX_PLAYER_COUNT: 2,
    GAME_START_EVENT: "gameStart",
    NEW_START_EVENT: "newStar",
    PLAYER_MOVE_EVENT: "playerMove",
    GAIN_SCORE_EVENT: "gainScore",
    PLAYER_POSITION_EVENT: "playerPosition",
    MAP_INIT: 'mapInit',
    USER_ALIKE: 'userAlike',
    USER_INIT: 'userInit',
    SOCKET_SCORE: 'socketScore',
    SOCKET_CUBE: 'socketCube',
    GAME_READY: "gameReady",
    START_GAME: 'startGame',
    SCENE_READY: "sceneReady",
    JOIN_GAME: 'joinGame',
    READY_GAME: 'readyGame',
    readyArr: [],
    joinArr: [],
    OneMap: true,

    channel: 'Matchvs',
    platform: 'alpha',//测试环境：alpha,线上环境：release
    gameId: 214352,
    gameVersion: 1,
    appKey: '9eedd013bf8e4cba87a158be630f6817#M',
    secret: '0d857660381049cd925cd14c602bf7f7',

    myInfo: {
        advert: "11",
        all_login_time: "22",
        club_id: "3",
        ercode: "",
        headimg: "https://wx.qlogo.cn/mmopen/vi_32/jAWmR3DCx1ydBY30U38TpdxqndbPf8nokEkIoyYoLToNnDZyVAC8Fx73p2beXSuUPS4kjCMtP8iagS7fNc0Hoag/132",
        id: "183",
        is_club_owner: "0",
        join_time: "2019-05-22 18:38:15",
        last_login_time: "2019-03-07 10:13:14",
        mobile: "13552687841",
        money: "100.00",
        nickname: "科",
        openid: "oH1545ILnsMqzIqcYgz0_OpeqZ94",
        parent1: "184",
        parent2: "182",
        parent3: "0",
        probability: "0%",
        rank: "白银",
        rankNum: 484,
        ranks: 499,
        session3rd: "5sftq5SxHdU9ULyE",
        sex: "2",
        source: "1",
        stamina: "50",
        type: "2",
    },
    playerNum: 1,
    mapPack: 0,
    token: '',
    userInfo: {},
    myId: '',
    myIndex: 0,
    playerUserIds: [],
    playerName: [],
    slime: [],
    photo: [],
    playList: [],
    photoList: [],

    isRoomOwner: false,
    events: {},
};
let _GLBFun = {
    ajax(options) {
        options = options || {};
        options.method = (options.method || "POST").toUpperCase();
        options.url = _GLBConfig.URL + options.url;
        options.dataType = options.dataType || "json";
        options.async = options.async || true;
        let params = this.formatParams(options.data);
        let xhr;

        //创建 - 第一步
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveObject) { //IE6及以下
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //连接 和 发送 - 第二步
        if (options.method === "GET") {
            console.log(params);
            xhr.open("GET", options.url + "?" + params, options.async);
            xhr.send(null);
        } else if (options.method === "POST") {
            xhr.open("POST", options.url, options.async);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let status = xhr.status;
                if (status >= 200 && status < 300 || status === 304) {
                    options.success && options.success(JSON.parse(xhr.responseText, xhr.responseXML));
                } else {
                    options.error && options.error(status);
                }
            }
        }
    },
    //格式化参数
    formatParams(data) {
        let arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push("token=" + _GLBConfig.myInfo.session3rd);
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    },

    //判断是否在微信环境下运行
    isWeChatApplet() {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('micromessenger') == -1) {//不在微信或者小程序中
            console.log("不在微信或者小程序中");
            return false;
        } else {
            console.log("在微信环境中");
            return true;
        }
    },
    //数组去重
    removeDuplicatedItem(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);//console.log(arr[j]);
                    j--;
                }
            }
        }
        return arr;
    },
    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    showImg(url, node) {
        cc.loader.load(url + "?aa=aa.jpg", (err, texture) => {
            node.spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    editTime(val) {
        return val.split(' ')[0];
    },
    TipsShow(detailString) {
        let _detailLabel = '';
        // 加载 prefab 创建
        cc.loader.loadRes("TipsTop", cc.Prefab, function (error, prefab) {

            if (error) {
                cc.error(error);
                return;
            }

            // 实例
            var tips = cc.instantiate(prefab);
            var tipsAni = tips.getChildByName('tips').getComponent(cc.Animation);
            tipsAni.playEnd = function () {
                tips.destroy();
            }

            // 设置字符
            _detailLabel = cc.find("tips/TipsLabel", tips).getComponent(cc.Label);
            _detailLabel.string = detailString;

            // 父视图
            tips.parent = cc.find("Canvas");

        });
    },
    ImgBaseShow(tartget) {
        cc.loader.loadRes("ImgBase", cc.Prefab, function (error, prefab) {
            if (error) {
                cc.error(error);
                return;
            }
            // 实例
            var ImgBase = cc.instantiate(prefab);
            var ImgBaseJs = ImgBase.getComponent('ImgBase');
            ImgBaseJs.targetNode = tartget;
            ImgBase.parent = cc.find("Canvas");

        });
    },

};
export default { _GLBConfig, _GLBFun };