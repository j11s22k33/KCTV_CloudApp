/**
 * manager/SceneGuideManager
 */
W.defineModule("manager/SceneGuideManager", function() {
	
	W.log.info("define SceneGuideManager");
    var recoDataManager = W.getModule("manager/RecommendDataManager");
    var uiplfDataManager = W.getModule("manager/UiPlfDataManager");
    var callbackFunction;
    var category;
    
    function receiveCallback(result, data, param){
    	if(result){
    		if(param == "CC0505"){
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
        	callbackFunction(scene);
    	}else{
        	callbackFunction();
    	}
    };
	
	function getScene(cateData, callback){
    	W.log.info("categoryCode ------- " + cateData.categoryCode);
    	callbackFunction = callback;
    	category = cateData;
    	
    	var sceneName;
    	var param = {};
    	var link;
    	switch(category.categoryCode){
    	case "CC0101" : 
    		sceneName = "scene/my/NoticeScene";
    		param.title = category.title;
			param.category = category;
    		break;
    	case "CC0102":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/WatchedListScene";
    		break;
    	case "CC0103":
    		param.category = category;
			param.category = category;
    		sceneName = "scene/home/CategoryListScene";
    		break;
    	case "CC0104":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/BookmarkScene";
    		break;
    	case "CC0105":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/LifeTimeVodScene";
    		break;
    	case "CC0107":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/PurchaseHistoryScene";
			break;
    	case "CC0108":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/PurchaseHistoryScene";
			break;
    	case "CC0109":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/PurchaseHistoryScene";
    		break;
    	case "CC0110":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/PurchaseHistoryScene";
			break;
    	case "CC0111":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/PurchaseHistoryScene";
			break;
    	case "CC0112":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/CouponScene";
    		break;
    	case "CC0113":
    		param.title = category.title;
			param.category = category;
    		sceneName = "scene/my/CoinScene";
    		break;
    	case "CC0114":
    		param.title = category.title;
    		sceneName = "scene/my/ChargeCoinScene";
    		break;
    	case "CC0001":
    		link = category.link;
    		break;
    	case "CC0201":
    	case "CC0202":
    	case "CC0203":
    		param.category = category;
    		sceneName = "scene/home/GuideScene";
    		break;
    	case "CC0204":
    		param.category = category;
    		sceneName = "scene/home/ProductListScene";
    		break;
    	case "CC0205":
    		param.category = category;
    		sceneName = "scene/home/ReservedProgramListScene";
    		break;
    	case "FY0001":
    		sceneName = "scene/channel/ScheduleForyouScene";
    		param = {category:category};
    		break;
    	case "FY0002":
    	case "FY0003":
    	case "FY0004":
    		sceneName = "scene/home/MenuForYouScene";
    		param = {category:category};
    		break;
    	case "CC0401":
    		sceneName = "scene/kids/KidsListScene";
    		param = {category:category};
    		break;
    	case "CC0501":
    		recoDataManager.getForyouActor(receiveCallback, "CC0501");
    		break;
    	case "CC0502":
			recoDataManager.getForyouGenre(receiveCallback, "CC0502");
    		break;
    	case "CC0503":
			recoDataManager.getForyouOverlap(receiveCallback, "CC0503");
    		break;
    	case "CC0504":
			recoDataManager.getForyouToday(receiveCallback, "CC0504");
    		break;
    	case "CC0505":
			var reqData = {offset:0, limit:100};
			uiplfDataManager.getPromotionForYou5List(receiveCallback, reqData, "CC0505");
    		break;
    	case "CC0506":
			recoDataManager.getForyouFree(receiveCallback, "CC0506");
    		break;
    	default :
    		if(category.isLink){
    			link = category.link;
    		}else{
    			if(category.isLeaf){
    				if(category.menuType =="MC0004"){
    					if(category.parentId == "0"){
            				sceneName = "scene/kids/KidsHomeScene";
    					}else{
            				sceneName = "scene/kids/KidsListScene";
    					}
    				}else if(category.menuType =="MC0009"){
    					uiplfDataManager.getPromotionList(function(result, data){
    						if(result){
    							link = data.custom.link;
    							var scene = {};
    				        	scene.link = link;
    				        	callback(scene);
    						}
    					}, {targetId:category.baseId, offset:0, limit:1});
    				}else{
        				sceneName = "scene/vod/MovieScene";
    				}
    	    		param = {category:category};
        		}else{
        			if(category.menuType =="MC0004"){
        				if(category.parentId == "0"){
            				sceneName = "scene/kids/KidsHomeScene";
    					}else{
            				sceneName = "scene/kids/KidsListScene";
    					}
    				}else{
            			sceneName = "scene/home/CategoryListScene";
    				}
    	    		param = {category:category};
        		}
    		}
    	}
    	
    	if(sceneName || link){
        	var scene = {};
        	scene.link = link;
        	scene.name = sceneName;
        	scene.param = param;
        	callback(scene);
    	}
    };
    return {
    	getScene : function(category, callback) {
    		getScene(category, callback);
    	}
    };
});