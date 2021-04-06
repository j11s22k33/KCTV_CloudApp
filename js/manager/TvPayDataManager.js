/**
 * manager/TvPayDataManager
 */
W.defineModule("manager/TvPayDataManager", ["mod/Util"], function(util) {
	
	W.log.info("define TvPayDataManager.js");
	
	var xhr = W.getClass('XHRManager');
	var loadingQueue = [];

	var send = function (options, loadingVisible, type) {
		// options property -> async, api, postData, callback,
		// reqType,
		// postData, 
		// delayLoading, excuteLoading
		W.Loading.start();
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
					timeout: W.Config.TV_HUB_TIMEOUT,
					requestHeader: options.reqHeader,
					successCallback: function (success,
											   result) {

						if(result) result = JSON.parse(result);
						if (options.callback) {
							options.callback(success,
								result, options.param, options.param2);
						}
						W.Loading.stop();
					},
					errorCallback: function (success,
											 result) {
						if (options.callback) {
							options.callback(success,
								result, options.param, options.param2);
						}
						W.Loading.stop();
					}
				});
		} catch (exception) {
			W.log.info("########### APIV4Handler ###########");
			W.log.info("## exception");
			W.log.info(exception);
			W.log.info("##########################################");
			W.Loading.stop();

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
		requestQRURL: function (callback, reqData) {
			//price, goodsName, billType, orderNo

			reqData.scId = W.StbConfig.accountId;
			reqData.pMid = W.Config.TV_PAY_PMID;
			reqData.storeId = W.Config.TV_PAY_STORE_ID;
			reqData.language = W.StbConfig.menuLanguage;
			reqData.issuer = encodeURIComponent(W.StbConfig.userName);

			var options = {
				async: true,
				url: W.Config.TV_PAY_URL + "web/view/mobile/QrRequest.mv",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		methodRequest: function (callback, reqData) {
			reqData = {};
			reqData.storeId = W.Config.TV_PAY_STORE_ID;
			reqData.termType = "MOBILE";
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.TV_PAY_URL + "web/view/mobile/methodRequest.mv",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},

		approvePayment: function (callback, reqData) {
			//orderNo
			var options = {
				async: true,
				url: W.Config.TV_PAY_URL + "ext/app/approval.mv",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},

		cancelPayment: function (callback, reqData) {
			//tid, approvalNo, type, amount

			var options = {
				async: true,
				url: W.Config.TV_PAY_URL + "/ext/cancelPay.mv",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		}
	};
});