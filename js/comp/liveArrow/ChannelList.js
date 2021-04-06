W.defineModule(["mod/Util", "comp/liveArrow/Channel"], function(util, Channel) {
    function ChannelList(_type, _channelData) {
        var _this = this;

        var backCallbackFunc;
        var mode = 0;
        var tops = [402, 188, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var type;
        var posterType;
        var posterGapX, posterGapY;

        var index = 0;
        var _comp;

        var data, bannerData;

        var COLUMN_COUNT = 7;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        //var BANNER_TYPE = Object.freeze({NONE:0, TYPE_1:1, TYPE_2:2, TYPE_3:3, TYPE_4:4, TYPE_5:5});
        var MODE_TYPE = Object.freeze({POSTER:0, BANNER:1});

        var create = function(){
            type = _type;

            _this.channelIndex = 0;
            _this.pageIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({});
            _comp._innerDiv = new W.Div({});

            _this.channels = [];
            _comp._channelComp = [];

            data = _channelData;

            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                _this.channels[i] = new Channel(type, data[i], i);

                _comp._channelComp[i] = _this.channels[i].getComp();
                _comp._channelComp[i].setStyle({y:i*125});

                _comp._innerDiv.add(_comp._channelComp[i]);
            }
            _comp.add(_comp._innerDiv);
        };

        var unFocus = function(idx) {
            if(_this.channels && _this.channels[idx]) _this.channels[idx].unFocus();
        };

        var setFocus = function(idx) {
            if(_this.channels && _this.channels[idx]) _this.channels[idx].setFocus();
        };

        var unFocusAll = function() {
            if(_this.channels && _this.channels.length > 0) {
                for(var i = 0; i < _this.channels.length; i++) {
                    unFocus(i);
                }
            }
        }

        var setActive = function() {
            _this.isActive = true;
            setFocus(_this.channelIndex);
        };

        var deActive = function() {
            _this.isActive = false;
            unFocusAll();
        };

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    return true;
                    break;
                case W.KEY.LEFT:
                    return false;
                    break;
                case W.KEY.UP:
                    unFocus(_this.channelIndex);
                    if(_this.channelIndex == 0) {
                        _this.channelIndex = _this.channels.length-1;

                    } else {
                        _this.channelIndex--;
                    }

                    setPage(Math.floor(_this.channelIndex/4));
                    setFocus(_this.channelIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.channelIndex);
                    if(_this.channelIndex == _this.channels.length-1) {
                        _this.channelIndex = 0;

                    } else {
                        _this.channelIndex++;
                    }

                    setPage(Math.floor(_this.channelIndex/4));
                    setFocus(_this.channelIndex);
                    break;
                case W.KEY.ENTER:
                    //W.CloudManager.getCurrentChannel(function (callbackData) {
                    //    if (callbackData.data == data[_this.channelIndex].channelSrcId) {
                    //        //클라우드 종료
                    //    } else {
                        	if(W.state.isVod){
                				W.PopupManager.openPopup({
                                    title:W.Texts["popup_zzim_info_title"],
                                    popupName:"popup/AlertPopup",
                                    boldText:W.Texts["vod_alert_msg"],
                                    thinText:W.Texts["vod_alert_msg2"]}
                                );
                			}else{
                                W.CloudManager.changeChannel(function () {

                                }, parseInt(data[_this.channelIndex].channelSrcId));
                			}
                    //    }
                    //});
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.pageIndex = idx;
                if(isForced) _this.channelIndex = 0;
                _comp._innerDiv.setY(_this.pageIndex*-500);
            }
        }

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.getPageIdx = function() {
            return _this.pageIndex;
        };

        this.getTotalPage = function() {
            return Math.floor((_this.channels.length-1)/4)+1;
        }

        this.setFocus = function(idx) {
            setFocus(idx);
        };

        this.unFocus = function(idx) {
            unFocus(idx);
        };

        this.unFocusAll = function() {
            unFocusAll();
        };

        this.setActive = function() {
            setActive();
        };

        this.deActive = function() {
            deActive();
        };

        this.getComp = function() {
            if(!_comp) create();
            return _comp;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                case W.KEY.UP:
                case W.KEY.DOWN:
                case W.KEY.ENTER:
                    return operateList(event);
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
                case W.KEY.KEY_OPTION:
                    break;
            }

        };
        this.componentName = "ChannelList";
    }
    ChannelList.TYPE = Channel.TYPE;
    return ChannelList;
});