//@preDefine
/**
 * manager/SdpDataManager
 */
W.defineModule("manager/SdpDataManager", function() {
	
	W.log.info("define SdpDataManager");
	
	var xhr = W.getClass('XHRManager');

	var loadingQueue = [];
	var TYPE = {TVPAY : 0, USER : 1, PAY : 2};

	var send = function (options, loadingVisible, type) {
		// options property -> async, api, reqData, callback,
		// reqType,
		// reqData,
		// delayLoading, excuteLoading
		
		if(!options.reqHeader){
			options.reqHeader = {};
		}
		if(!options.reqHeader["Content-Type"]){
			options.reqHeader["Content-Type"] = "application/x-www-form-urlencoded";
		}
		options.reqHeader["X-Client-App-Key"] = W.Config.CLIENT_APP_KEY;
		options.reqHeader["Authorization"] = "Bearer " + W.StbConfig.accessToken;
		var _this = {onPopupClosed:function(popup, desc){
			if (desc) {
                if (desc.popupName == "popup/ErrorPopup") {
                	W.CloudManager.closeApp();
                }
			}
		}};
		

		var typ = "get"; 
		if (options.reqType)
			typ = options.reqType;
		try {
			var urlParam;
			var formData = new FormData();
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
					if(typ != "get"){
						formData.append(key, options.reqData[key]);
					}
				}
			}
			W.log.info("urlParam === " + urlParam);
			W.log.info(formData);
			
			if(options.reqHeader["Content-Type"] != "application/json"){
				options.url += urlParam ? "?" + urlParam : "";
			}
			
			var tokenTryCount = 0;

			var sendObject = {
				type: typ,
				async: options.async,
				url: options.url,
				timeout: options.timeout ? options.timeout : W.Config.SERVER_TIMEOUT,
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
						if(result && result.error && (result.error.code == "C0201")) {
							W.log.info("token expired!!");
							if(tokenTryCount > 3) {
								W.Loading.stop();
								W.Loading.isLocked = true;
								W.PopupManager.openPopup({
		                            childComp:_this,
		                            popupName:"popup/ErrorPopup",
		                            code:"C0201",
		        					from : "SDP"}
		                        );
							} else {
								tokenTryCount++;
								W.CloudManager.requestToken(function(result) {
									W.log.info("token Received!!!");
									W.StbConfig.accessToken = result.data;
									options.reqHeader["Authorization"] = "Bearer " + W.StbConfig.accessToken;
									xhr.send(sendObject);
								}, result.error.info ? result.error.info : null, {});
							}
						} else {
							if (options.callback) {
								options.callback(success, result, options.param, options.param2);
							}
						}
					}catch(ex){
						if (options.callback) {
							options.callback(success, undefined, options.param, options.param2);
						}
					}
					
				}
			};
			
			if(options.reqHeader["Content-Type"] == "application/json"){
				sendObject.data = options.reqData;
			}

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
		
		//BIF-0201 카탈로그 (메뉴트리) 조회
		getMenuTree: function (callback, reqData, param, param2) {
			//categoryId, extCategoryId, depth, adult, indludes, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.cugType != "accommodation" && W.StbConfig.adultMenuUse == 2){
				reqData.adult = false;
			}

			var options = {
				async: true,
				url: W.Config.SDP_URL + "catalog/home/menu_tree",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0202 홈메뉴 타입별 하위 카탈로그 (메뉴트리) 조회
		getChildMenuTree: function (callback, reqData, param, param2) {
			//menuType, categoryId, adult, includes, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.cugType != "accommodation" && W.StbConfig.adultMenuUse == 2){
				reqData.adult = false;
			}

			var options = {
				async: true,
				url: W.Config.SDP_URL + "catalog/home/child_menu_tree",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0203 카테고리 상세 조회
		getMenuDetail: function (callback, reqData, param, param2) {
			//categoryIds, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "catalog/home/mget_menu",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0207 채널 장르 카테고리 목록 조회
		getChannelGenreCategory: function (callback, reqData, param, param2) {
			//selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "catalog/home/channel_genre_categories",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0301 채널 그룹 목록 조회
		getChannelGroups: function (callback, reqData, param, param2) {
			//region, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/channel_groups",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0302 채널 장르 트리 조회
		getChannelGenreTree: function (callback, reqData, param, param2) {
			//genreId, depth, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/genre_tree",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0303 채널 목록 조회
		getChannelRegions: function (callback, reqData, param, param2) {
			//offset, limit, type, genre, siChannelType, siChannelGenre, resolution, streamingOnly, includes, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/region_channels",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0304 상품별 채널 목록 조회
		getProductChannels: function (callback, reqData, param, param2) {
			//productId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/product_region_channels",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0305 채널 상세 조회
		getChannelDetail: function (callback, reqData, param, param2) {
			//sourceId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/mget_region_channel",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0306 가입자 가입 채널 목록 조회
		getSubscribedChannels: function (callback, reqData, param, param2) {
			//offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/subscribed_channels",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0307 가입자 미가입 채널 목록 조회
		getNotSubscribedChannels: function (callback, reqData, param, param2) {
			//offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/not_subscribed_channels",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0308 가입자 채널 시청 권한 확인
		getChannelVerifyAuthorized: function (callback, reqData, param, param2) {
			//sourceId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/verify_authorized",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0309 가입자 채널 가입 구매 여부
		getChannelVerifySubscribed: function (callback, reqData, param, param2) {
			//sourceId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/verify_subscribed",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0310 방송 프로그램 장르 트리 조회
		getProgramsGenreTree: function (callback, reqData, param, param2) {
			//genreId, depth, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/programs/genre_tree",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0311 프로그램 장르별 방송 프로그램
		getGenrePrograms: function (callback, reqData, param, param2) {
			//genre, offset, limit, includeFinished, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/programs/genre_programs",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0312 방송 프로그램 상세 조회
		getProgramDetail: function (callback, reqData, param, param2) {
			//programId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/programs/mget_program",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0313 일반 채널 방송 편성 조회
		getSchedulesNormalChannel: function (callback, reqData, param, param2) {
			//sourceId, startTime, duration, includeNotFinished, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/normal_channel",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0314 프로그램별 방송 편성 조회
		getSchedulesProgram: function (callback, reqData, param, param2) {
			//programId, sourceId, startTime, duration, includeNotFinished, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/program",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0315 채널별 현재 방영중인 방송 이벤트조회
		getSchedulesNow: function (callback, reqData, param, param2) {
			//sourceId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/channels_now",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0316 방송 이벤트 상세 조회
		getSchedulesDetail: function (callback, reqData, param, param2) {
			//sourceId, eventId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/mget_broadcast_event",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0318 프로모 채널 방송 편성 조회
		getSchedulesPromoChannel: function (callback, reqData, param, param2) {
			//sourceId, startTime, duration, includeNotFinished, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/promo_channel",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0319 채널 장르별 채널 및 방송 편성 조회
		getSchedulesGenreTable: function (callback, reqData, param, param2) {
			//genre, startTime, duration, offset, limit, includeNotFinished, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/channel_genre_table",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0320 채널별 채널 및 방송 편성 조회
		getSchedulesChannelTable: function (callback, reqData, param, param2) {
			//sourceId, startTime, duration, includeNotFinished, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/channel_table",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0321 프로그램별 채널 및 방송 편성 조회
		getSchedulesProgramTable: function (callback, reqData, param, param2 ) {
			//programId, startTime, duration, includeNotFinished, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/program_table",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0322 카테고리별 채널 및 방송 편성 조회
		getSchedulesCategoryTable: function (callback, reqData, param, param2 ) {
			//categoryId, startTime, duration, offset, limit, includeNotFinished, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/schedules/category_table",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0323 카테고리별 채널 목록 조회
		getCategoryChannels: function (callback, reqData, param, param2 ) {
			//categoryId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "epg/channels/category_region_channels",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0401 카테고리별 슈퍼 애셋 목록 조회
		getSAssetsCategory: function (callback, reqData, param, param2 ) {
			//categoryId, offset, limit, resolution, assetGroup, lifetime, assetProduct, sort, orderLock, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.adultMenuUse < 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/sassets/category_sassets",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0402 슈퍼 애셋 상세 조회
		getSAssetsDetail: function (callback, reqData, param, param2 ) {
			//sassetId, assetId, resolution, assetGroup, lifetime, assetProduct, selector, param, param2
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/sassets/mget_sasset",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0403 카테고리별 시리즈 목록 조회
		getCategorySeries: function (callback, reqData, param, param2 ) {
			//categoryId, offset, limit, resolution, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.cugType == "accommodation" || W.StbConfig.adultMenuUse != 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/series/category_series",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0404 시리즈 상세 조회
		getSeriesDetail: function (callback, reqData, param, param2 ) {
			//seriesId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/series/mget_series",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0405 카테고리별 애셋 목록 조회
		getCategoryAsset: function (callback, reqData, param, param2 ) {
			//categoryId, offset, limit, resolution, sort, orderLock, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.adultMenuUse < 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/assets/category_assets",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0406 시리즈별 애셋 목록 조회
		getSeriesAsset: function (callback, reqData, param, param2 ) {
			//seriesId, offset, limit, paging, sort, startIndex, endIndex, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/assets/series_assets",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0407 슈퍼 애셋별 애셋 목록 조회
		getSAssetAssetList: function (callback, reqData, param, param2 ) {
			//sassetId, offset, limit, assetGroup, resolution, sort, selector, param
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/assets/sasset_assets",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0408 상품별 애셋 목록 조회
		getProductAssetList: function (callback, reqData, param, param2 ) {
			//productId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/assets/product_assets",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0409 애셋 상세 조회
		getDetailAsset: function (callback, reqData, param, param2 ) {
			//assetId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/assets/mget_asset",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0410 카테고리별 Top N(50) 슈퍼 애셋 목록 조회
		getCategoryTopn: function (callback, reqData, param, param2 ) {
			//categoryId, offset, limit, selector, type
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.cugType == "accommodation" || W.StbConfig.adultMenuUse != 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/category_topn",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0414 연관 콘텐트 목록 조회
		getRelatedContentsList: function (callback, reqData, param, param2 ) {
			//sourceId, eventId, programId, assetId, seriesId, sassetId, includes, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "contents/relation/related",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0501 상품 타입별 상품 목록 조회
		getProductListByType: function (callback, reqData, param, param2 ) {
			//offset, limit, productType, serviceType, packageType, billingType, includeBundle, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "products/region_products",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0502 채널별 상품 목록 조회
		getChannelProducts: function (callback, reqData, param, param2 ) {
			//sourceId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "products/channel_products",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0503 애셋별 상품 목록 조회
		getAssetProducts: function (callback, reqData, param, param2 ) {
			//assetId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "products/asset_products",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0504 시리즈별 상품 목록 조회
		getSeriesProducts: function (callback, reqData, param, param2 ) {
			//seriesId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "products/series_products",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0505 카테고리별 상품 목록 조회
		getCategoryProducts: function (callback, reqData, param, param2 ) {
			//categoryId, offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "products/category_products",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0506 상품 상세 조회(상세상품조회 )
		getProductDetail: function (callback, reqData, param, param2 ) {
			//region, productId, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "products/mget_product",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0601 상품 구매 가입
		purchaseProduct: function (callback, reqData, param, param2 ) {
			//product, payment, device, coupons, contact
			reqData.idempotencyKey = String(new Date().getTime());
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/buy",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/json"},
				reqData: reqData,
				param: param,
				param2: param2,
				timeout : W.Config.PURCHASE_TIMEOUT 
			};

			return send(options);
		},
		
		//BIF-0602 월정액 가입내역 조회
		getSubscriptionsList: function (callback, reqData, param, param2 ) {
			//offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/subscriptions",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0603 평생소장 상품 보유 내역 조회
		getLifetimesList: function (callback, reqData, param, param2 ) {
			//offset, limit, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.cugType == "accommodation" || W.StbConfig.adultMenuUse != 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/lifetimes",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0604 월정액 상품 가입 확인
		getPurchaseVerifySubscription: function (callback, reqData, param, param2 ) {
			//productId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/verify_subscription",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0605 종량 상품 구매 확인
		getPurchaseVerifyPurchase: function (callback, reqData, param, param2 ) {
			//productId, source
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/verify_purchase",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0606 종량 상품 구매 현황 조회
		getPurchaseVerifySummary: function (callback, reqData, param, param2 ) {
			//since, until
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/purchase_summary",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0607 구매이력 목록 조회
		getPurchaseHistory: function (callback, reqData, param, param2 ) {
			//offset, limit, since, until, month, includeSubscription, includeCancelled, serviceType, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.cugType == "accommodation" || W.StbConfig.adultMenuUse != 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/history",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0608 구매이력 삭제(숨기기)
		hidePurchaseHistory: function (callback, reqData, param, param2 ) {
			//purchaseId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/hide_history",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0609 구매이력 복구
		restorePurchaseHistory: function (callback, reqData, param, param2) {

			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/restore_history",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0610 월정액 해지
		cancelSubscription: function (callback, reqData, param, param2 ) {
			//idempotencyKey, productId
			reqData.idempotencyKey = String(new Date().getTime());
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/cancel_subscription",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0611 월정액 VOD 상품 이용 현황
		getVodSubscriptionUsage: function (callback, reqData, param, param2 ) {
			//productId, since, until
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/history",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0613 프로모션 상품 지급 현황 조회
		getPromotionProducts: function (callback, reqData, param, param2 ) {
			//serviceType, selector
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/promotion_products",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0614 주상품 변경
		purchaseTier: function (callback, reqData, param, param2 ) {
			//productId, listPrice, price, payVAT, agreementCode
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/tier",
				callback: callback,
				reqData: reqData,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/json"},
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		// BIF-0615 RVOD상품 구매 확정
		buyCommit: function (callback, reqData, param, param2 ) {
			//transactionId, product(productId), commit
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "purchase/buy_commit",
				callback: callback,
				reqData: reqData,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/json"},
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0701 VOD 시청 준비
		getPrepareViewing: function (callback, reqData, param, param2 ) {
			//assetId, resume, deviceType, deviceId , entryPath
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/prepare_viewing",
				callback: callback,
				reqData: reqData,
				reqType: "POST",
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0702 VOD 이어보기 위치 저장
		saveViewingOffset: function (callback, reqData, param, param2 ) {
			//cookie, offsetType, offset
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/save_viewing_offset",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0703 VOD 이어보기 조회
		getViewingOffset: function (callback, reqData, param, param2 ) {
			//assetId
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/mget_viewing_offset",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0704 VOD 시청 종료
		finishViewing: function (callback, reqData, param, param2 ) {
			//cookie, finishType, playStart, playEnd, playingTime, offsetType, offset
			reqData.lang = W.StbConfig.menuLanguage;
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/finish_viewing",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0705 VOD 최근 시청 목록 조회
		getRecentViewing: function (callback, reqData, param, param2 ) {
			//offset, limit, category, includeAdult, since, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.adultMenuUse < 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/recent_viewing",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0706 VOD 최근 시청 목록 삭제(숨기기)
		hideViewing: function (callback, reqData, param, param2 ) {
			//viewingId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/hide_viewing",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0707 VOD 최근 시청 목록 복구
		restoreViewing: function (callback, reqData, param, param2 ) {
			//category
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/restore_viewing",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0708 찜한 목록 조회
		getViewingPins: function (callback, reqData, param, param2, fromList) {
			//offset, limit, category, includeAdult, listId, sort, selector
			reqData.lang = W.StbConfig.menuLanguage;
			reqData.includeAdult = true;
			if(fromList) {
				if(W.StbConfig.adultMenuUse < 2){
					reqData.includeAdult = true;
				} else {
					reqData.includeAdult = false;
				}
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/pins",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0709 찜하기
		addViewingPin: function (callback, reqData, param, param2 ) {
			//targetType, targetId, listId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/add_pin",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0710 찜 여부 확인
		getVerifyViewingPins: function (callback, reqData, param, param2 ) {
			//targetType, targetId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/verify_pin",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0711 찜해제
		removeViewingPin: function (callback, reqData, param, param2 ) {
			//pinId, targetType, targetId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/remove_pin",
				callback: callback,
				reqType: "POST",
				reqHeader:{"Content-Type":"application/x-www-form-urlencoded"},
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0712 즐겨찾기 목록 조회
		getViewingFavorites: function (callback, reqData, param, param2 ) {
			//offset, limit, category, includeAdult, selector
			reqData.lang = W.StbConfig.menuLanguage;
			if(W.StbConfig.adultMenuUse < 2){
				reqData.includeAdult = true;
			} else {
				reqData.includeAdult = false;
			}
			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/favorites",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0713 즐겨찾기 추가
		addViewingFavorite: function (callback, reqData, param, param2 ) {
			//targetId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/add_favorite",
				callback: callback,
				reqType: "POST",
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0714 즐겨찾기 삭제
		removeViewingFavorite: function (callback, reqData, param, param2 ) {
			//targetId, favoriteId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/remove_favorite",
				callback: callback,
				reqType: "POST",
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0721 좋아요 설정
		addLike: function (callback, reqData, param, param2 ) {
			//targetType, targetId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/add_like",
				callback: callback,
				reqData: reqData,
				reqType: "POST",
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0723 좋아요 설정 해제
		removeLike: function (callback, reqData, param, param2 ) {
			//targetType, targetId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/remove_like",
				callback: callback,
				reqData: reqData,
				reqType: "POST",
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0725 찜목록 조회
		pinsList: function (callback, reqData, param, param2, fromList) {
			//targetType, targetId
			reqData.includeAdult = true;
			if(fromList) {
				if(W.StbConfig.adultMenuUse < 2){
					reqData.includeAdult = true;
				} else {
					reqData.includeAdult = false;
				}
			}

			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/pins_list",
				callback: callback,
				reqData: reqData,
				reqType: "GET",
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-0726 찜목록 이동
		movePin: function (callback, reqData, param, param2 ) {
			//targetType, targetId

			var options = {
				async: true,
				url: W.Config.SDP_URL + "viewing/move_pin",
				callback: callback,
				reqData: reqData,
				reqType: "POST",
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0904 코인 충전소
		getCoinShop: function (callback, reqData, param, param2 ) {
			//offset, limit, selector
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "coins/coin_shop",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-0905 코인 정기 충전소
		getMonthlyCoinShop: function (callback, reqData, param, param2 ) {
			//offset, limit, selector
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "coins/monthly_coin_shop",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		//BIF-1001 애셋별 기준 카테고리 조회
		getBaseCategoryId: function (callback, reqData, param, param2 ) {
			//assetId
			
			var options = {
				async: true,
				url: W.Config.SDP_URL + "basecategory/asset_basecategory",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-1010 모바일 기기 목록 조회
		getMobileListParing: function (callback, reqData, param, param2 ) {

			var options = {
				async: true,
				url: W.Config.SDP_URL + "mobile/list_pairing",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-1011 모바일 기기 등록: 인증 번호 발급
		getMobileIssueAuthcode: function (callback, reqData, param, param2 ) {

			var options = {
				async: true,
				url: W.Config.SDP_URL + "mobile/issue_authcode",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		//BIF-1012 모바일 기기 등록 해제
		getMobileRemovePairing: function (callback, reqData, param, param2 ) {
			//deviceId
			var options = {
				reqType:"POST",
				async: true,
				url: W.Config.SDP_URL + "mobile/remove_pairing",
				callback: callback,
				reqData: reqData,
				param: param,
				param2: param2
			};

			return send(options);
		},

		getVodThumbnail: function (callback, reqData) {
			//assetId
			var options = {
				async: true,
				url: W.Config.IMAGE_URL + "/data_img/thumbnail/vod/" + reqData.assetId + "/notifyThumbnailFinished.json",
				callback: callback
			};

			return send(options);
		},
		
	};
});