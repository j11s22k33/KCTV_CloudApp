/**
 * popup/TermsPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("TermsPopup");
	var index = 0;
	var totalPage = 0;
	var bIndex = 0;
	var bIndexOld = 0;
	var _this;
	var _comp;
	var desc;
	var barLength = 0;
	
	function isSubscribed(product){
		if(product.productType == "CHTRSS" || product.productType == "CHNMSS" || product.productType == "VDCTSS" || 
				product.productType == "BDCHSS" || product.productType == "BDNNSS"){
			return true;
		}
		return false;
	};
	
	function setPrice(product){
		if(_comp._price){
			_comp._price_area.remove(_comp._price);
		}
		_comp._price = new W.Div({x:0, y:0, width:"674px", height:"24px", textAlign:"center"});
		_comp._price_area.add(_comp._price);
		
		var price = util.getPrice(product);
		var listPrice = util.vatPrice(product.listPrice);
		
		if(price == listPrice){
			_comp._price.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(181,181,181)", "font-size":"18px", 
				className:"font_rixhead_light", text:W.Texts["vat"], "padding-left":"10px", "padding-right":"10px"}));
			var priceText = "";
			if(isSubscribed(product)){
				priceText = W.Texts["unit_month"] + " " + W.Util.formatComma(price, 3) + W.Texts["price_unit"];
			}else{
				priceText = W.Util.formatComma(price, 3) + W.Texts["price_unit"];
			}
			_comp._price.add(new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
				className:"font_rixhead_medium", text:priceText, "padding-left":"10px", "padding-right":"10px"}));
		}else{
			if(price == 0){
				var priceText;
				if(isSubscribed(product)){
					if(product.coupons){
						priceText = 1 + W.Texts["unit_month_until"];
    					if(product.coupons[0].discountPeriod){
    						priceText = product.coupons[0].discountPeriod.value + "";
    						if(product.coupons[0].discountPeriod.unit == "Y"){
    							priceText += W.Texts["unit_year"];
    						}else if(product.coupons[0].discountPeriod.unit == "D"){
    							priceText += W.Texts["unit_date"];
    						}else{
    							priceText += W.Texts["unit_month_until"]
    						}
    					}
    				}
					priceText += (priceText ? " " : "") + W.Texts["price_free"];
				}
				_comp._price.add(new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
					className:"font_rixhead_medium", text:priceText, "padding-left":"10px", "padding-right":"10px"}));
			}else{
				_comp._price.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(181,181,181)", "font-size":"18px", 
					className:"font_rixhead_light", text:W.Texts["vat"], "padding-left":"10px", "padding-right":"10px"}));
				_comp._price.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(181,181,181)", "font-size":"18px", 
					className:"font_rixhead_light strike", text:W.Util.formatComma(listPrice, 3) + W.Texts["price_unit"]}));
				var priceText;
				if(isSubscribed(product)){
					priceText = W.Texts["unit_month"] + " " + W.Util.formatComma(price, 3) + W.Texts["price_unit"];
				}else{
					priceText = W.Util.formatComma(price, 3) + W.Texts["price_unit"];
				}
				_comp._price.add(new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
					className:"font_rixhead_medium", text:priceText, "padding-left":"10px", "padding-right":"10px"}));
				var discountText;
				if(product.coupons[0].amount.unit == "rate"){
					discountText = W.Texts["discount2"].replace("@price@", product.coupons[0].amount.value);
				}else{
					discountText = W.Texts["discount"].replace("@price@", W.Util.formatComma(product.coupons[0].amount.value, 3));
				}
				_comp._price.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgb(218,188,116)", "font-size":"14px", 
					className:"font_rixhead_light", text:discountText, "padding-left":"3px", "padding-right":"3px"}))
			}
		}
	};
	
	function create(){
		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
			_comp._title = new W.Span({x:50, y:26, width:"674px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium", text:desc.title, textAlign:"center"});
		}else{
			_comp._title = new W.Span({x:50, y:30, width:"674px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium", text:desc.title, textAlign:"center"});
		}
		_comp.add(_comp._title);
		
		
		
		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
			_comp._price_area = new W.Div({x:50, y:85, width:"674px", height:"24px"});
			_comp.add(_comp._price_area);
			setPrice(desc.product);
		}
		
		
		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
			_comp.add(new W.Div({x:50, y:131, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp.add(new W.Div({x:50, y:390, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp._scr = new W.Div({x:752, y:131, width:"3px", height:"262px", display:"none"});
		}else{
			_comp.add(new W.Div({x:50, y:87, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp.add(new W.Div({x:50, y:346, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp._scr = new W.Div({x:752, y:87, width:"3px", height:"262px", display:"none"});
		}

		_comp.add(_comp._scr);
		_comp._scr.add(new W.Div({x:1, y:0, width:"1px", height:"262px", backgroundColor:"rgba(131,122,119,0.25)"}));
		_comp._bar = new W.Div({x:0, y:0, width:"3px", height:"90px", backgroundColor:"rgb(131,122,119)"});
		_comp._scr.add(_comp._bar);
		
		_comp._btn_area = new W.Div({x:50, y:425, width:"674px", height:"133px", textAlign:"center"});
		_comp.add(_comp._btn_area);
		
		_comp.btns = [];
		_comp.btnsType = [];
		if(desc.type == "MONTHLY_INFO"){
			var no = 0;
			_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["join"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
			_comp.btnsType[no] = "JOIN";
			_comp._btn_area.add(_comp.btns[no].getComp());
			no++;
			
			_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["close"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
			_comp.btnsType[no] = "CLOSE";
			_comp._btn_area.add(_comp.btns[no].getComp());
		}else if(desc.type == "PRODUCT_INFO"){
			var no = 0;
			if(desc.product){
				if(desc.product.bundleProduct && !desc.product.bundleProduct.purchase && !desc.product.isPurchased){
					var btnTitle = desc.product.bundleProduct.title + " " + W.Texts["join"];
					var titleLength = util.geTxtLength(btnTitle, "RixHeadM", 20) + 40;

					_comp.btns[no] = buttonComp.create("relative", 0, btnTitle, titleLength > 133 ? titleLength : 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN_BUNDLE";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}
				if(desc.product.purchase || desc.product.isPurchased){
					if(desc.product.configuration && desc.product.configuration.categories){
						_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["going"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
						_comp.btnsType[no] = "GOING";
						_comp._btn_area.add(_comp.btns[no].getComp());
						no++;
					}
					
					if(desc.product.isCanCancel && W.StbConfig.enableSubsCancelBtn){
						var btnTitle = W.Texts["popup_pin_close_subscription"];
						var titleLength = util.geTxtLength(btnTitle, "RixHeadM", 16) + 30;
						_comp.btns[no] = buttonComp.create("relative", 0, btnTitle, titleLength > 133 ? titleLength : 133, undefined, {"padding":"3px", "display":"inline-flex"});
						_comp.btnsType[no] = "CANCEL";
						_comp._btn_area.add(_comp.btns[no].getComp());
						no++;
					}
				}else{
					_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["join"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}
			}else{
				if(desc.isPurchased){
					if(desc.isCanCancel && W.StbConfig.enableSubsCancelBtn){
						_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["popup_pin_close_subscription"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
						_comp.btnsType[no] = "CANCEL";
						_comp._btn_area.add(_comp.btns[no].getComp());
						no++;
					}
				}else{
					_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["join"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}
			}
			
			_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["close"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
			_comp.btnsType[no] = "CLOSE";
			_comp._btn_area.add(_comp.btns[no].getComp());
		}else if(desc.type == "CH_TR_INFO"){
			var no = 0;
			if(desc.hasChannel){
				_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["prod_detail"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
				_comp.btnsType[no] = "DETAIL";
				_comp._btn_area.add(_comp.btns[no].getComp());
				no++;
				
				if(desc.product.bundleProduct && !desc.product.bundleProduct.purchase && !desc.product.isPurchased){
					var btnTitle = desc.product.bundleProduct.title + " " + W.Texts["join"];
					var titleLength = util.geTxtLength(btnTitle, "RixHeadM", 20) + 40;

					_comp.btns[no] = buttonComp.create("relative", 0, btnTitle, titleLength > 133 ? titleLength : 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN_BUNDLE";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}
				
				if(desc.product.purchase || desc.product.isPurchased){
					if(desc.product.configuration && desc.product.configuration.channels){
						_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["going"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
						_comp.btnsType[no] = "GOING";
						_comp._btn_area.add(_comp.btns[no].getComp());
						no++;
					}
					
					if(desc.product.isCanCancel && W.StbConfig.enableSubsCancelBtn){
						var btnTitle = W.Texts["popup_pin_close_subscription"];
						var titleLength = util.geTxtLength(btnTitle, "RixHeadM", 16) + 30;
						_comp.btns[no] = buttonComp.create("relative", 0, btnTitle, titleLength > 133 ? titleLength : 133, undefined, {"padding":"3px", "display":"inline-flex"});
						_comp.btnsType[no] = "CANCEL";
						_comp._btn_area.add(_comp.btns[no].getComp());
						no++;
					}
				}else{
					_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["join"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}

				_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["close"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
				_comp.btnsType[no] = "CLOSE";
				_comp._btn_area.add(_comp.btns[no].getComp());
			}else{
				
				if(desc.product.bundleProduct && !desc.product.bundleProduct.purchase && !desc.product.isPurchased){
					var btnTitle = desc.product.bundleProduct.title + " " + W.Texts["join"];
					var titleLength = util.geTxtLength(btnTitle, "RixHeadM", 20) + 40;

					_comp.btns[no] = buttonComp.create("relative", 0, btnTitle, titleLength > 133 ? titleLength : 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN_BUNDLE";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}
				
				if(desc.product.purchase || desc.product.isPurchased){
					if(desc.product.isCanCancel && W.StbConfig.enableSubsCancelBtn){
						var btnTitle = W.Texts["popup_pin_close_subscription"];
						var titleLength = util.geTxtLength(btnTitle, "RixHeadM", 16) + 30;
						_comp.btns[no] = buttonComp.create("relative", 0, btnTitle, titleLength > 133 ? titleLength : 133, undefined, {"padding":"3px", "display":"inline-flex"});
						_comp.btnsType[no] = "CANCEL";
						_comp._btn_area.add(_comp.btns[no].getComp());
						no++;
					}
				}else{
					_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["join"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
					_comp.btnsType[no] = "JOIN";
					_comp._btn_area.add(_comp.btns[no].getComp());
					no++;
				}
				
				_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["close"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
				_comp.btnsType[no] = "CLOSE";
				_comp._btn_area.add(_comp.btns[no].getComp());
			}
		}else if(desc.type == "MONTHLY_TERMS" || desc.type == "TERM_TERMS"){
			_comp.btns[0] = buttonComp.create("relative", -41, W.Texts["ok"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
			_comp.btnsType[0] = "OK";
			_comp._btn_area.add(_comp.btns[0].getComp());
		}else if(desc.type == "MOBILE_TERMS" || desc.type == "TVPAY_TERMS"){
			_comp.btns[0] = buttonComp.create("relative", -41, W.Texts["agree"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
			_comp.btnsType[0] = "JOIN";
			_comp._btn_area.add(_comp.btns[0].getComp());
			_comp.btns[1] = buttonComp.create("relative", -41, W.Texts["agree_not"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
			_comp.btnsType[1] = "CLOSE";
			_comp._btn_area.add(_comp.btns[1].getComp());
		}
		
		if(desc.type == "PRODUCT_INFO" && desc.product && desc.product.bundleProduct && !desc.product.bundleProduct.purchase){
			bIndex = 1;
		}
		_comp.btns[bIndex].focus();
		var top = 111;
		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
			top = 160;
		}
		var image;
		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
			if(desc.product && desc.product.images){
				for(var i=0; i < desc.product.images.length; i++){
					if(desc.product.images[i].type == "00"){
						image = W.Config.IMAGE_URL + desc.product.images[i].path;
						break;
					}
				}
			}
		}
		
		if(image){
			_comp._sysnop = new W.Image({x:50, y:top-14, width:"674px", height:"245px", src:image});
			_comp.add(_comp._sysnop);
			totalPage = 1;
		}else{
			_comp._sysnop = new W.Div({x:50, y:top, width:"674px", height:"220px", overflow:"hidden"});
			_comp.add(_comp._sysnop);
			_comp._sysnop._text = new W.Span({x:0, y:0, width:"674px", "font-size":"19px", textColor:"rgb(181,181,181)", 
				className:"font_rixhead_light", "white-space":"pre-wrap", "line-height":"1.5em"});
			_comp._sysnop.add(_comp._sysnop._text);
			_comp._sysnop._text.setText(desc.description ? desc.description : "");
			_comp._sysnop.height = _comp._sysnop._text.comp.offsetHeight;

			totalPage = Math.ceil(_comp._sysnop.height / 210);
			if(totalPage > 1){
				_comp._scr.setStyle({display:"block"});
				barLength = 262/totalPage;
				_comp._bar.setStyle({height:barLength + "px"});
			}
		}
	};

	
	var focusBtn = function(){
		_comp.btns[bIndexOld].unFocus();
		_comp.btns[bIndex].focus();
		
		if(desc.type == "PRODUCT_INFO" && desc.product){
			if(_comp.btnsType[bIndex] == "JOIN_BUNDLE"){
				_comp._sysnop._text.setText(desc.product.bundleProduct.description ? desc.product.bundleProduct.description : "");
				_comp._title.setText(desc.product.bundleProduct.title);
				setPrice(desc.product.bundleProduct);
			}else if(_comp.btnsType[bIndex] == "JOIN" || _comp.btnsType[bIndex] == "GOING" || _comp.btnsType[bIndex] == "CANCEL"){
				if(_comp._sysnop._text){
					_comp._sysnop._text.setText(desc.product.description ? desc.product.description : "");
				}
				_comp._title.setText(desc.product.title);
				setPrice(desc.product);
			}
			if(_comp._sysnop._text){
				_comp._sysnop.height = _comp._sysnop._text.comp.offsetHeight;
				totalPage = Math.ceil(_comp._sysnop.height / 210);
				if(totalPage > 1){
					_comp._scr.setStyle({display:"block"});
					barLength = 262/totalPage;
					_comp._bar.setStyle({height:barLength + "px"});
				}
			}
		}
		
	};
	
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("TermsPopup onStart");
    		desc = _param;
    		W.log.info(_param);
    		W.log.info("type ======== " + desc.type);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
    			_comp = new W.Div({x:253, y:116, width:"774px", height:"489px", className:"popup_comp_color popup_comp_border"});
    		}else{
    			_comp = new W.Div({x:253, y:138, width:"774px", height:"445px", className:"popup_comp_color popup_comp_border"});
    		}
    		
    		this.add(_comp);
    		index = 0;
    		bIndex = 0;
    		totalPage = 0;
    		barLength = 0;
    		
    		if(desc.type == "MONTHLY_INFO" || desc.type == "PRODUCT_INFO" || desc.type == "CH_TR_INFO"){
    			if(desc.product){
    				var reqData = {productId: desc.product.productId, selector:"@detail"};
    				var sdpDataManager = W.getModule("manager/SdpDataManager");
    				sdpDataManager.getProductDetail(function(result, data){
    					if(result){
    						desc.product.posterUrl = data.data[0].posterUrl;
    						desc.product.images = data.data[0].images;
    					}
            			create();
    				}, reqData);
    			}else{
        			create();
    			}
    		}else{
    			this.uiPlfDataManager = W.getModule("manager/UiPlfDataManager");
        		var reqData = {agreeId:""};
        		
    			if(desc.type == "MONTHLY_TERMS"){
        			reqData.agreeId = "A010";
        		}else if(desc.type == "TERM_TERMS"){
        			reqData.agreeId = "A020";
        		}else if(desc.type == "MOBILE_TERMS"){
        			reqData.agreeId = "A030";
        		}else if(desc.type == "TVPAY_TERMS"){
        			reqData.agreeId = "A040";
        		}else if(desc.type == "COIN_TERMS"){
        			reqData.agreeId = "A050";
        		}
    			
    			this.uiPlfDataManager.getAgreement(function(result, data){
        			desc.title = data.title;
        			desc.description = data.description;
        			if(desc.product){
        				var reqData = {productId: desc.product.productId, selector:"@detail"};
        				var sdpDataManager = W.getModule("manager/SdpDataManager");
        				sdpDataManager.getProductDetail(function(result, data){
        					if(result){
        						desc.product = data.data[0];
        					}
                			create();
        				}, reqData);
        			}else{
            			create();
        			}
        		}, reqData);
    		}
    		
    		
    	},
    	onStop: function() {
    		W.log.info("TermsPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("TermsPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, type:desc.type});
    			break;
    		case W.KEY.ENTER:
    			var action = 0;
//    			if(desc.type == "CH_TR_INFO"){
//    				action = bIndex == 2 ? W.PopupManager.ACTION_CLOSE : W.PopupManager.ACTION_OK;
//    			}else if(desc.type == "PRODUCT_INFO"){
//    				if(desc.isPurchased && !desc.isCanCancel){
//    					action = W.PopupManager.ACTION_CLOSE;
//    				}else{
//        				action = bIndex == 0 ? W.PopupManager.ACTION_OK : W.PopupManager.ACTION_CLOSE;
//    				}
//    			}else{
//    				action = bIndex == 0 ? W.PopupManager.ACTION_OK : W.PopupManager.ACTION_CLOSE;
//    			}
    			if(_comp.btnsType[bIndex] == "CLOSE"){
    				action = W.PopupManager.ACTION_CLOSE;
    			}else{
    				action = W.PopupManager.ACTION_OK;
    			}
    			W.PopupManager.closePopup(this, {
					action:action,
					idx:bIndex, 
					type:desc.type, 
					contents:desc.contents, 
					buttonType:_comp.btnsType[bIndex],
					product:desc.product
				});
    			break;
    		case W.KEY.RIGHT:
    			bIndexOld = bIndex;
    			bIndex = (++bIndex) % _comp.btns.length;
    			focusBtn();
    			break;
    		case W.KEY.LEFT:
    			bIndexOld = bIndex;
    			bIndex = (--bIndex + _comp.btns.length) % _comp.btns.length;
    			focusBtn();
    			break;
    		case W.KEY.UP:
    			index = (--index + totalPage) % totalPage;
    			if(_comp._sysnop._text) _comp._sysnop._text.setStyle({y:-index * 224});
    			_comp._bar.setStyle({y:index * barLength});
    			break;
    		case W.KEY.DOWN:
    			index = (++index) % totalPage;
    			if(_comp._sysnop._text) _comp._sysnop._text.setStyle({y:-index * 224});
    			_comp._bar.setStyle({y:index * barLength});
    			break;
    		}
    	}
    });
});