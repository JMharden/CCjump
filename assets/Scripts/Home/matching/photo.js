var GLB = require('GLBConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        photo: cc.Sprite,
    },

    onLoad() {

    },
    showPhoto(url){
        GLB._GLBFun.showImg(url, this.photo);
    },

});
