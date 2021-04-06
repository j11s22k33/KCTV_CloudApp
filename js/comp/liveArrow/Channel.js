W.defineModule([ "mod/Util"], function(util) {
    function Channel(type, data, idx) {
        var _this;

        var _comp;

        //W.log.info(type, data,idx)

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:477, height:126});

            _comp._normalDiv = new W.Div({x:57-42, y:114-113, width:477, height:126});


            if(idx == 0) _comp._normalDiv.add(new W.Div({x:57-57, y:114-114, width:477, height:1, color:"#FFFFFF", opacity:0.07}));
            _comp._normalDiv.add(new W.Div({x:57-57, y:239-114, width:477, height:1, color:"#FFFFFF", opacity:0.07}));

            _comp._normalDiv._defaultPoster = new W.Image({x:57-57, y:128-114, width:175, height:98, src:"img/default_ch_thumbnail.png"});
            _comp._normalDiv.add(_comp._normalDiv._defaultPoster);

            _comp._normalDiv._poster = new W.Image({x:57-57, y:128-114, width:175, height:98,
                src:util.getChThumbUrl(data.channelSrcId)});
            _comp._normalDiv.add(_comp._normalDiv._poster);
            _comp._normalDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            
            _comp._normalDiv._dim = new W.Div({x:57-57, y:128-114, width:175, height:98, backgroundColor:"rgb(0,0,0)", opacity:0.3});
            _comp._normalDiv.add(_comp._normalDiv._dim);

            _comp._normalDiv._title = new W.Div({x:263-57, y:169-114, width:260, height:25});

            if(type == Channel.TYPE.RANKING) {
                var color = ["rgba(237,168,2,1)", "rgba(200,200,200,1)", "rgba(189,87,42,1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.4)"];
                if(idx < 5) {
                    _comp._normalDiv._title._medal = new W.Div({position:"relative", float:"left", x:0, y:-2, width:21, height:29, marginLeft:"2px", marginRight:"14px"});
                    _comp._normalDiv._title._medal.add(new W.Image({x:0, y:0, width:21, height:29, src:"img/medal_"+(idx+1)+".png"}));
                    _comp._normalDiv._title._medal.add(new W.Div({x:7, y:13, width:10, height:10, text:(idx+1), textColor:color[idx], fontFamily:"RixHeadB",
                        "font-size":"10px", textAlign:"left"}));
                    _comp._normalDiv._title.add(_comp._normalDiv._title._medal);
                }

            }

            var title;
            if(data.schedule && data.schedule.title) {
                title = data.schedule.title;
            } else {
                title = W.Texts["no_prog_list"];
            }
            _comp._normalDiv._title._span = new W.Div({position:"relative", float:"left", maxWidth:220+"px", height:25, text:title, className:"cut",
                textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadL", "font-size":"24px", textAlign:"left", "letter-spacing":"-1.2px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv.add(_comp._normalDiv._title);

            _comp._normalDiv._chNum = new W.Div({x:263-57, y:137-114, width:260, height:32});
            _comp._normalDiv._chNum._span = new W.Div({position:"relative", float:"left", maxWidth:50+"px", height:32, text:util.changeDigit(data.channelNo,3),
                textColor:"#B5B5B5", opacity:0.3, fontFamily:"RixHeadM", "font-size":"19px", textAlign:"left", "letter-spacing":"-0.95px"});
            _comp._normalDiv._chNum.add(_comp._normalDiv._chNum._span);
            _comp._normalDiv.add(_comp._normalDiv._chNum);

            _comp._normalDiv._chName = new W.Div({x:305-57, y:137-114, width:210, height:21});
            _comp._normalDiv._chName._span = new W.Div({position:"relative", float:"left", maxWidth:210+"px", height:21, text:data.channelName, className:"cut",
                textColor:"#B5B5B5", opacity:0.7, fontFamily:"RixHeadM", "font-size":"19px", textAlign:"left", "letter-spacing":"-0.95px"});
            _comp._normalDiv._chName.add(_comp._normalDiv._chName._span);
            _comp._normalDiv.add(_comp._normalDiv._chName);
            if(data.isPinned) {
                _comp._normalDiv._chName._span.setStyle({maxWidth:210-21+"px"})
                _comp._normalDiv._chName.add(new W.Image({position:"relative", x:2, y:-4, src:"img/favor_star.png"}));
            }

            if(data.schedule) {
                _comp._normalDiv._startTime = new W.Div({x:262-57, y:206-114, width:100, height:17, text:data.schedule.startTime.slice(11,16),
                    textColor:"#B5B5B5", opacity:0.5, fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left"});
                _comp._normalDiv.add(_comp._normalDiv._startTime);
                _comp._normalDiv._endTime = new W.Div({x:486-57, y:206-114, width:100, height:17, text:data.schedule.endTime.slice(11,16),
                    textColor:"#B5B5B5", opacity:0.5, fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left"});
                _comp._normalDiv.add(_comp._normalDiv._endTime);

                _comp._normalDiv._progressBarBg = new W.Div({x:318-57, y:214-114, width:155, height:2, color:"#B4BAC4", opacity:0.25});
                _comp._normalDiv.add(_comp._normalDiv._progressBarBg);

                var _width = 155/(util.newDate(data.schedule.endTime) - util.newDate(data.schedule.startTime)) * (util.newDate() - util.newDate(data.schedule.startTime));
                _comp._normalDiv._progressBar = new W.Div({x:318-57, y:214-114, width:_width, height:2, color:"#FFFFFF", opacity:1});
                _comp._normalDiv.add(_comp._normalDiv._progressBar);
            }


           /* if(type == Channel.TYPE.RANKING) {
                _comp._normalDiv._icons = new W.Div({x:-12, y:3, width:60});
                if(data.isHot) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53, backgroundImage:"url(img/icon_hot.png)", marginBottom:"-24px"}));
                }
                if(data.isNew) {
                    _comp._normalDiv._icons.add(new W.Div({position:"relative", width:60, height:53, backgroundImage:"url(img/icon_new.png)", marginBottom:"-24px"}));
                }
                _comp._normalDiv.add(_comp._normalDiv._icons);
            }
            */
            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:42-42, y:113-113, width:510, height:128, zIndex : 1, display:"none"});
            _comp._focusDiv.add(new W.Image({x:0, y:0, width:510, height:128, src:"img/line_arr477_f.png"}));

            _comp.add(_comp._focusDiv);

        };

        var setFocus = function() {
            if(_comp._focusDiv) _comp._focusDiv.setDisplay("block");
            if(_comp._normalDiv) {
                _comp._normalDiv._dim.setStyle({display:"none"});
                _comp._normalDiv._chNum._span.setStyle({textColor:"#FFFFFF", opacity:0.75});
                _comp._normalDiv._chName._span.setStyle({textColor:"#FFFFFF", opacity:1});
                _comp._normalDiv._title._span.setStyle({opacity:1});
            }
        };

        var unFocus = function() {
            if(_comp._focusDiv) _comp._focusDiv.setDisplay("none");
            if(_comp._normalDiv) {
                _comp._normalDiv._dim.setStyle({display:""});
                _comp._normalDiv._chNum._span.setStyle({textColor:"#B5B5B5", opacity:0.3});
                _comp._normalDiv._chName._span.setStyle({textColor:"#B5B5B5", opacity:0.7});
                _comp._normalDiv._title._span.setStyle({opacity:0.75});
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
    }

    Channel.TYPE = Object.freeze({RANKING:0, PREFERRED:1});

    return Channel;
});