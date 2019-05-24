cc.Class({
    extends: cc.Component,

    properties: {
        ani:{
            default:null,
            type:cc.Animation,
        },
        door:{
            default:null,
            type:cc.Node,
        },
        targetIndex:0,
    },
    onLoad () {
        let self=this;
        this.ani.playEnd=function () {
            self.ani.play();
        };
    },
    onCollisionEnter: function (other, self) {
        if(other.node.name==='lifeCollider'){
            this.node.destroy();
        }
    },
});
