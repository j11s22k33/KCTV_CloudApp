W.defineModule("comp/guide/ReservedProgramList", ["mod/Util", "comp/guide/ProgramList", "comp/Scroll", "comp/setting/Button"], function(util, ProgramList, Scroll, Button) {
    function ReservedProgramList() {
        var _this;
        var dataManager = W.getModule("manager/SdpDataManager");

        var backCallbackFunc;
        var mode = 0;
        var playMode = 0;
        var tops = [475, 255, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var blankHeight = [120, 310, 550];

        var index = 0;
        var btnIdx = 0;
        var _comp;
        var _reservedProgramListDiv;

        var assetsData;

        var hasList;

        var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1, BUTTON:2});

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_reservedProgramListDiv, {y:tops[mode], opacity : opacity[mode]});
            if(!hasList && _comp && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
        };

        var create = function(_assetsData){
            if(_comp) {
                _reservedProgramListDiv.remove(_comp);
            }
            _comp = new W.Div({});
            if(!_assetsData || _assetsData.length < 1) {
                hasList = false;
                _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[mode], display:"-webkit-flex", "-webkit-flex-direction":"column", "-webkit-align-items":"center","-webkit-justify-content":"center"});
                _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_reserved_prog_list"], lineHeight:"22px", className:"cut", "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
                _comp._blankMsg.add(_comp._blankMsg._span1);
                //_comp._blankMsg._span2 = new W.Div({position:"relative", text:data.category, "word-break":"break-all", lineHeight:"21px", "white-space":"pre-line", textColor:"#DABC74", opacity:0.65, fontFamily:"RixHeadL", "font-size":"14px", textAlign:"center"});
                //_comp._blankMsg.add(_comp._blankMsg._span2);
                _comp.add(_comp._blankMsg);
                _reservedProgramListDiv.add(_comp);
                if(_this.parent.jumpMenu) _this.parent.jumpMenu();
                return;
            } else {
                hasList = true;
            }
            _this.mode = MODE_TYPE.LIST;

            _assetsData.sort(function (a, b) {
                return a.startTime - b.startTime;
            });


            _this.posterList = new ProgramList({type:ProgramList.TYPE.RESERVED, data:_assetsData, isLooping: _this.param.isLooping});
            _comp._posterList = _this.posterList.getComp();
            _comp._posterList.setStyle({x:129, y:108});
            _comp.add(_comp._posterList);

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x:49+5, y:270, display:mode==2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

            // _comp.add(new W.Div({text:"현재", x:1032, y:321, width:100, textColor:"#C7C7C7", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"0.18px"}));
            // _comp._selectedNumber = new W.Div({text:"", x:900, y:349, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"22px", textAlign:"Right", "letter-spacing":"-1.1px"});
            // _comp.add(_comp._selectedNumber);
            //_comp.add(new W.Div({text:"개 선택(최대 150개)", x:1004, y:354, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));


            //_this.posterList.setActive();
            _this.changeMode(mode);
            if(_this.parent.jumpMenu) _this.parent.jumpMenu();
            _reservedProgramListDiv.add(_comp);
        };

        var unFocus = function() {
        };

        var setFocus = function() {
        };

        var getAssetsData = function(param) {

            W.CloudManager.getReserveListProgram(cbGetAssetsData);
        };

        var cbGetAssetsData = function(result) {
            if(result) {

                W.log.info("getReserveListProgram Recevied ::: ");
                W.log.info(result);

                if (result.data) {
                    W.StbConfig.ReserveProgramList = util.parseReserveProgramList(result.data);
                } else {
                    W.StbConfig.ReserveProgramList = [];
                }

                assetsData = W.StbConfig.ReserveProgramList;
                create(assetsData);
            } else {

            }
        };

        var scrollCallback = function(idx) {
            _this.posterList.setPage(idx);
        };

        this.getComp = function(callback) {
                if(callback) backCallbackFunc = callback;
                return _comp;
        };
        this.show = function() {
                //_comp.setVisible(true);
                W.log.info(this.componentName + " show");

                _comp.setDisplay("block");
        };
        this.hide = function() {
                _comp.setDisplay("none");
                W.log.info(this.componentName + " hide");
        };
        this.create = function(_parent_area, _parent, _param) {
                W.log.info(this.componentName + " create !!!!");
                _this = this;
                _this.param = _param ? _param : {};
                _this.parent = _parent;
                mode = _this.param.mode ? _this.param.mode : 0;
            _reservedProgramListDiv = new W.Div({id:"reseved_program_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            if(!W.CH_LIST) {
                dataManager.getChannelRegions(function(isSuccess, channels){
                    if(isSuccess) {
                        if(channels && channels.data && channels.data.length > 0) {
                            W.CH_LIST = channels.data;
                        }
                    }
                    getAssetsData(_param);
                }, {offset:0, limit:0});
            } else {
                getAssetsData(_param);
            }
            return _reservedProgramListDiv;
        };
        this.changeMode = function(data){
                mode = data;
                changeY();

                if(mode == 2){
                    if(_this.posterList) _this.posterList.setActive();
                    if(_this.scroll) _this.scroll.setActive();

                } else {
                    if(_this.posterList) _this.posterList.deActive();
                    if(_this.scroll) _this.scroll.deActive();

                }
                W.visibleHomeScene();
        };
        this.hasList = function(){
                return hasList;
        };
        this.operate = function(event) {
                W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                        if(_this.mode == MODE_TYPE.LIST) {
                        } else if(_this.mode == MODE_TYPE.SCROLL){
                            _this.posterList.setActive();
                            _this.mode = MODE_TYPE.LIST;
                            if (_this.scroll) _this.scroll.unFocus();
                            return true;
                        }
                        break;
                    case W.KEY.LEFT:
                        if(_this.mode == MODE_TYPE.LIST) {
                            if(_this.posterList.operate(event)) {
                                return true;
                            } else {
                                if (_this.scroll) {
                                    _this.posterList.deActive();
                                    _this.mode = MODE_TYPE.SCROLL;
                                    if (_this.scroll) _this.scroll.setFocus();
                                } else {
                                    _this.posterList.setActive();
                                }
                                return true;
                            }
                        }
                        break;
                    case W.KEY.UP:
                        if(_this.mode == MODE_TYPE.LIST) {
                            var returnVal = _this.posterList.operate(event);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                            return returnVal;
                        } else if(_this.mode == MODE_TYPE.SCROLL){
                            if (_this.scroll) _this.scroll.decreaseIndex();
                            return true;
                        }
                        break;
                    case W.KEY.DOWN:
                        if(_this.mode == MODE_TYPE.LIST) {
                            _this.posterList.operate(event);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                            return true;
                        } else if(_this.mode == MODE_TYPE.SCROLL){
                            if (_this.scroll) _this.scroll.increaseIndex();
                            return true;
                        }
                        break;
                    case W.KEY.ENTER:
                        break;
                    case W.KEY.BACK:
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
                        if(hasList) {
                            var popupData = {options:[
                                {name:undefined, subOptions : [
                                    {type:"box", name:W.Texts["cancel_rev"]}
                                ]}/*,
                                 {name:undefined, subOptions : [
                                 {type:"box", name:W.Texts["prog_detail"]}
                                 ]}*/
                            ]};
                            var popup = {
                                popupName:"popup/sideOption/GuideSideOptionPopup",
                                optionData:popupData,
                                childComp : _this
                            };
                            W.PopupManager.openPopup(popup);
                        }
                        break;
                }

        };
        this.destroy = function() {
                W.log.info(this.componentName + " destroy !!!!");
        };
        this.getMode = function(){
                return mode;
        };
        this.componentName = "ReservedProgramList";
        this.onPopupClosed = function (popup, desc) {
            W.log.info("onPopupClosed ");
            W.log.info(popup, desc);
            if (desc && desc.popupName == "popup/sideOption/GuideSideOptionPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    if (desc.param.option == 0) {
                        var currentPr = _this.posterList.getCurrentData();
                        W.log.info(currentPr)
                        W.CloudManager.removeReserveProgram(function(result) {
                            if(result && result.data == "OK" ) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["program_reserve_removed"]}
                                );
                                getAssetsData(_this.param);
                            }
                        }, currentPr.sourceId, currentPr.eventId, currentPr.title, currentPr.startTime,
                        currentPr.endTime, util.prRatingtoStb(currentPr.rating));


                    }else if (desc.param.option == 1) {
                        var currentPr = _this.posterList.getCurrentData();
                        dataManager.getSchedulesDetail(function(isSusccess, result) {

                            if(result && result.data && result.data.length > 0) {
                                if(result.data[0].title) result.data[0].title = result.data[0].title.trim();
                                var popup = {
                                    popupName: "popup/guide/FutureMoreInfoPopup",
                                    data: {pr : result.data[0], ch : util.findChannelbySrcId(currentPr.sourceId)},
                                    childComp: _this
                                };

                                W.PopupManager.openPopup(popup);
                            }

                        }, {sourceId : currentPr.sourceId, eventId : currentPr.eventId});

                    }
                }
            }
        };
    }

    return {
        getNewComp: function(){
            return new ReservedProgramList();
        }
    }

});