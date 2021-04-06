/**
 * Created by yj.yoon on 2018-01-18.
 */
W.defineModule("comp/guide/ProgramList", ["mod/Util"], function(util) {
    function ProgramList(_param) {
        var _this = this;

        var dataManager = W.getModule("manager/SdpDataManager");
        
        var backCallbackFunc;
        var mode = 0;
        var tops = [412, 188, 0];
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

        var data, isLooping;

        var _width, subjectText, subjectWidth, subjectAlign;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        //var BANNER_TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
        var MODE_TYPE = Object.freeze({LIST:0});

        var create = function(){
            type = _param.type;
            data = _param.data;
            isLooping = true;

            textGapY = 60;

            _this.textIndex = 0;
            _this.topIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({});

            if(!W.CH_LIST) {
                W.Loading.start();
                dataManager.getChannelRegions(function(isSuccess, result){
                    if(isSuccess) {
                        if(result && result.data && result.data.length > 0) {
                            W.CH_LIST = result.data;

                            makeList();
                            W.Loading.stop();
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
                }, {offset:0, limit:0});
            } else {
                makeList();
            }


        };

        function makeList() {
            if(type == ProgramList.TYPE.RESERVED) {
                _width = 1024;
                subjectText = [W.Texts["channel"], "", W.Texts["prog_name"], W.Texts["date_time"]];
                subjectWidth = [90, 180, 534, 220];
                subjectAlign = ["center", "left", "left", "center"];
            }

            _comp._firstRow = new W.Div({width:_width, height:45});
            _comp._firstRow.add(new W.Div({x:0,y:42,width:_width,height:3,color:"rgba(131,122,119,0.25)"}));
            for(var i = 0; i < subjectText.length; i++) {
                var comp = new W.Div({position:"relative", float:"left", height:45, lineHeight:"45px", paddingLeft:"28px", paddingRight:"28px",
                    width:subjectWidth[i]-56, text:subjectText[i], textAlign:"center",
                    textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"17px", "letter-spacing":"-0.85px"});
                _comp._firstRow.add(comp);
            }

            _comp.add(_comp._firstRow);



            _comp._listDiv = new W.Div({x:-1, y:60, width:_width+2, height:483, overflow:"hidden"});
            _comp._listDiv._innerDiv = new W.Div({x:1, y:2});

            _this.texts = [];
            _comp._textsComp = [];

            var rowCount = -1;
            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                _this.texts[i] = new Text({data:data[i], underLine : (i%8 == 7 || i == data.length-1)? false : true});

                _comp._textsComp[i] = _this.texts[i].getComp();
                _comp._textsComp[i].setStyle({y:i*60});
                _comp._listDiv._innerDiv.add( _comp._textsComp[i]);
            }
            _comp._listDiv.add(_comp._listDiv._innerDiv);

            _comp.add(_comp._listDiv);
        }

        function Text(_param){
            var _this;

            var _comp;

            var data = _param.data;

            var create = function(){
                var dataArray;
                _comp = new W.Div({x:0, y:0, width:_width, height:60});

                if(_param.underLine) _comp.add(new W.Div({x:0,y:59, width:_width, height:1, color:"#837A77", opacity:0.25}));

                _comp._normalDiv = new W.Div({x:0, y:0, width:_width, height:60});

                _comp._normalDiv._span = [];
                if(type == ProgramList.TYPE.RESERVED) {
                    var date = util.newDate(parseInt(data.startTime));
                    var ch = util.findChannelbySrcId(data.sourceId);
                    dataArray= [util.changeDigit(ch.channelNum,3), ch.title,
                        data.title, util.getDateFormat("yyyy.MM.dd", date) + " (" + util.transDay(date.getDay()) + ") " + util.getDateFormat("HH:mm", date)];
                }

                for(var i = 0; i < dataArray.length; i++) {
                    if(i < 3) {
                        _comp._normalDiv._span[i] = new W.Div({position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"13px", paddingRight:"13px",
                            width:subjectWidth[i]-26, text:dataArray[i], textAlign:subjectAlign[i], className:"cut",
                            textColor:"rgba(181,181,181,0.9)", fontFamily:"RixHeadL", "font-size":"20px", "letter-spacing":"-1.0px"});
                    } else {
                        _comp._normalDiv._span[i] = new W.Div({position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"13px", paddingRight:"13px",
                            width:subjectWidth[i]-26, text:dataArray[i], textAlign:subjectAlign[i], className:"cut",
                            textColor:"rgba(131,122,119,0.9)", fontFamily:"RixHeadL", "font-size":"17px", "letter-spacing":"-0.85px"});
                    }

                    _comp._normalDiv.add(_comp._normalDiv._span[i]);
                }

                _comp.add(_comp._normalDiv);

                _comp._focusDiv = new W.Div({x:0, y:0, width:_width, height:60, zIndex : 1, display:"none"});

                _comp._focusDiv._span = [];
                for(var i = 0; i < dataArray.length; i++) {
                    if(i < 3) {
                        _comp._focusDiv._span[i] = new W.Div({position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"13px", paddingRight:"13px",
                            width:subjectWidth[i]-26, text:dataArray[i], textAlign:subjectAlign[i],
                            textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadM", "font-size":"20px", "letter-spacing":"-1.0px"});
                    } else {
                        _comp._focusDiv._span[i] = new W.Div({position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"13px", paddingRight:"13px",
                            width:subjectWidth[i]-26, text:dataArray[i], textAlign:subjectAlign[i],
                            textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadL", "font-size":"17px", "letter-spacing":"-0.85px"});
                    }

                    _comp._focusDiv.add(_comp._focusDiv._span[i]);
                }

                _comp._focusDiv.add(new W.Image({x:-1,y:-2,width:_width+2,height:63,src:"img/line_list"+(_width)+"_f.png"}));

                _comp.add(_comp._focusDiv);

            };

            var setFocus = function() {
                if(_comp._focusDiv) _comp._focusDiv.setDisplay("block");
                if(_comp._normalDiv) _comp._normalDiv.setDisplay("none");
            };

            var unFocus = function() {
                if(_comp._focusDiv) _comp._focusDiv.setDisplay("none");
                if(_comp._normalDiv) _comp._normalDiv.setDisplay("block");
            };

            this.getComp = function() {
                if(!_comp) create();
                return _comp;
            };

            this.setFocus = function() {
                setFocus();
            };

            this.unFocus = function() {
                unFocus();
            }
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

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(type == ProgramList.TYPE.COUPON) {
                        return false;
                    }
                    return true;
                    break;
                case W.KEY.LEFT:
                    unFocus(_this.textIndex);
                    break;
                case W.KEY.UP:
                    unFocus(_this.textIndex);
                    if(_this.textIndex == 0) {
                        if(isLooping) {
                            setPage(_this.getTotalPage()-1);
                            _this.textIndex = _this.texts.length-1;
                        } else {
                            return false;
                        }
                    } else {
                        _this.textIndex--;
                    }

                    if(_this.textIndex < _this.topIndex) {
                        _this.topIndex = _this.topIndex-8;
                        _comp._listDiv._innerDiv.setY(_this.topIndex*-textGapY+2);
                    }

                    setFocus(_this.textIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.textIndex);
                    if(_this.textIndex == _comp._textsComp.length-1) {
                        _this.textIndex = 0;
                        _this.topIndex = 0;

                        _comp._listDiv._innerDiv.setY(_this.topIndex*-textGapY+2);

                    } else {
                        _this.textIndex++;
                    }

                    if(_this.textIndex > _this.topIndex+7) {
                        _this.topIndex = _this.textIndex;
                        _comp._listDiv._innerDiv.setY(_this.topIndex*-textGapY+2);
                    }

                    setFocus(_this.textIndex);
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.topIndex = idx * 8;
                _this.textIndex = _this.topIndex;
                if(_this.textIndex < 0) _this.textIndex = 0;

                _comp._listDiv._innerDiv.setY(_this.topIndex*-textGapY+2);
            }
        }

        this.setDimmed = function(idx, opacity) {
        };

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.getPageIdx = function() {
            return Math.floor(_this.topIndex/8);
        };

        this.getTotalPage = function() {
            return Math.floor((_comp._textsComp.length-1)/8)+1;
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
        this.componentName = "ProgramList";
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
            return data[_this.textIndex];
        };
    }
    ProgramList.TYPE = Object.freeze({RESERVED:0});
    return ProgramList;
});