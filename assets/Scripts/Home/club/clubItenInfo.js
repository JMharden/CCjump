import { _GLBFun, _GLBConfig } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        ID:"",//俱乐部ID
        userActive: cc.Label,
        userMoney: cc.Label,
        clubName: cc.Label,
        clubPhoto: cc.Sprite,
        creatTime: cc.Label,
        total: cc.Label,
        GPS: cc.Label,
        admPhoto: cc.Sprite,
        admName: cc.Label,
        active: cc.Label,
        notice: cc.Label,
        declaration: cc.Label,
        QRCode: cc.Sprite,
    },

    start () {
        console.log(this.ID,'woshi');
        _GLBFun.ajax({
            url:'/api.php?m=Api&c=Index&a=clubInfo',
            data:{
            club_id: this.ID,
            },
            success: (res) => {
                console.log(res);
                cc.loader.load(res.data.club_head+"?aa=aa.jpg", (err, texture) => {
                    this.clubPhoto.spriteFrame = new cc.SpriteFrame(texture);
                });
                cc.loader.load(res.data.headimg+"?aa=aa.jpg", (err, texture) => {
                    this.admPhoto.spriteFrame = new cc.SpriteFrame(texture);
                });
                this.userActive.string = _GLBConfig.myInfo.active_point || 'undefined';
                this.userMoney.string = _GLBConfig.myInfo.money || 'undefined';
                this.clubName.string = res.data.club_name || 'undefined';
                this.creatTime.string = res.data.create_time || 'undefined';
                this.total.string = res.data.club_number || 'undefined';
                this.GPS.string = res.data.area || 'undefined';
                this.admName.string = res.data.ower_name || 'undefined';
                this.active.string = res.data.active_point || 'undefined';
                this.notice.string = res.data.club_notice || 'undefined';
                this.declaration.string = res.data.declaration || 'undefined';
                // cc.loader.load(res.data.headimg+"?aa=aa.jpg", (err, texture) => {
                //     this.QRCode.spriteFrame = new cc.SpriteFrame(texture);
                // });//二维码
            }
        });
    },
    close(){
        this.node.destroy();
    },
    sendJoinClub(){
        _GLBFun.ajax({
            url:'/api.php?m=Api&c=Index&a=joinClub',
            data:{
                club_id: this.ID,
            },
            success: (res) => {
                console.log(res);
                _GLBConfig.TipsShow("申请成功，请等待管理员同意");
            }
        })
    }

    // update (dt) {},
});
