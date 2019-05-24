cc.Class({
    extends: cc.Component,
    onCollisionEnter: function (other, self){
        if(other.tag===0||other.tag===10){
            // other.node.destroy();
            other.node.active=false;
        }else if(other.tag===2){
            other.node.destroy();
        }
    },
});
