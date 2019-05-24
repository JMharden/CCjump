cc.Class({
    extends: cc.Component,

    //PlayerController 处理事件的触发 调用PlayerManager

    properties: {
        PM: {
            default: null,
            type: cc.Object,
        },//PlayerManager 对应的PlayerManager,
    },
    onCollisionEnter: function (other, self) {
        if (this.PM.PD.me) {
            if (other.tag === 0) {
                // this.PM.OutDown();
                this.PM.PlayerState('OutDown');
                // if (other.node.name==='sand'||other.node.name==='rockR'){
                //     if (other.node.name==='rockR'){
                //         other.node.getChildByName('rockR').getComponent(cc.Animation).play('outDown');
                //     }else if (other.node.name==='sand'){
                //         other.node.getChildByName('sand').getComponent(cc.Animation).play('outDown');
                //     }
                // }
                //tag0 为空
            } else if (other.tag === 1) {
                //tag1 Player
            } else if (other.tag === 2) {
                //tag2 道具
                switch (other.node.name) {
                    case 'timeDoor':
                        this.PM.PD.control = false;
                        setTimeout(() => {
                            this.PM.PlayerState('TimeMove',this.PM.PD.score+15);
                        }, 300);
                        break;
                    case 'SceneEvent_electric':
                        this.PM.PlayerState('Hurt', 2);
                        if (this.PM.PD.control) {
                            this.PM.ControlTime(2);
                        }//在可控状态下 才可设置 不可控
                        this.PM.PlayerState('ShowState', 'ElectricSkill');

                        break;

                    default:
                        break;
                }
            } else if (other.tag === 3) {
                //tag3 技能
                let skillLife=other.node.getComponent('SkillLife');
                this.PM.InSkill(skillLife);
            } else if (other.tag === 4) {
                //tag4 路
            } else {
            }
        }
    },//PlayerTarget 碰撞事件
});
