W.defineModule("comp/kids/Poster", [ "mod/Util"], function(util) {
    function Poster(_param) {
        var _this;

        var _comp;

        var isFocused;

        var type = _param.type;
        var data = _param.data;
        var idx = _param.idx;

        var type = _param.type;
        var data = _param.data;
        
        if(data.seriesId && data.subtitle){
        	data.title = data.subtitle;
        }
        
        var watchedData, purchaseData, playListData;
        if(_param.isWatched) {
            data = _param.data.asset;
            watchedData = _param.data;
        } else if(_param.isPurchase) {
            data = _param.data.asset;
            purchaseData = _param.data;
        } else if(_param.isPlayList) {
            data = _param.data.target;
            playListData = _param.data;
        }
        var isPackage = _param.isPackage;
        var textAlign = _param.textAlign;
        var isPurchase = _param.isPurchase;
        var isWatched = _param.isWatched;
        var isRecommend = _param.isRecommend;
        var isRank = _param.isRank;
        var isClearPin = _param.isClearPin;

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y, FOCUS_GAP, ICON_GAP,
            POSTER_WIDTH, POSTER_HEIGHT, POSTER_FOCUSED_WIDTH, POSTER_FOCUSED_HEIGHT, DEFAULT_POSTER, POSTER_SHADOW_WIDTH, POSTER_SHADOW_HEIGHT,
            DEFAULT_ADULT_POSTER, DEFAULT_FOCUSED_ADULT_POSTER;

        if(type == Poster.TYPE.W140) {
            NORMAL_DIV_WIDTH = 140, NORMAL_DIV_HEIGHT = 232, FOCUSED_DIV_WIDTH = 172, FOCUSED_DIV_HEIGHT = 288,
            POSTER_WIDTH = 140, POSTER_HEIGHT = 200, POSTER_FOCUSED_WIDTH = 158, POSTER_FOCUSED_HEIGHT = 226;
            DEFAULT_ADULT_POSTER = "img/poster_default_adult_w136.png", DEFAULT_FOCUSED_ADULT_POSTER = "img/poster_default_adult_w136.png";
            DEFAULT_POSTER = "img/kids_poster_default.png", POSTER_SHADOW_WIDTH = 158, POSTER_SHADOW_HEIGHT = 86;
            GAP_X = 14, GAP_Y = 15, FOCUS_GAP = 29, ICON_GAP = 43;
        } else if(type == Poster.TYPE.W113) {
            NORMAL_DIV_WIDTH = 113, NORMAL_DIV_HEIGHT = 199, FOCUSED_DIV_WIDTH = 219, FOCUSED_DIV_HEIGHT = 255,
            POSTER_WIDTH = 113, POSTER_HEIGHT = 162, POSTER_FOCUSED_WIDTH = 127, POSTER_FOCUSED_HEIGHT = 183;
            DEFAULT_ADULT_POSTER = "img/poster_default_adult_w136.png", DEFAULT_FOCUSED_ADULT_POSTER = "img/poster_default_adult_w136.png";
            DEFAULT_POSTER = "img/kids_poster_default.png", POSTER_SHADOW_WIDTH = 43, POSTER_SHADOW_HEIGHT = 162;
            GAP_X = 53, GAP_Y = 9, FOCUS_GAP = 5, ICON_GAP = 10;
        }

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

            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            _comp._normalDiv._defaultPoster = new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:DEFAULT_POSTER});
            _comp._normalDiv.add(_comp._normalDiv._defaultPoster);


            var posterUrl;
            if(data.logo) posterUrl = data.logo;
            else if(data.events && data.events[0] && data.events[0].posterUrl){
                posterUrl = W.Config.IMAGE_URL + data.events[0].posterUrl;
            } else if(!(data.events && data.events[0] && data.events[0].posterUrl) && (data.coupons && data.coupons[0] && data.coupons[0].posterUrl)) {
                posterUrl = W.Config.IMAGE_URL + data.coupons[0].posterUrl;
            } else if(data.posterBaseUrl) posterUrl = util.getPosterFilePath(data.posterBaseUrl, POSTER_FOCUSED_WIDTH);
            else if(data.image) posterUrl = data.image;
            //else if(data.posterUrl) posterUrl = W.Config.IMAGE_URL + data.posterUrl;
            else if(isPackage && purchaseData) {
                if (data.images) {
                    for (var i = 0; i < data.images.length; i++) {
                        if (data.images[i].type == "02") {
                            posterUrl = W.Config.IMAGE_URL + data.images[i].path;
                            break;
                        }
                    }
                }
            }
            if(posterUrl) {
                _comp._normalDiv._poster = new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT,
                    src:posterUrl, visibility:"hidden"});
                _comp._normalDiv.add(_comp._normalDiv._poster);

                _comp._normalDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._normalDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            }

            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _comp._normalDiv._rating = new W.Div({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT});
                    _comp._normalDiv._rating.add(new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:DEFAULT_ADULT_POSTER}));
                    _comp._normalDiv.add(_comp._normalDiv._rating);
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()){
                    _comp._normalDiv._rating = new W.Div({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, color:"rgba(0,0,0,0.7)"});

                    if(type == Poster.TYPE.W113) {
                        _comp._normalDiv._rating.add(new W.Image({x:478-408, y:117-111, width:41, height:45, src:"img/icon_age_lock.png"}));
                    } else {
                        _comp._normalDiv._rating.add(new W.Image({x:501-408, y:117-111, width:41, height:45, src:"img/icon_age_lock.png"}));
                    }
                    _comp._normalDiv.add(_comp._normalDiv._rating);
                }
            }

            _comp._normalDiv._title = new W.Div({x:4, y:POSTER_HEIGHT+7, width:POSTER_WIDTH-8, height:20});
            _comp._normalDiv._title._span = new W.Div({position:"relative", float:"left", maxWidth:POSTER_WIDTH-8+"px", height:26,
                text:data.title, className:"cut", textColor:"rgba(164,255,254,1)", fontFamily:"RixHeadL", "font-size":"20px",
                textAlign:"left", "letter-spacing":"-0.85px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv.add(_comp._normalDiv._title);
            if(data.isPinned) {
                _comp._normalDiv._title._span.setStyle({maxWidth:POSTER_WIDTH-23+"px"})
                _comp._normalDiv._title.add(new W.Image({position:"relative", x:2, y:-4, src:"img/info_heart.png"}));
            }

            if(type == Poster.TYPE.W140 && !isRecommend && !isPurchase) {
                _comp._normalDiv._icons = new W.Div({x:-12, y:3, width:60});
                _comp._normalDiv.add(_comp._normalDiv._icons);
            }

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});

            _comp._focusDiv._defaultPoster = new W.Image({x:5, y:6, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, src:DEFAULT_POSTER});
            _comp._focusDiv.add(_comp._focusDiv._defaultPoster);

            if(posterUrl) {
                _comp._focusDiv._poster = new W.Image({x:5, y:6, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, src:posterUrl, visibility:"hidden"});
                _comp._focusDiv.add(_comp._focusDiv._poster);

                _comp._focusDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._focusDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            }

            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _comp._focusDiv._rating = new W.Div({x:5, y:6, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT});
                    _comp._focusDiv._rating.add(new W.Image({x:0, y:0, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, src:DEFAULT_FOCUSED_ADULT_POSTER}));
                    _comp._focusDiv.add(_comp._focusDiv._rating);
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()){
                    _comp._focusDiv._rating = new W.Div({x:5, y:6, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, color:"rgba(0,0,0,0.7)"});

                    if(type == Poster.TYPE.W113) {
                        _comp._focusDiv._rating.add(new W.Image({x:932-849, y:107-102, width:41, height:45, src:"img/icon_age_lock.png"}));
                    } else {
                        _comp._focusDiv._rating.add(new W.Image({x:962-849, y:107-102, width:41, height:45, src:"img/icon_age_lock.png"}));
                    }
                    _comp._focusDiv.add(_comp._focusDiv._rating);
                }
            }

            if(type == Poster.TYPE.W140) {
                if(isWatched) {
                    _comp._focusDiv._watchedDiv = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_SHADOW_WIDTH)/2,y:POSTER_FOCUSED_HEIGHT+GAP_Y-POSTER_SHADOW_HEIGHT-4,
                        width:POSTER_FOCUSED_WIDTH, height:POSTER_SHADOW_HEIGHT});
                    _comp._focusDiv._watchedDiv.add(new W.Image({x:0, y:0, width:POSTER_SHADOW_WIDTH, height:POSTER_SHADOW_HEIGHT, src:"img/kids_poster_focus_sh.png"}));

                    if(watchedData){
                    	if(watchedData.asset && watchedData.asset.rentalPeriod) {
                    		_comp._focusDiv._watchedDiv._rentalPeriod = new W.Div({x:8, y:37, width:136, height:30, textAlign:"right"});
                            _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._rentalPeriod);
                    		
                            _comp._focusDiv._watchedDiv._rentalPeriod.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(255,255,255)", 
                            	"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["remain_period"], "padding-right":"5px"}));
                            if(watchedData.asset.rentalPeriod.unit == "D"){
                            	_comp._focusDiv._watchedDiv._rentalPeriod.add(new W.Span({position:"relative", y:0, height:"26px", textColor:"rgb(237,168,2)", 
                                	"font-size":"24px", className:"font_rixhead_bold", text:watchedData.asset.rentalPeriod.value, "padding-right":"5px"}));
                            	_comp._focusDiv._watchedDiv._rentalPeriod.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(255,255,255)", 
                                	"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["unit_date"]}));
                    		}
                        }
                    	
                    	if(watchedData.resume) {
                        	_comp._focusDiv._watchedDiv._progressBarBg = new W.Div({x:9, y:69, width:136, height:4});
                            _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._progressBarBg);
                            _comp._focusDiv._watchedDiv._progressBarBg.add(new W.Image({x:0, y:0, width:136, height:4, src:"img/kids_prog_bg.png"}));
                            
                            var duration = util.getRunningTime(watchedData.asset.runtime, false, watchedData.asset.runningTime);
                            _comp._focusDiv._watchedDiv._progressBarBg.add(new W.Image({x:0, y:0, width:3, height:4, src:"img/kids_prog_l.png"}));

                            if(watchedData.resume.offset > duration){
                            	watchedData.resume.offset = duration;
    	    				}
                            
                            var width = 136 * (watchedData.resume.offset/duration);
                            if(width > 6){
                            	_comp._focusDiv._watchedDiv._progressBarBg.add(new W.Div({x:3, y:0, width:width-6, height:4, color:"rgb(237,168,2)"}));
                            	_comp._focusDiv._watchedDiv._progressBarBg.add(new W.Image({x:width-3, y:0, width:3, height:4, src:"img/kids_prog_r.png"}));
                            }else{
                            	_comp._focusDiv._watchedDiv._progressBarBg.add(new W.Image({x:3, y:0, width:3, height:4, src:"img/kids_prog_r.png"}));
                            }
                        }
                    }
                    _comp._focusDiv.add(_comp._focusDiv._watchedDiv);
                }
                _comp._focusDiv.add(new W.Image({x:0, y:0, width:172, height:252, src:"img/kids_poster_focus.png"}));
            }

            var ratingImg = "info_all_3.png";
            if(data.rating == "0") ratingImg = "info_all_3.png";
            else if(data.rating == "7") ratingImg = "info_7_3.png";
            else if(data.rating == "12") ratingImg = "info_12_3.png";
            else if(data.rating == "15") ratingImg = "info_15_3.png";
            else if(data.rating == "19" || data.rating == "19+") ratingImg = "info_19_3.png";

            if(textAlign == "right") {
                _comp._focusDiv._title = new W.Div({x:-POSTER_FOCUSED_WIDTH*2+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)+12,
                    y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP-3 + (type == Poster.TYPE.W113 ? 3:0), height:17, float:"right"});
                _comp._focusDiv._title._span = new W.Div({width:POSTER_FOCUSED_WIDTH*3-24, height:24, textColor:"rgba(255,255,255,1)", text:data.title, className:"cut",
                    fontFamily:"RixHeadM", "font-size":"23px", textAlign:"right", "letter-spacing":"-1.05px", "white-space" : "nowrap", overflow:"hidden"});
                //_comp._focusDiv._title._span._inner = new W.Div({text:data.title, float:"right", position:"relative"});
                //_comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
                _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                _comp._focusDiv.add(_comp._focusDiv._title)

                _comp._focusDiv._info = new W.Div({x:-POSTER_FOCUSED_WIDTH*2+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)+12, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+23 + (type == Poster.TYPE.W113 ? 3:0),
                    width:POSTER_FOCUSED_WIDTH*3-24, height:17});
                if(!isRecommend) {
                    if(data.likes) {
                        _comp._focusDiv._info.add(new W.Div({position:"relative", float:"right", text:data.likes?data.likes:0, marginTop:"2px", className:"cut",
                            textColor:"rgba(164,255,254,1)", fontFamily:"RixHeadM", "font-size":"15px", textAlign:"left", "letter-spacing":"-0.75px"}));
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"5px", marginLeft:"6px",
                            marginRight:"6px", src:"img/info_heart.png"}));
                    }

                    if(data.isProductCaption) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_cap_3.png"}));
                    }
                    if(data.isProductDubbing) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_dub_3.png"}));
                    }

                    if(data.asset && data.asset.originProduct != "FOD")
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: -5, marginTop:"0px", marginLeft:"4px", marginRight:"-4px",
                            src:"img/info_pay_3.png"}));
                } else {
                    if(data.isProductCaption) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_cap_3.png"}));
                    }
                    if(data.isProductDubbing) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_dub_3.png"}));
                    }

                    if(data.originProduct != "FOD")
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: -5, marginTop:"0px", marginLeft:"4px", marginRight:"-4px",
                            src:"img/info_pay_3.png"}));
                }

                _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, src:"img/"+ratingImg}));
                _comp._focusDiv.add(_comp._focusDiv._info);

            } else {
                _comp._focusDiv._title = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2+4, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP-3 + (type == Poster.TYPE.W113 ? 3:0),
                    width:POSTER_FOCUSED_WIDTH-8, height:17});
                _comp._focusDiv._title._span = new W.Div({width:POSTER_FOCUSED_WIDTH*3-8, height:28, textColor:"rgba(255,255,255,1)", text:data.title, className:"cut",
                    fontFamily:"RixHeadM", "font-size":"23px", textAlign:"left", "letter-spacing":"-1.05px", "white-space" : "nowrap", overflow:"hidden"});
                //_comp._focusDiv._title._span._inner = new W.Div({text:data.title});
                //_comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
                _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                _comp._focusDiv.add(_comp._focusDiv._title);

                _comp._focusDiv._info = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2+4, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+23 + (type == Poster.TYPE.W113 ? 3:0),
                    width:POSTER_FOCUSED_WIDTH*3-24, height:17});
                _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, src:"img/"+ratingImg}));

                if(!isRecommend) {
                    if(data.asset && data.asset.originProduct != "FOD")
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: -5, marginTop:"0px", marginLeft:"4px", marginRight:"-4px",
                            src:"img/info_pay_3.png"}));

                    if(data.isProductDubbing) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_dub_3.png"}));
                    }
                    if(data.isProductCaption) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_cap_3.png"}));
                    }

                    if(data.likes) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"5px", marginLeft:"6px",
                            marginRight:"6px", src:"img/info_heart.png"}));
                        _comp._focusDiv._info.add(new W.Div({position:"relative", float:"left", text:data.likes?data.likes:0, marginTop:"2px", className:"cut",
                            textColor:"rgba(164,255,254,1)", fontFamily:"RixHeadM", "font-size":"15px", textAlign:"left", "letter-spacing":"-0.75px"}));
                    }
                } else {
                    if(data.originProduct != "FOD")
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: -5, marginTop:"0px", marginLeft:"4px", marginRight:"-4px",
                            src:"img/info_pay_3.png"}));
                    if(data.isProductDubbing) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_dub_3.png"}));
                    }
                    if(data.isProductCaption) {
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                            src:"img/info_cap_3.png"}));
                    }
                }
                _comp._focusDiv.add(_comp._focusDiv._info);
            }

            //_comp._focusDiv._info = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2+4, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+36, width:POSTER_FOCUSED_WIDTH-8, height:17});
            //_comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, src:"img/info_15_2.png"}));
            //_comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"-5px", marginLeft:"-2px", src:"img/info_pay_2.png"}));
            //_comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"5px", marginLeft:"6px", marginRight:"6px", src:"img/info_heart.png"}));
            //_comp._focusDiv._info.add(new W.Div({position:"relative", float:"left", text:"894", marginTop:"2px", className:"cut", textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));
            //_comp._focusDiv.add(_comp._focusDiv._info);

            if(type == Poster.TYPE.W140 && !isRecommend && !isPurchase) {
                _comp._focusDiv._icons = new W.Div({x:-15, y:15, width:60});
                _comp._focusDiv.add(_comp._focusDiv._icons);
            }

            if(type == Poster.TYPE.W140 && !isRecommend) {
                //1그룹 - NEW, TOP, Sale, HOT | 2개까지만 표시
                var iconCount = 0;
                if(iconCount < 2 && data.isNew) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_new.png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_new.png)", marginBottom:"-24px"}));
                    iconCount++;
                }
                if(iconCount < 2 && data.ranking && data.ranking.rank && data.ranking.rank < 11) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_top.png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_top.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                if(iconCount < 2 && data.isSale) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_sale.png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_sale.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                if(iconCount < 2 && data.isHot) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_hot.png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_hot.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //2그룹 - UHD, Time세일
                if(iconCount < 4 && data.isTimeSale) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_timesale.png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_timesale.png)", marginBottom:"-24px"}));
                    iconCount++;

                    var timesaleEnd = util.getDateFormat("~ MM.dd HH:mm", util.newDate(data.timeSaleEnd));

                    _comp._normalDiv._timeEnd = new W.Div({y:151, width:129, height:40, fontFamily:"RixHeadB",
                        textAlign:"right", color:"rgba(0,0,0,0.8)", paddingRight:"7px", paddingTop:"3px"});
                    _comp._normalDiv._timeEnd.add(new W.Div({position:"relative", height:17, lineHeight:"17px",
                        text:"TIME SALE", className:"cut", textColor:"rgba(237,168,2,1)", "font-size":"13px",
                        textAlign:"right", "letter-spacing":"-0.65px"}));
                    _comp._normalDiv._timeEnd.add(new W.Div({position:"relative", height:23, lineHeight:"23px",
                        text:timesaleEnd, className:"cut", textColor:"rgba(255,255,255,1)", "font-size":"16px",
                        textAlign:"right", "letter-spacing":"-0.75px"}));
                    _comp._normalDiv.add(_comp._normalDiv._timeEnd);
                    _comp._focusDiv._timeEnd = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP+181,
                        width:149, height:40, fontFamily:"RixHeadB", textAlign:"right", color:"rgba(0,0,0,0.8)", paddingRight:"7px", paddingTop:"3px"});
                    _comp._focusDiv._timeEnd.add(new W.Div({position:"relative", height:17, lineHeight:"17px",
                        text:"TIME SALE", className:"cut", textColor:"rgba(237,168,2,1)", "font-size":"13px",
                        textAlign:"right", "letter-spacing":"-0.65px"}));
                    _comp._focusDiv._timeEnd.add(new W.Div({position:"relative", height:23, lineHeight:"23px",
                        text:timesaleEnd, className:"cut", textColor:"rgba(255,255,255,1)", "font-size":"16px",
                        textAlign:"right", "letter-spacing":"-0.75px"}));
                    _comp._focusDiv.add(_comp._focusDiv._timeEnd);
                    iconCount++;
                }
                if(iconCount < 4 && data.isUHD) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_uhd.png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_uhd.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //3그룹 - 할인율
                if(iconCount < 4 && !data.isTimeSale && data.saleCode) {
                    var saleString = "";
                    if(data.saleCode == "할인") saleString = "dc";
                    else if(data.saleCode == "100%") saleString = "free";
                    else saleString = data.saleCode.replace('%','dc');
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_"+saleString+".png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_"+saleString+".png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //4그룹 - 이벤트, 쿠폰, 경품
                if(iconCount < 4 && !data.isTimeSale && data.eventCode && data.eventCode != "") {
                    var iconString = "event";
                    //if(data.eventCode == "쿠폰") iconString = "coupon";
                    //else if(data.eventCode == "경품") iconString = "gift";
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_"+iconString+".png)", marginBottom:"-24px"}));
                    _comp._focusDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_"+iconString+".png)", marginBottom:"-24px"}));
                    iconCount++;
                }
            }

            _comp.add(_comp._focusDiv);

        };

        var setFocus = function() {
            isFocused = true;
            if(_comp._focusDiv) {
                _comp._focusDiv.setDisplay("block");
                //util.setMarquee(_comp._focusDiv._title._span._inner, 500);
            }
            if(_comp._normalDiv) _comp._normalDiv.setDisplay("none");
        };

        var unFocus = function() {
            isFocused = false;
            if(_comp._focusDiv){
                if(_comp._focusDiv) _comp._focusDiv.setDisplay("none");
                //util.stopMarquee(_comp._focusDiv._title._span._inner, 500);
            }
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

        this.releaseRestrict = function() {
            isClearPin = true;
            if(_comp._focusDiv._rating) _comp._focusDiv._rating.setStyle({display:"none"});
            if(_comp._normalDiv._rating) _comp._normalDiv._rating.setStyle({display:"none"});
            if(_comp._normalDiv._title) _comp._normalDiv._title._span.setText(data.title);
            if(_comp._focusDiv._title) _comp._focusDiv._title._span.setText(data.title);
            if(isFocused) setFocus();
        }
    }

    Poster.TYPE = Object.freeze({W140:0, W113:1});

    return Poster;
});