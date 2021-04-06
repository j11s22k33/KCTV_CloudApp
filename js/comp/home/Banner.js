//@preDefine
W.defineModule("comp/home/Banner", [ "mod/Util"], function(util) {
 	var _this;
	var _comp;
	var _parent;
	var pIndex = 0;
	var index = 0;
	var page = 0;
	var totalPage = 0;
	var banner;
	var postions = [];
	var now;
	var isAddedEntryPath = true;

	var create = function(){
		_comp = new W.Div({id:"home_banner", x:0, y:223, width:"1280px", height:"176px"});
		return _comp;
	};
	
	function getItem(data, xPos, idx){
		var _promo = new W.Div({position:"relative", y:30, width:"210px", height:"118px", "padding-right":"50px", display:"inline-block"});
		_promo.add(new W.Image({x:0, y:0, width:"210px", height:"118px", src:"img/default_ch_thumbnail.png"}));	
		_promo._thumb = new W.Image({x:0, y:0, width:"210px", height:"118px", src:util.getChThumbUrl(data.channelSrcId)});
		_promo.add(_promo._thumb);
		_promo._thumb.comp.addEventListener('error', function(){this.style.visibility="hidden"});
		_promo.add(new W.Image({x:0, y:0, width:"210px", height:"118px", src:"img/thumb_w210_sh.png"}));
		_promo.add(new W.Span({x:14, y:91, width:"40px", height:"22px", textColor:"rgba(255,255,255,0.9)", 
			"font-size":"20px", className:"font_rixhead_bold", text:util.changeDigit(data.channelNo, 3)}));
		_promo.add(new W.Span({x:52, y:91, width:"150px", height:"22px", textColor:"rgba(180,180,180,0.9)", 
			"font-size":"20px", className:"font_rixhead_light cut", text:data.channelName}));
		if(idx == 3){
			_comp._promoSh = new W.Image({x:0, y:0, width:"210px", height:"118px", src:"img/00_home_ch_sh.png"})
			_promo.add(_comp._promoSh);
		}
		return _promo;
	};
	
	var getFocus = function(data, xPos, idx){
		var _promo = new W.Div({position:"relative", y:0, width:"252px", height:"154px", "padding-right":"50px", display:"none"});
		_promo.add(new W.Image({x:0, y:6, width:"252px", height:"142px", src:"img/default_ch_thumbnail.png"}));		
		_promo._thumb = new W.Image({x:0, y:6, width:"252px", height:"142px", src:util.getChThumbUrl(data.channelSrcId)});
		_promo.add(_promo._thumb);
		_promo._thumb.comp.addEventListener('error', function(){this.style.visibility="hidden"});
		_promo.add(new W.Image({x:0, y:6, width:"252px", height:"142px", src:"img/thumb_w252_sh.png"}));
		_promo.add(new W.Div({x:0, y:0, width:"252px", height:"4px", backgroundColor:"rgb(229,49,0)"}));
		_promo.add(new W.Div({x:0, y:396-246, width:"252px", height:"4px", backgroundColor:"rgb(229,49,0)"}));

		var _area = new W.Div({x:225-210, y:362-246, width:"230px", height:"28px", textAlign:"left"})
		_promo.add(_area);
		_promo._ch_no = new W.Span({position:"relative", y:0, height:"28px", textColor:"rgb(236,200,140)", 
			"font-size":"24px", className:"font_rixhead_bold", text:util.changeDigit(data.channelNo, 3), "padding-right":"5px"});
		_area.add(_promo._ch_no);
		_promo._ch_name = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", 
			"font-size":"22px", className:"font_rixhead_light", text:data.channelName, "padding-right":"5px"});
		_area.add(_promo._ch_name);
		if(data.isFavorite){
			_promo._fav = new W.Image({position:"relative", y:-5, width:"12px", height:"12px", src:"img/info_star_f.png"});
			_area.add(_promo._fav);
		}
		
		_promo.offsetWidth = 0;

		return _promo;
	};
	
	var changeBanner = function(){
		W.log.info("changeBanner !!!!!");
		if(_comp._banner){
			_comp.remove(_comp._banner);
			_comp._banner = null;
		}
		if(_comp._title){
			_comp.remove(_comp._title);
			_comp.remove(_comp._titleF);
			_comp._title = null;
			_comp._titleF = null;
		}
		
		_comp._promos = [];
		_comp._promoFs = [];
		
		if(!banner || banner.length == 0){
			return;
		}
		W.log.info("changeBanner !!!!!");
		if(_parent.mainMenu[pIndex].menuType == "MC0002"){
			_comp.setStyle({y:246, height:"154px"});
			_comp._title = new W.Div({x:97, y:72, width:"80px", height:"70px"});
			_comp.add(_comp._title);
			var titles = W.Texts["often_watched_channel"].split("^");
			for(var i=0; i < titles.length; i++){
				_comp._title.add(new W.Span({x:0, y:i*22, width:"80px", height:"22px", textColor:"rgba(237,168,2,0.63)", 
					"font-size":"20px", className:"font_rixhead_light", text:titles[i], textAlign:"left"}));
			}
			
			_comp._titleF = new W.Div({x:97, y:64, width:"101px", height:"80px", display:"none"});
			_comp.add(_comp._titleF);
			for(var i=0; i < titles.length; i++){
				_comp._titleF.add(new W.Span({x:0, y:i*26, width:"101px", height:"28px", textColor:"rgb(237,168,2)", 
					"font-size":"26px", className:"font_rixhead_light", text:titles[i], textAlign:"left"}));
			}
			
			var _list_area = new W.Div({x:210 + 38, y:0, width:"1070px", height:"154px", textAlign:"left", overflow:"hidden"});
			_comp._banner = new W.Div({x:0, y:0, width:(banner.length*260 + 200) + "px", height:"154px", textAlign:"left", display:"inline-flex"});
			_list_area.add(_comp._banner);
			W.log.info(banner);
			for(var i=0; i < banner.length; i++){
				_comp._promos[i] = getItem(banner[i], 42 + 260*i, i);
				_comp._banner.add(_comp._promos[i]);
				_comp._promos[i].setStyle({opacity:0.5});
				
				_comp._promoFs[i] = getFocus(banner[i], 260*i);
				_comp._banner.add(_comp._promoFs[i]);
			}
			_comp.add(_list_area);
		}else{
			postions = [];
			_comp.setStyle({y:223, height:"176px"});
			_comp._banner = new W.Div({x:0, y:0, width:"1280px", height:"176px", textAlign:"center"});
			var leftPos = 210;
			var width = 0;
			var widthF = 0;
			var tmp = 870 + 210;
			var plateLeft = 0;
			var totalSize = 0;
			for(var i=0; i < banner.length; i++){
				if(banner[i].bannerSize == "1"){
					width = 280;
					widthF = 362;
					totalSize += 1;
				}else if(banner[i].bannerSize == "2"){
					width = 425;
					widthF = 546;
					totalSize += 1.5;
				}else if(banner[i].bannerSize == "3"){
					width = 860;
					widthF = 1086;
					totalSize += 3;
				}
				if(totalSize > 6){
					banner = banner.slice(0, i);
					break;
				}
				if(leftPos + width > tmp){
					tmp += 870;
					plateLeft = 210 - leftPos;
				}
				
				postions.push({left:leftPos, width:width, distance:(widthF-width)/2, plateLeft:plateLeft});
				
				_comp._promos[i] = new W.Image({x:leftPos, y:0, width:width + "px", height:"176px", src:banner[i].image});
				_comp._banner.add(_comp._promos[i]);
				_comp._promos[i].setStyle({opacity:0.5});
				
				_comp._promoFs[i] = new W.Image({x:leftPos - ((widthF-width)/2), y:-37, width:widthF + "px", height:"227px", src:banner[i].focusImage, display:"none"});
				_comp._banner.add(_comp._promoFs[i]);
				
				leftPos += width + 10;
			}
			_comp.add(_comp._banner);
		}
		if(_parent.state == 1){
			focus(true);
		}
	};
	
	var focus = function(isFirst){
		W.log.info("focus !!!!! " + isFirst);
		if(isFirst){
			for(var i=0; i < banner.length; i++){
				if(_parent.mainMenu[pIndex].menuType == "MC0002"){
					_comp._promos[i].setStyle({opacity:1});
				}else{
					_comp._promos[i].setStyle({opacity:1});
				}
			}
			_parent._comp_area.setStyle({opacity:0.5});
			if(_parent.mainMenu[pIndex].menuType == "MC0002"){
				_comp._titleF.setStyle({display:""});
				_comp._title.setStyle({display:"none"});
			}
		}
		for(var i=0; i < banner.length; i++){
			if(i == index){
				if(_parent.mainMenu[pIndex].menuType == "MC0002"){
					_comp._promos[i].setStyle({display:"none"});
					_comp._promoFs[i].setStyle({display:"inline-block"});
					
					if(banner[i].isFavorite){
						if(_comp._promoFs[i].offsetWidth == 0){
							_comp._promoFs[i].offsetWidth = _comp._promoFs[i]._ch_name.comp.offsetWidth;
							_comp._promoFs[i]._fav.setStyle({x:48 + _comp._promoFs[i].offsetWidth + 4});
						}
					}
				}else{
					_comp._promos[i].setStyle({x:postions[i].left, display:"none"});
					_comp._promoFs[i].setStyle({display:""});
				}
			}else{
				if(_parent.mainMenu[pIndex].menuType == "MC0002"){
					_comp._promos[i].setStyle({display:"inline-block"});
					_comp._promoFs[i].setStyle({display:"none"});
				}else{
					if(i < index){
						_comp._promos[i].setStyle({x:postions[i].left - postions[i].distance, display:""});
					}else{
						_comp._promos[i].setStyle({x:postions[i].left + postions[i].distance, display:""});
					}
					_comp._promoFs[i].setStyle({display:"none"});
				}
			}
		}
		
		if(_parent.mainMenu[pIndex].menuType == "MC0002"){
			var page = Math.floor(index/3);
			_comp._banner.setStyle({x:-(page * 780)});
			if(page == 0){
				_comp._promoSh.setStyle({display:"block"});
			}else{
				_comp._promoSh.setStyle({display:"none"});
			}
			
		}else{
			_comp._banner.setStyle({x:postions[index].plateLeft});
		}
		
	};
	
	var unFocus = function(currState){
		W.log.info("unFocus !!!!!");
		if(!_comp._promos) return;
		_comp._promoFs[index].setStyle({display:"none"});
		for(var i=0; i < banner.length; i++){
			if(_parent.mainMenu[pIndex].menuType == "MC0002"){
				_comp._promos[i].setStyle({display:"inline-block", opacity:currState==0 || currState==2 ? 0.5 : 1});
			}else{
				_comp._promos[i].setStyle({x:postions[i].left, display:"", opacity:currState==0 || currState==2 ? 0.5 : 1});
			}
		}
		index = 0;
		_comp._banner.setStyle({x:0});
		if(_parent.mainMenu[pIndex].menuType == "MC0002"){
			_comp._titleF.setStyle({display:"none"});
			_comp._title.setStyle({display:""});
		}
	};

	return {
		init: function(parent){
			_parent = parent;
			index = 0;
			return create();
		},
		changeBanner: function(idx){
			pIndex = idx;
			index = 0;
			page = 0;
			totalPage = 0;
			banner = null;
			now = new Date().getTime();
			
			if(_parent.mainMenu[pIndex].banners && _parent.mainMenu[pIndex].banners.length > 0){
				banner = _parent.mainMenu[pIndex].banners;
				totalPage = Math.ceil(banner.length/3);
			}
			if(_parent.mainMenu[pIndex].menuType == "MC0002"){
				if(banner){
					var sourceIds = "";
					for(var i=0; i < banner.length; i++){
						sourceIds += (i > 0 ? "," : "") + banner[i].channelSrcId;
					}
					_parent.sdpManager.getSchedulesNow(function(result, data){
						if(result && data){
							if(banner){
								for(var key in data){
									if(data[key]){
										for(var j=0; j < banner.length; j++){
											if(key == banner[j].channelSrcId){
												banner[j].startTime = new Date(data[key].startTime).getTime();
												banner[j].endTime = new Date(data[key].endTime).getTime();
												banner[j].progTitle = data[key].title;
											}
										}
									}
								}
							}
						}
						changeBanner();
					}, {sourceId:sourceIds, selector:"sourceId,startTime,endTime,title"});
				}else{
					changeBanner();
				}
			}else{
				changeBanner();
			}
		},
		focus: function(isFirst){
			focus(isFirst);
		},
		unFocus: function(currState){
			unFocus(currState);
		},
		getComp: function(){
			return _comp;
		},
		hasData: function(){
			W.log.info(banner);
			return banner && banner && banner.length > 0 ? true : false;
		},
		destroy: function() {
        	W.log.info("destroy !!!!");
			if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
		},
        resume : function(){
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        },
		operate : function(event){
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.RIGHT:
				index = (++index) % banner.length;
				focus();
				isConsume = true;
				break;
			case W.KEY.LEFT:
				index = (--index + banner.length) % banner.length;
				focus();
				isConsume = true;
				break;
			case W.KEY.ENTER:
				W.log.info(banner[index]);
				if(_parent.mainMenu[pIndex].menuType == "MC0002"){
					if(banner[index].channelSrcId){
						if(W.state.isVod){
        					W.PopupManager.openPopup({
        	                    title:W.Texts["popup_zzim_info_title"],
        	                    popupName:"popup/AlertPopup",
        	                    boldText:W.Texts["vod_alert_msg"],
        	                    thinText:W.Texts["vod_alert_msg2"]}
        	                );
        				}else{
        					var sourceId = banner[index].channelSrcId;
        					if(typeof(sourceId) == "string"){
        						sourceId = Number(sourceId);
        					}
    						W.CloudManager.changeChannel(function(){
    							W.log.info("Channel Changed !! " + sourceId);
    						}, sourceId);
        				}
					}else{
						isAddedEntryPath = true;
						W.LinkManager.action("L", banner[index].link, undefined, "homepromotion", "Banner");
					}
				}else{
					isAddedEntryPath = true;
					W.LinkManager.action("L", banner[index].link, undefined, "homepromotion", "Banner");
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