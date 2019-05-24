cc.Class({
    extends: cc.Component,

    properties: {
        GD:{
            default:null,
            type:cc.Object,
        },//游戏数据
        obstacle:{
            default:null,
            type:cc.Node,
        },
        ani:{
            default:null,
            type:cc.Animation,
        },

        isOut:true,
        meIndex:0,

    },

    onLoad () {
        this.GD=cc.find("GameData").getComponent("GameData");

        this.meIndex=this.GD.cubeIndex;

        let self=this;
        this.ani.remove = function(){//方块掉下完成后删除自身
            self.obstacle.destroy();
        };
    },

    update (dt) {
        if(this.GD.life>=this.meIndex&&this.isOut) {
            this.ani.play("obstacle_1");
            this.isOut = false;
        }
    },
});
