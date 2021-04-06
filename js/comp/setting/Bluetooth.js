/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function Bluetooth() {
        var _this = this;

        var mode = 0;
        var processMode = 0;

        var index = 0;
        var btnIndex = 0;
        var selectedIndex = 0;
        var _comp;
        var listIndex = 0;
        var listSelectArray = [];

        var data;

        var saveCallback;

        var registeredDevices;
        var connectedIndex;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1, LIST:2});
        var PROCESS_TYPE = Object.freeze({OFF:0, ON_NO_LIST:1, ON_LIST:2});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["bluetooth_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["bluetooth_device_del"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["bluetooth_device_search"]});
            _comp.add(_comp._btn[1]);
            _this.btn[2] = new Button();
            _comp._btn[2] = _this.btn[2].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[2]);
            _this.btn[3] = new Button();
            _comp._btn[3] = _this.btn[3].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[3]);
            _comp._btn[0].setStyle({display:"none"});
            _comp._btn[1].setStyle({display:"none"});

            _this.box = [], _comp._box = [];
            _this.box[0] = new Box();
            _comp._box[0] = _this.box[0].getComp({x:159, y:395, width:244, text:W.Texts["use"]});
            _comp.add(_comp._box[0]);
            _this.box[1] = new Box();
            _comp._box[1] = _this.box[1].getComp({x:409, y:395, width:244, text:W.Texts["use_not"]});
            _comp.add(_comp._box[1]);

            _comp._noList = new W.Div({x:158, y:309, width:752, height:308, display:"none"});
            _comp._noList.add(new W.Div({x:1,y:1,width:750, height:2, color:"rgb(57,57,57)"}));
            _comp._noList.add(new W.Div({x:1,y:456-341, width:750, text:W.Texts["no_device_list"], textColor:"rgba(181,181,181,0.75)", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px"}));
            _comp.add(_comp._noList);

            _comp._bottomDesc = new W.Span({x:160, y:577, width:750, display:"none", text:W.Texts["bluetooth_guide2"],
                textColor:"rgba(131,122,119,0.75)", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px",
                "white-space":"pre-wrap", "line-height":"24px"});
            _comp.add(_comp._bottomDesc);

            _comp._onList = new W.Div({x:158, y:309, width:752, height:308, display:"none"});
            _comp._onList.add(new W.Div({x:1,y:1,width:750, height:2, color:"rgb(57,57,57)"}));
            _comp._onList._list = new W.Div({x:0,y:0, width:752, height:308});
            _comp._onList.add(_comp._onList._list);
            _comp.add(_comp._onList);

            _comp._hotKey = new W.Div({x:975, y:97, display:"none"});
            _comp._hotKey.add(new W.Image({x:0, y:0, width:68, height:68, src:"img/color_yellow.png"}));
            _comp._hotKey.add(new W.Div({x:1026-975,y:114-97, width:160, text:W.Texts["bluetooth_audio_connect"], textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadM",
                "font-size":"15px", textAlign:"left", "letter-spacing":"-0.75px"}));
            _comp.add(_comp._hotKey);
        };

        var makeList = function() {
            if(_comp._onList._list._inner) {
                _comp._onList._list.remove(_comp._onList._list._inner);
            }

            _comp._onList._list._inner = new W.Div({x:0,y:0, width:752});

            var devices = [];
            connectedIndex = undefined;
            for(var i = 0; i < registeredDevices.length; i++) {
                if(registeredDevices[i][3] && registeredDevices[i][3] == "connected") {
                    connectedIndex = i;
                }
                devices[i] = new W.Div({x:0,y:i*51, width:752,height:54});
                devices[i].add(new W.Image({x:172-158, y:326-309, width:22, height:22, src:"img/check_n.png"}));
                devices[i]._check = new W.Image({x:172-158, y:326-309, width:22, height:22, src:"img/check__f.png", display:"none"});
                devices[i].add(devices[i]._check);
                devices[i]._text = new W.Div({x:202-158, y:1, width:688, height:52, lineHeight:"52px", textColor:"rgba(181,181,181,0.9)", fontFamily:"RixHeadL",
                    "font-size":"20px", "letter-spacing":"-0.9px"});
                devices[i]._text.add(new W.Div({x:0, y:0, width:602, height:52, text:registeredDevices[i][0], textAlign:"left", className:"cut"}));
                devices[i]._text._isConnect = new W.Div({x:552, y:0, width:136, height:52, text:connectedIndex == i ? W.Texts["bluetooth_connected"]:W.Texts["bluetooth_connected_not"], textAlign:"right"});
                devices[i]._text.add(devices[i]._text._isConnect);
                devices[i].add(devices[i]._text);
                devices[i].add(new W.Div({x:1,y:50,width:750, height:1, color:"rgba(57,57,57)"}));

                devices[i]._focus = new W.Image({x:0, y:0, width:752,height:54, src:"img/line_set750s_f.png", display:"none"});
                devices[i].add(devices[i]._focus);
                _comp._onList._list._inner.add(devices[i]);
            }
            _comp._onList._list._inner._devices = devices;

            _comp._onList._list.add(_comp._onList._list._inner);
        }

        var setProcessMode = function() {
            if(processMode == PROCESS_TYPE.OFF) {
                if(registeredDevices.length > 0) {
                    _comp._btn[0].setStyle({display:"none"});
                    _comp._btn[1].setStyle({display:"none"});
                    _comp._btn[2].setStyle({y:378});
                    _comp._btn[3].setStyle({y:426});
                    _comp._box[0].setStyle({y:227});
                    _comp._box[1].setStyle({y:227});
                    _comp._noList.setStyle({display:"none"});
                    _comp._onList.setStyle({display:"block", opacity:0.4});
                    btnIndex = 2;
                    _comp._bottomDesc.setStyle({display:"none"});
                } else {
                    _comp._btn[0].setStyle({display:"none"});
                    _comp._btn[1].setStyle({display:"none"});
                    _comp._btn[2].setStyle({y:378});
                    _comp._btn[3].setStyle({y:426});
                    _comp._box[0].setStyle({y:367});
                    _comp._box[1].setStyle({y:367});
                    _comp._noList.setStyle({display:"none"});
                    _comp._onList.setStyle({display:"none"});
                    btnIndex = 2;
                    _comp._bottomDesc.setStyle({display:"block", y:437});
                }
            } else if(processMode == PROCESS_TYPE.ON_NO_LIST) {
                _comp._btn[0].setStyle({display:"none"});
                _comp._btn[1].setStyle({display:"block", y:358});
                _comp._btn[2].setStyle({y:406});
                _comp._btn[3].setStyle({y:454});
                _comp._box[0].setStyle({y:227});
                _comp._box[1].setStyle({y:227});
                _comp._noList.setStyle({display:"block"});
                _comp._onList.setStyle({display:"none"});
                _comp._bottomDesc.setStyle({display:"block", y:577});
                btnIndex = 1;
            } else if(processMode == PROCESS_TYPE.ON_LIST) {
                _comp._btn[0].setStyle({display:"block", y:330, opacity : listSelectArray.length > 0 ? 1 : 0.6});
                _comp._btn[1].setStyle({display:"block", y:378});
                _comp._btn[2].setStyle({y:426});
                _comp._btn[3].setStyle({y:474});
                _comp._box[0].setStyle({y:227});
                _comp._box[1].setStyle({y:227});
                _comp._noList.setStyle({display:"none"});
                _comp._onList.setStyle({display:"block", opacity:1});
                _comp._bottomDesc.setStyle({display:"none"});
                btnIndex = 1;
            }
            _comp._hotKey.setStyle({display:"none"});
        }

        var setListFocus = function(idx) {
            var obj =  _comp._onList._list._inner._devices[idx];
            obj._text.setStyle({textColor:"rgba(255,255,255,1)"});
            obj._focus.setStyle({display:"block"});

            if((idx != connectedIndex) && (registeredDevices[idx][2] == "audio")) {
                _comp._hotKey.setStyle({display:"block"});
            }
        };

        var setListUnFocus = function(idx) {
            var obj =  _comp._onList._list._inner._devices[idx];
            obj._text.setStyle({textColor:"rgba(181,181,181,0.9)"});
            obj._focus.setStyle({display:"none"});
            _comp._hotKey.setStyle({display:"none"});
        };

        var selectList = function(idx) {
            var obj =  _comp._onList._list._inner._devices[idx];
            if(listSelectArray.includes(registeredDevices[idx])) {
                obj._check.setStyle({display:"none"});
                listSelectArray.splice(listSelectArray.indexOf(registeredDevices[idx]),1);
            } else {
                obj._check.setStyle({display:"block"});
                listSelectArray.push(registeredDevices[idx]);
            }

            _comp._btn[0].setStyle({display:"block", y:330, opacity : listSelectArray.length > 0 ? 1 : 0.6});
        };

        var tryPairing = function(device, isForce) {
            //registeredDevices[listIndex];
            if(isForce || (listIndex != connectedIndex)) {
                _this.pairingTryDevice = device;

                W.Loading.start({delay:0});
                W.CloudManager.startPairing(function(result) {
                    if(result && result.data && result.data == "OK") {
                        W.CloudManager.BluetoothPairingCallback = bluetoothPairingResult;
                    }
                }, device[1]);
            }
        };

        var bluetoothPairingResult = function(result) {
            W.Loading.stop();
            W.log.info(result)
            if(result && result == "OK") {
                /*W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/setting/BluetoothConnectCompletePopup"
                });*/

                W.CloudManager.deviceList_BT(function(result) {
                    if(result && result.data) {
                        registeredDevices = result.data;
                        if(registeredDevices && registeredDevices.length > 0) {
                            processMode = PROCESS_TYPE.ON_LIST;
                            makeList();
                        } else {
                            processMode = PROCESS_TYPE.ON_NO_LIST;
                        }
                    }

                    if(mode == MODE_TYPE.LIST) {
                        listIndex = 0;
                        setListFocus(listIndex);
                    } else {
                        setProcessMode();
                    }
                    W.Loading.stop();
                });
            }
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            //
            if(_data && _data.data) {
                selectedIndex = index = _data.data-1;
            }

            _this.box[index].setFocus();
            _this.box[index].setSelected();

            registeredDevices = [];

            if(index == 0) {
                W.Loading.start();
                W.CloudManager.deviceList_BT(function(result) {
                    if(result && result.data) {
                        registeredDevices = result.data;
                        if(registeredDevices && registeredDevices.length > 0) {
                            processMode = PROCESS_TYPE.ON_LIST;
                            makeList();
                        } else {
                            processMode = PROCESS_TYPE.ON_NO_LIST;
                        }
                    }
                    setProcessMode();
                    W.Loading.stop();
                });
            } else {
                processMode = PROCESS_TYPE.OFF;
                if(registeredDevices && registeredDevices.length > 0) {
                    makeList();
                }
                setProcessMode();
            }

        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(processMode == PROCESS_TYPE.OFF) {
                        if(mode == MODE_TYPE.BOX) {
                            if(index == 1) {
                                _this.box[index].unFocus();
                                mode = MODE_TYPE.BTN;
                                btnIndex = 2;
                                _this.btn[btnIndex].setFocus();
                            } else {
                                _this.box[index].unFocus();
                                _this.box[++index].setFocus();
                            }
                        }
                    } else if(processMode == PROCESS_TYPE.ON_NO_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            if(index == 1) {
                                _this.box[index].unFocus();
                                mode = MODE_TYPE.BTN;
                                btnIndex = 2;
                                _this.btn[btnIndex].setFocus();
                            } else {
                                _this.box[index].unFocus();
                                _this.box[++index].setFocus();
                            }
                        }
                    } else if(processMode == PROCESS_TYPE.ON_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            if(index == 1) {
                                _this.box[index].unFocus();
                                mode = MODE_TYPE.BTN;
                                btnIndex = listSelectArray.length > 0 ? 0:1;
                                _this.btn[btnIndex].setFocus();
                            } else {
                                _this.box[index].unFocus();
                                _this.box[++index].setFocus();
                            }
                        } else if(mode == MODE_TYPE.LIST) {
                            setListUnFocus(listIndex);
                            mode = MODE_TYPE.BTN;
                            btnIndex = listSelectArray.length > 0 ? 0:1;
                            _this.btn[btnIndex].setFocus();
                        }
                    }

                    break;
                case W.KEY.LEFT:
                    if(processMode == PROCESS_TYPE.OFF) {
                        if(mode == MODE_TYPE.BOX) {
                            if(index == 1) {
                                _this.box[index].unFocus();
                                _this.box[--index].setFocus();
                            }
                        } else if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            mode = MODE_TYPE.BOX;
                            _this.box[index].setFocus();
                        }
                    } else if(processMode == PROCESS_TYPE.ON_NO_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            if(index == 1) {
                                _this.box[index].unFocus();
                                _this.box[--index].setFocus();
                            }
                        } else if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            mode = MODE_TYPE.BOX;
                            _this.box[index].setFocus();
                        }
                    } else if(processMode == PROCESS_TYPE.ON_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            if(index == 1) {
                                _this.box[index].unFocus();
                                _this.box[--index].setFocus();
                            }
                        } else if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            mode = MODE_TYPE.BOX;
                            _this.box[index].setFocus();
                        }
                    }
                    break;
                case W.KEY.UP:
                    if(processMode == PROCESS_TYPE.OFF) {
                        if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = btnIndex == 2 ? 3 : 2;
                            _this.btn[btnIndex].setFocus();
                        }
                    } else if(processMode == PROCESS_TYPE.ON_NO_LIST) {
                        if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = btnIndex == 1 ? 3 : btnIndex-1;
                            _this.btn[btnIndex].setFocus();
                        }
                    } else if(processMode == PROCESS_TYPE.ON_LIST) {
                        if(mode == MODE_TYPE.LIST) {
                            setListUnFocus(listIndex);
                            if(listIndex == 0) {
                                mode = MODE_TYPE.BOX;
                                _this.box[index].setFocus();
                            } else {
                                listIndex--;
                                setListFocus(listIndex);
                            }
                        } else if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = btnIndex == (listSelectArray.length > 0 ? 0:1) ? 3 : btnIndex-1;
                            _this.btn[btnIndex].setFocus();
                        }
                    }
                    break;
                case W.KEY.DOWN:
                    if(processMode == PROCESS_TYPE.OFF) {
                        if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = btnIndex == 2 ? 3 : 2;
                            _this.btn[btnIndex].setFocus();
                        }
                    } else if(processMode == PROCESS_TYPE.ON_NO_LIST) {
                        if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = btnIndex == 3 ? 1 : btnIndex+1;
                            _this.btn[btnIndex].setFocus();
                        }
                    } else if(processMode == PROCESS_TYPE.ON_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            _this.box[index].unFocus();
                            mode = MODE_TYPE.LIST;
                            listIndex = 0;
                            setListFocus(listIndex);
                        } else if(mode == MODE_TYPE.LIST) {
                            setListUnFocus(listIndex);
                            listIndex = listIndex == registeredDevices.length-1 ? 0 : listIndex+1;
                            setListFocus(listIndex);
                        } else if(mode == MODE_TYPE.BTN) {
                            _this.btn[btnIndex].unFocus();
                            btnIndex = btnIndex == 3 ? (listSelectArray.length > 0 ? 0:1) : btnIndex+1;
                            _this.btn[btnIndex].setFocus();
                        }
                    }
                    break;
                case W.KEY.ENTER:
                    if(processMode == PROCESS_TYPE.OFF) {
                        if(mode == MODE_TYPE.BOX) {
                            _this.box[selectedIndex].unSelected();
                            selectedIndex = index;
                            _this.box[selectedIndex].setSelected();

                            if(selectedIndex == 0) {
                                //if(registeredDevices && registeredDevices.length > 0) {
                                //    processMode = PROCESS_TYPE.ON_LIST;
                                // else {
                                //    processMode = PROCESS_TYPE.ON_NO_LIST;
                                //}

                                //setProcessMode();

                                W.Loading.start();
                                W.CloudManager.deviceList_BT(function(result) {
                                    if(result && result.data) {
                                        registeredDevices = result.data;
                                        if(registeredDevices && registeredDevices.length > 0) {
                                            processMode = PROCESS_TYPE.ON_LIST;
                                            makeList();
                                        } else {
                                            processMode = PROCESS_TYPE.ON_NO_LIST;
                                        }
                                    }
                                    setProcessMode();
                                    W.Loading.stop();
                                });
                            }
                        } else {
                            if(btnIndex == 2) {
                                saveCallback(true, selectedIndex + 1);
                            } else {
                                saveCallback(false);
                            }
                        }
                    } else if(processMode == PROCESS_TYPE.ON_NO_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            _this.box[selectedIndex].unSelected();
                            selectedIndex = index;
                            _this.box[selectedIndex].setSelected();

                            if(selectedIndex == 1) {
                                processMode = PROCESS_TYPE.OFF;
                                setProcessMode();
                            }
                        } else {
                            if(btnIndex == 1) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/setting/BluetoothSearchPopup"
                                });
                            } else if(btnIndex == 2) {
                                saveCallback(true, selectedIndex + 1);
                            } else {
                                saveCallback(false);
                            }
                        }
                    } else if(processMode == PROCESS_TYPE.ON_LIST) {
                        if(mode == MODE_TYPE.BOX) {
                            _this.box[selectedIndex].unSelected();
                            selectedIndex = index;
                            _this.box[selectedIndex].setSelected();

                            if(selectedIndex == 1) {
                                processMode = PROCESS_TYPE.OFF;
                                setProcessMode();
                            }
                        } else if(mode == MODE_TYPE.LIST) {
                            selectList(listIndex);
                        } else {
                            if(btnIndex == 0) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/MessagePopup",
                                    type:"BLUETOOTH_DEL",
                                    title:W.Texts["bluetooth_device_del"],
                                    boldText:W.Texts["bluetooth_device_msg1"].replace("@count@", listSelectArray.length),
                                    button:[W.Texts["ok"],W.Texts["cancel"]]}
                                );
                            } else if(btnIndex == 1) {
                                if(registeredDevices.length > 5) {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/MessagePopup",
                                        title:W.Texts["popup_zzim_info_title"],
                                        boldText:W.Texts["bluetooth_device_msg2"],
                                        button:[W.Texts["close"]]}
                                    );
                                } else {
                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/setting/BluetoothSearchPopup"
                                    });
                                }
                                
                            } else if(btnIndex == 2) {
                                saveCallback(true, selectedIndex + 1);
                            } else {
                                saveCallback(false);
                            }
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
                case W.KEY.COLOR_KEY_Y:
                    if(processMode == PROCESS_TYPE.ON_LIST) {
                        if(mode == MODE_TYPE.LIST) {
                            tryPairing(registeredDevices[listIndex]);
                        }
                    }
                    break;
            }

        };

        this.onPopupClosed = function(popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/setting/BluetoothSearchPopup") {
                    W.CloudManager.stopDiscovery(function() {});
                    W.CloudManager.BluetoothCallback = undefined;
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        tryPairing(desc.device, true);
                    }
                }else if (desc.popupName == "popup/setting/BluetoothConnectCompletePopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        var option = "BOTH";
                        if(desc.idx == 0) {
                            option = "BOTH";
                        } else if(desc.idx == 1) {
                            option = "ONLY_BT";
                        }

                        W.Loading.start();
                        W.CloudManager.audioOutput_BT(function(result) {
                            if(result && result.data && result.data == "OK") {
                                /*W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    type:"2LINE",
                                    title:_this.pairingTryDevice[0],
                                    desc:W.Texts["pairing_completed"]}
                                );*/

                            } else {
                                //W.Loading.stop();
                            }

                            W.CloudManager.deviceList_BT(function(result) {
                                if(result && result.data) {
                                    registeredDevices = result.data;
                                    if(registeredDevices && registeredDevices.length > 0) {
                                        processMode = PROCESS_TYPE.ON_LIST;
                                        makeList();
                                    } else {
                                        processMode = PROCESS_TYPE.ON_NO_LIST;
                                    }
                                }

                                if(mode == MODE_TYPE.LIST) {
                                    listIndex = 0;
                                    setListFocus(listIndex);
                                } else {
                                    setProcessMode();
                                }
                                W.Loading.stop();
                            });
                        }, option);
                    } else {

                    }
                } else if (desc.popupName == "popup/MessagePopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {

                        if(desc.type == "BLUETOOTH_DEL" && desc.idx == 0) {
                            var requestArray = [];
                            for(var i in listSelectArray) {
                                requestArray.push(listSelectArray[i][1]);
                            }

                            W.Loading.start();
                            W.CloudManager.deleteDevice_BT(function(result) {
                                if(result && result.data && result.data == "OK") {

                                    W.PopupManager.openPopup({
                                        childComp:_this,
                                        popupName:"popup/FeedbackPopup",
                                        title:W.Texts["deleted"]}
                                    );
                                    W.CloudManager.deviceList_BT(function(result) {
                                        if(result && result.data) {
                                            listSelectArray = [];
                                            _comp._btn[0].setStyle({display:"block", y:330, opacity : listSelectArray.length > 0 ? 1 : 0.6});
                                            _this.btn[btnIndex].unFocus();
                                            btnIndex = 1;
                                            registeredDevices = result.data;
                                            if(registeredDevices && registeredDevices.length > 0) {
                                                processMode = PROCESS_TYPE.ON_LIST;
                                                makeList();
                                            } else {
                                                processMode = PROCESS_TYPE.ON_NO_LIST;
                                                setProcessMode();
                                            }
                                            _this.btn[btnIndex].setFocus();
                                        }
                                        W.Loading.stop();
                                    });
                                } else {
                                    W.Loading.stop();
                                }
                            }, requestArray);
                        }

                    }
                }
            }
        };
        this.componentName = "Bluetooth";
    }
    return Bluetooth;
});