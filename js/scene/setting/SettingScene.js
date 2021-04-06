/**
 * scene/SettingScene
 *
 */
W.defineModule([ "mod/Util", "comp/setting/FavoriteChannel", "comp/setting/SkippedChannel", "comp/setting/BlockedChannel", "comp/setting/TimeRestricted",
        "comp/setting/ParentalRating", "comp/setting/VODLookStyle", "comp/setting/VODContinuousPlay", "comp/setting/MenuTransparency", "comp/setting/AudioOutput",
        "comp/setting/AudioLanguage", "comp/setting/MenuDuration", "comp/setting/StartChannelOption", "comp/setting/MiniEpgBarking", "comp/setting/MiniEpgDuration",
        "comp/setting/VisualImpaired", "comp/setting/ClosedCaptionService", "comp/setting/ScreenRatio", "comp/setting/MenuLanguage", "comp/setting/AutoStandby",
        "comp/setting/TVPowerControl", "comp/setting/Resolution", "comp/setting/Bluetooth", "comp/setting/SmartDevice", "comp/setting/SystemInfo",
        "comp/setting/AdultPinChange", "comp/setting/PurchasePinChange", "comp/setting/RemoteGuide", "comp/setting/LiveTrigger", "comp/setting/Reset"],
    function(util, FavoriteChannel, SkippedChannel, BlockedChannel, TimeRestricted,
             ParentalRating, VODLookStyle, VODContinuousPlay, MenuTransparency, AudioOutput,
             AudioLanguage, MenuDuration, StartChannelOption, MiniEpgBarking, MiniEpgDuration,
             VisualImpaired, ClosedCaptionService, ScreenRatio, MenuLanguage, AutoStandby,
             TVPowerControl, Resolution, Bluetooth, SmartDevice, SystemInfo,
             AdultPinChange, PurchasePinChange, RemoteGuide, LiveTrigger, Reset) {
        var STATE_TOP = 0;
        var STATE_BANNER = 1;
        var STATE_MENU = 2;
        var STATE_SUB_MENU = 3;
        var STATE_COMP = 4;

        var _thisScene = "SettingScene";
        var _this;
        var _parentDiv;
        var currMenu;
        var currComponent;
        var _currComponent;
        var keyTimeout;

        var state = STATE_COMP;

        var dataManager = W.getModule("manager/SdpDataManager");

        W.log.info("### Initializing " + _thisScene + " scene ###");

        function create(param) {
            switch (param.targetId) {//param.targetId
                case "CC1001":  //7002 : 선호채널
                    currComponent = new FavoriteChannel();
                    _this.getKey = "getUserChannel";
                    _this.setKey = "setFavoriteChannel";
                    break;
                case "CC1002":  //7003 : 숨김채널
                    currComponent = new SkippedChannel();
                    _this.getKey = "getUserChannel";
                    _this.setKey = "setSkippedChannel";
                    _this.isAdultOnly = true;
                    break;
                case "CC1003":  //7004 : 시청제한채널
                    currComponent = new BlockedChannel();
                    _this.getKey = "getUserChannel";
                    _this.setKey = "setBlockedChannel";
                    _this.isAdultOnly = true;
                    break;
                case "CC1004":  //7005 : 시청연령제한
                    currComponent = new ParentalRating();
                    _this.getKey = "getParentalRating";
                    _this.setKey = "setParentalRating";
                    _this.isAdultOnly = true;
                    break;
                case "CC1005":  //7006 : 시청시간제한
                    currComponent = new TimeRestricted();
                    _this.getKey = "getTimeRestricted";
                    _this.setKey = "setTimeRestricted";
                    _this.isAdultOnly = true;
                    break;
                case "CC1006":  //7007 : 성인 인증번호 변경
                    currComponent = new AdultPinChange();
                    _this.command = "CHANGE_PIN";
                    _this.getKey = "ADULT";
                    _this.setKey = "ADULT";
                    _this.isAdultOnly = true;
                    break;
                case "CC1007":  //7008 : VOD 보기 방식
                    currComponent = new VODLookStyle();
                    _this.getKey = "getVODLookStyle";
                    _this.setKey = "setVODLookStyle";
                    break;
                case "CC1008":  //7009 : 구매 비밀번호 변경
                    currComponent = new PurchasePinChange();
                    _this.command = "CHANGE_PIN";
                    _this.getKey = "PURCHASE";
                    _this.setKey = "PURCHASE";
                    _this.isPurchase = true;
                    break;
                case "CC1009":  //7010 : VOD 연속 시청
                    currComponent = new VODContinuousPlay();
                    _this.getKey = "getVODContinuousPlay";
                    _this.setKey = "setVODContinuousPlay";
                    break;
                case "CC1010":  //7011 : 배경화면 밝기
                    currComponent = new MenuTransparency();
                    _this.getKey = "getMenuTransparency";
                    _this.setKey = "setMenuTransparency";
                    break;
                case "CC1011":  //7012 : 기본 음성 설정
                    currComponent = new AudioLanguage();
                    _this.getKey = "getAudioLanguage";
                    _this.setKey = "setAudioLanguage";
                    break;
                case "CC1012":  //7013 : 오디오 출력
                    currComponent = new AudioOutput();
                    _this.getKey = "getAudioOutput";
                    _this.setKey = "setAudioOutput";
                    break;
                case "CC1013":  //7014 : 시작화면
                    currComponent = new StartChannelOption();
                    _this.getKey = "getStartChannelOption";
                    _this.setKey = "setStartChannelOption";
                    break;
                case "CC1014":  //7015 : 메뉴 표시시간
                    currComponent = new MenuDuration();
                    _this.getKey = "getMenuDuration";
                    _this.setKey = "setMenuDuration";
                    break;
                case "CC1015":  //7016 : 미니EPG 설정
                    currComponent = new MiniEpgDuration();
                    _this.getKey = "getMiniEpgDuration";
                    _this.setKey = "setMiniEpgDuration";
                    break;
                case "CC1016":  //7017 : VOD 배너 노출 설정
                    currComponent = new MiniEpgBarking();
                    _this.getKey = "getMiniEpgBarking";
                    _this.setKey = "setMiniEpgBarking";
                    break;
                case "CC1017":  //7018 : 자막방송
                    currComponent = new ClosedCaptionService();
                    _this.getKey = "getClosedCaptionService";
                    _this.setKey = "setClosedCaptionService";
                    break;
                case "CC1018":  //7019 : 해설방송
                    currComponent = new VisualImpaired();
                    _this.getKey = "getVisualImpaired";
                    _this.setKey = "setVisualImpaired";
                    break;
                case "CC1019":  //7020 : 메뉴언어
                    currComponent = new MenuLanguage();
                    _this.getKey = "getMenuLanguage";
                    _this.setKey = "setMenuLanguage";
                    break;
                case "CC1020":  //7021 : 화면비율
                    currComponent = new ScreenRatio();
                    _this.getKey = "getScreenRatio";
                    _this.setKey = "setScreenRatio";
                    break;
                case "CC1021":  //7022 : TV전원제어
                    currComponent = new TVPowerControl();
                    _this.getKey = "getTVPowerControl";
                    _this.setKey = "setTVPowerControl";
                    break;
                case "CC1022":  //7023 : 자동대기모드
                    currComponent = new AutoStandby();
                    _this.getKey = "getAutoStandby";
                    _this.setKey = "setAutoStandby";
                    break;
                case "CC1023":  //7024 : 블루투스 장치(UHD)
                    currComponent = new Bluetooth();
                    _this.getKey = "getBluetooth";
                    _this.setKey = "setBluetooth";
                    break;
                case "CC1024":  //7025 : 해상도 (UHD)
                    currComponent = new Resolution();
                    _this.getKey = "getResolution";
                    _this.setKey = "setResolution";
                    break;
                case "CC1025":  //7026 : 리모턴 이용 안내
                    currComponent = new RemoteGuide();
                    _this.getKey = "getRemoteGuide";
                    _this.setKey = "setRemoteGuide";
                    break;
                case "CC1026":  //7027 : 스마트 기기 설정
                    currComponent = new SmartDevice();
                    _this.getKey = "getSmartDevice";
                    _this.setKey = "setSmartDevice";
                    break;
                case "CC1027":  //7028 : 시스템 초기화
                    currComponent = new Reset();
                    //_this.isAdultOnly = true;
                    break;
                case "CC1028":  //7029 : 시스템 정보
                    currComponent = new SystemInfo();
                    _this.getKey = "getSystemInfo";
                    _this.setKey = "setSystemInfo";
                    break;
                case "CC1029":  //7029 : 시스템 정보
                    currComponent = new LiveTrigger();
                    _this.getKey = "getChannelFourWay";
                    _this.setKey = "setChannelFourWay";
                    break;
            }

            if(_this.isAdultOnly) {
                var popup = {
                    type:_this.param.targetId == "CC1027" ? "clear_setting" : "",
                    popupName:"popup/AdultCheckPopup"
                };
                W.PopupManager.openPopup(popup);
            } else if(_this.isPurchase) {
                var popup = {
                    type:"purchase",
                    popupName:"popup/AdultCheckPopup"
                };
                W.PopupManager.openPopup(popup);
            } else {
                addComp();
            }


        }

        function addComp(_oldPIN) {
            _currComponent = currComponent.getComp(saveCallback, _this.param.title);
            _parentDiv._comp_area.add(_currComponent);
            
            if(_this.param.targetId == "CC1006" || _this.param.targetId == "CC1008") {
                currComponent.setOldPIN(_oldPIN);
            } else if(_this.param.targetId != "CC1025" && _this.param.targetId != "CC1026" && _this.param.targetId != "CC1027") {
                W.Loading.start();
                W.CloudManager.send(function(data){

                    if(data && (data.data == "OK" || typeof data.data == "object")) {
                        switch (_this.param.targetId) {//param.targetId
                            case "CC1001":  //7002 : 선호채널
                                W.StbConfig.favoriteChannelList = (data.data.favorite != undefined) ? data.data.favorite : {sourceIds:[]};
                                W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                                W.StbConfig.skippedChannelList = (data.data.skipped != undefined) ? data.data.skipped : {sourceIds:[], skipUnsubscribed:false};
                                W.StbConfig.blockedChannelList = (data.data.blocked != undefined) ? data.data.blocked : {sourceIds:[]};
                                break;
                            case "CC1002":  //7003 : 숨김채널
                                W.StbConfig.favoriteChannelList = (data.data.favorite != undefined) ? data.data.favorite : {sourceIds:[]};
                                W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                                W.StbConfig.skippedChannelList = (data.data.skipped != undefined) ? data.data.skipped : {sourceIds:[], skipUnsubscribed:false};
                                W.StbConfig.blockedChannelList = (data.data.blocked != undefined) ? data.data.blocked : {sourceIds:[]};
                                break;
                            case "CC1003":  //7004 : 시청제한채널
                                W.StbConfig.favoriteChannelList = (data.data.favorite != undefined) ? data.data.favorite : {sourceIds:[]};
                                W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                                W.StbConfig.skippedChannelList = (data.data.skipped != undefined) ? data.data.skipped : {sourceIds:[], skipUnsubscribed:false};
                                W.StbConfig.blockedChannelList = (data.data.blocked != undefined) ? data.data.blocked : {sourceIds:[]};
                                break;
                            case "CC1004":  //7005 : 시청연령제한
                                W.StbConfig.parentalRating = {};
                                W.StbConfig.parentalRating.rating =	(data.data != undefined && data.data.rating != undefined) ? data.data.rating : 1;
                                W.StbConfig.parentalRating.adultMenu = (data.data != undefined && data.data.adultMenu != undefined) ? data.data.adultMenu : 1;
                                W.StbConfig.rating = W.StbConfig.parentalRating.rating;
                                W.StbConfig.adultMenuUse = W.StbConfig.parentalRating.adultMenu;
                                break;
                            case "CC1005":  //7006 : 시청시간제한
                                W.StbConfig.timeRestricted = {};
                                W.StbConfig.timeRestricted.repeat =	(data.data != undefined && data.data.repeat != undefined) ? data.data.repeat : 1;
                                W.StbConfig.timeRestricted.startTime = (data.data != undefined && data.data.startTime != undefined) ? data.data.startTime : "0000";
                                W.StbConfig.timeRestricted.endTime = (data.data != undefined && data.data.endTime != undefined) ? data.data.endTime : "0000";
                                break;
                            case "CC1006":  //7007 : 성인 인증번호 변경
                                break;
                            case "CC1007":  //7008 : VOD 보기 방식
                                W.StbConfig.vodLookStyle = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1008":  //7009 : 구매 비밀번호 변경
                                break;
                            case "CC1009":  //7010 : VOD 연속 시청
                                W.StbConfig.vodContinuousPlay = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1010":  //7011 : 배경화면 밝기
                                W.StbConfig.menuTransparency = (data.data != undefined) ? data.data : 1;
                                var btOpacities = [0.1, 0.2, 0.3, 0.4, 0.5];
                                var bgs = document.querySelectorAll(".home_bg_color");
                                for(var i=0; i < bgs.length; i++){
                                    bgs[i].style.opacity = btOpacities[W.StbConfig.menuTransparency - 1];
                                }
                                W.changeBgOpacity();
                                break;
                            case "CC1011":  //7012 : 기본 음성 설정
                                W.StbConfig.audioLanguage = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1012":  //7013 : 오디오 출력
                                W.StbConfig.audioOutput = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1013":  //7014 : 시작화면
                                W.StbConfig.startChannelOption = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1014":  //7015 : 메뉴 표시시간
                                W.StbConfig.menuDuration = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1015":  //7016 : 미니EPG 설정
                                W.StbConfig.miniEpgDuration = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1016":  //7017 : VOD 배너 노출 설정
                                break;
                            case "CC1017":  //7018 : 자막방송
                                W.StbConfig.closedCaptionService = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1018":  //7019 : 해설방송
                                W.StbConfig.visualImpaired = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1019":  //7020 : 메뉴언어
                                W.StbConfig.menuLanguage = (data.data != undefined) ? data.data : 1;
                                if(W.StbConfig.menuLanguage == 2) W.StbConfig.menuLanguage = "ENG";
                                else if(W.StbConfig.menuLanguage == 3) W.StbConfig.menuLanguage = "JPN";
                                else if(W.StbConfig.menuLanguage == 4) W.StbConfig.menuLanguage = "ZHO";
                                else W.StbConfig.menuLanguage = "KOR";
                                break;
                            case "CC1020":  //7021 : 화면비율
                                W.StbConfig.screenRatio = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1021":  //7022 : TV전원제어
                                W.StbConfig.TVPowerControl = {};
                                W.StbConfig.TVPowerControl.option =	(data.data != undefined && data.data.option != undefined) ? data.data.option : 2;
                                W.StbConfig.TVPowerControl.start = (data.data != undefined && data.data.start != undefined) ? data.data.start : "0000";
                                W.StbConfig.TVPowerControl.end = (data.data != undefined && data.data.end != undefined) ? data.data.end : "0000";
                                W.StbConfig.TVPowerControl.repeat =	(data.data != undefined && data.data.repeat != undefined) ? data.data.repeat : 1;
                                break;
                            case "CC1022":  //7023 : 자동대기모드
                                W.StbConfig.autoStandby = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1023":  //7024 : 블루투스 장치(UHD)
                                W.StbConfig.bluetooth = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1024":  //7025 : 해상도 (UHD)
                                W.StbConfig.resolution = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1025":  //7026 : 리모턴 이용 안내
                                break;
                            case "CC1026":  //7027 : 스마트 기기 설정
                                W.StbConfig.smartDevice = (data.data != undefined) ? data.data : 1;
                                break;
                            case "CC1027":  //7028 : 시스템 초기화
                                break;
                            case "CC1028":  //7029 : 시스템 정보
                                break;
                            case "CC1029":  //7027 : 4방향 트리거
                                W.StbConfig.liveTrigger = (data.data != undefined) ? data.data : 1;
                                break;
                        }
                    } else {

                    }

                    currComponent.setData(data);

                    W.Loading.stop();
                }, {cmd:"GET_SETTING", key:_this.getKey});
            }
        }
        
        function openSuccessFeedback(){
        	if(_this.param.targetId == "CC1004" || _this.param.targetId == "CC1007" || _this.param.targetId == "CC1019"
                || _this.param.targetId == "1001" || _this.param.targetId == "CC1002" || _this.param.targetId == "CC1003"){
        		W.SceneManager.destroyAll(true, true);
        	}else{
                _this.backScene();
        	}
        	W.PopupManager.openPopup({
                childComp:_this,
                popupName:"popup/FeedbackPopup",
                title:W.Texts["saved"]}
            );
        };

        function saveCallback(isSave, _data) {
            W.log.info("saveSetting :::",_data)
            if(isSave) {
                if(_this.param.targetId == "CC1025" || _this.param.targetId == "CC1028" || _this.param.targetId == "CC1024") {
                    if(_this.param.targetId == "CC1024") {
                        W.StbConfig.resolution = (_data != undefined) ? _data : 1;

                        _this.backScene(1, true);
                        
                        openSuccessFeedback();
                    }
                } else {
                    W.Loading.start();
                    W.CloudManager.send(function(callbackData, data){
                        W.log.info("SET SETTING Recevied ::: ");
                        W.log.info(callbackData);

                        if(callbackData.data == "OK") {
                            switch (_this.param.targetId) {//param.targetId
                                case "CC1001":  //7002 : 선호채널
                                    W.StbConfig.favoriteChannelList = {};
                                    W.StbConfig.favoriteChannelList.sourceIds =	(data != undefined && data.sourceIds != undefined) ? data.sourceIds : [];
                                    W.StbConfig.favChCount = W.StbConfig.favoriteChannelList.sourceIds.length;
                                    break;
                                case "CC1002":  //7003 : 숨김채널
                                    W.StbConfig.skippedChannelList = {};
                                    W.StbConfig.skippedChannelList.sourceIds =	(data != undefined && data.sourceIds != undefined) ? data.sourceIds : [];
                                    W.StbConfig.skippedChannelList.skipUnsubscribed = (data != undefined && data.skipUnsubscribed != undefined) ? data.skipUnsubscribed : false;
                                    break;
                                case "CC1003":  //7004 : 시청제한채널
                                    W.StbConfig.blockedChannelList = {};
                                    W.StbConfig.blockedChannelList.sourceIds =	(data != undefined && data.sourceIds != undefined) ? data.sourceIds : [];
                                    break;
                                case "CC1004":  //7005 : 시청연령제한
                                    W.StbConfig.parentalRating = {};
                                    W.StbConfig.parentalRating.rating =	(data != undefined && data.rating != undefined) ? data.rating : 1;
                                    W.StbConfig.parentalRating.adultMenu = (data != undefined && data.adultMenu != undefined) ? data.adultMenu : 0;
                                    W.StbConfig.rating = W.StbConfig.parentalRating.rating;
                                    W.StbConfig.adultMenuUse = W.StbConfig.parentalRating.adultMenu;
                                    break;
                                case "CC1005":  //7006 : 시청시간제한
                                    W.StbConfig.timeRestricted = {};
                                    W.StbConfig.timeRestricted.repeat =	(data != undefined && data.repeat != undefined) ? data.repeat : 1;
                                    W.StbConfig.timeRestricted.startTime = (data != undefined && data.startTime != undefined) ? data.startTime : "0000";
                                    W.StbConfig.timeRestricted.endTime = (data != undefined && data.endTime != undefined) ? data.endTime : "0000";
                                    break;
                                case "CC1006":  //7007 : 성인 인증번호 변경
                                    break;
                                case "CC1007":  //7008 : VOD 보기 방식
                                    W.StbConfig.vodLookStyle = (data != undefined) ? data : 1;
                                    break;
                                case "CC1008":  //7009 : 구매 비밀번호 변경
                                    break;
                                case "CC1009":  //7010 : VOD 연속 시청
                                    W.StbConfig.vodContinuousPlay = (data != undefined) ? data : 1;
                                    break;
                                case "CC1010":  //7011 : 배경화면 밝기
                                    W.StbConfig.menuTransparency = (data != undefined) ? data : 1;
                                    var btOpacities = [0.1, 0.2, 0.3, 0.4, 0.5];
                                    var bgs = document.querySelectorAll(".home_bg_color");
                                    for(var i=0; i < bgs.length; i++){
                                    	bgs[i].style.opacity = btOpacities[W.StbConfig.menuTransparency - 1];
                                    }
                                    W.changeBgOpacity();
                                    break;
                                case "CC1011":  //7012 : 기본 음성 설정
                                    W.StbConfig.audioLanguage = (data != undefined) ? data : 1;
                                    break;
                                case "CC1012":  //7013 : 오디오 출력
                                    W.StbConfig.audioOutput = (data != undefined) ? data : 1;
                                    break;
                                case "CC1013":  //7014 : 시작화면
                                    W.StbConfig.startChannelOption = (data != undefined) ? data : 1;
                                    break;
                                case "CC1014":  //7015 : 메뉴 표시시간
                                    W.StbConfig.menuDuration = (data != undefined) ? data : 1;
                                    break;
                                case "CC1015":  //7016 : 미니EPG 설정
                                    W.StbConfig.miniEpgDuration = (data != undefined) ? data : 1;
                                    break;
                                case "CC1016":  //7017 : VOD 배너 노출 설정
                                    break;
                                case "CC1017":  //7018 : 자막방송
                                    W.StbConfig.closedCaptionService = (data != undefined) ? data : 1;
                                    break;
                                case "CC1018":  //7019 : 해설방송
                                    W.StbConfig.visualImpaired = (data != undefined) ? data : 1;
                                    break;
                                case "CC1019":  //7020 : 메뉴언어
                                    W.StbConfig.menuLanguage = (data != undefined) ? data : 1;
                                    if(W.StbConfig.menuLanguage == 2) W.StbConfig.menuLanguage = "ENG";
                                    else if(W.StbConfig.menuLanguage == 3) W.StbConfig.menuLanguage = "JPN";
                                    else if(W.StbConfig.menuLanguage == 4) W.StbConfig.menuLanguage = "ZHO";
                                    else W.StbConfig.menuLanguage = "KOR";
                                    break;
                                case "CC1020":  //7021 : 화면비율
                                    W.StbConfig.screenRatio = (data != undefined) ? data : 1;
                                    break;
                                case "CC1021":  //7022 : TV전원제어
                                    W.StbConfig.TVPowerControl = {};
                                    W.StbConfig.TVPowerControl.option =	(data != undefined && data.option != undefined) ? data.option : 2;
                                    W.StbConfig.TVPowerControl.start = (data != undefined && data.start != undefined) ? data.start : "0000";
                                    W.StbConfig.TVPowerControl.end = (data != undefined && data.end != undefined) ? data.end : "0000";
                                    W.StbConfig.TVPowerControl.repeat =	(data != undefined && data.repeat != undefined) ? data.repeat : 1;
                                    break;
                                case "CC1022":  //7023 : 자동대기모드
                                    W.StbConfig.autoStandby = (data != undefined) ? data : 1;
                                    break;
                                case "CC1023":  //7024 : 블루투스 장치(UHD)
                                    W.StbConfig.bluetooth = (data != undefined) ? data : 1;
                                    break;
                                case "CC1024":  //7025 : 해상도 (UHD)
                                    W.StbConfig.resolution = (data != undefined) ? data : 1;
                                    break;
                                case "CC1025":  //7026 : 리모턴 이용 안내
                                    break;
                                case "CC1026":  //7027 : 스마트 기기 설정
                                    W.StbConfig.smartDevice = (data != undefined) ? data : 1;
                                    break;
                                case "CC1027":  //7028 : 시스템 초기화
                                    break;
                                case "CC1028":  //7029 : 시스템 정보
                                    break;
                                case "CC1029":  //7027 : 4방향 트리거
                                    W.StbConfig.liveTrigger = (data != undefined) ? data : 1;
                                    break;
                            }

                            if(_this.param.targetId == "CC1019"){
                            	W.TextManager.changeLang(function(){
                            		_this.backScene(1, true);
                                    openSuccessFeedback();
                            	});
                            }else{
                                _this.backScene(1, true);
                                openSuccessFeedback();
                            }

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

                    }, {cmd:_this.command ? _this.command : "SET_SETTING", key:_this.setKey, data:_data}, _data);
                }
            } else {
                _this.backScene();
            }
        }
        
        function checkTitle(_param) {
            if(_param.title) {
                create(_param);
            } else {
                var reqData = {selector:"@detail"};
                dataManager.getMenuTree(function(result, resultData){
                    if(result && resultData && resultData.data && resultData.data.length > 0){
                        var settingMenu = resultData.data.find(function(menu){
                            if(menu.menuType == "MC0010")
                                return true;
                        })
                        var settingCategory;
                        if(settingMenu) {
                            settingCategory = settingMenu.children.find(function(menu){
                                if(menu.categoryCode == _param.targetId)
                                    return true;
                            })
                        } else {

                        }
                        if(settingCategory) _param.title = settingCategory.title;
                        create(_param);
                    } else {
                        W.PopupManager.openPopup({
                            childComp:_this,
                            popupName:"popup/ErrorPopup",
                            code: (resultData && resultData.error && resultData.error.code) ? resultData.error.code : "9999",
                            message : (resultData && resultData.error && resultData.error.message) ? [resultData.error.message] : null,
                			from : "SDP"
                            //messageArray
                        });
                    }
                }, reqData);
            }
            
        }

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                _this.param = param;
                W.log.info(param);
                _this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_Y]);

                _parentDiv = new W.Div({className : "bg_size"});
                _parentDiv._bg = new W.Div({x:0, y:0, width:1280, height:720, className : "bg_color"});
                _parentDiv.add(_parentDiv._bg);
                _parentDiv._comp_area = new W.Div({id:"comp_area", className : "bg_size"});
                _parentDiv.add(_parentDiv._comp_area);

                _this.isAdultOnly = false;
                _this.isPurchase = false;

                if((_this.param.targetId && (_this.param.targetId=="CC1001" || _this.param.targetId=="CC1002" || _this.param.targetId=="CC1003")) && !W.CH_LIST) {
                    dataManager.getChannelRegions(function(isSuccess, channels){
                        if(isSuccess) {
                            if(channels && channels.data && channels.data.length > 0) {
                                W.CH_LIST = channels.data;
                            }
                        }
                        checkTitle(param);
                    }, {offset:0, limit:0});
                } else {
                    checkTitle(param);
                }
                _this.add(_parentDiv);
            },
            onPause: function() {

            },
            onResume: function() {

            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");

            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " ,, state : " + state);

                switch (event.keyCode) {
                    case W.KEY.RIGHT:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else{
                        }

                        break;
                    case W.KEY.LEFT:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else{
                        }

                        break;
                    case W.KEY.UP:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else if(state > STATE_TOP){
                        }
                        break;
                    case W.KEY.DOWN:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else{
                        }
                        break;
                    case W.KEY.ENTER:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else if(state == STATE_TOP){
                        }
                        break;
                    case W.KEY.BACK:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }else if(state == STATE_TOP){
                        }
                        break;
                    case W.KEY.EXIT:
                    case W.KEY.KEY_ESC:
                    case W.KEY.HOME:
                    case W.KEY.MENU:
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
                    case W.KEY.COLOR_KEY_Y:
                        if(state == STATE_COMP){
                            currComponent.operate(event);
                        }
                        break;
                }

            },
            onPopupClosed : function(popup, desc) {
                if (desc) {
                    if (desc.popupName == "popup/AdultCheckPopup") {
                        if (desc.action == W.PopupManager.ACTION_OK) {
                            if(_this.param.targetId == "CC1027") {//시스템 초기화
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
                            } else {
                                addComp(desc.oldPIN);
                            }
                        } else {
                            _this.backScene();
                        }
                    } else if (desc.popupName == "popup/FeedbackPopup") {
                        if(desc.type == "error") {

                        } else {
                        	
                        }
                    }
                }
            }
        });
    });
