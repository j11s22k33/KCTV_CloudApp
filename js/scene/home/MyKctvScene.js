/**
 * scene/MyKctvScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/home/MyKctv", "comp/CouponInfo"],
	function(util, menuComp, couponInfoComp) {
		var STATE_MENU = 0;
		var STATE_COMP = 1;

		var _thisScene = "MyKctvScene";
		var _this;
		var _parentDiv;

		W.log.info("### Initializing " + _thisScene + " scene ###");
		var btOpacities = [0.1, 0.2, 0.3, 0.4, 0.5];
		var couponInfo = couponInfoComp.getNewComp();

		var create = function(){
			_parentDiv = new W.Div({className : "bg_size"});
			_parentDiv._bg = new W.Div({id:"home_bg", className : "bg_size"});
			
			_parentDiv._bg._color = new W.Div({className : "bg_size home_bg_color", backgroundColor:"rgb(0,0,0)", opacity:btOpacities[W.StbConfig.menuTransparency - 1]});
			_parentDiv._bg.add(_parentDiv._bg._color);
			_parentDiv._bg.add(new W.Image({id:"my_bg_img", className : "bg_size", src:"img/00_bg_b.png"}));
			_parentDiv._bg.add(new W.Image({x:0, y:0, width:"1280px", height:"249px", src:"img/00_bg_t.png"}));
			_parentDiv.add(_parentDiv._bg);
			
			_parentDiv._top = new W.Div({x:0, y:38, width:"1280px", height:"68px"});
			_parentDiv.add(_parentDiv._top);

			_parentDiv._menu = new W.Div({id:"myKctv_menu_area", className : "bg_size"});
			_parentDiv.add(_parentDiv._menu);
			
			_parentDiv._comp = new W.Div({id:"myKctv_comp_area", className : "bg_size"});
			_parentDiv.add(_parentDiv._comp);
			
			_parentDiv._top.add(couponInfo.getComp(567, 0));
			couponInfo.setData();
			
			_parentDiv._notice = new W.Div({id:"home_notice_area", x:0, y:483, width:"1280px", height:"237px", display:"none"});
			_parentDiv._notice.add(new W.Image({x:0, y:0, width:"1280px", height:"237px", src:"img/bg_alarm.png"}));
			_parentDiv.add(_parentDiv._notice);
			
			_this.add(_parentDiv);

		};
		
		var init = function(){
			create();
			
			_parentDiv._menu.add(_this.components[0].init(_this, _parentDiv, couponInfo));
			_this._comp_area = new W.Div({className : "bg_size", opacity:0.8});
			_parentDiv._comp.add(_this._comp_area);
			_this.components[0].focus();
		};

		return W.Scene.extend({
			onCreate : function(param) {
				W.log.info(_thisScene + " onCreate");
				_this = this;
				_this.mainMenu = param.category;
				_this.mainTitle = param.title;
				_this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
					W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9,
					W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_Y]);
				_this.sdpManager = W.getModule("manager/SdpDataManager");

				_this.components = [menuComp.getNewComp()];
				_this.state = STATE_MENU;
				init();
			},
			changeBgColor: function(isComp){
				if(isComp){
					_parentDiv._bg._color.setStyle({opacity:0.9});
				}else{
					_parentDiv._bg._color.setStyle({opacity:btOpacities[W.StbConfig.menuTransparency - 1]});
				}
			},
			onPause: function() {

			},
			onResume: function() {
				if(_this.components[_this.state].reload){
					_this.components[_this.state].reload();
				}
				if(_this.components[_this.state].resume){
					_this.components[_this.state].resume();
				}
			},
			onRefresh: function() {
				
			},
			onDestroy : function() {
				W.log.info(_thisScene + " onDestroy !!!");
				_this.components[_this.state].destroy();
			},
			onKeyPressed : function(event) {
				W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + _this.state);

				var isConsume = _this.components[_this.state].operate(event);
				W.log.info("isConsume ===== " + isConsume);
				if(!isConsume){
					switch (event.keyCode) {
					case W.KEY.UP:
						if(_this.state == STATE_COMP){
							if(!_this.components[_this.state-1].hasData()){
								_this.state--;
								_this.components[_this.state].showAll();
							}else{
								if(_this.components[_this.state-1].getDepth() == 0){
									_this.components[1].changeMode(0);
									_this.state--;
									_this.components[_this.state].showAll();
								}else{
									_this.components[1].changeMode(1);
									_this.state--;
									_this.components[_this.state].show();
								}
							}
						}else{
							this.backScene();
						}
						break;
					case W.KEY.ENTER:
					case W.KEY.DOWN:
						if(_this.state < STATE_COMP){
							_this.components[_this.state].hide();
//							_this.components[_this.state].unFocus(_this.state + 1);
							_this.state = STATE_COMP;
							_this.components[_this.state].changeMode(2);
						}
						break;
					case W.KEY.BACK:
						if(_this.state == STATE_COMP){
							if(!_this.components[_this.state-1].hasData()){
								_this.state--;
								_this.components[_this.state].showAll();
							}else{
								if(_this.components[_this.state-1].getDepth() == 0){
									_this.components[1].changeMode(0);
									_this.state--;
									_this.components[_this.state].showAll();
								}else{
									_this.components[1].changeMode(1);
									_this.state--;
									_this.components[_this.state].show();
								}
							}
							_this.changeBgColor();
						}else{
							this.backScene();
						}
						break;
					case W.KEY.EXIT:
						
						break;
					case W.KEY.EXIT:
						
						break;
					case W.KEY.EXIT:
	
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
		});
	});