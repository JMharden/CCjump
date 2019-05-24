let mvs = require('Mvs');
let GLB = require('GLBConfig');
let _SocketGameInfo = {
    mvsBind() {
        mvs.response.sendEventResponse = this.sendEventResponse.bind(this);
        mvs.response.gameServerNotify = this.gameServerNotify.bind(this);//接收gameServer的消息
        // mvs.response.sendEventNotify = this.sendEventNotify.bind(this); // 设置事件接收的回调
        console.log("mvs绑定完成，GLB绑定试试");
    },
    
    userAlike(LR, myIndex) {
        let event = {
            action: GLB._GLBConfig.USER_ALIKE,
            userIndex: myIndex,
            userGameState: LR,
        };
        // let arr = GLB._GLBConfig.playerUserIds;
        // let index = arr.indexOf(GLB.userInfo.id);
        let arr = GLB._GLBConfig.playerUserIds.concat();
        let index = arr.indexOf(GLB._GLBConfig.myId);
        if (index > -1) {
            arr.splice(index, 1);
        }
        let result = mvs.engine.sendEventEx(0, JSON.stringify(event), 0, arr);
        if (!result || result.result !== 0)
            return console.error('用户信息同步失败');
    },
    sendEventResponse(sendEventRsp) {
        if (sendEventRsp.status === 200) {
            console.log("发送消息成功");
        } else {
            console.log("发送消息失败 status" + sendEventRsp.status);
        }
    },
    gameServerNotify(info) {
        console.log("info:", info);
        let obj = JSON.parse(info.cpProto);
        console.log("obj", obj);
        switch (obj.action) {
            case GLB.MAP_INIT:
                GLB._GLBConfig.mapPack = obj.mapPack;
                break;
        }
    },
    startGameData() {
        console.log("看看我被调用了没有");
        GLB._GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=singleGame',
            data: {
                status: 1,
                // uid: GLB._GLBConfig.myInfo.openId,
                mark: GLB._GLBFun.generateUUID(),
                start_time: (new Date()).getTime(),
            },
            success: (res) => {
                console.log("我是单机开始接口回调", res);
            },
        })
    }
};
module.exports = _SocketGameInfo;