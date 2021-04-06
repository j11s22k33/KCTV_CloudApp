/**
 * scene/PlayListScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/my/PlayList", "comp/CouponInfo"],
    function(util, playList, couponInfoComp) {
        var STATE_TOP = 0;
        var STATE_BANNER = 1;
        var STATE_MENU = 2;
        var STATE_SUB_MENU = 3;
        var STATE_COMP = 4;

        var _thisScene = "PlayListScene";

        W.log.info("### Initializing " + _thisScene + " scene ###");

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                W.log.info(param);
                this.state = STATE_COMP;
                
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_Y]);

                this._parentDiv = new W.Div({className : "bg_size"});
                this._parentDiv._bg = new W.Div({x:0, y:0, width:1280, height:720, className : "bg_color"});
                this._parentDiv.add(this._parentDiv._bg);
                this._parentDiv._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
                this._parentDiv.add(this._parentDiv._comp_area);
                
                this._parentDiv._title = new W.Div({x:56,y:52, text:param.category.title, textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"})
                this._parentDiv.add(this._parentDiv._title);

                this.currComponent = playList.getNewComp();
                var _currComponent = this.currComponent.create(this._parentDiv, this, {listId : param.category.listId, mode : 2});
                this._parentDiv._comp_area.add(_currComponent);
                
                var couponInfo = couponInfoComp.getNewComp();
                this._parentDiv.add(couponInfo.getComp(592, 38));
                
                
        		couponInfo.setData();
        		this.couponInfo = couponInfo;

        		this.add(this._parentDiv);

                /*setTimeout(function(){
                    currComponent.changeMode(2);
                    currComponent.show();
                },500);*/

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
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, this.state : " + this.state);

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
                        if(this.state == STATE_COMP){
                            var returnVal = this.currComponent.operate(event);
                            if(!returnVal) this.backScene();
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
