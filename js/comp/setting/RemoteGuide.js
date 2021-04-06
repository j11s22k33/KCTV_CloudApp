/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Button"], function(util, Button) {
    function RemoteGuide() {
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

            _comp._legacy = new W.Div({});

            _comp.add(new W.Div({text:title, x:538, y:64, width:300, textColor:"#EDA802", opacity:1, fontFamily:"RixHeadM", "font-size":"34px", textAlign:"left", "letter-spacing":"-1.7px"}));

            _comp.add(new W.Div({x:205, y:122, width:870, height:1, color:"#393939", opacity:0.75}));

            _comp.add(new W.Div({x:205, y:590, width:870, height:1, color:"#393939", opacity:0.75}));

            _comp._legacy.add(new W.Image({x:415, y:159, width:450, height:405, src:"img/image_remote.png"}));

            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_1"], x:403-300, y:474-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
            //_comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_2"], x:342, y:442, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_3"], x:403-300, y:415-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_4"], x:403-300, y:360-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_5"], x:403-300, y:305-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_6"], x:403-300, y:250-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_7"], x:403-300, y:195-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_8"], x:636, y:470-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_9"], x:636, y:415-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_10"], x:636, y:360-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_11"], x:636, y:305-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_12"], x:636, y:250-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_13"], x:636, y:195-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));

            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_14"], x:877, y:360-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_15"], x:877, y:305-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_16"], x:877, y:440-15, width:390, textColor:"#C8C8C8", opacity:0.5, fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left", "letter-spacing":"-0.8px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_17"], x:877, y:458-15, width:390, textColor:"#C8C8C8", opacity:0.5, fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left", "letter-spacing":"-0.8px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_18"], x:877, y:415-15, width:390, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:"*", x:867, y:415-15, width:390, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_19"], x:877, y:505-15, width:390, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
            _comp._legacy.add(new W.Div({text:W.Texts["remote_control_button_20"], x:877, y:525-15, width:390, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));

            _comp.add(_comp._legacy);


            if(W.StbConfig.isUHD) {
                _comp._uhd = new W.Div({});

                _comp._uhd.add(new W.Image({x:415, y:159, width:450, height:405, src:"img/image_remote2.png"}));

                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_21"], x:412-300, y:170-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_6"], x:412-300, y:200-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_1"], x:412-300, y:281-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_4"], x:412-300, y:307-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_5"], x:412-300, y:344-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_3"], x:412-300, y:402-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_22"], x:412-300, y:478-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_23"], x:412-300, y:509-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"right", "letter-spacing":"-0.9px"}));

                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_24"], x:617, y:173-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_13"], x:617, y:207-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_25"], x:617, y:243-15, width:300, textColor:"#DABC74", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_26"], x:617, y:278-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_12"], x:617, y:306-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_11"], x:617, y:352-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_10"], x:617, y:401-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_27"], x:617, y:455-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_28"], x:617, y:509-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));

                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_9"], x:848, y:336-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:"*", x:867, y:415-15, width:390, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_29"], x:876, y:415-15, width:300, textColor:"#C8C8C8", opacity:1, fontFamily:"RixHeadM", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
                _comp._uhd.add(new W.Div({text:W.Texts["remote_control_button_30"], x:876, y:443-15, width:390, textColor:"#C8C8C8", opacity:0.5,
                    fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left", "letter-spacing":"-0.8px", "white-space" :"pre"}));

                _comp.add(_comp._uhd);

                _comp._legacy.setStyle({display:"none"});

                _comp.add(new W.Image({x:141,y:337, width:41, height:41, src:"img/arrow_navi_l.png"}));
                _comp.add(new W.Image({x:1102,y:337, width:41, height:41, src:"img/arrow_navi_r.png"}));

                _this.remoteIndex = 0;

                _comp._page = new W.Div({text:"01", x:1038-200, y:613-15, width:200, textColor:"#D5D5D5", opacity:1, fontFamily:"RixHeadB", "font-size":"18px",
                    textAlign:"right", "letter-spacing":"-0.9px"});
                _comp.add(_comp._page);
                _comp._tpage = new W.Div({text:"/02", x:1041, y:613-15, width:200, textColor:"rgba(122,122,122,0.5)", opacity:1, fontFamily:"RixHeadB", "font-size":"18px",
                    textAlign:"left", "letter-spacing":"-0.9px"});
                _comp.add(_comp._tpage);
            }

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:579, y:623, text:W.Texts["close"]});
            _comp.add(_comp._btn[0]);
            _this.btn[0].setFocus();
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                    if(W.StbConfig.isUHD) {
                        if(_this.remoteIndex == 0) {
                            _this.remoteIndex = 1;
                            _comp._legacy.setStyle({display:""});
                            _comp._uhd.setStyle({display:"none"});
                            _comp._page.setText("02");
                        } else {
                            _this.remoteIndex = 0;
                            _comp._uhd.setStyle({display:""});
                            _comp._legacy.setStyle({display:"none"});
                            _comp._page.setText("01");
                        }
                    }
                    break;
                case W.KEY.UP:
                    break;
                case W.KEY.DOWN:
                    break;
                case W.KEY.ENTER:
                        saveCallback(false);
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
        this.componentName = "RemoteGuide";
    }
    return RemoteGuide;
});