W.defineModule(["mod/Util", "comp/kids/Circle"], function(util, Circle) {
    function CircleList(_param) {
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

        var data, bannerData;

        var COLUMN_COUNT = 5;

        var isLooping = true;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        //var BANNER_TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
        var MODE_TYPE = Object.freeze({POSTER:0, BANNER:1});

        var create = function(){
            type = _param.type;
            data = _param.data;
            if(type == CircleList.TYPE.CHARACTER) {
                posterType = Circle.TYPE.CHARACTER;
                posterGapX = 210;
                posterGapY = 241;
            } else {
                posterType = Circle.TYPE.CHANNEL;
                posterGapX = 210;
                posterGapY = 241;
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

            _this.firstRowCount = 5;

            _this.nextRowIdx = COLUMN_COUNT-_this.firstRowCount;

            var rowCount = -1;
            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                if((i==0) || (_this.nextRowIdx+i)%COLUMN_COUNT == 0) {
                    _comp._postersRowComp[++rowCount] = new W.Div({x:0, y:rowCount*posterGapY, opacity : rowCount == 0 || rowCount == 1 ? 1 : 0.3});
                    _comp._innerDiv.add(_comp._postersRowComp[rowCount]);
                }

                _this.posters[i] = new Circle({type:posterType, data:data[i], idx:i});

                _comp._postersComp[i] = _this.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:posterGapX*((_this.nextRowIdx+i)%COLUMN_COUNT)});

                _comp._postersRowComp[rowCount].add(_comp._postersComp[i]);
            }
            //_this.CircleList = new Circle(data);
            //_comp._CircleList = _this.CircleList.getComp();

            //_comp.add(_comp._CircleList);
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
                    if(_this.posterIndex+1 > _this.posters.length-1) {
                        _this.curRowIndex = 0;
                        _this.topRowIndex = 0;
                        _this.posterIndex = 0;

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.3});
                        }
                    } else {
                        _this.posterIndex++;

                        if((_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == 0) {
                            //TODO 다음줄로 넘어갔을때 처리
                            _this.curRowIndex++;

                            if(_this.curRowIndex > _this.topRowIndex+1) {
                                _this.topRowIndex = _this.curRowIndex;
                                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                                for(var i = 0; i < _comp._postersRowComp.length; i++) {
                                    if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                                        _comp._postersRowComp[i].setStyle({opacity:1});
                                    else
                                        _comp._postersRowComp[i].setStyle({opacity:0.3});
                                }
                            }
                        }
                    }


                    setFocus(_this.posterIndex);
                    break;
                case W.KEY.LEFT:
                    unFocus(_this.posterIndex);
                    if(_this.posterIndex == 0 || (_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == 0) {
                        return false;
                    }

                    _this.posterIndex--;

                    if((_this.nextRowIdx+_this.posterIndex)%COLUMN_COUNT == COLUMN_COUNT-1) {
                        //TODO 다음줄로 넘어갔을때 처리
                        _this.curRowIndex--;

                        if(_this.curRowIndex < _this.topRowIndex) {
                            _this.topRowIndex = _this.topRowIndex-2 < 0 ? 0 : _this.topRowIndex-2;
                            _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                            for(var i = 0; i < _comp._postersRowComp.length; i++) {
                                if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                                    _comp._postersRowComp[i].setStyle({opacity:1});
                                else
                                    _comp._postersRowComp[i].setStyle({opacity:0.3});
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
                        _this.posterIndex = _this.posterIndex - COLUMN_COUNT;
                        _this.curRowIndex--;
                    }
                    //TODO 다음줄로 넘어갔을때 처리

                    if(_this.curRowIndex < _this.topRowIndex) {
                        _this.topRowIndex = _this.topRowIndex-2 < 0 ? 0 : _this.topRowIndex-2;
                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.3});
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
                        _this.posterIndex = _this.posterIndex%COLUMN_COUNT;

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.3});
                        }
                    } else if(_this.posterIndex + COLUMN_COUNT > _this.posters.length-1) {
                        _this.curRowIndex++;
                        _this.posterIndex = _this.posters.length-1;
                    } else {
                        _this.curRowIndex++;

                        _this.posterIndex = _this.posterIndex + COLUMN_COUNT;
                    }

                    if(_this.curRowIndex > _this.topRowIndex+1) {
                        _this.topRowIndex = _this.curRowIndex;
                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        for(var i = 0; i < _comp._postersRowComp.length; i++) {
                            if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                                _comp._postersRowComp[i].setStyle({opacity:1});
                            else
                                _comp._postersRowComp[i].setStyle({opacity:0.3});
                        }
                    }

                    setFocus(_this.posterIndex);
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.topRowIndex = idx * 2;
                _this.curRowIndex = _this.topRowIndex;
                W.log.info(_this.curRowIndex,COLUMN_COUNT,_this.nextRowIdx)
                _this.posterIndex = _this.curRowIndex * COLUMN_COUNT - _this.nextRowIdx;
                if(_this.posterIndex < 0) _this.posterIndex = 0;

                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                for(var i = 0; i < _comp._postersRowComp.length; i++) {
                    if(i == _this.topRowIndex || i == _this.topRowIndex+1)
                        _comp._postersRowComp[i].setStyle({opacity:1});
                    else
                        _comp._postersRowComp[i].setStyle({opacity:0.3});
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
          return Math.floor(_this.topRowIndex/2);
        };

        this.getTotalPage = function() {
            return Math.floor((_comp._postersRowComp.length-1)/2)+1;
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

        };

        this.getCurrentData = function() {
            return data[_this.posterIndex];
        }
    }
    CircleList.TYPE = Object.freeze({CHARACTER:0, CHANNEL:1});
    return CircleList;
});