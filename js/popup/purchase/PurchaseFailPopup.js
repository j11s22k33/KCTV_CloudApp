/**
 * popup/PurchaseFailPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("PurchaseFailPopup");
	var _this;
	var _comp;
	var desc;
	var bIndex = 0;
	var type;
	var paymentCode;
	
	function create(){
		_comp.add(new W.Span({x:30, y:30, width:"415px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_purchase_fail_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:30, y:85, width:"415px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));	
		
		_comp.add(new W.Span({x:30, y:101, width:"415px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:desc.product.title, textAlign:"center"}));
		
		_comp.add(new W.Span({x:30, y:147, width:"415px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_purchase_fail_guide1"], textAlign:"center"}));
		var guide = W.Texts["popup_purchase_fail_guide2"].split("^");
		_comp.add(new W.Span({x:30, y:171, width:"415px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:guide[0], textAlign:"center"}));
		_comp.add(new W.Span({x:30, y:195, width:"415px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:guide[1], textAlign:"center"}));
		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(101, 246, W.Texts["popup_purchase_fail_button"], 133);
		_comp.btns[1] = buttonComp.create(242, 246, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.btns[0].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("PurchaseFailPopup onStart");
    		desc = _param.data;
    		type = _param.type;
    		paymentCode = _param.paymentCode;
    		_this = this;
    		
    		W.log.info("type ======== " + type);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:403, y:207, width:"475px", height:"307px", className:"popup_comp_color popup_comp_border"});
    		bIndex = 0;
    		this.add(_comp);
    		create();
    	},
    	onStop: function() {
    		W.log.info("PurchaseFailPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("PurchaseFailPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, type:desc.type});
    			break;
    		case W.KEY.ENTER:
//    			W.PopupManager.closePopup(this, {action:bIndex == 0 ? W.PopupManager.ACTION_OK : W.PopupManager.ACTION_CLOSE, type:type});
    			W.PopupManager.closePopup(this, {action:bIndex == 0 ? W.PopupManager.ACTION_OK : W.PopupManager.ACTION_CLOSE, type:type, paymentCode:paymentCode});
    			break;
    		case W.KEY.LEFT:
    		case W.KEY.RIGHT:
    			_comp.btns[bIndex].unFocus();
    			bIndex = bIndex == 0 ? 1 : 0;
    			_comp.btns[bIndex].focus();
    			break;
    		}
    	}
    });
});