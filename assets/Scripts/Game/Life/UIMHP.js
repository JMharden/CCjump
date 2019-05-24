cc.Class({
    extends: cc.Component,

    properties: {
        HP:{
            default:null,
            type:cc.Node,
        },
        hpWidth:cc.Integer,
        hpData:{
            default:null,
            type:cc.Label,
        },
        MP:{
            default:null,
            type:cc.Node,
        },
        mpWidth:cc.Integer,
        mpData:{
            default: null,
            type:cc.Label,
        },

        PD:{
            default:null,
            type:cc.Object,
        }
    },
    onLoad(){
        this.hpWidth=this.HP.width;
        this.mpWidth=this.MP.width;
    },
    start(){
        this.SetMHP();
    },
    update(){
        if (this.HP.width!==(this.PD.hp/this.PD.maxHp)*this.hpWidth||this.MP.width!==(this.PD.mp/this.PD.maxMp)*this.mpWidth){
            this.SetMHP();
        }
    },
    SetMHP(){
        this.hpData.string=this.PD.hp+'/'+this.PD.maxHp;
        this.mpData.string=this.PD.mp+'/'+this.PD.maxMp;

        this.HP.width=(this.PD.hp/this.PD.maxHp)*this.hpWidth;
        this.MP.width=(this.PD.mp/this.PD.maxMp)*this.mpWidth;
    },

});
