
cc.Class({
    extends: cc.Component,
    properties: {
        cube:{
            default:null,
            type:cc.Animation,
        },
        isDown:true,
    },
    onCollisionEnter: function (other, self) {
        // if(this.isDown){
        //     if(other.tag===0){
        //         this.cube.play("outDown");
        //         this.isDown=false;
        //     }
        // }
        if(other.tag===0) {
            self.node.active=false;
        }


    },
    onCollisionExit: function (other, self) {
        if(this.isDown){
            if (other.tag===1){
                this.cube.play("roadRunAni");
            }
        }
    },
    start () {
        let self = this;
        this.cube.removeCube = function(){//方块掉下完成后删除自身
            self.node.active=false;
        };
    },
});
