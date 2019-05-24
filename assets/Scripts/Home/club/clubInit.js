import { _GLBConfig, _GLBFun } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        clubPhoto: cc.Sprite,
        clubName: cc.Label,
        admName: cc.Label,
        clubActive: cc.Label,
        clubTotal: cc.Label,
        Btn: cc.Button,
        clubID: '',
        next: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.Btn.node.on('click', () => {
            let item = cc.instantiate(this.next);
            // item.getComponent('clubInit');
            item.parent=this.node.parent.parent.parent.parent;
            item.getComponent('clubItenInfo').ID=this.clubID;
            // this.nextNode.addChild(item);
        }, this);
    },

    init(data){
        this.clubID = data.id;
        _GLBFun.showImg(data.club_head,this.clubPhoto);
        this.clubName.string = data.club_name || 'undefined';
        this.admName.string = data.ower_name || 'undefined';
        this.clubActive.string = data.active || 'undefined';
        this.clubTotal.string = data.create_number || 'undefined';
    },

    // update (dt) {},
});
