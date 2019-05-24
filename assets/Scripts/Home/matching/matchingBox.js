var mvs = require('Mvs');
import { _GLBConfig, _GLBFun } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        val: "",
        photo: cc.Prefab,
        progress: cc.Node,
        progressList: cc.Node,
        userInfo: cc.Prefab,
        HC: '',
        room:cc.Prefab,
        roomNode: cc.Node,
        roomJS: null,
        loading:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        mvs.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        mvs.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
        mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this);
        mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        this.roomNode = cc.instantiate(this.room);
        this.roomJS = this.roomNode.getComponent('room');
    },

    start() {

    },
    close() {
        this.node.destroy();
    },
    joinRoomResponse: function (status, userInfoList, roomInfo) {
        if (status !== 200) {
            _GLBFun.TipsShow('进入房间失败,错误码: ' + status);
            return console.log('进入房间失败,错误码: ' + status);
        } else {
            console.log('房间号: ' + roomInfo.roomID);

            _GLBConfig.playerUserIds = [];
            _GLBConfig.playerName = [];
            _GLBConfig.slime = [];
            _GLBConfig.photo = [];

            //判断排队队列中有没有对应的玩家，如果是自己创建的话，本就是空房间不需要push房间玩家id
            for (let i = 0; i < userInfoList.length; i++) {
                let obj = JSON.parse(userInfoList[i].userProfile);
                _GLBConfig.playerUserIds.push(userInfoList[i].userID);
                _GLBConfig.playerName.push(obj.name);
                _GLBConfig.slime.push(obj.slime);
                _GLBConfig.photo.push(obj.photo);
            }
            _GLBConfig.playerUserIds.push(_GLBConfig.myId);
            _GLBConfig.playerName.push(_GLBConfig.myInfo.nickName);
            _GLBConfig.slime.push(_GLBConfig.myInfo.slimeIndex);
            _GLBConfig.photo.push(_GLBConfig.myInfo.avatarUrl);
            this.setRoomPlayerList();

        }
        //发送准备信息给gameServer
        this.gameReady();
        if (roomInfo.owner == _GLBConfig.myId) {
            _GLBConfig.isRoomOwner = true; //设置谁是房主
            this.roomJS.showRoomOwner(true);
        } else {
            _GLBConfig.isRoomOwner = false;
            this.roomJS.showRoomOwner(false);
        }
        
    },
    joinRoomNotify: function (roomUserInfo) {
        let obj = JSON.parse(roomUserInfo.userProfile);
        console.log('进来玩家的信息', obj);
        if (_GLBConfig.playerUserIds.indexOf(roomUserInfo.userID) === -1) {
            _GLBConfig.playerUserIds.push(roomUserInfo.userID);
            _GLBConfig.playerName.push(obj.name);
            _GLBConfig.slime.push(obj.slime);
            _GLBConfig.photo.push(obj.photo);
            this.roomJS.addRoomPlayerList(obj.photo);
        }
        this.socketInfo(_GLBConfig.SCENE_READY);
    },
    leaveRoomResponse: function (leaveRoomRsp) {
        if (leaveRoomRsp.status === 200) {
            _GLBFun.TipsShow("离开房间成功");
        } else {
            console.log("离开房间失败" + leaveRoomRsp.status);
        }
    },
    leaveRoomNotify: function (leaveRoomInfo) {
        if (leaveRoomInfo.owner == _GLBConfig.myId) {
            this.roomJS.showRoomOwner(true);
        }
        let index = _GLBConfig.playerUserIds.indexOf(leaveRoomInfo.userID);
        _GLBConfig.playerUserIds.splice(index, 1);
        _GLBConfig.playerName.splice(index, 1);
        _GLBConfig.slime.splice(index, 1);
        _GLBConfig.photo.splice(index, 1);
        console.log(_GLBConfig.slime);
        this.roomJS.removeRoomPlayerList(index);
    },
    socketInfo(type, val) {
        let event = {
            action: type,
            score: val || '',
        };
        let arr = _GLBConfig.playerUserIds.concat();
        let index = arr.indexOf(_GLBConfig.myId);
        if (index > -1) {
            arr.splice(index, 1);
        }
        let result = mvs.engine.sendEventEx(0, JSON.stringify(event), 0, arr);
        if (!result || result.result !== 0) {
            return console.error('用户信息同步失败');
        }
    },
    gameReady: function () {
        var event = {
            action: _GLBConfig.GAME_READY
        };

        var result = mvs.engine.sendEventEx(1, JSON.stringify(event), 0, _GLBConfig.playerUserIds);
        if (result.result !== 0)
            return console.log('发送游戏准备通知失败，错误码' + result.result);
        _GLBConfig.events[result.sequence] = event;
        console.log("发起游戏开始的通知，等待回复");
    },
    selectMoney(event, val) {
        this.val = val;
        console.log(this.val);
    },
    yuleReady() {
        console.log("娱乐模式");
        this.goMatchingRoom(true);
    },
    jingjiReady() {
        console.log("竞技模式");
        this.goMatchingRoom(false);
    },
    userInit() {
        _GLBConfig.playerUserIds = [];
        _GLBConfig.playerName = [];
        _GLBConfig.slime = [];
        _GLBConfig.photo = [];

        _GLBConfig.playerUserIds.push(_GLBConfig.myId);
        _GLBConfig.playerName.push(_GLBConfig.myInfo.nickName);
        _GLBConfig.slime.push(_GLBConfig.myInfo.slimeIndex);
        _GLBConfig.photo.push(_GLBConfig.myInfo.avatarUrl);
    },
    goMatchingRoom(type) {
        if (_GLBConfig.playerNum !== 1) {
            let matchinfo = new mvs.Matchvs.MsMatchInfo();
            console.log(matchinfo);
            matchinfo.maxPlayer = 10;
            matchinfo.canWatch = 2;
            matchinfo.visibility = 1;
            if (type) {//娱乐模式
                // matchinfo.roomProperty = '娱乐模式';
                matchinfo.mode = 1;
                // matchinfo.tags = { "grade": '青铜' };//不进行段位匹配了
            } else {//竞技模式
                matchinfo.mode = 2;
                // if (_GLBConfig.myId == '4229493'){
                //     var obj = {
                //         "grade": '白银',
                //         "money": this.val || "1",
                //     }
                // }
                let obj = {
                    "grade": _GLBConfig.myInfo.grade,
                    "money": this.val || "1",
                }
               
                matchinfo.tags = obj;
                matchinfo.roomProperty = JSON.stringify(obj);
            }
            let userInfo = {
                photo: _GLBConfig.myInfo.avatarUrl,
                name: _GLBConfig.myInfo.nickName,
                slime: _GLBConfig.myInfo.slimeIndex,
                probability: _GLBConfig.myInfo.probability,
            }
            userInfo = JSON.stringify(userInfo);
            var result = mvs.engine.joinRoomWithProperties(matchinfo, userInfo);
            // debugger;
            if (result === 0) {
                // GLB._GLBConfig.playerUserIds = [GLB._GLBConfig.myId];
                // console.log(GLB._GLBConfig.playerUserIds);
            }
        };
    },
    setRoomPlayerList() {
        this.roomNode = cc.instantiate(this.room);
        this.roomJS = this.roomNode.getComponent('room');
        this.roomNode.parent = this.node;
        this.roomJS.setRoomPlayerList();
    },

    // update (dt) {},
});
