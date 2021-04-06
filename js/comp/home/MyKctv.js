W.defineModule([ "mod/Util", "manager/MenuCompManager"],
		function(util, menuCompManager) {
	function MyKctv(){
		var _this;
		var _parent;
		var _comp;
		var _parent;
		var index = 0;
		var sIndex = 0;
		var depth = 0;
		var oldDepth = 0;
		var keyTimeout = undefined;
		var oldIndex = 0;
		var oldSIndex = 0;
		var isPinCheck = false;
		var isClearPin = false;
		var _parentDiv;
		var isCheckedPurchasePin = false;
		var couponInfo;
		
		var TitleComp = new function(){
			var oldMode = 0;
			var titles = [];
			this.getTitles = function() {return titles};
			this.setTitle = function(title){
				titles.push(title);
				setElement();
			};
			this.removeTitle = function(){
				titles.pop();
				setElement();
			};
			this.changeMode = function(mode, title){
				if(mode == 0){
					titles = [];
					setElement();
				}
				
				if(title){
					this.setTitle(title);
				}else{
					this.removeTitle();
				}
				if(mode > -1){
					_parent.components[1].changeMode(mode);
					oldMode = mode;
					if(mode == 2){
						_parent._comp_area.setStyle({opacity:1});
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
					_comp._top._title_comp.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
						"font-size":"27px", className:"font_rixhead_medium", text:titles[0]}));
				}else{
					for(var i=0; i < titles.length; i++){
						if(i == titles.length - 1){
							_comp._top._title_comp.add(new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(255,255,255)", 
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
			_comp = new W.Div({id:"mykctv_menu_main", x:0, y:0, width:"1280px", height:"530px"});
			
			_comp._top = new W.Div({x:0, y:38, width:"1280px", height:"68px"});
			_comp.add(_comp._top);
			
			_comp._top._title = new W.Div({x:55, y:13, width:"500px", height:"30px", textAlign:"left"});
			_comp._top.add(_comp._top._title);

			_comp._menu = new W.Div({id:"mykctv_menu", x:0, y:270, width:"1280px", height:"90px"});
			_comp.add(_comp._menu);
			
			_comp._menu._bar = new W.Div({x:50, y:488-440, width:"1280px", height:"1px", className:"line_1px"});
			_comp._menu.add(_comp._menu._bar);
			_comp._menu._main = new W.Div({id:"mykctv_menu_main", x:0, y:2, width:"1280px", height:"90px"});
			_comp._menu._sub = new W.Div({id:"mykctv_menu_sub", x:0, y:-2, width:"1280px", height:"90px"});
			_comp._menu.add(_comp._menu._main);
			_comp._menu.add(_comp._menu._sub);
			_comp._menu._mainMenus = [];
			
			
			
			var title;
			for(var i=0; i < _parent.mainMenu.length; i++){
				title = _parent.mainMenu[i].title;
				if(title.length > 8){
					title = title.substr(0,7) + "...";
				}
				_comp._menu._mainMenus[i] = new W.Div({x:50 + 210 * i, y:0, width:"210px", height:"29px", textAlign:"center"});
				_comp._menu._mainMenus[i]._txt = new W.Span({position:"relative", y:2, height:"26px", textColor:"rgba(140,140,140,0.85)", "font-size":"24px", className:"font_rixhead_light", text:title, display:""});
				_comp._menu._mainMenus[i].add(_comp._menu._mainMenus[i]._txt);
				
				_comp._menu._mainMenus[i]._foc = new W.Span({position:"relative", y:0, height:"29px", textColor:"rgb(255,255,255)", "font-size":"27px", className:"font_rixhead_medium", text:title, display:"none"});
				_comp._menu._mainMenus[i].add(_comp._menu._mainMenus[i]._foc);

				_comp._menu._main.add(_comp._menu._mainMenus[i]);
			}
			
			_comp._menu._zzim = new W.Image({x:100, y:446-440, width:"13px", height:"11px", src:"img/info_heart.png", display:"none"});
			_comp._menu.add(_comp._menu._zzim);
			
			_comp._menu._focus = new W.Div({x:50, y:485-440, width:"170px", height:"6px"});
			_comp._menu._focus._l = new W.Image({x:25, y:0, width:"10px", height:"6px", src:"img/00_m_foc_l.png"});
			_comp._menu._focus._m = new W.Span({x:35, y:0, width:"100px", height:"6px", backgroundColor:"rgb(229,48,0)"});
			_comp._menu._focus._r = new W.Image({x:135, y:0, width:"10px", height:"6px", src:"img/00_m_foc_r.png"});
			_comp._menu._focus.add(_comp._menu._focus._l);
			_comp._menu._focus.add(_comp._menu._focus._m);
			_comp._menu._focus.add(_comp._menu._focus._r);
			_comp._menu.add(_comp._menu._focus);
			
			TitleComp.setTitle(_parent.mainTitle);
			
			return _comp;
		};

		function createComp(mode, menu, isPinComp){
			W.log.info("createComp !!! " + mode);
			if(_parent._comp_area && _parent._curr_comp){
				W.log.info("remove previous component !!");
				try{
					_parent._comp_area.remove(_parent._curr_comp);
				}catch(e){
					
				}
			}
			
			if(_parent.components[1] && _parent.components[1].destroy){
				_parent.components[1].destroy();
			}

			menuCompManager.createComp(_parent._comp_area, _this, isClearPin, menu, depth+1, isPinComp, function(compData){
				_parent.components[1] = compData.comp;
				_parent._curr_comp = compData._comp;
				
				_parent._comp_area.add(_parent._curr_comp);
				_parent.components[1].changeMode(mode);
			}, _parent);
		};
		
		function makeSubMenu(){
			W.log.info("makeSubMenu !!!");
			if(_comp._menu && _comp._menu._sub){
				_comp._menu.remove(_comp._menu._sub);
			}
			_comp._menu._sub = new W.Div({x:0, y:-2, width:"1280px", height:"90px"});
			_comp._menu.add(_comp._menu._sub);
			
			_comp._menu._subMenus = [];
			
			if(_parent.mainMenu[index].children){
				var title;
				for(var i=0; i < _parent.mainMenu[index].children.length; i++){
					title = _parent.mainMenu[index].children[i].title;
					if(W.StbConfig.menuLanguage == "ENG" || W.StbConfig.menuLanguage == "JPN"){
						if(title.length > 10){
							title = title.substr(0,10) + "...";
						}
					}else{
						if(title.length > 9){
							title = title.substr(0,8) + "...";
						}
					}
					_comp._menu._subMenus[i] = new W.Div({x:160 + 160 * i, y:519-440, width:"160px", height:"22px", textAlign:"center"});
					_comp._menu._subMenus[i]._txt = new W.Span({position:"relative", y:2, height:"20px", textColor:"rgb(80,80,80)", "font-size":"18px", 
						className:"font_rixhead_light", text:title, display:""});
					_comp._menu._subMenus[i].add(_comp._menu._subMenus[i]._txt);
					
					_comp._menu._subMenus[i]._foc = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
						className:"font_rixhead_medium", text:title, display:"none"});
					_comp._menu._subMenus[i].add(_comp._menu._subMenus[i]._foc);
					
					_comp._menu._sub.add(_comp._menu._subMenus[i]);
				}
				createComp(0.8, _parent.mainMenu[index].children[sIndex]);
			}else{
		    	var reqData = {categoryId:_parent.mainMenu[index].categoryId, selector:"@detail"};
				_parent.sdpManager.getMenuTree(function(result, data, param){
					if(result){
						_parent.mainMenu[param.index].children = data.data;
					}else{
						_parent.mainMenu[param.index].children = [];
					}
					makeSubMenu();
				}, reqData, {index:index});
				return;
			}
		};

		var focus = function(isFirst){
			W.log.info("focus !!!!! depth == " + depth + " ,,, isFirst == " + isFirst);
			_parent.changeBgColor();
			
			if(_parent.mainMenu[index].categoryCode == "CC0104" || W.StbConfig.cugType == "accommodation"){
				couponInfo.hideButton();
			}else{
				couponInfo.showButton();
			}
			
			if(isFirst){
				for(var i=0; i < _parent.mainMenu.length; i++){
					if(i != index){
						_comp._menu._mainMenus[i]._txt.setStyle({textColor:"rgba(205,205,205,0.85)"});
					}
				}
				if(!_parent.mainMenu[index].isLeaf && _parent.mainMenu[index].children && _comp._menu._subMenus && _comp._menu._subMenus.length > 0){
					for(var i=0; i < _parent.mainMenu[index].children.length; i++){
						if(depth == 0){
							_comp._menu._subMenus[i]._txt.setStyle({textColor:"rgb(130,130,130)"});
						}else{
							_comp._menu._subMenus[i]._txt.setStyle({textColor:"rgba(205,205,205,0.85)"});
						}
					}
				}
				_parent._comp_area.setStyle({opacity:0.8});

			}

			if(depth == 0){
				if(!_parent.mainMenu[index].focWidth){
					_parent.mainMenu[index].focWidth = _comp._menu._mainMenus[index]._txt.comp.offsetWidth;
				}
				
				var pageOffset = -(Math.floor(index/5) * 1050);
				var focusPosition = 70 + 210 * index + pageOffset;
				var zzimPosition = 70 + 210 * index + pageOffset + 85 + _parent.mainMenu[index].focWidth/2 + 10;
				var mainPosition = pageOffset;
				var barPosition = index < 5 ? 70 : 0;

				
				_comp._menu._focus.setStyle({x:focusPosition});
				_comp._menu._focus._l.setStyle({x: 86 - _parent.mainMenu[index].focWidth/2 - 10});
				_comp._menu._focus._m.setStyle({x: 86 - _parent.mainMenu[index].focWidth/2, width:_parent.mainMenu[index].focWidth + "px"});
				_comp._menu._focus._r.setStyle({x: 86 + _parent.mainMenu[index].focWidth/2});
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
				_parent._comp_area.setStyle({opacity:0.8});
				
				if(!isFirst && depth == 0){
					sIndex = 0;
					
					if(_comp._menu && _comp._menu._sub){
						_comp._menu._sub.setStyle({display:"none"});
					}
					
					clearTimeout(keyTimeout);
					keyTimeout = setTimeout(function(){
						keyTimeout = undefined;
						if((!isClearPin && _parent.mainMenu[index] && (_parent.mainMenu[index].isAdultOnly || (W.StbConfig.adultMenuUse && _parent.mainMenu[index].isAdult)))){
							createComp(1, _parent.mainMenu[index], true);
						}else{
							if(_parent.mainMenu[index].isLeaf){
								createComp(1, _parent.mainMenu[index]);
							}else{
								makeSubMenu();
							}
						}
					}, W.Config.KEY_TIMEOUT_TIME);
				}
			}else if(depth == 1){
				W.log.info("sIndex =========== " + sIndex);

				var pageOffset = -(Math.floor(sIndex/6) * 1140);

				if(!_parent.mainMenu[index].children[sIndex].focWidth){
					_parent.mainMenu[index].children[sIndex].focWidth = _comp._menu._subMenus[sIndex]._txt.comp.offsetWidth;
				}
				
				_comp._menu._focus.setStyle({x:58 + 190 * sIndex + pageOffset});
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
					_comp._menu._zzim.setStyle({display:"", x:60 + 190 * sIndex + pageOffset + 85 + _parent.mainMenu[index].children[sIndex].focWidth/2 + 10});
				}else{
					_comp._menu._zzim.setStyle({display:"none"});
				}
				_comp._menu._sub.setStyle({x:pageOffset});
				_comp._menu._bar.setStyle({x:sIndex < 6 ? 50 : 0});
				
				_parent._comp_area.setStyle({opacity:1});
				
				if(!isFirst){
					clearTimeout(keyTimeout);
					keyTimeout = setTimeout(function(){
						keyTimeout = undefined;
						createComp(1, _parent.mainMenu[index].children[sIndex]);
					}, W.Config.KEY_TIMEOUT_TIME);
				}
				W.categoryNotice.show(_parent.mainMenu[index]);
			}
			oldDepth = depth;
		};
		
		var unFocus = function(currState){
			W.log.info("unFocus !!!!! currState == " + currState);
			for(var i=0; i < _parent.mainMenu.length; i++){
				if(i != index){
					_comp._menu._mainMenus[i]._txt.setStyle({textColor:"rgba(205,205,205,0.5)"});
				}
			}
			if(!_parent.mainMenu[index].isLeaf && _parent.mainMenu[index].children){
				for(var i=0; i < _parent.mainMenu[index].children.length; i++){
					if(_comp._menu._subMenus){
						_comp._menu._subMenus[i]._txt.setStyle({textColor:"rgba(161,161,161,0.5)"});
					}
				}
			}
			_comp._menu._focus.setStyle({display: "none"});
		};
		
		function focusMain(){
			W.log.info("focusMain !!!!!");
			_parent._comp_area.setStyle({opacity:0.8});
			_comp._menu._bar.setStyle({x:50, width:(1280*Math.ceil(_parent.mainMenu.length/7)) + "px"});
			_comp._menu.setY(270);
			_comp._menu._main.setStyle({display:""});
			_comp._menu._sub.setY(-2);
			
			if(!_parent.mainMenu[index].isLeaf){
				for(var i=0; i < _parent.mainMenu[index].children.length; i++){
					_comp._menu._subMenus[i].setStyle({x:160 + 160 * i, y:519-440, width:"160px", height:"22px"});
					_comp._menu._subMenus[i]._txt.setStyle({display:""});
				}
				_comp._menu._subMenus[sIndex]._foc.setStyle({display:"none"});
				TitleComp.changeMode(0.8);
			}else{
				TitleComp.changeMode(1);
			}
			depth = 0;
			focus(true);
		};
		
		function focusSub(){
			W.log.info("focusSub !!!!!");
			_comp._menu._main.setStyle({display:"none"});
			_comp._menu._sub.setY(-75);
			for(var i=0; i < _parent.mainMenu[index].children.length; i++){
				_comp._menu._subMenus[i].setStyle({x:50 + 190 * i, y:519-440, width:"190px", height:"22px"});
				_comp._menu._subMenus[i]._txt.setStyle({"font-size":"20px", textColor:"rgba(205,205,205,0.84)"});
			}
			depth = 1;
			focus(true);
			TitleComp.changeMode(1, _parent.mainMenu[index].title);
		};
		
		function unFocusSub(){
			_comp._menu._sub.setStyle({display:"block"});
			_comp._menu._sub.setY(-2);
			
			
			for(var i=0; i < _parent.mainMenu[index].children.length; i++){
				_comp._menu._subMenus[i].setStyle({x:160 + 160 * i, y:519-440, width:"160px", height:"22px"});
				_comp._menu._subMenus[i]._txt.setStyle({"font-size":"18px", textColor:"rgb(130,130,130)", display:"block"});
				_comp._menu._subMenus[i]._foc.setStyle({display:"none"});
			}
			depth = 0;
			focus(true);
			TitleComp.changeMode(1);
		};
		
		var hideHome = function(){
			_comp._menu.setStyle({display:"none"});
			_comp._top.setStyle({display:""});
		};
		
		this.init = function(parent, _div, _couponInfo){
			_parent = parent;
			_parentDiv = _div;
			couponInfo = _couponInfo;
			_this = this;
			_this.couponInfo = couponInfo;
			depth = 0;

			for(var i = 0; i <_parent.mainMenu.length; i++) {
				if(_parent.mainMenu[i].categoryCode == "CC0103") {
					_parent.mainMenu[i].isLeaf = false;
					_parent.mainMenu[i].children = [
						{title:W.Texts["zzim_list"] + " 1", listId:0, baseId :"29", categoryCode:"CC0103", isLeaf : true},
						{title:W.Texts["zzim_list"] + " 2", listId:1, baseId :"29", categoryCode:"CC0103", isLeaf : true},
						{title:W.Texts["zzim_list"] + " 3", listId:2, baseId :"29", categoryCode:"CC0103", isLeaf : true},
						{title:W.Texts["zzim_list"] + " 4", listId:3, baseId :"29", categoryCode:"CC0103", isLeaf : true},
						{title:W.Texts["zzim_list"] + " 5", listId:4, baseId :"29", categoryCode:"CC0103", isLeaf : true}
					];
					break;
				}
			}
			return create();
		},
		this.getTotalPath = function(includeSub){
			var titles = JSON.parse(JSON.stringify(TitleComp.getTitles()));
			if(includeSub) {
				titles.push(_parent.mainMenu[index].title);
			}
			var path = "";
			if(titles.length == 1){
				path = titles[0];
			}else{
				for(var i=0; i < titles.length; i++){
					if(i == titles.length - 1){
						path += "> " + titles[i]
					}else if(i == 0){
						path += titles[i] + " ";
					}else{
						path += "> " + titles[i] + " "
					}
				}
			}

			return path;
		};
		this.getComp = function(){
			return _comp;
		};
		this.clearAdult = function(){
			if(depth == 0){
				//if(!isCheckedPurchasePin && _parent.mainMenu[index].categoryCode == "CC0106"||
				//	(!isCheckedPurchasePin && _parent.mainMenu[index].categoryCode == "CC0102")){
				//	isCheckedPurchasePin = true;
				//}else{
					_parent.mainMenu[index].isAdult = false;
				//}
			}else if(depth == 1 && _parent.mainMenu[index].children[sIndex].isAdult){
				_parent.mainMenu[index].children[sIndex].isAdult = false;
				createComp(1, _parent.mainMenu[index].children[sIndex]);
			}
			isClearPin = true;
			focus();
			isPinCheck = false;

			_this.pinCheckProcessTimeout = setTimeout(function(){
				_this.pinCheckProcessTimeout = undefined;
				_this.operate({keyCode:W.KEY.DOWN});
			}, 1000);
		};
		this.focus = function(isFirst){
			focus(isFirst);
		};
		this.currIdx = function(){
			return index;
		};
		this.unFocus = function(currState){
			unFocus(currState);
		};
		this.destroy = function() {
			index = 0;
			sIndex = 0;
			depth = 0;
			oldDepth = 0;
			keyTimeout = undefined;
			oldIndex = 0;
			oldSIndex = 0;
			isPinCheck = false;
			isClearPin = false;
			isCheckedPurchasePin = false;
		};
		this.show = function(){
			_comp._menu.setStyle({display:""});
			
			if(!_parent.mainMenu[index].isLeaf){
				TitleComp.changeMode(-1);
			}

			if(depth == 1) {
				if(_parent.mainMenu[index].categoryCode == "CC0101" ||
					_parent.mainMenu[index].categoryCode == "CC0104" ||
					_parent.mainMenu[index].categoryCode == "CC0112" ||
					_parent.mainMenu[index].categoryCode == "CC0113"){
					couponInfo.hideButton();
				}else{
					couponInfo.showButton();
				}
			}
		};
		this.hide = function(){
			if(!_parent.mainMenu[index].isLeaf){
				_comp._menu.setStyle({display:"none"});
				TitleComp.changeMode(-1, _parent.mainMenu[index].children[sIndex].title);
			}
		};
		this.changeMode = function(mode){
			TitleComp.changeMode(mode);
		};
		this.showAll = function(isBack){
			if(isBack){
				_parent.state = 0;
			}
			_comp._menu.setStyle({display:""});
			depth = 0;
			focusMain();
		};
		this.changeFocColor = function(txtColor){
			_comp._menu._mainMenus[index]._foc.setStyle({textColor:txtColor});
		};
		this.hasData = function(){
			W.log.info("parent.mainMenu.length == " + _parent.mainMenu.length);
			return _parent.mainMenu[index].children && _parent.mainMenu[index].children.length > 0 ? true : false;
		};
		this.getDepth = function(){
			return depth;
		};
		this.operate = function(event){
			W.log.info(" onKeyPressed " + event.keyCode + " ,, state : " + _parent.state);
			W.categoryNotice.hide();

			if(_this.pinCheckProcessTimeout){
				return true;
			}
			
			if(isPinCheck){
				var isConsume = _parent.components[1].operate(event);
				if(isConsume){
					return true;
				}
			}
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.RIGHT:
				if(depth == 0){
					oldIndex = index;
					index = (++index) % _parent.mainMenu.length;
					isClearPin = false;
					isCheckedPurchasePin = false;
				}else if(depth == 1){
					oldSIndex = sIndex;
					sIndex = (++sIndex) % _parent.mainMenu[index].children.length;
				}
				focus();
				isConsume = true;
				isPinCheck = false;
				break;
			case W.KEY.LEFT:
				if(depth == 0){
					oldIndex = index;
					index = (--index + _parent.mainMenu.length) % _parent.mainMenu.length;
					isClearPin = false;
					isCheckedPurchasePin = false;
				}else if(depth == 1){
					oldSIndex = sIndex;
					sIndex = (--sIndex + _parent.mainMenu[index].children.length) % _parent.mainMenu[index].children.length;
				}
				focus();
				isConsume = true;
				isPinCheck = false;
				break;
			case W.KEY.UP:
				if(isPinCheck){
					_parent.components[1].unFocus();
					focus(true);
					isPinCheck = false;
				}else{
					if(depth == 1){
						focusMain();
					}
				}
				isConsume = true;
				break;
			case W.KEY.ENTER:
			case W.KEY.DOWN:
				if(keyTimeout) return true;
				if(depth == 0){//if(!isCheckedPurchasePin && _parent.mainMenu[index].categoryCode == "CC0106"){
					if(_parent.components[1].name && _parent.components[1].name == "pinCheckComp"){
						_parent.components[1].focus();
						unFocus();
						isConsume = true;
						isPinCheck = true;
					}else{
						if(_parent.mainMenu[index].link){
							W.LinkManager.action("L", _parent.mainMenu[index].link);
							isConsume = true;
						}else if(_parent.mainMenu[index].linkImg){
							W.log.info("Main Link Menu !!!! ");
							isConsume = true;
						}else{
							if(_parent.mainMenu[index].isLeaf){
								W.log.info(_parent.components[1]);
								W.log.info(_parent.components[1].hasList);
								W.log.info(_parent.components[1].hasList());
								if(_parent.components[1].hasList()){
									hideHome();
									_parent.state = 1;
									_parent.changeBgColor(true);
									TitleComp.changeMode(2, _parent.mainMenu[index].title);

									if(_parent.mainMenu[index].categoryCode == "CC0101" ||
										_parent.mainMenu[index].categoryCode == "CC0104" ||
										_parent.mainMenu[index].categoryCode == "CC0112" ||
										_parent.mainMenu[index].categoryCode == "CC0113"){
										couponInfo.hideButton();
									}else{
										couponInfo.showButton();
									}
								}else{
									isConsume = true;
								}
							}else{
								focusSub();
								isConsume = true;
							}
						}
					}
				}else if(depth == 1){
					if(_parent.components[1].hasList()){
						if(_parent.mainMenu[index].children[sIndex].categoryCode == "CC0110" ||
							_parent.mainMenu[index].children[sIndex].categoryCode == "CC0111"){
							couponInfo.hideButton();
						}
						_parent.changeBgColor(true);
						isConsume = false;
					}else{
						isConsume = true;
					}
				}
				break;
			case W.KEY.COLOR_KEY_Y:
				if(_parent.mainMenu[index].categoryCode != "CC0104" && W.StbConfig.cugType != "accommodation"){
					var currCategory = _parent.mainMenu[index];
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
				break;
			case W.KEY.BACK:
				if(isPinCheck){
					_parent.components[1].unFocus();
					focus(true);
					isPinCheck = false;
					isConsume = true;
				}else{
					if(depth == 1){
						focusMain();//unFocusSub();
						isConsume = true;
					}
				}
				break;
			}

			return isConsume;
		};
		this.onPopupOpened = function(popup, desc) {
		};
		this.onPopupClosed = function(popup, desc) {
			if (desc) {
				if (desc.popupName == "popup/sideOption/VodSideOptionPopup") {
					if (desc.action == W.PopupManager.ACTION_OK) {
						W.log.info(desc);
						if (desc.param.option == 0) {
							if (desc.param.subOptions == 0) {
								var reqData = {targetId: desc.param2.categoryId};
								var favoriteFunction;
								if (desc.param2.isPinned) {
									favoriteFunction = _parent.sdpManager.removeViewingFavorite;
								} else {
									favoriteFunction = _parent.sdpManager.addViewingFavorite;
								}
								favoriteFunction(function (result, data, param) {
									W.log.info(data);
									if (result) {
										W.PopupManager.openPopup({
												childComp: _this,
												type: "2LINE",
												popupName: "popup/FeedbackPopup",
												title: param.title,
												desc: param.isPinned ? W.Texts["bookmark_msg_removed"] : W.Texts["bookmark_msg_added"]
											}
										);
										param.isPinned = !param.isPinned;
										focus(true);
									} else {
										W.PopupManager.openPopup({
												childComp: _this,
												popupName: "popup/ErrorPopup",
												code: data.error ? data.error.code : "999",
												message: data.error ? [data.error.detail] : null,
												from : "SDP"
											}
										);
									}
								}, reqData, desc.param2);
							}
						}
					}
				}
			}
		};
	};
	
	return {
		getNewComp: function(){
			return new MyKctv();
		}
	}
	
});