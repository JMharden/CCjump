cc.Class({
    extends: cc.Component,
    properties: {
        state: 0,
        life: 10,
        PD: {
            default: null,
            type: cc.Object,
        },
        targetCollider: {
            default: null,
            type: cc.Collider,
        },
        target: {
            default: null,
            type: cc.Node,
        },
        targetV2: {
            default: [],
            type: cc.Vec2,
        },
        bloodAbs_Particle: {
            default: null,
            type: cc.ParticleSystem,
        },
        bloodShadow_Particle: {
            default: null,
            type: cc.ParticleSystem,
        },
        index: 0,
        speed: 1.5,
    },
    start() {
        this.speed = this.speed + (0.2 * this.index);
        this.targetCollider.scheduleOnce(function () {
            this.enabled = true;
        }, 0.5);
    },
    update(dt) {
        this.SmoothMove(dt);
        this.Life(dt);

    },
    Life(dt) {
        this.life -= dt;
        if (this.life <= 0) {
            this.node.destroy();
        }
    },
    onCollisionEnter: function (other, self) {
        if (this.PD.playerIndex !== other.node.getComponent('PlayerController').PM.PD.playerIndex) {
            switch (self.tag) {
                case 5:
                    if (this.state === 0) {
                        this.state++;
                        this.life = 5;

                        this.targetV2[this.index] = new cc.Vec2(0, 0);
                        this.speed = 3;
                        this.target = other.node;
                    }
                    break;
                case 3:
                    if (this.state === 1) {
                        this.bloodAbs_Particle.resetSystem();
                        this.state++;
                        this.life = 5;

                        this.target = this.PD.playerTarget;//飞回
                        this.speed = 5;
                    }
                    break;
                default:
                    break;
            }
        }
    },
    onCollisionExit: function (other, self) {
        if (this.state === 1 && this.PD.playerIndex !== other.node.getComponent('PlayerController').PM.PD.playerIndex) {
            // this.node.destroy();
        }
    },
    SmoothMove(dt) {
        if (this.target.x + this.targetV2[this.index].x > this.node.x) {
            this.node.scaleX = -1;
        } else {
            this.node.scaleX = 1;
        }
        this.node.x = cc.misc.lerp(this.node.x, this.target.x + this.targetV2[this.index].x, dt * this.speed);
        this.node.y = cc.misc.lerp(this.node.y, this.target.y + this.targetV2[this.index].y, dt * this.speed);
    }
});
