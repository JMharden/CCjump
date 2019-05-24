var mvs = require('Mvs');
import { _GLBConfig, _GLBFun } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        LOGIN: {
            default: null,
            type: cc.Node,
        },
        loginBox: {
            default: null,
            type: cc.ProgressBar,
        },
        photo: {
            default: null,
            type: cc.Sprite,
        },
        userName: {
            default: null,
            type: cc.Label,
        },
        userID: {
            default: null,
            type: cc.Label,
        },
        userLv: {
            default: null,
            type: cc.Label,
        },
        userLvExp: {
            default: null,
            type: cc.Node,
        },
        userLvImg: {
            default: null,
            type: cc.Sprite,
        },
        LvImg: {
            default: [],
            type: cc.SpriteFrame,
        },
        userStamina: {
            default: null,
            type: cc.Label,
        },
        userMoney: {
            default: null,
            type: cc.Label,
        },
        loginStar: false,
        allReady: false,
        userInfo: {
            default: null,
            type: cc.Node,
        },
        loginMask: {
            default: null,
            type: cc.Node,
        },
        loginMaskBar: {
            default: null,
            type: cc.ProgressBar,
        },
        matchingMask: cc.Prefab,
        matchingBoxJs: null,

        slimeArr: {
            default: [],
            type: cc.SpriteFrame,
        },
        slimeSprite: {
            default: null,
            type: cc.Sprite,
        },
        room: cc.Prefab,
        roomJs: null,
        bar: {
            get() {
                return this._bar;
            },
            set(value) {
                this._bar = value;
                this.userInfo.active = value;
            },
        },
        item: null,
        // 活动
        活动: cc.Node,
        activityList: cc.Node,
        activityItem: cc.Prefab,
    },
    onLoad: function () {
        // console.log(this.bar);
        mvs.response.initResponse = this.initResponse.bind(this);
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this); // 设置事件接收的回调
        mvs.response.sendEventResponse = this.sendEventResponse.bind(this);// 设置事件发射之后的回调
        mvs.response.gameServerNotify = this.gameServerNotify.bind(this);//接收gameServer的消息
        mvs.response.getRoomDetailResponse = this.getRoomDetailResponse.bind(this);
        // _SocketGameInfo.mvsBind();
        var result = mvs.engine.init(mvs.response, _GLBConfig.channel, _GLBConfig.platform, _GLBConfig.gameId, _GLBConfig.appKey, 1);
        if (result !== 0) console.log('初始化失败,错误码:' + result);
        this.login(_GLBFun.isWeChatApplet());

        this.item = cc.instantiate(this.matchingMask);
        this.matchingBoxJs = this.item.getComponent('matchingBox');
        console.log(this.matchingBoxJs);
        this.matchingBoxJs.HC = this;
    },
    initResponse: function (status) {
        mvs.response.registerUserResponse = this.registerUserResponse.bind(this); // 用户注册之后的回调
        var result = mvs.engine.registerUser();
        if (result !== 0)
            return console.log('注册用户失败，错误码:' + result);
        else
            console.log('注册用户成功');
    },

    registerUserResponse: function (userInfo) {
        // var deviceId = 'abcdef';
        // var gatewayId = 0;
        _GLBConfig.userInfo = userInfo;
        _GLBFun.showImg(userInfo.avatar, this.photo);
        // console.log('开始登录,用户Id:' + userInfo.id);
        this.userID.string = userInfo.id;
        _GLBConfig.myId = userInfo.id;
        mvs.response.loginResponse = this.loginResponse.bind(this); // 用户登录之后的回调
        if (userInfo.status === 0) {
            var DeviceID = 'TestDevice';
            var result = mvs.engine.login(userInfo.userID, userInfo.token, DeviceID);
        } else {
            console.log("注册失败" + userInfo.status);
        }
    },

    loginResponse: function (info) {
        if (info.status !== 200)
            return console.log('登录失败,异步回调错误码:' + info.status);
        else
            console.log('登录成功');
    },
    getRoomDetailResponse: function (rsp) {
        if (rsp.status === 200) {
            console.log("获取房间详情成功");
        } else {
            console.log("获取房间详情失败 status " + rsp.status);
        }
    },
    startLoadingGameScene(eve, val) {
        console.log('开始加载游戏场景,请稍等');
        // let Num = Number(val);
        // this.setCurrentType(Num);
        switch (Number(_GLBConfig.playerNum)) {
            case 1://单机需要执行的东西
                console.log("当前是训练场模式");
                this.loginIsShow();
                this.loadCallback();
                _GLBConfig.mapPack = this.returnRandom();
                break;
            case 2://联机需要执行的东西
                console.log("当前是个人竞技模式");

                this.item.parent = this.node;
                break;
        }

    },
    returnRandom() {
        let choices = 100000 - 1 + 1;
        return Math.floor(Math.random() * choices + 1);
    },//返回两个数之间的随机整数
    requireMap() {
        // console.log(GLB._GLBConfig.MAP_INIT);
        let event = {
            action: _GLBConfig.MAP_INIT,
        };
        var result = mvs.engine.sendEventEx(1, JSON.stringify(event), 0, playerUserIds);
        if (!result || result.result !== 0) {
            return console.error('请求地图包失败');
        }
    },

    loginIsShow() {
        this.loginMask.active = true;
        this.loginMaskBar.progress = 0.2;
        this.userInit();
    },

    setMyInfo() {
        let that = this;
        that.userName.string = _GLBConfig.myInfo.nickname || 'null';
        _GLBFun.showImg(_GLBConfig.myInfo.headimg, that.photo) || 'null';
        that.userStamina.string = _GLBConfig.myInfo.stamina || 'null';
        that.userMoney.string = _GLBConfig.myInfo.money || 'null';
        that.userLv.string = _GLBConfig.myInfo.rank || 'null';
        that.userLvExp.height = 80 * _GLBConfig.myInfo.rankNum / _GLBConfig.myInfo.ranks || 80;
        console.log(_GLBConfig.myInfo.rankNum / _GLBConfig.myInfo.ranks);
        switch (_GLBConfig.myInfo.rank) {
            case '青铜':
                that.userLvImg.spriteFrame = that.LvImg[0];
                break;
            case '白银':
                that.userLvImg.spriteFrame = that.LvImg[1];
                break;
            case '黄金':
                that.userLvImg.spriteFrame = that.LvImg[2];
                break;
            case '铂金':
                that.userLvImg.spriteFrame = that.LvImg[3];
                break;
            case '钻石 ':
                that.userLvImg.spriteFrame = that.LvImg[4];
                break;
            case '王者':
                that.userLvImg.spriteFrame = that.LvImg[5];
                break;
            default:
                break;
        }
    },
    setActivity(data) {
        console.log(data);
        this.活动.active = true;
        for (let i = 0; i < data.length; i++) {
            let item = cc.instantiate(this.activityItem);
            item.getComponent('item').data = data[i];
            item.parent = this.activityList;
        }
    },
    login(isWeChat) {
        if (isWeChat) {
            let exportJson = {};
            let sysInfo = window.wx.getSystemInfoSync();
            //获取微信界面大小
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            let that = this;
            var loginFun = function (code, info) {
                _GLBFun.ajax({
                    url: '/api.php?m=Api&c=Api&a=login&uid=163',
                    data: {
                        "code": code,
                        "rawData": info.rawData,
                        "signature": info.signature,
                        'iv': info.iv,
                        'encryptedData': info.encryptedData
                    }, success: (info) => {
                        console.log(info);
                        _GLBConfig.myInfo = info.data.userInfo;
                        wx.setStorageSync('myInfo', _GLBConfig.myInfo);
                        that.setMyInfo();
                        that.setActivity(info.data.accLoginActivity);
                    }
                })
            }
            wx.login({
                success: (res) => {
                    var code = res.code;
                    window.wx.getSetting({
                        success(res) {
                            console.log('看看Code', res);
                            if (res.authSetting["scope.userInfo"]) {
                                console.log("用户已授权");
                                window.wx.getUserInfo({
                                    success(res) {
                                        console.log(res);
                                        exportJson.userInfo = res.userInfo;
                                        //此时可进行登录操作
                                        loginFun(code, res);
                                    }
                                });
                            } else {
                                console.log("用户未授权");
                                let button = window.wx.createUserInfoButton({
                                    type: 'text',
                                    text: '',
                                    style: {
                                        left: 0,
                                        top: 0,
                                        width: width,
                                        height: height,
                                        backgroundColor: '#00000000',//最后两位为透明度
                                        color: '#ffffff',
                                        fontSize: 20,
                                        textAlign: "center",
                                        lineHeight: height,
                                    }
                                });
                                button.onTap((res) => {
                                    if (res.userInfo) {
                                        console.log("用户授权:", res);
                                        exportJson.userInfo = res.userInfo;
                                        //此时可进行登录操作
                                        loginFun(code, res);
                                        button.destroy();
                                    } else {
                                        console.log("用户拒绝授权:", res);
                                    }
                                });
                            }
                        }
                    })
                }
            })
        }
    },

    // login(isWeChat) {
    //     console.log(isWeChat);
    //     let that = this;
    //     if (isWeChat) {
    //         wx.checkSession({
    //             success: () => {
    //                 console.log('已登录');
    //             },
    //             fail: () => {
    //                 console.log('未登录，重新登录');
    //                 wx.login({
    //                     success: (res) => {
    //                         // console.log('微信登录：', res);
    //                         // var code = res.code; //获取code
    //                         wx.authorize({
    //                             scope: 'scope.userInfo',
    //                             success: () => {
    //                                 wx.getUserInfo({ //得到rawData, signatrue, encryptData
    //                                     success: (info) => {
    //                                         console.log('success', info);
    //                                         that.userName.string = info.userInfo.nickName;
    //                                         _GLBFun.showImg(info.userInfo.avatarUrl, that.photo);
    //                                         _GLBFun.ajax({
    //                                             url: '/api.php?m=Api&c=Api&a=login&uid=163',
    //                                             data: {
    //                                                 "code": info.code,
    //                                                 "rawData": info.rawData,
    //                                                 "signature": info.signature,
    //                                                 'iv': info.iv,
    //                                                 'encryptedData': info.encryptedData
    //                                             }, success: (info) => {
    //                                                 console.log('微信登录成功', info);
    //                                                 // _GLBConfig.myInfo = info.data.data;
    //                                                 // console.log("userInfo", _GLBConfig.myInfo);
    //                                                 // console.log("userInfo", _GLBConfig.myInfo.toString());
    //                                                 // wx.setStorageSync('token', info.data.data.session3rd);
    //                                                 // that.userName.string = info.data.data.nickName;
    //                                                 // that.userID.string = info.data.data.id;
    //                                                 // that.userMoney.string = info.data.data.money;
    //                                                 // _GLBFun.showImg(info.data.data.avatarUrl, that.photo);
    //                                                 // console.log("我是token：", wx.getStorageSync('token'));
    //                                             }
    //                                         })
    //                                     },
    //                                     fail: (res) => {
    //                                         console.log('fail:', res);
    //                                     }
    //                                 })
    //                             }
    //                         });
    //                     },
    //                 });
    //             }
    //         });
    //     }
    // },
    loadCallback() { //游戏加载完成回调
        cc.director.preloadScene('NewGameScene_Horizontal', () => {
            let index = _GLBConfig.playerUserIds.indexOf(_GLBConfig.myId);
            if (_GLBConfig.playerNum > 1) {
                let event = {
                    action: _GLBConfig.JOIN_GAME,
                    mePlayerIndex: index,
                };
                this.userInitAlike(event);
                _GLBConfig.joinArr.push(1);
                this.matchingBoxJs.roomJS.loadingReady(index);
            } else {
                this.loginStar = true;
            }
            this.loginStar = true;
        });
        return this.loadCallback = function () { };
    },


    sendEventResponse: function (info) {
        if (!info || !info.status || info.status !== 200) {
            return console.log('事件发送失败', info);
        }
    },

    sendEventNotify: function (eventInfo) {
        let obj = JSON.parse(eventInfo.cpProto);
        switch (obj.action) {
            case _GLBConfig.SCENE_READY:
                this.allReady = true;
                console.log("准备进入新场景吧");
                break;
            case _GLBConfig.MAP_INIT:
                _GLBConfig.mapPack = obj.mapPack;
                break;
            case _GLBConfig.USER_INIT:
                _GLBConfig.playerName[obj.mePlayerIndex] = obj.nickName;
                _GLBConfig.slime[obj.mePlayerIndex] = obj.slimeIndex;
                _GLBConfig.photo[obj.mePlayerIndex] = obj.photo;
                break;
            case _GLBConfig.START_GAME:
                _GLBConfig.playerUserIds = obj.playerUserIds;
                _GLBConfig.playerName = obj.playerName;
                _GLBConfig.slime = obj.slime;
                _GLBConfig.photo = obj.photo;
                console.log(this.matchingBoxJs.roomJS);
                this.matchingBoxJs.roomJS.showUserInfo();
                this.loadCallback();
                break;
            case _GLBConfig.READY_GAME:
                // GLB._GLBConfig.photoList[obj.mePlayerIndex].opacity = 255;
                // GLB._GLBConfig.readyArr.push(1);
                break;
            case _GLBConfig.JOIN_GAME:
                this.matchingBoxJs.roomJS.loadingReady(obj.mePlayerIndex);
                _GLBConfig.joinArr.push(1);
                break;


            // default:
            //     console.log("来历不明的请求信息");
            //     break;
        }
    },
    userInitAlike(event) {
        let arr = _GLBConfig.playerUserIds.concat();
        let index = arr.indexOf(_GLBConfig.myId);
        if (index > -1) {
            arr.splice(index, 1);
        }
        let result = mvs.engine.sendEventEx(0, JSON.stringify(event), 0, arr);
        console.log("发送的状态", result, event);
        if (!result || result.result !== 0)
            return console.error('用户信息同步失败');
    },
    gameServerNotify: function (info) {
        let obj = JSON.parse(info.cpProto);
        console.log("GameSever发送的信息", obj);
        switch (obj.action) {
            case _GLBConfig.MAP_INIT:
                _GLBConfig.mapPack = obj.mapPack;
                console.log("竞技模式的地图", _GLBConfig.mapPack);
                break;
            case _GLBConfig.GAME_START_EVENT:
                console.log("准备好了：", _GLBConfig.playerUserIds);
                this.startGame();
                break;
        }

        // if (obj.action === GLB._GLBConfig.GAME_START_EVENT && info && info.cpProto && info.cpProto.indexOf(GLB._GLBConfig.GAME_START_EVENT) >= 0) {
        //     console.log("准备好了：", GLB._GLBConfig.playerUserIds);
        //     this.startGame();
        // }
    },

    startGame: function () {
        console.log("房主测试", _GLBConfig.isRoomOwner);
        if (_GLBConfig.isRoomOwner) {
            _GLBConfig.mapPack = this.returnRandom();
            let map = {
                action: _GLBConfig.MAP_INIT,
                mapPack: _GLBConfig.mapPack,
            }
            this.userInitAlike(map);
        }
        // console.log("游戏玩家列表", GLB._GLBConfig.playerUserIds.sort());
        this.userInit();
        let event = {
            action: _GLBConfig.USER_INIT,
            mePlayerIndex: _GLBConfig.myIndex,
            nickName: _GLBConfig.myInfo.nickName,
            slimeIndex: _GLBConfig.myInfo.slimeIndex,
            photo: _GLBConfig.userInfo.avatar,
        };
        this.userInitAlike(event);
    },
    userInit() {
        _GLBConfig.myIndex = _GLBConfig.playerUserIds.indexOf(_GLBConfig.myId);
        _GLBConfig.playerNum = _GLBConfig.playerUserIds.length;
        // 防止单机模式下的情况
        _GLBConfig.myIndex = _GLBConfig.myIndex == -1 ? 0 : _GLBConfig.myIndex;
        _GLBConfig.playerNum = _GLBConfig.playerNum == 0 ? 1 : _GLBConfig.playerNum;

        _GLBConfig.playerName[_GLBConfig.myIndex] = _GLBConfig.myInfo.nickName;
        _GLBConfig.slime[_GLBConfig.myIndex] = _GLBConfig.myInfo.slimeIndex;
        _GLBConfig.photo[_GLBConfig.myIndex] = _GLBConfig.userInfo.avatar;
        console.log("进入场景前：", _GLBConfig.myIndex, _GLBConfig.playerNum, _GLBConfig.playerName, _GLBConfig.slime);
    },

    changeScene: function () {
        console.log('进入场景');
        cc.director.loadScene('NewGameScene_Horizontal');
    },

    setCurrentType(gameType) {
        window.GameType.currentType = gameType;
    },

    update(dt) {
        this.UpLoginUserInfo(dt);
    },
    UpLoginUserInfo(dt) {
        if (this.loginStar) {
            this.loginMaskBar.progress = cc.misc.lerp(this.loginMaskBar.progress, 1, dt * 5);
            if (this.loginMaskBar.progress >= 0.99) {
                if (_GLBConfig.playerNum == 1) {
                    this.changeScene();
                } else {
                    console.log(_GLBConfig.joinArr.length, _GLBConfig.playerUserIds.length);
                    if (_GLBConfig.joinArr.length == _GLBConfig.playerUserIds.length) {
                        this.userPlayInfo();
                        this.changeScene();
                    }
                }
            }
        }
    },
    userPlayInfo() {
        _GLBConfig.myIndex = _GLBConfig.playerUserIds.indexOf(_GLBConfig.myId);
    },
    SetSlime(event, val) {
        switch (val) {
            case '1':
                _GLBConfig.myInfo.slimeIndex++;
                break;
            case '-1':
                _GLBConfig.myInfo.slimeIndex--;
                break;
            default:
                break;
        }
        if (_GLBConfig.myInfo.slimeIndex > this.slimeArr.length - 1) {
            _GLBConfig.myInfo.slimeIndex = 0;
        } else if (_GLBConfig.myInfo.slimeIndex < 0) {
            _GLBConfig.myInfo.slimeIndex = this.slimeArr.length - 1;
        }
        this.slimeSprite.spriteFrame = this.slimeArr[_GLBConfig.myInfo.slimeIndex];
    }
});