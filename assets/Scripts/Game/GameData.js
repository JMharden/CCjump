
window.Game = cc.Enum({
    default: 0,
    start: 1,
    over: 2,
});
window.GameType = {
    state:{ //游戏状态
        default: 0,
        start: 1,
        over: 2,
    },
    type:{ //游戏类型
        singleGame: 0,//单机模式
        OneVsOne: 1,//1v1对战模式
    },
    currentType: 0, //当前的游戏状态
};
cc.Class({
    extends: cc.Component,
    properties:() => ({
        mePlayerIndex:{
            default:0,
            type:cc.Integer,
        },
        maxPlayerNumber:{
            default:1,
            type:cc.Integer,
        },
        
        playerName:[cc.String],
        lv: [cc.Integer],
        slime:[cc.Integer],

        rankingData:[],//PlayerData对象的数组

        isStart:false,
        isGameOver:false,

        lifeFloat:0,
        life:-5,

        cubeIndex:0,
        mapSize:cc.Vec3,
        roadChange:0,
        cubeXArr:{
            default:[],
            type:cc.Integer,
        },
        cubeX:{
            default:[],
            type:cc.Integer,
        },
        ranCubeXArr:{
            default: [],
            type:cc.Integer,
        },//临时存储随机10个 cube

        LR:{
            default: [],
            type:cc.Integer,
        },//随机方向 L:-1 R:1
        repeatTemp:{
            default: [],
            type:cc.Integer,
        },//同时一个方向生成多少
        houseLTemp:0,
        houseRTemp:0,

        //AssetsNode
        SceneEventInt:0,
        roadIndex:0,
        rockIndex:0,
        sandIndex:0,
        treeIndex:0,
        houseIndex:0,
        airIndex:0,


        cameraTarget:0,//摄像机移动目标点
    }),
});
