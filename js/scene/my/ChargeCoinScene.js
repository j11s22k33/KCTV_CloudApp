/**
 * scene/ChargeCoinScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/CouponInfo", "comp/purchase/PurchaseComp", "manager/CouponDataManager"],
    function(util, couponInfoComp, purchaseComp, couponDataManager) {
        var index = 0;
        var index2 = 0;
        var yIndex = 0;

        var _thisScene = "ChargeCoinScene";
        var _this;
        var _comp;
        var desc;
        var purchaseModule;
        var purchaseCount = 0;

		var dataManager = W.getModule("manager/SdpDataManager");
        
        var couponInfo = couponInfoComp.getNewComp();

        W.log.info("### Initializing " + _thisScene + " scene ###");
        
        function create(){
        	W.log.info(desc);
        	_comp.add(new W.Span({x:55, y:51, height:"30px", width:"300px", textColor:"rgb(255,255,255)",
				"font-size":"27px", className:"font_rixhead_medium", text:W.Texts["scene_coin_charge_title"]}));
        	_comp.add(new W.Span({x:56, y:90, height:"18px", width:"1000px", textColor:"rgba(181,181,181,0.5)", 
				"font-size":"18px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_guide"]}));
        	_comp.add(new W.Span({x:160, y:647, height:"18px", width:"500px", textColor:"rgba(131,122,119,0.75)",
				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_text3"]}));
        	_comp.add(new W.Span({x:160, y:665, height:"18px", width:"1000px", textColor:"rgba(131,122,119,0.75)",
				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_text4"]}));
        	
        	var tmpHeight = 0;
        	if(desc.coins && desc.coins.length > 0){
        		_comp._single = new W.Div({x:158, y:156, width:970, height:210, overflow:"hidden"});
        		_comp.add(_comp._single);
        		_comp._single.add(new W.Span({x:0, y:0, height:"22px", width:"280px", textColor:"rgba(255,255,255,0.75)",
    				"font-size":"20px", className:"font_rixhead_light", text:W.Texts["purchase_coin"]}));

        		_comp._list1 = new W.Div({x:0, y:189-156, width:970, height:167});
        		_comp._single.add(_comp._list1);
        		
        		_comp._singles = [];

        		for(var i=0; i < desc.coins.length; i++){
        			var vatPrice = util.vatPrice(desc.coins[i].listPrice);
        			var totalPrice = desc.coins[i].coin.totalAmt;
        			var dcPrice = totalPrice - vatPrice;
        			
        			_comp._singles[i] = new W.Div({x:244 * i, y:0, width:234, height:167});
        			_comp._list1.add(_comp._singles[i]);
        			_comp._singles[i].add(new W.Image({x:1, y:1, width:232, height:165, src:"img/box_tvcoin.png"}));
        			_comp._singles[i]._foc = new W.Image({x:0, y:0, width:234, height:167, src:"img/box_tvcoin_f.png", display:"none"});
        			_comp._singles[i].add(_comp._singles[i]._foc);
        			_comp._singles[i].add(new W.Div({x:171-158, y:272-189, width:206, height:70, backgroundColor:"rgba(0,0,0,0.2)"}));
        			_comp._singles[i].add(new W.Span({x:253-158, y:312-189, height:"15px", width:"65px", textColor:"rgb(131,122,119)",
        				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["usable2"]}));
        			
        			_comp._singles[i]._text = new W.Div({x:253-158, y:287-189, width:120, height:22, textAlign:"left", opacity:0.5});
        			_comp._singles[i].add(_comp._singles[i]._text);
        			_comp._singles[i]._text.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgb(237,168,2)", 
        				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["total"], "padding-right":"2px"}));
        			_comp._singles[i]._text.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(237,168,2)", 
        				"font-size":"20px", className:"font_rixhead_medium", text:W.Util.formatComma(totalPrice, 3), "padding-right":"2px"}));
        			_comp._singles[i]._text.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgb(131,122,119)", 
        				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["price_unit"]}));
        			
        			_comp._singles[i].add(new W.Image({x:206-158, y:291-189, width:34, height:33, src:"img/icon_tvcoin.png"}));
        			_comp._singles[i]._price = new W.Span({x:0, y:220-189, height:"24px", width:"234px", textColor:"rgba(255,255,255,0.75)", 
        				"font-size":"22px", className:"font_rixhead_medium", text:W.Util.formatComma(vatPrice, 3) + W.Texts["price_unit"] + " " + W.Texts["payment"], textAlign:"center"})
        			_comp._singles[i].add(_comp._singles[i]._price);
        			_comp._singles[i]._price2 = new W.Span({x:0, y:249-189, height:"15px", width:"234px", textColor:"rgba(181,181,181,0.5)", 
        				"font-size":"18px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_text"].replace("3000",  W.Util.formatComma(dcPrice, 3)), textAlign:"center"})
        			_comp._singles[i].add(_comp._singles[i]._price2);
        		}
        	}else{
        		tmpHeight = 250;
        	}
        	
        	if(desc.monthlyCoins && desc.monthlyCoins.length > 0){
        		_comp._monthly = new W.Div({x:158, y:405 - tmpHeight, width:970, height:240, overflow:"hidden"});
        		_comp.add(_comp._monthly);
        		_comp._monthly.add(new W.Span({x:0, y:0, height:"22px", width:"320px", textColor:"rgba(255,255,255,0.75)",
    				"font-size":"20px", className:"font_rixhead_light", text:W.Texts["purchase_coin_monthly"]}));
        		_comp._monthly.add(new W.Span({x:1, y:28, height:"18px", width:"800px", textColor:"rgba(131,122,119,0.5)",
    				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_text2"]}));
        		
        		_comp._list2 = new W.Div({x:0, y:468-405, width:970, height:167});
        		_comp._monthly.add(_comp._list2);
        		
        		_comp._monthlys = [];
        		for(var i=0; i < desc.monthlyCoins.length; i++){
        			_comp._monthlys[i] = new W.Div({x:244 * i, y:0, width:234, height:167, opacity:(desc.monthlyCoins[i].isPurchased ? 0.5:1)});
        			
        			_comp._list2.add(_comp._monthlys[i]);
        			_comp._monthlys[i].add(new W.Image({x:1, y:1, width:232, height:165, src:"img/box_tvcoin.png"}));
        			_comp._monthlys[i]._foc = new W.Image({x:0, y:0, width:234, height:167, src:"img/box_tvcoin_f.png", display:"none"});
        			_comp._monthlys[i].add(_comp._monthlys[i]._foc);
        			_comp._monthlys[i].add(new W.Div({x:171-158, y:551-468, width:206, height:70, backgroundColor:"rgba(0,0,0,0.2)"}));

        			var vatPrice = util.vatPrice(desc.monthlyCoins[i].listPrice);
        			var totalPrice = desc.monthlyCoins[i].coin.totalAmt;
        			var dcPrice = totalPrice - vatPrice;
        			
        			if(desc.monthlyCoins[i].isPurchased){
        				_comp._monthlys[i].add(new W.Span({x:253-158, y:591-468, height:"15px", width:"60px", textColor:"rgba(218,188,116,0.75)", 
            				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["usable3"]}));
        				
        				_comp._monthlys[i]._text = new W.Div({x:253-158, y:566-468, width:120, height:22, textAlign:"left", opacity:0.6});
            			_comp._monthlys[i].add(_comp._monthlys[i]._text);
            			_comp._monthlys[i]._text.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgba(131,122,119,0.5)", 
            				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["unit_month"], "padding-right":"2px"}));
            			_comp._monthlys[i]._text.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgba(237,168,2,0.5)", 
            				"font-size":"20px", className:"font_rixhead_medium", text:W.Util.formatComma(totalPrice, 3), "padding-right":"2px"}));
            			_comp._monthlys[i]._text.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgba(131,122,119,0.5)", 
            				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["price_unit"]}));

        				_comp._monthlys[i].add(new W.Image({x:205-158, y:570-468, width:34, height:33, src:"img/icon_tvcoin2.png", opacity:0.6}));
        				_comp._monthlys[i]._price = new W.Span({x:0, y:499-468, height:"24px", width:"234px", textColor:"rgba(255,255,255,0.38)", 
            				"font-size":"22px", className:"font_rixhead_medium", textAlign:"center",
            				text:W.Texts["unit_month"] + " " + W.Util.formatComma(vatPrice, 3) + W.Texts["price_unit"] + " " + W.Texts["payment"]});
        				_comp._monthlys[i]._price2 = new W.Span({x:0, y:249-189, height:"15px", width:"234px", textColor:"rgba(181,181,181,0.5)", 
            				"font-size":"18px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_text"].replace("3000",  W.Util.formatComma(dcPrice, 3)), textAlign:"center"})
            			_comp._monthlys[i].add(_comp._monthlys[i]._price2);
        			}else{
        				_comp._monthlys[i].add(new W.Span({x:253-158, y:591-468, height:"15px", width:"60px", textColor:"rgb(131,122,119)", 
            				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["usable2"]}));
        				
        				_comp._monthlys[i]._text = new W.Div({x:253-158, y:566-468, width:120, height:22, textAlign:"left", opacity:0.5});
            			_comp._monthlys[i].add(_comp._monthlys[i]._text);
            			_comp._monthlys[i]._text.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgb(131,122,119)", 
            				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["unit_month"], "padding-right":"2px"}));
            			_comp._monthlys[i]._text.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(237,168,2)", 
            				"font-size":"20px", className:"font_rixhead_medium", text:W.Util.formatComma(totalPrice, 3), "padding-right":"2px"}));
            			_comp._monthlys[i]._text.add(new W.Span({position:"relative", y:0, height:"15px", textColor:"rgb(131,122,119)", 
            				"font-size":"16px", className:"font_rixhead_light", text:W.Texts["price_unit"]}));
            			
        				_comp._monthlys[i].add(new W.Image({x:205-158, y:570-468, width:34, height:33, src:"img/icon_tvcoin2.png"}));
        				_comp._monthlys[i]._price = new W.Span({x:0, y:499-468, height:"24px", width:"234px", textColor:"rgba(255,255,255,0.75)", 
            				"font-size":"22px", className:"font_rixhead_medium", textAlign:"center",
            				text:W.Texts["unit_month"] + " " + W.Util.formatComma(vatPrice, 3) + W.Texts["price_unit"] + " " + W.Texts["payment"]});
        				_comp._monthlys[i]._price2 = new W.Span({x:0, y:249-189, height:"15px", width:"234px", textColor:"rgba(181,181,181,0.5)", 
            				"font-size":"18px", className:"font_rixhead_light", text:W.Texts["scene_coin_charge_text"].replace("3000",  W.Util.formatComma(dcPrice, 3)), textAlign:"center"})
            			_comp._monthlys[i].add(_comp._monthlys[i]._price2);
        			}
        			
        			_comp._monthlys[i].add(_comp._monthlys[i]._price);
        		}
        	}
        };
        
        function focus(){
        	if(yIndex == 0){
        		_comp._singles[index]._foc.setStyle({display:"block"});
        		_comp._singles[index]._text.setStyle({opacity:1});
        		_comp._singles[index]._price.setStyle({textColor:"rgb(255,255,255)", className:"font_rixhead_medium"});
        		_comp._singles[index]._price2.setStyle({textColor:"rgb(181,181,181)"});
        		_comp._list1.setStyle({x: -976 * Math.floor(index/4)});
        	}else{
        		_comp._monthlys[index2]._foc.setStyle({display:"block"});
        		_comp._monthlys[index2]._text.setStyle({opacity:1});
        		_comp._monthlys[index2]._price.setStyle({textColor:"rgb(255,255,255)", className:"font_rixhead_medium"});
        		_comp._list2.setStyle({x: -976 * Math.floor(index2/4)});
        	}
        };
        
        function unFocus(){
        	if(yIndex == 0){
        		_comp._singles[index]._foc.setStyle({display:"none"});
        		_comp._singles[index]._text.setStyle({opacity:0.5});
        		_comp._singles[index]._price.setStyle({textColor:"rgba(255,255,255,0.75)", className:"font_rixhead_light"});
        		_comp._singles[index]._price2.setStyle({textColor:"rgba(181,181,181,0.75)"});
        	}else{
        		_comp._monthlys[index2]._foc.setStyle({display:"none"});
        		_comp._monthlys[index2]._text.setStyle({opacity:0.5});
        		_comp._monthlys[index2]._price.setStyle({textColor:"rgba(255,255,255,0.75)", className:"font_rixhead_light"});
        	}
        };

		var getCoinShop = function(param) {
			dataManager.getCoinShop(cbGetCoinShop, {offset:0, limit:1000});
		};

		var cbGetCoinShop = function(isSuccess, result) {
			if(isSuccess) {
				desc.coins = result.data;
				if(W.StbConfig && (W.StbConfig.cugType == "normal" || W.StbConfig.cugType == "community")) {
					getMonthlyCoinShop();
				} else {
					create();
					if(desc.coins.length > 0){
						focus();
					}
				}
			} else {

			}
		};

		var getMonthlyCoinShop = function(param) {
			dataManager.getMonthlyCoinShop(cbGetMonthlyCoinShop, {offset:0, limit:1000});
		};

		var cbGetMonthlyCoinShop = function(isSuccess, result) {
			if(isSuccess) {
				desc.monthlyCoins = result.data;
				if(W.Coupon.monthly && W.Coupon.monthly.length > 0){
					for(var i=0; i < desc.monthlyCoins.length; i++){
						for(var j=0; j < W.Coupon.monthly.length; j++){
							if(desc.monthlyCoins[i].coin.coinId == W.Coupon.monthly[j].PolicyID && W.Coupon.monthly[j].OfferGubun == "M"){
								desc.monthlyCoins[i].isPurchased = true;
								purchaseCount++;
								break;
							}
						}
					}
				}
				create();
				if(desc.coins.length > 0){
					focus();
				}else{
					if(desc.monthlyCoins.length > 0){
						yIndex = 1;
						focus();
					}
				}
			} else {

			}
		};
		
		function purchaseCoin(purchaseValue, totalPrice){
			W.log.info(purchaseValue);
			var reqData = {};
			reqData.PolicyID = purchaseValue.product.productId;
			reqData.TargetList = [];
			reqData.TargetList[0] = {AccountID:W.StbConfig.accountId};
			if(purchaseValue.mobileNumber){
				reqData.TargetList[0].MobileNumber = purchaseValue.mobileNumber;
				reqData.TargetList[0].PrepayAmount = util.vatPrice(purchaseValue.product.listPrice);
			}
			couponDataManager.issueCoupon(function(result, resultData){
				if(result && resultData.RtnCode == "1000"){
					W.getCoupon();
					var title = W.Util.formatComma(util.vatPrice(purchaseValue.product.listPrice), 3) + W.Texts["price_unit"] + " " + W.Texts["payment"];
					var popup = {
         				popupName:"popup/purchase/PurchaseCompletePopup",
         				contents:{title:title},
         				salesType:purchaseValue.product.salesType,
         				totalAmt:purchaseValue.product.coin.totalAmt
         			};
     	    		W.PopupManager.openPopup(popup);
				}else{
					if(purchaseValue.mobileNumber){
						purchaseModule = new purchaseComp(_this);
						purchaseModule.cancelPurchase(undefined, purchaseValue);
					}
					W.PopupManager.openPopup({
	                    childComp:_this, 
	                    popupName:"popup/ErrorPopup",
	                    code:resultData.RtnCode,
	                    message:[resultData.RtnMessage],
						from : "COUPON"}
	                );
				}
			}, reqData);
		};

		return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                index = 0;
                index2 = 0;
                yIndex = 0;
                _this = this;
                _this.from = param;
                purchaseCount = 0;
                
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);

                _comp = new W.Div({className : "bg_size"});
                _comp._bg = new W.Div({x:0, y:0, width:1280, height:720, className : "bg_color"});
                _comp.add(_comp._bg);

                _comp.add(couponInfo.getComp(592, 38));
        		couponInfo.setData(undefined, undefined, true);

                _this.add(_comp);

                //_this.dataManager = W.getModule("manager/SdpDataManager");

				desc = {};
				getCoinShop();
                /*_this.dataManager.getMainBanner(function(result, data){
                	desc = {};
                	desc.coins = [{price:5000, available:5500}, {price:10000, available:13000}, {price:20000, available:24500}, {price:30000, available:36000}, {price:50000, available:59500}];
                	desc.monthlyCoins = [{price:15000, available:21500}, {price:25000, available:32000}, {price:50000, available:65000}];
                	create();
                	focus();
				}, 0);*/
            },
            onPause: function() {

            },
            onResume: function() {

            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");

            },
            onKeyPressed : function(event, isRetry) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                    	if(!isRetry){
                        	unFocus();
                    	}
                    	if(yIndex == 0){
                    		index = (++index) % desc.coins.length;
                        }else{
                        	index2 = (++index2) % desc.monthlyCoins.length;
                        	if(desc.monthlyCoins[index2].isPurchased){
                        		this.onKeyPressed(event, true);
                        		return;
                        	}
                        }
                    	focus();
                        break;
                    case W.KEY.LEFT:
                    	if(!isRetry){
                        	unFocus();
                    	}
                    	if(yIndex == 0){
                            index = (--index + desc.coins.length) % desc.coins.length;
                        }else{
                        	index2 = (--index2 + desc.monthlyCoins.length) % desc.monthlyCoins.length;
                        	if(desc.monthlyCoins[index2].isPurchased){
                        		this.onKeyPressed(event, true);
                        		return;
                        	}
                        }
                    	focus();
                        break;
                    case W.KEY.UP:
                        if(yIndex == 1){
                        	unFocus();
                        	yIndex = 0;
                        	focus();
                        }
                        break;
                    case W.KEY.DOWN:
                    	if(yIndex == 0 && desc.monthlyCoins && desc.monthlyCoins.length > 0 && desc.monthlyCoins.length > purchaseCount){
                        	unFocus();
                        	yIndex = 1;
                        	for(var i=0; i < desc.monthlyCoins.length; i++){
                        		if(!desc.monthlyCoins[i].isPurchased){
                        			index2 = i;
                        			break;
                        		}
                        	}
                        	focus();
                        }
                        break;
                    case W.KEY.ENTER:
                    	var param = {};
                    	if(yIndex == 0){
							param = desc.coins[index];
                    		//param.isMonthly = false;
							//param.coin = desc.coins[index];
                    		//param.price = desc.coins[index].price;
                    		//param.coin = desc.coins[index].available;
                    	}else{
							param = desc.monthlyCoins[index2];
                    		param.isMonthly = true;
							//param.coin = desc.monthlyCoins[index2];
                    		//param.price = desc.monthlyCoins[index2].price;
                    		//param.coin = desc.monthlyCoins[index2].available;
                    	}

                    	if(W.StbConfig.blockPurchase){
			        		var msg;
			        		if(W.StbConfig.cugType == "accommodation"){
			        			msg = W.Texts["alert_block_message2"];
			        		}else{
			        			msg = W.Texts["alert_block_message1"].replace("@tel@", W.Config.CALL_CENTER_NUMBER);
			        		}
			        		
			        		W.PopupManager.openPopup({
			                    title:W.Texts["popup_zzim_info_title"],
			                    popupName:"popup/AlertPopup",
			                    boldText:W.Texts["alert_block_title2"],
			                    thinText:msg
			                });
			        	}else{
							if(W.StbConfig && (W.StbConfig.cugType == "normal" || W.StbConfig.cugType == "community")) {
								var popup = {
									popupName:"popup/purchase/PurchaseCoinPopup",
									desc:param,
									childComp:this
								};
							} else {
								var popup = {
	                				popupName:"popup/purchase/TermsPopup",
	                				title:W.Texts["title_mobile_term"],
	                				price:yIndex==0 ? desc.coins[index].listPrice : desc.monthlyCoins[index2].listPrice,
	                				type:"MOBILE_TERMS",
	                				childComp:this
	                			};
							}
	        	    		W.PopupManager.openPopup(popup);
			        	}
                        break;
                    case W.KEY.EXIT:
                    case W.KEY.BACK:
                        _this.backScene();
                        break;
                }

            },
            onPopupClosed: function(popup, desc2){
            	if (desc2) {
            		if (desc2.popupName == "popup/purchase/PurchaseCoinPopup") {
            			if (desc2.action == W.PopupManager.ACTION_OK) {
            				var purchaseValue = {};
            				var totalPrice;
            				if(yIndex == 0){
            					purchaseValue.product = Object.assign(desc.coins[index]);
            					totalPrice = desc.coins[index].listPrice;
            				}else{
            					purchaseValue.product = Object.assign(desc.monthlyCoins[index2]);
            					totalPrice = desc.coins[index].listPrice;
            				}
            				purchaseValue.paymentOption = {type:"bill"};
            				
            				purchaseCoin(purchaseValue, totalPrice);
            			}
        			}else if (desc2.popupName == "popup/purchase/PurchaseCompletePopup"){
        				_this.backScene();
        			}else if (desc2.popupName == "popup/purchase/TermsPopup"){
        				if (desc2.action == W.PopupManager.ACTION_OK) {
            				W.log.info(desc2);
            				if(desc2.type == "MOBILE_TERMS"){
            					_this.purchaseValue = {};
            					var product;
            					if(yIndex == 0){
            						product = desc.coins[index];
            					}else{
            						product = desc.monthlyCoins[index2];
            					}
            					_this.purchaseValue.product = product;
            					_this.purchaseValue.coin = product.coin;
            					var param = {};
                            	if(yIndex == 0){
        							param = desc.coins[index];
                            	}else{
        							param = desc.monthlyCoins[index2];
                            		param.isMonthly = true;
                            	}
            					var popup = {
                    				popupName:"popup/purchase/MobileInputPopup",
                    				contents:_this.purchaseValue,
                    				price:util.vatPrice(product.listPrice),
                    				type:"COIN",
                    				param:param,
                    				childComp:_this
                    			};
                	    		W.PopupManager.openPopup(popup);
            				}
        				}
        			}else if (desc2.popupName == "popup/purchase/MobileInputPopup") {
            			if (desc2.action == W.PopupManager.ACTION_OK) {
            				W.log.info(desc2);
            				if(desc2.result){
            					if(desc2.data.res_code == "0000"){
            						_this.purchaseValue.mobileNumber = desc2.reqData.LGD_MOBILENUM;
                    				var popup = {
                        				popupName:"popup/purchase/MobileConfirmPopup",
                        				reqData:desc2.reqData,
                        				mobilePurchaseInfo:desc2.data,
                        				price:util.vatPrice(_this.purchaseValue.product.listPrice),
                        				childComp:_this
                        			};
                    	    		W.PopupManager.openPopup(popup);
            					}else{
            						W.PopupManager.openPopup({
            	                        childComp:this,
            	                        type:"MOBILE_INPUT",
            	                        popupName:"popup/ErrorPopup",
            	                        code:desc2.data.res_code,
            	                        message:[desc2.data.res_msg],
            	    					from : "MOBILE"}
            	                    );
            					}
            				}
            			}
        			}else if (desc2.popupName == "popup/Alert") {
            			if (desc2.type == "MOBILE_INPUT") {
            				var param = {};
                        	if(yIndex == 0){
    							param = desc.coins[index];
                        	}else{
    							param = desc.monthlyCoins[index2];
                        		param.isMonthly = true;
                        	}
            				var popup = {
                				popupName:"popup/purchase/MobileInputPopup",
                				contents:_this.purchaseValue,
                				price:util.vatPrice(_this.purchaseValue.product.listPrice),
                				type:"COIN",
                				param:param,
                				childComp:_this
                			};
            	    		W.PopupManager.openPopup(popup);
            			}
        			}else if (desc2.popupName == "popup/purchase/MobileConfirmPopup") {
            			if (desc2.action == W.PopupManager.ACTION_OK) {
            				if(desc2.data.res_code == "0000"){
            					_this.purchaseValue.mobilePurchaseResult = desc2.data;
            					_this.purchaseValue.paymentOption = {type:"mobile"};
            					purchaseCoin(_this.purchaseValue, _this.purchaseValue.product.listPrice);
        					}else{
        						W.PopupManager.openPopup({
        	                        childComp:this,
        	                        popupName:"popup/ErrorPopup",
        	                        code:desc2.data.res_code,
        	                        message:[desc2.data.res_msg],
        	    					from : "MOBILE"}
        	                    );
        					}
            			}
        			}
                }
            },
        });
    });
