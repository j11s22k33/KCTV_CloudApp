/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function InputBox() {
        var _this = this;

        var _comp;

        var create = function(data){
            _this.type = data.type; //0:password 1:time
            _this.value = data.text ? data.text : "";
            _comp = new W.Div({x:data.x, y:data.y, width:244, height:56});
            _comp.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_set244_input.png"}));
            _comp._focus = new W.Image({x:-1, y:-1, width:246, height:56, src:"img/box_set244_f.png", display:"none"});
            _comp.add(_comp._focus);

            if(data.type == 0) _comp._text = new W.Div({x:10, y:0, width:224, height:56, textColor:"#B5B5B5", "font-size":"22px", "letter-spacing":"-1.1px", lineHeight:"56px", fontFamily:"RixHeadEB", textAlign:"center", opacity:0.75});
            else _comp._text = new W.Div({x:10, y:0, width:224, height:56, textColor:"#B5B5B5", "font-size":"18px", "letter-spacing":"-0.9px", lineHeight:"56px", fontFamily:"RixHeadL", textAlign:"center", opacity:0.75});
            _comp.add(_comp._text);

            setText();
            _this.focusedFlag = false;
        };

        var setText = function() {
            if(_this.type == 0) {
                var star = "";
                for(var i = 0; i < _this.value.length; i++) {
                    star += "*";
                }
                _comp._text.setText(star);
            } else {
                var time = _this.value;

                if(_this.value.length < 2) {
                    time = util.changeDigit(_this.value, 2) + "00";
                } else if(_this.value.length == 2) {
                    if(_this.value > 23) {
                        _this.value = "23";
                    }
                    time = _this.value + "00";
                } else if(_this.value.length < 4) {
                    time = _this.value.substr(0,2) + util.changeDigit(_this.value.substr(2,2), 2);
                } else if(_this.value.length == 4) {
                    if(_this.value.substr(2,2) > 59) {
                        _this.value = _this.value.substr(0,2) + "59";
                    }
                    time = _this.value;
                }

                _comp._text.setText(time.substr(0,2) + " : " + time.substr(2,2));
            }
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
            //if(_this.type == 0) {
                if(_this.value.length < 4) {
                    _this.value += data;
                    setText();
                }
           // } else {
            //}
        };

        var deleteValue = function(length) {
            if(_this.value.length > 0) {
                _this.value = _this.value.substr(0, _this.value.length-1);
                setText();
            }
        };

        var resetValue = function() {
            _this.value = _this.type == 0 ? "" : "0000";
            setText();
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            _comp._text.setStyle({textColor:"#B5B5B5", opacity:0.75});
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _comp._text.setStyle({textColor:"#FFFFFF", opacity:1});
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
            if(_this.type == 0) {
                return _this.value;
            } else {
                var time = _this.value;
                /*if(_this.value.length < 4) {
                    for(var i = _this.value.length; i < 4; i++) {
                        time += "0";
                    }
                }*/

                return time;
            }
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