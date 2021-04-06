/**
 * scene/LiveTriggerLeftScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/liveArrow/ChannelList", "comp/liveArrow/NoPreferred"],
    function(util, ChannelList, NoPreferred) {
        var _thisScene = "LiveTriggerLeftScene";
        var _this;
        var _comp;
        var _parentDiv;

        var sdpDataManager = W.getModule("manager/SdpDataManager");
        var recoDataManager = W.getModule("manager/RecommendDataManager");

        var currComponent;

        var TYPE = ChannelList.TYPE;
        var state = TYPE.RANKING;
        
        var rankingData, preferredData;

        var isNoPopular = false;

        W.log.info("### Initializing " + _thisScene + " scene ###");

        var changeState = function() {
            currComponent.deActive();
            currComponent._comp.setDisplay("none");
            if(state == TYPE.RANKING) {
                state = TYPE.PREFERRED;
                currComponent = _this.preferredList;
                _parentDiv._title.setText(W.Texts["scene_live_trigger_left_text1"]);
                _parentDiv._colorKeyText.setText(W.Texts["scene_live_trigger_left_text2"]);
            } else {
                state = TYPE.RANKING;
                currComponent = _this.rankingList;
                _parentDiv._title.setText(W.Texts["scene_live_trigger_left_text3"]);
                _parentDiv._colorKeyText.setText(W.Texts["scene_live_trigger_left_text4"]);
            }
            currComponent.setPage(0, true);
            currComponent.setActive();
            currComponent._comp.setDisplay("block");
        }

        var getChannelData = function () {
            recoDataManager.getPopularChannel(cbGetPopularChannel);
        };

        var cbGetPopularChannel = function (isSuccess, result) {
            if (isSuccess && result && result.resultList && result.resultList.length > 0) {
                rankingData = result.resultList;
                var chArray = [];
                for(var i in result.resultList){
                    chArray.push(result.resultList[i].channelSrcId);
                }
                sdpDataManager.getSchedulesNow(cbGetPopularSchedule, {sourceId:chArray.toString()});
            } else {

                isNoPopular = true;
                if(_this.readytoCreate) {
                    create();
                } else {
                    _this.readytoCreate = true;
                }
            }
        };

        var cbGetPopularSchedule = function(isSuccess, result) {
            if(isSuccess) {
               for(var i in rankingData) {
                    if(result[rankingData[i].channelSrcId]) {
                        rankingData[i].schedule = result[rankingData[i].channelSrcId];
                    }
                }

                if(_this.readytoCreate) {
                    create();
                } else {
                    _this.readytoCreate = true;
                }
            } else {
                if(_this.readytoCreate) {
                    create();
                } else {
                    _this.readytoCreate = true;
                }
            }
        };

        var cbGetPreferredChannel = function (isSuccess, result) {
            if (isSuccess) {
                preferredData = result.data;
                var chArray = [];
                for(var i in result.data){
                    result.data[i].channelSrcId = result.data[i].sourceId;
                    result.data[i].channelName = result.data[i].title;
                    result.data[i].channelNo = result.data[i].channelNum;
                    chArray.push(result.data[i].channelSrcId);
                }
                sdpDataManager.getSchedulesNow(cbGetPreferredSchedule, {sourceId:chArray.toString()});
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

        var cbGetPreferredSchedule = function(isSuccess, result) {
            if(isSuccess) {
                for(var i in preferredData) {
                    if(result[preferredData[i].channelSrcId]) {
                        preferredData[i].schedule = result[preferredData[i].channelSrcId];
                    }
                }

                if(_this.readytoCreate) {
                    create();
                } else {
                    _this.readytoCreate = true;
                }

            } else {
                if(_this.readytoCreate) {
                    create();
                } else {
                    _this.readytoCreate = true;
                }
            }
        };

        var create = function() {
            if(!isNoPopular) {
                _this.rankingList = new ChannelList(TYPE.RANKING, rankingData);
                _this.rankingList._comp = _this.rankingList.getComp();
                _parentDiv._comp_area.add(_this.rankingList._comp);
            }
            _this.preferredList = (preferredData && preferredData.length) > 0 ? new ChannelList(TYPE.PREFERRED, preferredData) : new NoPreferred();
            _this.preferredList._comp = _this.preferredList.getComp();
            if(!isNoPopular) {
                _this.preferredList._comp.setDisplay("none");
            }
            _parentDiv._comp_area.add(_this.preferredList._comp);


            _this.add(_parentDiv);

            if(!isNoPopular) {
                currComponent = _this.rankingList;
                _parentDiv._redKey.setDisplay("");
                _parentDiv._colorKeyText.setDisplay("");

            } else {
                state = TYPE.PREFERRED;
                currComponent = _this.preferredList;
                _parentDiv._redKey.setDisplay("none");
                _parentDiv._colorKeyText.setDisplay("none");

                _parentDiv._title.setText(W.Texts["scene_live_trigger_left_text1"]);
                _parentDiv._colorKeyText.setText(W.Texts["scene_live_trigger_left_text2"]);
            }
            currComponent.setActive();
        }

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.COLOR_KEY_R,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);
                isNoPopular  = false;

                _parentDiv = new W.Div({className : "bg_size"});

                _parentDiv._bg = new W.Image({x:0,y:0,width:814,height:720, src:"img/bg_arr_l.png"});
                _parentDiv.add(_parentDiv._bg);

                _parentDiv._title = new W.Div({x:55, y:51, width:150, height:32, text:W.Texts["scene_live_trigger_left_text3"], textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"});
                _parentDiv.add(_parentDiv._title);
                _parentDiv._redKey = new W.Image({x:395, y:38, width:68, height:68, src:"img/color_red.png"});
                _parentDiv.add(_parentDiv._redKey);
                _parentDiv._colorKeyText = new W.Div({x:445, y:56, width:100, height:20, text:W.Texts["scene_live_trigger_left_text4"], textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM", "font-size":"15px", textAlign:"left", "letter-spacing":"-0.75px"});
                _parentDiv.add(_parentDiv._colorKeyText);

                _parentDiv._comp_area = new W.Div({id:"comp_area", x:42, y:113, width:510, height:621, overflow:"hidden"});
                _parentDiv.add(_parentDiv._comp_area);

                getChannelData();


                W.CloudManager.getFavoriteChannel(function (callbackData) {
                    W.log.info("getFavoriteChannel Recevied ::: ");
                    W.log.info(callbackData);

                    W.StbConfig.favoriteChannelList = (callbackData.data != undefined) ? callbackData.data : {sourceIds:[]};
                    W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;

                    if(W.StbConfig.favChCount > 0) {
                        sdpDataManager.getChannelDetail(cbGetPreferredChannel, {sourceId: W.StbConfig.favoriteChannelList.sourceIds.toString()});
                    } else {
                        if(_this.readytoCreate) {
                            create();
                        } else {
                            _this.readytoCreate = true;
                        }
                    }

                });

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
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + state);

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                        currComponent.operate(event);
                        break;
                    case W.KEY.LEFT:
                        currComponent.operate(event);
                        //if(!currComponent.operate(event)) {
                        //    _this.backScene();
                        //};
                        break;
                    case W.KEY.UP:
                        currComponent.operate(event);
                        break;
                    case W.KEY.DOWN:
                        currComponent.operate(event);
                        break;
                    case W.KEY.ENTER:
                        currComponent.operate(event);
                        break;
                    case W.KEY.BACK:
                        _this.backScene();
                        break;
                    case W.KEY.EXIT:
                    case W.KEY.KEY_ESC:
                    case W.KEY.HOME:
                    case W.KEY.MENU:
                    case 72:
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
                        currComponent.operate(event);
                        break;
                    case W.KEY.COLOR_KEY_R:
                        if(!isNoPopular) changeState();
                        break;
                }

            },
            onPopupClosed: function (popup, desc) {
                W.log.info("onPopupClosed ");
                W.log.info(popup, desc);
                if (desc && desc.popupName == "popup/ErrorPopup") {
                    _this.backScene();
                }
            },
        });
    });
