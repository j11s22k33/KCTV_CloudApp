W.defineModule(["mod/Util", "comp/kids/Poster", "comp/kids/PosterBanner"], function(util, Poster, Banner) {
    function PosterList(_param) {
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
        var total;

        var COLUMN_COUNT = 6;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        //var BANNER_TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
        var MODE_TYPE = Object.freeze({POSTER:0, BANNER:1});

        var create = function(){
            W.log.info(_param)
            type = _param.type;
            data = JSON.parse(JSON.stringify(_param.data));
            total = _param.total;
            if(_param.bannerData) {
                bannerData = JSON.parse(JSON.stringify(_param.bannerData));
                total += _param.bannerData.length;
            }
            isLooping = _param.isLooping;

            if(type == PosterList.TYPE.SEARCH) {
                posterType = Poster.TYPE.W113;
                posterGapX = 123;
                posterGapY = 249;
            } else if(type == PosterList.TYPE.PLAYLIST) {
                posterType = Poster.TYPE.W113;
                posterGapX = 123;
                posterGapY = 249;
            } else {
                posterType = Poster.TYPE.W140;
                posterGapX = 170;
                posterGapY = 292;
            }

            _this.isClearPin = _param.isClearPin;
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
            _this.firstRowCount = 6;
            if(type == PosterList.TYPE.SEARCH || !bannerData || (bannerData && bannerData.length < 1)) {
                _this.bannerType = Banner.TYPE.NONE;
                _this.firstRowCount = 6;
            } else if(bannerData && bannerData[0] && bannerData[0].bannerSize == "8") {
                _this.bannerType = Banner.TYPE.TYPE_1;
                _this.firstRowCount = 1;
                bannerData[0].type = "banner";
                data.splice(0,0,bannerData[0]);
            } else if(bannerData && bannerData[0] && bannerData[0].bannerSize == "7" && bannerData[1]) {
                _this.bannerType = Banner.TYPE.TYPE_2;
                _this.firstRowCount = 2;
                bannerData[0].type = "banner";
                bannerData[1].type = "banner";
                data.splice(0,0,bannerData[0]);
                data.splice(1,0,bannerData[1]);
            } else if(false) {
                _this.bannerType = Banner.TYPE.TYPE_3;
                _this.firstRowCount = 4;
                bannerData[0].type = "banner";
                data.splice(0,0,bannerData[0]);
            } else if(false) {
                _this.bannerType = Banner.TYPE.TYPE_4;
                _this.firstRowCount = 4;
                bannerData[0].type = "banner";
                data.splice(3,0,bannerData[0]);
            } else if(bannerData && bannerData[0] && bannerData[0].bannerSize == "6" && bannerData.length > 1) {
                _this.bannerType = Banner.TYPE.TYPE_5;
                _this.firstRowCount = 4;
                bannerData[0].type = "banner";
                bannerData[1].type = "banner";
                data.splice(0,0,bannerData[0]);
                data.splice(3,0,bannerData[1]);
            } else if(bannerData && bannerData[0] && bannerData[0].bannerSize == "6") {
                _this.bannerType = Banner.TYPE.TYPE_6;
                _this.firstRowCount = 5;
                bannerData[0].type = "banner";
                data.splice(0,0,bannerData[0]);
            } else if(false) {
                _this.bannerType = Banner.TYPE.TYPE_7;
                _this.firstRowCount = 5;
                bannerData[0].type = "banner";
                data.splice(4,0,bannerData[0]);
            }

            _this.nextRowIdx = COLUMN_COUNT-_this.firstRowCount;

            var rowCount = -1;
            var _x = 0;
            for(var i = 0; i < total/*data.length*/; i++) {
                if((i==0) || (_this.nextRowIdx+i)%COLUMN_COUNT == 0) {
                    _comp._postersRowComp[++rowCount] = new W.Div({x:0, y:rowCount*posterGapY, opacity : rowCount == 0 || rowCount == 1 ? 1 : 0.3});
                    _comp._innerDiv.add(_comp._postersRowComp[rowCount]);
                }

                if((_this.bannerType != Banner.TYPE.NONE) && (i < _this.firstRowCount)) {
                    if(data[i].type == "banner") {
                        _this.posters[i] = new Banner({type:_this.bannerType, data:data[i]});

                        _comp._postersComp[i] = _this.posters[i].getComp();
                        _comp._postersComp[i].setStyle({x:_x});
                        if(_this.bannerType == Banner.TYPE.TYPE_1) _x += 529;
                        else if(_this.bannerType == Banner.TYPE.TYPE_2) _x += 510;
                        else if(_this.bannerType == Banner.TYPE.TYPE_3) _x += 510;
                        else _x += posterGapX*2;
                    } else {
                        if(data[i]) {
                            _this.posters[i] = new Poster({type:posterType, data:data[i], textAlign:(_this.nextRowIdx+i)%COLUMN_COUNT>=COLUMN_COUNT-2 ? "right":"",
                                isSelectable : type == PosterList.TYPE.PLAYLIST ? true : false, isPurchase : type == PosterList.TYPE.PURCHASE ? true : false,
                                isWatched : type == PosterList.TYPE.WATCHEDLIST ? true : false, isRecommend : type == PosterList.TYPE.RECOMMEND ? true : false});

                            _comp._postersComp[i] = _this.posters[i].getComp();
                            _comp._postersComp[i].setStyle({x:_x});
                            _x += posterGapX;
                        }
                    }
                } else {
                    if(data[i]) {
                        _this.posters[i] = new Poster({type:posterType, data:data[i], textAlign:(_this.nextRowIdx+i)%COLUMN_COUNT>=COLUMN_COUNT-2 ? "right":"",
                            isSelectable : type == PosterList.TYPE.PLAYLIST ? true : false, isPurchase : type == PosterList.TYPE.PURCHASE ? true : false,
                            isWatched : type == PosterList.TYPE.WATCHEDLIST ? true : false, isRecommend : type == PosterList.TYPE.RECOMMEND ? true : false});

                        _comp._postersComp[i] = _this.posters[i].getComp();
                        _comp._postersComp[i].setStyle({x:posterGapX*((_this.nextRowIdx+i)%COLUMN_COUNT)});
                    }
                }

                if(data[i]) {
                    _comp._postersRowComp[rowCount].add(_comp._postersComp[i]);
                }
            }
            //_this.posterList = new Poster(data);
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

        var checkComp = function(_callback) {
            if(_callback) _this.checkCompCallback = _callback;
            W.log.info("CheckComp!!")

            var index = (_this.curRowIndex) * COLUMN_COUNT - _this.nextRowIdx;
            if(index < 0 || index >= total) {
                if(_this.checkCompCallback) _this.checkCompCallback();
                return;
            }

            if(_callback) {
                for(var i = index; (i < index + COLUMN_COUNT*4) && (i < total); i++) {
                    if(!data[i]) {
                        _this.offset = i;
                        W.Loading.start();
                        checkData(i, COLUMN_COUNT*4-(i-index));
                        return;
                    }
                }
                _callback();
            } else {
                var rowCount = _this.curRowIndex-1;
                for(var i = index; (i < index + COLUMN_COUNT*4) && (i < total)/*data.length*/; i++) {
                    if((_this.nextRowIdx+i)%COLUMN_COUNT == 0) {
                        rowCount++;
                    }

                    if(data[i] && !_this.posters[i]) {
                        _this.posters[i] = new Poster({type:posterType, data:data[i], textAlign:(_this.nextRowIdx+i)%COLUMN_COUNT>=COLUMN_COUNT-2 ? "right":"",
                            isSelectable : type == PosterList.TYPE.PLAYLIST ? true : false, isPurchase : type == PosterList.TYPE.PURCHASE ? true : false,
                            isWatched : type == PosterList.TYPE.WATCHEDLIST ? true : false, isRecommend : type == PosterList.TYPE.RECOMMEND ? true : false,
                            isPlayList : type == PosterList.TYPE.PLAYLIST ? true : false, isRank : type == PosterList.TYPE.RANKING ? true : false,
                            isClearPin : _this.isClearPin});

                        _comp._postersComp[i] = _this.posters[i].getComp();
                        _comp._postersComp[i].setStyle({x:posterGapX*((_this.nextRowIdx+i)%COLUMN_COUNT)});

                        _comp._postersRowComp[rowCount].add(_comp._postersComp[i]);
                    }

                }
                if(_this.checkCompCallback) _this.checkCompCallback();
                W.Loading.stop();
            }
        };

        var checkData = function(offset, limit) {
            if(_this.bannerType != Banner.TYPE.NONE) {
                offset-=bannerData.length;
            }
            /*if(_this.bannerType == Banner.TYPE.TYPE_1) {
                offset-=1;
            } else if(_this.bannerType == Banner.TYPE.TYPE_2) {
                offset-=2;
            } else if(_this.bannerType == Banner.TYPE.TYPE_3 || _this.bannerType == Banner.TYPE.TYPE_4){
                offset-=1;
            } else if(_this.bannerType == Banner.TYPE.TYPE_5) {
                offset-=2;
            }*/
            _param.parent.requestData(offset, limit);
        };

        var addData = function(_data) {
            for(var i = _this.offset; i < _data.length+_this.offset; i++) {
                data[i] = _data[i-_this.offset]
            }
            checkComp();
        }

        var setRowVisibility = function() {
            for(var i = 0; i < _comp._postersRowComp.length; i++) {
                if(i == _this.topRowIndex || i == _this.topRowIndex+1){
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
                    if(_this.posterIndex+1 > _this.posters.length-1) {
                        //if(_this.bannerType == Banner.TYPE.NONE) {
                        _this.curRowIndex = 0;
                        _this.topRowIndex = 0;
                        _this.posterIndex = 0;
                        //} else {

                        //}

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        setRowVisibility();

                        _param.parent.setScroll();
                    } else {


                        if((_this.nextRowIdx+_this.posterIndex+1)%COLUMN_COUNT == 0) {
                            _this.posterIndex++;
                            //TODO 다음줄로 넘어갔을때 처리
                            _this.curRowIndex++;
                            if(_this.curRowIndex > _this.topRowIndex+1) {
                                checkComp(function() {
                                    _this.topRowIndex = _this.curRowIndex;
                                    _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                                    setRowVisibility();
                                    setFocus(_this.posterIndex);
                                    _param.parent.setScroll();
                                });
                            } else {
                                setFocus(_this.posterIndex);
                                _param.parent.setScroll();
                            }
                            break;
                        }
                        _this.posterIndex++;
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
                            if(_comp._postersRowComp.length > 1) {
                                var tempIdx = _this.posterIndex;
                                //setPage(_this.getTotalPage()-1);
                                _this.curRowIndex = _comp._postersRowComp.length-3;
                                checkComp(function() {
                                    _this.curRowIndex = _comp._postersRowComp.length-1;
                                    _this.topRowIndex = _this.curRowIndex - _this.curRowIndex%2;
                                    _this.posterIndex = _this.curRowIndex * COLUMN_COUNT - _this.nextRowIdx + tempIdx;
                                    if(_this.posterIndex > _this.posters.length-1) _this.posterIndex = _this.posters.length-1;
                                    _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);
                                    setRowVisibility();
                                    setFocus(_this.posterIndex);
                                    _param.parent.setScroll();
                                });
                                return true;
                            } else {
                                setFocus(_this.posterIndex);
                                _param.parent.setScroll();
                                return true;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        if(_this.bannerType != Banner.TYPE.NONE && _this.posterIndex - COLUMN_COUNT < _this.firstRowCount) {
                            if(_this.bannerType == Banner.TYPE.TYPE_7) {
                                if(_this.posterIndex < 10) _this.posterIndex = _this.posterIndex - 5;
                                else _this.posterIndex = 4;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_6) {
                                if(_this.posterIndex < 7) _this.posterIndex = 0;
                                else _this.posterIndex = _this.posterIndex - 6;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_5) {
                                if(_this.posterIndex < 6) _this.posterIndex = 0;
                                else if(_this.posterIndex < 8) _this.posterIndex = _this.posterIndex - 5;
                                else _this.posterIndex = 3;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_4) {
                                if(_this.posterIndex < 7) _this.posterIndex = _this.posterIndex - 4;
                                else _this.posterIndex = 3;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_3) {
                                if(_this.posterIndex < 8) _this.posterIndex = 0;
                                else _this.posterIndex = _this.posterIndex - 4;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_2) {
                                if(_this.posterIndex < 5) _this.posterIndex = 0;
                                else _this.posterIndex = 1;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_1) {
                                _this.posterIndex = 0;
                            }

                        } else {
                            _this.posterIndex = _this.posterIndex - COLUMN_COUNT;
                        }
                        _this.curRowIndex--;
                    }
                    //TODO 다음줄로 넘어갔을때 처리

                    if(_this.curRowIndex < _this.topRowIndex) {
                        _this.curRowIndex--;
                        checkComp(function() {
                            _this.curRowIndex++;
                            _this.topRowIndex = _this.topRowIndex-2 < 0 ? 0 : _this.topRowIndex-2;
                            _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                            setRowVisibility();
                            setFocus(_this.posterIndex);
                            _param.parent.setScroll();
                        });

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
                        } else if(_this.bannerType == Banner.TYPE.TYPE_7) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 4) _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT;
                            else _this.posterIndex = 4;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_6) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 2) _this.posterIndex = 0;
                            else _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_5) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 2) _this.posterIndex = 0;
                            else if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 4) _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT -1;
                            else _this.posterIndex = 3;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_4) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 3) _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT;
                            else _this.posterIndex = 3;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_3) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 3) _this.posterIndex = 0;
                            else _this.posterIndex = (_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_2) {
                            if((_this.posterIndex-_this.firstRowCount)%COLUMN_COUNT < 3) _this.posterIndex = 0;
                            else _this.posterIndex = 1;
                        } else if(_this.bannerType == Banner.TYPE.TYPE_1) {
                            _this.posterIndex = 0;
                        }

                        _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                        setRowVisibility();
                    } else if(_this.posterIndex + COLUMN_COUNT > _this.posters.length-1) {
                		_this.curRowIndex++;
                    	if(_this.posterIndex == 0 && data[_this.posterIndex].type == "banner" && _this.posters.length > 0){
                    		_this.posterIndex = _this.firstRowCount;
                    	}else{
                            _this.posterIndex = _this.posters.length-1;
                    	}
                    } else {
                        _this.curRowIndex++;

                        if(_this.bannerType != Banner.TYPE.NONE && _this.posterIndex < _this.firstRowCount) {
                            if(_this.bannerType == Banner.TYPE.TYPE_7) {
                                if(_this.posterIndex < 4) _this.posterIndex = _this.posterIndex + 5;
                                else _this.posterIndex = 9;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_6) {
                                if(_this.posterIndex < 1) _this.posterIndex = 5;
                                else _this.posterIndex = _this.posterIndex + 6;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_5) {
                                if(_this.posterIndex < 1) _this.posterIndex = 4;
                                else if(_this.posterIndex < 3) _this.posterIndex = _this.posterIndex + 5;
                                else _this.posterIndex = 8;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_4) {
                                if(_this.posterIndex < 3) _this.posterIndex = _this.posterIndex + 4;
                                else _this.posterIndex = 7;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_3) {
                                if(_this.posterIndex < 1) _this.posterIndex = 4;
                                else _this.posterIndex = _this.posterIndex + 6;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_2) {
                                if(_this.posterIndex < 1) _this.posterIndex = 2;
                                else _this.posterIndex = 5;
                            } else if(_this.bannerType == Banner.TYPE.TYPE_1) {
                                _this.posterIndex = 1;
                            }

                        } else {
                            _this.posterIndex = _this.posterIndex + COLUMN_COUNT;
                        }

                        if(_this.curRowIndex > _this.topRowIndex+1) {
                            checkComp(function() {
                                _this.topRowIndex = _this.curRowIndex;
                                _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                                setRowVisibility();
                                setFocus(_this.posterIndex);
                                _param.parent.setScroll();
                            });
                        } else {
                            setFocus(_this.posterIndex);
                            _param.parent.setScroll();
                        }
                        break;
                    }

                    if(_this.curRowIndex > _this.topRowIndex+1) {
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
                _this.topRowIndex = idx * 2;
                _this.curRowIndex = _this.topRowIndex;
                checkComp(function() {
                    _this.topRowIndex = idx * 2;
                    _this.curRowIndex = _this.topRowIndex;
                    W.log.info(_this.curRowIndex,COLUMN_COUNT,_this.nextRowIdx)
                    _this.posterIndex = _this.curRowIndex * COLUMN_COUNT - _this.nextRowIdx;
                    if(_this.posterIndex < 0) _this.posterIndex = 0;

                    _comp._innerDiv.setY(_this.topRowIndex*-posterGapY);

                    setRowVisibility();
                });
            }
        }

        this.addData = function(_data) {
            addData(_data);
        };

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
        this.releaseRestrict = function() {
            for(var i = 0; i < _this.posters.length; i++) {
                if(_this.posters[i].releaseRestrict) {
                    _this.posters[i].releaseRestrict();
                }
            }
        }
    }
    PosterList.TYPE = Object.freeze({MOVIE:0, SEARCH:1, PLAYLIST:2});
    return PosterList;
});