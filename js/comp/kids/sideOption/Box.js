/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function Box() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({position:"relative", marginTop:"8px", x:data.x, y:data.y, width:270, height:58});
            _comp.add(new W.Image({x:0, y:0, width:270, height:58, src:"img/kids_op_bt.png"}));
            _comp._focus = new W.Image({x:0, y:0, width:270, height:58, src:"img/kids_op_bt_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:0, y:0, width:270, height:58, "font-size":"20px", textColor:"#000000", "letter-spacing":"-1.1px"});
            _comp._text.add(new W.Span({text:data.text, width:270, height:58, lineHeight:"58px", fontFamily:"RixHeadM", textAlign:"center"}));
            _comp.add(_comp._text);
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            _comp._text.setStyle({textColor:"#000000", opacity:1, "font-size":"20px"});
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _comp._text.setStyle({textColor:"#FFFFFF", opacity:1, "font-size":"22px"});
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