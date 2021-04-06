W.defineModule([ "mod/Util"], function(util) {
    function PosterBanner(_param) {
        var _this;

        var _comp;

        var type = _param.type;
        var data = _param.data;

        W.log.info(data)

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y,
            BANNER_WIDTH, BANNER_HEIGHT, BANNER_FOCUSED_WIDTH, BANNER_FOCUSED_HEIGHT, DEFAULT_BANNER;

        if(type == PosterBanner.TYPE.TYPE_1) {
            NORMAL_DIV_WIDTH = 990, NORMAL_DIV_HEIGHT = 200, FOCUSED_DIV_WIDTH = 1056, FOCUSED_DIV_HEIGHT = 236,
            BANNER_WIDTH = 990, BANNER_HEIGHT = 200, BANNER_FOCUSED_WIDTH = 1040, BANNER_FOCUSED_HEIGHT = 210;
            GAP_X = 31, GAP_Y = 11;
            DEFAULT_BANNER = "";
        } else if(type == PosterBanner.TYPE.TYPE_2 || type == PosterBanner.TYPE.TYPE_3 || type == PosterBanner.TYPE.TYPE_4) {
            NORMAL_DIV_WIDTH = 480, NORMAL_DIV_HEIGHT = 200, FOCUSED_DIV_WIDTH = 558, FOCUSED_DIV_HEIGHT = 252,
            BANNER_WIDTH = 480, BANNER_HEIGHT = 200, BANNER_FOCUSED_WIDTH = 542, BANNER_FOCUSED_HEIGHT = 226;
            GAP_X = 47, GAP_Y = 23;
            DEFAULT_BANNER = "";
        } else {
            NORMAL_DIV_WIDTH = 310, NORMAL_DIV_HEIGHT = 200, FOCUSED_DIV_WIDTH = 366, FOCUSED_DIV_HEIGHT = 252,
            BANNER_WIDTH = 310, BANNER_HEIGHT = 200, BANNER_FOCUSED_WIDTH = 350, BANNER_FOCUSED_HEIGHT = 226;
            GAP_X = 26, GAP_Y = 17;
            DEFAULT_BANNER = "";
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            //_comp._normalDiv._defaultPosterBanner = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:DEFAULT_BANNER});
            //_comp._normalDiv.add(_comp._normalDiv._defaultPosterBanner);
            _comp._normalDiv._poster = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:data.image});
            _comp._normalDiv.add(_comp._normalDiv._poster);

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});
            if(type == PosterBanner.TYPE.TYPE_1) {
            } else if(type == PosterBanner.TYPE.TYPE_2 || type == PosterBanner.TYPE.TYPE_3 || type == PosterBanner.TYPE.TYPE_4) {
                _comp._focusDiv.add(new W.Image({x:-92, y:GAP_Y, width:93, height:BANNER_HEIGHT, src:"img/banner_sh_h200_l.png"}));
                _comp._focusDiv.add(new W.Image({right:-92+"px", y:GAP_Y, width:93, height:BANNER_HEIGHT, src:"img/banner_sh_h200_r.png"}));
            } else {
                _comp._focusDiv.add(new W.Image({x:0, y:GAP_Y, width:88, height:BANNER_HEIGHT, src:"img/poster_sh_h194_l.png"}));
                _comp._focusDiv.add(new W.Image({right:0, y:GAP_Y, width:88, height:BANNER_HEIGHT, src:"img/poster_sh_h194_r.png"}));
            }
            //_comp._focusDiv._defaultPosterBanner = new W.Image({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:5, width:BANNER_FOCUSED_WIDTH, height:BANNER_FOCUSED_HEIGHT, src:DEFAULT_BANNER});
            //_comp._focusDiv.add(_comp._focusDiv._defaultPosterBanner);
            _comp._focusDiv._poster = new W.Image({x:(FOCUSED_DIV_WIDTH-BANNER_FOCUSED_WIDTH)/2, y:5,
                width:BANNER_FOCUSED_WIDTH, height:BANNER_FOCUSED_HEIGHT, src:data.image});
            _comp._focusDiv.add(_comp._focusDiv._poster);


            if(type == PosterBanner.TYPE.TYPE_1) {
                _comp._focusDiv.add(new W.Image({x:0, y:0, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, src:"img/kidsbanner_foc3.png"}));

            } else if(type == PosterBanner.TYPE.TYPE_2 || type == PosterBanner.TYPE.TYPE_3 || type == PosterBanner.TYPE.TYPE_4) {
                _comp._focusDiv.add(new W.Image({x:0, y:0, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, src:"img/kidsbanner_foc2.png"}));

            } else {
                _comp._focusDiv.add(new W.Image({x:0, y:0, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, src:"img/kidsbanner_foc.png"}));

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

    PosterBanner.TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5, TYPE_6:6, TYPE_7:7});
    return PosterBanner;
});