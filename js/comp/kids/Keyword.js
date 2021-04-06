W.defineModule("comp/kids/Keyword", [ "mod/Util"], function(util) {
    function Keyword(_param) {
        var _this;

        var _comp;

        var type = _param.type;
        var data = _param.data;
        var idx = _param.idx;

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:264, height:100});

            var titles = [];
            //if(data.title.length > 9){
            //	titles[0] = data.title.substr(0,9);
            //	titles[1] = data.title.substr(9,30);
            //}else{
            	titles[0] = data.title;
            //}


            _comp._normalDiv = new W.Div({x:0, y:0, width:264, height:100});
            _comp._normalDiv.add(new W.Image({x:0, y:0, width:264, height:100, src:"img/kids_menu_bg.png"}));
            //if(titles.length > 1){
            //    _comp._normalDiv.add(new W.Span({x:36, y:24, width:192, height:"25px", textColor:"#FFFFFF",
    		//		"font-size":"23px", className:"font_rixhead_medium", text:titles[0], textAlign:"center"}));
            //    _comp._normalDiv.add(new W.Span({x:36, y:50,  width:192, height:"25px", textColor:"#FFFFFF",
    		//		"font-size":"23px", className:"font_rixhead_medium cut", text:titles[1], textAlign:"center"}));
            //}else{
            //    _comp._normalDiv.add(new W.Span({x:36, y:37,  width:192, height:"25px", textColor:"#FFFFFF",
    		//		"font-size":"23px", className:"font_rixhead_medium", text:titles[0], textAlign:"center"}));
            //}

            _comp._normalDiv._title = new W.Div({x:36, y:37,  width:192, height:27, display:"-webkit-flex", "-webkit-flex-direction":"column",
                "-webkit-align-items":"center","-webkit-justify-content":"center"});
            _comp._normalDiv._title._span = new W.Div({display:"-webkit-box", "-webkit-line-clamp":2, "-webkit-box-orient":"vertical","white-space":"pre-line",
                overflow:"hidden", "text-overflow":"ellipsis", text:data.title/*.replace(/  /gi, "\n")*/, textColor:"rgba(255,255,255,1)",
                fontFamily:"RixHeadM", "font-size":"25px", textAlign:"center", "letter-spacing":"-1.15px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv.add(_comp._normalDiv._title);

            _comp.add(_comp._normalDiv);

            _comp._focusDiv = new W.Div({x:-10, y:-8, width:284, height:120, zIndex : 1, display:"none"});
            _comp._focusDiv.add(new W.Image({x:0, y:0, width:284, height:120, src:"img/kids_menu_bg_f.png"}));
            //if(titles.length > 1){
            //    _comp._focusDiv.add(new W.Span({x:40, y:29, width:200, height:"27px", textColor:"#FFFFFF",
    		//		"font-size":"25px", className:"font_rixhead_medium", text:titles[0], textAlign:"center"}));
            //    _comp._focusDiv.add(new W.Span({x:40, y:59,  width:200, height:"27px", textColor:"#FFFFFF",
    		//		"font-size":"25px", className:"font_rixhead_medium cut", text:titles[1], textAlign:"center"}));
            //}else{
            //    _comp._focusDiv.add(new W.Span({x:40, y:44,  width:200, height:"27px", textColor:"#FFFFFF",
    		//		"font-size":"25px", className:"font_rixhead_medium", text:titles[0], textAlign:"center"}));
            //}

            _comp._focusDiv._title = new W.Div({x:40, y:44,  width:200, height:27, display:"-webkit-flex", "-webkit-flex-direction":"column",
                "-webkit-align-items":"center","-webkit-justify-content":"center"});
            _comp._focusDiv._title._span = new W.Div({display:"-webkit-box", "-webkit-line-clamp":2, "-webkit-box-orient":"vertical","white-space":"pre-line",
                overflow:"hidden", "text-overflow":"ellipsis", text:data.title/*.replace(/  /gi, "\n")*/, textColor:"rgba(255,255,255,1)",
                fontFamily:"RixHeadM", "font-size":"27px", textAlign:"center", "letter-spacing":"-1.15px"});
            _comp._focusDiv._title.add(_comp._focusDiv._title._span);
            _comp._focusDiv.add(_comp._focusDiv._title);

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

    Keyword.TYPE = Object.freeze({MENU:0, CHANNEL:1});

    return Keyword;
});