cc.Class({
    extends: cc.Component,

    properties: {
        AN:{
            default:null,
            type:cc.Object,
        },
        GD:{
            default: null,
            type: cc.Object,
        },
        GM:{
            default: null,
            type: cc.Object,
        },
    },

    onLoad () {
        this.AN=cc.find("AssetsNode").getComponent("AssetsNode");
        this.GD=cc.find("GameData").getComponent("GameData");
        this.GM=cc.find("GameManager").getComponent("GameManager");
        //mvs.GameLogin();
    },

    start () {
    },
    UiState(val){
        if(val === 0){

        }else if(val===1){

        }else if(val===2){
            this.GameOverShow();
            console.log("GameOver");
        }else{
            console.log("GameState null");
        }

    },

    GameOverShow(){
        this.AN.GameOver.active=true;
        this.AN.scoreLabel.string = "分数:" + this.GM.PM[this.GD.mePlayerIndex].PD.score;
    },//GameOver显示画面

    Ranking() {
        for (let i = 0; i < 3 && i < this.GD.maxPlayerNumber; i++) {
            this.AN.rankingName[i].string = this.GD.rankingData[i].playerName;
            this.AN.rankingScore[i].string = this.GD.rankingData[i].score;
        }
        this.AN.meRank.string = this.GM.PM[this.GD.mePlayerIndex].PD.rank + 1;
        this.AN.maxPlayerNumber.string = '/' + this.GD.maxPlayerNumber;
    },
});
