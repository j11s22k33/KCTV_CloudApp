/**
 * manager/MobilePurchaseDataManager
 */
W.defineModule("manager/MobilePurchaseDataManager", function() {
	
	W.log.info("define MobilePurchaseDataManager");
	
	var xhr = W.getClass('XHRManager');

	var loadingQueue = [];
	var TYPE = {TVPAY : 0, USER : 1, PAY : 2};
	var CST_PLATFORM = "service"; //service, test

	var send = function (options, loadingVisible, type) {
		options.reqHeader = {};
		options.reqHeader["Content-Type"] = "application/x-www-form-urlencoded";

		try {
			var urlParam;
			if(options.reqData){
				var isFirst = true;
				for(var key in options.reqData){
					if(options.reqData[key] != undefined){
						if(isFirst){
							urlParam = key + "=" + options.reqData[key];
							isFirst = false;
						}else{
							urlParam += "&" + key + "=" + options.reqData[key];
						}
					}
				}
			}
			W.log.info("urlParam === " + urlParam);
			options.url += urlParam ? "?" + urlParam : "";
			
			var tokenTryCount = 0;

			var sendObject = {
				type: "POST",
				async: options.async,
				url: options.url,
				timeout: W.Config.SERVER_TIMEOUT,
				requestHeader: options.reqHeader,
				successCallback: function (success, result) {
					if(result) result = JSON.parse(result);
					if (options.callback) {
						options.callback(success,
							result, options.param, options.param2);
					}
				},
				errorCallback: function (success, result) {
					try{
						if(result) result = JSON.parse(result);
						if (options.callback) {
							options.callback(success, result, options.param, options.param2);
						}
					}catch(ex){
						if (options.callback) {
							options.callback(success, undefined, options.param, options.param2);
						}
					}
					
				}
			};
			
			sendObject.data = options.reqData;

			xhr.send(sendObject);
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
		
		//인증
		requestCertification: function (callback, reqData, param, param2) {
			//, , LGD_OID, LGD_AMOUNT, LGD_MOBILECOM, LGD_MOBILENUM, 
			//LGD_MOBILESSN, LGD_BUYER, LGD_PRODUCTINFO, LGD_BUYEREMAIL
			
			reqData.CST_PLATFORM = CST_PLATFORM;
			reqData.CST_MID = "kctvjeju";
			reqData.LGD_STEP = "step1";
			reqData.LGD_BUYER = W.StbConfig.accountId;
			reqData.LGD_BUYEREMAIL = "kctv_dtv@kctvjeju.com";

			var options = {
				async: true,
				url: W.Config.MOBILE_PURCHASE_URL,
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//승인 요청
		requestOk: function (callback, reqData, param, param2) {
			//, , LGD_AMOUNT, LGD_TID, LGD_AUTHNUMBER
			reqData.CST_PLATFORM = CST_PLATFORM;
			reqData.CST_MID = "kctvjeju";
			reqData.LGD_STEP = "step2";

			var options = {
				async: true,
				url: W.Config.MOBILE_PURCHASE_URL,
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//승인 요청
		requestCancel: function (callback, reqData, param, param2) {
			//, , LGD_TID
			reqData.CST_PLATFORM = CST_PLATFORM;
			reqData.CST_MID = "kctvjeju";
			reqData.LGD_STEP = "cancel";

			var options = {
				async: true,
				url: W.Config.MOBILE_PURCHASE_URL,
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		}
	};
});