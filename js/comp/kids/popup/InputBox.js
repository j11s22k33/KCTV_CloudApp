/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function InputBox() {
        var _this = this;

        var _comp;

        var create = function(data){
            _this.value = data.text ? data.text : "";
            _comp = new W.Div({x:data.x, y:data.y, width:264, height:60});
            _comp.add(new W.Image({x:0, y:0, width:60, height:60, src:"img/kids_input.png"}));
            _comp.add(new W.Image({x:68, y:0, width:60, height:60, src:"img/kids_input.png"}));
            _comp.add(new W.Image({x:68*2, y:0, width:60, height:60, src:"img/kids_input.png"}));
            _comp.add(new W.Image({x:68*3, y:0, width:60, height:60, src:"img/kids_input.png"}));
            _comp._focus = new W.Image({x:-2, y:-2, width:64, height:64, src:"img/kids_input_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:21, y:19, width:264, height:36, textColor:"#645447", "font-size":"36px", "letter-spacing":"48px", lineHeight:"36px",
                fontFamily:"RixHeadB", textAlign:"left"});
            _comp.add(_comp._text);

            setText();
            _this.focusedFlag = false;
        };

        var setText = function() {
            var star = "";
            for(var i = 0; i < _this.value.length; i++) {
                star += "*";
            }
            _comp._text.setText(star);
            _comp._focus.setStyle({x:68*(_this.value.length > 3 ? 3: _this.value.length)-2});
        };

        var setValue = function(data) {
            _this.value = data;
            setText();
        }

        var inputValue = function(data) {
            if(_this.focusedFlag) {
                _this.value = "";
                _this.focusedFlag = false;
            }
            if(_this.value.length < 4) {
                _this.value += data;
                setText();
            }
        };

        var deleteValue = function(length) {
            if(_this.value.length > 0) {
                _this.value = _this.value.substr(0, _this.value.length-1);
                setText();
            }
        };

        var resetValue = function() {
            _this.value = "";
            setText();
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _this.focusedFlag = true;
        };

        this.setValue = function(_data) {
            setValue(_data);
        };

        this.inputValue = function(_data) {
            inputValue(_data);
        };

        this.deleteValue = function(_length) {
            deleteValue(_length);
        };

        this.resetValue = function() {
            resetValue();
        };

        this.getValue = function() {
            return _this.value;
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
    return InputBox;
});