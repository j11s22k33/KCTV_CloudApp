W.defineModule("comp/list/Text", [ "mod/Util"], function(util) {
    function Text(_param) {
        var _this;

        var _comp;

        var isFocused;
        
        var type = _param.type;
        var data = _param.data;

        var isRank = _param.isRank;
        var isClearPin = _param.isClearPin;

        var create = function(){
            var _title = data.title;

            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _title = "";
                    for(var i = 0; i < data.title.length; i++) {
                        if(i==0) _title = data.title.substr(0,1);
                        else _title += "*";
                    }
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {

                }
            }
            
            _comp = new W.Div({x:0, y:0, width:674, height:50});

            _comp._normalDiv = new W.Div({x:0, y:0, width:674, height:50});

            _comp._normalDiv.add(new W.Div({x:0,y:48, width:674, height:1, color:"#837A77", opacity:0.25}));

            if(isRank && data.ranking) {
                _comp._normalDiv._rankDiv = new W.Div({x:0,y:0, width:105, height:50});
                _comp._normalDiv._rankDiv._rank = new W.Div({x:0,y:0,width:40, lineHeight:"50px", float:"left",  fontFamily:"RixHeadB", textAlign:"center"});
                _comp._normalDiv._rankDiv._rank.add(new W.Span({position:"relative", text:data.ranking.rank, textColor:"rgba(255,255,255,1)",
                    "font-size":"16px", "letter-spacing":"-0.8px", marginRight:"2px"}));
                _comp._normalDiv._rankDiv._rank.add(new W.Span({position:"relative", text:W.Texts["unit_rank"], textColor:"rgba(255,255,255,1)",
                    "font-size":"13px", "letter-spacing":"-0.65px"}));
                _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._rank);

                if(data.ranking.change == 0) {
                    _comp._normalDiv._rankDiv._change = new W.Div({x:65,y:25, width:11, height:2, color:"rgba(255,255,255,0.7)"});
                    _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._change);
                } else {
                    _comp._normalDiv._rankDiv._changeIcon = new W.Div({x:213-160,y:134-113});
                    _comp._normalDiv._rankDiv._change = new W.Div({x:248-160-30,y:0, width:30, lineHeight:"50px", textAlign:"right", text:Math.abs(data.ranking.change),
                        textColor:"rgb(255,255,255)", "font-size":"14px", "letter-spacing":"-0.7px", fontFamily:"RixHeadB"});

                    if(data.ranking.change > 0) {
                        _comp._normalDiv._rankDiv._change.setStyle({textColor:"rgb(255,80,80)"});
                        _comp._normalDiv._rankDiv._changeIcon.add(new W.Image({x:0, y:0, width:11, height:9, src:"img/04_rank_up.png"}));
                    } else {
                        _comp._normalDiv._rankDiv._change.setStyle({textColor:"rgb(104,178,255)"});
                        _comp._normalDiv._rankDiv._changeIcon.add(new W.Image({x:0, y:0, width:11, height:9, src:"img/04_rank_down.png"}));
                    }
                    _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._change);
                    _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._changeIcon);
                }
                _comp._normalDiv.add(_comp._normalDiv._rankDiv);

                _comp._normalDiv._title = new W.Div({x:115, y:0, width:674-105, height:50});
            } else {
                _comp._normalDiv._title = new W.Div({x:10, y:0, width:674, height:50});

            }

            _comp._normalDiv._title._rating = new W.Image({position:"relative", y:3, float:"left", src:"img/icon_age_lock_list.png",
                display:"none", marginLeft:"-8px"});
            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _comp._normalDiv._title._rating.setStyle({display:""});
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {
                    _comp._normalDiv._title._rating.setStyle({display:""});
                }
            }
            _comp._normalDiv._title.add(_comp._normalDiv._title._rating);
            _comp._normalDiv._title._span = new W.Div({position:"relative", float:"left", height:50, lineHeight:"50px", paddingRight:"5px",
                text:_title, className:"cut", textColor:"rgba(196,196,196,0.9)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"left"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);

            //if(data.isPinned) {
            //    _comp._normalDiv._title._span.setStyle({maxWidth:POSTER_WIDTH-23+"px"})
            //    _comp._normalDiv._title.add(new W.Image({position:"relative", x:2, y:-4, src:"img/info_heart.png"}));
            //}

            _comp._normalDiv._title._info = new W.Div({position:"relative", float:"left", y:15, height:21, opacity:0.6, paddingLeft:"10px", paddingRight:"20px"});
            
            var ratingImg = "info_all_2.png";
            if(data.rating == "0") ratingImg = "info_all_2.png";
            else if(data.rating == "7") ratingImg = "info_7_2.png";
            else if(data.rating == "12") ratingImg = "info_12_2.png";
            else if(data.rating == "15") ratingImg = "info_15_2.png";
            else if(data.rating == "19" || data.rating == "19+") ratingImg = "info_19_2.png";
            _comp._normalDiv._title._info.add(new W.Div({position:"relative", float:"left", y:0,width:21, height:21,
                backgroundImage:"url(img/"+ratingImg+")", marginRight:"3px"}));
            _comp._normalDiv._title.add(_comp._normalDiv._title._info);
            
            if(data.asset && data.asset.originProduct != "FOD")
                _comp._normalDiv._title._info.add(new W.Div({position:"relative", float:"left", x:0,y:0,width:21, height:21,
                    backgroundImage:"url(img/info_pay_2.png)", marginRight:"3px"}));

            _comp._normalDiv._title.add(_comp._normalDiv._title._info);


            _comp._normalDiv._title._icons = new W.Div({position:"relative", float:"right", x:-10, y:7, opacity:0.6});
            _comp._normalDiv._title.add(_comp._normalDiv._title._icons);

            _comp._normalDiv.add(_comp._normalDiv._title);

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0, y:0, width:674, height:4, zIndex : 1, visibility:"hidden"});

            if(isRank && data.ranking) {
                _comp._focusDiv._rankDiv = new W.Div({x:0,y:0, width:105, height:50});
                _comp._focusDiv._rankDiv._rank = new W.Div({x:0,y:0,width:40, lineHeight:"50px", float:"left",  fontFamily:"RixHeadB", textAlign:"center"});
                _comp._focusDiv._rankDiv._rank.add(new W.Span({position:"relative", text:data.ranking.rank, textColor:"rgba(255,255,255,1)",
                    "font-size":"16px", "letter-spacing":"-0.8px", marginRight:"2px"}));
                _comp._focusDiv._rankDiv._rank.add(new W.Span({position:"relative", text:W.Texts["unit_rank"], textColor:"rgba(255,255,255,1)",
                    "font-size":"13px", "letter-spacing":"-0.65px"}));
                _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._rank);

                if(data.ranking.change == 0) {
                    _comp._focusDiv._rankDiv._change =  new W.Div({x:65,y:25, width:11, height:2, color:"rgba(255,255,255,0.7)"});
                    _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._change);
                } else {
                    _comp._focusDiv._rankDiv._changeIcon = new W.Div({x:213-160,y:134-113});
                    _comp._focusDiv._rankDiv._change =  new W.Div({x:248-160-30,y:0, width:30, lineHeight:"50px", textAlign:"right", text:Math.abs(data.ranking.change),
                        textColor:"rgb(255,255,255)", "font-size":"14px", "letter-spacing":"-0.7px", fontFamily:"RixHeadB"});

                    if(data.ranking.change > 0) {
                        _comp._focusDiv._rankDiv._change.setStyle({textColor:"rgb(255,80,80)"});
                        _comp._focusDiv._rankDiv._changeIcon.add(new W.Image({x:0, y:0, width:11, height:9, src:"img/04_rank_up.png"}));
                    } else {
                        _comp._focusDiv._rankDiv._change.setStyle({textColor:"rgb(104,178,255)"});
                        _comp._focusDiv._rankDiv._changeIcon.add(new W.Image({x:0, y:0, width:11, height:9, src:"img/04_rank_down.png"}));
                    }
                    _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._change);
                    _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._changeIcon);
                }
                _comp._focusDiv.add(_comp._focusDiv._rankDiv);

                _comp._focusDiv._title = new W.Div({x:115, y:0, width:674-105, height:50});
            } else {
                _comp._focusDiv._title = new W.Div({x:10, y:0, width:674, height:50});
            }

            _comp._focusDiv._title._rating = new W.Image({position:"relative", y:3, float:"left", src:"img/icon_age_lock_list.png",
                display:"none", marginLeft:"-8px"});
            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _comp._focusDiv._title._rating.setStyle({display:""});
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {
                    _comp._focusDiv._title._rating.setStyle({display:""});
                }
            }
            _comp._focusDiv._title.add(_comp._focusDiv._title._rating);
            _comp._focusDiv._title._span = new W.Div({position:"relative", float:"left", height:50, lineHeight:"50px", paddingRight:"5px",
                className:"cut", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"24px", textAlign:"left"});
            _comp._focusDiv._title._span._inner = new W.Div({text:_title});
            _comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
            _comp._focusDiv._title.add(_comp._focusDiv._title._span);

            //if(data.isPinned) {
            //    _comp._normalDiv._title._span.setStyle({maxWidth:POSTER_WIDTH-23+"px"})
            //    _comp._normalDiv._title.add(new W.Image({position:"relative", x:2, y:-4, src:"img/info_heart.png"}));
            //}

            _comp._focusDiv._title._info = new W.Div({position:"relative", float:"left", y:15, height:21, paddingLeft:"10px", paddingRight:"20px"});

            var ratingImg = "info_all_2.png";
            if(data.rating == "0") ratingImg = "info_all_2.png";
            else if(data.rating == "7") ratingImg = "info_7_2.png";
            else if(data.rating == "12") ratingImg = "info_12_2.png";
            else if(data.rating == "15") ratingImg = "info_15_2.png";
            else if(data.rating == "19" || data.rating == "19+") ratingImg = "info_19_2.png";
            _comp._focusDiv._title._info.add(new W.Div({position:"relative", float:"left", y:0,width:21, height:21,
                backgroundImage:"url(img/"+ratingImg+")", marginRight:"3px"}));
            _comp._focusDiv._title.add(_comp._focusDiv._title._info);

            if(data.asset && data.asset.originProduct != "FOD")
                _comp._focusDiv._title._info.add(new W.Div({position:"relative", float:"left", x:0,y:0,width:21, height:21,
                    backgroundImage:"url(img/info_pay_2.png)", marginRight:"3px"}));
            if(data.isProductDubbing) {
            _comp._focusDiv._title._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px",
                src:"img/info_dub.png"}));
            }
            if(data.isProductCaption) {
                _comp._focusDiv._title._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginRight:"2px",
                    src:"img/info_sub.png"}));
            }
            if(data.likes) {
                _comp._focusDiv._title._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"5px",
                    marginRight:"6px", src:"img/info_heart.png"}));
                _comp._focusDiv._title._info.add(new W.Div({position:"relative", float:"left", text:data.likes?data.likes:0, marginTop:"2px", className:"cut",
                    textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));
            }

            _comp._focusDiv._title._icons = new W.Div({position:"relative", float:"right", x:-10, y:7});
            _comp._focusDiv._title.add(_comp._focusDiv._title._icons);

            _comp._focusDiv.add(_comp._focusDiv._title);

            _comp._focusDiv.add(new W.Image({x:0,y:45,width:10,height:4,src:"img/line_f_l_10.png"}));
            _comp._focusDiv.add(new W.Image({x:664,y:45,width:10,height:4,src:"img/line_f_r_10.png"}));
            _comp._focusDiv.add(new W.Div({x:10, y:45, width:654, height:4, color:"#E53000"}));

            _comp.add(_comp._focusDiv);

            var iconWidth = 0;
            var iconCount = 0;
            if(iconCount < 2 && data.isNew) {
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_new_2.png)",
                    marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_new_2.png)",
                    marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }
            if(iconCount < 2 && data.ranking && data.ranking.rank && data.ranking.rank < 11) {
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_top_2.png)",
                    marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_top_2.png)",
                    marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }

            if(iconCount < 2 && data.isSale) {
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_sale_2.png)",
                    marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_sale_2.png)",
                    marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }

            if(iconCount < 2 && data.isHot) {
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_hot_2.png)",
                    marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_hot_2.png)",
                    marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }

            //2그룹 - UHD, Time세일
            if(iconCount < 4 && data.isTimeSale) {
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_timesale_2.png)",
                    marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_timesale_2.png)",
                    marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;

                var timesaleEnd = util.getDateFormat("~ MM.dd HH:mm", util.newDate(data.timeSaleEnd));
                //timesale end
                _comp._normalDiv._title._icons._timeEnd = new W.Div({position:"relative", float:"left", width:93, fontFamily:"RixHeadB", textAlign:"right",
                    marginRight:"5px"});
                _comp._normalDiv._title._icons._timeEnd.add(new W.Div({position:"relative", height:15, lineHeight:"15px",
                    text:"TIME SALE", className:"cut", textColor:"rgba(237,168,2,1)", "font-size":"13px", textAlign:"right", "letter-spacing":"-0.65px"}));
                _comp._normalDiv._title._icons._timeEnd.add(new W.Div({position:"relative", height:15, lineHeight:"15px",
                    text:timesaleEnd, className:"cut", textColor:"rgba(255,255,255,1)", "font-size":"15px", textAlign:"right", "letter-spacing":"-0.75px"}));
                _comp._normalDiv._title._icons.add(_comp._normalDiv._title._icons._timeEnd);
                _comp._focusDiv._title._icons._timeEnd = new W.Div({position:"relative", float:"left", width:93, fontFamily:"RixHeadB", textAlign:"right",
                    marginRight:"5px"});
                _comp._focusDiv._title._icons._timeEnd.add(new W.Div({position:"relative", height:15, lineHeight:"15px",
                    text:"TIME SALE", className:"cut", textColor:"rgba(237,168,2,1)", "font-size":"13px", textAlign:"right", "letter-spacing":"-0.65px"}));
                _comp._focusDiv._title._icons._timeEnd.add(new W.Div({position:"relative", height:15, lineHeight:"15px",
                    text:timesaleEnd, className:"cut", textColor:"rgba(255,255,255,1)", "font-size":"15px", textAlign:"right", "letter-spacing":"-0.75px"}));
                _comp._focusDiv._title._icons.add(_comp._focusDiv._title._icons._timeEnd);
                iconCount++;
                iconWidth+=98;
            }
            if(iconCount < 4 && data.isUHD) {
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_uhd_2.png)",
                    marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_uhd_2.png)",
                    marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }
            
            //3그룹 - 할인율
            if(iconCount < 4 && !data.isTimeSale && data.saleCode) {
                var saleString = "";
                if(data.saleCode == "할인") saleString = "dc";
                else if(data.saleCode == "100%") saleString = "free";
                else saleString = data.saleCode.replace('%','dc');
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31,
                    backgroundImage:"url(img/icon_"+saleString+"_2.png)", marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31,
                    backgroundImage:"url(img/icon_"+saleString+"_2.png)", marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }

            //4그룹 - 이벤트, 쿠폰, 경품
            if(iconCount < 4 && !data.isTimeSale && data.eventCode && data.eventCode != "") {
                var iconString = "event";
                //if(data.eventCode == "쿠폰") iconString = "coupon";
                //else if(data.eventCode == "경품") iconString = "gift";
                _comp._normalDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_"+iconString+"_2.png)", marginRight:"5px"}));
                _comp._focusDiv._title._icons.add(new W.Div({position:"relative", float:"left", width:40, height:31, backgroundImage:"url(img/icon_"+iconString+"_2.png)", marginRight:"5px"}));
                iconCount++;
                iconWidth+=45;
            }
            setTimeout(function(){
                var widthGap = 0;
                if(isRank && data.ranking) {
                    widthGap -= 105;
                }
                if(!isClearPin && W.StbConfig.adultMenuUse) {
                    if(data.isAdult) {
                        widthGap -= 30;
                    } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {
                        widthGap -= 30;
                    }
                }
                _comp._normalDiv._title._span.setStyle({maxWidth:664+widthGap-_comp._normalDiv._title._icons.comp.offsetWidth-_comp._normalDiv._title._info.comp.offsetWidth+"px"});
                //_comp._focusDiv._title._span.setStyle({maxWidth:664-_comp._focusDiv._title._icons.comp.offsetWidth-_comp._focusDiv._title._info.comp.offsetWidth+"px"});
                if(_comp._focusDiv._title._span._inner.comp.offsetWidth > (664+widthGap-_comp._focusDiv._title._icons.comp.offsetWidth-_comp._focusDiv._title._info.comp.offsetWidth)) {
                    _comp._focusDiv._title._span.setStyle({width:664+widthGap-_comp._focusDiv._title._icons.comp.offsetWidth-_comp._focusDiv._title._info.comp.offsetWidth+"px"});
                } else {
                    _comp._focusDiv._title._span.setStyle({width:_comp._focusDiv._title._span._inner.comp.offsetWidth+"px"});
                }
            });
        };

        var setFocus = function() {
            isFocused = true;
            if(_comp._focusDiv) {
                _comp._focusDiv.setStyle({visibility:"visible"});
                setTimeout(function(){
                    util.setMarquee(_comp._focusDiv._title._span._inner, 500);
                })
            }
            if(_comp._normalDiv) _comp._normalDiv.setStyle({visibility:"hidden"});
        };

        var unFocus = function() {
            isFocused = false;
            if(_comp._focusDiv){
                _comp._focusDiv.setStyle({visibility:"hidden"});
                util.stopMarquee(_comp._focusDiv._title._span._inner, 500);
            }
            if(_comp._normalDiv) _comp._normalDiv.setStyle({visibility:"visible"});
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

        this.releaseRestrict = function() {
            isClearPin = true;
            if(_comp._normalDiv._title) {
                if(_comp._normalDiv._title._span) {
                    _comp._normalDiv._title._span.setText(data.title);
                }
                if(_comp._normalDiv._title._rating) _comp._normalDiv._title._rating.setStyle({display:"none"});
            }
            if(_comp._focusDiv._title) {
                if(_comp._focusDiv._title._span) {
                    _comp._focusDiv._title._span.setStyle({width:674});
                    _comp._focusDiv._title._span._inner.setStyle({position:"absolute"});
                    _comp._focusDiv._title._span._inner.setText(data.title);
                }
                if(_comp._focusDiv._title._rating) _comp._focusDiv._title._rating.setStyle({display:"none"});
            }

            var widthGap = 0;
            if(isRank && data.ranking) {
                widthGap -= 105;
            }
            _comp._normalDiv._title._span.setStyle({maxWidth:664+widthGap-_comp._normalDiv._title._icons.comp.offsetWidth-_comp._normalDiv._title._info.comp.offsetWidth+"px"});
            if(_comp._focusDiv._title._span._inner.comp.offsetWidth > (664+widthGap-_comp._focusDiv._title._icons.comp.offsetWidth-_comp._focusDiv._title._info.comp.offsetWidth)) {
                _comp._focusDiv._title._span.setStyle({width:664+widthGap-_comp._focusDiv._title._icons.comp.offsetWidth-_comp._focusDiv._title._info.comp.offsetWidth+"px"});
            } else {
                _comp._focusDiv._title._span.setStyle({width:_comp._focusDiv._title._span._inner.comp.offsetWidth+"px"});
            }

            if(isFocused) setFocus();
        }
    }

    Text.TYPE = Object.freeze({W136:0, W113:1});

    return Text;
});