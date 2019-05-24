cc.Class({
    extends: cc.Component,

    properties: {
        impurity:{
            default:null,
            type:cc.Node,
        },
    },
    onLoad () {
        if (Math.floor(Math.random()*8)!==0)
        {
            this.impurity.destroy();
        }
    },
});
