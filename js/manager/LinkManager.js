//@preDefine
/**
 * manager/LinkManager
 */
W.defineModule("manager/LinkManager", [ "mod/Util", "manager/ProductProcessManager"], function(util, ProductProcessManager) {
	
	W.log.info("define LinkManager");
	var _this;
	var entryInfo;
	var sdpManager;
	var recoDataManager;
    var uiplfDataManager; 
    var isClearedPin;

	function channelChange(sourceId){
		if(W.state.isVod){
			W.PopupManager.openPopup({
				title:W.Texts["popup_zzim_info_title"],
				popupName:"popup/AlertPopup",
				boldText:W.Texts["vod_alert_msg"],
				thinText:W.Texts["vod_alert_msg2"]}
			);
		}else{
			W.CloudManager.changeChannel(function(){
				W.log.info("Channel Changed !! " + sourceId);
			}, parseInt(sourceId));
		}
	};

	function getSdpManager(){
		if(!sdpManager) sdpManager = W.getModule("manager/SdpDataManager");
		return sdpManager;
	};
	
	function getRecoDataManager(){
		if(!recoDataManager) recoDataManager = W.getModule("manager/RecommendDataManager");
		return recoDataManager;
	};
	
	function getUiplfDataManager(){
		if(!uiplfDataManager) uiplfDataManager = W.getModule("manager/UiPlfDataManager");
		return uiplfDataManager;
	};
	
	function checkCategory(category){
		if(category.categoryCode == "CC0204"){
			startScene("scene/home/ProductListScene", {category:category});
		}else{
			if(category.menuType == "MC0001"){
	    		if(category.isLeaf){
	        		startScene(undefined, {category:category});
	    		}else{
	    			startScene("scene/home/CategoryListScene", {category:category});
	    		}
			}else if(category.menuType == "MC0002"){
				if(category.categoryCode == "CC0204"){
					startScene("scene/home/ProductListScene", {category:category});
				}else if(category.categoryCode == "CC0205"){
					startScene("scene/home/ReservedProgramListScene", {category:category});
				}else if(category.categoryCode.indexOf("FY") > -1){
					startScene(undefined, {category:category});
				}else{
					startScene("scene/home/GuideScene", {category:category});
				}
			}else if(category.menuType == "MC0003"){
				if(category.isLeaf){
					if(category.categoryCode.indexOf("FY") > -1){
	    				startScene(undefined, {category:category});
	    			}else{
	    				startScene("scene/vod/MovieScene", {category:category});
	    			}
				}else{
	    			startScene("scene/home/CategoryListScene", {category:category});
				}
			}else if(category.menuType == "MC0004"){
				var reqData = {categoryId:category.categoryId, selector:"@detail"};
				getSdpManager().getMenuTree(function(result, data){
					category.children = data.data;
					if(category.parentId == "0"){
						startScene("scene/kids/KidsHomeScene", {category : category});
					}else{
						startScene("scene/kids/KidsListScene", {category : category});
					}
				}, reqData);
			}else if(category.menuType == "MC0005"){
				startScene("scene/home/ForYouScene", {category: category});
			}else if(category.menuType == "MC0006"){
				startScene("scene/home/AppListScene", {category:category});
			}else if(category.menuType == "MC0007"){
				startScene("scene/home/AppListScene", {category:category});
			}else if(category.menuType == "MC0008"){
				startScene("scene/search/SearchScene");
			}else if(category.menuType == "MC0010"){
				if(category.categoryCode == "MC1000"){
					var reqData2 = {categoryId:category.categoryId, selector:"@detail"};
					_this.sdpManager.getMenuTree(function(result2, resultData2){
						if(result2 && resultData2.data && resultData2.data.length > 0){
							startScene("scene/setting/SettingMainScene", resultData2.data);
						}
					}, reqData2);
				}else{
					startScene("scene/setting/SettingScene", {targetId : category.categoryCode});
				}
			}else{
				if(category.isLeaf){
					startScene("scene/vod/MovieScene", {category:category});
				}else{
	    			startScene("scene/home/CategoryListScene", {category:category});
				}
			}
		}
		
	};

	function checkContent(type, content, linkData, isKids, entryTarget, isClearPin) {
		if(!isClearPin && ((W.StbConfig.adultMenuUse && content.isAdult) || (content.rating && util.getRating() && content.rating >= util.getRating()))) {
			if(W.StbConfig.isKidsMode) {
				var popup = {
					popupName:"popup/kids/KidsNoentryPopup",
					childComp:_this
				};
				W.PopupManager.openPopup(popup);
			} else {
				var popup = {
					childComp:_this,
					param : {isKids : isKids, linkType:linkData.linkType, entryTarget:entryTarget, content : content}
				};
				if(isKids) {
					popup.popupName = "popup/kids/PinPopup";
				} else {
					popup.popupName = "popup/AdultCheckPopup";
				}
				if(type == "asset") {
					popup.param.assetId = linkData.linkTarget;
				} else if(type == "sasset") {
					popup.param.sassetId = linkData.linkTarget;
				} else if(type == "series") {
					popup.param.seriesId = linkData.linkTarget;
				}
				W.PopupManager.openPopup(popup);
			}
		} else {
			var param = {};
			if(type == "asset") {
				param.assetId = linkData.linkTarget;
			} else if(type == "sasset") {
				param.sassetId = linkData.linkTarget;
			} else if(type == "series") {
				param.seriesId = linkData.linkTarget;
			}
			if(W.StbConfig.isKidsMode || content.contentCategory == "07") {
				startScene("scene/kids/KidsVodDetailScene", param);
			} else {
				startScene("scene/vod/VodDetailScene", param);
			}
		}
	}
	
	function receiveCallback(result, data, category){
    	if(result){
    		if(category.categoryCode == "CC0505"){
				category.resultList = data.data;
			}else{
				category.resultList = data.resultList;
			}
    		var scene = {};
    		if(category.categoryCode == "CC0501" || category.categoryCode == "CC0502" || category.categoryCode == "CC0504"){
    			scene.name = "scene/home/ForYouOneLineListScene";
    			scene.param = {forYouData:category};
        	}else if(category.categoryCode == "CC0505"){
        		scene.name = "scene/home/ForYouLargeListScene";
    			scene.param = {forYouData:category};
        	}else{
        		scene.name = "scene/vod/MovieScene";
    			scene.param = {isRecommend:true, data:category};
        	}

        	W.SceneManager.startScene({
                sceneName: scene.name,
                param: scene.param,
                backState: W.SceneManager.BACK_STATE_KEEPHIDE
            });
    	}
    };
	
	function startScene(sceneName, param){
		W.log.info(sceneName);
		if(entryInfo){
			W.entryPath.push(entryInfo.target, entryInfo.data, entryInfo.from);
		}
		
		if(!param) param = {};
    	
    	if(!sceneName){
    		switch(param.category.categoryCode){
        	case "CC0101":
        		param.title = param.category.title;
        		sceneName = "scene/my/NoticeScene";
        		break;
        	case "CC0102":
        		param.title = param.category.title;
        		sceneName = "scene/my/WatchedListScene";
        		break;
        	case "CC0103":
        		param.category = param.category;
        		sceneName = "scene/home/CategoryListScene";
        		break;
        	case "CC0104":
        		param.title = param.category.title;
        		sceneName = "scene/my/BookmarkScene";
        		break;
        	case "CC0105":
        		param.title = param.category.title;
        		sceneName = "scene/my/LifeTimeVodScene";
        		break;
        	case "CC0112":
        		param.title = param.category.title;
        		sceneName = "scene/my/CouponScene";
        		break;
        	case "CC0113":
        		param.title = param.category.title;
        		sceneName = "scene/my/CoinScene";
        		break;
        	case "CC0114":
        		param.title = param.category.title;
        		sceneName = "scene/my/ChargeCoinScene";
        		break;
        	case "CC0401":
        		sceneName = "scene/kids/KidsListScene";
        		param = {category:param.category};
        		break;
        	case "FY0001":
        		sceneName = "scene/channel/ScheduleForyouScene";
        		param = {category:param.category};
        		break;
        	case "FY0002":
        	case "FY0003":
        	case "FY0004":
        		sceneName = "scene/home/MenuForYouScene";
        		param = {category:param.category};
        		break;
        	case "CC0501":
        		getRecoDataManager().getForyouActor(receiveCallback, param.category);
        		break;
        	case "CC0502":
        		getRecoDataManager().getForyouGenre(receiveCallback, param.category);
        		break;
        	case "CC0503":
        		getRecoDataManager().getForyouOverlap(receiveCallback, param.category);
        		break;
        	case "CC0504":
        		getRecoDataManager().getForyouToday(receiveCallback, param.category);
        		break;
        	case "CC0505":
    			var reqData = {offset:0, limit:100};
    			getUiplfDataManager().getPromotionForYou5List(receiveCallback, reqData, param.category);
        		break;
        	case "CC0506":
        		getRecoDataManager().getForyouFree(receiveCallback, param.category);
        		break;
        	}
    	}
    	
    	if(sceneName){
    		param.isClearPin = isClearedPin
    		W.SceneManager.startScene({
                sceneName: sceneName,
                param: param,
                backState: W.SceneManager.BACK_STATE_KEEPHIDE
            });
    	}
	};
	
	function startApplication(data){
		if(W.state.isVod){
			W.PopupManager.openPopup({
                title:W.Texts["popup_zzim_info_title"],
                popupName:"popup/AlertPopup",
                boldText:W.Texts["vod_alert_msg"],
                thinText:W.Texts["vod_alert_msg2"]}
            );
		}else{
			W.CloudManager.runApplication(undefined, data);
		}
	};

	function purchaseCallback(result){
    	W.log.info(result);
    	if(result.result == "SUCCESS"){
    		setTimeout(function(asset){
				 var popup = {
		            childComp:W.SceneManager.getCurrentScene(), 
     				popupName:"popup/purchase/PurchaseCompletePopup",
     				contents:asset
     			};
 	    		W.PopupManager.openPopup(popup);
			}, 300, result.asset);
    	}else{
    		if(result.result == "BACK"){
        		if(W.SceneManager.getCurrentScene().id.indexOf("RootScene") > 0){
        			W.CloudManager.closeApp();
        		}
        	}else{
        		W.PopupManager.openPopup({
                    childComp:W.SceneManager.getCurrentScene(),
                    popupName:"popup/ErrorPopup",
                    code:result.resultData.error.code,
                    message:[result.resultData.error.message],
					from : "SDP"}
                );
        	}
    	}
    };
    
	var productProcessManager = ProductProcessManager.getManager(purchaseCallback);

	function openErrorPopup() {
		W.PopupManager.openPopup({
			childComp: this,
			popupName: "popup/ErrorPopup",
			code: "0701",
			from : "SDP"
		});
	}
	
    return {
    	action : function(type, data, isKids, entryTarget, fromComp, isClearPin){
    		W.log.info("type == " + type);
    		W.log.info("isClearPin == " + isClearPin);
    		isClearedPin = isClearPin;
    		W.log.info(data);
    		var from = fromComp ? fromComp : "LinkManager";
    		_this = this;
    		_this.sdpManager = W.getModule("manager/SdpDataManager");
    		entryInfo = undefined;
    		if(type == "L"){ //L 은 link object 인 경우 P는  다른 Object 인 경우
    			if(data.linkType == "ch01"){
    				channelChange(data.linkTarget);
				}else if(data.linkType == "as01"){
					var reqData = {assetId:data.linkTarget, selector:"isAdult,rating,contentCategory"};
					_this.sdpManager.getDetailAsset(function(result,resultData){
						if(result && resultData.data && resultData.data.length > 0){
							if(entryTarget){
								entryInfo = {target:entryTarget + ".asset", data:data.linkTarget, from:from};
							}
							checkContent("asset", resultData.data[0], data, isKids, entryTarget, isClearPin);
						} else {
							openErrorPopup();
						}
					}, reqData);
				}else if(data.linkType == "as02"){
					var reqData = {sassetId:data.linkTarget, selector:"isAdult,rating,contentCategory"};
					_this.sdpManager.getSAssetsDetail(function(result,resultData){
						if(result && resultData.data && resultData.data.length > 0){
							if(entryTarget){
								entryInfo = {target:entryTarget + ".sasset", data:data.linkTarget, from:from};
							}
							checkContent("sasset", resultData.data[0], data, isKids, entryTarget, isClearPin);
						} else {
							openErrorPopup();
						}
					}, reqData);
				}else if(data.linkType == "sr01"){
					var reqData = {seriesId:data.linkTarget, selector:"isAdult,rating,contentCategory"};
					_this.sdpManager.getSeriesDetail(function(result,resultData){
						if(result && resultData.data && resultData.data.length > 0){
							if(entryTarget){
								entryInfo = {target:entryTarget + ".series", data:data.linkTarget, from:from};
							}
							checkContent("series", resultData.data[0], data, isKids, entryTarget, isClearPin);
						} else {
							openErrorPopup();
						}
					}, reqData);
				}else if(data.linkType == "ct01"){
					var reqData = {bctgrId:data.linkTarget, selector:"@detail"};
					_this.sdpManager.getMenuDetail(function(result, resultData){
						if(result && resultData.data && resultData.data.length > 0){
							if(entryTarget){
								entryInfo = {target:entryTarget + ".category", data:resultData.data[0], from:from};
							}
							if(W.StbConfig.isKidsMode) {
								if((W.StbConfig.adultMenuUse && resultData.data[0].isAdult)
									|| resultData.data[0].isAdultOnly || resultData.data[0].menuType != "MC0004") {
									var popup = {
										popupName:"popup/kids/KidsNoentryPopup",
										childComp:_this
									};
									W.PopupManager.openPopup(popup);
								} else {
									checkCategory(resultData.data[0]);
								}
							} else if(((W.StbConfig.adultMenuUse && resultData.data[0].isAdult) || resultData.data[0].isAdultOnly) && !isClearedPin) {
								var popup = {
									type:"",
									popupName:isKids ? "popup/kids/PinPopup" : "popup/AdultCheckPopup",
									childComp:_this,
									param : {isKids : isKids, isLeaf : resultData.data[0].isLeaf, linkType:data.linkType, category: resultData.data[0], entryTarget:entryTarget}
								};
								W.PopupManager.openPopup(popup);
							} else {
								checkCategory(resultData.data[0]);
							}
						} else {
							openErrorPopup();
						}
					}, reqData);
				}else if(data.linkType == "pr01"){
					// 상품 , 상품 ID
					var sdpDataManager = W.getModule("manager/SdpDataManager");
					var reqData = {productId: data.linkTarget, selector:"@detail"};
	    			sdpDataManager.getProductDetail(function(result, data){
	    				W.log.info(data);
	    				if(result && data.data.length > 0){
	    					if(entryTarget){
								entryInfo = {target:entryTarget + ".product", data:data.data[0].productId, from:from};
							}
	    					if(data.data[0].purchase){
	    						var pType = data.data[0].productType;
	    						if(pType == "VDSRDT" || pType == "VDSRLF" || pType == "VDASDT" || pType == "VDASLF"){
	    							W.SceneManager.startScene({
	    								sceneName:"scene/vod/VodPackageScene", 
	    			    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
	    			    				param:{
	    			    					product: data.data[0],
	    			    					asset: data.data[0].asset
	    			    				}
	    			    			});
	    						}else if(pType == "CHTRSS"){
	    							//티어 상품은 반응 없음
	    						}else{
	    							data.data[0].isPurchased = true;
	    							productProcessManager.process(data.data[0]);
	    						}
	    					}else{
			    				productProcessManager.process(data.data[0]);
	    					}
	    				}else{
	    					W.PopupManager.openPopup({
	    	                    childComp:W.SceneManager.getCurrentScene(),
	    	                    title:W.Texts["popup_zzim_info_title"],
	    	                    popupName:"popup/AlertPopup",
	    	                    boldText:W.Texts["no_data"]}
	    	                );
	    				}
	    			}, reqData);
				}else if(data.linkType == "ev01"){
					// 이벤트 , 이벤트 ID
				}else if(data.linkType == "ap01"){
					// TV앱 (OCAP), 채널 소스 ID
					startApplication(data);
				}else if(data.linkType == "ap02"){
					// TV앱 (Android), Package Name
					startApplication(data);
				}else if(data.linkType == "ap03"){
					// TV앱 (Cloud), 앱 ID
					startApplication(data);
				}else if(data.linkType == "sh01"){
					// 검색 , 검색 필드
					if(entryTarget){
						entryInfo = {target:entryTarget + ".search", data:data.linkTarget, from:from};
					}
					startScene("scene/search/SearchResultScene", {keyword: data.linkTarget});
				}else if(data.linkType == "nt01"){
					// 공지 , 공지 ID
					var uiPlfDataManager = W.getModule("manager/UiPlfDataManager");
					var reqData = {noticeId:data.linkTarget};
					uiPlfDataManager.getNotice(function(result, data){
						if(result && data){
							var popup = {
		        				popupName:"popup/my/NoticePopup",
		        				desc:data
		        			};
		    	    		W.PopupManager.openPopup(popup);
						}
					}, reqData);
				}else if(data.linkType == "cp01"){
					// 쿠폰 , 쿠폰 ID
					if(entryTarget){
						entryInfo = {target:entryTarget + ".coupon", data:undefined, from:from};
					}
					startScene("scene/my/CouponScene");
				}
    		}else if(type == "P"){
    			if(data.type == "program"){
					var reqData = {sassetId:data.id, selector:"isAdult,rating,contentCategory"};
					_this.sdpManager.getSAssetsDetail(function(result,resultData){
						if(result && resultData.data && resultData.data.length > 0){
							if(entryTarget){
								entryInfo = {target:entryTarget + ".program", data:data.id, from:from};
							}
							var link = {linkType:"as02", linkTarget:data.id};
							checkContent("sasset", resultData.data[0], link, isKids, entryTarget, isClearPin);
						} else {
							openErrorPopup();
						}
					}, reqData);
				}else if(data.type == "category"){
					var reqData = {bctgrId:data.id};
					_this.sdpManager.getMenuDetail(function(result, resultData){
						if(result && resultData.data && resultData.data.length > 0){
							if(entryTarget){
								entryInfo = {target:entryTarget + ".category", data:resultData.data[0], from:from};
							}
							if(W.StbConfig.isKidsMode) {
								if((W.StbConfig.adultMenuUse && resultData.data[0].isAdult)
									|| resultData.data[0].isAdultOnly || resultData.data[0].menuType != "MC0004") {
									var popup = {
										popupName:"popup/kids/KidsNoentryPopup",
										childComp:_this
									};
									W.PopupManager.openPopup(popup);
								} else {
									checkCategory(resultData.data[0]);
								}
							} else if((W.StbConfig.adultMenuUse && resultData.data[0].isAdult) || resultData.data[0].isAdultOnly) {
								var popup = {
									type:"",
									popupName:isKids ? "popup/kids/PinPopup" : "popup/AdultCheckPopup",
									childComp:_this,
									param : {isKids : isKids, linkType:"ct01", category: resultData.data[0], entryTarget:entryTarget}
								};
								W.PopupManager.openPopup(popup);
							} else {
								checkCategory(resultData.data[0]);
							}
						} else {
							openErrorPopup();
						}
					}, reqData);
				}else if(data.type == "channel"){
					channelChange(data.id);
				}else if(data.type == "url"){
					var link = {linkType:"ap03", linkTarget:data.id};
					startApplication(link);
				}
    		}
    	},
		onPopupClosed : function(popup, desc) {
			if (desc) {
				if (desc.popupName == "popup/AdultCheckPopup" || desc.popupName == "popup/kids/PinPopup") {
					if (desc.action == W.PopupManager.ACTION_OK) {
						W.log.info(popup, desc)
						isClearedPin = true;
						var data = desc.param;
						if(data.linkType == "as01"){
							if(data.content.contentCategory == "07") {
								startScene("scene/kids/KidsVodDetailScene", data);
							} else {
								startScene("scene/vod/VodDetailScene", data);
							}
						}else if(data.linkType == "as02"){
							if(data.content.contentCategory == "07") {
								startScene("scene/kids/KidsVodDetailScene", data);
							} else {
								startScene("scene/vod/VodDetailScene", data);
							}
						}else if(data.linkType == "sr01"){
							if(data.content.contentCategory == "07") {
								startScene("scene/kids/KidsVodDetailScene", data);
							} else {
								startScene("scene/vod/VodDetailScene", data);
							}
						}else if(data.linkType == "ct01"){
							checkCategory(data.category);
						}else if(data.linkType == "program"){
							if(data.content.contentCategory == "07") {
								startScene("scene/kids/KidsVodDetailScene", {sassetId: data.id});
							} else {
								startScene("scene/vod/VodDetailScene", {sassetId: data.id});
							}
						}else if(data.linkType == "category"){
							if(data.content.contentCategory == "07") {
								startScene("scene/kids/KidsListScene", {category: data.category});
							} else {
								startScene("scene/home/CategoryListScene", {category: data.category});
							}
						}
					} else {
						if(W.SceneManager.getSceneStack().length < 2) {
							W.CloudManager.closeApp();
						}
					}
				}
			}
		}
    };
});