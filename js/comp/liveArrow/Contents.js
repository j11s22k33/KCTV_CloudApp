W.defineModule([ "mod/Util"], function(util) {
    function Contents(data, idx) {
        var _this;

        var _comp;

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:318, height:128});

            _comp._normalDiv = new W.Div({x:878-876, y:97-96, width:314, height:126});

            _comp._normalDiv._bg = new W.Image({x:878-878, y:97-97, width:314, height:126, src:"img/box_set_menu.png"});
            _comp._normalDiv.add(_comp._normalDiv._bg);
            _comp._normalDiv._defaultPoster = new W.Image({x:880-878, y:99-97, width:310, height:122, src:""});
            //_comp._normalDiv.add(_comp._normalDiv._defaultPoster);
            _comp._normalDiv._poster = new W.Image({x:880-878, y:99-97, width:310, height:122, src:data.image});
            _comp._normalDiv.add(_comp._normalDiv._poster);

            _comp._normalDiv._title = new W.Div({x:974-878-87+15, y:99-97, width:144, height:122, display:"-webkit-flex",
                "-webkit-align-items":"center","-webkit-justify-content":"center", "-webkit-flex-direction":"column"});
            _comp._normalDiv._title._span = new W.Div({text:data.title ? data.title : "", lineHeight:"22px",
                "white-space":"pre-line", textColor:"#FFFFFF", opacity:0.65,
                display:"-webkit-box", "-webkit-line-clamp":2, "-webkit-box-orient":"vertical",
                overflow:"hidden", "text-overflow":"ellipsis",
                fontFamily:"RixHeadM", "font-size":"21px", textAlign:"center", "letter-spacing":"-1.05px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span);
            _comp._normalDiv.add(_comp._normalDiv._title);
            _comp.add(_comp._normalDiv);

            _comp._focusDiv = new W.Div({x:876-876, y:96-96, width:318, height:128, zIndex : 1, display:"none"});
            _comp._focusDiv.add(new W.Image({x:0, y:0, width:318, height:128, src:"img/box_set_menu_f.png"}));

            _comp.add(_comp._focusDiv);

        };

        var setFocus = function() {
            if(_comp._focusDiv) _comp._focusDiv.setDisplay("block");
        };

        var unFocus = function() {
            if(_comp._focusDiv) _comp._focusDiv.setDisplay("none");
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

    return Contents;
});