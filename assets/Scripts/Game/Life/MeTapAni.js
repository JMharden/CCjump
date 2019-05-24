cc.Class({
    extends: cc.Component,

    properties: {
        topAni:{
            default:null,
            type:cc.Animation,
        }

    },
    onLoad () {
        let  self=this;
        this.topAni.playEnd=function () {
            self.topAni.play('tapAni');
        }
    },
});
