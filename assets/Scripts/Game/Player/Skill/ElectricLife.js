cc.Class({
    extends: cc.Component,

    properties: {
        ani:{
            default:null,
            type:cc.Animation,
        },
        skillCollider:{
            default: null,
            type:cc.Collider,
        }
    },
    start () {
        let self = this;
        this.ani.hurt1 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.hurt2 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.hurt3 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.hurt4 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.hurt5 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.hurt6 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.hurt7 = function () {
            self.skillCollider.enabled = true;
            self.skillCollider.scheduleOnce(function () {
                this.enabled = false;
            }, 0.05);
        };
        this.ani.playEnd = function () {
            self.skillCollider.scheduleOnce(function () {
                this.node.destroy();
            }, 0.05);
        };
    },
});
