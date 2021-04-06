/**
 * scene/SiteMapScene
 *
 */
W.defineModule([ "mod/Util"],
    function(util) {
		var timeInterval;
        var _thisScene = "SiteMapScene";
        var _comp;
        var _this;
        var index = 0;
        var yIndex = 0;
        var sdpManager;
        var isClearPin = false;
        var isAddedEntryPath = false;
        W.log.info("### Initializing " + _thisScene + " scene ###");
        
        function getSdpManager(){
        	if(!sdpManager) sdpManager = W.getModule("manager/SdpDataManager");
        	return sdpManager;
        };
        
        var listItem = function(idx, menu){
        	var index = 0;
        	var _item;
        	var _menus = [];
        	var _menus_foc = [];
        	var _menus_foc_bar = [];
        	var totalPage = 0;
        	var lastYIndex = 0;

        	var cateMenu = menu;
        	if(menu.children && menu.children.length > 0 && menu.menuType != "MC0005" && menu.menuType != "MC0004"){

        	}else{
        		var tmpMenu = {};
        		for(var key in menu){
					if(key == "children" || key == "title"){
						
					}else{
						tmpMenu[key] = menu[key];
					}
				}
        		tmpMenu.title = W.Texts["going"];
        		cateMenu.tmpChildren = [tmpMenu];
        	}
        	
        	var children = cateMenu.children;
    		if(cateMenu.tmpChildren){
    			children = cateMenu.tmpChildren;
    		}
        	
        	var setList = function(){
        		var _area = new W.Div({x:0, y:87, width:284, height:"404px", overflow:"hidden"});
        		_item.add(_area);
        		_item._list = new W.Div({x:0, y:0, width:284, height:"404px"});
        		_area.add(_item._list);
        		
        		
        		
        		totalPage = Math.floor(children.length/7);
        		for(var i=0; i < children.length; i++){
        			var title = children[i].title;
        			if(title.length > 8){
        				title = title.substr(0,8) + "...";
        			}
        			_menus[i] = new W.Div({x:0, y:58*i + 5, width:284, height:"25px", textAlign:"center"});
        			if(children.length == 1){
        				_menus[i]._txt = new W.Span({position:"relative", y:0, height:"25px", textColor:"rgba(226,225,225,0.4)", "font-size":"22px", 
            				className:"font_rixhead_medium cut", text:title});
            			_menus[i].add(_menus[i]._txt);
        				_menus[i]._img = new W.Image({position:"relative", y:4, height:"19px", width:"19px", src:"img/icon_shotcut_dim.png",
        					"padding-left":"8px"});
        				_menus[i].add(_menus[i]._img);
        			}else{
        				_menus[i]._txt = new W.Span({x:0, y:0, width:284, height:"25px", textColor:"rgba(226,225,225,0.4)", "font-size":"22px", 
            				className:"font_rixhead_medium cut", text:title, textAlign:"center"});
            			_menus[i].add(_menus[i]._txt);
        			}
        			

        			_item._list.add(_menus[i]);
        			
        			_menus_foc[i] = new W.Div({x:0, y:58*i, width:284, height:"40px", textAlign:"center", opacity:0});
        			_item._list.add(_menus_foc[i]);
        			
        			_menus_foc[i]._txt = new W.Span({position:"relative", y:0, height:"30px", textColor:"rgb(240,240,240)", "font-size":"28px", 
        				className:"font_rixhead_medium cut", text:title});
        			_menus_foc[i].add(_menus_foc[i]._txt);
        			if(children.length == 1){
        				_menus_foc[i]._img = new W.Image({position:"relative", y:4, height:"25px", width:"25px", src:"img/icon_shotcut_foc.png",
        					"padding-left":"8px"});
        				_menus_foc[i].add(_menus_foc[i]._img);
        			}

        			_menus_foc_bar[i] = new W.Div({x:0, y:58*i+37, width:"0px", height:"6px", backgroundColor:"rgb(229,48,0)",
        				"border-radius": "3px", opacity:0});
        			_item._list.add(_menus_foc_bar[i]);
        		}
        	};
        	
        	this.count = function(){
        		return children.length;
        	};
        	
        	this.getComp = function(){
        		index = 0;
        		_item = new W.Div({x:idx * 284, y:0, width:284, height:522});
        		return _item;
        	};
        	
        	this.create = function(){
        		_item._title_dim = new W.Span({x:0, y:0, width:284, height:"26px", textColor:"rgba(255,255,255,0.8)", "font-size":"24px", 
    				className:"font_rixhead_light", text:cateMenu.title, textAlign:"center"});
        		_item.add(_item._title_dim);
        		_item._title_foc = new W.Span({x:0, y:0, width:284, height:"26px", textColor:"rgb(255,255,255)", "font-size":"24px", 
    				className:"font_rixhead_bold", text:cateMenu.title, textAlign:"center", display:"none"});
        		_item.add(_item._title_foc);
        		
        		_item._arr_u = new W.Image({x:132, y:56, width:"21px", height:"11px", src:"img/arw_full_u.png", display:"none"});
        		_item.add(_item._arr_u);
        		
        		_item._arr_d = new W.Image({x:132, y:497, width:"21px", height:"11px", src:"img/arw_full_d.png", display:"none"});
        		_item.add(_item._arr_d);
        		
        		setList();
        	};
        	
        	this.focus = function(isChange){
        		if(isChange){
        			yIndex = lastYIndex;
    				_item._title_dim.setStyle({display:"none"});
        			_item._title_foc.setStyle({display:"block"});
        			for(var i=0; i < children.length; i++){
        				_menus[i].setStyle({y:58*i + 5, className:"font_rixhead_light", textColor:"rgba(195,195,195,0.8)", "font-size":"24px"});
            		}
        			if(_menus.length > 7){
        				_item._arr_u.setStyle({display:"none"});
        				_item._arr_d.setStyle({display:"block"});
        			}
        		}
        		if(!_menus_foc[yIndex].offsetWidth){
    				_menus_foc[yIndex].offsetWidth = _menus_foc[yIndex]._txt.comp.offsetWidth + 20;
    				W.log.info("_menus_foc[yIndex].offsetWidth == " + _menus_foc[yIndex].offsetWidth);
    				if(children.length == 1){
    					if(_menus_foc[yIndex].offsetWidth > 284-33){
        					_menus_foc[yIndex].offsetWidth = 284;
        					_menus_foc[yIndex]._txt.setStyle({position:"absolute", x:0, width:284-33});
        					_menus_foc[yIndex]._img.setStyle({position:"absolute", x:284-33-10});
            				W.log.info("_menus_foc[yIndex].offsetWidth == " + _menus_foc[yIndex].offsetWidth);
        				}else{
        					_menus_foc[yIndex].offsetWidth += 33;
        					_menus_foc[yIndex]._txt.setStyle({width:284-33});
            				W.log.info("_menus_foc[yIndex].offsetWidth == " + _menus_foc[yIndex].offsetWidth);
        				}
        				
        				_menus_foc_bar[yIndex].setStyle({x:(284 - _menus_foc[yIndex].offsetWidth)/2, width:_menus_foc[yIndex].offsetWidth + "px"});
        			}else{
        				if(_menus_foc[yIndex].offsetWidth > 284){
        					_menus_foc[yIndex].offsetWidth = 284;
        					_menus_foc[yIndex]._txt.setStyle({position:"absolute", x:0, width:"220px"});
            				W.log.info("_menus_foc[yIndex].offsetWidth == " + _menus_foc[yIndex].offsetWidth);
        				}
        				if(children.length == 1){
        					_menus_foc[yIndex].offsetWidth += 33;
            			}
        				_menus_foc_bar[yIndex].setStyle({x:(284 - _menus_foc[yIndex].offsetWidth)/2, width:_menus_foc[yIndex].offsetWidth + "px"});
        			}
    			}

        		_menus_foc[yIndex].setStyle({opacity:1});
        		_menus_foc_bar[yIndex].setStyle({opacity:1});
        		_menus[yIndex].setStyle({display:"none"});
        		
        		var page = Math.floor(yIndex/7);
        		_item._list.setStyle({y:-page*406});
        		if(_menus.length > 7){
	        		if(page == 0){
	        			_item._arr_u.setStyle({display:"none"});
	        			_item._arr_d.setStyle({display:"block"});
	        		}else if(page == totalPage){
	        			_item._arr_u.setStyle({display:"block"});
	        			_item._arr_d.setStyle({display:"none"});
	        		}else{
	        			_item._arr_u.setStyle({display:"block"});
	        			_item._arr_d.setStyle({display:"block"});
	        		}
        		}
        	};
        	
        	this.unFocus = function(isChange){
        		if(isChange){
        			lastYIndex = yIndex;
        			_item._title_dim.setStyle({display:"block"});
        			_item._title_foc.setStyle({display:"none"});
        			W.log.info(children);
        			for(var i=0; i < children.length; i++){
        				_menus[i].setStyle({y:58*i+5, className:"font_rixhead_medium", textColor:"rgba(226,225,225,0.4)", "font-size":"22px"});
            		}
            		_item._arr_u.setStyle({display:"none"});
            		_item._arr_d.setStyle({display:"none"});
        		}
        		_menus_foc[yIndex].setStyle({opacity:0});
        		_menus_foc_bar[yIndex].setStyle({opacity:0});
        		_menus[yIndex].setStyle({display:"block"});
        	};
        };

        var create = function(){
        	_comp = new W.Div({x:79, y:123, width:"1136px", height:550, overflow:"hidden"});
        	_this._parentDiv.add(_comp);
        	
        	_comp._list = new W.Div({x:0, y:0, width:"1136px", height:550});
        	_comp.add(_comp._list);
        	
        	_comp.items = [];
        	for(var i=0; i < _this.mainMenu.length; i++){
        		_comp.items[i] = new listItem(i, _this.mainMenu[i]);
        		_comp._list.add(_comp.items[i].getComp());
        		_comp.items[i].create();
        	}
        	
        	_comp.items[index].focus(true);
        };
        
        function checkScene(){
        	W.log.info("menuType ------- " + _this.mainMenu[index].menuType);
        	var children = _this.mainMenu[index].children;
			if(children) W.log.info("categoryCode ------- " + _this.mainMenu[index].children[yIndex].categoryCode);
        	if(_this.mainMenu[index].tmpChildren){
        		children = _this.mainMenu[index].tmpChildren;
        	}
        	
        	if(children[yIndex].categoryCode == "CC0204"){
				gotoScene("scene/home/ProductListScene", {category:children[yIndex]});
			}else{
	        	if(_this.mainMenu[index].menuType == "MC0001"){
	        		if(children[yIndex].isLeaf){
	            		gotoScene();
	        		}else{
	        			isAddedEntryPath = true;
	        			W.entryPath.push("menu.categoryId", _this.mainMenu[index], "SiteMapScene");
	        			W.entryPath.push("menu.categoryId", children[yIndex], "SiteMapScene");
	        			gotoScene("scene/home/CategoryListScene", {category:children[yIndex]});
	        		}
	    		}else if(_this.mainMenu[index].menuType == "MC0002"){
	    			if(children[yIndex].categoryCode == "CC0205"){
	    				gotoScene("scene/home/ReservedProgramListScene", {category:children[yIndex]});
	    			}else if(children[yIndex].categoryCode.indexOf("FY") > -1){
	    				gotoScene();
	    			}else{
	    				gotoScene("scene/home/GuideScene", {category:children[yIndex]});
	    			}
	    		}else if(_this.mainMenu[index].menuType == "MC0003"){
	    			if(children[yIndex].isLeaf){
	    				isAddedEntryPath = true;
	    				W.entryPath.push("menu.categoryId", _this.mainMenu[index], "SiteMapScene");
	        			W.entryPath.push("menu.categoryId", children[yIndex], "SiteMapScene");
	        			
	    				if(children[yIndex].categoryCode.indexOf("FY") > -1){
	        				gotoScene();
	        			}else{
	        				gotoScene("scene/vod/MovieScene", {category:children[yIndex]});
	        			}
	    			}else{
	    				isAddedEntryPath = true;
	    				W.entryPath.push("menu.categoryId", _this.mainMenu[index], "SiteMapScene");
	        			W.entryPath.push("menu.categoryId", children[yIndex], "SiteMapScene");
	        			gotoScene("scene/home/CategoryListScene", {category:children[yIndex]});
	    			}
	    		}else if(_this.mainMenu[index].menuType == "MC0004"){
	    			gotoScene("scene/kids/KidsHomeScene");
	    		}else if(_this.mainMenu[index].menuType == "MC0005"){
	    			gotoScene("scene/home/ForYouScene");
	    		}else if(_this.mainMenu[index].menuType == "MC0006"){
	    			gotoScene("scene/home/AppListScene", {category:_this.mainMenu[index]});
	    		}else if(_this.mainMenu[index].menuType == "MC0007"){
	    			gotoScene("scene/home/AppListScene", {category:_this.mainMenu[index]});
	    		}else if(_this.mainMenu[index].menuType == "MC0008"){
	    			gotoScene("scene/search/SearchScene");
	    		}else if(_this.mainMenu[index].menuType == "MC0009"){
	    			var uimDataManager = W.getModule("manager/UiPlfDataManager");
					uimDataManager.getPromotionList(function(result, data){
						if(result){
							W.LinkManager.action("L", data.custom.link, undefined, "link", "SiteMapScene");
						}
					}, {targetId:_this.mainMenu[index].baseId, offset:0, limit:1});
	    		}else if(_this.mainMenu[index].menuType == "MC0010"){
	    			if(W.state.isVod && (children[yIndex].categoryCode == "CC1019" || children[yIndex].categoryCode == "CC1027")){
						W.PopupManager.openPopup({
                            title:W.Texts["popup_zzim_info_title"],
                            popupName:"popup/AlertPopup",
                            boldText:W.Texts["vod_alert_msg"],
                            thinText:W.Texts["vod_alert_msg2"]}
                        );
					}else if(children[yIndex].categoryCode == "CC1030"){
						W.CloudManager.openAndroidSetting();
					}else{
						gotoScene("scene/setting/SettingScene", {targetId : children[yIndex].categoryCode});
					}
	    		}else{
	    			if(children[yIndex].isLeaf){
	    				if(children[yIndex].isLink){
	    					W.LinkManager.action("L", children[yIndex].link, undefined, "link", "SiteMapScene");
	    				}else{
	    					isAddedEntryPath = true;
	    					W.entryPath.push("menu.categoryId", _this.mainMenu[index], "SiteMapScene");
	            			W.entryPath.push("menu.categoryId", children[yIndex], "SiteMapScene");
	        				gotoScene("scene/vod/MovieScene", {category:children[yIndex]});
	    				}
	    			}else{
	    				isAddedEntryPath = true;
	    				W.entryPath.push("menu.categoryId", _this.mainMenu[index], "SiteMapScene");
	        			W.entryPath.push("menu.categoryId", children[yIndex], "SiteMapScene");
	        			gotoScene("scene/home/CategoryListScene", {category:children[yIndex]});
	    			}
	    		}
			}
        };
        
        function gotoScene(sceneName, param){
        	W.log.info(_this.mainMenu[index]);
        	var children = _this.mainMenu[index].children;
        	if(_this.mainMenu[index].originChildren){
        		children = _this.mainMenu[index].tmpChildren;
        	}
        	if(children) W.log.info(children[yIndex]);
        	if(children && children[yIndex] && children[yIndex].isLink){
        		if(children[yIndex].custom){
        			W.LinkManager.action("L", children[yIndex].custom.link, undefined, "link", "SiteMapScene");
        		}else{
        			W.LinkManager.action("L", children[yIndex].link, undefined, "link", "SiteMapScene");
        		}
        	}else{
        		if(!param) param = {};
            	
            	if(!sceneName){
            		switch(children[yIndex].categoryCode){
                	case "CC0101":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/NoticeScene";
                		break;
                	case "CC0102":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/WatchedListScene";
                		break;
                	case "CC0103":
                		param.category = children[yIndex];
                		sceneName = "scene/home/CategoryListScene";
                		break;
                	case "CC0104":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/BookmarkScene";
                		break;
                	case "CC0105":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/LifeTimeVodScene";
                		break;
                	case "CC0106":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/PurchaseHistoryScene";
                		break;
                	case "CC0112":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/CouponScene";
                		break;
                	case "CC0113":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/CoinScene";
                		break;
                	case "CC0114":
                		param.title = children[yIndex].title;
                		sceneName = "scene/my/ChargeCoinScene";
                		break;
                	case "CC0401":
                		sceneName = "scene/kids/KidsListScene";
                		param = {category:children[yIndex]};
                		break;
                	case "FY0001":
                		sceneName = "scene/channel/ScheduleForyouScene";
                		param = {category:children[yIndex]};
                		break;
                	case "FY0002":
                	case "FY0003":
                	case "FY0004":
                		sceneName = "scene/home/MenuForYouScene";
                		param = {category:children[yIndex]};
                		break;
                	}
            	}else{
            		if(sceneName == "scene/home/ForYouScene"){
            			param = {category:_this.mainMenu[index]};
            		}else if(sceneName == "scene/kids/KidsHomeScene"){
            			param = {category:_this.mainMenu[index]};
            		}
            	}
            	
            	W.log.info("sceneName == " + sceneName);
            	W.log.info("param == " + param);
            	
            	param.isClearPin = isClearPin;
            	
            	W.SceneManager.startScene({
    				sceneName:sceneName, 
    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
    				param:param
    			});
        	}
        };

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                index = 0;
                yIndex = 0;
                this.dataManager = W.getModule("manager/SdpDataManager");
                
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_R]);

                if(this._parentDiv){
                	this.remove(this._parentDiv);
                }
                
                this._parentDiv = new W.Div({className : "bg_size"});
                this._parentDiv._bg = new W.Div({className : "bg_size bg_color"});
                this._parentDiv.add(this._parentDiv._bg);
                this._parentDiv.add(new W.Span({x:55, y:51, width:"100px", height:"29px", textColor:"rgb(255,255,255)", 
                	"font-size":"27px", className:"font_rixhead_medium", text:W.Texts["scene_sitemap_title"]}));
                this._parentDiv.add(new W.Div({x:0, y:157, width:"1280px", height:"1px", className:"line_1px"}));
                this._arr_l = new W.Image({x:54, y:340, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
                this._arr_r = new W.Image({x:1185, y:340, width:"41px", height:"41px", src:"img/arrow_navi_r.png", display:"block"});
                this._parentDiv.add(this._arr_l);
                this._parentDiv.add(this._arr_r);
                
                this._time = new W.Span({x:1078, y:55, width:"150px", height:"17px", textAlign:"right", textColor:"rgba(255,255,255,0.5)", 
                	"font-size":"17px", className:"font_rixhead_medium", text:""});
                this._parentDiv.add(this._time);
                
                this._curr_page = new W.Span({x:582, y:651, width:"50px", height:"17px", textAlign:"right", textColor:"rgb(255,255,255)", 
                	"font-size":"16px", className:"font_rixhead_medium", text:"1"});
                this._parentDiv.add(this._curr_page);
                
                this._total_page = new W.Span({x:637, y:651, width:"50px", height:"17px", textColor:"rgb(122,122,122)", 
                	"font-size":"16px", className:"font_rixhead_medium", text:"/ 0"});
                this._parentDiv.add(this._total_page);
                
                this._time.setText(util.getCurrentDateTime("kor"));
                timeInterval = setInterval(function(){
                	_this._time.setText(util.getCurrentDateTime("kor"));
                }, 10 * 1000);
        		
                this.add(this._parentDiv);
                
                _this.mainMenu = [];
                for(var i=0; i < param.category.length; i++){
                	if(param.category[i]){
                		_this.mainMenu.push(param.category[i]);
                	}
                }
                _this.totalPage = Math.ceil(_this.mainMenu.length/4);
				_this._total_page.setText("/ " + _this.totalPage);
				
				create();
            },
            onPause: function() {

            },
            onResume: function() {
            	if(isAddedEntryPath){
            		W.entryPath.pop();
            		W.entryPath.pop();
            		isAddedEntryPath = false;
            	}
            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");
                clearInterval(timeInterval);
            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
                switch (event.keyCode) {
        		case W.KEY.BACK:
        			this.backScene();
        			break;
                case W.KEY.RIGHT:
                	_comp.items[index].unFocus(true);
                	index = (++index) % _this.mainMenu.length;
                	_comp.items[index].focus(true);
                	var page = Math.floor(index/4);
                	_this._curr_page.setText(page+1);
                	_comp._list.setStyle({x:-page*1136});
                	
                	if(page == 0){
                		_this._arr_l.setStyle({display:"none"});
                		_this._arr_r.setStyle({display:"block"});
                	}else if(page == _this.totalPage-1){
                		_this._arr_l.setStyle({display:"block"});
                		_this._arr_r.setStyle({display:"none"});
                	}else{
                		_this._arr_l.setStyle({display:"block"});
                		_this._arr_r.setStyle({display:"block"});
                	}
                    break;
                case W.KEY.LEFT:
                	_comp.items[index].unFocus(true);
                	index = (--index + _this.mainMenu.length) % _this.mainMenu.length;
                	_comp.items[index].focus(true);
                	var page = Math.floor(index/4);
                	_this._curr_page.setText(page+1);
                	_comp._list.setStyle({x:-page*1136});
                	
                	if(page == 0){
                		_this._arr_l.setStyle({display:"none"});
                		_this._arr_r.setStyle({display:"block"});
                	}else if(page == _this.totalPage-1){
                		_this._arr_l.setStyle({display:"block"});
                		_this._arr_r.setStyle({display:"none"});
                	}else{
                		_this._arr_l.setStyle({display:"block"});
                		_this._arr_r.setStyle({display:"block"});
                	}
                    break;
                case W.KEY.UP:
                	_comp.items[index].unFocus();
            		yIndex = (--yIndex + _comp.items[index].count()) % _comp.items[index].count();
                	_comp.items[index].focus();
                    break;
                case W.KEY.DOWN:
                	_comp.items[index].unFocus();
                	yIndex = (++yIndex) % _comp.items[index].count();
                	_comp.items[index].focus();
                    break;
                case W.KEY.ENTER:
                	W.log.info(_this.mainMenu[index]);
                	if(!isClearPin && 
                			(_this.mainMenu[index].isAdultOnly || 
                			(_this.mainMenu[index].children && _this.mainMenu[index].children[yIndex].isAdultOnly)/* ||
                			_this.mainMenu[index].children[yIndex].categoryCode == "CC0106" ||
							_this.mainMenu[index].children[yIndex].categoryCode == "CC0102"*/)){
                		var popup = {
            				popupName:"popup/AdultCheckPopup"
            			};
        	    		W.PopupManager.openPopup(popup);
                	}else{
                		checkScene();
                	}
                	break;
        		}
            },
            onPopupClosed : function(popup, desc) {
            	if (desc) {
            		if (desc.popupName == "popup/AdultCheckPopup") {
            			if (desc.action == W.PopupManager.ACTION_OK) {
            				isClearPin = true;
            				checkScene();
            			}
        			}
    			}
            }
        });
    });
