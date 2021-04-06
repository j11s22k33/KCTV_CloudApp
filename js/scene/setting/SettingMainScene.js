/**
 * scene/SettingMainScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/setting/SettingMain"],
    function(util, settingMain) {
        var STATE_TOP = 0;
        var STATE_BANNER = 1;
        var STATE_MENU = 2;
        var STATE_SUB_MENU = 3;
        var STATE_COMP = 4;

        var _thisScene = "SettingMainScene";
        var _this;
        var _parentDiv;
        var currMenu;
        var currComponent;
        var _currComponent;
        var keyTimeout;

        var state = STATE_COMP;

        W.log.info("### Initializing " + _thisScene + " scene ###");

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                W.log.info(param);
                _this = this;
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);

                _parentDiv = new W.Div({className : "bg_size"});
                _parentDiv._bg = new W.Div({x:0, y:0, width:1280, height:720, className : "bg_color"});
                _parentDiv.add(_parentDiv._bg);
                _parentDiv._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
                _parentDiv.add(_parentDiv._comp_area);

                currComponent = settingMain.getNewComp();
                _this.add(_parentDiv);
                
                if(param){
                	_currComponent = currComponent.create(null, _this, param);
                    _parentDiv._comp_area.add(_currComponent);
                    
                    currComponent.changeMode(2);
                    currComponent.show();
                }
            },
			setCategoryData: function(data){
				W.log.info(data);
				_currComponent = currComponent.create(null, _this, data);
                _parentDiv._comp_area.add(_currComponent);
                
                currComponent.changeMode(2);
                currComponent.show();
			},
            onPause: function() {

            },
            onResume: function() {

            },
            onRefresh: function() {
            	currComponent.onRefresh();
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");

            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + state);
                if(event.keyCode == W.KEY.BACK || event.keyCode == W.KEY.EXIT){
                	this.backScene();
                }else{
                    currComponent.operate(event);
                }
            }
        });
    });
