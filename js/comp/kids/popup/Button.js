/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function Button() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({x:data.x, y:data.y, width:162, height:51});
            _comp._normal = new W.Div({x:0, y:0, width:162, height:51});
            _comp._normal.add(new W.Image({x:0, width:162, height:51, src:"img/kids_pop_bt.png"}));
            _comp._normal.add(new W.Div({text:data.text, x:0, y:0, width:162, height:46, lineHeight:"47px", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM",
                "font-size":"19px", textAlign:"center", "letter-spacing":"-0.95px"}));
            _comp.add(_comp._normal);
            _comp._focus = new W.Div({x:0, y:0, width:167, height:57, display:"none"});
            _comp._focus.add(new W.Image({x:0, width:167, height:57, src:"img/kids_pop_bt_f.png"}));
            _comp._focus.add(new W.Div({text:data.text, x:0, y:0, width:162, height:46, lineHeight:"47px", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM",
                "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"}));
            _comp.add(_comp._focus);
        };

        var unFocus = function() {
            _comp._normal.setDisplay("block");
            _comp._focus.setDisplay("none");
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _comp._normal.setDisplay("none");
        };

        this.setFocus = function() {
            setFocus();
        };

        this.unFocus = function() {
            unFocus();
        };

        this.getComp = function(_data) {
            if(!_comp) create(_data);
            return _comp;
        };
    }
    return Button;
});