/**
 * popup/MobileInputPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton", "manager/MobilePurchaseDataManager"], function(util, buttonComp, mobilePurchaseDataManager) {
	'use strict';
	W.log.info("MobileInputPopup");
	var yIndex = 0;
	var index = 0;
	var totalPage = 0;
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var price;
	var barLength = 0;
	var birthTxt = "";
	var phoneTxt = "";
	var companies = ["SKT", "KT", "LGT", "KCT", "CJ헬로비전"];
	var tmpCount = 0;
	var type;
	var param;
	
	function create(){
		W.log.info(desc);
		W.log.info(param);
		if(type == "VOD"){
			_comp.add(new W.Span({x:30, y:29, width:"403px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium cut", text:desc.product.title, textAlign:"center"}));
			var now = new Date();
			var period = new Date(now.getTime() + desc.product.rentalPeriod.value * 60 * 60 * 24);
			var time = period.getFullYear() + "." + util.changeDigit(period.getMonth()+1, 2)+"."+util.changeDigit(period.getDate(), 2) + " " +
			util.changeDigit(period.getHours(),2)+":"+util.changeDigit(period.getMinutes(),2);
			time = W.Texts["until"].replace("@until@", time);
			_comp.add(new W.Span({x:30, y:68, width:"403px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_light", text:time, textAlign:"center"}));
			var _price = new W.Div({x:30, y:96, width:"403px", height:"24px", textAlign:"center"});
			_comp.add(_price);
			_comp._price = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(181,181,181)", "font-size":"22px", 
				className:"font_rixhead_bold", text:W.Util.formatComma(price, 3)});
			_price.add(_comp._price);
			_price.add(new W.Span({position:"relative", y:0, height:"17px", textColor:"rgb(181,181,181)", "font-size":"15px", 
				className:"font_rixhead_light", text:W.Texts["price_unit"] + " " + W.Texts["include_vat"]}));
		}else{
			_comp.add(new W.Span({x:30, y:113-83, width:"403px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium cut", text:W.Texts["purchase_coin"], textAlign:"center"}));
			_comp.add(new W.Span({x:30, y:158-83, width:"403px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_light", text:W.Texts["popup_mobile_input_guide1"], textAlign:"center"}));
			
			var period = "";
			if(param){
				if(param.isMonthly){
					period = W.Texts["popup_purchase_coin_guide2"];
				}else{
					W.log.info(param.offerPeriod);
					if(param.offerPeriod){
						W.log.info()
						if(param.offerPeriod.unit == "Y"){
							if(param.offerPeriod.value >= 200){
								period = W.Texts["popup_purchase_coin_guide5"];
							}else{
								period = W.Texts["popup_purchase_coin_guide6"].replace("@N@", param.offerPeriod.value);
							}
						}else if(param.offerPeriod.unit == "M"){
							period = W.Texts["popup_purchase_coin_guide7"].replace("@N@", param.offerPeriod.value);
						}else if(param.offerPeriod.unit == "D"){
							period = W.Texts["popup_purchase_coin_guide8"].replace("@N@", param.offerPeriod.value);
						}
					}
				}
			}else{
				period = W.Texts["popup_mobile_input_guide2"];
			}
			
			
			
			_comp.add(new W.Span({x:30, y:158-83+24, width:"403px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_light", text:period, textAlign:"center"}));
			
			_comp.add(new W.Div({x:439-409, y:223-83, width:"403px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp.add(new W.Span({x:438-409, y:245-83, width:"70px", height:"19px", textColor:"rgba(255,255,255,0.75)", "font-size":"17px", 
				className:"font_rixhead_light", text:W.Texts["amount_payment"]}));
			_comp.add(new W.Span({x:438-409, y:281-83, width:"70px", height:"19px", textColor:"rgba(255,255,255,0.75)", "font-size":"17px", 
				className:"font_rixhead_light", text:W.Texts["amount_coin"]}));
			
			var _price = new W.Div({x:602-409, y:243-83, width:"240px", height:"24px", textAlign:"right"});
			_comp.add(_price);
			_comp._price = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgba(255,255,255,0.9)", "font-size":"22px", 
				className:"font_rixhead_medium", text:W.Util.formatComma(price, 3)});
			_price.add(_comp._price);
			_price.add(new W.Span({position:"relative", y:0, height:"16px", textColor:"rgb(181,181,181)", "font-size":"14px", 
				className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"5px"}));
			_price.add(new W.Span({position:"relative", y:0, height:"16px", textColor:"rgba(181,181,181,0.75)", "font-size":"14px", 
				className:"font_rixhead_medium", text:W.Texts["include_vat"], "padding-left":"10px"}));
			
			var bonusAmt = desc.coin.totalAmt - price;
			var _coin = new W.Div({x:602-409, y:279-83, width:"240px", height:"24px", textAlign:"right"});
			_comp.add(_coin);
			_comp._coin = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(237,168,2)", "font-size":"22px", 
				className:"font_rixhead_medium", text:W.Util.formatComma(desc.coin.totalAmt, 3)});
			_coin.add(_comp._coin);
			_coin.add(new W.Span({position:"relative", y:0, height:"16px", textColor:"rgb(181,181,181)", "font-size":"14px", 
				className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"5px"}));
			_coin.add(new W.Span({position:"relative", y:0, height:"16px", textColor:"rgb(218,188,116)", "font-size":"14px", 
				className:"font_rixhead_medium", text:W.Texts["popup_mobile_input_text"].replace("3,000", W.Util.formatComma(bonusAmt,3)), "padding-left":"10px"}));
			
			_comp.add(new W.Div({x:439-409, y:316-83, width:"403px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		}

		_comp._guide2 = new W.Span({x:20, y:(type=="VOD" ? 140:342-83), width:"423px", height:"20px", textColor:"rgba(227,84,46,0.9)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_mobile_input_guide3"], display:"none", textAlign:"center"});
		_comp.add(_comp._guide2);
		_comp._guide = new W.Span({x:20, y:(type=="VOD" ? 140:342-83), width:"423px", height:"20px", textColor:"rgba(255,255,255,0.9)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_mobile_input_guide4"], textAlign:"center"});
		_comp.add(_comp._guide);
		
		
		
		
		_comp.add(new W.Span({x:30, y:(type=="VOD" ? 193:398-83), width:"85px", height:"19px", textColor:"rgba(255,255,255,0.9)", "font-size":"17px", 
			className:"font_rixhead_light", text:W.Texts["mobile_company"]}));
		_comp.add(new W.Span({x:30, y:(type=="VOD" ? 250:455-83), width:"85px", height:"19px", textColor:"rgba(255,255,255,0.9)", "font-size":"17px", 
			className:"font_rixhead_light", text:W.Texts["mobile_number"]}));
		_comp.add(new W.Span({x:30, y:(type=="VOD" ? 305:510-83), width:"85px", height:"19px", textColor:"rgba(255,255,255,0.9)", "font-size":"17px", 
			className:"font_rixhead_light", text:W.Texts["birth_day"]}));
		
		_comp.add(new W.Image({x:121, y:(type=="VOD" ? 182:384-83), width:"312px", height:"45px", src:"img/box_set312.png"}));
		_comp.add(new W.Image({x:121, y:(type=="VOD" ? 238:440-83), width:"100px", height:"45px", src:"img/box_set100.png"}));
		_comp.add(new W.Image({x:227, y:(type=="VOD" ? 238:440-83), width:"100px", height:"45px", src:"img/box_set100.png"}));
		_comp.add(new W.Image({x:333, y:(type=="VOD" ? 238:440-83), width:"100px", height:"45px", src:"img/box_set100.png"}));
		_comp.add(new W.Image({x:121, y:(type=="VOD" ? 293:496-83), width:"162px", height:"45px", src:"img/box_set162.png"}));
		_comp.add(new W.Image({x:121+186, y:(type=="VOD" ? 293:496-83), width:"45px", height:"45px", src:"img/box_set45.png"}));
		_comp.add(new W.Div({x:290, y:(type=="VOD" ? 293:496-83)+22, width:"10px", height:"2px", backgroundColor:"rgb(87,82,80)"}));
		_comp.add(new W.Span({x:336, y:(type=="VOD" ? 305:510-83)-15, width:"100px", height:"25px", textColor:"rgba(131,122,119,0.75)", "font-size":"25px", 
			className:"font_rixhead_light", text:"......", textAlign:"center"}));
		
		
		_comp._company = [];
		for(var i=0; i < companies.length; i++){
			_comp._company[i] = new W.Span({x:121, y:(type=="VOD" ? 195:397-83), width:"312px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
				className:"font_rixhead_medium", text:companies[i], display:i == 0 ? "block":"none", textAlign:"center"});
			_comp.add(_comp._company[i]);
		}
		_comp._birth_guide = new W.Span({x:121, y:(type=="VOD" ? 308:510-83), width:"165px", height:"16px", textColor:"rgba(131,122,119,0.75)", "font-size":"14px", 
			className:"font_rixhead_light", text:W.Texts["popup_mobile_input_guide5"], textAlign:"center"});
		_comp.add(_comp._birth_guide);
		_comp._birth1 = new W.Span({x:121, y:(type=="VOD" ? 307:509-83), width:"164px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._birth1);
		
		_comp._birth2 = new W.Span({x:121+186, y:(type=="VOD" ? 307:509-83), width:"47px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._birth2);
		
		_comp._phone1 = new W.Span({x:121, y:(type=="VOD" ? 251:453-83), width:"100px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._phone1);
		_comp._phone2 = new W.Span({x:227, y:(type=="VOD" ? 251:453-83), width:"100px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._phone2);
		_comp._phone3 = new W.Span({x:333, y:(type=="VOD" ? 251:453-83), width:"100px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._phone3);
		
		_comp._foc_company = new W.Div({x:120, y:(type=="VOD" ? 181:383-83), width:"314px", height:"47px", display:"none"});
		_comp.add(_comp._foc_company);
		_comp._foc_company.add(new W.Image({x:0, y:0, width:"314px", height:"47px", src:"img/box_set312_f.png"}));
		_comp._foc_company.add(new W.Image({x:17, y:18, width:"9px", height:"11px", src:"img/box_f_arr_l.png"}));
		_comp._foc_company.add(new W.Image({x:289, y:18, width:"9px", height:"11px", src:"img/box_f_arr_r.png"}));
		
		_comp._foc_phone1 = new W.Image({x:120, y:(type=="VOD" ? 237:439-83), width:"102px", height:"47px", src:"img/box_set100_f.png", display:"none"});
		_comp.add(_comp._foc_phone1);
		_comp._foc_phone2 = new W.Image({x:226, y:(type=="VOD" ? 237:439-83), width:"102px", height:"47px", src:"img/box_set100_f.png", display:"none"});
		_comp.add(_comp._foc_phone2);
		_comp._foc_phone3 = new W.Image({x:332, y:(type=="VOD" ? 237:439-83), width:"102px", height:"47px", src:"img/box_set100_f.png", display:"none"});
		_comp.add(_comp._foc_phone3);
		
		_comp._foc_birth1 = new W.Image({x:120, y:(type=="VOD" ? 292:495-83), width:"164px", height:"47px", src:"img/box_set162_f.png", display:"none"});
		_comp.add(_comp._foc_birth1);
		
		_comp._foc_birth2 = new W.Image({x:120+186, y:(type=="VOD" ? 292:495-83), width:"47px", height:"47px", src:"img/box_set45_f.png", display:"none"});
		_comp.add(_comp._foc_birth2);
		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(95, (type=="VOD" ? 374:576-83), W.Texts["popup_mobile_input_button"], 133);
		_comp.btns[1] = buttonComp.create(236, (type=="VOD" ? 374:576-83), W.Texts["cancel"], 133);
		_comp._btn = _comp.btns[0].getComp();
		_comp._btn.setStyle({opacity:0.4});
		_comp.add(_comp._btn);
		_comp.add(_comp.btns[1].getComp());
		
		focus();
	};

	var checkComplete = function(){
		if(phoneTxt.length > 9 && birthTxt.length == 7){
			_comp._btn.setStyle({opacity:1});
			return true;
		}else{
			_comp._btn.setStyle({opacity:0.4});
			return false;
		}
	};
	
	var focus = function(isBack){
		if(yIndex == 0){
			_comp._foc_company.setStyle({display:"block"});
			for(var i=0; i < _comp._company.length; i++){
				_comp._company[i].setStyle({display:i==index ? "block" : "none"});
			}
		}else if(yIndex == 1){
			if(phoneTxt.length < 4){
				_comp._foc_phone1.setStyle({display:"block"});
				_comp._foc_phone2.setStyle({display:"none"});
				_comp._foc_phone3.setStyle({display:"none"});
			}else if(phoneTxt.length < 7){
				_comp._foc_phone1.setStyle({display:"none"});
				_comp._foc_phone2.setStyle({display:"block"});
				_comp._foc_phone3.setStyle({display:"none"});
			}else{
				_comp._foc_phone1.setStyle({display:"none"});
				_comp._foc_phone2.setStyle({display:"none"});
				_comp._foc_phone3.setStyle({display:"block"});
			}
			
			_comp._phone1.setText(phoneTxt.substr(0,3));
			if(phoneTxt.length == 11){
				_comp._phone2.setText(phoneTxt.substr(3,4));
				_comp._phone3.setText(phoneTxt.substr(7,4));
				if(!isBack){
					unFocus();
					yIndex++;
					focus();
				}
			}else{
				_comp._phone2.setText(phoneTxt.substr(3,3));
				_comp._phone3.setText(phoneTxt.substr(6,4));
			}
		}else if(yIndex == 2){
			if(birthTxt.length > 0){
				_comp._birth_guide.setStyle({display:"none"});
			}else{
				_comp._birth_guide.setStyle({display:"block"});
			}
			
			if(birthTxt.length >= 6){
				_comp._foc_birth1.setStyle({display:"none"});
				_comp._foc_birth2.setStyle({display:"block"});
				_comp._birth1.setText(birthTxt.slice(0,6));
				_comp._birth2.setText(birthTxt.slice(6));
			}else{
				_comp._foc_birth1.setStyle({display:"block"});
				_comp._foc_birth2.setStyle({display:"none"});
				_comp._birth1.setText(birthTxt.slice(0,6));
				_comp._birth2.setText("");
			}
			
			if(birthTxt.length == 7 && !isBack){
				unFocus();
				yIndex++;
				if(checkComplete()){
					bIndex = 0;
				}else{
					bIndex = 1;
				}
				focus();
			}
		}else if(yIndex == 3){
			if(bIndex == 0){
				_comp.btns[0].focus();
				_comp.btns[1].unFocus();
			}else{
				_comp.btns[1].focus();
				_comp.btns[0].unFocus();
			}
		}
		checkComplete();
	};
	
	var unFocus = function(){
		if(yIndex == 0){
			_comp._foc_company.setStyle({display:"none"});
		}else if(yIndex == 1){
			_comp._foc_phone1.setStyle({display:"none"});
			_comp._foc_phone2.setStyle({display:"none"});
			_comp._foc_phone3.setStyle({display:"none"});
		}else if(yIndex == 2){
			_comp._foc_birth1.setStyle({display:"none"});
			_comp._foc_birth2.setStyle({display:"none"});
		}else if(yIndex == 3){
			_comp.btns[bIndex].unFocus();
		}
	};
	
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("MobileInputPopup onStart");
    		desc = _param.contents;
    		price = _param.price;
    		type = _param.type;
    		param = _param.param;
    		_this = this;
    		W.log.info(desc);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		if(type == "VOD"){
    			_comp = new W.Div({x:409, y:143, width:"463px", height:"435px", className:"popup_comp_color popup_comp_border"});
    		}else if(type == "COIN"){
    			_comp = new W.Div({x:409, y:83, width:"463px", height:"554px", className:"popup_comp_color popup_comp_border"});
    		}
    		
    		if(!util.isExistScene("PurchaseVodScene")){
    			W.CloudManager.addNumericKey();
    		}
    		
    		this.add(_comp);
    		yIndex = 0;
    		index = 0;
    		bIndex = 0;
    		birthTxt = "";
    		phoneTxt = "";
    		tmpCount = 0;
    		
    		create();
    	},
    	onStop: function() {
    		W.log.info("MobileInputPopup onStop");
    		if(!util.isExistScene("PurchaseVodScene")){
    			W.CloudManager.delNumericKey();
    		}
    	},
    	onKeyPressed : function(event) {
    		W.log.info(yIndex + " MobileInputPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				unFocus();
    				yIndex = 1;
    				focus(true);
    			}else if(yIndex == 1){
    				if(phoneTxt.length >= 10){
    					unFocus();
        				yIndex = 2;
        				focus(true);
    				}
    			}else if(yIndex == 2){
    				if(birthTxt.length >= 7){    					
    					unFocus();
        				yIndex = 3;
        				if(checkComplete()){
        					bIndex = 0;
        				}else{
        					bIndex = 1;
        				}
        				focus(true);
    				}
    			}else if(yIndex == 3){
        			if(bIndex == 0){
        				var reqData = {};
        				reqData.LGD_OID = W.StbConfig.accountId + util.getDateFormat("yyyyMMddHHmmss");
        				reqData.LGD_AMOUNT = price;
        				reqData.LGD_MOBILECOM = index+1;
        				reqData.LGD_MOBILENUM = phoneTxt;
        				reqData.LGD_MOBILESSN = birthTxt;
        				reqData.LGD_PRODUCTINFO = desc.product.productId;

        				mobilePurchaseDataManager.requestCertification(function(result, data){
        					W.PopupManager.closePopup(_this, {
            					action:W.PopupManager.ACTION_OK,
            					result:result,
            					data:data,
            					reqData:reqData
            				});
        				}, reqData);
        			}else{
        				W.PopupManager.closePopup(this, {
        					action:W.PopupManager.ACTION_CLOSE
        				});
        			}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 0){
    				index = (++index) % companies.length;
    				focus();
    			}else if(yIndex == 3){
    				if(checkComplete()){
    					bIndex = bIndex ? 0 : 1;
    					focus();
    				}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				index = (--index + companies.length) % companies.length;
    				focus();
    			}else if(yIndex == 1){
    				phoneTxt = phoneTxt.substr(0, phoneTxt.length-1);
    				focus();
    			}else if(yIndex == 2){
    				birthTxt = birthTxt.substr(0, birthTxt.length-1);
    				focus();
    			}else if(yIndex == 3){
    				if(checkComplete()){
    					bIndex = bIndex ? 0 : 1;
    					focus();
    				}
    			}
    			break;
    		case W.KEY.UP:
    			W.log.info("yIndex ===== " + yIndex);
    			if(yIndex > 0){
    				unFocus();
    				yIndex--;
    				focus(true);
    				W.log.info("yIndex22 ===== " + yIndex);
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				unFocus();
    				yIndex++;
    				focus(true);
    			}else if(yIndex == 1){
    				unFocus();
    				yIndex++;
    				focus(true);
    			}else if(yIndex == 2){
    				unFocus();
    				yIndex++;
    				if(checkComplete()){
    					bIndex = 0;
    				}else{
    					bIndex = 1;
    				}
    				focus(true);
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
    			if(yIndex == 1){
    				phoneTxt += String(event.keyCode - 48);
    				focus();
    			}else if(yIndex == 2){
    				birthTxt += String(event.keyCode - 48);
    				focus();
    			}
    			break;
    		}
    		checkComplete();
    	}
    });
});