//@preDefine
/**
 * manager/UiPlfDataManager
 */
W.defineModule("manager/UiPlfDataManager", function() {
	
	W.log.info("define UiPlfDataManager");
	
	var xhr = W.getClass('XHRManager');

	var loadingQueue = [];
	var TYPE = {TVPAY : 0, USER : 1, PAY : 2};

	var send = function (options, loadingVisible, type) {
		// options property -> async, api, postData, callback,
		// reqType,
		// param,
		// delayLoading, excuteLoading
		
		if(!options.reqHeader){
			options.reqHeader = {};
		}
		if(!options.reqHeader["Content-Type"]){
			options.reqHeader["Content-Type"] = "application/json";
		}
		//options.reqHeader["X-Client-App-Key"] = W.Config.CLIENT_APP_KEY;
		//options.reqHeader["Authorization"] = "Bearer " + W.StbConfig.accessToken;
		
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
					//requestHeader: options.reqHeader,
					successCallback: function (success,
											   result) {

						if(result) result = JSON.parse(result);
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
		//UIF-001: 홈메뉴프로모션리스트조회
		getPromotionList: function (callback, reqData, param) {
			//targetId, offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;
			reqData.groupId = W.StbConfig.groupId;
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getPromotionList.json",
				callback: callback,
				reqData: reqData,
				param: param
			};

			return send(options);
		},
		
		//UIF-002: For You 5영역 프로모션리스트조회
		getPromotionForYou5List: function (callback, reqData, param) {
			//offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getPromotionForYou5List.json",
				callback: callback,
				reqData: reqData,
				param: param
			};

			return send(options);
		},
		
		//UIF-003: For You 6영역 프로모션리스트조회
		getPromotionForYou6List: function (callback, reqData) {
			//offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getPromotionForYou6List.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-004: 채널VOD 리스트조회
		getChvodList: function (callback, reqData) {
			//sourceId, offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getChvodList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-005: 리스트배너리스트조회
		getListBannerList: function (callback, reqData) {
			//targetId, offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getListBannerList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-006: 상품관 리스트조회
		getProductAreaList: function (callback, reqData, param) {
			//targetId, tabIndex, offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getProductAreaList.json",
				callback: callback,
				reqData: reqData,
				param: param
			};

			return send(options);
		},
		
		//UIF-007: 배경화면리스트조회
		getBackgroundList: function (callback, reqData) {
			//tagId, offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getBackgroundList.json",
				callback: callback,
				reqData: reqData
			};

			if(W.Config.DEVICE == "PC"){
				callback(true, {total:1,
					data: [
					    {image1:"img/vod_promotion_bg__sample02.jpg"},
					]
				});
			}else{
				return send(options);
			}
		},
		
		//UIF-008: 4방향 – 우 방향
		getRightBannerList: function (callback, reqData) {
			//offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getRightBannerList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-009: 4방향 – 하 방향
		getBelowBannerList: function (callback, reqData) {
			//offset, limit
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "promotion/getBelowBannerList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-010: 공지사항목록조회
		getNoticeList: function (callback, reqData) {
			//offset, limit, ALL
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;
			reqData.groupId = W.StbConfig.groupId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "notice/getNoticeList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-011: 공지사항조회
		getNotice: function (callback, reqData) {
			//noticeId
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;
			reqData.groupId = W.StbConfig.groupId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "notice/getNotice.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-012: 데이터 방송목록조회
		getApplication: function (callback) {

			var reqData = {};
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "tvapp/getApplication.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-013: 약관상세조회
		getAgreement: function (callback, reqData) {
			//agreeId
			reqData.lang = W.StbConfig.menuLanguage;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "agreement/getAgreement.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-014:약관동의설정
		setAgreement: function (callback, reqData) {
			//subs_id, list, termsObj(agreeId), isAgree
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "agreement/setAgreement.json",
				callback: callback,
				reqType:"POST",
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-015: 결제수단조회
		getPaymentList: function (callback) {
			var reqData = {};
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.accountId = W.StbConfig.accountId;
			reqData.groupId = W.StbConfig.groupId;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "payment/list.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-016:CUG별 기본 정보조회
		getCugDefaultInfo: function (callback) {
			var reqData = {};
			reqData.groupId = W.StbConfig.groupId;
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "cug/getCugDefaultInfo.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-017:CUG별 시각 정보 조회
		getCugVisualtInfo: function (callback, reqData) {
			var reqData = {};
			reqData.groupId = W.StbConfig.groupId;
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "cug/getCugVisualInfo.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-018: CUG별 프로모션 조회
		getCugPromotionList: function (callback, reqData) {
			//targetId
			reqData.groupId = W.StbConfig.groupId;
			reqData.lang = W.StbConfig.menuLanguage;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "cug/getCugPromotionList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-019: CUG 공지사항목록조회
		getCugNoticeList: function (callback, reqData) {
			//offset, limit
			reqData.groupId = W.StbConfig.groupId;
			reqData.lang = W.StbConfig.menuLanguage;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "cug/getCugNoticeList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-020: CUG 공지사항조회
		getCugNotice: function (callback, reqData) {
			//noticeId
			reqData.groupId = W.StbConfig.groupId;
			reqData.lang = W.StbConfig.menuLanguage;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "cug/getCugNotice.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		},
		
		//UIF-021: CUG별 결제수단 조회
		getCugPaymentList: function (callback, reqData) {
			//noticeId
			reqData.groupId = W.StbConfig.groupId;
			reqData.lang = W.StbConfig.menuLanguage;

			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "cug/getCugPaymentList.json",
				callback: callback,
				reqData: reqData
			};

			return send(options);
		}
	};
});