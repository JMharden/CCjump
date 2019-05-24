cc.Class({
    extends: cc.Component,

    properties: {
        outTips: null,
        ClubSpriteAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        SlimeSpriteAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        TipsPrefab: {
            default: null,
            type: cc.Prefab,
        },
        ExitBox: {
            default: null,
            type: cc.Prefab,
        },
        MailData: [],
        MailList: {
            visible: false,

            default: null,
            type: cc.Node,
        },

        MailClass: 'me',
        MailListNode: [],
        back: {
            visible: false,

            default: null,
            type: cc.Node,
        },
        ClubHumanData: [],

        ClubDataList: [],
    },
    onLoad() {
        // this.CreateClub();
        // this.JoinClub();
        // this.CreateClub();
        // this.CreateTips('耶耶耶');
        // this.ApplyJoinClubList();
        // this.ApplyJoinClub();
        // this.ClubHumanList();
        // this.Mail();
        // this.ClubHuman();
    },
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    NewMailLetter(event, customEventData) {
        let tips = cc.instantiate(this.TipsPrefab).getComponent('Tips');
        tips.MailListNode = this.MailListNode;
        tips.outTips = this;
        tips.node.parent = this.node.parent;
        tips.node.setPosition(cc.v2(0, 0));

        if (this.MailClass === 'me') {
            tips.MailLetter(this.MailData[0][parseInt(customEventData)], customEventData);
        } else if (this.MailClass === 'club') {
            tips.MailLetter(this.MailData[1][parseInt(customEventData)], customEventData);
        }
    },
    Mail(MailData) {
        this.MailData = MailData;
        this.CreateInForBack();
        this.CreateMask(true, false).transition = cc.Button.Transition.NONE;

        let top = this.CreateNode(cc.v2(0, 440));
        this.AddSprite(top, 'club_49', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let clubList = this.CreateNode(cc.v2(0, 300));
        clubList.anchorY = 1;
        clubList.width = 530;
        clubList.height = 740;

        let list = this.AddScrollView(clubList);
        list.anchorX = 0.89;//wCao！！修正
        this.MailList = list;

        this.mailList(MailData[0], 'me');


        let meMail = this.CreateNode(cc.v2(-100, 340));
        this.AddSprite(meMail, 'club_56', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        let meMailBtn = this.AddButton(meMail);
        this.AddClickEvents(meMailBtn, this.node, 'Tips', 'mailToClick', 'me');

        let clubMail = this.CreateNode(cc.v2(100, 340));
        this.AddSprite(clubMail, 'club_55', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        let clubMailBtn = this.AddButton(clubMail);
        this.AddClickEvents(clubMailBtn, this.node, 'Tips', 'mailToClick', 'club');

        this.CreateCloseBtn(cc.v2(250, 430));
    },
    setMailLooked(event, MailIndex) {
        this.MailListNode[parseInt(MailIndex)].children[0].getComponent(cc.Sprite).spriteFrame = this.ClubSpriteAtlas.getSpriteFrame('club_40');
    },
    mailList(MailListData, MailClass) {
        this.MailList.removeAllChildren();
        for (let i = 0; i < MailListData.length; i++) {
            if (MailListData[i] === null) {
                continue;
            }
            let listSon = this.CreateNode(cc.v2(0, 0));
            this.AddSprite(listSon, 'club_39', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
            let listSonBtn = this.AddButton(listSon);
            //交互设置图片
            this.AddClickEvents(listSonBtn, this.node, 'Tips', 'setMailLooked', i.toString());
            //发送已读信息
            this.AddClickEvents(listSonBtn, cc.find('Canvas/homeControll'), 'homeU', 'changeEmail', MailListData[i].id);
            this.AddClickEvents(listSonBtn, this.node, 'Tips', 'NewMailLetter', i.toString());

            let looked = this.CreateNode(cc.v2(0, 0));
            if (MailListData[i].status) {
                this.AddSprite(looked, 'club_40', cc.v2(0, 0), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.TRIMMED);
            } else {
                this.AddSprite(looked, 'club_41', cc.v2(0, 0), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.TRIMMED);
            }

            looked.parent = listSon;
            looked.setPosition(cc.v2(-220, 0));

            let mailTag = this.CreateNode(cc.v2(0, 0));
            let mailTagLabel = this.AddLabel(mailTag, MailListData[i].title);
            mailTagLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            mailTagLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            mailTag.height = 30;
            mailTag.width = 200;
            mailTag.parent = listSon;
            mailTag.setPosition(cc.v2(-200, 0));

            let mailTime = this.CreateNode(cc.v2(0, 0));
            let mailTimeLabel = this.AddLabel(mailTime, MailListData[i].create_time);
            mailTimeLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            mailTimeLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            mailTime.height = 30;
            mailTime.width = 100;
            mailTime.parent = listSon;
            mailTime.setPosition(cc.v2(150, 0));

            listSon.parent = this.MailList;
            this.MailListNode[i] = listSon;
        }
        this.MailClass = MailClass;
    },
    mailToClick(event, customEventData) {
        if (this.MailClass === customEventData) {
            return;
        }
        switch (customEventData) {
            case 'me':
                //显示ME邮件
                //给meData
                this.mailList(this.MailData[0], 'me');
                break;
            case 'club':
                //给clubData
                this.mailList(this.MailData[1], 'club');
                break;
            default:
                break;
        }
    }
    ,
    NewClubHuman(event, customEventData) {
        let tips = cc.instantiate(this.TipsPrefab).getComponent('Tips');
        tips.node.parent = this.node.parent;
        tips.node.setPosition(cc.v2(0, 0));

        console.log(customEventData);

        // tips.ClubHuman(this.ClubHumanData[parseInt(customEventData)]);
        tips.ClubHuman();
    },
    ClubHuman(HumanData) {
        this.CreateMask(true, true);

        let back = this.CreateNode(cc.v2(0, 0));
        this.AddSprite(back, 'club_58', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let humanPhoto = this.CreateNode(cc.v2(0, 200));
        this.AddSprite(humanPhoto, 'club_02', cc.v2(130, 130), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.CUSTOM);

        let humanName = this.CreateNode(cc.v2(-40, 100));
        this.AddLabel(humanName, '爸爸');
        humanName.height = 40;
        humanName.width = 150;

        let active = this.CreateNode(cc.v2(20, 65));
        this.AddLabel(active, '9999999');
        active.height = 25;
        active.width = 150;

        let slimePhoto = this.CreateNode(cc.v2(100, -190));
        this.AddSprite(slimePhoto, 'club_15', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let slimeLv = this.CreateNode(cc.v2(-100, -175));
        this.AddLabel(slimeLv, 'Lv' + '30');
        slimeLv.height = 40;
        slimeLv.width = 150;

        this.CreateCloseBtn(cc.v2(200, 280));
    },

    ClubHumanList(ClubHumanData) {
        this.ClubHumanData = ClubHumanData;
        this.CreateMask(true, false).transition = cc.Button.Transition.NONE;
        this.CreateInForBack();

        let top = this.CreateNode(cc.v2(0, 440));
        this.AddSprite(top, 'club_54', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let dataClass = this.CreateNode(cc.v2(0, 350));
        this.AddSprite(dataClass, 'club_50', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let clubList = this.CreateNode(cc.v2(0, 330));
        clubList.anchorY = 1;
        clubList.width = 530;
        clubList.height = 730;

        let list = this.AddScrollView(clubList);

        for (let i = 0; i < ClubHumanData.length; i++) {
            let listSon = this.CreateNode(cc.v2(0, 0));
            this.AddSprite(listSon, 'club_21', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
            let sonBtn = this.AddButton(listSon);
            this.AddClickEvents(sonBtn, this.node, 'Tips', 'NewClubHuman', i.toString());
            //请求数据 点击返回用户ID 获取完生成Tips.ClubHuman

            let humanPhoto = this.CreateNode(cc.v2(0, 0));
            let humanPhotoSprite = this.AddSprite(humanPhoto, 'club_02', cc.v2(60, 60), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.CUSTOM);
            cc.loader.load(ClubHumanData[i].headimg + "?aa=aa.jpg", (err, texture) => {
                humanPhotoSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
            humanPhoto.parent = listSon;
            humanPhoto.setPosition(cc.v2(-228, 0));

            let humanName = this.CreateNode(cc.v2(0, 0));
            let humanNameLabel = this.AddLabel(humanName, ClubHumanData[i].nickname);
            humanNameLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            humanNameLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            humanName.height = 30;
            humanName.width = 100;
            humanName.parent = listSon;
            humanName.setPosition(cc.v2(-200, 0));

            let lv = this.CreateNode(cc.v2(0, 0));
            let lvLabel = this.AddLabel(lv, ClubHumanData[i].level);
            lvLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            lvLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            lv.height = 30;
            lv.width = 100;
            lv.parent = listSon;
            lv.setPosition(cc.v2(-65, 0));

            let active = this.CreateNode(cc.v2(0, 0));
            let activeLabel = this.AddLabel(active, ClubHumanData[i].active_point);
            activeLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            activeLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            active.height = 30;
            active.width = 100;
            active.parent = listSon;
            active.setPosition(cc.v2(45, 0));

            let state = this.CreateNode(cc.v2(0, 0));
            let stateLabel = this.AddLabel(state, ClubHumanData[i].last_login_time);
            stateLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            stateLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            state.height = 30;
            state.width = 100;
            state.parent = listSon;
            state.setPosition(cc.v2(160, 0));

            listSon.parent = list;
        }
        list.anchorX = 0.9;//wCao！！修正


        this.CreateCloseBtn(cc.v2(250, 430));
    },

    JoinClub() {
        this.CreateMask(true, false).transition = cc.Button.Transition.NONE;
        this.CreateBack();

        let top = this.CreateNode(cc.v2(0, 190));
        this.AddSprite(top, 'club_46', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let create = this.CreateNode(cc.v2(-120, -20));
        this.AddSprite(create, 'club_20', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        let createBtn = this.AddButton(create);

        let join = this.CreateNode(cc.v2(120, -20));
        this.AddSprite(join, 'club_19', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        let joinBtn = this.AddButton(join);

        this.CreateCloseBtn(cc.v2(290, 190));

        let Btn = { createBtn: createBtn, joinBtn: joinBtn };
        return { createBtn, joinBtn };
    },
    ApplyJoinClub(ClubData) {
        this.CreateMask(true, true).transition = cc.Button.Transition.NONE;
        let back = this.CreateNode(cc.v2(0, 0));
        this.AddSprite(back, 'club_01', cc.v2(600, 1000), cc.Sprite.Type.SLICED, cc.Sprite.SizeMode.CUSTOM);

        let photoBack = this.CreateNode(cc.v2(160, 320));
        this.AddSprite(photoBack, 'club_03', cc.v2(0, 0), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.TRIMMED);

        let photoClub = this.CreateNode(cc.v2(155, 350));
        let clubPhotoSprite = this.AddSprite(photoClub, 'club_02', cc.v2(140, 140), cc.Sprite.Type.SLICED, cc.Sprite.SizeMode.CUSTOM);
        cc.loader.load(ClubData.club_head + "?aa=aa.jpg", (err, texture) => {
            clubPhotoSprite.spriteFrame = new cc.SpriteFrame(texture);
        });


        let clubName = this.CreateNode(cc.v2(-155, 430));
        this.AddLabel(clubName, ClubData.club_name || 'null');
        clubName.height = 60;
        clubName.width = 200;

        let clubBoss = this.CreateNode(cc.v2(-140, 370));
        this.AddLabel(clubBoss, ClubData.ower_name || 'null');
        clubBoss.height = 30;
        clubBoss.width = 150;

        let number = this.CreateNode(cc.v2(-160, 330));
        this.AddLabel(number, ClubData.create_number || 'null');
        number.height = 30;
        number.width = 150;

        let area = this.CreateNode(cc.v2(-135, 295));
        this.AddLabel(area, ClubData.area||'null');
        area.height = 30;
        area.width = 150;

        let createTime = this.CreateNode(cc.v2(-120, 260));
        this.AddLabel(createTime, ClubData.create_time || 'null');
        createTime.height = 30;
        createTime.width = 150;

        let active = this.CreateNode(cc.v2(-140, 220));
        this.AddLabel(active, ClubData.active || 'null');
        active.height = 30;
        active.width = 150;

        let declaration = this.CreateNode(cc.v2(-220, 25));
        this.AddLabel(declaration, ClubData.declaration || 'null');
        declaration.height = 100;
        declaration.width = 450;

        let notice = this.CreateNode(cc.v2(-220, -120));
        this.AddLabel(notice, ClubData.club_notice || 'null');
        notice.height = 100;
        notice.width = 450;

        let Apply = this.CreateNode(cc.v2(0, -400));
        this.AddSprite(Apply, 'club_29', cc.v2(0, 0), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.TRIMMED);
        let ApplyBtn = this.AddButton(Apply);
        //发送申请ID；
        this.AddClickEvents(ApplyBtn, cc.find('Canvas/homeControll'), 'homeU', 'sendJoinClub', ClubData.id);
        this.AddClickEvents(ApplyBtn, this.node, 'Tips', 'CloseBack');

        this.CreateCloseBtn(cc.v2(250, 450));
    },
    NewApplyJoinClub(event, customEventData) {
        let tips = cc.instantiate(this.TipsPrefab).getComponent('Tips');
        tips.node.parent = this.node.parent;
        tips.node.setPosition(cc.v2(0, 0));

        tips.ApplyJoinClub(this.ClubDataList[parseInt(customEventData)]);
    },
    ApplyJoinClubList(ClubDataList) {
        this.ClubDataList = ClubDataList;

        this.CreateInForBack();

        let top = this.CreateNode(cc.v2(0, 440));
        this.AddSprite(top, 'club_47', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let dataClass = this.CreateNode(cc.v2(0, 320));
        this.AddSprite(dataClass, 'club_42', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let clubList = this.CreateNode(cc.v2(0, 270));
        clubList.anchorY = 1;
        clubList.width = 530;
        clubList.height = 700;

        let list = this.AddScrollView(clubList);

        for (let i = 0; i < ClubDataList.length; i++) {
            let listSon = this.CreateNode(cc.v2(0, 0));
            this.AddSprite(listSon, 'club_21', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
            let sonBtn = this.AddButton(listSon);
            this.AddClickEvents(sonBtn, this.node, 'Tips', 'NewApplyJoinClub', i.toString());

            let clubPhoto = this.CreateNode(cc.v2(0, 0));
            let clubPhotoSprite = this.AddSprite(clubPhoto, 'club_02', cc.v2(60, 60), cc.Sprite.Type.SIMPLE, cc.Sprite.SizeMode.CUSTOM);
            cc.loader.load(ClubDataList[i].club_head + "?aa=aa.jpg" || 'null', (err, texture) => {
                clubPhotoSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
            clubPhoto.parent = listSon;
            clubPhoto.setPosition(cc.v2(-228, 0));

            let clubName = this.CreateNode(cc.v2(0, 0));
            let clubNameLabel = this.AddLabel(clubName, ClubDataList[i].club_name || 'null');
            clubNameLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            clubNameLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            clubName.height = 30;
            clubName.width = 100;
            clubName.parent = listSon;
            clubName.setPosition(cc.v2(-190, 0));

            let clubBoss = this.CreateNode(cc.v2(0, 0));
            let clubBossLabel = this.AddLabel(clubBoss, ClubDataList[i].ower_name || 'null');
            clubBossLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            clubBossLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            clubBoss.height = 30;
            clubBoss.width = 100;
            clubBoss.parent = listSon;
            clubBoss.setPosition(cc.v2(-85, 0));

            let Activity = this.CreateNode(cc.v2(0, 0));
            let ActivityLabel = this.AddLabel(Activity, ClubDataList[i].active || 'null');
            ActivityLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            ActivityLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            Activity.height = 30;
            Activity.width = 80;
            Activity.parent = listSon;
            Activity.setPosition(cc.v2(45, 0));

            let Number = this.CreateNode(cc.v2(0, 0));
            let NumberLabel = this.AddLabel(Number, ClubDataList[i].create_number || 'null');
            NumberLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            NumberLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            Number.height = 20;
            Number.width = 80;
            Number.parent = listSon;
            Number.setPosition(cc.v2(170, 0));

            listSon.parent = list;
        }
        list.anchorX = 0.9;//wCao！！修正

        //搜索
        this.AddEditBox(cc.v2(-100, 353), cc.v2(290, 30));
        let lookUp = this.CreateNode(cc.v2(55, 353));
        lookUp.width = 40;
        lookUp.height = 40;
        this.AddButton(lookUp);

        this.CreateCloseBtn(cc.v2(250, 430));
    },
    AddScrollView(Node) {
        Node.addComponent(cc.Mask);
        let scrollView = Node.addComponent(cc.ScrollView);
        scrollView.elastic = false;
        scrollView.inertia = false;
        // scrollView.cancelInnerEvents=false;

        let list = this.CreateNode(cc.v2(0, 0));
        list.anchorY = 1;
        list.parent = Node;
        // console.log(lise.getPosition());

        let layout = list.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.spacingY = 10;
        // console.log(lise.getPosition());

        scrollView.content = list;

        return list;
    },
    //申请加入界面 创建俱乐部回调函数 加入俱乐部回调函数
    CreateClub() {
        this.CreateBack();
        this.CreateMask(true, false).transition = cc.Button.Transition.NONE;

        let top = this.CreateNode(cc.v2(0, 190));
        this.AddSprite(top, 'club_44', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let dataTags = this.CreateNode(cc.v2(-100, 0));
        this.AddSprite(dataTags, 'club_43', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let EditBox = this.AddEditBox(cc.v2(60, 40), cc.v2(200, 40));

        let agreeCreateClub = this.CreateNode(cc.v2(0, -135));
        this.AddSprite(agreeCreateClub, 'club_28', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        let CreatClub = this.AddButton(agreeCreateClub);
        this.AddClickEvents(CreatClub, cc.find('Canvas/homeControll'), 'homeU', 'creatorClub', EditBox);

        let cost = this.CreateNode(cc.v2(-30, -38));
        this.AddLabel(cost, '500');
        cost.width = 300;
        cost.height = 30;

        this.CreateCloseBtn(cc.v2(290, 190));
    },
    MailLetter(LetterData, MailIndex) {
        this.CreateMask(true, false).transition = cc.Button.Transition.NONE;
        this.CreateBack();

        let top = this.CreateNode(cc.v2(0, 190));
        this.AddSprite(top, 'club_49', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let textBack = this.CreateNode(cc.v2(0, 0));
        this.AddSprite(textBack, 'club_18', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let tag = this.CreateNode(cc.v2(-140, 80));
        this.AddLabel(tag, LetterData.title);
        tag.width = 350;
        tag.height = 30;

        let text = this.CreateNode(cc.v2(-140, -25));
        this.AddLabel(text, LetterData.content);
        text.width = 350;
        text.height = 150;


        this.CreateCloseBtn(cc.v2(290, 190));


        if (LetterData.title === '申请信息') {
            let yes = this.CreateNode(cc.v2(-150, -150));
            this.AddSprite(yes, 'club_32', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
            let yesBtn = this.AddButton(yes);
            //交互删除邮件显示
            this.AddClickEvents(yesBtn, this.node, 'Tips', 'CloseBack');
            let obj1 = {
                type: 1,
                id: LetterData.id,
            }
            obj1 = JSON.stringify(obj1);
            this.AddClickEvents(yesBtn, cc.find('Canvas/homeControll'), 'homeU', 'handleEmail', obj1);
            this.AddClickEvents(yesBtn, this.node, 'Tips', 'deMail', MailIndex);


            let no = this.CreateNode(cc.v2(+150, -150));
            this.AddSprite(no, 'club_53', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
            let noBtn = this.AddButton(no);
            //交互删除邮件显示
            this.AddClickEvents(noBtn, this.node, 'Tips', 'CloseBack');
            let obj2 = {
                type: 2,
                id: LetterData.id,
            }
            obj2 = JSON.stringify(obj2);
            this.AddClickEvents(noBtn, cc.find('Canvas/homeControll'), 'homeU', 'handleEmail', obj2);
            this.AddClickEvents(noBtn, this.node, 'Tips', 'deMail', MailIndex);


            //Apply
        } else {
            let de = this.CreateNode(cc.v2(0, -150));
            this.AddSprite(de, 'club_26', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
            let deBtn = this.AddButton(de);
            //交互删除邮件显示
            this.AddClickEvents(deBtn, this.node, 'Tips', 'CloseBack');
            this.AddClickEvents(deBtn, cc.find('Canvas/homeControll'), 'homeU', 'delEmail', LetterData.id);
            this.AddClickEvents(deBtn, this.node, 'Tips', 'deMail', MailIndex);

            //News
        }
    },
    deMail(event, MailIndex) {
        if (this.outTips.MailClass === 'me') {
            this.outTips.MailData[0][parseInt(MailIndex)] = null;
        } else if (this.outTips.MailClass === 'club') {
            this.outTips.MailData[1][parseInt(MailIndex)] = null;
        }
        this.MailListNode[parseInt(MailIndex)].destroy();
    },
    CreateTips(Text) {
        this.CreateBack();

        let top = this.CreateNode(cc.v2(0, 190));
        this.AddSprite(top, 'club_48', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);

        let tipsText = this.CreateNode(cc.v2(-250, -25));
        tipsText.color = cc.color(50, 200, 0);
        this.AddLabel(tipsText, Text);
        tipsText.width = 500;
        tipsText.height = 300;

        let yes = this.CreateNode(cc.v2(0, -150));
        this.AddSprite(yes, 'club_33', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        this.AddClickEvents(this.AddButton(yes), this.node, 'Tips', 'CloseBack');

        // let no=this.CreateNode(cc.v2(+150,-150));
        // this.AddSprite(no,'club_32',cc.v2(0,0),cc.Sprite.Type.TILED,cc.Sprite.SizeMode.TRIMMED);
        // this.AddClickEvents(this.AddButton(no),this.node,'Tips','CloseBack');

    },
    // Apply申请信息弹框||News邮件 标题 内容
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //下面不用管
    CreateNode(v2) {
        let node = new cc.Node();
        node.parent = this.node;
        node.setPosition(v2);

        return node;
    },
    AddSprite(Node, SpriteFrameName, Sprite_Size, Sprite_Type, Sprite_SizeMode) {
        let sprite = Node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.ClubSpriteAtlas.getSpriteFrame(SpriteFrameName);

        Node.width = Sprite_Size.x;
        Node.height = Sprite_Size.y;

        sprite.type = Sprite_Type;
        sprite.sizeMode = Sprite_SizeMode;

        return sprite;
    },
    AddButton(Node) {
        let button = Node.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;

        return button;
    },
    AddClickEvents(button, TargetNode, TargetComponent, Name, EventData) {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = TargetNode;
        clickEventHandler.component = TargetComponent;
        clickEventHandler.handler += Name;
        if (EventData !== null) {
            clickEventHandler.customEventData = EventData;
        }
        button.clickEvents.push(clickEventHandler);
    },
    AddLabel(Node, Text) {
        let label = Node.addComponent(cc.Label);
        label.node.anchorX = 0;
        label.verticalAlign = cc.Label.VerticalAlign.TOP;
        label.overflow = cc.Label.Overflow.SHRINK;

        label.string = Text;

        return label;
    },
    AddEditBox(v2, BoxSize) {
        let editBoxNode = cc.instantiate(this.ExitBox);
        editBoxNode.setPosition(v2);
        editBoxNode.parent = this.node;
        editBoxNode.width = BoxSize.x;
        editBoxNode.height = BoxSize.y;

        return editBoxNode.getChildByName('EditBox').getComponent(cc.EditBox);
    },

    CreateBack() {
        let node = this.CreateNode(cc.v2(0, 0));
        let sprite = this.AddSprite(node, 'club_24', cc.v2(650, 450), cc.Sprite.Type.SLICED, cc.Sprite.SizeMode.CUSTOM);
        this.back = node;

        return sprite;
    },
    CreateInForBack() {
        let node = this.CreateNode(cc.v2(0, 0));
        let sprite = this.AddSprite(node, 'club_24', cc.v2(588, 942), cc.Sprite.Type.SLICED, cc.Sprite.SizeMode.CUSTOM);
        this.back = node;

        return sprite;
    },
    CreateMask(ShadowMask, ClickClose) {
        let button = this.AddButton(this);
        let widget = this.node.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;

        if (ShadowMask) {

        }
        if (ClickClose) {
            this.AddClickEvents(button, this.node, 'Tips', 'CloseBack');
        }
        return button;
    },
    CreateCloseBtn(v2) {
        let close = this.CreateNode(v2);
        this.AddSprite(close, 'club_17', cc.v2(0, 0), cc.Sprite.Type.TILED, cc.Sprite.SizeMode.TRIMMED);
        let closeBtn = this.AddButton(close);
        this.AddClickEvents(closeBtn, this.node, 'Tips', 'CloseBack');
    },
    CloseBack() {
        this.node.destroy();
    },
    //申请加入点击函数(event,customEventData){},
});
