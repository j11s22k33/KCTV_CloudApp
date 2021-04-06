//@preDefine
W.defineModule("comp/home/Menu", [ "mod/Util", "comp/CouponInfo", "manager/MenuCompManager"],
		function(util, couponInfoComp, menuCompManager) {
	var _this;
	var _parent;
	var _comp;
	var _parent;
	var index = 0;
	var sIndex = 0;
	var sIndex2 = 0;
	var depth = 0;
	var oldDepth = 0;
	var keyTimeout = undefined;
	var couponInfo = couponInfoComp.getNewComp();
	var isPinCheck = false;
	var isClearPin = false;
	var clearPinDepth = 0;
	var _parentDiv;
	var isCheckedCoupon = false;
	var isCompleteMakeComp = true;
	
	var titleComp = function(){
		var oldMode = 0;
		var titles = [];
		function setTitle(title){
			titles.push(title);
			setElement();
		};
		function removeTitle(){
			titles.pop();
			setElement();
		};
		this.changeMode = function(mode, category){
			if(mode == 0){
				titles = [];
				setElement();
			}
			
			if(category){
				setTitle(category.title);
				W.entryPath.push("menu.categoryId", category, "Menu");
			}else{
				removeTitle();
				W.entryPath.pop();
			}

			_parent.components[3].changeMode(mode);
			oldMode = mode;
			if(mode == 2){
				_parent._comp_area.setStyle({opacity:1});
				if(W.StbConfig.cugType == "accommodation" && category.categoryCode == "CC0205"){
					couponInfo.showOption();
				}
				if(category){
					W.categoryNotice.show(category);
				}
			}else{
				if(W.StbConfig.cugType == "accommodation"){
					couponInfo.hideOption();
				}
			}
		};
		
		var setElement = function(){
			if(_comp._top._title_comp){
				_comp._top._title.remove(_comp._top._title_comp);
			}
			_comp._top._title_comp = new W.Div({x:0, y:0, width:"700px", height:"30px", textAlign:"left"});
			_comp._top._title.add(_comp._top._title_comp);
			
			if(titles.length == 1){
				_comp._top._title_comp.add(new W.Span({id:"home_menutree_title", position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
					"font-size":"27px", className:"font_rixhead_medium", text:titles[0]}));
			}else{
				for(var i=0; i < titles.length; i++){
					if(i == titles.length - 1){
						_comp._top._title_comp.add(new W.Span({id:"home_menutree_title", position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
							"font-size":"27px", className:"font_rixhead_medium", text:"> " + titles[i]}));
					}else if(i == 0){
						_comp._top._title_comp.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgba(255,255,255,0.5)", 
							"font-size":"27px", className:"font_rixhead_medium", text:titles[i] + " "}));
					}else{
						_comp._top._title_comp.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgba(255,255,255,0.5)", 
							"font-size":"27px", className:"font_rixhead_medium", text:"> " + titles[i] + " "}));
					}
				}
			}
		};
	};

	function create(){
		_comp = new W.Div({id:"home_menu_main", x:0, y:0, width:"1280px", height:"530px"});
		
		_comp._top = new W.Div({x:0, y:38, width:"1280px", height:"68px", display:"none"});
		_comp.add(_comp._top);
		
		_comp._top._title = new W.Div({x:55, y:13, width:"500px", height:"30px", textAlign:"left"});
		_comp._top.add(_comp._top._title);

		_comp._top.add(couponInfo.getComp(567, 0));
		_parent.couponInfo = couponInfo;
		if(W.StbConfig.cugType == "accommodation"){
			couponInfo.hideOption();
		}
		
		
		
		_comp._menu = new W.Div({id:"home_menu", x:0, y:440, width:"1280px", height:"90px"});
		_comp.add(_comp._menu);
		
		_comp._menu._bar = new W.Div({x:50, y:488-440, width:"1280px", height:"1px", className:"line_1px"});
		_comp._menu.add(_comp._menu._bar);
		_comp._menu._main = new W.Div({id:"home_menu_main", x:0, y:2, width:"1280px", height:"90px"});
		_comp._menu._sub = new W.Div({id:"home_menu_sub", x:0, y:-2, width:"1280px", height:"90px"});
		_comp._menu.add(_comp._menu._main);
		_comp._menu.add(_comp._menu._sub);
		_comp._menu._mainMenus = [];
		_parentDiv._menu.add(_comp);
		
		var title;
		for(var i=0; i < _parent.mainMenu.length; i++){
			title = _parent.mainMenu[i].title;
			if(title.length > 10){
				title = title.substr(0,10);
			}
			
// TODO			
//			_comp._menu._mainMenus[i] = new W.Div({x:45 + 190 * i, y:0, width:"200px", height:"30px", textAlign:"center"});
//			_comp._menu._mainMenus[i]._txt = new W.Span({position:"relative", y:2, height:"26px", textColor:"rgba(140,140,140,0.85)", 
//				"font-size":"24px", className:"font_rixhead_light", text:title, display:""});
//			_comp._menu._mainMenus[i].add(_comp._menu._mainMenus[i]._txt);
//			_comp._menu._mainMenus[i]._foc = new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
//				"font-size":"28px", className:"font_rixhead_medium", text:title, display:"none"});
//			_comp._menu._mainMenus[i].add(_comp._menu._mainMenus[i]._foc);
			

			_comp._menu._mainMenus[i] = new W.Div({x:45 + 225 * i, y:0, width:"200px", height:"30px"});
			_comp._menu._mainMenus[i]._area = new W.Div({x:0, y:0, width:"200px", height:"30px", textAlign:"center"});
			_comp._menu._mainMenus[i]._area2 = new W.Div({x:-25, y:0, width:"250px", height:"30px", textAlign:"center"});
			_comp._menu._mainMenus[i].add(_comp._menu._mainMenus[i]._area);
			_comp._menu._mainMenus[i].add(_comp._menu._mainMenus[i]._area2);
			_comp._menu._mainMenus[i]._txt = new W.Span({position:"relative", y:3, height:"24px", textColor:"rgba(205,205,205,0.84)", 
				"font-size":"22px", className:"font_rixhead_light", text:title, display:""});
			_comp._menu._mainMenus[i]._area.add(_comp._menu._mainMenus[i]._txt);
			_comp._menu._mainMenus[i]._foc = new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
				"font-size":"28px", className:"font_rixhead_medium", text:title, display:"none"});
			_comp._menu._mainMenus[i]._area2.add(_comp._menu._mainMenus[i]._foc);
			

			_comp._menu._main.add(_comp._menu._mainMenus[i]);
			W.log.info("offsetWidth :: " + title + " :: " + _comp._menu._mainMenus[i]._txt.comp.offsetWidth);
		}
		
		_comp._menu._zzim = new W.Image({x:100, y:446-440, width:"13px", height:"11px", src:"img/info_heart.png", display:"none"});
		_comp._menu.add(_comp._menu._zzim);
		
		_comp._menu._focus = new W.Div({x:50, y:485-440, width:"250px", height:"6px"});
		_comp._menu._focus._l = new W.Image({x:25, y:0, width:"10px", height:"6px", src:"img/00_m_foc_l.png"});
		_comp._menu._focus._m = new W.Span({x:35, y:0, width:"100px", height:"6px", backgroundColor:"rgb(229,48,0)"});
		_comp._menu._focus._r = new W.Image({x:135, y:0, width:"10px", height:"6px", src:"img/00_m_foc_r.png"});
		_comp._menu._focus.add(_comp._menu._focus._l);
		_comp._menu._focus.add(_comp._menu._focus._m);
		_comp._menu._focus.add(_comp._menu._focus._r);
		_comp._menu.add(_comp._menu._focus);
	};
	
	var removeBanner = function(idx){
		_parent.mainMenu[idx].banners = undefined;
		_parent.components[1].changeBanner(idx);
	};
	
	var checkBanner = function(idx){
		if(_parent.mainMenu[idx].banners){
			_parent.components[1].changeBanner(idx);
		}else{
			if(_parent.mainMenu[idx].menuType == "MC0002"){
				_parent.recoDataManager.getForyouChannel(function(result, data, param){
					if(_parent.mainMenu[index].menuType != "MC0002"){
						return;
					}
					if(result && W.StbConfig.cugType != "accommodation"){
						_parent.mainMenu[param].banners = data.resultList;
						for(var i=0; i < _parent.mainMenu[param].banners.length; i++){
							_parent.mainMenu[param].banners[i].isRec = true;
						}
					}else{
						_parent.mainMenu[param].banners = {data:[]};
					}
					_parent.components[1].changeBanner(param);
					
					if(_parent.mainMenu[param].banners.length < 7){
						_parent.uiPlfManager.getPromotionList(function(result, data, param){
							if(result){
								for(var i=0; i < data.data.length; i++){
									data.data[i].channelSrcId = data.data[i].link.linkTarget;
									data.data[i].channelName = data.data[i].chnlNm;
									data.data[i].channelNo = data.data[i].chnlNo;
								}
								_parent.mainMenu[param].banners = _parent.mainMenu[param].banners.concat(data.data);
							}
							_parent.components[1].changeBanner(param);
						}, {targetId:_parent.mainMenu[param].baseId, offset:0, limit:7-_parent.mainMenu[param].banners.length}, param);
					}else{
						_parent.components[1].changeBanner(param);
					}
				}, idx);
			}else{
				_parent.uiPlfManager.getPromotionList(function(result, data, param){
					if(result){
						_parent.mainMenu[param].banners = data.data;
					}else{
						_parent.mainMenu[param].banners = {data:[]};
					}
					_parent.components[1].changeBanner(param);
				}, {targetId:_parent.mainMenu[idx].baseId, offset:0, limit:6}, idx);
			}
		}
	};
	
	function createComp(mode, menu){
		W.log.info("createComp !!! " + mode);
		isCompleteMakeComp = false;
		if(_parent._comp_area && _parent._curr_comp){
			W.log.info("remove previous component !!");
			try{
				_parent._comp_area.remove(_parent._curr_comp);
			}catch(e){
				
			}
		}
		
		if(_parent.components[3] && _parent.components[3].destroy){
			_parent.components[3].destroy();
		}

		menuCompManager.createComp(_parent._comp_area, _this, isClearPin, menu, depth, undefined, function(compData){
			_parent.components[3] = compData.comp;
			_parent._curr_comp = compData._comp;
			
			_parent._comp_area.add(_parent._curr_comp);
			_parent.components[3].changeMode(mode);
			if(mode == 2){
				if(W.StbConfig.cugType == "accommodation" && menu.categoryCode == "CC0205"){
					couponInfo.showOption();
				}
			}else{
				if(W.StbConfig.cugType == "accommodation" && menu.categoryCode == "CC0205"){
					couponInfo.hideOption();
				}
			}
			isCompleteMakeComp = true;
		}, _parent);
	};
	
	function makeSubMenu(){
		W.log.info("makeSubMenu !!!");
		keyTimeout = undefined;
		if(_comp._menu && _comp._menu._sub){
			_comp._menu.remove(_comp._menu._sub);
		}
		_comp._menu._sub = new W.Div({x:0, y:-2, width:"1280px", height:"90px"});
		_comp._menu.add(_comp._menu._sub);
		
		if(!isClearPin && (_parent.mainMenu[index].isAdultOnly || (W.StbConfig.adultMenuUse && _parent.mainMenu[index].isAdult))){
			createComp(0, _parent.mainMenu[index]);
		}else{
			_comp._menu._subMenus = [];
			W.log.info(_parent.mainMenu[index]);
			if(!_parent.mainMenu[index].isLeaf){
				if(_parent.mainMenu[index].children){
					var title;
					for(var i=0; i < _parent.mainMenu[index].children.length; i++){
						title = _parent.mainMenu[index].children[i].title;
						if(title.length > 10){
							title = title.substr(0,10);
						}
//TODO
//						_comp._menu._subMenus[i] = new W.Div({x:50 + 210 * i, y:519-440, width:"210px", height:"26px", textAlign:"center"});
//						_comp._menu._subMenus[i]._txt = new W.Span({position:"relative", y:2, height:"26px", textColor:"rgb(80,80,80)", 
//							"font-size":"20px", className:"font_rixhead_light", text:title, display:""});
//						_comp._menu._subMenus[i].add(_comp._menu._subMenus[i]._txt);
//						_comp._menu._subMenus[i]._foc = new W.Span({position:"relative", y:0, height:"29px", textColor:"rgb(255,255,255)", 
//							"font-size":"27px", className:"font_rixhead_medium", text:title, display:"none"});
//						_comp._menu._subMenus[i].add(_comp._menu._subMenus[i]._foc);
						
						_comp._menu._subMenus[i] = new W.Div({x:70 + 225 * i, y:519-440, width:"200px", height:"30px"});
						_comp._menu._subMenus[i]._area = new W.Div({x:0, y:0, width:"200px", height:"30px", textAlign:"center"});
						_comp._menu._subMenus[i]._area2 = new W.Div({x:-25, y:0, width:"250px", height:"30px", textAlign:"center"});
						_comp._menu._subMenus[i].add(_comp._menu._subMenus[i]._area);
						_comp._menu._subMenus[i].add(_comp._menu._subMenus[i]._area2);
						_comp._menu._subMenus[i]._txt = new W.Span({position:"relative", y:3, height:"24px", textColor:"rgb(130,130,130)", 
							"font-size":"20px", className:"font_rixhead_light", text:title, display:""});
						_comp._menu._subMenus[i]._area.add(_comp._menu._subMenus[i]._txt);
						_comp._menu._subMenus[i]._foc = new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
							"font-size":"28px", className:"font_rixhead_medium", text:title, display:"none"});
						_comp._menu._subMenus[i]._area2.add(_comp._menu._subMenus[i]._foc);
						

						_comp._menu._sub.add(_comp._menu._subMenus[i]);
					}
					
					checkBanner(index);
				}else{
					_parent.sdpManager.getSubMain(function(result, data, param){
						if(result){
							_parent.mainMenu[param].children = data;
						}else{
							_parent.mainMenu[param].children = [];
						}
						makeSubMenu();
					}, index);
					return;
				}

				
			}else{
				checkBanner(index);
			}
