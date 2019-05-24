cc.Class({
    extends: cc.Component,

    properties: {
        ani:{
            default:null,
            type:cc.Animation,
        },
        skillCollider:{
            default:null,
            type:cc.Collider,
        }

    },
    start(){
        let self=this;
        this.ani.playStart=function () {
            self.skillCollider.enabled=false;
        };
        this.ani.playEnd=function () {
            self.node.destroy();
        };
    }

});
