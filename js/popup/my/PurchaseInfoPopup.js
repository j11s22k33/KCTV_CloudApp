/**
 * popup/PurchaseInfoPopup
 */
W.defineModule(["comp/PopupButton", "mod/Util"], function(buttonComp, util) {
	'use strict';
	W.log.info("PurchaseInfoPopup");
	var _comp;
	var timeout;
	var _this;
	var paymentsList;
	
	function getPayType(type){
		var payType = undefined;
		if(type == "bill"){
			payType = W.Texts["payment_normal"];
		}else if(type == "mobile"){
			payType = W.Texts["payment_mobile"];
		}else if(type == "tvpay"){
			payType = W.Texts["payment_tvpay"];
		}else if(type == "tvpoint"){
			payType = W.Texts["payment_tvpoint"];
		}else if(type == "coupon"){
			payType = W.Texts["payment_coupon"];
		}else if(type == "coin"){
			payType = W.Texts["payment_coin"];
		}
		return payType;
	};

	return W.Popup.extend({
		onStart: function(_param) {
			W.log.info("PurchaseInfoPopup onStart");
			_this = this;
			W.log.info(_param);
			if(_comp){
				this.remove(_comp);
			}
			this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

			_comp = new W.Div({className:"bg_size popup_bg_color popup_bg_flex"});
			this.add(_comp);
			
			paymentsList = Object.assign([], _param.data.payments);
			
			if(paymentsList){
				for(var i=0; i < paymentsList.length; i++){
					if(paymentsList[i].isCouponUsed){
						if(_param.data.product){
							var obj = {payMethod:"coupon"};
							obj.payAmount = _param.data.product.listPrice - paymentsList[i].payAmount;
							paymentsList.push(obj);
							break;
						}else {
							if(_param.data.asset){
								var obj = {payMethod:"coupon"};
								if(paymentsList[i].payVat != undefined){
									obj.payAmount = util.vatPrice(_param.data.asset.listPrice) - paymentsList[i].payAmount - paymentsList[i].payVat;
								}else{
									obj.payAmount = util.vatPrice(_param.data.asset.listPrice) - paymentsList[i].payAmount;
								}
								paymentsList.push(obj);
								break;
							}
						}
					}
				}
			}

			_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
			_comp.add(_comp._popup);

			_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:60, text:W.Texts["more_detail"], lineHeight:"60px", className:"cut",
				"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginTop:"8px"});
			_comp._popup.add(_comp._popup._title);
			
			_comp._popup._boldText = new W.Div({position:"relative", "max-width":"800px", text:_param.data.asset ? _param.data.asset.title : _param.data.product.title,
				lineHeight:"30px", className:"cut", fontFamily:"RixHeadM", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", textColor:"#FFFFFF", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px", marginBottom:"10px"});
			_comp._popup.add(_comp._popup._boldText);

			_comp._popup.add(new W.Div({x:0,y:110,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));

			_comp._popup._thinText1 = new W.Div({position:"relative", "max-width":"800px", 
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"10px", marginTop:"20px"
				});
			_comp._popup._thinText1.add(new W.Span({position:"relative", text:W.Texts["popup_purchase_info_date"], display:"contents", textColor:"#EDA802"}));
			_comp._popup._thinText1.add(new W.Span({position:"relative", text:" : " + util.getDateFormat("yyyy.MM.dd", new Date(_param.data.purchasedAt)), 
				display:"contents", textColor:"rgba(181,181,181,0.75)"}));
			_comp._popup.add(_comp._popup._thinText1);
			
			if(_param.data.payment){
				var payType = getPayType(_param.data.payment.payMethod);
				_comp._popup._thinText1 = new W.Div({position:"relative", "max-width":"800px", 
					lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
					"white-space":"pre", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"10px",
					});
				_comp._popup._thinText1.add(new W.Span({position:"relative", text:payType, display:"contents", textColor:"#EDA802"}));
				_comp._popup._thinText1.add(new W.Span({position:"relative", text:" : " + W.Util.formatComma(_param.data.payment.payAmount, 3) + W.Texts["price_unit"], 
					display:"contents", textColor:"rgba(181,181,181,0.75)"}));
				_comp._popup.add(_comp._popup._thinText1);
			}else if(paymentsList){
				for(var i=0; i < paymentsList.length; i++){
					var payType = getPayType(paymentsList[i].payMethod);
					if(payType){
						var amount = paymentsList[i].payAmount;
						if(paymentsList[i].payVat != undefined){
							amount += paymentsList[i].payVat;
						}
						_comp._popup._thinText1 = new W.Div({position:"relative", "max-width":"800px", 
							lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
							"white-space":"pre", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"10px",
							});
						_comp._popup._thinText1.add(new W.Span({position:"relative", text:payType, display:"contents", textColor:"#EDA802"}));
						_comp._popup._thinText1.add(new W.Span({position:"relative", text:" : " + W.Util.formatComma(amount, 3) + W.Texts["price_unit"], 
							display:"contents", textColor:"rgba(181,181,181,0.75)"}));
						_comp._popup.add(_comp._popup._thinText1);
					}
				}
			}

			_comp._popup._thinText2 = new W.Div({position:"relative", "max-width":"800px", 
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"10px",
				});
			_comp._popup._thinText2.add(new W.Span({position:"relative", text:W.Texts["popup_purchase_info_expire"], display:"contents", textColor:"#EDA802"}));
			_comp._popup._thinText2.add(new W.Span({position:"relative", text:" : " + W.Texts["until"].replace("@until@", util.getDateFormat("yyyy.MM.dd", new Date(_param.data.expiresAt))), 
				display:"contents", textColor:"rgba(181,181,181,0.75)"}));
			_comp._popup.add(_comp._popup._thinText2);

			_comp._popup._btns = new W.Div({position:"relative", "max-width":"800px", height:41, marginTop:"15px"});
			_this.btn = buttonComp.create(0, 0, W.Texts["close"], 133);
			_this.btn.getComp().setStyle({position:"relative", "float":"left", marginLeft:"4px", marginRight:"4px"});
			_comp._popup._btns.add(_this.btn.getComp());
			_comp._popup.add(_comp._popup._btns);
			_this.btn.focus();
		},
		onStop: function() {
			W.log.info("PurchaseInfoPopup onStop");
		},
		onKeyPressed : function(event) {
			W.log.info("PurchaseInfoPopup onKeyPressed "+event.keyCode);
			switch(event.keyCode) {
				case W.KEY.BACK:
				case W.KEY.EXIT:
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
					break;
				case W.KEY.ENTER:
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
					break;
				case W.KEY.RIGHT:
					break;
				case W.KEY.LEFT:
					break;
				case W.KEY.UP:
					break;
				case W.KEY.DOWN:
					break;
			}
		}
	});
});