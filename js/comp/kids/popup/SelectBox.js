/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function SelectBox() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({x:data.x, y:data.y, width:190, height:60});
            _comp.add(new W.Image({x:0, y:0, width:190, height:60, src:"img/kids_op.png"}));
            _comp._check = new W.Image({x:14, y:15, width:30, height:30, src:"img/kids_radio_dim.png"});
            _comp.add(_comp._check);
            _comp._check_f = new W.Image({x:14, y:15, width:30, height:30, src:"img/kids_radio_dim_f.png", display:"none"});
            _comp.add(_comp._check_f);


            _comp._focus = new W.Div({x:-1, y:-1, width:190+2, height:65, display:"none"});
            _comp._focus.add(new W.Image({x:0, y:0, width:190+2, height:65, src:"img/kids_op_foc.png"}));
            _comp._focus._check = new W.Image({x:15, y:16, width:30, height:30, src:"img/kids_radio_foc.png"});
            _comp._focus.add(_comp._focus._check);
            _comp._focus._check_f = new W.Image({x:15, y:16, width:30, height:30, src:"img/kids_radio_foc_f.png", display:"none"});
            _comp._focus.add(_comp._focus._check_f);
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:56, y:0, width:190-56, height:60, textColor:"#68482E", "font-size":"20px", "letter-spacing":"-1.0px"});
            _comp._text.add(new W.Span({text:data.text, position:"relative", x:0, height:60, lineHeight:"60px", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left"}));
            _comp.add(_comp._text);
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            _comp._text.setStyle({textColor:"#68482E"});
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _comp._text.setStyle({textColor:"#FFFFFF"});
        };

        var unSelected = function() {
            _comp._check_f.setDisplay("none");
            _comp._focus._check_f.setDisplay("none");
        };

        var setSelected = function() {
            _comp._check_f.setDisplay("block");
            _comp._focus._check_f.setDisplay("block");
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
    return SelectBox;
});