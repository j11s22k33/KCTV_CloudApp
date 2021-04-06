/**
 * Created by yj.yoon on 2018-01-18.
 */
W.defineModule("comp/my/MyList", ["mod/Util"], function(util) {
    function MyList(_param) {
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

            if(type == MyList.TYPE.NOTICE) {
                _width = 1024;
                subjectText = [W.Texts["title"], W.Texts["date"]];
                subjectWidth = [824, 200];
                subjectAlign = ["left", "center"];
            } else if(type == MyList.TYPE.SUBSCRIBE) {
                _width = 1024;
                subjectText = [W.Texts["title"], W.Texts["join_date"], W.Texts["price"]];
                subjectWidth = [644, 190, 190];
                subjectAlign = ["left", "center", "center"];
            } else if(type == MyList.TYPE.COUPON) {
                _width = 745;
                subjectText = [W.Texts["coupon_name"], W.Texts["usable_price_amount2"], W.Texts["usable_duration"]];
                subjectWidth = [405, 150, 190];
                subjectAlign = ["left", "center", "center"];
            } else if(type == MyList.TYPE.COIN) {
                _width = 745;
                subjectText = [W.Texts["coin_name"], W.Texts["coin_balance"], W.Texts["usable_duration"]];
                subjectWidth = [405, 150, 190];
                subjectAlign = ["left", "center", "center"];
            } else if(type == MyList.TYPE.PURCHASE_COIN) {
                _width = 1024;
                subjectText = [W.Texts["title"], W.Texts["purchase_date"], W.Texts["price"]];
                subjectWidth = [644, 190, 190];
                subjectAlign = ["left", "center", "center"];
            }

            _this.textIndex = 0;
            _this.topIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({});

            _comp._firstRow = new W.Div({width:_width, height:45});
            _comp._firstRow.add(new W.Div({x:0,y:42,width:_width,height:3,color:"rgba(131,122,119,0.25)"}));
            for(var i = 0; i < subjectText.length; i++) {
                var comp = new W.Div({position:"relative", float:"left", height:45, lineHeight:"45px", paddingLeft:"18px", paddingRight:"18px",
                    width:subjectWidth[i]-36, text:subjectText[i], textAlign:subjectAlign[i],
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
        };

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
                if(type == MyList.TYPE.NOTICE) {
                    var noticeDate = data.startDate.substr(0,4) + "." +  data.startDate.substr(4,2) + "." +  data.startDate.substr(6,2);
                    dataArray= [data.title, noticeDate];
                } else  if(type == MyList.TYPE.SUBSCRIBE) {
                    dataArray= [data.title, data.subscribedAt.substr(0,10), W.Util.formatComma(util.vatPrice(data.listPrice))+W.Texts["price_unit"]];
                } else  if(type == MyList.TYPE.COUPON) {
                    var now = new Date();
                    var date = String(now.getFullYear());
                    date += now.getMonth() + 1 > 9 ? String(now.getMonth() + 1) : "0" + (now.getMonth() + 1);
                    date += now.getDate() > 9 ? String(now.getDate()) : "0" + now.getDate();
                    if(Number(data.EffectiveEndDate) < Number(date)){
                        data.isExpired = true;
                        //data.isDimmed = true;
                    }
                    var value;
                    if(data.Status && data.Status == "A") {
                        if(data.DCGubun) {
                            if(data.DCGubun=="R"){
                                if(data.DCValue >= 100) {
                                    value = W.Texts["price_free"];
                                } else {
                                    value = W.Util.formatComma(data.DCValue)+"%" + " " + W.Texts["discount_text"];
                                    //if(data.DCValue == 0) data.isDimmed = true;
                                }
                            } else {
                                value = W.Util.formatComma(data.DCValue)+W.Texts["price_unit"] + " " + W.Texts["discount_text"];
                                //if(data.DCValue == 0) data.isDimmed = true;
                            }
                        } else {
                            value = W.Util.formatComma(data.BalanceAmount)+W.Texts["price_unit"];
                            //if(data.BalanceAmount == 0) data.isDimmed = true;
                        }
                    } else {
                        value = W.Texts["use_complete"];
                        data.isDimmed = true;
                    }
                    

                    var duration;
                    if(data.OfferGubun == "M" || parseInt(data.EffectiveEndDate) >= 22000101){
                    	duration = W.Texts["until_termination"];
                    }else{
                    	duration = util.setCouponDate(data.EffectiveEndDate,".") + (data.isExpired ? " " + W.Texts["expired"]:" " + W.Texts["until"].replace("@until@ ",""));
                    }
                    
                    dataArray= [data.CouponName, value, duration];
                } else  if(type == MyList.TYPE.COIN) {
                    var now = new Date();
                    var date = String(now.getFullYear());
                    date += now.getMonth() + 1 > 9 ? String(now.getMonth() + 1) : "0" + (now.getMonth() + 1);
                    date += now.getDate() > 9 ? String(now.getDate()) : "0" + now.getDate();
                    if(Number(data.EffectiveEndDate) < Number(date)){
                        data.isExpired = true;
                        //data.isDimmed = true;
                    }

                    var price = "";
                    if(data.Status && data.Status == "A") {
                        price = W.Util.formatComma(data.BalanceAmount)+W.Texts["price_unit"];
                        if(data.OfferGubun=="M"){
                            price = W.Util.formatComma(data.OfferAmount)+W.Texts["price_unit"];
                        }
                    } else {
                        price = W.Texts["use_complete"];
                        data.isDimmed = true;
                    }

                    
                    var duration;
                    if(data.OfferGubun == "M" || parseInt(data.EffectiveEndDate) >= 22000101){
                    	duration = W.Texts["until_termination"];
                    }else{
                    	duration = util.setCouponDate(data.EffectiveEndDate,".") + (data.isExpired ? " " + W.Texts["expired"]:" " + W.Texts["until"].replace("@until@ ",""));
                    }

                    //if(price !=undefined && price == 0) {
                    //    data.isDimmed = true;
                    //}

                    dataArray= [data.CouponName, price, duration];
                } else  if(type == MyList.TYPE.PURCHASE_COIN) {
                    var price = W.Util.formatComma(data.BalanceAmount);
                    if(data.OfferGubun=="M"){
                        price = W.Util.formatComma(data.OfferAmount);
                    }

                    dataArray= [data.CouponName,  util.setCouponDate(data.EffectiveStartDate,"."), price+W.Texts["price_unit"]];
                }

                for(var i = 0; i < dataArray.length; i++) {
                    if(i == 0) {
                        _comp._normalDiv._span[i] = new W.Div({opacity : data.isDimmed ? 0.5 : 1, position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"18px", paddingRight:"18px",
                            width:subjectWidth[i]-36, text:(data.noticeType == "1"? "[" + W.Texts["emergency"] + "] " : "") + dataArray[i], textAlign:subjectAlign[i], className:"cut",
                            textColor:data.noticeType == "1" ? "rgba(237,168,2,0.9)" : "rgba(181,181,181,0.9)", fontFamily:"RixHeadL", "font-size":"24px", "letter-spacing":"-1.0px"});
                    } else {
                        _comp._normalDiv._span[i] = new W.Div({opacity : data.isDimmed ? 0.5 : 1, position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"18px", paddingRight:"18px",
                            width:subjectWidth[i]-36, text:dataArray[i], textAlign:subjectAlign[i], className:"cut",
                            textColor:"rgba(131,122,119,0.9)", fontFamily:"RixHeadL", "font-size":"20px", "letter-spacing":"-0.85px"});
                    }

                    _comp._normalDiv.add(_comp._normalDiv._span[i]);
                }

                _comp.add(_comp._normalDiv);

                _comp._focusDiv = new W.Div({x:0, y:0, width:_width, height:60, zIndex : 1, display:"none"});

                _comp._focusDiv._span = [];
                for(var i = 0; i < dataArray.length; i++) {
                    if(i == 0) {
                        _comp._focusDiv._span[i] = new W.Div({opacity : data.isDimmed ? 0.5 : 1, position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"18px", paddingRight:"18px",
                            width:subjectWidth[i]-36, text:(data.noticeType == "1"? "[" + W.Texts["emergency"] + "] " : "") + dataArray[i], textAlign:subjectAlign[i], className:"cut",
                            textColor:data.noticeType == "1" ? "rgba(237,168,2,0.9)" : "rgba(255,255,255,0.9)", fontFamily:"RixHeadM", "font-size":"24px", "letter-spacing":"-1.0px"});
                    } else {
                        _comp._focusDiv._span[i] = new W.Div({opacity : data.isDimmed ? 0.5 : 1, position:"relative", float:"left", height:60, lineHeight:"60px", paddingLeft:"18px", paddingRight:"18px",
                            width:subjectWidth[i]-36, text:dataArray[i], textAlign:subjectAlign[i], className:"cut",
                            textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadL", "font-size":"20px", "letter-spacing":"-0.85px"});
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

        var createPosterComp = function() {
            isPoster = true;
            _posterComp = new W.Div({width:210, height:720});
            _posterComp._innerDiv = new W.Div({});

            _posterComp._poster_0 = new W.Div({x:35,y:0, width:140, height:160, "background-size":"140px 160px", opacity:0.5});
            _posterComp._poster_0.add(new W.Div({width:140, height:160, color:"#000000", opacity:0.6}));
            _posterComp._innerDiv.add(_posterComp._poster_0);
            _posterComp._poster_1 = new W.Div({x:0,y:210, width:210, height:300, "background-size":"210px 300px"});
            _posterComp._innerDiv.add(_posterComp._poster_1);
            _posterComp._poster_2 = new W.Div({x:35,y:560, width:140, height:160, "background-size":"140px 160px", opacity:0.5});
            _posterComp._poster_2.add(new W.Div({width:140, height:160, color:"#000000", opacity:0.6}));
            _posterComp._innerDiv.add(_posterComp._poster_2);

            _posterComp.add(_posterComp._innerDiv);

            setPoster();
        };

        var setPoster = function() {
            if(_this.texts[_this.textIndex-1]) _posterComp._poster_0.setStyle({display:"block",
                "background-image":"url('"+util.getPosterFilePath(data[_this.textIndex-1].posterBaseUrl, 140)+"')"});
            else _posterComp._poster_0.setStyle({display:"none", "background-image":""});
            if(_this.texts[_this.textIndex]) _posterComp._poster_1.setStyle({display:"block",
                "background-image":"url('"+util.getPosterFilePath(data[_this.textIndex].posterBaseUrl, 210)+"')"});
            else _posterComp._poster_1.setStyle({display:"none", "background-image":"", "background-size":"210px 300px"});
            if(_this.texts[_this.textIndex+1]) _posterComp._poster_2.setStyle({display:"block",
                "background-image":"url('"+util.getPosterFilePath(data[_this.textIndex+1].posterBaseUrl, 140)+"')"});
            else _posterComp._poster_2.setStyle({display:"none", "background-image":""});
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
                    if(type == MyList.TYPE.COUPON || type == MyList.TYPE.COIN) {
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
        
        this.getIndex = function() {
            return _this.textIndex;
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
        this.getPosterComp = function() {
            if(!_posterComp) createPosterComp();
            return _posterComp;
        };

        this.componentName = "MyList"
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
    }
    MyList.TYPE = Object.freeze({NOTICE:0, COUPON:1, SUBSCRIBE:2, COIN:3, PURCHASE_COIN:4});
    return MyList;
});