/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box", "comp/setting/InputBox"], function(util, Templete, Button, Box, InputBox) {
    function TVPowerControl() {
        var _this = this;

        var mode = 0;

        var index = [0,0,0];
        var btnIndex = 0;
        var selectedIndex = [0,0,0];
        var boxIndex = 0;
        var _comp;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
            W.CloudManager.addNumericKey();
        	changeMode(MODE_TYPE.BOX);
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["tv_power_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[1]);

            _comp.add(new W.Div({text:W.Texts["tv_power_title2"], x:160, y:219, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM",
                "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));

            _this.box = [[],[],[]], _comp._box = [[],[],[]];
            _this.box[0][0] = new Box();
            _comp._box[0][0] = _this.box[0][0].getComp({x:159, y:252, width:144, text:W.Texts["setting"]});
            _comp.add(_comp._box[0][0]);
            _this.box[0][1] = new Box();
            _comp._box[0][1] = _this.box[0][1].getComp({x:309, y:252, width:144, text:W.Texts["no_setting"]});
            _comp.add(_comp._box[0][1]);

            _comp.add(new W.Div({x:159, y:333, width:21, height:1, color:"#837A77", opacity:0.25}));

            _comp._control = new W.Div({});
            _comp.add(_comp._control);
            
            _comp._control.add(new W.Div({text:W.Texts["tv_power_time_on"], x:159, y:359, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM",
                "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
            _comp._control.add(new W.Div({text:W.Texts["tv_power_time_off"], x:429, y:359, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM",
                "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
            _this.box[1][0] = new InputBox();
            _comp._box[1][0] = _this.box[1][0].getComp({x:159, y:392, width:244, type: 1});
            _comp._control.add(_comp._box[1][0]);

            _comp._control.add(new W.Div({text:"~", x:409, y:410, width:500, textColor:"#837A77", opacity:0.75, fontFamily:"RixHeadL", "font-size":"20px",
                textAlign:"left", "letter-spacing":"-0.9px"}));

            _this.box[1][1] = new InputBox();
            _comp._box[1][1] = _this.box[1][1].getComp({x:429, y:392, width:244, type: 1});
            _comp._control.add(_comp._box[1][1]);
            _comp._control.add(new W.Div({text:W.Texts["example"] + ") 22:10", x:160, y:462, width:500, textColor:"#837A77", opacity:0.75, fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"left", "letter-spacing":"-0.8px"}));

            //_comp.add(new W.Div({x:159, y:503, width:21, height:1, color:"#837A77", opacity:0.25}));

            /*_comp.add(new W.Div({text:W.Texts["setting_repeat"], x:160, y:529, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));

            _this.box[2][0] = new Box();
            _comp._box[2][0] = _this.box[2][0].getComp({x:159, y:562, width:144, text:W.Texts["time_restricted_option1"]});
            _comp.add(_comp._box[2][0]);
            _this.box[2][1] = new Box();
            _comp._box[2][1] = _this.box[2][1].getComp({x:309, y:562, width:144, text:W.Texts["time_restricted_option2"]});
            _comp.add(_comp._box[2][1]);*/
        };
        
        var changeMode = function(mod){
        	mode = mod;
        	/*if(mode == MODE_TYPE.BOX){
        		W.CloudManager.addNumericKey();
        	}else{
        		W.CloudManager.delNumericKey();
        	}*/
        };
        
        this.componentName = "TVPowerControl"
        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            if(_data && _data.data) {
                selectedIndex[0] = index[0] = _data.data.option-1;
                if(_data.data.start) _this.box[1][0].setValue(""+_data.data.start);
                if(_data.data.end) _this.box[1][1].setValue(""+_data.data.end);
                if(selectedIndex[0] == 1){
                    _comp._control.setStyle({opacity:0.5});
                }
                //if(_data.data.repeat) selectedIndex[2] = index[2] = _data.data.repeat-1;
            }
            _this.box[0][index[0]].setSelected();
            //_this.box[2][index[0]].setSelected();
            _this.box[boxIndex][index[boxIndex]].setFocus();
        };
        
        function getFullTime(time){
        	var tmp = "";
        	if(time.length == 0){
        		tmp = "0000";
        	}else if(time.length == 1){
        		tmp = "0" + time + "00";
        	}else if(time.length == 2){
        		tmp = time + "00";
        	}else if(time.length == 3){
        		tmp = time + "0";
        	}else{
        		tmp = time;
        	}
        	return tmp;
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index[boxIndex] == 1) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                        	changeMode(MODE_TYPE.BTN);
                            _this.btn[btnIndex].setFocus();
                        } else {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            _this.box[boxIndex][++index[boxIndex]].setFocus();
                        }
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index[boxIndex] != 0) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            _this.box[boxIndex][--index[boxIndex]].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        boxIndex = 0;
                    	changeMode(MODE_TYPE.BOX);
                        _this.box[boxIndex][index[boxIndex]].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex != 0) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            boxIndex--;
                            index[boxIndex] = selectedIndex[boxIndex];
                            _this.box[boxIndex][index[boxIndex]].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex == 0 && selectedIndex[boxIndex] != 0) {
                        } else {
                            if(boxIndex != 1) {
                                _this.box[boxIndex][index[boxIndex]].unFocus();
                                boxIndex++;
                                index[boxIndex] = selectedIndex[boxIndex];
                                _this.box[boxIndex][index[boxIndex]].setFocus();
                            }
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex != 1) {
                            _this.box[boxIndex][selectedIndex[boxIndex]].unSelected();
                            selectedIndex[boxIndex] = index[boxIndex];
                            _this.box[boxIndex][selectedIndex[boxIndex]].setSelected();

                            if(boxIndex == 0) {
                                if(selectedIndex[boxIndex] == 0) {
                                    _this.box[boxIndex][index[boxIndex]].unFocus();
                                    boxIndex++;
                                    index[boxIndex] = selectedIndex[boxIndex];
                                    _this.box[boxIndex][index[boxIndex]].setFocus();
                                    _comp._control.setStyle({opacity:1});
                                } else {
                                    _this.box[boxIndex][index[boxIndex]].unFocus();
                                    changeMode(MODE_TYPE.BTN);
                                    _this.btn[btnIndex].setFocus();
                                    _comp._control.setStyle({opacity:0.5});
                                }
                            }/* else if(boxIndex == 2) {
                                _this.box[boxIndex][index[boxIndex]].unFocus();
                                changeMode(MODE_TYPE.BTN);
                                _this.btn[btnIndex].setFocus();
                            }*/
                        }
                    } else {
                        if(btnIndex == 0) {
                            saveCallback(true, {option : selectedIndex[0]+1, /*repeat : selectedIndex[2]+1,*/ startTime : getFullTime(_this.box[1][0].getValue()), endTime : getFullTime(_this.box[1][1].getValue())});
                            W.CloudManager.delNumericKey();
                        } else {
                            saveCallback(false);
                            W.CloudManager.delNumericKey();
                        }
                    }
                    break;
                case W.KEY.BACK:
                    saveCallback(false);
                    W.CloudManager.delNumericKey();
                    break;
                case W.KEY.EXIT:
                    W.CloudManager.delNumericKey();
                    break;
                case W.KEY.MENU:
                case W.KEY.HOME:
                    W.CloudManager.delNumericKey();
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
                    if(mode ==MODE_TYPE.BOX && boxIndex == 1) {
                        _this.box[boxIndex][index[boxIndex]].inputValue(event.keyCode-48);

                        if(_this.box[boxIndex][index[boxIndex]].getValue().length == 4) {
                            if(index[boxIndex] == 0 ) {
                                _this.box[boxIndex][index[boxIndex]].unFocus();
                                _this.box[boxIndex][++index[boxIndex]].setFocus();
                            } else if(index[boxIndex] == 1) {
                                _this.box[boxIndex][index[boxIndex]].unFocus();
                                changeMode(MODE_TYPE.BTN);
                                _this.btn[btnIndex].setFocus();
                            }
                        }
                    }
                    break;
            }
        }
        this.componentName = "TVPowerControl";
    }
    return TVPowerControl;
});