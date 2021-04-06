W.defineModule("comp/list/BoxBanner", [ "mod/Util"], function(util) {
    function Banner(_param) {
        var _this;

        var _comp;
        var type = _param.type;
        var data = _param.data;

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y,
            BANNER_WIDTH, BANNER_HEIGHT, BANNER_FOCUSED_WIDTH, BANNER_FOCUSED_HEIGHT, DEFAULT_BANNER;

        if(type == Banner.TYPE.TYPE_1) {
            NORMAL_DIV_WIDTH = 886, NORMAL_DIV_HEIGHT = 120, FOCUSED_DIV_WIDTH = 886, FOCUSED_DIV_HEIGHT = 120,
            BANNER_WIDTH = 886, BANNER_HEIGHT = 120, BANNER_FOCUSED_WIDTH = 886, BANNER_FOCUSED_HEIGHT = 120;
            GAP_X = 0, GAP_Y = 0;
            DEFAULT_BANNER = "";
        } else if(type == Banner.TYPE.TYPE_2 || type == Banner.TYPE.TYPE_3 || type == Banner.TYPE.TYPE_4) {
            NORMAL_DIV_WIDTH = 438, NORMAL_DIV_HEIGHT = 120, FOCUSED_DIV_WIDTH = 438, FOCUSED_DIV_HEIGHT = 120,
            BANNER_WIDTH = 438, BANNER_HEIGHT = 120, BANNER_FOCUSED_WIDTH = 438, BANNER_FOCUSED_HEIGHT = 120;
            GAP_X = 0, GAP_Y = 0;
            DEFAULT_BANNER = "";
        } else {
            NORMAL_DIV_WIDTH = 287, NORMAL_DIV_HEIGHT = 194, FOCUSED_DIV_WIDTH = 506, FOCUSED_DIV_HEIGHT = 234,
            BANNER_WIDTH = 287, BANNER_HEIGHT = 194, BANNER_FOCUSED_WIDTH = 330, BANNER_FOCUSED_HEIGHT = 224;
            GAP_X = 109, GAP_Y = 14;
            DEFAULT_BANNER = "";
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            //_comp._defaultBanner = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:DEFAULT_BANNER});
            //_comp.add(_comp._defaultBanner);
            _comp._poster = new W.Image({x:0, y:0, width:BANNER_WIDTH, height:BANNER_HEIGHT, src:data.image});
            _comp.add(_comp._poster);

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});
            if(type == Banner.TYPE.TYPE_1) {
                _comp._focusDiv.add(new W.Div({x:0,y:0,width:4,height:120, color:"#FF0000"}));
                _comp._focusDiv.add(new W.Div({x:882,y:0,width:4,height:120, color:"#FF0000"}));
                _comp._focusDiv.add(new W.Div({x:4,y:0,width:878,height:4, color:"#FF0000"}));
                _comp._focusDiv.add(new W.Div({x:4,y:116,width:878,height:4, color:"#FF0000"}));
            } else if(type == Banner.TYPE.TYPE_2 || type == Banner.TYPE.TYPE_3 || type == Banner.TYPE.TYPE_4) {
                _comp._focusDiv.add(new W.Div({x:0,y:0,width:4,height:120, color:"#FF0000"}));
                _comp._focusDiv.add(new W.Div({x:434,y:0,width:4,height:120, color:"#FF0000"}));
                _comp._focusDiv.add(new W.Div({x:4,y:0,width:430,height:4, color:"#FF0000"}));
                _comp._focusDiv.add(new W.Div({x:4,y:116,width:430,height:4, color:"#FF0000"}));
            } else {
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

    Banner.TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
    return Banner;
});