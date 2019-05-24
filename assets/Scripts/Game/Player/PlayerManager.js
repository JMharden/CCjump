cc.Class({
    extends: cc.Component,

    //PlayerManager 处理角色函数计算

    properties: {
        PD:{
            default:null,
            type:cc.Object,
        },
        GD:{
            default:null,
            type:cc.Object,
        },
        AN:{
            default:null,
            type:cc.Object,
        },
        GM:{
            default:null,
            type:cc.Object,
        },

        playerC:{
            default:null,
            type:cc.Collider,
        },
        PAni:{
            default:null,
            type:cc.Object,
        },

        meTag:{
            default: null,
            type:cc.Prefab,
        },
        nameTag:{
            default: null,
            type:cc.Prefab,
        },
        runTag:{
            default: null,
            type:cc.Prefab,
        },
        MHP:{
            default: null,
            type:cc.Prefab,
        },
        PlayerController:{
            default: null,
            type:cc.Prefab,
        },
    },
    onLoad () {
        this.AN=cc.find("AssetsNode").getComponent("AssetsNode");
        this.GM=cc.find("GameManager").getComponent("GameManager");


        this.GD=cc.find("GameData").getComponent("GameData");
        this.PD=this.node.getComponent('PlayerData');
        this.PAni=this.node.getComponent('PlayerAni');
    
    },
    //初始化数据
    SetPlayerData(v2,playerIndex,playerName,lv,me) {
        let playerController = cc.instantiate(this.PlayerController);
        playerController.parent = this.node.parent;
        playerController.setPosition(v2);
        playerController.getComponent('PlayerController').PM = this;
        this.playerC = playerController.getComponent(cc.Collider);
        //绑定Player 控制器

        this.PD.playerTarget = playerController;//以自身控制器设置 目标点 参照
        this.PD.playerIndex = playerIndex;
        this.PD.playerName = playerName;
        //初始化设置个人数据

        if(me){
            let runTag=cc.instantiate(this.runTag);
            runTag.parent=this.PD.playerTarget;
            runTag.setPosition(cc.v2(0,0));
        }

        this.PD.lv = lv;
        // this.SetSlimeData(lv);
        //根据玩家的史莱姆等级推算属性的增长值
        if (me) {
            this.PD.me = me;
            cc.instantiate(this.meTag).parent = this.node;
        } else {
            this.PD.me = me;
            let nameTap = cc.instantiate(this.nameTag);
            nameTap.parent = this.node;
            nameTap.getComponent(cc.Label).string = this.PD.playerName;
        }//生成标签,


        let MHP = cc.instantiate(this.MHP);
        if (me) {
            MHP.getChildByName('HP').getChildByName('_hp').color = cc.color(230, 230, 23, 255);
        }
        MHP.parent = this.node;
        MHP.setPosition(cc.v2(0, 30));
        MHP.getComponent('MHP').PD = this.PD;
        //生成血条

        if(me){
            this.SkillCD();
        }
    },//初始化设置Player数据
    SetSlimeData(lv){
        switch (this.PD.slimeName) {
            case 'CatSlime':
                this.PD.hp+=this.PD.hp*(lv/10);
                break;
            default:
                break;
        }
    },//根据等级初始化 Slime属性增长

    //移动操作 函数
    Move(lr){
        this.node.setPosition(this.PD.playerTarget.getPosition());

        this.PD.score++;

        this.PAni.playerAni.playAdditive('SlimeJump');

        this.PAni.playerAni.node.parent.scaleX=-lr;
        this.PD.playerTarget.setPosition(cc.v2(this.PD.playerTarget.x+=100*lr,this.PD.playerTarget.y+=50));

        return this.PD.control;
    },//移动函数
    TwoJump(lr){
        if(this.PD.control){

        }//在可控条件下才可移动  control(是否可控制)
        this.PD.score+=2;
        this.PAni.playerAni.playAdditive('SlimeJump');

        this.PAni.playerAni.node.parent.scaleX=-lr;
        this.PD.playerTarget.setPosition(cc.v2(this.PD.playerTarget.x+=200*lr,this.PD.playerTarget.y+=100));
        return this.PD.control;
    },//二跳
    ThreeJump(lr){
        if(this.PD.control) {
            this.PD.score += 3;
            this.PAni.playerAni.playAdditive('SlimeJump');

            this.PAni.playerAni.node.parent.scaleX = -lr;
            this.PD.playerTarget.setPosition(cc.v2(this.PD.playerTarget.x += 300 * lr, this.PD.playerTarget.y += 150));
        }
        return this.PD.control;
    },//三跳

    Skill() {
        if (this.PD.skillCD && this.PD.control || this.PD.me !== true) {
            switch (this.PD.slimeName) {
                case 'BloodSlime':
                    this.BloodSkill();
                    break;
                case 'SoilSlime':
                    this.SoilSkill();
                    break;
                case 'CatSlime':
                    this.CatJumpSkill();
                    break;
                case 'ElectricSlime':
                    this.ElectricSkill();
                    break;
                default:
                    break;
            }
            if (this.PD.me) {
                this.SkillCD();
            }
            //设置自身CD
            return true;
        } else {
            return false;
        }//技能CD 释放条件
    },//技能函数 对应不同史莱姆用的技能效果
    InSkill(skillLife) {
        switch (skillLife.skillName) {
            case 'BloodSkill':
                if (skillLife.playerIndex === this.PD.playerIndex) {
                    let bloodLife = skillLife.node.getComponent('BloodLife');
                    if (bloodLife.state === 2) {
                        this.PlayerState('Cure', 3);
                        bloodLife.life = 0;
                    }
                } else {
                    this.PlayerState('Hurt', skillLife.atk);
                    this.PlayerState('ShowState', skillLife.skillName);
                    // this.PAni.hurt.play();
                }
                break;
            case 'SoilSkill':
                if (skillLife.playerIndex !== this.PD.playerIndex) {

                    let v2 = cc.v2(this.PD.playerTarget.getPosition());
                    if (this.PD.playerTarget.x < skillLife.node.x) {
                        v2.x -= 200;
                    } else {
                        v2.x += 200;
                    }//推开
                    this.PlayerState('UpdateTarget', v2);
                    this.PlayerState('Hurt', skillLife.atk);
                }
                break;
            case 'ElectricSkill':
                if (skillLife.playerIndex !== this.PD.playerIndex) {
                    // this.PAni.electric_hurt.node.getComponent('RandomSprite').RandomSprite();
                    // this.PAni.electric_hurt.play();
                    this.PlayerState('Hurt', skillLife.atk);
                    this.PlayerState('ShowState', skillLife.skillName);

                    if (this.PD.control) {
                        this.ControlTime(2);
                    }//在可控状态下 才可设置 不可控
                }
                break;
            default:
                break;
        }
        if (skillLife.control === false && skillLife.playerIndex !== this.PD.playerIndex) {
            this.PD.control = false;
            this.PD.controlTime = skillLife.controlTime;
        }
    },//被技能击中触发
    //各种技能函数
    
    SkillCD(){
        this.PD.skillCD=false;
        this.PD.skillCDTime=this.PD.skillCDInt;

        this.AN.skillCD.node.active=true;//CD NumberUI 开启显示
        this.AN.skillButton.node.opacity=150;
        this.setSkillCD();
    },
    setSkillCD(){
        this.AN.skillCD.string=this.PD.skillCDTime;

        setTimeout(() => {
            // console.log('skillCD'+this.PD.skillCDTime);
            this.PD.skillCDTime-=1;
            if (this.PD.skillCDTime<=0){
                this.AN.skillCD.node.active=false;
                this.AN.skillButton.node.opacity=220;

                this.PD.skillCD=true;
            }else {
                this.setSkillCD();
            }
        }, 1000);
    },//设置技能CD时间
    Fly(){
    },//飞行技能能
    BloodSkill(){
        for (let i=0;i<4;i++) {
            let bloodLife= cc.instantiate(this.AN.Skill[0]).getComponent('BloodLife');
            bloodLife.target=this.PD.playerTarget;
            bloodLife.PD=this.PD;
            bloodLife.index=i;

            bloodLife.node.parent=this.AN.GameObj;
            bloodLife.node.zIndex=3;
            bloodLife.node.setPosition(cc.v2(this.node));

            let skillLife=bloodLife.node.getComponent('SkillLife');
            skillLife.playerIndex=this.PD.playerIndex;
            skillLife.atk=this.PD.atk
        }
    },//血技能
    SoilSkill(){
        for (let m=0;m<5;m++){
            setTimeout(() => {
                let skillLife= cc.instantiate(this.AN.Skill[1]).getComponent('SkillLife');
                skillLife.playerIndex=this.PD.playerIndex;
                skillLife.atk=this.PD.atk;

                skillLife.node.parent=this.AN.GameObj;
                skillLife.node.zIndex=this.node.zIndex+5;
                skillLife.node.setPosition(this.PD.playerTarget.getPosition());

                for(let i=0;i<this.GD.mapSize.z;i++){
                    if (this.PD.playerTarget.x-(this.PAni.playerAni.node.parent.scaleX*100)===this.GD.cubeXArr[i][this.PD.score+1]){
                        this.Move(-this.PAni.playerAni.node.parent.scaleX);
                        break;
                    }else if (i===this.GD.mapSize.z-1){
                        this.Move(this.PAni.playerAni.node.parent.scaleX);
                        // m=5;
                        break;
                    }
                }
            }, m*100);
        }

        // let skillLife= cc.instantiate(this.AN.Skill[1]).getComponent('SkillLife');
        // skillLife.playerIndex=this.PD.playerIndex;
        //
        // skillLife.node.parent=this.AN.GameObj;
        // skillLife.node.zIndex=this.node.zIndex+5;
        // skillLife.node.setPosition(this.PD.playerTarget.getPosition());
        //
        // for(let i=0;i<this.GD.mapSize.z;i++){
        //     if (this.PD.playerTarget.x-100===this.GD.cubeXArr[i][this.PD.score+1]){
        //         this.Move(-1);
        //         break;
        //     }else if (i===this.GD.mapSize.z-1){
        //
        //         this.Move(1);
        //         break;
        //     }
        // }

    },
    CatJumpSkill(){
        for (let i=10;i>0;i--){
            for (let m=0;m<this.GD.mapSize.z;m++){
                if(this.PD.playerTarget.x===this.GD.cubeXArr[m][this.PD.score+i]){
                    let skillNode= cc.instantiate(this.AN.Skill[2]);
                    skillNode.parent=this.node.parent;
                    skillNode.setPosition(cc.v2(this.PD.playerTarget.getPosition()));
                    skillNode.zIndex=5;
                    skillNode.getChildByName('ani').getComponent(cc.Animation).playEnd=function () {
                        this.node.parent.destroy();
                    };
                    this.PD.score+=i;
                    this.PD.playerTarget.y+=50*i;
                    this.PAni.playerAni.play('SlimeJump');
                    return;
                }
            }
        }
    },
    ElectricSkill(){
        let skillLife= cc.instantiate(this.AN.Skill[3]).getComponent('SkillLife');
        skillLife.playerIndex=this.PD.playerIndex;
        skillLife.atk=this.PD.atk;

        skillLife.node.parent=this.node;
        skillLife.node.setPosition(cc.v2(0,0));
        skillLife.node.zIndex=this.node.zIndex+5;
    },//雷电技能

    ControlTime(time){
        this.PD.control=false;
        this.PD.controlTime=time;
        this.setControlTime();
    },
    setControlTime(){
        setTimeout(() => {
            this.PD.controlTime-=1;
            console.log('controlTime'+this.PD.skillCDTime);
            if (this.PD.controlTime<=0){
                this.PD.control=true;
            }else {
                this.setControlTime();
            }
        }, 1000);
    },//私用 设置无法控制时间
    ShowState(SkillName){
        switch (SkillName) {
            case 'ElectricSkill':
                this.PAni.electric_hurt.node.getComponent('RandomSprite').RandomSprite();
                this.PAni.electric_hurt.play();
                break;
            case 'BloodSkill':
                this.PAni.hurt.play();
                break;
            case 'Cure':
                this.PAni.cure.play();
                break;
        }
    },//显示效果
    PlayerState(stateType,val){
        switch (stateType) {
            case 'Die':
                this.Die();
                break;
            case 'Hurt':
                this.Hurt(val);
                break;
            case 'Cure':
                this.Cure(val);
                break;
            case 'TimeMove':
                this.TimeMove(val);
                break;
            case 'OutDown':
                this.OutDown();
                break;
            case 'UpdateTarget':
                this.UpdateTarget(val);
                break;
            case 'ShowState':
                this.ShowState(val);//显示被击效果
                break;
            default:
                break;
        }
        if(this.PD.me) {
            //发送自己执行状态类型 取值；
            //mePlayerIndex stateType val
            this.GM.SetPlayerState(this.PD.playerIndex, stateType, val);
        }
    },//触发状态；
    //状态函数
    Die(){
        if (this.PD.hp<=0){
            if (this.PD.Die!==true){
                this.PAni.playerAni.play('SlimeOutDown');//死亡动画
                this.PD.Die=true;
                this.PD.control=false;

                this.playerC.enabled=false;//关闭碰撞组件
            }//死亡状态下执行
        }//判断设置死亡状态
    },//死亡
    Hurt(atk){
        // this.PAni.hurtDataAni.node.active=true;
        this.PAni.hurtData.string=atk;
        this.PAni.hurtDataAni.play();

        this.PD.hp-=atk;
        if(this.PD.hp<=0){
            this.PD.hp=0;
        }
        if (this.PD.me){
            this.PlayerState('Die');
        }//判断自己死亡
    },//受到方法 死亡事件触发时调用
    Cure(val){
        this.PAni.cure.resetSystem();

        this.PD.hp+=val;
        if (this.PD.hp>this.PD.maxHp){
            this.PD.hp=this.PD.maxHp;
        }
    },//治愈
    TimeMove(index) {
        this.PD.score = index;

        this.GM.CubeCreate(this.GM.GD.mapSize.z);//刷新路面

        this.PD.playerTarget.setPosition(cc.v2(this.GD.cubeXArr[0][index], index * 50 + 100));
        this.node.setPosition(cc.v2(this.GD.cubeXArr[0][index], index * 50 + 100));
        //设置位置

        this.node.active = true;//开启显示
        this.PAni.shadowAni.node.active = true;
        this.PAni.node.zIndex = 2;
        this.playerC.enabled = true;//开启碰撞组件
        this.PAni.playerAni.play('SlimeJump');
        //显示部分
        this.PD.control = true;

        this.GM.RankingSort(this.PD.rank);
    },//位置移动
    OutDown() {
        let self = this;

        this.PAni.playerAni.play('SlimeOutDown');

        this.PAni.playerAni.playOutDownStart = function () {
            self.playerC.enabled = false;//关闭碰撞组件

            if (self.PD.me) {
                self.PD.control = false;//设置不可控设置不可控
                self.PlayerState('Hurt', 5);
            }//判断当前自己设置状态
        };
        this.PAni.playerAni.playEnd = function () {
            self.BackToLife();
        }
    },//掉落
    BackToLife() {
        this.node.active = false;
        if (this.PD.me) {
            let self = this;
            
            if (this.PD.Die !== true) {
                this.GM.ReadyTimePlay();
                this.AN.readyTime.playEnd = function () {
                    if (self.PD.Die !== true) {
                        if (self.PD.score <= self.GD.life + 15) {
                            self.PlayerState('TimeMove', Math.floor(self.GD.life) + 15);
                        } else {
                            self.PlayerState('TimeMove', self.PD.score - 1);
                        }
                        self.PD.control = true;
                    } else {
                        self.node.active = false;
                    }

                    this.node.active = false;
                };
            }
        }
    },
    UpdateTarget(v2) {
        this.PD.playerTarget.setPosition(v2);
    },

    update(dt){
        this.SmoothMove(dt);
    },
    SmoothMove(dt){
        // if((this.PD.playerTarget.y-this.node.y)/50>1){
        //     this.PAni.playerAni.speed=1+((this.PD.playerTarget.y-this.node.y)/50);
        //     // this.node.x=cc.misc.lerp(this.node.x,this.PD.playerTarget.x,dt*8*(1+((this.PD.playerTarget.y-this.node.y)/100)));
        //     // this.node.y=cc.misc.lerp(this.node.y,this.PD.playerTarget.y,dt*8*(1+((this.PD.playerTarget.y-this.node.y)/100)));
        // }else{
        //     // this.PAni.playerAni.speed=1+((this.PD.playerTarget.y-this.node.y)/50);
        //     // this.node.x=cc.misc.lerp(this.node.x,this.PD.playerTarget.x,dt*8);
        //     // this.node.y=cc.misc.lerp(this.node.y,this.PD.playerTarget.y,dt*8);
        // }
        this.PAni.playerAni.speed=1+((this.PD.playerTarget.y-this.node.y)/50);

        this.node.x=cc.misc.lerp(this.node.x,this.PD.playerTarget.x,dt*8);
        this.node.y=cc.misc.lerp(this.node.y,this.PD.playerTarget.y,dt*8);

    },//处理移动平滑效果
});

