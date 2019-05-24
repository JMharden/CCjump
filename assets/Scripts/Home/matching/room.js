var mvs = require('Mvs');
import { _GLBConfig, _GLBFun } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        val: '',
        playUserlist: cc.Node,
        photo: cc.Prefab,
        progress: cc.Node,
        progressList: cc.Node,
        userInfo: cc.Prefab,
        startGame: cc.Node,
        photoList: [],
        userInfoList: [],
        HC: '',
        room:cc.Prefab,
        loading:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.HC = this.node.parent.parent.getComponent("homeC");
        console.log(cc.find('homeControll'),this.node.parent.parent);
        console.log(this.HC);
    },

    start() {

    },
    
    leaveRoom() {
        this.node.destroy();
        let userInfo = {
            photo: _GLBConfig.myInfo.avatarUrl,
            name: _GLBConfig.myInfo.nickName,
            slime: _GLBConfig.myInfo.slimeIndex,
            probability: _GLBConfig.myInfo.probability,
        }
        userInfo = JSON.stringify(userInfo);
        var result = mvs.engine.leaveRoom(userInfo);
        console.log("leaveRoom result" + result);
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
    showRoomOwner(type) {
        if (type) {
            this.startGame.active = true;
        } else {
            this.startGame.active = false;
        }
    },
    setRoomPlayerList() {
        this.playUserlist.removeAllChildren();
        for (let i = 0; i < _GLBConfig.photo.length; i++) {
            let item = cc.instantiate(this.photo);
            _GLBConfig.photoList.push(item);
            let js = item.getComponent('photo');
            console.log(_GLBConfig.photo[i]);
            js.showPhoto(_GLBConfig.photo[i]);
            item.parent = this.playUserlist;
        };
        // this.room.active = true;
    },
    addRoomPlayerList(url) {
        let item = cc.instantiate(this.photo);
        _GLBConfig.photoList.push(item);
        let js = item.getComponent('photo');
        js.showPhoto(url);
        item.parent = this.playUserlist;
    },
    removeRoomPlayerList(key) {
        let listNode = this.playUserlist.children;
        console.log(listNode);
        listNode[key].destroy();
    },

    ok() {
        if (_GLBConfig.photo.length < 2) {
            _GLBFun.TipsShow('请等待对手加入');
        } else {
            let result = mvs.engine.joinOver("关闭房间");
            this.HC.loadCallback();
            let event = {
                action: _GLBConfig.START_GAME,
                // mePlayerIndex: GLB._GLBConfig.myIndex,
                playerUserIds: _GLBConfig.playerUserIds,
                playerName: _GLBConfig.playerName,
                slime: _GLBConfig.slime,
                photo: _GLBConfig.photo,
            };
            this.userInitAlike(event);
            this.showUserInfo();
            this.ok = function () { };
        }

    },
    showUserInfo() {
        this.progress.active = true;
        this.progressList.removeAllChildren();
        for (let i = 0; i < _GLBConfig.playerUserIds.length; i++) {
            let item = cc.instantiate(this.userInfo);
            let js = item.getComponent('userInfo');
            let obj = {
                // slimeLv : ,
                slime: _GLBConfig.slime[i],
                userName: _GLBConfig.playerName[i],
            }
            js.creater(obj);
            this.userInfoList.push(item);
            item.parent = this.progressList;
        }
    },
    loadingReady(val) {
        console.log('我是第几个：', val);
        let js = this.userInfoList[val].getComponent('userInfo');
        console.log(js);
        js.loadingType.string = '加载完成';
    },
    userInitAlike(event) {
        let arr = _GLBConfig.playerUserIds.concat();
        let index = arr.indexOf(_GLBConfig.myId);
        if (index > -1) {
            arr.splice(index, 1);
        }
        let result = mvs.engine.sendEventEx(0, JSON.stringify(event), 0, arr);
        if (!result || result.result !== 0)
            return console.error('用户信息同步失败');
    }

    // update (dt) {},
});
