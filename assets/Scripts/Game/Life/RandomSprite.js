
cc.Class({
    extends: cc.Component,

    properties: {
        sprite:{
          default: null,
          type:cc.Sprite,
        },

        spriteFrame:{
            default:[],
            type:[cc.SpriteFrame],
        },

    },
    onLoad () {
        this.RandomSprite();
    },
    RandomSprite(){
        this.sprite.spriteFrame=this.spriteFrame[Math.floor(Math.random()*this.spriteFrame.length)];
    }

});
