W.defineModule([ "mod/Util"], function(util) {
    function KeywordBanner(_param) {
        var _this;

        var _comp;

        var type = _param.type;
        var data = _param.data;

        W.log.info(data)

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y,
            BANNER_WIDTH, BANNER_HEIGHT, BANNER_FOCUSED_WIDTH, BANNER_FOCUSED_HEIGHT, DEFAULT_BANNER;

        if(type == KeywordBanner.TYPE.TYPE_1) {
            NORMAL_DIV_WIDTH = 1037, NORMAL_DIV_HEIGHT = 180, FOCUSED_DIV_WIDTH = 1053, FOCUSED_DIV_HEIGHT = 206,
            BANNER_WIDTH = 1037, BANNER_HEIGHT = 180, BANNER_FOCUSED_WIDTH = 1037, BANNER_FOCUSED_HEIGHT = 180;
            GAP_X = 8, GAP_Y = 5;
            DEFAULT_BANNER = "";
        } else if(type == KeywordBanner.TYPE.TYPE_2) {
            NORMAL_DIV_WIDTH = 509, NORMAL_DIV_HEIGHT = 180, FOCUSED_DIV_WIDTH = 525, FOCUSED_DIV_HEIGHT = 206,
            BANNER_WIDTH = 509, BANNER_HEIGHT = 180, BANNER_FOCUSED_WIDTH = 509, BANNER_FOCUSED_HEIGHT = 180;
            GAP_X = 8, GAP_Y = 5;
            DEFAULT_BANNER = "";
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            //_comp._normalDiv._defaultKeywordBanner = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:DEFAULT_BANNER});
            //_comp._normalDiv.add(_comp._normalDiv._defaultKeywordBanner);
            _comp._normalDiv._poster = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:data.image});
            _comp._normalDiv.add(_comp._normalDiv._poster);

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});
            //_comp._focusDiv._defaultKeywordBanner = new W.Image({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:5,
            //    width:BANNER_FOCUSED_WIDTH, height:BANNER_FOCUSED_HEIGHT, src:DEFAULT_BANNER});
            //_comp._focusDiv.add(_comp._focusDiv._defaultKeywordBanner);
            _comp._focusDiv._poster = new W.Image({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:5, width:BANNER_FOCUSED_WIDTH, height:BANNER_FOCUSED_HEIGHT,
                src:data.image});
            _comp._focusDiv.add(_comp._focusDiv._poster);


            if(type == KeywordBanner.TYPE.TYPE_1) {
                _comp._focusDiv.add(new W.Image({x:0, y:0, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, src:"img/kids_catg_banner_foc.png"}));

            } else if(type == KeywordBanner.TYPE.TYPE_2) {
                _comp._focusDiv.add(new W.Image({x:0, y:0, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, src:"img/kids_catg_banner_foc2.png"}));

            }

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
    }

    KeywordBanner.TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5, TYPE_6:6, TYPE_7:7});
    return KeywordBanner;
});