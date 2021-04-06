/**
 * popup/GuideSideOptionPopup
 */
W.defineModule(["comp/sideOption/SideOption"], function(SideOption) {
	'use strict';
	W.log.info("GuideSideOptionPopup");
	var _comp;
	var data;
	var _this;
	function create(){
		 /*data = [
		 {title:"범죄도시", menu : [
		 {type:"box", title:"마이 플레이리스트 추가"},
		 {type:"box", title:"즐겨찾기 추가"}
		 ]},
		 {title:"영화 > 월정액 영화관", menu : [
		 {type:"box", title:"즐겨찾기 추가"}
		 ]},
		 {title:undefined, menu : [
		 {type:"box", title:"검색"}
		 ]},
		 {title:"정렬", menu : [
		 {type:"spinner", index:0, options:["인기순", "최신순", "가나다순"]}
		 ]},
		 {title:"회차 이동", menu : [
		 {type:"inputBox", episodeList : [1,2,4,5,6,7,9,10], button : "회차 이동"}
		 ]}
		 ];*/


		_this.sideOption = new SideOption({type:SideOption.TYPE.GUIDE, data:_this.data, callback : closeCallback});
		_comp._sideOption = _this.sideOption.getComp();
		_comp._sideOption.setStyle({x:940, y:0});
		_comp.add(_comp._sideOption);
	};

	function closeCallback(isOK, returnParam) {
		if(isOK) {
			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, param:returnParam});
		} else {
			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
		}

	}
	
	function focus(){
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("GuideSideOptionPopup onStart");
			W.log.info(_param)
    		if(_comp){
    			this.remove(_comp);
    		}

    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK, W.KEY.COLOR_KEY_Y,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);
			_this = this;
			_this.data = _param.optionData;


			_comp = new W.Div({className : "bg_size popup_bg_color", zIndex:3});

			this.add(_comp);

			create();
    	},
    	onStop: function() {
    		W.log.info("GuideSideOptionPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("GuideSideOptionPopup onKeyPressed "+event.keyCode);
    		
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