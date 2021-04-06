W.defineModule("comp/guide/Pip", [ "mod/Util"], function(util) {
    function Pip(data) {
        var _this = this;

        var mode = 0;

        var index = 0;
        var _menus = [];
        var _comp;
        var currentPr;
        var currentTime;

        var channelData = data;

        var create = function(){
            _comp = new W.Div({id:"pip_area", x:53, y:92, width:"1227px", height:"194px", display:"none"});

            _comp._iframe_area = new W.Div({id:"iframe_area", x:53-53, y:92-92, width:"346px", height:"194px"});
            _comp._iframe_area._audio = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_audio_ch.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._audio);
            _comp._iframe_area._adult = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_audult_ch.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._adult);
            _comp._iframe_area._notsubscribed = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_not_subscribed.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._notsubscribed);
            _comp._iframe_area._vod_promotion = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_promotion_ch.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._vod_promotion);
            _comp._iframe_area._restrict = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_restrict_ch.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._restrict);
            _comp._iframe_area._restrictprogram = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_restrict_program.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._restrictprogram);
            _comp._iframe_area._restricttime = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_restrict_time.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._restricttime);
            _comp._iframe_area._ch_vod = new W.Image({x:0, y:0, width:346, height:194, display:"none", src:"img/iframe_epg_vod_ch.jpg"});
            _comp._iframe_area.add(_comp._iframe_area._ch_vod);
            _comp._iframe_area._preview = new W.Div({x:0, y:159, width:346, height:35, display:"none", color:"rgba(0,0,0,0.84)"});
            _comp._iframe_area._preview._min =  new W.Div({text:"", x:0, y:0, width:114, height:35, lineHeight:"35px",
                textColor:"rgba(237,168,2,1)", fontFamily:"RixHeadM", "font-size":"16px", textAlign:"right", "letter-spacing" : "-0.8px"});
            _comp._iframe_area._preview.add(_comp._iframe_area._preview._min);
            _comp._iframe_area._preview._min_text =  new W.Div({text:W.Texts["channel_preview"], x:118, y:0, width:346-115, height:35, lineHeight:"35px",
                textColor:"rgba(255,255,255,0.75)", fontFamily:"RixHeadL", "font-size":"16px", textAlign:"left", "letter-spacing" : "-0.8px"});
            _comp._iframe_area._preview.add(_comp._iframe_area._preview._min_text);
            _comp._iframe_area.add(_comp._iframe_area._preview);

            _comp.add(_comp._iframe_area);

            _comp._pr_area = new W.Div({id:"pr_area", x:431-53, y:117-92, width:"848px", height:"169px"});
            _comp._pr_area._ch_num = new W.Div({text:"", x:431-431, y:131-20-117, width:235, height:25, lineHeight:"25px",
                textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left", "letter-spacing" : "-1.0px"});
            _comp._pr_area.add(_comp._pr_area._ch_num);
            _comp._pr_area._ch_name = new W.Div({text:"", x:478-431, y:131-20-117, width:235, height:25, lineHeight:"25px",
                textColor:"rgba(180,180,180,1)", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left", "letter-spacing" : "-1.0px"});
            _comp._pr_area.add(_comp._pr_area._ch_name);

            _comp._pr_area._pr_name = new W.Div({x:431-431, y:175-34-117, height:40, width:800});
            _comp._pr_area._pr_name._title = new W.Div({position:"relative", float:"left", text:"", x:0, y:0, height:40, "max-width":"680px", className:"cut", lineHeight:"40px",
                textColor:"rgba(250,250,240,1)", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"left", "letter-spacing" : "-1.7px"});
            _comp._pr_area._pr_name.add(_comp._pr_area._pr_name._title);
            _comp._pr_area._pr_name._icon = new W.Div({position:"relative", float:"left", x:0, y:0, height:40, "max-width":"120px"});
            _comp._pr_area._pr_name.add(_comp._pr_area._pr_name._icon);
            _comp._pr_area.add(_comp._pr_area._pr_name);

            _comp._pr_area._start_time = new W.Div({text:"", x:434-431, y:86, height:20, lineHeight:"20px",
                textColor:"rgba(178,178,178,1)", fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left", "letter-spacing" : "-0.7px"});
            _comp._pr_area.add(_comp._pr_area._start_time);
            _comp._pr_area._end_time = new W.Div({text:"", x:662-431, y:86, height:20, lineHeight:"20px",
                textColor:"rgba(178,178,178,1)", fontFamily:"RixHeadM", "font-size":"16px", textAlign:"left", "letter-spacing" : "-0.7px"});
            _comp._pr_area.add(_comp._pr_area._end_time);
            _comp._pr_area._progress_bg = new W.Div({x:483-431, y:212-117, width:167, height:3, color:"rgba(84,84,84,0.56)"});
            _comp._pr_area.add(_comp._pr_area._progress_bg);
            _comp._pr_area._progress = new W.Div({x:483-431, y:212-117, width:0, height:3, color:"rgba(255,255,255,1)"});
            _comp._pr_area.add(_comp._pr_area._progress);

            _comp._pr_area._info = new W.Div({x:281, y:216-14-117});
            _comp._pr_area.add(_comp._pr_area._info);

            _comp.add(_comp._pr_area);
        };

        var setPr = function(_pr, _currentTime) {
            W.log.info(_pr);
            currentPr = _pr;
            currentTime = _currentTime;
            _comp._pr_area._ch_num.setText(util.changeDigit(_pr.ch.channelNum, 3));
            _comp._pr_area._ch_name.setText(_pr.ch.title);
            if(_pr.pr) {
                _comp._pr_area._pr_name._title.setText(_pr.pr.title);
                _comp._pr_area._pr_name._icon.setText("");

                /*if(_pr.pr.rating) {
                    _comp._pr_area._pr_name._icon.add(new W.Image({width:25, height:25, position:"relative", y:7,
                       marginLeft:"10px", marginRight:"-5px", src:"img/info_miniepg_"+_pr.pr.rating.toLocaleLowerCase()+".png"}));
                }
                if(util.findReserveProgram(_pr.pr.sourceId, _pr.pr.start_time, _pr.pr.title)) {
                    _comp._pr_area._pr_name._icon.add(new W.Image({position:"relative", src:"img/info_miniepg_resv.png", width:69, height:25, y:7, marginLeft:"10px"}));
                }*/

                _comp._pr_area._info.setText("");
                if(_pr.pr.rating) {
                    _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                        marginLeft:"5px", src:"img/info_miniepg_"+_pr.pr.rating.toLocaleLowerCase()+".png"}));
                }
                if(_pr.pr.resolution) {
                    _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                       marginLeft:"5px", src:"img/info_"+_pr.pr.resolution.toLocaleLowerCase()+"_miniepg.png"}));
                }
                if(_pr.pr.isAudioMultiplex) {
                    _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                        marginLeft:"5px", src:"img/info_bilingual_miniepg.png"}));
                }
                if(W.StbConfig.isVisualImpaired) {
                    if(_pr.pr.isCommentary) {
                        _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                            marginLeft:"5px", src:"img/info_explanation_miniepg.png"}));
                    }
                    if(_pr.pr.isCaption) {
                        _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                            marginLeft:"5px", src:"img/info_sub_miniepg.png"}));
                    }
                }

                if(_pr.pr.audioMode && _pr.pr.audioMode.toLocaleLowerCase() == "5.1") {
                    _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                        marginLeft:"5px", src:"img/info_5_1_miniepg.png"}));
                } else if(_pr.pr.audioMode) {
                    _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                        marginLeft:"5px", src:"img/info_stereo_miniepg.png"}));
                }
                if(util.findReserveProgram(_pr.pr.sourceId, _pr.pr.start_time, _pr.pr.title)) {
                    _comp._pr_area._info.add(new W.Image({position:"relative", y:1,
                        marginLeft:"5px", src:"img/info_resv_miniepg.png"}));
                }


                if(_pr.ch.isBlocked || (_pr.ch.isAdult && !_pr.ch.needOpen)) {
                    _comp._pr_area._start_time.setStyle({display:"none"});
                    _comp._pr_area._end_time.setStyle({display:"none"});
                    setProgress(true);
                } else if(_pr.ch && _pr.ch.channelType && _pr.ch.channelType.code == "60") {
                    _comp._pr_area._start_time.setStyle({display:"none"});
                    _comp._pr_area._end_time.setStyle({display:"none"});
                    setProgress(true);
                } else {
                    var sTime = new Date(_pr.pr.start_time);
                    _comp._pr_area._start_time.setText(util.changeDigit(sTime.getHours(), 2) + ":" + util.changeDigit(sTime.getMinutes(), 2));
                    var eTime = new Date(_pr.pr.end_time);
                    _comp._pr_area._end_time.setText(util.changeDigit(eTime.getHours(), 2) + ":" + util.changeDigit(eTime.getMinutes(), 2));
                    _comp._pr_area._start_time.setStyle({display:"block"});
                    _comp._pr_area._end_time.setStyle({display:"block"});
                    setProgress();
                }
            } else {
                _comp._pr_area._start_time.setStyle({display:"none"});
                _comp._pr_area._end_time.setStyle({display:"none"});
                setProgress(true);
            }

        }

        var setActive = function() {
            W.log.info("pip setActive");
            _comp.setDisplay("block");
            //_this.setIframe();
            if(W.Config.DEVICE == "BOX") {
                W.CloudManager.resizeVideo(function() {

                }, false, {x:53,y:92,w:346,h:194});
            }
        };

        var deActive = function() {
            W.log.info("pip deActive");
            _comp.setDisplay("none");
            W.CloudManager.resizeVideo(function() {

            }, true);
        };

        var setProgress = function(isHide) {
            if(isHide) {
                _comp._pr_area._progress.setStyle({display:"none"});
                _comp._pr_area._progress_bg.setStyle({display:"none"});
            } else {
                var progressWidth = (currentTime - currentPr.pr.start_time > 0 && currentPr.pr.end_time-currentTime > 0) ? (currentTime-currentPr.pr.start_time)/(currentPr.pr.end_time-currentPr.pr.start_time)*167 : 0;
                _comp._pr_area._progress.setStyle({display:"block", width:progressWidth});
                _comp._pr_area._progress_bg.setStyle({display:"block"});
            }
        }

        this.getComp = function(_mode) {
            mode = _mode;
            if(!_comp) create(mode);
            return _comp;
        };

        this.setPr = function(_pr, _currentTime) {
            setPr(_pr, _currentTime);
        }

        this.setActive = function() {
            setActive();
        };

        this.deActive = function() {
            deActive();
        };

        this.timeUpdate = function(_currentTime) {
            currentTime = _currentTime;
            if(currentPr && currentPr.pr) setProgress();
        };

        this.setIframe = function(_srcId, _type) {
            W.log.info("Pip setIframe");
            _comp._iframe_area._audio.setStyle({display:"none"});
            _comp._iframe_area._adult.setStyle({display:"none"});
            _comp._iframe_area._notsubscribed.setStyle({display:"none"});
            _comp._iframe_area._vod_promotion.setStyle({display:"none"});
            _comp._iframe_area._restrict.setStyle({display:"none"});
            _comp._iframe_area._restrictprogram.setStyle({display:"none"});
            _comp._iframe_area._restricttime.setStyle({display:"none"});
            _comp._iframe_area._ch_vod.setStyle({display:"none"});
            _comp._iframe_area._preview.setStyle({display:"none"});

            var isChVodChannel = false;
            if(_srcId) {
                var currentCh = util.findChannelbySrcId(_srcId, channelData);
                if(currentCh && currentCh.channelType) {
                    if(currentCh.channelType.code == "60") {
                        _comp._iframe_area._ch_vod.setStyle({display:"block"});
                        isChVodChannel = true;
                    } else if(currentCh.channelType.code == "61") {
                        _comp._iframe_area._vod_promotion.setStyle({display:"block"});
                    }

                }
            }
            
//            if(isChVodChannel){
//            	if(!W.state.start == "CH_VOD"){
//            		W.state.start = "CH_VOD";
//            		W.StbConfig.sceneValue = _srcId;
//            	}
//            }else{
//            	if(W.state.start == "CH_VOD"){
//            		W.SceneManager.removeSceneStack("ChannelVodScene");
//            		W.state.start = undefined;
//            	}
//            }
            

            if(!_type) {

            } else if(_type == "time") { //시청시간 제한
                _comp._iframe_area._restricttime.setStyle({display:"block"});
            } else if(_type == "block") {    //시청제한
                _comp._iframe_area._restrict.setStyle({display:"block"});
            } else if(_type == "parental") { //연령제한
                _comp._iframe_area._restrictprogram.setStyle({display:"block"});
            } else if(_type == "unsub") {    //미가입
                _comp._iframe_area._notsubscribed.setStyle({display:"block"});
            } else if(_type == "audio") {    //오디오
                _comp._iframe_area._audio.setStyle({display:"block"});
            } else if(_type.includes("preview")) {  //미리보기
                _comp._iframe_area._preview.setStyle({display:"block"});
                _comp._iframe_area._preview._min.setText(Math.ceil(_type.split("preview")[1]/60) + W.Texts["minute"]);
            }

        }

    }

    return Pip;
});