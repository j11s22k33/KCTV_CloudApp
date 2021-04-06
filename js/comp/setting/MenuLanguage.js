/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function MenuLanguage() {
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
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["menu_language_guide"]});
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
            _comp._box[0] = _this.box[0].getComp({x:159, y:304, width:244, text:W.Texts["menu_language_kor"]});
            _comp.add(_comp._box[0]);
            _this.box[1] = new Box();
            _comp._box[1] = _this.box[1].getComp({x:159, y:374, width:244, text:W.Texts["menu_language_eng"]});
            _comp.add(_comp._box[1]);

            if(W.StbConfig.cugType != "normal") {
                _this.box[2] = new Box();
                _comp._box[2] = _this.box[2].getComp({x:159, y:444, width:244, text:W.Texts["menu_language_jpn"]});
                _comp.add(_comp._box[2]);
                _this.box[3] = new Box();
                _comp._box[3] = _this.box[3].getComp({x:159, y:514, width:244, text:W.Texts["menu_language_chn"]});
                _comp.add(_comp._box[3]);
            }

            _comp.add(new W.Span({x:159, y:274, width:800, text:"You can adjust the language used for menus", textColor:"rgba(131,122,119,0.75)",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.8px"}));
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            // 1: 한국어, 2: 영어, 3: 일본어, 4: 중국어
            if(_data && _data.data) {
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
                        _this.box[index].unFocus();
                        mode = MODE_TYPE.BTN;
                        _this.btn[btnIndex].setFocus();
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {

                    } else {
                        _this.btn[btnIndex].unFocus();
                        mode = MODE_TYPE.BOX;
                        _this.box[index].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        if(index>0) {
                            _this.box[index].unFocus();
                            _this.box[--index].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        if(index<_this.box.length-1) {
                            _this.box[index].unFocus();
                            _this.box[++index].setFocus();
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
        this.componentName = "MenuLanguage";
    }
    return MenuLanguage;
});