/**
 * popup/TvPayQrCodePopup
 */
W.defineModule(["comp/PopupButton", "mod/Util", "manager/TvPayDataManager"], function(buttonComp, util, tvPayDataManager) {
	'use strict';
	W.log.info("TvPayQrCodePopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var url;
	var orderNo;
	
	function create(){
		_comp.add(new W.Span({x:392-362, y:170-139, width:"496px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpay_qrcode_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:392-362, y:225-139, width:"496px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		_comp.add(new W.Span({x:392-362, y:251-139, width:"496px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpay_qrcode_guide1"], textAlign:"center"}));
		_comp.add(new W.Span({x:392-362, y:251-139 + 24, width:"496px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpay_qrcode_guide2"], textAlign:"center"}));
		_comp.add(new W.Span({x:392-362, y:338, width:"496px", height:"18px", textColor:"rgb(220,220,0)", "font-size":"17px", 
			className:"font_rixhead_bold", text:W.Texts["popup_tvpay_qrcode_guide3"], textAlign:"center"}));
		
		_comp._qrcode = new W.Div({x:208, y:180, width:"140px", height:"140px", backgroundColor:"rgb(255,255,255)"});
		_comp.add(_comp._qrcode);
		util.createQrCode(_comp._qrcode, 140, url);

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(503-362, 521-139, W.Texts["ok"], 133);
		_comp.btns[1] = buttonComp.create(644-362, 521-139, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.btns[0].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("TvPayQrCodePopup onStart");
    		W.CloseTimer.setPurchasePopup(true);
    		url = _param.url;
    		orderNo = _param.orderNo;
    		_this = this;
    		W.log.info(url);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:362, y:139, width:"556px", height:"443px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("TvPayQrCodePopup onStop");
    		W.CloseTimer.setPurchasePopup(false);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("TvPayQrCodePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
				if(bIndex == 0){
					tvPayDataManager.approvePayment(function(result, data){
						W.log.info(result);
						W.log.info(data);
//						if(data.result == "0000"){
//		    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, data:data});
//						}else{
//		    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, error:data});
//						}
						if(result){
		    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, data:data});
						}else{
		    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, error:data});
						}
					},{orderNo:orderNo});
				}else{
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				}
    			break;
    		case W.KEY.LEFT:
    		case W.KEY.RIGHT:
    			_comp.btns[bIndex].unFocus();
				bIndex = (++bIndex) % 2;
				_comp.btns[bIndex].focus();
    			break;
    		}
    	}
    });
});