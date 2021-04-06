/**
 * popup/TvPayConfirmPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("TvPayConfirmPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	
	function create(){
		_comp.add(new W.Span({x:30, y:30, width:"415px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpay_comfirm_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:30, y:85, width:"415px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		var num = desc.phoneNum.substr(0,3) + " - " + desc.phoneNum.substr(3,4) + " - " + desc.phoneNum.substr(7,4);
		if(desc.phoneNum.length == 10){
			num = desc.phoneNum.substr(0,3) + " - " + desc.phoneNum.substr(3,3) + " - " + desc.phoneNum.substr(6,4);
		}
		_comp.add(new W.Span({x:30, y:112, width:"415px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:num, textAlign:"center"}));
		
		_comp.add(new W.Span({x:30, y:147, width:"415px", height:"28px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpay_comfirm_guide1"], textAlign:"center"}));
		var guide = W.Texts["popup_tvpay_comfirm_guide2"].split("^");
		_comp.add(new W.Span({x:30, y:171, width:"415px", height:"28px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:guide[0], textAlign:"center"}));
		_comp.add(new W.Span({x:30, y:195, width:"415px", height:"28px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:guide[0], textAlign:"center"}));

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(30, 246, W.Texts["popup_mobile_confirm_button"], 133);
		_comp.btns[1] = buttonComp.create(171, 246, W.Texts["ok"], 133);
		_comp.btns[2] = buttonComp.create(312, 246, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.add(_comp.btns[2].getComp());
		_comp.btns[0].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("TvPayConfirmPopup onStart");
    		desc = _param;
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:403, y:207, width:"475px", height:"307px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("TvPayConfirmPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("TvPayConfirmPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
				if(bIndex == 0){
					_comp.btns[bIndex].unFocus();
					bIndex = 1;
					_comp.btns[bIndex].focus();
				}else if(bIndex == 1){
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
				}else{
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				}
    			break;
    		case W.KEY.LEFT:
    		case W.KEY.RIGHT:
    			_comp.btns[bIndex].unFocus();
				bIndex = (++bIndex) % 3;
				_comp.btns[bIndex].focus();
    			break;
    		}
    	}
    });
});