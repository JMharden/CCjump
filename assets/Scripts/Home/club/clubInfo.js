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
        declaration: cc.Label,
        notice: cc.Label,
        QRcode: cc.Sprite,
        clubPlayInfo: cc.Prefab,
        clubEdit: cc.Prefab,
        clubMail: cc.Prefab,
        editBtn: cc.Node,
        quitBtn: cc.Node,
        tips: cc.Prefab,
        declarationEdit: cc.EditBox,
        NoticeEdit: cc.EditBox,
        edit1: cc.Node,
        hidden: cc.Node,
        isEdit: true,
    },


    start() {
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubInfo',
            data:{
                club_id: _GLBConfig.myInfo.club_id,
            },
            success: (res) => {
                this.data = res.data;
                console.log(this.data);
                this.active.string = _GLBConfig.myInfo.stamina||'null';
                this.money.string = _GLBConfig.myInfo.money || 'null';
                _GLBFun.showImg(this.data.club_head,this.photo);
                this.clubName.string = this.data.club_name || 'undefined';
                this.admName.string = this.data.ower_name || 'undefined';
                this.total.string = this.data.club_number || 'undefined';
                this.gps.string = this.data.area || 'undefined';
                this.creatTime.string = this.data.create_time || 'undefined';
                this.clubActive.string = this.data.active_point || 'undefined';
                this.declaration.string = this.data.declaration || 'undefined';
                this.notice.string = this.data.club_notice || 'undefined';
                this.declarationEdit.string = this.data.declaration || '请输入';
                this.NoticeEdit.string = this.data.club_notice || '请输入';
                _GLBFun.showImg(this.data.ercode, this.QRcode);

                if (this.data.club_role == 1){
                    this.editBtn.active = true;
                    this.quitBtn.active = false;
                }
            }
        })

    },
    returnBtn() {
        this.node.destroy();
    },
    showClubPlayInfo(){
        // let item = cc.instantiate(this.clubPlayInfo);
        // item.getComponent('clubPlayInfo').ID = _GLBConfig.myInfo.club_id;
        // item.parent = this.node.parent;
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=clubMembers',
            success: (res) => {
                console.log(res);
                let tips = cc.instantiate(this.tips).getComponent('Tips');
                tips.node.parent = cc.find('Canvas');
                tips.ClubHumanList(res);
            }
        });
        
    },
    showEdit(){
        if(this.isEdit){
            this.declarationEdit.node.active = true;
            this.NoticeEdit.node.active = true;
            this.edit1.active = true;
            this.hidden.active = false;
            this.isEdit = false;
        }else{
            this.declarationEdit.node.active = false;
            this.NoticeEdit.node.active = false;
            this.edit1.active = false;
            this.hidden.active = true;
            this.isEdit = true;
        }
        
    },
    upClubPhoto() {
        // sessionStorage.setItem('imgBaseName', 'photo');
        // ImgBaseShow(this.photo);
    },
    upQRCode() {
        // sessionStorage.setItem('imgBaseName', 'QRcode');
        // ImgBaseShow(this.QRcode);
    },
    confirmBtn(){
        // let photo = sessionStorage.getItem('photo');
        // let QRcode = sessionStorage.getItem('QRcode');
        console.log(photo, QRcode);
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubSet',
            data: {
                club_head: photo || _GLBConfig.myInfo.avatarUrl,
                ercode: QRcode || _GLBConfig.myInfo.avatarUrl,
                declaration: this.declarationEdit.string,
                club_notice: this.NoticeEdit.string,
            },
            success: (res) => {
                console.log(res);
                _GLBConfig.TipsShow(res.msg);

                // this.isEdit = false;
                this.showEdit();

                this.declaration.string = this.declarationEdit.string;
                this.notice.string = this.NoticeEdit.string;
            }
        })
    },
    quitClub(){
        _GLBFun.ajax({
            url: '/api.php?m=Index&c=index&a=quitClub',
            success: (res) => {
                console.log(res);
                _GLBConfig.TipsShow('退出俱乐部成功');
            }
        })
    }
    // update (dt) {},
});
