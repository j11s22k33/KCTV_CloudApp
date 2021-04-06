W.defineModule("comp/list/Box", [ "mod/Util"], function(util) {
    function Box(_param) {
        var _this;

        var _comp;

        var type = _param.type;
        var data = _param.data;
        var isPackage = _param.isPackage;
        var textAlign = _param.textAlign;
        var isZzim = _param.isZzim;

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y, FOCUS_GAP, ICON_GAP,
            POSTER_WIDTH, POSTER_HEIGHT, POSTER_FOCUSED_WIDTH, POSTER_FOCUSED_HEIGHT, DEFAULT_POSTER, POSTER_SHADOW_WIDTH, POSTER_SHADOW_HEIGHT;

        if(type == Box.TYPE.W214) {
            NORMAL_DIV_WIDTH = 214, NORMAL_DIV_HEIGHT = 120, FOCUSED_DIV_WIDTH = 214, FOCUSED_DIV_HEIGHT = 120,
            POSTER_WIDTH = 214, POSTER_HEIGHT = 120, POSTER_FOCUSED_WIDTH = 214, POSTER_FOCUSED_HEIGHT = 120;
            DEFAULT_POSTER = "", GAP_X = 0, GAP_Y = 0;
        } else if(type == Box.TYPE.W113) {
            NORMAL_DIV_WIDTH = 113, NORMAL_DIV_HEIGHT = 199, FOCUSED_DIV_WIDTH = 219, FOCUSED_DIV_HEIGHT = 255,
            POSTER_WIDTH = 113, POSTER_HEIGHT = 162, POSTER_FOCUSED_WIDTH = 127, POSTER_FOCUSED_HEIGHT = 183;
            DEFAULT_POSTER = "", POSTER_SHADOW_WIDTH = 43, POSTER_SHADOW_HEIGHT = 162;
            GAP_X = 53, GAP_Y = 9, FOCUS_GAP = 5, ICON_GAP = 10;
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp.add(new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:"img/00_dep_bg.png"}));

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            if(data.images && data.images.length > 0){
            	_comp._normalDiv.add(new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:W.Config.IMAGE_URL + data.images[0].url}));
            }else{
            	_comp._normalDiv._title = new W.Div({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, display:"-webkit-flex", "-webkit-flex-direction":"column",
                    "-webkit-align-items":"center","-webkit-justify-content":"center"});
                _comp._normalDiv._title._span = new W.Div({position:"relative", "white-space":"pre-line", width:POSTER_WIDTH-54+"px", text:data.title/*.replace(/  /gi, "\n")*/,
                    textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadL", "font-size":"19px", textAlign:"center", "letter-spacing":"-0.95px"});
                _comp._normalDiv._title.add(_comp._normalDiv._title._span);
                _comp._normalDiv.add(_comp._normalDiv._title);
                if(isZzim){
               	 _comp._normalDiv._title._span2 = new W.Div({position:"relative", y:5, "white-space":"pre-line", width:POSTER_WIDTH-54+"px",
                     text:"(" + data.count + " " + W.Texts["unit_vod"]+")", textColor:"rgba(237,168,2,0.75)", fontFamily:"RixHeadL",
                     "font-size":"19px", textAlign:"center", "letter-spacing":"-0.95px"});
                    _comp._normalDiv._title.add(_comp._normalDiv._title._span2);
               }
            }
            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});
            if(data.images && data.images.length > 0){
            	_comp._focusDiv.add(new W.Image({x:0, y:0, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, src:W.Config.IMAGE_URL + data.images[0].url}));
            }else{
            	_comp._focusDiv._title = new W.Div({x:GAP_X, y:GAP_Y, width:POSTER_WIDTH, height:POSTER_HEIGHT, display:"-webkit-flex",
                    "-webkit-flex-direction":"column", "-webkit-align-items":"center","-webkit-justify-content":"center"});
                _comp._focusDiv._title._span = new W.Div({position:"relative", "white-space":"pre-line", width:POSTER_WIDTH-54+"px", text:data.title/*.replace(/  /gi, "\n")*/,
                    textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"19px", textAlign:"center", "letter-spacing":"-0.95px"});

                _comp._focusDiv._title.add(_comp._focusDiv._title._span);
                _comp._focusDiv.add(_comp._focusDiv._title);
                if(isZzim){
                	_comp._focusDiv._title._span2 = new W.Div({position:"relative", y:5, "white-space":"pre-line", width:POSTER_WIDTH-54+"px",
                        text:"(" + data.count + " " + W.Texts["unit_vod"]+")", textColor:"rgba(237,168,2,1)", fontFamily:"RixHeadM",
                        "font-size":"19px", textAlign:"center", "letter-spacing":"-0.95px"});
                    _comp._focusDiv._title.add(_comp._focusDiv._title._span2);
               }
            }
            

            _comp._focusDiv.add(new W.Div({x:0,y:0,width:4,height:120, color:"#FF0000"}));
            _comp._focusDiv.add(new W.Div({x:210,y:0,width:4,height:120, color:"#FF0000"}));
            _comp._focusDiv.add(new W.Div({x:4,y:0,width:206,height:4, color:"#FF0000"}));
            _comp._focusDiv.add(new W.Div({x:4,y:116,width:206,height:4, color:"#FF0000"}));

            

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
                } else {
                    _comp._check.setDisplay("block");
                    _comp._checkF.setDisplay("none");
                }
            }
        };

        var setChecked = function() {
            if(_comp._check){
                //_comp._check.setDisplay("none");
                _comp._checkF.setDisplay("block");
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

    }

    Box.TYPE = Object.freeze({W214:0, W113:1});

    return Box;
});