W.defineModule("comp/list/MenuList", ["mod/Util", "comp/list/Menu", "comp/list/Banner"], function(util, Menu, Banner) {
    function MenuList(_param) {
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

        var COLUMN_COUNT = 3;

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
            if(_param.bannerData) {
                bannerData = _param.bannerData;
            }
            isLooping = true;

            if(type == MenuList.TYPE.BOOKMARK) {
                posterType = Menu.TYPE.W277;
                posterGapX = 287;
                posterGapY = 156;
            }

            _this.posterIndex = 0;
            _this.curRowIndex = 0;
            _this.topRowIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({});
            _comp._innerDiv = new W.Div({});

            _this.posters = [];
            _comp._postersComp = [];
            _comp._postersRowComp = [];
            //TODO 프로모션 배너 있을때

            _this.firstRowCount;

            _this.bannerType = Banner.TYPE.NONE;
            _this.firstRowCount = 3;

            _this.nextRowIdx = COLUMN_COUNT-_this.firstRowCount;


            var rowCount = -1;
            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                if((i==0) || (_this.nextRowIdx+i)%COLUMN_COUNT == 0) {
                    _comp._postersRowComp[++rowCount] = new W.Div({x:0, y:rowCount*posterGapY, opacity : rowCount < 3 ? 1 : 0.3});
                    _comp._innerDiv.add(_comp._postersRowComp[rowCount]);
                }

                _this.posters[i] = new Menu({type:posterType, data:data[i], isSelectable : type == MenuList.TYPE.BOOKMARK ? true : false,
                    isBookmark : type == MenuList.TYPE.BOOKMARK ? true : false});

                _comp._postersComp[i] = _this.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:posterGapX*((_this.nextRowIdx+i)%COLUMN_COUNT)});

                _comp._postersRowComp[rowCount].add(_comp._postersComp[i]);
            }
            //_this.posterList = new Menu(data);
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

        var setRowVisibility = function() {
            for(var i = 0; i < _comp._postersRowComp.length; i++) {
                if(i == _this.topRowIndex || i == _this.topRowIndex+1 || i == _this.topRowIndex+2){
                    _comp._postersRowComp[i].setStyle({display:"block", opacity:1});
                } else if(i < _this.topRowIndex) {
                    _comp._postersRowComp[i].setStyle({display:"none"});
                } else {
                    _comp._postersRowComp[i].setStyle({display:"block", opacity:0.3});
                }
            }
        }

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    unFocus(_this.posterIndex);
                    if(_this.posterIndex == _this.posters.length-1 || (_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == COLUMN_COUNT-1) {
                        return false;
                    }

                    if(_this.posterIndex+1 > _this.posters.length-1) {
                        _this.curRowIndex = 0;
                        _this.topRowIndex = 0;
                        _this.posterIndex = 0;

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);
                        setRowVisibility();
                    } else {
                        _this.posterIndex++;

                        if((_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == 0) {
                            _this.curRowIndex++;

                            if(_this.curRowIndex > _this.topRowIndex+2) {
                                _this.topRowIndex = _this.curRowIndex;
                                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                                setRowVisibility();
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
                            _this.topRowIndex = _this.topRowIndex-3 < 0 ? 0 : _this.topRowIndex-3;
                            _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                            setRowVisibility();
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
                        _this.posterIndex = _this.posterIndex - COLUMN_COUNT;
                        _this.curRowIndex--;
                    }

                    if(_this.curRowIndex < _this.topRowIndex) {
                        _this.topRowIndex = _this.topRowIndex-3 < 0 ? 0 : _this.topRowIndex-3;
                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        setRowVisibility();
                    }

                    setFocus(_this.posterIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.posterIndex);
                    if(_this.curRowIndex == _comp._postersRowComp.length-1) {
                        _this.curRowIndex = 0;
                        _this.topRowIndex = 0;
                        _this.posterIndex = _this.posterIndex%COLUMN_COUNT;

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        setRowVisibility();
                    } else if(_this.posterIndex + COLUMN_COUNT > _this.posters.length-1) {
                        _this.curRowIndex++;
                        _this.posterIndex = _this.posters.length-1;
                    } else {
                        _this.curRowIndex++;

                        _this.posterIndex = _this.posterIndex + COLUMN_COUNT;
                    }

                    if(_this.curRowIndex > _this.topRowIndex+2) {
                        _this.topRowIndex = _this.curRowIndex;
                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        setRowVisibility();
                    }

                    setFocus(_this.posterIndex);
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                unFocus(_this.posterIndex);
                _this.topRowIndex = idx * 3;
                _this.curRowIndex = _this.topRowIndex;
                _this.posterIndex = _this.curRowIndex * COLUMN_COUNT - _this.nextRowIdx;
                if(_this.posterIndex < 0) _this.posterIndex = 0;

                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                setRowVisibility();
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

        var setSelectAll = function(_limit) {
            _limit = _limit ? _limit : _this.posters.length;
            for(var i = 0; i < _this.posters.length && selectedArray.length < _limit; i++) {
                if(selectedArray.includes(i)) {
                } else {
                    _this.posters[i].setChecked();
                    selectedArray.push(i);
                }
            }
        }

        this.setDimmed = function(idx, opacity) {
            if(_comp._postersRowComp[idx]) _comp._postersRowComp[idx].setStyle({opacity:opacity});
        };

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.getPageIdx = function() {
          return Math.floor(_this.topRowIndex/3);
        };

        this.getTotalPage = function() {
            return Math.floor((_comp._postersRowComp.length-1)/3)+1;
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
            return selectedArray;
        }
        this.getCurrentData = function(){
            return data[_this.posterIndex];
        }
        this.setSelectAll = function(_limit) {
            setSelectAll(_limit);
            return selectedArray;
        }
        this.componentName = "MenuList";
    }
    MenuList.TYPE = Object.freeze({BOOKMARK:0});
    return MenuList;
});