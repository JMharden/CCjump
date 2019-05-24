cc.Class({
    extends: cc.Component,

    properties: {
    },
    onCollisionStay: function (other, self) {
        this.node.opacity=cc.misc.lerp(this.node.opacity,100,0.1);
    },
    onCollisionExit: function (other, self) {
        this.node.opacity=255;
    }
});
