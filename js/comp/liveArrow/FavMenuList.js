W.defineModule(["mod/Util", "comp/liveArrow/FavMenu", "manager/SceneGuideManager"], function(util, FavMenu, sceneGuideManager) {
    function FavMenuList(_favMenuData) {
        var _this = this;

        var backCallbackFunc;
        var mode = 0;
        var tops = [402, 188, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var type;
        var posterType;
        var posterGapX, posterGapY;

        var index = 0;
        var _comp;

        var data, bannerData;

        var COLUMN_COUNT = 7;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        var create = function(){

            data = _favMenuData;

            _this.favMenuIndex = 0;
            _this.pageIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({x:0,y:0,width:319,height:data.length*108-6});
            _comp._innerDiv = new W.Div({x:0,y:0,width:319,height:data.length*108-6});

            _this.favMenu = [];
            _comp._favMenuComp = [];

            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                _this.favMenu[i] = new FavMenu(data[i], i);

                _comp._favMenuComp[i] = _this.favMenu[i].getComp();
                _comp._favMenuComp[i].setStyle({x:i%2==0?0:163, y:Math.floor(i/2)*116});

                _comp._innerDiv.add(_comp._favMenuComp[i]);
            }
            _comp.add(_comp._innerDiv);

            setDimmed();
        };

        var unFocus = function(idx) {
            if(_this.favMenu && _this.favMenu[idx]) _this.favMenu[idx].unFocus();
        };

        var setFocus = function(idx) {
            if(_this.favMenu && _this.favMenu[idx]) _this.favMenu[idx].setFocus();
        };

        var unFocusAll = function() {
            if(_this.favMenu && _this.favMenu.length > 0) {
                for(var i = 0; i < _this.favMenu.length; i++) {
                    unFocus(i);
                }
            }
        }

        var setActive = function() {
            _this.isActive = true;
            setDimmed();
            setFocus(_this.favMenuIndex);
        };

        var deActive = function() {
            _this.isActive = false;
            unFocusAll();
        };

        var setDimmed = function() {
            if(_this.favMenu && _this.favMenu.length > 0) {
                for(var i = 0; i < _this.favMenu.length; i++) {
                    if(_this.favMenuIndex < 8) {
                        _this.favMenu[i].setOpacity(i<8 ? 1 : 0.5);
                    } else {
                        _this.favMenu[i].setOpacity(i>=8 ? 1 : 0.5);
                    }
                }
            }
        }

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    unFocus(_this.favMenuIndex);
                    if(_this.favMenuIndex%2 == 1 || _this.favMenuIndex == _this.favMenu.length-1) {
                        //return false;
                    } else {
                        _this.favMenuIndex++;
                    }
                    setFocus(_this.favMenuIndex);
                    return true;
                    break;
                case W.KEY.LEFT:
                    if(_this.favMenuIndex%2 == 1) {
                        unFocus(_this.favMenuIndex);
                        _this.favMenuIndex--;
                        setFocus(_this.favMenuIndex);
                    }
                    return true;
                    break;
                case W.KEY.UP:
                    unFocus(_this.favMenuIndex);
                    if(_this.favMenuIndex < 2) {
                        return false;

                    } else {
                        _this.favMenuIndex -= 2;
                        if(_this.favMenuIndex == 6 || _this.favMenuIndex == 7) {
                            setFocus(_this.favMenuIndex);
                            setDimmed();
                            return false;
                        }
                    }

                    setFocus(_this.favMenuIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.favMenuIndex);
                    if(_this.favMenuIndex == _this.favMenu.length-1 || (_this.favMenuIndex%2==0 && _this.favMenuIndex+1 == _this.favMenu.length-1)) {
                        _this.favMenuIndex = 0;
                        setDimmed();
                        return false;
                    } else {
                        if(_this.favMenuIndex + 2 > _this.favMenu.length-1) {
                            _this.favMenuIndex = _this.favMenu.length-1;
                        } else {
                            _this.favMenuIndex += 2;
                        }
                        if(_this.favMenuIndex == 8 || _this.favMenuIndex == 9) {
                            setFocus(_this.favMenuIndex);
                            setDimmed();
                            return false;
                        }
                    }

                    setFocus(_this.favMenuIndex);
                    return true;
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.pageIndex = idx;
                if(isForced) _this.favMenuIndex = 0;
                _comp._innerDiv.setY(_this.pageIndex*-500);
            }
        }
        
        var startScene = function(name, param){
        	if(name.indexOf("KidsListScene") > 0 && !param.category.isLeaf && !param.category.children){
        		var dataManager = W.getModule("manager/SdpDataManager");
        		var reqData = {categoryId:param.category.categoryId, selector:"@detail"};

        		dataManager.getMenuTree(function(isSuccess, result){
                	if(isSuccess && result && result.data && result.data.length > 0) {
                		param.category.children = result.data;
                    }
                	
                	W.SceneManager.startScene({
                        sceneName:name,
                        param:param,
                        backState:W.SceneManager.BACK_STATE_KEEPHIDE});
        		}, reqData);
        	}else{
            	W.SceneManager.startScene({
                    sceneName:name,
                    param:param,
                    backState:W.SceneManager.BACK_STATE_KEEPHIDE});
        	}
        }

        this.getLength = function() {
            return data.length;
        }

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.setIdx = function(idx) {
            _this.favMenuIndex = idx;
        }

        this.getPageIdx = function() {
            return _this.pageIndex;
        };

        this.getTotalPage = function() {
            return Math.floor((_this.favMenu.length-1)/4)+1;
        }

        this.setFocus = function(idx) {
            setFocus(idx);
        };

        this.unFocus = function(idx) {
            unFocus(idx);
        };

        this.unFocusAll = function() {
            unFocusAll();
        };

        this.setActive = function() {
            setActive();
        };

        this.deActive = function() {
            deActive();
        };

        this.getComp = function() {
            if(!_comp) create();
            return _comp;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                case W.KEY.UP:
                case W.KEY.DOWN:
                    return operateList(event);
                case W.KEY.ENTER:
                	W.entryPath.push("liveRightBookmark.categoryId", data[_this.favMenuIndex].target.categoryId, "FavMenuList");
                    var sdpDataManager = W.getModule("manager/SdpDataManager");
                	sdpDataManager.getMenuDetail(function(isSuccess, result) {
                        if(isSuccess) {
                            if(result) {
                            	var scene = sceneGuideManager.getScene(result.data[0], function(scene){
                                	W.log.info(scene);
                                	if(scene){
                                        if(!scene.param.category) scene.param.category
                                    	if(scene.link){
                                    		W.LinkManager.action("L", scene.link);
                                    	}else{
                                    		var category;
                                    		if(scene.param.forYouData){
                                    			category = scene.param.forYouData;
                                    		}else if(scene.param.data){
                                    			category = scene.param.data;
                                    		}else{
                                    			category = scene.param.category;
                                    		}
                                            if(!_this.isClearPin && (category.isAdult || (W.StbConfig.adultMenuUse && category.isAdultOnly))) {
                                                var popup = {
                                                    type:"",
                                                    popupName:"popup/AdultCheckPopup",
                                                    childComp:_this,
                                                    param : scene
                                                };
                                                W.PopupManager.openPopup(popup);
                                            } else{
                                            	startScene(scene.name, scene.param);
//                                                W.SceneManager.startScene({
//                                                    sceneName:scene.name,
//                                                    param:scene.param,
//                                                    backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                                            }
                                    	}
                                	}
                            	});
                            }
                        } else {

                        }
                    }, {categoryId : data[_this.favMenuIndex].target.categoryId, selector:"@detail"});
                	
                	

                	
//                    if(data[_this.favMenuIndex].target.contentCategory) {
//                        W.SceneManager.startScene({
//                            sceneName: "scene/vod/MovieScene",
//                            param: {category : data[_this.favMenuIndex].target},
//                            backState: W.SceneManager.BACK_STATE_DESTROYALL
//                        });
//                    } else {
//                        W.SceneManager.startScene({
//                            sceneName: "scene/home/CategoryListScene",
//                            param: {categoryId : data[_this.favMenuIndex].target.categoryId},
//                            backState: W.SceneManager.BACK_STATE_DESTROYALL
//                        });
//                    }
                    break;
                case W.KEY.BACK:
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
            }

        }
        this.onPopupClosed = function(popup, desc) {
            if (desc) {
               if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	startScene(desc.param.name, desc.param.param);
//                        W.SceneManager.startScene({
//                            sceneName:desc.param.name,
//                            param:desc.param.param,
//                            backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
                }
            }
        }
    }
    return FavMenuList;
});