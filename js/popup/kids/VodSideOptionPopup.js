/**
 * popup/kidsVodSideOptionPopup
 */
W.defineModule(["comp/kids/sideOption/SideOption"], function(SideOption) {
	'use strict';
	W.log.info("kidsVodSideOptionPopup");
	var _comp;
	var data;
	var isNeedNumKey;
	var _this;
	function create(){
		W.log.info(_this.data)
		_this.sideOption = new SideOption({type:SideOption.TYPE.MOVIE, data:_this.data, callback : closeCallback});
		_comp._sideOption = _this.sideOption.getComp();
		_comp._sideOption.setStyle({x:950, y:0});
		_comp.add(_comp._sideOption);
	};

	function closeCallback(isOK, returnParam) {
		W.log.info(returnParam)
		if(isOK) {
			if(W.state.isVod){
				W.PopupManager.openPopup({
                    title:W.Texts["popup_zzim_info_title"],
					childComp : _this,
                    popupName:"popup/AlertPopup",
                    boldText:W.Texts["vod_alert_msg"],
                    thinText:W.Texts["vod_alert_msg2"]}
                );
			}else{
				var popup = {
					popupName:"popup/kids/PinPopup",
					childComp : _this
					//childComp : this
				};
				if(W.StbConfig.isKidsMode) {	//키즈 모드 일때
					if(returnParam.subOptions == 0) {
						//키즈모드 OFF
						popup.kidsModeOn = true;
						popup.type = "kids";
						W.PopupManager.openPopup(popup);
					} else {
						//시청제한 설정 변경
						popup.type = "restrict";
						W.PopupManager.openPopup(popup);
						/*var popup = {
							popupName:"popup/kids/RestrictPopup",
							childComp : _this
							//childComp : this
						};
						W.PopupManager.openPopup(popup);*/
					}
				} else {
					W.log.info(returnParam)
					if(returnParam.param == "KIDS") {
						popup.type = "kids";
						W.PopupManager.openPopup(popup);
					} else {
						W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, param:returnParam, param2:_this.param});
					}
				}
				//W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, param:returnParam});
			}
		} else {
			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
		}

	}
	
	function focus(){
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("kidsVodSideOptionPopup onStart");
			W.log.info(_param)
    		if(_comp){
    			this.remove(_comp);
    		}

    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK, W.KEY.COLOR_KEY_Y,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);
			_this = this;
			_this.data = _param.optionData;
			isNeedNumKey = _param.isNeedNumKey;
			W.log.info("isNeedNumKey == " + isNeedNumKey);
			if(isNeedNumKey){
				W.CloudManager.addNumericKey();
			}


			_comp = new W.Div({className : "bg_size", backgroundColor:"rgba(0,0,0,0.5)", zIndex:3});

			this.add(_comp);

			create();
    	},
    	onStop: function() {
    		W.log.info("kidsVodSideOptionPopup onStop");
    		if(isNeedNumKey){
    			W.CloudManager.delNumericKey();
			}
    	},
    	onKeyPressed : function(event) {
    		W.log.info("kidsVodSideOptionPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.RIGHT:
    		case W.KEY.COLOR_KEY_Y:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
			case W.KEY.BACK:
    		case W.KEY.ENTER:
    		case W.KEY.LEFT:
    		case W.KEY.UP:
    		case W.KEY.DOWN:
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
				_this.sideOption.operate(event);
    			break;
    		}
    	},
		onPopupClosed: function (popup, desc) {
			W.log.info("kidsVodSideOptionPopup onPopupClosed ");
			W.log.info(popup, desc);
			if (desc && desc.popupName == "popup/kids/PinPopup") {
				if (desc.action == W.PopupManager.ACTION_OK) {
					W.log.info(popup, desc)
					if(popup.param && popup.param.type == "kids") {
						if(popup.param.kidsModeOn) {	//키즈모드 일때 => 키즈 모드 종료
							W.CloudManager.changeMode(function(data){
								if(data && data.data == "OK") {
									W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
									W.StbConfig.isKidsMode = false;
									W.SceneManager.getSceneStack()[0].showHome();
								}
							}, "NORMAL", W.StbConfig.parentalRating.rating);
						} else {	//키즈 모드 실행

							W.CloudManager.changeMode(function(data){
								if(data && data.data == "OK") {
									W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
									W.StbConfig.isKidsMode = true;
									W.SceneManager.getSceneStack()[0].showHome();
								}
							}, "KIDS", W.StbConfig.parentalRating.rating);
						}
					} else if(popup.param && popup.param.type == "restrict") {
						var popup = {
							popupName:"popup/kids/RestrictPopup",
							childComp : _this
							//childComp : this
						};
						W.PopupManager.openPopup(popup);
					} else {
						W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, param:_this.param});
					}
				} else {
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				}
			} else if (desc && desc.popupName == "popup/kids/RestrictPopup") {
				if (desc.action == W.PopupManager.ACTION_OK) {
					var popup = {
						popupName:"popup/kids/RestrictCompletePopup",
						typeText:desc.typeText,
						optionText:desc.optionText,
						childComp : _this
						//childComp : this
					};
					W.PopupManager.openPopup(popup);
				} else {
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, param:_this.param});
				}
			} else if (desc && desc.popupName == "popup/AlertPopup") {
				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
			}
		}
    });
});