/**
 * Created by yj.yoon on 2018-01-18.
 */
W.defineModule("comp/list/TextList", ["mod/Util", "comp/list/Text"], function(util, Text) {
    function TextList(_param) {
        var _this = this;

        var backCallbackFunc;
        var mode = 0;
        var tops = [402, 188, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var type;
        var textType;
        var textGapX, textGapY;

        var index = 0;
        var _comp;
        var _posterComp;

        var isPoster;

        var data, bannerData, isLooping;
        var total;

        var COLUMN_COUNT = 7;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        //var BANNER_TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
        var MODE_TYPE = Object.freeze({POSTER:0, BANNER:1});

        var create = function(){
            type = _param.type;
            data = JSON.parse(JSON.stringify(_param.data));
            total = _param.total;
            /*if(_param.bannerData) {
                bannerData = JSON.parse(JSON.stringify(_param.bannerData));
                total = _param.bannerData.length;
            }*/
            isLooping = true;
            /*if(type == TextList.TYPE.NORMAL) {
                textType = Poster.TYPE.W113;
                textGapX = 123;
                textGapY = 249;
            } else {
                textType = Poster.TYPE.W136;
                textGapX = 151;
                textGapY = 284;
            }*/

            textGapY = 50;
            
            _this.isClearPin = _param.isClearPin;
            _this.textIndex = 0;
            _this.topIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({});
            _comp._innerDiv = new W.Div({});

            _this.texts = [];
            _comp._textsComp = [];

            var rowCount = -1;
            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                _this.texts[i] = new Text({type:textType, data:data[i],
                    isRank : type == TextList.TYPE.RANKING ? true : false,
                    isClearPin : _this.isClearPin});

                _comp._textsComp[i] = _this.texts[i].getComp();
                _comp._textsComp[i].setStyle({y:i*50});
                _comp._innerDiv.add( _comp._textsComp[i]);
            }
            _comp.add(_comp._innerDiv);
        };

        var createPosterComp = function() {
            isPoster = true;
            _posterComp = new W.Div({width:246, height:720});
            _posterComp._innerDiv = new W.Div({});

            //_posterComp._poster_0 = new W.Div({x:35,y:-40, width:140, height:200, "background-size":"140px 200px", opacity:0.5,
            //    "background-image":"url('img/poster_default_w156.png')"});
            //_posterComp._poster_0._poster = new W.Div({x:0, y:0, width:140, height:200, "background-size":"140px 200px"});
            //_posterComp._poster_0.add(_posterComp._poster_0._poster);
            //_posterComp._poster_0.add(new W.Div({width:140, height:200, color:"#000000", opacity:0.6}));
            //_posterComp._poster_0._rating = new W.Div({x:0, y:0, width:140, height:200, color:"rgba(0,0,0,0)", display:"none"});
            //_posterComp._poster_0._rating.add(new W.Image({x:501-408, y:117-111, width:41, height:45, src:"img/icon_age_lock.png"}));
            //_posterComp._poster_0.add(_posterComp._poster_0._rating);
            //_posterComp._poster_0._ratingAdult = new W.Div({x:0, y:0, width:140, height:200, display:"none"});
            //_posterComp._poster_0._ratingAdult.add(new W.Image({x:0, y:0, width:140, height:200, src:"img/poster_default_adult_w156.png"}));
            //_posterComp._poster_0.add(_posterComp._poster_0._ratingAdult);
            //_posterComp._innerDiv.add(_posterComp._poster_0);

            _posterComp._poster_1 = new W.Div({x:0,y:162, width:210, height:300, "background-size":"100% 100%",
                "background-image":"url('img/poster_default_w246.png')"});
            _posterComp._poster_1._poster = new W.Div({x:0,y:0, width:"100%", height:"100%", "background-size":"100% 100%"});
            _posterComp._poster_1.add(_posterComp._poster_1._poster);  
            _posterComp._poster_1._rating = new W.Div({x:0, y:0, width:"100%", height:"100%", color:"rgba(0,0,0,0.7)", display:"none"});
            _posterComp._poster_1._rating.add(new W.Image({right:"1px", y:117-111, width:41, height:45, src:"img/icon_age_lock.png"}));
            _posterComp._poster_1.add(_posterComp._poster_1._rating);
            _posterComp._poster_1._ratingAdult = new W.Div({x:0, y:0, width:"100%", height:"100%", display:"none"});
            _posterComp._poster_1._ratingAdult.add(new W.Image({x:0, y:0, width:"100%", height:"100%", src:"img/poster_default_adult_w246.png"}));
            _posterComp._poster_1.add(_posterComp._poster_1._ratingAdult);
            _posterComp._innerDiv.add(_posterComp._poster_1);

            //_posterComp._poster_2 = new W.Div({x:35,y:560, width:140, height:200, "background-size":"140px 200px", opacity:0.5,
            //    "background-image":"url('img/poster_default_w156.png')"});
            //_posterComp._poster_2._poster = new W.Div({x:0, y:0, width:140, height:200, "background-size":"140px 200px"});
            //_posterComp._poster_2.add(_posterComp._poster_2._poster);
            //_posterComp._poster_2.add(new W.Div({width:140, height:200, color:"#000000", opacity:0.6}));
            //_posterComp._poster_2._rating = new W.Div({x:0, y:0, width:140, height:200, color:"rgba(0,0,0,0)", display:"none"});
            //_posterComp._poster_2._rating.add(new W.Image({x:501-408, y:117-111, width:41, height:45, src:"img/icon_age_lock.png"}));
            //_posterComp._poster_2.add(_posterComp._poster_2._rating);
            //_posterComp._poster_2._ratingAdult = new W.Div({x:0, y:0, width:140, height:200, display:"none"});
            //_posterComp._poster_2._ratingAdult.add(new W.Image({x:0, y:0, width:140, height:200, src:"img/poster_default_adult_w156.png"}));
            //_posterComp._poster_2.add(_posterComp._poster_2._ratingAdult);
            //_posterComp._innerDiv.add(_posterComp._poster_2);

            _posterComp.add(_posterComp._innerDiv);

            setPoster();
        };

        var setPoster = function() {
            W.log.info(_this.texts[_this.textIndex-1])
            //if(_this.texts[_this.textIndex-1]) {
            //    _posterComp._poster_0.setStyle({display:"block"});
            //    _posterComp._poster_0._poster.setStyle({display:"block",
            //        "background-image":"url('"+util.getPosterFilePath(data[_this.textIndex-1].posterBaseUrl, 140) +"')"});

            //    if(W.StbConfig.adultMenuUse != 1 && data[_this.textIndex-1].rating && util.getRating() && data[_this.textIndex-1].rating >= util.getRating()) {
            //        if(data[_this.textIndex-1].isAdult) {
            //            _posterComp._poster_0._ratingAdult.setStyle({display:"block"});
            //            _posterComp._poster_0._rating.setStyle({display:"none"});
            //        } else {
            //            _posterComp._poster_0._rating.setStyle({display:"block"});
            //            _posterComp._poster_0._ratingAdult.setStyle({display:"none"});
            //        }
            //    } else {
            //        _posterComp._poster_0._rating.setStyle({display:"none"});
            //        _posterComp._poster_0._ratingAdult.setStyle({display:"none"});
            //    }
            //} else {
            //    _posterComp._poster_0.setStyle({display:"none"});
            //}
            if(_this.texts[_this.textIndex]) {
                var posterUrl;
                if(data[_this.textIndex].events && data[_this.textIndex].events[0] && data[_this.textIndex].events[0].posterUrl){
                    posterUrl = W.Config.IMAGE_URL + data[_this.textIndex].events[0].posterUrl;
                } else if(!(data[_this.textIndex].events && data[_this.textIndex].events[0] && data[_this.textIndex].events[0].posterUrl)
                    && (data[_this.textIndex].coupons && data[_this.textIndex].coupons[0] && data[_this.textIndex].coupons[0].posterUrl)) {
                    posterUrl = W.Config.IMAGE_URL + data[_this.textIndex].coupons[0].posterUrl;
                } else if(data[_this.textIndex].posterBaseUrl) posterUrl = util.getPosterFilePath(data[_this.textIndex].posterBaseUrl, 246);
                else if(data[_this.textIndex].image) posterUrl = data[_this.textIndex].image;
                //else if(data.posterUrl) posterUrl = W.Config.IMAGE_URL + data.posterUrl;
                _posterComp._poster_1._poster.setStyle({display:"block",
                    "background-image":"url('"+posterUrl+"')"});

                if(!_this.isClearPin && W.StbConfig.adultMenuUse) {
                    if(data[_this.textIndex].isAdult) {
                        _posterComp._poster_1._ratingAdult.setStyle({display:"block"});
                        _posterComp._poster_1._rating.setStyle({display:"none"});
                    } else if(data[_this.textIndex].rating
                        && util.getRating() && data[_this.textIndex].rating >= util.getRating()) {
                        _posterComp._poster_1._rating.setStyle({display:"block"});
                        _posterComp._poster_1._ratingAdult.setStyle({display:"none"});
                    } else {
                        _posterComp._poster_1._rating.setStyle({display:"none"});
                        _posterComp._poster_1._ratingAdult.setStyle({display:"none"});
                    }
                } else {
                    _posterComp._poster_1._rating.setStyle({display:"none"});
                    _posterComp._poster_1._ratingAdult.setStyle({display:"none"});
                }
            } else {
                _posterComp._poster_1._poster.setStyle({display:"none", "background-image":"", "background-size":"246px 350px"});
            }
            //if(_this.texts[_this.textIndex+1]) {
            //    _posterComp._poster_2.setStyle({display:"block"});
            //    _posterComp._poster_2._poster.setStyle({display:"block",
            //        "background-image":"url('"+util.getPosterFilePath(data[_this.textIndex+1].posterBaseUrl, 140)+"')"});

            //    if(W.StbConfig.adultMenuUse != 1 && data[_this.textIndex+1].rating && util.getRating() && data[_this.textIndex+1].rating >= util.getRating()) {
            //        if(data[_this.textIndex+1].isAdult) {
            //            _posterComp._poster_2._ratingAdult.setStyle({display:"block"});
            //            _posterComp._poster_2._rating.setStyle({display:"none"});
            //        } else {
            //            _posterComp._poster_2._rating.setStyle({display:"block"});
            //            _posterComp._poster_2._ratingAdult.setStyle({display:"none"});
            //        }
            //    } else {
            //        _posterComp._poster_2._rating.setStyle({display:"none"});
            //        _posterComp._poster_2._ratingAdult.setStyle({display:"none"});
            //    }
            //} else {
            //    _posterComp._poster_2.setStyle({display:"none"});
            //}
        };

        var unFocus = function(idx) {
            if(_this.texts && _this.texts[idx]) _this.texts[idx].unFocus();
        };

        var setFocus = function(idx) {
            if(_this.texts && _this.texts[idx]) _this.texts[idx].setFocus();
            if(isPoster) setPoster();
        };

        var unFocusAll = function() {
            if(_this.texts && _this.texts.length > 0) {
                for(var i = 0; i < _this.texts.length; i++) {
                    unFocus(i);
                }
            }
        }

        var setActive = function() {
            _this.isActive = true;
            setFocus(_this.textIndex);
        };

        var deActive = function() {
            _this.isActive = false;
            unFocusAll();
        };

        var checkComp = function(_callback) {
            if(_callback) _this.checkCompCallback = _callback;
            W.log.info("CheckComp!!")
            var index =  _this.topIndex;
            if(index >= total) {
                if(_this.checkCompCallback) _this.checkCompCallback();
                return;
            }

            if(_callback) {
                for(var i = index; (i < index + 11*2) && (i < total); i++) {
                    if(!data[i]) {
                        _this.offset = i;
                        W.Loading.start();
                        checkData(i, 11*2);
                        return;
                    } else {
                        if(data[i] && !_this.texts[i]) {
                            _this.texts[i] = new Text({type:textType, data:data[i],
                                isRank : type == TextList.TYPE.RANKING ? true : false,
                                isClearPin : _this.isClearPin});

                            _comp._textsComp[i] = _this.texts[i].getComp();
                            _comp._textsComp[i].setStyle({y:i*50});
                            _comp._innerDiv.add( _comp._textsComp[i]);
                        }
                    }
                }
                _callback();
            } else {
                for(var i = index; (i < index + 11*2) && (i < total); i++) {
                    if(data[i] && !_this.texts[i]) {
                        _this.texts[i] = new Text({type:textType, data:data[i],
                            isRank : type == TextList.TYPE.RANKING ? true : false,
                            isClearPin : _this.isClearPin});

                        _comp._textsComp[i] = _this.texts[i].getComp();
                        _comp._textsComp[i].setStyle({y:i*50});
                        _comp._innerDiv.add( _comp._textsComp[i]);
                    }

                }
                if(_this.checkCompCallback) _this.checkCompCallback();
                W.Loading.stop();
            }
        };

        var checkData = function(offset, limit) {
            _param.parent.requestData(offset, limit);
        };

        var addData = function(_data) {
            W.log.info("Add",data, _data)
            for(var i = _this.offset; i < _data.length+_this.offset; i++) {
                data[i] = _data[i-_this.offset]
            }
            checkComp();
        }

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    return true;
                    break;
                case W.KEY.LEFT:
                    unFocus(_this.textIndex);
                    break;
                case W.KEY.UP:
                    unFocus(_this.textIndex);
                    if(_this.textIndex == 0) {
                        if(isLooping) {
                            _this.topIndex = (total-1)-(total-1)%11;
                            _this.textIndex = total-1;
                            checkComp(function() {
                                _comp._innerDiv.setY(_this.topIndex*-textGapY);
                                setFocus(_this.textIndex);
                                _param.parent.setScroll();
                            });
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        _this.textIndex--;
                    }

                    if(_this.textIndex < _this.topIndex) {
                        _this.topIndex = _this.topIndex-11;
                        checkComp(function() {
                            _comp._innerDiv.setY(_this.topIndex*-textGapY);

                            setFocus(_this.textIndex);
                            _param.parent.setScroll();
                        });
                        return true;
                    }

                    setFocus(_this.textIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.textIndex);
                    if(_this.textIndex == total-1) {
                        _this.textIndex = 0;
                        _this.topIndex = 0;

                        _comp._innerDiv.setY(_this.topIndex*-textGapY);

                    } else {
                        _this.textIndex++;
                    }

                    if(_this.textIndex > _this.topIndex+10) {
                        _this.topIndex = _this.textIndex;
                        checkComp(function() {
                            _comp._innerDiv.setY(_this.topIndex*-textGapY);
                            setFocus(_this.textIndex);
                            _param.parent.setScroll();
                        });
                        break;
                    }
                    setFocus(_this.textIndex);
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.topIndex = idx * 11;
                checkComp(function() {
                    _this.textIndex = _this.topIndex;
                    if(_this.textIndex < 0) _this.textIndex = 0;
                    _comp._innerDiv.setY(_this.topIndex*-textGapY);
                });
            }
        }

        this.addData = function(_data) {
            addData(_data);
        };

        this.setDimmed = function(idx, opacity) {
        };

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.getPageIdx = function() {
            return Math.floor(_this.topIndex/11);
        };

        this.getTotalPage = function() {
            return Math.floor((total-1)/11)+1;
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
        this.getPosterComp = function() {
            if(!_posterComp) createPosterComp();
            return _posterComp;
        };
        this.setFull = function(isFull, _x, _y) {
            if(_posterComp) _posterComp.setStyle({x:_x ? _x : 921, y:_y ? _y : 0});
            if(isFull) {
                _comp.setStyle({height: 549});
                _posterComp._poster_1.setStyle({width:246, height:350});
                //if(_posterComp && _this.texts[_this.textIndex-1]) _posterComp._poster_0.setStyle({display:"block"});
                //if(_posterComp && _this.texts[_this.textIndex+1]) _posterComp._poster_2.setStyle({display:"block"});
            } else {
                _comp.setStyle({height: 299});
                _posterComp._poster_1.setStyle({width:210, height:300});
                //if(_posterComp) _posterComp._poster_0.setStyle({display:"none"});
                //if(_posterComp && _this.texts[_this.textIndex+1]) _posterComp._poster_2.setStyle({display:"block"});
            }
        }

        this.componentName = "TextList"
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
        this.getCurrentData = function() {
            return data[_this.textIndex];
        }
        this.releaseRestrict = function() {
            for(var i = 0; i < _this.texts.length; i++) {
                if(_this.texts[i].releaseRestrict) {
                    _this.texts[i].releaseRestrict();
                }
            }
            setPoster();
        }
    }
    TextList.TYPE = Object.freeze({NORMAL:0, RANKING:1});
    return TextList;
});