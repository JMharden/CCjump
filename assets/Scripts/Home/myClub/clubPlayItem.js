import { _GLBConfig,_GLBFun} from 'GLBConfig';
cc.Class({
    extends: cc.Component,

    properties: {
        data: null,
        photo: cc.Sprite,
        userName: cc.Label,
        teamCaptain: cc.Sprite,
        teamMember: cc.Sprite,
        lv: cc.Label,
        duan: cc.Label,
        active: cc.Label,
        type: cc.Label,
    },

    start () {
        console.log(this.data);
        _GLBFun.showImg(this.data.headimg || 'undefined',this.photo);
        this.userName.string = this.data.nickname || 'undefined';

        if (this.data.is_club_owner !== null && this.data.is_club_owner == 1){
            this.teamCaptain.getComponent(cc.Sprite).enabled = true;
        }else{
            this.teamMember.getComponent(cc.Sprite).enabled = true;
        }

        this.lv.string = this.data.level || 'undefined';
        this.duan.string = this.data.level || 'undefined';
        this.active.string = this.data.active_point || 'undefined';
        // this.type.string = this.data.last_login_time.split(' ')[0] || 'undefined';editTime
        this.type.string = _GLBFun.editTime(this.data.last_login_time || 'undefined');
    },

    // update (dt) {},
});
