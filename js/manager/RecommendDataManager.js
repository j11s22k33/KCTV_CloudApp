//@preDefine
/**
 * manager/RecommendDataManager
 */
W.defineModule("manager/RecommendDataManager", function() {
	
	W.log.info("define RecommendDataManager");
	
	var xhr = W.getClass('XHRManager');

	var mediaCode = "mediaCode=qqq";
	var uk = "uk=aaa";
	var ip = "ip=ddd";

	var loadingQueue = [];
	var TYPE = {TVPAY : 0, USER : 1, PAY : 2};

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
			}

			xhr
				.send({
					type: typ,
					async: options.async,
					url: options.url,
					data: options.reqType != "get" && options.postData ? options.postData : {},
					timeout: W.Config.SERVER_TIMEOUT,
					requestHeader: options.reqHeader,
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
		//????????? ?????? ?????? (1??????)
		getForyouActor: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/home/foryou/actor",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};
			
			return send(options);
		},
		// ??????&???????????? ?????? ??????(2??????)
		getForyouGenre: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/home/foryou/genre",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		//?????? ?????? VOD??? ?????? ??? ?????? ?????? ?????? (3??????)
		getForyouOverlap: function (callback, param) {
			
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/home/foryou/overlap",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		//????????? ?????? (4??????)
		getForyouToday: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/home/foryou/today",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		//?????? ????????? ?????? (6??????)
		getForyouFree: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/home/foryou/free",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		//?????? ????????????
		getForyouChannel: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/home/foryou/channel",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		// ?????? 1 line
		getCateMovies1st: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/movies/1st",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		// ?????? 2 line
		getCateMovies1stGenre: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/movies/1stGenre",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		// ?????? 3 line
		getCateMovies2nd: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/movies/2nd",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		// ?????? 4 line
		getCateMoviesActor: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/movies/actor",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		// ?????? 5 line
		getCateMovies3rd: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/movies/3rd",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		//?????? 6 line
		getCateMoviesOverlap: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/movies/overlap",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage},
				param: param
			};

			return send(options);
		},
		// ?????????
		getCategoryNotMovie: function (callback, baseCategoryId) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/" + baseCategoryId,
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage}
			};

			return send(options);
		},
		// ????????? ?????? ??????
		getChannelFavorite: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/channel/favorite",
				callback: callback
			};

			return send(options);
		},
		// ????????? ?????? VOD
		getPopularVod: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/channel/popular/vod",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage}
			};

			return send(options);
		},
		// ????????? ?????? ??????
		getPopularChannel: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/channel/popular",
				callback: callback
			};

			return send(options);
		},
		// VOD ??????
		getVodDetail: function (callback, assetId) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/vod/detail",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage, assetId:assetId}
			};

			return send(options);
		},
		// VOD ??????
		getVodEnd: function (callback, assetId, basecateId) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/vod/end",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage, assetId:assetId, basecateId:basecateId}
			};

			return send(options);
		},
		// ?????? ????????? ?????? ??????
		getSearchPopularTotal: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords",
				callback: callback
			};

			return send(options);
		},
		// ?????? ??????
		getSearchPopularMovie: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/movie",
				callback: callback
			};

			return send(options);
		},
		// ?????? ??????
		getSearchPopularKids: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/kids",
				callback: callback
			};

			return send(options);
		},
		//?????? TV
		getSearchPopularTv: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/tv",
				callback: callback
			};

			return send(options);
		},
		// ?????? ??????
		getSearchPopularPerson: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/person",
				callback: callback
			};

			return send(options);
		},
		// ??????
		getKidsCharacter: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/kids/character",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage}
			};

			return send(options);
		}
	};
});