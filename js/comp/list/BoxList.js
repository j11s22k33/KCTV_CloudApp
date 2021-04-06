W.defineModule("comp/list/BoxList", ["mod/Util", "comp/list/Box", "comp/list/BoxBanner"], function(util, Box, Banner) {
    function BoxList(_param) {
        var _this = this;

        var backCallbackFunc;
        var mode = 0;
        var tops = [402, 188, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var type;
        var posterType;
        var posterGapX, posterGapY;

        var index = 0;
        var _comp;

        var data, bannerData, isLooping;
        var isZzim;

        var COLUMN_COUNT = 4;

        var selectedArray = [];

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        //var BANNER_TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
        var MODE_TYPE = Object.freeze({POSTER:0, BANNER:1});

        var create = function(){
            type = _param.type;
            data = _param.data;
            isZzim = _param.isZzim;
            if(_param.bannerData) {
                bannerData = _param.bannerData;
            }
            isLooping = true;

            if(type == BoxList.TYPE.SEARCH) {
                posterType = Box.TYPE.W113;
                posterGapX = 123;
                posterGapY = 249;
            } else if(type == BoxList.TYPE.PLAYLIST) {
                posterType = Box.TYPE.W113;
                posterGapX = 123;
                posterGapY = 249;
            } else if(type == BoxList.TYPE.PURCHASE) {
                posterType = Box.TYPE.W136;
                posterGapX = 151;
                posterGapY = 284;
            } else if(type == BoxList.TYPE.WATCHEDLIST) {
                posterType = Box.TYPE.W136;
                posterGapX = 151;
                posterGapY = 284;
            } else {
                posterType = Box.TYPE.W214;
                posterGapX = 224;
                posterGapY = 130;
            }

            _this.posterIndex = 0;
            if(_param.startIdx){
            	_this.posterIndex = _param.startIdx;
            }
            _this.curRowIndex = 0;
            _this.topRowIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({x:0, y:0, width:"1280", height:"720px", overflow:"hidden"});
            _comp._innerDiv = new W.Div({});

            _this.posters = [];
            _comp._postersComp = [];
            _comp._postersRowComp = [];
            //TODO 프로모션 배너 있을때

            _this.firstRowCount;

            if(type == BoxList.TYPE.SEARCH || type == BoxList.TYPE.PURCHASE || type == BoxList.TYPE.WATCHEDLIST || !bannerData || (bannerData && bannerData.length < 1)) {
                _this.bannerType = Banner.TYPE.NONE;
                _this.firstRowCount = 4;
            } else if(bannerData && bannerData[0].bannerSize == 5) {
                _this.bannerType = Banner.TYPE.TYPE_1;
                _this.firstRowCount = 1;
                bannerData[0].type = "banner";
                data.splice(0,0,bannerData[0]);
            } else if(bannerData && bannerData[0].bannerSize == 4 && bannerData.length > 1) {
                _this.bannerType = Banner.TYPE.TYPE_2;
                _this.firstRowCount = 2;
                bannerData[0].type = "banner";
                bannerData[1].type = "banner";
                data.splice(0,0,bannerData[0]);
                data.splice(1,0,bannerData[1]);
            } else if(bannerData && bannerData[0].bannerSize == 4) {
                _this.bannerType = Banner.TYPE.TYPE_3;
                _this.firstRowCount = 3;
                bannerData[0].type = "banner";
                data.splice(0,0,bannerData[0]);
            } else if(true) {
                _this.bannerType = Banner.TYPE.TYPE_4;
                _this.firstRowCount = 3;
                bannerData[0].type = "banner";
                data.splice(2,0,bannerData[0]);
            }

            _this.nextRowIdx = COLUMN_COUNT-_this.firstRowCount;


            var rowCount = -1;
            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                if((i==0) || (_this.nextRowIdx+i)%COLUMN_COUNT == 0) {
                    _comp._postersRowComp[++rowCount] = new W.Div({x:0, y:rowCount*posterGapY, opacity : rowCount < 4 ? 1 : 0.8});
                    _comp._innerDiv.add(_comp._postersRowComp[rowCount]);
                }

                if((_this.bannerType != Banner.TYPE.NONE) && (i < _this.firstRowCount)) {
                    if(data[i].type == "banner") {
                        _this.posters[i] = new Banner({type:_this.bannerType, data:data[i]});

                        _comp._postersComp[i] = _this.posters[i].getComp();
                        _comp._postersComp[i].setStyle({x:_x});
                        if(_this.bannerType == Banner.TYPE.TYPE_1) _x += 529;
                        else if(_this.bannerType == Banner.TYPE.TYPE_2) _x += 448;
                        else _x += posterGapX*2;
                    } else {
                        _this.posters[i] = new Box({type:posterType, data:data[i], isZzim:isZzim});

                        _comp._postersComp[i] = _this.posters[i].getComp();
                        _comp._postersComp[i].setStyle({x:_x});
                        _x += posterGapX;
                    }
                } else {
                    _this.posters[i] = new Box({type:posterType, data:data[i],
                        isSelectable : type == BoxList.TYPE.PLAYLIST ? true : false, isPurchase : type == BoxList.TYPE.PURCHASE ? true : false,
                        isWatched : type == BoxList.TYPE.WATCHEDLIST ? true : false, isZzim:isZzim});

                    _comp._postersComp[i] = _this.posters[i].getComp();
                    _comp._postersComp[i].setStyle({x:posterGapX*((_this.nextRowIdx+i)%COLUMN_COUNT)});
                }

                _comp._postersRowComp[rowCount].add(_comp._postersComp[i]);
            }
            //_this.posterList = new Box(data);
            //_comp._posterList = _this.posterList.getComp();

            //_comp.add(_comp._posterList);
            _comp.add(_comp._innerDiv);
        };

        var unFocus = function(idx) {
            if(_this.posters && _this.posters[idx]) _this.posters[idx].unFocus();
        };

        var setFocus = function(idx) {
            if(_this.posters && _this.posters[idx]) _this.posters[idx].setFocus();
        };

        var unFocusAll = function() {
            if(_this.posters && _this.posters.length > 0) {
                for(var i = 0; i < _this.posters.length; i++) {
                    unFocus(i);
                }
            }
        }

        var setActive = function() {
            _this.isActive = true;
            setFocus(_this.posterIndex);
        };

        var deActive = function() {
            _this.isActive = false;
            unFocusAll();
        };

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    unFocus(_this.posterIndex);
                    if(type == BoxList.TYPE.PLAYLIST) {
                        if(_this.posterIndex == _this.posters.length-1 || (_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == COLUMN_COUNT-1) {
                            return false;
                        }
                    }

                    if(_this.posterIndex+1 > _this.posters.length-1) {
                        //if(_this.bannerType == Banner.TYPE.NONE) {
                            _this.curRowIndex = 0;
                            _this.topRowIndex = 0;
                            _this.posterIndex = 0;
                        //} else {

                        //}

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.8});
                        }
                    } else {
                        _this.posterIndex++;

                        if((_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == 0) {
                            //TODO 다음줄로 넘어갔을때 처리
                            _this.curRowIndex++;

                            if(_this.curRowIndex > _this.topRowIndex+3) {
                                _this.topRowIndex = _this.curRowIndex;
                                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                                for(var i = 0; i < _comp._postersRowComp.length; i++) {
                                    if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                                        _comp._postersRowComp[i].setStyle({opacity:1});
                                    else
                                        _comp._postersRowComp[i].setStyle({opacity:0.8});
                                }
                            }
                        }
                    }


                    setFocus(_this.posterIndex);
                    return true;
                    break;
                case W.KEY.LEFT:
                    unFocus(_this.posterIndex);
                    if(_this.posterIndex == 0 || (_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == 0) {
                        return false;
                    }

                    _this.posterIndex--;

                    if((_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == COLUMN_COUNT-1) {
                        _this.curRowIndex--;

                        if(_this.curRowIndex < _this.topRowIndex) {
                            _this.topRowIndex = _this.topRowIndex-4 < 0 ? 0 : _this.topRowIndex-4;
                            _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                            for(var i = 0; i < _comp._postersRowComp.length; i++) {
                                if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                                    _comp._postersRowComp[i].setStyle({opacity:1});
                                else
                                    _comp._postersRowComp[i].setStyle({opacity:0.8});
                            }
                        }
                    }
                    setFocus(_this.posterIndex);
                    return true;
                    break;
                case W.KEY.UP:
                    unFocus(_this.posterIndex);
                    if(_this.posterIndex - COLUMN_COUNT + _this.nextRowIdx < 0) {
                        if(isLooping) {
                            var tempIdx = _this.posterIndex;
                            setPage(_this.getTotalPage()-1);
                            _this.curRowIndex = _comp._postersRowComp.length-1;

                            _this.posterIndex = _this.curRowIndex * COLUMN_COUNT - _this.nextRowIdx + tempIdx;
                            if(_this.posterIndex > _this.posters.length-1) _this.posterIndex = _this.posters.length-1;
                        } else {
                            return false;
                        }
                    } else {
                        if(_this.bannerType != Banner.TYPE.NONE && _this.posterIndex - COLUMN_COUNT < _this.firstRowCount) {
                           if(_this.bannerType == Banner.TYPE.TYPE_4) {
                                if(_this.posterIndex < 5) _this.posterIndex = _this.posterIndex - 3;
                                else _this.posterIndex = 2;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_3) {
                                if(_this.posterIndex < 5) _this.posterIndex = 0;
                                else _this.posterIndex = _this.posterIndex - 4;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_2) {
                                if(_this.posterIndex < 4) _this.posterIndex = 0;
                                else _this.posterIndex = 1;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_1) {
                                _this.posterIndex = 0;
                            }

                        } else {
                            _this.posterIndex = _this.posterIndex - COLUMN_COUNT;
                        }
                        _this.curRowIndex--;
                    }

                    if(_this.curRowIndex < _this.topRowIndex) {
                        _this.topRowIndex = _this.topRowIndex-4 < 0 ? 0 : _this.topRowIndex-4;
                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.8});
                        }
                    }

                    setFocus(_this.posterIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.posterIndex);
                    if(_this.curRowIndex == _comp._postersRowComp.length-1) {
                        _this.curRowIndex = 0;
                        _this.topRowIndex = 0;
                        if(_this.bannerType == Banner.TYPE.NONE) {
                            _this.posterIndex = _this.posterIndex%COLUMN_COUNT;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_4) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 2) _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT;
                            else _this.posterIndex = 2;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_3) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 2) _this.posterIndex = 0;
                            else _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_2) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 2) _this.posterIndex = 0;
                            else _this.posterIndex = 1;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_1) {
                            _this.posterIndex = 0;
                        }

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.8});
                        }
                    } else if(_this.posterIndex + COLUMN_COUNT > _this.posters.length-1) {
                        _this.curRowIndex++;
                        _this.posterIndex = _this.posters.length-1;
                    } else {
                        _this.curRowIndex++;

                        if(_this.bannerType != Banner.TYPE.NONE && _this.posterIndex < _this.firstRowCount) {
                            if(_this.bannerType == Banner.TYPE.TYPE_4) {
                                if(_this.posterIndex < 2) _this.posterIndex = _this.posterIndex + 3;
                                else _this.posterIndex = 5;
                            } else  if(_this.bannerType == Banner.TYPE.TYPE_3) {
                                if(_this.posterIndex < 1) _this.posterIndex = 3;
                                else _this.posterIndex = _this.posterIndex + 4;
                            } else  if(_this.bannerType == Banner.TYPE.TYPE_2) {
                                if(_this.posterIndex < 1) _this.posterIndex = 2;
                                else _this.posterIndex = 4;
                            } else  if(_this.bannerType == Banner.TYPE.TYPE_1) {
                                _this.posterIndex = 1;
                            }

                        } else {
                            _this.posterIndex = _this.posterIndex + COLUMN_COUNT;
                        }
                    }

                    if(_this.curRowIndex > _this.topRowIndex+3) {
                        _this.topRowIndex = _this.curRowIndex;
                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.8});
                        }
                    }

                    setFocus(_this.posterIndex);
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.topRowIndex = idx * 4;
                _this.curRowIndex = _this.topRowIndex;
                _this.posterIndex = _this.curRowIndex * COLUMN_COUNT - _this.nextRowIdx;
                if(_this.posterIndex < 0) _this.posterIndex = 0;

                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                for(var i = 0; i < _comp._postersRowComp.length; i++) {
                    if(_this.topRowIndex <= i && i < _this.topRowIndex+4)
                        _comp._postersRowComp[i].setStyle({opacity:1});
                    else
                        _comp._postersRowComp[i].setStyle({opacity:0.8});
                }
            }
        }

        var setSelectableMode = function(isOn) {
            for(var i = 0; i < _this.posters.length; i++) {
                _this.posters[i].unChecked(!isOn);
            }
        }

        var setSelect = function() {
            if(selectedArray.includes(_this.posterIndex)) {
                _this.posters[_this.posterIndex].unChecked();
                selectedArray.splice(selectedArray.indexOf(_this.posterIndex),1);
            } else {
                _this.posters[_this.posterIndex].setChecked();
                selectedArray.push(_this.posterIndex);
            }
        }

        this.setDimmed = function(idx, opacity) {
            if(_comp._postersRowComp[idx]) _comp._postersRowComp[idx].setStyle({opacity:opacity});
        };

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.getPageIdx = function() {
          return Math.floor(_this.topRowIndex/4);
        };

        this.getTotalPage = function() {
            return Math.floor((_comp._postersRowComp.length-1)/4)+1;
        }

        this.setFocus = function(idx) {
            setFocus(idx);
        };

        this.unFocus = function(idx) {
            unFocus(idx);
        };

        this.unFocusAll = function() {
            unFocusAll();
        };

        this.setActive = function() {
            setActive();
        };

        this.deActive = function() {
            deActive();
        };

        this.getComp = function() {
            if(!_comp) create();
            return _comp;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                case W.KEY.UP:
                case W.KEY.DOWN:
                    return operateList(event);
                case W.KEY.ENTER:
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

        }
        this.setSelectableMode = function(isOn) {
            setSelectableMode(isOn);
        }
        this.setSelect = function() {
            setSelect();
            return selectedArray;
        }
        this.resetSelect = function() {
            selectedArray = [];
        }
        this.getData = function(){
        	return data[_this.posterIndex];
        }
        this.getDataIdx = function(){
        	return _this.posterIndex;
        }
    }
    BoxList.TYPE = Object.freeze({MOVIE:0, SEARCH:1, PLAYLIST:2, PURCHASE:3, WATCHEDLIST:4});
    return BoxList;
});