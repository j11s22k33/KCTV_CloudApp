W.defineModule("comp/my/WatchedList", ["mod/Util", "comp/list/PosterList", "comp/Scroll", "comp/vod/DetailModule"], function(util, PosterList, Scroll, DetailModule) {
	function WatchedList(){
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
	    var isAddedEntryPath = false;

	    var index = 0;
	    var btnIdx = 0;
	    var _comp;

	    var assetsData;
        var originAssetsData;

	    var hasList;

        var viewingOption = 0;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});
	    //var PLAY_MODE_TYPE = Object.freeze({NORMAL:0, PLAY:1, EDIT:2});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	        if(!hasList && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
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
	        if(!_assetsData || _assetsData.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[mode], display:"-webkit-flex", "-webkit-flex-direction":"column",
	                "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_resent_watched_list"], lineHeight:"22px", className:"cut",
	                "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);

	            _comp.add(_comp._blankMsg);
	            return;
	        } else {
	            hasList = true;
	        }

	        _this.mode = MODE_TYPE.LIST;

	        _this.listMode = "text";

	        //_comp._title = new W.Div({display:"none", x:56,y:52, text:"VOD 시청내역", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"})
	        //_comp.add(_comp._title);

	        _this.posterList = new PosterList({type:PosterList.TYPE.WATCHEDLIST, data:_assetsData,  total: _this.assetDataTotal, parent : _this,
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

            _this.changeMode(mode);
	        //_this.posterList.setActive();
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
            W.Loading.start();
            param.since = util.newISODate(util.newDate()-(15*24*60*60*1000));
            sdpDataManager.getRecentViewing(cbGetAssetsData, param);
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
                _this.tempResult = result;
	            assetsData = result.data;
                W.Loading.stop();
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
	    };

        var addPoster = function() {
            _this.posterList.addData(assetsData);
        }

        var hideAsset = function(_viewingId, param) {
            W.Loading.start();
            sdpDataManager.hideViewing(cbHideAsset, {viewingId : _viewingId}, param);
        };

        var cbHideAsset = function(isSuccess, result) {
            if(isSuccess) {

                W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/FeedbackPopup",
                    title:_this.posterList.getCurrentData().title,
                    desc:W.Texts["popup_feedback_msg2"],
                    type:"2LINE"
                });
                _this.assetDataOffset = 0;
                _this.assetDataTotal = 0;
                getAssetsData({offset: _this.assetDataOffset, limit: 28, filter:getViewing()});
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
	    
	    function nextProcess(viewingData){
	    	isAddedEntryPath = true;
	    	W.entryPath.push("watchedList.assetId", viewingData.asset.assetId, "WatchedList");
	    	if(util.isWatchable(viewingData.asset)){
	    		_this.detailModule.playVod(_this, viewingData.asset);
	    	}else{
              W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
              param:{data:viewingData.asset, type:"V"}});
	    	}
	    };

        function openSidePopup() {
            var popupData = {options:[
                {name:undefined, subOptions : [
                    {type:"box", name:W.Texts["more_detail"]}
                ]},
                {name:W.Texts["option_watch"], subOptions : [
                    {type:"spinner", index:viewingOption, options:[W.Texts["viewing_all"], W.Texts["can_watch"], W.Texts["expired"]]}
                ]},
                {name:undefined, subOptions : [
                    {type:"box", name:W.Texts["delete"]}
                ]}
            ]};
            var popup = {
                popupName:"popup/sideOption/GuideSideOptionPopup",
                optionData:popupData,
                childComp : _this
            };
            W.PopupManager.openPopup(popup);
        }

        var getViewing = function(){
            if(viewingOption == 0){
                return "all";
            }else if(viewingOption == 1){
                return "unexpired";
            }else if(viewingOption == 2){
                return "expired";
            }
        };

	    this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info(this.componentName + " show");

            _comp.setDisplay("block");
        };
        this.hasList = function(){
        	W.log.info("-------------------- " + hasList);
            return hasList;
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
            viewingOption = 0;

            _this.assetDataOffset = 0;
            _this.assetDataTotal = 0;

            getAssetsData({offset: _this.assetDataOffset, limit: 28, filter:getViewing()});

            _comp = new W.Div({id:"watched_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

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
            getAssetsData({offset: _offset ? _offset : _this.assetDataOffset, limit: _limit ? _limit : 28, filter:getViewing()});
        };
        this.setScroll = function() {
            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
        }
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
                    	if(_this.btn){
                            _this.btn[playMode][btnIdx].unFocus();
                            btnIdx = btnIdx-1 < 0 ? _this.btn[playMode].length-1 : btnIdx-1;
                            _this.btn[playMode][btnIdx].setFocus();
                            return true;
                    	}else{
                            return false;
                    	}
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
                    	var viewingData = _this.posterList.getCurrentData();
                    	W.log.info(viewingData);

                        if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && viewingData.asset.isAdult)
                            || (viewingData.asset.rating && util.getRating() && viewingData.asset.rating >= util.getRating()))) {
                            var popup = {
                                type:"",
                                popupName:"popup/AdultCheckPopup",
                                param:{isDetail:false},
                                childComp:_this
                            };
                            W.PopupManager.openPopup(popup);
                        } else {
                            if(viewingData.hasDetail){
                                nextProcess(viewingData);
                            }else{
                                var reqData = {selector:"@detail", assetId:viewingData.assetId};
                                sdpDataManager.getDetailAsset(function(isSuccess, result){
                                    if(isSuccess && result && result.data){
                                        viewingData.asset = result.data[0];
                                        viewingData.hasDetail = true;
                                        nextProcess(viewingData);
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
                    var viewingData = _this.posterList.getCurrentData();
                    if(!_this.isClearPin && (W.StbConfig.adultMenuUse && viewingData.asset.isAdult)) {
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
        this.componentName = "WatchedList";
        this.onPopupClosed = function (popup, desc) {
            W.log.info("onPopupClosed ");
            W.log.info(popup, desc);
            if (desc.popupName == "popup/AdultCheckPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    _this.isClearPin = true;
                    _this.posterList.isClearPin = true;
                    if(_this.posterList && _this.posterList.releaseRestrict) _this.posterList.releaseRestrict();

                    var viewingData = _this.posterList.getCurrentData();
                    W.log.info(viewingData);

                    if(desc.param.type == "sideOption") {
                        openSidePopup();
                    } else {
                        if(desc.param && desc.param.isDetail) {
                            isAddedEntryPath = true;
                            W.entryPath.push("watchedList.assetId", viewingData.asset.assetId, "WatchedList");
                            W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                param:{data:viewingData, type:"V"}});
                        } else {
                            if(viewingData.hasDetail){
                                nextProcess(viewingData);
                            }else{
                                var reqData = {selector:"@detail", assetId:viewingData.assetId};
                                sdpDataManager.getDetailAsset(function(isSuccess, result){
                                    if(isSuccess && result && result.data){
                                        viewingData.asset = result.data[0];
                                        viewingData.hasDetail = true;
                                        nextProcess(viewingData);
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
                }
            } else if (desc && desc.popupName == "popup/sideOption/GuideSideOptionPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    if (desc.param.option == 0) {
                        var viewingData = _this.posterList.getCurrentData();
                        if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && viewingData.asset.isAdult)
                            || (viewingData.asset.rating && util.getRating() && viewingData.asset.rating >= util.getRating()))) {
                            var popup = {
                                type:"",
                                popupName:"popup/AdultCheckPopup",
                                param:{isDetail:true},
                                childComp:_this
                            };
                            W.PopupManager.openPopup(popup);
                        } else {
                            isAddedEntryPath = true;
                            W.entryPath.push("watchedList.assetId", viewingData.asset.assetId, "WatchedList");
                            W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                param:{data:viewingData, type:"V"}});
                        }
                    } else if (desc.param.option == 1) {
                        //if (desc.param.subOptions == 0) {
                        /*if (desc.param.value == 0) {
                            viewingOption = 0;
                            //assetsData = [];
                            //for(var i = 0; i < originAssetsData.length; i++) {
                            //    if(originAssetsData[i].asset.rentalPeriod && originAssetsData[i].asset.rentalPeriod.value > 0) {
                            //        assetsData.push(originAssetsData[i]);
                            //    }
                            //}
                            create(assetsData);
                        } else if (desc.param.value == 1) {
                            viewingOption = 1;
                            //assetsData = [];
                            //for(var i = 0; i < originAssetsData.length; i++) {
                            //    if(originAssetsData[i].asset.rentalPeriod && originAssetsData[i].asset.rentalPeriod.value > 0) {
                            //    } else {
                            //        assetsData.push(originAssetsData[i]);
                            //    }
                            //}
                            create(assetsData);
                        } else if (desc.param.value == 2) {
                            viewingOption = 2;
                            //assetsData = JSON.parse(JSON.stringify(originAssetsData));
                            //create(assetsData);
                        }*/

                        if(viewingOption == desc.param.value){
                        }else{
                            viewingOption = desc.param.value;

                            _this.assetDataOffset = 0;
                            _this.assetDataTotal = 0;
                            getAssetsData({offset: _this.assetDataOffset, limit: 28, filter:getViewing()});
                            //다시 조회
                        }
                        //}
                    } else if (desc.param.option == 2) {
                        hideAsset(_this.posterList.getCurrentData().viewingId);
                    }
                }
            }else if (desc && desc.popupName == "popup/player/VodContinuePopup") {
            	_this.detailModule.onPopupClosed(_this, desc);
            }
        };
	}
    
	return {
		getNewComp : function(){
			return new WatchedList();
		}
	}
});