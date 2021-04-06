/**
 * comp/list/Poster
 *
 * Flipbook ver1.4(201805)
 *
 * Author : yj.yoon@alticast.com
 */
W.defineModule("comp/list/Poster", [ "mod/Util"], function(util) {
    'use strict';

    function Poster(_param) {
        var _this;

        var _comp;

        var isFocused;

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
            if(_param.data.asset) {
                data = _param.data.asset;
                purchaseData = _param.data;
            } else {
                _param.isPackage = true;
                data = _param.data.product;
                purchaseData = _param.data;
            }
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
        var isLiveTriggerDown = _param.isLiveTriggerDown;
        var isSearchProduct = _param.isSearchProduct;

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y, FOCUS_GAP, ICON_GAP,
            POSTER_WIDTH, POSTER_HEIGHT, POSTER_FOCUSED_WIDTH, POSTER_FOCUSED_HEIGHT, DEFAULT_POSTER, DEFAULT_FOCUSED_POSTER,
            POSTER_SHADOW_WIDTH, POSTER_SHADOW_HEIGHT,
            DEFAULT_ADULT_POSTER, DEFAULT_FOCUSED_ADULT_POSTER;

        if(type == Poster.TYPE.W136) {
            NORMAL_DIV_WIDTH = 136, NORMAL_DIV_HEIGHT = 240, FOCUSED_DIV_WIDTH = 215, FOCUSED_DIV_HEIGHT = 323,
            POSTER_WIDTH = 136, POSTER_HEIGHT = 194, POSTER_FOCUSED_WIDTH = 156, POSTER_FOCUSED_HEIGHT = 224;
            POSTER_SHADOW_WIDTH = 215, POSTER_SHADOW_HEIGHT = 283;
            GAP_X = 39, GAP_Y = 38, FOCUS_GAP = 29, ICON_GAP = 43;
            DEFAULT_ADULT_POSTER = "img/poster_default_adult_w136.png", DEFAULT_FOCUSED_ADULT_POSTER = "img/poster_default_adult_w136.png";
            DEFAULT_POSTER = "img/poster_default_w136.png", DEFAULT_FOCUSED_POSTER = "img/poster_default_w156.png";
        } else if(type == Poster.TYPE.W113) {
            NORMAL_DIV_WIDTH = 113, NORMAL_DIV_HEIGHT = 199, FOCUSED_DIV_WIDTH = 219, FOCUSED_DIV_HEIGHT = 255,
            POSTER_WIDTH = 113, POSTER_HEIGHT = 162, POSTER_FOCUSED_WIDTH = 127, POSTER_FOCUSED_HEIGHT = 183;
            POSTER_SHADOW_WIDTH = 43, POSTER_SHADOW_HEIGHT = 162;
            GAP_X = 53, GAP_Y = 9, FOCUS_GAP = 5, ICON_GAP = 10;
            DEFAULT_ADULT_POSTER = "img/poster_default_adult_w113.png", DEFAULT_FOCUSED_ADULT_POSTER = "img/poster_default_adult_w127.png";
            DEFAULT_POSTER = "img/poster_default_w113.png", DEFAULT_FOCUSED_POSTER = "img/poster_default_w127.png";
        }

        var create = function(){
            var _title = data.title ? data.title : "";

            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _title = "";
                    if(data.title) {
                        for(var i = 0; i < data.title.length; i++) {
                            if(i==0) _title = data.title.substr(0,1);
                            else _title += "*";
                        }
                    }
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {

                }
            }

            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            _comp._normalDiv._defaultPoster = new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:DEFAULT_POSTER});
            _comp._normalDiv.add(_comp._normalDiv._defaultPoster);
            /*if(data.contentCategory == 5) {  //성인
                _comp._normalDiv._poster = new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:DEFAULT_ADULT_POSTER});
                _comp._normalDiv.add(_comp._normalDiv._poster);
            } else */

            var posterUrl;
            if(data.events && data.events[0] && data.events[0].posterUrl){
                posterUrl = W.Config.IMAGE_URL + data.events[0].posterUrl;
            } else if(!(data.events && data.events[0] && data.events[0].posterUrl) && (data.coupons && data.coupons[0] && data.coupons[0].posterUrl)) {
                posterUrl = W.Config.IMAGE_URL + data.coupons[0].posterUrl;
            } else if(data.posterBaseUrl) posterUrl = util.getPosterFilePath(data.posterBaseUrl, POSTER_FOCUSED_WIDTH);
            else if(data.image) posterUrl = data.image;
            //else if(data.posterUrl) posterUrl = W.Config.IMAGE_URL + data.posterUrl;
            else if(isPackage || isSearchProduct) {
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

            _comp._normalDiv._title = new W.Div({x:4, y:POSTER_HEIGHT+7, width:POSTER_WIDTH-8, height:19});
            _comp._normalDiv._title._span = new W.Div({position:"relative", float:"left", maxWidth:POSTER_WIDTH-8+"px", height:19, text:_title,
                className:"cut", textColor:"rgba(196,196,196,0.9)", fontFamily:Poster.TYPE.W113 ? "RixHeadM":"RixHeadL",
                "font-size":"19px", textAlign:"left", "letter-spacing":"-0.85px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv.add(_comp._normalDiv._title);
            //if(data.isPinned) {
            //    _comp._normalDiv._title._span.setStyle({maxWidth:POSTER_WIDTH-23+"px"})
            //    _comp._normalDiv._title.add(new W.Image({position:"relative", x:2, y:-4, src:"img/info_heart.png"}));
            //}

            if(type == Poster.TYPE.W136 && !isRecommend && !isPurchase) {
                _comp._normalDiv._icons = new W.Div({x:-12, y:3, width:60});
                //1그룹 - NEW, TOP, Sale, HOT | 2개까지만 표시
                /*var iconCount = 0;
                if(iconCount < 2 && data.isNew) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_new.png)", marginBottom:"-24px"}));
                    iconCount++;
                }
                if(iconCount < 2 && data.ranking && data.ranking.rank && data.ranking.rank < 11) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_top.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //세일 정보 확인 필요

                if(iconCount < 2 && data.isHot) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_hot.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //2그룹 - UHD, Time세일
                if(iconCount < 4 && data.isTimeSale) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_timesale.png)", marginBottom:"-24px"}));
                    iconCount++;
                }
                if(iconCount < 4 && data.isUHD) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_uhd.png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //3그룹 - 할인율
                if(iconCount < 4 && !data.isTimeSale && data.saleCode) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_"+data.saleCode.replace('%','dc')+".png)", marginBottom:"-24px"}));
                    iconCount++;
                }

                //4그룹 - 이벤트, 쿠폰, 경품
                if(iconCount < 4 && !data.isTimeSale && data.eventCode) {
                    var iconString = "event";
                    if(data.eventCode == "쿠폰") iconString = "coupon";
                    else if(data.eventCode == "경품") iconString = "gift";
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_"+iconString+".png)", marginBottom:"-24px"}));
                    iconCount++;
                }*/

                _comp._normalDiv.add(_comp._normalDiv._icons);
            }

            if(isPurchase) {
                if(purchaseData && purchaseData.deviceType && purchaseData.deviceType == "cpa") {
                    _comp._normalDiv._icons = new W.Div({x:-12, y:3, width:60});
                    //1그룹 - NEW, TOP, Sale, HOT | 2개까지만 표시
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53,
                        backgroundImage:"url(img/icon_mobile_purchased.png)", marginBottom:"-24px"}));
                }

                //var unit = W.Texts["unit_date"];
                //if(data.rentalPeriod.unit == "H") unit = W.Texts["unit_hour"];
                //else if(data.rentalPeriod.unit == "M") unit = W.Texts["unit_month"];
                //else if(data.rentalPeriod.unit == "Y") unit = W.Texts["unit_year"];
                
                _comp._normalDiv._timeRemainDiv = new W.Div({x:0,y:POSTER_HEIGHT-26, width:POSTER_WIDTH, height:26, color:"rgba(0,0,0,0.8)"});

                var expireDate = util.newDate(purchaseData.expiresAt);
                var today = util.newDate();

                if(expireDate < today) {
                    _comp._normalDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:W.Texts["expired_period"], lineHeight:"26px",
                        float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                    _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._text);
                } else if(purchaseData.expiresAt == "9999-12-31T23:59:59") {
                    _comp._normalDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:W.Texts["popup_zzim_option_lifetime"], lineHeight:"26px",
                        float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                    _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._text);
                } else {
                    if(expireDate - today < 24*60*60*1000) {
                        if(expireDate - today < 60*60*1000) {
                            _comp._normalDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                                text:W.Texts["unit_hour"] + " " + W.Texts["unit_below"] + " " + W.Texts["remain"], lineHeight:"26px",
                                float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                            _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._text);
                            _comp._normalDiv._timeRemainDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                                text:1, lineHeight:"26px",
                                float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                            _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._day);
                        } else {
                            _comp._normalDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                                text:W.Texts["unit_hour"] + " " + W.Texts["remain"], lineHeight:"26px",
                                float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                            _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._text);
                            _comp._normalDiv._timeRemainDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                                text:parseInt(util.newDate(expireDate-today).getTime()/(60*60*1000)), lineHeight:"26px",
                                float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                            _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._day);
                        }
                    } else {
                        today.setHours(0,0,0,0);
                        expireDate.setHours(0,0,0,0);
                        _comp._normalDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                            text:W.Texts["unit_date"] + " " + W.Texts["remain"], lineHeight:"26px",
                            float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                        _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._text);
                        _comp._normalDiv._timeRemainDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                            text:parseInt(util.newDate(expireDate-today).getTime()/(60*60*24*1000)), lineHeight:"26px",
                            float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                        _comp._normalDiv._timeRemainDiv.add(_comp._normalDiv._timeRemainDiv._day);
                    }
                }
                _comp._normalDiv.add(_comp._normalDiv._timeRemainDiv);
            }

            if(isWatched) {
                _comp._normalDiv._watchedDiv = new W.Div({x:0,y:POSTER_HEIGHT-26, width:POSTER_WIDTH, height:26, color:"rgba(0,0,0,0.8)"});
                if(watchedData && watchedData.asset && watchedData.asset.watchable) {
                    if(watchedData && watchedData.viewedAt) {
                        _comp._normalDiv._watchedDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                            text:W.Texts["watching"], lineHeight:"26px",
                            float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                        _comp._normalDiv._watchedDiv.add(_comp._normalDiv._watchedDiv._text);

                        var watchedDate = util.newDate(watchedData.viewedAt);
                        watchedDate.setHours(0,0,0,0);

                        if(watchedDate.getTime() == util.newDate().setHours(0,0,0,0)) {
                            _comp._normalDiv._watchedDiv._text.setText(W.Texts["today"] + W.Texts["watching"]);
                        } else if(watchedDate.getTime() == util.newDate(util.newDate().getTime()-(24*60*60*1000)).setHours(0,0,0,0)) {
                            _comp._normalDiv._watchedDiv._text.setText(W.Texts["yesterday"] + W.Texts["watching"]);
                        } else {
                            _comp._normalDiv._watchedDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                                text:util.changeDigit(watchedDate.getMonth() + 1,2)+"."+util.changeDigit(watchedDate.getDate(),2), lineHeight:"26px",
                                float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                            _comp._normalDiv._watchedDiv.add(_comp._normalDiv._watchedDiv._day);
                        }
                    }
                } else {
                    _comp._normalDiv._watchedDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:W.Texts["expired_period"], lineHeight:"26px",
                        float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                    _comp._normalDiv._watchedDiv.add(_comp._normalDiv._watchedDiv._text);
                }
                _comp._normalDiv.add(_comp._normalDiv._watchedDiv);
            }

            if(isRank && data.ranking) {
                _comp._normalDiv._rankDiv = new W.Div({x:0,y:POSTER_HEIGHT-26, width:POSTER_WIDTH, height:26, color:"rgba(0,0,0,0.8)"});
                _comp._normalDiv._rankDiv._rank = new W.Div({position:"relative", x:8,y:0, "margin-right":"3px",
                    text:data.ranking.rank, lineHeight:"26px",
                    float:"left", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._rank);
                _comp._normalDiv._rankDiv._rankUnit = new W.Div({position:"relative", x:8,y:0, "margin-right":"8px",
                    text:W.Texts["unit_rank"], lineHeight:"26px",
                    float:"left",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._rankUnit);


                if(data.ranking.change == 0) {
                    _comp._normalDiv._rankDiv._change = new W.Div({position:"relative", x:0,y:12, width:11, height:2, color:"rgba(255,255,255,0.7)",
                        float:"right", "margin-right":"8px"});
                    _comp._normalDiv._rankDiv.add(_comp._normalDiv._rankDiv._change);
                } else {
                    _comp._normalDiv._rankDiv._change = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:Math.abs(data.ranking.change), lineHeight:"26px",
                        float:"right",  textColor:"rgb(255,255,255)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.7px"});
                    _comp._normalDiv._rankDiv._changeIcon = new W.Div({position:"relative", x:0,y:9, width:11, height:9, "margin-right":"5px", float:"right"});

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
            }

            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});
            if(type == Poster.TYPE.W136) {
                _comp._focusDiv.add(new W.Image({x:0.5, y:0, width:POSTER_SHADOW_WIDTH, height:POSTER_SHADOW_HEIGHT, src:"img/poster_shadow.png"}));
            } else if(type == Poster.TYPE.W113) {
                _comp._focusDiv.add(new W.Image({x:0, y:GAP_Y, width:POSTER_SHADOW_WIDTH, height:POSTER_SHADOW_HEIGHT, src:"img/poster_shadow_l.png"}));
                _comp._focusDiv.add(new W.Image({right:0, y:GAP_Y, width:POSTER_SHADOW_WIDTH, height:POSTER_SHADOW_HEIGHT, src:"img/poster_shadow_r.png"}));
            }

            _comp._focusDiv._defaultPoster = new W.Image({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP, width:POSTER_FOCUSED_WIDTH,
                height:POSTER_FOCUSED_HEIGHT, src:DEFAULT_FOCUSED_POSTER});
            _comp._focusDiv.add(_comp._focusDiv._defaultPoster);
            /*if(data.contentCategory == 5) {  //성인
                _comp._focusDiv._poster = new W.Image({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP, width:POSTER_FOCUSED_WIDTH,
                    height:POSTER_FOCUSED_HEIGHT, src:DEFAULT_FOCUSED_ADULT_POSTER});
                _comp._focusDiv.add(_comp._focusDiv._poster);
            } else */
            /*var posterUrl;
            if(isProduct){
            	if(data.images){
    				for(var i=0; i < data.images.length; i++){
    					if(data.images[i].type == "02"){
    						posterUrl = W.Config.IMAGE_URL + data.images[i].path;
    						break;
    					}
    				}
    			}
            }else{
                if(data.posterBaseUrl) posterUrl = util.getPosterFilePath(data.posterBaseUrl, POSTER_FOCUSED_WIDTH);
                else if(data.image) posterUrl = data.image;
                else if(data.posterUrl) posterUrl = W.Config.IMAGE_URL + data.posterUrl;
            }*/

            if(posterUrl) {
                _comp._focusDiv._poster = new W.Image({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP, width:POSTER_FOCUSED_WIDTH,
                    height:POSTER_FOCUSED_HEIGHT, src:posterUrl, visibility:"hidden"});
                _comp._focusDiv.add(_comp._focusDiv._poster);

                _comp._focusDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._focusDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            }

            if(!isClearPin && W.StbConfig.adultMenuUse) {
                if(data.isAdult) {
                    _comp._focusDiv._rating = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP,
                        width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT});
                    _comp._focusDiv._rating.add(new W.Image({x:0, y:0, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, src:DEFAULT_FOCUSED_ADULT_POSTER}));
                    _comp._focusDiv.add(_comp._focusDiv._rating);
                } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {
                    _comp._focusDiv._rating = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP,
                        width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, color:"rgba(0,0,0,0.7)"});

                    if(type == Poster.TYPE.W113) {
                        _comp._focusDiv._rating.add(new W.Image({x:932-849, y:107-102, width:41, height:45, src:"img/icon_age_lock.png"}));
                    } else {
                        _comp._focusDiv._rating.add(new W.Image({x:962-849, y:107-102, width:41, height:45, src:"img/icon_age_lock.png"}));
                    }
                    _comp._focusDiv.add(_comp._focusDiv._rating);
                }
            }

            if(!isPackage){

                var ratingImg = "info_all_2.png";
                if(data.rating == "00") ratingImg = "info_all_2.png";
                else if(data.rating == "07") ratingImg = "info_7_2.png";
                else if(data.rating == "12") ratingImg = "info_12_2.png";
                else if(data.rating == "15") ratingImg = "info_15_2.png";
                else if(data.rating == "19" || data.rating == "19+") ratingImg = "info_19_2.png";

                if(textAlign == "right") {
                    if(type == Poster.TYPE.W113) {
                        _comp._focusDiv._title = new W.Div({x:-POSTER_FOCUSED_WIDTH*2+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)-26, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+11,
                            height:17, float:"right"});
                    } else {
                        _comp._focusDiv._title = new W.Div({x:-POSTER_FOCUSED_WIDTH*2+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)-8, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+11,
                            height:17, float:"right"});
                    }
                    _comp._focusDiv._title._span = new W.Div({width:POSTER_FOCUSED_WIDTH*3-24, height:24, textColor:"rgba(255,255,255,1)", text:_title, className:"cut",
                        fontFamily:"RixHeadM", "font-size":"22px", textAlign:"right", "letter-spacing":"-1.0px", "white-space" : "nowrap", overflow:"hidden"});
                    //_comp._focusDiv._title._span._inner = new W.Div({text:_title, float:"right", position:"relative"});
                    //_comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
                    _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                    _comp._focusDiv.add(_comp._focusDiv._title);
                    _comp._focusDiv._info = new W.Div({x:-POSTER_FOCUSED_WIDTH*2+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)-8, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+36,
                        width:POSTER_FOCUSED_WIDTH*3-24, height:17});
                    if(!isRecommend) {
                        if(data.likes) {
                            _comp._focusDiv._info.add(new W.Div({position:"relative", float:"right", text:data.likes?data.likes:0, marginTop:"2px", className:"cut",
                                textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"5px", marginLeft:"6px",
                                marginRight:"6px", src:"img/info_heart.png"}));
                        }

                        if(data.isProductCaption) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_sub.png"}));
                        }
                        if(data.isProductDubbing) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_dub.png"}));
                        }

                        if(data.asset && data.asset.originProduct != "FOD")
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_pay_2.png"}));
                    } else {
                        if(data.isProductCaption) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_sub.png"}));
                        }
                        if(data.isProductDubbing) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_dub.png"}));
                        }

                        if(data.originProduct != "FOD")
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_pay_2.png"}));
                    }

                    if(!isLiveTriggerDown && !isSearchProduct){
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"right", x:0, y: 0, src:"img/"+ratingImg}));
                    }
                    _comp._focusDiv.add(_comp._focusDiv._info);
                } else {
                    _comp._focusDiv._title = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2+4, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+11,
                        width:POSTER_FOCUSED_WIDTH-8, height:17});
                    _comp._focusDiv._title._span = new W.Div({width:POSTER_FOCUSED_WIDTH*3-24, height:24, textColor:"rgba(255,255,255,1)", text:_title, className:"cut",
                        fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left", "letter-spacing":"-1.0px", "white-space" : "nowrap", overflow:"hidden"});
                    //_comp._focusDiv._title._span._inner = new W.Div({text:_title});
                    //_comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
                    _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                    _comp._focusDiv.add(_comp._focusDiv._title);
                    _comp._focusDiv._info = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2+4, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+36,
                        width:POSTER_FOCUSED_WIDTH*3-24, height:17});
                    if(!isLiveTriggerDown && !isSearchProduct){
                        _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, src:"img/"+ratingImg}));
                    }

                    if(!isRecommend) {
                        if(data.asset && data.asset.originProduct != "FOD")
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_pay_2.png"}));

                        if(data.isProductDubbing) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_dub.png"}));
                        }
                        if(data.isProductCaption) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_sub.png"}));
                        }

                        if(data.likes) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"5px", marginLeft:"6px",
                                marginRight:"6px", src:"img/info_heart.png"}));
                            _comp._focusDiv._info.add(new W.Div({position:"relative", float:"left", text:data.likes?data.likes:0, marginTop:"2px", className:"cut",
                                textColor:"rgba(255,255,255,0.9)", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));
                        }
                    } else {
                        if(data.originProduct != "FOD")
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_pay_2.png"}));
                        if(data.isProductDubbing) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_dub.png"}));
                        }
                        if(data.isProductCaption) {
                            _comp._focusDiv._info.add(new W.Image({position:"relative", float:"left", x:0, y: 0, marginTop:"0px", marginLeft:"4px",
                                src:"img/info_sub.png"}));
                        }
                    }
                    _comp._focusDiv.add(_comp._focusDiv._info);
                }

            } else if(isPurchase) {
                if(textAlign == "right") {
                    if(type == Poster.TYPE.W113) {
                        _comp._focusDiv._title = new W.Div({x:-POSTER_FOCUSED_WIDTH+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)-26, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+11,
                            height:17, float:"right"});
                    } else {
                        _comp._focusDiv._title = new W.Div({x:-POSTER_FOCUSED_WIDTH+(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)-8, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+11,
                            height:17, float:"right"});
                    }
                    _comp._focusDiv._title._span = new W.Div({width:POSTER_FOCUSED_WIDTH*3-24, height:24, textColor:"rgba(255,255,255,1)", text:_title, className:"cut",
                        fontFamily:"RixHeadM", "font-size":"22px", textAlign:"right", "letter-spacing":"-1.0px", "white-space" : "nowrap", overflow:"hidden"});
                    //_comp._focusDiv._title._span._inner = new W.Div({text:_title, float:"right", position:"relative"});
                    //_comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
                    _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                    _comp._focusDiv.add(_comp._focusDiv._title);
                } else {
                    _comp._focusDiv._title = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2+4, y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP+11,
                        width:POSTER_FOCUSED_WIDTH-8, height:17});
                    _comp._focusDiv._title._span = new W.Div({width:POSTER_FOCUSED_WIDTH*3-24, height:24, textColor:"rgba(255,255,255,1)", text:_title, className:"cut",
                        fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left", "letter-spacing":"-1.0px", "white-space" : "nowrap", overflow:"hidden"});
                    //_comp._focusDiv._title._span._inner = new W.Div({text:_title});
                    //_comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
                    _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                    _comp._focusDiv.add(_comp._focusDiv._title);
                }
            }

            if(type == Poster.TYPE.W136 && !isRecommend && !isPurchase) {
                _comp._focusDiv._icons = new W.Div({x:15, y:ICON_GAP, width:60});
                _comp._focusDiv.add(_comp._focusDiv._icons);
            }

            _comp._focusDiv._focusBarU = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP-5,
                width:POSTER_FOCUSED_WIDTH, height:4, color:"#E53000"});
            _comp._focusDiv.add(_comp._focusDiv._focusBarU);
            _comp._focusDiv._focusBarD = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP+1+POSTER_FOCUSED_HEIGHT,
                width:POSTER_FOCUSED_WIDTH, height:4, color:"#E53000"});
            _comp._focusDiv.add(_comp._focusDiv._focusBarD);

            if(isPurchase) {
                _comp._focusDiv._timeRemainDiv = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2,y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP-26,
                    width:POSTER_FOCUSED_WIDTH, height:26, color:"rgba(0,0,0,0.8)"});

                var expireDate = util.newDate(purchaseData.expiresAt);
                var today = util.newDate();

                if(expireDate < today) {
                    _comp._focusDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:W.Texts["expired_period"], lineHeight:"26px",
                        float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                    _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._text);
                } else if(purchaseData.expiresAt == "9999-12-31T23:59:59") {
                    _comp._focusDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:W.Texts["popup_zzim_option_lifetime"], lineHeight:"26px",
                        float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                    _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._text);
                } else {
                    if(expireDate - today < 24*60*60*1000) {
                        if(expireDate - today < 60*60*1000) {
                            _comp._focusDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                                text:W.Texts["unit_hour"] + " " + W.Texts["unit_below"] + " " + W.Texts["remain"], lineHeight:"26px",
                                float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                            _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._text);
                            _comp._focusDiv._timeRemainDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                                text:1, lineHeight:"26px",
                                float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                            _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._day);
                        } else {
                            _comp._focusDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                                text:W.Texts["unit_hour"] + " " + W.Texts["remain"], lineHeight:"26px",
                                float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                            _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._text);
                            _comp._focusDiv._timeRemainDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                                text:parseInt(util.newDate(expireDate-today).getTime()/(60*60*1000)), lineHeight:"26px",
                                float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                            _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._day);
                        }
                    } else {
                        today.setHours(0,0,0,0);
                        expireDate.setHours(0,0,0,0);
                        _comp._focusDiv._timeRemainDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                            text:W.Texts["unit_date"] + " " + W.Texts["remain"], lineHeight:"26px",
                            float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                        _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._text);
                        _comp._focusDiv._timeRemainDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                            text:parseInt(util.newDate(expireDate-today).getTime()/(60*60*24*1000)), lineHeight:"26px",
                            float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                        _comp._focusDiv._timeRemainDiv.add(_comp._focusDiv._timeRemainDiv._day);
                    }
                }
                _comp._focusDiv.add(_comp._focusDiv._timeRemainDiv);
            }

            if(isWatched) {
                _comp._focusDiv._watchedDiv = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2,y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP-38,
                    width:POSTER_FOCUSED_WIDTH, height:38, color:"rgba(0,0,0,0.8)"});

                if(watchedData && watchedData.asset && watchedData.asset.watchable) {
                    if(watchedData && watchedData.viewedAt) {
                        _comp._focusDiv._watchedDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                            text:W.Texts["watching"], lineHeight:"26px",
                            float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                        _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._text);

                        var watchedDate = util.newDate(watchedData.viewedAt);
                        watchedDate.setHours(0,0,0,0);
                        if(watchedDate.getTime() == util.newDate().setHours(0,0,0,0)) {
                            _comp._focusDiv._watchedDiv._text.setText(W.Texts["today"] + W.Texts["watching"]);
                        } else if(watchedDate.getTime() == util.newDate(util.newDate().getTime()-(24*60*60*1000)).setHours(0,0,0,0)) {
                            _comp._focusDiv._watchedDiv._text.setText(W.Texts["yesterday"] + W.Texts["watching"]);
                        } else {
                            _comp._focusDiv._watchedDiv._day = new W.Div({position:"relative", x:0,y:0, "margin-right":"3px",
                                text:util.changeDigit(watchedDate.getMonth() + 1,2)+"."+util.changeDigit(watchedDate.getDate(),2), lineHeight:"26px",
                                float:"right", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                            _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._day);
                        }
                    }
                } else {
                    _comp._focusDiv._watchedDiv._text = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:W.Texts["expired_period"], lineHeight:"26px",
                        float:"right",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                    _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._text);
                }

                _comp._focusDiv._watchedDiv._progressBarBg = new W.Div({x:7, y:26, width:142, height:3, color:"rgba(181,181,181,0.25)"});
                _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._progressBarBg);
                if(watchedData && watchedData.resume) {
                    var duration = util.getRunningTime(watchedData.asset.runtime, false, watchedData.asset.runningTime);

                    if(watchedData.resume.offset > duration) watchedData.resume.offset = duration;
                    _comp._focusDiv._watchedDiv._progressBar = new W.Div({x:7, y:26, width:142 * (watchedData.resume.offset/duration), height:3, color:"rgba(237,168,2,1)"});
                    _comp._focusDiv._watchedDiv.add(_comp._focusDiv._watchedDiv._progressBar);
                }
                _comp._focusDiv.add(_comp._focusDiv._watchedDiv);
            }

            if(isRank && data.ranking) {
                _comp._focusDiv._rankDiv = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2,y:POSTER_FOCUSED_HEIGHT+FOCUS_GAP-26,
                    width:POSTER_FOCUSED_WIDTH, height:26, color:"rgba(0,0,0,0.8)"});
                _comp._focusDiv._rankDiv._day = new W.Div({position:"relative", x:8,y:0, "margin-right":"3px",
                    text:data.ranking.rank, lineHeight:"26px",
                    float:"left", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.8px"});
                _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._day);
                _comp._focusDiv._rankDiv._text = new W.Div({position:"relative", x:8,y:0, "margin-right":"8px",
                    text:W.Texts["unit_rank"], lineHeight:"26px",
                    float:"left",  textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"13px", "letter-spacing":"-0.65px"});
                _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._text);

                if(data.ranking.change == 0) {
                    _comp._focusDiv._rankDiv._change = new W.Div({position:"relative", x:0,y:12, width:11, height:2, color:"rgba(255,255,255,0.7)",
                        float:"right", "margin-right":"8px"});
                    _comp._focusDiv._rankDiv.add(_comp._focusDiv._rankDiv._change);
                } else {
                    _comp._focusDiv._rankDiv._change = new W.Div({position:"relative", x:0,y:0, "margin-right":"8px",
                        text:Math.abs(data.ranking.change), lineHeight:"26px",
                        float:"right",  textColor:"rgb(255,255,255)", fontFamily:"RixHeadB", "font-size":"16px", "letter-spacing":"-0.7px"});
                    _comp._focusDiv._rankDiv._changeIcon = new W.Div({position:"relative", x:0,y:9, width:11, height:9, "margin-right":"6px", float:"right"});

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
            }

            /*data.isNew = true;
            data.isHot = true;
            data.isUHD = true;
            data.isTimeSale = "30%"*/

            if(type == Poster.TYPE.W136 && !isRecommend) {
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


            if(_param.isSelectable) {
                _comp._check_bg = new W.Div({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, color:"rgba(0,0,0,0.7)", display:"none", zIndex:2});
                _comp._normalDiv.add(_comp._check_bg);
                _comp._check_bg_f = new W.Div({x:(FOCUSED_DIV_WIDTH-POSTER_FOCUSED_WIDTH)/2, y:FOCUS_GAP, width:POSTER_FOCUSED_WIDTH,
                    height:POSTER_FOCUSED_HEIGHT, color:"rgba(0,0,0,0.7)", display:"none", zIndex:2});
                _comp._focusDiv.add(_comp._check_bg_f);
                if(!isClearPin && W.StbConfig.adultMenuUse) {
                    if (data.isAdult) {
                        _comp._check_bg.setStyle({color:"rgba(0,0,0,0)"});
                        _comp._check_bg_f.setStyle({color:"rgba(0,0,0,0)"});
                    } else if(data.rating && util.getRating() && data.rating >= util.getRating()) {

                    }
                }
                _comp._check = new W.Image({x:8, y:13, src:"img/check_n.png", zIndex:2, display:"none"});
                _comp.add(_comp._check);
                _comp._checkF = new W.Image({x:8, y:13, src:"img/check__f.png", zIndex:2, display:"none"});
                _comp.add(_comp._checkF);
            }

            _comp.add(_comp._normalDiv);
            _comp.add(_comp._focusDiv);

        };

        var setFocus = function() {
            isFocused = true;
            if(_comp._focusDiv) {
                _comp._focusDiv.setDisplay("block");
                //if(!isPackage){
                //	util.setMarquee(_comp._focusDiv._title._span._inner, 500);
                //}
            }
            if(_comp._normalDiv) _comp._normalDiv.setDisplay("none");
        };

        var unFocus = function() {
            isFocused = false;
            if(_comp._focusDiv){
                if(_comp._focusDiv) _comp._focusDiv.setDisplay("none");
                //if(!isPackage){
                //	util.stopMarquee(_comp._focusDiv._title._span._inner, 500);
                //}
            }
            if(_comp._normalDiv) _comp._normalDiv.setDisplay("block");
        };

        var unSelected = function() {
            if(_comp._focusDiv){
                _comp._focusDiv._focusBarU.setDisplay("none");
        		_comp._focusDiv._focusBarD.setDisplay("none");
            }
        };

        var setSelected = function() {
            if(_comp._focusDiv){
            	_comp._focusDiv._focusBarU.setDisplay("block");
        		_comp._focusDiv._focusBarD.setDisplay("block");
            }
        };

        var unChecked = function(isHide) {
            if(_comp._check){
                if(isHide) {
                    _comp._check.setDisplay("none");
                    _comp._checkF.setDisplay("none");

                    _comp._check_bg.setDisplay("none");
                    _comp._check_bg_f.setDisplay("none");

                    _comp._normalDiv._title.setStyle({opacity:1});
                    _comp._focusDiv._title.setStyle({opacity:1});
                    _comp._focusDiv._info.setStyle({opacity:1});
                } else {
                    _comp._check.setDisplay("block");
                    _comp._checkF.setDisplay("none");

                    _comp._check_bg.setDisplay("block");
                    _comp._check_bg_f.setDisplay("block");

                    _comp._normalDiv._title.setStyle({opacity:0.5});
                    _comp._focusDiv._title.setStyle({opacity:0.5});
                    _comp._focusDiv._info.setStyle({opacity:0.5});
                }
            }
        };

        var setChecked = function() {
            if(_comp._check){
                //_comp._check.setDisplay("none");
                _comp._checkF.setDisplay("block");
                _comp._check_bg.setDisplay("none");
                _comp._check_bg_f.setDisplay("none");

                _comp._normalDiv._title.setStyle({opacity:1});
                _comp._focusDiv._title.setStyle({opacity:1});
                _comp._focusDiv._info.setStyle({opacity:1});
            }
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

        this.unSelected = function() {
        	unSelected();
        }

        this.setSelected = function() {
        	setSelected();
        }
        this.unChecked = function(isHide) {
            unChecked(isHide);
        }

        this.setChecked = function() {
            setChecked();
        }

        this.releaseRestrict = function() {
            isClearPin = true;
            if(_comp._focusDiv._rating) _comp._focusDiv._rating.setStyle({display:"none"});
            if(_comp._normalDiv._rating) _comp._normalDiv._rating.setStyle({display:"none"});
            if(_comp._normalDiv._title) _comp._normalDiv._title._span.setText(data.title ? data.title : "");
            if(_comp._focusDiv._title) _comp._focusDiv._title._span.setText(data.title ? data.title : "");
            if(isFocused) setFocus();

            if(_param.isSelectable) {
                _comp._check_bg.setStyle({color:"rgba(0,0,0,0.7)"});
                _comp._check_bg_f.setStyle({color:"rgba(0,0,0,0.7)"});
            }
        }

    }

    Poster.TYPE = Object.freeze({W136:0, W113:1});

    return Poster;
});