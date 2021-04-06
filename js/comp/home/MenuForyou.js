W.defineModule("comp/home/MenuForyou", ["mod/Util", "comp/Scroll", "comp/list/Poster"], function(util, Scroll, Poster) {
	function MenuForyou(){
		var _this;
	    var recoDataManager = W.getModule("manager/RecommendDataManager");
        var dataManager = W.getModule("manager/SdpDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var tops = [436, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];

	    var yIndex = 0;
	    var xIndex = 0;
	    var _comp;
	    var topPositions = [];
	    var categories;
	    var categoryCount=0;
	    var totalLine;
	    var totalPage = 0;
	    var pageYIndex = [];

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	    };

	    var create = function(){
	    	W.log.info(categories);
	        
	        var _area = new W.Div({x:0, y:114, width:"1280px", height:"606px", overflow:"hidden"});
	        _comp.add(_area);
	        
	        _comp._list = new W.Div({x:0, y:30, width:"1280px", height:(categoryCount * 343) + "px"});
	        _area.add(_comp._list);
	        
	        _comp._categories = [];
	        
	        var topPos = 0;
	        topPositions = [];
	        pageYIndex = [];
	        for(var i=0; i < categoryCount; i++){
	        	if(i > 0){
	        		if(categories[i].isSpecial){
	        			topPos += 284;
		        	}else{
		        		topPos += 343;
		        	}
	        	}
	        	if(i == 1){
	        		topPos += 60;
	        	}
	        	if(categories[i].isSpecial){
	        		if(categories[i].specialIdx > 1 && categories[i].specialIdx % 2 == 0){
	        			topPositions.push(topPos + 55 - 284);
	        		}else{
		        		topPositions.push(topPos + 55);
		        		totalPage++;
		        		pageYIndex.push(i);
	        		}
	        	}else{
	        		topPositions.push(topPos);
	        		totalPage++;
	        		pageYIndex.push(i);
	        	}
	        	
	        	_comp._categories[i] = new W.Div({x:0, y:topPos, width:"1280px", height:"343px", opacity:0.7});
	        	_comp._list.add(_comp._categories[i]);
	        	
	        	if(!categories[i].isSpecial){
	        		_comp._categories[i]._title_area = new W.Div({x:118, y:0, width:"2000px", height:"22px", textAlign:"left"});
		        	_comp._categories[i].add(_comp._categories[i]._title_area);
		        	_comp._categories[i]._title = new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(196,196,196)", 
		    			"font-size":"20px", className:"font_rixhead_medium", text:categories[i].title, display:"inline-block"});
		        	_comp._categories[i]._title_area.add(_comp._categories[i]._title);
		        	_comp._categories[i]._title_area.add(new W.Div({position:"relative", y:-5, width:"1280px", height:"1px", 
		        		className:"line_1px", display:"inline-block", "margin-left":"25px"}));
	        	}
	        	
	        	_comp._categories[i].posters = [];
	        	_comp._categories[i]._postersComp = [];
	        	for(var j=0; j < categories[i].resultList.length; j++){
	        		_comp._categories[i].posters[j] = new Poster({
	    				type:Poster.TYPE.W136, 
	    				data:categories[i].resultList[j], 
	    				isRecommend:true,
	    				textAlign: j > 4 ? "right" : "left"
	    			});
	        		_comp._categories[i]._postersComp[j] = _comp._categories[i].posters[j].getComp();
	        		_comp._categories[i]._postersComp[j].setStyle({x:119 + 151*j, y:55});
	        		_comp._categories[i].add(_comp._categories[i]._postersComp[j]);
	        	}
	        }
	        
	        W.log.info("categoryCount ====== " + categoryCount);
	        W.log.info("totalPage ====== " + totalPage);

			if(totalPage > 1) {
				_this.scroll = new Scroll();
				_comp._scroll = _this.scroll.getComp(totalPage, 0, scrollCallback);
				_comp._scroll.setStyle({x:49+5, y:270, display:mode==2 ? "block" : "none"});
				_comp.add(_comp._scroll);
			} else {
				_this.scroll = undefined;
			}

	        if(W.SceneManager.getCurrentScene().id.indexOf("MenuForYouScene") > -1){
	            focus(true);
	        }
	        
	        W.visibleHomeScene();
	    };

	    var getRecomentData = function() {
    		categories = [];
    		W.log.info(_this.categoryCode);
	    	if(_this.categoryCode == "FY0002"){
	    		categoryCount = 6;
	    		recoDataManager.getCateMoviesOverlap(cbGetData, 0);
	    		recoDataManager.getCateMovies1st(cbGetData, 1);
	    		recoDataManager.getCateMoviesActor(cbGetData, 2);
	    		recoDataManager.getCateMovies1stGenre(cbGetData, 3);
	    		recoDataManager.getCateMovies2nd(cbGetData, 4);
	    		recoDataManager.getCateMovies3rd(cbGetData, 5);
	    	}else{
	    		recoDataManager.getCategoryNotMovie(function(result, data){
	    			if(data.recentVodLabel && data.recentVodList.length > 0){
	    				categories.push({title: data.recentVodLabel, resultList:data.recentVodList});
	    			}

	    			if(data.vodLabel && data.vodList.length > 0){
	    				var page = Math.ceil(data.vodList.length / 7);
	    				for(var i=0; i < page; i++){
	    					categories.push({title: data.vodLabel, resultList:data.vodList.slice(i*7, (i+1)*7), 
	    						isSpecial:i > 0 ? true : false, specialIdx:i});
	    				}
	    			}
	    			categoryCount = categories.length;
	    			create();
	    		}, _this.baseId);
	    	}
	        
	    };

	    var receiveCount = 0;
	    var cbGetData = function(result, data, idx) {
	    	receiveCount++;
	        if(result && data.resultList.length > 0) {
	        	categories[idx] = data;
	        }
	        
	        if(receiveCount == 6){
	        	for(var i=0; i < categories.length; i++){
	        		if(!categories[i]){
	        			categories.splice(i, 1);
		    			i--;
		    		}
	        	}
	        	categoryCount = categories.length;
	        	create();
	        	W.Loading.stop();
	        }
	    };

	    var scrollCallback = function(idx) {
	    	yIndex = pageYIndex[idx];
	    	focus();
	    };
	    
	    var checkYIndex = function(idx){
	    	for(var i=0; i < pageYIndex.length; i++){
	    		if(pageYIndex[i] == idx){
	    			return true;
	    		}
	    	}
	    	return false;
	    };
	    
	    var focus = function(isChangedCategory){
	    	if(_this.mode == MODE_TYPE.LIST) {
	    		_comp._categories[yIndex].posters[xIndex].setFocus();
	    		if(isChangedCategory){
	    			_comp._categories[yIndex].setStyle({opacity:1});
	    			if(categories[yIndex+1] && categories[yIndex+1].isSpecial && categories[yIndex+1].specialIdx > 1 && categories[yIndex+1].specialIdx % 2 == 0){
	    				_comp._categories[yIndex+1].setStyle({opacity:1});
	        		}
	    			if(categories[yIndex-1] && categories[yIndex-1].isSpecial && categories[yIndex-1].specialIdx > 0 && categories[yIndex-1].specialIdx % 2 == 1){
	    				_comp._categories[yIndex-1].setStyle({opacity:1});
	        		}
	    			
	    			if (_this.scroll && checkYIndex(yIndex)){
	    				_this.scroll.setPage(yIndex);
	    			}
	    		}
	    	}
	    	_comp._list.setStyle({y:-topPositions[yIndex] + 30});
	    };
	    
	    var unFocus = function(isChangedCategory){
	    	_comp._categories[yIndex].posters[xIndex].unFocus();
	    	if(isChangedCategory){
	    		_comp._categories[yIndex].setStyle({opacity:0.7});
	    		if(categories[yIndex+1] && categories[yIndex+1].isSpecial && categories[yIndex+1].specialIdx > 1 && categories[yIndex+1].specialIdx % 2 == 0){
    				_comp._categories[yIndex+1].setStyle({opacity:0.7});
        		}
    			if(categories[yIndex-1] && categories[yIndex-1].isSpecial && categories[yIndex-1].specialIdx > 0 && categories[yIndex-1].specialIdx % 2 == 1){
    				_comp._categories[yIndex-1].setStyle({opacity:0.7});
        		}
    		}
	    };

	    this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            W.log.info("Menu Foryou List show");
            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("Menu Foryou List hide");
        };
        this.create = function(_parentDiv, _parent, param) {
            W.log.info("create !!!!");
            W.log.info(param);
            _this = this;
            _this.categoryCode = param.categoryCode;
            _this.baseId = param.baseId;
            _this.mode = MODE_TYPE.LIST;
			_this.isClearPin = param.isClearPin;
            totalPage = 0;
            
            W.Loading.start();
            getRecomentData(param);

            _comp = new W.Div({x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.scroll) _this.scroll.setActive();
                if(W.SceneManager.getCurrentScene().id.indexOf("MenuForYouScene") == -1){
                    focus(true);
                }
            } else {
                if(_this.scroll) _this.scroll.deActive();
            }
        };
        this.hasList = function(){
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                    	unFocus();
                    	xIndex = (++xIndex) % categories[yIndex].resultList.length;
                    	focus();
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.mode = MODE_TYPE.LIST;
                    	focus(true);
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(xIndex == 0) {
							if (_this.scroll) {
								unFocus(true);
								_this.mode = MODE_TYPE.SCROLL;
								if (_this.scroll) _this.scroll.setFocus();
							} else {
								//focus();
							}
                        } else {
                        	unFocus();
                        	xIndex--;
                            focus();
                        }
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                		unFocus(true);
                    	if(yIndex > 0){
                    		yIndex--;
                    		focus(true);
                    		return true;
                    	}else{
                    		yIndex = categoryCount - 1;
                			if(!categories[yIndex].resultList[xIndex]){
                				xIndex = categories[yIndex].resultList.length - 1;
                			}
                			focus(true);
                			return true;
                    	}
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                    	unFocus(true);
                    	if(categoryCount - 1 == yIndex){
                    		yIndex = 0;
                    	}else{
                    		yIndex++;
                    		if(!categories[yIndex].resultList[xIndex]){
                				xIndex = categories[yIndex].resultList.length - 1;
                			}
                    	}
                		focus(true);
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	var param = {};
					if(!_this.isClearPin && categories[yIndex].resultList[xIndex].rating && util.getRating() && categories[yIndex].resultList[xIndex].rating >= util.getRating()) {
						var popup = {
							type:"",
							popupName:"popup/AdultCheckPopup",
							childComp:_this
						};
						W.PopupManager.openPopup(popup);
					}else{
						if(categories[yIndex].resultList[xIndex].seriesId){
							param.seriesId = categories[yIndex].resultList[xIndex].seriesId;
						}else{
							param.sassetId = categories[yIndex].resultList[xIndex].superAssetId;
						}
						W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
							param:param,
							backState:W.SceneManager.BACK_STATE_KEEPHIDE});
					}
                    break;
                case W.KEY.BACK:
                	if(_this.mode == MODE_TYPE.SCROLL){
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                    }else{
                    	unFocus(true);
                    }
                	_this.mode = MODE_TYPE.SCROLL;
                	yIndex = 0;
                	xIndex = 0;
                	if (_this.scroll) _this.scroll.setPage(yIndex);
                	focus();
                	_this.mode = MODE_TYPE.LIST;
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
                	var contents = categories[yIndex].resultList[xIndex];
                	var popupData={options:[]};
                	
                	if(W.StbConfig.cugType != "accommodation"){
                		popupData.options.push({
							name: contents.title,
							param:"ZZIM",
							subOptions: [//
							   {type: "box", name: contents.seriesId ? W.Texts["option_popup_add_zzim_series2"] : W.Texts["option_popup_add_zzim"]},
							   {type: "box", name: W.Texts["popup_zzim_move_title"]}
							]
						});
                	}
					
					popupData.options.push({
						name: undefined, 
						param:"SEARCH",
						subOptions: [
						   {type:"box", name:W.Texts["search"]}
						]
					});

                    var popup = {
                        popupName: "popup/sideOption/VodSideOptionPopup",
                        optionData: popupData,
                        childComp: _this
                    };
                    W.PopupManager.openPopup(popup);
                    break;
            }

        };
        this.destroy = function() {
            W.log.info("destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "MenuForyou";
        this.onPopupClosed = function (popup, desc) {
			if (desc.popupName == "popup/AdultCheckPopup") {
				if (desc.action == W.PopupManager.ACTION_OK) {
					_this.isClearPin = true;
					if(_comp && _comp._categories) {
						for(var i=0; i < _comp._categories.length; i++){
							if(_comp._categories[i].posters) {
								for(var j = 0; j < _comp._categories[i].posters.length; j++) {
									if(_comp._categories[i].posters[j].releaseRestrict) _comp._categories[i].posters[j].releaseRestrict();
								}
							}
						}
					}
					var param = {};
					if(categories[yIndex].resultList[xIndex].seriesId){
						param.seriesId = categories[yIndex].resultList[xIndex].seriesId;
					}else{
						param.sassetId = categories[yIndex].resultList[xIndex].superAssetId;
					}
					W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
						param:param,
						backState:W.SceneManager.BACK_STATE_KEEPHIDE});
				}
			} else if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                	W.log.info(desc);
                	var contents = categories[yIndex].resultList[xIndex];
                	if(desc.param.param == "ZZIM"){
                		if(desc.param.subOptions == 0){
                			if(contents.seriesId){
                				var reqData = {seriesId:contents.seriesId, selector:"@detail"};
                    			dataManager.getSeriesDetail(function(result, sdpData){
                    				if(result && sdpData.data.length > 0){
                        				var popup = {
                            				popupName:"popup/my/ZzimAddPopup",
                            				param:{data:sdpData.data[0], type:"series"},
                            				childComp:_this
                            			};
                        	    		W.PopupManager.openPopup(popup);
                    				}
            					}, reqData);
                			}else{
                				var reqData = {sassetId:contents.superAssetId, selector:"@detail"};
                    			dataManager.getSAssetsDetail(function(result, sdpData){
                    				if(result && sdpData.data.length > 0){
                        				var popup = {
                            				popupName:"popup/my/ZzimAddPopup",
                            				param:{data:sdpData.data[0], type:"sasset"},
                            				childComp:_this
                            			};
                        	    		W.PopupManager.openPopup(popup);
                    				}
            					}, reqData);
                			}
                		}else{
                			var reqData = {menuType:"MC0001"};
                            dataManager.getChildMenuTree(function(result, menuData){
                            	if(result && menuData.total > 0){
                            		for(var i=0; i < menuData.data.length; i++){
                            			if(menuData.data[i].categoryCode == "CC0103"){
                            				W.SceneManager.startScene({
                            					sceneName:"scene/home/CategoryListScene", 
                            					param:{category:menuData.data[i]},
                        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            				break;
                            			}
                            		}
                            	}
                            }, reqData);
                		}
                	}else if(desc.param.param == "SEARCH"){
                		W.SceneManager.startScene({sceneName:"scene/search/SearchScene", 
    	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                	}
                }
            }else if (desc.popupName == "popup/my/ZzimAddPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                	W.PopupManager.openPopup({
                        childComp:_this,
                        type:"2LINE",
                        popupName:"popup/FeedbackPopup",
                        title:desc.title,
                        desc:W.Texts["zzim_msg_add"].replace("@title@", desc.listTitle)}
                    );
                }else{
                	if(desc.error){
                		if(desc.error.code == "C0501"){
                			W.PopupManager.openPopup({
                				childComp:_this,
                                title:W.Texts["popup_zzim_info_title"],
                                popupName:"popup/AlertPopup",
                                boldText:W.Texts["popup_zzim_move_guide4"],
                                thinText:W.Texts["popup_zzim_move_guide5"]}
        	                );
                		}else{
                			W.PopupManager.openPopup({
                                childComp:_this,
                                popupName:"popup/ErrorPopup",
                                code:desc.error.code,
            					from : "SDP"}
                            );
                		}
                	}
                }
            }
        };
	};
    
	return {
		getNewComp: function(){
			return new MenuForyou();
		}
	}
});