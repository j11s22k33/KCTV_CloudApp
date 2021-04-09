/**
 * scene/RootScene
 */
W.defineModule("scene/RootScene", [ "mod/Config", "manager/TextManager", "manager/CloudManager", "comp/CloseTimer",
                 "manager/SdpDataManager", "manager/UiPlfDataManager", "manager/CouponDataManager", 
                 "comp/EntryPath", "manager/RecommendDataManager",
                 "comp/home/CategoryNotice", "manager/LinkManager",
				 "mod/Util", "comp/purchase/PurchaseComp"],
		function(Config, TextManager, CloudManager, CloseTimer,
				SdpDataManager, UiPlfDataManager, CouponDataManager, 
				entryPathComp, recoDataManager,
				CategoryNoticeComp, LinkManager,
				util, purchaseComp) {
	
	var _this;
	var menuTree;
	
	function setLanguage(){
		if(W.StbConfig.menuLanguage == 2) W.StbConfig.menuLanguage = "ENG";
		else if(W.StbConfig.menuLanguage == 3) W.StbConfig.menuLanguage = "JPN";
		else if(W.StbConfig.menuLanguage == 4) W.StbConfig.menuLanguage = "ZHO";
		else W.StbConfig.menuLanguage = "KOR";

		W.TextManager.changeLang(startScene);
	};
	
	function startScene(){
		if(!W.StbConfig.menuTransparency) W.StbConfig.menuTransparency = 3;

		W.log.info("token ========== " + W.StbConfig.accessToken);
		W.log.info("lang ========== " + W.StbConfig.menuLanguage);
		W.log.info("sceneValue ========== " + W.StbConfig.sceneValue);
		W.log.info("sceneId ========== " + W.StbConfig.sceneId);
		W.log.info("param ========== " + W.StbConfig.param);

		W.CloudManager.sendLog("version", W.Config.UI_VERSION);

		W.CloudManager.addExitKey();
		
		W.HomeShowCount = 0;
		W.visibleHomeScene = function(){
			var home_scene_div = document.getElementById("home_scene_div");
			if(home_scene_div){
				home_scene_div.style.visibility = "visible";
				W.HomeShowCount++;
				W.Loading.stop();
			}
		};
		

		W.CloseTimer = CloseTimer.getNewComp();
		W.CloseTimer.start();
		
		if(W.StbConfig.kidsLimitVodCount == 0){
			W.StbConfig.kidsLimitVodCount = -1;
		}
		
		W.changeBgOpacity();

		if(W.Config.DEVICE == "PC"){
//			W.StbConfig.sceneId = "5101";
//			W.StbConfig.sceneValue = {sourceId:480};
		}
		if(W.StbConfig.sceneId.indexOf("CC") > -1){
			var reqData = {menuType:"MC0010", selector:"title,categoryCode"};
			SdpDataManager.getChildMenuTree(function(result, data){
				for(var i=0; i < data.data.length; i++){
					if(data.data[i].categoryCode == W.StbConfig.sceneId){
						_this.startScene({
							sceneName:"scene/setting/SettingScene", 
							backState:W.SceneManager.BACK_STATE_KEEPHIDE,
							param : {
								targetId: W.StbConfig.sceneId,
								title : data.data[i].title
							}
						});
						return;
					}
				}
				W.PopupManager.openPopup({
					childComp:_this,
					popupName:"popup/ErrorPopup",
					code: "2001",
        			from : "SDP"
				});
			}, reqData);
		}else{ 
			var sceneName;
			var param;
			var serverType = undefined;
			if(W.Config.DEVICE == "PC"){
//				W.StbConfig.sceneValue = {"seriesId":"18404","entry":"relationVodEpg"};//590
//				W.StbConfig.rating = 4;
//				W.StbConfig.isKidsMode = true;
			}
			switch(W.StbConfig.sceneId) {
    		case "1001":
    			if(W.StbConfig.isKidsMode){
    				sceneName = "scene/kids/KidsHomeScene";
    			}else{
    				sceneName = "scene/home/HomeScene";
    			}
    			serverType = "menu";
    			break;
    		case "1002":
    			sceneName = "scene/home/ForYouScene";
    			break;
    		case "2001":
				if(W.StbConfig.sceneValue) {
					if(W.StbConfig.sceneValue.categoryCode && W.StbConfig.sceneValue.categoryCode == "CC0205"){
						sceneName = "scene/home/ReservedProgramListScene";
						param = W.StbConfig.sceneValue;
					}else{
						sceneName = "scene/home/GuideScene";
						param = {category : W.StbConfig.sceneValue};
					}
				} else {
					sceneName = "scene/home/GuideScene";
					param = {};
				}
    			break;
    		case "3001":
    			sceneName = "scene/search/SearchScene";
    			break;
    		case "3002":
    			sceneName = "scene/search/SearchResultScene";
    			W.entryPath.push("searchMiniEpg.keyword", W.StbConfig.sceneValue.keyword, "RootScene");
    			param = {keyword:W.StbConfig.sceneValue.keyword, m_field:W.StbConfig.sceneValue.m_field};
    			break;
    		case "4001":
    			sceneName = "scene/vod/MovieScene";
				serverType = "category";
    			param = {categoryId:W.StbConfig.sceneValue.categoryId};
    			break;
    		case "4002":
//    			sceneName = "scene/vod/VodDetailScene";
//    			param = {sassetId:W.StbConfig.sceneValue.sassetId};
//    			if(W.StbConfig.sceneValue.entry){
//        			W.entryPath.push(W.StbConfig.sceneValue.entry + ".sassetId", W.StbConfig.sceneValue.sassetId, "RootScene");
//    			}
    			serverType = "link";
    			W.StbConfig.sceneValue.linkType = "as02";
    			W.StbConfig.sceneValue.linkTarget = W.StbConfig.sceneValue.sassetId;
				param = {type:"L", data:W.StbConfig.sceneValue};
    			break;
    		case "4003":
//    			sceneName = "scene/vod/VodDetailScene";
//    			param = {assetId:W.StbConfig.sceneValue.assetId};
//    			if(W.StbConfig.sceneValue.entry){
//        			W.entryPath.push(W.StbConfig.sceneValue.entry + ".assetId", W.StbConfig.sceneValue, "RootScene");
//    			}
    			serverType = "link";
    			W.StbConfig.sceneValue.linkType = "as01";
    			W.StbConfig.sceneValue.linkTarget = W.StbConfig.sceneValue.assetId;
				param = {type:"L", data:W.StbConfig.sceneValue};
    			break;
    		case "4004":
//    			sceneName = "scene/vod/VodDetailScene";
//    			param = {seriesId:W.StbConfig.sceneValue.seriesId};
//    			if(W.StbConfig.sceneValue.entry){
//        			W.entryPath.push(W.StbConfig.sceneValue.entry + ".seriesId", W.StbConfig.sceneValue, "RootScene");
//    			}
    			serverType = "link";
    			W.StbConfig.sceneValue.linkType = "sr01";
    			W.StbConfig.sceneValue.linkTarget = W.StbConfig.sceneValue.seriesId;
				param = {type:"L", data:W.StbConfig.sceneValue};
    			break;
    		case "4006":
    			sceneName = "scene/vod/VodPackageScene";
    			param = {product:{productId:W.StbConfig.sceneValue.productId}, type:"P"};
    			if(W.StbConfig.sceneValue.entry){
        			W.entryPath.push(W.StbConfig.sceneValue.entry + ".productId", W.StbConfig.sceneValue.productId, "RootScene");
    			}
    			break;
    		case "4101":
				W.state.start = "TMP_PLAY";
    			sceneName = "scene/vod/VodPlayScene";
				serverType = "play";
    			break;
			case "5001":
				sceneName = "scene/search/SearchScene";
				break;
			case "5002":
				sceneName = "scene/channel/LiveTriggerDownScene";
				break;
			case "5003":
				sceneName = "scene/channel/LiveTriggerLeftScene";
				break;
			case "5004":
				sceneName = "scene/channel/LiveTriggerRightScene";
				break;
			case "5101":
				sceneName = "scene/channel/ChannelVodScene";
				W.state.start = "CH_VOD";
				param = {sourceId:W.StbConfig.sceneValue.sourceId, releaseAdult:W.StbConfig.sceneValue.releaseAdult};
    			break;
			case "5201":
				sceneName = "scene/vod/VodDetailScene";
    			serverType = "promo_channel";
    			param = {sourceId:W.StbConfig.sceneValue};
    			break;
			case "6001":
    			sceneName = "scene/channel/PurchaseChScene";
    			param = {sourceId:W.StbConfig.sceneValue};
    			W.entryPath.push("purchase.sourceId", W.StbConfig.sceneValue, "RootScene");
    			break;
    		case "7001":
    			sceneName = "scene/setting/SettingMainScene";
    			serverType = "menu";
    			break;
			case "8002":
				sceneName = "scene/my/NoticeScene";
				break;
			case "8003":
				sceneName = "scene/my/WatchedListScene";
				break;
			case "8004":
				sceneName = "scene/home/CategoryListScene";
				param = {category:{title:W.Texts["zzim_list"], categoryCode:"CC0103"}};
				break;
			case "8005":
				sceneName = "scene/my/BookmarkScene";
				break;
			case "8007":
				sceneName = "scene/my/PurchaseHistoryScene";
				break;
			case "8008":
				sceneName = "scene/my/CouponScene";
				break;
			case "9001":
				serverType = "link";
				param = {type:"L", data:W.StbConfig.sceneValue};
				break;
			case "9002":
				serverType = "link";
				param = {type:"P", data:W.StbConfig.sceneValue};
				break;
			case "9003":
				sceneName = "scene/home/AppListScene";
				param = {category:{title:"TV Application", menuType: "MC0007"}};
				break;
    		}
			
			if(serverType == "menu"){
				_this.startScene({
					sceneName:sceneName,
					backState:W.SceneManager.BACK_STATE_KEEPSHOW
				});
				SdpDataManager.getMenuTree(function(result, data, sceneName){
					if(result) {
						menuTree = Object.assign([], data.data);
						for(var i=0; i < menuTree.length; i++){
							W.log.info(menuTree[i].menuType);
						}
						var category;
						if(W.StbConfig.isKidsMode){
							for(var i=0; i < data.data.length; i++){
								if(data.data[i].menuType == "MC0004"){
									category = {category:data.data[i]};
									break;
								}
							}
							W.entryPath.push("menu.categoryId", category.category, "RootScene");
						}else{
							if(sceneName.indexOf("SettingMainScene") > -1){
								for(var i=0; i < data.data.length; i++){
									if(data.data[i].menuType == "MC0010"){
										category = {category:data.data[i].children};
										break;
									}
								}
							}else{
								category = {category:data.data};
							}
						}
						if(W.SceneManager.getCurrentScene().setCategoryData){
							W.SceneManager.getCurrentScene().setCategoryData(category.category);
						}else{
							_this.homeInterval = setInterval(function(){
								W.log.info("retry !!!!!!!!!");
								if(W.SceneManager.getCurrentScene().setCategoryData){
									clearInterval(_this.homeInterval);
									W.SceneManager.getCurrentScene().setCategoryData(category.category);
								}
							}, 20);
						}
					} else {
						W.Loading.stop();
						W.Loading.isLocked = true;
						W.PopupManager.openPopup({
							childComp:_this,
							popupName:"popup/ErrorPopup",
							code: (data && data.error && data.error.code) ? data.error.code : "1001",
				        	from : "SDP"
						});
					}
				}, {selector:"@detail"}, sceneName);
			}else if(serverType == "category"){
				SdpDataManager.getMenuDetail(function(result, data, sceneName){
					if(result){
		    			W.entryPath.push("menu.categoryId", data.data[0], "RootScene");
						_this.startScene({
							sceneName:sceneName,
							backState:W.SceneManager.BACK_STATE_KEEPSHOW,
							param:data.data[0]
						});
					}else{
						W.Loading.stop();
						W.Loading.isLocked = true;
						W.PopupManager.openPopup({
							childComp:_this,
							popupName:"popup/ErrorPopup",
							code: (data && data.error && data.error.code) ? data.error.code : "1001",
				        	from : "SDP"
						});
					}
				}, param, sceneName);
			}else if(serverType == "link"){
				W.LinkManager.action(param.type, param.data, false, W.StbConfig.sceneValue.entry ? W.StbConfig.sceneValue.entry : undefined, "RootScene");
			}else if(serverType == "promo_channel"){
				param.startTime = util.getDateFormat("yyyy-MM-ddTHH:mm");
				param.duration = 2;
				param.includeNotFinished = true;
				SdpDataManager.getSchedulesPromoChannel(function(result, data){
					W.log.info(data);
					if(result && data.data && data.data.length > 0){
						sceneName = "scene/vod/VodDetailScene";
		    			W.entryPath.push("promoChannel.sourceId", param.sourceId, "RootScene");
						_this.startScene({
							sceneName:sceneName,
							backState:W.SceneManager.BACK_STATE_KEEPSHOW,
							param:{assetId:data.data[0].assetId}
						});
					}else{
						W.PopupManager.openPopup({
                            childComp:_this,
                            popupName:"popup/Alert2BtnPopup",
                            title:W.Texts["popup_zzim_info_title"],
                            info1:W.Texts["popup_guide_ch_info1"],
                            info2:W.Texts["popup_guide_ch_info2"],
                            btn1:W.Texts["scene_search"],
                            btn2:W.Texts["close"]
						});
					}
					
				}, param);
			}else if(serverType == "play"){
				var reqData = {assetId:W.StbConfig.sceneValue, selector:"@detail"};
				SdpDataManager.getDetailAsset(function(result, data){
					W.log.info(data);
					if(result && data.data && data.data.length > 0){
						var asset = data.data[0];
						var obj = {data:asset, isTmpPlayer:true};
						_this.startScene({
							sceneName:sceneName,
							backState:W.SceneManager.BACK_STATE_KEEPSHOW,
							param:obj
						});
					}else{
						W.Loading.stop();
						W.Loading.isLocked = true;
						W.PopupManager.openPopup({
							childComp:_this,
							popupName:"popup/ErrorPopup",
							code: (data && data.error && data.error.code) ? data.error.code : "1001",
				        	from : "SDP"
						});
					}
				}, reqData);
			}else{
				_this.startScene({
					sceneName:sceneName,
					backState:W.SceneManager.BACK_STATE_KEEPSHOW,
					param:param
				});
			}
			
//			if(sceneName.indexOf("HomeScene") > -1){
//				W.getCoupon();
//			}
		};
	};
	
	return W.Scene.extend({
		onCreate : function(param) {
			W.Config = Config;
			var param = W.Util.getParameter("param");
			W.log.info("param = " + param);
			W.log.info(param);
			W.StbConfig = {};
			if(param){
				W.StbConfig = JSON.parse(param);
				W.StbConfig.adultMenuUse = parseInt(W.StbConfig.adultMenuUse);
				W.StbConfig.parentalRating = {rating:W.StbConfig.rating, adultMenu:W.StbConfig.adultMenuUse};
			}

			if(W.StbConfig.isLive) {
				W.Config.setENV("LIVE");
			} if(W.StbConfig.isLive == false) {
				W.Config.setENV("TEST");
			}

		    console.log("##################################################");
		    console.log("### KCTV Cloud Application");
		    console.log("### version : " + W.Config.UI_VERSION);
		    console.log("### platform : " + W.Config.ENV);
		    console.log("### accessToken : " + W.StbConfig.accessToken);
		    console.log("### sceneId : " + W.StbConfig.sceneId);
		    console.log("##################################################");
		    _this = this;

			W.time = new Date();
		    
		    W.TextManager = TextManager;
		    
		    W.CloudManager = CloudManager;
		    W.LinkManager = LinkManager;
		    W.setModule("manager/SdpDataManager",  SdpDataManager);
		    W.setModule("manager/UiPlfDataManager",  UiPlfDataManager);
			W.setModule("manager/CouponDataManager",  CouponDataManager);
		    W.setModule("manager/RecommendDataManager",  recoDataManager);
			
		    W.categoryNotice = CategoryNoticeComp.getNewComp();
		    
		    W.state = {start:"HOME", isGuide:false};
			
			W.bg.setStyle({className:"bg_color"});
			
			this.setKeys([W.KEY.HOME]);
			
			var deviceParam = W.Util.getParameter("device");
			if(deviceParam == "pc"){
				W.Config.DEVICE = "PC";
				var token = W.Util.getParameter("token");
				if(token){
					W.StbConfig.accessToken = token;
				}
				var accountId = W.Util.getParameter("accountId");
				if(accountId){
					W.StbConfig.accessToken = accountId;
				}
				var groupId = W.Util.getParameter("groupId");
				if(groupId){
					W.StbConfig.accessToken = groupId;
				}
			}

			W.LoadingImage = {normal:[], kids:[]};
			for(var i = 0; i < 5; i++) {
				W.LoadingImage.normal[i] = new Image();
				W.LoadingImage.normal[i].src = "img/loading_"+util.changeDigit(i+1,2)+".png";
			}
//			for(var i = 0; i < 10; i++) {
//				W.LoadingImage.kids[i] = new Image();
//				W.LoadingImage.kids[i].src = "img/kids_loading_"+util.changeDigit(i+1,2)+".png";
//			}

			W.log.info("StbConfig ::: " + W.StbConfig);
			
			W.StbConfig.wsPid = W.Util.getParameter("pid");
			W.StbConfig.wsPort = W.Util.getParameter("port");

			W.log.info("wsPid ::: " + W.StbConfig.wsPid);
			W.log.info("wsPort ::: " + W.StbConfig.wsPort);
			
			if(!W.StbConfig.sceneId){
				W.StbConfig.sceneId = "1001";
			}
			
			if(W.StbConfig.groupId == "" || W.StbConfig.groupId == "000000000"){
				W.StbConfig.groupId = undefined;
			}
			W.entryPath = entryPathComp.getNewComp();
			
			W.getCoupon = function(callback){
				CouponDataManager.queryCouponList(function(result, data){
					W.log.info("result === " + result);
					W.log.info(data);

					if(result){
						var now = new Date().getTime();
						data.searchTime = now;
						var oneWeekAgo = new Date(now - 1000*60*60*24*7);
						var date = String(oneWeekAgo.getFullYear());
						date += oneWeekAgo.getMonth() + 1 > 9 ? String(oneWeekAgo.getMonth() + 1) : "0" + (oneWeekAgo.getMonth() + 1);
						date += String(oneWeekAgo.getDate());
						var coupons = [];
						var coins = [];
						var monthly = [];
						if(data.CouponList){
							for(var i=0; i < data.CouponList.length; i++){
								if(data.CouponList[i].OfferGubun == "M"){
									monthly.push(data.CouponList[i]);
								}else{
									if(data.CouponList[i].CouponGubun == "T"){
										coins.push(data.CouponList[i]);
									}else{
										coupons.push(data.CouponList[i]);
									}
								}
							}
						}

						W.log.info(data);
						W.Coupon = {
							usableCouponNumber : data.UsableCouponNumber,
							totalCouponAmount : data.TotalCouponAmount,
							totalBalanceAmount : data.TotalBalanceAmount,
							coupons : coupons,
							coins : coins.sort(function(a, b){
								return a.EffectiveEndDate - b.EffectiveEndDate;
							}),
							monthly : monthly
						};
					}else{
						W.Coupon = {
							usableCouponNumber : 0,
							totalCouponAmount : 0,
							totalBalanceAmount : 0,
							isNew : false,
							coupons : [],
							coins : [],
							isError : true
						};
					}
					
					data = null;
					if(callback) callback();
				}, {UsableYN:"Y", CouponGubun:"A"});
			};

			var websocketUrl = "ws://localhost:" + W.StbConfig.wsPort + "/v1/req?sender=app&pid=" + W.StbConfig.wsPid;
			_this.log("websocketUrl :: " + websocketUrl);

			W.Util.setStyle = function(obj, propertyObject){
				obj.setStyle(propertyObject);
			};
			
			W.Util.price = function(price){
				if(price > 100){
					return Math.floor(price/100) * 100;
				}else{
					return 0;
				}
			};
			
			var bgColorOpacities = [0.96, 0.97, 0.98, 0.99, 1];
			W.changeBgOpacity = function(){
//				for(var i=0; i < document.styleSheets[0].rules.length; i++){
//					if(document.styleSheets[0].rules[i].selectorText == ".bg_color"){
//						document.styleSheets[0].rules[i].style.opacity = bgColorOpacities[W.StbConfig.menuTransparency - 1];
//					}
//				}
			};

			W.startVod = function(backState, param){
				if(W.StbConfig.blockVodPlay && W.StbConfig.cugType != "accommodation"){
					W.PopupManager.openPopup({
                        title:W.Texts["popup_zzim_info_title"],
                        popupName:"popup/AlertPopup",
                        boldText:W.Texts["alert_block_title"],
                        thinText:W.Texts["alert_block_message1"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)}
                    );
				}else{
					var asset = undefined;
					if(param.data){
						asset = param.data;
					}else{
						if(param.zzimList && param.zzimList.length > 0){
							asset = param.zzimList[0].target;
						}else if(param.series && param.series.length > 0){
							asset = param.series[0];
						}
					}
					
					if(asset.resolution == "UHD" && !W.StbConfig.isUHD){
						W.PopupManager.openPopup({
			                title:W.Texts["popup_zzim_info_title"],
			                popupName:"popup/AlertPopup",
			                boldText:W.Texts["uhd_guide_popup"],
			                thinText:W.Texts["uhd_guide_popup2"] 
			            });
					}else{
						W.log.info("startVodScene !!!!!!!!!!!!!");
						var assetId;

		                if(param.zzimList){
		                	assetId = param.zzimList[0].target.assetId;
		                }else if(param.series){
		                	if(param.seriesIndex > -1){
			                	assetId = param.series[param.seriesIndex].assetId;
		                	}else{
			                	assetId = param.series[0].assetId;
		                	}
		                }else if(param.asset){
		                	assetId = param.asset.assetId;
		                }else if(param.data){
		                	assetId = param.data.assetId;
		                }
		                W.log.info(param);
		                W.log.info("W.state.playAssetId === " + W.state.playAssetId);
		                W.log.info("assetId === " + assetId);
		                if(W.state.isVod && W.state.playAssetId == assetId){
		                	W.SceneManager.destroyAll();
		                }else{
		                	if(W.purchaseValue){
		                		var purchaseComponent = new purchaseComp(_this);
		                    	purchaseComponent.cancelPurchase(function(result, data){
		                    		//실패시에도 retry 하지 않음..
		                    		//기술팀에서 콜 받아서 처리한다고함..
		                    		W.log.info(result);
		                    		W.log.info(data);
		                    	}, W.purchaseValue);
		                    	
		                		var reqData = {transactionId:W.purchaseValue.transactionId};
		            			reqData.product = {productId:W.purchaseValue.product.productId};
		            			reqData.commit = false;
		                    	W.CloudManager.sendLog("purchase", "puchase cancel ::r:: " + W.purchaseValue.transactionId);
		            			SdpDataManager.buyCommit(function(result, data){
			                    	W.CloudManager.sendLog("purchase", "puchase cancel :r: " + W.purchaseValue.transactionId + result);
		            				W.purchaseValue = undefined;
		            				if(W.purchaseValue2){
		            					W.purchaseValue = Object.assign(W.purchaseValue2);
		            					W.purchaseValue2 = undefined;
		            				}
		            				if(W.SceneManager.vodPlayScene){
		            					W.SceneManager.vodPlayScene.finishVod(function(){
		            						W.SceneManager.startScene({
												sceneName:"scene/vod/VodPlayScene", 
												backState:backState,
												param:param
											});
		            					});
		            				}else{
			            				W.SceneManager.startScene({
											sceneName:"scene/vod/VodPlayScene", 
											backState:backState,
											param:param
										});
		            				}
		            			}, reqData);
		                	}else{
		                		if(W.purchaseValue2){
	            					W.purchaseValue = Object.assign(W.purchaseValue2);
	            					W.purchaseValue2 = undefined;
	            				}
	            				if(W.SceneManager.vodPlayScene){
	            					W.SceneManager.vodPlayScene.finishVod(function(){
	            						W.SceneManager.startScene({
											sceneName:"scene/vod/VodPlayScene", 
											backState:backState,
											param:param
										});
	            					});
	            				}else{
			                		W.SceneManager.startScene({
										sceneName:"scene/vod/VodPlayScene", 
										backState:backState,
										param:param
									});
	            				}
		                	}
		                }
					}
				}
			};

			try{
				W.WebSocket = new WebSocket(websocketUrl);
				W.WebSocket.onopen = function (event) {
					_this.log("### WebSocket opened !! port(" + W.StbConfig.wsPort + "), pid(" + W.StbConfig.wsPid + ")");
					W.WebSocket.onerror = undefined;
					setLanguage();
				};

				W.WebSocket.onmessage = function (event) {
					CloudManager.receive(event.data);
				};
				
				//W.WebSocket.onclose = function (event) {
				//	var websocketUrl = "ws://localhost:" + W.StbConfig.wsPort + "/v1/req?sender=app&pid=" + W.StbConfig.wsPid;
				//	_this.log("websocketUrl :: " + websocketUrl);
				//};

				W.WebSocket.onerror = function() {
					W.WebSocket = null;
					W.WebSocket = new WebSocket(websocketUrl);
					W.WebSocket.onopen = function (event) {
						_this.log("### WebSocket opened !! port(" + W.StbConfig.wsPort + "), pid(" + W.StbConfig.wsPid + ")");
						W.WebSocket.onerror = undefined;
						setLanguage();
					};
					W.WebSocket.onmessage = function (event) {
						CloudManager.receive(event.data);
					};
					W.WebSocket.onerror = function() {
						W.WebSocket = null;
					}
				}
			}catch(ex){
				_this.error(ex);
			}
			
			// TODO PC 셋팅
			if(W.Config.DEVICE == "PC"){
				if(location.search.length === 0) {
					W.StbConfig.accessToken = "00ND0QTUQQD6SV8AVMARMTQVJS";
	//				W.StbConfig.groupId = "000072";
					W.StbConfig.cugType = "normal";
					W.StbConfig.accountId = "30074315114821";
					W.StbConfig.isLive = true;
					
	//				W.StbConfig.accessToken = "03HQHGQS4B3PAECQMO9URAKH04";//testbed
	//				W.StbConfig.accountId = "30074315201469";//testbed
	//				W.StbConfig.groupId = undefined;
	//				W.StbConfig.cugType = "normal";
	//				W.StbConfig.isLive = false;
					
					
					
					W.StbConfig.localCode = "A118";
	//				W.StbConfig.isKidsMode = true;
					W.StbConfig.isUHD = true;
					W.StbConfig.menuLanguage = 1;
					W.StbConfig.macAddress = "20d5bfdac0cf";
					W.StbConfig.adultMenuUse = 1;
					W.StbConfig.parentalRating = {rating:1, adultMenu:1};
					W.StbConfig.userName = "길동";
					W.StbConfig.favChCount = 0;
					// 1: poster, 2: list
					W.StbConfig.vodLookStyle = 1;
					// 1: ?��?��, 2: ?��?��?��?��
					W.StbConfig.vodContinuousPlay = 1;
					// 1: -20, 2: -10, 3: 0, 4: 10, 5: 20
					W.StbConfig.menuTransparency = 3;
					W.StbConfig.rating = 0;
					W.StbConfig.isCheckOut = false;
					W.StbConfig.availableCheckIn = false;
					//
					// 1: 10�???????????????, 2: 30�???????????????, 3: 1�???????????????
					W.StbConfig.menuDuration = 3;
					W.StbConfig.blockVodPlay = false;
					W.StbConfig.blockPurchase = false;
					W.StbConfig.enableSubsCancelBtn = true;
					W.StbConfig.kidsLimitVodCount = 2;
					W.StbConfig.stbType = "ANDROID";
					W.StbConfig.androidNoti = 7;
				}
				// 1: LCW, 2: default
				W.KEY.BACK = 8;
				W.KEY.EXIT = 88;
				W.KEY.COLOR_KEY_G = 71;
				W.KEY.COLOR_KEY_B = 66;
				W.KEY.COLOR_KEY_R = 82;
				W.KEY.COLOR_KEY_Y = 89;
				W.KEY.ENTER = 13;
				W.KEY.DELETE = 68;
				W.KEY.CHANNEL_UP = 85;
				W.KEY.CHANNEL_DOWN = 68;
				
				if(W.StbConfig.isLive) {
					W.Config.setENV("LIVE");
				} if(W.StbConfig.isLive == false) {
					W.Config.setENV("TEST");
				}

				setLanguage();
			}

			this.showHome = function(isReset){
				W.log.info("RootScene showHome !!");
				var sceneName = "scene/home/HomeScene";
				if(W.StbConfig.isKidsMode){
    				sceneName = "scene/kids/KidsHomeScene";
    			}
				W.entryPath.reset();

    			if(menuTree && !isReset){
    				for(var i=0; i < menuTree.length; i++){
						W.log.info(menuTree[i].menuType);
					}
    				var category;
					if(W.StbConfig.isKidsMode){
						for(var i=0; i < menuTree.length; i++){
							if(menuTree[i].menuType == "MC0004"){
								category = {category:menuTree[i]};
								break;
							}
						}
					}else{
						category = {category:menuTree};
					}
					
					_this.startScene({
						sceneName:sceneName,
						backState:W.SceneManager.BACK_STATE_DESTROYALL,
						param:category
					});
    			}else{
    				SdpDataManager.getMenuTree(function(result, data, sceneName){
						if(result) {
							menuTree = Object.assign([], data.data);
							if(W.StbConfig.isKidsMode){
								for(var i=0; i < data.data.length; i++){
									if(data.data[i].menuType == "MC0004"){
										category = {category:data.data[i]};
										break;
									}
								}
							}else{
								category = {category:data.data};
							}

							_this.startScene({
								sceneName:sceneName,
								backState:W.SceneManager.BACK_STATE_DESTROYALL,
								param:category
							});
						} else {
							W.Loading.stop();
							W.Loading.isLocked = true;
							W.PopupManager.openPopup({
								childComp:_this,
								popupName:"popup/ErrorPopup",
								code: (data && data.error && data.error.code) ? data.error.code : "1001",
					        	from : "SDP"
							});
						}
					}, {selector:"@detail"}, sceneName);
    			}
			};
		},
		onKeyPressed : function(event) {
			W.log.info("RootScene onKeyPressed "+event.keyCode);
			switch(event.keyCode) {
    		case W.KEY.HOME:
    			this.startScene({sceneName:"scene/home/HomeScene", 
    				backState:W.SceneManager.BACK_STATE_KEEPSHOW});
    			break;
    		}
		},
		onPause: function() {

		},
		onResume: function() {
			W.log.info("RootScene onResume !!");
			if(W.state.start == "CH_VOD"){
				W.entryPath.reset();
				var sceneName = "scene/channel/ChannelVodScene";
				var param = {sourceId:W.StbConfig.sceneValue.sourceId, releaseAdult:W.StbConfig.sceneValue.releaseAdult};

				_this.startScene({
					sceneName:sceneName,
					backState:W.SceneManager.BACK_STATE_KEEPSHOW,
					param:param
				});
			}else{
				W.CloudManager.closeApp();
			}
		},
		onRefresh: function() {
		},
		onPopupClosed : function(popup, desc){
        	if (desc) {
        		if (desc.popupName == "popup/Alert2BtnPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				this.startScene({sceneName:"scene/search/SearchScene", 
            				backState:W.SceneManager.BACK_STATE_KEEPSHOW});
        			}else{
        				W.CloudManager.closeApp();
        			}
        		}else if (desc.popupName == "popup/AlertPopup") {
        			W.CloudManager.closeApp();
        		}else if (desc.popupName == "popup/ErrorPopup") {
        			W.CloudManager.closeApp();
        		}else if (desc.popupName == "popup/purchase/PurchaseCompletePopup") {
        			W.CloudManager.closeApp();
        		}
        	}
		}
	});
});