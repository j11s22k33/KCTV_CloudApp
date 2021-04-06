/**
 * scene/channel/PurchaseChScene
 *
 */
W.defineModule([ "mod/Util", "manager/ProductProcessManager"], function(util, ProductProcessManager) {
        var _thisScene = "PurchaseChScene";
        var _this;
        var targetProduct;
        var productProcessManager;
        W.log.info("### Initializing " + _thisScene + " scene ###");
        
        function purchaseCallback(result){
	    	W.log.info(result);
	    	if(result.result == "SUCCESS"){

	    		setTimeout(function(){
   				 	var popup = {
         				popupName:"popup/purchase/PurchaseCompletePopup",
         				contents:result.asset ? result.asset : targetProduct
         			};
     	    		W.PopupManager.openPopup(popup);
   			 	}, 300);
	    	}else if(result.result == "BACK"){
	    		_this.backScene();
	    	}else{
	    		W.PopupManager.openPopup({
                    childComp:_this, 
                    popupName:"popup/ErrorPopup",
                    code:result.resultData.error.code,
                    message:[result.resultData.error.message],
					from : "SDP"}
                );
	    	}
	    };
	    
        function getProductList(){
        	var reqData = {sourceId:_this.sourceId, offset:0, limit:0, selector:"productId"};
        	_this.sdpDataManager.getChannelProducts(function(result, data){
    			if(result && data.data && data.data.length > 0){
    				var productIds = "";
    				for(var i=0; i < data.data.length; i++){
    					if(i == 0){
    						productIds += data.data[i].productId;
    					}else{
    						productIds += "," + data.data[i].productId;
    					}
    				}
    				var reqData = {productId:productIds, selector:"@detail"};
    				_this.sdpDataManager.getProductDetail(function(result, data){
    	        		W.log.info(data);
    	        		var productList = [];
    	        		for(var i=0; i < data.data.length; i++){
    	        			var temp = true;
    	        			if(data.data[i].productType == "CHTRSS" || data.data[i].productType == "CHNMSS" || 
    	        					data.data[i].productType == "VDCTSS" || data.data[i].productType == "BDCHSS" || data.data[i].productType == "BDNNSS"){

        	        			if(W.StbConfig.cugType == "normal" || W.StbConfig.cugType == "community"){
        	        				temp = true;
        	        			}else{
        	        				temp = false;
        	        			}
    	        			}
    	        			if(temp){
    	        				productList.push(data.data[i]);
    	        			}
    	        		}
    	        		W.log.info(productList);
    	        		if(productList.length == 0){
    	        			W.PopupManager.openPopup({
	                            childComp:_this,
	                            title:W.Texts["popup_zzim_info_title"],
	                            popupName:"popup/AlertPopup",
	                            boldText:W.Texts["no_purchas_product_guide1"],
	                            thinText:W.Texts["no_purchas_product_guide2"] + "\n" + W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER}
	                        );
    	        		}else if(productList.length > 1){
        					var popup = {
                				popupName:"popup/detail/SubscribedSelectPopup",
                				list:productList,
                				childComp:_this
                			};
            	    		W.PopupManager.openPopup(popup);
        				}else{
        					targetProduct = productList[0];
            				productProcessManager.process(productList[0]);
        				}
    				}, reqData);
    			}else{
    				W.PopupManager.openPopup({
                        childComp:_this,
                        title:W.Texts["popup_zzim_info_title"],
                        popupName:"popup/AlertPopup",
                        boldText:W.Texts["no_data"]}
                    );
    			}
    		}, reqData);
        };

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                index = 0;
                productProcessManager = ProductProcessManager.getManager(purchaseCallback);
                this.sourceId = param.sourceId;
                
                this.sdpDataManager = W.getModule("manager/SdpDataManager");
                
                getProductList();
            },
            onPause: function() {

            },
            onResume: function() {

            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");
            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
                
            },
            onPopupClosed : function(popup, desc){
            	if (desc) {
            		if (desc.popupName == "popup/detail/SubscribedSelectPopup") {
            			if (desc.action == W.PopupManager.ACTION_OK) {
            				targetProduct = desc.product;
            				productProcessManager.process(desc.product);
            			}else{
            				this.backScene();
            			}
            		}else if (desc.popupName == "popup/purchase/PurchaseCompletePopup") {
            			if(targetProduct.configuration && targetProduct.configuration.channels){
            				var sourceIds = [];
            				for(var i=0; i < targetProduct.configuration.channels.length; i++){
            					sourceIds.push(parseInt(targetProduct.configuration.channels[i].sourceId));
            				}
                			W.CloudManager.purchaseChannel(function(){
                				_this.backScene();
                			}, sourceIds);
            			}
            		}else{
            			this.backScene();
            		}
            	}else{
            		this.backScene();
            	}
            }
        });
    });
