/**
 * scene/Kids3depthListSCene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/kids/Kids3depthList"],
    function(util, kids3depthList) {
        var STATE_TOP = 0;
        var STATE_BANNER = 1;
        var STATE_MENU = 2;
        var STATE_SUB_MENU = 3;
        var STATE_COMP = 4;

        var _thisScene = "Kids3depthListSCene";
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
                _this = this;
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);

                _parentDiv = new W.Div({className : "bg_size"});
                //_parentDiv._bg = new W.Div({x:0, y:0, width:1280, height:720, color:"#000000", opacity:0.84});
                //_parentDiv.add(_parentDiv._bg);
                _parentDiv._bg = new W.Image({x: 0, y: 0, width: 1280, height: 720, src: "img/kid_bg.png"});
                _parentDiv.add(_parentDiv._bg);
                
                _parentDiv._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
                _parentDiv.add(_parentDiv._comp_area);

                currComponent = kids3depthList;
                _currComponent = currComponent.create(null, param);
                _parentDiv._comp_area.add(_currComponent);


                _this.add(_parentDiv);

                //setTimeout(function(){
                    currComponent.changeMode(2);
                    currComponent.show();
                //},500);

            },
            onPause: function() {

            },
            onResume: function() {

            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");

            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + state);

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else{
                        }

                        break;
                    case W.KEY.LEFT:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else{
                        }

                        break;
                    case W.KEY.UP:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else if(state > STATE_TOP){
                        }
                        break;
                    case W.KEY.DOWN:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else{
                        }
                        break;
                    case W.KEY.ENTER:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else if(state == STATE_TOP){
                        }
                        break;
                    case W.KEY.BACK:
                        _this.backScene();
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else if(state == STATE_TOP){
                        }
                        break;
                    case W.KEY.EXIT:
                    case W.KEY.KEY_ESC:
                    case W.KEY.HOME:
                    case W.KEY.MENU:
                        break;
                    case W.KEY.MENU:
                    case W.KEY.HOME:
                        break;
                    case W.KEY.NUM_0:
                    case W.KEY.NUM_1:
                    case W.KEY.NUM_2:
                    case W.KEY.NUM_3:
                    case W.KEY.NUM_4:
                    case W.KEY.NUM_5:
                    case W.KEY.NUM_6:
                    case W.KEY.NUM_7:
                    case W.KEY.NUM_8:
                    case W.KEY.NUM_9:
                    case W.KEY.KEY_OPTION:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }
                        break;
                }

            },
            onPopupClosed: function(event){
            },
        });
    });
