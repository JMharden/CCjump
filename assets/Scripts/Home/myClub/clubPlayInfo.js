import {_GLBConfig , _GLBFun } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        ID: '',
        list: cc.Node,
        next: cc.Prefab,
    },

    
    start () {
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubMembers',
            data:{
                club_id: this.ID,
            },
            success: (res) => {
                for(let i = 0; i<res.length; i++){
                    let item = cc.instantiate(this.next);
                    item.getComponent('clubPlayItem').data = res[i];
                    item.parent = this.list;
                }
            }
        })
    },
    close(){
        this.node.destroy();
    }

    // update (dt) {},
});
