//@preDefine
/**
 * manager/ProductProcessManager
 */
W.defineModule("manager/ProductProcessManager", ["mod/Util"], function(util) {
	
	W.log.info("define ProductProcessManager");
	function ProductProcessManager(callback){
		var self = this;
		var product;
		var assetsList;
		var sdpDataManager;

		function goPurchaseScene(type){
			if(product.packageType == "TR" && !product.isAvailableUpselling){
				W.PopupManager.openPopup({
                    title:W.Texts["popup_zzim_info_title"],
                    popupName:"popup/AlertPopup",
                    boldText:W.Texts["purchase_err_msg"],
                    thinText:W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)}
                );
			}else{
				var param = {type:type, products:[product], data:assetsList, callback:callback};
				if(type == "V"){
					param.data = [product.asset];
				}
				W.SceneManager.startScene({
					sceneName:"scene/vod/PurchaseVodScene", 
					backState:W.SceneManager.BACK_STATE_KEEPHIDE,
					param:param
				});
			}
		};
		
		function nextProcess(){
			W.log.info("nextProcess");
			switch(product.productType){
    		case "CHTRSS": 
    		case "CHNMSS": 
    		case "VDCTSS": 
    		case "BDCHSS": 
    		case "BDNNSS": 
    			openTermsPopup("MONTHLY_TERMS");
    			break;
    		case "CHNMDT": 
    		case "VDCTDT": 
    		case "BDCHDT": 
    		case "BDNNDT":
    			openTermsPopup("TERM_TERMS");
    			break;
    		case "VDSRDT": 
    		case "VDSRLF": 
    		case "VDASDT": 
    		case "VDASLF": 
    			W.SceneManager.startScene({
					sceneName:"scene/vod/VodPackageScene", 
    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
    				param:{
    					product: product,
    					asset: product.asset
    				}
    			});
    			break;
    		case "EXOFOT": 
    			goPurchaseScene("E");
    			break;
			}
		};
		
		function openTermsPopup(popupType, hasChannel){
			var popup = {
				popupName:"popup/purchase/TermsPopup",
				title:product.title,
				type:popupType,
				price:util.getPrice(product),
				description:product.description,
				product:product,
				isPurchased:product.isPurchased,
				isCanCancel:product.isCanCancel,
				hasChannel:hasChannel,
				childComp:self
			};
    		W.PopupManager.openPopup(popup);
		};
		
		function openChListPopup(){
			var popup = {
				popupName:"popup/purchase/ProductChListPopup",
				product:product,
				childComp:self
			};
    		W.PopupManager.openPopup(popup);
		};
		
		this.process = function(prod, assets) {
			product = prod;
			if(assets){
				assetsList = [assets];
			}
    		W.log.info(product);
    		W.log.info("productType ========= " + product.productType);
    		
    		if(
    				(product.productType == "CHTRSS" || product.productType == "CHNMSS" || 
    				product.productType == "VDCTSS" || product.productType == "BDCHSS" || product.productType == "BDNNSS") && 
    				(W.StbConfig.cugType != "normal" && W.StbConfig.cugType != "community")){
    			return;
    		}
    		
    		
			if(product.productType == "VDSRDT" || product.productType == "VDSRLF" || product.productType == "VDASDT" || product.productType == "VDASLF"){
				W.SceneManager.startScene({
					sceneName:"scene/vod/VodPackageScene", 
    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
    				param:{
    					product: product,
    					asset: product.asset
    				}
    			});
			}else{
				sdpDataManager = W.getModule("manager/SdpDataManager");
	    		
	    		if(product.productType == "VDRVDT" || product.productType == "VDRVLF"){
	    			var reqData = {assetId:product.assetId, selector:"@detail"};
	    			sdpDataManager.getDetailAsset(function(result, data){
	    				if(result){
	    					product.asset = data.data[0];
	    					goPurchaseScene("V");
	    				}else{
	    					W.SceneManager.historyBack();
	    				}
	    			}, reqData);
	    		}else{
	    			var popupType = "PRODUCT_INFO";
	    			var hasChannel = false;
	    			if(!product.fromMySubscribed){
	            		if(product.productType == "CHTRSS" || product.productType == "CHNMSS" || product.productType == "CHNMDT"){
	            			popupType = "CH_TR_INFO";
	            			if(product.configuration && product.configuration.channels && product.configuration.channels.length > 1){
	            				hasChannel = true;
	            			}
	            		}
	    			}
	        		
	        		
	        		openTermsPopup(popupType, hasChannel);
	    		}
			}
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
		
		function goCategory(category){
			var reqData = {categoryId:category.categoryId};
			sdpDataManager.getMenuDetail(function(result, data){
				W.log.info(data);
				if(result){
					var sceneName;
					if(data.data[0].isLeaf){
						sceneName = "scene/vod/MovieScene";
					}else{
						sceneName = "scene/home/CategoryListScene";
					}
					
					W.SceneManager.startScene({
						sceneName:sceneName, 
						backState:W.SceneManager.BACK_STATE_KEEPHIDE,
						param:{category:data.data[0]}
					});
				}
			}, reqData);
		};
		
		this.onPopupClosed = function(popup, desc){
        	if(desc){
        		if (desc.popupName == "popup/purchase/TermsPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				if(desc.buttonType == "CLOSE"){
        					if(callback){
    							callback({result:"BACK"});
    						}
        				}else if(desc.buttonType == "DETAIL"){
        					if(product.configuration && product.configuration.channels && product.configuration.channels.length > 1){
        						openChListPopup();
        					}else{
            					if(callback){
        							callback({result:"BACK"});
        						}
        					}
        				}else if(desc.buttonType == "JOIN"){
        					if(product.packageType == "TR" && !product.isAvailableUpselling){
        						W.PopupManager.openPopup({
        		                    title:W.Texts["popup_zzim_info_title"],
        		                    popupName:"popup/AlertPopup",
        		                    boldText:W.Texts["purchase_err_msg"],
        		                    thinText:W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)}
        		                );
        					}else{
            					if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
                					openCheckout();
                				}else if(W.StbConfig.blockPurchase){
                					openPurchasBlockAlert();
                				}else{
                					nextProcess();
                				}
        					}
        				}else if(desc.buttonType == "CANCEL"){
        					var popup = {
                				popupName:"popup/SubscriptionCancelPopup",
                				childComp:self
                			};
                    		W.PopupManager.openPopup(popup);
        				}else if(desc.buttonType == "JOIN_BUNDLE"){
        					if(product.packageType == "TR" && !product.isAvailableUpselling){
        						W.PopupManager.openPopup({
        		                    title:W.Texts["popup_zzim_info_title"],
        		                    popupName:"popup/AlertPopup",
        		                    boldText:W.Texts["purchase_err_msg"],
        		                    thinText:W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)}
        		                );
        					}else{
            					if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
                					openCheckout();
                				}else if(W.StbConfig.blockPurchase){
                					openPurchasBlockAlert();
                				}else{
                					product = product.bundleProduct;
                					nextProcess();
                				}
        					}
        				}else if(desc.buttonType == "GOING"){
        					if(product.configuration.categories){
            					if(product.configuration.categories.length > 1){
            						var popup = {
                        				popupName:"popup/purchase/CategorySelectPopup",
                        				list:product.configuration.categories,
                        				title:product.title,
                        				childComp:self
                        			};
                            		W.PopupManager.openPopup(popup);
            					}else{
            						goCategory(product.configuration.categories[0]);
            					}
        					}else if(product.configuration.channels){
								if(W.state.isVod){
									W.PopupManager.openPopup({
										title:W.Texts["popup_zzim_info_title"],
										popupName:"popup/AlertPopup",
										boldText:W.Texts["vod_alert_msg"],
										thinText:W.Texts["vod_alert_msg2"]}
									);
								}else{
									W.CloudManager.changeChannel(function (callbackData) {
										//_this.currentChannel = callbackData;
									}, parseInt(product.configuration.channels[0].sourceId));
								}
        					}
        				}else if(desc.buttonType == "OK"){
        					if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
            					openCheckout();
            				}else if(W.StbConfig.blockPurchase){
            					openPurchasBlockAlert();
            				}else{
            					if(desc.type == "MONTHLY_TERMS"){
            						goPurchaseScene("M");
                    			}else if(desc.type == "TERM_TERMS"){
                    				goPurchaseScene("T");
                    			}
            				}
        				}
        			}else{
						if(callback){
							callback({result:"BACK"});
						}
					}
        		}else if (desc.popupName == "popup/purchase/ProductChListPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				if(product.packageType == "TR" && !product.isAvailableUpselling){
    						W.PopupManager.openPopup({
    		                    title:W.Texts["popup_zzim_info_title"],
    		                    popupName:"popup/AlertPopup",
    		                    boldText:W.Texts["purchase_err_msg"],
    		                    thinText:W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)}
    		                );
    					}else{
            				nextProcess();
    					}
        			}else{
						if(callback){
							callback({result:"BACK"});
						}
					}
        		}else if (desc.popupName == "popup/AlertPopup" || desc.popupName == "popup/ErrorPopup") {
        			if(callback){
						callback({result:"BACK", type:desc.type});
					}
        		}else if (desc.popupName == "popup/purchase/CategorySelectPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				goCategory(desc.category);
        			}
        		}else if (desc.popupName == "popup/SubscriptionCancelPopup") {
        			if (desc.action == W.PopupManager.ACTION_OK) {
        				var reqData = {productId:product.productId};
        				sdpDataManager.cancelSubscription(function(result, data){
        					W.log.info(data);
        					if(result){
        						W.PopupManager.openPopup({
        		                    childComp:self, 
        		                    title:W.Texts["popup_subscribed_cancel_title"],
        		                    popupName:"popup/AlertPopup",
        		                    type:"subscribed_cancel",
        		                    boldText:W.Texts["popup_subscribed_cancel_guide1"],
        		                    thinText:W.Texts["popup_subscribed_cancel_guide2" + "\n" + W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER]}
        		                );
        					}else{
        						W.PopupManager.openPopup({
        		                    childComp:self, 
        		                    popupName:"popup/ErrorPopup",
        		                    code:data.error.code,
        							from : "SDP"}
        		                );
        					}
        				}, reqData);
        			}
        		}
        	}
    	};
	};
	
    return {
    	getManager : function(callback){
    		return new ProductProcessManager(callback);
    	}
    };
});