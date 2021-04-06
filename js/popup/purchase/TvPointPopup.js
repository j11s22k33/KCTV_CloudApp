/**
 * popup/TvPointPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton", "manager/TvPointDataManager"], function(util, buttonComp, tvPointDataManager) {
	'use strict';
	W.log.info("TvPointPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var isComplete = false;
	
	function create(){
		_comp.add(new W.Span({x:30, y:31, width:"674px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpoint_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:30, y:87, width:"674px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));		
		_comp.add(new W.Span({x:30, y:116, width:"674px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpoint_guide1"], textAlign:"center"}));
		_comp.add(new W.Span({x:30, y:140, width:"674px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpoint_guide2"], textAlign:"center"}));
		_comp.add(new W.Image({x:245, y:183, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		_comp.add(new W.Span({x:298, y:204, width:"60px", height:"18px", textColor:"rgba(131,122,119,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["payment_code"]}));
		_comp._code = new W.Span({x:368, y:204, width:"100px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_light", text:_this.paymentCode});
		_comp.add(_comp._code);
		_comp.add(new W.Div({x:30, y:264, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));		
		//_comp.add(new W.Image({x:30, y:267, width:"224px", height:"149px", src:"img/box_set244_input.png"}));
		//_comp.add(new W.Image({x:255, y:267, width:"224px", height:"149px", src:"img/box_set244_input.png"}));
		//_comp.add(new W.Image({x:480, y:267, width:"224px", height:"149px", src:"img/box_set244_input.png"}));
		
		_comp.add(new W.Span({x:115, y:291, width:"45px", height:"18px", textColor:"rgba(125,116,113,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:"STEP"}));
		_comp.add(new W.Span({x:339, y:291, width:"45px", height:"18px", textColor:"rgba(125,116,113,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:"STEP"}));
		_comp.add(new W.Span({x:563, y:291, width:"45px", height:"18px", textColor:"rgba(125,116,113,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:"STEP"}));
		_comp.add(new W.Span({x:159, y:290, width:"20px", height:"26px", textColor:"rgba(125,116,113,0.75)", "font-size":"24px", 
			className:"font_rixhead_bold", text:"1"}));
		_comp.add(new W.Span({x:383, y:290, width:"20px", height:"26px", textColor:"rgba(125,116,113,0.75)", "font-size":"24px", 
			className:"font_rixhead_bold", text:"2"}));
		_comp.add(new W.Span({x:607, y:290, width:"20px", height:"26px", textColor:"rgba(125,116,113,0.75)", "font-size":"24px", 
			className:"font_rixhead_bold", text:"3"}));
		
		_comp.add(new W.Span({x:33, y:321, width:"220px", height:"18px", textColor:"rgba(255,255,255,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_tvpoint_text1"], textAlign:"center"}));
		_comp.add(new W.Span({x:267, y:321, width:"200px", height:"18px", textColor:"rgba(255,255,255,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_tvpoint_text2"], textAlign:"center"}));
		_comp.add(new W.Span({x:472, y:321, width:"220px", height:"18px", textColor:"rgba(255,255,255,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_tvpoint_text3"], textAlign:"center"}));
		
		_comp.add(new W.Span({x:33, y:360, width:"220px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_tvpoint_text4"], textAlign:"center"}));
		_comp.add(new W.Span({x:472, y:360, width:"220px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_tvpoint_text5"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:30, y:416, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));	

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(231, 454, W.Texts["ok"], 133);
		_comp.btns[1] = buttonComp.create(372, 454, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.btns[0].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("TvPointPopup onStart");
    		W.CloseTimer.setPurchasePopup(true);
    		desc = _param;
    		_this = this;
    		
    		W.log.info("type ======== " + desc.type);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:273, y:108, width:"734px", height:"515px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		isComplete = false;
    		
    		var reqData = {};
    		reqData.param4 = desc.data.product.productId;
    		reqData.param5 = encodeURIComponent(desc.data.product.title);
    		reqData.param6 = desc.price;

//    		tvPointDataManager.createPaymentCode(function(result, data){
//				W.log.info(data);
//				_this.paymentCode = data.paymentCode;
//    			if(result && data.resultCode == "0000"){
//    				create();
//    				isComplete = true;
//    			}else{
//    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, error:data});
//    			}
//    		}, reqData);
    		if(desc.paymentCode){
    			_this.paymentCode = desc.paymentCode;
    			create();
				isComplete = true;
    		}else{
        		tvPointDataManager.createPaymentCode(function(result, data){
    				W.log.info(data);
    				_this.paymentCode = data.paymentCode;
        			if(result && data.resultCode == "0000"){
        				create();
        				isComplete = true;
        			}else{
        				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, error:data});
        			}
        		}, reqData);
    		}
    	},
    	onStop: function() {
    		W.log.info("TvPointPopup onStop");
    		W.CloseTimer.setPurchasePopup(false);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("TvPointPopup onKeyPressed "+event.keyCode);
    		if(!isComplete) return;
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(bIndex == 0){
    				var reqData = {param1:_this.paymentCode};
    				tvPointDataManager.confirmPayment(function(result, data){
    					W.log.info(data);
    	    			if(result){
//    	    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, data:data});
    	    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, data:data, paymentCode:_this.paymentCode});
    	    			}else{
    	    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, error:data});
    	    			}
    	    		}, reqData);
    			}else{
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
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