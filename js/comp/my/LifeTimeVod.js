W.defineModule("comp/my/LifeTimeVod", ["mod/Util", "comp/list/PosterList", "comp/Scroll"], function(util, PosterList, Scroll) {
	function LifeTimeVod(){     //평생소장
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var playMode = 0;
	    var tops = [465, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var blankHeight = [120, 310, 550];
	    var contentsType = 0;

	    var index = 0;
	    var btnIdx = 0;
	    var _comp;

	    var assetsData;

	    var hasList;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});
	    var CONTENTS_TYPE = Object.freeze({SINGLE:0, PACKAGE:1, LIFETIME:2});
	    //var PLAY_MODE_TYPE = Object.freeze({NORMAL:0, PLAY:1, EDIT:2});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	        if(!hasList && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
	    };

	    var create = function(_assetsData, bannerData){
	        _this.mode = MODE_TYPE.LIST;

	        //_comp._title = new W.Div({display:"none", x:56,y:52, text:"평생소장 VOD", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"})
	        //_comp.add(_comp._title);

	        if(!_assetsData || _assetsData.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[mode], display:"-webkit-flex", "-webkit-flex-direction":"column",
	                "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_lifetime_vod_list"], lineHeight:"22px", className:"cut",
	                "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);

	            _comp.add(_comp._blankMsg);
	            return;
	        } else {
	            hasList = true;
	        }

	        _this.listMode = "text";

	        _this.posterList = new PosterList({type:PosterList.TYPE.PURCHASE, data:_assetsData});
	        _comp._posterList = _this.posterList.getComp();
	        _comp._posterList.setStyle({x:119, y:109});
	        _comp.add(_comp._posterList);

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49+5, y: 270, display: mode == 2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

	        //_this.posterList.setActive();
            _this.changeMode(mode);
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
            sdpDataManager.getLifetimesList(cbGetAssetsData, param);
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
	            assetsData = result.data;
	        }
            create(assetsData);
	    };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };

	    this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info(this.componentName + " show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info(this.componentName + " hide");
        };
        this.create = function(callback, _param) {
            W.log.info(this.componentName + " create !!!!");
            backCallbackFunc = callback;
            _this = this;

            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;

            getAssetsData({offset:0,limit:1000});

            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.posterList) _this.posterList.setActive();
                if(_this.scroll) _this.scroll.setActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:549});
                    //_comp._posterList._poster.setStyle({y:0});
                }

                if(_comp._title) _comp._title.setStyle({display:"block"});
            } else {
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
                if(_comp._title) _comp._title.setStyle({display:"none"});
            }
            W.visibleHomeScene();
        };
        this.hasList = function(){
            return hasList;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(_this.posterList.operate(event)) {
                            _this.posterList.getPageIdx();
                            return true;
                        } else {
                            _this.posterList.deActive();
                            _this.mode = MODE_TYPE.BUTTON;
                            _this.btn[playMode][btnIdx].setFocus();
                            return true;
                        }
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(_this.posterList.operate(event)) {
                            return true;
                        } else {
                            if (_this.scroll) {
                                _this.posterList.deActive();
                                _this.mode = MODE_TYPE.SCROLL;
                                if (_this.scroll) _this.scroll.setFocus();
                            } else {
                                _this.posterList.setActive();
                            }
                            return true;
                        }
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        btnIdx = btnIdx-1 < 0 ? _this.btn[playMode].length-1 : btnIdx-1;
                        _this.btn[playMode][btnIdx].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        btnIdx = btnIdx+1 > _this.btn[playMode].length-1 ? 0 : btnIdx+1;
                        _this.btn[playMode][btnIdx].setFocus();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(_this.mode == MODE_TYPE.LIST) {
                        W.SceneManager.startScene({sceneName:"scene/VodDetailScene",
                            param:{data:_this.posterList.getCurrentData(), type:"V"}});
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.BACK:
                    _this.posterList.setPage(0, true);
                    if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                    return false;
                    break;
                case W.KEY.EXIT:
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
                    break;
                case W.KEY.COLOR_KEY_Y:
                    var popupData = {options:[
                        {name:undefined, subOptions : [
                            {type:"box", name:W.Texts["more_detail"]}
                        ]},
                        {name:undefined, subOptions : [
                            {type:"box", name:W.Texts["close"]}
                        ]}
                    ]};
                    var popup = {
                        popupName:"popup/sideOption/GuideSideOptionPopup",
                        optionData:popupData,
                        childComp : _this
                    };
                    W.PopupManager.openPopup(popup);
                    break;
            }

        };
        this.destroy = function() {
            W.log.info(this.componentName + " destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "LifeTimeVod";
	}
    
	return {
		getNewComp : function(){
			return new LifeTimeVod();
		}
	}
});