/**
 * scene/GuideScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/guide/Guide"],
	function(util, guide) {
		var STATE_TOP = 0;
		var STATE_BANNER = 1;
		var STATE_MENU = 2;
		var STATE_SUB_MENU = 3;
		var STATE_COMP = 4;

		var _thisScene = "GuideScene";
		var _this;
		var _parentDiv;
		var currMenu;
		var currComponent;
		var _currComponent;
		var keyTimeout;

		var state = STATE_COMP;

		W.log.info("### Initializing " + _thisScene + " scene ###");

		return W.Scene.extend({
			onCreate : function(param) {
				W.log.info(_thisScene + " onCreate");
				_this = this;
				_this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
					W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
					W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_G, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_R]);
				_this.ps = new W.AnimationSpec();
				_this.param = param;
				//_this.setDisplay("none")
				//_this.setY(720);

				_parentDiv = new W.Div({className : "bg_size"});
				_parentDiv._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
				_parentDiv.add(_parentDiv._comp_area);

				currComponent = guide.getNewComp();
				if(param.category && param.category.categoryCode == "CC0201"){
					_currComponent = currComponent.create(_parentDiv, _this, param.category, null, 2);
				}else if(param.category && param.category.categoryCode == "CC0202"){
					_currComponent = currComponent.create(_parentDiv, _this, param.category, "FavChannel", 2);
				}else if(param.category && param.category.categoryCode == "CC0203"){
					_currComponent = currComponent.create(_parentDiv, _this, param.category, "GenreChannel", 2);
				} else {
					_currComponent = currComponent.create(_parentDiv, _this, {title:W.Texts["all_channel_schedule"], categoryCode:"CC0201"}, null, 2);
				}

				_parentDiv._comp_area.add(_currComponent);

				_this.add(_parentDiv);

				_this.channelChange = function(type, data){
					if(currComponent.channelChange){
						currComponent.channelChange(type, data);
					}
				};

				//setTimeout(function(){
					currComponent.changeMode(2);
					currComponent.show();
				//},500);

			},
			onPause: function() {
				if(state == STATE_COMP && currComponent.pause){
					currComponent.pause();
				}
			},
			onResume: function() {
				if(state == STATE_COMP && currComponent.resume){
					currComponent.resume();
				}
			},
			onRefresh: function() {
				W.log.info("GuideScene refresh")
				if(state == STATE_COMP && currComponent.refresh){
					currComponent.refresh();
				}
			},
			onDestroy : function() {
				W.log.info(_thisScene + " onDestroy !!!");
				if(state == STATE_COMP && currComponent.destroy){
					currComponent.destroy();
				}
			},
			onKeyPressed : function(event) {
				W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + state);
				switch (event.keyCode) {
					case W.KEY.RIGHT:
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else{

						}

						break;
					case W.KEY.LEFT:
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else{
						}

						break;
					case W.KEY.UP:
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else if(state > STATE_TOP){
						}
						break;
					case W.KEY.DOWN:
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else{
						}
						break;
					case W.KEY.ENTER:
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else {
							if(!currComponent.hasList() && _this.param.category.categoryCode == "CC0202") {
								W.SceneManager.startScene({
									sceneName:"scene/setting/SettingScene",
									backState:W.SceneManager.BACK_STATE_KEEPHIDE,
									param:{targetId : "CC1001"}
								});
							}
						}
						break;
					case W.KEY.BACK:
						_this.backScene();
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else if(state == STATE_TOP){
						}
						break;
					case W.KEY.EXIT:
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
					case W.KEY.COLOR_KEY_G:
					case W.KEY.COLOR_KEY_R:
					case W.KEY.COLOR_KEY_B:
						if(currComponent.hasList() && state == STATE_COMP){
							currComponent.operate(event);
						}else{

						}

						break;
				}

			},
			onPopupClosed: function(event){
			},
		});
	});