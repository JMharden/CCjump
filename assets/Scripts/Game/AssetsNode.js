cc.Class({
    extends: cc.Component,
    properties: {
        MainCamera: {
            default: null,
            type: cc.Node,
        },
        GameOver: {
            default: null,
            type: cc.Node,
        },
        GameObj: {
            default: null,
            type: cc.Node,
        },
        Root: {
            default: null,
            type: cc.Node,
        },
        life: {
            visible: false,
            default: null,
            type: cc.Node,
        },
        readyTime: {
            default: null,
            type: cc.Animation,
        },
        lBtn: {
            default: null,
            type: cc.Button,
        },
        rBtn: {
            default: null,
            type: cc.Button,
        },
        scoreLabel: {
            default: null,
            type: cc.Label,
        },
        rankingName: {
            default: [],
            type: cc.Label,
        },
        rankingScore: {
            default: [],
            type: cc.Label,
        },
        meRank: {
            default: null,
            type: cc.Label,
        },
        maxPlayerNumber: {
            default: null,
            type: cc.Label,
        },
        skillCD: {
            default: null,
            type: cc.Label,
        },
        resetGame: {
            default: null,
            type: cc.Button,
        },
        l2Jump: {
            default: null,
            type: cc.Button,
        },
        r2Jump: {
            default: null,
            type: cc.Button,
        },
        l3Jump: {
            default: null,
            type: cc.Button,
        },
        r3Jump: {
            default: null,
            type: cc.Button,
        },
        skillButton: {
            default: null,
            type: cc.Button,
        },
        skillBtnUI: {
            default: [],
            type: cc.SpriteFrame
        },
        cameraTarget: {
            default: null,
            type: cc.Button,
        },
        //Player
        PlayerPrefab: {
            default: [],
            type: cc.Prefab,
        },
        Slime: {
            default: [],
            type: cc.Prefab,
        },
        Skill: {
            default: [],
            type: cc.Prefab,
        },
        uiMHP: {
            default: null,
            type: cc.Prefab,
        },
        //Scenes
        SceneEvent:{
            default: [],
            type: cc.Prefab,

        },
        waterR: {
            default: null,
            type: cc.Prefab,
        },
        airCollider: {
            default: null,
            type: cc.Prefab,
        },
        lifeCollider: {
            default: null,
            type: cc.Prefab,
        },

        rockR: {
            default: null,
            type: cc.Prefab,
        },
        sand: {
            default: null,
            type: cc.Prefab,
        },
        tree: {
            default: null,
            type: cc.Prefab,
        },
        obstacle: {
            default: null,
            type: cc.Prefab,
        },
        housePrefabs: {
            default: null,
            type: cc.Prefab,
        },
        playerName: {
            default: null,
            type: cc.Prefab,
        },
        meTap: {
            default: null,
            type: cc.Prefab,
        },
        door: {
            default: null,
            type: cc.Prefab,
        },
        roadPrefabs: {
            default: [],
            type: cc.Prefab,
        },//cube预制体数组

        //SceneNode
        roadList: {
            visible: false,
            default: [],
            type: cc.Node,
        },
        rockList: {
            visible: false,
            default: [],
            type: cc.Node,
        },
        sandList: {
            visible: false,
            default: [],
            type: cc.Node,
        },
        treeList: {
            visible: false,
            default: [],
            type: cc.Node,
        },
        houseList: {
            visible: false,
            default: [],
            type: cc.Node,
        },
        airList: {
            visible: false,
            default: [],
            type: cc.Node,
        },
        SceneEventList:{
            visible: false,
            default: [],
            type: cc.Animation,
        }
    },
});
