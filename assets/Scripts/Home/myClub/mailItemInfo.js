cc.Class({
    extends: cc.Component,

    properties: {
       data: '',
       title: cc.Label,
       content: cc.Label,
    },

    // onLoad () {},

    start () {
        console.log(this.data);
        this.title.string = this.data.type || 'null';
    },

    // update (dt) {},
});
