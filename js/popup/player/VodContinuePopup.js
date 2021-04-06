/**
 * popup/VodContinuePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("VodContinuePopup");
	var _this;
	var _comp;
	var index;
	var desc;
	var popTimeout;
	
	function create(){
		_comp.add(new W.Span({x:433-403, y:248-219, width:"415px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium cut", text:desc.title, textAlign:"center"}));
		_comp.add(new W.Div({x:433-403, y:304-219, width:"415px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));		
		_comp.add(new W.Span({x:433-403, y:111, width:"415px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:W.Texts["popup_vod_continue_guide1"], textAlign:"center"}));
		var guide = W.Texts["popup_vod_continue_guide2"].split("^");
		_comp.add(new W.Span({x:433-403, y:366-219, width:"415px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:guide[0], textAlign:"center"}));
		_comp.add(new W.Span({x:433-403, y:366-219+24, width:"415px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:guide[1], textAlign:"center"}));
		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(433-403, 441-219, W.Texts["popup_vod_continue_button1"], 133);
		_comp.btns[1] = buttonComp.create(574-403, 441-219, W.Texts["popup_vod_continue_button2"], 133);
		_comp.btns[2] = buttonComp.create(715-403, 441-219, W.Texts["close"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.add(_comp.btns[2].getComp());
		_comp.btns[0].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("VodContinuePopup onStart");
    		desc = _param.desc;
    		_this = this;
    		
    		W.log.info("type ======== " + desc.type);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:403, y:219, width:"475px", height:"283px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		index = 0;
    		create();
    		
    		clearTimeout(popTimeout);
    		popTimeout = setTimeout(function(){
    			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, idx:0, desc:desc});
    		}, 1000 * 60 * 3);
    	},
    	onStop: function() {
    		clearTimeout(popTimeout);
    		W.log.info("VodContinuePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("VodContinuePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			clearTimeout(popTimeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:2, desc:desc});
    			break;
    		case W.KEY.ENTER:
    			clearTimeout(popTimeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:index, desc:desc});
    			break;
    		case W.KEY.LEFT:
    			_comp.btns[index].unFocus();
    			index = (--index + 3) % 3;
    			_comp.btns[index].focus();
    			break;
    		case W.KEY.RIGHT:
    			_comp.btns[index].unFocus();
    			index = (++index) % 3;
    			_comp.btns[index].focus();
    			break;
    		}
    	}
    });
});