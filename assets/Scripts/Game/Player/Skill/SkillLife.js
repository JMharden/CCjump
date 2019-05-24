cc.Class({
    extends: cc.Component,

    properties: {
        skillName:'',

        playerIndex:0,//记录那个玩家释放的技能
        atk:0,
        control:false,
        controlTime:0,
    },
});
