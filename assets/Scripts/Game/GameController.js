cc.Class({
    extends: cc.Component,
    properties: {
        GD:{
            visible: false,
            default:null,
            type:cc.Object,
        },//游戏数据
        AN:{
            visible: false,
            default:null,
            type:cc.Object,
        },//资源节点
        GM:{
            visible: false,
            default:null,
            type:cc.Object,
        },//游戏管理
    },
    onLoad () {
        this.GD=cc.find("GameData").getComponent("GameData");
        this.AN=cc.find("AssetsNode").getComponent("AssetsNode");
        this.GM=cc.find("GameManager").getComponent("GameManager");
    },
    start(){
        this.AN.lBtn.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'Move',-1,);
        });
        this.AN.rBtn.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'Move',1,);
        });

        this.AN.l2Jump.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'TwoJump',-1,);
        });
        this.AN.r2Jump.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'TwoJump',1,);
        });
        this.AN.l3Jump.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'ThreeJump',-1,);
        });
        this.AN.r3Jump.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'ThreeJump',1);
        });

        this.AN.skillButton.node.on(cc.Node.EventType.TOUCH_START,  (event) => {
            this.GM.Click(this.GD.mePlayerIndex,'Skill',);
        });
    }
});
