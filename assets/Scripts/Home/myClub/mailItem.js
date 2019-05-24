cc.Class({
    extends: cc.Component,

    properties: {
        data: "",
        icon: cc.Sprite,
        title: cc.Label,
        time: cc.Label,
        nextPre: cc.Prefab,
    },

    start() {
        console.log("看看",this.data);
        // this.icon.Sprite
        this.title.string = this.data.type || 'null';
        var str = this.data.time || "null";
        str = str.split(' ');//先按照空格分割成数组
        str.pop();//删除数组最后一个元素
        str = str.join(' ');//在拼接成字符串
        this.time.string = str;
    },

    showInfo(){
        let item = cc.instantiate(this.nextPre);
        item.getComponent("mailItemInfo").data = this.data;
        item.parent = this.node;
    }
    // update (dt) {},
});
