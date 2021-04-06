W.defineModule([ "mod/Util", "manager/TvPayDataManager"], function(util, tvPayDataManager) {

	function SelectComp(_parent, type, list, depth, assetList){
		var _comp;
		var buttons = [];
		var index = 0;
		var isDiscount = false;
		var dIndex = 0;
		var sIndex = 0;
		var coupons = [];
		var isOnlyCoupon = false;
		var isUsableCoupon = false;
		var usableCoupons = [];
		var hasCoupon = false;
		var _this = this;
		
		if(type == "paymentOptions"){
			for(var i=0; i < list.length; i++){
				if(list[i].type == "coupon"){
					coupons.push(list.splice(i,1)[0]);
					isUsableCoupon = true;
				}
			}
			for(var i=0; i < list.length; i++){
				if(list[i].type == "coin"){
					coupons.push(list.splice(i,1)[0]);
					isUsableCoupon = true;
				}
			}
		}
		
		W.log.info(coupons);
		
		this.getComp = function(){
			var couponTop = 0;
			var coinTop = 0;
			sIndex = 0;

			_comp = new W.Div({x:0, y:0, width:"600px", height:"480px"});
			
			_comp._area_step = new W.Div({x:0, y:0, width:"600px", height:"480px"});
			_comp.add(_comp._area_step);
			_comp._area_list = new W.Div({x:0, y:0, width:"600px", height:"480px", display:"none"});
			_comp.add(_comp._area_list);
			
			_comp._step = new W.Div({x:124, y:60, width:"522px", height:"35px"});
			_comp._area_step.add(_comp._step);
			_comp._step._txt = new W.Span({x:depth == 0 ? 104 : 363, y:1, width:"45px", height:"18px", textColor:"rgba(131,122,119,0.25)", 
            	"font-size":"16px", className:"font_rixhead_medium", text:"STEP"});
			_comp._step.add(_comp._step._txt);
			_comp._step._no = new W.Span({x:depth == 0 ? 149 : 409, y:0, width:"20px", height:"25px", textColor:"rgba(131,122,119,0.25)", 
            	"font-size":"24px", className:"font_rixhead_bold", text:(depth + 1)});
			_comp._step.add(_comp._step._no);
			
			_comp._step._bar = new W.Image({x:depth == 0 ? 0 : 260, y:28, width:"261px", height:"4px", src:"img/pay_step_f.png", display:"none"});
			_comp._step.add(_comp._step._bar);
			
			if(type == "products"){
				_comp._area_list.add(new W.Span({x:158+1, y:130+0, width:"500px", height:"33px", textColor:"rgb(255,255,255)", 
	    			"font-size":"30px", className:"font_rixhead_medium", text:W.Texts["select_product_type"]}));
				_comp._area_list.add(new W.Span({x:158+1, y:130+40, width:"500px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
	    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["select_product_type_guide"]}));
			}else if(type == "paymentOptions"){
				if(coupons.length > 0){
					_comp._area1 = new W.Div({x:159, y:129, width:"490px", height:"150px"});
					_comp._area_list.add(_comp._area1);
					_comp._discount_title = new W.Span({x:0, y:0, width:"350px", height:"26px", textColor:"rgba(255,255,255,0.5)", 
		    			"font-size":"24px", className:"font_rixhead_medium", text:W.Texts["select_payment3"]});
					_comp._area1.add(_comp._discount_title);
					
					_comp._coupons = [];
					var couponCount = 0;
					for(var i=0; i < coupons.length; i++){
						_comp._coupons[i] = new W.Div({x:i == 0 ? 0 : 239, y:41, width:"231px", height:"88px"});
						_comp._area1.add(_comp._coupons[i]);
						_comp._coupons[i].add(new W.Image({x:0, y:1, width:"229px", height:"86px", src:"img/box_set229.png"}));
						_comp._coupons[i]._foc = new W.Image({x:0, y:0, width:"231px", height:"88px", src:"img/box_set229_f.png", display:"none"});
						_comp._coupons[i].add(_comp._coupons[i]._foc);
						
						_comp._coupons[i]._box = new W.Image({x:15, y:18, width:"22px", height:"22px", src:"img/check_n.png"});
						if(W.Coupon && coupons[i].type == "coin" && W.Coupon.totalBalanceAmount == 0){
							_comp._coupons[i]._box.setStyle({display:"none"});
						}
						_comp._coupons[i].add(_comp._coupons[i]._box);
						
						_comp._coupons[i]._check = new W.Image({x:15, y:18, width:"22px", height:"22px", src:"img/check__f.png", display:"none"});
						_comp._coupons[i].add(_comp._coupons[i]._check);
						
						var text = W.Texts["discount"].replace("@price@", 0);
						if(coupons[i].type == "coupon"){
							_comp._coupons[i]._title = new W.Span({x:45, y:21, width:"50px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
				    			"font-size":"18px", className:"font_rixhead_medium", text:W.Texts["coupon"]});
							_comp._coupons[i].add(_comp._coupons[i]._title);
							_comp._coupons[i]._hold = new W.Span({x:100, y:22, width:"111px", height:"20px", textColor:"rgb(161,181,221)", textAlign:"right", 
				    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["hold_coupon"].replace("@coupon@", W.Coupon ? W.Coupon.coupons.length : "-")});
							_comp._coupons[i].add(_comp._coupons[i]._hold);
							
							
							usableCoupons = [];
							if(W.Coupon && W.Coupon.coupons.length > 0){
								for(var j=0; j < W.Coupon.coupons.length; j++){
									var isUsableCoupon = W.entryPath.isUsableCoupon(W.Coupon.coupons[j], _parent.purchaseValue.asset, _parent.param.type == "M");
									if(isUsableCoupon){
										usableCoupons.push(W.Coupon.coupons[j]);
										couponCount++;
									}
								}
							}else{
								_comp._coupons[i].setStyle({opacity:0.5});
								if(coupons.length > 1){
									dIndex = 1;
								}
							}
							
							if(couponCount == 0){
								_comp._coupons[i].setStyle({opacity:0.5});
								if(coupons.length > 1){
									dIndex = 1;
								}
							}
							_comp._coupons[i]._hold.setText(W.Texts["hold_coupon"].replace("@coupon@", W.Coupon ? couponCount : "-"));
						}else{
							_comp._coupons[i]._title = new W.Span({x:45, y:21, width:"50px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
				    			"font-size":"18px", className:"font_rixhead_medium", text:W.Texts["coin"]});
							_comp._coupons[i].add(_comp._coupons[i]._title);
							_comp._coupons[i]._hold = new W.Span({x:80, y:22, width:"136px", height:"20px", textColor:"rgb(161,181,221)", textAlign:"right", 
				    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["hold_coin"].replace("@coin@", W.Coupon ? W.Util.formatComma(W.Coupon.totalBalanceAmount, 3) : "-")});
							_comp._coupons[i].add(_comp._coupons[i]._hold);
							if(W.Coupon && (!W.Coupon.totalBalanceAmount || W.Coupon.totalBalanceAmount == 0)){
								text = W.Texts["charging"];
							}else{
								text =  "0" + W.Texts["price_unit"] + " " + W.Texts["use"];
							}
							
							if(!W.Coupon){
								_comp._coupons[i].setStyle({opacity:0.5});
							}
						}
						
						_comp._coupons[i]._discount = new W.Span({x:50, y:(W.StbConfig.menuLanguage == "ENG") ? 60 : 51, width:"161px", height:"20px", textColor:"rgb(158,142,133)", textAlign:"right", 
			    			"font-size":"18px", className:"font_rixhead_light", text:text});
						_comp._coupons[i].add(_comp._coupons[i]._discount);
					}
					_comp._discount_title.setStyle({textColor:"rgb(255,255,255)"});
					if(couponCount == 0 && W.Coupon && (!W.Coupon.totalBalanceAmount || W.Coupon.totalBalanceAmount == 0)){
						isDiscount = false;
					}else{
						if(coupons.length > 1){
							isDiscount = W.Coupon ? true : false;
						}else{
							if(couponCount > 0){
								isDiscount = W.Coupon ? true : false;
							}
						}
					}
				}
				
				_comp._area2 = new W.Div({x:158, y:coupons.length > 0 ? 301 : 129, width:"490px", height:"320px"});
				_comp._area_list.add(_comp._area2);
				_comp._payment_title = new W.Span({x:0, y:0, width:"400px", height:"26px", textColor:"rgba(255,255,255,0.5)", 
	    			"font-size":"24px", className:"font_rixhead_medium", text:W.Texts["select_payment2"]});
				_comp._area2.add(_comp._payment_title);
				
			}else if(type == "agreements"){
				_comp._area_list.add(new W.Span({x:158+1, y:130+0, width:"500px", height:"33px", textColor:"rgb(255,255,255)", 
	    			"font-size":"30px", className:"font_rixhead_medium", text:W.Texts["select_term_agreement"]}));
				_comp._area_list.add(new W.Span({x:158+1, y:130+41, width:"500px", height:"18px", textColor:"rgba(181,181,181,0.75)", 
	    			"font-size":"16px", className:"font_rixhead_light", text:W.Texts["select_term_agreement_guide1"]}));
				_comp._area_list.add(new W.Span({x:158+1, y:130+65, width:"500px", height:"18px", textColor:"rgba(181,181,181,0.75)", 
	    			"font-size":"16px", className:"font_rixhead_light", text:W.Texts["select_term_agreement_guide2"]}));
			}
			
			var top = 0;
			if(type == "paymentOptions"){
				top = 39;
			}else{
				top = 80 + (6 - list.length) * 33.5 + 130;
			}
			top += 10;
			for(var i=0; i < list.length; i++){
				if(type == "paymentOptions"){
					buttons[i] = new W.Div({x:0, y:top + (67 * i), width:"371px", height:"58px"});
					_comp._area2.add(buttons[i]);
				}else{
					buttons[i] = new W.Div({x:158, y:top + (67 * i), width:"371px", height:"58px"});
					_comp._area_list.add(buttons[i]);
				}

				buttons[i].add(new W.Image({x:1, y:1, width:"369px", height:"56px", src:"img/box_set369.png"}));
				buttons[i]._foc = new W.Image({x:0, y:0, width:"371px", height:"58px", src:"img/box_set369_f.png", display:"none"});
				buttons[i].add(buttons[i]._foc);
				if(type == "products"){
					var text;
					W.log.info(assetList);
					if(assetList && assetList[i]){
						text = assetList[i].resolution ? assetList[i].resolution : "";
						if(assetList[i].isLifetime){
							text += " " + W.Texts["popup_zzim_option_lifetime"]
						}
						if(assetList[i].assetGroup != "010"){
							text += " " + util.getAssetGroupCode(assetList[i]);
						}
						if(assetList[i].events){
							var _div = new W.Div({x:45, y:21, width:"300px", height:"22px", textAlign:"left"});
							buttons[i]._text = new W.Span({position:"relative", y:-4, height:"22px", textColor:"rgba(181,181,181,0.75)", 
				    			"font-size":"20px", className:"font_rixhead_light", text:text, "padding-right":"15px", display:"inline-block"});
							_div.add(buttons[i]._text);
							_div.add(new W.Image({position:"relative", y:0, width:"51px", height:"18px", src:"img/icon_popup_event.png", display:"inline-block"}));
							buttons[i].add(_div);
						}else{
							buttons[i]._text = new W.Span({x:45, y:20, width:"300px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
				    			"font-size":"20px", className:"font_rixhead_light cut", text:text});
							buttons[i].add(buttons[i]._text);
						}
					}else{
						buttons[i]._text = new W.Span({x:45, y:20, width:"300px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
			    			"font-size":"20px", className:"font_rixhead_light cut", text:list[i].title});
						buttons[i].add(buttons[i]._text);
					}
				}else if(type == "paymentOptions"){
					buttons[i]._text = new W.Span({x:45, y:20, width:"230px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
		    			"font-size":"20px", className:"font_rixhead_light", text:list[i].name});
					buttons[i].btnType = list[i].type;
					buttons[i].add(buttons[i]._text);
				}else if(type == "agreements"){
					buttons[i]._text = new W.Span({x:45, y:20, width:"230px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
		    			"font-size":"20px", className:"font_rixhead_light", text:util.getAgreementTitle(list[i])});
					buttons[i].add(buttons[i]._text);
				}else{
					buttons[i]._text = new W.Span({x:45, y:20, width:"230px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
		    			"font-size":"20px", className:"font_rixhead_light", text:list[i]});
					buttons[i].add(buttons[i]._text);
				}
				buttons[i]._radio = new W.Div({x:16, y:18, width:"22px", height:"22px"});
				buttons[i].add(buttons[i]._radio);
				buttons[i]._radio.add(new W.Image({x:0, y:0, width:"22px", height:"22px", src:"img/radio_n.png"}));
				buttons[i]._radio_f = new W.Image({x:0, y:0, width:"22px", height:"22px", src:"img/radio_f.png", display: i == sIndex ? "block" : "none"});
				buttons[i]._radio.add(buttons[i]._radio_f);
			}
			
			if(type == "paymentOptions"){
				_parent.purchaseValue.paymentOption = list[sIndex];
			}
			return _comp;
		};
		
		this.focus = function(){
			_comp._area_list.setStyle({display:"block"});
			_comp._step._bar.setStyle({display:"block"});
			_comp._step._txt.setStyle({textColor:"rgba(255,255,255,0.5)"});
			_comp._step._no.setStyle({textColor:"rgba(255,255,255,0.7)"});
			
			focus();
		};
		
		this.unFocus = function(isShow, isBack){
			unFocus();
			if(!isShow){
				_comp._area_list.setStyle({display:"none"});
				_comp._step._bar.setStyle({display:"none"});
				_comp._step._txt.setStyle({textColor:"rgba(131,122,119,0.25)"});
				_comp._step._no.setStyle({textColor:"rgba(131,122,119,0.25)"});
				
				if(isBack){
					index = 0;
					dIndex = 0;
					if(coupons.length > 0 && coupons[0].type == "coupon"){
						if(W.Coupon.coupons.length == 0){
							dIndex = 1;
						}
					}
					
					sIndex = 0;
					_parent.purchaseValue.coupon = undefined;
					_parent.purchaseValue.useCoin = false;
					_comp._area2.setStyle({opacity:1});
					if(isUsableCoupon){
						_comp._coupons[0]._check.setStyle({display:"none"});
						if(_comp._coupons[1]){
							_comp._coupons[1].setStyle({opacity:1});
							_comp._coupons[1]._check.setStyle({display:"none"});
						}
					}
					changePrice();
				}
			}
		};
		
		function focus(){
			if(isDiscount){
				_comp._coupons[dIndex]._title.setStyle({textColor:"rgb(255,255,255)"});
				_comp._coupons[dIndex]._foc.setStyle({display:"block"});
			}else{
				buttons[index]._text.setStyle({textColor:"rgb(255,255,255)"});
				buttons[index]._foc.setStyle({display:"block"});
			}
			if(type == "products"){
				_parent.purchaseValue.product = _parent.param.products[index];
				_parent.purchaseValue.asset = _parent.param.data[index];
				_parent.infoComp.changeTitle(_parent.purchaseValue.product.title);
				_parent.infoComp.changePrice();
				
				var text = _parent.purchaseValue.asset.resolution ? _parent.purchaseValue.asset.resolution : "";
				if(_parent.purchaseValue.asset.isLifetime){
					text += " " + W.Texts["popup_zzim_option_lifetime"]
				}
				if(_parent.purchaseValue.asset.assetGroup != "010"){
					text += " " + util.getAssetGroupCode(_parent.purchaseValue.asset);
				}
				_parent.infoComp.changePurchaseOption(text);
			}else if(type == "paymentOptions"){
				_parent.purchaseValue.paymentOption = list[index];
				if(isDiscount){
					_parent.infoComp.changeInfoGuide("coupon");
				}else{
					_parent.infoComp.changeInfoGuide(_parent.purchaseValue.paymentOption.type);
				}
			}else if(type == "agreements"){
				_parent.purchaseValue.agreement = list[index];
				if(_parent.purchaseValue.agreement.code == "NONE"){
					_parent.infoComp.changePurchaseOption(W.Texts["none_agreement"]);
    			}else{
    				var text = util.getAgreementTitle(_parent.purchaseValue.agreement);
    				_parent.infoComp.changePurchaseOption(text.substr(0, text.indexOf("(")));
    			}
				_parent.infoComp.changePrice();
			}
		};
		
		function unFocus(){
			if(isDiscount){
				if(!coupons[dIndex].checked){
					_comp._coupons[dIndex]._title.setStyle({textColor:"rgba(181,181,181,0.75)"});
				}
				_comp._coupons[dIndex]._foc.setStyle({display:"none"});
			}else{
				buttons[index]._text.setStyle({textColor:"rgba(181,181,181,0.75)"});
				buttons[index]._foc.setStyle({display:"none"});
			}
		};
		
		function changePrice(){
			var discountPrice = 0;
			var price = util.getPrice(_parent.purchaseValue.product);
			isOnlyCoupon = false;

			if(_parent.purchaseValue.coupon){
				if(_parent.purchaseValue.coupon.DCGubun == "R"){
					discountPrice = Math.round(price * (Number(_parent.purchaseValue.coupon.DCValue) / 100));
					price = price - discountPrice;
					if(Number(_parent.purchaseValue.coupon.DCValue) == 100){
						isOnlyCoupon = true;
					}
				}else{
					var dcPrice = 0;
					if(_parent.purchaseValue.coupon.DCGubun){
						dcPrice = Number(_parent.purchaseValue.coupon.DCValue);
					}else{
						dcPrice = _parent.purchaseValue.coupon.BalanceAmount;
					}
					if(price <= dcPrice){
						discountPrice = price;
						price = 0;
						isOnlyCoupon = true;
					}else{
						discountPrice = dcPrice;
						price -= discountPrice;
					}
				}
				
				var text = W.Texts["discount"].replace("@price@", W.Util.formatComma(discountPrice, 3));
				if(isUsableCoupon){
					_comp._coupons[0]._discount.setText(text);
				}
			}else{
				var text = W.Texts["discount"].replace("@price@", 0);
				if(isUsableCoupon){
					_comp._coupons[0]._discount.setText(text);
				}
			}
			
			if(_parent.purchaseValue.useCoin){
				var tmpPrice = 0;
				if(price <= W.Coupon.totalBalanceAmount){
					discountPrice += price;
					tmpPrice = price;
				}else{
					discountPrice += W.Coupon.totalBalanceAmount;
					tmpPrice = W.Coupon.totalBalanceAmount;
				}
				price -= tmpPrice;
				var text = W.Util.formatComma(tmpPrice, 3) + W.Texts["price_unit"] + " " + W.Texts["use"];
				
				for(var i=0; i < coupons.length; i++){
					if(coupons[i].type == "coin"){
						_comp._coupons[i]._discount.setText(text);
						break;
					}
				}
			}else{
				var text = W.Texts["discount"].replace("@price@", 0);
				for(var i=0; i < coupons.length; i++){
					if(coupons[i].type == "coin"){
						text = "0" + W.Texts["price_unit"] + " " + W.Texts["use"];
						_comp._coupons[i]._discount.setText(text);
						break;
					}
				}
			}
			_parent.infoComp.changePrice(discountPrice);
			if(isOnlyCoupon){
				_comp._area2.setStyle({opacity:0.5});
				if(isUsableCoupon && _comp._coupons[1]){
					_comp._coupons[1].setStyle({opacity:0.5});
				}
			}else{
				_comp._area2.setStyle({opacity:1});
				if(isUsableCoupon && _comp._coupons[1]){
					_comp._coupons[1].setStyle({opacity:1});
				}
			}
			
			if(price == 0){
				for(var i=0; i < buttons.length; i++){
					buttons[i].setStyle({opacity:0.5});
				}
			}else{
				for(var i=0; i < buttons.length; i++){
					buttons[i].setStyle({opacity:1});
				}
			}
			return price;
		};
		
		this.changeCoin = function(){
			if(type == "paymentOptions"){
				for(var i=0; i < coupons.length; i++){
					if(coupons[i].type == "coin"){
						_comp._coupons[i]._hold.setText(W.Texts["hold_coin"].replace("@coin@", W.Util.formatComma(W.Coupon.totalBalanceAmount, 3)));
						var text ="0" + W.Texts["price_unit"] + " " + W.Texts["use"];
						if(!W.Coupon.totalBalanceAmount || W.Coupon.totalBalanceAmount == 0){
							text = W.Texts["charging"];
						}
						_comp._coupons[i]._discount.setText(text);
						_comp._coupons[i]._box.setStyle({display:"block"});
						break;
					}
				}
			}
		};
		
		this.operate = function(event){
			var isResume = false;
			switch (event.keyCode) {
			case W.KEY.LEFT:
				if(type == "paymentOptions" && isDiscount && dIndex > 0){
    				if(W.Coupon.coupons.length > 0 && usableCoupons.length > 0){
    					unFocus();
    					dIndex = 0;
    					focus();
    	    			isResume = true;
					}
    			}
            	break;
			case W.KEY.RIGHT:
				if(type == "paymentOptions"){
					if(isDiscount){
	    				if(dIndex == 0 && coupons.length > 1 && usableCoupons.length > 0){
	    					unFocus();
	    					dIndex = 1;
	    					focus();
	    	    			isResume = true;
	    				}
					}else{
						if(list[index].type == "tvpoint"){
	    	    			isResume = true;
    					}else if(list[index].type == "mobile"){
	    	    			isResume = true;
    					}else if(list[index].type == "tvpay"){
	    	    			isResume = true;
    					}
					}
    			}
				if(!isResume){
					if(type == "agreements"){
	    				if(_parent.param.products[0].coupons){
	    					var popup = {
		        				popupName:"popup/purchase/SubscribedGuidePopup",
		        				param:_parent.param.products[0].coupons[0].discountPeriod,
		        				childComp:this
		        			};
		    	    		W.PopupManager.openPopup(popup);
	    				}
	    			} 
				}
            	break;
            case W.KEY.UP:
            	if(!isOnlyCoupon){
	    			if(isDiscount){
	        			isResume = false;
	    			}else{
		    			unFocus();
	    				if(type == "paymentOptions" && coupons.length > 0 && index == 0 && !isDiscount){
	    					if(W.Coupon){
		        				isDiscount = true;
		        				if(W.Coupon.coupons.length > 0 && usableCoupons.length > 0){
			        				dIndex = 0;
		        				}else{
		        					if(coupons.length > 1){
				        				dIndex = 1;
		        					}
		        				}
		        				
		        				if(coupons[dIndex].type == "coupon" && usableCoupons.length == 0){
		        					isDiscount = false;
		        				}else{
		        					_comp._discount_title.setStyle({textColor:"rgb(255,255,255)"});
			        				_comp._payment_title.setStyle({textColor:"rgba(255,255,255,0.5)"});
			        				_parent.infoComp.changeInfoGuide("coupon");
		        				}
	    					}
	        			}else{
	                    	index = (--index + list.length) % list.length;
	                    	if(list[index].isDimmed){
	                    		index = (--index + list.length) % list.length;
	            			}

	                    	if(_this.useCoin){
	                    		if(buttons[index].btnType.indexOf("tv") > -1){
	                    			index = 1;
	                    		}
	                    	}
	        			}
		    			focus();
		    			isResume = true;
	    			}
				}
            	break;
            case W.KEY.DOWN:
            	if(!isOnlyCoupon){
	    			unFocus();
	    			if(type == "paymentOptions" && isDiscount){
	    				if(_parent.infoComp.getPrice() > 0){
		    				isDiscount = false;
		    				index = 0;
		    				_comp._discount_title.setStyle({textColor:"rgba(255,255,255,0.5)"});
		    				_comp._payment_title.setStyle({textColor:"rgb(255,255,255)"});
	    				}
	    			}else{
	    				index = (++index) % list.length;
                    	if(list[index].isDimmed){
            				index = (++index) % list.length;
            			}
                    	if(_this.useCoin){
                    		if(buttons[index].btnType.indexOf("tv") > -1){
                    			index = 0;
                    		}
                    	}
	    			}
	    			focus();
            	}
    			isResume = true;
            	break;
            case W.KEY.ENTER:
            	buttons[sIndex]._radio_f.setStyle({display:"none"});
    			sIndex = index;
    			buttons[sIndex]._radio_f.setStyle({display:"block"});
    			if(type == "products"){
    				_parent.purchaseValue.product = _parent.param.products[sIndex];
    				_parent.purchaseValue.asset = _parent.param.data[sIndex];
    				_parent.infoComp.changeTitle(_parent.purchaseValue.product.title);
    				_parent.infoComp.changePrice();
    				
    				var text = _parent.purchaseValue.asset.resolution ? _parent.purchaseValue.asset.resolution : "";
					if(_parent.purchaseValue.asset.isLifetime){
						text += " " + W.Texts["popup_zzim_option_lifetime"]
					}
					if(_parent.purchaseValue.asset.assetGroup != "010"){
						text += " " + util.getAssetGroupCode(_parent.purchaseValue.asset);
					}
					_parent.infoComp.changePurchaseOption(text);
    			}else if(type == "paymentOptions"){
    				if(isDiscount){
    					isResume = true;
    					if(coupons[dIndex].checked){
    						coupons[dIndex].checked = false;
    						_comp._coupons[dIndex]._check.setStyle({display:"none"});
    						if(coupons[dIndex].type == "coupon"){
        						_parent.purchaseValue.coupon = undefined;
    						}else{
        						_parent.purchaseValue.useCoin = false;
        						_this.useCoin = false;
        						for(var i=0; i < buttons.length; i++){
        							if(buttons[i].btnType.indexOf("tv") > -1){
        								buttons[i].setStyle({display:"block"});
        							}
        						}
    						}
    						changePrice();
    					}else{
    						if(coupons[dIndex].type == "coupon"){
    							var needFeedback = false;
    							if(coupons[1] && coupons[1].checked){
    								_parent.purchaseValue.useCoin = false;
            						_this.useCoin = false;
    								coupons[1].checked = false;
            						_comp._coupons[1]._check.setStyle({display:"none"});
    								changePrice();
    								needFeedback = true;
    								
            						for(var i=0; i < buttons.length; i++){
            							if(buttons[i].btnType.indexOf("tv") > -1){
            								buttons[i].setStyle({display:"block"});
            							}
            						}
    							}
    							var popup = {
                        				popupName:"popup/purchase/SelectCouponPopup",
                        				asset:_parent.purchaseValue.asset,
                        				needFeedback: needFeedback,
                        				coupons:usableCoupons,
                        				childComp:this
                        			};
                    	    		W.PopupManager.openPopup(popup);
    						}else{
    							if(!W.Coupon.totalBalanceAmount || W.Coupon.totalBalanceAmount == 0){
    		    					W.SceneManager.startScene({
    		        					sceneName:"scene/my/ChargeCoinScene", 
    		        					param:"fromPurchase",
    		            				backState:W.SceneManager.BACK_STATE_KEEPHIDE
    		            			});
    							}else{
        							_parent.purchaseValue.useCoin = true;
        							coupons[dIndex].checked = true;
            						_comp._coupons[dIndex]._check.setStyle({display:"block"});
            						var price = changePrice();
            						if(price == 0){
                						isResume = false;
                					}else{
                						unFocus();
                						isDiscount = false;
            		    				index = 0;
            		    				_comp._discount_title.setStyle({textColor:"rgba(255,255,255,0.5)"});
            		    				_comp._payment_title.setStyle({textColor:"rgb(255,255,255)"});
                		    			focus();
                					}
            						_this.useCoin = true;
            						for(var i=0; i < buttons.length; i++){
            							if(buttons[i].btnType.indexOf("tv") > -1){
            								buttons[i].setStyle({display:"none"});
            							}
            						}
    							}
    						}
    					}
    				}else{
    					_parent.purchaseValue.paymentOption = list[sIndex];

    	    			isResume = true;
        				if(list[sIndex].type == "tvpoint"){
    						var popup = {
                				popupName:"popup/purchase/TvPointPopup",
                				data:_parent.purchaseValue,
                				price:_parent.infoComp.getPrice(),
                				childComp:this
                			};
            	    		W.PopupManager.openPopup(popup);
    					}else if(list[sIndex].type == "mobile"){
    						var popup = {
                				popupName:"popup/purchase/TermsPopup",
                				title:W.Texts["title_mobile_term"],
                				price:_parent.infoComp.getPrice(),
                				type:"MOBILE_TERMS",
                				childComp:this
                			};
            	    		W.PopupManager.openPopup(popup);
    					}else if(list[sIndex].type == "tvpay"){
    						var popup = {
                				popupName:"popup/purchase/TermsPopup",
                				title:W.Texts["title_mobile_term"],
                				price:_parent.infoComp.getPrice(),
                				type:"TVPAY_TERMS",
                				childComp:this
                			};
            	    		W.PopupManager.openPopup(popup);
    					}else{
    						isResume = false;
    					}
    				}
    			}else if(type == "agreements"){
    				if(_parent.param.products[0].coupons){
    					var popup = {
	        				popupName:"popup/purchase/SubscribedGuidePopup",
	        				param:_parent.param.products[0].coupons[0].discountPeriod,
	        				childComp:this
	        			};
	    	    		W.PopupManager.openPopup(popup);
    				}else{
        				_parent.purchaseValue.agreement = list[sIndex];
        				if(_parent.purchaseValue.agreement.code == "NONE"){
        					_parent.infoComp.changePurchaseOption(W.Texts["none_agreement"]);
            			}else{
            				var text = util.getAgreementTitle(_parent.purchaseValue.agreement);
            				_parent.infoComp.changePurchaseOption(text.substr(0, text.indexOf("(")));
            			}
        				_parent.infoComp.changePrice();
    				}
    			}
            	break;
			}
			return isResume;
		};
		
		this.onPopupClosed = function(popup, desc) {
    		W.log.info(desc);
        	if (desc) {
        		W.log.info(desc);
        		if (desc.popupName == "popup/purchase/SelectCouponPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				_parent.purchaseValue.coupon = desc.coupon;
        				coupons[dIndex].checked = true;
						_comp._coupons[dIndex]._check.setStyle({display:"block"});
						var price = changePrice();
						if(price == 0){
    						_parent.goInfoComp();
    					}else{
    						if(W.Coupon.totalBalanceAmount > 0){
    							unFocus();
    							if(coupons.length == 1){
    								isDiscount = false;
    			    				index = 0;
    			    				_comp._discount_title.setStyle({textColor:"rgba(255,255,255,0.5)"});
    			    				_comp._payment_title.setStyle({textColor:"rgb(255,255,255)"});
    							}else{
        	    					dIndex = 1;
    							}
    	    					focus();
    						}else{
    							unFocus();
    							isDiscount = false;
			    				index = 0;
			    				_comp._discount_title.setStyle({textColor:"rgba(255,255,255,0.5)"});
			    				_comp._payment_title.setStyle({textColor:"rgb(255,255,255)"});
    			    			focus();
    						}
    					}
						
						if(desc.needFeedback){
							W.PopupManager.openPopup({
	                            childComp:_this,
	                            popupName:"popup/FeedbackPopup",
	                            title:W.Texts["purchase_guide4"]}
	                        );
						}
        			}
    			}else if (desc.popupName == "popup/purchase/TermsPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				W.log.info(desc);
        				if(desc.type == "MOBILE_TERMS"){
        					var popup = {
                				popupName:"popup/purchase/MobileInputPopup",
                				contents:_parent.purchaseValue,
                				price:_parent.infoComp.getPrice(),
                				type:"VOD",
                				childComp:this
                			};
            	    		W.PopupManager.openPopup(popup);
        				}else if(desc.type == "TVPAY_TERMS"){
        					var popup = {
                				popupName:"popup/purchase/TvPaySelectPopup",
                				contents:_parent.purchaseValue,
                				price:_parent.infoComp.getPrice(),
                				type:"VOD",
                				childComp:this
                			};
            	    		W.PopupManager.openPopup(popup);
        				}else{
        					var popup = {
                				popupName:"popup/purchase/MobileInputSimplePopup",
                				contents:data,
                				price:_parent.infoComp.getPrice(),
                				childComp:this
                			};
            	    		W.PopupManager.openPopup(popup);
        				}
        				
        			}
    			}else if (desc.popupName == "popup/purchase/MobileInputPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				W.log.info(desc);
        				if(desc.result){
        					if(desc.data.res_code == "0000"){
            					_parent.purchaseValue.mobileNumber = desc.reqData.LGD_MOBILENUM;
                				var popup = {
                    				popupName:"popup/purchase/MobileConfirmPopup",
                    				reqData:desc.reqData,
                    				mobilePurchaseInfo:desc.data,
                    				price:_parent.infoComp.getPrice(),
                    				childComp:this
                    			};
                	    		W.PopupManager.openPopup(popup);
        					}else{
        						W.PopupManager.openPopup({
        	                        childComp:this,
        	                        type:"MOBILE_INPUT",
        	                        popupName:"popup/ErrorPopup",
        	                        code:desc.data.res_code,
        	                        message:[desc.data.res_msg],
        							from : "MOBILE"}
        	                    );
        					}
        				}
        			}
    			}else if (desc.popupName == "popup/purchase/MobileConfirmPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				if(desc.data.res_code == "0000"){
        					_parent.purchaseValue.mobilePurchaseResult = desc.data;
        					_parent.purchase();
    					}else{
    						W.PopupManager.openPopup({
    	                        childComp:this,
    	                        popupName:"popup/ErrorPopup",
    	                        code:desc.data.res_code,
    	                        message:[desc.data.res_msg],
    							from : "MOBILE"}
    	                    );
    					}
        			}
    			}else if (desc.popupName == "popup/purchase/TvPointPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
//        				if(desc.data.resultCode == "0000"){
//        					_parent.purchaseValue.tvpointResult = desc.data;
//        					_parent.purchase();
//        				}else{
//            				var popup = {
//	            				popupName:"popup/purchase/PurchaseFailPopup",
//	            				data:_parent.purchaseValue,
//	            				type:"TV_POINT",
//	            				childComp:this
//	            			};
//	        	    		W.PopupManager.openPopup(popup);
//        				}

        				if(desc.data.resultCode == "0000"){
        					_parent.purchaseValue.tvpointResult = desc.data;
        					_parent.purchase();
        				}else if(desc.data.resultCode == "3997"){
            				var popup = {
	            				popupName:"popup/purchase/PurchaseFailPopup",
	            				data:_parent.purchaseValue,
	            				type:"TV_POINT",
	            				paymentCode:desc.paymentCode,
	            				childComp:this
	            			};
	        	    		W.PopupManager.openPopup(popup);
        				}else{
        					W.PopupManager.openPopup({
    	                        childComp:this,
    	                        popupName:"popup/ErrorPopup",
    	                        code:desc.data.resultCode,
    	                        message:[desc.data.resultMessage],
    							from : "TVPOINT"}
    	                    );
        				}
        			}else{
        				if(desc.error){
        					W.PopupManager.openPopup({
    	                        childComp:this,
    	                        popupName:"popup/ErrorPopup",
    	                        code:desc.error.resultCode,
    	                        message:[desc.error.resultMessage],
    							from : "TVPOINT"}
    	                    );
        				}
        			}
    			}else if (desc.popupName == "popup/purchase/TvPaySelectPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				var reqData = {};
        				reqData.price = _parent.infoComp.getPrice();
        				reqData.goodsName = encodeURIComponent(_parent.purchaseValue.product.title);
        				reqData.billType = desc.billType;
        				reqData.orderNo = W.StbConfig.accountId + util.getDateFormat("yyyyMMddHHmmss");
        				
        				_parent.purchaseValue.tvpayInfo = reqData;
        				
        				tvPayDataManager.requestQRURL(function(result, data){
        					W.log.info(data);
        					if(result && data.result == "0000"){
        						_parent.purchaseValue.qrUrl = data.resultMessage;
        						var popup = {
    	            				popupName:"popup/purchase/TvPayQrCodePopup",
    	            				url:_parent.purchaseValue.qrUrl,
    	            				orderNo:_parent.purchaseValue.tvpayInfo.orderNo,
    	            				childComp:_this
    	            			};
    	        	    		W.PopupManager.openPopup(popup);
        					}else{
        						W.PopupManager.openPopup({
        	                        childComp:_this,
        	                        title:"Error",
        	                        popupName:"popup/AlertPopup",
        	                        boldText:data.result,
        	                        thinText:data.resultMessage}
        	                    );
        					}
        				}, reqData);
        			}
    			}else if (desc.popupName == "popup/purchase/PurchaseFailPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK){
        				if(desc.type == "TV_POINT"){
//        					var popup = {
//                				popupName:"popup/purchase/TvPointPopup",
//                				data:_parent.purchaseValue,
//                				childComp:this
//                			};
        					var popup = {
                				popupName:"popup/purchase/TvPointPopup",
                				data:_parent.purchaseValue,
                				paymentCode: desc.paymentCode,
                				price:_parent.infoComp.getPrice(),
                				childComp:this
                			};
        				}else{
        					var popup = {
                				popupName:"popup/purchase/TvPayQrCodePopup",
	            				url:_parent.purchaseValue.qrUrl,
	            				orderNo:_parent.purchaseValue.tvpayInfo.orderNo,
                				childComp:this
                			};
        				}
        	    		W.PopupManager.openPopup(popup);
        			}
    			}else if (desc.popupName == "popup/purchase/PurchaseCompletePopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				_parent.playVod();
        			}
    			}else if (desc.popupName == "popup/purchase/MobileInputSimplePopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				var popup = {
            				popupName:"popup/purchase/TvPayConfirmPopup",
            				phoneNum:desc.phoneNum,
            				childComp:this
            			};
        	    		W.PopupManager.openPopup(popup);
        			}
    			}else if (desc.popupName == "popup/purchase/TvPayConfirmPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				var popup = {
            				popupName:"popup/purchase/PurchaseCompletePopup",
            				contents:_parent.param.data[sIndex],
            				childComp:this
            			};
        	    		W.PopupManager.openPopup(popup);
        			}
    			}else if (desc.popupName == "popup/purchase/TvPayQrCodePopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
//        				_parent.purchaseValue.tvpayResult = desc.data;
//        				_parent.purchase();
        				if(desc.data.result == "0000"){
            				_parent.purchaseValue.tvpayResult = desc.data;
            				_parent.purchase();
        				}else if(desc.data.result == "9500"){
        					var popup = {
	            				popupName:"popup/purchase/PurchaseFailPopup",
	            				data:_parent.purchaseValue,
	            				type:"TV_PAY",
	            				childComp:this
	            			};
	        	    		W.PopupManager.openPopup(popup);
        				}else{
        					W.PopupManager.openPopup({
    	                        childComp:this,
    	                        title:"Error",
    	                        popupName:"popup/AlertPopup",
    	                        boldText:desc.data.result,
    	                        thinText:desc.data.resultMessage}
    	                    );
        				}
        			}else{
        				if(desc.error){
        					W.PopupManager.openPopup({
    	                        childComp:this,
    	                        title:"Error",
    	                        popupName:"popup/AlertPopup",
    	                        boldText:desc.error.result,
    	                        thinText:desc.error.resultMessage}
    	                    );
        				}
        			}
    			}else if (desc.popupName == "popup/purchase/SubscribedGuidePopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				_parent.purchaseValue.agreement = list[sIndex];
        				if(_parent.purchaseValue.agreement.code == "NONE"){
        					_parent.infoComp.changePurchaseOption(W.Texts["none_agreement"]);
            			}else{
            				var text = util.getAgreementTitle(_parent.purchaseValue.agreement);
            				_parent.infoComp.changePurchaseOption(text.substr(0, text.indexOf("(")));
            			}
        				_parent.infoComp.changePrice();
        			}else{
        				_parent.backScene();
	    				if(_parent.param.callback){
	    					_parent.param.callback({result:"BACK"});
                    	}
        			}
    			}else if (desc.popupName == "popup/Alert") {
        			if (desc.type == "MOBILE_INPUT") {
        				var popup = {
            				popupName:"popup/purchase/MobileInputPopup",
            				contents:_parent.purchaseValue,
            				price:_parent.infoComp.getPrice(),
            				type:"VOD",
            				childComp:this
            			};
        	    		W.PopupManager.openPopup(popup);
        			}
    			}
        		
			}
        };
		
		
	};

	return SelectComp;
});