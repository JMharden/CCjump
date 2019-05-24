cc.Class({
    extends: cc.Component,

    properties: {
        slime:{
            default:null,
            type:cc.Animation,
        },
        shadow:{
            default:null,
            type:cc.Animation,
        },

    },
    start(){
        let self=this;
        this.slime.stare = function(){//方块掉下完成后删除自身
            self.shadow.play("slimeshadow_0");
        };

    },
    PlayAni(){
      this.slime.play("homeslime_0");
    },
});
