/**
 * manager/SearchDataManager
 */
W.defineModule("manager/SearchDataManager", function() {
	
	W.log.info("define SearchDataManager");
	
	var xhr = W.getClass('XHRManager');

	var loadingQueue = [];
	var TYPE = {TVPAY : 0, USER : 1, PAY : 2};
	
	var getRating = function() {
		if(W.StbConfig.rating == 0) {
			return undefined;
		} else if(W.StbConfig.rating == 1) {
			return "0,7,12,15";
		} else if(W.StbConfig.rating == 2) {
			return "0,7,12";
		} else if(W.StbConfig.rating == 3) {
			return "0,7";
		} else if(W.StbConfig.rating == 4) {
			return "0";
		}
	}

	var send = function (options, loadingVisible, type) {
		// options property -> async, api, postData, callback,
		// reqType,
		// postData,
		// delayLoading, excuteLoading
		
		if(!options.reqHeader){
			options.reqHeader = {};
		}
		options.reqHeader["Authorization"] = "Bearer " + W.StbConfig.accessToken;

		var typ = "get";
		if (options.reqType)
			typ = options.reqType;
		try {
			if(options.postData){
				var urlParam = "";
				var isFirst = true;
				for(var key in options.postData){
					if(options.postData[key] != undefined){
						if(isFirst){
							urlParam += "?" + key + "=" + options.postData[key];
							isFirst = false;
						}else{
							urlParam += "&" + key + "=" + options.postData[key];
						}
					}
				}
				options.url += urlParam;
			}

			xhr
				.send({
					type: typ,
					async: options.async,
					url: options.url,
					data: options.reqType != "get" && options.postData ? options.postData : {},
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
						if(result) result = JSON.parse(result);
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
		search: function (callback, q, cat, offset, limit, sort, lang, p_rating, m_field, isWithoutAdult, param, param2) {
			var postData = {};
			postData.user_id = W.StbConfig.accountId;
			postData.group_id = W.StbConfig.groupId;
			postData.q = encodeURIComponent(q);
			if(cat) postData.cat = cat;
			if(offset) postData.offset = offset;
			if(limit) postData.limit = limit;
			if(sort) postData.sort = sort;
//			if(lang) postData.lang = lang; //다국어 검색 지원 안 함
			
//			if(p_rating){
//				postData.p_rating = p_rating;
//			}else{
//				var rating = getRating();
//				if(rating){
//					postData.p_rating = rating;
//				}
//			} 
			if(m_field) postData.m_field = m_field;
			
			if(W.StbConfig.adultMenuUse == 1 || W.StbConfig.adultMenuUse == 2 || isWithoutAdult){
				postData.with_adult = false;
			}else{
				postData.with_adult = true;
			}
			
			var options = {
				async: true,
				url: W.Config.SEARCH_URL + "search",
				callback: callback,
				postData: postData,
				param:param,
				param2:param2
			};

			return send(options);
		},
		
		complete: function (callback, q, limit) {
			var postData = {};
			postData.q = q;
			if(limit) postData.limit = limit;
//			postData.lang = W.StbConfig.menuLanguage; //다국어 지원 안 함
			
			var options = {
				async: true,
				url: W.Config.SEARCH_URL + "complete",
				callback: callback,
				postData: postData
			};

			return send(options);
		},
		
		popular: function (callback, offset, limit) {
			var postData = {};
			if(offset) postData.offset = offset;
			if(limit) postData.limit = limit;
			
			var options = {
				async: true,
				url: W.Config.SEARCH_URL + "keyword/popular",
				callback: callback,
				postData: postData
			};

			return send(options);
		},
		
		history: function (callback, offset, limit) {
			var postData = {};
			postData.user_id = W.StbConfig.accountId;
			if(offset) postData.offset = offset;
			if(limit) postData.limit = limit;
			
			var options = {
				async: true,
				url: W.Config.SEARCH_URL + "keyword/history",
				callback: callback,
				postData: postData
			};

			return send(options);
		},
		
		deleteHistory: function (callback) {
			var postData = {};
			postData.user_id = W.StbConfig.accountId;
			
			var options = {
				async: true,
				url: W.Config.SEARCH_URL + "keyword/history",
				callback: callback,
				reqType: "DELETE",
				postData: postData
			};

			return send(options);
		},
		
		deleteHistoryKeyword: function (callback, keyword) {
			var postData = {};
			postData.user_id = W.StbConfig.accountId;
			postData.q = keyword;
			
			var options = {
				async: true,
				url: W.Config.SEARCH_URL + "keyword/history",
				callback: callback,
				reqType: "DELETE",
				postData: postData
			};

			return send(options);
		}
	};
});