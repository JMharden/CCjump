cc.Class({
    extends: cc.Component,

    properties: {
        AN:{
            default:null,
            type:cc.Object,
        },
        GD:{
            default:null,
            type:cc.Object,
        },
    },

    onLoad () {
        this.AN=cc.find("AssetsNode").getComponent("AssetsNode");
        this.GD=cc.find("GameData").getComponent("GameData");
    },

    update (dt) {
    },


});
