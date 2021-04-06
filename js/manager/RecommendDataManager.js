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
		//출연자 기반 추천 (1영역)
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
		// 장르&카테고리 기반 추천(2영역)
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
		//최근 시청 VOD를 같이 본 사람 기반 추천 (3영역)
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
		//오늘의 추천 (4영역)
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
		//무료 컨텐츠 추천 (6영역)
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
		//채널 프로모션
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
		// 영화 1 line
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
		// 영화 2 line
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
		// 영화 3 line
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
		// 영화 4 line
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
		// 영화 5 line
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
		//영화 6 line
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
		// 비영화
		getCategoryNotMovie: function (callback, baseCategoryId) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/category/" + baseCategoryId,
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage}
			};

			return send(options);
		},
		// 사용자 선호 채널
		getChannelFavorite: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/channel/favorite",
				callback: callback
			};

			return send(options);
		},
		// 실시간 인기 VOD
		getPopularVod: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/channel/popular/vod",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage}
			};

			return send(options);
		},
		// 실시간 인기 채널
		getPopularChannel: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/channel/popular",
				callback: callback
			};

			return send(options);
		},
		// VOD 상세
		getVodDetail: function (callback, assetId) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/vod/detail",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage, assetId:assetId}
			};

			return send(options);
		},
		// VOD 종료
		getVodEnd: function (callback, assetId, basecateId) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + W.StbConfig.accountId + "/vod/end",
				callback: callback,
				postData: {lang: W.StbConfig.menuLanguage, assetId:assetId, basecateId:basecateId}
			};

			return send(options);
		},
		// 인기 검색어 통합 조회
		getSearchPopularTotal: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords",
				callback: callback
			};

			return send(options);
		},
		// 인기 영화
		getSearchPopularMovie: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/movie",
				callback: callback
			};

			return send(options);
		},
		// 인기 키즈
		getSearchPopularKids: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/kids",
				callback: callback
			};

			return send(options);
		},
		//인기 TV
		getSearchPopularTv: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/tv",
				callback: callback
			};

			return send(options);
		},
		// 인기 인물
		getSearchPopularPerson: function (callback) {
			var options = {
				async: true,
				url: W.Config.RECOMMEND_URL + "keywords/person",
				callback: callback
			};

			return send(options);
		},
		// 키즈
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