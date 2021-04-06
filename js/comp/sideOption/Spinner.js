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

            _comp = new W.Div({position:"relative", marginTop:"8px", x:data.x, y:data.y, width:244, height:56});
            _comp.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_popup244.png"}));
            _comp._focus = new W.Image({x:-1, y:-1, width:246, height:58, src:"img/box_popup244_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._text = new W.Div({x:0, y:0, width:244, height:56, "font-size":"18px", textColor:"#FFFFFF", "letter-spacing":"-0.9px", opacity:0.75,
                text:data.option[data.index], lineHeight:"56px", fontFamily:"RixHeadL", textAlign:"center"});
            _comp.add(_comp._text);

            _comp._arr = new W.Image({x:214, y:24, width:11, height:9, src:"img/box_arr_d.png"});
            _comp.add(_comp._arr);
            _comp._arr_f = new W.Image({x:214, y:24, width:11, height:9, src:"img/box_f_arr_d.png", display:"none"});
            _comp.add(_comp._arr_f);

            _comp._spinnerDiv = new W.Div({x:data.x-1, y:data.y-1, width:246, maxHeight:56*4+2+"px", display:"none", zIndex:3, overflow:"hidden",
                                            backgroundImage:"url('img/box_dropdown_m.png')", backgroundPosition:"1px 1px"});
            _comp._spinnerDiv._inner = new W.Div({x:1, y:1, width:244, position:"relative"});
            _comp._spinnerBg = new W.Div({position:"fixed", x:940, y:0, width:340, height:720, color:"rgba(28,28,28,0.3)", zIndex:2});
            _comp._spinnerDiv.add(_comp._spinnerBg);

            _this.box = [];
            _comp._box = [];
            for(var i = 0; i < data.option.length; i++) {
                _this.box[i] = new Box();
                _comp._box[i] = _this.box[i].getComp({text:data.option[i], bottomLine: i%4==3 ? false : true, isLast: i == data.option.length-1 ? true : false});
                _comp._spinnerDiv._inner.add(_comp._box[i]);
            }

            _comp._spinnerDiv.add(_comp._spinnerDiv._inner);
            _comp._spinnerDiv.add(new W.Image({x:1, y:1, width:244, height:2, src:"img/box_dropdown_edge.png"}));
            _comp._spinnerDiv.add(new W.Image({x:1, bottom:"1px", width:244, height:2, src:"img/box_dropdown_edge.png"}));
            _comp.add(_comp._spinnerDiv);

            _comp._spinnerDiv._scroll = new W.Div({x:1214-980, y:260-253, width:3, height:213, display:"none"});
            _comp._spinnerDiv._scroll._bg = new W.Div({x:1, y:0, color:"rgba(131,122,119,0.25)", width:1, height:213});
            _comp._spinnerDiv._scroll.add(_comp._spinnerDiv._scroll._bg);
            _comp._spinnerDiv._scroll._bar = new W.Div({x:0, y:0, color:"rgba(131,122,119,1)", width:3, zIndex:4});
            _comp._spinnerDiv._scroll.add(_comp._spinnerDiv._scroll._bar);
            _comp._spinnerDiv.add(_comp._spinnerDiv._scroll);

            if(data.option.length > 4) {
                _comp._spinnerDiv._inner.setY(-(56*4) * Math.floor(index/4)+1);
                _comp._spinnerDiv._scroll._bar.setY(213/(Math.floor(data.option.length/4)+1) * Math.floor(index/4));
                _comp._spinnerDiv._scroll._bar.setStyle({height:213/(Math.floor(data.option.length/4)+1)});
                _comp._spinnerDiv._scroll.setDisplay("");
            }

            _this.box[selectedIndex].setSelected();
            _this.box[index].setFocus();
        };

        var unFocus = function() {
            _comp._focus.setDisplay("none");
            _comp._arr.setDisplay("block");
            _comp._arr_f.setDisplay("none");
            _comp._text.setStyle({textColor:"#B5B5B5", opacity:0.75});
        };

        var setFocus = function() {
            _comp._focus.setDisplay("block");
            _comp._arr.setDisplay("none");
            _comp._arr_f.setDisplay("block");
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
                        _comp._spinnerDiv._inner.setY(-(56*4) * Math.floor(index/4)+1);
                        _comp._spinnerDiv._scroll._bar.setY(213/(Math.floor(_this.data.option.length/4)+1) * Math.floor(index/4));
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
                        _comp._spinnerDiv._inner.setY(-(56*4) * Math.floor(index/4)+1);
                        _comp._spinnerDiv._scroll._bar.setY(213/(Math.floor(_this.data.option.length/4)+1) * Math.floor(index/4));
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
                            _this.data.parentName.setStyle({zIndex:""});
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
                        _this.data.parentName.setStyle({zIndex:4});
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
                        _comp._spinnerDiv._inner.setY(-(56*4) * Math.floor(index/4)+1);
                        _comp._spinnerDiv._scroll._bar.setY(213/(Math.floor(_this.data.option.length/4)+1) * Math.floor(index/4));

                        _comp._spinnerDiv.setStyle({display:"none"});
                        _this.data.parentName.setStyle({zIndex:""});
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
                _comp = new W.Div({position:"relative", x:data.x, y:data.y, width:244, height:data.isLast ? 58 : 56});
                //_comp.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_dropdown_m.png"}));

                if(data.bottomLine) {
                    _comp.add(new W.Div({x:15, y:55, width:214, height:1, color:"rgba(255,255,255,0.07)"}));
                }
                _comp._focus = new W.Image({x:-1, y:-1, width:246, height:58, src:"img/box_popup244_f.png", display:"none", zIndex:3});
                _comp.add(_comp._focus);

                _comp._text = new W.Div({x:43, y:0, width:244-43, height:56, "font-size":"18px", textColor:"#B5B5B5", "letter-spacing":"-0.9px", opacity:0.75});
                _comp._text.add(new W.Span({text:data.text, position:"relative", height:56, lineHeight:"56px", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left"}));
                _comp.add(_comp._text);

                _comp._radio = new W.Image({x:14, y:17, width:22, height:22, src:"img/radio_n.png"});
                _comp.add(_comp._radio);
                _comp._radio_f = new W.Image({x:14, y:17, width:22, height:22, src:"img/radio_f.png", display:"none"});
                _comp.add(_comp._radio_f);
            };

            var unFocus = function() {
                _comp._focus.setDisplay("none");
                _comp._text.setStyle({textColor:"#FFFFFF", opacity:0.75});
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
    }
    return Spinner;
});