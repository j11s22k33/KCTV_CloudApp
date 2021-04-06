W.defineModule(["mod/Util", "comp/kids/CircleList", "comp/kids/PosterList", "comp/kids/KeywordList", "comp/kids/Scroll"], function(util, CircleList, PosterList, KeywordList, Scroll) {
    function KidsList() {
        var _this;
        var sdpDataManager = W.getModule("manager/SdpDataManager");
        var uipDataManager = W.getModule("manager/UiPlfDataManager");
        var recoDataManager = W.getModule("manager/RecommendDataManager");

        var sortingIndex = 0;
        var backCallbackFunc;
        var mode = 0;
        var tops = [0, 0, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];

        var index = 0;
        var _comp;

        var assetsData, bannerData;

        var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        var create = function(assetsData, bannerData){
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
            
            _comp._top = new W.Div({x:55, y:51, width:"670px", height:"30px", className:"cut"});
    		_comp.add(_comp._top);
    		var titles = W.entryPath.getCategoryPath().split(">");
    		for(var i=0; i < titles.length; i++){
				if(i == titles.length - 1){
					_comp._top.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
						"font-size":"27px", className:"font_rixhead_medium", text:"> " + titles[i]}));
				}else if(i == 0){
					_comp._top.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgba(255,255,255,0.5)", 
						"font-size":"27px", className:"font_rixhead_medium", text:titles[i] + " "}));
				}else{
					_comp._top.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgba(255,255,255,0.5)", 
						"font-size":"27px", className:"font_rixhead_medium", text:"> " + titles[i] + " "}));
				}
			}

            /*if(assetsData.type == 0) {

            } else if(assetsData.type == 4) {
                _this.posterList = new CircleList({type:CircleList.TYPE.CHANNEL, data:assetsData.children, bannerData:bannerData});
                _comp._posterList = _this.posterList.getComp();
                _comp._posterList.setStyle({x:129, y:134});
                _comp.add(_comp._posterList);
            } else if(assetsData.type == 5) {
                console.log(assetsData)

            } else {*/

            /* else if(assetsData.categoryCode == "CC0404") {
             _this.posterList = new PosterList({type:PosterList.TYPE.MOVIE, data:assetsData.children, bannerData:bannerData, isLooping:true});
             _comp._posterList = _this.posterList.getComp();
             _comp._posterList.setStyle({x:145, y:110});
             _comp.add(_comp._posterList);
             } */

            if(_this.param.category && _this.param.category.isLeaf){
                if(_this.param.category.categoryCode == "CC0401") {
                    _this.posterList = new CircleList({type:CircleList.TYPE.CHARACTER, data:assetsData, bannerData:bannerData,
                        isLooping:true, parent: _this});
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x:129, y:134});
                    _comp.add(_comp._posterList);
                } else if(_this.param.category.categoryCode == "CC0402") {
                    _this.posterList = new PosterList({type:PosterList.TYPE.PURCHASE, data:assetsData, bannerData:bannerData,
                        isLooping:true, total: assetsData.length/*_this.assetDataTotal*/, parent: _this});
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x:145, y:110});
                    _comp.add(_comp._posterList);
                } else if(_this.param.category.categoryCode == "CC0405") {
                    _this.posterList = new CircleList({type:CircleList.TYPE.CHANNEL, data:assetsData, bannerData:bannerData,
                        isLooping:true, parent: _this});
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x:129, y:134});
                    _comp.add(_comp._posterList);
                } else {
                    _this.posterList = new PosterList({type:PosterList.TYPE.MOVIE, data:assetsData, bannerData:bannerData,
                        isLooping:true, total: _this.assetDataTotal, parent: _this});
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x:145, y:110});
                    _comp.add(_comp._posterList);
                }
            } else {
                if(_this.param.category.categoryCode == "CC0401") {
                    _this.posterList = new CircleList({type:CircleList.TYPE.CHARACTER, data:assetsData, bannerData:bannerData,
                        isLooping:true, parent: _this});
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x:129, y:134});
                    _comp.add(_comp._posterList);
                } else {
                    _this.posterList = new KeywordList({type:KeywordList.TYPE.MENU, data:assetsData, bannerData:bannerData,
                        isLooping:true, parent: _this});
                    _comp._posterList = _this.posterList.getComp();
                    _comp._posterList.setStyle({x:112, y:124});
                    _comp.add(_comp._posterList);
                }
            }
            //}

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49, y: 270, display: mode == 2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

            _this.posterList.setActive();
        };

        var addPoster = function(_assetsData) {
            _this.posterList.addData(_assetsData);
        }

        var unFocus = function() {
        };

        var setFocus = function() {
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

            /*if(assetsData) {
                create(assetsData, bannerData);
            } else {
                var limit = 28;
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
                }

                getAssetsData({categoryId : _this.param.data.categoryId, offset:0, limit:10000, content : _this.param.data.content});
                //getAssetsData({categoryId: _this.category.categoryId, offset: _this.assetDataOffset, limit: W.StbConfig.vodLookStyle == 2 ? 22 : limit, sort:getSort()});
            }*/

            if(_this.readytoCreate) {
                continueGetData();
            } else {
                _this.readytoCreate = true;
            }
        };

        var getAssetsData = function(param) {
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

            if(_this.type) {
                if(_this.type == "series") {
                    sdpDataManager.getCategorySeries(cbGetAssetsData, reqData);
                } else if(_this.type == "asset") {
                    sdpDataManager.getCategoryAsset(cbGetAssetsData, reqData);
                } else if(_this.type == "sasset"){
                    sdpDataManager.getSAssetsCategory(cbGetAssetsData, reqData);
                } else if(_this.type == "rank"){
                    reqData.type = reqData.sort;
                    reqData.sort = undefined;
                    sdpDataManager.getCategoryTopn(cbGetAssetsData, reqData);
                }
            } else {
                if(param && param.category) {
                    if(param.category.categoryCode == "CC0401") {
                        // getMenuDetail({categoryId : _this.param.children[i].categoryId});
                        var idx = i;
                        recoDataManager.getKidsCharacter(function(isSucess, result){
                            if(isSucess && result && result.categories) {
                                _this.recoData = result.categories;
                            }
                            reqData.selector = "@detail";
                            reqData.depth = 0;
                            sdpDataManager.getMenuTree(cbGetAssetsData, reqData);
                        })
                    } else if(param.category.categoryCode == "CC0402") {
                        reqData.category = "07";
                        sdpDataManager.getRecentViewing(cbGetAssetsData, reqData);
                    } else if(param.category.categoryCode == "CC0404") {
                        reqData.type = reqData.sort;
                        reqData.sort = undefined;
                        sdpDataManager.getCategoryTopn(cbGetAssetsData, reqData);
                    } else if(param.category.categoryCode == "CC0405") {
                        reqData.selector = "@detail";
                        reqData.limit = 0;
                        sdpDataManager.getCategoryChannels(cbGetAssetsData, reqData);
                    }
                } else {
                    reqData.selector = "@detail";
                    reqData.limit = 5000;
                    sdpDataManager.getCategoryChannels(cbGetAssetsData, reqData);
                }
            }
        };

        var cbGetAssetsData = function(isSuccess, result) {
            if(isSuccess) {
                _this.tempResult = result;
                assetsData = result.data;

                if(_this.readytoCreate) {
                    continueGetData();
                } else {
                    _this.readytoCreate = true;
                }
            } else {

            }
        };

        var continueGetData = function() {
            if(_this.param.category.isLeaf && _this.tempResult) {
                if(_this.assetDataOffset == 0) {
                    _this.assetDataTotal = _this.tempResult.total;
                    _this.assetDataOffset += _this.tempResult.data.length;
                    _this.tempResult = undefined;
                    create(assetsData, bannerData);
                } else {
                    _this.assetDataTotal = _this.tempResult.total;
                    _this.assetDataOffset += _this.tempResult.data.length;
                    _this.tempResult = undefined;
                    addPoster(assetsData);
                }
            } else {
                create(assetsData, bannerData);
            }
        }

        var scrollCallback = function(idx) {
            _this.posterList.setPage(idx);
        };

        function checkCategory(category) {
            if(W.StbConfig.isKidsMode) {
                if((W.StbConfig.adultMenuUse && category.isAdult)
                    || category.isAdultOnly || category.menuType != "MC0004") {
                    var popup = {
                        popupName:"popup/kids/KidsNoentryPopup",
                        childComp:_this
                    };
                    W.PopupManager.openPopup(popup);
                } else {
                    startScene("scene/kids/KidsListScene", {category: category});
                }
            } else if((!_this.param.isClearPin && W.StbConfig.adultMenuUse && category.isAdult) || category.isAdultOnly) {
                var popup = {
                    type:"adult",
                    popupName:"popup/kids/PinPopup",
                    childComp:_this,
                    param : {category: category}
                };
                W.PopupManager.openPopup(popup);
            } else {
                startScene("scene/kids/KidsListScene", {category: category});
            }
        }

        function checkContent(content) {
            if(!_this.param.isClearPin && ((W.StbConfig.adultMenuUse && content.isAdult)
                || (content.rating && util.getRating() && content.rating >= util.getRating()))) {
                if(W.StbConfig.isKidsMode) {
                    var popup = {
                        popupName:"popup/kids/KidsNoentryPopup",
                        childComp:_this
                    };
                    W.PopupManager.openPopup(popup);
                } else {
                    var popup = {
                        type:"adult",
                        popupName:"popup/kids/PinPopup",
                        childComp:_this,
                        param : {data : content}
                    };
                    W.PopupManager.openPopup(popup);
                }
            } else {
                startScene("scene/kids/KidsVodDetailScene", {data : content});
            }
        }

        function startScene(sceneName, param){
            W.log.info(sceneName);
            //if(entryInfo){
            //    W.entryPath.push(entryInfo.target, entryInfo.data, entryInfo.from);
            //}
            param.callback = function() {
                _this.param.parent.setDisplay("none");
            };
            if(sceneName){
                W.SceneManager.startScene({
                    sceneName: sceneName,
                    param: param,
                    backState: W.SceneManager.BACK_STATE_KEEPSHOW
                });
            }
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

        var openSideOption = function() {
            if(W.StbConfig.cugType != "accommodation") {
                var popupData;

                if(W.StbConfig.isKidsMode) {
                    popupData = {
                        options: [
                            {
                                name: W.Texts["kids_mode_setting"],
                                type: "kidsBox",
                                param: "KIDS",
                                subOptions: [
                                    {type: "kidsBox", name: W.Texts["kids_mode_off"]},
                                    {type: "restrict"}
                                ]
                            }
                        ]
                    }
                } else {
                    popupData = {
                        options: [
                            {
                                name: W.Texts["kids_mode_setting"],
                                type: "kidsBox",
                                param: "KIDS",
                                subOptions: [
                                    {type: "kidsBox", name: W.Texts["kids_mode_on"]}
                                ]
                            }
                        ]
                    }

                    var categoryPath = W.entryPath.getCategoryPath();
                    var btnName = _this.param.category.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                    if(_this.param.category.categoryCode == "CC0401") {
                        var data = _this.posterList.getCurrentData();
                        var btnName = data.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                        categoryPath = W.entryPath.getCategoryPath(data.title);
                        popupData.options.push({
                            name: categoryPath,
                            param:"BOOKMARK",
                            subOptions: [
                                {type:"box", name:btnName}
                            ]
                        });
                    } else if(_this.param.category.categoryCode == "CC0402") {
                        var data = _this.posterList.getCurrentData();
                        if(data.type != "banner") {
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

                    } else if(_this.param.category.categoryCode == "CC0403") {
                        var data = _this.posterList.getCurrentData();
                        var btnName = data.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                        categoryPath = W.entryPath.getCategoryPath(data.title);
                        popupData.options.push({
                            name: categoryPath,
                            param:"BOOKMARK",
                            subOptions: [
                                {type:"box", name:btnName}
                            ]
                        });
                    } else if(_this.param.category.categoryCode == "CC0405") {
                        var data = _this.posterList.getCurrentData();
                        var btnName = data.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                        var isFav = W.StbConfig.favoriteChannelList.sourceIds.includes(parseInt(data.sourceId));
                        popupData.options.push( {
                            name: util.changeDigit(data.channelNum, 3) + " " + data.title,
                            param: "FAVCH",
                            subOptions: [
                                {type: "box", name: isFav ? W.Texts["deregist_fav_ch"] : W.Texts["regist_fav_ch"]}
                            ]
                        });
                        popupData.options.push( {
                            name: "",
                            param: "DETAIL",
                            subOptions: [
                                {type: "box", name: W.Texts["prog_detail"]}
                            ]
                        });
                    } else {
                        var data = _this.posterList.getCurrentData();
                        if(data.type != "banner") {
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

                    if(_this.type == "asset" || _this.type == "sasset" || _this.type == "series"){
                        popupData.options.push({
                            name: W.Texts["sorting"],
                            param:"SORTING",
                            subOptions: [
                                {type: "spinner", index: sortingIndex, options: [W.Texts["sorting_option1"], W.Texts["sorting_option2"],
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

                    popupData.options.push({
                        name: undefined,
                        param:"SEARCH",
                        subOptions: [
                            {type:"box", name:W.Texts["search"]}
                        ]
                    });
                }

                var popup = {
                    popupName: "popup/kids/VodSideOptionPopup",
                    optionData: popupData,
                    childComp: _this
                };
                W.PopupManager.openPopup(popup);
            }
        }

        this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info("KidsList show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("KidsList hide");
        };
        this.create = function(callback, param) {
            W.log.info("create !!!!");
            backCallbackFunc = callback;
            _this = this;

            _this.param = param;
            sortingIndex = 1;

            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            _this.assetDataOffset = 0;
            _this.assetDataTotal = 0;
            _this.readytoCreate = false;

            W.log.info(param)

            W.entryPath.push("menu.categoryId", param.category, "KidsList");

            if(param.category && param.category.isLeaf) {
                if(param.category.content) {
                    if(param.category.content.contentType == "sasset") {
                        _this.type = "sasset";
                    } else if(param.category.content.contentType == "asset") {
                        _this.type = "asset";
                    } else if(param.category.content.contentType == "series") {
                        _this.type = "series";
                    } else if(param.category.content.contentType == "rank") {
                        _this.type = "rank";
                        sortingIndex = 0;
                    }
                } else {
                   if(param.category.categoryCode == "CC0404") {
                       _this.type = "rank";
                       sortingIndex = 0;
                    }
                }

                if(W.StbConfig.cugType == "accommodation" || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others"){
                    _this.readytoCreate = true;
                } else {
                    getBannerData({targetId: param.category.baseId, offset: 0, limit: 2});
                }
                getAssetsData({category : param.category, categoryId : param.category.categoryId, offset:0, limit:24, content : param.category.content, sort:getSort()});
            } else {
                if(param.category.children) assetsData = param.category.children;
                if(W.StbConfig.cugType == "accommodation" || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others"){
                    _this.readytoCreate = true;
                    _this.tempResult = assetsData;
                    continueGetData(assetsData);
                } else {
                    _this.readytoCreate = true;
                    _this.tempResult = assetsData;
                    getBannerData({targetId: param.category.baseId, offset: 0, limit: 2});
                }
            }

            if(param && param.data) {
                /*if(param.data.categoryCode == "CC0401") {
                    assetsData = param.data;
                    assetsData.type = 0;
                    create(assetsData);
                } else if(param.data.categoryCode == "CC0402") {
                    assetsData = param.data;
                    assetsData.type = 2;
                    create(assetsData);
                } else if(param.data.categoryCode == "CC0403") {
                    assetsData = param.data;
                    assetsData.type = 5;

                    if(W.StbConfig.cugType == "accommodation" || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others"){
                        create(assetsData);
                    } else {
                        _this.readytoCreate = true;
                        getBannerData({targetId: param.data.baseId, offset: 0, limit: 2});
                    }
                } else if(param.data.categoryCode == "CC0404") {
                    assetsData = param.data;
                    assetsData.type = 2;

                    if(W.StbConfig.cugType == "accommodation" || W.StbConfig.cugType == "public" || W.StbConfig.cugType == "others"){
                        create(assetsData);
                    } else {
                        _this.readytoCreate = true;
                        getBannerData({targetId: param.data.baseId, offset: 0, limit: 2});
                    }
                } else if(param.data.categoryCode == "CC0405") {
                    assetsData = param.data;
                    assetsData.type = 4;
                    create(assetsData);
                } else {*/

                //}

            } else {
            }

            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.posterList) _this.posterList.setActive();
                if(_this.scroll) _this.scroll.setActive();

                if(_this.listMode == "text") {
                    _comp._posterList.setStyle({height:549});
                }
            } else {
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_this.listMode == "text") {
                    _comp._posterList.setStyle({height:299});
                }
            }
        };
        this.requestData = function(_offset, _limit) {
            getAssetsData({category : _this.param.category, categoryId : _this.param.category.categoryId, offset:_offset ? _offset : _this.assetDataOffset,
                limit:_limit ? _limit : 28, content : _this.param.category.content, sort:getSort()});
        };
        this.hasList = function(){
        };
        this.setScroll = function() {
            if(_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
        }
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        _this.posterList.getPageIdx();
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
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
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                    var currentData = _this.posterList.getCurrentData();
                    if(currentData && currentData.type == "banner") {
                        W.LinkManager.action("L", currentData.link, true);
                    } else if(_this.param && _this.param.category && _this.param.category.isLeaf) {
                        if(_this.param.category.categoryCode == "CC0405") {
                        	if(W.state.isVod){
            					W.PopupManager.openPopup({
            	                    title:W.Texts["popup_zzim_info_title"],
            	                    popupName:"popup/AlertPopup",
            	                    boldText:W.Texts["vod_alert_msg"],
            	                    thinText:W.Texts["vod_alert_msg2"]}
            	                );
            				}else{
            					W.CloudManager.changeChannel(function () {

                                }, parseInt(currentData.sourceId));
                                W.CloudManager.closeApp();
            				}
                        } else {
                            checkContent(currentData);
                        }
                    } else {
                        if(currentData) {
                            if(currentData.isLeaf) {
                                if(currentData.isLink) {
                                    W.LinkManager.action("L", currentData.link, true)
                                } else if(currentData.isContent) {
                                    checkCategory(currentData);
                                } else {

                                }
                            } else {
                                checkCategory(currentData);
                            }
                        }
                    }

                    break;
                case W.KEY.BACK:
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
                    var content = _this.posterList.getCurrentData();
                    if(_this.param && _this.param.category && _this.param.category.isLeaf) {
                        if(!_this.param.isClearPin && (W.StbConfig.adultMenuUse && content.isAdult)) {
                            if(W.StbConfig.isKidsMode) {
                                var popup = {
                                    popupName:"popup/kids/KidsNoentryPopup",
                                    childComp:_this
                                };
                                W.PopupManager.openPopup(popup);
                            } else {
                                var popup = {
                                    type:"adult",
                                    popupName:"popup/kids/PinPopup",
                                    childComp:_this,
                                    param : {type : "sideOption", data : content}
                                };
                                W.PopupManager.openPopup(popup);
                            }
                        } else {
                            openSideOption();
                        }
                    } else {
                        openSideOption();
                    }
                    break;
            }

        };
        this.destroy = function() {
            W.entryPath.pop();
            W.log.info("destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "KidsList";
        this.onPopupClosed = function (popup, desc) {
            W.log.info("onPopupClosed ");
            W.log.info(desc.popupName, desc.action);
            W.log.info(popup,desc)
            if (desc.popupName == "popup/AdultCheckPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    _this.isClearPin = true;
                    if(desc.type == "ZZIM"){
                    	W.SceneManager.startScene({
        					sceneName:"scene/home/CategoryListScene", 
        					param:{category:desc.param},
    	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
                }
            }else if (desc && desc.popupName == "popup/kids/VodSideOptionPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    W.log.info(desc);
                    if(desc.param.param == "ZZIM"){
                        if(desc.param.subOptions == 0){
                            var data = _this.posterList.getCurrentData();
                            var popup = {
                                popupName:"popup/my/ZzimAddPopup",
                                param:{data:data, type:data.seriesId ? "series" : "sasset"},
                                childComp:this
                            };
                            W.PopupManager.openPopup(popup);
                        }else{
                            var reqData = {menuType:"MC0001"};
                            sdpDataManager.getChildMenuTree(function(isSuccess, result){
                                if(isSuccess){
                                    if(result && result.total && result.total > 0) {
                                        for(var i=0; i < result.data.length; i++){
                                            if(result.data[i].categoryCode == "CC0103"){
                                            	if(result.data[i].isAdultOnly && !_this.isClearPin){
                                					var popup = {
                    	                                type:"ZZIM",
                    	                                param:result.data[i],
                    	                                popupName:"popup/AdultCheckPopup",
                    	                                childComp:_this
                    	                            };
                    	                            W.PopupManager.openPopup(popup);
                                				}else{
                                                    W.SceneManager.startScene({
                                                        sceneName:"scene/home/CategoryListScene",
                                                        param:{category:result.data[i]},
                                                        backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                                				}
                                                break;
                                            }
                                        }
                                    } else {
                                        W.PopupManager.openPopup({
                                            childComp:_this,
                                            popupName:"popup/ErrorPopup",
                                            code: (result && result.error && result.error.code) ? result.error.code : "1001",
                                            message : (result && result.error && result.error.message) ? [result.error.message] : null,
                                			from : "SDP"
                                        });
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
                            }, reqData);
                        }
                    }else if(desc.param.param == "BOOKMARK"){
                        if(desc.param.subOptions == 0){
                            var category;
                            W.log.info(_this.param);
                            var paramCategory;
                            if(_this.param.category){
                            	paramCategory = _this.param.category;
                            }else if(_this.param.data){
                            	paramCategory = _this.param.data;
                            }
                            
                            if(paramCategory.categoryCode == "CC0401" || paramCategory.categoryCode == "CC0403" || paramCategory.categoryCode == "CC0401" || paramCategory.categoryCode == "CC0405") {
                                category =  _this.posterList.getCurrentData();
                            } else {
                                category =  paramCategory;
                            }

                            W.log.info(category)
                            var reqData = {targetId : category.categoryId};
                            var favoriteFunction;
                            if(category.isPinned){
                                favoriteFunction = sdpDataManager.removeViewingFavorite;
                            }else{
                                favoriteFunction = sdpDataManager.addViewingFavorite;
                            }
                            favoriteFunction(function(result, data, param){
                                W.log.info(data);
                                if(result){
                                   /* if(category.isPinned) {
                                        _this.list.listArray[_this.listIndex]._comp._listTitle_f._star.setStyle({visibility:"hidden"})
                                    } else {
                                        _this.list.listArray[_this.listIndex]._comp._listTitle_f._star.setStyle({visibility:""})
                                    }*/
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        type:"2LINE",
                                        popupName:"popup/FeedbackPopup",
                                        title:category.title,
                                        desc:category.isPinned ? W.Texts["bookmark_msg_removed"] : W.Texts["bookmark_msg_added"]}
                                    );
                                    category.isPinned = !category.isPinned;
                                }else{
                                	if(data && data.error && data.error.code == "C0501" && !category.isPinned){
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
				                            code:data.error ? data.error.code : "9999",
				                            message:data.error ? [data.error.detail] : null,
				                			from : "SDP"}
				                        );
									}
                                }
                            }, reqData);
                        }
                    } else if(desc.param.param == "FAVCH"){
                        var data = _this.posterList.getCurrentData();
                        if(desc.param.subOptions == 0){

                            var isFav = W.StbConfig.favoriteChannelList.sourceIds.includes(parseInt(data.sourceId));
                            var isSkipped = W.StbConfig.skippedChannelList.sourceIds.includes(parseInt(data.sourceId));

                            if (isSkipped) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["setting_fav_restrict"]}
                                );
                                return;
                            }
                            if (isFav) {
                                var ids = JSON.parse(JSON.stringify(W.StbConfig.favoriteChannelList.sourceIds));
                                ids.splice(parseInt(ids.indexOf(parseInt(data.sourceId))), 1);

                                W.CloudManager.removeFavoriteCh(function (result) {
                                    if (result.data == "OK") {
                                        W.StbConfig.favoriteChannelList.sourceIds = ids;
                                        W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                                        W.PopupManager.openPopup({
                                            childComp:_this,
                                            popupName:"popup/FeedbackPopup",
                                            title:W.Texts["fav_ch_removed"]}
                                        );
                                    } else {

                                    }
                                }, [parseInt(data.sourceId)], ids);
                            } else {
                                var ids = JSON.parse(JSON.stringify(W.StbConfig.favoriteChannelList.sourceIds));
                                ids.push(parseInt(data.sourceId));
                                W.CloudManager.addFavoriteCh(function (result) {
                                    if (result.data == "OK") {
                                        W.StbConfig.favoriteChannelList.sourceIds = ids;
                                        W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                                        W.PopupManager.openPopup({
                                            childComp:_this,
                                            popupName:"popup/FeedbackPopup",
                                            title:W.Texts["fav_ch_added"]}
                                        );
                                    } else {

                                    }
                                }, [parseInt(data.sourceId)], ids);
                            }
                        }
                    } else if(desc.param.param == "DETAIL"){
                        var data = _this.posterList.getCurrentData();
                        sdpDataManager.getSchedulesNow(function(isSuccess, result) {
                            if(isSuccess) {
                                if(result && result[data.sourceId]) {
                                    var popup = {
                                        popupName: "popup/guide/MoreInfoPopup",
                                        data: {ch:data, pr:result[data.sourceId]},
                                        childComp: _this
                                    };
                                    W.PopupManager.openPopup(popup);
                                } else {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/ErrorPopup",
                                        code: (result && result.error && result.error.code) ? result.error.code : "1001",
                                        message : (result && result.error && result.error.message) ? [result.error.message] : null,
                            			from : "SDP"
                                    });
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
                        }, {sourceId:data.sourceId});
                    }else if(desc.param.param == "SEARCH"){
                		W.SceneManager.startScene({sceneName:"scene/search/SearchScene", 
    	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                	}else if(desc.param.param == "SORTING"){
                        if(sortingIndex == desc.param.value){
                        }else{
                            sortingIndex = desc.param.value;

                            _this.assetDataOffset = 0;
                            _this.assetDataTotal = 0;
                            //다시 조회
                            getAssetsData({category : _this.param.category, categoryId : _this.param.category.categoryId, offset:_this.assetDataOffset, limit:24, sort:getSort()});
                        }
                    }else if(desc.param.param == "SEARCH"){
                        W.SceneManager.startScene({sceneName:"scene/search/SearchScene",
                            backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
                } else {
                }
            } else if (desc.popupName == "popup/my/ZzimAddPopup") {
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
            } else if (desc.popupName == "popup/kids/PinPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    W.log.info(popup, desc)
                    var data = desc.param;
                    _this.param.isClearPin = true;
                    if(_this.posterList && _this.posterList.releaseRestrict) {
                        _this.posterList.releaseRestrict();
                    }
                    data.isClearPin = _this.isClearPin;
                    if(desc.param.type == "sideOption") {
                        openSideOption();
                    } else {
                        if(_this.param && _this.param.category && _this.param.category.isLeaf) {
                            startScene("scene/kids/KidsVodDetailScene", data);
                        } else {
                            startScene("scene/kids/KidsListScene", data);
                        }
                    }
                }
            }
        };
    }

    return {
        getNewComp: function () {
            return new KidsList();
        }
    }
});