/**
 * scene/MainScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "manager/SearchDataManager", "mod/Util", "comp/search/ResultText", "comp/search/ResultChannel", "comp/search/ResultPoster"],
	function(searchDataManager, util, resultText, resultChannel, resultPoster) {
		var oldIndex = 0;
		var index;
		var isMenu = false;
		var _thisScene = "SearchResultScene";
		var _this;
		var _comp;
		var timeInterval;
		var components = [];
		var Menu;
		var listComponent;
		var focTimeout;

		W.log.info("### Initializing " + _thisScene + " scene ###");
		
		var updateTime = function(){
			_comp._timer.setText(util.getCurrentDateTime2("kor"));
		};
		
		var MenuComp = function(){
			var _menu;
			this.create = function(){
				if(_menu){
					_comp.remove(_menu);
				}
				_menu = new W.Div({x:54, y:291, width:"230px", height:"151px"});
				_comp.add(_menu);
				
				_menu._menus = [];
				_menu._menusF = [];

				var totalCount = 0;
				var no = 0;
				if(_this.results.vod && _this.results.vod.total > 0){
					totalCount += _this.results.vod.total;
					if(no == 0){
						components[no].show();
					}
					
					_menu._menus[no] = new W.Span({x:14, y:19, width:"210px", height:"22px", textColor:"rgba(255,255,255,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["single_vod"] + " (" + _this.results.vod.total + ")", display:index === no ? "none":""});
					_menu.add(_menu._menus[no]);
					_menu._menusF[no] = new W.Span({x:14, y:13, width:"210px", height:"26px", textColor:index === no ? "rgb(237,168,2)" : "rgb(255,255,255)", 
						"font-size":"24px", className:"font_rixhead_medium", text:W.Texts["single_vod"] + " (" + _this.results.vod.total + ")", display:index === no ? "":"none"});
					_menu.add(_menu._menusF[no]);
					_menu._menus[no].type = "vod";
					no++;
				}
				
				
				if(_this.results.vseries && _this.results.vseries.total > 0){
					totalCount += _this.results.vseries.total;
					if(no == 0){
						components[no].show();
					}
					
					_menu._menus[no] = new W.Span({x:14, y:19 + no * 48, width:"210px", height:"22px", textColor:"rgba(255,255,255,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["series_vod"] + " (" + _this.results.vseries.total + ")", display:index === no ? "none":""});
					_menu.add(_menu._menus[no]);
					_menu._menusF[no] = new W.Span({x:14, y:13 + no * 48, width:"210px", height:"26px", textColor:index === no ? "rgb(237,168,2)" : "rgb(255,255,255)", 
						"font-size":"24px", className:"font_rixhead_medium", text:W.Texts["series_vod"] + " (" + _this.results.vseries.total + ")", display:index === no ? "":"none"});
					_menu.add(_menu._menusF[no]);
					_menu._menus[no].type = "vseries";
					no++;
				}
				
				
				if(_this.results.schedule && _this.results.schedule.total > 0){
					totalCount += _this.results.schedule.total;
					if(no == 0){
						components[no].show();
					}
					_menu._menus[no] = new W.Span({x:14, y:19 + no * 48, width:"210px", height:"22px", textColor:"rgba(255,255,255,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["channel_program"] + " (" + _this.results.schedule.total + ")", display:index === no ? "none":""});
					_menu.add(_menu._menus[no]);
					_menu._menusF[no] = new W.Span({x:14, y:13 + no * 48, width:"210px", height:"26px", textColor:index === no ? "rgb(237,168,2)" : "rgb(255,255,255)", 
						"font-size":"24px", className:"font_rixhead_medium", text:W.Texts["channel_program"] + " (" + _this.results.schedule.total + ")", display:index === no ? "":"none"});
					_menu.add(_menu._menusF[no]);
					_menu._menus[no].type = "schedule";
					no++;
				}
				
				if(_this.results.product && _this.results.product.total > 0){
					totalCount += _this.results.product.total;
					if(no == 0){
						components[no].show();
					}
					_menu._menus[no] = new W.Span({x:14, y:19 + no * 48, width:"210px", height:"22px", textColor:"rgba(255,255,255,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["product"] + " (" + _this.results.product.total + ")", display:index === no ? "none":""});
					_menu.add(_menu._menus[no]);
					_menu._menusF[no] = new W.Span({x:14, y:13 + no * 48, width:"210px", height:"26px", textColor:index === no ? "rgb(237,168,2)" : "rgb(255,255,255)", 
						"font-size":"24px", className:"font_rixhead_medium", text:W.Texts["product"] + " (" + _this.results.product.total + ")", display:index === no ? "":"none"});
					_menu.add(_menu._menusF[no]);
					_menu._menus[no].type = "product";
				}

				_menu._focus = new W.Image({x:0, y:0, width:"230px", height:"52px", src:"img/box_result_h52.png", display:"none"});
				_menu.add(_menu._focus);
				_comp._search._count.setText(totalCount);
			}
			
			var focus = function(){
				_menu._focus.setStyle({y:48*index});
				_menu._menusF[index].setStyle({display:""});
				_menu._menus[index].setStyle({display:"none"});
			};
			
			var unFocus = function(){
				_menu._menusF[index].setStyle({display:"none"});
				_menu._menus[index].setStyle({display:""});
			};
			
			this.focus = function(){
				_menu._focus.setStyle({display:""});
				_menu._menusF[index].setStyle({textColor:"rgb(255,255,255)"});
				focus();
			};
			
			this.unFocus = function(){
				_menu._focus.setStyle({display:"none"});
				_menu._menusF[index].setStyle({textColor:"rgb(255,255,255)" , display:"none"});
				_menu._menus[index].setStyle({display:""});
				_menu._menusF[index].setStyle({textColor:"rgb(237,168,2)", display:""});
				_menu._menus[index].setStyle({display:"none"});
			};
			
			this.up = function(){
				unFocus();
				index--;
				if(index < 0) index = _menu._menus.length - 1;
				focus();
				
				clearTimeout(focTimeout);
				focTimeout = setTimeout(function(){
					W.log.info("index === " + index);
					for(var i=0; i < components.length; i++){
						if(i == index){
							components[i].show();
						}else{
							components[i].hide();
						}
					}
					focTimeout = null;
				}, W.Config.KEY_TIMEOUT_TIME);
			};
			
			this.down = function(){
				unFocus();
				index++;
				if(index == _menu._menus.length) index = 0;
				focus();
				
				clearTimeout(focTimeout);
				focTimeout = setTimeout(function(){
					W.log.info("index === " + index);
					for(var i=0; i < components.length; i++){
						if(i == index){
							components[i].show();
						}else{
							components[i].hide();
						}
					}
					focTimeout = null;
				}, W.Config.KEY_TIMEOUT_TIME);
			};

			this.getType = function(){
				return _menu._menus[index].type;
			};
		};

		var create = function(){
			_comp._bg = new W.Div({className : "bg_size"});
			_comp._search = new W.Div({x:369, y:90, width:"631px", height:"59px"});
			_comp._bg.add(_comp._search);
			_comp._search.add(new W.Image({x:0, y:0, width:"540px", height:"59px", src:"img/line_search.png"}));
			_comp._search.add(new W.Image({x:8, y:21, width:"21px", height:"20px", src:"img/icon_search.png"}));
			var _txt_area = new W.Div({x:41, y:20, width:"490px", height:"20px", textAlign:"center"});
			_comp._search.add(_txt_area);
			_comp._search._keyword = new W.Span({position:"relative", y:0, height:"22px", textColor:"rgba(255,255,255,0.9)", 
				"font-size":"20px", className:"font_rixhead_medium", text:_this.param.keyword});
			_txt_area.add(_comp._search._keyword);
			_txt_area.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(140,140,140)", 
				"font-size":"20px", className:"font_rixhead_medium", text:" " + W.Texts["search_result"] + " (" + W.Texts["total"] + " "}));
			_comp._search._count = new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(222,155,2)", 
				"font-size":"20px", className:"font_rixhead_medium", text:""});
			_txt_area.add(_comp._search._count);
			_txt_area.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(140,140,140)", 
				"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["count_unit2"] + ")"}));
			
			_comp._bg.add(new W.Image({x:901, y:38, width:"68px", height:"68px", src:"img/color_yellow.png"}));
			_comp._bg.add(new W.Span({x:952, y:54, width:"80px", height:"22px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["optionMenu"]}));
			
			_comp._timer = new W.Span({x:1037, y:54, width:"190px", height:"22px", textColor:"rgba(255,255,255,0.5)", 
				"font-size":"20px", className:"font_rixhead_medium", textAlign:"right"});
			_comp._bg.add(_comp._timer);
			
			_comp._bg.add(new W.Span({x:55, y:52, width:"130px", height:"27px", textColor:"rgb(255,255,255)", 
				"font-size":"27px", className:"font_rixhead_medium", text:W.Texts["search_result"]}));

			_comp.add(_comp._bg);
			
			clearInterval(timeInterval);
			updateTime();
			timeInterval = setInterval(updateTime, 10*1000);
		};
		
		function checkData(){
			if(_this.results.schedule.total > 0){
				var reqData = {selector:"sourceId,title,channelNum,isAdult"};
				reqData.sourceId = "";
				for(var i=0; i < _this.results.schedule.data.length; i++){
					reqData.sourceId += (i==0 ? "" : ",") + _this.results.schedule.data[i].sourceId;
				}
				_this.sdpDataManager.getChannelDetail(function(result, data){
					if(result){
						W.log.info(data.data);
						for(var i=0; i < _this.results.schedule.data.length; i++){
							for(var j=0; j < data.data.length; j++){
								if(_this.results.schedule.data[i].sourceId == data.data[j].sourceId){
									_this.results.schedule.data[i].channelTitle = data.data[j].title;
									_this.results.schedule.data[i].channelNum = data.data[j].channelNum;
									break;
								}
							}
						}
						initComponent();
					}
				}, reqData);
			}else{
				initComponent();
			}
		};
		
		var init = function(limit){
			_this.results = _this.param.data;
			W.log.info(_this.results);
			if(_this.results){
				checkData();
			}else{
				W.Loading.start();
				searchDataManager.search(function(result, data){
					W.log.info(result);
					W.log.info(data);
					
					if(result && data){
						if(data.hits.total > 0){
							if(data.schedule.total > 0){
								for(var i = 0; i < data.schedule.data.length; i++) {
									if(data.schedule.data[i].title) data.schedule.data[i].title = data.schedule.data[i].title.trim();
								}
								W.CloudManager.getGridEpg(function(chInfo){
									if (chInfo && chInfo.data && chInfo.data.getReserveList) {
										W.StbConfig.ReserveProgramList = util.parseReserveProgramList(chInfo.data.getReserveList);
									} else {
										W.StbConfig.ReserveProgramList = [];
									}

									W.Loading.stop();
									_this.results = data;
									_this.param.chInfo = chInfo;
									checkData();
								});
							}else{
								W.Loading.stop();
								_this.results = data;
								checkData();
							}
						}else{
							W.Loading.stop();
							if(_this.param.m_field){
								W.PopupManager.openPopup({
				                    childComp:_this,
				                    title:W.Texts["popup_zzim_info_title"],
				                    popupName:"popup/AlertPopup",
			                        type:"error",
				                    boldText:W.Texts["no_search_result"]}
				                );
							}else{
								W.PopupManager.openPopup({
				                    childComp:_this,
				                    title:W.Texts["popup_zzim_info_title"],
				                    popupName:"popup/AlertPopup",
			                        type:"error",
				                    boldText:W.Texts["no_search_result"],
				                    thinText:W.Texts["no_auto_completion2"]}
				                );
							}
						}
					}else{
						W.Loading.stop();
						W.PopupManager.openPopup({
	                        childComp:_this,
	                        popupName:"popup/ErrorPopup",
	                        code:(data && data.error && data.error.code) ? data.error.code : "9999",
	            			from : "SEARCH"}
	                    );
					}
					
				}, _this.param.keyword, undefined, 0, limit, "vod:pop,vseries:pop,product:new,schedule:start", undefined, _this.param.p_rating, _this.param.m_field, _this.param.isWithoutAdult);
			}
		};
		
		function initComponent(){
			create();
			index = 0;
			var no = 0;
			if(_this.results.vod && _this.results.vod.total > 0){
				components[no] = listComponent.getNewComp();
				components[no].init(_this, _comp, "vod");
				no++;
			}
			if(_this.results.vseries && _this.results.vseries.total > 0){
				components[no] = listComponent.getNewComp();
				components[no].init(_this, _comp, "vseries");
				no++;
			}
			if(_this.results.schedule && _this.results.schedule.total > 0){
				components[no] = resultChannel.getNewComp();
				components[no].init(_this, _comp, "schedule");
				no++;
			}
			
			if(_this.results.product && _this.results.product.total > 0){
				components[no] = listComponent.getNewComp();
				components[no].init(_this, _comp, "product");
				no++;
			}
			W.log.info("index ============ " + index);
			Menu.create(index);
			W.log.info("index ============ " + index);
			
			if(components[index]) components[index].focus();
		};

		return W.Scene.extend({
			onCreate : function(param) {
				W.log.info(_thisScene + " onCreate");
				_this = this;
				_this.param = param;
				_this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.BACK, W.KEY.EXIT,
				                W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9,
				                W.KEY.COLOR_KEY_R, W.KEY.COLOR_KEY_G, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_B]);
				index = 0;
				_this.sdpDataManager = W.getModule("manager/SdpDataManager");
				Menu = new MenuComp();
				if(W.StbConfig.vodLookStyle == 1){
					listComponent = resultPoster;
				}else{
					listComponent = resultText;
				}

				_comp = new W.Div({className : "bg_size bg_color"});
				_this.add(_comp);
				
				_this.getList = function(type, offset, limit, sorting, callback, param, param2){
					searchDataManager.search(callback, _this.param.keyword, type, offset, limit, sorting, undefined, _this.param.p_rating, _this.param.m_field, _this.param.isWithoutAdult, param, param);
				};
				
				_this.getSortingParam = function(type, idx){
					var param = type + ":";
					if(type == "vod" || type == "vseries"){
						if(idx == 0){
							param += "new";
						}else if(idx == 1){
							param += "pop";
						}else if(idx == 2){
							param += "abc";
						}
					}else if(type == "schedule"){
						if(idx == 0){
							param += "start";
						}else if(idx == 1){
							param += "abc";
						}
					}else if(type == "product"){
						if(idx == 0){
							param += "new";
						}else if(idx == 1){
							param += "abc";
						}
					}
					return param;
				};
				var limit = 0;
				if(W.StbConfig.vodLookStyle == 1){
					limit = 28;
				}else{
					limit = 27;
				}
				init(limit);
			},
			onPause: function() {

			},
			onResume: function() {

			},
			onRefresh: function() {
			},
			goDetail: function(assetId) {
				
			},
			goSeries: function(assetId) {
				
			},
			goChannel: function(assetId) {
				
			},
			onDestroy : function() {
				clearInterval(timeInterval);
				clearTimeout(focTimeout);
				W.log.info(_thisScene + " onDestroy !!!");
			},
			onKeyPressed : function(event) {
				W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " isMenu " + isMenu + " index " + index);
				
				if(event.keyCode == W.KEY.BACK){
					this.backScene();
				}else if(event.keyCode == W.KEY.COLOR_KEY_Y){
					if(focTimeout) return;
					var cateType = components[index].getType();
					var sIdx = components[index].getSortingIdx();
					var options = [];
					if(cateType == "vod" || cateType == "vseries"){
						options = [W.Texts["sorting_option2"], W.Texts["sorting_option1"], W.Texts["sorting_option3"]];
					}else if(cateType == "schedule"){
						options = [W.Texts["sorting_option6"], W.Texts["sorting_option3"]];
					}else if(cateType == "product"){
						options = [W.Texts["sorting_option2"], W.Texts["sorting_option3"]];
					}
					var popupData = {
							options:[
							    {
							    	name: W.Texts["sorting"],
									subOptions: [
									    {type: "spinner", 
									    	index: sIdx, 
									    	options: options
									    }
									]
							    }
							]
	  					};
	  				var popup = {
	  					popupName:"popup/sideOption/VodSideOptionPopup",
	  					optionData:popupData,
	  					childComp : _this
	  				};
	  				W.PopupManager.openPopup(popup);
				}else{
					if(_this.isKeyLock) return;
					
					if(isMenu){
						switch (event.keyCode) {
						case W.KEY.DOWN:
							Menu.down();
							break;
						case W.KEY.UP:
							Menu.up();
							break;
						case W.KEY.BACK:
							this.backScene();
							break;
						case W.KEY.RIGHT:
						case W.KEY.ENTER:
							if(focTimeout) return;
							isMenu = false;
							Menu.unFocus();
							components[index].focus();
							break;
						}
					}else{
						var isConsume = components[index].operate(event);
						if(!isConsume){
							switch (event.keyCode) {
							case W.KEY.LEFT:
								isMenu = true;
								components[index].unFocus();
								Menu.focus();
								break;
							case W.KEY.BACK:
								this.backScene();
								break;
							case W.KEY.ENTER:
								break;
							}
						}
					}
				}
			},
			onPopupClosed : function(popup, desc){
				if (desc) {
	        		if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
	        			if (desc.action == W.PopupManager.ACTION_OK) {
		        			if(components[index].getSortingIdx() != desc.param.value){
		        				components[index].resetList(desc.param.value, isMenu);
		        			}
	        			}
	        		}else if (desc.popupName == "popup/AlertPopup") {
	        			if (desc.type == "error") {
	        				_this.backScene();
	        			}
	        		}else if (desc.popupName == "popup/ErrorPopup") {
	        			_this.backScene();
	        		}
				}
            }
		});
	});