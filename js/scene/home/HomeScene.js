/**
 * scene/HomeScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/home/Top", "comp/home/Banner", "comp/home/Menu"],
	function(util, topComp, bannerComp, menuComp) {
		var STATE_TOP = 0;
		var STATE_BANNER = 1;
		var STATE_MENU = 2;
		var STATE_COMP = 3;

		var _thisScene = "HomeScene";
		var _this;
		var _parentDiv;
		var _currentComp;
		var isComplete = false;

		W.log.info("### Initializing " + _thisScene + " scene ###");
		var btOpacities = [0.1, 0.2, 0.3, 0.4, 0.5];


		var create = function(){
			
			_parentDiv = new W.Div({id:"home_scene_div", className : "bg_size", visibility: W.HomeShowCount > 0 ? "visible" : "hidden"});
			W.Loading.start({delay:3000});
//			// 1: -20, 2: -10, 3: 0, 4: 10, 5: 20
//			W.StbConfig.menuTransparency = 1;
			
			_parentDiv._bg = new W.Div({id:"home_bg", className : "bg_size"});
			
			_parentDiv._bg._color = new W.Div({id:"home_bg_color", className : "bg_size home_bg_color", backgroundColor:"rgb(0,0,0)", opacity:btOpacities[W.StbConfig.menuTransparency - 1]});
			_parentDiv._bg.add(_parentDiv._bg._color);
			_parentDiv._bg.add(new W.Image({id:"home_bg_img", className : "bg_size", src:"img/00_bg_b.png"}));
			_parentDiv._bg.add(new W.Image({id:"home_bg_img2", x:0, y:0, width:"1280px", height:"249px", src:"img/00_bg_t.png"}));
			_parentDiv.add(_parentDiv._bg);
			
			_parentDiv._top = new W.Div({id:"home_top_area", className : "bg_size"});
			_parentDiv.add(_parentDiv._top);
			
			_parentDiv._menu = new W.Div({id:"home_menu_area", className : "bg_size"});
			_parentDiv.add(_parentDiv._menu);
			
			_parentDiv._comp = new W.Div({id:"home_comp_area", className : "bg_size"});
			_parentDiv.add(_parentDiv._comp);
			
			_parentDiv._banner = new W.Div({id:"home_banner_area", className : "bg_size"});
			_parentDiv.add(_parentDiv._banner);

			_this.add(_parentDiv);
		};
		
		var init = function(){

			for(var i=0; i < _this.mainMenu.length; i++){
				if(_this.mainMenu[i].menuType == "MC0010"){
					_this.settingCategory = _this.mainMenu.splice(i, 1)[0];
					i--;
				}else if(_this.mainMenu[i].menuType == "MC0001"){
					_this.myKctvCategory = _this.mainMenu.splice(i, 1)[0];
					i--;
				}else if(_this.mainMenu[i].menuType == "MC0008"){
					_this.searchCategory = _this.mainMenu.splice(i, 1)[0];
					i--;
				}else if(_this.mainMenu[i].menuType == "MC0004" || _this.mainMenu[i].menuType == "MC0005"){
					_this.mainMenu[i].isLeaf = true;
				}
			}
			_parentDiv._top.add(_this.components[0].init(_this));

			_this.components[2].init(_this, _parentDiv);
			_this._comp_area = new W.Div({id:"comp_area", className : "bg_size", opacity:0.8});
			_parentDiv._comp.add(_this._comp_area);
			

			_parentDiv._banner.add(_this.components[1].init(_this));
			
			if(_this.mainMenu[0].menuType == "MC0002"){
				_this.recoDataManager.getForyouChannel(function(result, data, param){
					if(result && W.StbConfig.cugType != "accommodation"){
						_this.mainMenu[0].banners = data.resultList;
						for(var i=0; i < _this.mainMenu[0].banners.length; i++){
							_this.mainMenu[0].banners[i].isRec = true;
						}
					}else{
						_this.mainMenu[0].banners = [];
					}
					if(_this.mainMenu[0].banners.length < 7){
						_this.uiPlfManager.getPromotionList(function(result, data, param){
							if(result){
								for(var i=0; i < data.data.length; i++){
									data.data[i].channelSrcId = data.data[i].link.linkTarget;
									data.data[i].channelName = data.data[i].chnlNm;
									data.data[i].channelNo = data.data[i].chnlNo;
								}
								_this.mainMenu[0].banners = _this.mainMenu[0].banners.concat(data.data);
							}
							_this.components[1].changeBanner(0);
							_this.components[2].focus(false, true);
							isComplete = true;
						}, {targetId:_this.mainMenu[0].baseId, offset:0, limit:7-_this.mainMenu[0].banners.length}, 0);
					}else{
						_this.components[1].changeBanner(0);
						_this.components[2].focus(false, true);
						isComplete = true;
					}
				}, 0);
			}else{
				_this.uiPlfManager.getPromotionList(function(result, data, param){
					if(result){
						_this.mainMenu[0].banners = data.data;
					}else{
						_this.mainMenu[0].banners = [];
					}
					_this.components[1].changeBanner(0);
					_this.components[2].focus(false, true);
					isComplete = true;
				}, {targetId:_this.mainMenu[0].baseId, offset:0, limit:6}, 0);
			}

			//처음 포커스의 offsetWidth 값이 안 맞게 나오는 현상이 있어 처리함.
			//setTimeout(function(){
				
			//}, 500);
		};

		return W.Scene.extend({
			onCreate : function(param) {
				W.log.info(_thisScene + " onCreate");
				W.log.info(param);
				_this = this;
//				_this.mainMenu = param.category;
				_this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
					W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9,
					W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_Y, 89, W.KEY.COLOR_KEY_G, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_R]);

				_this.sdpManager = W.getModule("manager/SdpDataManager");
				_this.uiPlfManager = W.getModule("manager/UiPlfDataManager");
				_this.recoDataManager = W.getModule("manager/RecommendDataManager");
				
				_this.components = [topComp, bannerComp, menuComp];
				_this.state = STATE_MENU;
				
				_this.changeBgAlpha = function(){
					_parentDiv._bg._color.setStyle({opacity:btOpacities[W.StbConfig.menuTransparency - 1]});
				};
				
				_this.channelChange = function(type, data){
					if(_this.components[_this.state].channelChange){
						_this.components[_this.state].channelChange(type, data);
					}
				};
				
				_this.jumpMenu = function(targetCategoryId){
					if(_this.state == STATE_COMP){
						if(targetCategoryId){
							_this.components[2].changeCategory(targetCategoryId);
						}else{
							if(!_this.components[_this.state-1].hasData()){
								_this.state--;
								_this.components[_this.state].showAll();
							}else{
								if(_this.components[_this.state-1].getDepth() == 0){
									_this.components[2].changeMode(0);
									_this.state--;
									_this.components[_this.state].showAll();
								}else{
									_this.components[2].changeMode(1);
									_this.state--;
									_this.components[_this.state].show();
								}
							}
						}
					}
				};
				create();
				
				if(param){
					_this.mainMenu = param.category;
					init();
				}
			},
			changeBgColor: function(isComp){
				if(isComp){
					_parentDiv._bg._color.setStyle({opacity:0.9});
				}else{
					_parentDiv._bg._color.setStyle({opacity:btOpacities[W.StbConfig.menuTransparency - 1]});
				}
			},
			setCategoryData: function(data){
				W.log.info(data);
				_this.mainMenu = data;
				init();
			},
			onPause: function() {
				if(_this.state == STATE_COMP && _this.components[STATE_COMP].pause){
					_this.components[STATE_COMP].pause();
				}
			},
			onResume: function() {
				if(_this.components[_this.state].resume){
					_this.components[_this.state].resume();
				}
				
				if(_this.isAddedEntryPath){
					W.entryPath.pop();
					_this.isAddedEntryPath = false;
				}
			},
			onRefresh: function() {
				if(_this.components[STATE_COMP].refresh){
					_this.components[STATE_COMP].refresh();
				}
			},
			onDestroy : function() {
				W.log.info(_thisScene + " onDestroy !!!");
				if(_this.components[STATE_COMP] && _this.components[STATE_COMP].destroy){
					_this.components[STATE_COMP].destroy();
				}
			},
			onKeyPressed : function(event) {
				if(!isComplete) return;
				W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + _this.state);

				var isConsume = _this.components[_this.state].operate(event);
				W.log.info("isConsume ===== " + isConsume);
				if(!isConsume){
					switch (event.keyCode) {
					case W.KEY.UP:
						if(_this.state > STATE_TOP){
							if(_this.state == STATE_COMP){
								if(!_this.components[_this.state-1].hasData()){
									_this.state--;
									_this.components[_this.state].showAll();
								}else{
									if(_this.components[_this.state-1].getDepth() == 0){
										_this.components[2].changeMode(0);
										_this.state--;
										_this.components[_this.state].showAll();
									}else{
										_this.components[2].changeMode(1);
										_this.state--;
										_this.components[_this.state].show();
									}
								}
								if(_this.state == STATE_MENU){
									_this.components[2].focus(true);
								}
							}else{
								_this.components[_this.state].unFocus(_this.state - 1);
								_this.state--;
								if(!_this.components[_this.state].hasData()){
									_this.state--;
								}
								_this.components[_this.state].focus(true);
							}
							
						}
						break;
					case W.KEY.DOWN:
						if(_this.state < STATE_COMP){
							_this.components[_this.state].unFocus(_this.state + 1);
							if(!_this.components[_this.state].hasData()){
								if(_this.state == STATE_BANNER){
									_this.state++;
								}else{
									_this.state += 2;
								}
							}else{
								if(_this.state == STATE_BANNER){
									_this.state++;
								}else{
									_this.state++;
									if(!_this.components[_this.state].hasData()){
										_this.state++;
									}
								}
							}
							_this.components[_this.state].focus(true);
						}
						break;
					case W.KEY.BACK:
						if(_this.state == STATE_COMP){
							if(!_this.components[_this.state-1].hasData()){
								_this.state--;
								_this.components[_this.state].showAll();
							}else{
								if(_this.components[_this.state-1].getDepth() == 0){
									_this.components[2].changeMode(0);
									_this.state--;
									_this.components[_this.state].showAll();
								}else{
									_this.components[2].changeMode(1);
									_this.state--;
									_this.components[_this.state].show();
								}
							}
							if(_this.state == STATE_MENU){
								_this.components[2].focus(true);
							}
						}else{
							this.backScene();
						}
						break;
					case W.KEY.EXIT:
						this.backScene();
						break;
					}
				}
			},
			onPopupOpened : function(popup, desc) {
				W.log.info(popup,desc)
			},
			onPopupClosed : function(popup, desc) {
				W.log.info(popup,desc)
				if (desc) {
					if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
						if (desc.action == W.PopupManager.ACTION_OK) {
						}
					}
				}
			},
			resetTop : function(){
				W.log.info("resetTop");
				_this.components[0].changeIcon();
			}
		});
	});