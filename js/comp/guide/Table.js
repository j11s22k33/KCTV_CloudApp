W.defineModule("comp/guide/Table", ["mod/Util"], function (util) {
    function Table(data, parent, currentCh, isFav) {
        var _this = this;

        var mode = 0;

        var visibleRowCount = [7, 7, 7];

        var PRCELL_NORMAL_COLOR = "rgba(255,255,255,0.08)";
        var PRCELL_CURRENT_COLOR = "rgba(255,255,255,0.25)";
        var PRCELL_FOCUS_COLOR = "rgba(229,48,0,1)";

        var index = 0;
        var _menus = [];
        var _comp;

        var channelData = data;

        var chIdx;
        var topChIdx;
        var prIdx;

        var pageIdx;

        var timelineIdx;
        var currentTime; // actual real time
        var initialTime;

        var standardTimelineIdx;

        var cellArray;
        var timeLineArray;

        var REQUEST_HOURS = 6*60*60*1000;
        var MAX_HOURS = 25*60*60*1000;

        var MODE_CELL = 0, MODE_DCA = 1;
        var menuMode = MODE_CELL;
        var CELL_CH = 1, CELL_PR = 0;
        var cellMode = CELL_PR;

        var timelineUpdateTimer;

        var chShowingOption = ["All Channels", "Favourite", "Subscribed", "Popular"];
        var chDateOption;
        var chShowingIdx, chDateIdx;


        var create = function () {

            _this.isActive = false;
            timelineIdx = 0;
            currentTime = util.newDate().getTime(); // actual real time
            var timeGap = currentTime % (30 * 60 * 1000);
            initialTime = currentTime - timeGap;

            var standardTime = util.newDate(initialTime);
            standardTime.setHours(0);
            standardTime.setMinutes(0);
            standardTime.setSeconds(0);
            standardTime.setMilliseconds(0);
            standardTimelineIdx = (standardTime.getTime() - initialTime) / (30 * 60 * 1000);

            chIdx = 0;
            if (channelData) {
                for (var i = 0; i < channelData.length; i++) {
                    if (channelData[i].schedules) {
                        channelData[i].schedules.sort(function (a, b) {
                            return a.start_time - b.start_time;
                        })

                        checkScStatus(channelData[i]);
                    }

                    if(currentCh == channelData[i].sourceId) {
                        chIdx = i;
                    }
                }
            }

            chDateOption = [];
            var tempTime, tempText;
            for (var i = -2; i < 6; i++) {
                if (i == -1) {
                    chDateOption[i + 2] = W.Texts["yesterday"];
                    continue;
                } else if (i == 0) {
                    chDateOption[i + 2] = W.Texts["today"];
                    continue;
                } else if (i == 1) {
                    chDateOption[i + 2] = W.Texts["tomorrow"];
                    continue;
                }
                tempTime = util.newDate(initialTime + (i * REQUEST_HOURS));
                chDateOption[i + 2] = transDay(tempTime.getDay()) + " " + tempTime.getDate() + (tempTime.getDate() == 1 ? "st" : (tempTime.getDate() == 2 ? "nd" : "th"));
            }
            chShowingIdx = 0;
            chDateIdx = 2;


            topChIdx = chIdx - chIdx%5;
            prIdx = 0;

            _comp = new W.Div({id: "table", x: 0, y: 0, width: "1227px", height: "574px"});

            _comp._main_bg = new W.Div({
                id: "table_main_bg",
                x: 53 - 53,
                y: 184 - 146,
                width: "1224px",
                height: "536px",
                backgroundColor: "rgba(19,20,28,0.9)"
            });
            _comp.add(_comp._main_bg);

            _comp._top_row = new W.Div({
                id: "table_top_row",
                x: 53 - 53,
                y: 146 - 146,
                width: "1225px",
                height: "40px"
            });
            //_comp._top_row._bg = new W.Div({id:"table_top_row_bg", x:53-53, y:146-146, width:"1227px", height:"38px", backgroundColor:"rgba(64,69,82,0.8)"});
            //_comp._top_row.add(_comp._top_row._bg);
            _comp._top_row._line = new W.Div({
                id: "table_top_row_line",
                x: 53 - 53,
                y: 0,
                width: "1227px",
                height: "38px",
                backgroundColor: "rgba(0,0,0,0.6)",
                visibility: "hidden"
            });
            _comp._top_row.add(_comp._top_row._line);
            _comp._top_row._date = new W.Span({
                text: "",
                x: 75 - 53,
                y: 0,
                width: 235,
                height: 40,
                lineHeight: "40px",
                textColor: "rgba(255,255,255,0.4)",
                fontFamily: "RixHeadM",
                "font-size": "16px",
                textAlign: "left",
                "letter-spacing": "-0.8px"
            });
            _comp._top_row.add(_comp._top_row._date);
            _comp._top_row._date_text = new W.Span({
                text: W.Texts["today"],
                x: 0,
                y: 0,
                width: 235,
                height: 40,
                lineHeight: "40px",
                textColor: "rgba(155,185,244,1)",
                fontFamily: "RixHeadL",
                "font-size": "17px",
                textAlign: "right",
                "letter-spacing": "-0.85px"
            });
            _comp._top_row.add(_comp._top_row._date_text);
            _comp.add(_comp._top_row);

            _comp._main_area = new W.Div({
                id: "table_main_area",
                x: 53 - 53,
                y: 186 - 146,
                width: "1227px",
                height: "534px"
            });

            _comp._main_area._ch_area = new W.Div({
                id: "table_main_area_ch_area",
                x: 53 - 53,
                y: 186 - 186,
                width: 240,
                height: 534, /*backgroundColor:"rgba(255,255,255,0.1)",*/
                overflow: "hidden"
            });
            _comp._main_area._ch_area._inner = new W.Div({
                id: "table_main_area_ch_area_inner",
                x: 53 - 53,
                y: topChIdx * -66
            });
            _comp._main_area._ch_area.add(_comp._main_area._ch_area._inner);
            _comp._main_area.add(_comp._main_area._ch_area);

            _comp._main_area._sc_area = new W.Div({
                id: "table_main_area_sc_area",
                x: 295 - 53,
                y: 186 - 186,
                width: 987,
                height: 534,
                overflow: "hidden"
            });
            _comp._main_area._sc_area._inner = new W.Div({
                id: "table_main_area_sc_area_inner",
                x: 205 - 205,
                y: topChIdx * -66
            });
            _comp._main_area._sc_area.add(_comp._main_area._sc_area._inner);
            _comp._main_area.add(_comp._main_area._sc_area);

            _comp.add(_comp._main_area);


            var ch_area = _comp._main_area._ch_area._inner;
            cellArray = [];

            var startIdx = (topChIdx > 0 ? topChIdx-1 : topChIdx);
            for (var i = startIdx; i < (channelData.length > startIdx + visibleRowCount[mode] ? startIdx + visibleRowCount[mode] : channelData.length); i++) {
                cellArray[i] = {};
                cellArray[i].chCell = makeChCell(channelData[i], i);
                ch_area.add(cellArray[i].chCell);
            }

            var sc_area = _comp._main_area._sc_area._inner;

            for (var i = startIdx; i < (channelData.length > startIdx + visibleRowCount[mode] ? startIdx+ visibleRowCount[mode] : channelData.length); i++) {
                cellArray[i].scCell = makeScCell(channelData[i].schedules, i);
                channelData[i].scCell = cellArray[i].scCell;
                sc_area.add(cellArray[i].scCell);
            }

            makeTimeLine();
            makeCurrentLine();

            checkPrIdx();
            checkCell(null, function() {
                checkDate();
                setTitlePosition();
                timelineUpdate();
                setCurrentLine();

                if (mode == 0) {
                    _comp._top_row.setDisplay("none");
                } else {
                    _comp._top_row.setDisplay("block");
                }
            });
        };

        var checkScStatus = function(chData) {
            if (W.StbConfig.blockedChannelList.sourceIds.includes(parseInt(chData.sourceId))) {
                chData.isBlocked = true;
            } else if (W.StbConfig.favoriteChannelList.sourceIds.includes(parseInt(chData.sourceId))) {
                chData.isFavorite = true;
            }

            if(chData.isBlocked) {
                if(chData.schedules) {
                    chData.keepSchedules = chData.schedules;
                    chData.schedules = undefined;
                }
                var dummySc = {
                    sourceId: chData.sourceId,
                    startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: W.Texts["blocked_ch_pr"]
                }

                data = [dummySc];

                chData.schedules = data;

                return;
            }

            if(chData.isAdult && !chData.needOpen) {
                if(chData.schedules) {
                    chData.keepSchedules = chData.schedules;
                    chData.schedules = undefined;
                }
                var dummySc = {
                    sourceId: chData.sourceId,
                    startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: chData.title
                }

                data = [dummySc];

                chData.schedules = data;

                return;
            }

            if(chData && chData.channelType && chData.channelType.code == "60") {
                var dummySc = {
                    sourceId: chData.sourceId,
                    startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: W.Texts["channel_vod_program_title"]
                }
                data = [dummySc];

                chData.schedules = data;
            } else if (!chData.schedules || chData.schedules.length == 0) {
                W.log.info("dummy!!")
                var dummySc = {
                    sourceId: chData.sourceId,
                    startTime: util.newISODateTime(initialTime + timelineIdx * (30 * 60 * 1000)),
                    endTime: util.newISODateTime(initialTime + timelineIdx * (30 * 60 * 1000) + REQUEST_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + REQUEST_HOURS,
                    title: W.Texts["no_prog_list"]
                }

                data = [dummySc];

                chData.schedules = data;

            }

            /*for (var j = 0; j < chData.schedules.length; j++) {
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

                if (j == 0 && chData.schedules[j] && (chData.schedules[j].start_time > initialTime)) {
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
                }
            }*/
        };

        var makeTimeLine = function () {
            _comp._top_row._time_line = new W.Div({
                id: "time_line",
                x: 297 - 53,
                y: 146 - 146,
                width: "1075px",
                height: "38px",
                overflow: "hidden"
            });
            _comp._top_row._time_line._inner = new W.Div({
                id: "time_line_inner",
                x: 295 - 295,
                y: 146 - 146,
                height: "38px"
            });

            timeLineArray = [];
            for (var i = 0; i < 5; i++) {
                _comp._top_row._time_line._inner.add(makeTimeDiv(i));
            }
            _comp._top_row._time_line.add(_comp._top_row._time_line._inner);
            _comp._top_row.add(_comp._top_row._time_line);
        };

        var makeTimeDiv = function (idx) {
            var timeDiv = new W.Div({
                x: 205 - 205 + idx * 258,
                y: 155 - 146,
                width: "258px",
                height: "29px",
                textAlign: "left"
            });
            timeLineArray[idx] = timeDiv;
            var time = util.newDate(initialTime + idx * 30 * 60 * 1000);
            timeDiv.add(new W.Span({
                position: "relative",
                text: util.changeDigit(time.getHours(), 2) + ":" + util.changeDigit(time.getMinutes(), 2),
                textColor: "rgba(215,168,122,1)",
                fontFamily: "RixHeadL",
                "font-size": "17px",
                textAlign: "left",
                "letter-spacing": "-0.85px"
            }));
            return timeDiv;
        }

        var makeCurrentLine = function () {
            var _x = parseInt(((currentTime - initialTime) / (1000 * 60)) * 8.6);

            _comp._main_area._current_line = new W.Image({
                id: "current_line",
                x: 300 - 53 + _x - 23,
                y: 174 - 186,
                width: 38,
                height: 408,
                src: "img/02_now_line.png"
            });
            _comp._main_area.add(_comp._main_area._current_line);
        };

        var setCurrentLine = function () {
            var _x = parseInt(((currentTime - initialTime - timelineIdx * 30 * 60 * 1000) / (1000 * 60)) * 8.6);

            if (_x < 0) {
                _comp._main_area._current_line.setVisible(false);
            } else {
                _comp._main_area._current_line.setVisible(true);
            }

            W.Util.setStyle(_comp._main_area._current_line, {x: 300 - 53 + _x - 23});
        };

        var setCurrentTime = function (_currentTime) {
            var currentTime = new Date(_currentTime);
            var timeText = util.getCurrentDateTime("kor", currentTime);
            if (_comp && _comp._top_row) _comp._top_row._date.setText(timeText);

        };

        var timelineUpdate = function (_currentTime) {
            W.log.info("timelineUpdate");
            currentTime = _currentTime ? _currentTime : util.newDate().getTime();
            setCurrentTime(currentTime);
            setCurrentLine();
            for (var i = 0; i < (cellArray.length); i++) {
                if (cellArray[i] && cellArray[i].scCell) {
                    if(cellArray[i].scCell.exceptCell) {
                        var _comp = cellArray[i].scCell.exceptCell;
                        var isCurrent = (channelData[i].exceptSchedules.start_time < currentTime) && (currentTime < channelData[i].exceptSchedules.end_time);
                        var _currentWidth = (isCurrent || (channelData[i].exceptSchedules.end_time < currentTime)) ? parseInt(((currentTime - channelData[i].exceptSchedules.start_time) / (1000 * 60)) * 8.6) : 0;
                        _comp.setStyle({className: isCurrent ? "pr_cell_current" : (channelData[i].exceptSchedules.end_time < currentTime) ? "pr_cell_prev" : "pr_cell_normal"});
                        if (_comp._mask) _comp._mask.setWidth(_currentWidth + "px");
                    } else {
                        for (var j = 0; j < channelData[i].schedules.length; j++) {
                            var _comp = channelData[i].schedules[j].prCell;
                            if (_comp && channelData[i].schedules[j]) {
                                var isCurrent = (channelData[i].schedules[j].start_time < currentTime) && (currentTime < channelData[i].schedules[j].end_time);
                                var _currentWidth = (isCurrent || (channelData[i].schedules[j].end_time < currentTime)) ? parseInt(((currentTime - channelData[i].schedules[j].start_time) / (1000 * 60)) * 8.6) : 0;
                                _comp.setStyle({className: isCurrent ? "pr_cell_current" : (channelData[i].schedules[j].end_time < currentTime) ? "pr_cell_prev" : "pr_cell_normal"});
                                if (_comp._mask) _comp._mask.setWidth(_currentWidth + "px");
                            }
                        }
                    }
                }
            }
        };

        var setTitlePosition = function () {
            var initTime = (initialTime + timelineIdx * 30 * 60 * 1000);
            var prCellArray, _comp, isCurrent, _channelData, _schedule, _startTime, _endTime;
            for (var i = 0; i < (cellArray.length); i++) {
                if (cellArray[i] && cellArray[i].scCell) {
                    prCellArray = cellArray[i].scCell.prCellArray;
                    _channelData = channelData[i];
                    if(cellArray[i].scCell.exceptCell) {
                        _comp = cellArray[i].scCell.exceptCell;
                        _schedule = _channelData.exceptSchedules;
                        if (_comp && _schedule) {
                            _startTime = _schedule.start_time;
                            _endTime = _schedule.end_time;
                            isCurrent = ((_startTime < initTime) && (initTime < _endTime));
                            if (isCurrent) {
                                _comp._title.setX(parseInt(((initTime - _startTime) / (1000 * 60)) * 8.6 + 18));

                                var _width = parseInt(((_endTime - initTime) / (1000 * 60)) * 8.6 - 2 - 36);
                                if(_width < 36) {
                                    _comp._title.setStyle({visibility:"hidden"});
                                } else {
                                    _comp._title.setStyle({visibility:"visible"});
                                }
                                _comp._title.setWidth(_width + "px");
                                _comp._title._text.setStyle({"max-width": (_width + "px")});

                            }
                            else {
                                _comp._title.setX(18);

                                var _width = parseInt(((_endTime - _startTime) / (1000 * 60)) * 8.6 - 2 - 36);
                                if(_width < 36) {
                                    _comp._title.setStyle({visibility:"hidden"});
                                } else {
                                    _comp._title.setStyle({visibility:"visible"});
                                }
                                _comp._title.setWidth(_width + "px");
                                _comp._title._text.setStyle({"max-width": _width + "px"});
                            }
                        }
                    } else {
                        for (var j = 0; j < _channelData.schedules.length; j++) {
                            _comp = _channelData.schedules[j].prCell;
                            _schedule = _channelData.schedules[j];
                            if (_comp && _schedule) {
                                _startTime = _schedule.start_time;
                                _endTime = _schedule.end_time;
                                isCurrent = ((_startTime < initTime) && (initTime < _endTime));
                                if (isCurrent) {
                                    _comp._title.setX(parseInt(((initTime - _startTime) / (1000 * 60)) * 8.6 + 18));

                                    var _width = parseInt(((_endTime - initTime) / (1000 * 60)) * 8.6 - 2 - 36);
                                    if(_width < 36) {
                                        _width = 0;
                                    }
                                    _comp._title.setWidth(_width + "px");
                                    //if(_comp._title._resv.comp.style.display == "" && _maxWidth > 65) {
                                    //    _comp._title._text.setStyle({"max-width": _maxWidth - 65 + "px"});
                                    //} else {
                                        _comp._title._text.setStyle({"max-width": _width + "px"});
                                    //}

                                }
                                else {
                                    _comp._title.setX(18);

                                    var _width = parseInt(((_endTime - _startTime) / (1000 * 60)) * 8.6 - 2 - 36);
                                    if(_width < 36) {
                                        _width = 0;
                                    }
                                    _comp._title.setWidth(_width + "px");
                                    _comp._title._text.setStyle({"max-width": (_width + "px")});
                                }
                            }
                        }
                    }
                }
            }
        };

        var makeChCell = function (_data, idx) {
            var comp = new W.Div({
                id: "ch_cell_" + idx,
                x: 53 - 53,
                y: 186 - 186 + 66 * idx,
                width: 240,
                height: 64,
                backgroundColor: "rgba(255,255,255,0.05)"
            });

            var data = _data.data ? _data.data : _data;

            var ch = util.changeDigit(data.channelNum, 3);

            comp.chNumber = new W.Span({
                text: ch,
                id: "ch_number_" + idx,
                x: 0,
                y: 0,
                width: 78,
                lineHeight: "64px",
                textColor: "#EBEBEB",
                "letter-spacing": "-1.1px",
                fontFamily: "RixHeadM",
                "font-size": "22px",
                textAlign: "center",
                opacity: 0.3
            });
            comp.add(comp.chNumber);
            comp.chNumberF = new W.Span({
                text: ch,
                id: "ch_numberF_" + idx,
                x: 0,
                y: 0,
                width: 78,
                lineHeight: "64px",
                textColor: "#FFFFFF",
                "letter-spacing": "-1.1px",
                fontFamily: "RixHeadM",
                "font-size": "22px",
                textAlign: "center",
                display: "none"
            });
            comp.add(comp.chNumberF);
            comp.chName = new W.Div({
                id: "ch_name_" + idx,
                x: 78,
                y: 0,
                width: 142,
                height: 64,
                //overflow: "hidden",
                opacity: 0.7
            });
            comp.add(comp.chName);
            comp.chName.span = new W.Div({
                position:"relative",
                "max-width":"142px",
                text: data.title,
                lineHeight: "64px",
                textColor: "#C3C3C3",
                "letter-spacing": "-0.8px",
                fontFamily: "RixHeadL",
                "font-size": "18px",
                textAlign: "left",
                //"text-overflow": "ellipsis",
                //overflow: "hidden",
                "white-space": "nowrap",
                float:"left"
            });
            comp.chName.add(comp.chName.span);
            comp.chNameF = new W.Div({
                id: "ch_nameF_" + idx,
                x: 78,
                y: 0,
                width: 142,
                height: 64,
                //overflow: "hidden",
                display: "none"
            });
            comp.add(comp.chNameF);
            comp.chNameF.span = new W.Div({
                position:"relative",
                "max-width":"142px",
                text: data.title,
                lineHeight: "64px",
                textColor: "#FFFFFF",
                "letter-spacing": "-1.0px",
                fontFamily: "RixHeadM",
                "font-size": "20px",
                textAlign: "left",
                //"text-overflow": "ellipsis",
                //overflow: "hidden",
                "white-space": "nowrap",
                float:"left"
            });
            comp.chNameF.add(comp.chNameF.span);
            comp.block = new W.Div({
                position:"relative",
                backgroundImage:"url('img/info_block.png')",
                x: 5,
                y: 21,
                width:21,
                height:21,
                display: "none",
                float:"left"
            });
            comp.blockF = new W.Div({
                position:"relative",
                backgroundImage:"url('img/info_block.png')",
                x: 5,
                y: 21,
                width:21,
                height:21,
                display: "none",
                float:"left"
            });
            comp.chName.add(comp.block);
            comp.chNameF.add(comp.blockF);
            comp.star = new W.Div({
                position:"relative",
                backgroundImage:"url('img/info_star_f.png')",
                x: 5,
                y: 21,
                width:12,
                height:12,
                display: "none",
                float:"left"
            });
            comp.starF = new W.Div({
                position:"relative",
                backgroundImage:"url('img/info_star_f.png')",
                x: 5,
                y: 21,
                width:12,
                height:12,
                display: "none",
                float:"left"
            });
            comp.chName.add(comp.star);
            comp.chNameF.add(comp.starF);
            //comp.chNameF.add(comp.star);
            if (data.isBlocked) {
                comp.chName.span.setStyle({"max-width":142-26+"px"});
                comp.chNameF.span.setStyle({"max-width":142-26+"px"});
                comp.block.setStyle({display: ""});
                comp.blockF.setStyle({display: ""});
                comp.star.setStyle({display: "none"});
                comp.starF.setStyle({display: "none"});
            } else if (data.isFavorite) {
                comp.chName.span.setStyle({"max-width":142-17+"px"});
                comp.chNameF.span.setStyle({"max-width":142-17+"px"});
                comp.star.setStyle({display: ""});
                comp.starF.setStyle({display: ""});
                comp.block.setStyle({display: "none"});
                comp.blockF.setStyle({display: "none"});
            }

            comp._focus = new W.Div({class: "pr_cell_focus", width: "100%", height: 64, display: "none"});
            comp._focus.add(new W.Div({width: "100%", height: 4, backgroundColor: PRCELL_FOCUS_COLOR}));
            comp._focus.add(new W.Div({y: 60, width: "100%", height: 4, backgroundColor: PRCELL_FOCUS_COLOR}));
            comp.add(comp._focus);

            return comp;
        };

        var makeScCell = function (data, idx) {
            var comp = new W.Div({id: "sc_cell_" + idx, x: 204 - 204, y: 186 - 186 + 66 * idx, width: 987, height: 64});
            comp.prCellArray = [];
            channelData[idx].prCellArray = comp.prCellArray;

            if(channelData[idx].isBlocked) {
                if(channelData[idx].schedules) {
                    channelData[idx].keepSchedules = channelData[idx].schedules;
                    channelData[idx].schedules = undefined;
                }
                var dummySc = {
                    sourceId: channelData[idx].sourceId,
                    startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: W.Texts["blocked_ch_pr"]
                }

                data = [dummySc];

                channelData[idx].schedules = data;
            } else if(channelData[idx].isAdult && !channelData[idx].needOpen) {
                if(channelData[idx].schedules) {
                    channelData[idx].keepSchedules = channelData[idx].schedules;
                    channelData[idx].schedules = undefined;
                }
                var dummySc = {
                    sourceId: channelData[idx].sourceId,
                    startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: channelData[idx].title
                }

                data = [dummySc];

                channelData[idx].schedules = data;
            } else if(channelData[idx] && channelData[idx].channelType && channelData[idx].channelType.code == "60") {
                var dummySc = {
                    sourceId: channelData[idx].sourceId,
                    startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: W.Texts["channel_vod_program_title"]
                }
                data = [dummySc];

                channelData[idx].schedules = data;
            } else if (!data || data.length == 0) {
                W.log.info("dummy!!")
                var dummySc = {
                    sourceId: channelData[idx].sourceId,
                    startTime: util.newISODateTime(initialTime + timelineIdx * (30 * 60 * 1000)),
                    endTime: util.newISODateTime(initialTime + timelineIdx * (30 * 60 * 1000)+ REQUEST_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + REQUEST_HOURS,
                    title: W.Texts["no_prog_list"]
                }

                data = [dummySc];

                channelData[idx].schedules = data;

            }

            if(channelData[idx] && channelData[idx].channelType && channelData[idx].channelType.code == "61") {
                var dummySc = {
                    sourceId: channelData[idx].sourceId,
                        startTime: util.newISODateTime(initialTime),
                    endTime: util.newISODateTime(initialTime + MAX_HOURS),
                    start_time: initialTime,
                    end_time: initialTime + MAX_HOURS,
                    title: W.Texts["channel_vod_promotion"]
                }
                comp.exceptCell = makePrCell(dummySc, "except");
                comp.add(comp.exceptCell);

                channelData[idx].exceptSchedules = dummySc;
            }

            if(!comp.exceptCell) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].end_time > (initialTime + timelineIdx * (30 * 60 * 1000)) && data[i].start_time < (initialTime + timelineIdx * (30 * 60 * 1000) + 130 * 60 * 1000)) {
                        if (!channelData[idx].schedules[i].prCell) {
                            channelData[idx].schedules[i].prCell = makePrCell(data[i], i, channelData[idx].exceptSchedules);
                            comp.add(channelData[idx].schedules[i].prCell);
                        }
                    }
                }
            }

            return comp;
        };

        var makePrCell = function (data, idx, except) {
            var _duration = data.end_time - data.start_time;
            var _startTime = data.start_time;
            var _width = parseInt((_duration / (1000 * 60)) * 8.6 - 2);
            var _x = parseInt((_startTime - initialTime) / (1000 * 60) * 8.6);

            var _name;

            _name = data.title;

            var isCurrent = ((_startTime < currentTime) && (currentTime < _startTime + _duration));

            var comp = new W.Div({
                id: "pr_cell_" + idx,
                x: 204 - 204 + _x,
                y: 186 - 186,
                width: _width + "px",
                height: 64,
                className: isCurrent ? "pr_cell_current" : (data.end_time < currentTime) ? "pr_cell_prev" : "pr_cell_normal",
                overflow: "hidden",
                display : except ? "none" : ""
            });

            comp._focus = new W.Div({class: "pr_cell_focus", width: _width + "px", height: 64, display: "none"});
            comp._focus.add(new W.Div({width: _width + "px", height: 4, backgroundColor: PRCELL_FOCUS_COLOR}));
            comp._focus.add(new W.Div({y: 60, width: _width + "px", height: 4, backgroundColor: PRCELL_FOCUS_COLOR}));
            comp.add(comp._focus);

            //if(isCurrent) {
            var _currentWidth = (isCurrent || (data.end_time < currentTime)) ? parseInt(((currentTime - _startTime) / (1000 * 60)) * 8.6) : 0;
            comp._mask = new W.Div({
                class: "current_mask",
                width: _currentWidth + "px",
                height: 64,
                backgroundColor: "rgba(0,0,0,0.25)"/*backgroundImage:"url('img/diagonal_full.png')"*/
            });
            comp.add(comp._mask);
            //}


            comp._title = new W.Div({x: 18, y: 0, width: _width - 36});


            comp._title._text = new W.Span({
                text: _name,
                x: 0,
                y: 2,
                lineHeight: "62px",
                "max-width": _width - 36 - 75 + "px",
                textAlign: "left",
                "text-overflow": "ellipsis",
                overflow: "hidden",
                "white-space": "nowrap",
                position: "relative",
                float: "left",
                "letter-spacing" : "-0.5px"
            });
            comp._title.add(comp._title._text);

            if(W.StbConfig && W.StbConfig.cugType != "accommodation") {
                if((data.seriesId && data.seriesId != "") || (data.assetId && data.assetId != "")) {
                    comp._title._info = new W.Image({
                        x: 8,
                        y: 2,
                        width: 67,
                        height: 21,
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        src: "img/info_vod.png",
                        position: "relative",
                        float: "left",
                        marginRight : "5px"
                    });
                    comp._title.add(comp._title._info);

                    comp._title._info_f = new W.Image({
                        x: 8,
                        y: 2,
                        width: 81,
                        height: 21,
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        src: "img/info_vod_f.png",
                        position: "relative",
                        float: "left",
                        marginRight : "5px",
                        display: "none"
                    });
                    comp._title.add(comp._title._info_f);
                }
            }

            comp._title._resv = new W.Image({
                x: 8,
                y: 2,
                width: 57,
                height: 21,
                paddingTop: "20px",
                paddingBottom: "20px",
                src: "img/icon_resv.png",
                position: "relative",
                float: "left",
                display:"none"
            });
            comp._title.add(comp._title._resv);

            if(data.eventId) {
                var rsPr = util.findReserveProgram(data.sourceId, data.start_time, data.title);
                if(rsPr) {
                    rsPr.icon = comp._title._resv;
                    comp._title._resv.setStyle({display:""});
                }
            }

            comp.add(comp._title);

            return comp;
        };

        var removeCell = function(oldIdx, newIdx) {
            W.log.info("removeCell", oldIdx, newIdx)
            if(oldIdx == newIdx) return;
            var startIdx, endIdx;
            if(oldIdx < newIdx) {
                startIdx = oldIdx;
                endIdx = startIdx+6 < newIdx ? startIdx+6 : newIdx;
            } else if(newIdx < oldIdx) {
                startIdx = newIdx+6 > oldIdx ? newIdx+6 : oldIdx;
                endIdx = oldIdx+6;
            } else {
                return;
            }

            for(var i = startIdx; (i < endIdx) && (i < channelData.length); i++) {
                _comp._main_area._ch_area._inner.remove(cellArray[i].chCell);
                _comp._main_area._sc_area._inner.remove(cellArray[i].scCell);
                cellArray[i].isRemoved = true;
            }
        };

        var unFocus = function (__chIdx, __prIdx) {
            var _chIdx = __chIdx != undefined ? __chIdx : chIdx;
            var _prIdx = __prIdx != undefined ? __prIdx : prIdx;
            if (cellMode == CELL_CH) {
                if (cellArray[_chIdx].chCell) {
                    cellArray[_chIdx].chCell.chNumber.setStyle({display: "block"});
                    cellArray[_chIdx].chCell.chName.setStyle({display: "block"});
                    cellArray[_chIdx].chCell.chNumberF.setStyle({display: "none"});
                    cellArray[_chIdx].chCell.chNameF.setStyle({display: "none"});
                    cellArray[_chIdx].chCell._focus.setStyle({display: "none"});
                }
            } else {
                if(cellArray[_chIdx].scCell.exceptCell) {
                    cellArray[_chIdx].scCell.exceptCell._focus.setStyle({display: "none"});
                    cellArray[_chIdx].scCell.exceptCell.setStyle({"font-size": ""});
                } else if (cellArray[_chIdx].scCell && channelData[_chIdx].schedules[_prIdx].prCell){
                    channelData[_chIdx].schedules[_prIdx].prCell._focus.setStyle({display: "none"});
                    channelData[_chIdx].schedules[_prIdx].prCell.setStyle({"font-size": ""});

                    if(channelData[_chIdx].schedules[_prIdx].prCell._title._info_f) {
                        channelData[_chIdx].schedules[_prIdx].prCell._title._info.setStyle({display: ""});
                        channelData[_chIdx].schedules[_prIdx].prCell._title._info_f.setStyle({display: "none"});
                    }
                }
                if (cellArray[_chIdx].chCell) {
                    cellArray[_chIdx].chCell.chNumber.setStyle({display: "block"});
                    cellArray[_chIdx].chCell.chName.setStyle({display: "block"});
                    cellArray[_chIdx].chCell.chNumberF.setStyle({display: "none"});
                    cellArray[_chIdx].chCell.chNameF.setStyle({display: "none"});
                }
            }
        };

        var setFocus = function () {
            if (cellMode == CELL_CH) {
                if (cellArray[chIdx].chCell) {
                    cellArray[chIdx].chCell.chNumber.setStyle({display: "none"});
                    cellArray[chIdx].chCell.chName.setStyle({display: "none"});
                    cellArray[chIdx].chCell.chNumberF.setStyle({display: "block"});
                    cellArray[chIdx].chCell.chNameF.setStyle({display: "block"});
                    cellArray[chIdx].chCell._focus.setStyle({display: "block"});
                }
            } else {
                if(cellArray[chIdx].scCell.exceptCell) {
                    cellArray[chIdx].scCell.exceptCell._focus.setStyle({display: "block"});
                    cellArray[chIdx].scCell.exceptCell.setStyle({"font-size": "22px"});
                } else if (cellArray[chIdx].scCell && channelData[chIdx].schedules[prIdx].prCell) {
                    channelData[chIdx].schedules[prIdx].prCell._focus.setStyle({display: "block"});
                    channelData[chIdx].schedules[prIdx].prCell.setStyle({"font-size": "22px"});

                    if(channelData[chIdx].schedules[prIdx].prCell._title._info_f) {
                        channelData[chIdx].schedules[prIdx].prCell._title._info.setStyle({display: "none"});
                        channelData[chIdx].schedules[prIdx].prCell._title._info_f.setStyle({display: ""});
                    }
                }
                if(cellArray[chIdx].chCell) {
                    cellArray[chIdx].chCell.chNumber.setStyle({display: "none"});
                    cellArray[chIdx].chCell.chName.setStyle({display: "none"});
                    cellArray[chIdx].chCell.chNumberF.setStyle({display: "block"});
                    cellArray[chIdx].chCell.chNameF.setStyle({display: "block"});
                }
            }
        };

        var setActive = function () {
            _this.isActive = true;
            _comp._top_row._line.setVisible(true);
            setFocus();
        };

        var deActive = function () {
            _this.isActive = false;
            _comp._top_row._line.setVisible(false);
            unFocus();
        };

        var jumpChannel = function (_chIdx, callback) {
            unFocus();

            timelineIdx = currentTime - currentTime % (30 * 60 * 1000) - initialTime;
            timelineIdx = timelineIdx/(30 * 60 * 1000);
            timelineIdx = timelineIdx - timelineIdx%3;

            var currentTimeLine = initialTime + timelineIdx * (30 * 60 * 1000);
            var currentPrStartTime = currentTimeLine;

            if (channelData[chIdx].schedules.length < 1) {

            } else {
                currentPrStartTime = channelData[chIdx].schedules[prIdx].start_time;
            }
            chIdx = _chIdx;

            var oldTopChIdx = topChIdx;
            topChIdx = chIdx - chIdx%5;

            checkCell(null, function() {

                checkPrIdx();
                checkDate();
                setTitlePosition();

                W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});

                W.Util.setStyle(_comp._main_area._sc_area._inner, {y: topChIdx * -66});
                W.Util.setStyle(_comp._main_area._ch_area._inner, {y: topChIdx * -66});

                setCurrentLine();
                setTitlePosition();
                setFocus();
                if(callback) callback();
                removeCell(oldTopChIdx, topChIdx);
            });
        };

        function transDay(day) {
            if (day == 1) {
                return W.Texts["monday"];
            } else if (day == 2) {
                return W.Texts["tuesday"];
            } else if (day == 3) {
                return W.Texts["wednesday"];
            } else if (day == 4) {
                return W.Texts["thursday"];
            } else if (day == 5) {
                return W.Texts["friday"];
            } else if (day == 6) {
                return W.Texts["saturday"];
            } else {
                return W.Texts["sunday"];
            }
        }

        var setInfoText = function () {
            //_comp._info_text.setText(chDateOption[chDateIdx] + ", Showing " + chShowingOption[chShowingIdx]);
            _comp._top_row._date_text.setText(chDateOption[chDateIdx]);
        };

        var checkDate = function () {
            chDateIdx = parseInt((timelineIdx - standardTimelineIdx) / 48) + 2;
            setInfoText();
        };

        var checkCell = function (isHide, callback, retryCount) {
            W.log.info(_this.componentName + " checkCell", isHide, retryCount);
            retryCount = (retryCount !=undefined ? retryCount+1 : 0);
            var startIdx = (topChIdx > 0 ? topChIdx-1 : topChIdx);
            if(!cellArray[startIdx]) {
                if (channelData[startIdx].schedules) {
                    channelData[startIdx].schedules.sort(function (a, b) {
                        return a.start_time - b.start_time;
                    })

                    checkScStatus(channelData[startIdx]);
                }
            }

            var requestArray = [];
            /*if(topChIdx != 0/!* && !channelData[topChIdx-1].schedules*!/) {
                requestArray.push(channelData[topChIdx-1].sourceId)
            }*/

            var isLast = false;
            for (var i = startIdx; i < (channelData.length > startIdx + visibleRowCount[mode] ? startIdx + visibleRowCount[mode] : channelData.length); i++) {
                var currentTimeLine = initialTime + timelineIdx * (30 * 60 * 1000);
                if(retryCount > 0 && channelData[i].schedules) {
                    var chData = channelData[i];
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

                if (!channelData[i].schedules) {
                    requestArray.push(channelData[i].sourceId);
                } else if(channelData[i].schedules[0] && (channelData[i].schedules[0].start_time > currentTimeLine
                    || channelData[i].schedules[channelData[i].schedules.length-1].end_time < (currentTimeLine + 5*30*60*1000))) {
                    requestArray.push(channelData[i].sourceId);
                } else if (!cellArray[i]) {
                    if (channelData[i].schedules) {
                        channelData[i].schedules.sort(function (a, b) {
                            return a.start_time - b.start_time;
                        })

                        checkScStatus(channelData[i]);
                    }
                    cellArray[i] = {};
                    cellArray[i].chCell = makeChCell(channelData[i], i);
                    _comp._main_area._ch_area._inner.add(cellArray[i].chCell);

                    cellArray[i].scCell = makeScCell(channelData[i].schedules, i);
                    channelData[i].scCell = cellArray[i].scCell;
                    _comp._main_area._sc_area._inner.add(cellArray[i].scCell);
                } else if(cellArray[i] && !channelData[i].scCell) {
                    cellArray[i].scCell = makeScCell(channelData[i].schedules, i);
                    channelData[i].scCell = cellArray[i].scCell;
                    _comp._main_area._sc_area._inner.add(cellArray[i].scCell);
                } else {
                    if(cellArray[i].isRemoved) {
                        _comp._main_area._ch_area._inner.add(cellArray[i].chCell);
                        _comp._main_area._sc_area._inner.add(cellArray[i].scCell);
                    }
                    if(!channelData[i].exceptSchedules) {
                        for (var j = 0; j < channelData[i].schedules.length; j++) {
                            if (channelData[i].schedules[j].end_time > (initialTime + timelineIdx * (30 * 60 * 1000))
                                && channelData[i].schedules[j].start_time < (initialTime + timelineIdx * (30 * 60 * 1000) + 130 * 60 * 1000)) {
                                if (!channelData[i].schedules[j].prCell) {
                                    channelData[i].schedules[j].prCell = makePrCell(channelData[i].schedules[j], j, channelData[i].exceptSchedules);
                                    cellArray[i].scCell.add(channelData[i].schedules[j].prCell);
                                } else {
                                    channelData[i].schedules[j].prCell.setDisplay("block");
                                }
                            } else {
                                if (cellArray[i].scCell && channelData[i].schedules[j].prCell) {
                                    if (isHide) {
                                        cellArray[i].scCell.remove(channelData[i].schedules[j].prCell);
                                        channelData[i].schedules[j].prCell = undefined;
                                    } else {
                                        channelData[i].schedules[j].prCell.setDisplay("none");
                                    }
                                }
                            }
                        }
                    }
                }

                if(isLast) {
                    break;
                }

                if(i == channelData.length-1) {
                    isLast = true;
                    i = -1;
                }
            }

            if(retryCount > 2) {
                W.Loading.stop();
                return;
            }
            if(timelineIdx * (30 * 60 * 1000) > MAX_HOURS) {
                W.Loading.stop();
                return;
            }
            if (requestArray.length > 0) {
                W.Loading.start();
                parent.getSchedulesData({
                    sourceId: requestArray.toString(),
                    startTime: util.newISODateTime(initialTime + timelineIdx * (30 * 60 * 1000)),
                    duration: 6,
                    includeNotFinished : true
                }, {callback : checkCell, nextAction : callback, startTime : initialTime + timelineIdx * (30 * 60 * 1000), retryCount : retryCount,
                    initialTime : initialTime});
            } else {
                if(callback) callback();
                W.Loading.stop();
            }
        };

       /* var checkSchedule = function(chData, callback) {
            if(chData.schedules) {
                if(callback) callback();
            } else {
                W.Loading.start();
                parent.getSchedulesData({
                    sourceId: chData.sourceId,
                    startTime: util.newISODateTime(currentTime - currentTime % (30 * 60 * 1000)),
                    duration: 24,
                    includeNotFinished : true
                }, {callback : function() {
                    if(callback) callback();
                    W.Loading.stop();
                }});
            }
        }*/

        var checkPrIdx = function () {
            if (channelData[chIdx].schedules.length < 1) {
                prIdx = 0;
            } else {
                var currentTimeLine = initialTime + timelineIdx * (30 * 60 * 1000);
                //var currentTime = util.newDate().getTime();

                var timeGap, nearIdx = 0;
                for (var i = 0; i < channelData[chIdx].schedules.length; i++) {
                    var startTime = channelData[chIdx].schedules[i].start_time;
                    var endTime = channelData[chIdx].schedules[i].end_time;
                    if ((startTime < currentTimeLine) && (currentTimeLine < endTime)) startTime = currentTimeLine;

                    if (startTime < currentTime && currentTime < endTime) {
                        nearIdx = i;
                        break;
                    }
                    var tempTimeGap = Math.abs(currentTime - startTime);
                    if (tempTimeGap == 0) {
                        nearIdx = i;
                        break;
                    } else if (!timeGap || (timeGap > tempTimeGap)) {
                        timeGap = tempTimeGap;
                        nearIdx = i;
                    }
                }
                prIdx = nearIdx;
            }
        };

        var changeMode = function (_mode) {
            W.log.info("change mode == " + mode);
            if (mode == 0) {
                _comp._top_row.setDisplay("none");
            } else {
                _comp._top_row.setDisplay("block");
            }

            checkPrIdx();
            checkCell(null, function() {
                checkDate();

                W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258, y: topChIdx * -66});
                W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                W.Util.setStyle(_comp._main_area._ch_area._inner, {y: topChIdx * -66});

                setTitlePosition();
                timelineUpdate();
                setCurrentLine();
            });
        };

        var operateTable = function (event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if (cellMode == CELL_CH) {
                        unFocus();
                        cellMode = CELL_PR;
                        setFocus();
                        break;
                    }
                    var needCheckCell = false;
                    var oldChIdx = chIdx;
                    var oldPrIdx = prIdx;
                    var nextTimeLineIdx = timelineIdx + 3;
                    var nextTimeLine = initialTime + nextTimeLineIdx * (30 * 60 * 1000);
                    var currentPrEndTime = channelData[chIdx].schedules[prIdx].end_time;
                    if (currentPrEndTime > nextTimeLine) {
                        if((timelineIdx + 3) * (30 * 60 * 1000) >= MAX_HOURS - (60 * 60 * 1000)) {
                            break;
                        }
                        timelineIdx = timelineIdx + 3;
                        needCheckCell = true;
                    } else if (channelData[chIdx].schedules[prIdx + 1]) {
                        var nextPrStartTime = channelData[chIdx].schedules[prIdx + 1].start_time;
                        if (nextPrStartTime >= nextTimeLine) {
                            if((timelineIdx + 3) * (30 * 60 * 1000) >= MAX_HOURS - (60 * 60 * 1000)) {
                                break;
                            }
                            timelineIdx = timelineIdx + 3;
                            needCheckCell = true;
                            prIdx++;
                        } else {
                            unFocus();
                            prIdx++;
                        }
                    }

                    for (var i = nextTimeLineIdx; (i < timelineIdx) || (i < nextTimeLineIdx + 5); i++) {
                        if (!timeLineArray[i]) {
                            _comp._top_row._time_line._inner.add(makeTimeDiv(i));
                        }
                    }

                    if(needCheckCell) {
                        checkCell(null, function() {
                            W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                            W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                            checkDate();
                            unFocus(oldChIdx, oldPrIdx);
                            setCurrentLine();
                            setTitlePosition();
                            setFocus();
                        });
                    } else {
                        W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                        W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                        checkDate();
                        setCurrentLine();
                        setTitlePosition();
                        setFocus();
                    }
                    break;
                case W.KEY.LEFT:
                    var currentTimeLineIdx = timelineIdx;
                    var currentTimeLine = initialTime + timelineIdx * (30 * 60 * 1000);
                    var currentPrStartTime = channelData[chIdx].schedules[prIdx].start_time;
                    if (timelineIdx == 0 && currentPrStartTime <= initialTime) {
                        unFocus();
                        cellMode = CELL_CH;
                        setFocus();
                        break;
                    }
                    var oldChIdx = chIdx;
                    var oldPrIdx = prIdx;
                    var needCheckCell = false;
                    if (currentPrStartTime < currentTimeLine) {
                        timelineIdx = timelineIdx - 3;
                        needCheckCell = true;
                    } else if (channelData[chIdx].schedules[prIdx - 1]) {
                        var prevPrEndTime = channelData[chIdx].schedules[prIdx - 1].end_time;
                        if (prevPrEndTime <= currentTimeLine) {
                            timelineIdx = timelineIdx - 3;
                            needCheckCell = true;
                            prIdx--;
                        } else {
                            unFocus();
                            prIdx--;
                        }
                    } else if (!channelData[chIdx].schedules[prIdx-1] && (currentTimeLine > initialTime)) {
                        timelineIdx = timelineIdx - 3;
                        needCheckCell = true;
                    }

                    for (var i = timelineIdx; i < currentTimeLineIdx; i++) {
                        if (!timeLineArray[i]) {
                            _comp._top_row._time_line._inner.add(makeTimeDiv(i));
                        }
                    }

                    if(needCheckCell) {
                        var oldData = channelData[chIdx].schedules[prIdx];
                        checkCell(null, function() {
                            W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                            W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                            checkDate();
                            prIdx = channelData[chIdx].schedules.indexOf(oldData);
                            unFocus(oldChIdx, oldPrIdx);
                            setCurrentLine();
                            setTitlePosition();
                            setFocus();
                        });
                    } else {
                        W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                        W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                        checkDate();
                        setCurrentLine();
                        setTitlePosition();
                        setFocus();
                    }

                    break;
                case W.KEY.UP:
                    if (chIdx == 0) {
                        if(parent.isLoop) {
                        } else {
                            //if(backCallbackFunc) backCallbackFunc();
                            unFocus();
                            return false;
                            break;
                        }
                    }

                    var needCheckCell = false;

                    var currentTimeLine = initialTime + timelineIdx * (30 * 60 * 1000);
                    var currentPrStartTime = currentTimeLine;
                    var currentPrEndTime = initialTime + (timelineIdx + 4) * (30 * 60 * 1000);
                    var isCurrent = false;

                    currentPrStartTime = channelData[chIdx].schedules[prIdx].start_time;
                    if (currentPrStartTime < currentTimeLine) currentPrStartTime = currentTimeLine;
                    if (currentPrStartTime <= currentTime && currentTime < channelData[chIdx].schedules[prIdx].end_time) isCurrent = true;

                    if (currentPrEndTime > channelData[chIdx].schedules[prIdx].end_time) currentPrEndTime = channelData[chIdx].schedules[prIdx].end_time;
                    var oldChIdx = chIdx;
                    var oldPrIdx = prIdx;
                    if(parent.isLoop) {
                        if(chIdx == 0) {
                            var oldTopChIdx = topChIdx;
                            topChIdx = channelData.length - (channelData.length)%5;
                            needCheckCell = true;

                        }
                        chIdx = chIdx - 1 < 0 ? channelData.length-1 : chIdx - 1;
                    } else {
                        chIdx = chIdx - 1 < 0 ? 0 : chIdx - 1;
                    }
                    //checkSchedule(channelData[chIdx], function() {
                        var timeGap, nearIdx, overlapWidth = 0;
                        for (var i = 0; i < channelData[chIdx].schedules.length; i++) {
                            var startTime = channelData[chIdx].schedules[i].start_time;
                            var endTime = channelData[chIdx].schedules[i].end_time;
                            if (startTime < currentTimeLine && currentTimeLine < endTime) startTime = currentTimeLine;
                            var tempTimeGap = Math.abs(currentPrStartTime - startTime);
                            if (isCurrent) {
                                if (startTime <= currentTime && currentTime < endTime) {
                                    nearIdx = i;
                                    break;
                                }
                                var tempOverlapWidth = (endTime > currentPrEndTime ? currentPrEndTime : endTime) - (startTime > currentPrStartTime ? startTime : currentPrStartTime);
                                if (tempOverlapWidth > overlapWidth) {
                                    //overlapWidth = tempOverlapWidth;
                                    if(nearIdx == undefined) nearIdx = i;
                                }
                            } else {
                                if (tempTimeGap == 0) {
                                    nearIdx = i;
                                    break;
                                } else if (currentPrStartTime > startTime && currentPrStartTime < endTime) {
                                    nearIdx = i;
                                    break;
                                } else {
                                    var tempOverlapWidth = (endTime > currentPrEndTime ? currentPrEndTime : endTime) - (startTime > currentPrStartTime ? startTime : currentPrStartTime);
                                    if (tempOverlapWidth > 0) {
                                        nearIdx = i;
                                        break;
                                    } else if (!timeGap || (timeGap > tempTimeGap)) {
                                        timeGap = tempTimeGap;
                                        nearIdx = i;
                                    }
                                }
                            }
                        }
                        prIdx = nearIdx;
                        var prStartTime = channelData[chIdx].schedules[prIdx].start_time;
                        var prEndTime = channelData[chIdx].schedules[prIdx].end_time;
                        if ((prStartTime < currentTimeLine) && (currentTimeLine < prEndTime)) prStartTime = currentTimeLine;
                        if ((prStartTime < currentTimeLine) || prStartTime > (currentTimeLine + 4 * (30 * 60 * 1000))) {

                            var timeGap = (currentTimeLine - prStartTime);
                            var timeGapIdx = parseInt(timeGap / (30 * 60 * 1000));
                            timelineIdx = timelineIdx - timeGapIdx;
                            needCheckCell = true;
                        }

                        if (chIdx < topChIdx) {
                            var oldTopChIdx = topChIdx;
                            topChIdx -= 5;
                            needCheckCell = true;

                        }
                        if(needCheckCell) {
                            checkCell(null,function() {
                                unFocus(oldChIdx, oldPrIdx);
                                W.Util.setStyle(_comp._main_area._sc_area._inner, {y: topChIdx * -66});
                                W.Util.setStyle(_comp._main_area._ch_area._inner, {y: topChIdx * -66});
                                checkDate();
                                W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                                W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                                setCurrentLine();
                                setTitlePosition();
                                setFocus();
                                removeCell(oldTopChIdx, topChIdx);
                            });
                        } else {
                            unFocus(oldChIdx, oldPrIdx);
                            setFocus();
                        }
                    //});


                    return true;
                    break;
                case W.KEY.DOWN:
                    var needCheckCell = false;

                    var currentTimeLine = initialTime + timelineIdx * (30 * 60 * 1000);
                    var currentPrStartTime = currentTimeLine;
                    var currentPrEndTime = initialTime + (timelineIdx + 4) * (30 * 60 * 1000);
                    var isCurrent = false;

                    currentPrStartTime = channelData[chIdx].schedules[prIdx].start_time;
                    if (currentPrStartTime < currentTimeLine) currentPrStartTime = currentTimeLine;
                    if (currentPrStartTime <= currentTime && currentTime < channelData[chIdx].schedules[prIdx].end_time) isCurrent = true;

                    if (currentPrEndTime > channelData[chIdx].schedules[prIdx].end_time) currentPrEndTime = channelData[chIdx].schedules[prIdx].end_time;
                    var oldChIdx = chIdx;
                    var oldPrIdx = prIdx;
                    chIdx = chIdx + 1 > channelData.length - 1 ? 0 : chIdx + 1;

                    var timeGap, nearIdx, overlapWidth = 0;
                    for (var i = 0; i < channelData[chIdx].schedules.length; i++) {
                        var startTime = channelData[chIdx].schedules[i].start_time;
                        var endTime = channelData[chIdx].schedules[i].end_time;
                        if ((startTime < currentTimeLine) && (currentTimeLine < endTime)) startTime = currentTimeLine;

                        var tempTimeGap = Math.abs(currentPrStartTime - startTime);
                        if (isCurrent) {
                            if (startTime <= currentTime && currentTime < endTime) {
                                nearIdx = i;
                                break;
                            }
                            var tempOverlapWidth = (endTime > currentPrEndTime ? currentPrEndTime : endTime) - (startTime > currentPrStartTime ? startTime : currentPrStartTime);
                            if (tempOverlapWidth > overlapWidth) {
                                //overlapWidth = tempOverlapWidth;
                                if(nearIdx == undefined) nearIdx = i;
                            }
                        } else {
                            if (tempTimeGap == 0) {
                                nearIdx = i;
                                break;
                            } else if (currentPrStartTime > startTime && currentPrStartTime < endTime) {
                                nearIdx = i;
                                break;
                            } else {
                                var tempOverlapWidth = (endTime > currentPrEndTime ? currentPrEndTime : endTime) - (startTime > currentPrStartTime ? startTime : currentPrStartTime);
                                if (tempOverlapWidth > 0) {
                                    nearIdx = i;
                                    break;
                                } else if (!timeGap || (timeGap > tempTimeGap)) {
                                    timeGap = tempTimeGap;
                                    nearIdx = i;
                                }
                            }
                        }
                    }
                    prIdx = nearIdx;

                    var prStartTime = channelData[chIdx].schedules[prIdx].start_time;
                    var prEndTime = channelData[chIdx].schedules[prIdx].end_time;
                    if ((prStartTime < currentTimeLine) && (currentTimeLine < prEndTime)) prStartTime = currentTimeLine;
                    if ((prStartTime < currentTimeLine) || prStartTime > (currentTimeLine + 4 * (30 * 60 * 1000))) {

                        var timeGap = (currentTimeLine - prStartTime);
                        var timeGapIdx = parseInt(timeGap / (30 * 60 * 1000));
                        timelineIdx = timelineIdx - timeGapIdx;
                        needCheckCell = true;
                    }

                    if (chIdx > topChIdx + 4) {
                        var oldTopChIdx = topChIdx;
                        topChIdx += 5;
                        needCheckCell = true;
                    } else if (chIdx == 0) {
                        var oldTopChIdx = topChIdx;
                        topChIdx = 0;
                        needCheckCell = true;
                    }

                    if(needCheckCell) {
                        checkCell(null, function() {
                            unFocus(oldChIdx, oldPrIdx);
                            W.Util.setStyle(_comp._main_area._sc_area._inner, {y: topChIdx * -66});
                            W.Util.setStyle(_comp._main_area._ch_area._inner, {y: topChIdx * -66});
                            checkDate();
                            W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                            W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});
                            setCurrentLine();
                            setTitlePosition();
                            setFocus();
                            removeCell(oldTopChIdx, topChIdx);
                        });
                    } else {
                        unFocus(oldChIdx, oldPrIdx);
                        setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    break;
                case W.KEY.BACK:
                    if(parent.isLoop) {
                    } else {
                        //if(backCallbackFunc) backCallbackFunc();
                        return false;
                        break;
                    }
                    break;
                case W.KEY.EXIT:
                case W.KEY.KEY_ESC:
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

        this.getComp = function (_mode) {
            mode = _mode;
            if (!_comp) create(mode);
            return _comp;
        };

        this.changeMode = function (_mode) {
            mode = _mode;
            changeMode(mode);
        };

        this.setFocus = function () {
            setFocus();
        };

        this.unFocus = function () {
            unFocus();
        };

        this.setActive = function () {
            setActive();
        };

        this.deActive = function () {
            deActive();
        };

        this.timeUpdate = function (_currentTime) {
            timelineUpdate(_currentTime);
        };

        this.getCurrentPr = function () {
            var _isCurrent = false;
            if (channelData[chIdx].schedules[prIdx]
                && channelData[chIdx].schedules[prIdx].start_time <= currentTime
                && currentTime < channelData[chIdx].schedules[prIdx].end_time) _isCurrent = true;

            return {ch: channelData[chIdx], pr: channelData[chIdx].schedules[prIdx], isCurrent: _isCurrent};
        }

        this.jumpChannel = function (_ch, callback) {
            for (var i = 0; i < channelData.length; i++) {
                if (channelData[i].sourceId == _ch.sourceId) {
                    jumpChannel(i, callback);
                    break;
                }
            }
        }

        this.toggleFavCh = function () {
            if (channelData[chIdx].isBlocked) {
                return;
            }
            if (channelData[chIdx].isFavorite) {
                var ids = JSON.parse(JSON.stringify(W.StbConfig.favoriteChannelList.sourceIds));
                ids.splice(parseInt(ids.indexOf(parseInt(channelData[chIdx].sourceId))), 1);

                W.CloudManager.removeFavoriteCh(function (result) {
                    if (result.data == "OK") {
                        W.StbConfig.favoriteChannelList.sourceIds = ids;
                        W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                        channelData[chIdx].isFavorite = false;
                        cellArray[chIdx].chCell.chName.span.setStyle({"max-width":142+"px"});
                        cellArray[chIdx].chCell.chNameF.span.setStyle({"max-width":142+"px"});
                        cellArray[chIdx].chCell.star.setStyle({display: "none"});
                        cellArray[chIdx].chCell.starF.setStyle({display: "none"});

                        if(isFav) {

                            if(channelData.length == 1) {
                                parent.setEmptyFavList();
                            } else {
                                _comp._main_area._ch_area._inner.remove(cellArray[chIdx].chCell);
                                _comp._main_area._sc_area._inner.remove(cellArray[chIdx].scCell);
                                channelData.splice(chIdx,1);
                                cellArray.splice(chIdx,1);
                                for(var i = chIdx; i < channelData.length; i++) {
                                    if(cellArray[i]) {
                                        cellArray[i].chCell.setStyle({y:i*66});
                                        cellArray[i].scCell.setStyle({y:i*66});
                                    }
                                }
                                if(chIdx == channelData.length) chIdx--;
                                checkCell(null, function() {
                                    setFocus();
                                });
                            }
                        }
                        W.PopupManager.openPopup({
                            childComp:_this,
                            popupName:"popup/FeedbackPopup",
                            title:W.Texts["fav_ch_removed"]}
                        );
                    } else {

                    }
                }, [parseInt(channelData[chIdx].sourceId)], ids);
            } else {
                if (channelData[chIdx].channelType.code == "60") {
                    return;
                }

                var ids = JSON.parse(JSON.stringify(W.StbConfig.favoriteChannelList.sourceIds));

                if(ids.length >= 150) {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/MessagePopup",
                        title:W.Texts["popup_zzim_info_title"],
                        boldText:W.Texts["setting_fav_limit"].replace("@max_count@", 150),
                        button:[W.Texts["close"]]}
                    );
                } else {
                    ids.push(parseInt(channelData[chIdx].sourceId));
                    W.CloudManager.addFavoriteCh(function (result) {
                        if (result.data == "OK") {
                            W.StbConfig.favoriteChannelList.sourceIds = ids;
                            W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                            channelData[chIdx].isFavorite = true;
                            cellArray[chIdx].chCell.chName.span.setStyle({"max-width":142-17+"px"});
                            cellArray[chIdx].chCell.chNameF.span.setStyle({"max-width":142-17+"px"});
                            cellArray[chIdx].chCell.star.setStyle({display: ""});
                            cellArray[chIdx].chCell.starF.setStyle({display: ""});

                            W.PopupManager.openPopup({
                                childComp:_this,
                                popupName:"popup/FeedbackPopup",
                                title:W.Texts["fav_ch_added"]}
                            );
                        } else {

                        }
                    }, [parseInt(channelData[chIdx].sourceId)], ids);
                }

            }
        }

        this.toggleReserve = function (currentPr, callback) {
            if(!currentPr) currentPr = channelData[chIdx].schedules[prIdx];
            W.log.info(currentPr)
            var reservedPr = util.findReserveProgram(currentPr.sourceId, currentPr.start_time, currentPr.title);
            if(reservedPr) {
                W.Loading.start();
                W.CloudManager.removeReserveProgram(function(result) {
                    W.Loading.stop();
                    if(result && result.data == "OK" ) {
                        W.StbConfig.ReserveProgramList.splice(W.StbConfig.ReserveProgramList.indexOf(reservedPr),1);
                        reservedPr = undefined;
                        if(currentPr.prCell) currentPr.prCell._title._resv.setStyle({display:"none"});
                        W.PopupManager.openPopup({
                            childComp:_this,
                            popupName:"popup/FeedbackPopup",
                            title:W.Texts["program_reserve_removed"]}
                        );
                        if(callback) callback();
                    } else {
                        W.PopupManager.openPopup({
                            childComp:_this,
                            type:"error",
                            popupName:"popup/FeedbackPopup",
                            title:W.Texts["error_general"]}
                        );
                    }
                }, currentPr.sourceId, currentPr.eventId, currentPr.title, util.newDate(currentPr.startTime).getTime(),
                    util.newDate(currentPr.endTime).getTime(), util.prRatingtoStb(currentPr.rating));
            } else {
                W.Loading.justLock();
                //var reservedPr = {sourceId : currentPr.sourceId, eventId : currentPr.eventId, title : currentPr.title,
                //    startTime : util.newDate(currentPr.startTime).getTime(), endTime : util.newDate(currentPr.endTime).getTime(), rating : util.prRatingtoStb(currentPr.rating)}
                W.CloudManager.addReserveProgram(function(result) {
                    W.Loading.justLockStop();
                    if(result && result.data) {
                        var oldList = W.StbConfig.ReserveProgramList;
                        W.StbConfig.ReserveProgramList = undefined;
                        W.StbConfig.ReserveProgramList = util.parseReserveProgramList(result.data);

                        for(var i = 0; i < oldList.length; i++) {
                            if(oldList[i].icon) {
                                var rsPr = util.findReserveProgram(oldList[i].sourceId, oldList[i].startTime, oldList[i].title);
                                if(rsPr) {
                                    rsPr.icon = oldList[i].icon;
                                    oldList[i].icon.setStyle({display:""});
                                } else {
                                    oldList[i].icon.setStyle({display:"none"});
                                }
                            }
                        }

                        var curPr = util.findReserveProgram(currentPr.sourceId, currentPr.start_time, currentPr.title);
                        if(curPr) {
                            if(currentPr.prCell) {
                                currentPr.prCell._title._resv.setStyle({display:""});
                                curPr.icon = currentPr.prCell._title._resv;
                            }
                            W.PopupManager.openPopup({
                                childComp:_this,
                                popupName:"popup/FeedbackPopup",
                                title:W.Texts["program_reserve_added"]}
                            );
                        }

                        //W.StbConfig.ReserveProgramList.push(reservedPr);

                        if(callback) callback();
                    } else {
                        W.PopupManager.openPopup({
                            childComp:_this,
                            type:"error",
                            popupName:"popup/FeedbackPopup",
                            title:W.Texts["error_general"]}
                        );
                    }
                }, currentPr.sourceId, currentPr.eventId, currentPr.title, util.newDate(currentPr.startTime).getTime(),
                    util.newDate(currentPr.endTime).getTime(), util.prRatingtoStb(currentPr.rating));
            }
        };

        this.gotoPrevPage = function(callback) {
            if(channelData.length > 5) {
                if(topChIdx < 5) {
                    jumpChannel(channelData.length-1 - (channelData.length-1)%5, callback);
                } else {
                    jumpChannel(chIdx-5, callback);
                }
            }
        };

        this.gotoNextPage = function(callback) {
            if(channelData.length > 5) {
                if(topChIdx + 5 < channelData.length-1) {
                    if(chIdx + 5 < channelData.length-1) {
                        jumpChannel(chIdx+5, callback);
                    } else {
                        jumpChannel(channelData.length-1, callback);
                    }
                } else {
                    jumpChannel(0+chIdx%5 < channelData.length-1 ? 0+chIdx%5 : channelData.length-1, callback);
                }
            }
        };

        this.hideNow = function() {
            _comp._main_area._current_line.setVisible(false);
        };

        this.showNow = function() {
            _comp._main_area._current_line.setVisible(true);
        };

        this.removeScCell = function(chObj) {
            if(chObj.scCell) _comp._main_area._sc_area._inner.remove(chObj.scCell);
            chObj.schedules = undefined;
            chObj.scCell = undefined;
        };

        this.checkCell = function(isHide, callback) {
            checkCell(isHide, function(){
                checkDate();
                setTitlePosition();
                timelineUpdate();
                setCurrentLine();

                if (mode == 0) {
                    _comp._top_row.setDisplay("none");
                } else {
                    _comp._top_row.setDisplay("block");
                }
                checkPrIdx();
                W.Util.setStyle(_comp._main_area._sc_area._inner, {x: timelineIdx * -258});
                W.Util.setStyle(_comp._top_row._time_line._inner, {x: timelineIdx * -258});

                W.Util.setStyle(_comp._main_area._sc_area._inner, {y: topChIdx * -66});
                W.Util.setStyle(_comp._main_area._ch_area._inner, {y: topChIdx * -66});
                setFocus();

                if(callback) callback();
            });
        }

        this.operate = function (event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                case W.KEY.UP:
                case W.KEY.DOWN:
                    return operateTable(event);
                case W.KEY.ENTER:
                    if (cellMode == CELL_CH) {
                        this.toggleFavCh();
                    } else {
                        if (W.Config.DEVICE == "BOX") {

                            var currentPr = channelData[chIdx].schedules[prIdx];
                            if (currentPr && currentPr.start_time > currentTime && currentPr.eventId) {
                                _this.toggleReserve(currentPr, function() {
                                    if (parent.pip) parent.pip.setPr(parent.table.getCurrentPr(), currentTime);
                                });
                            } else {
                                if(W.state.isVod){
                                    W.PopupManager.openPopup({
                                        title:W.Texts["popup_zzim_info_title"],
                                        popupName:"popup/AlertPopup",
                                        boldText:W.Texts["vod_alert_msg"],
                                        thinText:W.Texts["vod_alert_msg2"]}
                                    );
                                } else {
                                    W.CloudManager.getCurrentChannel(function (callbackData) {
                                        parent.currentChannel = callbackData;
                                        if (callbackData.data == channelData[chIdx].sourceId) {
                                            //클라우드 종료
                                            W.CloudManager.closeApp();
                                        } else {
                                            parent.prevChannel = {data : parent.currentChannel.data, extra : parent.currentChannel.extra};
                                            W.CloudManager.changeChannel(function (callbackData) {
                                                //parent.currentChannel = callbackData;
                                            }, parseInt(channelData[chIdx].sourceId));
                                        }
                                    });
                                }
                            }
                        }
                        /*var _isCurrent = false;
                         if(channelData[chIdx].schedules[prIdx].start_time <= currentTime && currentTime < channelData[chIdx].schedules[prIdx].end_time) _isCurrent = true;

                         if(_isCurrent) {
                         var popup = {
                         popupName:"popup/guide/MoreInfoPopup",
                         data : channelData[chIdx].schedules[prIdx],
                         childComp:_this
                         };
                         } else {
                         var popup = {
                         popupName:"popup/guide/FutureMoreInfoPopup",
                         data : channelData[chIdx].schedules[prIdx],
                         childComp:_this
                         };
                         }

                         W.PopupManager.openPopup(popup);*/
                    }
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
            }

        }
        this.componentName = "Table";
    }

    return Table;
});