// var Tips = {
//     _detailLabel:   null,   // 内容
// };
// var ImgBase = {};

// Tips.show = function (detailString) {

//     // 加载 prefab 创建
//     cc.loader.loadRes("TipsTop", cc.Prefab, function (error, prefab) {

//         if (error) {
//             cc.error(error);
//             return;
//         }

//         // 实例
//         var tips = cc.instantiate(prefab);
//         var tipsAni=tips.getChildByName('tips').getComponent(cc.Animation);
//         tipsAni.playEnd=function(){
//             tips.destroy();
//         }

//         // 设置字符
//         Tips._detailLabel = cc.find("tips/TipsLabel", tips).getComponent(cc.Label);
//         Tips._detailLabel.string = detailString;

//         // 父视图
//         tips.parent = cc.find("Canvas");

//     });
// };

// ImgBase.show = function(tartget){
//     cc.loader.loadRes("ImgBase", cc.Prefab, function (error, prefab) {
//         if (error) {
//             cc.error(error);
//             return;
//         }
//         // 实例
//         var ImgBase = cc.instantiate(prefab);
//         var ImgBaseJs = ImgBase.getComponent('ImgBase');
//         ImgBaseJs.targetNode = tartget;
//         ImgBase.parent = cc.find("Canvas");

//     });
// };
