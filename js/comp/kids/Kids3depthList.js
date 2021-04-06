W.defineModule(["mod/Util", "comp/kids/CircleList", "comp/kids/PosterList", "comp/kids/KeywordList", "comp/Scroll"], function(util, CircleList, PosterList, KeywordList, Scroll) {
    var _this;
    var dataManager = W.getModule("manager/SdpDataManager");

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
        _this.mode = MODE_TYPE.LIST;
        W.log.info(assetsData)

        if(assetsData.type == 0 || assetsData.type == 4) {
            _this.posterList = new CircleList({type:CircleList.TYPE.CHARACTER, data:assetsData.child, bannerData:bannerData});
            _comp._posterList = _this.posterList.getComp();
            _comp._posterList.setStyle({x:129, y:134});
            _comp.add(_comp._posterList);
        } else if(assetsData.type == 5) {
            _this.posterList = new KeywordList({type:KeywordList.TYPE.MENU, data:assetsData, bannerData:bannerData, isLooping:true});
            _comp._posterList = _this.posterList.getComp();
            _comp._posterList.setStyle({x:112, y:124});
            _comp.add(_comp._posterList);
        } else {
            _this.posterList = new PosterList({type:PosterList.TYPE.MOVIE, data:assetsData, bannerData:bannerData, isLooping:true});
            _comp._posterList = _this.posterList.getComp();
            _comp._posterList.setStyle({x:145, y:110});
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
    };

    var unFocus = function() {
    };

    var setFocus = function() {
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

        if(param && param.content && param.content.contentType) {
            if(param.content.contentType == "series") {
                dataManager.getCategorySeries(cbGetAssetsData, reqData);
            } else if(_this.type == "asset") {
                dataManager.getCategoryAsset(cbGetAssetsData, reqData);
            } else if(_this.type == "sasset"){
                dataManager.getSAssetsCategory(cbGetAssetsData, reqData);
            } else if(_this.type == "rank"){
                dataManager.getCategoryTopn(cbGetAssetsData, reqData);
            }
        } else {
            dataManager.getSAssetsCategory(cbGetAssetsData, reqData);
        }
    };

    var cbGetAssetsData = function(isSuccess, result) {
        if(isSuccess) {
            //assetsData = result.data;
            W.log.info(result)

            if(result && result.data) {
                assetsData = result.data;
            }

            create(assetsData, bannerData);
        } else {

        }
    };

    var scrollCallback = function(idx) {
        _this.posterList.setPage(idx);
    };

    return {
        getComp: function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        },
        show: function() {
            //_comp.setVisible(true);
            W.log.info("KidsList show");

            _comp.setDisplay("block");
        },
        hide: function() {
            _comp.setDisplay("none");
            W.log.info("KidsList hide");
        },
        create: function(callback, param) {
            W.log.info("create !!!!");
            backCallbackFunc = callback;
            _this = this;

            W.log.info(param)
            

            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});
            getAssetsData({categoryId : param.data.categoryId, offset:0, limit:100, content : param.data.content});

            return _comp;
        },
        changeMode: function(data){
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
        },
        hasList: function(){
        },
        operate: function(event) {
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
                    //W.SceneManager.startScene({sceneName:"scene/kids/Kids3depthListScene"});
                    
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
                case W.KEY.KEY_OPTION:
                   break;
            }

        },
        destroy: function() {
            W.log.info("destroy !!!!");
        },
        getMode:function(){
            return mode;
        },
        componentName : "KidsList",
    };
});