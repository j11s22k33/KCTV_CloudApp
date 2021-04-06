/**
 * scene/VodDetailScene
 *
 */
W.defineModule([ "mod/Util", "comp/CouponInfo", "comp/kids/Detail", "comp/kids/RecommendList", "comp/vod/DetailModule"],
	function(util, couponInfoComp, detailComp, recommendComp, DetailModule) {
		var _thisScene = "KidsVodDetailScene";
		var _this;
		var hasRecommend = false;
		W.log.info("### Initializing " + _thisScene + " scene ###");
		var isComplete = false;

		function cbDetail(result, data){

			_this.detail = data.data[0];

			setBackground();
			setMarketingMessage();

			if(_this.contentType == "Sasset"){
				_this.detail.contentType = "Sasset";
				var assetIds = "";
				for(var i=0; i < _this.detail.members.length; i++){
					assetIds += (i > 0 ? "," : "") + _this.detail.members[i].assetId;
				}
				var reqData = {assetId:assetIds};
				_this.sdpDataManager.getDetailAsset(function(result, data){
					_this.detail.members = data.data;
					setDetail();
				}, reqData);
			}else if(_this.contentType == "asset"){
				if(_this.detail.isSeries){
					_this.vodSeriesAssetId = Object.assign(_this.detail.assetId);
					var reqData = {seriesId: _this.detail.seriesId};
					_this.contentType = "series";
					_this.sdpDataManager.getSeriesDetail(cbDetail, reqData);
				}else{
					var reqData = {sassetId:_this.detail.sassetId, selector:"@detail"};
//					_this.sdpDataManager.getSAssetsDetail(function(result, data){
//						var asset = Object.assign(_this.detail);
//						_this.detail = data.data[0];
//						_this.detail.members = [];
//						_this.detail.members[0] = asset;
//						_this.contentType = "Sasset";
//						_this.detail.contentType = "Sasset";
//						setDetail();
//					}, reqData);
					_this.contentType = "Sasset";
					_this.sdpDataManager.getSAssetsDetail(cbDetail, reqData);
				}
			}else if(_this.contentType == "series"){
				_this.detail.contentType = "series";
				_this.detail.startIndex = 0;
				_this.detail.lastWatchEpisodeIndex = -1;

				var reqData = {seriesId:_this.detail.seriesId, offset:0, limit:10000, selector:"assetId,episodeNum"};
				_this.sdpDataManager.getSeriesAsset(function(result, data){
					_this.seriesAssetEpisodes = data.data;
					
					if(_this.detail.lastWatchEpisodeNum){
						for(var i=0; i < data.data.length; i++){
							if(_this.detail.lastWatchEpisodeNum == data.data[i].episodeNum){
								_this.detail.startIndex = i;
								_this.detail.lastWatchEpisodeIndex = i;
								break;
							}
						}
					}

					if(_this.vodSeriesAssetId){
						for(var i=0; i < data.data.length; i++){
							if(_this.vodSeriesAssetId == data.data[i].assetId){
								_this.detail.startIndex = i;
								break;
							}
						}
						W.log.info("startIndex ===== " + _this.detail.startIndex);
						getSeriesAssets(Math.floor(_this.detail.startIndex / 14) * 14);
					}else{
						if(_this.detail.lastWatchEpisodeNum){
//							for(var i=0; i < data.data.length; i++){
//								if(_this.detail.lastWatchEpisodeNum == data.data[i].episodeNum){
//									_this.detail.startIndex = i;
//									_this.detail.lastWatchEpisodeIndex = i;
//									break;
//								}
//							}
							W.log.info("startIndex ===== " + _this.detail.startIndex);
							getSeriesAssets(Math.floor(_this.detail.startIndex / 14) * 14);
						}else{
							getSeriesAssets(0);
						}
					}
				}, reqData);
			}
		};

		function getSeriesAssets(num){
			var assetIds;
			for(var i=num; i < num + 14; i++){
				if(i == _this.seriesAssetEpisodes.length){
					break;
				}
				if(assetIds){
					assetIds += "," + _this.seriesAssetEpisodes[i].assetId;
				}else{
					assetIds = _this.seriesAssetEpisodes[i].assetId;
				}
			}

			var reqData = {assetId:assetIds, selector:"@detail"};
			_this.sdpDataManager.getDetailAsset(function(result, data){
				if(!_this.seriesAssetList){
					_this.seriesAssetList = new Array(_this.seriesAssetEpisodes.length);
				}
				for(var i=0; i < data.data.length; i++){
					for(var j=0; j < _this.seriesAssetEpisodes.length; j++){
						if(data.data[i].assetId == _this.seriesAssetEpisodes[j].assetId){
							_this.seriesAssetList[j] = data.data[i];
							break;
						}
					}
				}
				W.log.info(_this.seriesAssetList);
				setSeries();
			}, reqData);
		};

		function setBackground(){
			if(_this.detail.hashTag){
				var reqData = {accountId:W.StbConfig.accountId, tagId:_this.detail.hashTag};
				_this.uipDataManager.getBackgroundList(function(result, data){
					if(result && data && data.length > 0){
						_this._parentDiv._bg.add(new W.Image({x:0, y:0, width:"1280px", height:"720px", src:data.data[0].image1}));
					}
				}, reqData);
			}
		};

		function setMarketingMessage(){
			if(_this.detail.marketingMessageType == "01" || _this.detail.marketingMessageType == "02"){
				_this._parentDiv._event._text.setText(_this.detail.marketingMessage);
				_this._parentDiv._event.setStyle({display:"block"});
			}
		};

		function setRecommendList(assetId){
			_this.recoDataManager.getVodDetail(function(result, data){
				if(result && data.resultCode == "200" && data.resultList.length > 0){
					hasRecommend = true;
					_this.Recommend.setData(data);
				}else{
					hasRecommend = false;
				}
			}, assetId);
		};

		function setDetail(){
			if(!_this.DetailComp){
				_this.DetailComp = detailComp.getComp(_this, _this._parentDiv._detail, _this.contentType);
				setRecommendList(_this.detail.asset.assetId);
			}
			_this.DetailComp.setData(_this.detail);
			isComplete = true;
		};

		function setSeries(){
			W.log.info(_this.seriesAssetList[_this.detail.startIndex])
			if(!_this.DetailComp){
				_this.DetailComp = detailComp.getComp(_this, _this._parentDiv._detail, _this.contentType);
				setRecommendList(_this.seriesAssetList[_this.detail.startIndex].assetId);
			}

			_this.detail.members = [_this.seriesAssetList[_this.detail.startIndex]];
			_this.DetailComp.setSeries(_this.seriesAssetList, _this.seriesAssetEpisodes, _this.detail.startIndex);
			_this.DetailComp.setData(_this.detail);
			isComplete = true;
		};


		return W.Scene.extend({
			onCreate : function(param) {
				W.log.info(_thisScene + " onCreate");
				_this = this;
				W.log.info(param);
				isComplete = false;
				/*
				 * param : {data:asset, assetId:assetId, sassetId:sassetId, seriesId:seriesId}
				 * data에 값이 있으면 data를 이용해서 시리즈, 애셋, 슈퍼앳셋 구분
				 * 아니면 나머지 id가 있나 여부로 구분
				 * */
				this.param = param;
				this.superAsset;
				this.vodSeriesAssetId;
				this.sdpDataManager = W.getModule("manager/SdpDataManager");
				this.uipDataManager = W.getModule("manager/UiPlfDataManager");
				this.recoDataManager = W.getModule("manager/RecommendDataManager");
				this.detailModule = DetailModule.getNewComp(_this, true);

				this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
					W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
					W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_R]);

				this.couponInfo = couponInfoComp.getNewComp(true);

				this._parentDiv = new W.Div({className : "bg_size"});
				this._parentDiv._bg = new W.Div({className : "bg_size", backgroundImage:"url('img/kid_bg.png')"});
				this._parentDiv.add(this._parentDiv._bg);
				this._parentDiv._detail = new W.Div({className : "bg_size"});
				this._parentDiv.add(this._parentDiv._detail);
				this._parentDiv._recommend_area = new W.Div({className : "bg_size"});
				this._parentDiv.add(this._parentDiv._recommend_area);
				this._parentDiv._coupon_area = new W.Div({className : "bg_size"});
				this._parentDiv.add(this._parentDiv._coupon_area);
				this._parentDiv._coupon_area.add(_this.couponInfo.getComp(392, 38, 850));
				
				this._parentDiv._event = new W.Div({x:61, y:48, width:"600px", height:"44px", display:"none"});
				this._parentDiv.add(this._parentDiv._event);
				this._parentDiv._event.add(new W.Image({x:0, y:0, width:"52px", height:"44px", src:"img/icon_event_2.png"}));
				this._parentDiv._event._text = new W.Span({x:51, y:8, width:"540", height:"19px", textColor:"rgb(237,168,2)", "font-size":"17px",
					className:"font_rixhead_light"})
				this._parentDiv._event.add(this._parentDiv._event._text);

				this.couponInfo.setData(null, [{color:"Y", text:W.Texts["kids_mode"]}]);
				if(W.StbConfig.cugType == "accommodation"){
        			this.couponInfo.hideOption();
    			}
				
				this.setEpisode = function(seriesIndex, isForced){
					if(!isForced && _this.seriesAssetList[seriesIndex]){
						_this.detail.members = [_this.seriesAssetList[seriesIndex]];
						_this.DetailComp.setData(_this.detail, true);
					}else{
						var reqData = {assetId:_this.seriesAssetEpisodes[seriesIndex].assetId, selector:"@detail"};
						_this.sdpDataManager.getDetailAsset(function(result, data){
							var idx = -1;
							for(var j=0; j < _this.seriesAssetEpisodes.length; j++){
								if(data.data[0].assetId == _this.seriesAssetEpisodes[j].assetId){
									idx = j;
									break;
								}
							}
							_this.seriesAssetList[idx] = data.data[0];

							_this.seriesAssetList[idx] = data.data[0];
							_this.detail.members = [_this.seriesAssetList[idx]];
							W.log.info(_this.detail);
							_this.DetailComp.setData(_this.detail);
						}, reqData);
					}

				};

				_this.reqData = {selector:"@detail"};
				if(param.data){
					if(param.data.seriesId){
						_this.reqData.seriesId = param.data.seriesId;
						this.contentType = "series";
					}else if(param.data.sassetId){
						_this.reqData.sassetId = param.data.sassetId;
						this.contentType = "Sasset";
					}else if(param.data.assetId){
						_this.reqData.assetId = param.data.assetId;
						this.contentType = "asset";
					}
				}else{
					if(param.seriesId){
						_this.reqData.seriesId = param.seriesId;
						this.contentType = "series";
					}else if(param.sassetId){
						_this.reqData.sassetId = param.sassetId;
						this.contentType = "Sasset";
					}else if(param.assetId){
						_this.reqData.assetId = param.assetId;
						this.contentType = "asset";
					}else if(param.sourceId){
						_this.reqData.sourceId = param.sourceId;
						this.contentType = "ch";
					}
				}


				this.Recommend = recommendComp.getComp(this._parentDiv._recommend_area, this.contentType);

				if(this.contentType == "Sasset"){
					this.sdpDataManager.getSAssetsDetail(cbDetail, _this.reqData);
				}else if(this.contentType == "asset"){
					this.sdpDataManager.getDetailAsset(cbDetail, _this.reqData);
				}else if(this.contentType == "series"){
					this.sdpDataManager.getSeriesDetail(cbDetail, _this.reqData);
				}else if(this.contentType == "ch"){
					_this.reqData.startTime = (new Date()).toISOString().substr(0,16);
					_this.reqData.duration = 1;
					_this.reqData.includeNotFinished = true;
					this.sdpDataManager.getSchedulesPromoChannel(function(result, data){
						if(data && data.data && data.data.length > 0){
							_this.contentType == "asset";
							var reqData = {selector:"@detail"};
							reqData.assetId = data.data[0].assetId;
							_this.sdpDataManager.getDetailAsset(cbDetail, reqData);
						}else{
							_this.backScene();
						}
					}, _this.reqData);
				}

				this.isDetail = true;

				this.add(this._parentDiv);

				if(param.callback) param.callback();

				this.chanePurchasedAsset = function(type, asset, selectedIndex){//"series", _this.asset, _this.seriesIndex
					if(type == "series"){
						this.setEpisode(selectedIndex, true);
					}else{
						var reqData = {selector:"@detail"};
						reqData.assetId = param.assetId;
						this.contentType = "asset";
						this.sdpDataManager.getDetailAsset(cbDetail, reqData);
					}
				};
			},
			onPause: function() {

			},
			onResume: function(desc) {
				W.log.info(_thisScene + " onResume !!!");
				W.log.info(desc);
				if(desc){
					if(desc.command == "goPurchase"){
						setTimeout(_this.DetailComp.purchaseTrailer, 300);
					}else if(desc.command == "purchaseResult"){
						if(desc.result){
							var asset = desc.asset;
							_this.DetailComp.setButtonIndex(0);
							if(_this.contentType == "Sasset"){
								var temp = {data:[_this.detail]}
								cbDetail(true, temp);
							}else{
								_this.seriesAssetList = [];
								var episodeIdx = _this.DetailComp.getEpisodeIndex();
								_this.setEpisode(episodeIdx, true);
							}

							setTimeout(function(){
								var popup = {
									popupName:"popup/purchase/PurchaseCompletePopup",
									contents:asset ? asset : desc.product,
									childComp:_this
								};
								W.PopupManager.openPopup(popup);
							}, 300);
						}else{
							W.PopupManager.openPopup({
								childComp:_this,
								popupName:"popup/ErrorPopup",
								code:desc.resultData.error.code,
								message:[desc.resultData.error.message],
								from : "SDP"}
							);
						}
					}else if(desc.command == "fromVodPlay"){
               		 	if(this.contentType == "series"){
               		 		_this.DetailComp.changeRecentIcon();
               		 	}
					}
				}
			},
			onRefresh: function(desc) {
				W.log.info(_thisScene + " onRefresh !!!");
				W.log.info(_thisScene + " onRefresh !!!");
	           	 if(desc && desc.command == "cancelPurchase"){
	           		if(this.contentType == "Sasset"){
	            			this.sdpDataManager.getSAssetsDetail(cbDetail, _this.reqData);
	            		}else if(this.contentType == "asset"){
	            			this.sdpDataManager.getDetailAsset(cbDetail, _this.reqData);
	            		}else if(this.contentType == "series"){
	            			this.sdpDataManager.getSeriesDetail(cbDetail, _this.reqData);
	            		}else if(this.contentType == "ch"){
	            			_this.reqData.startTime = (new Date()).toISOString().substr(0,16);
	            			_this.reqData.duration = 1;
	            			_this.reqData.includeNotFinished = true;
	            			this.sdpDataManager.getSchedulesPromoChannel(function(result, data){
	            				if(data && data.data && data.data.length > 0){
	            					_this.contentType == "asset";
	            					var reqData = {selector:"@detail"};
	            					reqData.assetId = data.data[0].assetId;
	            					_this.sdpDataManager.getDetailAsset(cbDetail, reqData);
	            				}else{
	            					_this.backScene();
	            				}
	            			}, _this.reqData);
	            		}
	           	 }
			},
			onDestroy : function() {
				W.log.info(_thisScene + " onDestroy !!!");
			},
			onPopupClosed : function(popup, desc){
				if (desc) {
					if (desc.popupName == "popup/purchase/PurchaseCompletePopup") {
						if (desc.action == W.PopupManager.ACTION_OK) {
							var asset;
							if(_this.contentType == "Sasset"){
								if(desc.contents && desc.contents.assetId){
									asset = desc.contents;
								}else{
									asset = _this.detail.members[0];
								}
							}else{
								var episodeIdx = _this.DetailComp.getEpisodeIndex();
								asset = _this.seriesAssetList[episodeIdx];
							}

							_this.detailModule.playVod(_this, asset);
						}
					}else if (desc.popupName == "popup/player/VodContinuePopup") {
						if (desc.action == W.PopupManager.ACTION_OK) {
							if(desc.idx < 2){
								if(desc.idx == 1){
									desc.desc.prepareInfo.resume.offset = 0;
								}
								var param = {data:desc.desc};
								if(_this.seriesAssetEpisodes && _this.seriesAssetEpisodes.length > 0){
									param.series = _this.seriesAssetEpisodes;
									param.seriesIndex = _this.DetailComp.getEpisodeIndex();
								}
								param.isKidsMode = true;
								W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
							}else{
								if(W.purchaseValue2){
					        		var reqData = {transactionId:W.purchaseValue2.transactionId};
					    			reqData.product = {productId:W.purchaseValue2.product.productId};
					    			reqData.commit = true;
					            	W.CloudManager.sendLog("purchase", "puchase confirm ::dk:: " + W.purchaseValue2.transactionId);
					            	_this.sdpDataManager.buyCommit(function(result, data){
					                	W.CloudManager.sendLog("purchase", "puchase confirm :dk: " + W.purchaseValue2.transactionId + result);
					    				W.purchaseValue2 = undefined;
					    			}, reqData);
					        	}
							}
						}
					}
				}
			},
			onKeyPressed : function(event) {
				if(!isComplete) return;
				W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
				if(event.keyCode == W.KEY.COLOR_KEY_Y){
					this.DetailComp.operate(event);
				}else{
					if(this.isDetail){
						if(event.keyCode == W.KEY.BACK){
							this.backScene();
						}else{
							if(this.DetailComp.operate(event)){
								if(hasRecommend){
									this.Recommend.focus();
									this.isDetail = false;
									this.DetailComp.unFocus();
								}else{
									this.DetailComp.focus();
								}
							}
						}
					}else{
						if(event.keyCode == W.KEY.BACK){
							this.Recommend.unFocus();
							this.isDetail = true;
							this.DetailComp.focus();
						}else{
							if(this.Recommend.operate(event)){
								this.Recommend.unFocus();
								this.isDetail = true;
								this.DetailComp.focus();
							}
						}
					}
				}
			}
		});
	});
