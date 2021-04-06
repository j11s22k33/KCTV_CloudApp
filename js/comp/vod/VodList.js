W.defineModule("comp/vod/VodList", ["mod/Util", "comp/list/PosterList", "comp/list/TextList", "comp/Scroll"], function (util, PosterList, TextList, Scroll) {
    function VodList() {
        var _this;
        var dataManager = W.getModule("manager/SdpDataManager");
        var uipDataManager = W.getModule("manager/UiPlfDataManager");

        var sortingIndex = 0;
        var backCallbackFunc;
        var mode = 0;
        var tops = [475, 255, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var isAddedEntryPath = false;

        var index = 0;
        var _comp;

        var assetsData;
        var bannerData;

        var MODE_TYPE = Object.freeze({LIST: 0, SCROLL: 1});

        var changeY = function () {
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y: tops[mode], opacity: opacity[mode]});
        };
        
        var create = function () {
            if(_comp._posterList) {
                if(_comp._posterList._poster) {
                    _comp.remove(_comp._posterList._poster);
                }

                _comp.remove(_comp._posterList);
                _this.posterList = undefined;
                _comp._posterList = undefined;
            }

            if(_comp._scroll) {
                _comp.remove(_comp._scroll);
                _this._scroll = undefined;
                _comp._scroll = undefined;
            }

            _this.mode = MODE_TYPE.LIST;

            if (!_this.isRecommend && W.StbConfig.vodLookStyle == 2)
                _this.listMode = "text";
            else
                _this.listMode = "poster";

            if (_this.listMode == "text") {
                if(_this.category && _this.category.content && _this.category.content.contentType && _this.category.content.contentType == "rank") {
                    _this.posterList = new TextList({
                        type: TextList.TYPE.RANKING,
                        data: assetsData,
                        //bannerData: bannerData,
                        total: _this.assetDataTotal,
                        isLooping : _this.isLooping,
                        isClearPin : _this.isClearPin,
                        parent: _this
                    });
                } else {
                    _this.posterList = new TextList({
                        type: TextList.TYPE.NORMAL,
                        data: assetsData,
                        //bannerData: bannerData,
                        total: _this.assetDataTotal,
                        isLooping : _this.isLooping,
                        isClearPin : _this.isClearPin,
                        parent: _this
                    });
                }

                _comp._posterList = _this.posterList.getComp();
                _comp._posterList.setStyle({x: 160, y: 113, width: 674, height: 299, overflow: "hidden"});
                _comp.add(_comp._posterList);

                _comp._posterList._poster = _this.posterList.getPosterComp();
                //_comp._posterList._poster.setStyle({x: 910, y: -97});
                _comp.add(_comp._posterList._poster);
            } else {
                if(_this.isRecommend) {
                    _this.posterList = new PosterList({
                        type: PosterList.TYPE.RECOMMEND,
                        data: assetsData,
                        total: assetsData.length,//_this.assetDataTotal,
                        isLooping : _this.isLooping,
                        isClearPin : _this.isClearPin,
                        parent: _this
                    });
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x: 119, y: 134});
                } else {
                    if(_this.category && _this.category.content && _this.category.content.contentType && _this.category.content.contentType == "rank") {
                        _this.posterList = new PosterList({
                            type: PosterList.TYPE.RANKING,
                            data: assetsData,
                            bannerData: bannerData,
                            total: _this.assetDataTotal,
                            isLooping : _this.isLooping,
                            isClearPin : _this.isClearPin,
                            parent: _this
                        });
                    } else {
                        _this.posterList = new PosterList({
                            type: PosterList.TYPE.MOVIE,
                            data: assetsData,
                            bannerData: bannerData,
                            total: _this.assetDataTotal,
                            isLooping : _this.isLooping,
                            isClearPin : _this.isClearPin,
                            parent: _this
                        });
                    }
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x: 119, y: 109});
                }
                _comp.add(_comp._posterList);
            }

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49+5, y: 270, display: mode == 2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }
            //_this.posterList.setActive();

            _this.changeMode(mode);
            _comp.setDisplay("block");
        };
        
        var addPoster = function() {
            _this.posterList.addData(assetsData);
        }

        var unFocus = function () {
        };

        var setFocus = function () {
        };

        var getAssetsData = function (param) {
            //categoryId, offset, limit, resolution, assetGroup, lifetime, assetProduct, sort, orderLock, selector
            var reqData = {
                categoryId: param.categoryId,
                offset: param.offset,
                limit: param.limit,
                resolution: param.resolution,
                assetGroup: param.assetGroup,
                lifetime: param.lifetime,
                assetProduct: param.assetProduct,
                sort: param.sort,
                orderLock: param.orderLock,
                selector: param.selector
            };

            if(_this.type == "series") {
                dataManager.getCategorySeries(cbGetAssetsData, reqData);
            } else if(_this.type == "asset") {
                dataManager.getCategoryAsset(cbGetAssetsData, reqData);
            } else if(_this.type == "sasset"){
                dataManager.getSAssetsCategory(cbGetAssetsData, reqData);
            } else if(_this.type == "rank"){
                reqData.type = reqData.sort;
                reqData.sort = undefined;
                dataManager.getCategoryTopn(cbGetAssetsData, reqData);
            }
        };

        var cbGetAssetsData = function (isSuccess, result) {
            if (isSuccess) {
                _this.tempResult = result;
                assetsData = result.data;

                if(_this.readytoCreate) {
                    continueGetData();
                } else {
                    _this.readytoCreate = true;
                }

               /* if(W.StbConfig.cugType == "accommodation" || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others") {
                    if(_this.assetDataOffset == 0) {
                        _this.assetDataTotal = result.total;
                        _this.assetDataOffset += result.data.length;
                        create();
                    } else {
                        _this.assetDataTotal = result.total;
                        _this.assetDataOffset += result.data.length;
                        addPoster();
                    }
                } else {
                    if(_this.assetDataOffset == 0) {
                        _this.assetDataTotal = result.total;
                        _this.assetDataOffset += result.data.length;
                        create();
                        //W.log.info( _this.assetDataTotal)
                        //getBannerData({targetId: _this.category.baseId, offset: 0, limit: 2});
                    } else {
                        _this.assetDataTotal = result.total;
                        _this.assetDataOffset += result.data.length;
                        addPoster();
                    }
                    //create();
                    //getBannerData({});
                }*/
            } else {

            }
        };

        var getBannerData = function (param) {
            //categoryId, offset, limit, resolution, assetGroup, lifetime, assetProduct, sort, orderLock, selector
            var reqData = {
                targetId: param.targetId,
                offset: param.offset,
                limit: param.limit,
            };
            uipDataManager.getListBannerList(cbGetBannerData, reqData);
        };

        var cbGetBannerData = function (isSuccess, result) {
            if (isSuccess) {
                bannerData = result.data;
            } else {
            }

            /*var limit = 28;
            if(W.StbConfig.vodLookStyle == 1 && bannerData && bannerData.length > 0) {
                if(bannerData[0].bannerSize == 3) {
                    limit = 21;
                } else if(bannerData[0].bannerSize == 2) {
                    limit = 21;
                } else if(bannerData[0].bannerSize == 1) {
                    if(bannerData.length == 1) {
                        limit = 26;
                    } else {
                        limit = 24;
                    }
                }
            }*/

            if(_this.readytoCreate) {
                continueGetData();
            } else {
                _this.readytoCreate = true;
            }
        };

        var continueGetData = function() {
            if(_this.tempResult) {
                if(_this.assetDataOffset == 0) {
                    _this.assetDataTotal = _this.tempResult.total;
                    _this.assetDataOffset += _this.tempResult.data.length;
                    _this.tempResult = undefined;
                    create();
                } else {
                    _this.assetDataTotal = _this.tempResult.total;
                    _this.assetDataOffset += _this.tempResult.data.length;
                    _this.tempResult = undefined;
                    addPoster();
                }
            } else {

            }
        }

        var scrollCallback = function (idx) {
            _this.posterList.setPage(idx);
        };
        
        var getSort = function(){
        	if(_this.type == "rank"){
            	if(sortingIndex == 0){
            		return "daily";
            	}else if(sortingIndex == 1){
            		return "weekly";
            	}
        	}else{
            	if(sortingIndex == 0){
            		return "new";
            	}else if(sortingIndex == 1){
            		return "rank";
            	}else if(sortingIndex == 2){
            		return "nm_asc";
            	}
        	}
        };

        var openSidePopup = function(_data) {
            var data = _data ? _data : _this.posterList.getCurrentData();
            var popupData={options:[]};
            var categoryPath = W.entryPath.getCategoryPath();
            var btnName = _this.category.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];

            W.log.info(data);
            W.log.info(_this.category);

            if(W.StbConfig.cugType != "accommodation"){
                if (data.type != "banner") {
                    popupData.options.push({
                        name: data.title,
                        param:"ZZIM",
                        subOptions: [//
                            {type: "box", name: data.seriesId ? W.Texts["option_popup_add_zzim_series2"] : W.Texts["option_popup_add_zzim"]},
                            {type: "box", name: W.Texts["popup_zzim_move_title"]}
                        ]
                    });
                }

                popupData.options.push({
                    name: categoryPath,
                    param:"BOOKMARK",
                    subOptions: [
                        {type:"box", name:btnName}
                    ]
                });
            }

            if(!_this.isRecommend){
                if(_this.type == "asset" || _this.type == "sasset" || _this.type == "series"){
                    popupData.options.push({
                        name: W.Texts["sorting"],
                        param:"SORTING",
                        subOptions: [
                            {type: "spinner", index: sortingIndex, options: [W.Texts["sorting_option2"], W.Texts["sorting_option1"],
                                W.Texts["sorting_option3"]]}
                        ]
                    });
                }else if(_this.type == "rank"){
                    popupData.options.push({
                        name: W.Texts["sorting"],
                        param:"SORTING",
                        subOptions: [
                            {type: "spinner", index: sortingIndex,
                                options: [W.Texts["sorting_option4"]+" "+W.Texts["sorting_top"], W.Texts["sorting_option5"]+" "+W.Texts["sorting_top"]]}
                        ]
                    });
                }
            }

            popupData.options.push({
                name: undefined,
                param:"SEARCH",
                subOptions: [
                    {type:"box", name:W.Texts["search"]}
                ]
            });

            var popup = {
                popupName: "popup/sideOption/VodSideOptionPopup",
                optionData: popupData,
                childComp: _this
            };
            W.PopupManager.openPopup(popup);
        }

        this.getComp = function (callback) {
            if (callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function () {
            //_comp.setVisible(true);
            W.log.info("VodList show");

            _comp.setDisplay("block");
        };
        this.hide = function () {
            _comp.setDisplay("none");
            W.log.info("VodList hide");
        };
        this.create = function (_parentComp, _parent, _category, isClearPin, _mode, _isRecommend, _isLooping) {
            W.log.info("create !!!!");
            _this = this;
            _this.parentComp = _parentComp;
            _this.parent = _parent;
            _this.isRecommend = _isRecommend;
            _this.category = _category;
            _this.type = "sasset";
            _this.isLooping = _isLooping;
            _this.isClearPin = isClearPin;
            sortingIndex = 1;

            if(_parent && _parent.sceneName && _parent.sceneName == "scene_vod/MovieScene") {
                _this.isJump = true;
            }

            if(_this.category && _this.category.content && _this.category.content.contentType != "sasset") {
                if(_this.category.content.contentType == "asset") {
                    _this.type = "asset";
                } else if(_this.category.content.contentType == "series") {
                    _this.type = "series";
                } else if(_this.category.content.contentType == "rank") {
                    _this.type = "rank";
                    sortingIndex = 0;
                }
            }

            mode = _mode;

            _comp = new W.Div({
                id: "movie_list_area",
                x: 0,
                y: tops[0],
                width: "1280px",
                height: "720px",
                opacity: opacity[0]
            });

            _this.assetDataOffset = 0;
            _this.assetDataTotal = 0;
            _this.readytoCreate = false;

            W.log.info(_this.category)
            if(_isRecommend && _category && _category.resultList && _category.resultList.length > 0) {
                assetsData = _category.resultList;
                _this.readytoCreate = true;
                create();
            } else {
            	if(W.StbConfig.vodLookStyle == 2 || W.StbConfig.cugType == "accommodation"
                    || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others"){
                    _this.readytoCreate = true;
            		getAssetsData({categoryId: _this.category.categoryId, offset: _this.assetDataOffset, limit: W.StbConfig.vodLookStyle == 2 ? 22 : 28, sort:getSort()});
            	}else{
                    getBannerData({targetId: _this.category.baseId, offset: 0, limit: 2});
                    getAssetsData({categoryId: _this.category.categoryId, offset: _this.assetDataOffset, limit: W.StbConfig.vodLookStyle == 2 ? 22 : 28, sort:getSort()});
            	}
            }

            return _comp;
        };
        this.changeMode = function (data) {
            if(data != undefined) mode = data;
            changeY();

            if (mode == 2) {
                if (_this.posterList) _this.posterList.setActive();
                if (_this.scroll) _this.scroll.setActive();

                _this.mode = MODE_TYPE.LIST;
                if(_this.scroll) _this.scroll.unFocus();

                if (_this.listMode == "text") {
                    if (_this.posterList) _this.posterList.setFull(true, 910, 0);
                    //if (_comp._posterList) _comp._posterList.setStyle({height: 549});
                    //_comp._posterList._poster.setStyle({y:0});
                }

                if(_this.type == "rank" && document.getElementById("home_menutree_title")) {
                	var element = undefined;
                	if(document.getElementById("home_menutree_title2")) {
                		element = document.getElementById("home_menutree_title2");
                    }else if(document.getElementById("home_menutree_title")) {
                		element = document.getElementById("home_menutree_title");
                    }
                	W.log.info(element);
                	if(element){
                    	if(_this.isJump) {
                    		element.innerText = 
                                 _this.category.title + " (" + (sortingIndex == 1 ? W.Texts["sorting_option5"] : W.Texts["sorting_option4"]) + ")";
                        } else {
                        	element.innerText =
                                " > " + _this.category.title + " (" + (sortingIndex == 1 ? W.Texts["sorting_option5"] : W.Texts["sorting_option4"]) + ")";
                        }
                	}
                }
            } else {
                if (_this.posterList) _this.posterList.deActive();
                if (_this.scroll) _this.scroll.deActive();

                if (_this.listMode == "text") {
                    if (_this.posterList) _this.posterList.setFull(false, 910, -50);
                    //if (_comp._posterList) _comp._posterList.setStyle({height: 299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
            }
            W.visibleHomeScene();
        };
        this.requestData = function(_offset, _limit) {
            getAssetsData({categoryId: _this.category.categoryId, offset: _offset ? _offset : _this.assetDataOffset, limit: _limit ? _limit : (W.StbConfig.vodLookStyle == 2 ? 22 : 28), sort:getSort()});
        };
        this.hasList = function () {
        };
        this.setScroll = function() {
            if(_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
        }
        this.operate = function (event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if (_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if(_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if (_this.mode == MODE_TYPE.SCROLL) {
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if(_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if (_this.mode == MODE_TYPE.LIST) {
                        if (_this.posterList.operate(event)) {
                            return true;
                        } else {
                            if(_this.scroll) {
                                _this.posterList.deActive();
                                _this.mode = MODE_TYPE.SCROLL;
                                if(_this.scroll) _this.scroll.setFocus();
                            } else {
                                _this.posterList.setActive();
                            }
                            return true;
                        }
                    }
                    break;
                case W.KEY.UP:
                    if (_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.posterList.operate(event);
                        if(_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return returnVal;
                    } else if (_this.mode == MODE_TYPE.SCROLL) {
                        if(_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if (_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if(_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if (_this.mode == MODE_TYPE.SCROLL) {
                        if(_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if (_this.mode == MODE_TYPE.LIST) {
	                    if(_this.posterList.getCurrentData().type && _this.posterList.getCurrentData().type=="banner") {
	                    	W.log.info(_this.posterList.getCurrentData().link);
	                    	isAddedEntryPath = true;
	                        W.LinkManager.action("L", _this.posterList.getCurrentData().link, undefined, "listpromotion");
	                    } else {
	                        var asset = _this.posterList.getCurrentData();
	                        if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && asset.isAdult)
                                || (asset.rating && util.getRating() && asset.rating >= util.getRating()))) {
	                            var popup = {
	                                type:"",
	                                popupName:"popup/AdultCheckPopup",
	                                childComp:_this
	                            };
	                            W.PopupManager.openPopup(popup);
	                        } else {
	                        	if(asset.superAssetId && !asset.sassetId){
	                        		asset.sassetId = asset.superAssetId;
	                        	}
	                            W.SceneManager.startScene({
	                                sceneName: "scene/vod/VodDetailScene",
	                                param: {data: asset, type: "V"},
	                                backState: W.SceneManager.BACK_STATE_KEEPHIDE
	                            });
	                        }
	                    }
                	} else if (_this.mode == MODE_TYPE.SCROLL) {
                		_this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if(_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    /*if(_this.type == "series") {
                        W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type: "S"},
                            backState: W.SceneManager.BACK_STATE_KEEPHIDE
                        });
                    } else if(_this.type == "asset") {
                        W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type: "V"},
                            backState: W.SceneManager.BACK_STATE_KEEPHIDE
                        });
                    } else {
                        W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type: "V"},
                            backState: W.SceneManager.BACK_STATE_KEEPHIDE
                        });
                    }*/
                    break;
                case W.KEY.BACK:
                    _this.posterList.setPage(0, true);
                    if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
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
                    var asset = _this.posterList.getCurrentData();
                    if(!_this.isClearPin && (W.StbConfig.adultMenuUse && asset.isAdult)) {
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            childComp:_this,
                            param : {type:"sideOption"}
                        };
                        W.PopupManager.openPopup(popup);
                    } else {
                       openSidePopup(asset);
                    }
                    break;
            }

        };
        this.destroy = function () {
            W.log.info("destroy !!!!");
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
        this.getMode = function () {
            return mode;
        };
        this.onPopupOpened = function (popup, desc) {
        };
        this.onPopupClosed = function (popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        _this.isClearPin = true;
                        _this.posterList.isClearPin = true;
                        if(_this.posterList && _this.posterList.releaseRestrict) _this.posterList.releaseRestrict();

                        if(desc.param && desc.param.type == "sideOption") {
                            var asset = _this.posterList.getCurrentData();
                            openSidePopup(asset);
                        } else {
                            if(desc.type == "ZZIM"){
                                W.SceneManager.startScene({
                                    sceneName:"scene/home/CategoryListScene",
                                    param:{category:desc.param},
                                    backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            }else{
                                var asset = _this.posterList.getCurrentData();
                                if(asset.superAssetId && !asset.sassetId){
                                    asset.sassetId = asset.superAssetId;
                                }
                                W.SceneManager.startScene({
                                    sceneName: "scene/vod/VodDetailScene",
                                    param: {data: asset, type: "V", isClearPin: true},
                                    backState: W.SceneManager.BACK_STATE_KEEPHIDE
                                });
                            }
                        }
                    }
                } else if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	W.log.info(desc);
                    	if(desc.param.param == "ZZIM"){
                    		if(desc.param.subOptions == 0){
                				var data = _this.posterList.getCurrentData();
                				
                    			if(_this.isRecommend){
                    				if(data.seriesId){
                        				var reqData = {seriesId:data.seriesId, selector:"@detail"};
                            			dataManager.getSeriesDetail(function(result, sdpData){
                            				if(result && sdpData.data.length > 0){
                                				var popup = {
                                    				popupName:"popup/my/ZzimAddPopup",
                                    				param:{data:sdpData.data[0], type:"series"},
                                    				childComp:_this
                                    			};
                                	    		W.PopupManager.openPopup(popup);
                            				}
                    					}, reqData);
                        			}else{
                        				var reqData = {sassetId:data.superAssetId, selector:"@detail"};
                            			dataManager.getSAssetsDetail(function(result, sdpData){
                            				if(result && sdpData.data.length > 0){
                                				var popup = {
                                    				popupName:"popup/my/ZzimAddPopup",
                                    				param:{data:sdpData.data[0], type:"sasset"},
                                    				childComp:_this
                                    			};
                                	    		W.PopupManager.openPopup(popup);
                            				}
                    					}, reqData);
                        			}
                    			}else{
                        			var popup = {
                        				popupName:"popup/my/ZzimAddPopup",
                        				param:{data:data, type:data.seriesId ? "series" : "sasset"},
                        				childComp:this
                        			};
                    	    		W.PopupManager.openPopup(popup);
                    			}
                    		}else{
                    			var reqData = {menuType:"MC0001"};
                                dataManager.getChildMenuTree(function(result, menuData){
                                	if(result && menuData.total > 0){
                                		for(var i=0; i < menuData.data.length; i++){
                                			if(menuData.data[i].categoryCode == "CC0103"){
                                				if(menuData.data[i].isAdultOnly && !_this.isClearPin){
                                					var popup = {
                    	                                type:"ZZIM",
                    	                                param:menuData.data[i],
                    	                                popupName:"popup/AdultCheckPopup",
                    	                                childComp:_this
                    	                            };
                    	                            W.PopupManager.openPopup(popup);
                                				}else{
                                    				W.SceneManager.startScene({
                                    					sceneName:"scene/home/CategoryListScene", 
                                    					param:{category:menuData.data[i]},
                                	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                                				}
                                				break;
                                			}
                                		}
                                	}
                                }, reqData);
                    		}
                    	}else if(desc.param.param == "BOOKMARK"){
                    		if(desc.param.subOptions == 0){
                        		var reqData = {targetId : _this.category.categoryId};
                        		var favoriteFunction;
								if(_this.category.isPinned){
									favoriteFunction = dataManager.removeViewingFavorite;
								}else{
									favoriteFunction = dataManager.addViewingFavorite;
								}
								favoriteFunction(function(result, data, param){
    								W.log.info(data);
    								if(result){
    									W.PopupManager.openPopup({
    			                            childComp:_this,
    			                            type:"2LINE",
    			                            popupName:"popup/FeedbackPopup",
    			                            title:_this.category.title,
    			                            desc:_this.category.isPinned ? W.Texts["bookmark_msg_removed"] : W.Texts["bookmark_msg_added"]}
    			                        );
    									_this.category.isPinned = !_this.category.isPinned;
    								}else{
    									if(data && data.error && data.error.code == "C0501" && !_this.category.isPinned){
    										W.PopupManager.openPopup({
    			                				childComp:_this,
    			                                title:W.Texts["popup_zzim_info_title"],
    			                                popupName:"popup/AlertPopup",
    			                                boldText:W.Texts["bookmark_guide3"],
    			                                thinText:W.Texts["bookmark_guide4"]}
    			        	                );
    									}else{
        									W.PopupManager.openPopup({
    				                            childComp:_this,
    				                            popupName:"popup/ErrorPopup",
    				                            code:data.error.code,
    				        					from : "SDP"}
    				                        );
    									}
    								}
    							}, reqData);
                    		}
                    	}else if(desc.param.param == "SORTING"){
                    		if(sortingIndex == desc.param.value){
                    		}else{
                        		sortingIndex = desc.param.value;

                                _this.assetDataOffset = 0;
                                _this.assetDataTotal = 0;
                                getAssetsData({categoryId: _this.category.categoryId, offset: _this.assetDataOffset, limit: W.StbConfig.vodLookStyle == 2 ? 22 : 28, sort:getSort()});
                        		//다시 조회
                    		}
                    	}else if(desc.param.param == "SEARCH"){
                    		W.SceneManager.startScene({sceneName:"scene/search/SearchScene", 
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}
                    }
                }else if (desc.popupName == "popup/my/ZzimAddPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	W.PopupManager.openPopup({
                            childComp:_this,
                            type:"2LINE",
                            popupName:"popup/FeedbackPopup",
                            title:desc.title,
                            desc:W.Texts["zzim_msg_add"].replace("@title@", desc.listTitle)}
                        );
                    }else{
                    	if(desc.error){
                    		if(desc.error.code == "C0501"){
                    			W.PopupManager.openPopup({
                    				childComp:_this,
                                    title:W.Texts["popup_zzim_info_title"],
                                    popupName:"popup/AlertPopup",
                                    boldText:W.Texts["popup_zzim_move_guide4"],
                                    thinText:W.Texts["popup_zzim_move_guide5"]}
            	                );
                    		}else{
                    			W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/ErrorPopup",
                                    code:desc.error.code,
                					from : "SDP"}
                                );
                    		}
                    	}
                    }
                }
            }
        };
        this.componentName = "VodList";
    }

    return {
        getNewComp: function () {
            return new VodList();
        }
    }

});