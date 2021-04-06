W.defineModule("comp/vod/DetailModule", ["mod/Util", "manager/ProductProcessManager"], function(util, ProductProcessManager) {
	var BTN_TYPE_TRAILER = 0;
	var BTN_TYPE_UHD = 1;
	var BTN_TYPE_HD = 2;
	var BTN_TYPE_SUBSCRIBED = 3;
	var BTN_TYPE_TERM = 4;
	var BTN_TYPE_LIFETIME = 5;
	var BTN_TYPE_PACKAGE = 6;
	
	function DetailModule(_scene, isKidsMode){

		this.openSideOption = function(_parent, contentsType, detail, seriesEpisode, btnObj){
			var popupData={options:[]};
			var isNeedNumKey = false;
			if(contentsType == "series"){
				popupData.options.push({
					name: detail.members[0].title,
					param:"ZZIM_S",
					subOptions: [//
					   {type: "box", name: W.Texts["option_popup_add_zzim_series"]},
					   {type: "box", name: W.Texts["option_popup_add_zzim_series2"]},
					   {type: "box", name: W.Texts["popup_zzim_move_title"]}
					]
				});
				
				popupData.options.push({
					name: W.Texts["option_popup_move_episode"],
					param:"SERIES_MOVE",
					subOptions: [//
					    {type:"inputBox", episodeList : seriesEpisode, button : W.Texts["option_popup_move_episode"]}
					]
				});
				

				if(!W.StbConfig.blockPurchase){
					var list;
					if(detail.members[0].products && detail.members[0].purchase){
//						var productId = detail.members[0].purchase.productId;
//						var count = 0;
//						for(var i=0; i < detail.members[0].products.length; i++){
//							if(detail.members[0].products[i].productType != "VDRVDT" && detail.members[0].products[i].productId != productId){
//								count++;
//							}
//						}
						list = getNotPurchasedList(btnObj);
					}

					if(btnObj.type != BTN_TYPE_TRAILER && list && list.products.length > 0){
						popupData.options.push({
							name: detail.members[0].title,
							param:"PURCHASE",
							subOptions: [//
							   {type: "box", name: W.Texts["option_popup_purchase"] + " (" + list.products.length + ")"}
							]
						});
					}
				}
				
				isNeedNumKey = true;
			}else{
				popupData.options.push({
					name: detail.title,
					param:"ZZIM",
					subOptions: [//
					   {type: "box", name: W.Texts["option_popup_add_zzim"]},
					   {type: "box", name: W.Texts["popup_zzim_move_title"]}
					]
				});
				if(!detail.isMV && !W.StbConfig.blockPurchase){
					var list = getNotPurchasedList(btnObj);
					W.log.info(list);
//					var count = 0;
//					for(var i=0; i < btnObj.assets.length; i++){
//						if(!util.isWatchable(btnObj.assets[i])){
//							count++;
//						}
//					}
					if(btnObj.type != BTN_TYPE_TRAILER && list && list.products.length > 0){
						popupData.options.push({
							name: detail.title,
							param:"PURCHASE",
							subOptions: [//
							   {type: "box", name: W.Texts["option_popup_purchase"] + " (" + list.products.length + ")"}
							]
						});
					}
				}
			}

			var popup = {
				popupName:"popup/sideOption/VodSideOptionPopup",
				optionData:popupData,
				isNeedNumKey:isNeedNumKey,
				childComp : _parent
			};
			W.PopupManager.openPopup(popup);
		};
		
		function getNotPurchasedList(btnObj){
			var assets = [];
			var products = [];
			if(btnObj.type == BTN_TYPE_PACKAGE){
				for(var i=0; i < btnObj.products.length; i++){
					var isExist = false;
					for(var j=0; j < btnObj.assets.length; j++){
						if(btnObj.assets[j].purchase && btnObj.assets[j].purchase.productId == btnObj.products[i].productId){
							isExist = true;
							break;
						}
					}
					if(!isExist){
						products.push(btnObj.products[i]);
					}
				}
			}else{
				for(var i=0; i < btnObj.assets.length; i++){
					if(btnObj.assets[i]){
						if(btnObj.assets[i].isSeries){
							var productId = btnObj.assets[i].purchase.productId;
							var count = 0;
							for(var j=0; j < btnObj.assets[i].products.length; j++){
								if(btnObj.assets[i].products[j].productType != "VDRVDT" && btnObj.assets[i].products[j].productId != productId){
									assets.push(btnObj.assets[i]);
									products.push(btnObj.assets[i].products[j]);
								}
							}
						}else{
							if(btnObj.assets[i] && !util.isWatchable(btnObj.assets[i])){
								assets.push(btnObj.assets[i]);
								products.push(btnObj.products[i]);
							}
						}
					}
				}
			}
			W.log.info(products);
			return {assets:assets, products:products}
		};

		this.onPopupClosed = function(_parent, desc, btnObj, detail, eIdx, totalBtnObjs){
			var sdpDataManager = W.getModule("manager/SdpDataManager");
			if (desc.popupName == "popup/detail/MoreInfoPopup" || desc.popupName == "popup/kids/KidsMoreInfoPopup") {
    			if (desc.action == W.PopupManager.ACTION_OK && !W.StbConfig.isKidsMode) {
            		W.SceneManager.startScene({
    					sceneName:"scene/search/SearchResultScene", 
        				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
        				param:{
        					keyword: desc.keyword,
        					m_field: desc.m_field
        				}
        			});
    			}
			}else if (desc.popupName == "popup/detail/PackageSelectPopup") {
    			if (desc.action == W.PopupManager.ACTION_OK) {
    				W.SceneManager.startScene({
    					sceneName:"scene/vod/VodPackageScene", 
        				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
        				param:{
        					product: desc.product,
        					asset: desc.asset
        				}
        			});
    			}
			}else if (desc.popupName == "popup/player/VodContinuePopup") {
				if (desc.action == W.PopupManager.ACTION_OK) {
					if(desc.idx < 2){
	    				if(desc.idx == 1){
	    					desc.desc.prepareInfo.resume.offset = 0;
	    				}
	    				var param = {data:desc.desc, isKidsMode:isKidsMode, isClearPin:_scene.param.isClearPin};
	    				if(_scene.seriesAssetEpisodes && _scene.seriesAssetEpisodes.length > 0){
	    					param.series = _scene.seriesAssetEpisodes;
	    					param.seriesIndex = _scene.DetailComp.getEpisodeIndex();
	    				}
	    				W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
					}else{
						if(W.purchaseValue2){
			        		var reqData = {transactionId:W.purchaseValue2.transactionId};
			    			reqData.product = {productId:W.purchaseValue2.product.productId};
			    			reqData.commit = true;
			            	W.CloudManager.sendLog("purchase", "puchase confirm ::d:: " + W.purchaseValue2.transactionId);
			            	var sdpDataManager = W.getModule("manager/SdpDataManager");
			            	sdpDataManager.buyCommit(function(result, data){
			                	W.CloudManager.sendLog("purchase", "puchase confirm :d: " + W.purchaseValue2.transactionId + result);
			    				W.purchaseValue2 = undefined;
			    			}, reqData);
			        	}
					}
    			}
			}else if (desc.popupName == "popup/detail/TrailerSelectPopup") {
    			if (desc.action == W.PopupManager.ACTION_OK) {
    				var isPurchased = false;
    				if(totalBtnObjs.length > 1){
        				for(var i=0; i < totalBtnObjs.length; i++){
        					if(totalBtnObjs[i].type != BTN_TYPE_TRAILER && totalBtnObjs[i].isPurchasedCount > 0){
        						isPurchased = true;
        						break;
        					}
        				}
    				}else{
    					//예고편 버튼만 있을 경우 구매 된 것으로 만들어서 예고편 종료 팝업에 구매 버튼이 안 보이도록 한다.
    					isPurchased = true;
    				}
    				
    				this.playVod(_parent, btnObj.assets[desc.idx], true, isPurchased, getPuchaseProduct(totalBtnObjs));
    			}
			}else if (desc.popupName == "popup/detail/SubscribedSelectPopup") {
    			if (desc.action == W.PopupManager.ACTION_OK) {
    				var productProcessManager = ProductProcessManager.getManager();
    				productProcessManager.process(desc.product, desc.asset);
    			}
			}else if (desc.popupName == "popup/detail/SelectUhdContentsPopup"){
				if (desc.action == W.PopupManager.ACTION_OK) {
					this.playVod(_parent, desc.asset);
    			}
			}else if (desc.popupName == "popup/my/ZzimAddPopup"){
				if (desc.action == W.PopupManager.ACTION_OK) {
                	W.PopupManager.openPopup({
                        childComp:_parent,
                        type:"2LINE",
                        popupName:"popup/FeedbackPopup",
                        title:desc.title,
                        desc:W.Texts["zzim_msg_add"].replace("@title@", desc.listTitle)}
                    );
                }else{
                	if(desc.error){
                		if(desc.error.code == "C0501"){
                			W.PopupManager.openPopup({
                				childComp:_parent,
                                title:W.Texts["popup_zzim_info_title"],
                                popupName:"popup/AlertPopup",
                                boldText:W.Texts["popup_zzim_move_guide4"],
                                thinText:W.Texts["popup_zzim_move_guide5"]}
        	                );
                		}else{
                			W.PopupManager.openPopup({
                                childComp:_parent,
                                popupName:"popup/ErrorPopup",
                                code:desc.error.code,
            					from : "SDP"}
                            );
                		}
                	}
                }
			}else if (desc.popupName.indexOf("VodSideOptionPopup") > 0) {
                if (desc.action == W.PopupManager.ACTION_OK) {
                	W.log.info(desc);
                	if(desc.param.param == "SERIES_MOVE"){
                		_parent.jumpEpisode(desc.param.value);
                	}else if(desc.param.param == "ZZIM"){
                		if(desc.param.subOptions == 0){
	                		var popup = {
	            				popupName:"popup/my/ZzimAddPopup",
	            				param:{data:detail, type:"sasset"},
	            				childComp:_parent
	            			};
	        	    		W.PopupManager.openPopup(popup);
                		}else if(desc.param.subOptions == 1){
                			var reqData = {menuType:"MC0001"};
                			W.log.info(_parent);
                			sdpDataManager.getChildMenuTree(function(result, menuData){
                            	if(result && menuData.total > 0){
                            		for(var i=0; i < menuData.data.length; i++){
                            			if(menuData.data[i].categoryCode == "CC0103"){
                            				W.SceneManager.startScene({
                            					sceneName:"scene/home/CategoryListScene", 
                            					param:{category:menuData.data[i]},
                        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            				break;
                            			}
                            		}
                            	}
                            }, reqData);
                		}
                	}else if(desc.param.param == "ZZIM_S"){
                		if(desc.param.subOptions == 0){
                			var popup = {
                				popupName:"popup/my/ZzimAddPopup",
                				param:{data:detail.members[0], type:"asset"},
                				childComp:_parent
                			};
            	    		W.PopupManager.openPopup(popup);
                		}else if(desc.param.subOptions == 1){
                			var popup = {
                				popupName:"popup/my/ZzimAddPopup",
                				param:{data:detail, type:"series"},
                				childComp:_parent
                			};
            	    		W.PopupManager.openPopup(popup);
                		}else if(desc.param.subOptions == 2){
                			var reqData = {menuType:"MC0001"};
                			sdpDataManager.getChildMenuTree(function(result, menuData){
                            	if(result && menuData.total > 0){
                            		for(var i=0; i < menuData.data.length; i++){
                            			if(menuData.data[i].categoryCode == "CC0103"){
                            				W.SceneManager.startScene({
                            					sceneName:"scene/home/CategoryListScene", 
                            					param:{category:menuData.data[i]},
                        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            				break;
                            			}
                            		}
                            	}
                            }, reqData);
                		}
                	}else if(desc.param.param == "PURCHASE"){
                		if(btnObj.type == BTN_TYPE_UHD || btnObj.type == BTN_TYPE_HD || btnObj.type == BTN_TYPE_LIFETIME){
                			var list = getNotPurchasedList(btnObj);
                			W.SceneManager.startScene({
            					sceneName:"scene/vod/PurchaseVodScene", 
                				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                				param:{data:list.assets, type:"V", products:list.products}
                			});
                    	}else if(btnObj.type == BTN_TYPE_SUBSCRIBED || btnObj.type == BTN_TYPE_TERM){
                    		var list = getNotPurchasedList(btnObj);
                    		if(list && list.products.length > 1){
                				var popup = {
                    				popupName:"popup/detail/SubscribedSelectPopup",
                    				list:list.products,
                    				assets:list.assets,
                    				childComp:_parent
                    			};
                	    		W.PopupManager.openPopup(popup);
                			}else{
                				var productProcessManager = ProductProcessManager.getManager();
                				productProcessManager.process(list.products[0], list.assets[0]);
                			}
                        }else if(btnObj.type == BTN_TYPE_PACKAGE){
                        	var list = getNotPurchasedList(btnObj);
                        	
                			if(list && list.products.length > 1){
                				var popup = {
            	    				popupName:"popup/detail/PackageSelectPopup", 
            	    				type:"package",
                    				list:list.products,
                    				assets:list.assets,
                    				childComp:_parent
            	    			};
            	    			W.PopupManager.openPopup(popup);
                			}else{
                				W.SceneManager.startScene({
                					sceneName:"scene/vod/VodPackageScene", 
                    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                    				param:{
                    					product: list.products[0],
                    					asset: list.assets[0]
                    				}
                    			});
                			}
                    	}
                	}
                }
			}
		};
		
		function getPuchaseProduct(totalBtnObjs){
			var productObj;
			for(var i=0; i < totalBtnObjs.length; i++){
				if(totalBtnObjs[i].type == BTN_TYPE_HD){
					productObj = totalBtnObjs[i];
					break;
				}
			}
			if(!productObj){
				for(var i=0; i < totalBtnObjs.length; i++){
					if(totalBtnObjs[i].type == BTN_TYPE_UHD){
						productObj = totalBtnObjs[i];
						break;
					}
				}
			}
			if(!productObj){
				for(var i=0; i < totalBtnObjs.length; i++){
					if(totalBtnObjs[i].type == BTN_TYPE_LIFETIME){
						productObj = totalBtnObjs[i];
						break;
					}
				}
			}
			return productObj;
		};
		
		function openCheckout(){
    		W.PopupManager.openPopup({
                popupName:"popup/ErrorPopup",
                code : "0501"
            });
		};
		
		function openPurchasBlockAlert(){
			var msg;
    		if(W.StbConfig.cugType == "accommodation"){
    			msg = W.Texts["alert_block_message2"];
    		}else{
    			msg = W.Texts["alert_block_message1"].replace("@tel@", W.Config.CALL_CENTER_NUMBER);
    		}
    		
    		W.PopupManager.openPopup({
                title:W.Texts["popup_zzim_info_title"],
                popupName:"popup/AlertPopup",
                boldText:W.Texts["alert_block_title"],
                thinText:msg 
            });
		};
		
		this.buttonAction = function(_parent, btnObj, detail, totalBtnObjs){
			W.log.info(btnObj);

			if(btnObj.type == BTN_TYPE_TRAILER && btnObj.assets.length > 0){
    			if(btnObj.assets.length > 1){
    				var popup = {
	    				popupName:"popup/detail/TrailerSelectPopup",
	    				list:btnObj.assets,
	    	    		title:detail.title,
        				childComp:_parent
	    			};
	    			W.PopupManager.openPopup(popup);
    			}else{
    				var isPurchased = false;
    				if(totalBtnObjs.length > 1){
        				for(var i=0; i < totalBtnObjs.length; i++){
        					if(totalBtnObjs[i].type != BTN_TYPE_TRAILER && totalBtnObjs[i].isPurchasedCount > 0){
        						isPurchased = true;
        						break;
        					}
        				}
    				}else{
    					//예고편 버튼만 있을 경우 구매 된 것으로 만들어서 예고편 종료 팝업에 구매 버튼이 안 보이도록 한다.
    					isPurchased = true;
    				}
    				this.playVod(_parent, btnObj.assets[0], true, isPurchased, getPuchaseProduct(totalBtnObjs));
    			}
    		}else if(btnObj.type == BTN_TYPE_UHD || btnObj.type == BTN_TYPE_HD || btnObj.type == BTN_TYPE_LIFETIME){
    			if(btnObj.isPurchasedCount > 0){
    				if(btnObj.isPurchasedCount > 1){
        				var popup = {
        					popupName:"popup/detail/SelectUhdContentsPopup",
        					list: btnObj.assets,
        					listProduct: btnObj.products,
        					childComp:_parent
        				};
	    				W.PopupManager.openPopup(popup);
    				}else{
    					for(var i=0; i < btnObj.assets.length; i++){
    						if(util.isWatchable(btnObj.assets[i]) || (btnObj.products && btnObj.products[i] && btnObj.products[i].listPrice == 0)){
        						this.playVod(_parent, btnObj.assets[i]);
        						break;
    						}
    					}
    				}
    			}else{
    				if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
    					openCheckout();
    				}else if(W.StbConfig.blockPurchase){
    					openPurchasBlockAlert();
    				}else{
    					if(btnObj.type == BTN_TYPE_UHD && !W.StbConfig.isUHD){
    						W.PopupManager.openPopup({
    			                title:W.Texts["popup_zzim_info_title"],
    			                popupName:"popup/AlertPopup",
    			                boldText:W.Texts["uhd_guide_popup"],
    			                thinText:W.Texts["uhd_guide_popup2"] 
    			            });
    					}else{
            				W.SceneManager.startScene({
            					sceneName:"scene/vod/PurchaseVodScene",
                				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                				param:{data:btnObj.assets, type:"V", products:btnObj.products}
                			});
    					}
    				}
    			}
        	}else if(btnObj.type == BTN_TYPE_SUBSCRIBED || btnObj.type == BTN_TYPE_TERM){
        		if(btnObj.isPurchasedCount > 0){
        			if(btnObj.assets.length > 1){
        				var popup = {
        					popupName:"popup/detail/SelectUhdContentsPopup",
        					list: btnObj.assets,
        					listProduct: btnObj.products,
        					childComp:_parent
        				};
    	    			W.PopupManager.openPopup(popup);
        			}else{
        				this.playVod(_parent, btnObj.assets[0]);
        			}
        		}else{
        			if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
    					openCheckout();
    				}else if(W.StbConfig.blockPurchase){
    					openPurchasBlockAlert();
    				}else{
            			if(btnObj.products.length > 1){
            				var popup = {
                				popupName:"popup/detail/SubscribedSelectPopup",
                				list:btnObj.products,
                				assets:btnObj.assets,
                				childComp:_parent
                			};
            	    		W.PopupManager.openPopup(popup);
            			}else{
            				var productProcessManager = ProductProcessManager.getManager();
            				productProcessManager.process(btnObj.products[0], btnObj.assets[0]);
            			}
    				}
        		}
            }else if(btnObj.type == BTN_TYPE_PACKAGE){
            	if(btnObj.isPurchasedCount > 0){
            		if(btnObj.products.length > 1){
        				var popup = {
    	    				popupName:"popup/detail/PackageSelectPopup",
    	    				type:"package",
            				list:btnObj.products,
            				assets:btnObj.assets,
            				childComp:_parent
    	    			};
    	    			W.PopupManager.openPopup(popup);
        			}else{
        				W.SceneManager.startScene({
        					sceneName:"scene/vod/VodPackageScene", 
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
            				param:{
            					product: btnObj.products[0],
            					asset: btnObj.assets[0]
            				}
            			});
        			}
//            		if(btnObj.assets.length > 1){
//            			var popup = {
//        					popupName:"popup/detail/SelectUhdContentsPopup",
//        					list: btnObj.assets,
//        					listProduct: btnObj.products,
//        					childComp:_parent
//        				};
//    	    			W.PopupManager.openPopup(popup);
//        			}else{
//        				this.playVod(_parent, btnObj.assets[0]);
//        			}
        		}else{
        			if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
    					openCheckout();
    				}else if(W.StbConfig.blockPurchase){
    					openPurchasBlockAlert();
    				}else{
            			if(btnObj.products.length > 1){
            				var popup = {
        	    				popupName:"popup/detail/PackageSelectPopup",
        	    				type:"package",
                				list:btnObj.products,
                				assets:btnObj.assets,
                				childComp:_parent
        	    			};
        	    			W.PopupManager.openPopup(popup);
            			}else{
            				W.SceneManager.startScene({
            					sceneName:"scene/vod/VodPackageScene", 
                				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                				param:{
                					product: btnObj.products[0],
                					asset: btnObj.assets[0]
                				}
                			});
            			}
    				}
        		}
        	}
		};
		
		this.playVod = function(_parent, asset, isTrailer, isPurchasedContent, puchaseProduct){
			if(W.state.isVod && W.state.playAssetId == asset.assetId){
            	W.SceneManager.destroyAll();
            	return;
            }
			
    		var sdpDataManager = W.getModule("manager/SdpDataManager");
    		if(isTrailer){
//    			var reqData = {
//            		assetId:asset.assetId,
//            		resume:true,
//            		deviceType:"stb"
//            	};
//    			var entryInfo = W.entryPath.getPath();
//				reqData.entryPath = entryInfo.path;
//				if(entryInfo.categoryId){
//					reqData.categoryId = entryInfo.categoryId;
//				}
				
//        		sdpDataManager.getPrepareViewing(function(result, data){
//        			if(result){
//                		W.log.info(data);
//                		asset.prepareInfo = data;
//                		asset.isTrailer = true;
//            			asset.isPurchased = isPurchasedContent;
//            			asset.puchaseProduct = puchaseProduct;
//            			
//            			var param = {data:asset, isKidsMode:isKidsMode};
//        				if(_scene.seriesAssetEpisodes && _scene.seriesAssetEpisodes.length > 0){
//        					param.series = _scene.seriesAssetEpisodes;
//        					param.seriesIndex = _scene.DetailComp.getEpisodeIndex();
//        				}
//        				W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
//        			}else{
//        				W.PopupManager.openPopup({
//                            popupName:"popup/ErrorPopup",
//                            code:data.error.code}
//                        );
//        			}
//            	}, reqData);
        		asset.isTrailer = true;
    			asset.isPurchased = isPurchasedContent;
    			asset.puchaseProduct = puchaseProduct;
    			
    			var param = {data:asset, isKidsMode:isKidsMode, isClearPin:_scene.param.isClearPin};
				if(_scene.seriesAssetEpisodes && _scene.seriesAssetEpisodes.length > 0){
					param.series = _scene.seriesAssetEpisodes;
					param.seriesIndex = _scene.DetailComp.getEpisodeIndex();
				}
				W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
				if(_parent.changeRecentIcon){
					_parent.changeRecentIcon();
				}
    		}else{
//    			var reqData = {
//            		assetId:asset.assetId,
//            		resume:true,
//            		deviceType:"stb"
//            	};
//    			
//    			var entryInfo = W.entryPath.getPath();
//				reqData.entryPath = entryInfo.path;
//				if(entryInfo.categoryId){
//					reqData.categoryId = entryInfo.categoryId;
//				}
//				
//        		sdpDataManager.getPrepareViewing(function(result, data){
//        			if(result){
//                		W.log.info(data);
//                		asset.prepareInfo = data;
//                		if(data.resume && data.resume.offset > 0){
//                			var popup = {
//                    				popupName:"popup/player/VodContinuePopup",
//                    				desc:asset,
//                    				childComp:_parent
//                    			};
//                	    		W.PopupManager.openPopup(popup);
//                		}else{
//                			var param = {data:asset, isKidsMode:isKidsMode};
//            				if(_scene.seriesAssetEpisodes && _scene.seriesAssetEpisodes.length > 0){
//            					param.series = _scene.seriesAssetEpisodes;
//            					param.seriesIndex = _scene.DetailComp.getEpisodeIndex();
//            				}
//            				W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
//                		}
//        			}else{
//        				W.PopupManager.openPopup({
//                            title:"Error",
//                            popupName:"popup/ErrorPopup",
//                            code:data.error.code}
//                        );
//        			}
//            	}, reqData);
        		sdpDataManager.getViewingOffset(function(result, data){
        			if(result){
                		W.log.info(data);
                		if(data.data && data.data[0] && data.data[0].resume){
                			if(!asset.prepareInfo){
                				asset.prepareInfo = {};
                			}
                			asset.prepareInfo.resume = data.data[0].resume;
        				}
                		
                		if(asset.prepareInfo && asset.prepareInfo.resume && asset.prepareInfo.resume.offset > 0){
                			var popup = {
                    				popupName:"popup/player/VodContinuePopup",
                    				desc:asset,
                    				childComp:_parent
                    			};
                	    		W.PopupManager.openPopup(popup);
                		}else{
                			var param = {data:asset, isKidsMode:isKidsMode, isClearPin:_scene.param.isClearPin};
            				if(_scene.seriesAssetEpisodes && _scene.seriesAssetEpisodes.length > 0){
            					param.series = _scene.seriesAssetEpisodes;
            					param.seriesIndex = _scene.DetailComp.getEpisodeIndex();
            				}
            				W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
            				if(_parent.changeRecentIcon){
            					_parent.changeRecentIcon();
            				}
                		}
        			}
            	}, {assetId:asset.assetId});
    		}
    	};
    	
    	function isExist(products, product){
    		var isExist = false;
    		W.log.info("product.productId ==== " + product.productId);
			for(var i=0; i < products.length; i++){
	    		W.log.info("products[i].productId ==== " + products[i].productId);
				if(products[i].productId == product.productId){
					isExist = true;
					break;
				}
			}
			return isExist;
		};
		
		function pushAsset(assets, asset){
    		var isExist = false;
			for(var i=0; i < assets.length; i++){
				if(assets[i].assetId == asset.assetId){
					isExist = true;
					break;
				}
			}
			if(!isExist){
				assets.push(asset);
			}
		};

    	this.setProduct = function(detail){
    		var categoryCoupons = W.entryPath.getCoupon();

    		var products = [{isPurchasedCount:0, assets:[], products:[]}, 
                {isPurchasedCount:0, assets:[], products:[]}, 
                {isPurchasedCount:0, assets:[], products:[]}, 
                {isPurchasedCount:0, assets:[], products:[]}, 
                {isPurchasedCount:0, assets:[], products:[]}, 
                {isPurchasedCount:0, assets:[], products:[]}, 
                {isPurchasedCount:0, assets:[], products:[]}]; // 무료 예고편, UHD, HD, 월정액, 기간제, 평생소장, 패키지
    		for(var i=0; i < detail.members.length; i++){
    			if(detail.members[i].trailer){
    				products[0].assets.push(detail.members[i]);
    				products[0].isPurchasedCount++;
    			}else{
    				if(detail.members[i].products){
        				for(var j=0; j < detail.members[i].products.length; j++){
        					if(
        						detail.members[i].products[j].productType == "VDCTSS" ||
        						detail.members[i].products[j].productType == "BDCHSS" ||
        						detail.members[i].products[j].productType == "BDNNSS"
        					){
        						if(W.StbConfig.cugType == "normal" || W.StbConfig.cugType == "community"){
        							if(!isExist(products[3].products, detail.members[i].products[j])){
        								if(detail.members[i].products[j].listPrice > 0){
        									pushAsset(products[3].assets, detail.members[i]);
                    						products[3].products.push(detail.members[i].products[j]);
                    						
                    						if(detail.members[i].products[j].events){
                    							products[3].hasEvent = true;
                    						}
                    						
                    						if(detail.members[i].purchase && detail.members[i].purchase.productId == detail.members[i].products[j].productId){
                    							products[3].isPurchasedCount++;
                    							products[3].assets[products[3].assets.length - 1] = detail.members[i];
                    						}
        								}
        							}else{
    									pushAsset(products[3].assets, detail.members[i]);
        							}
        						}
        						if(detail.members[i].products[j].productType.indexOf("LF") > 0){
        							products[3].isLifeTime = true;
        						}
        					}
        					
        					
        					if(
        						detail.members[i].products[j].productType == "VDCTDT" ||
        						detail.members[i].products[j].productType == "BDCHDT" ||
        						detail.members[i].products[j].productType == "BDNNDT"
        					){
        						if(!isExist(products[4].products, detail.members[i].products[j])){
        							if(detail.members[i].products[j].listPrice > 0){
    									pushAsset(products[4].assets, detail.members[i]);
	            						products[4].products.push(detail.members[i].products[j]);
	            						
	            						if(detail.members[i].products[j].events){
	            							products[4].hasEvent = true;
	            						}
	            						
	            						if(detail.members[i].purchase && detail.members[i].purchase.productId == detail.members[i].products[j].productId){
	            							products[4].isPurchasedCount++;
	            							products[4].assets[products[4].assets.length - 1] = detail.members[i];
	            						}
        							}else{
    									pushAsset(products[4].assets, detail.members[i]);
        							}
    							}
        						if(detail.members[i].products[j].productType.indexOf("LF") > 0){
        							products[4].isLifeTime = true;
        						}
        					}
        					
        					if(detail.members[i].products[j].productType == "VDRVLF"){
        						if(!isExist(products[5].products, detail.members[i].products[j])){
									pushAsset(products[5].assets, detail.members[i]);
	        						var product = Object.assign(detail.members[i].products[j]);
	        						if(categoryCoupons){
	            						if(product.coupons){
	            							var existCoupon = false;
	            							for(var k=0; k < product.coupons.length; k++){
	            								for(var l=0; l < categoryCoupons.length; l++){
		            								if(product.coupons[k].couponNo == categoryCoupons[l].couponNo){
		            									existCoupon = true;
		            									break;
		            								}
	            								}
	            								if(existCoupon){
	            									break;
	            								}
	            							}
	            							if(!existCoupon){
	            								product.coupons = product.coupons.concat(categoryCoupons);
	            							}
	            						}else{
	            							product.coupons = categoryCoupons;
	            						}
	        						}
	        						products[5].products.push(product);
	        						
	        						if(product.events){
	        							products[5].hasEvent = true;
	        						}
	        						
//	        						if(detail.members[i].purchase && detail.members[i].purchase.productId == detail.members[i].products[j].productId){
	        						if(detail.members[i].isWatchable){
	        							products[5].isPurchasedCount++;
	        						}else{
            							if(detail.members[i].products[j].listPrice == 0){
            								products[5].isPurchasedCount++;
            								products[5].isZeroPrice = true;
            							}
            						}
        						}
        						if(detail.members[i].products[j].productType.indexOf("LF") > 0){
        							products[5].isLifeTime = true;
        						}
        					}
        					
        					if(
        						detail.members[i].products[j].productType == "VDSRDT" || 
        						detail.members[i].products[j].productType == "VDSRLF" || 
        						detail.members[i].products[j].productType == "VDASDT" || 
        						detail.members[i].products[j].productType == "VDASLF"
        					){
        						if(!isExist(products[6].products, detail.members[i].products[j])){
        							if(detail.members[i].products[j].listPrice > 0){
    									pushAsset(products[6].assets, detail.members[i]);
    	        						products[6].products.push(detail.members[i].products[j]);
    	        						
    	        						if(detail.members[i].products[j].events){
    	        							products[6].hasEvent = true;
    	        						}
    	        						
    	        						if(detail.members[i].purchase && detail.members[i].purchase.productId == detail.members[i].products[j].productId){
    	        							products[6].isPurchasedCount++;
    	        						}
        							}
        						}else{
									pushAsset(products[6].assets, detail.members[i]);
    							}
        						if(detail.members[i].products[j].productType.indexOf("LF") > 0){
        							products[6].isLifeTime = true;
        						}
        					}
        					
        					if(detail.members[i].products[j].productType == "VDRVDT"){
        						
        						if(detail.members[i].resolution == "UHD"){
        							var product = Object.assign(detail.members[i].products[j]);
        							if(!isExist(product, detail.members[i].products[j])){
    									pushAsset(products[1].assets, detail.members[i]);
	        							if(categoryCoupons){
	                						if(product.coupons){
	                							var existCoupon = false;
	                							for(var k=0; k < product.coupons.length; k++){
		            								for(var l=0; l < categoryCoupons.length; l++){
			            								if(product.coupons[k].couponNo == categoryCoupons[l].couponNo){
			            									existCoupon = true;
			            									break;
			            								}
		            								}
		            								if(existCoupon){
		            									break;
		            								}
		            							}
		            							if(!existCoupon){
		            								product.coupons = product.coupons.concat(categoryCoupons);
		            							}
	                						}else{
	                							product.coupons = categoryCoupons;
	                						}
	        							}
	            						products[1].products.push(product);
	            						
	            						if(product.events){
	            							products[1].hasEvent = true;
	            						}
	        		    				
//	        		    				if((detail.members[i].purchase && detail.members[i].purchase.productId == detail.members[i].products[j].productId) || 
//	        		    						(detail.members[i].productId == detail.members[i].products[j].productId && detail.members[i].isWatchable)){
	        		    				if(detail.members[i].isWatchable){
	            							products[1].isPurchasedCount++;
	            						}else{
	            							if(detail.members[i].products[j].listPrice == 0){
	            								products[1].isPurchasedCount++;
	            								products[1].isZeroPrice = true;
	            							}
	            						}
        							}
            						if(detail.members[i].products[j].productType.indexOf("LF") > 0){
            							products[1].isLifeTime = true;
            						}
        		    			}else{
        		    				var product = Object.assign(detail.members[i].products[j]);
        		    				if(!isExist(product, detail.members[i].products[j])){
    									pushAsset(products[2].assets, detail.members[i]);
        		    					W.log.info(products[2].assets.length);
	        		    				if(categoryCoupons){
	                						if(product.coupons){
	                							var existCoupon = false;
	                							for(var k=0; k < product.coupons.length; k++){
		            								for(var l=0; l < categoryCoupons.length; l++){
			            								if(product.coupons[k].couponNo == categoryCoupons[l].couponNo){
			            									existCoupon = true;
			            									break;
			            								}
		            								}
		            								if(existCoupon){
		            									break;
		            								}
		            							}
		            							if(!existCoupon){
		            								product.coupons = product.coupons.concat(categoryCoupons);
		            							}
	                						}else{
	                							product.coupons = categoryCoupons;
	                						}
	        		    				}
	            						products[2].products.push(product);
	            						
	            						if(product.events){
	            							products[2].hasEvent = true;
	            						}
	        		    				
//	        		    				if((detail.members[i].purchase && detail.members[i].purchase.productId == detail.members[i].products[j].productId) || 
//	        		    						(detail.members[i].productId == detail.members[i].products[j].productId && detail.members[i].isWatchable)){
	        		    				if(detail.members[i].isWatchable){
	            							products[2].isPurchasedCount++;
	            						}else{
	            							if(detail.members[i].products[j].listPrice == 0){
	            								products[2].isPurchasedCount++;
	            								products[2].isZeroPrice = true;
	            							}
	            						}
        		    				}
            						if(detail.members[i].products[j].productType.indexOf("LF") > 0){
            							products[2].isLifeTime = true;
            						}
        		    			}
        					}
        				}
        			}else{
        				if(detail.members[i].originProduct == "FOD" || (detail.members[i].originProduct == "RVOD" && detail.members[i].listPrice == 0)){
        					var tmpIdx = 2;
        					if(detail.members[i].resolution == "UHD"){
        						tmpIdx = 1;
        					}
            				products[tmpIdx].assets.push(detail.members[i]);
            				products[tmpIdx].isPurchasedCount++;
            				products[tmpIdx].isFod = true;
        				}
        			}
    			}
    		}
    		W.log.info(products);
    		return products;
    	};
    	
    	this.setPrice = function(_comp, bIdx){
    		_comp._rental_duration.setStyle({display:"none"});
    		_comp._listPrice.setStyle({display:"none"});
    		_comp._vat.setStyle({display:"none"});
    		_comp._price.setStyle({display:"none"});
    		_comp._price_unit.setStyle({display:"none"});
    		_comp._discount.setStyle({display:"none"});
    		_comp._rental_guide.setStyle({display:"none"});
    		_comp._rental_duration2.setStyle({display:"none"});
    		W.log.info(_comp.btnObjs);
    		
    		var targetAsset;
    		for(var i=0; i < _comp.btnObjs[bIdx].assets.length; i++){
    			if(_comp.btnObjs[bIdx].assets[i]){
    				targetAsset = _comp.btnObjs[bIdx].assets[i];
    				break;
    			}
    		}
    		W.log.info(targetAsset);
        	if(_comp.btnObjs[bIdx].type != BTN_TYPE_TRAILER){
        		if(_comp.btnObjs[bIdx].isPurchasedCount > 0){
        			for(var i=0; i < _comp.btnObjs[bIdx].assets.length; i++){
        				if(_comp.btnObjs[bIdx].assets[i]){
                			if(util.isWatchable(_comp.btnObjs[bIdx].assets[i])){
                				targetAsset = _comp.btnObjs[bIdx].assets[i];
                				break;
                			}
        				}
        				if(_comp.btnObjs[bIdx].products && _comp.btnObjs[bIdx].products[i] && _comp.btnObjs[bIdx].products[i].listPrice == 0){
        					targetAsset = _comp.btnObjs[bIdx].assets[i];
            				break;
        				}
            		}
        			
        			if(_comp.btnObjs[bIdx].type == BTN_TYPE_LIFETIME || _comp.btnObjs[bIdx].isLifeTime){
        				_comp._rental_duration.setText(W.Texts["detail_rental_duration_lifetime"]);
        			}else if(_comp.btnObjs[bIdx].type == BTN_TYPE_UHD || _comp.btnObjs[bIdx].type == BTN_TYPE_HD || _comp.btnObjs[bIdx].type == BTN_TYPE_PACKAGE || _comp.btnObjs[bIdx].type == BTN_TYPE_TERM){
        				var time = "";
        				if(targetAsset.purchase){
        					var eDate = new Date(targetAsset.purchase.expiresAt);
            				time = (eDate.getMonth()+1) + W.Texts["unit_month"] + " ";
            				time += eDate.getDate() + W.Texts["unit_date"] + " ";
            				time += util.changeDigit(eDate.getHours(),2)+":"+util.changeDigit(eDate.getMinutes(),2);
            				_comp._rental_duration.setText(W.Texts["until"].replace("@until@", time));
        				}else{
        					if(targetAsset.rentalPeriod.unit == "D"){
        						if(targetAsset.rentalPeriod.value == 999){
            						time = W.Texts["detail_rental_duration_lifetime"];
        						}else{
            						time = W.Texts["detail_rental_duration"].replace("@date@", targetAsset.rentalPeriod.value);
        						}
                    		}else if(targetAsset.rentalPeriod.unit == "M"){
        						if(targetAsset.rentalPeriod.value == 999){
            						time = W.Texts["detail_rental_duration_lifetime"];
        						}else{
            						time = W.Texts["detail_rental_duration2"].replace("@month@", targetAsset.rentalPeriod.value);
        						}
                    		}
        				}
        			}else if(_comp.btnObjs[bIdx].type == BTN_TYPE_SUBSCRIBED){
        				_comp._rental_duration.setText(W.Texts["detail_rental_duration_subscribed"]);
        			}
        			_comp._rental_duration.setStyle({display:"inline-block"});

        			if(_comp.btnObjs[bIdx].type == BTN_TYPE_UHD || _comp.btnObjs[bIdx].type == BTN_TYPE_HD || _comp.btnObjs[bIdx].type == BTN_TYPE_LIFETIME || _comp.btnObjs[bIdx].type == BTN_TYPE_TERM){
        				var title = targetAsset.resolution ? targetAsset.resolution : "";
        				if(targetAsset.assetGroup != "010"){
        					title += " " + util.getAssetGroupCode(targetAsset);
        				}
        				if(!targetAsset.purchase){
        					title += " " + W.Texts["price_free"];
        				}
        				_comp._price.setText(title);
        			}else if(_comp.btnObjs[bIdx].type == BTN_TYPE_SUBSCRIBED){
        				var tmpTitle = targetAsset.title;
        				if(targetAsset.products && targetAsset.purchase){
        					for(var i=0; i < targetAsset.products.length; i++){
        						if(targetAsset.products[i].productId == targetAsset.purchase.productId){
        							tmpTitle = targetAsset.products[i].title;
        							break;
        						}
        					}
        				}
        				_comp._price.setText(W.Texts["detail_subscribed"].replace("@title@", tmpTitle));
        			}else if(_comp.btnObjs[bIdx].type == BTN_TYPE_PACKAGE){
        				var tmpTitle = targetAsset.title;
        				if(targetAsset.products && targetAsset.purchase){
        					for(var i=0; i < targetAsset.products.length; i++){
        						if(targetAsset.products[i].productId == targetAsset.purchase.productId){
        							tmpTitle = targetAsset.products[i].title;
        							break;
        						}
        					}
        				}
        				_comp._price.setText(tmpTitle + W.Texts["package_"]);
        			}
        			_comp._price.setStyle({display:"inline-block"});
        		}else{
        			var targetProduct;
        			W.log.info(_comp.btnObjs[bIdx]);
        			for(var i=0; i < _comp.btnObjs[bIdx].products.length; i++){
        				if(targetProduct){
        					if(targetProduct.listPrice < _comp.btnObjs[bIdx].products[i].listPrice){
        						targetProduct = _comp.btnObjs[bIdx].products[i];
        					}
        				}else{
        					targetProduct = _comp.btnObjs[bIdx].products[i];
        				}
        			}
        			var price = util.getPrice(targetProduct);
        			W.log.info(targetProduct);
        			if(targetProduct.productType.indexOf("LF") > 0){
        				_comp._rental_duration.setText(W.Texts["detail_rental_duration_lifetime"]);
            			_comp._rental_duration.setStyle({display:"inline-block"});
        			}else{
            			if(_comp.btnObjs[bIdx].type == BTN_TYPE_SUBSCRIBED){
            				if(targetProduct.coupons){
            					var period = 1 + W.Texts["unit_month_until"];
            					if(targetProduct.coupons[0].discountPeriod){
            						period = targetProduct.coupons[0].discountPeriod.value + "";
            						if(targetProduct.coupons[0].discountPeriod.unit == "Y"){
            							period += W.Texts["unit_year"]
            						}else if(targetProduct.coupons[0].discountPeriod.unit == "D"){
            							period += W.Texts["unit_date"]
            						}else{
            							period += W.Texts["unit_month_until"]
            						}
            					}
            					_comp._rental_duration.setText(period);
                    			_comp._rental_duration.setStyle({display:"inline-block"});
            				}else{
                				_comp._rental_duration2.setText(W.Texts["unit_month"]);
                    			_comp._rental_duration2.setStyle({display:"inline-block"});
            				}
            			}else{
            				if(targetProduct.rentalPeriod.unit == "D"){
            					if(targetProduct.rentalPeriod.value == 999){
                        			_comp._rental_duration.setText(W.Texts["detail_rental_duration_lifetime"]);
        						}else{
                        			_comp._rental_duration.setText(W.Texts["detail_rental_duration"].replace("@date@", targetProduct.rentalPeriod.value));
        						}
                    			_comp._rental_duration.setStyle({display:"inline-block"});
                    		}else if(targetProduct.rentalPeriod.unit == "M"){
            					if(targetProduct.rentalPeriod.value == 999){
                        			_comp._rental_duration.setText(W.Texts["detail_rental_duration_lifetime"]);
        						}else{
                        			_comp._rental_duration.setText(W.Texts["detail_rental_duration2"].replace("@month@", targetProduct.rentalPeriod.value));
        						}
                    			_comp._rental_duration.setStyle({display:"inline-block"});
                    		}
            			}
        			}
        			
        			if(price == 0){
        				_comp._price.setText(W.Texts["price_free"]);
            			_comp._price.setStyle({display:"inline-block"});
        			}else{
        				var listPrice = util.vatPrice(targetProduct.listPrice);
        				var discountPrice = listPrice - price;

        				_comp._price.setText(W.Util.formatComma(price, 3));
        				_comp._vat.setStyle({display:"inline-block"});
            			_comp._price.setStyle({display:"inline-block"});
                		_comp._price_unit.setStyle({display:"inline-block"});
                		
                		if(discountPrice){
                			_comp._listPrice.setText(W.Util.formatComma(listPrice, 3) + W.Texts["price_unit"]);
                    		_comp._discount.setText(W.Texts["discount"].replace("@price@", W.Util.formatComma(discountPrice, 3)));
                    		
                    		_comp._listPrice.setStyle({display:"inline-block"});
                    		_comp._discount.setStyle({display:"inline-block"});
                		}
        			}
        		}
        	}
    	};
    	
    	this.getBtnIndex = function(btnObjs){
    		W.log.info(btnObjs);
    		var idx = -1;
    		if(W.StbConfig.isUHD){
    			for(var i=0; i < btnObjs.length; i++){
    				if(btnObjs[i].type == BTN_TYPE_UHD && btnObjs[i].isPurchasedCount > 0){
    					idx = i;
					}
        		}
    			if(idx == -1){
    				for(var i=0; i < btnObjs.length; i++){
        				if(btnObjs[i].type == BTN_TYPE_HD && btnObjs[i].isPurchasedCount > 0){
        					idx = i;
    					}
            		}
    				if(idx == -1){
    					for(var i=0; i < btnObjs.length; i++){
            				if(btnObjs[i].isPurchasedCount > 0 && btnObjs[i].type != BTN_TYPE_TRAILER){
            					idx = i;
        					}
                		}
    					if(idx == -1){
            				for(var i=0; i < btnObjs.length; i++){
                				if(btnObjs[i].type == BTN_TYPE_UHD){
                					idx = i;
            					}
                    		}
            				if(idx == -1){
                				for(var i=0; i < btnObjs.length; i++){
                    				if(btnObjs[i].type == BTN_TYPE_HD){
                    					idx = i;
                					}
                        		}
                				if(idx == -1){
                    				for(var i=0; i < btnObjs.length; i++){
                        				if(btnObjs[i].type == BTN_TYPE_LIFETIME){
                        					idx = i;
                    					}
                            		}
                    				if(idx == -1){
                        				for(var i=0; i < btnObjs.length; i++){
                            				if(btnObjs[i].type == BTN_TYPE_TRAILER){
                            					idx = i;
                        					}
                                		}
                        				if(idx == -1){
                            				for(var i=0; i < btnObjs.length; i++){
                                				if(btnObjs[i].type == BTN_TYPE_SUBSCRIBED){
                                					idx = i;
                            					}
                                    		}
                            				if(idx == -1){
                                				for(var i=0; i < btnObjs.length; i++){
                                    				if(btnObjs[i].type == BTN_TYPE_PACKAGE){
                                    					idx = i;
                                					}
                                        		}
                                			}
                            			}
                        			}
                    			}
                			}
            			}
    				}
    			}
			}else{
				for(var i=0; i < btnObjs.length; i++){
    				if(btnObjs[i].type == BTN_TYPE_HD && btnObjs[i].isPurchasedCount > 0){
    					idx = i;
					}
        		}
				if(idx == -1){
    				for(var i=0; i < btnObjs.length; i++){
        				if(btnObjs[i].isPurchasedCount > 0 && btnObjs[i].type != BTN_TYPE_UHD && btnObjs[i].type != BTN_TYPE_TRAILER){
        					idx = i;
    					}
            		}
    				if(idx == -1){
        				for(var i=0; i < btnObjs.length; i++){
            				if(btnObjs[i].type == BTN_TYPE_HD){
            					idx = i;
        					}
                		}
        				if(idx == -1){
            				for(var i=0; i < btnObjs.length; i++){
                				if(btnObjs[i].type == BTN_TYPE_LIFETIME){
                					idx = i;
            					}
                    		}
            				if(idx == -1){
                				for(var i=0; i < btnObjs.length; i++){
                    				if(btnObjs[i].type == BTN_TYPE_TRAILER){
                    					idx = i;
                					}
                        		}
                				if(idx == -1){
                    				for(var i=0; i < btnObjs.length; i++){
                        				if(btnObjs[i].type == BTN_TYPE_SUBSCRIBED){
                        					idx = i;
                    					}
                            		}
                    				if(idx == -1){
                        				for(var i=0; i < btnObjs.length; i++){
                            				if(btnObjs[i].type == BTN_TYPE_PACKAGE){
                            					idx = i;
                        					}
                                		}
                        				if(idx == -1){
                            				for(var i=0; i < btnObjs.length; i++){
                                				if(btnObjs[i].type == BTN_TYPE_UHD && btnObjs[i].isPurchasedCount > 0){
                                					idx = i;
                            					}
                                    		}
                            				if(idx == -1){
                                				for(var i=0; i < btnObjs.length; i++){
                                    				if(btnObjs[i].type == BTN_TYPE_UHD){
                                    					idx = i;
                                					}
                                        		}
                                			}
                            			}
                        			}
                    			}
                			}
            			}
        			}
    			}
			}
    		W.log.info("===================================" + idx);
    		if(idx == -1){
    			idx = 0;
    		}
    		return idx;
    	};
	}

    return {
    	getNewComp : function(_scene, isKidsMode){
    		return new DetailModule(_scene, isKidsMode);
    	}
    }
});