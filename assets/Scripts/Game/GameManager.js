let GLB = require('GLBConfig');
let mvs = require('Mvs');

cc.Class({
    extends: cc.Component,

    properties: {
        GD:{
            default:null,
            type:cc.Object,
        },//GameData游戏数据
        VS:{
            default:null,
            type:cc.Object,
        },//ViewShow显示视图
        AN:{
            default:null,
            type:cc.Object,
        },//AssetsNode资源节点
        UM:{
            default:null,
            type:cc.Object,
        },//UiManager控制游戏界面

        PM:{
            default:[],
            type:cc.Object,
        }
    },

    onLoad () {
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
        this.GD=cc.find("GameData").getComponent("GameData");
        this.VS=cc.find("ViewShow").getComponent("ViewShow");
        this.AN=cc.find("AssetsNode").getComponent("AssetsNode");
        this.UM=cc.find("UiManager").getComponent("UiManager");
       
        this.GD.mePlayerIndex = GLB._GLBConfig.myIndex;
        let maxPlayNum = GLB._GLBConfig.playerUserIds.length;
        this.GD.maxPlayerNumber = maxPlayNum == 0 ? 1 : maxPlayNum;

        this.GD.playerName = GLB._GLBConfig.playerName; 
        this.GD.slime = GLB._GLBConfig.slime;
        GLB._GLBConfig.mapPack = 0;
        console.log("GM看看地图种子是啥",GLB._GLBConfig.mapPack);
        console.log('几号玩家：' + this.GD.mePlayerIndex + ',玩家人数：' + this.GD.maxPlayerNumber + '，玩家姓名：' + this.GD.playerName + ',史莱姆信息：' + this.GD.slime);
        this.GameState(window.Game.start);
        this.SetCollision(true);

        this.ReadyTimePlay();
    },
    update(dt){
        this.SmoothCamera(dt);
        this.GameOver(dt);
    },
    LifeStart() {
        let speed = 0;
        speed = (1 + (this.GD.rankingData[0].score / 50 * 0.5));
        if (this.GD.rankingData[0].score - this.GD.life >= 40 || speed > 5) {
            speed = 5;
        }
        setTimeout(() => {
            this.AN.life.y = this.GD.life * 50 + 100;
            this.GD.life += 1;
            this.LifeStart(this.GD.life);
        }, 500 / speed);
    },
    ReadyTimePlay() {
        this.AN.readyTime.node.active = true;
        this.AN.readyTime.play();

        let self = this;
        this.AN.readyTime.playEnd = function () {
            this.node.active = false;
            self.GD.isStart=true;
        };
    },
    GameOver(dt) {
        if (this.GD.isStart) {
            let speed = 2 + (this.GD.rankingData[0].score / 50 * 0.2);
            if (this.GD.rankingData[0].score - this.GD.life >= 40 || speed > 5) {
                speed = 5;
            }
            this.GD.lifeFloat += dt * speed;
            if (this.GD.lifeFloat >= 1) {
                this.GD.lifeFloat = 0;
                this.GD.life += 1;
                this.AN.life.y = this.GD.life * 50 + 100;
            }
            if (this.GD.isGameOver !== true) {
                if (this.PM[this.GD.mePlayerIndex].PD.Die) {
                    this.GD.isGameOver = true;
                    this.UM.GameOverShow();
                }
            }
        }
    },//life判断死亡
    SmoothCamera(dt){
        this.AN.MainCamera.x=cc.misc.lerp(this.AN.MainCamera.x,this.PM[this.GD.cameraTarget].PD.playerTarget.x-400,dt*2);
        this.AN.MainCamera.y=cc.misc.lerp(this.AN.MainCamera.y,this.PM[this.GD.cameraTarget].PD.playerTarget.y-200,dt*2);
    },//摄像机平滑跟踪
    CameraTarget(){
        if (this.GD.cameraTarget+1<this.GD.maxPlayerNumber){
            this.GD.cameraTarget++;
        }else{
            this.GD.cameraTarget=0;
        }
        if (this.PM[this.GD.cameraTarget].PD.Die){
            this.CameraTarget();
        }
    },
    SetPlayerState(playerIndex, stateType, val) {
        if (playerIndex === this.GD.mePlayerIndex) {
            //发送 'SetPlayerState' playerIndex,stateType,val
            this.userAlike('SetPlayerState', playerIndex, stateType, val)
        } else {
            this.PM[playerIndex].PlayerState(stateType, val);
        }//设置玩家状态
    },//接收 设置玩家状态
    Click(playerIndex, clickType,val){
        // this.GD.isClick=true;//游戏开始
        let to=true;
        if (this.PM[playerIndex].PD.control&&this.PM[playerIndex].PD.Die!==true){
            switch (clickType) {
                case 'Move':
                    this.PM[playerIndex].Move(val);
                    break;
                case 'TwoJump':
                    this.PM[playerIndex].TwoJump(val);
                    break;
                case 'ThreeJump':
                    this.PM[playerIndex].ThreeJump(val);
                    break;
                case 'Skill':
                    to=this.PM[playerIndex].Skill();
                    break;
                default:
                    break;
            }
            if (playerIndex === this.GD.mePlayerIndex && to){
                //发送自己的操作 ‘Click’ mePlayerIndex clickType lr
                this.userAlike('Click',playerIndex,clickType,val);
            }
        }//点击条件

        this.RankingSort(this.PM[playerIndex].PD.rank);//排名排序
        this.PM[playerIndex].node.zIndex=this.PM[playerIndex].PD.rank;
        this.UM.Ranking();

        this.CubeCreate(this.GD.mapSize.z);//判断生成地图

        this.SceneEvent(playerIndex);

        // this.roadChange();
    },//接收 发送 点击时执行的函数
    SceneEvent(playerIndex) {
        if (this.PM[playerIndex].PD.rank === 0 && this.GD.SceneEventInt < 3) {
            let index = (this.PM[playerIndex].PD.score + 10 + this.GD.SceneEventInt);
            let v2 = cc.v2(this.GD.cubeXArr[this.GD.SceneEventInt%this.GD.cubeXArr.length][index], index * 50 + 100);
            this.AN.SceneEventList[this.GD.SceneEventInt].node.setPosition(v2);
            this.AN.SceneEventList[this.GD.SceneEventInt].node.active = true;
            this.AN.SceneEventList[this.GD.SceneEventInt].play();

            this.GD.SceneEventInt++;
        }
    },
    userAlike(type, playerIndex, clickType, lr) {
        if (this.GD.maxPlayerNumber > 1){
            let event = {
                action: GLB._GLBConfig.USER_ALIKE,
                type: type,
                playerIndex: playerIndex,
                clickType: clickType,
                lr: lr,
            };
            this.sendUserInfo(event);
        }
    },

    sendUserInfo(event){
        let arr = GLB._GLBConfig.playerUserIds.concat();
        let index = arr.indexOf(GLB._GLBConfig.myId);
        if (index > -1) {
            arr.splice(index, 1);
        }
        let result = mvs.engine.sendEventEx(0, JSON.stringify(event), 0, arr);
        if (!result || result.result !== 0)
            return console.error('用户信息同步失败');
    },

    sendEventNotify: function (info) {
        let obj = JSON.parse(info.cpProto);
        switch (obj.action) {
            case GLB._GLBConfig.USER_ALIKE:
                if(obj.type === 'Click'){
                    this.Click(obj.playerIndex, obj.clickType, obj.lr);
                } else if (obj.type === 'SetPlayerState'){
                    this.SetPlayerState(obj.playerIndex, obj.clickType, obj.lr);
                }
                break;
        }
    },

    StartCreate(maxPlayerNumber){
        for (let p=0;p<maxPlayerNumber;p++) {
            this.GD.cubeXArr[p]=[350+(p*400)];
            let v2=this.PrefabCreate(this.AN.roadPrefabs[0],this.AN.Root,cc.v2(this.GD.cubeXArr[p][0],100+(this.GD.cubeIndex*50)),-this.GD.cubeIndex);
            this.GD.cubeX[p]=v2.x;
            this.PlayerCreate(v2, p,this.GD.playerName[p], 1, this.GD.slime[p]);
        }//初始化创建玩家对象

        this.GD.mapSize=cc.v3((350+this.GD.cubeXArr[maxPlayerNumber-1][0])/2,5+maxPlayerNumber,maxPlayerNumber);
        //初始化地图大小

        this.Ran(this.GD.mapSize.z);//判断随机获取数据
        for(let i=1;i<=20;i++){
            this.CubeCreate(this.GD.mapSize.z);
        }//初始创建方块

        for (let s = 0; s < 3; s++) {
            let SceneEventLife = this.PrefabCreate(this.AN.SceneEvent[0], this.AN.GameObj, cc.v2(0, 0), 10).getComponent('SceneEventElectric');
            SceneEventLife.GD = this.GD;
            this.AN.SceneEventList[s] = SceneEventLife.node.getComponent(cc.Animation);
        }


        let lifeN=cc.instantiate(this.AN.lifeCollider);
        lifeN.parent=this.AN.GameObj;
        lifeN.setPosition(cc.v2(this.GD.mapSize.x,this.GD.life*50+100));
        this.AN.life=lifeN;

        lifeN.getComponent(cc.BoxCollider).size.width=(this.GD.mapSize.y+10)*200*2;
        //初始化创建lifeCollider

        let uiMHP= cc.instantiate(this.AN.uiMHP);
        uiMHP.parent=this.AN.MainCamera;
        uiMHP.getComponent('UIMHP').PD=this.PM[this.GD.mePlayerIndex].PD;
        //创建uiMHP

        this.GD.cameraTarget=this.GD.mePlayerIndex;
        //初始化设置摄像机目标为自身player
    },//游戏开始初始化创建
    PrefabCreate(prefab,parent,v2,zIndex){
        let cube =cc.instantiate(prefab);
        cube.parent=parent;
        cube.setPosition(v2);
        cube.zIndex=zIndex;
        return cube;
    },//生成预制体
    PlayerCreate(v2,playerIndex,playerName,lv,slimeIndex){
        console.log(slimeIndex);
        let Player =cc.instantiate(this.AN.PlayerPrefab[slimeIndex]);
        Player.parent=this.AN.GameObj;
        Player.setPosition(v2);
        //生成Player对象

        let PM=Player.getComponent('PlayerManager');
        this.PM[playerIndex]=PM;
        PM.SetPlayerData(v2,playerIndex,playerName,lv,playerIndex===this.GD.mePlayerIndex);
        PM.GM=this;
        //获取PlayerManager 初始化设置玩家信息

        //初始化排名信息
        this.GD.rankingData[playerIndex] = PM.PD;
        PM.PD.rank = playerIndex;

        slimeIndex = slimeIndex % this.AN.skillBtnUI.length;
        if (this.GD.mePlayerIndex === playerIndex) {
            this.AN.skillButton.getComponent(cc.Sprite).spriteFrame = this.AN.skillBtnUI[slimeIndex];
            //设置技能UI
        }
    },//创建玩家对象

    SetMoveCreate(NodeName,NodeLise,NodeIndex,v2){
        let maxIndex=0;
        let nodePrefab;
        switch (NodeName) {
            case 'road':
                if (NodeLise[NodeIndex]==null){
                    nodePrefab=this.AN.roadPrefabs[0];
                }
                maxIndex=this.GD.mapSize.z*40;
                break;
            case 'rock':
                if (NodeLise[NodeIndex]==null){
                    nodePrefab=this.AN.rockR;
                }
                maxIndex=this.GD.mapSize.z*3+200;
                break;
            case 'sand':
                if (NodeLise[NodeIndex]==null){
                    nodePrefab=this.AN.sand;
                }
                maxIndex=this.GD.mapSize.z*10+150;
                break;
            case 'tree':
                if (NodeLise[NodeIndex]==null){
                    nodePrefab=this.AN.tree;
                }
                maxIndex=this.GD.mapSize.z*2+20;
                break;
            case 'house':
                if (NodeLise[NodeIndex]==null){
                    nodePrefab=this.AN.housePrefabs;
                }
                maxIndex=4;
                break;
            case 'air':
                if (NodeLise[NodeIndex]==null){
                    nodePrefab=this.AN.airCollider;
                }
                maxIndex=this.GD.mapSize.z*10+250;
                break;
        }
        if (NodeLise[NodeIndex]==null){
            NodeLise[NodeIndex]=this.PrefabCreate(nodePrefab,this.AN.Root,v2,-this.GD.cubeIndex);

        }else{
            NodeLise[NodeIndex].active=true;
            NodeLise[NodeIndex].setPosition(v2);
            NodeLise[NodeIndex].zIndex=-this.GD.cubeIndex;

        }
        switch (NodeName) {
            case 'road':
                this.GD.roadIndex++;
                if (this.GD.roadIndex>=maxIndex){
                    this.GD.roadIndex=0;
                }
                break;
            case 'rock':
                this.GD.rockIndex++;
                if (this.GD.rockIndex>=maxIndex){
                    this.GD.rockIndex=0;
                }
                break;
            case 'sand':
                this.GD.sandIndex++;
                if (this.GD.sandIndex>=maxIndex){
                    this.GD.sandIndex=0;
                }
                break;
            case 'tree':
                NodeLise[NodeIndex].zIndex += 1;

                this.GD.treeIndex++;
                if (this.GD.treeIndex>=maxIndex){
                    this.GD.treeIndex=0;
                }
                break;
            case 'house':
                NodeLise[NodeIndex].zIndex+=4;
                this.GD.houseIndex++;
                if (this.GD.houseIndex>=maxIndex){
                    this.GD.houseIndex=0;
                }
                break;
            case 'air':
                this.GD.airIndex++;
                if (this.GD.airIndex>=maxIndex){
                    this.GD.airIndex=0;
                }
                break;
        }
    },

    CubeCreate(roadSize){

        while (this.PM[this.GD.mePlayerIndex].PD.score+20 >=this.GD.cubeIndex) {
            this.Ran(this.GD.mapSize.z);

            this.GD.cubeIndex++;
            for (let p=0;p<roadSize;p++){
                this.SetMoveCreate('road',this.AN.roadList,this.GD.roadIndex,cc.v2(this.GD.cubeXArr[p][this.GD.cubeIndex],100+(this.GD.cubeIndex*50)));
                // if (this.AN.roadList[this.GD.roadIndex]==null){
                //     this.AN.roadList[this.GD.roadIndex]=this.PrefabCreate(this.AN.roadPrefabs[0],this.AN.Root,cc.v2(this.GD.cubeXArr[p][this.GD.cubeIndex],100+(this.GD.cubeIndex*50)),-this.GD.cubeIndex);
                //     this.GD.roadIndex++;
                //     if (this.GD.roadIndex>this.GD.mapSize.z*40){
                //         this.GD.roadIndex=0;
                //     }
                //     console.log('create');
                // }else{
                //     this.AN.roadList[this.GD.roadIndex].active=true;
                //     this.AN.roadList[this.GD.roadIndex].setPosition(cc.v2(this.GD.cubeXArr[p][this.GD.cubeIndex],100+(this.GD.cubeIndex*50)));
                //     this.AN.roadList[this.GD.roadIndex].zIndex=-this.GD.cubeIndex;
                //     this.GD.roadIndex++;
                //     if (this.GD.roadIndex>this.GD.mapSize.z*40){
                //         this.roadIndex=0;
                //     }
                //     console.log('set');
                // }
                // this.PrefabCreate(this.AN.roadPrefabs[0],this.AN.Root,cc.v2(this.GD.cubeXArr[p][this.GD.cubeIndex],100+(this.GD.cubeIndex*50)),-this.GD.cubeIndex);
            }
            this.SceneCreate();
        }//以自身范围条件 确定生成
    },//创建一次水平轴的方块 包括路 场景
    SceneCreate(){
        if(this.GD.cubeIndex%2!==0){
            this.GD.mapSize.x+=100;
        }else{
            this.GD.mapSize.x=(350+this.GD.cubeXArr[this.GD.mapSize.z-1][0])/2;
        }

        for(let i =1;i<=(this.roadsort(this.GD.cubeIndex,1)-this.roadsort(this.GD.cubeIndex,-1))/200;i++){
            let cubePosition=cc.v2(this.roadsort(this.GD.cubeIndex,-1)+(200*i),100+(this.GD.cubeIndex*50));
            for(let p=0;p<this.GD.mapSize.z;p++){
                if(cubePosition.x===this.GD.cubeXArr[p][this.GD.cubeIndex]){
                    break;
                }else if (p===this.GD.mapSize.z-1){
                    for (let r=0;r<this.GD.mapSize.z;r++){
                        if (cubePosition.x-200===this.GD.cubeXArr[r][this.GD.cubeIndex]||cubePosition.x+200===this.GD.cubeXArr[r][this.GD.cubeIndex]){
                            this.SetMoveCreate('air',this.AN.airList,this.GD.airIndex,cubePosition);
                            // this.PrefabCreate(this.AN.airCollider, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                            // this.PrefabCreate(this.AN.waterR, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                            break;
                        }else if(r===this.GD.mapSize.z-1){
                            if (this.Rate(2,1)){
                                if(this.Rate(3,1)){
                                    this.SetMoveCreate('rock',this.AN.rockList,this.GD.rockIndex,cubePosition);
                                    // this.PrefabCreate(this.AN.rockR, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                                    if(this.Rate(5,1)){
                                        this.SetMoveCreate('tree',this.AN.treeList,this.GD.treeIndex,cubePosition);
                                        // this.PrefabCreate(this.AN.tree, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                                    }
                                }else{
                                    this.SetMoveCreate('sand',this.AN.sandList,this.GD.sandIndex,cubePosition);

                                    // this.PrefabCreate(this.AN.sand, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                                }
                            }else if (this.Rate(10,1)){

                                // this.PrefabCreate(this.AN.door, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                            }else{
                                // this.PrefabCreate(this.AN.waterR, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                                this.SetMoveCreate('air',this.AN.airList,this.GD.airIndex,cubePosition);

                                // this.PrefabCreate(this.AN.airCollider, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                            }
                        }
                    }
                }
            }
        }
        this.sceneCreate(1);
        this.sceneCreate(-1);
    },//每次水平轴生成场景 场景生成
    sceneCreate(lr){
        for (let j=1;j<this.returnRandom(6,8);j++){
            let cubePosition=cc.v2( this.roadsort(this.GD.cubeIndex,lr)+ (j * 200*lr), 100 + (this.GD.cubeIndex * 50));
            if (lr===-1||lr===1){
                if (j!==1&&this.Rate(7-j,1)) {
                    this.SetMoveCreate('rock',this.AN.rockList,this.GD.rockIndex,cubePosition);

                    // this.PrefabCreate(this.AN.rockR, this.AN.Root,cubePosition, -this.GD.cubeIndex);
                    if (j > 3 && this.Rate(4,1)) {
                        this.SetMoveCreate('tree',this.AN.treeList,this.GD.treeIndex,cubePosition);

                        // this.PrefabCreate(this.AN.tree, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                    }if (lr===1&&j>3){
                        if (this.GD.houseRTemp <= 0&&cubePosition.x + ((200 * 8)*lr) > this.roadsort(this.GD.cubeIndex+4,lr)) {
                            this.SetMoveCreate('house',this.AN.houseList,this.GD.houseIndex,cubePosition);

                            // this.PrefabCreate(this.AN.housePrefabs[Math.floor(this.seededRandom() * this.AN.housePrefabs.length)], this.AN.Root, cubePosition, -this.GD.cubeIndex);
                            this.GD.houseRTemp = this.returnRandom(20, 30);
                        }
                    }
                    else if(lr===-1&&j>3){
                        if (this.GD.houseRTemp <= 0&&cubePosition.x - ((200 * 8)*lr) > this.roadsort(this.GD.cubeIndex+4,lr)) {
                            this.SetMoveCreate('house',this.AN.houseList,this.GD.houseIndex,cubePosition);

                            // this.PrefabCreate(this.AN.housePrefabs[Math.floor(this.seededRandom() * this.AN.housePrefabs.length)], this.AN.Root, cubePosition, -this.GD.cubeIndex);
                            this.GD.houseRTemp = this.returnRandom(20, 30);
                        }
                    }
                }
                else if (j < 3) {
                    // this.PrefabCreate(this.AN.waterR, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                    this.SetMoveCreate('air',this.AN.airList,this.GD.airIndex,cubePosition);

                    // this.PrefabCreate(this.AN.airCollider, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                }else if(j===3){
                    if (this.Rate(2,1)){
                        // this.PrefabCreate(this.AN.waterR, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                        this.SetMoveCreate('air',this.AN.airList,this.GD.airIndex,cubePosition);

                        // this.PrefabCreate(this.AN.airCollider, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                    }else{
                        this.SetMoveCreate('sand',this.AN.sandList,this.GD.sandIndex,cubePosition);

                        // this.PrefabCreate(this.AN.sand, this.AN.Root, cubePosition, -this.GD.cubeIndex);
                    }
                }
                else if (j >= 3) {
                    this.SetMoveCreate('sand',this.AN.sandList,this.GD.sandIndex,cubePosition);

                    // this.PrefabCreate(this.AN.sand, this.AN.Root,cubePosition, -this.GD.cubeIndex);
                }


            } else{
                console.log("场景生成方向参数无效");
            }
        }
        this.GD.houseLTemp--;
        this.GD.houseRTemp--;
    },

    /**
     * @return {boolean}
     */
    Ran(playerNumber) {
        let self = this;
        for (let p = 0; p < playerNumber; p++) {
            if (this.GD.LR[p] == null || this.GD.repeatTemp[p] == null) {
                this.GD.LR[p] = 1;
                this.GD.repeatTemp[p] = 0;
            }
            if (this.GD.cubeIndex >= this.GD.cubeXArr[p].length - 20) {
                for (let e = 0; e < 40; e++) {
                    if (this.GD.repeatTemp[p] <= 0) {//随机方向与同时生成
                        this.GD.LR[p] = this.returnNum(-1, 1);
                        this.GD.repeatTemp[p] = this.returnRandom(1, 5);
                    }
                    if (this.GD.cubeX[p] <= this.GD.mapSize.x - ((this.GD.mapSize.y - 1) * 200)) {
                        this.GD.LR[p] = 1;
                    } else if (this.GD.cubeX[p] >= this.GD.mapSize.x + ((this.GD.mapSize.y - 1) * 200)) {
                        this.GD.LR[p] = -1;
                    }
                    this.GD.ranCubeXArr[e] = this.GD.cubeX[p] += (this.GD.LR[p] * 100);
                    this.GD.repeatTemp[p]--;
                }
                this.GD.ranCubeXArr.forEach(function (v) {
                    self.GD.cubeXArr[p].push(v);
                });
            }
        }
    },//判断是否要生成 随机十个临时 cubeX 并且加到到cubeXArr里后
    

    Rate(Part,son){
        return Math.floor(this.seededRandom() * Part) <= (son - 1);
    },//概率方法 part分母 son分子

    RankingSort(playerRank) {
        let temp = null;
        if (playerRank === 0) {
            return;
        }
        if (this.GD.rankingData[playerRank].score > this.GD.rankingData[playerRank - 1].score) {
            for (let i = playerRank - 1; i >= 0; i--) {
                if (i <= 0) {
                    temp = this.GD.rankingData[i];
                    this.GD.rankingData[i] = this.GD.rankingData[playerRank];
                    this.GD.rankingData[i].rank = i;
                    this.GD.rankingData[playerRank] = temp;
                    this.GD.rankingData[playerRank].rank = playerRank;
                    return;
                } else if (this.GD.rankingData[playerRank].score <= this.GD.rankingData[i].score) {
                    temp = this.GD.rankingData[i + 1];
                    this.GD.rankingData[i + 1] = this.GD.rankingData[playerRank];
                    this.GD.rankingData[i + 1].rank = i + 1;
                    this.GD.rankingData[playerRank] = temp;
                    this.GD.rankingData[playerRank].rank = playerRank;
                    return;
                }
            }
        }
    },//排名排序


    roadsort(index,MaxMin){
        let array=[];
        let temp=0;
        let isEnd=true;
        for(let i=0;i<this.GD.mapSize.z;i++){
            array[i]=this.GD.cubeXArr[i][index];
        }

        while(isEnd){
            isEnd=false;
            for (let a=0;a<array.length-1;a++){
                if (array[a]>array[a+1]){
                    temp=array[a];
                    array[a]=array[a+1];
                    array[a+1]=temp;
                    isEnd=true;
                }
            }
        }

        if (MaxMin===1){
            return array[array.length-1]
        }else if(MaxMin===-1) {
            return array[0]
        }else{
            return array;
        }
    },

    roadSort(){
        let bool=true;
        if (this.GD.mapSize.z<=1){
            return bool;
        }

        let temp=[];
        let isEnd=true;
        while(isEnd){
            isEnd=false;
            for (let a=0;a<this.GD.mapSize.z-1;a++){
                if (this.GD.cubeXArr[a][this.GD.cubeIndex]>this.GD.cubeXArr[a+1][this.GD.cubeIndex]){
                    temp=this.GD.cubeXArr[a];
                    this.GD.cubeXArr[a]=this.GD.cubeXArr[a+1];
                    this.GD.cubeXArr[a+1]=temp;
                    isEnd=true;
                }else if(this.GD.cubeXArr[a][this.GD.cubeIndex]===this.GD.cubeXArr[a+1][this.GD.cubeIndex]){
                    for(let i=a;i<this.GD.mapSize.z-1;i++){
                        this.GD.cubeXArr[i][this.GD.cubeIndex]=this.GD.cubeXArr[i+1][this.GD.cubeIndex];
                        this.GD.cubeX[i]=this.GD.cubeX[i+1];
                    }
                    this.mapSizeChange(-1);
                    bool=false;
                }
            }
        }

        console.log(this.GD.mapSize.z);
        for (let i=0;i<this.GD.mapSize.z;i++){
            console.log(this.GD.cubeXArr[i][this.GD.cubeIndex]);
        }

        return bool;
    },
    roadChange(){
        if(this.roadSort()){
            if (this.GD.mapSize.z<this.GD.maxPlayerNumber&&this.GD.roadChange<=0){
                this.mapSizeChange(1);
            }
        }
        this.GD.roadChange--;
    },
    mapSizeChange(val){
        this.GD.mapSize.y+=val;
        this.GD.mapSize.z+=val;
        if(val===1){
            this.GD.cubeXArr[this.GD.mapSize.z-1][this.GD.cubeIndex]=this.GD.cubeXArr[this.GD.mapSize.z-2][this.GD.cubeIndex];
            this.GD.cubeX[this.GD.mapSize.z-1]=this.GD.cubeX[this.GD.mapSize.z-2];
        }

        this.GD.roadChange=this.returnRandom(10,20);
    },

    returnNum(min,max){
        if (this.seededRandom() < 0.5) {
            return min;
        } else {
            return max;
        }
    },//返回二个数的其中之一
    returnRandom(min,max){
        let choices = max - min + 1;
        return Math.floor(this.seededRandom() * choices + min);
    },//返回两个数之间的随机整数

    seededRandom(max, min) {
        max = max || 1;
        min = min || 0;
        GLB._GLBConfig.mapPack = (GLB._GLBConfig.mapPack * 9301 + 49297) % 233280;
        var rnd = GLB._GLBConfig.mapPack / 233280.0;
        return min + rnd * (max - min);
    },//地图种子随机方法

    animPlay(ani,aniName){
        ani.play(aniName);
    },//播放动画 (动画对象,动画名字)

    //游戏状态执行
    GameState(val){
        if(val === 0){

        }else if(val===1){
            this.StartCreate(this.GD.maxPlayerNumber);
            console.log("GameStart")
        }else if(val===2){
            this.UM.UiState(window.Game.over);
            console.log("GameOver");
        }else{
            console.log("GameState null");
        }
    },

    LoadScene(SceName){
        cc.director.loadScene(SceName);
    },//加载场景 SceName为场景名称

    SetCollision(bool,drawBool){
        let collision_manager = cc.director.getCollisionManager();
        if (bool != null) {
            collision_manager.enabled = bool;
        }
        if (drawBool!=null){
            collision_manager.enabledDebugDraw = drawBool;
        }
    },//开启或者关闭碰撞检测
});
