//@preDefine
W.defineModule("comp/home/Top", [ "mod/Util", "manager/WeatherDataManager"], function(util, weatherDataManager) {
 	var _this;

	var mainNotice;
	var _comp;
	var _parent;
	var index = 0;
	var interval;
	var changeIntervalTime = 10 * 1000;
	var icons = ["img/00_gicon_01.png"];
	var guides = [W.Texts["all_menu"]];
	var types = ["SiteMap"];
	
	var changeTime = function(){
		_comp._time.setText(util.getCurrentDateTime("kor"));
	};
	

	function makeWeather(result, data){
		if(result){
			_comp._zone = new W.Span({"position":"relative", y:-13, height:"22px", textColor:"rgb(151,205,245)", 
				"font-size":"20px", className:"font_rixhead_medium", text:data.codename, "padding-right":"10px"});
			_comp._info.add(_comp._zone);
			
			_comp._bar1 = new W.Span({"position":"relative", y:-10, width:"2px", height:"15px", className:"line_1px", display:"inline-block"});
			_comp._info.add(_comp._bar1);
			
			var temp = data.t1h;
			try{
				temp = Math.round(Number(data.t1h));
			}catch(ex){
				W.log.error(ex);
			}
			
			_comp._temp = new W.Span({"position":"relative", y:-12, height:"34px", textColor:"rgb(255,255,255)", "font-size":"34px", 
				className:"font_rixhead_light", text:temp, "padding-left":"10px", "padding-right":"3px"});
			_comp._info.add(_comp._temp);
			_comp._temp2 = new W.Span({"position":"relative", y:-12, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
				className:"font_rixhead_medium", text:"℃", "padding-right":"15px"});
			_comp._info.add(_comp._temp2);
			
			_comp._humidity = new W.Span({"position":"relative", y:-12, height:"22px", textColor:"rgb(255,255,255)", "font-size":"22px", 
				className:"font_rixhead_medium", text:data.reh, "padding-right":"2px"});
			_comp._info.add(_comp._humidity);
			_comp._humidity2 = new W.Span({"position":"relative", y:-12, height:"22px", textColor:"rgb(255,255,255)", "font-size":"20px", 
				className:"font_rixhead_medium", text:"%", "padding-right":"7px"});
			_comp._info.add(_comp._humidity2);
			
			W.log.info(data);
			var iconImg;
			if(data.pty && Number(data.pty) > 0 && Number(data.pty) < 4){
				if(data.pty == "1"){
					iconImg = "url('img/icon_wt_05.png')";
				}else if(data.pty == "2"){
					iconImg = "url('img/icon_wt_06.png')";
				}else if(data.pty == "3"){
					iconImg = "url('img/icon_wt_07.png')";
				}
			}else{
				if(data.sky == "2"){
					iconImg = "url('img/icon_wt_02.png')";
				}else if(data.sky == "3"){
					iconImg = "url('img/icon_wt_03.png')";
				}else if(data.sky == "4"){
					iconImg = "url('img/icon_wt_04.png')";
				}else{
					iconImg = "url('img/icon_wt_01.png')";
				}
			}
			
			_comp._weather = new W.Span({"position":"relative", y:2, width:"40px", height:"40px", "background":iconImg, 
				display:"inline-block", "margin-right":"7px"});
			_comp._info.add(_comp._weather);
			
			_comp._bar2 = new W.Span({"position":"relative", y:-10, width:"2px", height:"15px", className:"line_1px", 
				display:"inline-block"});
			_comp._info.add(_comp._bar2);
			
			_comp._dust = new W.Span({"position":"relative", y:-11, height:"22px", textColor:"rgb(255,255,255)", "font-size":"20px", 
				className:"font_rixhead_medium", text:W.Texts["fine_dust"], "padding-right":"5px", "padding-left":"9px"});
			_comp._info.add(_comp._dust);
			
			var airCondition = W.Texts["good"];
			var color = "rgb(179,209,157)";
			if(data.pm10Cai == "2"){
				airCondition = W.Texts["normal"];
				color = "rgb(151,205,245)";
			}else if(data.pm10Cai == "3"){
				airCondition = W.Texts["bad"];
				color = "rgb(255,143,143)";
			}else if(data.pm10Cai == "4"){
				airCondition = W.Texts["worst"];
				color = "rgb(255,143,143)";
			}
			_comp._dust2 = new W.Span({"position":"relative", y:-11, height:"22px", textColor:color, "font-size":"20px", 
				className:"font_rixhead_medium", text:airCondition});
			_comp._info.add(_comp._dust2);
		}

//		_parent.comp.children[0].style.visibility = "visible";
		W.log.info("Total init time : " + (new Date().getTime() - W.time.getTime()));
	};

	var create = function(){
		_comp = new W.Div({id:"home_top", x:63, y:49, width:"1205px", height:"96px"});

		_comp.add(new W.Image({x:2, y:12, width:"117px", height:"23px", src:"img/00_kctv_logo.png"}));
		_comp._time = new W.Span({x:0, y:47, width:"130px", height:"18px", textColor:"rgba(255,255,255,0.5)", "font-size":"16px", className:"font_rixhead_medium", text:util.getCurrentDateTime("kor")});
		_comp.add(_comp._time);
		
		_comp._logo = new W.Image({x:1, y:(W.StbConfig.menuLanguage == "ENG" || W.StbConfig.menuLanguage == "ZHO") ? 90 : 78, display:"none"});
		_comp.add(_comp._logo);
		
		_comp._icons = [];
		_comp._guides = [];
		_comp._bgs = [];

		if(_parent.myKctvCategory){
			icons.push("img/00_gicon_04.png");
			guides.push(W.Texts["my"]);
			types.push("My");
		}
		if(_parent.searchCategory){
			icons.push("img/00_gicon_05.png");
			guides.push(W.Texts["search"]);
			types.push("Search");
		}
		if(_parent.settingCategory){
			icons.push("img/00_gicon_06.png");
			guides.push(W.Texts["setting"]);
			types.push("Setting");
		}
		if(W.StbConfig.stbType == "ANDROID"){
			if(W.StbConfig.androidNoti){
				icons.push(W.StbConfig.androidNoti);
				guides.push(W.Texts["alarm_system"]);
				types.push("AndroidNoti");
			}
		}
		
		_comp._area1 = new W.Div({x:0, y:0, width:"1205px", height:"96px"});
		_comp.add(_comp._area1);
		
		for(var i=0; i < icons.length; i++){
			_comp._bgs[i] = new W.Image({x:152 + i*59, y:0, width:"46px", height:"46px", src:"img/00_gicon_bg.png"});
			_comp._area1.add(_comp._bgs[i]);
		}
		_comp._foc = new W.Image({x:152, y:0, width:"46px", height:"46px", src:"img/00_gicon_foc.png", display:"none"});
		_comp.add(_comp._foc);
		
		
		_comp._area2 = new W.Div({x:0, y:0, width:"1205px", height:"96px"});
		_comp.add(_comp._area2);
		for(var i=0; i < icons.length; i++){
			if(types[i] == "AndroidNoti"){
				_comp._icons[i] = new W.Span({x:158 + i*59, y:12, width:"34px", height:"34px", src:icons[i], opacity:0.8, 
					"font-size":"20px", className:"font_rixhead_medium", textColor:"rgb(255,255,255)", textAlign:"center", text:icons[i]});
				_comp._area2.add(_comp._icons[i]);
			}else{
				_comp._icons[i] = new W.Image({x:159 + i*59, y:6, width:"34px", height:"34px", src:icons[i], opacity:0.8});
				_comp._area2.add(_comp._icons[i]);
			}
			
			_comp._guides[i] = new W.Span({x:125 + i*59-50, y:53, width:"200px", height:"18px", textColor:"rgba(255,255,255,0.8)", 
				"font-size":"16px", className:"font_rixhead_medium", text:guides[i], textAlign:"center", display:"none"});
			_comp._area2.add(_comp._guides[i]);
		}
		
		_comp._new_icon = new W.Image({id:"home_new_notice_icon", x:306-63, y:1, width:"14px", height:"14px", src:"img/00_gicon_new.png", display:"none"});
		_comp.add(_comp._new_icon);
		

		_comp.add(new W.Image({x:1038, y:30, width:"68px", height:"68px", src:"img/color_yellow.png"}));
		_comp.add(new W.Span({x:1090, y:94-49+2, width:"70px", height:"20px", textColor:"rgba(218,218,218,0.7)", 
			"font-size":"18px", className:"font_rixhead_medium", text:W.Texts["weather"], textAlign:"left"}));
		
		
		_comp._info = new W.Div({x:602, y:51-49, width:"550px", height:"51px", textAlign:"right"});
		_comp.add(_comp._info);
		
		weatherDataManager.getWeatherNow(makeWeather);

		interval = setInterval(changeTime, changeIntervalTime);
		return _comp;
	};
	
	var focus = function(isFirst){
		W.log.info("focus !!!!!");
		_comp._foc.setStyle({display:"", x:152 + index*59});
		
		for(var i=0; i < _comp._guides.length; i++){
			if(index == i){
				_comp._guides[i].setStyle({display:""});
			}else{
				_comp._guides[i].setStyle({display:"none"});
			}
		}
		
		if(isFirst){
			_parent._comp_area.setStyle({opacity:0.5});
			_parent.components[2].changeFocColor("rgba(255,255,255,0.7)");
		}
	};
	
	var unFocus = function(currState){
		W.log.info("unFocus !!!!!");
		_comp._foc.setStyle({display:"none"});
		_comp._guides[index].setStyle({display:"none"});
		index = 0;
		_parent.components[2].changeFocColor("rgb(255,255,255)");
	};

	return {
		changeIcon : function(){
			if(W.StbConfig.stbType == "ANDROID"){
				W.log.info("changeIcon");
				if(icons.length > 4){
					W.log.info("remove icon");
					icons.pop();
					guides.pop();
					types.pop();
					
					_comp._area1.remove(_comp._bgs[_comp._bgs.length-1]);
					_comp._area2.remove(_comp._icons[_comp._bgs.length-1]);
					_comp._area2.remove(_comp._guides[_comp._bgs.length-1]);
				}
				
				if(W.StbConfig.androidNoti){
					W.log.info("add icon");
					icons.push(W.StbConfig.androidNoti);
					guides.push(W.Texts["alarm_system"]);
					types.push("AndroidNoti");
					
					_comp._bgs[4] = new W.Image({x:152 + 4*59, y:0, width:"46px", height:"46px", src:"img/00_gicon_bg.png"});
					_comp._area1.add(_comp._bgs[4]);
					
					_comp._icons[4] = new W.Span({x:158 + 4*59, y:12, width:"34px", height:"34px", src:icons[4], opacity:0.8, 
						"font-size":"20px", className:"font_rixhead_medium", textColor:"rgb(255,255,255)", textAlign:"center", text:icons[4]});
					_comp._area2.add(_comp._icons[4]);
					
					_comp._guides[4] = new W.Span({x:125 + 4*59-50, y:53, width:"200px", height:"18px", textColor:"rgba(255,255,255,0.8)", 
						"font-size":"16px", className:"font_rixhead_medium", text:guides[4], textAlign:"center", display:"none"});
					_comp._area2.add(_comp._guides[4]);
				}
				
				if(_parent.state == 0){
					if(index == 4){
						if(icons.length < 5){
							index = 0;
						}
						focus();
					}
				}
			}
		},
		init: function(parent){
			_parent = parent;
			index = 0;

			icons = ["img/00_gicon_01.png"];
			guides = [W.Texts["all_menu"]];
			types = ["SiteMap"];

			_parent.uiPlfManager.getNoticeList(function(result, data){
//				var now = new Date();
//				var time = new Date(now - 1000*60*60*24*7);
//				var oneWeekAgoTime = util.getDateFormat("yyyyMMddHHmmss", time);

				if(data && data.data && data.data.length > 0){
					var icon = document.getElementById("home_new_notice_icon");
					if(icon){
						icon.style.display = "block";
					}
				}
			}, {offset:0, limit:10, ALL:true});
			if(W.StbConfig.cugType == "accommodation") {
				_parent.uiPlfManager.getCugVisualtInfo(function(result, data){
					if(result && data && data.logoImage){
						W.log.info(data);
						_comp._logo.setSrc(data.logoImage);
						_comp._logo.setStyle({display:"block"});
					}
				}, {});
			}
			
			return create();
		},
		check: function(){
			
		},
		getComp: function(){
			return _comp;
		},
		destroy: function() {
			clearInterval(interval);
		},
		hasData: function(){
			return true;
		},
		focus: function(isFirst){
			focus(isFirst);
		},
		unFocus: function(currState){
			unFocus(currState);
		},
		operate : function(event){
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.RIGHT:
				index = (++index) % icons.length;
				focus();
				isConsume = true;
				break;
			case W.KEY.LEFT:
				index = (--index + icons.length) % icons.length;
				focus();
				isConsume = true;
				break;
			case W.KEY.ENTER:
				if(types[index] == "SiteMap"){
					var totalCategory = Object.assign([], _parent.mainMenu);
					totalCategory.push(_parent.myKctvCategory);
					totalCategory.push(_parent.searchCategory);
					totalCategory.push(_parent.settingCategory);

					W.SceneManager.startScene({
						sceneName:"scene/home/SiteMapScene", 
	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
	    				param:{category:totalCategory}
	    			});
				}else if(types[index] == "My"){
					if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
						W.PopupManager.openPopup({
	                        popupName:"popup/ErrorPopup",
	                        code: "0501"
	                    });
					}else{
						W.SceneManager.startScene({
							sceneName:"scene/home/MyKctvScene", 
		    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
		    				param:{category:_parent.myKctvCategory.children, title:_parent.myKctvCategory.title}
		    			});
					}
				}else if(types[index] == "Search"){
					W.SceneManager.startScene({sceneName:"scene/search/SearchScene", 
	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
				}else if(types[index] == "Setting"){
					W.SceneManager.startScene({
						sceneName:"scene/setting/SettingMainScene", 
	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
	    				param:_parent.settingCategory.children
	    			});
				}else if(types[index] == "AndroidSetting"){
					W.CloudManager.openAndroidSetting();
				}else if(types[index] == "AndroidNoti"){
					W.CloudManager.openAndroidNoti();
				}
				isConsume = true;
				break;
			case W.KEY.COLOR_KEY_Y:
				var link = {linkType:"ap03", linkTarget:W.Config.WEATHER_APP_URL};
				W.CloudManager.runApplication(undefined, link);
				break;
			}
			return isConsume;
		}
	};
});