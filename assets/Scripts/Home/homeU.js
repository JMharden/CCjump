import { _GLBConfig, _GLBFun } from 'GLBConfig';
var mvs = require('Mvs');
cc.Class({
    extends: cc.Component,

    properties: {
        photo: cc.Sprite,
        currentGameType: 1,
        club: cc.Node,
        clubInfo: cc.Prefab,
        joinClubBox: cc.Node,
        creatorClubBox: cc.Node,
        currentModel: "",
        club_name: cc.EditBox,
        declaration: cc.EditBox,
        clubPhoto: cc.Sprite,
        province: cc.Label,
        city: cc.Label,
        clubList: cc.Node,
        clubInit: cc.Prefab,
        search_club_name: cc.EditBox,
        webView: cc.Node,
        pageViewNode: cc.PageView,
        homeC: "",
        Tips: cc.Prefab,
        userInfo: cc.Node,
        slimePavilion: cc.Node,
        决胜场: cc.Node,
        活动: cc.Node,
        钱包: cc.Node,
        设置: cc.Node,
        我的信息: cc.Node,
        排行榜: cc.Node,
        反馈: cc.Node,
        candy: cc.Label,
        candy1: cc.Label,
        candy2: cc.Label,
        slimePavilionList: cc.Node,
        slimeInfo: cc.Prefab,
        //史莱姆馆
        pkMoney: cc.Label,
        battingAverage: cc.Label,
        LVField: cc.Label,
        roomPlayUserList: cc.Node,
        roomPlayUserInfo: cc.Prefab,
        roomID: '',
        //反馈
        faadBackContent: cc.EditBox,
        faadBackIS: true,
        faadBackTime: 60,
    },

    onLoad() {
        mvs.response.getRoomListResponse = this.getRoomListResponse.bind(this);
        mvs.response.getRoomDetailResponse = this.getRoomDetailResponse.bind(this);
    },
    start() {
        this.homeC = this.node.getComponent("homeC");
    },
    sss(event) {
        console.log(event);
        event.currentTarget.destroy();
        this.webView.destroy();
    },

    changeScene: function () {
    },
    getRoomList() {
        var createRoom = new mvs.Matchvs.MsCreateRoomInfo();
        createRoom.maxPlayer = 10;
        createRoom.mode = 2;
        createRoom.canWatch = 1;
        createRoom.roomProperty = _GLBConfig.myInfo.grade;
        var result = mvs.engine.getRoomList(createRoom, "I Love China");
        console.log("createRoom result" + result);
    },
    joinRoom() {
        console.log(this.roomID);
        var result = mvs.engine.joinRoom(this.roomID, "I Love China");
        console.log("加入指定房间 result" + result);
    },
    getRoomListResponse: function (status, roomInfo) {
        if (status == 200) {
            console.log("获取房间列表成功");
            let roomList = [];
            for (let i = 0; i < roomInfo.length; i++) {
                if (roomInfo[i].mode == 2) {
                    let obj = JSON.parse(roomInfo[i].roomProperty);
                    console.log('看看obj', obj);

                    if (obj.grade == _GLBConfig.myInfo.grade) {
                        roomList.push(roomInfo[i]);
                    }
                }
            }
            let num = roomList.length;
            if (num > 0) {
                let randomNum = this.returnRandom(0, num);
                this.roomID = roomList[randomNum].roomID;
                var result = mvs.engine.getRoomDetail(this.roomID);
                console.log("获取房间详情 result" + result);
            } else {
                _GLBFun.TipsShow('暂无房间可匹配');
            }

        } else {
            console.log("获取房间列表失败 status：" + status);
        }
    },
    getRoomDetailResponse: function (rsp) {
        if (rsp.status === 200) {
            console.log("获取房间详情成功");
            console.log('房间详情', rsp);
            let roomObj = JSON.parse(rsp.roomProperty);
            var battingAverage = '';
            this.roomPlayUserList.removeAllChildren();
            for (let i = 0; i < rsp.userInfos.length; i++) {
                let obj = JSON.parse(rsp.userInfos[i].userProfile);
                console.log(obj);
                var str = obj.probability;
                var reg = new RegExp("%");
                var str = str.replace(reg, "");
                battingAverage += str;
                let item = cc.instantiate(this.roomPlayUserInfo);
                item.getComponent('roomUserInfo').data = obj
                item.parent = this.roomPlayUserList;
            }
            this.pkMoney.string = roomObj.money;
            console.log(battingAverage, rsp.userInfos.length);
            this.battingAverage.string = battingAverage / rsp.userInfos.length + '%';
            this.LVField.string = roomObj.grade + '场';
            this.决胜场.active = true;
        } else {
            console.log("获取房间详情失败 status " + rsp.status);
        }
    },
    returnRandom(min, max) {
        let choices = max - min;
        return Math.floor(Math.random() * choices + min);
    },//返回两个数之间的随机整数
    gameTypeBtnFun(event, val) {
        this.currentGameType = val;
        _GLBConfig.playerNum = val;
        console.log(_GLBConfig.playerNum);
        let arr = event.target.parent.children;
        for (let i = 0; i < 4; i++) {
            // console.log(arr[i].getChildByName('index'));
            arr[i].getChildByName('index').getComponent(cc.Sprite).enabled = false;
        }
        event.target.getChildByName('index').getComponent(cc.Sprite).enabled = true;
    },
    scroll(event, val) {
        // console.log(event,val);
    },
    setCandy(data) {
        this.candy.string = data.candy;
        this.candy1.string = data.candy1;
        this.candy2.string = data.candy2;
    },
    modelShow(event, val) {
        // eval("this." + val).active = true; //兼容性不支持小程序
        switch (val) {
            case 'userInfo':
                this.userInfo.active = true;
                break;
            case 'slimePavilion':
                _GLBFun.ajax({
                    url: '/api.php?m=Index&c=index&a=slime',
                    success: (res) => {
                        console.log(res);
                        this.candy.string = res.candy.candy;
                        this.candy1.string = res.candy.candy1;
                        this.candy2.string = res.candy.candy2;
                        this.slimePavilionList.removeAllChildren();
                        for (let i = 0; i < res.data.length; i++) {
                            let item = cc.instantiate(this.slimeInfo);
                            item.getComponent('slimeInfo').data = res.data[i];
                            item.getComponent('slimeInfo').candtList = res.candy;

                            this.slimePavilionList.addChild(item);
                        }
                    }
                });
                this.slimePavilion.active = true;
                break;
            case '决胜场':
                this.getRoomList();
                break;
            case '活动':
                this.活动.active = true;
                break;
            case '钱包':
                this.钱包.active = true;
                break;
            case '设置':
                this.设置.active = true;
                break;
            case '我的信息':
                this.我的信息.active = true;
                break;
            case '排行榜':
                this.排行榜.active = true;
                break;
            case '反馈':
                this.反馈.active = true;
                break;
            default:
                console.log('错误的打开方式');
                break;
        }
    },
    modelClose(event, val) {
        // eval("this." + val).active = false;
        switch (val) {
            case 'userInfo':
                this.userInfo.active = false;
                break;
            case 'slimePavilion':
                this.slimePavilion.active = false;
                break;
            case '决胜场':
                this.决胜场.active = false;
                break;
            case '活动':
                this.活动.active = false;
                break;
            case '钱包':
                this.钱包.active = false;
                break;
            case '设置':
                this.设置.active = false;
                break;
            case '我的信息':
                this.我的信息.active = false;
                break;
            case '排行榜':
                this.排行榜.active = false;
                break;
            case '反馈':
                this.反馈.active = false;
                break;
            default:
                console.log('错误的关闭方式');
                break;
        }
    },
    IisClub(event, val) {
        if (_GLBConfig.myInfo.club_id == 0) {
            // this.modelShow(event, 'club');
            let tips = cc.instantiate(this.Tips).getComponent('Tips');
            tips.node.parent = this.node.parent;
            let Btn = tips.JoinClub();
            tips.AddClickEvents(Btn.createBtn, this.node, 'homeU', 'showCreatorClubInfo');
            tips.AddClickEvents(Btn.joinBtn, this.node, 'homeU', 'showJoinClubInfo');
        } else {
            let item = cc.instantiate(this.clubInfo);
            item.parent = this.node.parent;
        }
    },
    showCreatorClubInfo() {
        // _GLBFun.showImg(_GLBConfig.myInfo.avatarUrl, this.clubPhoto);
        // this.province.string = _GLBConfig.myInfo.province;
        // this.city.string = _GLBConfig.myInfo.city;


        let tips = cc.instantiate(this.Tips).getComponent('Tips');
        tips.node.parent = this.node.parent;
        tips.CreateClub();
    },
    showJoinClubInfo() {
        // this.clubList.removeAllChildren();
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubs',
            success: (res) => {
                console.log(res.data);
                let tips = cc.instantiate(this.Tips).getComponent('Tips');
                tips.node.parent = this.node.parent;
                tips.ApplyJoinClubList(res.data);
            }
        })
    },
    showEmail() {
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=clubRecords',
            success: (res) => {
                let tips = cc.instantiate(this.Tips).getComponent('Tips');
                tips.node.parent = this.node.parent;
                let emailArr = [[], []];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].category == 1) {
                        emailArr[0].push(res.data[i]);
                    } else if (res.data[i].category == 2) {
                        emailArr[1].push(res.data[i]);
                    }
                }
                tips.Mail(emailArr);
            }
        })
    },
    handleEmail(event, data) {
        let obj = JSON.parse(data);
        console.log(obj);
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=handle',
            data: {
                type: obj.type,
                msgId: obj.id,
            },
            success: (res) => {
                console.log(res);
            }
        })
    },
    changeEmail(event, data) {
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=readEmail',
            data: {
                msgId: data,
            },
            success: (res) => {
            }
        })
    },
    delEmail(event, data) {
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=delEmail',
            data: {
                msgId: data,
            },
            success: (res) => {
                console.log(res);
            }
        })
    },
    sendJoinClub(event, data) {
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=joinClub',
            data: {
                club_id: data,
            },
            success: (res) => {
                console.log(res.data, res.data == null);
                if (res.data) {
                    let tips = cc.instantiate(this.Tips).getComponent('Tips');
                    tips.node.parent = this.node.parent;
                    tips.ApplyJoinClubList(res.data);
                    _GLBConfig.TipsShow('申请成功，请等待管理员同意');
                } else {
                    _GLBConfig.TipsShow(res.msg);
                }

            }
        })

    },
    creatorClub(event, val) {
        console.log(val.string);
        if (val.string) {
            _GLBFun.ajax({
                url: '/api.php?m=Api&c=Index&a=createClub',
                data: {
                    club_name: val.string,
                },
                success: (res) => {
                    console.log(res);
                    _GLBConfig.TipsShow(res.msg);
                },
            })
        } else {
            _GLBConfig.TipsShow("请仔细检查，不能留空");
        }
    },
    search() {
        this.clubList.removeAllChildren();
        console.log(this.search_club_name.string);
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubs',
            data: {
                club_name: this.search_club_name.string
            },
            success: (res) => {
                console.log(res);
                for (let i = 0; i < res.data.length; i++) {
                    let item = cc.instantiate(this.clubInit);
                    item.getComponent('clubInit').init(res.data[i]);
                    this.clubList.addChild(item);
                }
            }
        })
    },
    pageViewFun(event) {
        let index = event.getCurrentPageIndex();
        _GLBConfig.myInfo.slimeIndex = index;
    },
    SetSlime(event, val) {
        let index = this.pageViewNode.getCurrentPageIndex();
        switch (val) {
            case '1':
                this.pageViewNode.setCurrentPageIndex(++index);
                _GLBConfig.myInfo.slimeIndex = this.pageViewNode.getCurrentPageIndex();
                break;
            case '-1':
                this.pageViewNode.setCurrentPageIndex(--index);
                _GLBConfig.myInfo.slimeIndex = this.pageViewNode.getCurrentPageIndex();
                break;
            default:
                break;
        }
    },
    faadBackOk() {
        let str = this.faadBackContent.string;
        if(str){
            if (this.faadBackIS) {
                this.faadBackIS = false;
                this.UpTime();
                _GLBFun.ajax({
                    url: '/api.php?m=Index&c=index&a=feedback',
                    data: {
                        content: str,
                    },
                    success: (res) => {
                        console.log(res);
                        _GLBFun.TipsShow(res.msg);
                    }
                })
            } else {
                _GLBFun.TipsShow('请在' + this.faadBackTime + '秒后点击');
            }
        }else{
            _GLBFun.TipsShow('不能为空哦');
        }
        
    },
    UpTime() {
        var one = setInterval(() => {
            this.faadBackTime--;
            if (this.faadBackTime == 0) {
                this.faadBackIS = true;
                clearInterval(one);
                this.faadBackTime = 60;
            }
        }, 1000);
    }
    // update (dt) {},
});
