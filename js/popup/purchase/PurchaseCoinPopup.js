/**
 * popup/PurchaseCoinPopup
 */
W.defineModule(["comp/PopupButton","mod/Util"], function(buttonComp,util) {
	'use strict';
	W.log.info("PurchaseCoinPopup");
	var _this;
	var _comp;
	var yIndex;
	var bIndex = 0;
	var pinNumber;
	var desc;
	
	
	function create(){
		_comp.add(new W.Span({x:439-409, y:164-134, width:"403px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:desc.isMonthly ? W.Texts["purchase_coin_monthly"] : W.Texts["purchase_coin"], textAlign:"center"}));
		
		_comp.add(new W.Span({x:439-409, y:208-134, width:"403px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
			className:"font_rixhead_light", text:W.Texts["popup_purchase_coin_guide1"], textAlign:"center"}));
		
		var period = "";
		if(desc.isMonthly){
			period = W.Texts["popup_purchase_coin_guide2"];
		}else{
			W.log.info(desc.offerPeriod);
			if(desc.offerPeriod){
				if(desc.offerPeriod.unit == "Y"){
					if(desc.offerPeriod.value >= 200){
						period = W.Texts["popup_purchase_coin_guide5"];
					}else{
						period = W.Texts["popup_purchase_coin_guide6"].replace("@N@", desc.offerPeriod.value);
					}
				}else if(desc.offerPeriod.unit == "M"){
					period = W.Texts["popup_purchase_coin_guide7"].replace("@N@", desc.offerPeriod.value);
				}else if(desc.offerPeriod.unit == "D"){
					period = W.Texts["popup_purchase_coin_guide8"].replace("@N@", desc.offerPeriod.value);
				}
			}
		}
		
		_comp.add(new W.Span({x:439-409, y:208-134+24, width:"403px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
			className:"font_rixhead_light", text:period, textAlign:"center"}));
		
		_comp.add(new W.Div({x:439-409, y:274-134, width:"403px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		_comp.add(new W.Span({x:438-409, y:294-134, width:"100px", height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
			className:"font_rixhead_light", text:W.Texts["amount_payment"]}));
		_comp.add(new W.Span({x:438-409, y:330-134, width:"100px", height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
			className:"font_rixhead_light", text:W.Texts["amount_coin"]}));
		
		var _price = new W.Div({x:602-409, y:294-134, width:"240px", height:"24px", textAlign:"right"});
		_comp.add(_price);
		_price.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgba(181,181,181,0.75)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["include_vat"], "padding-right":"10px"}));
		_comp._price = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgba(255,255,255,0.9)", "font-size":"22px", 
			className:"font_rixhead_medium", text:W.Util.formatComma(util.vatPrice(desc.price), 3)});
		_price.add(_comp._price);
		_price.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(181,181,181)", "font-size":"18px", 
			className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"5px"}));
		
		var bonusAmt = desc.coin.totalAmt - util.vatPrice(desc.price);
		var _coin = new W.Div({x:602-409, y:330-134, width:"240px", height:"24px", textAlign:"right"});
		_comp.add(_coin);
		_comp._coin = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(237,168,2)", "font-size":"22px", 
			className:"font_rixhead_medium", text:W.Util.formatComma(desc.coin.totalAmt, 3)});
		_coin.add(_comp._coin);
		_coin.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(181,181,181)", "font-size":"18px", 
			className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"5px"}));
		_coin.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(218,188,116)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_mobile_input_text"].replace("3,000",  W.Util.formatComma(bonusAmt, 3)), "padding-left":"10px"}));
		
		_comp.add(new W.Div({x:439-409, y:367-134, width:"403px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		_comp._pin_guide = new W.Span({x:439-409, y:393-134, width:"403px", height:"20px", textColor:"rgba(255,255,255,0.9)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_purchase_coin_guide4"], textAlign:"center"});
		_comp.add(_comp._pin_guide);
		
		_comp._wrong = new W.Div({x:439-409, y:248, width:"403px", height:"20px", display:"none"});
		_comp.add(_comp._wrong);
		var wrongTexts = W.Texts["pin_wrong_guide"].split("^");
		_comp._wrong.add(new W.Span({x:0, y:0, width:"403px", height:"20px", textColor:"rgb(227,84,46)",
			"font-size":"18px", className:"font_rixhead_medium", text:wrongTexts[0], textAlign:"center"}));
		_comp._wrong.add(new W.Span({x:0, y:22, width:"403px", height:"20px", textColor:"rgb(227,84,46)",
			"font-size":"18px", className:"font_rixhead_medium", text:wrongTexts[1], textAlign:"center"}));
		
		
		_comp.add(new W.Image({x:519-409, y:435-134, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		_comp._foc = new W.Image({x:518-409, y:434-134, width:"246px", height:"58px", src:"img/box_set244_f.png"});
		_comp.add(_comp._foc); 
		
		_comp._stars = new W.Span({x:519-409, y:452-134, width:"244px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_extrabold", text:"", textAlign:"center"});
		_comp.add(_comp._stars);

		_comp.btns = [];
		_comp._btns = [];
		_comp.btns[0] = buttonComp.create(504-409, 526-134, W.Texts["ok"], 133);
		_comp.btns[1] = buttonComp.create(645-409, 526-134, W.Texts["cancel"], 133);
		_comp._btns[0] = _comp.btns[0].getComp();
		_comp._btns[1] = _comp.btns[1].getComp();
		_comp._btns[0].setStyle({opacity:0.4});
		_comp.add(_comp._btns[0]);
		_comp.add(_comp._btns[1]);
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
			_comp._list[index].setStyle({textColor:"rgb(134,134,134)"});
			_comp._list[index]._foc.setStyle({display:"none"});
		}else{
			_comp.btns[bIndex].unFocus();
		}
	};
	
	var setCouponNum = function(){
		var txt = "";
		for(var i=0; i < pinNumber.length; i++){
			if(i == 0){
				txt += "*";
			}else{
				txt += " *";
			}
		}
		_comp._stars.setText(txt);
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("PurchaseCoinPopup onStart");
    		desc = _param.desc;

			W.log.info(desc)
    		
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:409, y:134, width:"463px", height:"453px", className:"popup_comp_color popup_comp_border"});

			W.CloudManager.addNumericKey();
    		this.add(_comp);
    		yIndex = 0;
    		bIndex = 0;
    		pinNumber = "";
    		create();
    	},
    	onStop: function() {
    		W.log.info("PurchaseCoinPopup onStop");
			W.CloudManager.delNumericKey();
    	},
    	onKeyPressed : function(event) {
    		W.log.info("PurchaseCoinPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				if(pinNumber.length == 4){
    					_comp._foc.setStyle({display:"none"});
    					bIndex = 0;
    					yIndex = 1;
    					_comp._stars.setStyle({textColor:"rgba(134,134,134,0.75)"});
    					_comp._stars.setStyle({textColor:"rgb(255,255,255)"});
    					_comp.btns[bIndex].focus();
    				}
    			}else{
        			if(bIndex == 0){
        				W.CloudManager.authPin(function(data){
    						if(data && data.data == "OK") {
    							_comp._wrong.setStyle({display:"none"});
    							_comp._pin_guide.setStyle({display:"block"});
    							W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK});
    						} else {
    							pinNumber = "";
    							setCouponNum();
    							_comp._wrong.setStyle({display:"block"});
    							_comp._pin_guide.setStyle({display:"none"});
    							_comp._btns[0].setStyle({opacity:0.4});
    							_comp.btns[bIndex].unFocus();
    							bIndex = 1;
    							_comp._foc.setStyle({display:"block"});
    							yIndex = 0;
    							_comp._stars.setStyle({textColor:"rgb(255,255,255)"});
    						}
    					}, pinNumber, false);
        			}else{
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
        			}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				pinNumber = pinNumber.substr(0, pinNumber.length-1);
    				setCouponNum();
    				if(pinNumber.length < 4){
    					_comp._btns[0].setStyle({opacity:0.4});
    				}
    			}else{
    				if(pinNumber.length == 4){
        				_comp.btns[bIndex].unFocus();
            			bIndex = bIndex == 0 ? 1 : 0;
            			_comp.btns[bIndex].focus();
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1 && pinNumber.length == 4){
    				_comp.btns[bIndex].unFocus();
        			bIndex = bIndex == 0 ? 1 : 0;
        			_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				_comp._foc.setStyle({display:"none"});
    				if(pinNumber.length == 4){
    					bIndex = 0;
    				}else{
    					bIndex = 1;
    				}
					yIndex = 1;
					_comp._stars.setStyle({textColor:"rgba(134,134,134,0.75)"});
					_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 1){
    				_comp._foc.setStyle({display:"block"});
					yIndex = 0;
					_comp._stars.setStyle({textColor:"rgb(255,255,255)"});
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
    			if(yIndex == 0 && pinNumber.length < 12){
    				pinNumber += String(event.keyCode - 48);
    				setCouponNum();
    				
    				if(pinNumber.length == 4){
    					_comp._foc.setStyle({display:"none"});
    					bIndex = 0;
    					yIndex = 1;
    					_comp._stars.setStyle({textColor:"rgba(134,134,134,0.75)"});
    					_comp.btns[bIndex].focus();
    					_comp._btns[0].setStyle({opacity:1});
    				}else{
    					_comp._btns[0].setStyle({opacity:0.4});
    				}
    			}
    			break;
    		}
    	}
    });
});