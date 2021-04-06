/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function Box() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({x:data.x, y:data.y, width:data.width, height:56});
            _comp.add(new W.Image({x:0, y:0, width:data.width, height:56, src:"img/box_set"+data.width+".png"}));
            _comp._focus = new W.Image({x:-1, y:-1, width:data.width+2, height:56, src:"img/box_set"+data.width+"_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:43, y:0, width:data.width-43, height:56, "font-size":"20px", textColor:"#B5B5B5", "letter-spacing":"-0.9px", opacity:0.75});
            if(data.boldText) _comp._text.add(new W.Span({text:data.boldText + " ", position:"relative", height:56, lineHeight:"56px", fontFamily:"RixHeadM",
                "font-size":"18px", textAlign:"left"}));
            _comp._text.add(new W.Span({text:data.text, position:"relative", height:56, lineHeight:"56px", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"left"}));
            _comp.add(_comp._text);

            _comp._radio = new W.Image({x:14, y:17, width:22, height:22, src:"img/radio_n.png"});
            _comp.add(_comp._radio);
            _comp._radio_f = new W.Image({x:14, y:17, width:22, height:22, src:"img/radio_f.png", display:"none"});
            _comp.add(_comp._radio_f);
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