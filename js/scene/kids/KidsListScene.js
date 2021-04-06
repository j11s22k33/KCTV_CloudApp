/**
 * scene/KidsListScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/kids/KidsList", "comp/CouponInfo"],
    function(util, kidsList, couponInfoComp) {
        var STATE_TOP = 0;
        var STATE_BANNER = 1;
        var STATE_MENU = 2;
        var STATE_SUB_MENU = 3;
        var STATE_COMP = 4;

        var _thisScene = "KidsListScene";

        W.log.info("### Initializing " + _thisScene + " scene ###");

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                W.log.info(param)

                this._parentDiv;
                this.currComponent;
                this._currComponent;

                this.couponInfo = couponInfoComp.getNewComp(true);

                this.state = STATE_COMP;
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_Y]);

                this._parentDiv = new W.Div({className : "bg_size"});
                //_parentDiv._bg = new W.Div({x:0, y:0, width:1280, height:720, color:"#000000", opacity:0.84});
                //_parentDiv.add(_parentDiv._bg);
                this._parentDiv._bg = new W.Image({x:0,y:0,width:1280, height:720, src:"img/kid_bg.png"});
                this._parentDiv.add(this._parentDiv._bg);
                this._parentDiv._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
                this._parentDiv.add(this._parentDiv._comp_area);

                param.parent = this;
                this.currComponent = kidsList.getNewComp();
                this._currComponent = this.currComponent.create(undefined, param);
                this._parentDiv._comp_area.add(this._currComponent);


                this._parentDiv.add(this.couponInfo.getComp(592, 38));
                this.couponInfo.setData(null, [{color:"Y", text:W.Texts["kids_mode"]}]);

                this.add(this._parentDiv);

                if(param.callback) param.callback();

                //setTimeout(function(){
                this.currComponent.changeMode(2);
                this.currComponent.show();
                //},500);

            },
            onPause: function() {

            },
            onResume: function() {
                this._parentDiv.setDisplay("");
            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");
                this.currComponent.destroy();
            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + this.state);

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }else{
                        }

                        break;
                    case W.KEY.LEFT:
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }else{
                        }

                        break;
                    case W.KEY.UP:
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }else if(this.state > STATE_TOP){
                        }
                        break;
                    case W.KEY.DOWN:
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }else{
                        }
                        break;
                    case W.KEY.ENTER:
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }else if(this.state == STATE_TOP){
                        }
                        break;
                    case W.KEY.BACK:
                        this.backScene();
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }else if(this.state == STATE_TOP){
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
                    case W.KEY.COLOR_KEY_Y:
                        if(this.state == STATE_COMP){
                            this.currComponent.operate(event);
                        }
                        break;
                }

            },
            onPopupClosed: function(event){
            },
        });
    });
