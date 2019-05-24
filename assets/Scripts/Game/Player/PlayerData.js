cc.Class({
    extends: cc.Component,

    //PlayerData 记录player的数据 Slime角色的属性

    properties: {
        slimeName:'',

        playerIndex:0,
        playerName:'',
        me:false,
        rank:0,
        score:1,

        //初始化固定值
        lv:0,
        hp:100,
        maxHp:100,
        mp:100,//释放技能消耗
        maxMp:100,
        atk:10,
        skillCD:false,//技能CD状态
        skillMP:0,
        skillCDInt:15,
        skillCDTime:0,//技能CD

        //增益状态 状态持续时间
        fly:false,//飞行状态
        flyTime:0,
        immune:false,//免疫任何伤害
        immuneTime:0,

        //异常状态 状态持续时间
        control:true,//是否可以控制
        controlTime:0,

        Die:false,

        playerTarget:cc.Node,
    },
});
