W.defineModule("comp/kids/Circle", [ "mod/Util"], function(util) {
    function Circle(_param) {
        var _this;

        var _comp;

        var type = _param.type;
        var data = _param.data;
        var idx = _param.idx;

        var POSTER_WIDTH, POSTER_HEIGHT, POSTER_FOCUSED_WIDTH, POSTER_X, POSTER_Y, POSTER_FOCUSED_HEIGHT, DEFAULT_POSTER, GAP_X, GAP_Y;

        if(type == Circle.TYPE.CHARACTER) {
            POSTER_WIDTH = 182, POSTER_HEIGHT = 181, POSTER_X = 0, POSTER_Y = 0, POSTER_FOCUSED_WIDTH = 200, POSTER_FOCUSED_HEIGHT = 199,
                DEFAULT_POSTER = "", GAP_X = 9, GAP_Y = 18;
        } else if(type == Circle.TYPE.CHANNEL) {
            POSTER_WIDTH = 148, POSTER_HEIGHT = 82, POSTER_X = 17, POSTER_Y = 45, POSTER_FOCUSED_WIDTH = 148, POSTER_FOCUSED_HEIGHT = 82,
                DEFAULT_POSTER = "", GAP_X = 0, GAP_Y = 0;
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:182, height:181});

            _comp._bg = new W.Image({x:0, y:0, width:182, height:181, src:"img/kids_cha_bubble_0"+(idx%3+1)+".png"});
            _comp.add(_comp._bg);

            _comp._normalDiv = new W.Div({x:0, y:0, width:182, height:181});
            //_comp._normalDiv._defaultPoster = new W.Image({x:0+POSTER_X, y:0+POSTER_Y, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:DEFAULT_POSTER});
            //_comp._normalDiv.add(_comp._normalDiv._defaultPoster);
            if(type == Circle.TYPE.CHARACTER) {
                _comp._normalDiv._poster = new W.Image({x:0+POSTER_X, y:0+POSTER_Y, width:POSTER_WIDTH, height:POSTER_HEIGHT,
                    src:data.images && data.images[0] ? util.getPosterFilePath(data.images[0].url) : "", visibility:"hidden"});

                _comp._normalDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._normalDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            } else {
                _comp._normalDiv._poster = new W.Image({x:0+POSTER_X, y:0+POSTER_Y, width:POSTER_WIDTH, height:POSTER_HEIGHT,
                    src:W.Config.IMAGE_URL + data.logoBaseUrl+"/"+data.sourceId+"_01.png", visibility:"hidden"});

                _comp._normalDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._normalDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            }
            _comp._normalDiv.add(_comp._normalDiv._poster);

            if(type == Circle.TYPE.CHANNEL) {
                _comp._normalDiv._chNum = new W.Div({x:233-56-150, y:484-444-18, width:145, text:"ch."+data.channelNum,
                    textColor:"rgba(0,0,0,0.5)", fontFamily:"RixHeadB", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"});
                _comp._normalDiv._chNum.add(new W.Span({x:-1, y:-2, width:145, text:"ch."+data.channelNum,
                    textColor:"#FFFFFF", fontFamily:"RixHeadB", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._normalDiv.add(_comp._normalDiv._chNum);
            }

            _comp._normalDiv._title = new W.Div({x:10, y:136, width:162, height:45});
            _comp._normalDiv._title._bg = new W.Image({x:0, y:0, width:162, height:45, src:"img/kids_cha_title.png"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._bg);
            _comp._normalDiv._title._span = new W.Div({x:10, width:142, height:45, lineHeight:41+"px", text:data.title, className:"cut",
                textColor:"#FFFFFF", fontFamily:"RixHeadM", "font-size":"19px", textAlign:"center", "letter-spacing":"-0.95px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv.add(_comp._normalDiv._title);

            /*if(data.isPinned) {
             _comp.add(new W.Image({x:135, y:8, src:"img/kids_my_icon.png"}));
             }*/

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0, y:0, width:182, height:181, zIndex : 1, display:"none"});

            //_comp._focusDiv._defaultPoster = new W.Image({x:0-GAP_X+POSTER_X, y:0-GAP_Y+POSTER_Y, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, src:DEFAULT_POSTER});
            //_comp._focusDiv.add(_comp._focusDiv._defaultPoster);

            if(type == Circle.TYPE.CHARACTER) {
                _comp._focusDiv._poster = new W.Image({x:0-GAP_X+POSTER_X, y:0-GAP_Y+POSTER_Y, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, visibility:"hidden",
                    src:data.images && data.images[1] ? util.getPosterFilePath(data.images[1].url) : (data.images && data.images[0] ? util.getPosterFilePath(data.images[0].url) : "")});

                _comp._focusDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._focusDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            } else {
                _comp._focusDiv._poster = new W.Image({x:0-GAP_X+POSTER_X, y:0-GAP_Y+POSTER_Y, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, visibility:"hidden",
                    src:W.Config.IMAGE_URL + data.logoBaseUrl+"/"+data.sourceId+"_01.png"});

                _comp._focusDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
                _comp._focusDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});
            }
            _comp._focusDiv.add(_comp._focusDiv._poster);

            if(type == Circle.TYPE.CHANNEL) {
                _comp._focusDiv._chNum = new W.Div({x:233-56-150, y:484-444-18, width:145, text:"ch."+data.channelNum,
                    textColor:"rgba(0,0,0,0.5)", fontFamily:"RixHeadB", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"});
                _comp._focusDiv._chNum.add(new W.Div({x:-1, y:-2, width:145, text:"ch."+data.channelNum,
                    textColor:"#FFFFFF", fontFamily:"RixHeadB", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._focusDiv.add(_comp._focusDiv._chNum);
            }

            _comp._focusDiv._title = new W.Div({x:10, y:136, width:167, height:51});
            _comp._focusDiv._title._bg = new W.Image({x:0, y:0, width:167, height:51, src:"img/kids_cha_title_f.png"});
            _comp._focusDiv._title.add(_comp._focusDiv._title._bg);
            _comp._focusDiv._title._span = new W.Div({x:10, width:142, height:45, lineHeight:41+"px",/* text:data.title,*/ textColor:"#FFFFFF",
                fontFamily:"RixHeadM", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px", "white-space" : "nowrap", overflow:"hidden"});
            _comp._focusDiv._title._span._inner = new W.Div({position:"relative", text:data.title});
            _comp._focusDiv._title._span.add(_comp._focusDiv._title._span._inner);
            _comp._focusDiv._title.add(_comp._focusDiv._title._span);
            _comp._focusDiv.add(_comp._focusDiv._title);
            _comp.add(_comp._focusDiv);


            if(type == Circle.TYPE.CHARACTER && data.isRec) {
                _comp.add(new W.Image({x:135, y: 8, width:47, height:45, src:"img/kids_my_icon.png", zIndex : 2}))
            }

        };

        var setFocus = function() {
            if(_comp._focusDiv) _comp._focusDiv.setDisplay("block");
            if(_comp._normalDiv) _comp._normalDiv.setDisplay("none");
            util.setMarquee(_comp._focusDiv._title._span._inner, 500);
        };

        var unFocus = function() {
            if(_comp._focusDiv) _comp._focusDiv.setDisplay("none");
            if(_comp._normalDiv) _comp._normalDiv.setDisplay("block");
            util.stopMarquee(_comp._focusDiv._title._span._inner, 500);
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

    Circle.TYPE = Object.freeze({CHARACTER:0, CHANNEL:1});

    return Circle;
});