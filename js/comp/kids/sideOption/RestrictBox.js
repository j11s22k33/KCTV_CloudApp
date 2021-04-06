/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function RestrictBox() {
        var _this = this;

        var _comp;

        var create = function(data){
            W.log.info(data)
            _comp = new W.Div({position:"relative", marginTop:"35px", x:data.x, y:data.y, width:270, height:82});
            _comp.add(new W.Image({x:0, y:0, width:270, height:82, src:"img/kids_op_bt2.png"}));
            _comp._focus = new W.Image({x:0, y:0, width:270, height:82, src:"img/kids_op_bt2_f.png", display:"none"});
            _comp.add(_comp._focus);

            if(data.type == RestrictBox.TYPE.NONE) {
                _comp._text = new W.Div({x:0, y:0, width:270, height:82, "font-size":"22px", textColor:"#000000", "letter-spacing":"-1.1px"});
                _comp._text._span1 = new W.Span({text:W.Texts["limit_watch_setting"], width:270, height:58, lineHeight:"82px",
                    fontFamily:"RixHeadM", textAlign:"center"});
                _comp._text.add(_comp._text._span1);
                _comp.add(_comp._text);
            } else if(data.type == RestrictBox.TYPE.VOD) {
                _comp._text = new W.Div({x:0, y:0, width:270, height:82});
                _comp._text._span1 = new W.Span({y:15, text:W.Texts["change_watch_limit_count"], textColor:"#333333", width:270, height:20, lineHeight:"20px",
                    "font-size":"18px", fontFamily:"RixHeadM", textAlign:"center", "letter-spacing":"-0.9px"});
                _comp._text.add(_comp._text._span1);
                _comp._text._span2 = new W.Span({y:38, text:data.option + W.Texts["unit_vod"] + " " + W.Texts["can_watch"],
                    textColor:"#000000", width:270, height:30, lineHeight:"30px",
                    "font-size":"22px", fontFamily:"RixHeadM", textAlign:"center", "letter-spacing":"-1.1px"});
                _comp._text.add(_comp._text._span2);
                _comp.add(_comp._text);
            } else if(data.type == RestrictBox.TYPE.TIME) {
                _comp._text = new W.Div({x:0, y:0, width:270, height:82});
                _comp._text._span1 = new W.Span({y:15, text:W.Texts["limit_watch_time"], textColor:"#333333", width:270, height:20, lineHeight:"20px",
                    "font-size":"18px", fontFamily:"RixHeadM", textAlign:"center", "letter-spacing":"-0.9px"});
                _comp._text.add(_comp._text._span1);
                _comp._text._span2 = new W.Span({y:38, text:data.option+W.Texts["minute"], textColor:"#000000", width:270, height:30, lineHeight:"30px",
                    "font-size":"22px", fontFamily:"RixHeadM", textAlign:"center", "letter-spacing":"-1.1px"});
                _comp._text.add(_comp._text._span2);
                _comp.add(_comp._text);
            }

        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            if(_comp._text._span1) _comp._text._span1.setStyle({textColor:"#333333"});
            if(_comp._text._span2) _comp._text._span2.setStyle({textColor:"#000000"});
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            if(_comp._text._span1) _comp._text._span1.setStyle({textColor:"#FFFFFF"});
            if(_comp._text._span2) _comp._text._span2.setStyle({textColor:"#FFFFFF"});
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
    RestrictBox.TYPE = Object.freeze({NONE:0, VOD:1, TIME:2});
    return RestrictBox;
});