//			if(_parent.mainMenu[index].children && !_parent.mainMenu[index].children[sIndex].isLeaf){
				//makeSubMenu2();
//			}else{
				W.log.info("i === " + index);
				W.log.info("s === " + sIndex);
				if(_parent.mainMenu[index].isLeaf){
					createComp(0, _parent.mainMenu[index]);
				}else{
					createComp(0, _parent.mainMenu[index].children[sIndex]);
				}
//			}
		}
	};
	
	function makeSubMenu2(){
		W.log.info("makeSubMenu22 !!!");
		if(_comp._menu && _comp._menu._sub2){
			_comp._menu.remove(_comp._menu._sub2);
		}
		_comp._menu._sub2 = new W.Div({x:0, y:-2, width:"1280px", height:"90px"});
		_comp._menu.add(_comp._menu._sub2);
		
		_comp._menu._subMenus2 = [];
		
		if(_parent.mainMenu[index].children[sIndex].children){
			var title;
			for(var i=0; i < _parent.mainMenu[index].children[sIndex].children.length; i++){
				title = _parent.mainMenu[index].children[sIndex].children[i].title;
				if(title.length > 10){
					title = title.substr(0,10);
				}
				
//TODO			
//				_comp._menu._subMenus2[i] = new W.Div({x:160 + 160 * i, y:519-440, width:"160px", height:"24px", textAlign:"center"});
//				_comp._menu._subMenus2[i]._txt = new W.Span({position:"relative", y:2, height:"22px", textColor:"rgb(100,100,100)", "font-size":"20px", 
//					className:"font_rixhead_light", text:title, display:""});
//				_comp._menu._subMenus2[i].add(_comp._menu._subMenus2[i]._txt);
//				_comp._menu._subMenus2[i]._foc = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", "font-size":"24px", 
//					className:"font_rixhead_medium", text:title, display:"none"});
//				_comp._menu._subMenus2[i].add(_comp._menu._subMenus2[i]._foc);
				
				
				_comp._menu._subMenus2[i] = new W.Div({x:160 + 225 * i, y:519-440, width:"200px", height:"30px"});
				_comp._menu._subMenus2[i]._area = new W.Div({x:0, y:0, width:"200px", height:"30px", textAlign:"center"});
				_comp._menu._subMenus2[i]._area2 = new W.Div({x:-25, y:0, width:"250px", height:"30px", textAlign:"center"});
				_comp._menu._subMenus2[i].add(_comp._menu._subMenus2[i]._area);
				_comp._menu._subMenus2[i].add(_comp._menu._subMenus2[i]._area2);
				_comp._menu._subMenus2[i]._txt = new W.Span({position:"relative", y:3, height:"24px", textColor:"rgb(130,130,130)", 
					"font-size":"20px", className:"font_rixhead_light", text:title, display:""});
				_comp._menu._subMenus2[i]._area.add(_comp._menu._subMenus2[i]._txt);
				_comp._menu._subMenus2[i]._foc = new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
					"font-size":"28px", className:"font_rixhead_medium", text:title, display:"none"});
				_comp._menu._subMenus2[i]._area2.add(_comp._menu._subMenus2[i]._foc);
				
				
				_comp._menu._sub2.add(_comp._menu._subMenus2[i]);
			}
			createComp(0.8, _parent.mainMenu[index].children[sIndex].children[sIndex2]);
		}else{
	    	var reqData = {categoryId:_parent.mainMenu[index].children[sIndex].categoryId, selector:"@detail"};
			_parent.sdpManager.getMenuTree(function(result, data, param){
				if(result){
					_parent.mainMenu[param.index].children[param.sIndex].children = data.data;
				}else{
					_parent.mainMenu[param.index].children[param.sIndex].children = [];
				}
				makeSubMenu2();
			}, reqData, {index:index, sIndex:sIndex});
			return;
		}
	};

	var focus = function(isFirst, isFirstStart){
		W.log.info("focus !!!!! depth == " + depth + " ,,, isFirst == " + isFirst + " ,,, isFirstStart == " + isFirstStart);
		_parent.changeBgColor();
		
		if(isFirst){
			for(var i=0; i < _parent.mainMenu.length; i++){
				if(i != index){
					_comp._menu._mainMenus[i]._txt.setStyle({textColor:"rgba(205,205,205,0.84)"});
				}
			}
			if(!_parent.mainMenu[index].isLeaf && _parent.mainMenu[index].children){
				for(var i=0; i < _parent.mainMenu[index].children.length; i++){
					if(_comp._menu._subMenus[i]){
						if(depth == 0){
							_comp._menu._subMenus[i]._txt.setStyle({textColor:"rgb(130,130,130)"});
						}else{
							_comp._menu._subMenus[i]._txt.setStyle({textColor:"rgba(205,205,205,0.84)"});
						}
					}
				}
			}
			_parent._comp_area.setStyle({opacity:0.7});
		}
		
		if(depth == 0){
			if(!isFirst){
				removeBanner(index);
			}
			if(_comp._menu && _comp._menu._sub2){
				_comp._menu._sub2.setStyle({display:"none"});
			}
			if(!_parent.mainMenu[index].focWidth){
				_parent.mainMenu[index].focWidth = _comp._menu._mainMenus[index]._txt.comp.offsetWidth;
				W.log.info("offsetWidth  :: " + _parent.mainMenu[index].focWidth);
				_parent.mainMenu[index].focWidth = _comp._menu._mainMenus[index]._txt.comp.offsetWidth;
				W.log.info("offsetWidth  :: " + _parent.mainMenu[index].focWidth);
			}

// TODO
//			var pageOffset = -(Math.floor(index/6) * 1140);
//			var focusPosition = 50 + 190 * index + pageOffset;
//			var zzimPosition = 50 + 190 * index + pageOffset + 85 + _parent.mainMenu[index].focWidth/2 + 10;
//			var mainPosition = pageOffset;
//			var barPosition = index < 6 ? 50 : 0;
//
//			_comp._menu._focus.setStyle({x:focusPosition});
//			_comp._menu._focus._l.setStyle({x: 95 - _parent.mainMenu[index].focWidth/2 - 10});
//			_comp._menu._focus._m.setStyle({x: 95 - _parent.mainMenu[index].focWidth/2, width:_parent.mainMenu[index].focWidth + "px"});
//			_comp._menu._focus._r.setStyle({x: 95 + _parent.mainMenu[index].focWidth/2});
//			_comp._menu._focus.setStyle({display: ""});
			
			
			var pageOffset = -(Math.floor(index/5) * 1125);
			var focusPosition = 50 + 225 * index + pageOffset;
			var zzimPosition = 50 + 225 * index + pageOffset + 85 + _parent.mainMenu[index].focWidth/2 + 10;
			var mainPosition = pageOffset;
			var barPosition = index < 5 ? 50 : 0;

			_comp._menu._focus.setStyle({x:focusPosition});
			_comp._menu._focus._l.setStyle({x: 95 - _parent.mainMenu[index].focWidth/2 - 10});
			_comp._menu._focus._m.setStyle({x: 95 - _parent.mainMenu[index].focWidth/2, width:_parent.mainMenu[index].focWidth + "px"});
			_comp._menu._focus._r.setStyle({x: 95 + _parent.mainMenu[index].focWidth/2});
			_comp._menu._focus.setStyle({display: ""});
			
			for(var i=0; i < _parent.mainMenu.length; i++){
				if(i == index){
					_comp._menu._mainMenus[i]._txt.setStyle({display:"none"});
					_comp._menu._mainMenus[i]._foc.setStyle({display:""});
				}else{
					_comp._menu._mainMenus[i]._txt.setStyle({display:""});
					_comp._menu._mainMenus[i]._foc.setStyle({display:"none"});
				}
			}
			
			if(_parent.mainMenu[index].isPinned){
				_comp._menu._zzim.setStyle({display:"", x:zzimPosition});
			}else{
				_comp._menu._zzim.setStyle({display:"none"});
			}
			_comp._menu._main.setStyle({x:mainPosition});
			_comp._menu._bar.setStyle({x:barPosition});
			_parent._comp_area.setStyle({opacity:0.7});
			
			if(!isFirst && depth == 0){
				sIndex = 0;
				clearTimeout(keyTimeout);
				if(isFirstStart){
					keyTimeout = setTimeout(function(){
						keyTimeout = undefined;
						makeSubMenu();
					}, 0);
				}else{
					keyTimeout = setTimeout(function(){
						keyTimeout = undefined;
						makeSubMenu();
					}, W.Config.KEY_TIMEOUT_TIME);
				}
			}
		}else if(depth == 1){
			W.log.info("sIndex =========== " + sIndex);
			sIndex2 = 0;
			if(_comp._menu && _comp._menu._sub2){
				if(isFirst){
					_comp._menu._sub2.setStyle({display:"block"});
				}else{
					_comp._menu.remove(_comp._menu._sub2);
					_comp._menu._sub2 = null;
				}
			}
//TODO			var pageOffset = -(Math.floor(sIndex/5) * 1050);
			var pageOffset = -(Math.floor(sIndex/5) * 1125);
			
			if(!_parent.mainMenu[index].children[sIndex].focWidth){
				_parent.mainMenu[index].children[sIndex].focWidth = _comp._menu._subMenus[sIndex]._txt.comp.offsetWidth + 20;
			}
			
//TODO			_comp._menu._focus.setStyle({x:69 + 210 * sIndex + pageOffset});
			_comp._menu._focus.setStyle({x:67 + 225 * sIndex + pageOffset});
			_comp._menu._focus._l.setStyle({x: 86 - _parent.mainMenu[index].children[sIndex].focWidth/2 - 10});
			_comp._menu._focus._m.setStyle({x: 86 - _parent.mainMenu[index].children[sIndex].focWidth/2, width:_parent.mainMenu[index].children[sIndex].focWidth + "px"});
			_comp._menu._focus._r.setStyle({x: 86 + _parent.mainMenu[index].children[sIndex].focWidth/2});
			_comp._menu._focus.setStyle({display: ""});
			

			for(var i=0; i < _parent.mainMenu[index].children.length; i++){
				if(i == sIndex){
					_comp._menu._subMenus[i]._txt.setStyle({display:"none"});
					_comp._menu._subMenus[i]._foc.setStyle({display:""});
				}else{
					_comp._menu._subMenus[i]._txt.setStyle({display:""});
					_comp._menu._subMenus[i]._foc.setStyle({display:"none"});
				}
			}
			
			if(_parent.mainMenu[index].children[sIndex].isPinned){
				_comp._menu._zzim.setStyle({display:"", x:60 + 225 * sIndex + pageOffset + 85 + _parent.mainMenu[index].children[sIndex].focWidth/2 + 20});
			}else{
				_comp._menu._zzim.setStyle({display:"none"});
			}
			_comp._menu._sub.setStyle({x:pageOffset});
			_comp._menu._bar.setStyle({x:sIndex < 6 ? 50 : 0});
			
			_parent._comp_area.setStyle({opacity:1});
			
			if(!isFirst){
				clearTimeout(keyTimeout);
				if(_parent.mainMenu[index].children && _parent.mainMenu[index].children[sIndex].categoryCode=="CC0106"){
					keyTimeout = setTimeout(function(){
						keyTimeout = undefined;
						makeSubMenu2();
					}, W.Config.KEY_TIMEOUT_TIME);
				}else{
					keyTimeout = setTimeout(function(){
						keyTimeout = undefined;
						createComp(1, _parent.mainMenu[index].children[sIndex]);
					}, W.Config.KEY_TIMEOUT_TIME);
				}
			}
			W.categoryNotice.show(_parent.mainMenu[index]);
		}else if(depth == 2){
			W.log.info("sIndex2 =========== " + sIndex2);

//TODO			var pageOffset = -(Math.floor(sIndex2/6) * 1140);
			var pageOffset = -(Math.floor(sIndex/5) * 1125);

			if(!_parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth){
				_parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth = _comp._menu._subMenus2[sIndex2]._txt.comp.offsetWidth;
			}
			
//TODO			_comp._menu._focus.setStyle({x:58 + 190 * sIndex2 + pageOffset});
			_comp._menu._focus.setStyle({x:58 + 225 * sIndex2 + pageOffset});
			_comp._menu._focus._l.setStyle({x: 86 - _parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth/2 - 10});
			_comp._menu._focus._m.setStyle({x: 86 - _parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth/2, width:_parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth + "px"});
			_comp._menu._focus._r.setStyle({x: 86 + _parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth/2});
			_comp._menu._focus.setStyle({display: ""});
			
			for(var i=0; i < _parent.mainMenu[index].children[sIndex].children.length; i++){
				if(i == sIndex2){
					_comp._menu._subMenus2[i]._txt.setStyle({display:"none"});
					_comp._menu._subMenus2[i]._foc.setStyle({display:""});
				}else{
					_comp._menu._subMenus2[i]._txt.setStyle({display:""});
					_comp._menu._subMenus2[i]._foc.setStyle({display:"none"});
				}
			}
			
			if(_parent.mainMenu[index].children[sIndex].children[sIndex2].isPinned){
				_comp._menu._zzim.setStyle({display:"", x:60 + 190 * sIndex2 + pageOffset + 85 + _parent.mainMenu[index].children[sIndex].children[sIndex2].focWidth/2 + 20});
			}else{
				_comp._menu._zzim.setStyle({display:"none"});
			}
			_comp._menu._sub.setStyle({x:pageOffset});
			_comp._menu._bar.setStyle({x:sIndex2 < 6 ? 50 : 0});
			
			_parent._comp_area.setStyle({opacity:1});
			
			if(!isFirst){
				clearTimeout(keyTimeout);
				keyTimeout = setTimeout(function(){
					keyTimeout = undefined;
					createComp(1, _parent.mainMenu[index].children[sIndex].children[sIndex2]);
				}, W.Config.KEY_TIMEOUT_TIME);
			}
			W.categoryNotice.show(_parent.mainMenu[index].children[sIndex]);
		}
		oldDepth = depth;
	};
	
	function unFocus(currState){
		W.log.info("unFocus !!!!! currState == " + currState);
		for(var i=0; i < _parent.mainMenu.length; i++){
			if(i != index){
				_comp._menu._mainMenus[i]._txt.setStyle({textColor:"rgba(205,205,205,0.84)"});
			}
		}
		if(!_parent.mainMenu[index].isLeaf && _parent.mainMenu[index].children){
			for(var i=0; i < _parent.mainMenu[index].children.length; i++){
				if(_comp._menu._subMenus[i] && _comp._menu._subMenus[i]._txt){
					_comp._menu._subMenus[i]._txt.setStyle({"font-size":"20px", textColor:"rgb(130,130,130)"});
				}
			}
		}
		_comp._menu._focus.setStyle({display: "none"});
	};
	
	function focusMain(){
		W.log.info("focusMain !!!!!");
		_parent._comp_area.setStyle({opacity:0.7});
		_comp._menu._bar.setStyle({x:50, width:(1280*Math.ceil(_parent.mainMenu.length/7)) + "px"});
		_comp._menu.setY(440);
		_comp._menu._main.setStyle({display:""});
		_parent.components[0].getComp().setStyle({display:""});
		_parent.components[1].getComp().setStyle({display:""});
		_comp._top.setStyle({display:"none"});
		_comp._menu._sub.setY(-2);
		
		if(!_parent.mainMenu[index].isLeaf){
			for(var i=0; i < _parent.mainMenu[index].children.length; i++){
				_comp._menu._subMenus[i].setStyle({x:70 + 225 * i, y:519-440, width:"200px", height:"30px"});
				_comp._menu._subMenus[i]._txt.setStyle({display:""});
			}
			_comp._menu._subMenus[sIndex]._foc.setStyle({display:"none"});
			
			if(!_parent.mainMenu[index].isLeaf && _parent.mainMenu[index].children){
				for(var i=0; i < _parent.mainMenu[index].children.length; i++){
					if(_comp._menu._subMenus[i] && _comp._menu._subMenus[i]._txt){
						_comp._menu._subMenus[i]._txt.setStyle({"font-size":"20px", textColor:"rgb(130,130,130)"});
					}
				}
			}
			
		}else{
			
		}
		depth = 0;
		focus(true);
		TitleComp.changeMode(0);
	};
	
	function focusSub(){
		W.log.info("focusSub !!!!!");
		_parent._comp_area.setStyle({opacity:1});
		_comp._menu._bar.setStyle({x:50, width:(1280*Math.ceil(_parent.mainMenu[index].children.length/6)) + "px"});
		_comp._menu.setY(440 - 170);
		_comp._menu._main.setStyle({display:"none"});
		_parent.components[0].getComp().setStyle({display:"none"});
		_parent.components[1].getComp().setStyle({display:"none"});
		_comp._top.setStyle({display:""});

		_comp._menu._sub.setY(-75);
		for(var i=0; i < _parent.mainMenu[index].children.length; i++){
			_comp._menu._subMenus[i].setStyle({x:50 + 225 * i, y:519-440, width:"200px", height:"30px"});
			_comp._menu._subMenus[i]._txt.setStyle({"font-size":"22px", textColor:"rgba(205,205,205,0.84)"});
		}
		depth = 1;
		focus(true);
		if(_parent.mainMenu[index].children[sIndex].children){
			TitleComp.changeMode(0.8, _parent.mainMenu[index]);
		}else{
			TitleComp.changeMode(1, _parent.mainMenu[index]);
		}
	};
	
	function focusSub2(){
		W.log.info("focusSub2 !!!!!");
		_comp._menu._sub.setStyle({display:"none"});
		_comp._menu._sub2.setY(-75);
		for(var i=0; i < _parent.mainMenu[index].children[sIndex].children.length; i++){
			_comp._menu._subMenus2[i].setStyle({x:50 + 190 * i, y:519-440, width:"190px", height:"22px"});
			_comp._menu._subMenus2[i]._txt.setStyle({"font-size":"20px", textColor:"rgb(130,130,130)"});
		}
		depth = 2;
		focus(true);
//		_parent.components[3].changeMode(1);
		TitleComp.changeMode(1, _parent.mainMenu[index].children[sIndex]);
	};
	
	function unFocusSub2(){
		_comp._menu._sub.setStyle({display:"block"});
		_comp._menu._sub2.setY(-2);
		
		
		for(var i=0; i < _parent.mainMenu[index].children[sIndex].children.length; i++){
			_comp._menu._subMenus2[i].setStyle({x:160 + 160 * i, y:519-440, width:"160px", height:"22px"});
			_comp._menu._subMenus2[i]._txt.setStyle({"font-size":"20px", textColor:"rgb(130,130,130)", display:"block"});
			_comp._menu._subMenus2[i]._foc.setStyle({display:"none"});
		}
		depth = 1;
		focus(true);
		TitleComp.changeMode(0.8);
//		_parent.components[3].changeMode(0.8);
	};
	
	var hideHome = function(){
		_comp._menu.setStyle({display:"none"});
		_comp._top.setStyle({display:""});
		_parent.components[0].getComp().setStyle({display:"none"});
		_parent.components[1].getComp().setStyle({display:"none"});
		
		if(_parent.components[3].componentName == "ForYouList" || _parent.components[3].componentName == "SettingMain"){
			_comp._top.setStyle({display:"none"});
		}
	};

	return {
		init: function(parent, _div){
			_parent = parent;
			_parentDiv = _div;
			_this = this;
			_this.couponInfo = couponInfo;
			depth = 0;
			index = 0;
			sIndex = 0;
			sIndex2 = 0;
			isClearPin = false;
			isPinCheck = false;
			isCheckedCoupon = false;
			TitleComp = new titleComp();
			return create();
		},
		getTotalPath: function(){
			return "23434432";
		},
		getComp: function(){
			return _comp;
		},
		clearAdult: function(){
			W.log.info("depth == " + depth);
			W.log.info("_parent.mainMenu[index].children[sIndex].isAdult == " + _parent.mainMenu[index].children[sIndex].isAdult);
			if(depth == 0){
				makeSubMenu();
			}else if(depth == 1){
				createComp(1, _parent.mainMenu[index].children[sIndex]);
			}
			clearPinDepth = depth;
			isClearPin = true;
			focus();
			isPinCheck = false;
			_this.pinCheckProcessTimeout = setTimeout(function(){
				_this.pinCheckProcessTimeout = undefined;
				_this.operate({keyCode:W.KEY.DOWN});
			}, 1000);
		},
		focus: function(isFirst, isFirstStart){
			focus(isFirst, isFirstStart);
		},
		currIdx: function(){
			return index;
		},
		unFocus: function(currState){
			unFocus(currState);
		},
		destroy: function() {
			
		},
		show: function(){
			_comp._menu.setStyle({display:""});
		},
		changeMode: function(mode){
			TitleComp.changeMode(mode);
		},
		showAll: function(){
			_comp._menu.setStyle({display:""});
			depth = 0;
			focusMain();
		},
		changeFocColor: function(txtColor){
			_comp._menu._mainMenus[index]._foc.setStyle({textColor:txtColor});
		},
		hasData: function(){
			W.log.info("parent.mainMenu.length == " + _parent.mainMenu.length);
			return _parent.mainMenu[index].children && _parent.mainMenu[index].children.length > 0 ? true : false;
		},
		getDepth: function(){
			return depth;
		},
		jumpMenu: function(targetCategoryId){
			_parent.jumpMenu(targetCategoryId);
		},
		changeCategory: function(targetCategoryId){
			W.log.info("targetCategoryId == " + targetCategoryId);
			W.log.info("depth == " + depth);
			var list = [];
			if(depth == 0){
				list = _parent.mainMenu;
			}else if(depth == 1){
				list = _parent.mainMenu[index].children;
			}else if(depth == 2){
				list = _parent.mainMenu[index].children[sIndex].children;
			}
			for(var i=0; i < list.length; i++){
				if(targetCategoryId == list[i].categoryId){
					if(depth == 0){
						index = i;
						createComp(2, _parent.mainMenu[index]);
					}else if(depth == 1){
						sIndex = i;
						createComp(2, _parent.mainMenu[index].children[sIndex]);
					}else if(depth == 2){
						sIndex2 = i;
						createComp(2, _parent.mainMenu[index].children[sIndex].children[sIndex2]);
					}
//					focus(undefined, undefined, true);
					break;
				}
			}
		},
		operate : function(event){
			W.log.info(" onKeyPressed " + event.keyCode + " ,, state : " + _parent.state + " ,, " + depth + " ,, " + isCompleteMakeComp);
			W.categoryNotice.hide();
			
			if(_this.pinCheckProcessTimeout){
				return true;
			}

			if(!isCompleteMakeComp){
				return true;
			}
			if(isPinCheck){
				var isConsume = _parent.components[3].operate(event);
				if(isConsume){
					return true;
				}
			}
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.RIGHT:
				if(depth == 0){
					index = (++index) % _parent.mainMenu.length;
				}else if(depth == 1){
					sIndex = (++sIndex) % _parent.mainMenu[index].children.length;
				}else if(depth == 2){
					sIndex2 = (++sIndex2) % _parent.mainMenu[index].children[sIndex].children.length;
				}
				focus();
				isConsume = true;
				if(clearPinDepth >= depth){
					isClearPin = false;
				}
				isPinCheck = false;
				break;
			case W.KEY.LEFT:
				if(depth == 0){
					index = (--index + _parent.mainMenu.length) % _parent.mainMenu.length;
				}else if(depth == 1){
					sIndex = (--sIndex + _parent.mainMenu[index].children.length) % _parent.mainMenu[index].children.length;
				}else if(depth == 2){
					sIndex2 = (--sIndex2 + _parent.mainMenu[index].children[sIndex].children.length) % _parent.mainMenu[index].children[sIndex].children.length;
				}
				focus();
				isConsume = true;
				if(clearPinDepth >= depth){
					isClearPin = false;
				}
				isPinCheck = false;
				break;
			case W.KEY.UP:
				if(keyTimeout) return true;
				if(isPinCheck){
					_parent.components[3].unFocus();
					focus(true);
					isPinCheck = false;
					isConsume = true;
				}else{
					if(depth == 1){
						focusMain();
						isConsume = true;
					}else if(depth == 2){
						unFocusSub2();
						isConsume = true;
					}
					
					if(clearPinDepth >= depth){
						isClearPin = false;
					}
				}
				break;
			case W.KEY.ENTER:
			case W.KEY.DOWN:
				if(keyTimeout) return true;
				if(depth == 0){
					if(_parent.components[3].name && _parent.components[3].name == "pinCheckComp"){
						_parent.components[3].focus();
						unFocus();
						isConsume = true;
						isPinCheck = true;
					}else{
						if(util.isBlockedHotelMenu(_parent.mainMenu[index])){
				    		W.PopupManager.openPopup({
				                title:W.Texts["popup_zzim_info_title"],
				                popupName:"popup/AlertPopup",
				                boldText:W.Texts["alert_block_title"],
				                thinText:W.Texts["alert_block_message2"] 
				            });
						}else{
							if(_parent.mainMenu[index].link){
								W.LinkManager.action("L", _parent.mainMenu[index].link);
                        		_parent.isAddedEntryPath = true;
                        		W.entryPath.push("menu.categoryId", _parent.mainMenu[index], "CategoryList");
								isConsume = true;
							}else if(_parent.mainMenu[index].menuType == "MC0009"){
								W.LinkManager.action("L", _parent.mainMenu[index].custom.link);
                        		_parent.isAddedEntryPath = true;
                        		W.entryPath.push("menu.categoryId", _parent.mainMenu[index], "CategoryList");
								isConsume = true;
							}else if(_parent.mainMenu[index].linkImg){
								W.log.info("Main Link Menu !!!! ");
								isConsume = true;
							}else{
								if(_parent.mainMenu[index].isLeaf){
									if(_parent.mainMenu[index].categoryCode == "CC0202" && !_parent.components[3].hasList()){
					                    W.SceneManager.startScene({
					                        sceneName:"scene/setting/SettingScene",
					                        backState:W.SceneManager.BACK_STATE_KEEPHIDE,
					                        param:{targetId : "CC1001"}
					                    });
										isConsume = true;
									}else{
										//App 리스트 api가 느려서 따로 처리함..
										//리스트 가지고 오는 도중에는 진입이 안 되도록 수정
										if(_parent.mainMenu[index].menuType == "MC0006"){
											if(_parent.components[3].hasList()){
												hideHome();
												_parent.state = 3;
												_parent.changeBgColor(true);
												TitleComp.changeMode(2, _parent.mainMenu[index]);
											}else{
												isConsume = true;
											}
										}else{
											hideHome();
											_parent.state = 3;
											_parent.changeBgColor(true);
											TitleComp.changeMode(2, _parent.mainMenu[index]);
										}
									}
								}else{
									focusSub();
									isConsume = true;
								}
							}
						}
					}
				}else if(depth == 1){
					if(_parent.components[3].name && _parent.components[3].name == "pinCheckComp"){
						_parent.components[3].focus();
						unFocus();
						isConsume = true;
						isPinCheck = true;
					}else{
						if(util.isBlockedHotelMenu(_parent.mainMenu[index].children[sIndex])){
				    		W.PopupManager.openPopup({
				                title:W.Texts["popup_zzim_info_title"],
				                popupName:"popup/AlertPopup",
				                boldText:W.Texts["alert_block_title"],
				                thinText:W.Texts["alert_block_message2"] 
				            });
						}else{
							if(_parent.mainMenu[index].children && _parent.mainMenu[index].children[sIndex].link){
								W.LinkManager.action("L", _parent.mainMenu[index].children[sIndex].link);
                        		_parent.isAddedEntryPath = true;
                        		W.entryPath.push("menu.categoryId", _parent.mainMenu[index].children[sIndex], "CategoryList");
								isConsume = true;
							}else if(_parent.mainMenu[index].children && _parent.mainMenu[index].children[sIndex].linkImg){
								W.log.info("Sub Link Menu !!!! ");
								isConsume = true;
							}else if(_parent.mainMenu[index].children && _parent.mainMenu[index].children[sIndex].categoryCode == "CC0106"){
								focusSub2();
								isConsume = true;
							}else{
								if(_parent.mainMenu[index].children[sIndex].categoryCode == "CC0202" && !_parent.components[3].hasList()){
				                    W.SceneManager.startScene({
				                        sceneName:"scene/setting/SettingScene",
				                        backState:W.SceneManager.BACK_STATE_KEEPHIDE,
				                        param:{targetId : "CC1001"}
				                    });
									isConsume = true;
								}else{
									if(_parent.mainMenu[index].isLeaf){
										hideHome();
										_parent.state = 3;
										_parent.changeBgColor(true);
										TitleComp.changeMode(2, _parent.mainMenu[index].children[sIndex]);
									}else{
										_parent.state = 3;
										_comp._menu.setStyle({display:"none"});
										_parent.changeBgColor(true);
										TitleComp.changeMode(2, _parent.mainMenu[index].children[sIndex]);
										isConsume = true;
									}
								}
							}
						}
					}
				}else if(depth == 2){
					if(util.isBlockedHotelMenu(_parent.mainMenu[index].children[sIndex].children[sIndex2])){
			    		W.PopupManager.openPopup({
			                title:W.Texts["popup_zzim_info_title"],
			                popupName:"popup/AlertPopup",
			                boldText:W.Texts["alert_block_title"],
			                thinText:W.Texts["alert_block_message2"] 
			            });
					}else{
						if(!isClearPin && _parent.mainMenu[index].children[sIndex].children[sIndex2].categoryCode == "CC0202" && !_parent.components[3].hasList()){
		                    W.SceneManager.startScene({
		                        sceneName:"scene/setting/SettingScene",
		                        backState:W.SceneManager.BACK_STATE_KEEPHIDE,
		                        param:{targetId : "CC1001"}
		                    });
							isConsume = true;
						}else{
							if(_parent.mainMenu[index].children[sIndex].children[sIndex2].link){
                        		W.entryPath.push("menu.categoryId", _parent.mainMenu[index].children[sIndex].children[sIndex2], "CategoryList");
                        		_parent.isAddedEntryPath = true;
								W.LinkManager.action("L", _parent.mainMenu[index].children[sIndex].children[sIndex2].link);
								isConsume = true;
							}else if(_parent.mainMenu[index].children[sIndex].isLeaf){
								hideHome();
								_parent.state = 3;
								_parent.changeBgColor(true);
								TitleComp.changeMode(2, _parent.mainMenu[index].children[sIndex].children[sIndex2]);
							}else{
								_parent.state = 3;
								_parent.changeBgColor(true);
								_comp._menu.setStyle({display:"none"});
								TitleComp.changeMode(2, _parent.mainMenu[index].children[sIndex].children[sIndex2]);
								isConsume = true;
							}
						}
					}
				}
				if(!isCheckedCoupon){
					couponInfo.setData();
					isCheckedCoupon = true;
					if(W.StbConfig.cugType == "accommodation"){
						couponInfo.hideOption();
					}
				}
				
				
				break;
			case W.KEY.COLOR_KEY_Y:
				if(depth > 0){
					if(W.StbConfig.cugType != "accommodation"){
						var currCategory = depth == 1 ? _parent.mainMenu[index].children[sIndex] : _parent.mainMenu[index].children[sIndex].children[sIndex2];
						var categoryPath = W.entryPath.getCategoryPath(currCategory.title);
						var btnName = currCategory.isPinned ? W.Texts["remove_bookmark"] : W.Texts["add_bookmark"];
						var popupData = {options:[
		  						{name:categoryPath, subOptions : [
		  							{type:"box", name:btnName}
		  						]}
		  					]};
		  				var popup = {
		  					popupName:"popup/sideOption/VodSideOptionPopup",
		  					optionData:popupData,
		  					param:currCategory,
		  					childComp : _this
		  				};
		  				W.PopupManager.openPopup(popup);
					}
				}else{
					var link = {linkType:"ap03", linkTarget:W.Config.WEATHER_APP_URL};
					W.CloudManager.runApplication(undefined, link);
				}
				break;
			case W.KEY.BACK:
				if(depth > 0){
					if(isPinCheck){
						_parent.components[3].unFocus();
						focus(true);
						isPinCheck = false;
						isConsume = true;
					}else{
						if(depth == 1){
							focusMain();
							isConsume = true;
						}else if(depth == 2){
							unFocusSub2();
							isConsume = true;
						}
					}
				}
				break;
			}

			return isConsume;
		},
		onPopupOpened : function(popup, desc) {
		},
		onPopupClosed : function(popup, desc) {
			if (desc) {
				if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
					if (desc.action == W.PopupManager.ACTION_OK) {
						W.log.info(desc);
						if(desc.param.option == 0){
							if(desc.param.subOptions == 0){
								var reqData = {targetId : desc.param2.categoryId};
								var favoriteFunction;
								if(desc.param2.isPinned){
									favoriteFunction = _parent.sdpManager.removeViewingFavorite;
								}else{
									favoriteFunction = _parent.sdpManager.addViewingFavorite;
								}
								favoriteFunction(function(result, data, param){
									W.log.info(data);
									if(result){
										W.PopupManager.openPopup({
				                            childComp:_this,
				                            type:"2LINE",
				                            popupName:"popup/FeedbackPopup",
				                            title:param.title,
				                            desc:param.isPinned ? W.Texts["bookmark_msg_removed"] : W.Texts["bookmark_msg_added"]}
				                        );
										param.isPinned = !param.isPinned;
										focus(true);
									}else{
										if(data && data.error && data.error.code == "C0501" && !param.isPinned){
											W.PopupManager.openPopup({
				                				childComp:_this,
				                                title:W.Texts["popup_zzim_info_title"],
				                                popupName:"popup/AlertPopup",
				                                boldText:W.Texts["bookmark_guide3"],
				                                thinText:W.Texts["bookmark_guide4"]}
				        	                );
										}else{
											W.PopupManager.openPopup({
					                            childComp:_this,
					                            popupName:"popup/ErrorPopup",
					                            code:data.error ? data.error.code : "9999",
					                            message:data.error ? [data.error.detail] : null,
					        					from : "SDP"}
					                        );
										}
									}
								}, reqData, desc.param2);
							}
						}
					}
				}
			}
		},
	};
});