W.defineModule("comp/home/CategoryList", ["mod/Util", "comp/list/BoxList", "comp/Scroll"], function(util, BoxList, Scroll) {
    function CategoryList(){
    	var _this;
    	var dataManager = W.getModule("manager/SdpDataManager");
        var uipDataManager = W.getModule("manager/UiPlfDataManager");
    	    
    	var backCallbackFunc;
        var mode = 0;
        var tops = [475, 255, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var categoryData;
        var bannerData;
        var isAddedEntryPath = false;
        var isClearPin;

        var index = 0;
        var _comp;

        var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});

        var changeY = function(){
        	W.log.info("changeY mode == " + mode);
        	if(mode == 0.8){
        		W.Util.setStyle(_comp, {y:tops[1]+40, opacity : opacity[1]});
            }else{
            	W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
            }
        };

        var create = function(){
            _this.mode = MODE_TYPE.LIST;
            W.log.info(categoryData);
            _this.listMode = "box";

            _this.cateList = new BoxList({type:BoxList.TYPE.MOVIE, data:categoryData, bannerData:bannerData, isZzim:_this.category.categoryCode == "CC0103" ? true : false, startIdx:_this.startIdx});
            _comp._posterList = _this.cateList.getComp();
            _comp._posterList.setStyle({x:193, y:131});
            _comp.add(_comp._posterList);

            if(_this.cateList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.cateList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x:49+5, y:270, display:mode==2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }
            
            if(W.SceneManager.getCurrentScene().id.indexOf("CategoryListScene") > 0){
            	if(_this.cateList) _this.cateList.setActive();
                if(_this.scroll) _this.scroll.setActive();
            }
            W.visibleHomeScene();
            W.log.info("category init time : " + (new Date().getTime() - W.time.getTime()));
        };

        var unFocus = function() {
        };

        var setFocus = function() {
        };

        var getBannerData = function (param) {
            //categoryId, offset, limit, resolution, assetGroup, lifetime, assetProduct, sort, orderLock, selector
            var reqData = {
                targetId: param.targetId,
                offset: param.offset,
                limit: param.limit,
            };
            uipDataManager.getListBannerList(cbGetBannerData, reqData);
        };

        var cbGetBannerData = function (isSuccess, result) {
            if (isSuccess) {
                bannerData = result.data;
            } else {
            }
            //getCategoryData(_this.category.categoryId);

            if(_this.readytoCreate) {
                continueGetData();
            } else {
                _this.readytoCreate = true;
            }
        };

        var getCategoryData = function(cateId) {
        	var reqData = {categoryId:cateId, selector:"@detail"};
            dataManager.getMenuTree(cbGetCategoryData, reqData);
        };

        var cbGetCategoryData = function(isSuccess, result) {
        	W.log.info(isSuccess);
        	W.log.info(result);
            if(isSuccess) {
            	categoryData = result.data;
            	//categoryData[0].isAdult = true;

                if(_this.readytoCreate) {
                    continueGetData();
                } else {
                    _this.readytoCreate = true;
                }
            } else {

            }
        };

        var continueGetData = function() {
            create(categoryData, bannerData);
            if(mode == 2){
                _this.cateList.setActive();
            }
        }

        var scrollCallback = function(idx) {
            _this.cateList.setPage(idx);
        };

        this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function(idx) {
            W.log.info("CategoryList show");
            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("CategoryList hide");
        };
        this.create = function(callback, category, isClear, idx) {
        	isClearPin = isClear;
            W.log.info("create !!!!");
            W.log.info("isClearPin ===== " + isClearPin);
            backCallbackFunc = callback;
            _this = this;
            _this.category = category
            W.log.info("categoryId ===== " + category.categoryId);
            W.log.info(category);
            _this.startIdx = idx;

            _this.readytoCreate = false;

            if(category.categoryCode == "CC0103"){
            	_this.readytoCreate = true;
            	dataManager.pinsList(function(isSuccess, result){
            		if(isSuccess) {
                    	categoryData = result.data;
                    	for(var i=0; i < categoryData.length; i++){
                    		categoryData[i].categoryCode = "CC0103";
                    		categoryData[i].title = W.Texts["zzim_list"] + " " + (categoryData[i].id + 1);
                    		categoryData[i].listId = categoryData[i].id;
                    		categoryData[i].baseId = "29";
                    		categoryData[i].isLeaf = true;
                    	}
                    	create(categoryData, bannerData);
                        if(mode == 2){
                            _this.cateList.setActive();
                        }
                    } else {

                    }
            	}, {}, null, null, true);
            }else{
            	if(W.StbConfig.cugType == "accommodation" || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others"){
                    _this.readytoCreate = true;
            		getCategoryData(_this.category.categoryId);
            	}else{
            		getBannerData({targetId: _this.category.baseId, offset: 0, limit: 2});
                    getCategoryData(_this.category.categoryId);
            	}
            }

            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

//            if(category.categoryCode == "CC0103"){
//            	categoryData = [
//					{title:W.Texts["zzim_list"] + " 1", listId:0, baseId :"29", categoryCode:"CC0103", isLeaf : true},
//					{title:W.Texts["zzim_list"] + " 2", listId:1, baseId :"29", categoryCode:"CC0103", isLeaf : true},
//					{title:W.Texts["zzim_list"] + " 3", listId:2, baseId :"29", categoryCode:"CC0103", isLeaf : true},
//					{title:W.Texts["zzim_list"] + " 4", listId:3, baseId :"29", categoryCode:"CC0103", isLeaf : true},
//					{title:W.Texts["zzim_list"] + " 5", listId:4, baseId :"29", categoryCode:"CC0103", isLeaf : true}
//				];
//            	create(categoryData, bannerData);
//                if(mode == 2){
//                    _this.cateList.setActive();
//                }
//            }
            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.cateList) _this.cateList.setActive();
                if(_this.scroll) _this.scroll.setActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:549});
                    //_comp._posterList._poster.setStyle({y:0});
                }
            } else {
            	if(_this.mode == MODE_TYPE.SCROLL){
                    _this.mode = MODE_TYPE.LIST;
                    if (_this.scroll) _this.scroll.unFocus();
                }
            	
                if(_this.cateList) _this.cateList.deActive();
                if(_this.scroll) _this.scroll.deActive();
                

                

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
            }
        };
        this.hasList = function(){
        };
        this.getCurrIndex = function(){
        	return _this.cateList.getDataIdx();
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.cateList.operate(event);
                        _this.cateList.getPageIdx();
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.cateList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(_this.cateList.operate(event)) {
                            return true;
                        } else {
                            if (_this.scroll) {
                                _this.cateList.deActive();
                                _this.mode = MODE_TYPE.SCROLL;
                                if (_this.scroll) _this.scroll.setFocus();
                            } else {
                                _this.cateList.setActive();
                            }
                            return true;
                        }
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.cateList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.cateList.getPageIdx());
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.cateList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.cateList.getPageIdx());
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(_this.mode == MODE_TYPE.LIST) {
                		var category = _this.cateList.getData();
                		W.log.info(category);
                    	if(category.type == "banner"){
                            W.LinkManager.action("L", category.link, undefined, "listpromotion", undefined, isClearPin);
                        	isAddedEntryPath = true;
                    	}else{
                    		if(util.isBlockedHotelMenu(category)){
        			    		W.PopupManager.openPopup({
        			                title:W.Texts["popup_zzim_info_title"],
        			                popupName:"popup/AlertPopup",
        			                boldText:W.Texts["alert_block_title"],
        			                thinText:W.Texts["alert_block_message2"] 
        			            });
        					}else{
                        		if(category.isLeaf){
                        			if(category.isLink){
                                    	isAddedEntryPath = true;
                        				W.LinkManager.action("L", category.link, undefined, "listpromotion");
                                    	return;
                        			}else{
                        				var sceneName = "scene/vod/MovieScene";
                        				var param = {category:category, isClearPin:isClearPin};
                        				
                        				W.log.info("category.categoryCode =============================== " + category.categoryCode);
                        				
                        				switch(category.categoryCode){
                                    	case "CC0101":
                                    		sceneName = "scene/my/NoticeScene";
                                    		break;
                                    	case "CC0102":
                                    		sceneName = "scene/my/WatchedListScene";
                                    		break;
                                    	case "CC0103":
                                    		sceneName = "scene/my/PlayListScene";
                                    		break;
                                    	case "CC0104":
                                    		sceneName = "scene/my/BookmarkScene";
                                    		break;
                                    	case "CC0105":
                                    		sceneName = "scene/my/LifeTimeVodScene";
                                    		break;
                                    	case "CC0107":
                                    	case "CC0108":
                                    	case "CC0109":
                                    	case "CC0110":
                                    	case "CC0111":
                                    		sceneName = "scene/my/PurchaseHistoryScene";
                                    		break;
                                    	case "CC0112":
                                    		sceneName = "scene/my/CouponScene";
                                    		break;
                                    	case "CC0113":
                                    		sceneName = "scene/my/CoinScene";
                                    		break;
                                    	case "CC0114":
                                    		sceneName = "scene/my/ChargeCoinScene";
                                    		break;
                                        case "CC0201":
                                        case "CC0202":
                                        case "CC0203":
                                            sceneName = "scene/home/GuideScene";
                                            break;
                                        case "CC0204":
                                            sceneName = "scene/home/ProductListScene";
                                            break;
                                        case "CC0205":
                                            sceneName = "scene/home/ReservedProgramListScene";
                                            break;
                                        case "FY0001":
                                            sceneName = "scene/channel/ScheduleForyouScene";
                                            break;
                                        case "FY0002":
                                        case "FY0003":
                                        case "FY0004":
                                            sceneName = "scene/home/MenuForYouScene";
                                            break;
                                    	default :
                                    		W.log.info("############################################## 2");
                                    		W.entryPath.push("menu.categoryId", category, "CategoryList");
                                        	isAddedEntryPath = true;
                                        	break;
                                    	}
                        			}

                                    if(!isClearPin && (category.isAdultOnly || (W.StbConfig.adultMenuUse && category.isAdult))) {
                                        var popup = {
                                            type:"",
                                            popupName:"popup/AdultCheckPopup",
                                            childComp:_this,
                                            param : {sceneName : sceneName, sceneParam : param}
                                        };
                                        W.PopupManager.openPopup(popup);
                                    } else {
                                        W.SceneManager.startScene({
                                            sceneName:sceneName,
                                            param:param,
                                            backState:W.SceneManager.BACK_STATE_KEEPHIDE
                                        });
                                    }

                        		}else{
                        			W.log.info("############################################## 3");
                        			if(!isClearPin && (category.isAdultOnly || (W.StbConfig.adultMenuUse && category.isAdult))) {
                                        var popup = {
                                            type:"",
                                            popupName:"popup/AdultCheckPopup",
                                            childComp:_this,
                                            param : {sceneName : sceneName, sceneParam : param}
                                        };
                                        W.PopupManager.openPopup(popup);
                                    }else{
                            			W.entryPath.push("menu.categoryId", category, "CategoryList");
                                    	isAddedEntryPath = true;
                            			W.SceneManager.startScene({sceneName:"scene/home/CategoryListScene", 
                    	    				param:{category:category, isClearPin:isClearPin},
                    	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                                    }
                        		}
        					}
                    	}
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.cateList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.BACK:
                    _this.cateList.setPage(0, true);
                    if (_this.scroll) _this.scroll.setPage(_this.cateList.getPageIdx());
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
                	var currCategory = _this.cateList.getData();
                	if(currCategory.type != "banner" && W.StbConfig.cugType != "accommodation"){
                		var categoryPath = W.entryPath.getCategoryPath(currCategory.title);
    					var btnName = currCategory.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
    					var popupData = {options:[
    	  						{name:categoryPath, subOptions : [
    	  							{type:"box", name:btnName}
    	  						]}
    	  					]};
    	  				var popup = {
    	  					popupName:"popup/sideOption/VodSideOptionPopup",
    	  					optionData:popupData,
    	  					param:currCategory,
    	  					childComp : _this
    	  				};
    	  				W.PopupManager.openPopup(popup);
                	}
    				break;
            }

        };
        this.destroy = function() {
            W.log.info("destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            	W.log.info("----------------------------------------------------------------------------------------");
            }
        };
        this.resume = function(){
        	W.log.info("resume !!!!" + isAddedEntryPath);
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            	W.log.info("----------------------------------------------------------------------------------------");
            }
        };
        this.getMode = function(){
            return mode;
        };
        this.onPopupClosed = function(popup, desc) {
			if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	isClearPin = true;
                    	var category = _this.cateList.getData();
                    	
                    	if(category.isLeaf){
                    		desc.param.sceneParam.isClearPin = isClearPin;
                            W.SceneManager.startScene({
                                sceneName:desc.param.sceneName,
                                param:desc.param.sceneParam,
                                backState:W.SceneManager.BACK_STATE_KEEPHIDE
                            });
                    	}else{
                    		W.entryPath.push("menu.categoryId", category, "CategoryList");
                        	isAddedEntryPath = true;
                			W.SceneManager.startScene({sceneName:"scene/home/CategoryListScene", 
        	    				param:{category:category, isClearPin:isClearPin},
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}
                    }
                } else if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
					if (desc.action == W.PopupManager.ACTION_OK) {
						W.log.info(desc);
						if(desc.param.option == 0){
							if(desc.param.subOptions == 0){
								var reqData = {targetId : desc.param2.categoryId};
								var favoriteFunction;
								if(desc.param2.isPinned){
									favoriteFunction = dataManager.removeViewingFavorite;
								}else{
									favoriteFunction = dataManager.addViewingFavorite;
								}
								favoriteFunction(function(result, data, param){
									W.log.info(data);
									if(result){
										W.PopupManager.openPopup({
				                            childComp:_this,
				                            type:"2LINE",
				                            popupName:"popup/FeedbackPopup",
				                            title:param.title,
				                            desc:param.isPinned ? W.Texts["bookmark_msg_removed"] : W.Texts["bookmark_msg_added"]}
				                        );
										param.isPinned = !param.isPinned;
									}else{
										if(data && data.error && data.error.code == "C0501" && !param.isPinned){
											W.PopupManager.openPopup({
				                				childComp:_this,
				                                title:W.Texts["popup_zzim_info_title"],
				                                popupName:"popup/AlertPopup",
				                                boldText:W.Texts["bookmark_guide3"],
				                                thinText:W.Texts["bookmark_guide4"]}
				        	                );
										}else{
											W.PopupManager.openPopup({
					                            childComp:_this,
					                            popupName:"popup/ErrorPopup",
					                            code:data.error ? data.error.code : "9999",
					                            message:data.error ? [data.error.detail] : null,
					        					from : "SDP"}
					                        );
										}
									}
								}, reqData, desc.param2);
							}
						}
					}
				}
			}
		};
        this.componentName = "CategoryList";
    };

    return {
    	getNewComp: function(){
    		return new CategoryList();
    	}
    }
    
});