cc.Class({
    extends: cc.Component,

    properties: {
        HP:{
            default:null,
            type:cc.Node,
        },
        hpWidth:cc.Integer,
        MP:{
            default:null,
            type:cc.Node,
        },
        mpWidth:cc.Integer,
        PD:{
            default:null,
            type:cc.Object,
        },
    },
    onLoad(){
        this.hpWidth=this.HP.width;
        this.mpWidth=this.MP.width;
    },
    update (dt) {
        if(this.HP.width!==(this.PD.hp/this.PD.maxHp)*this.hpWidth||this.MP.width!==(this.PD.mp/this.PD.maxMp)*this.mpWidth){
            this.SetMHP();
        }
    },
    SetMHP(){
        this.HP.width=(this.PD.hp/this.PD.maxHp)*this.hpWidth;
        this.MP.width=(this.PD.mp/this.PD.maxMp)*this.mpWidth;
    }
});
