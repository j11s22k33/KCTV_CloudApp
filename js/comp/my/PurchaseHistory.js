W.defineModule("comp/my/PurchaseHistory", ["mod/Util", "comp/list/PosterList", "comp/Scroll", "comp/vod/DetailModule", "manager/ProductProcessManager"], 
		function(util, PosterList, Scroll, DetailModule, ProductProcessManager) {
	function PurchaseHistory(){
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var playMode = 0;
	    var tops = [465, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var blankHeight = [120, 310, 550];
	    var contentsType = 0;
	    var isAddedEntryPath = false;

	    var index = 0;
	    var btnIdx = 0;
	    var _comp;

	    var assetsData;
        var originAssetsData;

	    var hasList;

        var viewingOption = 0;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});
	    var CONTENTS_TYPE = Object.freeze({SINGLE:0, PACKAGE:1, LIFETIME:2});
	    //var PLAY_MODE_TYPE = Object.freeze({NORMAL:0, PLAY:1, EDIT:2});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        if(mode == 0.8){
	    		W.Util.setStyle(_comp, {y:tops[1]+40, opacity : opacity[1]});
                if(!hasList && _comp && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[1]});
	        }else{
	            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
                if(!hasList && _comp && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
	        }
	    };

	    var create = function(_assetsData, bannerData){
            if(_comp._posterList) {
                _comp.remove(_comp._posterList);
                _comp._posterList = undefined;
            }
            if(_comp._scroll) {
                _comp.remove(_comp._scroll);
                _comp._scroll = undefined;
            }
            if(_comp._blankMsg) {
                _comp.remove(_comp._blankMsg);
                _comp._blankMsg = undefined;
            }

	        _this.mode = MODE_TYPE.LIST;

	        var _title, _blankMsg;
	        if(contentsType == CONTENTS_TYPE.PACKAGE) {
	            _title = W.Texts["purchase_history_package"];
	            _blankMsg = W.Texts["no_purchased_list"];
	        } else if(contentsType == CONTENTS_TYPE.LIFETIME) {
	            _title = W.Texts["purchase_history_lifetime"];
	            _blankMsg = W.Texts["no_purchased_list"];
	        } else {
	            _title = W.Texts["purchase_history_single"];
	            _blankMsg = W.Texts["no_purchased_list"];
	        }

            W.log.info(_assetsData)
	        if(!_assetsData || _assetsData.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[(mode == 0.8 ? 1 : mode)], display:"-webkit-flex", "-webkit-flex-direction":"column",
	                "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:_blankMsg, lineHeight:"22px", className:"cut",
	                "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);

	            _comp.add(_comp._blankMsg);
	            return;
	        } else {
	            hasList = true;
	        }

	        _this.listMode = "text";

	        try{
	            _this.posterList = new PosterList({type:PosterList.TYPE.PURCHASE, data:_assetsData, total : _this.assetDataTotal, parent : _this,
                    isClearPin : _this.isClearPin});
	            _comp._posterList = _this.posterList.getComp();
	            _comp._posterList.setStyle({x:119, y:109});
	            _comp.add(_comp._posterList);

                if(_this.posterList.getTotalPage() > 1) {
                    _this.scroll = new Scroll();
                    _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                    _comp._scroll.setStyle({x: 49+5, y: 270, display: mode == 2 ? "block" : "none"});
                    _comp.add(_comp._scroll);
                } else {
                    _this.scroll = undefined;
                }
	        }catch(ex){
	        	W.log.info(ex);
	        }

	        //_this.posterList.setActive();
            _this.changeMode(mode);
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
            W.Loading.start();
            if(contentsType == CONTENTS_TYPE.SINGLE) {
                sdpDataManager.getPurchaseHistory(cbGetAssetsData, 
                    {since:util.newISODate(util.newDate()-(60*24*60*60*1000)), until:util.newISODate(), offset:param.offset, limit:param.limit, packType : "rvod",
                    filter : viewingOption == 2 ? undefined : getViewing(), deviceType : viewingOption == 2 ? getViewing() : undefined});
            } else if(contentsType == CONTENTS_TYPE.PACKAGE) {
                sdpDataManager.getPurchaseHistory(cbGetAssetsData, 
                    {since:util.newISODate(util.newDate()-(60*24*60*60*1000)), until:util.newISODate(), offset:param.offset, limit:param.limit, packType : "package",
                        filter : viewingOption == 2 ? undefined : getViewing(), deviceType : viewingOption == 2 ? getViewing() : undefined});
            } else if(contentsType == CONTENTS_TYPE.LIFETIME) {
                sdpDataManager.getLifetimesList(cbGetAssetsData, {offset:param.offset, limit:param.limit,
                    filter : viewingOption == 2 ? undefined : getViewing(), deviceType : viewingOption == 2 ? getViewing() : undefined});
            }
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
                //assetsData = [];
                _this.tempResult = result;
                assetsData = result.data;

                if(contentsType == CONTENTS_TYPE.LIFETIME) {
                    for(var i in assetsData) {
                        assetsData[i].expiresAt = "9999-12-31T23:59:59";
                    }
                }

                if(viewingOption == 3) {
                    originAssetsData = JSON.parse(JSON.stringify(result.data));
                }
                /*if(contentsType == CONTENTS_TYPE.SINGLE) {  //packageType=RV
                    for(var i in result.data) {
                        if(result.data[i].packageType == "RV") {
                            assetsData.push(result.data[i]);
                        }
                    }
                } else if(contentsType == CONTENTS_TYPE.PACKAGE) {
                    for(var i in result.data) {
                        if(result.data[i].packageType != "RV") {
                            assetsData.push(result.data[i]);
                        }
                    }
                } else if(contentsType == CONTENTS_TYPE.LIFETIME) {
                    assetsData = result.data;
                }*/
                
                
                if(contentsType == CONTENTS_TYPE.PACKAGE) {
                    
                    if(result && result.data && result.data.length > 0){
                    	var prodIds = "";
                    	for(var i=0; i < result.data.length; i++){
                    		prodIds += (i > 0 ? "," : "") + result.data[i].product.productId;
                    	}
                    	sdpDataManager.getProductDetail(function(isSuccess2, result2){
                    		if(isSuccess2){
                    			for(var i=0; i < result.data.length; i++){
                    				for(var j=0; j < result2.data.length; j++){
                    					if(result.data[i].product.productId == result2.data[j].productId){
                    						result.data[i].product.images = result2.data[j].images;
                    						result.data[i].product.posterUrl = result2.data[j].posterUrl;
                    						break;
                    					}
                    				}
                            	}
                    			
                    			if(_this.assetDataOffset == 0) {
                                    _this.assetDataTotal = _this.tempResult.total;
                                    _this.assetDataOffset += _this.tempResult.data.length;
                                    _this.tempResult = undefined;
                                    create(assetsData);
                                } else {
                                    _this.assetDataTotal = _this.tempResult.total;
                                    _this.assetDataOffset += _this.tempResult.data.length;
                                    _this.tempResult = undefined;
                                    addPoster();
                                }
                    		} else {
                                if(_this.assetDataOffset == 0) {
                                    _this.assetDataTotal = _this.tempResult.total;
                                    _this.assetDataOffset += _this.tempResult.data.length;
                                    _this.tempResult = undefined;
                                    create(assetsData);
                                } else {
                                    _this.assetDataTotal = _this.tempResult.total;
                                    _this.assetDataOffset += _this.tempResult.data.length;
                                    _this.tempResult = undefined;
                                    addPoster();
                                }
                            }
                            W.Loading.stop();
                    	}, {productId:prodIds});
                    } else {
                        if(_this.assetDataOffset == 0) {
                            _this.assetDataTotal = _this.tempResult.total;
                            _this.assetDataOffset += _this.tempResult.data.length;
                            _this.tempResult = undefined;
                            create(assetsData);
                        } else {
                            _this.assetDataTotal = _this.tempResult.total;
                            _this.assetDataOffset += _this.tempResult.data.length;
                            _this.tempResult = undefined;
                            addPoster();
                        }

                        W.Loading.stop();
                    }
                }else{
                	if(_this.assetDataOffset == 0) {
                        _this.assetDataTotal = _this.tempResult.total;
                        _this.assetDataOffset += _this.tempResult.data.length;
                        _this.tempResult = undefined;
                        create(assetsData);
                    } else {
                        _this.assetDataTotal = _this.tempResult.total;
                        _this.assetDataOffset += _this.tempResult.data.length;
                        _this.tempResult = undefined;
                        addPoster();
                    }

                    W.Loading.stop();
                }
	        } else {
                W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/ErrorPopup",
                    code: (result && result.error && result.error.code) ? result.error.code : null,
                    message : (result && result.error && result.error.message) ? [result.error.message] : null,
					from : "SDP"
                });
	        }
	    };

        var addPoster = function() {
            _this.posterList.addData(assetsData);
        }

        var hideAsset = function(_purchaseId, param) {
            W.Loading.start();
            sdpDataManager.hidePurchaseHistory(cbHideAsset, {purchaseId : _purchaseId}, param);
        };

        var cbHideAsset = function(isSuccess, result) {
            if(isSuccess) {
            	var title = "";
            	if(_this.posterList.getCurrentData().asset){
            		title = _this.posterList.getCurrentData().asset.title;
            	}else{
            		if(_this.posterList.getCurrentData().product){
                		title = _this.posterList.getCurrentData().product.title;
                	}
            	}
                W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/FeedbackPopup",
                    title:title,
                    desc:W.Texts["popup_feedback_msg3"],
                    type:"2LINE"
                });
                _this.assetDataOffset = 0;
                _this.assetDataTotal = 0;
                getAssetsData({offset: _this.assetDataOffset, limit: 28});
            } else {
                W.Loading.stop();
                W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/ErrorPopup",
                    code: (result && result.error && result.error.code) ? result.error.code : null,
                    message : (result && result.error && result.error.message) ? [result.error.message] : null,
					from : "SDP"
                });
            }
        };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };

        var getViewing = function(){
            if(viewingOption == 0){
                return "all";
            }else if(viewingOption == 1){
                return "unexpired";
            }else if(viewingOption == 2){
                return "cpa";
            }else if(viewingOption == 3){
                return "expired";
            }
        };

        var openSidePopup = function() {
            var popupData = {options:[
                {name:undefined, param:"MORE_DETAIL", subOptions : [
                    {type:"box", name:W.Texts["more_detail"]}
                ]}
            ]};

            if(contentsType == CONTENTS_TYPE.SINGLE || contentsType == CONTENTS_TYPE.PACKAGE) {
                popupData.options.push(
                    {name:undefined, param:"MORE_POPUP", subOptions : [
                        {type:"box", name:W.Texts["more_detail3"]}
                    ]});
            }

            if(contentsType == CONTENTS_TYPE.LIFETIME) {
                popupData.options.push(
                    {name:W.Texts["option_watch"], param:"OPTION_WATCH", subOptions : [
                        {type:"spinner", index:viewingOption, options:[W.Texts["viewing_all"], W.Texts["purchase_mobile"]]}
                    ]});
                popupData.options.push(
                        {name:undefined, param:"DELETE", subOptions : [
                            {type:"box", name:W.Texts["delete"]}
                        ]});
            } else {
                popupData.options.push(
                    {name:W.Texts["option_watch"], param:"OPTION_WATCH", subOptions : [
                        {type:"spinner", index:viewingOption, options:[W.Texts["viewing_all"], W.Texts["can_watch"], W.Texts["purchase_mobile"], W.Texts["expired"]]}
                    ]});
                popupData.options.push(
                    {name:undefined, param:"DELETE", subOptions : [
                        {type:"box", name:W.Texts["delete"]}
                    ]});
            }
            var popup = {
                popupName:"popup/sideOption/GuideSideOptionPopup",
                optionData:popupData,
                childComp : _this
            };
            W.PopupManager.openPopup(popup);
        }


        this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info(this.componentName + " show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info(this.componentName + " hide");
        };
        this.create = function(callback, _parent, _param) {
            W.log.info(this.componentName + " create !!!!");
            backCallbackFunc = callback;
            _this = this;
            _this.detailModule = DetailModule.getNewComp(_this);

            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;
            _this.isClearPin = _param.isClearPin;

            if(_this.param.categoryCode && _this.param.categoryCode == "CC0106") {
                contentsType = CONTENTS_TYPE.SINGLE;
            } else if(_this.param.categoryCode && _this.param.categoryCode == "CC0107") {
                contentsType = CONTENTS_TYPE.SINGLE;
            } else if(_this.param.categoryCode && _this.param.categoryCode == "CC0108") {
                contentsType = CONTENTS_TYPE.PACKAGE;
            } else {
                contentsType = CONTENTS_TYPE.LIFETIME;
            }
            _this.assetDataOffset = 0;
            _this.assetDataTotal = 0;
            getAssetsData({offset: _this.assetDataOffset, limit: 28});

            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.posterList) _this.posterList.setActive();
                if(_this.scroll) _this.scroll.setActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:549});
                    //_comp._posterList._poster.setStyle({y:0});
                }

                if(_comp._title) _comp._title.setStyle({display:"block"});
            } else {
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
                if(_comp._title) _comp._title.setStyle({display:"none"});
            }
            
            W.visibleHomeScene();
        };
        this.requestData = function(_offset, _limit) {
            getAssetsData({offset: _offset ? _offset : _this.assetDataOffset, limit: _limit ? _limit : 28});
        };
        this.hasList = function(){
            return hasList;
        };
        this.setScroll = function() {
            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                        if(_this.posterList.operate(event)) {
                            _this.posterList.getPageIdx();
                            return true;
                        }
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                        if(_this.posterList.operate(event)) {
                            return true;
                        } else {
                            if (_this.scroll) {
                                _this.posterList.deActive();
                                _this.mode = MODE_TYPE.SCROLL;
                                if (_this.scroll) _this.scroll.setFocus();
                            } else {
                                _this.posterList.setActive();
                            }
                            return true;
                        }
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        btnIdx = btnIdx-1 < 0 ? _this.btn[playMode].length-1 : btnIdx-1;
                        _this.btn[playMode][btnIdx].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                        _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        btnIdx = btnIdx+1 > _this.btn[playMode].length-1 ? 0 : btnIdx+1;
                        _this.btn[playMode][btnIdx].setFocus();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                		if(contentsType == CONTENTS_TYPE.PACKAGE) {
                			if(this.posterList.getCurrentData().product.productType == "VDCTDT"){
                				var reqData = {productId:this.posterList.getCurrentData().product.productId};
                				sdpDataManager.getProductDetail(function(result, data){
                    				var productProcessManager = ProductProcessManager.getManager();
                    				productProcessManager.process(data.data[0]);
                	    		}, reqData);
                			}else if(this.posterList.getCurrentData().product.productType == "CHNMDT"){
                				var reqData = {productId:this.posterList.getCurrentData().product.productId};
                				sdpDataManager.getProductDetail(function(result, data){
                    				W.CloudManager.changeChannel(function(){
            							W.log.info("Channel Changed !! " + data.data[0].configuration.channels[0].sourceId);
            						}, data.data[0].configuration.channels[0].sourceId);
                	    		}, reqData);
                			}else{
                    			isAddedEntryPath = true;
                        		W.entryPath.push("purchaseHistory.productId", this.posterList.getCurrentData().product.productId, "PurchaseHistory");
                                W.SceneManager.startScene({
                					sceneName:"scene/vod/VodPackageScene", 
                    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                    				param:{
                    					product: _this.posterList.getCurrentData().product,
                    					asset: _this.posterList.getCurrentData().asset
                    				}
                    			});
                			}
                		}else{
                			var asset = _this.posterList.getCurrentData().asset;

                            if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && asset.isAdult)
                                || (asset.rating && util.getRating() && asset.rating >= util.getRating()))) {
                                var popup = {
                                    type:"",
                                    popupName:"popup/AdultCheckPopup",
                                    param:{isDetail:false},
                                    childComp:_this
                                };
                                W.PopupManager.openPopup(popup);
                            } else {
                                var reqData = {selector:"@detail", assetId:asset.assetId};
                                sdpDataManager.getDetailAsset(function(isSuccess, result){
                                    if(isSuccess && result && result.data){
                                        asset = result.data[0];
                                        isAddedEntryPath = true;
                                        W.entryPath.push("purchaseHistory.assetId", asset.assetId, "PurchaseHistory");

                                        if(util.isWatchable(asset)){
                                            _this.detailModule.playVod(_this, asset);
                                        }else{
                                            W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                                param:{data:{assetId:asset.assetId}, type:"V"}});
                                        }
                                    } else {
                                        W.PopupManager.openPopup({
                                            childComp:_this,
                                            popupName:"popup/ErrorPopup",
                                            code: (result && result.error && result.error.code) ? result.error.code : "9999",
                                            message : (result && result.error && result.error.message) ? [result.error.message] : null,
                        					from : "SDP"
                                        });
                                    }
                                }, reqData);
                            }
                		}
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.BACK:
                    if(_this.posterList) _this.posterList.setPage(0, true);
                    if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                    return false;
                    break;
                case W.KEY.EXIT:
                    break;
                case W.KEY.MENU:
                case W.KEY.HOME:
                    break;
                case W.KEY.NUM_0:
                case W.KEY.NUM_1:
                case W.KEY.NUM_2:
                case W.KEY.NUM_3:
                case W.KEY.NUM_4:
                case W.KEY.NUM_5:
                case W.KEY.NUM_6:
                case W.KEY.NUM_7:
                case W.KEY.NUM_8:
                case W.KEY.NUM_9: 
                    break;
                case W.KEY.COLOR_KEY_Y:
                    if(!_this.posterList) return;
                    var asset = _this.posterList.getCurrentData().asset;

                    if(!_this.isClearPin && (W.StbConfig.adultMenuUse && asset.isAdult)) {
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            param:{isDetail:false, type:"sideOption"},
                            childComp:_this
                        };
                        W.PopupManager.openPopup(popup);
                    } else {
                        openSidePopup();
                    }
                    break;
            }

        };
        this.destroy = function() {
            W.log.info(this.componentName + " destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.resume = function(){
        	W.log.info("destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "PurchaseHistory";
        this.onPopupClosed = function (popup, desc) {
            W.log.info("onPopupClosed ");
            W.log.info(popup, desc);
            if (desc.popupName == "popup/AdultCheckPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    _this.isClearPin = true;
                    _this.posterList.isClearPin = true;
                    if(_this.posterList && _this.posterList.releaseRestrict) _this.posterList.releaseRestrict();

                    var asset = _this.posterList.getCurrentData().asset;

                    if(desc.param.type == "sideOption") {
                        openSidePopup();
                    } else {
                        if(desc.param && desc.param.isDetail) {
                            isAddedEntryPath = true;
                            W.entryPath.push("purchaseHistory.assetId", asset.assetId, "PurchaseHistory");
                            W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                param:{data:{assetId:asset.assetId}, type:"V"}});
                        } else {
                            var reqData = {selector:"@detail", assetId:asset.assetId};
                            sdpDataManager.getDetailAsset(function(isSuccess, result){
                                if(isSuccess && result && result.data){
                                    asset = result.data[0];
                                    isAddedEntryPath = true;
                                    W.entryPath.push("purchaseHistory.assetId", asset.assetId, "PurchaseHistory");

                                    if(util.isWatchable(asset)){
                                        _this.detailModule.playVod(_this, asset);
                                    }else{
                                        W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                            param:{data:{assetId:asset.assetId}, type:"V"}});
                                    }
                                } else {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/ErrorPopup",
                                        code: (result && result.error && result.error.code) ? result.error.code : "9999",
                                        message : (result && result.error && result.error.message) ? [result.error.message] : null,
                    					from : "SDP"
                                    });
                                }
                            }, reqData);
                        }
                    }
                }
            } else if (desc && desc.popupName == "popup/sideOption/GuideSideOptionPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    if (desc.param.param == "MORE_DETAIL") {
                        if(contentsType == CONTENTS_TYPE.PACKAGE) {
                            isAddedEntryPath = true;
                            W.entryPath.push("purchaseHistory.productId", this.posterList.getCurrentData().product.productId, "PurchaseHistory");
                            W.SceneManager.startScene({
                                sceneName:"scene/vod/VodPackageScene",
                                backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                                param:{
                                    product: _this.posterList.getCurrentData().product,
                                    asset: _this.posterList.getCurrentData().asset
                                }
                            });
                        }else{
                            var asset = _this.posterList.getCurrentData().asset;
                            if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && asset.isAdult)
                                || (asset.rating && util.getRating() && asset.rating >= util.getRating()))) {
                                var popup = {
                                    type:"",
                                    popupName:"popup/AdultCheckPopup",
                                    param:{isDetail:true},
                                    childComp:_this
                                };
                                W.PopupManager.openPopup(popup);
                            } else {
                                isAddedEntryPath = true;
                                W.entryPath.push("purchaseHistory.assetId", asset.assetId, "PurchaseHistory");
                                W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                    param:{data:{assetId:asset.assetId}, type:"V"}});
                            }
                        }
                    }else if (desc.param.param == "MORE_POPUP") {
                    	var data = _this.posterList.getCurrentData();
                    	
                    	var popup = {
							childComp:_this,
							popupName:"popup/my/PurchaseInfoPopup",
							data:data
						};
                    	W.PopupManager.openPopup(popup);
                    	
//                        if(contentsType == CONTENTS_TYPE.PACKAGE) {
//                            isAddedEntryPath = true;
//                            W.entryPath.push("purchaseHistory.productId", this.posterList.getCurrentData().product.productId, "PurchaseHistory");
//                            W.SceneManager.startScene({
//                                sceneName:"scene/vod/VodPackageScene",
//                                backState:W.SceneManager.BACK_STATE_KEEPHIDE,
//                                param:{
//                                    product: _this.posterList.getCurrentData().product,
//                                    asset: _this.posterList.getCurrentData().asset
//                                }
//                            });
//                        }else{
//                            var asset = _this.posterList.getCurrentData().asset;
//                            if(!_this.isClearPin && asset.rating && util.getRating() && asset.rating >= util.getRating()) {
//                                var popup = {
//                                    type:"",
//                                    popupName:"popup/AdultCheckPopup",
//                                    param:{isDetail:true},
//                                    childComp:_this
//                                };
//                                W.PopupManager.openPopup(popup);
//                            } else {
//                                isAddedEntryPath = true;
//                                W.entryPath.push("purchaseHistory.assetId", asset.assetId, "PurchaseHistory");
//                                W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
//                                    param:{data:asset, type:"V"}});
//                            }
//                        }
                    } else if (desc.param.param == "OPTION_WATCH") {
                        //if (desc.param.subOptions == 0) {
                        /*if (desc.param.value == 0) {
                            viewingOption = 0;
                            assetsData = [];
                            for(var i = 0; i < originAssetsData.length; i++) {
                                if(originAssetsData[i].asset.rentalPeriod && originAssetsData[i].asset.rentalPeriod.value > 0) {
                                    assetsData.push(originAssetsData[i]);
                                }
                            }
                            create(assetsData);
                        } else if (desc.param.value == 1) {
                            viewingOption = 1;
                            assetsData = [];
                            for(var i = 0; i < originAssetsData.length; i++) {
                                if(originAssetsData[i].asset.rentalPeriod && originAssetsData[i].asset.rentalPeriod.value > 0) {
                                } else {
                                    assetsData.push(originAssetsData[i]);
                                }
                            }
                            create(assetsData);
                        } else if (desc.param.value == 2) {
                            viewingOption = 2;
                            assetsData = JSON.parse(JSON.stringify(originAssetsData));
                            create(assetsData);
                        }*/
                        //}
                        if(viewingOption == desc.param.value){
                        }else{
                            viewingOption = desc.param.value;

                            _this.assetDataOffset = 0;
                            _this.assetDataTotal = 0;
                            getAssetsData({offset: _this.assetDataOffset, limit: 28, filter:getViewing()});
                            //다시 조회
                        }
                    } else if (desc.param.param == "DELETE") {
                        hideAsset(_this.posterList.getCurrentData().purchaseId);
                    }
                }
            }else if (desc && desc.popupName == "popup/player/VodContinuePopup") {
            	_this.detailModule.onPopupClosed(_this, desc);
            } else if (desc.popupName == "popup/purchase/CategorySelectPopup") {
				if (desc.action == W.PopupManager.ACTION_OK) {
					goCategory(desc.category);
				}
			}
        };
        
        function goCategory(category){
        	W.log.info(category);
        	sdpDataManager.getMenuDetail(function(result, data){
        		if(result && data.data){
        			if(data.data[0].isLeaf){
                		W.SceneManager.startScene({
            				sceneName:"scene/vod/MovieScene", 
            				param:{category:data.data[0]},
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                	}else{
                		W.SceneManager.startScene({
        				sceneName:"scene/home/CategoryListScene", 
        				param:{category:data.data[0]},
        				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                	}
        		}
        	}, {categoryId:category.categoryId});
        };
	}
    
	return {
		getNewComp : function(){
			return new PurchaseHistory();
		}
	}
});