/**
 * popup/ZzimInfoPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("ZzimInfoPopup");
	var _this;
	var _comp;
	var index;
	var list;
	
	function create(){
		_comp.add(new W.Span({x:479-449, y:261-231, width:"323px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_zzim_info_title"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:479-449, y:316-231, width:"323px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		var guide = W.Texts["popup_zzim_info_guide"].split("^");
		_comp.add(new W.Span({x:479-449, y:348-231, width:"323px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide[0], textAlign:"center"}));
		
		_comp.add(new W.Span({x:479-449, y:348-231 + 24, width:"323px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide[1], textAlign:"center"}));
		
		_comp.btn = buttonComp.create(574-449, 429-231, W.Texts["ok"], 133);
		_comp.add(_comp.btn.getComp());
		_comp.btn.focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ZzimInfoPopup onStart");

    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:449, y:231, width:"383px", height:"259px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		index = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("ZzimInfoPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("ZzimInfoPopup onKeyPressed "+event.keyCode);
    		
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