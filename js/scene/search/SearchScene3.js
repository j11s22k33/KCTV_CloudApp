/**
 * scene/MainScene
 *
 * [Flipbook] 3.1.1
 *
 * Author : jean511@alticast.com
 */
W.defineModule([ "mod/Util", "comp/RightTimer", "comp/osk/OSKManager", "comp/search/List", "comp/search/AutoList", "manager/SearchDataManager"],
	function(util, rightTimer, osk, listCompManager, autoListManager, searchDataManager) {
		var STATE_INPUT = 0;
		var STATE_OSK = 1;
		var STATE_LIST = 2;
		var STATE_AUTO = 3;
		
		var state = STATE_OSK;
		var _thisScene = "SearchScene";
		var _this;
		var _comp;
		var _timer;
		var cursorInterval;
		var hasAutoResult = false;

		W.log.info("### Initializing " + _thisScene + " scene ###");

		var create = function(){
			_comp = new W.Div({className : "bg_size bg_color"});
			
			_comp._arr_top = new W.Div({x:593, y:43, width:"106px", height:"45px", display:"none"});
			_comp.add(_comp._arr_top);
			_comp._arr_top.add(new W.Image({x:0, y:0, width:"41px", height:"41px", src:"img/arrow_navi_u.png"}));
			_comp._arr_top.add(new W.Span({x:53, y:13, width:"60px", height:"18px", textColor:"rgba(196,196,196,0.5)", 
				"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["scene_search"]}));
			
			_comp._list_area = new W.Div({x:108, y:156, width:"1198px", height:"484px", overflow:"hidden"});
			_comp.add(_comp._list_area);
			_comp._list = new W.Div({x:0, y:258, width:"1372px", height:"484px"});
			_comp._list_area.add(_comp._list);
			
			_comp._arr_bottom = new W.Div({x:593, y:643, width:"95px", height:"41px", display:W.StbConfig.cugType == "accommodation" ? "none" : ""});
			_comp.add(_comp._arr_bottom);
			_comp._arr_bottom.add(new W.Image({x:0, y:0, width:"41px", height:"41px", src:"img/arrow_navi_d.png"}));
			_comp._arr_bottom.add(new W.Span({x:53, y:15, width:"45px", height:"18px", textColor:"rgba(196,196,196,0.5)", 
				"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["more_detail2"]}));
			
			_comp._osk_area = new W.Div({x:394, y:179, width:"482px", height:"224px"});
			_comp.add(_comp._osk_area);
			
			_comp._search = new W.Div({x:369, y:90, width:"540px", height:"59px"});
			_comp.add(_comp._search);
			_comp._search._line = new W.Image({x:0, y:0, width:"540px", height:"59px", src:"img/line_search.png"});
			_comp._search.add(_comp._search._line);
			_comp._search._lineF = new W.Image({x:0, y:0, width:"540px", height:"59px", src:"img/line_search_f.png", display:"none"});
			_comp._search.add(_comp._search._lineF);
			_comp._search._icon = new W.Image({x:167, y:21, width:"21px", height:"20px", src:"img/icon_search.png"});
			_comp._search.add(_comp._search._icon);
			_comp._search._guide = new W.Span({x:189, y:21, width:"300px", height:"22px", textColor:"rgba(237,168,2,0.9)", 
				"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["scene_search_guide"], textAlign:"center"});
			_comp._search.add(_comp._search._guide);
			
			_comp._search._input_area = new W.Div({x:39, y:9, width:"490px", height:"36px", textAlign:"center"});
			_comp._search.add(_comp._search._input_area);
			
			_comp._search._input = new W.Span({position:"relative", y:0, height:"40px", textColor:"rgb(255,255,255)", 
				"font-size":"36px", className:"font_rixhead_medium", text:"", display:"none"});
			_comp._search._input_area.add(_comp._search._input);
			_comp._search._input2 = new W.Span({position:"relative", y:0, height:"40px", textColor:"rgb(255,255,255)", 
				"font-size":"36px", className:"font_rixhead_medium search_input_text", text:""});
			_comp._search._input_area.add(_comp._search._input2);
			_comp._search._cursor = new W.Span({position:"relative", y:0, height:"40px", textColor:"rgb(237,168,2)", 
				"font-size":"36px", className:"font_rixhead_medium", text:" _", opacity:0});
			_comp._search._input_area.add(_comp._search._cursor);
			
			_comp._autolist_area = new W.Div({x:946, y:0, width:"334px", height:"720px"});
			_comp.add(_comp._autolist_area);

			_comp._timer = new W.Div({x:1027, y:55, width:"200px", height:"117px"});
			_comp.add(_comp._timer);
			_comp.add(new W.Span({x:55, y:52, width:"50px", height:"30px", textColor:"rgb(255,255,255)",
				className:"font_rixhead_medium", "font-size":"27px", text:"검색"}));
			
			_this.add(_comp);
			_timer.start(_comp._timer);
			
			_this.oskManager.create(_comp._osk_area, _comp._search._input, 27, 29, "js/comp/osk/");
			_this.oskManager.setEndCallback(oskEndCallback);
			_this.oskManager.setKeyDownCallback(oskKeyDownCallback);
			_this.oskManager.setUnfocusCallback(oskUnfocusCallback);
			_this.oskManager.focus(0);

			if(W.StbConfig.cugType != "accommodation"){
				_this.listComp.init(_this, _comp._list);
			}
		};
		
		var changeState = function(stat){
			state = stat;
			if(state == STATE_OSK){
				W.CloudManager.addNumericKey();
			}else{
				W.CloudManager.delNumericKey();
			}
		}
		
		var oskEndCallback = function(){
			if(_comp._search._input.getText().length > 0){
				_this.search();
			}
		};
		
		var oskUnfocusCallback = function(type){
			var result = false;
			if(type == "D"){
				if(W.StbConfig.cugType != "accommodation"){
					if(_this.listComp.hasList()){
						changeState(STATE_LIST);
						_this.listComp.focus();
						if(hasAutoResult){
							_comp._autolist_area.setStyle({display:"none"});
							_comp._list_area.setStyle({opacity:1});
						}
						result = true;
						stopCursor();
					}else{
						_this.changeState(1);
					}
				}
			}else if(type == "R"){
				if(hasAutoResult && W.StbConfig.cugType != "accommodation"){
					if(_this.autoList.focus()){
						changeState(STATE_AUTO);
						stopCursor();
						result = true;
					}else{
						result = false;
					}
				}else{
					result = false;
				}
			}else if(type == "U"){
				changeState(STATE_INPUT);
				result = true;
				_comp._search._line.setStyle({display:"none"});
				_comp._search._lineF.setStyle({display:""});
			}
			return result;
		};
		
		var startCursor = function(){
			if(!cursorInterval && _comp._search._input.getText().length > 0){
				_comp._search._cursor.val = 1;
				_comp._search._cursor.setStyle({opacity:_comp._search._cursor.val});
				cursorInterval = setInterval(function(){
					_comp._search._cursor.val = _comp._search._cursor.val ? 0 : 1;
					_comp._search._cursor.setStyle({opacity:_comp._search._cursor.val});
				}, 500);
			}
			
		};
		
		var stopCursor = function(){
			_comp._search._cursor.setStyle({opacity:0});
			clearInterval(cursorInterval);
			cursorInterval = null;
		};
		
		var oskKeyDownCallback = function(keyword){
			if(keyword.length > 0){
				_comp._search._icon.setStyle({x:8});
				_comp._search._guide.setStyle({display:"none"});
				
				startCursor();
				if(W.StbConfig.cugType != "accommodation"){
					_this.autoList.search(keyword);
				}
				_comp._list_area.setStyle({opacity:0.5});
				hasAutoResult = true;
				_this.listComp.hideList();
			}else{
				_comp._search._icon.setStyle({x:167});
				_comp._search._guide.setStyle({display:""});
				stopCursor();
				hasAutoResult = false;
				if(W.StbConfig.cugType != "accommodation"){
					_this.autoList.clear();
				}
				_comp._list_area.setStyle({opacity:1});
				_this.listComp.showList();
			}
		};
		
		var init = function(){
			create();
			_this.autoList.init(_this, _comp._autolist_area);
		};
		
		var focus = function(){
			W.log.info("index ==== " + index);
			_comp._menus[oldIndex]._title.setStyle({"font-size":"22px", y:42, "font-family":"RixHeadL"});
			_comp._menus[index]._title.setStyle({"font-size":"26px", y:38, "font-family":"RixHeadM"});
			_comp._focus.setStyle({x:(index%3) * 325, y:Math.floor(index/3)*144});
			_comp._list2.setStyle({y:-Math.floor(index/12) * 576});
		};
		
		function goResultScene(keyword, m_field, p_rating, isWithoutAdult, data, chInfo){
			_this.isAddedEntryPath = true;
			W.entryPath.push("search.keyword", keyword, "SearchScene");
			_this.startScene({
				sceneName:"scene/search/SearchResultScene", 
				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
				param:{
					keyword: keyword,
					m_field: m_field,
					p_rating: p_rating,
					isWithoutAdult: isWithoutAdult,
					data:data,
					chInfo:chInfo
				}
			});
		};
		
		function searchKeyword(keyword, m_field, p_rating, isWithoutAdult){
			var limit = 0;
			if(W.StbConfig.vodLookStyle == 1){
				limit = 28;
			}else{
				limit = 27;
			}

			W.Loading.start();
			searchDataManager.search(function(result, data){
				W.log.info(result);
				W.log.info(data);
				
				if(result && data){
					if(data.hits.total > 0){
						if(data.schedule.total > 0){
							for(var i = 0; i < data.schedule.data.length; i++) {
								if(data.schedule.data[i].title) data.schedule.data[i].title = data.schedule.data[i].title.trim();
							}
							W.CloudManager.getGridEpg(function(chInfo){
								if (chInfo && chInfo.data && chInfo.data.getReserveList) {
									W.StbConfig.ReserveProgramList = util.parseReserveProgramList(chInfo.data.getReserveList);
								} else {
									W.StbConfig.ReserveProgramList = [];
								}

								W.Loading.stop();
								goResultScene(keyword, m_field, p_rating, isWithoutAdult, data, chInfo);
							});
						}else{
							W.Loading.stop();
							goResultScene(keyword, m_field, p_rating, isWithoutAdult, data);
						}
					}else{
						W.Loading.stop();
						W.PopupManager.openPopup({
		                    childComp:_this,
		                    title:W.Texts["popup_zzim_info_title"],
		                    popupName:"popup/AlertPopup",
		                    boldText:W.Texts["no_data_contents"],
		                    thinText:W.Texts["no_auto_completion2"]}
		                );
					}
				}else{
					W.Loading.stop();
					W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code:(data && data.error && data.error.code) ? data.error.code : "9999",
            			from : "SEARCH"}
                    );
				}
				
			}, keyword, undefined, 0, limit, "vod:pop,vseries:pop,product:new,schedule:start", undefined, p_rating, m_field, isWithoutAdult);
			
			
			
		};

		return W.Scene.extend({
			onCreate : function(param) {
				W.log.info(_thisScene + " onCreate");
				changeState(STATE_OSK);
				_this = this;
				_this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.BACK, W.KEY.EXIT,
				                W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9,
				                W.KEY.COLOR_KEY_R, W.KEY.COLOR_KEY_G, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_B, W.KEY.DELETE, W.KEY.SWITCH_CHARSET]);
				_this.listComp = listCompManager.create();
				_this.autoList = autoListManager.create();
				_this.oskManager = osk.create();
				_timer = rightTimer.getComp();
				init();
			},
			onPause: function() {

			},
			onResume: function(desc) {
				if(W.StbConfig.cugType != "accommodation"){
					_this.listComp.resetRecentKeyword();
				}
				if(_this.isAddedEntryPath){
					W.entryPath.pop();
					_this.isAddedEntryPath = false;
				}
				if(desc){
           		 	if(desc.command == "refresh"){
	           		 	if(state == STATE_LIST){
	    					_this.listComp.unFocus();
	    					_this.changeState(STATE_OSK);
	    				}else if(state == STATE_AUTO){
	    					_this.autoList.unFocus();
	    					_this.changeState(STATE_OSK);
	    				}else if(state == STATE_INPUT){
	    					_this.oskManager.focus();
	    					changeState(STATE_OSK);
	    					_comp._search._line.setStyle({display:""});
	    					_comp._search._lineF.setStyle({display:"none"});
	    				}
	    				_this.oskManager.resetKeyword();
           		 	}
				}
			},
			onRefresh: function() {
			},
			onDestroy : function() {
				W.log.info(_thisScene + " onDestroy !!!");
				stopCursor();
				_timer.stop();
				W.CloudManager.delNumericKey();
				if(_this.isAddedEntryPath){
					W.entryPath.pop();
					_this.isAddedEntryPath = false;
				}
			},
			search: function(keyword, m_field, p_rating, isChangeInputText, isWithoutAdult, isAutoList){
				W.log.info("isChangeInputText ========== " + isChangeInputText);
				W.log.info("keyword ========== " + keyword);
				
				if(!isAutoList){
					if(isChangeInputText){
						_comp._search._input.setText(keyword);
						$("#search_input_text").html(keyword.replace(/ /g, "&nbsp;&nbsp;"));
					}
					
					var hasList = true;
					if(!keyword){
						if(_comp._search._input.getText().length > 0){
							keyword = _comp._search._input.getText();
							hasList = _this.autoList.hasList();
						}
					}
				}
				
				if(keyword){
					searchKeyword(keyword, m_field, p_rating, isWithoutAdult);
				}
			},
			changeState: function(stat){
				changeState(stat);
				if(state == STATE_OSK){
					_this.oskManager.focus();
					startCursor();
					if(hasAutoResult){
						_comp._autolist_area.setStyle({display:""});
						_comp._list_area.setStyle({opacity:0.5});
						_this.listComp.hideList();
					}
				}else if(state == STATE_LIST){
					_this.listComp.focus();
					startCursor();
				}
			},
			hideComp: function(arr){
				_comp._arr_top.setStyle({display:arr[0] ? "" : "none"});
				_comp._search.setStyle({display:arr[1] ? "" : "none"});
				_comp._osk_area.setStyle({display:arr[2] ? "" : "none"});
				_comp._list_area.setStyle({display:arr[3] ? "" : "none"});
				_comp._arr_bottom.setStyle({display:arr[4] ? "" : "none"});
			},
			onKeyPressed : function(event) {
				W.log.info(_thisScene + " onKeyPressed " + event.keyCode + " state : " + state);
				
				if(event.keyCode == W.KEY.BACK){
					if(state == STATE_LIST){
						_this.listComp.unFocus();
						_this.changeState(1);
					}else if(state == STATE_AUTO){
						_this.autoList.unFocus();
						_this.changeState(1);
					}else{
						this.backScene();
					}
					return;
				}
				if(state == STATE_OSK){
					_this.oskManager.operate(event.keyCode);
				}else if(state == STATE_LIST){
					_this.listComp.operate(event.keyCode);
				}else if(state == STATE_AUTO){
					_this.autoList.operate(event.keyCode);
				}else if(state == STATE_INPUT){
					switch (event.keyCode) {
					case W.KEY.RIGHT:
						_this.oskManager.addBlank();
						break;
					case W.KEY.LEFT:
						_this.oskManager.delChar();
						if(_comp._search._input.getText().length == 0){
							_this.oskManager.focus();
							changeState(STATE_OSK);
							_comp._search._line.setStyle({display:""});
							_comp._search._lineF.setStyle({display:"none"});
						}
						break;
					case W.KEY.DOWN:
						_this.oskManager.focus();
						changeState(STATE_OSK);
						_comp._search._line.setStyle({display:""});
						_comp._search._lineF.setStyle({display:"none"});
						break;
//					case W.KEY.COLOR_KEY_R:
//					case W.KEY.COLOR_KEY_G:
//					case W.KEY.COLOR_KEY_B:
//					case W.KEY.COLOR_KEY_Y:
//					case W.KEY.NUM_0:
//					case W.KEY.NUM_1:
//					case W.KEY.NUM_2:
//					case W.KEY.NUM_3:
//					case W.KEY.NUM_4:
//					case W.KEY.NUM_5:
//					case W.KEY.NUM_6:
//					case W.KEY.NUM_7:
//					case W.KEY.NUM_8:
//					case W.KEY.NUM_9:
//						_this.oskManager.operate(event.keyCode);
//						break;
					case W.KEY.ENTER:
						if(_comp._search._input.getText().length > 0){
							_this.search();
						}
						break;
					}
				}
			}
		});
	});