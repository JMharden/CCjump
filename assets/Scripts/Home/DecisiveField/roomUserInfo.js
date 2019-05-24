import{ _GLBConfig,_GLBFun} from 'GLBConfig';
cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
        photo:cc.Sprite,
        userName: cc.Label,
        winProbability: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        _GLBFun.showImg(this.data.photo,this.photo);
        this.userName.string = this.data.name;
        this.winProbability.string = this.data.probability;
    },

    // update (dt) {},
});
