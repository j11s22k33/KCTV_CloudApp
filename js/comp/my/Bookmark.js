W.defineModule("comp/my/Bookmark", ["mod/Util", "comp/list/MenuList", "comp/Scroll", "comp/setting/Button", "manager/SceneGuideManager"], 
		function(util, MenuList, Scroll, Button, sceneGuideManager) {
	function Bookmark(){    //즐겨찾기
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var playMode = 0;
	    var tops = [465, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var blankHeight = [180, 330, 570];
	    var isAddedEntryPath = false;
	    
	    var index = 0;
	    var btnIdx = 0;
        var _bookmarkListDiv;
	    var _comp;
	    var _parent;

	    var assetsData;

	    var hasList;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1, BUTTON:2});
	    var PLAY_MODE_TYPE = Object.freeze({NORMAL:0, EDIT:1});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_bookmarkListDiv, {y:tops[mode], opacity : opacity[mode]});
	        if(!hasList && _comp && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
	    };

	    var create = function(_assetsData, bannerData){
            if(_comp) {
                _bookmarkListDiv.remove(_comp);
            }
            _comp = new W.Div({});
	        if(!_assetsData || _assetsData.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[mode], display:"-webkit-flex", "-webkit-flex-direction":"column", "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_bookmark_list"], lineHeight:"22px", className:"cut", "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);

	            _comp._blankMsg._span2 = new W.Div({position:"relative", height:26, "word-break":"break-all",
	                lineHeight:"21px", "white-space":"pre", textColor:"#828282", fontFamily:"RixHeadL", "font-size":"17px", textAlign:"center"});


                _comp._blankMsg._span2.comp.innerHTML =  W.Texts["bookmark_guide1"].replace("@img@",
                    "<img style='position:relative;margin:-33px -25px -36px -18px' src='img/color_yellow_mini.png'>");
                _comp._blankMsg.add(_comp._blankMsg._span2);


	            _comp._blankMsg._span3 = new W.Div({position:"relative", height:26, text:W.Texts["bookmark_guide2"], "word-break":"break-all",
	                lineHeight:"21px", "white-space":"pre-line", textColor:"#828282", fontFamily:"RixHeadL", "font-size":"17px", textAlign:"center"});
	            _comp._blankMsg.add(_comp._blankMsg._span3);

	            //_comp._blankMsg.add(new W.Image({position:"relative", x:47, y:-66, src:"img/color_yellow_mini.png"}));

	            _comp.add(_comp._blankMsg);
	            _bookmarkListDiv.add(_comp);
	            return;
	        } else {
	            hasList = true;
	        }

	        _this.mode = MODE_TYPE.LIST;

	        _this.listMode = "text";

	        _this.posterList = new MenuList({type:MenuList.TYPE.BOOKMARK, data:_assetsData,
                isClearPin : _this.isClearPin});
	        _comp._posterList = _this.posterList.getComp();
	        _comp._posterList.setStyle({x:115, y:151});
	        _comp.add(_comp._posterList);

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49+5, y: 270, display: mode == 2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

	       // _comp.add(new W.Div({text:"현재", x:1032, y:321, width:100, textColor:"#C7C7C7", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"0.18px"}));
	       // _comp._selectedNumber = new W.Div({text:"", x:900, y:349, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"22px", textAlign:"Right", "letter-spacing":"-1.1px"});
	       // _comp.add(_comp._selectedNumber);
	        //_comp.add(new W.Div({text:"개 선택(최대 150개)", x:1004, y:354, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));


	        _comp.add(new W.Div({x:1004, y:161, width:1, height:496, color:"rgba(131,122,119,0.25)"}));

	        _comp._normalDiv = new W.Div({});
	        _comp._normalDiv.add(new W.Div({text:W.Texts["total"], x:1069, y:315, width:100, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"18px",
                textAlign:"left", "letter-spacing":"-0.7px"}));
	        _comp._normalDiv._selectedNumber = new W.Div({text:assetsData.length, x:1087, y:310, width:28, textColor:"#E53000", fontFamily:"RixHeadB",
                "font-size":"24px", textAlign:"center", "letter-spacing":"-1.1px"});
	        _comp._normalDiv.add(_comp._normalDiv._selectedNumber);
	        _comp._normalDiv.add(new W.Div({text:W.Texts["count_unit2"], x:1117, y:315, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"left", "letter-spacing":"-0.7px"}));
	        _comp.add(_comp._normalDiv);

	        _comp._editDiv = new W.Div({display:"none"});
	        _comp._editDiv._selectedNumber = new W.Div({text:0, x:958, y:261, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"24px",
                textAlign:"Right", "letter-spacing":"-1.1px"});
	        _comp._editDiv.add(_comp._editDiv._selectedNumber);
	        _comp._editDiv.add(new W.Div({text:W.Texts["count_unit2"] + " " + W.Texts["select"], x:1063, y:267, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
	        _comp._editDiv.add(new W.Div({text:"/ "+assetsData.length+W.Texts["count_unit2"], x:1117, y:267, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
	        _comp.add(_comp._editDiv);

	        _this.btn = [[],[],[]], _comp._btn = [[],[],[]];
	        _this.btn[PLAY_MODE_TYPE.NORMAL][0] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.NORMAL][0] = _this.btn[PLAY_MODE_TYPE.NORMAL][0].getComp({x:1043, y:347, text:W.Texts["modify_mode"]});
	        _comp._normalDiv.add(_comp._btn[PLAY_MODE_TYPE.NORMAL][0]);

	        _this.btn[PLAY_MODE_TYPE.EDIT][0] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][0] = _this.btn[PLAY_MODE_TYPE.EDIT][0].getComp({x:1043, y:299, text:W.Texts["select_all"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][0]);
	        _this.btn[PLAY_MODE_TYPE.EDIT][1] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][1] = _this.btn[PLAY_MODE_TYPE.EDIT][1].getComp({x:1043, y:347, text:W.Texts["delete"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][1]);
	        _this.btn[PLAY_MODE_TYPE.EDIT][2] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][2] = _this.btn[PLAY_MODE_TYPE.EDIT][2].getComp({x:1043, y:395, text:W.Texts["cancel"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][2]);

	        //_this.posterList.setActive();
            _this.changeMode(mode);

            _bookmarkListDiv.add(_comp);
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
	        sdpDataManager.getViewingFavorites(cbGetAssetsData, param);
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
	            assetsData = result.data;
	        }else{
	        	if(mode == 2){
	        		_parent.showAll(true);
	        	}
	        }

	        if(assetsData.length == 0){
	        	if(mode == 2){
	        		_parent.showAll(true);
	        	}
	        }
            create(assetsData);
	    };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };

        var getSelectedAssetList = function() {
            W.log.info(_this.selectedArray)
            var array = [];
            for(var i = 0; i < _this.selectedArray.length; i++) {
                array.push(assetsData[_this.selectedArray[i]]);
            }
            return array;
        }

        var checkSelect = function() {
            _comp._editDiv._selectedNumber.setText(_this.selectedArray.length);
            
            if(_this.selectedArray.length == assetsData.length) {
                _this.btn[playMode][0].setText(W.Texts["unselect_all"]);
            } else {
                _this.btn[playMode][0].setText(W.Texts["select_all"]);
            }
            
            if(_this.selectedArray.length > 0){
                _comp._btn[playMode][1].setStyle({opacity:1});
            }else{
                _comp._btn[playMode][1].setStyle({opacity:0.4});
            }
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
        this.create = function(callback, _p, _param) {
            W.log.info(this.componentName + " create !!!!");
            backCallbackFunc = callback;
            _this = this;
            _parent = _p;

            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;
            _this.isClearPin = _param.isClearPin;
            getAssetsData({offset:0,limit:18});

            _bookmarkListDiv = new W.Div({id:"bookmark_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            return _bookmarkListDiv;
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
            } else {
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
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

                            if(playMode != PLAY_MODE_TYPE.NORMAL) {
                                if(_this.selectedArray.length > 0) {
                                    if(playMode == PLAY_MODE_TYPE.EDIT) {
                                        btnIdx = 1;
                                    }
                                } else {
                                    btnIdx = 0;
                                }
                            } else {
                                btnIdx = 0;
                            }

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
                    	if(_this.btn){
                			_this.btn[playMode][btnIdx].unFocus();
                    		if(playMode == PLAY_MODE_TYPE.EDIT && _this.selectedArray.length == 0){
                    			if(btnIdx == 2){
                    				btnIdx = 0;
                    			}else{
                    				btnIdx = 2;
                    			}
                    		}else{
                                btnIdx = btnIdx-1 < 0 ? _this.btn[playMode].length-1 : btnIdx-1;
                    		}
                            _this.btn[playMode][btnIdx].setFocus();
                            return true;
                    	}else{
                    		return false;
                    	}
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
                        if(playMode == PLAY_MODE_TYPE.EDIT && _this.selectedArray.length == 0){
                			if(btnIdx == 2){
                				btnIdx = 0;
                			}else{
                				btnIdx = 2;
                			}
                		}else{
                            btnIdx = btnIdx+1 > _this.btn[playMode].length-1 ? 0 : btnIdx+1;
                		}
                        _this.btn[playMode][btnIdx].setFocus();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(_this.mode == MODE_TYPE.LIST) {
                        if(playMode == PLAY_MODE_TYPE.NORMAL) {
                            var category = _this.posterList.getCurrentData().target;

                            if(!_this.isClearPin && (category.adultPinRequired || (W.StbConfig.adultMenuUse && category.adultCategory))) {
                                var popup = {
                                    type:"",
                                    popupName:"popup/AdultCheckPopup",
                                    childComp:_this,
                                };
                                W.PopupManager.openPopup(popup);
                            } else{
                        		goScene();
                        	}
                        } else if(playMode == PLAY_MODE_TYPE.EDIT){
                        	_this.selectedArray = _this.posterList.setSelect();
                            checkSelect();
                        }
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON){
                    	if(playMode == PLAY_MODE_TYPE.NORMAL) {
                    		if(btnIdx == 0) {
                                _this.btn[playMode][btnIdx].unFocus();
                                playMode = PLAY_MODE_TYPE.EDIT;
                                _this.posterList.setSelectableMode(true);
                                _this.selectedArray = [];
                                _comp._editDiv._selectedNumber.setText(_this.selectedArray.length);
                                _comp._normalDiv.setStyle({display:"none"});
                                _comp._editDiv.setStyle({display:"block"});

                                _this.posterList.setPage(0, true);
                                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                                _this.posterList.setActive();
                                _this.mode = MODE_TYPE.LIST;

                                checkSelect();
                            }
                        } else if(playMode == PLAY_MODE_TYPE.EDIT){
                        	if(btnIdx == 0) {
                                if(_this.selectedArray.length == assetsData.length) {
                                    _this.selectedArray = _this.posterList.resetSelect();
                                    _this.posterList.setSelectableMode(true);
                                } else {
                                    _this.selectedArray = _this.posterList.setSelectAll();
                                }
                                checkSelect();
                            } else if(btnIdx == 1) {
                                var popup = {
                                    popupName: "popup/my/BookmarkRemovePopup",
                                    data: {
                                        list : getSelectedAssetList(),
                                        idx : _this.param.listId,
                                    },
                                    childComp: _this
                                };
                                W.PopupManager.openPopup(popup);
                            } else if(btnIdx == 2) {
                                _this.btn[playMode][btnIdx].unFocus();
                                playMode = PLAY_MODE_TYPE.NORMAL;
                                _this.posterList.setSelectableMode(false);
                                _this.selectedArray = _this.posterList.resetSelect();
                                _comp._editDiv.setStyle({display:"none"});
                                _comp._normalDiv.setStyle({display:"block"});
                                btnIdx = 0;

                                _this.btn[playMode][btnIdx].unFocus();
                                _this.posterList.setPage(0, true);
                                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                                _this.posterList.setActive();
                                _this.mode = MODE_TYPE.LIST;
                                //_this.btn[playMode][btnIdx].setFocus();
                            }
                        }
                        return true;
                    }
                    break;
                case W.KEY.BACK:
                	if(!hasList) return false;
                    if(playMode == PLAY_MODE_TYPE.NORMAL) {
                        if(_this.mode == MODE_TYPE.BUTTON) {
                            _this.btn[playMode][btnIdx].unFocus();
                            _this.mode = MODE_TYPE.LIST;
                            _this.posterList.setPage(0, true);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                            return false;
                        } else {
                            _this.posterList.setPage(0, true);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                            return false;
                        }
                    } else if(playMode == PLAY_MODE_TYPE.EDIT){
                        _this.btn[playMode][btnIdx].unFocus();
                        playMode = PLAY_MODE_TYPE.NORMAL;
                        _this.mode = MODE_TYPE.LIST;
                        _this.posterList.setSelectableMode(false);
                        _this.selectedArray = _this.posterList.resetSelect();
                        _comp._editDiv.setStyle({display:"none"});
                        _comp._normalDiv.setStyle({display:"block"});
                        btnIdx = 0;

                        _this.btn[playMode][btnIdx].unFocus();
                        _this.posterList.setPage(0, true);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                    }
                    return true;
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
                case W.KEY.KEY_OPTION:
                   break;
            }

        };
        this.destroy = function() {
            W.log.info(this.componentName + " destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.resume = function(){
        	W.log.info("destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.getMode = function(){
            return mode;
        };
        this.onPopupClosed = function(popup, desc) {
            if (desc) {
                if(desc.popupName == "popup/my/BookmarkRemovePopup") {
                    if(desc.action == W.PopupManager.ACTION_OK) {
                        var selectedArray = getSelectedAssetList();
                        var selectedString = [];
                        for(var i = 0; i < selectedArray.length; i++) {
                            selectedString.push(selectedArray[i].favoriteId);
                        }
                        sdpDataManager.removeViewingFavorite(function(isSuccess, result) {
                            if(isSuccess) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["total"] + " " + result.total + W.Texts["count_unit2"],
                                    desc:W.Texts["bookmark_msg_removed"],
                                    type:"2LINE"
                                });

                                playMode = PLAY_MODE_TYPE.NORMAL;
                                btnIdx = 0;
                                getAssetsData({offset:0,limit:18});
                            } else {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/ErrorPopup",
                                    code: (result && result.error && result.error.code) ? result.error.code : null,
                                    message : (result && result.error && result.error.message) ? [result.error.message] : null,
                        			from : "SDP"
                                });
                            }
                        }, {favoriteId : selectedString});
                    }
                }else if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	goScene();
                    }
                }
            }
        };
        
        function goScene(){
        	sdpDataManager.getMenuDetail(function(isSuccess, result) {
                if(isSuccess) {
                    if(result) {
                    	isAddedEntryPath = true;
                		W.entryPath.push("bookmark.categoryId", result.data[0], "Bookmark");
                    	W.log.info(result);
                    	var scene = sceneGuideManager.getScene(result.data[0], function(scene){
                        	W.log.info(scene);
                        	if(scene){
                            	if(scene.link){
                            		W.LinkManager.action("L", scene.link);
                            	}else{
                            		W.SceneManager.startScene({sceneName:scene.name, 
                	    				param:scene.param,
                	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            	}
                        	}
                    	});
                    }
                } else {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code: (result && result.error && result.error.code) ? result.error.code : null,
                        message : (result && result.error && result.error.message) ? [result.error.message] : null,
            			from : "SDP"
                    });
                }
            }, {categoryId : _this.posterList.getCurrentData().target.categoryId, selector:"@detail"});
        };
        this.componentName = "Bookmark";
	}
    
	return {
		getNewComp : function(){
			return new Bookmark();
		}
	}
});