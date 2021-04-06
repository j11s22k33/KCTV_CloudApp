/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util"], function(util) {
    function Spinner() {
        var _this = this;

        var _comp;
        var isSpinnerMode = false;

        var index, selectedIndex;

        var create = function(data){
            _this.data = data;
            index = data.index;
            selectedIndex = data.index;

            _comp = new W.Div({position:"relative", marginTop:"8px", x:data.x, y:data.y, width:270, height:58});
            _comp.add(new W.Image({x:0, y:0, width:270, height:58, src:"img/kids_op_bt_ar.png"}));
            _comp._focus = new W.Image({x:0, y:0, width:270, height:58, src:"img/kids_op_bt_ar_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:0, y:0, width:270, height:58, "font-size":"20px", textColor:"#000000", "letter-spacing":"-1.1px",
                text:data.option[data.index], lineHeight:"58px", fontFamily:"RixHeadM", textAlign:"center"});
            _comp.add(_comp._text);

            _comp._spinnerDiv = new W.Div({x:-4, y:-4, width:284, height:data.option.length*58+4, display:"none", zIndex:2});
            //_comp._spinnerDiv.add(new W.Div({position:"fixed", x:940, y:0, width:340, height:720, color:"rgba(28,28,28,0.3)"}));

            _comp._spinnerDiv.add(new W.Div({x:0, y:30, width:284, height:data.option.length*58-52,
                backgroundImage:"url('img/kids_op_bt_drop_m.png')"}));

            _comp._spinnerDiv.add(new W.Image({x:0, y:0, width:284, height:30, src:"img/kids_op_bt_drop_t.png"}));
            _comp._spinnerDiv.add(new W.Image({x:0, bottom:"-14px", width:284, height:40, src:"img/kids_op_bt_drop_b.png"}));

            _this.box = [];
            _comp._box = [];
            for(var i = 0; i < data.option.length; i++) {
                _this.box[i] = new Box();
                _comp._box[i] = _this.box[i].getComp({text:data.option[i], bottomLine: i == data.option.length-1 ? false : true});
                _comp._spinnerDiv.add(_comp._box[i]);
            }

            _comp.add(_comp._spinnerDiv);

            _this.box[selectedIndex].setSelected();
            _this.box[index].setFocus();
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            _comp._text.setStyle({textColor:"#000000", opacity:1});
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

        this.isSpinnerMode = function() {
            return isSpinnerMode;
        }

        this.getValue = function() {
            return selectedIndex;
        }

        this.componentName = "Spinner";
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                    return true;
                    break;
                case W.KEY.UP:
                    if(isSpinnerMode) {
                        _this.box[index].unFocus();
                        if(index == 0) {
                            index = _this.box.length-1;
                        } else {
                            index--;
                        }
                        _this.box[index].setFocus();
                    }
                    return true;
                    break;
                case W.KEY.DOWN:
                    if(isSpinnerMode) {
                        _this.box[index].unFocus();
                        if(index == _this.box.length-1) {
                            index = 0;
                        } else {
                            index++;
                        }
                        _this.box[index].setFocus();
                    }
                    return true;
                    break;
                case W.KEY.ENTER:
                    if(isSpinnerMode) {
                        _this.box[selectedIndex].unSelected();
                        if(selectedIndex == index) {
                            selectedIndex = index;
                            _this.box[selectedIndex].setSelected();
                            _this.box[index].unFocus();

                            _comp._text.setText(_this.data.option[selectedIndex]);

                            isSpinnerMode = false;
                            _comp._spinnerDiv.setStyle({display:"none"});
                            _comp._focus.setStyle({display:"block"});

                            return true;
                        } else {
                            selectedIndex = index;
                            return false;
                        }
                    } else {
                        isSpinnerMode = true;
                        _this.box[index].setFocus();
                        _comp._spinnerDiv.setStyle({display:"block"});
                        _comp._focus.setStyle({display:"none"});

                        return true;
                    }
                    break;
                case W.KEY.BACK:
                    if(isSpinnerMode) {
                        _this.box[selectedIndex].setSelected();
                        _this.box[index].unFocus();

                        isSpinnerMode = false;
                        index = selectedIndex;

                        _comp._spinnerDiv.setStyle({display:"none"});
                        _comp._focus.setStyle({display:"block"});

                        return true;
                    }
                    return true;
                    break;
                case W.KEY.EXIT:
                    break;
                    return true;
            }
        }

        function Box() {
            var _this = this;

            var _comp;

            var create = function(data){
                _comp = new W.Div({position:"relative", x:4, y:4, width:270, height:58});
                //_comp.add(new W.Image({x:-4, y:0, width:270, height:58, src:"img/kids_op_bt_drop_m.png"}));

                if(data.bottomLine) {
                    _comp.add(new W.Div({x:9, y:56, width:251, height:1, color:"rgba(255,255,255,0.1)"}));
                    _comp.add(new W.Div({x:9, y:57, width:251, height:1, color:"rgba(0,0,0,0.1)"}));
                }
                _comp._focus = new W.Image({x:0, y:0, width:270, height:58, src:"img/kids_op_bt_f.png", display:"none"});
                _comp.add(_comp._focus);

                _comp._text = new W.Div({x:0, y:0, width:270, height:58, "font-size":"22px", textColor:"#000000", "letter-spacing":"-1.1px", opacity:1});
                _comp._text.add(new W.Span({text:data.text, width:270, height:58, lineHeight:"58px", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"center"}));
                _comp.add(_comp._text);

                //_comp._radio = new W.Image({x:14, y:17, width:22, height:22, src:"img/kids_op_bt_check_d.png"});
                //_comp.add(_comp._radio);
                _comp._radio_f = new W.Image({x:223, y:18, width:24, height:20, src:"img/kids_op_bt_check_d.png", display:"none"});
                _comp.add(_comp._radio_f);
            };

            var unFocus = function() {
                _comp._focus.setDisplay("none");
                _comp._text.setStyle({textColor:"#000000", opacity:1});
                _comp._radio_f.setStyle({src:"img/kids_op_bt_check_d.png"});
            };

            var setFocus = function() {
                _comp._focus.setDisplay("block");
                _comp._text.setStyle({textColor:"#FFFFFF", opacity:1});
                _comp._radio_f.setStyle({src:"img/kids_op_bt_check.png"});
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
    }
    return Spinner;
});