
cc.Class({
    extends: cc.Component,

    properties: {
        AN:{
            default:null,
            type:cc.Object,
        },//节点资源
        VS:{
            default:null,
            type:cc.Object,
        },//显示图像
        GM:{
            default:null,
            type:cc.Object,
        },//游戏管理
    },

    onLoad () {
        this.AN=cc.find("AssetsNode").getComponent("AssetsNode");
        this.VS=cc.find("ViewShow").getComponent("ViewShow");
        this.GM=cc.find("GameManager").getComponent("GameManager");
    },
});
