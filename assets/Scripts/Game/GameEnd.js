cc.Class({
    extends: cc.Component,

    properties: {
        UM:{
           default:null,
           type:cc.Object,
        },
        ani:{
            default:null,
            type:cc.Animation
        },
        toHome:{
            default: null,
            type: cc.Button,
        },
        watch:{
            default: null,
            type: cc.Button,
        },
        score:{
            default:null,
            type:cc.Label,
        },
    },
    start () {
        this.ani.play();
        this.toHome.node.on(cc.Node.EventType.TOUCH_END,  (event) => {
             this.ToHome();
        });
    },
    ToHome(){
        cc.director.loadScene('Home');
    },
});
