import { _GLBConfig, _GLBFun } from 'GLBConfig';
cc.Class({
    extends: cc.Component,

    properties: {
        data: null,
        activityImgTotal: {
            default: [],
            type: cc.SpriteFrame,
        },
        activityImg: cc.Sprite,
        activityNum: cc.Label,
        activiDay: cc.Label,
        activityN: cc.Node,
        activityY: cc.Node,
    },

    // onLoad () {},

    start() {
        switch (this.data.reward_type) {
            case 'candy':
                this.activityImg.spriteFrame = this.activityImgTotal[0];
                break;
            case 'candy1':
                this.activityImg.spriteFrame = this.activityImgTotal[1];
                break;
            case 'candy2':
                this.activityImg.spriteFrame = this.activityImgTotal[2];
                break;
            default:
                console.log('活动图片有错误');
                break;
        }
        this.activityNum.string = this.data.reward_num || 'null';
        this.activiDay.string = '累计登陆' + this.data.accu_login_days + '天' || 'null';
        switch (this.data.is_draw) {
            case 'X'://不满足条件
                this.activityN.active = true;
                break;
            case 'N':
                this.activityY.active = true;
                break;
            case 'Y':
                // this.activityN.active = true;
                break;
            default:
                console.log('领取条件有问题');
                break;
        }
    },
    activityBtn() {
        _GLBFun.ajax({
            url: '/api.php?m=Activity&c=Activity&a=fetchReward',
            data: {
                user_id: _GLBConfig.myInfo.id,
                activityId: this.data.id,
            },
            success: (res) => {
                console.log(res);
                _GLBFun.TipsShow(res.msg);
                if (res.status == 200) {
                    this.activityY.active = false;
                }
            }
        })
    }
    // update (dt) {},
});
