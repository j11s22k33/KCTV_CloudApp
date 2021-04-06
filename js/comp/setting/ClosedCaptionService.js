/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function ClosedCaptionService() {
        var _this = this;

        var mode = 0;

        var index = 0;
        var btnIndex = 0;
        var selectedIndex = 0;
        var _comp;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["closed_caption_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[1]);

            _this.box = [], _comp._box = [];
            _this.box[0] = new Box();
            _comp._box[0] = _this.box[0].getComp({x:159, y:325, width:244, text:W.Texts["use_not"]});
            _comp.add(_comp._box[0]);
            _this.box[1] = new Box();
            _comp._box[1] = _this.box[1].getComp({x:409, y:325, width:244, text:W.Texts["closed_caption_digital"] + " 1"});
            _comp.add(_comp._box[1]);
            _this.box[2] = new Box();
            _comp._box[2] = _this.box[2].getComp({x:659, y:325, width:244, text:W.Texts["closed_caption_digital"] + " 2"});
            _comp.add(_comp._box[2]);
            _this.box[3] = new Box();
            _comp._box[3] = _this.box[3].getComp({x:159, y:395, width:244, text:W.Texts["closed_caption_digital"] + " 3"});
            _comp.add(_comp._box[3]);
            _this.box[4] = new Box();
            _comp._box[4] = _this.box[4].getComp({x:409, y:395, width:244, text:W.Texts["closed_caption_digital"] + " 4"});
            _comp.add(_comp._box[4]);
            _this.box[5] = new Box();
            _comp._box[5] = _this.box[5].getComp({x:659, y:395, width:244, text:W.Texts["closed_caption_digital"] + " 5"});
            _comp.add(_comp._box[5]);
            _this.box[6] = new Box();
            _comp._box[6] = _this.box[6].getComp({x:159, y:465, width:244, text:W.Texts["closed_caption_digital"] + " 6"});
            _comp.add(_comp._box[6]);

        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            if(_data && _data.data) {
                /*if(_data.data.closedCaption == 1) {
                    selectedIndex = index = _data.data.digitalClosedCaption;
                } else {
                    selectedIndex = index = 0;
                }*/
                selectedIndex = index = _data.data - 1;
            }

            _this.box[index].setFocus();
            _this.box[index].setSelected();
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index%3 == 2 || index == 6) {
                            _this.box[index].unFocus();
                            mode = MODE_TYPE.BTN;
                            _this.btn[btnIndex].setFocus();
                        } else {
                            _this.box[index].unFocus();
                            _this.box[++index].setFocus();
                        }
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index%3 != 0) {
                            _this.box[index].unFocus();
                            _this.box[--index].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        mode = MODE_TYPE.BOX;
                        _this.box[index].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        if(index>2) {
                            _this.box[index].unFocus();
                            index -= 3;
                            _this.box[index].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        if(index<3) {
                            _this.box[index].unFocus();
                            index += 3;
                            _this.box[index].setFocus();
                        } else if(index<6) {
                            _this.box[index].unFocus();
                            index = 6;
                            _this.box[index].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[selectedIndex].unSelected();
                        selectedIndex = index;
                        _this.box[selectedIndex].setSelected();

                        _this.box[index].unFocus();
                        mode = MODE_TYPE.BTN;
                        _this.btn[btnIndex].setFocus();
                    } else {
                        if(btnIndex == 0) {
                            saveCallback(true, selectedIndex + 1);
                            //saveCallback(true, {closedCaption : selectedIndex > 0 ? 1 : 0, digitalClosedCaption : selectedIndex});
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
        this.componentName = "ClosedCaptionService";
    }
    return ClosedCaptionService;
});