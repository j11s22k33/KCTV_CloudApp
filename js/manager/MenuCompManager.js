//@preDefine
/**
 * manager/MenuCompManager
 */
W.defineModule("manager/MenuCompManager", [ "mod/Util"], function(util) {
	
	W.log.info("define MenuCompManager");
	var comp;
	var _comp;
	
	var pinCheckComp, categoryListComp, linkComp, vodListComp, noticeComp, watchedListComp,
	playListComp, bookmarkComp, lifeTimeVodComp, purchaseHistoryComp, subscribeComp,
	couponComp, coinComp, guideComp, ProductListComp, reservedProgramListComp,
	scheduleForyouComp, menuForyouComp, kidsHomeComp, appListComp, foryouListComp, settingComp;
    return {
    	createComp : function(_comp_area, _this, isClearPin, menu, depth, isPinComp, callback, _parent) {
    		W.log.info("depth ===================== " + depth);
    		W.log.info(menu);

    		if((!isClearPin && menu && (menu.isAdultOnly || (W.StbConfig.adultMenuUse && menu.isAdult))) || isPinComp){
    			checkComp(pinCheckComp, "comp/home/PinCheck", _this, depth==0 ? true : false);
    		}else if(menu.isLink || menu.menuType == "MC0009"){
    			checkComp(linkComp, "comp/home/Link", _this, true, menu);
    		}else{
    			//마이 KCTV
    			if(menu.categoryCode == "CC0101"){
    				checkComp(noticeComp, "comp/my/Notice", _comp_area, _this);
				}else if(menu.categoryCode == "CC0102"){
    				checkComp(watchedListComp, "comp/my/WatchedList", _comp_area, _this, {isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0103"){
    				checkComp(playListComp, "comp/my/PlayList", _comp_area, _this, {listId : menu.listId, isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0104"){
					checkComp(bookmarkComp, "comp/my/Bookmark", _comp_area, _this, {isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0105"){
					checkComp(lifeTimeVodComp, "comp/my/LifeTimeVod", _comp_area, _this, {isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0107"){
					checkComp(purchaseHistoryComp, "comp/my/PurchaseHistory", _comp_area, _this, {categoryCode : menu.categoryCode, isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0108"){
					checkComp(purchaseHistoryComp, "comp/my/PurchaseHistory", _comp_area, _this, {categoryCode : menu.categoryCode, isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0109"){
					checkComp(purchaseHistoryComp, "comp/my/PurchaseHistory", _comp_area, _this, {categoryCode : menu.categoryCode, isClearPin:isClearPin});
				}else if(menu.categoryCode == "CC0110"){	//상품가입
					checkComp(subscribeComp, "comp/my/Subscribe", _comp_area, _this, {categoryCode : menu.categoryCode});
				}else if(menu.categoryCode == "CC0111"){	//코인구매
					checkComp(subscribeComp, "comp/my/Subscribe", _comp_area, _this, {categoryCode : menu.categoryCode});
				}else if(menu.categoryCode == "CC0112"){
					checkComp(couponComp, "comp/my/Coupon", _comp_area, _this);
				}else if(menu.categoryCode == "CC0113"){
					checkComp(coinComp, "comp/my/Coin",  _comp_area, _this);
				}else if(menu.categoryCode == "CC0114"){
	    			checkComp(linkComp, "comp/home/Link", _this, false, menu);
				}
				
    			//채널 편성표
				else if(menu.categoryCode == "CC0201"){
					checkComp(guideComp, "comp/guide/Guide", _comp_area, _this, menu);
				}else if(menu.categoryCode == "CC0202"){
					checkComp(guideComp, "comp/guide/Guide", _comp_area, _this, menu, "FavChannel", 0);
				}else if(menu.categoryCode == "CC0203"){
					checkComp(guideComp, "comp/guide/Guide", _comp_area, _this, menu, "GenreChannel", 0);
				}else if(menu.categoryCode == "CC0204"){
					checkComp(ProductListComp, "comp/home/ProductList", _comp_area, _this, menu.baseId);
				} else if(menu.categoryCode == "CC0205"){
					checkComp(reservedProgramListComp, "comp/guide/ReservedProgramList", _comp_area, _this);
				}
    			
				else if(menu.categoryCode == "FY0001"){//편성표 for you
					checkComp(scheduleForyouComp, "comp/guide/ScheduleForyou", _comp_area, _this, menu);
				}else if(menu.categoryCode == "FY0002" || menu.categoryCode == "FY0003" || menu.categoryCode == "FY0004"){//영화 및 기타 for you
					checkComp(menuForyouComp, "comp/home/MenuForyou", _comp_area, _this, menu);
				}
				
				else if(menu.menuType == "MC0004" && menu.parentId == "0"){
					checkComp(kidsHomeComp, "comp/kids/KidsHome", undefined, menu, _parent);
				}else if(menu.menuType == "MC0006"){
					checkComp(appListComp, "comp/home/AppList", _comp_area, _this, {category:menu});
				}else if(menu.menuType == "MC0007"){
					checkComp(appListComp, "comp/home/AppList", _comp_area, _this, {category:menu});
				}else if(menu.menuType == "MC0005"){
					checkComp(foryouListComp, "comp/home/ForYouList", _comp_area, _this, menu);
				}else if(menu.menuType == "MC0010"){
					checkComp(settingComp, "comp/setting/SettingMain", _comp_area, _this, menu.children);
				}else if(menu.menuType == "MC0008"){
	    			checkComp(linkComp, "comp/home/Link", _this, false, menu.isLink);
				}else{
					if(menu.isLeaf){
						checkComp(vodListComp, "comp/vod/VodList", _comp_area, _this, menu, isClearPin);
					}else{
						checkComp(categoryListComp, "comp/home/CategoryList", undefined, menu, isClearPin);
					}
				}
    		}
    		
    		function checkComp(targetComponent, path, param1, param2, param3, param4, param5, param6, param7){
    			if(!targetComponent){
    				require([path], function(compData){
    					targetComponent = compData;
    					returnCallback(targetComponent, param1, param2, param3, param4, param5, param6, param7);
        			});
    			}else{
					returnCallback(targetComponent, param1, param2, param3, param4, param5, param6, param7);
    			}
    		};
    		
    		function returnCallback(targetComp, param1, param2, param3, param4, param5, param6, param7){
    			var newComp = targetComp.getNewComp();
				var comp = {comp:newComp, _comp:newComp.create(param1, param2, param3, param4, param5, param6, param7)};
				callback(comp);
    		};
    	},
    	getComp : function() {
    		return _comp;
    	}
    };
});