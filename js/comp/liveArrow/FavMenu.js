W.defineModule([ "mod/Util"], function(util) {
    function FavMenu(data, idx) {
        var _this;

        var _comp;

        var create = function(){
            _comp = new W.Div({x:0, y:0, width:160, height:108});

            _comp._normalDiv = new W.Div({x:878-875, y:229-228, width:154, height:106});

            _comp._normalDiv._bg = new W.Image({x:878-878, y:229-229, width:154, height:106, src:"img/box_like154.png"});
            _comp._normalDiv.add(_comp._normalDiv._bg);

            var title = "", desc = "";
            if(data.fullPath[data.fullPath.length-1]) title = data.fullPath[data.fullPath.length-1];
            if(data.fullPath[data.fullPath.length-2]) desc = data.fullPath[data.fullPath.length-2];

            _comp._normalDiv._title = new W.Div({x:878-878, y:229-229, width:154, height:106, display:"-webkit-flex", "-webkit-flex-direction":"column", "-webkit-align-items":"center","-webkit-justify-content":"center"});
            _comp._normalDiv._title._span1 = new W.Div({position:"relative", width:154, text:title, lineHeight:"30px", className:"cut", "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadM", "font-size":"22px", textAlign:"center", "letter-spacing":"-0.9px"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span1);
            _comp._normalDiv._title._span2 = new W.Div({position:"relative", text:desc, "word-break":"break-all", lineHeight:"1em", "white-space":"pre-line", textColor:"#DABC74", opacity:0.65, fontFamily:"RixHeadL", "font-size":"18px", textAlign:"center"});
            _comp._normalDiv._title.add(_comp._normalDiv._title._span2);
            _comp._normalDiv.add(_comp._normalDiv._title);
            _comp.add(_comp._normalDiv);

            _comp._focusDiv = new W.Div({x:875-875, y:228-228, width:160, height:108, zIndex : 1, display:"none"});
            _comp._focusDiv.add(new W.Image({x:0, y:0, width:160, height:108, src:"img/box_like154_f.png"}));

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

        this.setOpacity = function(opacity) {
            _comp.setOpacity(opacity);
        }
    }

    return FavMenu;
});