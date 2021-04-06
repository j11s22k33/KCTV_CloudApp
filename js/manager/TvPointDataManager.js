/**
 * manager/TvPointDataManager
 */
W.defineModule("manager/TvPointDataManager", ["mod/Util"], function(util) {
	
	W.log.info("define TvPointDataManager");
	
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
		createPaymentCode: function (callback, reqData) {
			//param4 :상품아이디
			//param5 :상품명, UTF-8 로 UrlEncoding 필요
			//param6 :거래금액
			
			reqData.param1 = W.StbConfig.accountId;
			reqData.param2 = W.Config.TV_POINT_DEV_TYPE;
			reqData.param3 = W.Config.TV_POINT_FRAN_CODE;
			reqData.param7 = W.StbConfig.accountId + String(new Date().getTime()); //상점의 주문번호
			reqData.param8 = util.getDateFormat("yyyy-MM-dd HH:mm:ss");

			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/issue.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		verifyPayment: function (callback, reqData) {
			//param1 :결제 코드
			
			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/verify.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		approvePayment: function (callback, reqData) {
			//param1 :결제 코드
			//param2 :티비허브 사용자번호
			
			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/approve.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		confirmPayment: function (callback, reqData) {
			//param1 :결제 코드
			reqData.param2 = W.StbConfig.accountId;
			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/confirm.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		deletePaymentCode: function (callback, reqData) {
			//param1 :결제 코드

			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/delete.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		cancelPayment: function (callback, reqData) {
			//param1 :approvalNo, 결제 완료 후 확인한 승인번호

			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/cancelPayment.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		undoPayment: function (callback, reqData) {
			//param1 :결제 코드

			var options = {
				async: true,
				url: W.Config.TV_POINT_URL + "payment/undoPayment.tvp",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		}
	};
});