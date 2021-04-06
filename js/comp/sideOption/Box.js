/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function Box() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({position:"relative", marginTop:"8px", x:data.x, y:data.y, width:244, height:56});
            _comp.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_popup244.png"}));
            _comp._focus = new W.Image({x:-1, y:-1, width:246, height:58, src:"img/box_popup244_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:0, y:0, width:244, height:56, "font-size":"18px", textColor:"#FFFFFF", "letter-spacing":"-0.9px", opacity:0.75});
            _comp._text.add(new W.Span({text:data.text, width:244, height:56, lineHeight:"56px", fontFamily:"RixHeadL", textAlign:"center"}));
            _comp.add(_comp._text);
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            _comp._text.setStyle({textColor:"#B5B5B5", opacity:0.75});
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _comp._text.setStyle({textColor:"#FFFFFF", opacity:1});
        };

        var unSelected = function() {
            _comp._radio_f.setDisplay("none");
        };

        var setSelected = function() {
            _comp._radio_f.setDisplay("block");
        };

        this.setFocus = function() {
            setFocus();
        };

        this.unFocus = function() {
            unFocus();
        };

        this.setSelected = function() {
            setSelected();
        };

        this.unSelected = function() {
            unSelected();
        };

        this.getComp = function(_data) {
            if(!_comp) create(_data);
            return _comp;
        };
    }
    return Box;
});