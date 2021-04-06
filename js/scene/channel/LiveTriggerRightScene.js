/**
 * scene/LiveTriggerRightScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/liveArrow/ContentsList", "comp/liveArrow/FavMenuList", "comp/Button"],
    function(util, ContentsList, FavMenuList, buttonComp) {
        var sdpDataManager = W.getModule("manager/SdpDataManager");
        var uiplfDataManager = W.getModule("manager/UiPlfDataManager");

        var _thisScene = "LiveTriggerRightScene";
        var _this;
        var _comp;
        var _parentDiv;

        var currComponent;

        var TYPE =  Object.freeze({CONTENTS:0, FAV_MENU:1, FAV_EMPTY:2});
        var isFavMenu = false;
        var state = TYPE.CONTENTS;

        var _y = [0, -348, -950];
        var posIdx = 0;

        var bannerData, favData;

        W.log.info("### Initializing " + _thisScene + " scene ###");

        var changeState = function() {
            currComponent.deActive();
            currComponent._comp.setOpacity(0.5);
            currComponent._title.setOpacity(0.5);

            if(state == TYPE.CONTENTS) {
                if(isFavMenu) {
                    state = TYPE.FAV_MENU;
                } else {
                    state = TYPE.FAV_EMPTY;
                }
                currComponent = _this.favMenuList;
            } else {
                state = TYPE.CONTENTS;
                currComponent = _this.contentsList;
            }
            currComponent.setActive();
            currComponent._comp.setOpacity(1);
            currComponent._title.setOpacity(1);
        }

        var create = function() {
            if(bannerData && bannerData.length > 0) {
                _this.contentsList = new ContentsList(bannerData);

                _this.contentsList._title = new W.Div({position:"relative", x:0, y:51, width:150, height:32, text:W.Texts["scene_live_trigger_right_text1"],
                    textColor:"#FFFFFF", opacity:0.5, fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"});
                _parentDiv._comp_area._inner.add(_this.contentsList._title);


                _this.contentsList._comp = _this.contentsList.getComp();
                _this.contentsList._comp.setStyle({position:"relative", y:51+13, opacity:0.5});
                _parentDiv._comp_area._inner.add(_this.contentsList._comp);

                currComponent = _this.contentsList;
            }

            if(favData.length > 0) {
                isFavMenu = true;
                _this.favMenuList = new FavMenuList(favData);

                _this.favMenuList._title = new W.Div({position:"relative", x:0, y:51+48, width:160, height:32, text:W.Texts["scene_live_trigger_right_text2"],
                    textColor:"#FFFFFF", opacity:0.5, fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"});
                _parentDiv._comp_area._inner.add(_this.favMenuList._title);

                _this.favMenuList._comp = _this.favMenuList.getComp();
                _this.favMenuList._comp.setStyle({position:"relative", y:51+72, opacity :0.5});
                _parentDiv._comp_area._inner.add(_this.favMenuList._comp);

                currComponent = _this.favMenuList;

                if(!_this.contentsList) {
                    _this.favMenuList._title.setStyle({y:51});
                    _this.favMenuList._comp.setStyle({y:51+13});
                }

            } else {
                _this.favMenuList = {};

                _this.favMenuList.operate = function(event) {
                    switch (event.keyCode) {
                        case W.KEY.DOWN:
                        case W.KEY.UP:
                        case W.KEY.RIGHT:
                            return false;
                        case W.KEY.ENTER:
                            W.SceneManager.getSceneStack()[0].showHome();
                            break;
                        }
                    return true;
                }

                _this.favMenuList.setActive = function() {
                    _this.favMenuList.btn.focus();
                };

                _this.favMenuList.deActive = function() {
                    _this.favMenuList.btn.unFocus();
                };

                _this.favMenuList._title = new W.Div({position:"relative", x:0, y:51+48, width:270, height:32, text:W.Texts["scene_live_trigger_right_text2"],
                    textColor:"#FFFFFF", opacity:0.5, fontFamily:"RixHeadM", "font-size":"27px", textAlign:"left", "letter-spacing":"-1.35px"});
                _parentDiv._comp_area._inner.add(_this.favMenuList._title);

                _this.favMenuList._comp = new W.Div({position:"relative", x:2, y:51+72, opacity :0.5});


                _this.favMenuList._comp.add(new W.Div({position:"relative", x:0, y:353-204-50, width:323, height:32, text:W.Texts["scene_live_trigger_right_text3"],
                    textColor:"#FFFFFF", fontFamily:"RixHeadM", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.5px"}));

                _this.favMenuList._comp.add(new W.Image({x:882-878, y:782-577-50, width:68, height:68, src:"img/color_yellow.png"}));

                _this.favMenuList._comp._desc = new W.Div({x:0, y:394-204-50, width:314, height:106, display:"-webkit-flex", "-webkit-align-items":"center",
                    "-webkit-justify-content":"center"});
                _this.favMenuList._comp._desc._span = new W.Div({width:314, text:W.Texts["scene_live_trigger_right_text4"], lineHeight:"24px", "white-space":"pre",
                    textColor:"#B5B5B5", opacity:0.75, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"});
                _this.favMenuList._comp._desc.add(_this.favMenuList._comp._desc._span);
                _this.favMenuList._comp.add(_this.favMenuList._comp._desc);

                _this.favMenuList.btn = buttonComp.create(78.5, 527-204, W.Texts["home_menu"] + " " + W.Texts["going"], 158);
                _this.favMenuList._comp._btn = _this.favMenuList.btn.getComp();
                _this.favMenuList.btn.focus();
                _this.favMenuList._comp.add(_this.favMenuList._comp._btn);

                _parentDiv._comp_area._inner.add(_this.favMenuList._comp);

                currComponent = _this.favMenuList;

                if(!_this.contentsList) {
                    _this.favMenuList._title.setStyle({y:51});
                    _this.favMenuList._comp.setStyle({y:51+13});
                }
            }

            if(_this.contentsList) {
                currComponent = _this.contentsList;
                state = TYPE.CONTENTS;
                if(bannerData.length == 1) {
                    _y = [0, -348+136+136, -950+136+136];
                } else if(bannerData.length == 2) {
                    _y = [0, -348+136, -950+136];
                } else {
                    _y = [0, -348, -950];
                }
            } else {
                currComponent = _this.favMenuList;
                posIdx = 1;
                _y = [0, 0, -950+348+116];
                if(isFavMenu) {
                    state = TYPE.FAV_MENU;
                } else {
                    state = TYPE.FAV_EMPTY;
                }
            }

            currComponent.setActive();
            currComponent._comp.setOpacity(1);
            currComponent._title.setOpacity(1);

            _parentDiv._comp_area._inner.setY(_y[posIdx]);

            setTimeout(function(){
                _parentDiv.setStyle({visibility:"visible"});
            });
        }

        var getBannerData = function () {
            uiplfDataManager.getRightBannerList(cbGetBannerData, {offset:0, limit:3});
        };

        var cbGetBannerData = function (isSuccess, result) {
            if (isSuccess) {
                bannerData = result.data;

                if(bannerData.length > 3) {
                    bannerData = bannerData.splice(0,3);
                }

                //getFavoriteData();
            } else {

            }

            if(_this.readytoCreate) {
                continueGetData();
            } else {
                _this.readytoCreate = true;
            }
        };

        var getFavoriteData = function () {
            sdpDataManager.getViewingFavorites(cbGetFavoriteData, {offset:0, limit:18});
        };

        var cbGetFavoriteData = function (isSuccess, result) {
            if (isSuccess) {
                favData = result.data;

                if(favData.length > 18) {
                    favData = favData.splice(0,18);
                }

                //create(bannerData, favData);
            } else {

            }

            if(_this.readytoCreate) {
                continueGetData();
            } else {
                _this.readytoCreate = true;
            }
        };

        var continueGetData = function() {
            create(bannerData, favData);
        }

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.COLOR_KEY_R,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR]);

                _parentDiv = new W.Div({className : "bg_size", visibility:"hidden"});

                _parentDiv._bg = new W.Image({x:534,y:0,width:746,height:720, src:"img/bg_arr_r.png"});
                _parentDiv.add(_parentDiv._bg);

                _parentDiv._comp_area = new W.Div({id:"comp_area", x:876, y:0, width:323, height:720, overflow:"hidden"});
                _parentDiv.add(_parentDiv._comp_area);

                _parentDiv._comp_area._inner = new W.Div({id:"comp_area_inner", x:0, y:0, width:323});

                _parentDiv._comp_area.add(_parentDiv._comp_area._inner);
                _this.add(_parentDiv);

                _this.readytoCreate = false;

                getBannerData();
                getFavoriteData();
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
                        break;
                    case W.KEY.UP:
                        if(!currComponent.operate(event)) {
                           if(state == TYPE.CONTENTS) {
                               if(isFavMenu) {
                                   if(_this.favMenuList.getLength() > 8) {
                                       posIdx = 2;
                                   } else {
                                       posIdx = 1;
                                   }
                                   _this.favMenuList.setIdx(_this.favMenuList.getLength()%2 == 1 ? _this.favMenuList.getLength()-1 : _this.favMenuList.getLength()-2);
                                   _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                   changeState();
                               } else {
                                   posIdx = 1;
                                   _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                   changeState();
                                   currComponent.setActive();
                               }
                           } else if(state == TYPE.FAV_MENU) {
                               if(posIdx == 1) {
                                   if(_this.contentsList) {
                                       _this.contentsList.setIdx(_this.contentsList.getLength()-1);
                                       changeState();
                                       posIdx = 0;
                                       _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                   } else {
                                       if(_this.favMenuList.getLength() > 8) {
                                           posIdx = 2;
                                       } else {
                                           posIdx = 1;
                                       }
                                       _this.favMenuList.setIdx(_this.favMenuList.getLength()%2 == 1 ? _this.favMenuList.getLength()-1 : _this.favMenuList.getLength()-2);
                                       currComponent.setActive();
                                       _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                   }
                               } else if(posIdx == 2) {
                                   posIdx = 1;
                                   _parentDiv._comp_area._inner.setY(_y[posIdx]);
                               } else {
                                   _parentDiv._comp_area._inner.setY(_y[posIdx]);
                               }
                           } else {
                               if(_this.contentsList) {
                                   _this.contentsList.setIdx(_this.contentsList.getLength()-1);
                                   changeState();
                                   posIdx = 0;
                                   _parentDiv._comp_area._inner.setY(_y[posIdx]);
                               }
                           }
                        };
                        break;
                    case W.KEY.DOWN:
                        if(!currComponent.operate(event)) {
                            if(state == TYPE.CONTENTS) {
                                if(isFavMenu) {
                                    posIdx = 1;
                                    _this.favMenuList.setIdx(0);
                                    changeState();
                                    _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                } else {
                                    posIdx = 1;
                                    _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                    changeState();
                                    currComponent.setActive();
                                }
                            } else if(state == TYPE.FAV_MENU) {
                                if(currComponent.getLength() > 8 && posIdx == 1) {
                                    posIdx = 2;
                                    _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                } else {
                                    if(_this.contentsList) {
                                        _this.contentsList.setIdx(0);
                                        changeState();
                                        posIdx = 0;
                                        _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                    } else {
                                        posIdx = 1;
                                        _this.favMenuList.setIdx(0);
                                        currComponent.setActive();
                                        _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                    }
                                }
                            } else {
                                if(_this.contentsList) {
                                    _this.contentsList.setIdx(0);
                                    changeState();
                                    posIdx = 0;
                                    _parentDiv._comp_area._inner.setY(_y[posIdx]);
                                }
                            }
                        };
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
                }

            },
            onPopupClosed: function(event){
            },
        });
    });
