var GLB = require('GLBConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        targetNode: cc.Sprite,
    },

    start () {

    },

    close(){
        this.node.destroy();
    },
    ok(){
        // this.node.destroy();
        // let name = sessionStorage.getItem('imgBaseName');
        // let url = sessionStorage.getItem(name);
        // GLB._GLBFun.showImg(url, this.targetNode);
    },

    // update (dt) {},
});
