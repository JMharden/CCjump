cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node,
        loadingStart: false,
        loadingProgressBar: cc.ProgressBar,
    },

    onLoad () {
        
    },

    wxLogin(){
        this.loading.active = true;
        cc.director.preloadScene('Home', () => {
            this.loadingStart = true;
        });
    },

    update (dt) {
        if (this.loadingStart){
            this.loadingProgressBar.progress = cc.misc.lerp(this.loadingProgressBar.progress, 1, dt * 5);
            if (this.loadingProgressBar.progress >= 0.99) {
                cc.director.loadScene('Home');
            }
        }
    },
});
