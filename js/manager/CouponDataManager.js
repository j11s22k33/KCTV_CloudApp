//@preDefine
/**
 * manager/CouponDataManager
 */
W.defineModule("manager/CouponDataManager", function() {
	
	W.log.info("define CouponDataManager");

	var xhr = W.getClass('XHRManager');
	

	var loadingQueue = [];

	var send = function (options, loadingVisible, type) {
		// options property -> async, api, postData, callback,
		// reqType,
		// postData,
		// delayLoading, excuteLoading

		var typ = "get";
		if (options.reqType)
			typ = options.reqType;
		try {
			if(typ == "get"){
				if(options.reqData){
					var urlParam = "";
					var isFirst = true;
					for(var key in options.reqData){
						if(options.reqData[key] != undefined){
							if(isFirst){
								urlParam += "?" + key + "=" + options.reqData[key];
								isFirst = false;
							}else{
								urlParam += "&" + key + "=" + options.reqData[key];
							}
						}
					}
					options.url += urlParam;
				}
			}

			xhr
				.send({
					type: typ,
					async: options.async,
					url: options.url,
					data: options.reqType != "get" && options.reqData ? options.reqData : {},
					timeout: W.Config.SERVER_TIMEOUT,
					requestHeader: options.reqHeader,
					successCallback: function (success, result) {

						if(result){
							result = JSON.parse(result);
							
							if(options.url.indexOf("QueryCouponList") > 0 && W.Coupon){
								if(options.reqData.CouponGubun == "C"){
									var list1 = document.querySelectorAll(".coupon_count");
									W.Coupon.usableCouponNumber = result.UsableCouponNumber;
									if(list1 && list1.length > 0){
										var list2 = document.querySelectorAll(".coupon_countI");
										var list3 = document.querySelectorAll(".coupon_countT");
										
										for(var i=0; i < list1.length; i++){
											if(W.Coupon.coupons.length){
												list2[i].style.display = "inline-block";
												list2[i].style["marginLeft"] = "28px";
												list3[i].style.display = "inline-block";
												list1[i].innerText = W.Coupon.coupons.length + "장";
												list1[i].style.display = "inline-block";
											}else{
												list1[i].style.display = "none";
												list2[i].style.display = "none";
												list3[i].style.display = "none";
											}
										}
									}
								}else if(options.reqData.CouponGubun == "M"){
									var list1 = document.querySelectorAll(".coin_amount");
									W.Coupon.totalBalanceAmount = result.TotalBalanceAmount;
									if(list1 && list1.length > 0){
										var list2 = document.querySelectorAll(".coin_amountI");
										var list3 = document.querySelectorAll(".coin_amountT");
										var list4 = document.querySelectorAll(".coin_amountB");
										
										for(var i=0; i < list1.length; i++){
											if(W.Coupon.totalBalanceAmount){
												if(W.Coupon.coupons.length){
													list4[i].style.display = "inline-block";
													list2[i].style.display = "inline-block";
													list2[i].style["marginLeft"] = "10px";
												}else{
													list2[i].style.display = "inline-block";
													list2[i].style["marginLeft"] = "28px";
												}
												
												list3[i].style.display = "inline-block";
												list1[i].innerText = W.Util.formatComma(W.Coupon.totalBalanceAmount, 3) + "원";
												list1[i].style.display = "inline-block";
											}else{
												list1[i].style.display = "none";
												list2[i].style.display = "none";
												list3[i].style.display = "none";
												list4[i].style.display = "none";
											}
										}
									}
								}
							}
						} 
						if (options.callback) {
							options.callback(success,
								result, options.param, options.param2);
						}
					},
					errorCallback: function (success,
											 result) {
						if (options.callback) {
							options.callback(success,
								result, options.param, options.param2);
						}
					}
				});
		} catch (exception) {
			W.log.info("########### APIV4Handler ###########");
			W.log.info("## exception");
			W.log.info(exception);
			W.log.info("##########################################");

			if (options.callback) {
				options.callback(false, exception);
			}
		}
	};

	var loadingStart = function (delay, visible) {
		loadingStop();
		loading.prepare();
		delay = delay ? delay : 0;

		var obj = {
			timer: setTimeout(function () {
				loading.start(visible);
			}, delay),

			stop: function () {
				clearTimeout(this.timer);
				loading.stop();
			}
		}

		loadingQueue.push(obj);
	}
	var loadingStop = function () {
		var obj = loadingQueue.shift();
		if (obj) {
			loading.setLoadingText("loading..");
			obj.stop();
		}
	}

	return {
		issueCoupon: function (callback, reqData) {
			//PolicyID, TargetList(CustomerID, AccountID, MobileNumber, PrepayAmount)
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.OperatorID = "SYSTEM";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
//			reqData.AccountID = W.StbConfig.accountId;
			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/IssueCoupon",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},
		
		useCoupon: function (callback, reqData) {
			//TransactionID, SystemID, Password, OperatorID, AccountID, CouponList,
			//MacAddress, CustomerID, ProductID, ProductName, CatergoryID, CategoryName, ContentID, ContentName, SaleAmount
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;
			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/UseCoupon",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},
		
		cancelUseCoupon: function (callback, reqData) {
			//, , , , , CouponUseNumber, 
			//, CustomerID
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;
			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/CancelUseCoupon",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},
		
		queryPolicy: function (callback, reqData) {
			//TransactionID, SystemID, Password, OperatorID, BuyMethodGubun, 
			//MacAddress
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/QueryPolicy",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},
		
		queryCoupon: function (callback, reqData) {
			//TransactionID, SystemID, Password, OperatorID, UsableYN, 
			//MacAddress, CustomerID, AccountID,  CouponGubun
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/QueryCoupon",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},
		
		queryCouponList: function (callback, reqData) {
			//TransactionID, SystemID, Password, OperatorID, UsableYN, 
			//MacAddress, CustomerID, AccountID,  CouponGubun
			
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/QueryCouponList",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},
		
		queryUseCouponHistory: function (callback, reqData) {
			//TransactionID, SystemID, Password, OperatorID, StartDate, EndDate,
			//MacAddress, CustomerID, AccountID
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;
			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/QueryUseCouponHistory",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		},

		registerManualCoupon: function (callback, reqData) {
			//TransactionID, SystemID, Password, OperatorID,
			//MacAddress, CustomerID, AccountID, ManualCouponID
			reqData.TransactionID = String(new Date().getTime());
			reqData.SystemID = "STB";
			reqData.OperatorID = "SYSTEM";
			reqData.MacAddress = W.StbConfig.macAddress;//"1abc04f1a073";
			reqData.Password = CryptoJS.HmacSHA256(reqData.SystemID, reqData.OperatorID+reqData.MacAddress).toString();
			//reqData.CustomerID = "";
			reqData.AccountID = W.StbConfig.accountId;
			var options = {
				async: true,
				url: W.Config.COUPON_URL + "api/RegisterManualCoupon",
				callback: callback,
				reqType: "POST",
				reqData: reqData
			};

			return send(options);
		}
	};

});