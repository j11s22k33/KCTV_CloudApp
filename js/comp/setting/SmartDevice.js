/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function SmartDevice() {
        var _this = this;

        var sdpDataManager = W.getModule("manager/SdpDataManager");

        var mode = 0;

        var btnIndex = 0;
        var _comp;
        var listIndex = 0;
        var selectedListIndex;

        var data;

        var saveCallback;

        var registeredDevices;

        var MODE_TYPE = Object.freeze({LIST:0, BTN:1});

        var create = function(title){
            mode = MODE_TYPE.LIST;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["mobile_connect_guide"]});
            _comp.add(_comp._templete);

            if(W.StbConfig && W.StbConfig.cugType == "oneroom") {
                _comp.add(new W.Span({x:160, y:606, width:"800px", height:"20px", textColor:"rgba(131,122,119,0.75)", "font-size":"18px", "letter-spacing":"-0.8x",
                    fontFamily:"RixHeadL", text:W.Texts["mobile_connect_guide2"].replace("5","1"), textAlign:"left"}));
            } else {
                _comp.add(new W.Span({x:160, y:606, width:"800px", height:"20px", textColor:"rgba(131,122,119,0.75)", "font-size":"18px", "letter-spacing":"-0.8x",
                    fontFamily:"RixHeadL", text:W.Texts["mobile_connect_guide2"], textAlign:"left"}));
            }

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:402, text:W.Texts["refresh"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["unregister"]});
            _comp.add(_comp._btn[1]);
            _comp._btn[1].setStyle({display:"none"});

            _comp._onList = new W.Div({x:158, y:230, width:752, height:362});
            //_comp._onList.add(new W.Div({x:1,y:1,width:494, height:1, color:"rgba(57,57,57)"}));
            _comp._onList._list = new W.Div({x:0,y:0, width:752, height:362});
            _comp._onList.add(_comp._onList._list);
            _comp.add(_comp._onList);
        };

        var makeList = function() {
            if(_comp._onList._list._inner) {
                _comp._onList._list.remove(_comp._onList._list._inner);
            }

            _comp._onList._list._inner = new W.Div({x:0,y:0, width:752});

            var devices = [];
            for(var i = 0; i < registeredDevices.length; i++) {
                devices[i] = new W.Div({x:0,y:i*60, width:752,height:63});
                devices[i]._focus = new W.Image({x:0, y:0, width:752,height:63, src:"img/line_set750_f.png", display:"none"});
                devices[i].add(devices[i]._focus);

                //if(registeredDevices[i].isReg) {
                if(i != 0) {
                    devices[i].add(new W.Image({x:172-158, y:311-290, width:22, height:22, src:"img/radio_n.png"}));
                    devices[i]._check = new W.Image({x:172-158, y:311-290, width:22, height:22, src:"img/radio_f.png", display:"none"});
                    devices[i].add(devices[i]._check);
                    devices[i]._text = new W.Div({x:201-158, y:1, width:680, height:60, lineHeight:"60px", textColor:"rgba(181,181,181,0.9)", fontFamily:"RixHeadL",
                        "font-size":"20px", "letter-spacing":"-1.0px"});
                    devices[i]._text.add(new W.Div({position:"relative", float:"left", x:0, y:0, maxWidth:(registeredDevices[i].isNscreen?680-79:680)+"px", height:60,
                        text:registeredDevices[i].name, textAlign:"left", className:"cut"}));
                    devices[i].add(devices[i]._text);

                    if(registeredDevices[i].isNscreen) {
                        devices[i]._text._nscreen = new W.Image({position:"relative", x:0, y:4, width:67, height:21, text:registeredDevices[i].name,
                            marginLeft:"12px", src:"img/info_nscreen.png", opacity:0.7});
                        devices[i]._text.add(devices[i]._text._nscreen);
                    }
                } else {
                    devices[i]._text = new W.Div({x:174-158, y:1, width:707, height:60, lineHeight:"60px", textColor:"rgba(181,181,181,0.9)", fontFamily:"RixHeadL",
                        "font-size":"20px", "letter-spacing":"-1.0px"});
                    devices[i]._text.add(new W.Div({x:0, y:0, width:692, height:60, text:registeredDevices[i].name, textAlign:"left", className:"cut"}));
                    devices[i].add(devices[i]._text);
                }
                if(i < registeredDevices.length-1) devices[i].add(new W.Div({x:1,y:58,width:750, height:1, color:"rgba(57,57,57,0.75)"}));
                _comp._onList._list._inner.add(devices[i]);
            }
            _comp._onList._list._inner._devices = devices;

            _comp._onList._list.add(_comp._onList._list._inner);
        };

        var setListFocus = function(idx) {
            var obj =  _comp._onList._list._inner._devices[idx];
            if(obj){
                obj._text.setStyle({textColor:"rgba(255,255,255,0.9)"});
                if(obj._text._nscreen) obj._text._nscreen.setStyle({opacity:1});
                obj._focus.setStyle({display:"block"});
            }
        };

        var setListUnFocus = function(idx) {
            var obj =  _comp._onList._list._inner._devices[idx];
            obj._text.setStyle({textColor:"rgba(181,181,181,0.9)"});
            if(obj._text._nscreen) obj._text._nscreen.setStyle({opacity:0.7});
            obj._focus.setStyle({display:"none"});
        };

        var selectList = function(idx, isSelect) {
            var obj =  _comp._onList._list._inner._devices[idx];
            obj._check.setStyle({display:isSelect ? "block":"none"});
        };

        var getMobileListParing = function() {
            sdpDataManager.getMobileListParing(function(isSuccess, result){
            	W.log.info(result);
                if(isSuccess) {
                    registeredDevices = [{name:W.Texts["mobile_connect_regist"]}];

                    if(result && result.data) {
                        for(var i = 0; i < result.data.length; i++) {
                            registeredDevices.push(result.data[i]);

                        }
                    }

                    makeList();

                    _this.btn[btnIndex].unFocus();
                    _comp._btn[0].setStyle({y:402});
                    _comp._btn[1].setStyle({display:"none"});
                    mode = MODE_TYPE.LIST;
                    btnIndex = 0;
                    listIndex = 0;
                    selectedListIndex = undefined;
                    setListFocus(listIndex);
                } else {
                    //var messageArray = [];
                    //if(result.error && result.error.message) messageArray.push(result.error.message);
                    //if(result.error && result.error.detail) messageArray.push(result.error.detail);

                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code: (result.error && result.error.code) ? result.error.code : "9999",
                        message : (result.error && result.error.message) ? [result.error.message] : null,
            			from : "SDP"
                        //messageArray
                    });

                    registeredDevices = [{name:W.Texts["mobile_connect_regist"]}];

                    makeList();
                    setListFocus(listIndex);
                }

            });
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);


            getMobileListParing();
            return _comp;
        };

        this.setData = function(_data) {
            // 1: 5초, 2: 3초, 3: 사용 안함
            if(_data && _data.data) {
            }

            //registeredDevices = [{name:W.Texts["mobile_connect_regist"]}, {name:"등록기기 1", isReg : true}, {name:"등록기기 2", isReg : true}, {name:"미등록기기 3"},
            //    {name:"미등록기기 4"}, {name:"미등록기기 5"}];

            makeList();
            setListFocus(listIndex);
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.LIST) {
                        setListUnFocus(listIndex);
                        mode = MODE_TYPE.BTN;
                        _this.btn[btnIndex].setFocus();
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.LIST) {

                    } else {
                        _this.btn[btnIndex].unFocus();
                        mode = MODE_TYPE.LIST;
                        setListFocus(listIndex);
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.LIST) {
                        setListUnFocus(listIndex);
                        listIndex = listIndex == 0 ? registeredDevices.length-1 : listIndex-1;
                        setListFocus(listIndex);
                    } else {
                        if(selectedListIndex) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = ++btnIndex%2;
                            _this.btn[btnIndex].setFocus();
                        }
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.LIST) {
                        setListUnFocus(listIndex);
                        listIndex = listIndex == registeredDevices.length-1 ? 0 : listIndex+1;
                        setListFocus(listIndex);
                    } else {
                        if(selectedListIndex) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = ++btnIndex%2;
                            _this.btn[btnIndex].setFocus();
                        }
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.LIST) {
                        if(listIndex == 0) {
                            if(W.StbConfig && W.StbConfig.cugType == "oneroom" && registeredDevices.length > 1) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["smart_device_limit"].replace("5","1")}
                                );
                            } else if(W.StbConfig && W.StbConfig.cugType != "oneroom" && registeredDevices.length > 5) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["smart_device_limit"]}
                                );
                            } else {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/setting/SmartDeviceRegistPopup"
                                });
                            }
                        } else {
                            //if(registeredDevices[listIndex].isReg) {
                                if(selectedListIndex) {
                                    selectList(selectedListIndex, false);
                                } else {
                                    _comp._btn[0].setStyle({y:378});
                                    _comp._btn[1].setStyle({display:"block"});
                                }
                                selectedListIndex = listIndex;
                                selectList(selectedListIndex, true);
                            //}
                        }
                    } else {
                        if(btnIndex == 0) {
                            getMobileListParing();
                        } else {
                            sdpDataManager.getMobileRemovePairing(function(isSuccess, result) {
                                if(isSuccess) {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/FeedbackPopup",
                                        type:"2LINE",
                                        title:registeredDevices[selectedListIndex].name,
                                        desc:W.Texts["smart_device_deregistered"]}
                                    );
                                    getMobileListParing();
                                } else {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/ErrorPopup",
                                        code: (result.error && result.error.code) ? result.error.code : "9999",
                                        message : (result.error && result.error.message) ? [result.error.message] : null,
                            			from : "SDP"
                                        //messageArray
                                    });
                                }

                            }, {deviceId : registeredDevices[selectedListIndex].deviceId});

                            //saveCallback(false);
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

        };
        this.onPopupClosed = function(popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/setting/SmartDeviceRegistPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        getMobileListParing();
                    } else {

                    }
                }
            }
        };
        this.componentName = "SmartDevice";
    }
    return SmartDevice;
});