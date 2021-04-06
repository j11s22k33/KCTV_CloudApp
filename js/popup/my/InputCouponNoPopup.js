/**
 * popup/InputCouponNoPopup
 */
W.defineModule(["comp/PopupButton", "manager/CouponDataManager"], function(buttonComp, couponDataManager) {
	'use strict';
	W.log.info("InputCouponNoPopup");
	var _this;
	var _comp;
	var yIndex;
	var bIndex = 0;
	var couponNum;
	var desc;
	
	
	function create(){
		_comp.add(new W.Span({x:449-419, y:211-181, width:"383px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_coupon_input_title"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:449-419, y:267-181, width:"383px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		var guide = W.Texts["popup_coupon_input_guide1"].split("^");
		_comp.add(new W.Span({x:449-419, y:297-181, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide[0], textAlign:"center"}));
		_comp.add(new W.Span({x:449-419, y:297-181 + 24, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide[1], textAlign:"center"}));
		_comp.add(new W.Span({x:449-419, y:297-181 + 48, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_coupon_input_guide2"], textAlign:"center"}));
		
		_comp.add(new W.Image({x:518-419, y:388-181, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		_comp._foc = new W.Image({x:517-419, y:387-181, width:"246px", height:"58px", src:"img/box_set244_f.png"});
		_comp.add(_comp._foc);
		
		_comp._coupon = new W.Span({x:518-419, y:225, width:"244px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_light", text:"", textAlign:"center"});
		_comp.add(_comp._coupon);
		
		_comp.btns = [];
		_comp._btns = [];
		_comp.btns[0] = buttonComp.create(504-419, 479-181, W.Texts["ok"], 133);
		_comp.btns[1] = buttonComp.create(645-419, 479-181, W.Texts["cancel"], 133);
		_comp._btns[0] = _comp.btns[0].getComp();
		_comp._btns[1] = _comp.btns[1].getComp();
		_comp.add(_comp._btns[0]);
		_comp.add(_comp._btns[1]);
		_comp._btns[0].setStyle({opacity:0.4});
	};
	
	var focus = function(){
		if(yIndex == 0){
			_comp._list[index].setStyle({textColor:"rgb(255,255,255)"});
			_comp._list[index]._foc.setStyle({display:"block"});
		}else{
			_comp.btns[bIndex].focus();
		}
	};
	
	var unFocus = function(){
		if(yIndex == 0){
			_comp._list[index].setStyle({textColor:"rgb(181,181,181)"});
			_comp._list[index]._foc.setStyle({display:"none"});
		}else{
			_comp.btns[bIndex].unFocus();
		}
	};
	
	var setCouponNum = function(){
		if(yIndex == 0){
			_comp._coupon.setText(couponNum);
		}else{
			_comp._coupon.setText(couponNum);
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("InputCouponNoPopup onStart");
    		desc = _param.desc;

			W.CloudManager.addNumericKey();
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:418, y:181, width:"443px", height:"359px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		yIndex = 0;
    		bIndex = 0;
    		couponNum = "";
    		create();
    	},
    	onStop: function() {
    		W.log.info("InputCouponNoPopup onStop");
			W.CloudManager.delNumericKey();
    	},
    	onDestroy: function(){
			W.CloudManager.delNumericKey();
    	},
    	onKeyPressed : function(event) {
    		W.log.info("InputCouponNoPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				if(couponNum.length == 12){
    					_comp._foc.setStyle({display:"none"});
    					bIndex = 0;
    					yIndex = 1;
    					_comp._coupon.setStyle({textColor:"rgba(181,181,181,0.75)"});
    					_comp._coupon.setStyle({textColor:"rgb(255,255,255)"});
    					_comp.btns[bIndex].focus();
    				}
    			}else{
        			if(bIndex == 0){
						couponDataManager.registerManualCoupon(function(isSuccess, result){
							W.log.info(isSuccess, result)
							if(isSuccess) {
								if(result && result.RtnCode && result.RtnCode == "1000") {
									W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK});
								} else {
									W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, result:result});
								}
							} else {
								W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
							}

						},{ManualCouponID : couponNum});
        			}else{
            			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
        			}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				_comp._btns[0].setStyle({opacity:0.4});
    				couponNum = couponNum.substr(0, couponNum.length-1);
    				_comp._coupon.setText(couponNum);
    			}else{
					if(couponNum.length == 12){
						_comp.btns[bIndex].unFocus();
						bIndex = bIndex == 0 ? 1 : 0;
						_comp.btns[bIndex].focus();
					}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1){
					if(couponNum.length == 12){
						_comp.btns[bIndex].unFocus();
						bIndex = bIndex == 0 ? 1 : 0;
						_comp.btns[bIndex].focus();
					}
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				if(couponNum.length == 12){
    					_comp._foc.setStyle({display:"none"});
    					bIndex = 0;
    					yIndex = 1;
    					_comp._coupon.setStyle({textColor:"rgba(181,181,181,0.75)"});
    					_comp.btns[bIndex].focus();
    				} else {
						_comp._foc.setStyle({display:"none"});
						bIndex = 1;
						yIndex = 1;
						_comp._coupon.setStyle({textColor:"rgba(181,181,181,0.75)"});
						_comp.btns[bIndex].focus();
					}
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 1){
    				_comp._foc.setStyle({display:"block"});
					yIndex = 0;
					_comp._coupon.setStyle({textColor:"rgb(255,255,255)"});
					_comp.btns[bIndex].unFocus();
    			}
    			break;
    		case W.KEY.NUM_0:
    		case W.KEY.NUM_1:
    		case W.KEY.NUM_2:
    		case W.KEY.NUM_3:
    		case W.KEY.NUM_4:
    		case W.KEY.NUM_5:
    		case W.KEY.NUM_6:
    		case W.KEY.NUM_7:
    		case W.KEY.NUM_8:
    		case W.KEY.NUM_9:
    			if(yIndex == 0 && couponNum.length < 12){
    				couponNum += String(event.keyCode - 48);
    				_comp._coupon.setText(couponNum);
    				
    				if(couponNum.length == 12){
    					_comp._btns[0].setStyle({opacity:1});
    					_comp._foc.setStyle({display:"none"});
    					bIndex = 0;
    					yIndex = 1;
    					_comp._coupon.setStyle({textColor:"rgba(181,181,181,0.75)"});
    					_comp.btns[bIndex].focus();
    				}
    			}
    			break;
    		}
    	}
    });
});