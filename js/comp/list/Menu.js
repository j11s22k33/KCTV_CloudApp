W.defineModule("comp/list/Menu", [ "mod/Util"], function(util) {
    function Menu(_param) {
        var _this;

        var _comp;

        var type = _param.type;
        var data = _param.data;
        var isPackage = _param.isPackage;
        var textAlign = _param.textAlign;

        var NORMAL_DIV_WIDTH, NORMAL_DIV_HEIGHT, FOCUSED_DIV_WIDTH, FOCUSED_DIV_HEIGHT, GAP_X, GAP_Y, FOCUS_GAP, ICON_GAP,
            POSTER_WIDTH, POSTER_HEIGHT, POSTER_FOCUSED_WIDTH, POSTER_FOCUSED_HEIGHT, DEFAULT_POSTER, POSTER_SHADOW_WIDTH, POSTER_SHADOW_HEIGHT;

        if(type == Menu.TYPE.W277) {
            NORMAL_DIV_WIDTH = 277, NORMAL_DIV_HEIGHT = 146, FOCUSED_DIV_WIDTH = 279, FOCUSED_DIV_HEIGHT = 148,
            POSTER_WIDTH = 277, POSTER_HEIGHT = 146, POSTER_FOCUSED_WIDTH = 279, POSTER_FOCUSED_HEIGHT = 148;
            DEFAULT_POSTER = "", GAP_X = 1, GAP_Y = 1;
        } else if(type == Menu.TYPE.W113) {
            NORMAL_DIV_WIDTH = 113, NORMAL_DIV_HEIGHT = 199, FOCUSED_DIV_WIDTH = 219, FOCUSED_DIV_HEIGHT = 255,
            POSTER_WIDTH = 113, POSTER_HEIGHT = 162, POSTER_FOCUSED_WIDTH = 127, POSTER_FOCUSED_HEIGHT = 183;
            DEFAULT_POSTER = "", POSTER_SHADOW_WIDTH = 43, POSTER_SHADOW_HEIGHT = 162;
            GAP_X = 53, GAP_Y = 9, FOCUS_GAP = 5, ICON_GAP = 10;
        }

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});

            _comp.add(new W.Image({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT, src:"img/box_favor_menu.png"}));

            _comp._normalDiv = new W.Div({x:0, y:0, width:NORMAL_DIV_WIDTH, height:NORMAL_DIV_HEIGHT});
            _comp._normalDiv._title = new W.Div({x:0, y:0, width:POSTER_WIDTH, height:POSTER_HEIGHT});
            var title, desc;
            if(_param.isBookmark) {
                if(data.fullPath[data.fullPath.length-1]) title = data.fullPath[data.fullPath.length-1];
                if(data.fullPath[data.fullPath.length-2]) desc = data.fullPath[data.fullPath.length-2];
            } else {
                title = data.title;
                desc = data.category;
            }
            _comp._normalDiv._title._span = new W.Div({x:0,y:52, width:POSTER_WIDTH-8+"px", height:25, text:title, className:"cut",
                textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadL", "font-size":"22px", textAlign:"center", "letter-spacing":"-1.1px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv._title._desc = new W.Div({x:0,y:85, width:POSTER_WIDTH-8+"px", height:20, text:desc, className:"cut",
                textColor:"rgba(237,168,2,0.75)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._desc);
            _comp._normalDiv.add(_comp._normalDiv._title);

            _comp.add(_comp._normalDiv);


            _comp._focusDiv = new W.Div({x:0-GAP_X, y:0-GAP_Y, width:FOCUSED_DIV_WIDTH, height:FOCUSED_DIV_HEIGHT, zIndex : 1, display:"none"});

            _comp._focusDiv.add(new W.Image({x:0, y:0, width:POSTER_FOCUSED_WIDTH, height:POSTER_FOCUSED_HEIGHT, src:"img/box_favor_menu_f.png"}));

            _comp._focusDiv._title = new W.Div({x:GAP_X, y:GAP_Y, width:POSTER_WIDTH, height:POSTER_HEIGHT});
            _comp._focusDiv._title._span = new W.Div({x:0,y:52, width:POSTER_WIDTH-8+"px", height:28, text:title, className:"cut",
                textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadL", "font-size":"26px", textAlign:"center", "letter-spacing":"-1.1px"});
            _comp._focusDiv._title.add(_comp._focusDiv._title._span);
            _comp._focusDiv._title._desc = new W.Div({x:0,y:89, width:POSTER_WIDTH-8+"px", height:20, text:desc, className:"cut",
                textColor:"rgba(237,168,2,0.75)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"});
            _comp._focusDiv._title.add(_comp._focusDiv._title._desc);
            _comp._focusDiv.add(_comp._focusDiv._title);

            _comp.add(_comp._focusDiv);

            if(_param.isSelectable) {
                _comp._check = new W.Image({x:13, y:13, src:"img/check_n2.png", width:22, height:22, zIndex:2, display:"none"});
                _comp.add(_comp._check);
                _comp._checkF = new W.Image({x:13, y:13, src:"img/check__f.png", width:22, height:22, zIndex:2, display:"none"});
                _comp.add(_comp._checkF);
            }

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

    Menu.TYPE = Object.freeze({W277:0, W113:1});

    return Menu;
});