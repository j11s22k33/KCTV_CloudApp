W.defineModule("comp/list/Banner", [ "mod/Util"], function(util) {
    function Banner(_param) {
        var _this;

        var _comp;
        var type = _param.type;
        var data = _param.data;

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y,
            BANNER_WIDTH, BANNER_HEIGHT, BANNER_FOCUSED_WIDTH, BANNER_FOCUSED_HEIGHT, DEFAULT_BANNER;

        if(type == Banner.TYPE.TYPE_1) {
            NORMAL_DIV_WIDTH = 1042, NORMAL_DIV_HEIGHT = 214, FOCUSED_DIV_WIDTH = 1086, FOCUSED_DIV_HEIGHT = 233,
            BANNER_WIDTH = 1042, BANNER_HEIGHT = 214, BANNER_FOCUSED_WIDTH = 1086, BANNER_FOCUSED_HEIGHT = 223;
            GAP_X = 22, GAP_Y = 10;
            DEFAULT_BANNER = "";
        } else if(type == Banner.TYPE.TYPE_2) {
            NORMAL_DIV_WIDTH = 513, NORMAL_DIV_HEIGHT = 214, FOCUSED_DIV_WIDTH = 743, FOCUSED_DIV_HEIGHT = 243,
            BANNER_WIDTH = 513, BANNER_HEIGHT = 214, BANNER_FOCUSED_WIDTH = 557, BANNER_FOCUSED_HEIGHT = 233;
            GAP_X = 115, GAP_Y = 14;
            DEFAULT_BANNER = "";
        } else {
            NORMAL_DIV_WIDTH = 287, NORMAL_DIV_HEIGHT = 194, FOCUSED_DIV_WIDTH = 506, FOCUSED_DIV_HEIGHT = 234,
            BANNER_WIDTH = 287, BANNER_HEIGHT = 194, BANNER_FOCUSED_WIDTH = 330, BANNER_FOCUSED_HEIGHT = 224;
            GAP_X = 109, GAP_Y = 14;
            DEFAULT_BANNER = "";
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            //_comp._normalDiv._defaultBanner = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:DEFAULT_BANNER});
            //_comp._normalDiv.add(_comp._normalDiv._defaultBanner);
            _comp._normalDiv._poster = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:data.image, visibility:"hidden"});
            _comp._normalDiv.add(_comp._normalDiv._poster);

            _comp._normalDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
            _comp._normalDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});
            if(type == Banner.TYPE.TYPE_1) {
            } else if(type == Banner.TYPE.TYPE_2) {
                _comp._focusDiv.add(new W.Image({x:0, y:GAP_Y, width:93, height:BANNER_HEIGHT, src:"img/banner_sh_h214_l.png"}));
                _comp._focusDiv.add(new W.Image({right:0, y:GAP_Y, width:93, height:BANNER_HEIGHT, src:"img/banner_sh_h214_r.png"}));
            } else {
                _comp._focusDiv.add(new W.Image({x:0, y:GAP_Y, width:88, height:BANNER_HEIGHT, src:"img/poster_sh_h194_l.png"}));
                _comp._focusDiv.add(new W.Image({right:0, y:GAP_Y, width:88, height:BANNER_HEIGHT, src:"img/poster_sh_h194_r.png"}));
            }
            //_comp._focusDiv._defaultBanner = new W.Image({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:5, width:BANNER_FOCUSED_WIDTH, height:BANNER_FOCUSED_HEIGHT, src:DEFAULT_BANNER});
            //_comp._focusDiv.add(_comp._focusDiv._defaultBanner);
            _comp._focusDiv._poster = new W.Image({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:5, width:BANNER_FOCUSED_WIDTH, height:BANNER_FOCUSED_HEIGHT,
                src:data.image, visibility:"hidden"});
            _comp._focusDiv.add(_comp._focusDiv._poster);

            _comp._focusDiv._poster.comp.addEventListener('load', function(){this.style.visibility=""});
            _comp._focusDiv._poster.comp.addEventListener('error', function(){this.style.visibility="hidden"});

            _comp._focusDiv.add(new W.Div({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:0, width:BANNER_FOCUSED_WIDTH, height:4, color:"#E53000"}));
            _comp._focusDiv.add(new W.Div({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:6+BANNER_FOCUSED_HEIGHT, width:BANNER_FOCUSED_WIDTH, height:4, color:"#E53000"}));

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

    Banner.TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
    return Banner;
});