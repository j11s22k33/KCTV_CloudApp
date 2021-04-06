//@preDefine
/**
 * manager/WeatherDataManager
 */
W.defineModule("manager/WeatherDataManager", function() {
	
	W.log.info("define WeatherDataManager");
	
	var xhr = W.getClass('XHRManager');

	var loadingQueue = [];

	var send = function (options, loadingVisible, type) {

		try {
			if(W.StbConfig.localCode){
				options.url += "?code=" + W.StbConfig.localCode;
			}

			xhr
				.send({
					type: "get",
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
		getWeatherNow: function (callback) {
			var options = {
				async: true,
				url: W.Config.WEATHER_URL + "getWeatherNow",
				callback: callback
			};

			return send(options);
		},
		
		getWeatherSummary: function (callback) {
			var options = {
				async: true,
				url: W.Config.WEATHER_URL + "getWeatherSummary",
				callback: callback
			};

			return send(options);
		}
	};
});