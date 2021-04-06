/**
 * scene/ForYouLargeListScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/CouponInfo", "comp/list/Poster"],
    function(util, couponInfoComp, Poster) {
        var _thisScene = "ForYouLargeListScene";
        var _this;
        var couponInfo = couponInfoComp.getNewComp();
        var _comp;
        var index = 0;
        var dataManager = W.getModule("manager/SdpDataManager");

        W.log.info("### Initializing " + _thisScene + " scene ###");

        function create(){
        	_comp.add(new W.Span({x:55, y:51, height:"34px", width:"700px", textColor:"rgb(255,255,255)", 
				"font-size":"27px", className:"font_rixhead_medium cut", text:_this.data.title}));
        	_comp.add(new W.Span({x:57, y:89, height:"18px", width:"700px", textColor:"rgba(196,196,196,0.75)", 
				"font-size":"16px", className:"font_rixhead_light cut", text:_this.data.subtitle}));
	    	
	    	var _area = new W.Div({x:0, y:146, width:"1280px", height:"525px", overflow:"hidden"});
	    	_comp.add(_area);
	    	
	    	_comp._list = new W.Div({x:0, y:0, width:"1280px", height:"525px"});
	    	_area.add(_comp._list);
	    	
	    	_comp._contents = [];
	    	for(var i=0; i < _this.data.resultList.length; i++){
	    		_comp._contents[i] = new W.Div({x:55 + 356*i, y:0, width:"356px", height:"525px"});
	    		_comp._list.add(_comp._contents[i]);
	    		
	    		_comp._contents[i].add(new W.Image({x:0, y:5, width:"356px", height:"515px", src:_this.data.resultList[i].bigImage}));
	    		_comp._contents[i].add(new W.Image({x:0, y:288, width:"356px", height:"232px", src:"img/vod_foryou_sh.png"}));
	    		_comp._contents[i]._dim = new W.Div({x:0, y:5, width:"356px", height:"515px", backgroundColor:"rgba(0,0,0,0.55)"});
	    		_comp._contents[i].add(_comp._contents[i]._dim);
	    		_comp._contents[i]._title = new W.Span({x:28, y:413, width:"290px", height:"31px", textColor:"rgba(139,129,126,0.9)", 
	    			"font-size":"28px", className:"font_rixhead_bold cut", text:_this.data.resultList[i].title ? _this.data.resultList[i].title : ""});
	    		_comp._contents[i].add(_comp._contents[i]._title);
	    		_comp._contents[i]._subtitle = new W.Span({x:29, y:452, width:"290px", height:"18px", textColor:"rgba(147,147,147,0.75)", 
	    			"font-size":"16px", className:"font_rixhead_light", text:_this.data.resultList[i].subtitle ? _this.data.resultList[i].subtitle : "",
	    			"word-break":"keep-all", "white-space":"pre-line"});
	    		_comp._contents[i].add(_comp._contents[i]._subtitle);
	    		_comp._contents[i]._focT = new W.Div({x:0, y:0, width:"356px", height:"4px", backgroundColor:"rgb(229,48,0)", display:"none"});
	    		_comp._contents[i].add(_comp._contents[i]._focT);
	    		_comp._contents[i]._focB = new W.Div({x:0, y:521, width:"356px", height:"4px", backgroundColor:"rgb(229,48,0)", display:"none"});
	    		_comp._contents[i].add(_comp._contents[i]._focB);
	    	}
        };
        
        function focus() {
        	_comp._contents[index]._dim.setStyle({display:"none"});
        	_comp._contents[index]._focT.setStyle({display:"block"});
        	_comp._contents[index]._focB.setStyle({display:"block"});
        	_comp._contents[index]._title.setStyle({textColor:"rgba(255,255,255,0.9)"});
        	_comp._contents[index]._subtitle.setStyle({textColor:"rgba(255,255,255,0.75)"});
        	
        	_comp._list.setStyle({x:-Math.floor(index/3) * 1068});
	    };
	    
	    var unFocus = function() {
	    	_comp._contents[index]._dim.setStyle({display:"block"});
        	_comp._contents[index]._focT.setStyle({display:"none"});
        	_comp._contents[index]._focB.setStyle({display:"none"});
        	_comp._contents[index]._title.setStyle({textColor:"rgba(139,129,126,0.9)"});
        	_comp._contents[index]._subtitle.setStyle({textColor:"rgba(147,147,147,0.75)"});
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
        		
        		create();
        		
        		_this.add(_comp);
        		
        		focus();
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
                    	unFocus();
                    	index = (++index) % _this.data.resultList.length;
                    	focus();
                        break;
                    case W.KEY.LEFT:
                    	unFocus();
                    	index = (--index + _this.data.resultList.length) % _this.data.resultList.length;
                    	focus();
                        break;
                    case W.KEY.UP:
                    case W.KEY.DOWN:
                        break;
                    case W.KEY.ENTER:
                    	W.log.info(_this.data.resultList[index]);
                    	var param = {type: "V"};
                    	W.LinkManager.action("L", _this.data.resultList[index].link);
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
                    	W.log.info(_this.data);
                    	var contents = _this.data.resultList[index];
    					var btnName = _this.data.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                        var categoryPath = W.entryPath.getCategoryPath(_this.data.title);
                    	var popupData={options:[]};
                    	
                    	if(W.StbConfig.cugType != "accommodation"){
                    		
                    		if(contents.link.linkType == "as01" || contents.link.linkType == "as02" || contents.link.linkType == "sr01"){
                    			var name = W.Texts["option_popup_add_zzim"];
                    			if(contents.link.linkType == "sr01"){
                    				name = W.Texts["option_popup_add_zzim_series2"];
                    			}
                    			popupData.options.push({
    								name: contents.title,
    								param:"ZZIM",
    								subOptions: [//
    								   {type: "box", name: name},
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
                            }
                        }
                    } else if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
                        if (desc.action == W.PopupManager.ACTION_OK) {
                        	W.log.info(desc);
                        	var contents = _this.data.resultList[index];
                        	if(desc.param.param == "ZZIM"){
                        		if(desc.param.subOptions == 0){
                        			var popup = {
                        				popupName:"popup/my/ZzimAddPopup",
                        				param:{data:contents.link, type:"link"},
                        				childComp:_this
                        			};
                    	    		W.PopupManager.openPopup(popup);
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
