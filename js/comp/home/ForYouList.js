W.defineModule("comp/home/ForYouList", ["mod/Util", "comp/Button"], function(util, buttonComp) {
	function FouYouList(){
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");
	    var recoDataManager = W.getModule("manager/RecommendDataManager");
	    var uiplfDataManager = W.getModule("manager/UiPlfDataManager");
	    
	    
	    var callbackCount = 0;
	    var backCallbackFunc;
	    var mode = 0;
	    var tops = [489, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
        var isAddedEntryPath = false;

	    var index = 0;
	    var _comp;
	    var list;
	    
	    var templetes = [
	        {title:"좋아할 만한 배우가", title2:"출연한 VOD", info:"고객님께 추천하는 출연자 Best VOD", panelImg:"img/bg_foryou_sample01.png",
	        	positions : [{x:284, y:207, w:68, h:96}, {x:182, y:332, w:76, h:109}, {x:35, y:394, w:98, h:140}, {x:82, y:489, w:108, h:156}, {x:229, y:363, w:123, h:177}]
	        },
	        {title:"고객님이 좋아하는", title2:"장르 추천 VOD", info:"고객님의 취향 저격 Best VOD", panelImg:"img/bg_foryou_sample02.png",
	        	positions : [{x:35, y:490, w:68, h:96}, {x:276, y:230, w:76, h:109}, {x:224, y:502, w:98, h:140}, {x:76, y:384, w:108, h:156}, {x:212, y:302, w:123, h:177}]
	        },
	        {title:"최근 본 콘텐츠와", title2:"비슷한 VOD", info:"최근 시청한 VOD와 비슷한 VOD", panelImg:"img/bg_foryou_sample03.png",
	        	positions : [{x:285, y:154, w:68, h:96}, {x:141, y:369, w:76, h:109}, {x:223, y:505, w:98, h:140}, {x:245, y:282, w:108, h:156}, {x:34, y:405, w:123, h:177}]
	        },
	        {title:"지금 뜨고 있는", title2:"추천 VOD", info:"오늘 고객님께 사랑받는 VOD", panelImg:"img/bg_foryou_sample04.png",
	        	positions : [{x:284, y:207, w:68, h:96}, {x:182, y:332, w:76, h:109}, {x:35, y:394, w:98, h:140}, {x:82, y:489, w:108, h:156}, {x:229, y:363, w:123, h:177}]
	        },
	        {title:"이런 영화", title2:"어때요?", info:"최근 HOT한 VOD를 추천 드려요!", panelImg:"img/bg_foryou_sample05.png",
	        	positions : [{x:35, y:490, w:68, h:96}, {x:276, y:230, w:76, h:109}, {x:224, y:502, w:98, h:140}, {x:76, y:384, w:108, h:156}, {x:212, y:302, w:123, h:177}]
	        },
	        {title:"이번달만", title2:"무료", info:"이번달만 무료인 VOD를 즐겨보아요", panelImg:"img/bg_foryou_sample06.png",
	        	positions : [{x:285, y:154, w:68, h:96}, {x:141, y:369, w:76, h:109}, {x:223, y:505, w:98, h:140}, {x:245, y:282, w:108, h:156}, {x:34, y:405, w:123, h:177}]
	        }
	    ];

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	    };
	    
	    var Panel = function(xPos, data, idx){
	    	var _panel;
	    	var dimOpacity = [0.85, 0.8, 0.7, 0.6, 0.5];
	    	var focOpacity = [0.6, 0.5, 0.4, 0.3, 0.2];
	    	var focImg;
	    	var unfocImg;
	    	var focBg;
	    	var unfocBg;

	    	this.getComp = function(){
	    		if(!_panel){
	    			if(data.images){
	    				for(var i=0; i < data.images.length; i++){
	    					if(data.images[i].type == "101"){
	    						unfocImg = W.Config.IMAGE_URL + data.images[i].url;
	    					}else if(data.images[i].type == "102"){
	    						focBg = W.Config.IMAGE_URL + data.images[i].url;
	    					}else if(data.images[i].type == "103"){
	    						unfocBg = W.Config.IMAGE_URL + data.images[i].url;
	    					}else if(data.images[i].type == "104"){
	    						focImg = W.Config.IMAGE_URL + data.images[i].url;
	    					}
	    				}
	    			}

	    			_panel = new W.Div({x:xPos, y:0, width:idx == 0 || idx == 5 ? "410px" : "387px", height:"720px"}); 
	    			
	    			if(unfocBg){
	    				_panel._unfocBg = new W.Image({x:0, y:0, width:idx == 0 || idx == 5 ? "410px" : "387px", height:"720px", src:unfocBg});
	    			}else{
	    				_panel._unfocBg = new W.Div({x:0, y:0, width:idx == 0 || idx == 5 ? "410px" : "387px", height:"720px"});
	    			}
	    			_panel.add(_panel._unfocBg);
	    			
	    			if(focBg){
	    				_panel._focBg = new W.Image({x:0, y:0, width:idx == 0 || idx == 5 ? "410px" : "387px", height:"720px", src:focBg, display:"none"});
	    			}else{
	    				_panel._focBg = new W.Div({x:0, y:0, width:idx == 0 || idx == 5 ? "410px" : "387px", height:"720px", backgroundColor:"rgba(57,67,87,0.5)", display:"none"});
	    			}
	    			_panel.add(_panel._focBg);
	    			
	    			if(unfocImg){
		    			_panel._unFocImg = new W.Image({x:(idx == 0 ? 23 : 0) + 42, y:67, width:"312px", height:"233px", src : unfocImg, opacity:0.6, display:mode == 2 ? "none" : "block"});
	    			}else{
		    			_panel._unFocImg = new W.Div({x:(idx == 0 ? 23 : 0) + 42, y:67, width:"312px", height:"233px", display:mode == 2 ? "none" : "block"});
	    			}
    				_panel.add(_panel._unFocImg);
	    			
	    			_panel._poster_area = new W.Div({x:idx == 0 ? 23 : 0, y:(idx % 3 == 2 ? -36 : -86), width:"387px", height:"720px", opacity:0.35, display:mode == 2 ? "block" : "none"}); 
	    			_panel.add(_panel._poster_area);

	    			_panel.btn = buttonComp.create(34 + (idx == 0 ? 23 : 0), 160, W.Texts["watch_more"], 133.5, true);
	    			_panel.add(_panel.btn.getComp());
	    			
	    			_panel._title1 = new W.Span({x:33 + (idx == 0 ? 23 : 0), y:75, height:"64px", width:"250px", textColor:"rgba(136,129,126,0.9)", 
	    				"font-size":"28px", className:"font_rixhead_bold", "word-break":"keep-all", text:data.title});
	    			_panel.add(_panel._title1);
	    			
	    			if(focImg){
		    			_panel._focImg = new W.Image({zIndex:10, x:(idx == 0 ? 23 : 0)-30, y:393, width:"446px", height:"327px", src : focImg, display:"none"});
	    			}else{
		    			_panel._focImg = new W.Div({zIndex:10, x:(idx == 0 ? 23 : 0)-30, y:393, width:"446px", height:"327px", display:"none"});
	    			}
    				_panel.add(_panel._focImg);
	    		}
	    		return _panel;
	    	};
	    	
	    	this.setData = function(data){
	    		var vodList;
    			if(data.categoryCode == "CC0501" || data.categoryCode == "CC0502" || data.categoryCode == "CC0504"){
    				vodList = data.resultList[0].vodList;
    			}else if(data.categoryCode == "CC0503" || data.categoryCode == "CC0506" || data.categoryCode == "CC0505"){
    				vodList = data.resultList;
    			}
    			
    			if(!vodList || vodList.length == 0){
    				return;
    			}
    			
    			var bgIdx = 4;
    			if(vodList.length < 5){
    				bgIdx = vodList.length-1;
    			}
  
    			_panel._posters = [];

    			var startIdx = 4;
    			if(vodList.length < 5){
    				startIdx = vodList.length-1;
    			}

    			var no = 0;
    			for(var i=startIdx; i > -1; i--){
    				var posterUrl;
    				if(data.categoryCode == "CC0505"){
    					posterUrl = vodList[i].smallImage;
	    			}else{
	    				posterUrl = util.getPosterFilePath(vodList[i].posterBaseUrl, templetes[idx].positions[no].w);
	    			}

    				_panel._posters[no] = new W.Div({x:templetes[idx].positions[no].x, y:templetes[idx].positions[no].y,
    					width:templetes[idx].positions[no].w + "px", height:templetes[idx].positions[no].h + "px"});
    				_panel._poster_area.add(_panel._posters[no]);
    				
    				_panel._posters[no]._img = new W.Image({x:0, y:0, src:posterUrl,
    					width:templetes[idx].positions[no].w + "px", height:templetes[idx].positions[no].h + "px"});
    				_panel._posters[no].add(_panel._posters[no]._img);
    				
    				_panel._posters[no]._dim = new W.Div({x:0, y:0, opacity:dimOpacity[no], backgroundColor : "rgb(0,0,0)",
    					width:templetes[idx].positions[no].w + "px", height:templetes[idx].positions[no].h + "px", display:index == idx ? "none" : "block"});
    				_panel._posters[no].add(_panel._posters[no]._dim);
    				
    				_panel._posters[no]._foc = new W.Div({x:0, y:0, opacity:focOpacity[no], backgroundColor : "rgb(192,179,149)",
    					width:templetes[idx].positions[no].w + "px", height:templetes[idx].positions[no].h + "px", display:index == idx ? "block" : "none"});
    				_panel._posters[no].add(_panel._posters[no]._foc);
    				no++;
    			}
	    	};
	    	
	    	this.unfocusPanel = function(){
	    		W.log.info("unfocusPanel");
	    		_panel._unFocImg.setStyle({display:"block"});
	    		_panel._poster_area.setStyle({display:"none"});
	    	};
	    	
	    	this.focusPanel = function(){
	    		W.log.info("focusPanel");
	    		_panel._unFocImg.setStyle({display:"none"});
	    		_panel._poster_area.setStyle({display:"block"});
	    	};
	    	
	    	this.unFocus = function(){
	    		_panel._focImg.setStyle({display:"none"});
	    		_panel._focBg.setStyle({display:"none"});
	    		_panel._unfocBg.setStyle({display:"block"});
	    		_panel._title1.setStyle({textColor:"rgba(136,129,126,0.9)"});
	    		_panel.btn.unFocus();
	    		_panel._poster_area.setStyle({opacity:0.65});
	    		if(_panel._posters){
		    		for(var i=0; i < _panel._posters.length; i++){
		    			_panel._posters[i]._dim.setStyle({display:"block"});
		    			_panel._posters[i]._foc.setStyle({display:"none"});
					}
	    		}
	    	};
	    	
	    	this.setFocus = function(){
	    		_panel._focImg.setStyle({display:"block"});
	    		_panel._focBg.setStyle({display:"block"});
	    		_panel._unfocBg.setStyle({display:"none"});
	    		_panel._title1.setStyle({textColor:"rgb(255,255,255)"});
	    		_panel.btn.focus();
	    		_panel._poster_area.setStyle({opacity:1});
	    		if(_panel._posters){
		    		for(var i=0; i < _panel._posters.length; i++){
		    			_panel._posters[i]._dim.setStyle({display:"none"});
		    			_panel._posters[i]._foc.setStyle({display:"block"});
					}
	    		}
	    	}
	    };
	    
	    function createPanel(idx){
	    	if(list[idx].resultList && list[idx].resultList.length > 0){
    			W.log.info("idx ===== " + idx);
    			var vodList;
    			if(list[idx].categoryCode == "CC0501" || list[idx].categoryCode == "CC0502" || list[idx].categoryCode == "CC0504"){
    				vodList = list[idx].resultList[0].vodList;
    			}else if(list[idx].categoryCode == "CC0503" || list[idx].categoryCode == "CC0506" || list[idx].categoryCode == "CC0505"){
    				vodList = list[idx].resultList;
    			}
    		}
	    	
	    	if(list[idx].resultList && list[idx].resultList.length > 0){
	    		_comp.panels[idx].setData(list[idx]);
    		}
	    };
	    
	    function receiveCallback(result, data, param){
	    	callbackCount++;
	    	var idx = 0;
	    	W.log.info("------------ " + param + " ,, " + ((new Date().getTime()) - _this.startTime));
	    	if(result){
	    		for(var i=0; i < list.length; i++){
		    		if(list[i].categoryCode == param){
		    			idx = i;
		    			if(param == "CC0505"){
		    				list[i].resultList = data.data;
		    			}else{
		    				list[i].resultList = data.resultList;
		    			}
		    		}
		    	}
	    	}

	    	createPanel(idx);
	    	
			W.log.info(list);
	    	if(callbackCount == list.length){
//	    		if(W.SceneManager.getCurrentScene().id.indexOf("ForYouScene") > 0){
//		    		setFocus();
//		    	}
	    	}
	    };

	    var create = function(){
	    	_comp._list = new W.Div({x:0, y:0, width:(388 * 6) + "px", height:"720px"});
	    	
	    	_comp._line_area = new W.Div({x:23, y:0, width:(388 * 6) + "px", height:"720px"});
	    	_comp._list.add(_comp._line_area);
	    	_comp._list._lines = [];
	    	for(var i=0; i < 5; i++){
	    		_comp._list._lines[i] = new W.Div({x:388*(i+1)-1, y:0, width:"1px", height:"720px", backgroundColor : "rgba(255,255,255,0.07)"});
				_comp._line_area.add(_comp._list._lines[i]);
	    	}
	    	_comp.add(_comp._list);

	    	_comp.panels = [];
	    	for(var i=0; i < list.length; i++){
	    		_comp.panels[i] = new Panel(388*i + (i > 0 ? 23 : 0), list[i], i);
	    		_comp._list.add(_comp.panels[i].getComp());
	    	}
	    	_this.startTime = new Date().getTime();
	    	for(var i=0; i < list.length; i++){
	    		if(list[i].categoryCode == "CC0501"){
	    			recoDataManager.getForyouActor(receiveCallback, list[i].categoryCode);
	    		}else if(list[i].categoryCode == "CC0502"){
	    			recoDataManager.getForyouGenre(receiveCallback, list[i].categoryCode);
	    		}else if(list[i].categoryCode == "CC0503"){
	    			recoDataManager.getForyouOverlap(receiveCallback, list[i].categoryCode);
	    		}else if(list[i].categoryCode == "CC0504"){
	    			recoDataManager.getForyouToday(receiveCallback, list[i].categoryCode);
	    		}else if(list[i].categoryCode == "CC0505"){
	    			var reqData = {offset:0, limit:100};
	    			uiplfDataManager.getPromotionForYou5List(receiveCallback, reqData, list[i].categoryCode);
	    		}else if(list[i].categoryCode == "CC0506"){
	    			recoDataManager.getForyouFree(receiveCallback, list[i].categoryCode);
	    		}
	    	}

	    	W.visibleHomeScene();
	    };

	    var unFocus = function() {
	    	if(_comp.panels){
	        	_comp.panels[index].unFocus();
	    	}
	    };

	    var setFocus = function() {
	    	if(_comp.panels){
		    	_comp.panels[index].setFocus();
	    	}
	    	if(index > 2){
	    		_comp._list.setStyle({x:-1093});
	    	}else{
	    		_comp._list.setStyle({x:0});
	    	}
	    	
	    };

	    this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            W.log.info("ForYouList show");
            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("ForYouList hide");
        };
        this.create = function(_parentComp, _parent, forYouData, fromScene) {
            W.log.info("create !!!!");
            W.log.info(forYouData);
            callbackCount = 0;
            _this = this;
            _this.parentComp = _parentComp;
            _this.parent = _parent;
            _this.fromScene = fromScene;
            
            _comp = new W.Div({id:"foryou_list_area", x:0, y:tops[0], width:"1280px", height:"720px"});
            
            list = forYouData.children;
    		create();
            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();
            W.log.info(_comp);
            if(mode == 2){
            	for(var i=0; i < _comp.panels.length; i++){
            		_comp.panels[i].focusPanel();
            	};
            	if(_comp._line_area){
            		_comp._line_area.setStyle({display:"block"});
            	}
            	if(_comp.panels){
                	setFocus();
            	}
            	if(!util.isExistScene("SiteMapScene") && W.SceneManager.getCurrentScene().id.indexOf("ForYouScene") == -1){
                	var bg = document.getElementById("home_bg_img");
                	var bg2 = document.getElementById("home_bg_img2");
                	if(bg){
                		bg.style.display = "none";
                	}
                	if(bg2){
                		bg2.style.display = "none";
                	}
            	}
            } else {
            	if(!util.isExistScene("SiteMapScene") && W.SceneManager.getCurrentScene().id.indexOf("ForYouScene") == -1){
                	var bg = document.getElementById("home_bg_img");
                	var bg2 = document.getElementById("home_bg_img2");
                	if(bg){
                		bg.style.display = "block";
                	}
                	if(bg2){
                		bg2.style.display = "block";
                	}
            	}
            	for(var i=0; i < _comp.panels.length; i++){
            		_comp.panels[i].unfocusPanel();
            	};
            	
            	if(_comp._line_area){
            		_comp._line_area.setStyle({display:"none"});
            	}
            	unFocus();
            }
        };
        this.hasList = function(){
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);
            var isConsume = false;
            switch (event.keyCode) {
            	case W.KEY.UP:
                	isConsume = true;
                    break;
                case W.KEY.RIGHT:
                	unFocus();
                	index = (++index) % list.length;
                	setFocus();
                	isConsume = true;
                    break;
                case W.KEY.LEFT:
                	unFocus();
                	index = (--index + list.length) % list.length;
                	setFocus();
                	isConsume = true;
                    break;
                case W.KEY.ENTER:
                	if(list[index].resultList && list[index].resultList.length > 0){
                        isAddedEntryPath = true;
                    	W.entryPath.push("menu.categoryId", list[index], "ForYouList");
                    	if(list[index].categoryCode == "CC0501" || list[index].categoryCode == "CC0502" || list[index].categoryCode == "CC0504"){
                    		W.SceneManager.startScene({sceneName:"scene/home/ForYouOneLineListScene", 
        	    				param:{forYouData:list[index]},
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}else if(list[index].categoryCode == "CC0505"){
                    		W.SceneManager.startScene({sceneName:"scene/home/ForYouLargeListScene", 
        	    				param:{forYouData:list[index]},
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}else{
                    		W.log.info(list[index]);
                    		W.SceneManager.startScene({sceneName:"scene/vod/MovieScene", 
        	    				param:{isRecommend:true, data:list[index]},
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}
                	}else{
                		W.PopupManager.openPopup({
		                    childComp:_this,
		                    title:W.Texts["popup_zzim_info_title"],
		                    popupName:"popup/AlertPopup",
		                    boldText:W.Texts["no_data_contents"]}
		                );
                	}
                	isConsume = true;
                    break;
                case W.KEY.BACK:
                case W.KEY.EXIT:
                	if(W.SceneManager.getCurrentScene().id.indexOf("ForYouScene") > 0){
                		_this.parent.backScene();
                		isConsume = true;
                	}else{
                		
                	}
                    break;
            }
            return isConsume;
        };
        this.destroy = function() {
            W.log.info("destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.resume = function(){
        	W.log.info("destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "ForYouList";
	}
	
	return {
		getNewComp: function(){
			return new FouYouList();
		}
	}
});