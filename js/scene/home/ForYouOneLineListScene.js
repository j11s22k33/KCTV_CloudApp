/**
 * scene/ForYouOneLineListScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/CouponInfo", "comp/list/Poster"],
    function(util, couponInfoComp, Poster) {
        var _thisScene = "ForYouOneLineListScene";
        var _this;
        var couponInfo = couponInfoComp.getNewComp();
        var _comp;
        var isCategory = true;
        var index = 0;
        var pIndex = 0;
        var keyDelayTimeout;
        var dataManager = W.getModule("manager/SdpDataManager");

        W.log.info("### Initializing " + _thisScene + " scene ###");

        function changeList(){
        	pIndex = 0;
        	if(_comp._list){
        		_comp._list_area.remove(_comp._list);
        	}
        	
        	_comp._list = new W.Div({x:0, y:38, width:"1280px", height:"330px"});
	    	_comp._list_area.add(_comp._list);
	    	
	    	_comp.posters = [];
    		_comp._postersComp = [];
    		
    		for(var i=0; i < _this.data.resultList[index].vodList.length; i++){
    			W.log.info(_this.data.resultList[index].vodList[i]);
    			_comp.posters[i] = new Poster({
    				type:Poster.TYPE.W136, 
    				data:_this.data.resultList[index].vodList[i], 
    				isRecommend:true,
    				textAlign: i%7 > 4 ? "right" : "left"
    			});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:67 + 154*i});
                _comp._list.add(_comp._postersComp[i]);
    		}
        };
        
        function create(){
        	_comp.add(new W.Span({x:55, y:51, height:"34px", width:"700px", textColor:"rgb(255,255,255)", 
				"font-size":"27px", className:"font_rixhead_medium cut", text:_this.data.title}));
        	_comp.add(new W.Span({x:57, y:89, height:"18px", width:"700px", textColor:"rgba(196,196,196,0.75)", 
				"font-size":"16px", className:"font_rixhead_light cut", text:_this.data.subtitle}));
        	_comp._bar = new W.Div({x:50, y:318, width:"1280px", height:"1px", className:"line_1px"});
	    	_comp.add(_comp._bar);
	    	
	    	var _area = new W.Div({x:0, y:277, width:"1280px", height:"50px", overflow:"hidden"});
	    	_comp.add(_area);
	    	_comp._title_list = new W.Div({x:0, y:0, width:"1280px", height:"50px"});
	    	_area.add(_comp._title_list);
	    	
	    	_comp._titles_dim = [];
	    	_comp._titles_foc = [];
	    	var title;
	    	var width = 0;
	    	for(var i=0; i < _this.data.resultList.length; i++){
	    		title = _this.data.resultList[i].title;
	    		if(title.length > 9){
					title = title.substr(0,8) + "..";
				}
	    		_comp._titles_dim[i] = new W.Span({x:66 + 210*i, y:2, width:"180px", height:"22px", textColor:"rgba(205,205,205,0.84)", 
	    			textAlign:"center", "font-size":"20px", className:"font_rixhead_light", text:title});
	    		_comp._title_list.add(_comp._titles_dim[i]);
	    		
	    		_comp._titles_foc[i] = new W.Div({x:66 + 210*i, y:0, width:"180px", height:"27px", textAlign:"center", opacity:0});
	    		_comp._title_list.add(_comp._titles_foc[i]);
	    		
	    		_comp._titles_foc[i]._text = new W.Span({position:"relative", y:0, height:"27px", textColor:"rgb(255,255,255)", 
	    			"font-size":"25px", className:"font_rixhead_medium", text:title});
	    		_comp._titles_foc[i].add(_comp._titles_foc[i]._text);
	    		width = _comp._titles_foc[i]._text.comp.offsetWidth + 20;
	    		_comp._titles_foc[i]._bar = new W.Div({x:90 - width/2, y:38, width:width + "px", 
	    			height:"6px", backgroundColor:"rgb(229,48,0)", "border-radius":"3px", display:"inline-block"});
	    		_comp._titles_foc[i].add(_comp._titles_foc[i]._bar);
	    	}
	    	
	    	_comp._list_area = new W.Div({x:0, y:336, width:"1280px", height:"330px", overflow:"hidden"});
	    	_comp.add(_comp._list_area);
        };
        
        function focus(isChange, isFirst) {
	    	if(isCategory){
	    		_comp._titles_dim[index].setStyle({display:"none"});
	    		_comp._titles_foc[index].setStyle({opacity:1});
	    		_comp._title_list.setStyle({x:-Math.floor(index/5) * 1050});
	    		if(index > 4){
	    			_comp._bar.setStyle({x:0});
	    		}else{
	    			_comp._bar.setStyle({x:50});
	    		}

	    		if(isChange){
	    			var delayTime = isFirst ? 0 : W.Config.KEY_TIMEOUT_TIME;
	        		clearTimeout(keyDelayTimeout);
	        		keyDelayTimeout = setTimeout(function(){
	        			changeList();
	        		}, delayTime);
	    		}
	    	}else{
	    		_comp.posters[pIndex].setFocus();
	    		_comp._list.setStyle({x:- Math.floor(pIndex/7) * 1078});
	    	}
	    };
	    
	    var unFocus = function() {
	    	if(isCategory){
	    		if(_comp._titles_dim) _comp._titles_dim[index].setStyle({display:"block"});
	    		if(_comp._titles_foc) _comp._titles_foc[index].setStyle({opacity:0});
	    	}else{
	    		_comp.posters[pIndex].unFocus();
	    	}
	    };

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK, W.KEY.COLOR_KEY_Y,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);

                _this.data = param.forYouData;
                isCategory = true;
                index = 0;
                
                W.log.info(_this.data);
                
                _comp = new W.Div({className : "bg_size"});
                _comp._bg = new W.Div({x:0, y:0, width:1280, height:720, className : "bg_color"});
                _comp.add(_comp._bg);
                _comp._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
                _comp.add(_comp._comp_area);

                _comp.add(couponInfo.getComp(592, 38));
        		couponInfo.setData();
        		_this.add(_comp);
        		
        		create();
        		focus(true, true);
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

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                    	if(isCategory){
                    		unFocus();
                        	index = (++index) % _this.data.resultList.length;
                        	focus(true);
                        }else{
                        	unFocus();
                        	pIndex = (++pIndex) % _this.data.resultList[index].vodList.length;
                        	focus();
                        }
                        break;
                    case W.KEY.LEFT:
                    	if(isCategory){
                    		unFocus();
                    		index = (--index + _this.data.resultList.length) % _this.data.resultList.length;
                    		focus(true);
                        }else{
                        	unFocus();
                        	pIndex = (--pIndex + _this.data.resultList[index].vodList.length) % _this.data.resultList[index].vodList.length;
                        	focus();
                        }
                        break;
                    case W.KEY.UP:
                    	if(isCategory){
                            
                        }else{
                        	unFocus();
                        	isCategory = true;
                        	focus();
                        }
                        break;
                    case W.KEY.DOWN:
                    	if(isCategory){
                    		unFocus();
                        	isCategory = false;
                        	focus();
                        }
                        break;
                    case W.KEY.ENTER:
                    	if(isCategory){
                        	unFocus();
                        	isCategory = false;
                        	focus();
                        }else{
                        	var target = _this.data.resultList[index].vodList[pIndex];
	                        if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && target.isAdult)
								|| (target.rating && util.getRating() && target.rating >= util.getRating()))) {
	                            var popup = {
	                                type:"",
	                                popupName:"popup/AdultCheckPopup",
	                                childComp:_this
	                            };
	                            W.PopupManager.openPopup(popup);
	                        } else {
	                        	var asset = {sassetId:_this.data.resultList[index].vodList[pIndex].superAssetId, seriesId:_this.data.resultList[index].vodList[pIndex].seriesId};
	                        	W.SceneManager.startScene({
	                                sceneName: "scene/vod/VodDetailScene",
	                                param: {data: asset, type: _this.data.resultList[index].vodList[pIndex].seriesId ? "S" : "V"},
	                                backState: W.SceneManager.BACK_STATE_KEEPHIDE
	                            });
	                        }
                        }
                        break;
                    case W.KEY.BACK:
                        _this.backScene();
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
                    	var contents = _this.data.resultList[index].vodList[pIndex];
    					var btnName = _this.data.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                        var categoryPath = W.entryPath.getCategoryPath(_this.data.title);
                    	var popupData={options:[]};
                    	
                    	if(W.StbConfig.cugType != "accommodation"){
                    		if(!isCategory){
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
								name: categoryPath,
								param:"BOOKMARK",
								subOptions: [
							   	{type:"box", name:btnName}
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

            },
            onPopupClosed : function (popup, desc) {
                if (desc) {
                    if (desc.popupName == "popup/AdultCheckPopup") {
                        if (desc.action == W.PopupManager.ACTION_OK) {
                            _this.isClearPin = true;
                            if(desc.type == "ZZIM"){
                            	W.SceneManager.startScene({
                					sceneName:"scene/home/CategoryListScene", 
                					param:{category:desc.param},
            	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            }else{
                                var asset = {sassetId:_this.data.resultList[index].vodList[pIndex].superAssetId, seriesId:_this.data.resultList[index].vodList[pIndex].seriesId};
                            	W.SceneManager.startScene({
                                    sceneName: "scene/vod/VodDetailScene",
                                    param: {data: asset, type: _this.data.resultList[index].vodList[pIndex].seriesId ? "S" : "V"},
                                    backState: W.SceneManager.BACK_STATE_KEEPHIDE
                                });
                            }
                        }
                    } else if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
                        if (desc.action == W.PopupManager.ACTION_OK) {
                        	W.log.info(desc);
                        	var contents = _this.data.resultList[index].vodList[pIndex];
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
                                    				if(menuData.data[i].isAdultOnly && !_this.isClearPin){
                                    					var popup = {
                        	                                type:"ZZIM",
                        	                                param:menuData.data[i],
                        	                                popupName:"popup/AdultCheckPopup",
                        	                                childComp:_this
                        	                            };
                        	                            W.PopupManager.openPopup(popup);
                                    				}else{
                                        				W.SceneManager.startScene({
                                        					sceneName:"scene/home/CategoryListScene", 
                                        					param:{category:menuData.data[i]},
                                    	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                                    				}
                                    				break;
                                    			}
                                    		}
                                    	}
                                    }, reqData);
                        		}
                        	}else if(desc.param.param == "BOOKMARK"){
                        		if(desc.param.subOptions == 0){
                            		var reqData = {targetId : _this.data.categoryId};
                            		var favoriteFunction;
    								if(_this.data.isPinned){
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
        			                            title:_this.data.title,
        			                            desc:_this.data.isPinned ? W.Texts["bookmark_msg_removed"] : W.Texts["bookmark_msg_added"]}
        			                        ); 
        									_this.data.isPinned = !_this.data.isPinned;
        								}else{
        									if(data && data.error && data.error.code == "C0501" && !_this.data.isPinned){
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
        				                            code:data.error.code,
        				        					from : "SDP"}
        				                        );
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
                }
            }
        });
    });
