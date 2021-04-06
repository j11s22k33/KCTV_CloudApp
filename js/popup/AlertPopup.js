/**
 * popup/AlertPopup
 */
W.defineModule(["comp/PopupButton"], function(Button) {
	'use strict';
	W.log.info("AlertPopup");
	var _comp;
	var timeout;
	var _this;
	var type;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("AlertPopup onStart");
    		W.log.info(_param);
    		_this = this;
    		type = _param.type;
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size popup_bg_color popup_bg_flex"});
    		this.add(_comp);

			_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
    		_comp.add(_comp._popup);

			_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:85, text:_param.title, lineHeight:"85px", className:"cut",
				"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"27px"});
			_comp._popup.add(_comp._popup._title);

			_comp._popup.add(new W.Div({x:0,y:84,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));

			_comp._popup._boldText = new W.Div({position:"relative", "max-width":"800px", text:_param.boldText,
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadM", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", textColor:"#FFFFFF", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"15px"});
			_comp._popup.add(_comp._popup._boldText);

			_comp._popup._thinText = new W.Div({position:"relative", "max-width":"800px", text:_param.thinText,
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px", marginBottom:"15px"});
			_comp._popup.add(_comp._popup._thinText);

			clearTimeout(timeout);
			timeout = setTimeout(function(){
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, type:type});
			}, 5000);
    	},
    	onStop: function() {
    		W.log.info("AlertPopup onStop");
			clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("AlertPopup onKeyPressed "+event.keyCode);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    		case W.KEY.ENTER:
				clearTimeout(timeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, type:type});
				break;
    		}
    	}
    });
});