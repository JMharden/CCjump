import { _GLBConfig, _GLBFun } from "GLBConfig";
cc.Class({
    extends: cc.Component,

    properties: {
        data: null,
        candtList: null,
        HP: cc.Label,
        MP: cc.Label,
        slime: cc.Sprite,
        slimeName: cc.Label,
        Lv: cc.Label,
        slimeSkill: cc.Label,
        slimeSkillImgBox: cc.Sprite,
        SkillDetails: cc.Label,
        slimeImg: cc.SpriteFrame,
        slimeSkillImg: cc.SpriteFrame,
        expBox: cc.Node,
        exp: cc.Label,
        LvUp: cc.Node,
        candy: cc.Sprite,
        candyName: cc.Label,
        candyNum: cc.Label,
        maxCandyNum: cc.Label,
        candyList: {
            default: [],
            type: cc.SpriteFrame,
        },
        slider: cc.Slider,
        candyType: 0,
        homeU: '',
    },
    start() {
        // .getComponent('homeU')
        this.homeU = this.node.parent.getChildByName('homeControll').getComponent('homeU');
        // console.log(this.node.parent.getChildByName('homeControll'),this.homeU);
        this.Lv.string = this.data.level || 0;
        this.HP.string = this.data.blood || 100;
        this.MP.string = this.data.blue || 100;
        this.slimeName.string = this.data.name || 'null';
        this.slimeSkill.string = this.data.skill || 'null';
        this.SkillDetails.string = this.data.skill_introduction || 'null';
        this.exp.string = this.data.exp + '/' + this.data.max_exp || 'null';
        this.expBox.width = 246 * this.data.exp / this.data.max_exp;//246为满

        this.slime.spriteFrame = this.slimeImg;
        this.slimeSkillImgBox.spriteFrame = this.slimeSkillImg;
    },
    close() {
        this.node.destroy();
    },
    LvUpFun(event, data) {
        this.candy.spriteFrame = this.candyList[data];
        this.candyNum.string = 0;
        this.slider.progress = 0;
        this.LvUp.active = true;
        switch (data + '') {
            case '0':
                this.candyName.string = '小糖果';
                this.maxCandyNum.string = this.candtList.candy||0;
                this.candyType = 1;
                break;
            case '1':
                this.candyName.string = '中糖果';
                this.maxCandyNum.string = this.candtList.candy1||0;
                this.candyType = 2;
                break;
            case '2':
                this.candyName.string = '大糖果';
                this.maxCandyNum.string = this.candtList.candy2||0;
                this.candyType = 3;
                break;
            default:
                break;
        }
    },
    hide() {
        this.LvUp.active = false;
    },
    sliderFun(event) {
        this.candyNum.string = parseInt(event.progress * this.maxCandyNum.string);
    },
    LvUpBtn() {
        if (this.candyNum.string==0){
            _GLBFun.TipsShow('请确认自己是否拥有糖果');
            return;
        }
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=upSlime',
            data: {
                s_id: this.data.s_id,
                candy: this.candyNum.string,
                type: this.candyType,
            },
            success: (res) => {
                console.log(res);
                _GLBFun.TipsShow(res.msg);
                if (res.status==1){
                    this.candtList = res.candy;
                    this.homeU.setCandy(res.candy);
                    this.Lv.string = res.data.level || 0;
                    this.exp.string = res.data.exp + '/' + res.data.max_exp || 'null';
                    this.expBox.width = 246 * res.data.exp / res.data.max_exp;//246为满
                    this.hide();
                }
                
            }
        });
    },
    candyAddOrDel(event, type) {
        let num = parseInt(this.candyNum.string);
        if (type) {
            num += 1;
            num = num > parseInt(this.maxCandyNum.string) ? parseInt(this.maxCandyNum.string) : num;
            this.candyNum.string = num;
            console.log(num, this.candyNum.string);
        } else {
            num -= 1;
            num = num < 0 ? 0 : num;
            this.candyNum.string = num;
        }
    },

    // update (dt) {},
});
