import { _GLBConfig, _GLBFun } from 'GLBConfig';
cc.Class({
    extends: cc.Component,

    properties: {
        data: null,
        active: cc.Label,
        money: cc.Label,
        photo: cc.Sprite,
        clubName: cc.Label,
        admName: cc.Label,
        total: cc.Label,
        gps: cc.Label,
        creatTime: cc.Label,
        clubActive: cc.Label,
        declaration: cc.EditBox,
        notice: cc.EditBox,
        QRcode: cc.Sprite,
    },


    start() {
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubInfo',
            data:{
                club_id: _GLBConfig.myInfo.club_id,
            },
            success: (res) => {
                console.log(res);
                this.data = res.data;
                this.active.string = _GLBConfig.myInfo.active_point;
                this.money.string = _GLBConfig.myInfo.money;
                _GLBFun.showImg(this.data.club_head,this.photo);
                this.photoUrl = this.data.club_head;
                this.clubName.string = this.data.club_name || 'null';
                this.admName.string = this.data.ower_name || 'null';
                this.total.string = this.data.club_number || 'null';
                this.gps.string = this.data.area || 'null';
                this.creatTime.string = this.data.create_time || 'null';
                this.clubActive.string = this.data.active_point || 'null';
                this.declaration.string = this.data.declaration || 'null';
                this.notice.string = this.data.club_notice || 'null';
                _GLBFun.showImg(this.data.ercode, this.QRcode);
                this.QRcodeUrl = this.data.ercode;
            }
        })

    },
    returnBtn() {
        this.node.destroy();
    },
    showClubPlayInfo(){
        let item = cc.instantiate(this.clubPlayInfo);
        item.getComponent('clubPlayInfo').ID = _GLBConfig.myInfo.club_id;
        item.parent = this.node.parent;
    },
    upClubPhoto(){
        // sessionStorage.setItem('imgBaseName', 'photo');
        // let name = sessionStorage.getItem('imgBaseName');
        // console.log('点击了', name);
        // ImgBaseShow(this.photo);
    },
    upQRCode(){
        // sessionStorage.setItem('imgBaseName', 'QRcode');
        // ImgBaseShow(this.QRcode);
    },
    showEdit(){
        let item = cc.instantiate(this.clubEdit);
        // item.getComponent('clubPlayInfo').ID = _GLBConfig.myInfo.club_id;
        item.parent = this.node.parent;
    },   
    confirmBtn(){
        // let photo = sessionStorage.getItem('photo');
        // let QRcode = sessionStorage.getItem('QRcode');
        console.log(photo,QRcode);
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubSet',
            data: {
                club_id: _GLBConfig.myInfo.club_id,
                club_head: photo || _GLBConfig.myInfo.avatarUrl,
                ercode: QRcode || _GLBConfig.myInfo.avatarUrl,
                declaration:　this.declaration.string,
                club_notice: this.notice.string,
            },
            success: (res) => {
                console.log(res);
                _GLBConfig.TipsShow(res.msg);
            }
        })
    },
    // update (dt) {},
});
