/**
 * scene/ForYouScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/home/ForYouList"],
    function(util, foryouListComp) {
        var _thisScene = "ForYouScene";

        W.log.info("### Initializing " + _thisScene + " scene ###");

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                this.foryouList = foryouListComp.getNewComp();
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);

                this._parentDiv = new W.Div({className : "bg_size"});
                this._parentDiv._bg = new W.Div({x:0, y:0, width:"1280px", height:"720px", backgroundColor : "rgba(0,0,0,0.9)"});
                this._parentDiv.add(this._parentDiv._bg);
                if(param.category.children){
                    this._parentDiv.add(this.foryouList.create(this._parentDiv, this, param.category));

                    this.add(this._parentDiv);
                    
                    this.foryouList.changeMode(2);
                    this.foryouList.show();
                }else{
            	    var sdpDataManager = W.getModule("manager/SdpDataManager");
            	    sdpDataManager.getMenuTree(function(result, data, _this){
            	    	param.category.children = data.data;
            	    	_this._parentDiv.add(_this.foryouList.create(_this._parentDiv, _this, param.category));

            	    	_this.add(_this._parentDiv);
                        
            	    	_this.foryouList.changeMode(2);
            	    	_this.foryouList.show();
            	    }, {categoryId:param.category.categoryId}, this);
                }
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
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
                this.foryouList.operate(event);
            }
        });
    });
