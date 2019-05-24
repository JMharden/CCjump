cc.Class({
    extends: cc.Component,

    properties: {
        GD:{
            default:null,
            type:cc.Object,
        },
        ani:{
            default:null,
            type:cc.Animation,
        },
        electricCollider:{
            default:null,
            type:cc.Collider,
        }
    },
    start () {
        let self=this;
        this.ani.atk1=function () {
            self.electricCollider.enabled=true;
        };
        this.ani.atk2=function () {
            self.electricCollider.enabled=false;
            self.electricCollider.enabled=true;
        };
        // this.ani.atk3=function () {
        //     self.electricCollider.enabled=false;
        //     self.electricCollider.enabled=true;
        // };
        this.ani.atk4=function () {
            self.electricCollider.enabled=false;
            self.electricCollider.enabled=true;
        };
        this.ani.atk5=function () {
            self.electricCollider.enabled=false;
        };
        this.ani.playEnd=function () {
            this.node.active=false;
            self.GD.SceneEventInt--;
        };
    },
});
