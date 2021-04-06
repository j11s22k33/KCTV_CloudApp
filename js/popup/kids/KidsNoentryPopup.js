/**
 * popup/KidsNoentryPopup
 */
W.defineModule(["comp/kids/popup/Button"], function(Button) {
	'use strict';
	W.log.info("KidsNoentryPopup");
	var _comp;
	var timeout;
	var _this;
	var type;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("KidsNoentryPopup onStart");
    		W.log.info(_param);
    		_this = this;
    		type = _param.type;
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size"});
			_comp.add(new W.Image({x:0, y:352, width:1280, height:368, src:"img/bg_player.png"}));
    		_comp.add(new W.Image({x:545, y:503, width:190, height:110, src:"img/kids_tip_end.png"}));
    		_comp.add(new W.Div({x:0, y:634, width:1280, height:26, text:W.Texts["kids_noentry_1"], "letter-spacing" : "-0.5px",
				textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center"}));
			_comp.add(new W.Div({x:0, y:662, width:1280, height:26, text:W.Texts["kids_noentry_2"], "letter-spacing" : "-0.85px",
				textColor:"rgba(181,181,181,0.75)", fontFamily:"RixHeadL", "font-size":"17px", textAlign:"center"}));
			this.add(_comp);
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
			}, 5000);
    	},
    	onStop: function() {
    		W.log.info("KidsNoentryPopup onStop");
			clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("KidsNoentryPopup onKeyPressed "+event.keyCode);
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