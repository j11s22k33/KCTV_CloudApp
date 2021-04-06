/**
 * @fileOverview (created on 18. 3.) Provides information about the entire file.
 *
 * KidsHome
 *
 * @class KidsHome
 * @constructor
 * @author yj.yoon
 * Copyright (c) 1997-2018 Alticast, Inc. All rights reserved.
 */
/* global W */
W.defineModule("comp/kids/KidsHome", ['mod/Util', 'comp/kids/Poster', 'comp/kids/Circle', 'comp/kids/Keyword', "comp/CouponInfo"],
    function (util, Poster, Circle, Keyword, couponInfoComp) {
        'use strict';
        function KidsHome() {
            var _thisScene = "KidsHomeScene";
            var sdpDataManager = W.getModule("manager/SdpDataManager");
            var recoDataManager = W.getModule("manager/RecommendDataManager");

            var backCallbackFunc;
            var mode = 0;
            var tops = [465, 255, 0];
            var opacity = [1, 1, 1];
            var fontSize = [18, 18, 24];
            var yPos = [72, 72, 55];

            var listHeight = [306, 377, 377, 377, 306, 223];
            var rowCount = [4, 5, 5, 5, 4, 3];
            var rowWidth = [210, 180, 180, 180, 210, 264];

            var _comp;

            var _this;

            var couponInfo = couponInfoComp.getNewComp(true);

            var childCategory = [];

            var MAX_ROW = [10, 6, 6, 6, 6, 6];
            
            var entryInfo;

            var changeY = function () {
                W.log.info("changeY mode == " + mode);
                W.Util.setStyle(_comp, {y: tops[mode], opacity: opacity[mode]});
            };

            W.log.info("### Initializing " + _thisScene + " scene ###");

            var _comp;

            var initList = function () {
                if (!_this.list) {
                    var listObj = {};
                    listObj.listArray = [];
                    listObj.listPosition = [];
                    listObj._comp = new W.Div({});
                } else {
                    var listObj = _this.list;
                }

                W.Loading.start();
                if(_this.param && _this.param.children && _this.param.children.length > 0) {
                    for (var i = 0; i < _this.param.children.length; i++) {

                        //type 0 : character, 1 : poster-no see more, 2 : poster-have see more, 3: movies, 4 : channel, 5 : keyword
                        if(_this.param.children[i].categoryCode == "CC0401") {
                            // getMenuDetail({categoryId : _this.param.children[i].categoryId});
                            var idx = i;
                            recoDataManager.getKidsCharacter(function(isSucess, result){
                                if(isSucess && result && result.categories) {
                                    _this.recoData = result.categories;
                                }
                                getMenuTree({categoryId : _this.param.children[idx].categoryId, depth:0}, null, idx);
                            })
                            _this.param.children[i].type  = 0;
                        } else if(_this.param.children[i].categoryCode == "CC0402") {
                            getRecentViewing({offset:0, limit : 7, category:"07"}, null, i);
                            _this.param.children[i].type  = 2;
                        } else if(_this.param.children[i].categoryCode == "CC0403") {
                            getMenuTree({categoryId : _this.param.children[i].categoryId, depth:0}, null, i);
                            _this.param.children[i].type  = 5;
                        } else if(_this.param.children[i].categoryCode == "CC0404") {
                            getCategoryTopN({categoryId : _this.param.children[i].categoryId, offset:0, limit : 7}, null, i);
                            _this.param.children[i].type  = 2;
                        } else if(_this.param.children[i].categoryCode == "CC0405") {
                            getCategoryChannels({categoryId : _this.param.children[i].categoryId, offset:0, limit : 0, selector:"@detail"}, null, i);
                            _this.param.children[i].type  = 4;
                        } else {
                            _this.param.children.splice(i,1);
                            i--;
                        }
                    }

                    return listObj;
                } else {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code: "1001",
    					from : "SDP"
                    });
                }
            };

            var createList = function () {
                if (!_this.list) {
                    var listObj = {};
                    listObj.listArray = [];
                    listObj._comp = new W.Div({});
                } else {
                    var listObj = _this.list;
                }

                var _y = 174;
                var pageHeight = 65;
                var pageY = 174;
                listObj.pageY = [_y];
                var pageIdx = 0;
                for (var i = 0; i < _this.param.children.length; i++) {
                    if (_this.param.children[i].type == 0) {

                        if(_this.recoData) {
                            for(var k = _this.recoData.length-1; k >=0; k--) {
                                for(var j in _this.param.children[i].children) {
                                    if(_this.recoData[k].categoryId == _this.param.children[i].children[j].baseId) {
                                        _this.param.children[i].children[j].isRec = true;
                                        _this.param.children[i].children.splice(0,0,_this.param.children[i].children.splice(j,1)[0]);
                                        break;
                                    }
                                }
                            }
                        }

                        if (!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex + 3)) {
                            listObj.listArray[i] = createCircleList(_this.param.children[i], 0, null);
                            listObj.listArray[i]._comp.setY(_y);
                            listObj.listArray[i]._comp.y = (_y);
                            listObj._comp.add(listObj.listArray[i]._comp);

                            _this.listFocusIndex[i] = 0;
                            _this.listLeftIndex[i] = 0;
                        }
                    } else if (_this.param.children[i].type == 4) {
                        if (!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex + 3)) {
                            listObj.listArray[i] = createCircleList(_this.param.children[i], 0);
                            listObj.listArray[i]._comp.setY(_y);
                            listObj.listArray[i]._comp.y = (_y);
                            listObj._comp.add(listObj.listArray[i]._comp);

                            _this.listFocusIndex[i] = 0;
                            _this.listLeftIndex[i] = 0;
                        }
                    } else if (_this.param.children[i].type == 5) {
                        if (!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex + 3)) {
                            listObj.listArray[i] = createKeywordList(_this.param.children[i], 0);
                            listObj.listArray[i]._comp.setY(_y);
                            listObj.listArray[i]._comp.y = (_y);
                            listObj._comp.add(listObj.listArray[i]._comp);

                            _this.listFocusIndex[i] = 0;
                            _this.listLeftIndex[i] = 0;
                        }
                    } else {
                        if (!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex + 3)) {
                            listObj.listArray[i] = createPosterList(_this.param.children[i], 0);
                            listObj.listArray[i]._comp.setY(_y);
                            listObj.listArray[i]._comp.y = (_y);
                            listObj._comp.add(listObj.listArray[i]._comp);

                            _this.listFocusIndex[i] = 0;
                            _this.listLeftIndex[i] = 0;
                        }
                    }
                    _y += listHeight[_this.param.children[i].type];

                    if (listObj.listArray[i] && listObj.listArray[i]._comp) {
                        pageHeight += listHeight[_this.param.children[i].type];
                        if (pageHeight > 632) {
                            pageIdx++;
                            listObj.pageY[pageIdx] = listObj.listArray[i]._comp.y;
                            pageHeight = listHeight[_this.param.children[i].type];
                        } else {
                        }

                        listObj.listArray[i].pageIdx = pageIdx;

                        if (i == _this.param.children.length - 1) {
                            listObj.pageY[pageIdx] = listObj.listArray[i]._comp.y - (643 - listHeight[_this.param.children[i].type]);
                        }
                    }
                }

                //return listObj;
            };

            var setList = function(_index, _data) {
                if (!_this.list) {
                    var listObj = {};
                    listObj.listArray = [];
                    listObj._comp = new W.Div({});
                } else {
                    var listObj = _this.list;
                }
                if(_data && _data.length > 0) {
                    _this.param.children[_index].children = _data;
                } else {
                    _this.param.children[_index].children = [];
                }

                for(var i = 0; i < _this.param.children.length; i++) {
                    if(!_this.param.children[i].children) {
                        return;
                    }
                }
                for(var i = 0; i < _this.param.children.length; i++) {
                    if(_this.param.children[i].children.length < 1) {
                        _this.param.children.splice(i,1);
                        i--;
                    }
                }
                if(_this && _this.param && _this.param.children && _this.param.children.length > 0) {
                    createList();

                    _this.list.listArray[_this.listIndex].itemArray[_this.listFocusIndex[_this.listIndex]].setFocus();

                    /*if(mode == 0) {
                        _this.list.listArray[0]._comp._listTitle_f.setDisplay("none");
                        _this.list.listArray[0]._comp._listTitle.setDisplay("none");
                    } else {
                        _this.list.listArray[0]._comp._listTitle_f.setDisplay("none");
                        _this.list.listArray[0]._comp._listTitle.setDisplay("block");

                        _this.list.listArray[_this.listIndex]._comp._listTitle_f.setDisplay("block");
                        _this.list.listArray[_this.listIndex]._comp._listTitle.setDisplay("none");
                    }*/

                    _this.changeMode(mode);
                } else {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code: "1001",
    					from : "SDP"
                    });
                }
                W.Loading.stop();
            }

            var getMenuDetail = function(reqData, callback, index) {
                sdpDataManager.getMenuDetail(cbGetMenuDetail, reqData, callback, index);
            };

            var cbGetMenuDetail = function(isSuccess, result, param, param2) {
                if(isSuccess) {
                    if(result) {
                        if(param2 != undefined) {
                            setList(param2, result.data);
                        }
                        if(param && param.callback) param.callback(result);
                    }
                } else {
                    setList(param2);
                }

            };

            var getRecentViewing = function(reqData, callback, index) {
                sdpDataManager.getRecentViewing(cbGetRecentViewing, reqData, callback, index);
            };

            var cbGetRecentViewing = function(isSuccess, result, param, param2) {
                if(isSuccess) {
                    if(result) {
                        if(param2 != undefined) {
                            setList(param2, result.data);
                        }
                        if(param && param.callback) param.callback(result);
                    }
                } else {
                    setList(param2);
                }

            };

            var getMenuTree = function(reqData, callback, index) {
            	reqData.selector = "@detail";
                sdpDataManager.getMenuTree(cbGetMenuTree, reqData, callback, index);
            };

            var cbGetMenuTree = function(isSuccess, result, param, param2) {
                if(isSuccess) {
                    if(result) {
                        if(param2 != undefined) {
                            setList(param2, result.data);
                        }
                        if(param && param.callback) param.callback(result);
                    }
                } else {
                    setList(param2);
                }

            };

            var getCategoryTopN = function(reqData, callback, index) {
                sdpDataManager.getCategoryTopn(cbGetCategoryTopN, reqData, callback, index);
            };

            var cbGetCategoryTopN = function(isSuccess, result, param, param2) {
                if(isSuccess) {
                    if(result) {
                        if(param2 != undefined) {
                            setList(param2, result.data);
                        }
                        if(param && param.callback) param.callback(result);
                    }
                } else {
                    setList(param2);
                }

            };

            var getCategoryChannels = function(reqData, callback, index) {
                sdpDataManager.getCategoryChannels(cbGetCategoryChannels, reqData, callback, index);
            };

            var cbGetCategoryChannels = function(isSuccess, result, param, param2) {
                if(isSuccess) {
                    if(result) {
                        if(param2 != undefined) {
                            setList(param2, result.data);
                        }
                        if(param && param.callback) param.callback(result);
                    }
                } else {
                    setList(param2);
                }

            };

            var makeList = function() {
                _this.setListFocus();
            };

            var checkList = function (i) {
                if (_this.param.children[i].type == 0) {
                    createCircleList(_this.param.children[i], _this.listLeftIndex[i], _this.list.listArray[i]);
                } else if (_this.param.children[i].type == 4) {
                    createCircleList(_this.param.children[i], _this.listLeftIndex[i], _this.list.listArray[i]);
                } else if (_this.param.children[i].type == 5) {
                    createKeywordList(_this.param.children[i], _this.listLeftIndex[i], _this.list.listArray[i]);
                } else {
                    createPosterList(_this.param.children[i], _this.listLeftIndex[i], _this.list.listArray[i]);
                }
            };

            var createCircleList = function (data, idx, existList, recData) {
                if (existList) {
                    var listObj = existList;
                } else {
                    var listObj = {};
                    listObj.itemArray = [];
                    listObj._comp = new W.Div({x: 66});
                    listObj._comp._inner = new W.Div({x: 0, y: 0});
                    listObj._comp._listTitle = new W.Div({x: 0, y: 0});
                    //listObj._comp._listTitle.add(new W.Image({x: 51 - 66, y: 416 - 444, src: "img/kids_title_bg.png"}));
                    listObj._comp._listTitle.add(new W.Span({
                        x: 60 - 66,
                        y: 400 - 444,
                        width: 500,
                        text: data.title,
                        textColor: "rgba(255,255,255,0.5)",
                        fontFamily: "RixHeadM",
                        "font-size": "22px",
                        textAlign: "left"
                    }));
                    listObj._comp.add(listObj._comp._listTitle);
                    listObj._comp._listTitle_f = new W.Div({x: 0, y: 0, width:1000, display: "none"});
                    listObj._comp._listTitle_f.add(new W.Span({
                        position:"relative",
                        x: 56 - 66,
                        y: 49 - 109,
                        text: data.title,
                        textColor: "rgba(0,231,234,1)",
                        fontFamily: "RixHeadM",
                        "font-size": "22px",
                        textAlign: "left"
                    }));
                    listObj._comp._listTitle_f._star = new W.Image({
                        position:"relative",
                        x: 56 - 66,
                        y: 147 - 195,
                        src: "img/07_title_acc.png",
                        //visibility: data.isPinned ? "" : "hidden"
                    });
                    listObj._comp._listTitle_f.add( listObj._comp._listTitle_f._star);
                    listObj._comp.add(listObj._comp._listTitle_f);
                }

                for (var i = idx; i < data.children.length && i < idx + MAX_ROW[data.type] && i < MAX_ROW[data.type]; i++) {
                    if (!listObj.itemArray[i]) {
                        listObj.itemArray[i] = new Circle({
                            type: data.type == 0 ? Circle.TYPE.CHARACTER : Circle.TYPE.CHANNEL,
                            data: data.children[i],
                            idx: i
                        });
                        listObj.itemArray[i]._comp = listObj.itemArray[i].getComp();
                        listObj.itemArray[i]._comp.setStyle({x: 210 * i});
                        listObj._comp._inner.add(listObj.itemArray[i]._comp);
                    }
                }

                if (data.children.length > MAX_ROW[data.type] && !listObj._comp._seemore) {
                    listObj._comp._seemore = new W.Div({x: 0 + 210 * MAX_ROW[data.type]});
                    listObj._comp._seemore.add(new W.Image({
                        width: "112px",
                        height: "132px",
                        x: 0,
                        y: 272 - 236,
                        src: "img/07_see_more.png"
                    }));
                    listObj._comp._inner.add(listObj._comp._seemore);
                }
                if (!existList) {
                    listObj._comp.add(listObj._comp._inner);
                    return listObj;
                }
            };

            var createPosterList = function (data, idx, existList) {
                if (existList) {
                    var listObj = existList;
                } else {
                    W.log.info(data)
                    var listObj = {};
                    listObj.itemArray = [];
                    listObj._comp = new W.Div({x: 66});
                    listObj._comp._inner = new W.Div({x: 0, y: 0});
                    listObj._comp._listTitle = new W.Div({x: 0, y: 0});
                    //listObj._comp._listTitle.add(new W.Image({x: 51 - 66, y: 65 - 109, src: "img/kids_title_bg.png"}));
                    listObj._comp._listTitle.add(new W.Span({
                        x: 60 - 66,
                        y: 49 - 109,
                        width: 500,
                        text: data.title,
                        textColor: "rgba(255,255,255,0.5)",
                        fontFamily: "RixHeadM",
                        "font-size": "22px",
                        textAlign: "left"
                    }));
                    listObj._comp.add(listObj._comp._listTitle);
                    listObj._comp._listTitle_f = new W.Div({x: 0, y: -15, width:1000, display: "none"});
                    listObj._comp._listTitle_f.add(new W.Span({
                        position:"relative",
                        x: 56 - 66,
                        y: 49 - 109,
                        text: data.title,
                        textColor: "rgba(0,231,234,1)",
                        fontFamily: "RixHeadM",
                        "font-size": "22px",
                        textAlign: "left"
                    }));
                    listObj._comp._listTitle_f._star = new W.Image({
                        position:"relative",
                        x: 56 - 66,
                        y: 147 - 195,
                        src: "img/07_title_acc.png",
                        //visibility: data.isPinned ? "" : "hidden"
                    });
                    listObj._comp._listTitle_f.add( listObj._comp._listTitle_f._star);
                    listObj._comp.add(listObj._comp._listTitle_f);
                }

                for (var i = idx; i < data.children.length && i < idx + MAX_ROW[data.type] && i < MAX_ROW[data.type]; i++) {
                    W.log.info(data.children[i])
                    if (!listObj.itemArray[i]) {
                        listObj.itemArray[i] = new Poster({type: Poster.TYPE.W140, data: data.children[i], idx: i,
                            isWatched : data.categoryCode == "CC0402" ? true : false, textAlign:i%MAX_ROW[data.type]>=MAX_ROW[data.type]-2 ? "right":""});
                        listObj.itemArray[i]._comp = listObj.itemArray[i].getComp();
                        listObj.itemArray[i]._comp.setStyle({x: 180 * i});
                        listObj._comp._inner.add(listObj.itemArray[i]._comp);
                    }
                }

                if (data.type != 1 && data.children.length > MAX_ROW[data.type] && !listObj._comp._seemore) {
                    listObj._comp._seemore = new W.Div({x: 0 + 180 * MAX_ROW[data.type]});
                    listObj._comp._seemore.add(new W.Image({
                        width: "112px",
                        height: "132px",
                        x: 0,
                        y: 272 - 236,
                        src: "img/07_see_more.png"
                    }));
                    listObj._comp._inner.add(listObj._comp._seemore);
                }
                if (!existList) {
                    listObj._comp.add(listObj._comp._inner);
                    return listObj;
                }
            };

            var createKeywordList = function (data, idx, existList) {
                if (existList) {
                    var listObj = existList;
                } else {
                    var listObj = {};
                    listObj.itemArray = [];
                    listObj._comp = new W.Div({x: 66});
                    listObj._comp._inner = new W.Div({x: 0, y: 0});
                    listObj._comp._listTitle = new W.Div({x: 0, y: 0});
                    //listObj._comp._listTitle.add(new W.Image({x: 51 - 66, y: 416 - 446, src: "img/kids_title_bg.png"}));
                    listObj._comp._listTitle.add(new W.Span({
                        x: 60 - 66,
                        y: 401 - 446,
                        width: 500,
                        text: data.title,
                        textColor: "rgba(255,255,255,0.5)",
                        fontFamily: "RixHeadM",
                        "font-size": "22px",
                        textAlign: "left"
                    }));
                    listObj._comp.add(listObj._comp._listTitle);
                    listObj._comp._listTitle_f = new W.Div({x: 0, y: 0, width:1000, display: "none"});
                    listObj._comp._listTitle_f.add(new W.Span({
                        position:"relative",
                        x: 56 - 66,
                        y: 49 - 109,
                        text: data.title,
                        textColor: "rgba(0,231,234,1)",
                        fontFamily: "RixHeadM",
                        "font-size": "22px",
                        textAlign: "left"
                    }));
                    listObj._comp._listTitle_f._star = new W.Image({
                        position:"relative",
                        x: 56 - 66,
                        y: 147 - 195,
                        src: "img/07_title_acc.png",
                        //visibility: data.isPinned ? "" : "hidden"
                    });
                    listObj._comp._listTitle_f.add( listObj._comp._listTitle_f._star);
                    listObj._comp.add(listObj._comp._listTitle_f);
                }

                for (var i = idx; i < data.children.length && i < idx + MAX_ROW[data.type] && i < MAX_ROW[data.type]; i++) {
                    if (!listObj.itemArray[i]) {
                        listObj.itemArray[i] = new Keyword({type: Keyword.TYPE.MENU, data: data.children[i], idx: i});
                        listObj.itemArray[i]._comp = listObj.itemArray[i].getComp();
                        listObj.itemArray[i]._comp.setStyle({x: 264 * i});
                        listObj._comp._inner.add(listObj.itemArray[i]._comp);
                    }
                }

                if (data.type != 1 && data.children.length > MAX_ROW[data.type] && !listObj._comp._seemore) {
                    listObj._comp._seemore = new W.Div({x: 0 + 264 * MAX_ROW[data.type]});
                    listObj._comp._seemore.add(new W.Image({
                        width: "112px",
                        height: "132px",
                        x: 0,
                        y: 0,
                        src: "img/07_see_more.png"
                    }));
                    listObj._comp._inner.add(listObj._comp._seemore);
                }
                if (!existList) {
                    listObj._comp.add(listObj._comp._inner);
                    return listObj;
                }
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
                } else if((!_this.isClearPin && W.StbConfig.adultMenuUse && category.isAdult) || category.isAdultOnly) {
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
                var checkData = content.asset ? content.asset : content;
                if(!_this.isClearPin && ((W.StbConfig.adultMenuUse &&checkData.isAdult)
                    || (checkData.rating && util.getRating() && checkData.rating >= util.getRating()))) {
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
                if(entryInfo){
                    W.entryPath.push(entryInfo.target, entryInfo.data, entryInfo.from);
                }
                param.callback = function() {
                    if(_this.parent) _this.parent.setDisplay("none");
                }
                if(sceneName){
                    W.SceneManager.startScene({
                        sceneName: sceneName,
                        param: param,
                        backState: W.SceneManager.BACK_STATE_KEEPSHOW
                    });
                }
            };

            function openSidePopup() {
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

                        var categoryPath = W.entryPath.getCategoryPath(_this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]].title);
                        var btnName = _this.param.children[_this.listIndex].isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
                        if(_this.param.children[_this.listIndex].categoryCode == "CC0401") {
                            popupData.options.push({
                                name: categoryPath,
                                param:"BOOKMARK",
                                subOptions: [
                                    {type:"box", name:btnName}
                                ]
                            });
                        } else if(_this.param.children[_this.listIndex].categoryCode == "CC0402") {
                            categoryPath = W.entryPath.getCategoryPath(_this.param.children[_this.listIndex].title);
                            var data = _this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]];
                            popupData.options.push({
                                name: data.title,
                                param:"ZZIM",
                                subOptions: [//
                                    {type: "box", name: data.seriesId ? W.Texts["option_popup_add_zzim_series2"] : W.Texts["option_popup_add_zzim"]},
                                    {type: "box", name: W.Texts["popup_zzim_move_title"]}
                                ]
                            });
                            popupData.options.push({
                                name: categoryPath,
                                param:"BOOKMARK",
                                subOptions: [
                                    {type:"box", name:btnName}
                                ]
                            });

                        } else if(_this.param.children[_this.listIndex].categoryCode == "CC0403") {
                            popupData.options.push({
                                name: categoryPath,
                                param:"BOOKMARK",
                                subOptions: [
                                    {type:"box", name:btnName}
                                ]
                            });
                        } else if(_this.param.children[_this.listIndex].categoryCode == "CC0404") {
                            categoryPath = W.entryPath.getCategoryPath(_this.param.children[_this.listIndex].title);
                            var data = _this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]];
                            popupData.options.push({
                                name: data.title,
                                param:"ZZIM",
                                subOptions: [//
                                    {type: "box", name: data.seriesId ? W.Texts["option_popup_add_zzim_series2"] : W.Texts["option_popup_add_zzim"]},
                                    {type: "box", name: W.Texts["popup_zzim_move_title"]}
                                ]
                            });
                            popupData.options.push({
                                name: categoryPath,
                                param:"BOOKMARK",
                                subOptions: [
                                    {type:"box", name:btnName}
                                ]
                            });
                        } else if(_this.param.children[_this.listIndex].categoryCode == "CC0405") {
                            var data = _this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]];
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

            this.getComp = function (callback) {
                if (callback) backCallbackFunc = callback;
                return _comp;
            };
            this.show = function () {
                //_comp.setVisible(true);
                W.log.info("KidsHome show");

                _comp.setDisplay("block");
            };
            this.hide = function () {
                _comp.setDisplay("none");
                W.log.info("KidsHome hide");
            };
            this.create = function (callback, param, _parent) {
                W.log.info("create !!!!");
                backCallbackFunc = callback;
                _this = this;

                _this.param = param;
                _this.parent = _parent;
                W.log.info(param, _parent);

                _this.listIndex = 0;
                _this.listFocusIndex = [];
                _this.listLeftIndex = [];

                _this.topFocusIndex = 0;

                _this.MODE_TOP = 0;
                _this.MODE_LIST = 1;
                _this.mode = this.MODE_LIST;

                _this.isClearPin = param.isClearPin;

                _comp = new W.Div({x: 0, y: 0, width: 1280, height: 720});
                _comp._bg0 = new W.Image({x:0, y:42, width:1280, height:214, src:"img/00_bg_b_kids0.png"});
                _comp.add(_comp._bg0);
                _comp._bg = new W.Image({x: 0, y: 0, width: 1280, height: 720, src: "img/kid_bg.png", display: "none"});
                _comp.add(_comp._bg);

                _comp._homeTitle = new W.Div({x:0, y:0, width:1280});
                _comp._homeTitle.add(new W.Div({x:0, y:60, width:1280, text:W.Texts["kids_home_guide1"], textColor: "rgba(255,255,255,0.7)",
                    fontFamily: "RixHeadL", "font-size": "20px", textAlign: "center", "letter-spacing": "-1.0px",}));
                _comp._homeTitle.add(new W.Div({x:0, y:90, width:1280, text:W.Texts["kids_home_guide2"],
                    textColor: "rgba(130,130,130,0.7)", fontFamily: "RixHeadL", "font-size": "17px", textAlign: "center", "letter-spacing": "-0.85px",}));
                _comp.add(_comp._homeTitle);

                _comp._inner = new W.Div({x: 15, y: -23, transform:"scale(0.9)", transformOrigin:"left top 0px"});
                _comp.add(_comp._inner);

                _comp._inner._title = new W.Span({
                    x: 56,
                    y: 51,
                    width: 500,
                    text: param.title,
                    textColor: "rgba(255,255,255,1)",
                    fontFamily: "RixHeadB",
                    "font-size": "32px",
                    textAlign: "left",
                    "letter-spacing": "-1.6px",
                    display: "none"
                });
                _comp._inner.add(_comp._inner._title);
                _comp._inner._couponInfo = couponInfo.getComp(592, 38);
                _comp._inner._couponInfo.setStyle({display:"none",zIndex:2});
                _comp._inner.add(_comp._inner._couponInfo);
                _this.list = undefined;

                W.Loading.start();
                W.CloudManager.getUserChannel(function (callbackData) {
                    W.log.info("getUserChannel Recevied ::: ");
                    W.log.info(callbackData);

                    if (callbackData.data) {
                        W.StbConfig.favoriteChannelList = (callbackData.data.favorite != undefined) ? callbackData.data.favorite : {sourceIds:[]};
                        W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                        W.StbConfig.skippedChannelList = (callbackData.data.skipped != undefined) ? callbackData.data.skipped : {sourceIds:[], skipUnsubscribed:false};
                        W.StbConfig.blockedChannelList = (callbackData.data.blocked != undefined) ? callbackData.data.blocked : {sourceIds:[]};
                    } else {

                    }

                    _this.list = initList();//createList();

                    _comp._inner._list = _this.list._comp;
                    _comp._inner.add(_comp._inner._list);
                });



                _comp._bg_t = new W.Image({
                    x: 0,
                    y: 0,
                    width: 1280,
                    height: 78,
                    src: "img/kids_bg_sh_t_width.png",
                    display: "none"
                });
                _comp.add(_comp._bg_t);
                _comp._bg_b = new W.Image({
                    x: 0,
                    y: 560,
                    width: 1280,
                    height: 160,
                    src: "img/kids_bg_sh_b_width.png",
                    display: "none"
                });
                _comp.add(_comp._bg_b);

                _comp._bg_r = new W.Image({x:1123, y:0, width:157, height:720, src:"img/kid_bg_sh_r.png", display: "none"});
                _comp.add(_comp._bg_r);

                _comp._arr_t = new W.Image({
                    x: 1163,
                    y: 45,
                    width: 61,
                    height: 40,
                    src: "img/07_see_more_t.png",
                    display: "none"
                });
                _comp.add(_comp._arr_t);
                _comp._arr_b = new W.Image({
                    x: 1163,
                    y: 637,
                    width: 61,
                    height: 40,
                    src: "img/07_see_more_b.png",
                    display: "none"
                });
                _comp.add(_comp._arr_b);

                W.visibleHomeScene();
                return _comp;
            };
            this.changeMode = function (data) {
                mode = data;
                changeY();

                if (mode == 2) {
                    _comp._inner.setStyle({x:0, y:0, transform:""});
                    _comp._homeTitle.setStyle({display:"none"});
                    if (_this.posterList) _this.posterList.setActive();
                    if (_this.scroll) _this.scroll.setActive();

                    if (_this.listMode == "text") {
                        _comp._posterList.setStyle({height: 549});
                        _comp._posterList._poster.setStyle({y: 0});
                    }
                    _comp._inner._couponInfo.setDisplay("block");
                    _comp._inner._title.setDisplay("block");
                    _comp._bg0.setDisplay("none");
                    _comp._bg.setDisplay("block");
                    _comp._bg_t.setDisplay("block");
                    _comp._bg_b.setDisplay("block");
                    _comp._bg_r.setDisplay("block");

                    var obj;

                    if(_this.list && _this.list.listArray[this.listIndex]) {
                        obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                        obj.setFocus();
                        _this.list.listArray[0]._comp._listTitle_f.setDisplay("none");
                        _this.list.listArray[0]._comp._listTitle.setDisplay("block");

                        _this.list.listArray[_this.listIndex]._comp._listTitle_f.setDisplay("block");
                        _this.list.listArray[_this.listIndex]._comp._listTitle.setDisplay("none");

                        if(_this.list.pageY.length > 1) {
                            if(_this.list.listArray[this.listIndex].pageIdx == 0) {
                                _comp._arr_t.setStyle({display:"none"});
                                _comp._arr_b.setStyle({display:"block"});
                            } else if(_this.list.listArray[this.listIndex].pageIdx == _this.list.pageY.length-1) {
                                _comp._arr_t.setStyle({display:"block"});
                                _comp._arr_b.setStyle({display:"none"});
                            } else {
                                _comp._arr_t.setStyle({display:"block"});
                                _comp._arr_b.setStyle({display:"block"});
                            }
                        } else {
                            _comp._arr_t.setStyle({display:"none"});
                            _comp._arr_b.setStyle({display:"none"});
                        }
                    }
                    couponInfo.setData(null, [{color:"Y", text:W.Texts["kids_mode"]}]);
                } else {
                    _comp._inner.setStyle({x:15, y:-23, transform:"scale(0.9)"});
                    _comp._homeTitle.setStyle({display:"block"});
                    if (_this.posterList) _this.posterList.deActive();
                    if (_this.scroll) _this.scroll.deActive();

                    if (_this.listMode == "text") {
                        _comp._posterList.setStyle({height: 299});
                        _comp._posterList._poster.setStyle({y: -97});
                    }
                    _comp._inner._couponInfo.setDisplay("none");
                    _comp._inner._title.setDisplay("none");
                    _comp._bg0.setDisplay("block");
                    _comp._bg.setDisplay("none");
                    _comp._bg_t.setDisplay("none");
                    _comp._bg_b.setDisplay("none");
                    _comp._bg_r.setDisplay("none");

                    var obj;

                    if(_this.list) {
                        obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                        obj.unFocus();
                        _this.list.listArray[_this.listIndex]._comp._listTitle_f.setDisplay("none");
                        _this.list.listArray[_this.listIndex]._comp._listTitle.setDisplay("block");

                        _this.list.listArray[0]._comp._listTitle_f.setDisplay("none");
                        _this.list.listArray[0]._comp._listTitle.setDisplay("none");

                        _this.listFocusIndex[this.listIndex] = 0;
                        _this.listLeftIndex[this.listIndex] = 0;
                        _this.list.listArray[this.listIndex]._comp._inner.setX(-rowWidth[_this.param.children[this.listIndex].type] * this.listLeftIndex[this.listIndex]);
                    }

                    this.listIndex = 0;

                    _comp._arr_t.setStyle({display:"none"});
                    _comp._arr_b.setStyle({display:"none"});
                }
            };
            this.resume = function(){
                W.log.info("KidsHome resume");
                _comp.setDisplay("block");
                if(this.is2Depth){
                    W.entryPath.pop();
                }
            	//W.entryPath.pop();
            };
            this.hasList = function () {
                if(_this && _this.list && _this.list.listArray && _this.list.listArray.length > 0)
                    return true;
                else return false;
            };
            this.operate = function (evt) {
                W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

                switch (evt.keyCode) {
                    case W.KEY.EXIT:
                        return true;
                    case W.KEY.MENU:
                    case W.KEY.HOME:
                        W.log.info("HOME");
                        return true;
                    case W.KEY.RIGHT:
                        if (this.mode == this.MODE_LIST) {
                            var maxNum = 5;
                            if(_this.param.children[this.listIndex].type == 0) {
                                maxNum = 9;
                            }
                            if (this.listFocusIndex[this.listIndex] == maxNum && _this.param.children[this.listIndex].children.length-1 > maxNum) {
                                this.is2Depth = false;
                                W.SceneManager.startScene({
                                    sceneName: "scene/kids/KidsListScene",
                                    param: {
                                        category: _this.param.children[this.listIndex],
                                        idx: this.listFocusIndex[this.listIndex],
                                        callback : function() {
                                            if( _this.parent) _this.parent.setDisplay("none");
                                        }
                                    },
                                    backState: W.SceneManager.BACK_STATE_KEEPSHOW
                                });
                            } else {
                                this.setListFocus("RIGHT");
                            }
                        }
                        break;
                    case W.KEY.LEFT:
                        if (this.mode == this.MODE_LIST) {
                            this.setListFocus("LEFT");
                        }
                        break;
                    case W.KEY.UP:
                        if (this.mode == this.MODE_LIST) {
                            if (this.listIndex == 0) {
                                return true;
                            } else {
                                this.setListFocus("UP");
                            }
                        }
                        break;
                    case W.KEY.DOWN:
                        if (this.mode == this.MODE_LIST) {
                            this.setListFocus("DOWN");
                        }
                        break;
                    case W.KEY.ENTER:
                        if (this.mode == this.MODE_LIST) {
                            if(_this.param.children[this.listIndex].categoryCode == "CC0401") {
                                this.is2Depth = true;
                                entryInfo = {target:"menu.categoryId", data:_this.param.children[this.listIndex], from:"KidsHome"};
                                checkCategory(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]]);
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0402") {
                                this.is2Depth = true;
                                entryInfo = {target:"menu.categoryId", data:_this.param.children[this.listIndex], from:"KidsHome"};
                                checkContent(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]]);
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0403") {
                                this.is2Depth = true;
                                entryInfo = {target:"menu.categoryId", data:_this.param.children[this.listIndex], from:"KidsHome"};
                                if(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]].isLeaf) {
                                    if(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]].isLink) {
                                        W.entryPath.push("menu.categoryId", _this.param.children[this.listIndex], "KidsHome");
                                        W.LinkManager.action("L", _this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]].link, true);
                                    } else {
                                        checkCategory(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]]);
                                    }
                                } else {
                                    checkCategory(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]]);
                                }
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0404") {
                                this.is2Depth = true;
                                entryInfo = {target:"menu.categoryId", data:_this.param.children[this.listIndex], from:"KidsHome"};
                                checkContent(_this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]]);
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0405") {
                                this.is2Depth = true;
                                W.entryPath.push("menu.categoryId", _this.param.children[this.listIndex], "KidsHome");
                            	if(W.state.isVod){
                					W.PopupManager.openPopup({
                	                    title:W.Texts["popup_zzim_info_title"],
                	                    popupName:"popup/AlertPopup",
                	                    boldText:W.Texts["vod_alert_msg"],
                	                    thinText:W.Texts["vod_alert_msg2"]}
                	                );
                				}else{
                                    W.log.info( _this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]])
                                    W.CloudManager.changeChannel(function () {

                                    }, parseInt(_this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]].sourceId));
                                    W.CloudManager.closeApp();
                				}
                            }
                            break;
                        }

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
                        return true;
                    case W.KEY.BACK:
                        return;
                    case W.KEY.COLOR_KEY_Y:
                        if(_this.param.children[this.listIndex].categoryCode == "CC0402"
                            || _this.param.children[this.listIndex].categoryCode == "CC0404") {
                            var content = _this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]];
                            var checkData = content.asset ? content.asset : content;
                            if(!_this.isClearPin && (W.StbConfig.adultMenuUse && checkData.isAdult)) {
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
                                openSidePopup();
                            }
                        } else {
                            openSidePopup();
                        }
                        break;
                    default :
                } // end of switch()

                return true;
            };
            this.setListFocus = function (direction) {
                if (direction && (direction == "UP" || direction == "DOWN")) {

                    if (direction == "DOWN") {
                        if (this.listIndex + 1 > _this.param.children.length - 1) return;
                    } else {
                        if (this.listIndex - 1 < 0) return;
                    }

                    var obj;

                    obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                    obj.unFocus();
                    _this.list.listArray[this.listIndex]._comp._listTitle_f.setDisplay("none");
                    _this.list.listArray[this.listIndex]._comp._listTitle.setDisplay("block");
                    _this.listFocusIndex[this.listIndex] = 0;
                    _this.listLeftIndex[this.listIndex] = 0;
                    _this.list.listArray[this.listIndex]._comp._inner.setX(-rowWidth[_this.param.children[this.listIndex].type] * this.listLeftIndex[this.listIndex]);


                    if (direction == "DOWN") {
                        this.listIndex = ++this.listIndex % _this.param.children.length;
                    } else {
                        this.listIndex = (--this.listIndex + _this.param.children.length) % _this.param.children.length;
                    }

                    createList();

                    obj = _this.list.listArray[this.listIndex];

                    if (obj.pageIdx == 0) {
                        _comp._inner.setY(-_this.list.pageY[obj.pageIdx] + 174);
                    } else {
                        _comp._inner.setY(-_this.list.pageY[obj.pageIdx] + 174 - 65);
                    }

                    obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                    obj.setFocus();
                    _this.list.listArray[this.listIndex]._comp._listTitle_f.setDisplay("block");
                    _this.list.listArray[this.listIndex]._comp._listTitle.setDisplay("none");
                    if (this.listIndex == 0) {
                    } else {
                    }

                    if(_this.list.pageY.length > 1) {
                        if(_this.list.listArray[this.listIndex].pageIdx == 0) {
                            _comp._arr_t.setStyle({display:"none"});
                            _comp._arr_b.setStyle({display:"block"});
                        } else if(_this.list.listArray[this.listIndex].pageIdx == _this.list.pageY.length-1) {
                            _comp._arr_t.setStyle({display:"block"});
                            _comp._arr_b.setStyle({display:"none"});
                        } else {
                            _comp._arr_t.setStyle({display:"block"});
                            _comp._arr_b.setStyle({display:"block"});
                        }
                    } else {
                        _comp._arr_t.setStyle({display:"none"});
                        _comp._arr_b.setStyle({display:"none"});
                    }
                } else {
                    if (direction && direction == "RIGHT") {
                        W.log.info(_this.param.children)
                        if (_this.param.children[this.listIndex].type == 1) {
                            if (this.listFocusIndex[this.listIndex] + 1 > _this.param.children[this.listIndex].children.length - 1) return;
                        } else {
                            if (this.listFocusIndex[this.listIndex] + 1 > (_this.param.children[this.listIndex].children.length > 10 ? 9 : _this.param.children[this.listIndex].children.length - 1)) return;
                        }
                    } else if (direction) {
                        if (this.listFocusIndex[this.listIndex] - 1 < 0) return;
                    }

                    var obj;
                    if (direction) {
                        obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                        obj.unFocus();

                        if (direction == "RIGHT") {
                            this.listFocusIndex[this.listIndex] = ++this.listFocusIndex[this.listIndex];

                            if (this.listLeftIndex[this.listIndex] + rowCount[_this.param.children[this.listIndex].type] < this.listFocusIndex[this.listIndex]) {
                                this.listLeftIndex[this.listIndex] += (rowCount[_this.param.children[this.listIndex].type] + 1);
                                checkList(this.listIndex);
                            }
                        } else {
                            this.listFocusIndex[this.listIndex] = --this.listFocusIndex[this.listIndex];

                            if (this.listLeftIndex[this.listIndex] > this.listFocusIndex[this.listIndex]) {
                                this.listLeftIndex[this.listIndex] -= (rowCount[_this.param.children[this.listIndex].type] + 1);
                                checkList(this.listIndex);
                            }
                        }
                    } else {
                        _this.list.listArray[this.listIndex]._comp._listTitle_f.setDisplay("block");
                        _this.list.listArray[this.listIndex]._comp._listTitle.setDisplay("none");
                    }

                    obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                    obj.setFocus();


                    _this.list.listArray[this.listIndex]._comp._inner.setX(-rowWidth[_this.param.children[this.listIndex].type] * this.listLeftIndex[this.listIndex]);

                }
            };
            this.destroy = function () {
                W.log.info("destroy !!!!");
            };
            this.getMode = function () {
                return mode;
            };
            this.onPopupClosed = function (popup, desc) {
                W.log.info("onPopupClosed ");
                W.log.info(popup,desc);
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
                        if(desc.param && desc.param.param == "ZZIM"){
                            if(desc.param.subOptions == 0){
                                var data =  _this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]];
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
                                        if(result && result.total > 0) {
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
                        }else if(desc.param && desc.param.param == "BOOKMARK"){
                            if(desc.param.subOptions == 0){
                                var category;
                                if(_this.param.children[this.listIndex].categoryCode == "CC0402" || _this.param.children[this.listIndex].categoryCode == "CC0404" || _this.param.children[this.listIndex].categoryCode == "CC0401") {
                                    category =  _this.param.children[this.listIndex];
                                } else {
                                    category =  _this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]];
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
                                        //if(category.isPinned) {
                                        //    _this.list.listArray[_this.listIndex]._comp._listTitle_f._star.setStyle({visibility:"hidden"})
                                        //} else {
                                        //    _this.list.listArray[_this.listIndex]._comp._listTitle_f._star.setStyle({visibility:""})
                                        //}
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
                        } else if(desc.param && desc.param.param == "FAVCH"){
                            var data = _this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]];
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
                        } else if(desc.param && desc.param.param == "DETAIL"){
                            var data = _this.param.children[this.listIndex].children[this.listFocusIndex[this.listIndex]];
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
                } else if (desc.popupName == "popup/guide/MoreInfoPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	W.log.info( _this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]]);
                        if(W.state.isVod){
                            W.PopupManager.openPopup({
                                title:W.Texts["popup_zzim_info_title"],
                                popupName:"popup/AlertPopup",
                                boldText:W.Texts["vod_alert_msg"],
                                thinText:W.Texts["vod_alert_msg2"]}
                            );
                        }else{
                            W.CloudManager.changeChannel(function () {

                            }, parseInt(_this.param.children[_this.listIndex].children[_this.listFocusIndex[_this.listIndex]].sourceId));
                            W.CloudManager.closeApp();
                        }
                    }
                } else if (desc.popupName == "popup/kids/PinPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        W.log.info(popup, desc)
                        var data = desc.param;
                        _this.isClearPin = true;

                        for(var i = 0; i < _this.list.listArray.length; i++) {
                            if(_this.list.listArray[i] && _this.list.listArray[i].itemArray && _this.list.listArray[i].itemArray.length > 0) {
                                for(var j = 0; j < _this.list.listArray[i].itemArray.length; j++) {
                                    if(_this.list.listArray[i].itemArray[j] && _this.list.listArray[i].itemArray[j].releaseRestrict) {
                                        _this.list.listArray[i].itemArray[j].releaseRestrict();
                                    }
                                }
                            }
                        }
                        data.isClearPin = _this.isClearPin;

                        if(desc.param.type == "sideOption") {
                            openSidePopup();
                        } else {
                            if(_this.param.children[this.listIndex].categoryCode == "CC0401") {
                                startScene("scene/kids/KidsListScene", data);
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0402") {
                                startScene("scene/kids/KidsVodDetailScene", data);
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0403") {
                                startScene("scene/kids/KidsListScene", data);
                            } else if(_this.param.children[this.listIndex].categoryCode == "CC0404") {
                                startScene("scene/kids/KidsVodDetailScene", data);
                            }
                        }
                    }
                }
            };
            this.componentName = "KidsHome";
        }

        return {
            getNewComp: function () {
                return new KidsHome();
            }
        }

    });
