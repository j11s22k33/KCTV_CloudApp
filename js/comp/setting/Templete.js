/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function Templete() {
        var _this = this;

        var _comp;

        var create = function(data){
            _comp = new W.Div({x:158, y:110, width:965, height:480});
            _comp.add(new W.Div({text:data.title, x:0, y:0, width:965, textColor:"rgba(237,168,2,1)", fontFamily:"RixHeadM", "font-size":"34px",
                textAlign:"left", "letter-spacing":"-1.7px"}));
            _comp.add(new W.Div({text:data.desc, x:0, y:158-110, width:965, textColor:"rgba(181,181,181,0.6)", fontFamily:"RixHeadL", "font-size":"18px",
                textAlign:"left", "letter-spacing":"-0.8px"}));
            _comp.add(new W.Div({x:159-158, y:188-110, width:964, height:3, color:"rgba(40,40,40,1)"}));
            _comp.add(new W.Div({x:949-158, y:227-110, width:1, height:391, color:"rgba(40,40,40,1)"}));
        };

        this.getComp = function(_data) {
            if(!_comp) create(_data);
            return _comp;
        };
    }
    return Templete;
});