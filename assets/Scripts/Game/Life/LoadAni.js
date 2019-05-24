
cc.Class({
    extends: cc.Component,

    properties: {
        loadAni:{
            default:null,
            type:cc.Animation,
        }

    },
    onLoad() {
        let self=this;
        this.loadAni.playOut = function(){
            self.loadAni.play("loadrotate");
        };
    }


});
