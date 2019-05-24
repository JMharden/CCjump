import { _GLBConfig, _GLBFun } from "GLBConfig";
cc.Class({
    extends: cc.Component,

    properties: {
        data: null,
        candtList: null,
        Mask: cc.Node,
        Lv: cc.Label,
        HP: cc.Label,
        MP: cc.Label,
        slime: cc.Sprite,
        slimeName: cc.Label,
        slimeSkill: cc.Label,
        slimeSkillImgBox: cc.Sprite,
        slimeImg: {
            default: [],
            type: cc.SpriteFrame,
        },
        slimeSkillImg: {
            default: [],
            type: cc.SpriteFrame,
        },
        next:cc.Prefab,
        index: '',
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.data.s_id) {
            this.Mask.active = false;
        } else {
            this.Mask.active = true;
        }
        this.Lv.string = this.data.level || 0;
        this.HP.string = this.data.blood || 100;
        this.MP.string = this.data.blue || 100;
        this.slimeName.string = this.data.name || 'null';
        this.slimeSkill.string = this.data.skill || 'null';
        this.index = --this.data.id;
        this.slime.spriteFrame = this.slimeImg[this.index];
        this.slimeSkillImgBox.spriteFrame = this.slimeSkillImg[this.index];
    },

    start() {
       
    },
    openDetails(){
        let node = cc.instantiate(this.next);
        let nodeData = node.getComponent('slimeDetails');
        nodeData.data = this.data;
        nodeData.candtList = this.candtList;
        nodeData.slimeImg = this.slimeImg[this.index]
        nodeData.slimeSkillImg = this.slimeSkillImg[this.index];
        node.parent = cc.find('Canvas');
    }

    // update (dt) {},
});
