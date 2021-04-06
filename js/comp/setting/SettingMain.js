W.defineModule("comp/setting/SettingMain", ["mod/Util", "comp/RightTimer", "comp/Scroll"], function(util, rightTimer, Scroll) {
	function SettingMain(){
		var _this;
	    var _comp;
		var _timer;
		var index;
		var oldIndex;
		var page = 0;
		var oldPage = 0;
		var _parent;
		var parent;
		var isScroll = false;
		var menus;
	    

	    var backCallbackFunc;
	    var mode = 0;
	    var tops = [465, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var prodTops = [127, 127, 238];

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	    };

	    var create = function(){
	    	_comp._title = new W.Span({x:55, y:52, width:"50px", height:"30px", textColor:"rgb(255,255,255)",
				className:"font_rixhead_medium", "font-size":"27px", text:W.Texts["setting"], display:"none"});
			_comp.add(_comp._title);
			
			_comp.timer = rightTimer.getComp();
			
			_comp._timer = new W.Div({x:1027, y:55, width:"200px", height:"117px", display:"none"});
			_comp.add(_comp._timer);
			_comp.timer.start(_comp._timer);
			
			_comp._list = new W.Div({x:158, y:111, width:"968px", height:"703px", overflow:"hidden"});
			_comp.add(_comp._list);
			_comp._list2 = new W.Div({x:0, y:0, width:"965px", height:"1440px"});
			_comp._list.add(_comp._list2);
			
			_comp._menus = [];
			for(var i=0; i < menus.length; i++){
				_comp._menus[i] = new W.Div({x:(i%3) * 325, y:Math.floor(i/3)*144, width:"314px", height:"126px"});
				_comp._list2.add(_comp._menus[i]);
				_comp._menus[i].add(new W.Image({x:1, y:1, width:"314px", height:"126px", src:"img/box_set_menu.png"}));
				if(menus[i].hasValue){
					_comp._menus[i]._title = new W.Span({x:0, y:39, width:"314px", height:"26px", textColor:"rgba(255,255,255,0.75)",
						"font-size":"24px", className:"font_rixhead_light", text:menus[i].title, textAlign:"center"});
					_comp._menus[i].add(_comp._menus[i]._title);
					_comp._menus[i]._value = new W.Span({x:0, y:72, width:"314px", height:"21px", textColor:"rgba(131,122,119,0.5)",
						"font-size":"19px", className:"font_rixhead_light", text:"", textAlign:"center"});
					_comp._menus[i].add(_comp._menus[i]._value);
				}else{
					_comp._menus[i]._title = new W.Span({x:0, y:50, width:"314px", height:"26px", textColor:"rgba(255,255,255,0.7)",
						"font-size":"24px", className:"font_rixhead_light", text:menus[i].title, textAlign:"center"});
					_comp._menus[i].add(_comp._menus[i]._title);
				}
			}
			
			_comp._focus = new W.Image({x:0, y:0, width:"318px", height:"128px", src:"img/box_set_menu_f.png", display:"none"});
			_comp._list2.add(_comp._focus);
			
			if(Math.ceil(menus.length/12) > 1) {
				_comp.scroll = new Scroll();
				_comp._scroll = _comp.scroll.getComp(Math.ceil(menus.length/12),0,scrollCallback);
				_comp._scroll.setStyle({x:49+5,y:270});
				_comp.add(_comp._scroll);
			} else {
				_this.scroll = undefined;
			}
			W.visibleHomeScene();
	    };

	    var setDataValue = function(){
			for(var i=0; i < menus.length; i++){
				//W.log.info(menus[i]);
				if(menus[i].hasValue){
					_comp._menus[i]._value.setText(menus[i].text);
					if(menus[i].isChanged){
						_comp._menus[i]._value.setStyle({textColor:"rgb(237,168,2)"});
					}else{
						_comp._menus[i]._value.setStyle({textColor:"rgba(131,122,119,0.5)"});
					}
				}
			}
		};
		
		var scrollCallback = function(sIdx){
			page = sIdx;
			index = page * 12;
			_comp._list2.setStyle({y:-page * 576});
		};
		
		var getStbData = function(category){
			W.CloudManager.send(function(data){
				W.log.info("Get STB DATA");
				W.log.info(data);
				for(var i=0; i < menus.length; i++){
					if(menus[i].categoryCode == "CC1001"){
						if(data.data.favorite && data.data.favorite > 0){
							menus[i].isChanged = true;
							menus[i].text = data.data.favorite + W.Texts["count_unit2"];
						}else{
							menus[i].text = W.Texts["none"];
						}
					}else if(menus[i].categoryCode == "CC1002"){
						if(data.data.skipped && data.data.skipped > 0){
							menus[i].isChanged = true;
							menus[i].text = data.data.skipped + W.Texts["count_unit2"];
						}else{
							menus[i].text = W.Texts["none"];
						}
					}else if(menus[i].categoryCode == "CC1003"){
						if(data.data.blocked && data.data.blocked > 0){
							menus[i].isChanged = true;
							menus[i].text = data.data.blocked + W.Texts["count_unit2"];
						}else{
							menus[i].text = W.Texts["none"];
						}
					}else if(menus[i].categoryCode == "CC1004"){
						if(data.data.parentalRating && data.data.parentalRating > 0){
							menus[i].isChanged = true;
							var replaceText = "19";
							if(data.data.parentalRating == 1) replaceText = "19";
							else if(data.data.parentalRating == 2) replaceText = "15";
							else if(data.data.parentalRating == 3) replaceText = "12";
							else if(data.data.parentalRating == 4) replaceText = "7";
							menus[i].text = W.Texts["setting_parental_rating"].replace("19", replaceText);
						}else{
							menus[i].text = W.Texts["no_limit"];
						}
					}else if(menus[i].categoryCode == "CC1005"){
						if(data.data.timeRestricted && data.data.timeRestricted.repeat && data.data.timeRestricted.repeat != "0"){
							menus[i].isChanged = true;
							var startTime = data.data.timeRestricted.startTime;
							var endTime = data.data.timeRestricted.endTime;
							
							menus[i].text = /*startTime.slice(0, 2) < 12 ? W.Texts["am"] : W.Texts["pm"] + " "+ */startTime.slice(0, 2) + ":" + startTime.slice(2,4) +" ~ "
								+ /*endTime.slice(0, 2) < 12 ? W.Texts["am"] : W.Texts["pm"] + " " */endTime.slice(0, 2) + ":" + endTime.slice(2,4);
						}else{
							menus[i].text = W.Texts["no_setting"];
						}
					}else if(menus[i].categoryCode == "CC1007"){
						if(data.data.vodStyle){
							menus[i].isChanged = true;
							menus[i].text = data.data.vodStyle == 1 ? W.Texts["vod_look_style_option1"] : W.Texts["vod_look_style_option2"];
						}else{
							menus[i].isChanged = true;
							menus[i].text = W.Texts["vod_look_style_option1"];
						}
					}else if(menus[i].categoryCode == "CC1009"){
						if(data.data.VODContinuousPlay && data.data.VODContinuousPlay != 3){
							menus[i].isChanged = true;
							if(data.data.VODContinuousPlay == 1) {
								menus[i].text = W.Texts["time_restricted_option1"];
							} else if(data.data.VODContinuousPlay == 2) {
								menus[i].text = W.Texts["play_repeat"];
							}
						}else{
							menus[i].text = W.Texts["no_setting"];
						}
					}else if(menus[i].categoryCode == "CC1010"){
						if(data.data.menuTransparency && data.data.menuTransparency != 3){
							menus[i].isChanged = true;
							if(data.data.menuTransparency == 1){
								menus[i].text = W.Texts["menu_transparency_step1"];
							}else if(data.data.menuTransparency == 2){
								menus[i].text = W.Texts["menu_transparency_step2"];
							}else if(data.data.menuTransparency == 4){
								menus[i].text = W.Texts["menu_transparency_step4"];
							}else if(data.data.menuTransparency == 5){
								menus[i].text = W.Texts["menu_transparency_step5"];
							}
						}else{
							menus[i].text = W.Texts["menu_transparency_step3"];
						}
					}else if(menus[i].categoryCode == "CC1011"){
						if(data.data.audioLanguage){
							menus[i].isChanged = true;
							menus[i].text = data.data.audioLanguage == 2 ? W.Texts["audio_lang_sub"] : W.Texts["audio_lang_main"];
						}else{
							menus[i].isChanged = true;
							menus[i].text = W.Texts["audio_lang_main"];
						}
					}else if(menus[i].categoryCode == "CC1012"){
						if(data.data.audioOutput){
							menus[i].isChanged = true;
							if(data.data.audioOutput == 1) {
								menus[i].text = W.Texts["audio_output_stereo"];
							} else if(data.data.audioOutput == 2) {
								menus[i].text = W.Texts["audio_output_dolby"];
							}
						}else{
							menus[i].text = W.Texts["no_setting"];
						}
					}else if(menus[i].categoryCode == "CC1013"){
						if(data.data.startChannelOption){
							menus[i].isChanged = true;
							if(data.data.startChannelOption == 1) {
								menus[i].text = W.Texts["start_ch_recent_ch"];
							} else if(data.data.startChannelOption == 2) {
								menus[i].text = W.Texts["start_ch_default_ch"];
							}
						}else{
							menus[i].isChanged = true;
							menus[i].text = W.Texts["start_ch_default_ch"];
						}
					}else if(menus[i].categoryCode == "CC1014"){
						if(data.data.menuDuration){
							menus[i].isChanged = true;
							menus[i].text = "1" + W.Texts["minute"];
							if(data.data.menuDuration == 1) menus[i].text = 1 + W.Texts["minute"];
							else if(data.data.menuDuration == 2) menus[i].text = 3 + W.Texts["minute"];
							else if(data.data.menuDuration == 3) menus[i].text = 5 + W.Texts["minute"];
							else if(data.data.menuDuration == 4) menus[i].text = 10 + W.Texts["minute"];
						}else{
							menus[i].isChanged = true;
							menus[i].text = "1" + W.Texts["minute"];
						}
					}else if(menus[i].categoryCode == "CC1015"){
						if(data.data.miniEpgDuration && data.data.miniEpgDuration > 0){
							menus[i].isChanged = true;
							if(data.data.miniEpgDuration == 1){
								menus[i].text = W.Texts["use_not"];
								menus[i].isChanged = false;
							}else if(data.data.miniEpgDuration == 2){
								menus[i].text = "3" + W.Texts["second"];
							}else{
								menus[i].text = "5" + W.Texts["second"];
							}
						}else{
							menus[i].text = W.Texts["use_not"];
							menus[i].isChanged = false;
						}
					}else if(menus[i].categoryCode == "CC1016"){
						if(data.data.barkingAD && data.data.barkingAD == 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["use"];
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}else if(menus[i].categoryCode == "CC1017"){
						if(data.data.closedCaption && data.data.closedCaption > 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["closed_caption_digital"] + (data.data.closedCaption - 1);
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}else if(menus[i].categoryCode == "CC1018"){
						if(data.data.visualImpaired && data.data.visualImpaired == 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["use"];
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}else if(menus[i].categoryCode == "CC1019"){
						if(data.data.menuLanguage){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["menu_language_kor"];
							if(data.data.menuLanguage == 2) menus[i].text = W.Texts["menu_language_eng"];
							else if(data.data.menuLanguage == 3) menus[i].text = W.Texts["menu_language_jpn"];
							else if(data.data.menuLanguage == 4) menus[i].text = W.Texts["menu_language_chn"];
						}else{
							menus[i].isChanged = true;
							menus[i].text = W.Texts["menu_language_kor"];
						}
					}else if(menus[i].categoryCode == "CC1020"){
						if(data.data.screenRatio){
							menus[i].isChanged = true;
							if(data.data.screenRatio == 1){
								menus[i].text = "16:9 " + W.Texts["screen_ratio_btn_wide"];
							} else if(data.data.screenRatio == 2){
								menus[i].text = "16:9 " + W.Texts["screen_ratio_btn_standard"];
							}else if(data.data.screenRatio == 3){
								menus[i].text = "16:9 " + W.Texts["screen_ratio_btn_zoom"];
							}else if(data.data.screenRatio == 4){
								menus[i].text = "4:3 " + W.Texts["screen_ratio_btn_all"];
							}else if(data.data.screenRatio == 5){
								menus[i].text = "4:3 " + W.Texts["screen_ratio_btn_standard"];
							}else if(data.data.screenRatio == 6){
								menus[i].text = "4:3 " + W.Texts["screen_ratio_btn_center"];
							}
						}else{
							menus[i].isChanged = true;
							menus[i].text = "16:9 " + W.Texts["screen_ratio_btn_standard"];
						}
					}else if(menus[i].categoryCode == "CC1021"){
						if(data.data.TVPower && data.data.TVPower == 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["use"];
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}else if(menus[i].categoryCode == "CC1022"){
						if(data.data.autoStandby && data.data.autoStandby == 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["use"];
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}else if(menus[i].categoryCode == "CC1023"){
						if(data.data.bluetooth && data.data.bluetooth == 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["use"];
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}else if(menus[i].categoryCode == "CC1024"){
						if(data.data.resolution){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["auto"];
							if(data.data.screenRatio == 2){
								menus[i].text = "720p";
							}else if(data.data.screenRatio == 3){
								menus[i].text = "1080i";
							}else if(data.data.screenRatio == 4){
								menus[i].text = "1080p";
							}else if(data.data.screenRatio == 5){
								menus[i].text = "2160p(30fps)";
							}else if(data.data.screenRatio == 6){
								menus[i].text = "2160p(60fps)";
							}
						}else{
							menus[i].isChanged = true;
							menus[i].text = W.Texts["auto"];
						}
					}else if(menus[i].categoryCode == "CC1029"){
						if(data.data.channelFourWay && data.data.channelFourWay == 1){
							menus[i].isChanged = true;
							menus[i].text = W.Texts["use"];
						}else{
							menus[i].text = W.Texts["use_not"];
						}
					}
				}

				setDataValue();
			}, {cmd:"GET_SETTING", key:"getPreview"});
		};
		
		var focus = function(){
			W.log.info("index ==== " + index);
			
			if(menus[oldIndex].hasValue){
				_comp._menus[oldIndex]._title.setStyle({"font-size":"24px", y:39, "font-family":"RixHeadL"});
			}else{
				_comp._menus[oldIndex]._title.setStyle({"font-size":"24px", y:50, "font-family":"RixHeadL"});
			}
			if(menus[index].hasValue){
				_comp._menus[index]._title.setStyle({"font-size":"26px", y:37, "font-family":"RixHeadM"});
			}else{
				_comp._menus[index]._title.setStyle({"font-size":"26px", y:48, "font-family":"RixHeadM"});
			}
			_comp._focus.setStyle({x:(index%3) * 325, y:Math.floor(index/3)*144});

			page = Math.floor(index/12);
			
			if(oldPage != page){
				_comp._list2.setStyle({y:-page * 576});
				if (_comp.scroll) _comp.scroll.setPage(page);
				oldPage = page;
			}
			
			
		};
		
		var unFocus = function(){
			W.log.info("index ==== " + index);
			
			if(menus[index].hasValue){
				_comp._menus[index]._title.setStyle({"font-size":"24px", y:39, "font-family":"RixHeadL"});
			}else{
				_comp._menus[index]._title.setStyle({"font-size":"24px", y:50, "font-family":"RixHeadL"});
			}
		};
		
		function makeMenu(category){
			menus = category;
			for(var i=0; i < menus.length; i++){
				if(menus[i].categoryCode == "CC1006" || menus[i].categoryCode == "CC1008" ||
						menus[i].categoryCode == "CC1025" ||
						menus[i].categoryCode == "CC1026" || menus[i].categoryCode == "CC1027" ||
						menus[i].categoryCode == "CC1028" || menus[i].categoryCode == "CC1030"){
					menus[i].hasValue = false;
				}else{
					menus[i].hasValue = true;
				} 
			}
		};

		this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info("SettingMain show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("SettingMain hide");
        };
        this.create = function(_p, p, category) {
            W.log.info("create !!!!");
            _parent = _p;
            parent = p;
            makeMenu(category);
            _this = this;
            isScroll = false;
			page = 0;
			oldPage = 0;
			index = 0;
			oldIndex = 0;
            _comp = new W.Div({id:"setting_main_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});
            create();
			getStbData();
            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
            	_comp._focus.setStyle({display:"block"});
            	_comp._title.setStyle({display:"block"});
            	_comp._timer.setStyle({display:"block"});
            	focus();
            }else{
            	_comp._focus.setStyle({display:"none"});
            	_comp._title.setStyle({display:"none"});
            	_comp._timer.setStyle({display:"none"});
            	unFocus();
            }
        };
        this.hasList = function(){
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            if(isScroll){
				switch (event.keyCode) {
				case W.KEY.UP:
					if (_comp.scroll) _comp.scroll.decreaseIndex();
					break;
				case W.KEY.DOWN:
					if (_comp.scroll) _comp.scroll.increaseIndex();
					break;
				case W.KEY.RIGHT:
					index = page * 12;
					_comp._focus.setStyle({display:""});
					focus();
                    if (_comp.scroll) _comp.scroll.unFocus();
					isScroll = false;
					break;
				}
                return true;
				
			}else{
				oldIndex = index;
				switch (event.keyCode) {
				case W.KEY.UP:
					if(index > 2){
						index -= 3;
					}else{
						if(_parent){
							return false;
						}

						index = (menus.length-1)+(2-(menus.length-1)%3)-(2-index);
						if(index > menus.length-1) index = menus.length-1
					}
					focus();
	                return true;
					break;
				case W.KEY.DOWN:
					if(index < menus.length-4+menus.length%3) {
						index += 3;
						if(index > menus.length-1) index = menus.length-1
					} else {
						if(index + 3 > menus.length-1) {
							index = index % 3;
						} else {
							index = menus.length-1;
						}
					}
					focus();
	                return true;
					break;
				case W.KEY.RIGHT:
					if(index == menus.length-1){
						index = 0;
					}else{
						index++;
					}
					focus();
	                return true;
					break;
				case W.KEY.LEFT:
					if(index % 3 == 0){
						if(!isScroll){
							if (_comp.scroll) {
								unFocus();
								_comp._focus.setStyle({display:"none"});
								if (_comp.scroll) _comp.scroll.setFocus();
								isScroll = true;
							} else {

							}
						}
					}else{
						index--;
						focus();
					}
	                return true;
					break;
				case W.KEY.ENTER:
					if(W.state.isVod && (menus[index].categoryCode == "CC1019" || menus[index].categoryCode == "CC1027")){
						W.PopupManager.openPopup({
                            title:W.Texts["popup_zzim_info_title"],
                            popupName:"popup/AlertPopup",
                            boldText:W.Texts["vod_alert_msg"],
                            thinText:W.Texts["vod_alert_msg2"]}
                        );
					}else if(menus[index].categoryCode == "CC1030"){
						W.CloudManager.openAndroidSetting();
					}else{
						W.SceneManager.startScene({
							sceneName:"scene/setting/SettingScene", 
		    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
		    				param : {
		    					targetId : menus[index].categoryCode,
		    					title:menus[index].title
		    				}
		    			});
					}
					return true;
					break;
				}
			}
        };
        this.destroy = function() {
            W.log.info("destroy !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            _comp.timer.stop();
        };
        this.getMode = function(){
            return mode;
        };
        this.onRefresh = function() {
			W.log.info(this.componentName + " onRefresh !!!");
			getStbData();
		};
        this.componentName = "SettingMain";
	}
    
	return {
		getNewComp : function(){
			return new SettingMain();
		}
	}
});