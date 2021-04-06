/**
 * popup/KidsLimitPopup
 */
W.defineModule(["comp/kids/popup/Button"], function(Button) {
	'use strict';
	W.log.info("KidsLimitPopup");
	var _comp;
	var timeout;
	var _this;
	var type;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("KidsLimitPopup onStart");
    		W.log.info(_param);
    		_this = this;
    		type = _param.type;
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size"});
    		_comp.add(new W.Image({x:839, y:496, width:"441px", height:"224px", src:"img/kids_tip_ch.png"}));
    		_comp.add(new W.Image({x:818, y:564, width:"273px", height:"68px", src:"img/kids_tip.png"}));
    		_comp.add(new W.Div({x:846, y:585, width:"200px", height:"26px",text:W.Texts["kids_mode_limit"], 
				textColor:"rgb(255,233,43)", fontFamily:"RixHeadB", "font-size":"24px", textAlign:"center"}));
			this.add(_comp);
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
			}, 5000);
    	},
    	onStop: function() {
    		W.log.info("KidsLimitPopup onStop");
			clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("KidsLimitPopup onKeyPressed "+event.keyCode);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    		case W.KEY.ENTER:
				clearTimeout(timeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				break;
    		}
    	}
    });
});