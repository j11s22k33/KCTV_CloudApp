/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function Reset() {
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
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["reset_desc"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["close"]});
            _comp.add(_comp._btn[0]);

            _comp._box = [];
            _comp._box[0] = new W.Div({x:158, y:335});
            _comp._box[0]._normal = new W.Div({x:1, y:1, width:244, height:56, "white-space":"pre", textAlign:"center", display:"none"});
            _comp._box[0].add(_comp._box[0]._normal);
            _comp._box[0]._normal.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_set244.png"}));
            _comp._box[0]._normal.add(new W.Span({x:0, y:0, width:244, height:56, textColor:"rgba(181,181,181,0.75)", "font-size":"20px",
                className:"font_rixhead_light", text:W.Texts["reset"], textAlign:"center", lineHeight:"56px"}));
            _comp._box[0]._focus = new W.Div({x:0, y:0, width:246, height:58, "white-space":"pre", textAlign:"center"});
            _comp._box[0].add(_comp._box[0]._focus);
            _comp._box[0]._focus.add(new W.Image({x:0, y:0, width:246, height:58, src:"img/box_set244_f.png"}));
            _comp._box[0]._focus.add(new W.Span({x:0, y:0, width:246, height:58, textColor:"rgba(255,255,255,0.75)", "font-size":"20px",
                className:"font_rixhead_light", text:W.Texts["reset"], textAlign:"center", lineHeight:"59px"}));
            _comp.add(_comp._box[0]);

            _comp._box[1] = new W.Div({x:158, y:485});
            _comp._box[1]._normal = new W.Div({x:1, y:1, width:244, height:56, "white-space":"pre", textAlign:"center"});
            _comp._box[1].add(_comp._box[1]._normal);
            _comp._box[1]._normal.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_set244.png"}));
            _comp._box[1]._normal.add(new W.Span({x:0, y:0, width:244, height:56, textColor:"rgba(181,181,181,0.75)", "font-size":"20px",
                className:"font_rixhead_light", text:W.Texts["reset"], textAlign:"center", lineHeight:"56px"}));
            _comp._box[1]._focus = new W.Div({x:0, y:0, width:246, height:58, "white-space":"pre", textAlign:"center", display:"none"});
            _comp._box[1].add(_comp._box[1]._focus);
            _comp._box[1]._focus.add(new W.Image({x:0, y:0, width:246, height:58, src:"img/box_set244_f.png"}));
            _comp._box[1]._focus.add(new W.Span({x:0, y:0, width:246, height:58, textColor:"rgba(255,255,255,0.75)", "font-size":"20px",
                className:"font_rixhead_light", text:W.Texts["reset"], textAlign:"center", lineHeight:"58px"}));
            _comp.add(_comp._box[1]);

            _comp.add(new W.Span({x:159, y:301, width:800, text:W.Texts["reset_purchase_pin"], textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadL",
                "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px", "white-space":"pre-line"}));
            _comp.add(new W.Span({x:159, y:451, width:800, text:W.Texts["reset_system"], textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadL",
                "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px", "white-space":"pre-line"}));
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        _comp._box[index]._normal.setStyle({display:""});
                        _comp._box[index]._focus.setStyle({display:"none"});
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
                        _comp._box[index]._normal.setStyle({display:"none"});
                        _comp._box[index]._focus.setStyle({display:""});
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        _comp._box[index]._normal.setStyle({display:""});
                        _comp._box[index]._focus.setStyle({display:"none"});
                        index = index < 1 ? index-- : 0;
                        _comp._box[index]._normal.setStyle({display:"none"});
                        _comp._box[index]._focus.setStyle({display:""});
                    } else {
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        _comp._box[index]._normal.setStyle({display:""});
                        _comp._box[index]._focus.setStyle({display:"none"});
                        index = index >= _comp._box.length-1 ? index++ : _comp._box.length-1;
                        _comp._box[index]._normal.setStyle({display:"none"});
                        _comp._box[index]._focus.setStyle({display:""});
                    } else {
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        if(index == 0) {
                            var popup = {
                                childComp:_this,
                                type:"clear_purchase",
                                popupName:"popup/AdultCheckPopup"
                            };
                            W.PopupManager.openPopup(popup);
                        } else if(index == 1) {
                            var popup = {
                                childComp:_this,
                                type:"clear_setting",
                                popupName:"popup/AdultCheckPopup"
                            };
                            W.PopupManager.openPopup(popup);
                        }
                    } else {
                        saveCallback(false);
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
            console.log(popup, desc)
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        if(desc.type == "clear_purchase") {

                            W.Loading.start();
                            W.CloudManager.resetPin(function(data) {
                                if(data && data.data == "OK") {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/FeedbackPopup",
                                        title:W.Texts["reset_purchase_pin_feedback"]}
                                    );
                                    W.Loading.stop();
                                } else {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        type:"error",
                                        popupName:"popup/FeedbackPopup",
                                        title:W.Texts["error_general"]}
                                    );
                                    W.Loading.stop();
                                }
                            }, false);

                        } else if(desc.type == "clear_setting") {//시스템 초기화
                            W.PopupManager.openPopup({
                                childComp:_this,
                                popupName:"popup/FeedbackPopup",
                                title:W.Texts["system_reset_start"]}
                            );

                            W.CloudManager.reset(function(data) {
                                if(data && data.data == "OK") {

                                } else {
                                    _this.backScene();
                                }
                            }, desc.oldPIN);
                        }
                    } else {
                        //_this.backScene();
                    }
                } else if (desc.popupName == "popup/FeedbackPopup") {
                    if(desc.type == "error") {

                    } else {

                    }
                }
            }
        };
        this.componentName = "Reset";
    }
    return Reset;
});