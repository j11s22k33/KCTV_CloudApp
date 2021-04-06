W.defineModule(["mod/Util", "manager/TvPayDataManager", "manager/TvPointDataManager", "manager/MobilePurchaseDataManager"], 
		function(util, tvPayDataManager, tvPointDataManager, mobileDataManager) {

	function PurchaseComp(parent){
		var sdpDataManager = W.getModule("manager/SdpDataManager");
		var _this; 
		var callbackFunction;
		
		function createPayments(method, total){
			var price = Math.round(total/(1 + W.Config.VAT_RATE));
			var vat = total - price;
			return {payMethod:method, payAmount:price, payVAT:vat};
		};
		
		function getPayments(data, payments, totalPrice){
			if(data.paymentOption.type == "bill"){
				if(data.product.productType == "EXCIDT" || data.product.productType == "EXCISS"){
					payments.push({payMethod:"bill", payAmount:data.product.listPrice, payVAT:Math.floor(data.product.listPrice * W.Config.VAT_RATE)});
				}else{
					payments.push(createPayments(data.paymentOption.type, totalPrice));
				}
			}else if(data.paymentOption.type == "mobile"){
				var payment = createPayments(data.paymentOption.type, totalPrice);
				payment.paymentId = data.mobilePurchaseResult.LGD_TID;
				payment.paymentInfo = data.mobileNumber;
				payments.push(payment);
			}else if(data.paymentOption.type == "tvpay"){
				var payment = createPayments(data.paymentOption.type, totalPrice);
				payment.paymentId = data.tvpayResult.tid;
				payment.billType = data.tvpayInfo.billType;
				payments.push(payment);
			}else if(data.paymentOption.type == "tvpoint"){
				var payment = createPayments(data.paymentOption.type, totalPrice);
				payment.paymentId = data.tvpointResult.paymentCode;
				payments.push(payment);
			}
		};
		
		function purchaseTier(data){
			W.log.info(data);
			var reqData = {productId:data.product.productId};
			reqData.listPrice = data.product.listPrice;
			var vatPrice = util.vatPrice(data.product.listPrice);
			if(data.agreement && data.agreement.code != "NONE"){
				if(data.agreement.discountAmt){
					vatPrice = vatPrice - data.agreement.discountAmt;
				}else if(data.agreement.discountRate){
					vatPrice = vatPrice * (data.agreement.discountRate / 100);
				}
				reqData.agreementCode = data.agreement.code;
			}
			var price = Math.floor(vatPrice/(1 + W.Config.VAT_RATE));
			var vat = vatPrice - price;
			
			reqData.price = price;
			reqData.payVAT = vat;

			W.log.info(reqData);
			
			W.Loading.start();
			sdpDataManager.purchaseTier(function(result, data){
				W.log.info(result);
				W.log.info(data);
				if(callbackFunction){
					callbackFunction(result, data);
				}
				W.Loading.stop();
        	}, reqData);
		};
		

		this.purchase = function(callback, data, purchaseTotalPrice){
			_this = this;
			W.log.info(data);
			W.log.info(callback);
			callbackFunction = callback;
			
			if(data.product.packageType == "TR"){
				purchaseTier(data);
			}else{
				var reqData = {};
				var price = util.getPrice(data.product);
				reqData.product = {};
				reqData.product.productId = data.product.productId;
				if(data.agreement && data.agreement.code != "NONE"){
					reqData.product.agreementCode = data.agreement.code;
				}
				
				if(data.asset){
					reqData.product.source = data.asset.assetId;
				}
				var payments = [];
				var coupons = [];
				
				if(data.product.coupons && data.product.coupons.length > 0){
					for(var i=0; i < data.product.coupons.length; i++){
						if(data.product.coupons[i]){
							var couponPrice = util.vatPrice(data.product.listPrice);
							W.log.info(couponPrice);
							var tmpPrice = 0;
							if(data.product.coupons[i].amount.unit == "rate"){
								tmpPrice = couponPrice * (data.product.coupons[i].amount.value / 100);
							}else{
								tmpPrice = data.product.coupons[i].amount.value;
							}
							if(tmpPrice > 0){
								
							}else{
								couponPrice -= tmpPrice;
							}
							
							W.log.info(couponPrice);
							var coupon = {couponNo:data.product.coupons[i].couponNo, issueType:"NOW", discountPrice:tmpPrice};
							coupons.push(coupon);
							if(tmpPrice > 0){
								break;
							}
						}
					}
				}
				if(price > 0){
					if(data.coupon){
						var couponPrice;
						if(data.coupon.DCGubun == "R"){
							couponPrice = Math.round(price * (Number(data.coupon.DCValue) / 100));
						}else{
							var dcPrice = 0;
							if(data.coupon.DCGubun){
								dcPrice = Number(data.coupon.DCValue);
							}else{
								dcPrice = data.coupon.BalanceAmount;
							}
							
							if(price > dcPrice){
								couponPrice = dcPrice;
							}else{
								couponPrice = price;
							}
						}
						price -= couponPrice;
						
						var coupon = {couponNo:data.coupon.CouponID, issueType:"CPN", discountPrice:couponPrice};
						coupons.push(coupon);
					}
					
					if(data.useCoin){
						for(var i=0; i < W.Coupon.coins.length; i++){
							if(price <= W.Coupon.coins[i].BalanceAmount){
								var payment = {payMethod:"coin", payAmount:price, payVAT:0};
								payment.paymentInfo = W.Coupon.coins[i].CouponID;
								payments.push(payment);
								price = 0;
								break;
							}else{
								var payment = {payMethod:"coin", payAmount:W.Coupon.coins[i].BalanceAmount, payVAT:0};
								payment.paymentInfo = W.Coupon.coins[i].CouponID;
								payments.push(payment);
								price -= W.Coupon.coins[i].BalanceAmount;
							}
						}
					}
					
					if(price > 0){
						getPayments(data, payments, price);
					}
				}

				var purchasePrice = 0;
				if(coupons.length > 0){
					reqData.coupons = coupons;
					for(var i=0; i < coupons.length; i++){
						purchasePrice += coupons[i].discountPrice;
					}
				}
				
				if(payments.length > 0){
					reqData.payments = payments;
					for(var i=0; i < payments.length; i++){
						purchasePrice += payments[i].payAmount;
					}
				}
				
				reqData.device = {};
				if(data.paymentOption.type == "mobile" && data.mobileNumber){
					reqData.device.deviceId = data.mobileNumber;
					reqData.contact = {};
					reqData.contact.telephone = data.mobileNumber;
				}
				reqData.device.deviceType = "stb";
				
				reqData.product.listPrice = data.product.listPrice;
				reqData.product.price = purchasePrice;
				
				reqData.lang = W.StbConfig.menuLanguage;
				var entryInfo = W.entryPath.getPath();
				reqData.entryPath = entryInfo.path;
				if(entryInfo.categoryId){
					reqData.categoryId = entryInfo.categoryId;
				}
				
				W.log.info(JSON.stringify(reqData));

				W.Loading.start();
				sdpDataManager.purchaseProduct(function(result, data2){
					W.Loading.stop();
					if(result){
						W.getCoupon();
					}else{
						if(data.paymentOption.type == "mobile" || data.paymentOption.type == "tvpay" || data.paymentOption.type == "tvpoint"){
							_this.cancelPurchase(undefined, data);
						}
					}
					callback(result, data2);
	        	}, reqData);
			}
		};
		
		this.cancelPurchase = function(callback, data){
			W.log.info(data);

			var reqData={};
			if(data.paymentOption.type == "mobile" && data.mobilePurchaseResult){
				reqData.LGD_TID = data.mobilePurchaseResult.LGD_TID;
				mobileDataManager.requestCancel(function(result, data){
					W.log.info(result);
					W.log.info(data);
					if(result && data.result == "0000"){
						if(callback){
							callback(true, data);
						}
					}else{
						if(callback){
							callback(false, data);
						}
					}
				}, reqData);
			}else if(data.paymentOption.type == "tvpay"){
				reqData.tid = data.tvpayResult.tid;
				reqData.approvalNo = data.tvpayResult.approvalNo;
				reqData.type = 0;//0:취소, 1:부분취소
				reqData.amount = util.vatPrice(data.product.price);
				
				tvPayDataManager.cancelPayment(function(result, data){
					W.log.info(result);
					W.log.info(data);
					if(result && data.result == "0"){
						if(callback){
							callback(true, data);
						}
					}else{
						if(callback){
							callback(false, data);
						}
					}
				}, reqData);
			}else if(data.paymentOption.type == "tvpoint"){
				reqData.param1 = data.tvpointResult.approvalNo;
				tvPointDataManager.cancelPayment(function(result, data){
					W.log.info(result);
					W.log.info(data);
					if(result && data.result == "0000"){
						if(callback){
							callback(true, data);
						}
					}else{
						if(callback){
							callback(false, data);
						}
					}
				}, reqData);
			}
		};
	};

	return PurchaseComp;
});