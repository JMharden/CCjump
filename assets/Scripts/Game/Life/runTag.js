
cc.Class({
    extends: cc.Component,
    properties:{
        moveTag:{
            default:null,
            type:cc.Node,
        },
    },
    onCollisionEnter:function () {
        this.moveTag.active=true;
    },
    onCollisionExit:function () {
        this.moveTag.active=false;
    }
});
