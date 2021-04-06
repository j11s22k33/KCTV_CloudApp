/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/SelectBox", "comp/Scroll"], function(util, Templete, Button, SelectBox, Scroll) {
    function BlockedChannel() {
        var _this = this;

        var mode = 0;

        var index = 0;
        var btnIndex = 0;
        var selectedArray = [];
        var pageIndex = 0;
        var _comp;
        var maxSelectCount = 50;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1, SCROLL:2});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["blocked_ch_guide"]});
            _comp.add(_comp._templete);

            data = [];

            for(var i = 0; i < W.CH_LIST.length; i++) {
                if(W.CH_LIST[i] && W.CH_LIST[i].channelType && W.CH_LIST[i].channelType.code){
                    if(W.CH_LIST[i].channelType.code == "2" || W.CH_LIST[i].channelType.code == "61") {
                        data.push(W.CH_LIST[i]);
                    } else if(W.StbConfig.isUHD && W.CH_LIST[i].channelType.code == "16" ) {
                        data.push(W.CH_LIST[i]);
                    }
                }
            }

            _comp.add(new W.Div({text:W.Texts["now"], x:1032, y:321, width:100, textColor:"#C7C7C7", fontFamily:"RixHeadL", "font-size":"18px",
                textAlign:"left", "letter-spacing":"0.18px"}));
            _comp._selectedNumber = new W.Div({text:"", x:900, y:349, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"22px",
                textAlign:"Right", "letter-spacing":"-1.1px"});
            _comp.add(_comp._selectedNumber);
            _comp.add(new W.Div({text:W.Texts["blocked_ch_select"].replace("50", maxSelectCount), x:1004, y:354, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:387, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:435, text:W.Texts["reset"]});
            _comp.add(_comp._btn[1]);
            _this.btn[2] = new Button();
            _comp._btn[2] = _this.btn[2].getComp({x:988, y:483, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[2]);

            _comp._boxArea = new W.Div({x:228, y:226, width:675, height:392, overflow:"hidden"});
            _comp._boxArea._inner = new W.Div({x:0,y:0, width:675});
            _comp._boxArea.add(_comp._boxArea._inner);
            _comp.add(_comp._boxArea);

            _this.box = [], _comp._box = [];

            for(var i = 0; i < data.length; i++) {
                _this.box[i] = new SelectBox();
                _comp._box[i] = _this.box[i].getComp({x:i%3*230, y:Math.floor(i/3)*67, width:214, boldText:util.changeDigit(data[i].channelNum,3), text:data[i].title});
                _comp._boxArea._inner.add(_comp._box[i]);
            }

            if(getPageIndex(data.length-1)+1 > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(getPageIndex(data.length-1)+1, 0, scrollCallback);
                _comp._scroll.setStyle({x:159+5,y:333});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

        };

        var scrollCallback = function(idx) {
            setPage(idx);
            index = 18*pageIndex;
        };

        var getPageIndex = function(idx) {
            return Math.floor(idx/18);
        }

        var setPage = function(idx) {
            pageIndex = idx;
            _comp._boxArea._inner.setY(-67*6*pageIndex);
        }

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            if(_data && _data.data) {
                selectedArray = [];

                var idx;
                for(var i = 0; i < _data.data.blocked.sourceIds.length; i++) {
                    idx = data.findIndex(function(object){return object.sourceId == _data.data.blocked.sourceIds[i]});
                    if(idx > -1) {
                        selectedArray.push(data[idx]);
                        _this.box[idx].setSelected();
                    }
                }
            }

            _this.box[index].setFocus();

            _comp._selectedNumber.setText(selectedArray.length);
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index%3 == 2 || index == data.length-1) {
                            _this.box[index].unFocus();
                            mode = MODE_TYPE.BTN;
                            _this.btn[btnIndex].setFocus();
                        } else {
                            _this.box[index].unFocus();
                            _this.box[++index].setFocus();
                        }
                    } else if(mode == MODE_TYPE.SCROLL) {
                        mode = MODE_TYPE.BOX;
                        if (_this.scroll) _this.scroll.unFocus();
                        _this.box[index].setFocus();
                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index%3 != 0) {
                            _this.box[index].unFocus();
                            _this.box[--index].setFocus();
                        } else {
                            if (_this.scroll) {
                                _this.box[index].unFocus();
                                if (_this.scroll) _this.scroll.setFocus();
                                mode = MODE_TYPE.SCROLL;
                            } else {

                            }
                        }
                    } else if(mode == MODE_TYPE.BTN) {
                        _this.btn[btnIndex].unFocus();
                        mode = MODE_TYPE.BOX;
                        _this.box[index].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[index].unFocus();
                        if(index < 3) {
                            index = (data.length)-(data.length)%3+index;
                            if(index > data.length-1) index = data.length-1;
                        } else {
                            index -= 3;
                        }
                        _this.box[index].setFocus();

                        if(pageIndex != getPageIndex(index)) {
                            setPage(getPageIndex(index));
                            if (_this.scroll) _this.scroll.setPage(pageIndex);
                        }
                    } else if(mode == MODE_TYPE.SCROLL) {
                        if (_this.scroll) _this.scroll.decreaseIndex();
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = btnIndex-1 < 0 ? 2 : btnIndex-1;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[index].unFocus();
                        if(index >= (data.length)-(data.length)%3) {
                            index = 0;
                        } else {
                            index += 3;
                            if(index > data.length-1) {
                                index = data.length-1;
                            }
                        }
                        _this.box[index].setFocus();

                        if(pageIndex != getPageIndex(index)) {
                            setPage(getPageIndex(index));
                            if (_this.scroll) _this.scroll.setPage(pageIndex);
                        }
                    } else if(mode == MODE_TYPE.SCROLL) {
                        if (_this.scroll) _this.scroll.increaseIndex();
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = btnIndex+1 > 2 ? 0 : btnIndex+1;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        if(selectedArray.includes(data[index])) {
                            _this.box[index].unSelected();
                            selectedArray.splice(selectedArray.indexOf(data[index]),1);
                        } else {
                            if(selectedArray.length >= maxSelectCount) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/MessagePopup",
                                    title:W.Texts["popup_zzim_info_title"],
                                    boldText:W.Texts["setting_block_limit"].replace("@max_count@", maxSelectCount),
                                    button:[W.Texts["close"]]}
                                );
                            } else {
                                _this.box[index].setSelected();
                                selectedArray.push(data[index]);
                            }
                        }
                        _comp._selectedNumber.setText(selectedArray.length);
                    } else if(mode == MODE_TYPE.BTN) {
                        if(btnIndex == 0) {
                            var popup = {
                                childComp:_this,
                                popupName:"popup/setting/SelectChannelConfirmPopup",
                                list:selectedArray
                            };
                            W.PopupManager.openPopup(popup);
                            //saveCallback(true, selectedArray);
                        } else if(btnIndex == 1) {
                            for(var i = 0; i< selectedArray.length; i++) {
                                idx = data.findIndex(function(object){return object.sourceId == selectedArray[i].sourceId});
                                if(idx > -1) {
                                    _this.box[idx].unSelected();
                                }
                            }
                            selectedArray = [];
                            _comp._selectedNumber.setText(selectedArray.length);
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
                if (desc.popupName == "popup/setting/SelectChannelConfirmPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        var requestArray = [];
                        for(var i in selectedArray) {
                            requestArray.push(parseInt(selectedArray[i].sourceId));
                        }
                        saveCallback(true, {sourceIds : requestArray, skipUnsubscribed : false});
                    } else if(desc.idx == 2){
                        saveCallback(false);
                    }
                }
            }
        };
        this.componentName = "BlockedChannel";
    }
    return BlockedChannel;
});