import { _GLBConfig, _GLBFun } from 'GLBConfig';

cc.Class({
    extends: cc.Component,

    properties: {
        list: cc.Node,
        nextPre: cc.Prefab,
    },

    start() {
        _GLBFun.ajax({
            url: '/api.php?m=Api&c=Index&a=clubRecords',
            success: (res) => {
                for(let i = 0; i<res.data.length; i++){
                    let item = cc.instantiate(this.nextPre);
                    item.getComponent("mailItem").data = res.data[i];
                    item.parent = this.list;
                }
            }
        })
    },

    close() {
        this.node.destroy();
    },

    // update (dt) {},
});
