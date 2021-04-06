W.defineModule(["mod/Util", "comp/list/PosterList", "comp/list/TextList", "comp/Scroll"], function(util, PosterList, TextList, Scroll) {
    function RecommendVodList() {
        var _this;
        var uiplfDataManager = W.getModule("manager/UiPlfDataManager");

        var backCallbackFunc;
        var mode = 0;
        var tops = [465, 191, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];

        var index = 0;
        var _comp;

        var assetsData;

        var MODE_TYPE = Object.freeze({LIST: 0, SCROLL: 1});

        var changeY = function () {
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y: tops[mode], opacity: opacity[mode]});
        };

        var create = function (assetsData, bannerData) {
            _this.mode = MODE_TYPE.LIST;

            _comp._inner = new W.Div({});

            _comp._bg1 = new W.Image({
                x: 0,
                y: -tops[1],
                width: 1280,
                height: 720,
                src: "img/bg_arr_d.png",
                display: mode == 2 ? "none" : "block"
            });
            _comp._inner.add(_comp._bg1);
            _comp._bg2 = new W.Div({
                x: 0,
                y: 0,
                width: 1280,
                height: 720,
                display: mode == 2 ? "block" : "none",
                className : "bg_color"
            });
            _comp._inner.add(_comp._bg2);

            _comp._inner.add(new W.Div({
                text: W.Texts["scene_live_trigger_down_text1"],
                x: 55,
                y: 49,
                width: 500,
                textColor: "#FFFFFF",
                fontFamily: "RixHeadM",
                "font-size": "24px",
                textAlign: "left",
                "letter-spacing": "-1.2px"
            }));

            _this.posterList = new PosterList({type: PosterList.TYPE.MOVIE, data: assetsData.data, total : assetsData.total, parent:_this, isLiveTriggerDown:true});
            _comp._posterList = _this.posterList.getComp();
            _comp._posterList.setStyle({x: 119, y: 109});
            _this.posterList.setDimmed(1, 0.5);
            _comp._inner.add(_comp._posterList);

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49+5, y: 270});
                _comp._inner.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

            _comp.add(_comp._inner);

            _this.changeMode(mode);

            /*setTimeout(function() {
                _comp.setStyle({visibility:"visible"});
            },100);*/
            //_this.posterList.setActive();
        };

        var unFocus = function () {
        };

        var setFocus = function () {
        };

        var getAssetsData = function () {
            uiplfDataManager.getBelowBannerList(cbGetAssetsData, {offset:0, limit:28});
        };

        var cbGetAssetsData = function (isSuccess, result) {
            if (isSuccess) {
                assetsData = result;

                if(assetsData && assetsData.data && assetsData.data.length > 0) {
                    if(assetsData.data.length > 28) {
                        assetsData.data = assetsData.data.splice(0,28);
                        assetsData.total = assetsData.data.length;
                    }

                    if(assetsData.total < 8){
                        tops[1] = tops[1] + 111;
                    }

                    create(assetsData);
                } else {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/FeedbackPopup",
                        title:W.Texts["no_recommend_vod"]
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
        };

        var scrollCallback = function (idx) {
            _this.posterList.setPage(idx);
        };

        this.getComp = function (callback) {
            if (callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function () {
            //_comp.setVisible(true);
            W.log.info("RecommendVodList show");

            _comp.setDisplay("block");
        };
        this.hide = function () {
            _comp.setDisplay("none");
            W.log.info("RecommendVodList hide");
        };
        this.create = function (_parent, _param) {
            W.log.info("create !!!!");
            _this = this;
            _this.parent = _parent;

            getAssetsData();

            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;

            _comp = new W.Div({
                id: "movie_list_area",
                x: 0,
                y: tops[1],
                width: "1280px",
                height: "720px",
                opacity: opacity[1]
                //visibility:"hidden"
            });

            return _comp;
        };
        this.changeMode = function (data) {
            mode = data;
            changeY();

            if (_this.mode == MODE_TYPE.LIST) {
                if (_this.posterList) _this.posterList.setActive();
            } else {
                if (_this.posterList) _this.posterList.deActive();
            }
            if (mode == 1) {
                _comp._bg1.setDisplay("block");
                _comp._bg2.setDisplay("none");
                _this.posterList.setDimmed(1, 0.5);
            } else if (mode == 2) {
                _comp._bg1.setDisplay("none");
                _comp._bg2.setDisplay("block");
                _this.posterList.setDimmed(1, 1);
            }
        };
        this.hasList = function () {
        };
        this.setScroll = function() {
            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
        }
        this.operate = function (event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if (_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if(_this.posterList.curRowIndex > 0){
                            if (mode != 2) {
                                _this.changeMode(2);
                            }
                        }
                        return true;
                    } else if (_this.mode == MODE_TYPE.SCROLL) {
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if (_this.mode == MODE_TYPE.LIST) {
                        if (_this.posterList.operate(event)) {
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
                    if (_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        if(_this.posterList.curRowIndex > 0){
                            if (mode != 2) {
                                _this.changeMode(2);
                            }
                        }
                        if (returnVal) {
                            return true;
                        } else {
                            if (mode == 2) {
                                _this.changeMode(1);
                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else if (_this.mode == MODE_TYPE.SCROLL) {
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if (_this.mode == MODE_TYPE.LIST) {
                        if(assetsData.total > 7){
                            if (mode != 2) {
                                _this.changeMode(2);
                            }
                            _this.posterList.operate(event);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        }
                        return true;
                    } else if (_this.mode == MODE_TYPE.SCROLL) {
                        if (mode != 2) {
                            _this.changeMode(2);
                        }
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                    W.LinkManager.action("L", _this.posterList.getCurrentData().link, undefined, "liveDown", "RecommendVodList");
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
            }

        };
        this.destroy = function () {
            W.log.info("destroy !!!!");
        };
        this.getMode = function () {
            return mode;
        };
        this.componentName = "RecommendVodList";
        this.onPopupClosed = function (popup, desc) {
            W.log.info("onPopupClosed ");
            W.log.info(popup, desc);
            if (desc && desc.popupName == "popup/FeedbackPopup") {
                _this.parent.backScene();
            } else if (desc && desc.popupName == "popup/ErrorPopup") {
                _this.parent.backScene();
            }
        };
    }
    return {
        getNewComp: function(){
            return new RecommendVodList();
        }
    }
});