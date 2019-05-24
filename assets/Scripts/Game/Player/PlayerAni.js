cc.Class({
    extends: cc.Component,

    properties: {
        playerAni:{
            default:null,
            type:cc.Animation,
        },
        shadowAni:{
            default:null,
            type:cc.Animation,
        },
        electric_hurt:{
            default:null,
            type:cc.Animation,
        },
        hurt:{
            default:null,
            type:cc.Animation,
        },
        hurtData:{
            default:null,
            type:cc.Label,
        },
        hurtDataAni:{
            default:null,
            type:cc.Animation,
        },
        cure:{
            default:null,
            type:cc.ParticleSystem,
        },
    },
    start () {
        let self=this;
        this.playerAni.playStart=function () {
            self.shadowAni.play('jumpShadow');
        };
        this.playerAni.outDown=function () {
            self.shadowAni.node.active=false;
            self.node.zIndex=-1;
        };
        // this.hurtDataAni.playEnd=function () {
        //     self.hurtDataAni.node.active=false;
        // };
    },
});
