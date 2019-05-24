cc.Class({
    extends: cc.Component,

    properties: {
       slimeLv: cc.Label,
       slimeSprite: cc.Sprite,
       slime:{
           default:[],
           type:cc.SpriteFrame,
       },
       userName: cc.Label,
       loadingType: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    creater(obj){
        // this.slimeLv.string = obj.slimeLv;
        this.slimeSprite.spriteFrame = this.slime[obj.slime];
        this.userName.string = obj.userName;
    }

    // update (dt) {},
});
