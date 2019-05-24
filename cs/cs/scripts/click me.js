// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        LButton:{
            default: null,
            type:cc.Button,
        },
        RButton:{
            default: null,
            type:cc.Button,
        },
        bai:{
            default: null,
            type:cc.Node,
        },

        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(this.nc);
        var self = this;
        self.LButton.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.bai.x-=10;
            console.log("L")
        });

        self.RButton.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.bai.x+=10;
            console.log("R")
        });

        // self.nc.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //     console.log("TOUCH_MOVE")
        // });
        //
        // self.nc.node.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     console.log("TOUCH_END")
        // });
    },

    start () {
        // this.bai.x++;
    },

    // update (dt) {},
});
