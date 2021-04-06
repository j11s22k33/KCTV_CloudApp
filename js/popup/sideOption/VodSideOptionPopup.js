/**
 * popup/VodSideOptionPopup
 */
W.defineModule(["comp/sideOption/SideOption"], function(SideOption) {
	'use strict';
	W.log.info("VodSideOptionPopup");
	var _comp;
	var data;
	var _this;
	var isNeedNumKey;
	function create(){
		 /*data = {
			 options :[
			 {name:"범죄도시", subOptions : [
			 {type:"box", name:"마이 플레이리스트 추가"},
			 {type:"box", name:"즐겨찾기 추가"}
			 ]},
			 {name:"영화 > 월정액 영화관", subOptions : [
			 {type:"box", name:"즐겨찾기 추가"}
			 ]},
			 {name:undefined, subOptions : [
			 {type:"box", name:"검색"}
			 ]},
			 {name:"정렬", subOptions : [
			 {type:"spinner", index:0, options:["인기순", "최신순", "가나다순"]}
			 ]},
			 {name:"회차 이동", subOptions : [
			 {type:"inputBox", episodeList : [1,2,4,5,6,7,9,10], button : "회차 이동"}
			 ]}
		 ]};*/


		_this.sideOption = new SideOption({type:SideOption.TYPE.MOVIE, data:_this.data, callback : closeCallback});
		_comp._sideOption = _this.sideOption.getComp();
		_comp._sideOption.setStyle({x:940, y:0});
		_comp.add(_comp._sideOption);
	};

	function closeCallback(isOK, returnParam) {
		if(isOK) {
			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, param:returnParam, param2:_this.param});
		} else {
			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
		}

	}
	
	function focus(){
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("VodSideOptionPopup onStart");
			W.log.info(_param)
    		if(_comp){
    			this.remove(_comp);
    		}

    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK, W.KEY.COLOR_KEY_Y,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);
			_this = this;
			_this.param = _param.param;
			_this.data = _param.optionData;
			isNeedNumKey = _param.isNeedNumKey;
			W.log.info("isNeedNumKey == " + isNeedNumKey);
			if(isNeedNumKey){
				W.CloudManager.addNumericKey();
			}

			_comp = new W.Div({className : "bg_size popup_bg_color", zIndex:3});

			this.add(_comp);

			create();
    	},
    	onStop: function() {
    		W.log.info("VodSideOptionPopup onStop");
    		if(isNeedNumKey){
    			W.CloudManager.delNumericKey();
			}
    	},
    	onKeyPressed : function(event) {
    		W.log.info("VodSideOptionPopup onKeyPressed "+event.keyCode);
    		
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
    	}
    });
});