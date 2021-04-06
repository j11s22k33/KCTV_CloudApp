W.defineModule("comp/guide/Guide", ["mod/Util", "comp/guide/Table", "comp/guide/Pip"], function (util, Table, Pip) {
    function Guide() {
        var _this;

        var dataManager = W.getModule("manager/SdpDataManager");

        var backCallbackFunc;
        var mode = 0;
        var tops = [412, 188, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [146, 146, 286];

        var index = 0;
        var _menus = [];
        var _comp;

        var channelData;
        var scheduleData;

        var MODE_TYPE = Object.freeze({TABLE: 0, DCA: 1});
        var menuMode = MODE_TYPE.TABLE;

        var chShowingOption = ["All Channels", "Favourite", "Subscribed", "Popular"];
        var chDateOption;
        var chShowingIdx, chDateIdx;

        var REQUEST_HOURS = 6*60*60*1000;
        var MAX_HOURS = 25*60*60*1000;

        var timeUpdateTimer;

        var currentTime;

        var dcaTimer;
        var dcaNumber;
        var dcaIndex = 0;
        var DCA_TIMEOUT = 5000;
        var DCA_HIDE_TIMEOUT = 5000;
        var dcaList = [];
        var isAddedEntryPath = false;

        var changeY = function () {
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y: tops[mode], opacity: opacity[mode]});
        };

        var create = function () {
            if(_comp._inner) {
                _comp.remove(_comp._inner);
                _comp._inner = undefined;
            }
            _comp.setStyle({className:""});
            _comp._inner = new W.Div({});
            //if(_comp._bg) {
            //    _comp.remove(_comp._bg);
            //}
            _comp._bg = new W.Image({
                id: "bottom_bg",
                x: 0,
                y: 0,
                width: "1280px",
                height: "720px",
                src: "img/05_epg_bg.png",
                display: mode == 2 ? "" : "none"
            });
            _comp._inner.add(_comp._bg);

            if(_this.chMode == "FavChannel") {
                _this.table = new Table(channelData, _this, _this.currentChannel.data, true);
            } else {
                _this.table = new Table(channelData, _this, _this.currentChannel.data);
            }
            _comp._table = _this.table.getComp(mode);
            _comp._table.setStyle({x: 53, y: yPos[0]});
            _comp._inner.add(_comp._table);

            _this.pip = new Pip(channelData);
            _comp.pip = _this.pip.getComp(mode);
            _comp.pip.setStyle({x: 53, y: 92});
            _comp._inner.add(_comp.pip);

            _comp._dca_area = new W.Div({
                id: "dca_area",
                x: 840,
                y: 0,
                width: "440px",
                height: "448px",
                display: "none"
            });
            _comp._dca_area.add(new W.Image({x: 0, y: 0, width: 440, height: 448, src: "img/sh_epg_dca.png"}));
            _comp._dca_area.add(new W.Image({x: 927 - 840, y: 0, width: 353, height: 359, src: "img/sh_dca.png"}));
            _comp._dca_area._number = new W.Span({
                text: "",
                x: 948 - 840,
                y: 46,
                width: "257px",
                textColor: "rgba(255,255,255,0.9)",
                fontFamily: "RixHeadM",
                "font-size": "50px",
                textAlign: "right",
                "letter-spacing": "-2.5px"
            });
            _comp._dca_area.add(_comp._dca_area._number);
            _comp._dca_area._list_area = new W.Div({
                x: 948 - 840,
                y: 101,
                width: 274,
                height: 234,
                color: "rgba(0,0,0,0.84)"
            });
            _comp._dca_area._list_area._list = new W.Div({
                x: 989 - 948,
                y: 114 - 101,
                width: 213,
                height: 209,
                overflow: "hidden"
            });
            _comp._dca_area._list_area.add(_comp._dca_area._list_area._list);
            _comp._dca_area._list_area._focus = new W.Div({
                x: 962 - 948,
                y: 112 - 101,
                width: 241,
                height: 45,
                display: "none"
            });
            _comp._dca_area._list_area._focus.add(new W.Div({x: 0, y: 0, width: 241, height: 3, color: "#E53000"}));
            _comp._dca_area._list_area._focus.add(new W.Div({
                x: 0,
                y: 154 - 112,
                width: 241,
                height: 3,
                color: "#E53000"
            }));
            _comp._dca_area._list_area.add(_comp._dca_area._list_area._focus);
            _comp._dca_area._list_area._scroll = new W.Div({
                x: 1211 - 948,
                y: 113 - 101,
                width: 3,
                height: 210,
                display: "none"
            });
            _comp._dca_area._list_area._scroll.add(new W.Div({
                x: 1212 - 1211,
                y: 0,
                width: 1,
                height: 210,
                color: "rgba(131,122,119,0.25)"
            }));
            _comp._dca_area._list_area._scroll._bar = new W.Div({
                x: 0,
                y: 0,
                width: 3,
                height: 210,
                color: "rgba(131,122,119,1)"
            });
            _comp._dca_area._list_area._scroll.add(_comp._dca_area._list_area._scroll._bar);
            _comp._dca_area._list_area.add(_comp._dca_area._list_area._scroll);
            _comp._dca_area.add(_comp._dca_area._list_area);
            _comp._inner.add(_comp._dca_area);

            _comp._title = new W.Div({
                text: _this.category ? _this.category.title : W.Texts["all_channel_schedule"],
                x: 56,
                y: 46,
                width: "400px",
                textColor: "rgba(255,255,255,0.7)",
                fontFamily: "RixHeadM",
                "font-size": "24px",
                textAlign: "left",
                "letter-spacing": "-1.2px",
                display:"none"
            });
            _comp._inner.add(_comp._title);

            _comp._colorkey_area = new W.Div({x: 599, y: 33, width: 600, height: 68, display: "none"});
            _comp._colorkey_area._blue = new W.Div({
                x: 0,
                y: 0,
                width: 110,
                height: 68,
                position: "relative",
                float: "right"
            });
            _comp._colorkey_area._blue.add(new W.Image({x: 0, y: 0, src: "img/color_blue.png"}));
            _comp._colorkey_area._blue.add(new W.Span({
                text: W.Texts["next_page"],
                x: 50,
                y: 16,
                width: "75px",
                textColor: "rgba(255,255,255,0.7)",
                fontFamily: "RixHeadM",
                "font-size": "16px",
                textAlign: "left",
                "letter-spacing": "-0.8px"
            }));
            _comp._colorkey_area.add(_comp._colorkey_area._blue);
            _comp._colorkey_area._green = new W.Div({
                x: 0,
                y: 0,
                width: 105,
                height: 68,
                position: "relative",
                float: "right",
                display: "none"
            });
            _comp._colorkey_area._green.add(new W.Image({x: 0, y: 0, src: "img/color_green.png"}));
            _comp._colorkey_area._green.add(new W.Span({
                text: W.Texts["relation_vod"],
                x: 50,
                y: 16,
                width: "75px",
                textColor: "rgba(255,255,255,0.7)",
                fontFamily: "RixHeadM",
                "font-size": "16px",
                textAlign: "left",
                "letter-spacing": "-0.8px"
            }));
            _comp._colorkey_area.add(_comp._colorkey_area._green);
            _comp._colorkey_area._yellow = new W.Div({
                x: 0,
                y: 0,
                width: 100,
                height: 68,
                position: "relative",
                float: "right"
            });
            _comp._colorkey_area._yellow.add(new W.Image({x: 0, y: 0, src: "img/color_yellow.png"}));
            _comp._colorkey_area._yellow.add(new W.Span({
                text: W.Texts["optionMenu"],
                x: 50,
                y: 16,
                width: "75px",
                textColor: "rgba(255,255,255,0.7)",
                fontFamily: "RixHeadM",
                "font-size": "16px",
                textAlign: "left",
                "letter-spacing": "-0.8px"
            }));
            _comp._colorkey_area.add(_comp._colorkey_area._yellow);
            _comp._colorkey_area._red = new W.Div({
                x: 0,
                y: 0,
                width: 115,
                height: 68,
                position: "relative",
                float: "right"
            });
            _comp._colorkey_area._red.add(new W.Image({x: 0, y: 0, src: "img/color_red.png"}));
            _comp._colorkey_area._red.add(new W.Span({
                text: W.Texts["prev_page"],
                x: 50,
                y: 16,
                width: "75px",
                textColor: "rgba(255,255,255,0.7)",
                fontFamily: "RixHeadM",
                "font-size": "16px",
                textAlign: "left",
                "letter-spacing": "-0.8px"
            }));
            _comp._colorkey_area.add(_comp._colorkey_area._red);

            _comp._inner.add(_comp._colorkey_area);

            currentTime = util.newDate().getTime();

            if (timeUpdateTimer) {
                clearInterval(timeUpdateTimer);
            }
            timeUpdateTimer = setInterval(function () {
                currentTime = util.newDate().getTime();
                _this.table.timeUpdate(currentTime);
                _this.pip.timeUpdate(currentTime);
            }, 1 * 60 * 1000);

            _comp._bottom_bg = new W.Image({
                id: "bottom_bg",
                x: 0,
                y: 613,
                width: "1280px",
                height: "107px",
                src: "img/05_epg_sh_b.png",
                display: "none"
            });
            _comp._inner.add(_comp._bottom_bg);

            _comp.add(_comp._inner);

            _this.changeMode(mode);
        };

        function getFavChannel(){
            var _link = new W.Div({x:0, y:this.isScene?300:200, width:"1280px", height:"300px"});
            _link.add(new W.Span({x:0, y:0, width:"1280px", height:"22px", textColor:"rgb(255,255,255)", textAlign:"center",
                "font-size":"20px", className:"font_rixhead_light", text:W.Texts["no_fav_ch_guide"]}));
            _link.add(new W.Span({x:0, y:62, width:"1280px", height:"22px", textColor:"rgb(237,168,2)", textAlign:"center",
                "font-size":"20px", className:"font_rixhead_light", text:W.Texts["regist_fav_guide"]}));
            if(W.StbConfig.isUHD) {
                _link.add(new W.Image({x:495, y:95, width:"290px", height:"158px", src:"img/image_home_remote_uhd.png"}));
            } else {
                _link.add(new W.Image({x:495, y:95, width:"290px", height:"158px", src:"img/image_home_remote.png"}));
            }

            var regist_fav_key_guide1 = W.Texts["regist_fav_key_guide1"].split("^");
            var regist_fav_key_guide2 = W.Texts["regist_fav_key_guide2"].split("^");

            var no = 0;
            for(var i=0; i < regist_fav_key_guide1.length; i++){
                if(regist_fav_key_guide1[i].indexOf("@img@") > -1){
                    var _tmpDiv = new W.Div({x:248, y:135, width:"250px", height:"19px", textAlign:"right"});
                    _link.add(_tmpDiv);
                    var mixedArr = regist_fav_key_guide1[i].split("@");
                    for(var j=0; j < mixedArr.length; j++){
                        if(mixedArr[j] == "img"){
                            _tmpDiv.add(new W.Image({position:"relative", y:7, width:"65px", height:"65px", src:"img/color_yellow_mini.png",
                                "margin":"-22px"}));
                        }else{
                            _tmpDiv.add(new W.Span({position:"relative", y:-7, height:"19px", textColor:"rgba(255,255,255,0.7)",
                                "font-size":"17px", className:"font_rixhead_light", text:mixedArr[j]}));
                        }
                    }
                }else{
                    _link.add(new W.Span({x:0, y:163, width:"498px", height:"19px", textColor:"rgba(255,255,255,0.7)",
                        "font-size":"17px", className:"font_rixhead_light", text:regist_fav_key_guide1[i], textAlign:"right"}));
                }
                no++;
            }
            _link.add(new W.Span({x:786, y:138, width:"350px", height:"19px", textColor:"rgba(255,255,255,0.7)",
                "font-size":"17px", className:"font_rixhead_light", text:regist_fav_key_guide2[0]}));
            _link.add(new W.Span({x:786, y:163, width:"550px", height:"19px", textColor:"rgba(255,255,255,0.7)",
                "font-size":"17px", className:"font_rixhead_light", text:regist_fav_key_guide2[1]}));
            return _link;
        };


        var getChannelsData = function () {
            if(_this.chMode == "GenreChannel") {
                dataManager.getCategoryChannels(cbChannelsData, {offset:0, limit:0, categoryId:_this.category.categoryId});
            } else {
                dataManager.getChannelRegions(cbChannelsData, {offset: 0, limit: 0, type:W.StbConfig.isUHD ? [2,16,60,61] : [2,60,61]});   //전체채널 리스트
            }
        };

        var cbChannelsData = function (isSuccess, result) {
            if (isSuccess) {
                if (result && result.data && result.data.length > 0) {
                    //W.CH_LIST = channels.data;
                    channelData = result.data;

                    if(_this.readytoCreate) {
                        continueCbChannel();
                    } else {
                        _this.readytoCreate = true;
                    }

                } else {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code: (result && result.error && result.error.code) ? result.error.code : "1001",
                        message : (result && result.error && result.error.message) ? [result.error.message] : null,
            			from : "SDP"
                    });
                }
            } else {
                W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/ErrorPopup",
                    code: (result && result.error && result.error.code) ? result.error.code : null,
                    message : (result && result.error && result.error.message) ? [result.error.message] : null,
        			from : "SDP"
                });
            }
        };

        var continueCbChannel = function() {
            channelData.skippedChannels = [];
            channelData.favoriteChannels = [];
            for(var i = 0; i < channelData.length; i++) {
                if (W.StbConfig.blockedChannelList.sourceIds.includes(parseInt(channelData[i].sourceId))) {
                    channelData[i].isBlocked = true;
                }

                if (W.StbConfig.favoriteChannelList.sourceIds.includes(parseInt(channelData[i].sourceId))) {
                    channelData[i].isFavorite = true;
                    channelData.favoriteChannels.push(channelData[i]);
                }

                if (W.StbConfig.skippedChannelList.sourceIds.includes(parseInt(channelData[i].sourceId))) {
                    channelData[i].isSkipped = true;

                    channelData.skippedChannels.push(channelData[i]);
                    channelData.splice(i,1);
                    i--;
                }
            }

            if(_this.chMode == "FavChannel") {
                channelData = channelData.favoriteChannels;
            }

            var sourceIds = [];
            var startIdx = 0;

            for(var i = 0; i < channelData.length; i++) {
                if(_this.currentChannel.data == channelData[i].sourceId) {
                    startIdx = i - i%5;
                    if(channelData[i].isAdult && _this.currentChannel.extra == "ok") {
                        channelData[i].needOpen = true;
                    }
                }
            }

            if(startIdx > 0) {
                startIdx--;
            }


            for (var i = startIdx; (i < channelData.length && i < startIdx+7); i++) {
                sourceIds.push(channelData[i].sourceId);
            }
            sourceIds.push(channelData[channelData.length-1].sourceId);

            currentTime = util.newDate().getTime();
            getSchedulesData({
                sourceId: sourceIds.toString(),
                startTime: util.newISODateTime(currentTime - currentTime % (30 * 60 * 1000)),
                duration: 6,
                includeNotFinished : true
            }, {startTime: (currentTime - currentTime % (30 * 60 * 1000))});
        }

        var getSchedulesData = function (reqData, param) {
            dataManager.getSchedulesChannelTable(cbSchedulesData, reqData, param);
        };

        var cbSchedulesData = function (isSuccess, schedules, param) {
            if (isSuccess) {
                W.schedules = schedules;
                for (var i = 0; i < channelData.length; i++) {
                    for (var j = 0; j < schedules.data.length; j++) {
                        if (channelData[i].sourceId == schedules.data[j].channel.sourceId) {
                            for(var l = 0; l < schedules.data[j].events.length; l++) {
                                schedules.data[j].events[l].start_time = util.newDate(schedules.data[j].events[l].startTime).getTime();// + timeGap;
                                schedules.data[j].events[l].end_time = util.newDate(schedules.data[j].events[l].endTime).getTime();// + timeGap;
                                schedules.data[j].events[l].sTime = schedules.data[j].events[l].start_time;
                                schedules.data[j].events[l].eTime = schedules.data[j].events[l].end_time;
                                if(schedules.data[j].events[l].title) schedules.data[j].events[l].title =  schedules.data[j].events[l].title.trim();
                            }

                            if(!channelData[i].schedules) {
                                channelData[i].schedules = JSON.parse(JSON.stringify(schedules.data[j].events));
                            } else {

                               /* var now = util.newDate();
                                now = now.getTime() - now.getTime() % (60 * 60 * 1000);
                                var timeGap;
                                var sTime, eTime, hh, mm;
                                for (var k = 0; k < channelData[i].schedules.length; k++) {

                                    channelData[i].schedules[k].start_time = util.newDate(channelData[i].schedules[k].startTime).getTime();// + timeGap;
                                    channelData[i].schedules[k].end_time = util.newDate(channelData[i].schedules[k].endTime).getTime();// + timeGap;

                                    channelData[i].schedules[k].sTime = channelData[i].schedules[k].start_time//.getTime();//((hh != 12) ? hh%12 : 12) + ":" + (mm > 9 ? "" : "0") + mm + (hh > 11 ? " PM" : " AM");
                                    channelData[i].schedules[k].eTime = channelData[i].schedules[k].end_time//.getTime();//((hh != 12) ? hh%12 : 12) + ":" + (mm > 9 ? "" : "0") + mm + (hh > 11 ? " PM" : " AM");
                                }
                                schedules.data.splice(j, 1);
                                j--;*/
                            }


                            if(!schedules.data[j].events || (schedules.data[j].events && schedules.data[j].events.length == 0)) {
                                W.log.info("dummy!!")
                                var dummySc = {
                                    sourceId: channelData[i].sourceId,
                                    startTime: util.newISODateTime(param.startTime),
                                    endTime: util.newISODateTime(param.startTime + REQUEST_HOURS),
                                    start_time: param.startTime,
                                    end_time: param.startTime + REQUEST_HOURS,
                                    title: W.Texts["no_prog_list"]
                                };
                                channelData[i].schedules.push(dummySc);
                            }else if(schedules.data[j].events[0].start_time > param.startTime) {
                                W.log.info("dummy!!")
                                var dummySc = {
                                    sourceId: channelData[i].sourceId,
                                    startTime: util.newISODateTime(param.startTime),
                                    endTime: util.newISODateTime(schedules.data[j].events[0].start_time),
                                    start_time: param.startTime,
                                    end_time: schedules.data[j].events[0].start_time,
                                    title: W.Texts["no_prog_list"]
                                };
                                channelData[i].schedules.push(dummySc);
                            } else if(schedules.data[j].events[schedules.data[j].events.length-1].end_time < (param.startTime + REQUEST_HOURS)) {
                                W.log.info("dummy!!")
                                var dummySc = {
                                    sourceId: channelData[i].sourceId,
                                    startTime: util.newISODateTime(schedules.data[j].events[schedules.data[j].events.length-1].end_time),
                                    endTime: util.newISODateTime(param.startTime + REQUEST_HOURS),
                                    start_time: schedules.data[j].events[schedules.data[j].events.length-1].end_time,
                                    end_time: param.startTime + REQUEST_HOURS,
                                    title: W.Texts["no_prog_list"]
                                };
                                channelData[i].schedules.push(dummySc);
                            }

                            for (var k = 0; k < channelData[i].schedules.length; k++) {
                                for(var l = 0; l < schedules.data[j].events.length; l++) {
                                    if(channelData[i].schedules[k].eventId == schedules.data[j].events[l].eventId &&
                                        channelData[i].schedules[k].startTime == schedules.data[j].events[l].startTime) {
                                        schedules.data[j].events.splice(l, 1);
                                        l--;
                                    }
                                }
                            }

                            channelData[i].schedules = channelData[i].schedules.concat(schedules.data[j].events);

                            channelData[i].schedules.sort(function (a, b) {
                                return a.start_time - b.start_time;
                            });

                            for(var l = 0; l < channelData[i].schedules.length-1; l++) {
                                if(!channelData[i].schedules[l].eventId && !channelData[i].schedules[l+1].eventId) {

                                    if(channelData[i].schedules[l].prCell) {
                                        channelData[i].schedules[l].end_time = channelData[i].schedules[l+1].end_time;
                                        channelData[i].schedules[l].endTime = channelData[i].schedules[l+1].endTime;
                                        channelData[i].schedules[l].eTime = channelData[i].schedules[l+1].eTime;

                                        if(channelData[i].schedules[l].prCell) {
                                            channelData[i].scCell.remove(channelData[i].schedules[l].prCell);
                                            channelData[i].schedules[l].prCell = undefined;
                                        }
                                        if(channelData[i].schedules[l+1].prCell) {
                                            channelData[i].scCell.remove(channelData[i].schedules[l+1].prCell);
                                            channelData[i].schedules[l+1].prCell = undefined;
                                        }

                                        channelData[i].schedules.splice(l+1, 1);
                                    } else if(channelData[i].schedules[l+1].prCell) {
                                        channelData[i].schedules[l+1].start_time = channelData[i].schedules[l].start_time;
                                        channelData[i].schedules[l+1].startTime = channelData[i].schedules[l].startTime;
                                        channelData[i].schedules[l+1].sTime = channelData[i].schedules[l].sTime;

                                        if(channelData[i].schedules[l].prCell) {
                                            channelData[i].scCell.remove(channelData[i].schedules[l].prCell);
                                            channelData[i].schedules[l].prCell = undefined;
                                        }
                                        if(channelData[i].schedules[l+1].prCell) {
                                            channelData[i].scCell.remove(channelData[i].schedules[l+1].prCell);
                                            channelData[i].schedules[l+1].prCell = undefined;
                                        }

                                        channelData[i].schedules.splice(l, 1);
                                        l--;
                                    } else {
                                        channelData[i].schedules[l].end_time = channelData[i].schedules[l+1].end_time;
                                        channelData[i].schedules[l].endTime = channelData[i].schedules[l+1].endTime;
                                        channelData[i].schedules[l].eTime = channelData[i].schedules[l+1].eTime;

                                        if(channelData[i].schedules[l].prCell) {
                                            channelData[i].scCell.remove(channelData[i].schedules[l].prCell);
                                            channelData[i].schedules[l].prCell = undefined;
                                        }
                                        if(channelData[i].schedules[l+1].prCell) {
                                            channelData[i].scCell.remove(channelData[i].schedules[l+1].prCell);
                                            channelData[i].schedules[l+1].prCell = undefined;
                                        }

                                        channelData[i].schedules.splice(l+1, 1);
                                        l--;
                                    }


                                } else if(channelData[i].schedules[l].end_time > channelData[i].schedules[l+1].start_time && !channelData[i].schedules[l].eventId) {
                                    channelData[i].schedules[l].end_time = channelData[i].schedules[l+1].start_time;
                                    if(channelData[i].schedules[l].prCell) {
                                        channelData[i].scCell.remove(channelData[i].schedules[l].prCell);
                                        channelData[i].schedules[l].prCell = undefined;
                                    }
                                } else if(channelData[i].schedules[l].end_time < channelData[i].schedules[l+1].start_time && !channelData[i].schedules[l].eventId) {
                                    channelData[i].schedules[l].end_time = channelData[i].schedules[l+1].start_time;
                                    if(channelData[i].schedules[l].prCell) {
                                        channelData[i].scCell.remove(channelData[i].schedules[l].prCell);
                                        channelData[i].schedules[l].prCell = undefined;
                                    }
                                }
                            }

                            var last = channelData[i].schedules[channelData[i].schedules.length-1];
                            if(last) {
                                if(last.end_time > param.initialTime + MAX_HOURS) {
                                    last.end_time = param.initialTime + MAX_HOURS;
                                    last.endTime = util.newISODateTime(param.initialTime + MAX_HOURS),
                                    last.eTime = param.initialTime + MAX_HOURS;
                                    if(last.prCell) {
                                        channelData[i].scCell.remove(last.prCell);
                                        last.prCell = undefined;
                                    }
                                }
                            }
                        }
                    }

                    var chData = channelData[i];
                    var initialTime = param.startTime;
                    if(chData && chData.schedules) {
                        for (var j = 0; j < chData.schedules.length; j++) {
                            if (chData.schedules[j + 1] && (chData.schedules[j].end_time < chData.schedules[j + 1].start_time)) {
                                W.log.info("dummy!!")
                                var dummySc = {
                                    sourceId: chData.sourceId,
                                    startTime: chData.schedules[j].endTime,
                                    endTime: chData.schedules[j + 1].startTime,
                                    start_time: chData.schedules[j].end_time,
                                    end_time: chData.schedules[j + 1].start_time,
                                    title: W.Texts["no_prog_list"]
                                }

                                chData.schedules.splice(j + 1, 0, dummySc);
                            }

                            if (j == chData.schedules.length - 1 && chData.schedules[j].end_time < initialTime + REQUEST_HOURS) {
                                W.log.info("dummy!!")
                                var dummySc = {
                                    sourceId: chData.sourceId,
                                    startTime: chData.schedules[j].endTime,
                                    endTime: util.newISODateTime(initialTime + REQUEST_HOURS),
                                    start_time: chData.schedules[j].end_time,
                                    end_time: initialTime + REQUEST_HOURS,
                                    title: W.Texts["no_prog_list"]
                                }

                                chData.schedules.splice(j + 1, 0, dummySc);
                            }

                            /*if (j == 0 && chData.schedules[j] && (chData.schedules[j].start_time > initialTime)) {
                                W.log.info("dummy!!")
                                var dummySc = {
                                    sourceId: chData.sourceId,
                                    startTime: util.newISODateTime(initialTime + timelineIdx * (30 * 60 * 1000)),
                                    endTime: chData.schedules[j].startTime,
                                    start_time: initialTime + timelineIdx * (30 * 60 * 1000),
                                    end_time: chData.schedules[j].start_time,
                                    title: W.Texts["no_prog_list"]
                                }

                                chData.schedules.splice(j, 0, dummySc);
                            }*/
                        }
                    }
                }

                if (param && param.callback) {
                    param.callback(null, param.nextAction, param.retryCount);
                } else {
                    create();
                }
            } else {

            }

        };

        var setDCA = function (keyCode) {
            W.log.info("setDCA : " + keyCode);
            var _key = keyCode - 48;
            if (dcaTimer) {
                clearTimeout(dcaTimer);
                dcaTimer = null;
            }
            if (menuMode != MODE_TYPE.DCA) {
                menuMode = MODE_TYPE.DCA;
                dcaNumber = "";

                _comp._dca_area.setStyle({display: "block"});

            }
            if (dcaNumber.length == 3) {
                dcaNumber = "" + _key;
            } else {
                dcaNumber = dcaNumber + _key;
            }

            _comp._dca_area._number.setText(dcaNumber);

            makeDcaList(dcaNumber);

            if (dcaNumber.length == 3) {
                checkChannel(dcaNumber);
            } else {
                dcaTimer = setTimeout(function () {
                    checkChannel(dcaNumber);
                }, DCA_TIMEOUT);
            }
        };

        var makeDcaList = function (inputNumber) {
            if (_comp._dca_area._list_area._list._inner) {
                _comp._dca_area._list_area._list.remove(_comp._dca_area._list_area._list._inner);
            }

            _comp._dca_area._list_area._list._inner = new W.Div({x: 0, y: 0, width: 213});
            _comp._dca_area._list_area._list.add(_comp._dca_area._list_area._list._inner);
            dcaList = [];
            dcaIndex = 0;

            if (inputNumber == "0") {
                for (var i = 0; i < channelData.length; i++) {
                    if (channelData[i].channelNum < 100) {
                        dcaList.push(channelData[i]);
                    }
                }
            } else if (inputNumber == "00") {
                for (var i = 0; i < channelData.length; i++) {
                    if (channelData[i].channelNum < 10) {
                        dcaList.push(channelData[i]);
                    }
                }
            } else {
                var intNumber = Math.floor(inputNumber);
                var intNumberLength = intNumber < 10 ? 1 : (intNumber < 100 ? 2 : 3);

                for (var i = 0; i < channelData.length; i++) {
                    var chNum = channelData[i].channelNum;
                    if (intNumberLength == 1) {
                        if (chNum >= 100) {
                            chNum = Math.floor(chNum / 100);
                        } else if (chNum >= 10) {
                            chNum = Math.floor(chNum / 10);
                        }
                    } else if (intNumberLength == 2) {
                        if (chNum >= 100) {
                            chNum = Math.floor(chNum / 10);
                        }
                    }

                    if (intNumber == chNum) {
                        dcaList.push(channelData[i]);
                    }
                }
            }

            _comp._dca_area._list_area._list._inner._ch = [];
            var chComp;
            for (var i = 0; i < dcaList.length; i++) {
                chComp = new W.Div({position: "relative", width: 213, height: 42});
                chComp._chNum = new W.Div({
                    text: util.changeDigit(dcaList[i].channelNum, 3),
                    x: 0,
                    y: 0,
                    width: 57,
                    height: 42,
                    lineHeight: "42px",
                    textColor: "#FFFFFF",
                    fontFamily: "RixHeadM",
                    "font-size": "20px",
                    textAlign: "left",
                    "letter-spacing": "-1.0px",
                    opacity: 0.6
                });
                chComp.add(chComp._chNum);
                chComp._chName = new W.Div({
                    text: dcaList[i].title,
                    x: 57,
                    y: 0,
                    width: 155,
                    height: 42,
                    lineHeight: "42px",
                    textColor: "#FFFFFF",
                    className: "cut",
                    fontFamily: "RixHeadM",
                    "font-size": "19px",
                    textAlign: "left",
                    "letter-spacing": "-0.95px",
                    opacity: 0.7
                });
                chComp.add(chComp._chName);
                chComp.add(new W.Div({x: 0, y: 41, width: 213, height: 1, color: "rgba(255,255,255,0.1)"}));

                _comp._dca_area._list_area._list._inner._ch[i] = chComp;
                _comp._dca_area._list_area._list._inner.add(chComp);
            }


            if (dcaList.length > 0) {
                _comp._dca_area._list_area._focus.setStyle({display: "block"});
            } else {
                _comp._dca_area._list_area._focus.setStyle({display: "none"});
            }

            if (dcaList.length > 5) {
                _comp._dca_area._list_area._scroll.setStyle({display: "block"});
            } else {
                _comp._dca_area._list_area._scroll.setStyle({display: "none"});
            }

            setDcaFocus();
        };

        var checkChannel = function (chNum) {
            //if(dcaHideTimer) {
            //    clearTimeout(dcaHideTimer);
            //    dcaHideTimer = null;
            //}

            /*for(var i = 0; i < W.CH_LIST.length; i++) {
             if(W.CH_LIST[i].channelNum == chNum) {
             W.log.info("jump to "+chNum);
             //jumpChannel(i);
             hideDCA();
             return;
             }
             }*/
            //_comp._dca_area._info_text.setOpaticy(1);
            //dcaHideTimer = setTimeout(hideDCA, DCA_HIDE_TIMEOUT);

            W.log.info("checkChannel ");
            if (dcaList.length > 0) {
                W.log.info("jumpChannel " + dcaList[dcaIndex]);
                _this.table.jumpChannel(dcaList[dcaIndex], function() {
                    _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                    if(W.StbConfig && W.StbConfig.cugType == "normal" && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                        _comp._colorkey_area._green.setStyle({display:""});
                    } else {
                        _comp._colorkey_area._green.setStyle({display:"none"});
                    }
                });
            }
            hideDCA();
        };

        var hideDCA = function () {
            menuMode = MODE_TYPE.TABLE;

            _comp._dca_area.setStyle({display: "none"});
        };

        var operateDCA = function (event) {
            if (dcaTimer) {
                clearTimeout(dcaTimer);
                dcaTimer = null;
            }
            dcaTimer = setTimeout(function () {
                hideDCA();
            }, DCA_TIMEOUT);

            switch (event.keyCode) {
                case W.KEY.UP:
                    dcaIndex = (dcaIndex == 0 ? dcaList.length - 1 : dcaIndex - 1);
                    setDcaFocus();
                    break;
                case W.KEY.DOWN:
                    dcaIndex = (dcaIndex == dcaList.length - 1 ? 0 : dcaIndex + 1);
                    setDcaFocus();
                    break;
            }
        };

        var setDcaFocus = function () {
            var listLength = dcaList.length;

            var innerY = 0;
            var focusY = 0;
            if (listLength > 5) {
                _comp._dca_area._list_area._scroll._bar.setStyle({
                    y: (210 / listLength) * dcaIndex,
                    height: (210 / listLength)
                });

                if (dcaIndex < 2) {
                    innerY = 0;
                    focusY = 42 * dcaIndex;
                } else if (dcaIndex >= listLength - 2) {
                    innerY = -42 * (listLength - 5);
                    focusY = 42 * (5-(listLength - dcaIndex));
                } else {
                    innerY = -42 * (dcaIndex - 2);
                    focusY = 42 * 2;
                }
            } else {
                focusY = 42 * dcaIndex;
            }
            _comp._dca_area._list_area._focus.setStyle({y: focusY + 11});
            _comp._dca_area._list_area._list._inner.setStyle({y: innerY});
        };

        var openSideOptionPopup = function(){
        	var options = [];
        	var optionIdx = 0;
        	for(var i=0; i < _this.optionList.length; i++){
        		options.push(_this.optionList[i].title);
        		if(_this.category.categoryId == _this.optionList[i].categoryId){
        			optionIdx = i;
        		}
        	}

        	var data = _this.table.getCurrentPr();
            var popupData;
            var isFav = W.StbConfig.favoriteChannelList.sourceIds.includes(parseInt(data.ch.sourceId));
            if (data.isCurrent) {  //현재 프로그램
                popupData = {
                    options: [
                        {
                            name: util.changeDigit(data.ch.channelNum, 3) + " " + data.ch.title, subOptions: [
                            {type: "box", name: isFav ? W.Texts["deregist_fav_ch"] : W.Texts["regist_fav_ch"]},
                            {type: "box", name: W.Texts["prog_detail"]}
                        ]
                        },
                        {
                            name: W.Texts["other_channel_schedule"], subOptions: [
                            {
                                type: "spinner",
                                index: optionIdx,
                                options: options
                            }
                        ]
                        }
                    ]
                };
            } else {      //미래 프로그램
                popupData = {
                    options: [
                        {
                            name: util.changeDigit(data.ch.channelNum, 3) + " " + data.ch.title, subOptions: [
                            {type: "box", name: isFav ? W.Texts["deregist_fav_ch"] : W.Texts["regist_fav_ch"]},
                            {type: "box", name: W.Texts["prog_detail"]},
                            {type: "box", name: util.findReserveProgram(data.pr.sourceId, data.pr.start_time, data.pr.title) ? W.Texts["cancel_rev"] : W.Texts["reservation_prog"]}
                        ]
                        },
                        {
                            name: W.Texts["other_channel_schedule"], subOptions: [
                            {
                                type: "spinner",
                                index: optionIdx,
                                options: options
                            }
                        ]
                        }
                    ]
                };
            }

            if(data.ch.channelType.code == 60) popupData.options[0].subOptions.splice(0,1);
            var popup = {
                popupName: "popup/sideOption/GuideSideOptionPopup",
                optionData: popupData,
                childComp: _this
            };
            W.PopupManager.openPopup(popup);
        };

        function startScene(sceneName, data){
            if(sceneName == "scene/vod/VodDetailScene") {
                var sdpManager = W.getModule("manager/SdpDataManager");
                var reqData = {selector:"isAdult,rating"};
                if(data.seriesId){
                	reqData.seriesId = data.seriesId;
                	sdpManager.getSeriesDetail(function(result,resultData){
                        if(result && resultData.data && resultData.data.length > 0){
                            if((W.StbConfig.adultMenuUse && resultData.data[0].isAdult)
                                || (resultData.data[0].rating && util.getRating() && resultData.data[0].rating >= util.getRating())) {
                                var popup = {
                                    type:"",
                                    popupName:"popup/AdultCheckPopup",
                                    childComp:_this,
                                    param : {sceneName : sceneName}
                                };
                                if(data.seriesId) popup.param.seriesId = data.seriesId;
                                else if(data.assetId) popup.param.assetId = data.assetId;
                                W.PopupManager.openPopup(popup);
                            } else {
                                W.SceneManager.startScene({
                                    sceneName: sceneName,
                                    param: data,
                                    backState: W.SceneManager.BACK_STATE_KEEPHIDE
                                });
                            }
                        } else {
                            W.PopupManager.openPopup({
                                childComp: _this,
                                popupName: "popup/ErrorPopup",
                                code: "0701",
            					from : "SDP"
                            });
                        }
                    }, reqData);
                }else if(data.assetId){
                	reqData.assetId = data.assetId;
                	sdpManager.getDetailAsset(function(result,resultData){
                        if(result && resultData.data && resultData.data.length > 0){
                            if((W.StbConfig.adultMenuUse && resultData.data[0].isAdult)
                                || (resultData.data[0].rating && util.getRating() && resultData.data[0].rating >= util.getRating())) {
                                var popup = {
                                    type:"",
                                    popupName:"popup/AdultCheckPopup",
                                    childComp:_this,
                                    param : {sceneName : sceneName}
                                };
                                if(data.seriesId) popup.param.seriesId = data.seriesId;
                                else if(data.assetId) popup.param.assetId = data.assetId;
                                W.PopupManager.openPopup(popup);
                            } else {
                                W.SceneManager.startScene({
                                    sceneName: sceneName,
                                    param: data,
                                    backState: W.SceneManager.BACK_STATE_KEEPHIDE
                                });
                            }
                        } else {
                            W.PopupManager.openPopup({
                                childComp: _this,
                                popupName: "popup/ErrorPopup",
                                code: "0701",
            					from : "SDP"
                            });
                        }
                    }, reqData);
                }
            } else {
                W.SceneManager.startScene({
                    sceneName: sceneName,
                    param: data,
                    backState: W.SceneManager.BACK_STATE_KEEPHIDE
                });
            }
        };

        function checkFav() {
            if(_this.chMode == "FavChannel" && (!W.StbConfig.favChCount || W.StbConfig.favChCount == 0)) {
                if(_this.isEmptyFav) {

                } else {
                    _this.setEmptyFavList();
                }
                //_this.isEmptyFav = true;
                //_comp._link = getFavChannel();
                //_comp.add(_comp._link);
            } else {
                if(_this.isEmptyFav) {
                    _this.isEmptyFav = false;
                    if(_comp._inner) {
                        _comp.remove(_comp._inner);
                        _comp._inner = undefined;
                    }
                    //if(_comp._link) _comp.remove(_comp._link);
                }
                /*if(!W.CH_LIST) {
                    dataManager.getChannelRegions(function(isSuccess, channels){
                        if(isSuccess) {
                            if(channels && channels.data && channels.data.length > 0) {
                                W.CH_LIST = channels.data;
                            }
                        }
                    }, {offset:0, limit:0});
                }*/

                W.CloudManager.getGridEpg(function(result){
                    W.log.info("getGridEpg Recevied ::: ", new Date().getTime() - result.trId , result);

                    if(result && result.data) {
                        if (result.data.getUserChannel) {
                            W.StbConfig.favoriteChannelList = (result.data.getUserChannel.favorite != undefined) ? result.data.getUserChannel.favorite : {sourceIds:[]};
                            W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                            W.StbConfig.skippedChannelList = (result.data.getUserChannel.skipped != undefined) ? result.data.getUserChannel.skipped : {sourceIds:[], skipUnsubscribed:false};
                            W.StbConfig.blockedChannelList = (result.data.getUserChannel.blocked != undefined) ? result.data.getUserChannel.blocked : {sourceIds:[]};
                        }

                        if (result.data.getReserveList) {
                            W.StbConfig.ReserveProgramList = util.parseReserveProgramList(result.data.getReserveList);
                        } else {
                            W.StbConfig.ReserveProgramList = [];
                        }

                        _this.currentChannel = {data : result.data.getCurrentChannel, extra : result.data.getCurrentPermission};
                    }
                    if(_this.readytoCreate) {
                        continueCbChannel();
                    } else {
                        _this.readytoCreate = true;
                    }
                })

                getChannelsData();

               /* W.CloudManager.getUserChannel(function (callbackData) {
                    W.log.info("getUserChannel Recevied ::: ", new Date().getTime());
                    W.log.info(callbackData);

                    W.CloudManager.getReserveListProgram(function (reserveData) {
                        W.log.info("getReserveListProgram Recevied ::: ", new Date().getTime());
                        W.log.info(reserveData);

                        W.CloudManager.getCurrentChannel(function (currentChannel) {

                        });

                    });

                });*/
            }
        }

        this.getComp = function (callback) {
            if (callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function () {
            //_comp.setVisible(true);
            W.log.info("guide show");
        };
        this.hide = function () {
            _comp.setDisplay("none");
            W.log.info("guide hide");
        };
        this.create = function (_parent_area, _parent, _category, _chMode, _mode) {
        	//full 화면일때 상키 누르면 루핑 되게 수정
            if(_parent && _parent.id =="scene_home/GuideScene") {
                this.isScene = true;
            }
            this.isLoop = true;

            this.chMode = _chMode;
            this.category = _category;
            this.parent = _parent;

            mode = _mode;

            W.log.info("create !!!!");
            //backCallbackFunc = callback;
            _this = this;

            _comp = new W.Div({
                id: "guide_area",
                x: 0,
                y: tops[1],
                width: "1280px",
                height: "720px",
                opacity: opacity[1],
                className : mode == 2 ? "bg_color" : ""
            });

            checkFav();
            W.visibleHomeScene();
            return _comp;
        };
        this.changeMode = function (data) {
            W.log.info("change mode == " + mode);
            mode = data;

            changeY();
            if (mode == 0) {
            } else {
            }

            if (mode == 2) {
            	if(!util.isExistScene("SiteMapScene") && W.SceneManager.getCurrentScene().id.indexOf("GuideScene") == -1){
	            	var bg = document.getElementById("home_bg_img");
	            	var bg2 = document.getElementById("home_bg_img2");
	            	var bg3 = document.getElementById("home_bg_color");
	            	if(bg){
	            		bg.style.display = "none";
	            		bg2.style.display = "none";
	            		bg3.style.display = "none";
	            	}
            	}
                /*if(this.isEmptyFav) {
                    W.SceneManager.startScene({
                        sceneName:"scene/setting/SettingScene",
                        backState:W.SceneManager.BACK_STATE_KEEPHIDE,
                        param:{targetId : "CC1001"}
                    });
                    return;
                }*/

                if(!W.state.isVod && !W.state.isGuide) {
                    if(!W.CloudManager.isNumericKey) {
                        W.CloudManager.addNumericKey();
                    }
                    if(!W.CloudManager.isChannelChangeEvt) {
                        W.CloudManager.addChChangeEvtListener();
                    }
                }

                W.state.isGuide = true;

                if (_this.table) _this.table.setActive();
                if (_this.table) _comp._table.setStyle({y: yPos[mode]});

                if (_this.pip) _this.pip.setActive();
                if (_this.pip) _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                if (_this.pip) _this.pip.setIframe(_this.currentChannel.data, _this.currentChannel.extra);
                if(_this.table) {
                    if(W.StbConfig && W.StbConfig.cugType == "normal" && _this.table.getCurrentPr()
                        && _this.table.getCurrentPr().pr && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                        _comp._colorkey_area._green.setStyle({display:""});
                    } else {
                        _comp._colorkey_area._green.setStyle({display:"none"});
                    }
                }
                if (_comp._bottom_bg) _comp._bottom_bg.setDisplay("block");

                if (_comp._bg) _comp._bg.setDisplay("block");
                if (_comp._colorkey_area) {
                    _comp._colorkey_area.setDisplay("block");

                    if(channelData.length > 5) {
                        _comp._colorkey_area._red.setDisplay("block");
                        _comp._colorkey_area._blue.setDisplay("block");
                    } else {
                        _comp._colorkey_area._red.setDisplay("none");
                        _comp._colorkey_area._blue.setDisplay("none");
                    }
                }
                if (_comp._title) _comp._title.setDisplay("block");
            } else {
            	if(!util.isExistScene("SiteMapScene") && W.SceneManager.getCurrentScene().id.indexOf("GuideScene") == -1){
	            	var bg = document.getElementById("home_bg_img");
	            	var bg2 = document.getElementById("home_bg_img2");
	            	var bg3 = document.getElementById("home_bg_color");
	            	if(bg){
	            		bg.style.display = "block";
	            		bg2.style.display = "block";
	            		bg3.style.display = "block";
	            	}
            	}
            	
                if(!W.state.isVod && W.state.isGuide) {
                    if(W.CloudManager.isNumericKey) {
                        W.CloudManager.delNumericKey();
                    }
                    if(W.CloudManager.isChannelChangeEvt) {
                        W.CloudManager.removeChChangeEvtListener();
                    }
                }
                W.state.isGuide = false;

                if (_this.table) _this.table.deActive();
                if (_this.table) _comp._table.setStyle({y: yPos[mode]});
                if (_this.pip) _this.pip.deActive();
                if (_comp._bottom_bg) _comp._bottom_bg.setDisplay("none");
                if (_comp._bg) _comp._bg.setDisplay("none");
                if (_comp._colorkey_area) _comp._colorkey_area.setDisplay("none");
                if (_comp._title) _comp._title.setDisplay("none");
            }

            if (_this.table) _this.table.changeMode(mode);

        };
        this.channelChange = function (type, data, extra) {
            W.log.info("type ==== " + type); //channelChanged, permUpdated
            W.log.info(data);

            if(type == "channelChanged") {
                if(_this.pip) _this.pip.setIframe(data, extra);

                if(!_this.prevChannel || _this.prevChannel.data != _this.currentChannel.data) {
                    _this.prevChannel = {data : _this.currentChannel.data, extra : _this.currentChannel.extra};
                }

                _this.currentChannel = {data : data, extra : extra};

                if(_this.prevChannel.data != _this.currentChannel.data) {
                    var prevChObj = util.findChannelbySrcId(_this.prevChannel.data, channelData);
                    if(prevChObj && prevChObj.isAdult) {
                        if(prevChObj.needOpen) {
                            prevChObj.needOpen = undefined;
                            if(_this.table) _this.table.removeScCell(prevChObj);
                            needCheckCell = true;
                        }
                    }
                }
                if(needCheckCell && _this.table) _this.table.checkCell();
            } else if(type == "permUpdated") {
                var needCheckCell;
                if(_this.pip) _this.pip.setIframe(data.srcId, data.perm);
                _this.currentChannel = {data : data.srcId, extra : data.perm};

                if(_this.prevChannel.data != _this.currentChannel.data) {
                    var needCheckCell;

                    var currentChObj = util.findChannelbySrcId(_this.currentChannel.data, channelData);
                    if(currentChObj && currentChObj.isAdult) {
                        if(_this.currentChannel.extra == "ok") {
                            if(!currentChObj.needOpen) {
                                currentChObj.needOpen = true;
                                if(_this.table) _this.table.removeScCell(currentChObj);
                                needCheckCell = true;
                            }
                        } else {
                            if(currentChObj.needOpen) {
                                currentChObj.needOpen = undefined;
                                if(_this.table) _this.table.removeScCell(currentChObj);
                                needCheckCell = true;
                            }
                        }
                    }
                }

                if(needCheckCell && _this.table) _this.table.checkCell();
            }

        };
        this.hasList = function () {
            if(this.isEmptyFav) return false;
            else return true;
        };
        this.getSchedulesData = function(reqData, param) {
            getSchedulesData(reqData, param);
        };
        this.setEmptyFavList = function() {
            this.isEmptyFav = true;
            if(_comp._inner) {
                _comp.remove(_comp._inner);
                _comp._inner = undefined;
            }
            //if(_comp._bg) _comp.remove(_comp._bg);
            //if(_comp._table) _comp.remove(_comp._table);
            //if(_comp.pip) _comp.remove(_comp.pip);
            //if(_comp._dca_area) _comp.remove(_comp._dca_area);
            //if(_comp._title) _comp.remove(_comp._title);
            //if(_comp._colorkey_area) _comp.remove(_comp._colorkey_area);
            //if(_comp._bottom_bg) _comp.remove(_comp._bottom_bg);

            _comp._inner = new W.Div({});

            _comp._bg = new W.Div({className : "bg_size bg_color"});
            _comp._inner.add(_comp._bg);

            _comp._link = getFavChannel();
            _comp._inner.add(_comp._link);

            _comp.add(_comp._inner);

            if(_this.parent.jumpMenu) _this.parent.jumpMenu();
        };
        this.operate = function (event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if (menuMode == MODE_TYPE.DCA) break;
                    _this.table.operate(event);
                    _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                    if(W.StbConfig && W.StbConfig.cugType == "normal" && _this.table.getCurrentPr()
                        && _this.table.getCurrentPr().pr && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                        _comp._colorkey_area._green.setStyle({display:""});
                    } else {
                        _comp._colorkey_area._green.setStyle({display:"none"});
                    }
                    return true;
                    break;
                case W.KEY.LEFT:
                    if (menuMode == MODE_TYPE.DCA) break;
                    _this.table.operate(event);
                    _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                    if(W.StbConfig && W.StbConfig.cugType == "normal" && _this.table.getCurrentPr()
                        && _this.table.getCurrentPr().pr && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                        _comp._colorkey_area._green.setStyle({display:""});
                    } else {
                        _comp._colorkey_area._green.setStyle({display:"none"});
                    }
                    return true;
                    break;
                case W.KEY.UP:
                    if (menuMode == MODE_TYPE.DCA) {
                        if (dcaList.length > 0) {
                            operateDCA(event);
                        }
                        return true;
                    }
                    var _return = _this.table.operate(event);
                    _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                    if(W.StbConfig && W.StbConfig.cugType == "normal" && _this.table.getCurrentPr()
                        && _this.table.getCurrentPr().pr && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                        _comp._colorkey_area._green.setStyle({display:""});
                    } else {
                        _comp._colorkey_area._green.setStyle({display:"none"});
                    }
                    return _return;
                    break;
                case W.KEY.DOWN:
                    if (menuMode == MODE_TYPE.DCA) {
                        if (dcaList.length > 0) {
                            operateDCA(event);
                        }
                        return true;
                    }
                    _this.table.operate(event);
                    _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                    if(W.StbConfig && W.StbConfig.cugType == "normal" && _this.table.getCurrentPr()
                        && _this.table.getCurrentPr().pr && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                        _comp._colorkey_area._green.setStyle({display:""});
                    } else {
                        _comp._colorkey_area._green.setStyle({display:"none"});
                    }
                    return true;
                    break;
                case W.KEY.ENTER:
                    if (menuMode == MODE_TYPE.DCA) {
                        if (dcaTimer) {
                            clearTimeout(dcaTimer);
                            dcaTimer = null;
                        }
                        checkChannel(dcaNumber);
                    } else {
                        var _return = _this.table.operate(event);
                        return _return;
                    }
                    break;
                case W.KEY.BACK:
                    if (menuMode == MODE_TYPE.DCA) {
                        if (dcaTimer) {
                            clearTimeout(dcaTimer);
                            dcaTimer = null;
                        }
                        hideDCA();
                        return true;
                    } else {
                        var _return = _this.table.operate(event);
                        if (backCallbackFunc) backCallbackFunc();
                        return _return;
                    }
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
                    setDCA(event.keyCode);
                    break;
                case W.KEY.COLOR_KEY_Y:
                	if(_this.optionList){
                		openSideOptionPopup();
                	}else{
                		var reqData = {menuType:"MC0002", selector:"categoryId,title,categoryCode"};
                        dataManager.getChildMenuTree(function(result, menuData){
                        	if(result && menuData.total > 0){
                        		_this.optionList = menuData.data;
                        	}else{
                        		_this.optionList = [];
                        	}
                        	openSideOptionPopup();
                        }, reqData);
                	}
                    break;
                case W.KEY.COLOR_KEY_G:
                    if(W.StbConfig && W.StbConfig.cugType != "accommodation"){
                        var data = _this.table.getCurrentPr();
                        if(data.pr.seriesId){
                            W.entryPath.push("relationVodSchedule.seriesId", data.pr.seriesId, "Guide");
                            isAddedEntryPath = true;
                            startScene("scene/vod/VodDetailScene", {seriesId: data.pr.seriesId});
                        } else if(data.pr.assetId){
                        	W.entryPath.push("relationVodSchedule.assetId", data.pr.assetId, "Guide");
                        	isAddedEntryPath = true;
                        	startScene("scene/vod/VodDetailScene", {assetId: data.pr.assetId});
                        }
                            

                    }
                    /*_this.table.hideNow();
                    if (data.isCurrent) {
                        var popup = {
                            popupName: "popup/guide/MoreInfoPopup",
                            data: data,
                            childComp: _this
                        };
                    } else {
                        if(data.pr.end_time < currentTime) {
                            var popup = {
                                popupName: "popup/guide/PastMoreInfoPopup",
                                data: data,
                                childComp: _this
                            };
                        } else {
                            var popup = {
                                popupName: "popup/guide/FutureMoreInfoPopup",
                                data: data,
                                childComp: _this
                            };
                        }
                    }

                    W.PopupManager.openPopup(popup);*/
                    break;
                case W.KEY.COLOR_KEY_R:
                    _this.table.gotoPrevPage(function() {
                        _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                        if(W.StbConfig && W.StbConfig.cugType == "normal" && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                            _comp._colorkey_area._green.setStyle({display:""});
                        } else {
                            _comp._colorkey_area._green.setStyle({display:"none"});
                        }
                    });
                    break;
                case W.KEY.COLOR_KEY_B:
                    _this.table.gotoNextPage(function() {
                        _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                        if(W.StbConfig && W.StbConfig.cugType == "normal" && (_this.table.getCurrentPr().pr.seriesId || _this.table.getCurrentPr().pr.assetId)) {
                            _comp._colorkey_area._green.setStyle({display:""});
                        } else {
                            _comp._colorkey_area._green.setStyle({display:"none"});
                        }
                    });
                    break;
            }

        };
        this.pause = function() {
            if (mode == 2) {
                W.state.isGuide = false;

                if(!W.state.isVod) {
                    if (W.CloudManager.isNumericKey) {
                        W.CloudManager.delNumericKey();
                    }
                    if (W.CloudManager.isChannelChangeEvt) {
                        W.CloudManager.removeChChangeEvtListener();
                    }
                }

                if (_this.pip) _this.pip.deActive();
            }
        }
        this.resume = function() {
            W.log.info("Guide Resume!!");
            //checkFav();
            if(isAddedEntryPath){
                W.entryPath.pop();
                isAddedEntryPath = false;
            }
            if (mode == 2) {
                W.state.isGuide = true;
                if(!W.state.isVod) {
                    if (!W.CloudManager.isNumericKey) {
                        W.CloudManager.addNumericKey();
                    }
                    if (!W.CloudManager.isChannelChangeEvt) {
                        W.CloudManager.addChChangeEvtListener();
                    }
                }
                if (_this.pip) _this.pip.setActive();
                if (_this.pip) _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                if (_this.pip) _this.pip.setIframe(_this.currentChannel.data, _this.currentChannel.extra);
            }
        }
        this.refresh = function() {
            W.log.info("Guide refresh!!");
            checkFav();
        }
        this.destroy = function () {

            W.state.isGuide = false;
            if(!W.state.isVod) {
                if (W.CloudManager.isNumericKey) {
                    W.CloudManager.delNumericKey();
                }
                if (W.CloudManager.isChannelChangeEvt) {
                    W.CloudManager.removeChChangeEvtListener();
                }
            }
            if (_this.pip) _this.pip.deActive();
            _comp = null;
            index = 0;
            _menus = [];
            //_comp = ;

            //_menu_area.remove(_menu_area._info);
            W.log.info("destroy !!!!");

            if (timeUpdateTimer) {
                clearInterval(timeUpdateTimer);
            }
            
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.getMode = function () {
            return mode;
        };
        this.componentName = "Guide";
        this.onPopupClosed = function (popup, desc) {
            W.log.info("onPopupClosed ");
            W.log.info(popup, desc);
            if (desc && desc.popupName == "popup/sideOption/GuideSideOptionPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    if (desc.param.option == 0) {
                        if (desc.param.subOptions == 0) {
                            _this.table.toggleFavCh();
                        } else if(desc.param.subOptions == 1) {
                            var data = _this.table.getCurrentPr();

                            if (data.isCurrent) {
                                var popup = {
                                    popupName: "popup/guide/MoreInfoPopup",
                                    data: data,
                                    childComp: _this
                                };
                            } else {
                                if(data.pr.end_time < currentTime) {
                                    var popup = {
                                        popupName: "popup/guide/PastMoreInfoPopup",
                                        data: data,
                                        childComp: _this
                                    };
                                } else {
                                    var popup = {
                                        popupName: "popup/guide/FutureMoreInfoPopup",
                                        data: data,
                                        childComp: _this
                                    };
                                }
                            }
                            W.PopupManager.openPopup(popup);
                        } else if(desc.param.subOptions == 2) {
                            _this.table.toggleReserve(null, function() {
                                if (_this.pip) _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                            });
                        }
                    }else if (desc.param.option == 1) {
                        if (desc.param.subOptions == 0) {
                        	var targetCategory = _this.optionList[desc.param.value];
                        	if(_this.isScene){
                                var sceneName, sceneParam;
                                if(targetCategory.categoryCode == "CC0205"){
                                    sceneName = "scene/home/ReservedProgramListScene";
                                    sceneParam = targetCategory;
                                }else{
                                    sceneName = "scene/home/GuideScene";
                                    sceneParam = {category : targetCategory};
                                }

                                W.SceneManager.startScene({
                                    sceneName: sceneName,
                                    param: sceneParam,
                                    backState: W.SceneManager.BACK_STATE_DESTROY
                                });
                        	}else{
                        		_this.parent.jumpMenu(targetCategory.categoryId);
                        	}
                        }
                    }
                }
            } else if (desc && desc.popupName == "popup/guide/MoreInfoPopup") {
                _this.table.showNow();
                if (desc.action == W.PopupManager.ACTION_OK) {

                    if(desc.type == "search") {
                    	W.entryPath.push("searchSchedule.keyword", desc.data, "Guide");
                    	isAddedEntryPath = true;
                        startScene("scene/search/SearchResultScene", desc.data);
                    } else if(desc.type == "tune") {
                        //_this.table.jumpChannel(desc.data, function() {
                           // _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                        //});

                        if(W.state.isVod){
                            W.PopupManager.openPopup({
                                title:W.Texts["popup_zzim_info_title"],
                                popupName:"popup/AlertPopup",
                                boldText:W.Texts["vod_alert_msg"],
                                thinText:W.Texts["vod_alert_msg2"]}
                            );
                        } else {
                            W.CloudManager.getCurrentChannel(function (callbackData) {
                                _this.currentChannel = callbackData;
                                if (callbackData.data == desc.data.ch.sourceId) {
                                    W.CloudManager.closeApp();
                                } else {
                                    if(W.state.isVod){
                                        W.PopupManager.openPopup({
                                            title:W.Texts["popup_zzim_info_title"],
                                            popupName:"popup/AlertPopup",
                                            boldText:W.Texts["vod_alert_msg"],
                                            thinText:W.Texts["vod_alert_msg2"]}
                                        );
                                    }else{
                                        if(_this.pip) _this.pip.setIframe(data, extra);
                                        _this.prevChannel = {data : _this.currentChannel.data, extra : _this.currentChannel.extra};
                                        W.CloudManager.changeChannel(function (callbackData) {
                                            //_this.currentChannel = callbackData;
                                        }, parseInt(desc.data.ch.sourceId));
                                    }
                                }
                            });
                        }

                    } else if(desc.type == "vod") {
                        var param = {};
                        if(desc.data.pr.seriesId) param.seriesId = desc.data.pr.seriesId;
                        else if(desc.data.pr.assetId) param.assetId = desc.data.pr.assetId;
                        startScene("scene/vod/VodDetailScene", param);
                    }
                }
            } else if (desc && desc.popupName == "popup/guide/FutureMoreInfoPopup") {
                _this.table.showNow();
                if (desc.action == W.PopupManager.ACTION_OK) {

                    if(desc.type == "search") {
                    	W.entryPath.push("searchSchedule.keyword", desc.data, "Guide");
                    	isAddedEntryPath = true;
                        startScene("scene/search/SearchResultScene", desc.data);
                    } else if(desc.type == "reserve") {
                        _this.table.toggleReserve(null, function() {
                            if (_this.pip) _this.pip.setPr(_this.table.getCurrentPr(), currentTime);
                        });
                    } else if(desc.type == "vod") {
                        var param = {};
                        if(desc.data.pr.seriesId) param.seriesId = desc.data.pr.seriesId;
                        else if(desc.data.pr.assetId) param.assetId = desc.data.pr.assetId;
                        startScene("scene/vod/VodDetailScene", param);
                    }
                }
            } else if (desc && desc.popupName == "popup/guide/PastMoreInfoPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    if(desc.type == "search") {
                    	W.entryPath.push("searchSchedule.keyword", desc.data, "Guide");
                    	isAddedEntryPath = true;
                        startScene("scene/search/SearchResultScene", desc.data);
                    } else if(desc.type == "vod") {
                        var param = {};
                        if(desc.data.pr.seriesId) param.seriesId = desc.data.pr.seriesId;
                        else if(desc.data.pr.assetId) param.assetId = desc.data.pr.assetId;
                        startScene("scene/vod/VodDetailScene", param);
                    }
                }
            } else if (desc.popupName == "popup/AdultCheckPopup") {
                if (desc.action == W.PopupManager.ACTION_OK) {
                    W.log.info(popup, desc)

                    var data = desc.param;

                    var param = {};
                    if(data.seriesId) param.seriesId = data.seriesId;
                    else if(data.assetId) param.assetId = data.assetId;
                    W.SceneManager.startScene({
                        sceneName: data.sceneName,
                        param: param,
                        backState: W.SceneManager.BACK_STATE_KEEPHIDE
                    });
                }
            }
        };
    }

    return {
        getNewComp: function () {
            return new Guide();
        }
    }

});