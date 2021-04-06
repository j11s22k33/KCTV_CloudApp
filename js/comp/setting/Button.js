/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule("comp/setting/Button", ["mod/Util"], function(util) {
    function Button() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({x:data.x, y:data.y, width:123, height:41});
            _comp._normal = new W.Div({x:0, y:0, width:123, height:41});
            _comp._normal.add(new W.Image({x:0, width:20, height:41, src:"img/btn_l.png"}));
            _comp._normal.add(new W.Image({x:20, width:83, height:41, src:"img/btn_m.png"}));
            _comp._normal.add(new W.Image({x:103, width:20, height:41, src:"img/btn_r.png"}));
            _comp._normal._text = new W.Div({text:data.text, x:0, y:0, width:123, height:41, lineHeight:"41px", textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadM",
                "font-size":data.fontSize ? data.fontSize+"px":"18px", textAlign:"center", "letter-spacing":"-0.8px"});
            _comp._normal.add(_comp._normal._text);
            _comp.add(_comp._normal);
            _comp._focus = new W.Div({x:0, y:0, width:123, height:41, display:"none"});
            _comp._focus.add(new W.Image({x:0, width:20, height:41, src:"img/btn_l_f.png"}));
            _comp._focus.add(new W.Image({x:20, width:83, height:41, src:"img/btn_m_f.png"}));
            _comp._focus.add(new W.Image({x:103, width:20, height:41, src:"img/btn_r_f.png"}));
            _comp._focus._text = new W.Div({text:data.text, x:0, y:0, width:123, height:41, lineHeight:"41px", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM",
                "font-size":data.fontSize ? data.fontSize+"px":"18px", textAlign:"center", "letter-spacing":"-0.8px"});
            _comp._focus.add(_comp._focus._text);
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

        var disable = function() {
            _comp.setStyle({opacity:0.4});
        };

        var enable = function() {
            _comp.setStyle({opacity:1});
        };

        this.setFocus = function() {
            setFocus();
        };

        this.unFocus = function() {
            unFocus();
        };

        this.disable = function() {
            disable();
        };

        this.enable = function() {
            enable();
        };

        this.setText = function(_text) {
            _comp._normal._text.setText(_text);
            _comp._focus._text.setText(_text);
        }

        this.getComp = function(_data) {
            if(!_comp) create(_data);
            return _comp;
        };
    }
    return Button;
});