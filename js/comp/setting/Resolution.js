/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function Resolution() {
        var _this = this;

        var mode = 0;

        var index = [0,0,0];
        var btnIndex = 0;
        var selectedIndex = [0,0,0];
        var selectedBoxIndex = 0;
        var boxIndex = 0;
        var _comp;

        var data;

        var oldResolutionIndex = 0;
        var resolutionIndex = 0;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["resolution_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[1]);

            _comp.add(new W.Div({text:"UHD", x:160, y:229, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
            _this.box = [[],[],[]], _comp._box = [[],[],[]];
            _this.box[0][0] = new Box();
            _comp._box[0][0] = _this.box[0][0].getComp({x:159, y:262, width:244, text:W.Texts["auto"]});
            _comp.add(_comp._box[0][0]);
            /*_this.box[0][1] = new Box();
            _comp._box[0][1] = _this.box[0][1].getComp({x:409, y:262, width:244, text:W.Texts["show_not"]});
            _comp.add(_comp._box[0][1]);*/

            _comp.add(new W.Div({x:159, y:348, width:21, height:1, color:"#837A77", opacity:0.25}));

            _comp.add(new W.Div({text:"HD TV", x:161, y:379, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
            _this.box[1][0] = new Box();
            _comp._box[1][0] = _this.box[1][0].getComp({x:159, y:412, width:144, text:"720p"});
            _comp.add(_comp._box[1][0]);
            _this.box[1][1] = new Box();
            _comp._box[1][1] = _this.box[1][1].getComp({x:309, y:412, width:144, text:"1080i"});
            _comp.add(_comp._box[1][1]);
            _this.box[1][2] = new Box();
            _comp._box[1][2] = _this.box[1][2].getComp({x:459, y:412, width:144, text:"1080p"});
            _comp.add(_comp._box[1][2]);

            _comp.add(new W.Div({x:159, y:498, width:21, height:1, color:"#837A77", opacity:0.25}));

            _comp.add(new W.Div({text:"4K UHD TV", x:160, y:529, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
            _this.box[2][0] = new Box();
            _comp._box[2][0] = _this.box[2][0].getComp({x:159, y:562, width:244, text:"2160p(30fps)"});
            _comp.add(_comp._box[2][0]);
            _this.box[2][1] = new Box();
            _comp._box[2][1] = _this.box[2][1].getComp({x:409, y:562, width:244, text:"2160p(60fps)"});
            _comp.add(_comp._box[2][1]);
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            if(_data && _data.data) {
                oldResolutionIndex = _data.data;
                if(_data.data == 1) {
                    selectedBoxIndex = boxIndex = 0;
                    selectedIndex[0] = index[0] = 0;
                } else if(_data.data < 5) {
                    selectedBoxIndex = boxIndex  = 1;
                    selectedIndex[1] = index[1] = _data.data - 2;
                } else {
                    selectedBoxIndex = boxIndex  = 2;
                    selectedIndex[2] = index[2] = _data.data - 5;
                }
            }

            _this.box[selectedBoxIndex][selectedIndex[selectedBoxIndex]].setSelected();
            _this.box[boxIndex][index[boxIndex]].setFocus();
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index[boxIndex] == (boxIndex==1?2:boxIndex)) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            mode = MODE_TYPE.BTN;
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
                        mode = MODE_TYPE.BOX;
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
                        if(boxIndex != 2) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            boxIndex++;
                            index[boxIndex] = selectedIndex[boxIndex];
                            _this.box[boxIndex][index[boxIndex]].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[selectedBoxIndex][selectedIndex[selectedBoxIndex]].unSelected();
                        selectedIndex[boxIndex] = index[boxIndex];
                        selectedBoxIndex = boxIndex;
                        _this.box[boxIndex][selectedIndex[boxIndex]].setSelected();

                        _this.box[boxIndex][index[boxIndex]].unFocus();
                        mode = MODE_TYPE.BTN;
                        _this.btn[btnIndex].setFocus();
                    } else {
                        if(selectedBoxIndex == 0) {
                            resolutionIndex = 1;
                        } else if(selectedBoxIndex == 1) {
                            resolutionIndex = selectedIndex[1]+2;
                        } else {
                            resolutionIndex = selectedIndex[2]+5;
                        }

                        if(btnIndex == 0) {
                            if(oldResolutionIndex == resolutionIndex) {
                                saveCallback(true, resolutionIndex);
                            } else if(resolutionIndex > 3) {
                                var popup = {
                                    popupName:"popup/setting/ResolutionConfirmPopup",
                                    type:resolutionIndex == 4 ? "1080P":"UHD",
                                    childComp:_this
                                };
                                W.PopupManager.openPopup(popup);
                            } else {
                                _this.changeResolution(function() {
                                    saveCallback(true, resolutionIndex);
                                }, resolutionIndex);
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
                    break;
            }

        }

        this.onPopupClosed = function(popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/setting/ResolutionConfirmPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        _this.changeResolution(function() {
                            var popup = {
                                popupName:"popup/setting/ResolutionCountPopup",
                                childComp:_this
                            };
                            W.PopupManager.openPopup(popup);
                        }, resolutionIndex);
                    } else {

                    }
                } else if (desc.popupName == "popup/setting/ResolutionCountPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        saveCallback(true, resolutionIndex);
                    } else {
                        _this.changeResolution(function() {

                        }, oldResolutionIndex);
                    }
                }
            }
        };

        this.changeResolution = function(callback, _idx) {
            var callback = callback;
            W.CloudManager.setResolution(function(result) {
                if(callback) callback();
            }, _idx);

        };
        this.componentName = "Resolution";
    }
    return Resolution;
});