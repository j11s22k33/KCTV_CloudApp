/**
 * scene/VodPlayScene
 *
 */
W.defineModule([ "mod/Util", "comp/vod/PlayBar", "comp/vod/PlayBarKids", "comp/vod/VodFinish", "comp/vod/VodFinishKids", "comp/purchase/PurchaseComp"],
    function(util, playBarComp, playBarKidsComp, vodFinishComp, vodFinishKidsComp, purchaseComp) {
        var _thisScene = "VodPlayScene";
        var STATE_NONE= 0;
        var STATE_AD_PLAY = 1;
        var STATE_VOD_PLAY = 2;
        var STATE_VOD_END = 3;
        var STATE_VOD_ERROR = 4;
        
        var purchaseTimeout;
        var waterMarkHideTimeout;
        var waterMarkShowTimeout;
        var vodStartTimeout;
        var isCompleteVodStart = false;
        
        var playCount = 0;

        var _this;
        W.log.info("### Initializing " + _thisScene + " scene ####");
        
        function startVod(thumbnailData){
        	if(_this.isDestroy){
				_this.isDestroy = false;
				return;
			}
        	
        	W.state.isVod = true;
        	if(_this.tmpVodInfo){
            	_this.vodSpeed = _this.tmpVodInfo.speed;
        	}else{
            	_this.vodSpeed = 1;
        	}
        	if(_this.playBar) {
        		_this.playBar = undefined;
        	}
        	if(_this.vodFinish) {
        		_this.vodFinish = undefined;
        	}
        	
        	if(_this.isKidsMode){
        		_this.playBar = new playBarKidsComp();
        		_this.vodFinish = new vodFinishKidsComp();
            }else{
            	_this.playBar = new playBarComp();
            	_this.vodFinish = new vodFinishComp();
            }
        	
        	if(_this.series){
				_this.hasPrevEpisode = false;
				_this.hasNextEpisode = false;
				_this.prevAssetId = null;
				_this.nextAssetId = null;
				
        		W.log.info(_this.series);
        		W.log.info("_this.seriesIndex ===== " + _this.seriesIndex);
				var currEpNum = _this.series[_this.seriesIndex].episodeNum;
				W.log.info("currEpNum ===== " + currEpNum);
				var prevEp = _this.series[_this.seriesIndex-1];
				var nextEp = _this.series[_this.seriesIndex+1];
				
				if(prevEp){
					if(Number(prevEp.episodeNum) < Number(currEpNum)){
						_this.hasPrevEpisode = true;
						_this.prevAssetId = prevEp.assetId;
					}else if(Number(prevEp.episodeNum) > Number(currEpNum)){
						_this.hasNextEpisode = true;
						_this.nextAssetId = prevEp.assetId;
					}
				}
				if(nextEp){
					if(Number(nextEp.episodeNum) < Number(currEpNum)){
						_this.hasPrevEpisode = true;
						_this.prevAssetId = nextEp.assetId;
					}else if(Number(nextEp.episodeNum) > Number(currEpNum)){
						_this.hasNextEpisode = true;
						_this.nextAssetId = nextEp.assetId;
					}
				}
				W.log.info("_this.hasPrevEpisode ===== " + _this.hasPrevEpisode);
				W.log.info("_this.hasNextEpisode ===== " + _this.hasNextEpisode);
			}
        	
        	if(_this._playBarComp){
        		_this._parentDiv.remove(_this._playBarComp);
        	}
        	if(_this._vodFinishComp){
        		_this._parentDiv.remove(_this._vodFinishComp);
        	}

        	_this._playBarComp = _this.playBar.getComp(_this, thumbnailData);
        	_this._vodFinishComp = _this.vodFinish.getComp(_this, thumbnailData);
        	
        	_this._parentDiv.add(_this._playBarComp);
    		_this._parentDiv.add(_this._vodFinishComp);
            
    		_this.onVodEvent = function(event){
				W.log.info("[VOD Event] " + event.key);
				if(_this.isDestroy){
					_this.isDestroy = false;
					return;
				}
				
    			if(event.key == "onError"){
    				_this.state = STATE_VOD_ERROR;
    				_this._ad_guide.setStyle({display:"none"});
    				W.PopupManager.openPopup({
                        childComp:_this,
                        isVodError: true,
                        type:"VOD_ERROR",
                        paramData:event.curr_pos,
                        popupName:"popup/ErrorPopup",
                        code: (event.data && event.data.code) ? event.data.code : "9999",
            			from : "VOD"}
                    );
    			}else if(event.key == "onPauseTimeout"){
    				_this.state = STATE_VOD_ERROR;
    				W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        paramData:event.data,
                        code: "502",
            			from : "VOD"}
                    );
    			}else if(event.key == "onAdStart"){
    				W.state.isVod = true;
    				if(_this.receviedStartAd){
    					return;
    				}
    				
					_this.receviedStartAd = true;
					_this.state = STATE_AD_PLAY;
    				_this._ad_guide._title.setText(thumbnailData.title);
    				_this._ad_guide.setStyle({display:"block"});
    			}else if(event.key == "onVodStart"){
    				W.state.isVod = true;
    				if(_this.receviedStartVod){
    					return;
    				}
    				if(!_this.vodInfo){
    					setVodInfo();
    				}
    				
    				_this.receviedStartVod = true;

    				_this.vodInfo.playStartTime = new Date();
    				_this._ad_guide.setStyle({display:"none"});
    				if(W.StbConfig.isKidsMode && W.StbConfig.kidsLimitVodCount > 0){
    					W.StbConfig.kidsLimitVodCount--;
    					
    					W.CloudManager.setKidsRestrict(function(data){
    						W.log.info(data);
    					}, "VOD", W.StbConfig.kidsLimitVodCount);
    				}
    				_this.playBar.onStart(event.data.duration);
    				_this.playBar.setCurrTime(event.data.position);
    				if(_this.state == STATE_VOD_END){
    					_this.vodFinish.hide();
    				}
    				_this.state = STATE_VOD_PLAY;
					_this.playBar.show();
    				showWaterMark(true);
    			}else if(event.key == "onRestart"){
    				_this.playBar.setCurrTime(0);
    				_this.vodSpeed = 1;
    				_this.playBar.changeSpeedIcon("reset");
    				_this.playBar.show();
    			}else if(event.key == "onVodEndSoon"){
    				_this.vodInfo.finishType = "COMPLETE";
    				W.log.info("W.StbConfig.isKidsMode == " + W.StbConfig.isKidsMode);
    				W.log.info("W.StbConfig.kidsLimitVodCount == " + W.StbConfig.kidsLimitVodCount);
    				
    				if(_this.isReplaySingle){
    					W.PopupManager.openPopup({
	                        childComp:_this,
	                        popupName:"popup/FeedbackPopup",
	                        title:W.Texts["vod_end_soon_guide2"]}
	                    );
    				}else{
        				if(W.StbConfig.isKidsMode){
        					if(W.StbConfig.kidsLimitVodCount == 1){
            					W.PopupManager.openPopup({
        	                        childComp:_this,
        	                        popupName:"popup/kids/KidsLimitPopup"}
        	                    );
        					}else{
        						if(W.StbConfig.kidsLimitVodCount > 1 && _this.replaySeriesType < 2){
            	    				W.PopupManager.openPopup({
            	                        childComp:_this,
            	                        popupName:"popup/FeedbackPopup",
            	                        title:W.Texts["vod_end_soon_guide"]}
            	                    );
                				}
        					}
        				}else{
            				if(_this.replaySeriesType < 2){
            					if(_this.asset.nextEpisode || _this.replaySeriesType == 1){
            	    				W.PopupManager.openPopup({
            	                        childComp:_this,
            	                        popupName:"popup/FeedbackPopup",
            	                        title:W.Texts["vod_end_soon_guide"]}
            	                    );
    							}
            				}
        				}
    				}
    			}else if(event.key == "onVodEnd"){
    				_this.vodInfo.finishType = "COMPLETE";
    				
    				W.log.info("W.StbConfig.isKidsMode == " + W.StbConfig.isKidsMode);
    				W.log.info("W.StbConfig.kidsLimitVodCount == " + W.StbConfig.kidsLimitVodCount);
    				if(W.StbConfig.isKidsMode && W.StbConfig.kidsLimitVodCount == 0){
    					W.state.isChannelChangeSkip = true;
    					W.CloudManager.stopVod(function(obj){
    						_this.sendVodEndApi(obj.data);
    						W.CloudManager.closeApp(undefined, true);
    					}, -1);
    					return;
    				}
    				
    				if(W.SceneManager.vodPlayScene){
    					W.SceneManager.resumeVodPlayer();
    				}
    				
    				_this.state = STATE_VOD_END;
    				_this.vodSpeed = 1;
    				_this.playBar.changeSpeedIcon("reset");
    				_this.playBar.hide();
    				W.state.isVod = false;
    				
    				if(_this.zzimList && _this.zzimList.length > 0){
    					if(_this.zzimIndex == _this.zzimList.length - 1){
    						if(_this.isReplayZzim){
    							_this.zzimIndex = 0;
        						_this.checkZzimAsset(_this.zzimList[_this.zzimIndex].target.assetId);
    						}else{
    							W.state.isChannelChangeSkip = true;
    							W.CloudManager.stopVod(function(obj){
    	    						_this.sendVodEndApi(obj.data);
    								_this.backScene();
    	    					}, -1);
    						}
    					}else{
    						_this.zzimIndex++;
    						_this.checkZzimAsset(_this.zzimList[_this.zzimIndex].target.assetId);
    					}
    				}else{
    					if(_this.asset.isTrailer){
        					if(_this.isReplaySingle){
        						_this.state = STATE_VOD_PLAY;
    	                		_this.replay();
        					}else{
        						W.state.isChannelChangeSkip = true;
        						W.CloudManager.stopVod(function(obj){
            						_this.sendVodEndApi(obj.data);
        							_this.vodFinish.show(undefined, undefined, true, _this.asset.isPurchased);
    	    					}, -1);
        					}
        				}else{
        					if(_this.isReplaySingle){
        						_this.state = STATE_VOD_PLAY;
    	                		_this.replay();
        					}else{
        						if(_this.replaySeriesType < 2){
        							if(_this.asset.nextEpisode){
            							_this.checkSeriesAsset(_this.asset.nextEpisode.assetId);
        							}else{
        								if(_this.replaySeriesType == 1){
            								var reqData = {seriesId:_this.asset.seriesId};
            								reqData.offset = 0;
            								reqData.limit = 1;
            								reqData.sort = "episode";
            								reqData.selector = "@detail"
            								_this.sdpDataManager.getSeriesAsset(function(result, data){
            									if(result){
            				    					var asset = data.data[0];
            				    					for(var i=0; i < _this.series.length; i++){
            				    						if(_this.series[i].assetId == asset.assetId){
            				    							_this.seriesIndex = i;
            				    							break;
            				    						}
            				    					}
            				    					
            										W.log.info(asset);
            				            			_this.asset = asset;
            				    					if(util.isWatchable(asset)){
            				    						playOther();
            				    					}else{
            				    						if(_this.asset.products && _this.asset.products.length > 0){
            				    							var products = [];
            				    							var assets = [];
            				    							for(var i=0; i < _this.asset.products.length; i++){
            				    								if(_this.asset.products[i].productType == "VDRVDT"){
            				        								products.push(_this.asset.products[i]);
            				        								assets.push(_this.asset);
            				    								}
            				    							}
            				        						purchase(products, assets);
            				    						}
            				    					}
            				    				}
            								}, reqData);
        								}else{
        									W.state.isChannelChangeSkip = true;
                    	                	W.CloudManager.stopVod(function(obj){
                        						_this.sendVodEndApi(obj.data);
                    	                		_this.vodFinish.show();
                	    					}, -1);
        								}
        							}
            	                }else{
            	                	W.state.isChannelChangeSkip = true;
            	                	W.CloudManager.stopVod(function(obj){
                						_this.sendVodEndApi(obj.data);
            	                		_this.vodFinish.show();
        	    					}, -1);
            	                }
        					}
        				}
    				}
    			}else if(event.key == "onKeyDown"){
    				if(W.SceneManager.vodPlayScene){
    					W.SceneManager.resumeVodPlayer();
    				}
    				
    				_this.changeVodSpeed("pause", function(){
    					_this.playBar.hide();
    					_this.state = STATE_VOD_END;
                		
                		if(_this.asset.isTrailer){
        					var popup = {
    	        	    		popupName:"popup/player/TrailerEndingPopup",
    	        	    		title : _parent.asset.title,
    	        	    		isPurchased : _parent.asset.isPurchased,
    	        	    		isForce : true,
    	        	    		isDefaultChTune : true,
                				childComp:_parent
    	        	    	};
    	        	    	W.PopupManager.openPopup(popup);
        				}else{
        					_this.vodFinish.show(true, true);
        				}
            		});
    			}
    		};
    		
//    		setTimeout(function(){
//    			_this.onVodEvent({key:"onVodEnd"});
//    		}, 10000);
            
    		if(_this.tmpVodInfo){
    			W.state.isVod = true;			
				
        		setVodInfo();
        		
        		_this.playBar.onStart(_this.tmpVodInfo.duration);
				_this.playBar.setCurrTime(_this.tmpVodInfo.currPosition);
				if(_this.vodSpeed > 0){
					_this.playBar.changeSpeedIcon("ff");
				}else if(_this.vodSpeed == 0){
					_this.playBar.changeSpeedIcon("rw");
				}else if(_this.vodSpeed < 0){
					_this.playBar.changeSpeedIcon("pause");
				}
				
				if(_this.tmpVodInfo.isVodAD){
					_this.receviedStartAd = true;
					_this.state = STATE_AD_PLAY;
    				_this._ad_guide._title.setText(thumbnailData.title);
    				_this._ad_guide.setStyle({display:"block"});
				}else{
					_this.state = STATE_VOD_PLAY;
					_this.playBar.show();
					showWaterMark();
				}
				isCompleteVodStart = true;
    		}else{
        		vodPlay();
    		}
        };
        
        var commitCount = 0;
        function commitPurchase(){
        	if(W.purchaseValue){
            	var reqData = {transactionId:W.purchaseValue.transactionId};
    			reqData.product = {productId:W.purchaseValue.product.productId};
    			reqData.commit = true;
    			commitCount++;
				W.CloudManager.sendLog("purchase", "puchase commit :::: " + W.purchaseValue.transactionId);
    			_this.sdpDataManager.buyCommit(function(result, data){
    				if(!result){
    					W.CloudManager.sendLog("purchase", "puchase commit fail :: " + W.purchaseValue.transactionId);
    					if(commitCount == 3){
    						W.PopupManager.openPopup({
                                childComp:_this,
                                type:"PURCHASE_COMMIT_FAIL",
                                popupName:"popup/ErrorPopup",
                                code:data.error.code,
                    			from : "SDP"
    						});
    						W.purchaseValue = undefined;
    					}else{
    						purchaseTimeout = setTimeout(function(){
    							W.log.info("##################################");
    							W.log.info("##################################");
    							W.log.info("##################################");
    							commitPurchase();
    						}, 10 *1000);
    					}
    				}else{
    					W.CloudManager.sendLog("purchase", "puchase commit success :: " + W.purchaseValue.transactionId);
    					W.purchaseValue = undefined;
    					W.CloudManager.purchasedVod(function(evt){
    						W.log.info(evt);
    					}, "OK");
    				}
    			}, reqData);
        	}
        };
        
        function setVodInfo(){
        	_this.vodInfo = undefined;
			_this.vodInfo = {};
			_this.vodInfo.cookie = _this.asset.prepareInfo.cookie;
			_this.vodInfo.finishType = "STOP";
			if(_this.tmpVodInfo){
				_this.vodInfo.playStartTime = new Date(_this.tmpVodInfo.vodStartTime);
			}else{
				_this.vodInfo.playStartTime = new Date();
			}
			_this.vodInfo.playEnd = undefined;
			_this.vodInfo.playTime = undefined;
			_this.vodInfo.offsetType = "time";
			_this.vodInfo.offset = undefined;
			_this.vodInfo.lang = W.StbConfig.menuLanguage;
        };
        
        function vodPlay(isReplay, isError){
        	if(isError){
        		var reqData = {assetId:_this.asset.assetId};
    			_this.sdpDataManager.getViewingOffset(function(result, data){
    				if(result && data.data && data.data[0] && data.data[0].resume){
    					if(!_this.asset.prepareInfo){
    						_this.asset.prepareInfo = {};
    					}
    					if(!_this.asset.prepareInfo.resume){
    						_this.asset.prepareInfo.resume = {};
    					}
    					_this.asset.prepareInfo.resume.offset = data.data[0].resume.offset;
    				}
    				vodPlay();
    			}, reqData);
        		return;
        	}
        	
        	var vodUrl = _this.asset.prepareInfo.url;
    		var cookie = [];
    		var offset = 0;
    		if(_this.asset.prepareInfo.resume && _this.asset.prepareInfo.resume.offset > 0 && !isReplay){
    			offset = _this.asset.prepareInfo.resume.offset;
    		}
    		if(_this.asset.prepareInfo.cookie){
    			cookie.push(_this.asset.prepareInfo.cookie);
    		}
    		var vodType = "VOD";
    		if(_this.asset.isLongTail){
    			vodType = "LONGTAIL";
    		}
    		W.log.info("vodUrl :: " + vodUrl);
    		W.log.info("offset :: " + offset);
    		W.log.info("cookie :: " + cookie);
    		W.log.info("vodType :: " + vodType);
    		
			_this.receviedStartAd = false;
			_this.receviedStartVod = false;
			
			
			setVodInfo();

			if(W.purchaseValue){
				var time = 1000 * 60;
				//if(W.StbConfig.cugType == "accommodation"){
				//	time = 1000 * 60 * 3;
				//}
				clearTimeout(purchaseTimeout);
				purchaseTimeout = setTimeout(function(){
					W.log.info("##################################");
					W.log.info("##################################");
					W.log.info("##################################");
					commitCount = 0;
					commitPurchase();
				}, time);
			}
			
			W.state.playAssetId = _this.asset.assetId;
			
			clearTimeout(vodStartTimeout);
			isCompleteVodStart = false;
			vodStartTimeout = setTimeout(function(){
				isCompleteVodStart = true;
			}, 3000);
			
			if(_this.isDestroy){
				_this.isDestroy = false;
				return;
			}
			
			var webAppData = {assetId:_this.asset.assetId, isKidsPlayer:_this.isKidsMode, prepareInfo:_this.asset.prepareInfo};
			W.log.info(JSON.stringify(webAppData));

			W.CloudManager.startVod(function(objStart){
    			W.log.info(objStart);
				isCompleteVodStart = true;
    			if(objStart && objStart.data == "KO") {
    				W.CloudManager.stopVod(function(obj){
						_this.sendVodEndApi(obj.data);
        				W.PopupManager.openPopup({
                            childComp:_this,
                            popupName:"popup/ErrorPopup",
                            code: objStart.extra.code,
                			from : "VOD"}
                        );
    				}, -1);
    			}else{
    				playCount++;
    				if(!_this.vodInfo){
    					setVodInfo();
    				}
    			}
            }, vodUrl, vodType, cookie, offset, webAppData);
        };
        
        function countinuePlay(){
        	if(W.state.isVod){
            	if(_this.state == STATE_VOD_END){
            		_this.state = STATE_VOD_PLAY;
            		
            		if(_this.vodFinish.isForce()){
            			if(_this.vodSpeed != 1){
            				_this.changeVodSpeed("reset");
            			}
            		}else{
            			W.CloudManager.stopVod(function(obj){
    						_this.sendVodEndApi(obj.data);
                			W.state.isVod = false;
            				_parent.backScene();
    					}, -1);
            		}
            	}
        	}else{
        		W.CloudManager.stopVod(function(obj){
					_this.sendVodEndApi(obj.data);
            		_this.backScene();
				}, -1);
        	}
        };
        
        
        function callbackPurchase(result){
        	W.log.info("-------------------------------------");
        	W.log.info(result);
	    	if(result.result == "SUCCESS"){
	    		_this.playBar.hideIcon();
	    		_this.asset = result.asset;
	    		W.CloudManager.addNumericKey();
	    		var sceneList = W.SceneManager.getSceneStack();
	    		if(sceneList[sceneList.length - 2] && sceneList[sceneList.length - 2].id == "scene_vod/VodDetailScene"){
	    			if(_this.series){
	    				sceneList[sceneList.length - 2].chanePurchasedAsset("series", _this.asset, _this.seriesIndex);
		    		}else{
		    			sceneList[sceneList.length - 2].chanePurchasedAsset("single", _this.asset);
		    		}
	    		}
	    		
	    		
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
                	W.CloudManager.sendLog("purchase", "puchase cancel ::v:: " + W.purchaseValue.transactionId);
        			_this.sdpDataManager.buyCommit(function(result, data){
                    	W.CloudManager.sendLog("purchase", "puchase cancel :v: " + W.purchaseValue.transactionId + result);
        				W.purchaseValue = undefined;
        				if(W.purchaseValue2){
        					W.purchaseValue = Object.assign(W.purchaseValue2);
        					W.purchaseValue2 = undefined;
        				}
        				
        				setTimeout(function(){
    	   				 	var popup = {
    	         				popupName:"popup/purchase/PurchaseCompletePopup",
    	         				contents:_this.asset,
    	         				childComp:_this
    	         			};
    	     	    		W.PopupManager.openPopup(popup);
    	   			 	}, 300);
        			}, reqData);
            	}else{
            		if(W.purchaseValue2){
    					W.purchaseValue = Object.assign(W.purchaseValue2);
    					W.purchaseValue2 = undefined;
    				}
            		
            		setTimeout(function(){
	   				 	var popup = {
	         				popupName:"popup/purchase/PurchaseCompletePopup",
	         				contents:_this.asset,
	         				childComp:_this
	         			};
	     	    		W.PopupManager.openPopup(popup);
	   			 	}, 300);
            	}
	    	}else{
	    		if(result.result == "FAIL"){
	    			W.CloudManager.stopVod(function(obj){
						_this.sendVodEndApi(obj.data);
			    		W.PopupManager.openPopup({
		                    childComp:_this, 
		                    popupName:"popup/ErrorPopup",
		                    type:"PURCHASE_FAIL",
		                    code:result.resultData.error.code,
	            			from : "SDP"}
		                );
					}, -1);
		    	}else{
		    		countinuePlay();
		    	}
	    	}
        };
        
        function purchase(products, assets){
        	if(W.StbConfig.blockPurchase){
        		W.state.isChannelChangeSkip = true;
            	W.CloudManager.stopVod(function(obj){
					_this.sendVodEndApi(obj.data);
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
				}, -1);
        	}else{
        		var isUhd = false;
				for(var i=0; i < assets.length; i++){
					if(assets[i].resolution == "UHD"){
						isUhd = true;
						break;
					}
				}
				
        		if(!W.StbConfig.isUHD && isUhd){
        			W.CloudManager.stopVod(function(obj){
    					_this.sendVodEndApi(obj.data);
            			W.PopupManager.openPopup({
    		                title:W.Texts["popup_zzim_info_title"],
    		                popupName:"popup/AlertPopup",
    		                boldText:W.Texts["uhd_guide_popup"],
    		                thinText:W.Texts["uhd_guide_popup2"] 
    		            });
    				}, -1);
        		}else{
        			var param = {type:"V", products:products, data:assets, callback:callbackPurchase};
        			W.SceneManager.startScene({
        				sceneName:"scene/vod/PurchaseVodScene", 
        				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
        				param:param
        			});
        		}
        	}
        };
        
        function closeTrailerPopup(type, isForce, isDefaultChTune){
        	if(type == "purchase"){
        		if(isForce){
    				W.state.isChannelChangeSkip = true;
    				W.CloudManager.stopVod(function(obj){
						_this.sendVodEndApi(obj.data);
						W.state.isVod = false;
						W.log.info(_this.asset.puchaseProduct);
						purchase(_this.asset.puchaseProduct.products, _this.asset.puchaseProduct.assets);
    				}, -1);
    			}else{
    				W.state.isVod = false;
					W.log.info(_this.asset.puchaseProduct);
					purchase(_this.asset.puchaseProduct.products, _this.asset.puchaseProduct.assets);
    			}
        	}else if(type == "close"){
    			if(isForce){
    				if(!isDefaultChTune){
        				W.state.isChannelChangeSkip = true;
    				}
    				W.CloudManager.stopVod(function(obj){
						_this.sendVodEndApi(obj.data);
						W.state.isVod = false;
						_this.backScene();
    				}, -1);
    			}else{
    				W.state.isVod = false;
    				_this.backScene();
    			}
        	}else if(type == "cancel"){
        		_this.changeVodSpeed("reset", function(){
        			_this.state = _this.stateOld;
        		});
        	}
        };
        
        function getThumbnail(){
        	var reqData = {assetId:_this.asset.assetId};
            _this.sdpDataManager.getVodThumbnail(function(result, data){
            	W.log.info("title ==== " + _this.asset.title);
            	var thumbnailData = {title:_this.asset.title, thumbList:[]};
            	if(result){
            		thumbnailData.thumbList = data.thumbnail;
            		for(var i=0; i < thumbnailData.thumbList.length; i++){
            			thumbnailData.thumbList[i].fileName = W.Config.IMAGE_URL + "/data_img/thumbnail/vod/" + _this.asset.assetId + "/" + thumbnailData.thumbList[i].fileName;
            		}
            	}
            	
            	if(_this.tmpVodInfo){
            		startVod(thumbnailData);
            	}else{
                	var reqData2 = {
                		assetId:_this.asset.assetId,
                		deviceType:"stb"
                	};
                	if(_this.asset.prepareInfo && _this.asset.prepareInfo.resume && _this.asset.prepareInfo.resume.offset){
                		reqData2.resume = true;
                	}else{
                		reqData2.resume = false;
                	}
        			
        			var entryInfo = W.entryPath.getPath();
    				reqData2.entryPath = entryInfo.path;
    				if(entryInfo.path){
    					W.recentEntry = Object.assign(entryInfo);
    				}
    				if(entryInfo.categoryId){
    					reqData2.categoryId = entryInfo.categoryId;
    				}
    				
    				if(W.state.isVod && !reqData2.entryPath){
    					if(W.recentEntry){
    						reqData2.entryPath = W.recentEntry.path;
    						if(W.recentEntry.categoryId){
    							reqData2.categoryId = W.recentEntry.categoryId;
    						}
    					}
    				}

    				_this.sdpDataManager.getPrepareViewing(function(result, data){
    					if(_this.isDestroy){
    						_this.isDestroy = false;
    						return;
    					}
    					
            			if(result){
                    		W.log.info(data);
                    		if(!_this.asset.prepareInfo){
                    			_this.asset.prepareInfo = {};
                    		}
                    		
                    		_this.asset.prepareInfo.url = data.url;
                    		_this.asset.prepareInfo.resume = data.resume;
                    		_this.asset.prepareInfo.cookie = data.cookie;
                    		
                    		if(!W.purchaseValue && data.transactionId && !data.commit){
                    			var reqData = {transactionId:data.transactionId};
                    			reqData.product = {productId:data.productId};
                    			reqData.commit = true;
                				W.CloudManager.sendLog("purchase", "puchase commit :::: " + data.transactionId);
                    			_this.sdpDataManager.buyCommit(function(result, data2){
                    				W.log.info(data2);
                    				if(!result){
                    					W.CloudManager.sendLog("purchase", "puchase commit fail :: " + data.transactionId);
                    					W.PopupManager.openPopup({
                                            childComp:_this,
                                            type:"PURCHASE_COMMIT_FAIL",
                                            popupName:"popup/ErrorPopup",
                                            code:data2.error.code,
                                			from : "SDP"
                						});
                    				}else{
                    					startVod(thumbnailData);
                    				}
                    			}, reqData);
                    		}else{
                    			startVod(thumbnailData);
                    		}
            			}else{
            				W.PopupManager.openPopup({
                                title:"Error",
                                popupName:"popup/ErrorPopup",
                                code:data.error ? data.error.code : undefined,
                            	from : "SDP"}
                            );
            			}
                	}, reqData2);
            	}
            }, reqData);
        };
        
        function playOther(){
//        	var reqData = {
//        		assetId:_this.asset.assetId,
//        		resume:true,
//        		deviceType:"stb"
//        	};
//        	
//        	var entryInfo = W.entryPath.getPath();
//			reqData.entryPath = entryInfo.path;
//			if(entryInfo.categoryId){
//				reqData.categoryId = entryInfo.categoryId;
//			}
//			
//    		_this.sdpDataManager.getPrepareViewing(function(result, data){
//    			if(result){
//            		W.log.info(data);
//            		_this.asset.prepareInfo = data;
//            		if(_this.asset.prepareInfo.resume && _this.asset.prepareInfo.resume.offset > 0){
//            			_this.asset.prepareInfo.resume.offset = 0;
//            		}
//            		getThumbnail();
//    			}else{
//    				W.PopupManager.openPopup({
//                        popupName:"popup/ErrorPopup",
//                        code:data.error.code}
//                    );
//    			}
//        	}, reqData);
        	
        	if(_this.tmpVodInfo){
        		_this.tmpVodInfo = undefined;
        	}
    		
    		if(!_this.asset.prepareInfo){
    			_this.asset.prepareInfo = {resume:{offset:0}};
			}
    		
    		if(W.state.isVod){
            	W.state.isChannelChangeSkip = true;
				W.CloudManager.stopVod(function(obj){
					_this.sendVodEndApi(obj.data, true, getThumbnail);
				}, 0);
            }else{
            	getThumbnail();
            }
        };
        
        function showWaterMark(isFirst){
        	clearTimeout(waterMarkShowTimeout);
            clearTimeout(waterMarkHideTimeout);
            
            waterMarkShowTimeout = setTimeout(function(){
            	W.log.info("show water mark !!");
            	_this._water_mark.setStyle({display:"block"});
            	hideWaterMark();
            }, isFirst ? 1000*10 : 1000*60*10);
        };
        
        function hideWaterMark(){
            clearTimeout(waterMarkHideTimeout);
            waterMarkHideTimeout = setTimeout(function(){
            	W.log.info("hide water mark !!");
            	_this._water_mark.setStyle({display:"none"});
            	showWaterMark();
            }, 1000*10);
        };

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                W.log.info(param);
                _this = this;
                this.asset = param.data;
                this.series = param.series;
                this.seriesIndex = param.seriesIndex;
                this.zzimList = param.zzimList;
                this.zzimIndex = 0;
                this.isKidsMode = param.isKidsMode;
                this.isReplayZzim = param.isReplayZzim;
                this.isReplaySingle = false;
                this.isTmpPlayer = param.isTmpPlayer;
                this.isClearPin = param.isClearPin;
                
                playCount = 0;
                
                if(this.series){
                    this.replaySeriesType = W.StbConfig.vodContinuousPlay - 1;
                }

                _this.state = STATE_NONE;
                W.log.info("=============================================");
                W.log.info(param);
                W.log.info(_this.series);
                W.log.info(_this.replaySeriesType);
                W.log.info("=============================================");

                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_R, W.KEY.COLOR_KEY_G]);

                W.CloudManager.addNumericKey();
                W.CloudManager.addChChangeEvtListener();
                
                _this._water_mark = new W.Div({x:53, y:44, width:"141px", height:"60px", opacity:0.7, display:"none"});
                _this.add(_this._water_mark);
                
                _this._parentDiv = new W.Div({className : "bg_size"});
                _this.add(_this._parentDiv);
                
                _this._water_mark._text = new W.Span({x:0, y:0, width:"300px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px",
    				className:"font_rixhead_bold", text:"KCTV " + W.StbConfig.accountId.substr(0,4)});
                _this._water_mark.add(_this._water_mark._text);
                _this._water_mark._text = new W.Span({x:0, y:22, width:"300px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px",
    				className:"font_rixhead_bold", text:W.StbConfig.accountId.substr(4)});
                _this._water_mark.add(_this._water_mark._text);
                
                
                _this._ad_guide = new W.Div({x:974, y:42, width:"325px", height:"119px", display:"none"});
                _this.add(_this._ad_guide);
                _this._ad_guide.add(new W.Image({x:0, y:0, width:"325px", height:"119px", src:"img/box_vod_ad.png"}));
                _this._ad_guide._title = new W.Span({x:1008-974, y:70-42, width:"240px", height:"25px", textColor:"rgb(237,168,2)", "font-size":"23px",
    				className:"font_rixhead_medium cut", text:""});
                _this._ad_guide.add(_this._ad_guide._title);
                _this._ad_guide.add(new W.Span({x:1008-974, y:102-42, width:"240px", height:"20px", textColor:"rgba(255,255,255,0.75)", "font-size":"18px",
    				className:"font_rixhead_light", text:W.Texts["vod_ad_guide"]}));

                this.sdpDataManager = W.getModule("manager/SdpDataManager");
                
                if(this.zzimList){
                	_this.zzimIndex = 0;
					_this.checkZzimAsset(_this.zzimList[_this.zzimIndex].target.assetId);
                }else{
                	if(_this.isTmpPlayer){
                		W.CloudManager.getVodInfo(function(obj){
                			W.log.info(obj);
                			_this.asset.prepareInfo = obj.data.prepareInfo;
                			_this.tmpVodInfo = obj.data;
                			_this.isKidsMode = obj.data.isKidsPlayer;
                			getThumbnail();
                		});
                	}else{
                        getThumbnail();
                	}
                }
            },
            purchaseTrailer : function(isForce){
            	W.log.info(_this.asset.puchaseProduct);
//            	if(W.state.isVod){
//            		purchase(_this.asset.puchaseProduct.products, _this.asset.puchaseProduct.assets);
//				}else{
//					W.state.isChannelChangeSkip = true;
//	            	W.CloudManager.stopVod(function(obj){
//						_this.sendVodEndApi(obj.data);
//						purchase(_this.asset.puchaseProduct.products, _this.asset.puchaseProduct.assets);
//					}, -1);
//				}
            	purchase(_this.asset.puchaseProduct.products, _this.asset.puchaseProduct.assets);
            },
            replay : function(){
            	W.log.info("================== replay");
            	W.state.isVod = true;
            	vodPlay(true);
            },
            checkZzimAsset : function(assetId){
            	W.log.info(assetId);
            	var reqData = {assetId:assetId, selector:"@detail"};
    			_this.sdpDataManager.getDetailAsset(function(result, data){
    				if(result){
    					var asset = data.data[0];
    					for(var i=0; i < _this.zzimList.length; i++){
    						if(_this.zzimList[i].assetId == asset.assetId){
    							_this.zzimIndex = i;
    							break;
    						}
    					}
    					
						W.log.info(asset);
            			_this.asset = asset;
    					if(util.isWatchable(asset)){
    						W.state.isChannelChangeSkip = true;
    						playOther();
    					}else{
    						if(_this.asset.products && _this.asset.products.length > 0){
    							var products = [];
    							var assets = [];
    							for(var i=0; i < _this.asset.products.length; i++){
    								if(_this.asset.products[i].productType == "VDRVDT"){
        								products.push(_this.asset.products[i]);
        								assets.push(_this.asset);
    								}
    							}
    							if(assets.length == 0){
    								for(var i=0; i < _this.asset.products.length; i++){
        								if(_this.asset.products[i].productType == "VDRVLF"){
            								products.push(_this.asset.products[i]);
            								assets.push(_this.asset);
        								}
        							}
    							}
    							if(W.state.isVod){
            						purchase(products, assets);
    							}else{
        							W.state.isChannelChangeSkip = true;
        			            	W.CloudManager.stopVod(function(obj){
        								_this.sendVodEndApi(obj.data);
                						purchase(products, assets);
        							}, -1);
    							}
    						}
    					}
    				}
				}, reqData);
            },
            checkSeriesAsset : function(assetId){
            	W.log.info(assetId);
            	var reqData = {assetId:assetId, selector:"@detail"};
    			_this.sdpDataManager.getDetailAsset(function(result, data){
    				if(result){
    					var asset = data.data[0];
    					if(_this.series){
        					for(var i=0; i < _this.series.length; i++){
        						if(_this.series[i].assetId == asset.assetId){
        							_this.seriesIndex = i;
        							break;
        						}
        					}
    					}
    					
						W.log.info(asset);
            			_this.asset = asset;
    					if(util.isWatchable(asset)){
    						W.state.isChannelChangeSkip = true;
    						playOther();
    					}else{
    						if(_this.asset.products && _this.asset.products.length > 0){
    							var products = [];
    							var assets = [];
    							for(var i=0; i < _this.asset.products.length; i++){
    								if(_this.asset.products[i].productType == "VDRVDT"){
        								products.push(_this.asset.products[i]);
        								assets.push(_this.asset);
    								}
    							}
    							if(assets.length == 0){
    								for(var i=0; i < _this.asset.products.length; i++){
        								if(_this.asset.products[i].productType == "VDRVLF"){
            								products.push(_this.asset.products[i]);
            								assets.push(_this.asset);
        								}
        							}
    							}
    							if(W.state.isVod){
    								purchase(products, assets);
    							}else{
        							W.state.isChannelChangeSkip = true;
        			            	W.CloudManager.stopVod(function(obj){
        								_this.sendVodEndApi(obj.data);
                						purchase(products, assets);
        							}, -1);
    							}
    						}
    					}
    				}
				}, reqData);
            },
            changeVodSpeed: function(type, callbak){
            	_this.vodOldSpeed = _this.vodSpeed;
            	if(type == "rw"){
            		if(_this.vodSpeed >= 0){
            			_this.vodSpeed = -2;
            		}else if(_this.vodSpeed == -2){
            			_this.vodSpeed = -8;
            		}else if(_this.vodSpeed == -8){
            			_this.vodSpeed = -32;
            		}else if(_this.vodSpeed == -32){
            			_this.vodSpeed = -64;
            		}else if(_this.vodSpeed == -64){
            			_this.vodSpeed = 1;
            		}
            	}else if(type == "ff"){
            		if(W.StbConfig.supportSetRate){
                		if(_this.vodSpeed <= 0 || _this.vodSpeed == 1){
                			_this.vodSpeed = 1.2;
                		}else if(_this.vodSpeed == 1.2){
                			_this.vodSpeed = 2;
                		}else if(_this.vodSpeed == 2){
                			_this.vodSpeed = 8;
                		}else if(_this.vodSpeed == 8){
                			_this.vodSpeed = 32;
                		}else if(_this.vodSpeed == 32){
                			_this.vodSpeed = 64;
                		}else if(_this.vodSpeed == 64){
                			_this.vodSpeed = 0.8;
                		}else if(_this.vodSpeed == 0.8){
                			_this.vodSpeed = 1;
                		}
            		}else{
                		if(_this.vodSpeed <= 0 || _this.vodSpeed == 1){
                			_this.vodSpeed = 2;
                		}else if(_this.vodSpeed == 2){
                			_this.vodSpeed = 8;
                		}else if(_this.vodSpeed == 8){
                			_this.vodSpeed = 32;
                		}else if(_this.vodSpeed == 32){
                			_this.vodSpeed = 64;
                		}else if(_this.vodSpeed == 64){
                			_this.vodSpeed = 1;
                		}
            		}
            	}else if(type == "pp"){
            		if(_this.vodSpeed == 0){
            			_this.vodSpeed = 1;
            		}else if(_this.vodSpeed == 1){
            			_this.vodSpeed = 0;
            		}else{
            			_this.vodSpeed = 1;
            		}
            	}else if(type == "reset"){
            		_this.vodSpeed = 1;
            	}else if(type == "pause"){
            		_this.vodSpeed = 0;
            	}
            	W.CloudManager.speedVod(function(obj, callbak){
            		W.log.info("Vod Change Speed : " + obj.data);
            		if(obj.data != "OK"){
            			_this.vodSpeed = _this.vodOldSpeed;
            		}
            		_this.playBar.changeSpeedIcon(type);
            		if(callbak){
                		callbak();
            		}
            	}, _this.vodSpeed, callbak);
            },
            onPause: function() {

            },
            onResume: function() {
            	W.log.info(_thisScene + " onResume !!!");
            	
            	W.CloudManager.addNumericKey();
                W.CloudManager.addChChangeEvtListener();
                
            	showWaterMark();
            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");
                _this.isDestroy = true;
                
                if(W.recentEntry){
                	W.recentEntry = null;
                }
                if(W.purchaseValue){
                	clearTimeout(purchaseTimeout);
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
                	W.CloudManager.sendLog("purchase", "puchase cancel :::: " + W.purchaseValue.transactionId);
        			_this.sdpDataManager.buyCommit(function(result, data){
                    	W.CloudManager.sendLog("purchase", "puchase cancel :: " + result);
        				var sceneList = W.SceneManager.getSceneStack();
        				if(sceneList[sceneList.length - 1].id == "scene_vod/VodDetailScene" || sceneList[sceneList.length - 1].id == "scene_kids/KidsVodDetailScene"){
        					sceneList[sceneList.length - 1].onRefresh({command : "cancelPurchase"});
        				}
        			}, reqData);
    				W.purchaseValue = undefined;
                }
                clearTimeout(waterMarkShowTimeout);
                clearTimeout(waterMarkHideTimeout);
                if(!W.state.isVod){
                    W.CloudManager.delNumericKey();
                    W.CloudManager.removeChChangeEvtListener();
                }
                if(_this.playBar){
                    _this.playBar.isShow = false;
                }
                
                if(W.StbConfig.isKidsMode){
					if(W.StbConfig.kidsLimitVodCount == 1){
    					W.PopupManager.openPopup({
	                        childComp:_this,
	                        popupName:"popup/kids/KidsLimitPopup"}
	                    );
					}
				}
            },
            expire : function() {
                W.log.info(_thisScene + " expire !!!");
                clearTimeout(waterMarkShowTimeout);
                clearTimeout(waterMarkHideTimeout);
                if(_this.playBar){
                    _this.playBar.hideIcon();
                    _this.playBar.hide();
                }
                if(_this.vodFinish){
                    _this.vodFinish.hide();
                }
            },
            onPopupClosed : function(popup, desc) {
            	if (desc) {
    				W.log.info(desc);
            		if (desc.popupName == "popup/player/TrailerEndingPopup") {
            			if (desc.action == W.PopupManager.ACTION_OK) {
            				if(desc.btnType == "PURCHASE"){
            					closeTrailerPopup("purchase", desc.isForce);
            				}else if(desc.btnType == "FINISH"){
            					closeTrailerPopup("close", desc.isForce, desc.isDefaultChTune);
            				}else if(desc.btnType == "CLOSE"){
            					closeTrailerPopup("cancel");
            				}
            			}else{
            				closeTrailerPopup("cancel");
            			}
        			}else if (desc.popupName == "popup/player/VodContinuePopup") {
        				if (desc.action == W.PopupManager.ACTION_OK) {
            				if(desc.idx == 1){
            					_this.asset.prepareInfo.resume.offset = 0;
            				}
	            			getThumbnail();
            			}
        			}else if (desc.popupName == "popup/AlertPopup") {
        				if(desc.type == "VOD_PLAY_FAIL"){
        					W.state.isVod = false;
        					_this.backScene();
        				}else{
            				_this.backScene();
        				}
        			}else if (desc.popupName == "popup/ErrorPopup") {
        				if (desc.action == W.PopupManager.ACTION_OK && desc.type == "VOD_ERROR") {
        					vodPlay(false, true);
            			}else{
            				if(desc.type == "PURCHASE_COMMIT_FAIL"){
            					W.state.isChannelChangeSkip = true;
                				W.CloudManager.stopVod(function(obj){
            						_this.sendVodEndApi(obj.data);
            						W.state.isVod = false;
                					_this.backScene();
                				}, -1);
            				}else if(desc.type == "PURCHASE_FAIL"){
            					W.state.isVod = false;
            					_this.backScene();
            				}else{
            					if(desc.data){
            						_this.sendVodEndApi(desc.data);
            					}else{
            						_this.sendVodEndApi();
            					}
                				W.state.isVod = false;
                				if(W.SceneManager.vodPlayScene){
                					W.SceneManager.vodPlayScene = null;
                				}else{
                					_this.backScene();
                				}
            				}
            			}
        			}else if (desc.popupName == "popup/purchase/PurchaseCompletePopup") {
        	    		playOther();
        			}else if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
        	    		W.log.info(desc);
        	    		if (desc.action == W.PopupManager.ACTION_OK){
            	    		if(desc.param.option == 0){
            	    			if(desc.param.value == 0){
            	    				_this.isReplaySingle = true;
            	    			}else{
            	    				_this.isReplaySingle = false;
            	    			}
            	    		}else if(desc.param.option == 1){
            	    			_this.replaySeriesType = desc.param.value;
            	    			W.StbConfig.vodContinuousPlay = _this.replaySeriesType + 1;
            	    			W.CloudManager.setVODContinuousPlay(function(obj){
            	    				W.log.info(obj);
            	    			}, W.StbConfig.vodContinuousPlay);
            	    		}
        	    		}
        	    		W.log.info("isReplaySingle == " + _this.isReplaySingle);
        	    		W.log.info("replaySeriesType == " + _this.replaySeriesType);
        			}
    			}
            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " : state " + _this.state);
                if(isCompleteVodStart){
                    if(_this.state == STATE_VOD_END){
                    	if(_this.vodFinish){
                        	_this.vodFinish.onKeyPressed(event);
                    	}
                    }else{
    					if(_this.playBar){
                    		var isResume = _this.playBar.onKeyPressed(event);
                        	if(!isResume){
                        		
                        	}
                    	}
                    }
                }
            },
            sendVodEndApi : function(offset, isOtherVod, callbackFunction){
            	var vodInfo = _this.vodInfo;
            	if(!vodInfo && isOtherVod){
            		vodInfo = W.vodTmpInfo;
            	}
            	W.log.info(vodInfo);
            	if(vodInfo && vodInfo.playStartTime){
            		vodInfo.playEndTime = new Date();
    				vodInfo.playingTime = Math.round((vodInfo.playEndTime.getTime() - vodInfo.playStartTime.getTime())/1000);
    				if(offset){
    					vodInfo.offset = offset;
    				}else{
    					vodInfo.offset = 0;
    				}
    				vodInfo.playStart = util.newISODateTime(vodInfo.playStartTime.getTime(), true);
    				vodInfo.playEnd = util.newISODateTime(vodInfo.playEndTime.getTime(), true);
    				vodInfo.playStartTime = undefined;
    				vodInfo.playEndTime = undefined;

    				_this.sdpDataManager.finishViewing(function(result, data){
    					W.log.info("finishViewing callback result :: " + result);
    					vodInfo = undefined;
    					W.state.playAssetId = undefined;
    					
    					if(callbackFunction){
                			callbackFunction();
                		}
    				}, vodInfo);
            	}else{
            		if(callbackFunction){
            			callbackFunction();
            		}
            	}
            	
            	if(W.vodTmpInfo){
            		W.vodTmpInfo = null;
            	}
            },
            getVodInfo : function(){
            	return Object.assign(_this.vodInfo);
            },
            finishVod : function(callbackFunction){
            	if(W.state.isVod){
                	W.state.isChannelChangeSkip = true;
    				W.CloudManager.stopVod(function(obj){
    					_this.sendVodEndApi(obj.data, false, callbackFunction);
    				}, 0);
                }
            }
        });
    });
