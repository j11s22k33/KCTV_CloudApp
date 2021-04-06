W.defineModule([ "mod/Util", "comp/Button"], function(util, buttonComp) {

	function PurchaseInfoComp(_parent){
		var _comp;
		var buttons = [];
		var index = 0;
		var password = "";
		var isComplete = false;
		var isPinMode = true;
		var totalPrice = 0;
		var wrongCount = 0;
		var oldPaymentType;
		
		this.getComp = function(){
			_comp = new W.Div({x:0, y:0, width:"370px", height:"720px"});
			
			_comp._title_area = new W.Div({x:0, y:104, width:"370px", height:"70px"});
			_comp.add(_comp._title_area);
			_comp._title1 = new W.Span({x:0, y:0, width:"330px", height:"33px", textColor:"rgb(255,255,255)", 
    			"font-size":"30px", className:"font_rixhead_medium", text:""});
			_comp._title_area.add(_comp._title1);
			_comp._title2 = new W.Span({x:0, y:35, width:"300px", height:"33px", textColor:"rgb(255,255,255)", 
    			"font-size":"30px", className:"font_rixhead_medium cut", text:""});
			_comp._title_area.add(_comp._title2);
			
			_comp._info_area = new W.Div({x:0, y:156, width:"370px", height:"480px"});
			_comp.add(_comp._info_area);
			
			_comp._prod_type = new W.Span({x:0, y:0, width:"310px", height:"20px", textColor:"rgb(161,181,221)",
    			"font-size":"18px", className:"font_rixhead_medium", text:""});
			_comp._info_area.add(_comp._prod_type);
			_comp._prod_duration = new W.Span({x:0, y:185-156, width:"310px", height:"20px", textColor:"rgb(161,181,221)",
    			"font-size":"18px", className:"font_rixhead_medium", text:""});
			_comp._info_area.add(_comp._prod_duration);
			
			_comp._info_area.add(new W.Image({x:2, y:224-156, width:"298px", height:"2px", src:"img/pay_dashed_line.png"}));
			_comp._info_area.add(new W.Image({x:2, y:346-156, width:"298px", height:"2px", src:"img/pay_dashed_line.png"}));
			
			_comp._title_1 = new W.Span({x:0, y:248-156, width:"150px", height:"20px", textColor:"rgb(181,181,181)", 
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["product_price"]});
			_comp._info_area.add(_comp._title_1);
			_comp._title_2 = new W.Span({x:0, y:277-156, width:"150px", height:"20px", textColor:"rgb(181,181,181)", 
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["product_default_price"]});
			_comp._info_area.add(_comp._title_2);
			_comp._title_3 = new W.Span({x:0, y:307-156, width:"150px", height:"20px", textColor:"rgb(181,181,181)", 
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["product_discount_price"]});
			_comp._info_area.add(_comp._title_3);
			
			_comp._prod_price = new W.Span({x:100, y:248-156, width:"200px", height:"20px", textColor:"rgb(131,122,119)", textAlign:"right",
    			"font-size":"18px", className:"font_rixhead_light", text:""});
			_comp._info_area.add(_comp._prod_price);
			_comp._prod_default_discount = new W.Span({x:100, y:277-156, width:"200px", height:"20px", textColor:"rgb(131,122,119)", textAlign:"right",
    			"font-size":"18px", className:"font_rixhead_light", text:""});
			_comp._info_area.add(_comp._prod_default_discount);
			_comp._prod_discount = new W.Span({x:100, y:307-156, width:"200px", height:"20px", textColor:"rgb(131,122,119)", textAlign:"right",
    			"font-size":"18px", className:"font_rixhead_light", text:""});
			_comp._info_area.add(_comp._prod_discount);
			
			_comp._title_3 = new W.Span({x:0, y:217, width:"100px", height:"20px", textColor:"rgb(255,255,255)", 
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["product_total_price"]});
			_comp._info_area.add(_comp._title_3);
			
			var _price = new W.Div({x:100, y:369-156, width:"240px", height:"18px", textAlign:"right"});
			_comp._info_area.add(_price);
			
			var texts = W.Texts["product_purchase_price"].split("@");
			for(var i=0; i < texts.length; i++){
				if(texts[i] == "price"){
					_comp._purchase_price = new W.Span({position:"relative", y:0, height:"26px", display:"inline", textColor:"rgb(237,168,2)",
		    			"font-size":"24px", className:"font_rixhead_bold", text:"", "padding-right":"3px"});
					_price.add(_comp._purchase_price);
				}else{
					_price.add(new W.Span({position:"relative", y:0, height:"20px", display:"inline", textColor:"rgb(181,181,181)",
		    			"font-size":"18px", className:"font_rixhead_light", text:texts[i], "padding-right":"3px"}));
				}
			}
			
			_comp._info_guide = new W.Div({x:0, y:0, width:"370px", height:"480px", display:"none"});
			_comp._info_area.add(_comp._info_guide);
			
			_comp._guide_coupon = new W.Div({x:-9, y:309, width:"320px", height:"170px", display:"none"});
			
			var purchaseGuideTexts = W.Texts["purchase_guide7"].split("^");
			_comp._guide_purchase = new W.Div({x:-9, y:440, width:"320px", height:"170px"});
			_comp._info_guide.add(_comp._guide_purchase);
			_comp._guide_purchase.add(new W.Span({x:0, y:0, width:"320px", height:"20px", textColor:"rgb(131,122,119)",
    			"font-size":"18px", className:"font_rixhead_light", text:purchaseGuideTexts[0], textAlign:"center"}));
			_comp._guide_purchase.add(new W.Span({x:0, y:W.StbConfig.menuLanguage == "ENG" ? 41 : 24, width:"320px", height:"20px", textColor:"rgb(131,122,119)",
    			"font-size":"18px", className:"font_rixhead_light", text:purchaseGuideTexts[1], textAlign:"center"}));
			
			_comp._guide_mobile = new W.Div({x:-9, y:309, width:"320px", height:"170px", display:"none"});
			_comp._info_guide.add(_comp._guide_mobile);
			_comp._guide_mobile.add(new W.Span({x:0, y:0, width:"320px", height:"20px", textColor:"rgb(237,168,2)",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide1"], textAlign:"center"}));
			_comp._guide_mobile.add(new W.Span({x:0, y:24, width:"320px", height:"20px", textColor:"rgb(131,122,119)",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide2"], textAlign:"center"}));
			
			_comp._guide_tvpay = new W.Div({x:-9, y:309, width:"320px", height:"170px", display:"none"});
			_comp._info_guide.add(_comp._guide_tvpay);
			_comp._guide_tvpay.add(new W.Span({x:0, y:0, width:"320px", height:"20px", textColor:"rgb(237,168,2)",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide5"], textAlign:"center"}));
			_comp._guide_tvpay.add(new W.Span({x:0, y:24, width:"320px", height:"20px", textColor:"rgb(131,122,119)",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide2"], textAlign:"center"}));
//			_comp._guide_tvpay.add(new W.Span({x:0, y:(W.StbConfig.menuLanguage == "ENG") ? 66 : 48, width:"320px", height:"20px", textColor:"rgb(237,168,2)",
//    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide6"], textAlign:"center"}));
			
			_comp._guide_tvpoint = new W.Div({x:-9, y:309, width:"320px", height:"170px", display:"none"});
			_comp._info_guide.add(_comp._guide_tvpoint);
			_comp._guide_tvpoint.add(new W.Span({x:0, y:0, width:"320px", height:"20px", textColor:"rgb(237,168,2)",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide3"], textAlign:"center"}));
			_comp._guide_tvpoint.add(new W.Span({x:0, y:24, width:"320px", height:"20px", textColor:"rgb(131,122,119)",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide2"], textAlign:"center"}));

			if(W.StbConfig.availableCheckIn){
				_comp._guide_bill = new W.Div({x:-8, y:455-156, width:"250px", height:"220px"});
				_comp._info_guide.add(_comp._guide_bill);
				
				_comp._guide_bill.add(new W.Span({x:0, y:0, width:"320px", height:"20px", textColor:"rgb(237,168,2)",
	    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["purchase_guide8"], textAlign:"center"}));

				_comp._guide_bill._foc = buttonComp.create(89, 50, W.Texts["purchase_guide9"], 143);
				_comp._guide_bill.add(_comp._guide_bill._foc.getComp());
			}else{
				_comp._guide_bill = new W.Div({x:26, y:455-156, width:"250px", height:"220px"});
				_comp._info_guide.add(_comp._guide_bill);
				
				if(W.StbConfig.menuLanguage == "ENG"){
					_comp._guide_bill._guide = new W.Div({x:-6, y:0, width:"360px", height:"20px"});
					_comp._guide_bill.add(_comp._guide_bill._guide);
					_comp._guide_bill._guide.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(237,168,2)",
		    			"font-size":"18px", className:"font_rixhead_medium", text:W.Texts["purchase"], display:"inline-block", "padding-right":"3px"}));
					_comp._guide_bill._guide.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgba(131,122,119,0.75)",
		    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["pin_insert_guide"], display:"inline-block"}));
				}else{
					_comp._guide_bill._guide = new W.Div({x:-6, y:0, width:"250px", height:"20px"});
					_comp._guide_bill.add(_comp._guide_bill._guide);
					_comp._guide_bill._guide.add(new W.Span({x:0, y:0, width:"35px", height:"20px", textColor:"rgb(237,168,2)",
		    			"font-size":"18px", className:"font_rixhead_medium", text:W.Texts["purchase"]}));
					_comp._guide_bill._guide.add(new W.Span({x:32, y:0, width:"232px", height:"20px", textColor:"rgba(131,122,119,0.75)",
		    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["pin_insert_guide"]}));
				}
				
				_comp._guide_bill._wrong = new W.Div({x:0, y:-22, width:"250px", height:"20px", display:"none"});
				_comp._guide_bill.add(_comp._guide_bill._wrong);
				var wrongTexts = W.Texts["pin_wrong_guide"].split("^");
				_comp._guide_bill._wrong.add(new W.Span({x:-20, y:0, width:"290px", height:"20px", textColor:"rgb(227,84,46)",
	    			"font-size":"18px", className:"font_rixhead_medium", text:wrongTexts[0], textAlign:"center"}));
				_comp._guide_bill._wrong.add(new W.Span({x:-20, y:22, width:"290px", height:"20px", textColor:"rgb(227,84,46)",
	    			"font-size":"18px", className:"font_rixhead_medium", text:wrongTexts[1], textAlign:"center"}));

				_comp._guide_bill.add(new W.Image({x:3, y:488-455, width:"244px", height:"56px", src:"img/box_set244.png"}));
				_comp._guide_bill._foc = new W.Image({x:2, y:487-455, width:"246px", height:"58px", src:"img/box_set244_f.png", display:"none"});
				_comp._guide_bill.add(_comp._guide_bill._foc);
				_comp._guide_bill._password = new W.Span({x:0, y:510-455, width:"250px", height:"24px", textColor:"rgb(255,255,255)",
	    			"font-size":"26px", className:"font_rixhead_extrabold", text:"", textAlign:"center"});
				_comp._guide_bill.add(_comp._guide_bill._password);
				
				_comp._guide_bill._wrong_guide = new W.Span({x:-20, y:0, width:"290px", height:"20px", textColor:"rgba(181,181,181,0.75)", display:"none",
	    			"font-size":"18px", className:"font_rixhead_medium", text:W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER, textAlign:"center"});
				_comp._guide_bill.add(_comp._guide_bill._wrong_guide);
			}

			return _comp;
		};
		
		this.changeInfoGuide = function(guideType){
			if(guideType){
				oldPaymentType = guideType;
				isPinMode = false;
				_comp._guide_mobile.setStyle({display:"none"});
				_comp._guide_coupon.setStyle({display:"none"});
				_comp._guide_bill.setStyle({display:"none"});
				_comp._guide_tvpay.setStyle({display:"none"});
				_comp._guide_tvpoint.setStyle({display:"none"});
				if(guideType == "coupon"){
					_comp._guide_coupon.setStyle({display:"block"});
				}else if(guideType == "bill"){
					isPinMode = true;
					_comp._guide_bill.setStyle({display:"block"});
				}else if(guideType == "mobile"){
					_comp._guide_mobile.setStyle({display:"block"});
				}else if(guideType == "tvpay"){
					_comp._guide_tvpay.setStyle({display:"block"});
				}else if(guideType == "tvpoint"){
					_comp._guide_tvpoint.setStyle({display:"block"});
				}
				_comp._info_guide.setStyle({display:"block"});
			}else{
				_comp._info_guide.setStyle({display:"none"});
			}
		};
		
		this.changeTitle = function(title){
			var txts = util.geTxtArray(title, "RixHeadM", 30, 280, 1);
			_comp._title1.setText(txts[0]);
			if(txts.length > 1){
				_comp._title2.setText(txts[1]);
				_comp._title2.setStyle({display:"block"});
				_comp._info_area.setStyle({y:191});
			}else{
				_comp._title2.setStyle({display:"none"});
				_comp._info_area.setStyle({y:156});
			}
		};
		
		this.changePurchaseOption = function(text){
			_comp._prod_type.setText(text);
		};

		this.disablePurchaseOption = function(){
			_comp._prod_type.setStyle({display:"none"});
		};
		
		this.changeDuration = function(type, product){
			var text;
			if(type == "M" || type == "T"){
				text = W.Texts["unit_subscribed"];
			}else if(type == "V"){
				if(product.rentalPeriod.value == 999 || product.productType.indexOf("LF") > 0){ 
					text = W.Texts["detail_rental_duration_lifetime"];
				}else{
					text = product.rentalPeriod.value + W.Texts["unit_date"] + " " + W.Texts["viewable"];
				}
			}else{
				text = "";
			}
			_comp._prod_duration.setText(text);
		};

		this.changePrice = function(discountPrice){
			W.log.info("discountPrice == " + discountPrice);
			var price = 0;
			var defaultPrice = 0;
			price = util.vatPrice(_parent.purchaseValue.product.listPrice);
			_comp._prod_price.setText(W.Util.formatComma(price, 3) + " " + W.Texts["price_unit"]);
			totalPrice = price;
			W.log.info("totalPrice == " + totalPrice);
			
			if(_parent.purchaseValue.product.coupons){
				for(var i=0; i < _parent.purchaseValue.product.coupons.length; i++){
					if(_parent.purchaseValue.product.coupons[i]){
						if(_parent.purchaseValue.product.coupons[i].amount.unit == "rate"){
							defaultPrice += totalPrice * (_parent.purchaseValue.product.coupons[i].amount.value / 100); 
							totalPrice -= totalPrice * (_parent.purchaseValue.product.coupons[i].amount.value / 100); 
						}else{
							defaultPrice += _parent.purchaseValue.product.coupons[i].amount.value; 
							totalPrice -= _parent.purchaseValue.product.coupons[i].amount.value; 

							W.log.info("defaultPrice == " + defaultPrice);

							W.log.info("totalPrice == " + totalPrice);
						}
					}
				}
			}else{
				if(_parent.purchaseValue.agreement && _parent.purchaseValue.agreement.code != "NONE"){
					if(_parent.purchaseValue.agreement.discountAmt > 0){
						defaultPrice += _parent.purchaseValue.agreement.discountAmt;
						totalPrice -= _parent.purchaseValue.agreement.discountAmt;
					}
					if(_parent.purchaseValue.agreement.discountRate > 0){
						defaultPrice += totalPrice * (100 - _parent.purchaseValue.agreement.discountRate) / 100;
						totalPrice = totalPrice * (100 - _parent.purchaseValue.agreement.discountRate) / 100;
					}
				}
			}
			
			if(discountPrice){
				totalPrice -= discountPrice;
			}else{
				discountPrice = 0;
			}
			if(totalPrice > price){
				totalPrice = price;
			}
			_comp._prod_default_discount.setText("- " + W.Util.formatComma(defaultPrice, 3) + " " + W.Texts["price_unit"]);
			_comp._prod_discount.setText("- " + W.Util.formatComma(discountPrice, 3) + " " + W.Texts["price_unit"]);
			_comp._purchase_price.setText(W.Util.formatComma(totalPrice, 3));
			
			return totalPrice;
		};
		
		this.getPrice = function(){
			return totalPrice;
		};
		
		this.operate = function(event){
			var isConsume = false;
			if(event.keyCode >= 48 && event.keyCode <= 57 && index == 0 && password.length < 4){
				var num = String(event.keyCode - 48);
				password = password + num;
				
				var star = "";
				for(var i=0; i < password.length; i++){
					if(i == 0){
						star = "*";
					}else{
						star = star + " *";
					}
				}
				_comp._guide_bill._password.setText(star);
				if(password.length == 4){
					W.CloudManager.authPin(function(data){
						if(data && data.data == "OK") {
							isComplete = true;
							_comp._guide_bill._wrong.setStyle({display:"none"});
							_comp._guide_bill._guide.setStyle({display:"block"});
							_comp._guide_bill._wrong_guide.setStyle({display:"none"});
							_parent.purchase();
						} else {
							wrongCount++;
							if(wrongCount > 4){
								_comp._guide_bill._wrong.setStyle({y:-46});
								_comp._guide_bill._wrong_guide.setStyle({display:"block"});
							}
							_comp._guide_bill._password.setText("");
							password = "";
							_comp._guide_bill._wrong.setStyle({display:"block"});
							_comp._guide_bill._guide.setStyle({display:"none"});
						}
					}, password, false);
				}
				isConsume = true;
			}else{
				switch (event.keyCode) {
	            case W.KEY.UP:
					unFocus();
	            	index = (--index + 3) % 3;
	            	if((index == 1 && !isComplete) || (index == 0 && isComplete)){
	            		index = (--index + 3) % 3;
	            	}
					focus();
    				isConsume = true;
	            	break;
	            case W.KEY.DOWN:
					unFocus();
	            	index = (++index) % 3;
	            	if(index == 1 && !isComplete || (index == 0 && isComplete)){
	            		index = (++index) % 3;
	            	}
					focus();
    				isConsume = true;
	            	break;
	            case W.KEY.DELETE:
	            case W.KEY.LEFT:
	            	if(password.length > 0){
	            		password = password.substr(0, password.length-1);
	    				
	    				var star = "";
	    				for(var i=0; i < password.length; i++){
	    					if(i == 0){
	    						star = "*";
	    					}else{
	    						star = star + " *";
	    					}
	    				}
	    				_comp._guide_bill._password.setText(star);
	    				isConsume = true;
	            	}else{
	    				isConsume = false;
	            	}
	            	break;
	            case W.KEY.ENTER:
	            	if(W.StbConfig.availableCheckIn){
	            		_parent.purchase();
	    			}else{
	    				if(!isPinMode){
		            		_parent.backScene();
		    				if(_parent.param.callback){
		    					_parent.param.callback({result:"BACK"});
	                    	}
		            	}
	    			}
	            	
    				isConsume = true;
	            	break;
				}
			}
			return isConsume;
		};

		this.focus = function(isReset){
			index = 0;
			focus();
			if(_parent.comps.length > 0){
				_comp._guide_purchase.setStyle({display:""});
			}else{
				_comp._guide_purchase.setStyle({display:"none"});
			}
			this.changeInfoGuide("bill");
		};
		
		this.unFocus = function(isShow, isReset){
			unFocus();
			this.changeInfoGuide("oldPaymentType");
			index = 0;
			password = "";
			if(!W.StbConfig.availableCheckIn){
				_comp._guide_bill._password.setText("");
				_comp._guide_bill._wrong.setStyle({display:"none"});
				_comp._guide_bill._guide.setStyle({display:"block"});
			}
			isComplete = false;
			
			if(!isPinMode){
//				_comp._phone_purchase.btn.unFocus();
			}
		};

		function focus(){
			if(W.StbConfig.availableCheckIn){
				_comp._guide_bill._foc.focus();
			}else{
				_comp._guide_bill._foc.setStyle({display:"block"});
			}
//			_comp._phone_purchase.btn.focus();
		};
		
		function unFocus(){
			if(W.StbConfig.availableCheckIn){
				_comp._guide_bill._foc.unFocus();
			}else{
				_comp._guide_bill._foc.setStyle({display:"none"});
			}
//			_comp._phone_purchase.btn.unFocus();
		};
	};

	return PurchaseInfoComp;
});