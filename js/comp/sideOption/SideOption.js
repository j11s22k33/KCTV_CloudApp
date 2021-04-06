W.defineModule(["mod/Util", "comp/sideOption/Box", "comp/sideOption/Button", "comp/sideOption/InputBox", "comp/sideOption/Spinner"],
    function(util, Box, Button, InputBox, Spinner) {
    function SideOption(_param) {
        var _this = this;

        var mode = 0;
        var type;

        var optionIndex = 0;
        var subOptionIndex = 0;
        var _comp;

        var data;

        var MODE_TYPE = Object.freeze({POSTER:0, BANNER:1});

        var closeCallback;

        var create = function(){
            W.log.info(_param)
            type = _param.type;
            data = _param.data;
            closeCallback = _param.callback;

            _comp = new W.Div({width:340, height:720, color:"rgba(59,59,59,1)", zIndex:3});
            _comp.add(new W.Div({x:0, y:0, width:1, height:720, color:"rgba(131,122,199,0.25)", zIndex:4}));
            _comp.add(new W.Image({x:-72, y:0, width:72, height:720, src:"img/sh_sidemenu_m.png"}));

            _comp.optionArea = new W.Div({x:40, y:0, width:244, height:720});
            _comp.add(_comp.optionArea);

            _this.options = [];
            _comp._options = [];

            for(var i = 0; i < data.options.length; i++) {

                _this.options[i] = {};
                _comp._options[i] = {};
                if(data.options[i].name) {
                    _comp._options[i]._name = new W.Div({position:"relative", width:244, height:16, "margin-top":"40px",text:data.options[i].name, lineHeight:"16px",
                        textColor:"rgba(181,181,181,0.75)", fontFamily:"RixHeadM", "font-size":"16px", "letter-spacing":"-0.8px", className:"cut"});
                    _comp.optionArea.add(_comp._options[i]._name);
                } else {
                    _comp._options[i]._name = new W.Div({position:"relative", width:244, height:32});
                    _comp.optionArea.add(_comp._options[i]._name);
                }

                _this.options[i].subOptions = [];
                _comp._options[i]._subOptions = [];
                for(var j = 0; j < data.options[i].subOptions.length; j++) {

                    if(data.options[i].subOptions[j].type == "box") {
                        _this.options[i].subOptions[j] = new Box();
                        _comp._options[i]._subOptions[j] = _this.options[i].subOptions[j].getComp({text:data.options[i].subOptions[j].name});
                        _comp.optionArea.add(_comp._options[i]._subOptions[j]);
                    } else if(data.options[i].subOptions[j].type == "spinner") {
                        _this.options[i].subOptions[j] = new Spinner();
                        _comp._options[i]._subOptions[j] = _this.options[i].subOptions[j].getComp({index:data.options[i].subOptions[j].index,
                            option : data.options[i].subOptions[j].options, parentName : _comp._options[i]._name});
                        _comp.optionArea.add(_comp._options[i]._subOptions[j]);
                    } else if(data.options[i].subOptions[j].type == "inputBox") {
                        _this.options[i].subOptions[j] = new InputBox();
                        _comp._options[i]._subOptions[j] = _this.options[i].subOptions[j].getComp({episodeList:data.options[i].subOptions[j].episodeList, button:data.options[i].subOptions[j].button});
                        _comp.optionArea.add(_comp._options[i]._subOptions[j]);

                    }

                }
            }
            _this.options[optionIndex].subOptions[subOptionIndex].setFocus();
        };

        var unFocus = function(_optionIndex, _subOptionIndex) {
            _this.options[_optionIndex].subOptions[_subOptionIndex].unFocus();
        };

        var setFocus = function(_optionIndex, _subOptionIndex, _from) {
            _this.options[_optionIndex].subOptions[_subOptionIndex].setFocus(_from);
        };

        this.setFocus = function(_optionIndex, _subOptionIndex, _from) {
            setFocus(_optionIndex, _subOptionIndex, _from);
        };

        this.unFocus = function(_optionIndex, _subOptionIndex) {
            unFocus(_optionIndex, _subOptionIndex);
        };

        this.getComp = function() {
            if(!_comp) create();
            return _comp;
        };
        this.componentName = "SideOption";
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            if(data.options[optionIndex].subOptions[subOptionIndex].type == "spinner") {
                if(_this.options[optionIndex].subOptions[subOptionIndex].isSpinnerMode()) {
                    if(_this.options[optionIndex].subOptions[subOptionIndex].operate(event)) {
                        return true;
                    } else {
                        closeCallback(true, {option:optionIndex, subOptions:subOptionIndex, value:_this.options[optionIndex].subOptions[subOptionIndex].getValue(), param:data.options[optionIndex].param});
                        return false;
                    }
                }
            }

            switch (event.keyCode) {
                case W.KEY.LEFT:
                case W.KEY.DELETE:
                    if(data.options[optionIndex].subOptions[subOptionIndex].type == "inputBox") {
                        if(!_this.options[optionIndex].subOptions[subOptionIndex].isOnButton()) {
                            _this.options[optionIndex].subOptions[subOptionIndex].deleteValue(1);
                        }
                    }
                    break;
                case W.KEY.UP:
                    if(data.options[optionIndex].subOptions[subOptionIndex].type == "inputBox") {
                        if(_this.options[optionIndex].subOptions[subOptionIndex].operate(event)) {
                            return true;
                        }
                    }
                    unFocus(optionIndex, subOptionIndex);
                    if(subOptionIndex == 0) {
                        if(optionIndex == 0) {
                            optionIndex = _this.options.length-1;
                            subOptionIndex = _this.options[optionIndex].subOptions.length-1;
                        } else {
                            optionIndex--;
                            subOptionIndex = _this.options[optionIndex].subOptions.length-1;
                        }
                    } else {
                        subOptionIndex--;
                    }
                    setFocus(optionIndex, subOptionIndex, "UP");
                    break;
                case W.KEY.DOWN:
                    if(data.options[optionIndex].subOptions[subOptionIndex].type == "inputBox") {
                        if(_this.options[optionIndex].subOptions[subOptionIndex].operate(event)) {
                            return true;
                        }
                    }
                    unFocus(optionIndex, subOptionIndex);
                    if(_this.options[optionIndex].subOptions.length-1 == subOptionIndex) {
                        if(_this.options.length-1 == optionIndex) {
                            optionIndex = 0;
                            subOptionIndex = 0;
                        } else {
                            optionIndex++;
                            subOptionIndex = 0;
                        }
                    } else {
                        subOptionIndex++;
                    }
                    setFocus(optionIndex, subOptionIndex, "DOWN");
                    break;
                case W.KEY.ENTER:
                    if(data.options[optionIndex].subOptions[subOptionIndex].type == "spinner") {
                        if(!_this.options[optionIndex].subOptions[subOptionIndex].isSpinnerMode()) {
                            if(_this.options[optionIndex].subOptions[subOptionIndex].operate(event)){
                                return true;
                            };
                            return true;
                        }
                    } else if(data.options[optionIndex].subOptions[subOptionIndex].type == "inputBox") {
                        if(_this.options[optionIndex].subOptions[subOptionIndex].operate(event)) {
                            return true;
                        } else {
                            closeCallback(true, {option:optionIndex, subOptions:subOptionIndex, value:_this.options[optionIndex].subOptions[subOptionIndex].getValue(), param:data.options[optionIndex].param});
                        }
                    } else {
                        closeCallback(true, {option:optionIndex, subOptions:subOptionIndex, param:data.options[optionIndex].param});
                    }
                    break;
                case W.KEY.BACK:
                    closeCallback(false);
                    break;
                case W.KEY.EXIT:
                    break;
                case W.KEY.MENU:
                case W.KEY.HOME:
                    break;
                case W.KEY.NUM_0:
                case W.KEY.NUM_1:
                case W.KEY.NUM_2:
                case W.KEY.NUM_3:
                case W.KEY.NUM_4:
                case W.KEY.NUM_5:
                case W.KEY.NUM_6:
                case W.KEY.NUM_7:
                case W.KEY.NUM_8:
                case W.KEY.NUM_9:
                    if(data.options[optionIndex].subOptions[subOptionIndex].type == "inputBox") {
                        if(!_this.options[optionIndex].subOptions[subOptionIndex].isOnButton()) {
                            _this.options[optionIndex].subOptions[subOptionIndex].inputValue(event.keyCode-48);
                        }
                    }
                    break;
            }

        }
    }
    SideOption.TYPE = Object.freeze({MOVIE:0, SEARCH:1, PLAYLIST:2, PURCHASE:3, WATCHEDLIST:4, GUIDE:5});
    return SideOption;
});