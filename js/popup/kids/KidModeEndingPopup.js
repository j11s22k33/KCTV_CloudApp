/**
 * popup/KidsModeEndingPopup
 */
W.defineModule(function() {
	'use strict';
	W.log.info("KidsModeEndingPopup");
	var _comp;
	var timeout;
	var _this;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("KidsModeEndingPopup onStart");
    		_this = this;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.5)"});
    		this.add(_comp);
    		_comp.add(new W.Image({x:389, y:277, width:641, height:217, src:"img/09_kidsmode_end.png"}));
    		
    		clearTimeout(timeout);
    		timeout = setTimeout(function(){
    			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
    		}, 5000);
    	},
    	onStop: function() {
    		W.log.info("KidsModeEndingPopup onStop");
    		clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("KidsModeEndingPopup onKeyPressed "+event.keyCode);
    		clearTimeout(timeout);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    		case W.KEY.ENTER:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				break;
    		}
    	}
    });
});