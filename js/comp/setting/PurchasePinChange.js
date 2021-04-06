/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/InputBox"], function(util, Templete, Button, InputBox) {
    function PurchasePinChange() {
        var _this = this;

        var mode = 0;

        var btnIndex = 1;
        var boxIndex = 0;
        var _comp;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
        	changeMode(MODE_TYPE.BOX);
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["pin_change_purchase_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[1]);

            _comp._guide = new W.Div({text:W.Texts["pin_insert_guide2"], x:159, y:300, width:500, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"});
            _comp.add(_comp._guide);
            _comp.add(new W.Div({text:W.Texts["pin_new_input"], x:159, y:333, width:500, textColor:"#837A77", opacity:0.75, fontFamily:"RixHeadL", "font-size":"16px", textAlign:"left", "letter-spacing":"-0.8px"}));
            _this.box = [], _comp._box = [];
            _this.box[0] = new InputBox();
            _comp._box[0] = _this.box[0].getComp({x:159, y:364, width:244, type: 0});
            _comp.add(_comp._box[0]);

            _comp.add(new W.Div({text:W.Texts["pin_new_confirm"], x:159, y:457, width:500, textColor:"#837A77", opacity:0.75, fontFamily:"RixHeadL", "font-size":"16px", textAlign:"left", "letter-spacing":"-0.8px"}));
            _this.box[1] = new InputBox();
            _comp._box[1] = _this.box[1].getComp({x:159, y:489, width:244, type: 0});
            _comp.add(_comp._box[1]);

            _this.box[0].setFocus();
            _this.btn[0].disable();
        };
        
        var changeMode = function(mod){
            mode = mod;
        	if(mode == MODE_TYPE.BOX){
        		W.CloudManager.addNumericKey();
        	}else{
        		W.CloudManager.delNumericKey();
        	}
        };
        
        this.componentName = "PurchasePinChange";
        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setOldPIN = function(_oldPIN) {
            _this.oldPIN = _oldPIN;
        }

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[boxIndex].unFocus();
                        changeMode(MODE_TYPE.BTN);
                        if(_this.box[0].getValue().length == 4 && _this.box[1].getValue().length == 4) {
                            btnIndex = 0;
                        } else {
                            btnIndex = 1;
                        }
                        _this.btn[btnIndex].setFocus();
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[boxIndex].deleteValue();
                    } else {
                        _this.btn[btnIndex].unFocus();
                        changeMode(MODE_TYPE.BOX);
                        _this.box[boxIndex].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex == 1) {
                            _this.box[boxIndex].unFocus();
                            boxIndex = 0;
                            _this.box[boxIndex].setFocus();
                        }
                    } else {
                        if(_this.box[0].getValue().length == 4 && _this.box[1].getValue().length == 4) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = ++btnIndex%2;
                            _this.btn[btnIndex].setFocus();
                        }
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex == 0 && _this.box[0].getValue().length == 4) {
                            _this.box[boxIndex].unFocus();
                            boxIndex = 1;
                            _this.box[boxIndex].setFocus();
                        }
                    } else {
                        if(_this.box[0].getValue().length == 4 && _this.box[1].getValue().length == 4) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = ++btnIndex%2;
                            _this.btn[btnIndex].setFocus();
                        }
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex == 0) {
                            if(_this.box[0].getValue().length == 4) {
                                _this.box[boxIndex].unFocus();
                                boxIndex = 1;
                                _this.box[boxIndex].setFocus();
                            }
                        } else if(boxIndex == 1) {
                            if(_this.box[0].getValue().length == 4 && _this.box[1].getValue().length == 4) {
                                _this.box[boxIndex].unFocus();
                                btnIndex = 0;
                                changeMode(MODE_TYPE.BTN);
                                _this.btn[btnIndex].setFocus();
                            }
                        }
                    } else {
                        if(btnIndex == 0) {
                            if(_this.box[0].getValue() == _this.box[1].getValue()) {
                                saveCallback(true, {oldPIN:_this.oldPIN, newPIN : _this.box[0].getValue()});
                            } else {
                                _this.box[1].resetValue();
                                _comp._guide.setText(W.Texts["pin_change_input_not_match"]);
                                _this.btn[btnIndex].unFocus();
                                _this.btn[0].disable();
                                boxIndex = 1;
                                changeMode(MODE_TYPE.BOX);
                                _this.box[boxIndex].setFocus();
                            }
                        } else {
                            saveCallback(false);
                        }
                    }
                    break;
                case W.KEY.BACK:
                    saveCallback(false);
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
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[boxIndex].inputValue(event.keyCode-48);
                        if(_this.box[boxIndex].getValue().length == 4) {
                            if(boxIndex == 0) {
                                _this.box[boxIndex].unFocus();
                                boxIndex = 1;
                                _this.box[boxIndex].setFocus();
                            } else if(boxIndex == 1) {
                                _this.box[boxIndex].unFocus();
                                btnIndex = 0;
                                changeMode(MODE_TYPE.BTN);
                                _this.btn[0].enable();
                                _this.btn[btnIndex].setFocus();
                            }
                        } else {
                            _this.btn[0].disable();
                        }
                    }
                    break;
            }
        }
        this.componentName = "PurchasePinChange";
    }
    return PurchasePinChange;
});