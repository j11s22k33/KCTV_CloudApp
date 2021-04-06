W.defineModule([ "mod/Util", "manager/SearchDataManager"], function(util, searchDataManager) {
	var List = function(){
		var _this;
		var _parent;
		var _parentDiv;
		var list = [];
		var _comp;
		var idxX = 0;
		var idxY = 0;
		var oldX = 0;
		var oldY = 0;
		var isActived = false;
		var isClearPin = false;
		
		var recoDataManager = W.getModule("manager/RecommendDataManager");
		
		var create = function(){
			W.log.info(_parentDiv);
			var titles = [W.Texts["search_recent_keyword"], W.Texts["search_fav_keyword"], 
			              W.Texts["search_fav_person"], W.Texts["search_fav_movie"], 
			              W.Texts["search_fav_kids"], W.Texts["search_fav_tv"]];
			_comp = new W.Div({x:0, y:0, width:"1198px", height:"484px"});
			_parentDiv.add(_comp);
			
			_comp._list = [];
			for(var i=0; i < titles.length; i++){
				_comp._list[i] = new W.Div({x:i*343, y:0, width:"343px", height:"484px"});
				_comp.add(_comp._list[i]);
				_comp._list[i]._title = new W.Span({x:0, y:11, width:"340px", height:"27px", textColor:"rgba(131,122,119,0.25)", 
					"font-size":"25px", className:"font_rixhead_bold", text:titles[i]});
				_comp._list[i].add(_comp._list[i]._title);
				_comp.add(new W.Div({x:11 + i*343, y:50, width:"1px", height:"431px", backgroundColor:"rgb(40,40,40)"}));
			}
			if(W.StbConfig.menuLanguage == "KOR"){
				_comp._delBtn = new W.Div({x:106, y:0, width:"100px", height:"68px", display:"none"});
				_comp.add(_comp._delBtn);
				_comp._delBtn.add(new W.Image({x:0, y:0, width:"68px", height:"68px", src:"img/color_green.png"}));
				_comp._delBtn.add(new W.Span({x:51, y:19, width:"120px", height:"17px", textColor:"rgba(255,255,255,0.75)", 
					"font-size":"15px", className:"font_rixhead_medium", text:W.Texts["delete"]}));
			}else{
				_comp._delBtn = new W.Div({x:106, y:0, width:"200px", height:"68px", display:"none", textAlign:"right"});
				_comp.add(_comp._delBtn);
				_comp._delBtn.add(new W.Image({position:"relative", y:0, height:"68px", src:"img/color_green.png", display:"inline-block"}));
				_comp._delBtn.add(new W.Span({position:"relative", y:-37, height:"17px", textColor:"rgba(255,255,255,0.75)", 
					"font-size":"15px", className:"font_rixhead_medium", text:W.Texts["delete"], display:"inline-block"}));
			}
			_comp._focus = new W.Image({x:8, y:47, width:"264px", height:"50px", src:"img/box_list_f.png", display:"none"});
			_comp.add(_comp._focus);
		};

		var createList = function(idx){
			var _words = [];
			var xPos = 0;
			var medal;
			var color;
			var opacity = 1;
			if(_comp._list[idx]._area){
				_comp._list[idx].remove(_comp._list[idx]._area);
			}
			_comp._list[idx]._area = new W.Div({x:21, y:58, width:"21px", height:"29px"});
			_comp._list[idx].add(_comp._list[idx]._area);
			
			if(list[idx] && list[idx].length > 0){
				
				for(var i=0; i < list[idx].length; i++){
					if(idx == 0){
						xPos = 1;
					}else{
						xPos = 29;
						if(i == 0){
							medal = "img/medal_1.png";
							color = "rgb(237,168,2)";
							opacity = 1;
						}else if(i == 1){
							medal = "img/medal_2.png";
							color = "rgb(200,200,200)";
							opacity = 1;
						}else if(i == 2){
							medal = "img/medal_3.png";
							color = "rgb(189,87,42)";
							opacity = 1;
						}else{
							opacity = 0.4;
							medal = "img/medal_4.png";
							color = "rgba(255,255,255,0.4)";
						}
						_comp._list[idx]._area.add(new W.Image({x:0, y:i*43, width:"21px", height:"29px", src:medal, opacity:opacity}));
						_comp._list[idx]._area.add(new W.Span({x:0, y:13 + i*43, width:"20px", height:"12px", textColor:color, 
							"font-size":"10px", className:"font_rixhead_bold", text:i+1, textAlign:"center"}));
					}
					var text;
					if(idx == 0){
						text = list[idx][i].keyword;
					}else if(idx == 1){
						text = list[idx][i].query;
					}else if(idx == 2){
						text = list[idx][i];
					}else{
						text = list[idx][i].title;
					}
					_comp._list[idx][i] = new W.Span({x:xPos, y:4 + 43*i, width:"210px", height:"24px", textColor:"rgba(181,181,181,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium cut", text:text});
					_comp._list[idx]._area.add(_comp._list[idx][i]);
				}
			}else{
				
				if(idx == 0){
					var msgs = W.Texts["no_resent_keywords"].split("^");
					_comp._list[idx]._area.add(new W.Span({x:1, y:4, width:"250px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium cut", text:msgs[0]}));
					_comp._list[idx]._area.add(new W.Span({x:1, y:34, width:"250px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium cut", text:msgs[1]}));
				}else if(idx == 1){
					_comp._list[idx]._area.add(new W.Span({x:1, y:4, width:"250px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
						"font-size":"20px", className:"font_rixhead_medium cut", text:W.Texts["no_popular_list"]}));
				}
				
			}
		};
		
		var getData = function(){
			searchDataManager.history(function(result, data){
				list[0] = data.data;
				W.log.info(list[0]);
				createList(0);
			});
			searchDataManager.popular(function(result, data){
				list[1] = data.data;
				createList(1);
			});
			recoDataManager.getSearchPopularTotal(function(result, data){
				list[2] = data.person;
				createList(2);
				list[3] = data.movie;
				createList(3);
				list[4] = data.kids;
				createList(4);
				list[5] = data.tv;
				createList(5);
			});
		};
		
		var focus = function(){
			_comp._delBtn.setStyle({display:idxX == 0 ? "" : "none"});
			_comp._focus.setStyle({x:8 + idxX * 343, y:47 + idxY * 43, display:""});
			if(idxY > 3){
				_parentDiv.setStyle({y:0});
				_parent.hideComp([true, false, false, true, false]);
			}
			if(idxX < 3){
				_parentDiv.setStyle({x:0});
			}else{
				_parentDiv.setStyle({x:-343*3});
			}
			if(_comp._list[oldX]) _comp._list[oldX]._title.setStyle({textColor:"rgba(131,122,119,0.25)"});
			if(_comp._list[oldX][oldY]) _comp._list[oldX][oldY].setStyle({textColor:"rgba(181,181,181,0.75)", "font-size":"20px", y:4 + 43*oldY});
			if(_comp._list[idxX]) _comp._list[idxX]._title.setStyle({textColor:"rgb(237,168,2)"});
			if(_comp._list[idxX][idxY]) _comp._list[idxX][idxY].setStyle({textColor:"rgba(255,255,255,0.9)", "font-size":"22px", y:2+43*idxY});
		};
		
		var unFocus = function(){
			_comp._delBtn.setStyle({display:"none"});
			_comp._focus.setStyle({display:"none"});
			_parentDiv.setStyle({x:0, y:258});
			_comp._list[idxX]._title.setStyle({textColor:"rgba(131,122,119,0.25)"});
			_comp._list[idxX][idxY].setStyle({textColor:"rgba(181,181,181,0.75)", "font-size":"20px", y:4 + 43*idxY});
			_parent.hideComp([false, true, true, true, true]);
		};
		
		function deleteRecentKeyword(){
			searchDataManager.deleteHistoryKeyword(function(result, data){
				if(result){
					searchDataManager.history(function(result, data){
						list[0] = data.data;
						createList(0);
						if(list[0].length > 0){
							if(list[0].length - 1 < idxY){
								idxY = list[0].length - 1;
								oldY = idxY;
							}
							focus();
						}else{
							for(var i=0; i < 4; i++){
								if(list[i].length > 0){
									idxX = i;
									isActived = true;
									break;
								}
							}
							idxY = 0;
							focus();
						}
					});
				}
			}, list[idxX][idxY].keyword);
		};
		
		this.init = function(parent, div){
			_parent = parent;
			_parentDiv = div;
			isActived = false;
			isClearPin = false;
			idxX = 0;
			idxY = 0;
			create();
			getData();
		};
		this.focus = function(){
			for(var i=0; i < 4; i++){
				if(list[i].length > 0){
					idxX = i;
					isActived = true;
					break;
				}
			}
			idxY = 0;
			focus();
			for(var i=0; i < list.length; i++){
				_comp._list[i].setStyle({display:"block"});
			}
		};
		this.unFocus = function(){
			isActived = false;
			unFocus();
		};
		this.resetRecentKeyword = function(){
			W.log.info("resetRecentKeyword !!!!");
			searchDataManager.history(function(result, data){
				list[0] = data.data;
				createList(0);
				if(isActived && idxX == 0){
					if(list[0].length - 1 < idxY){
						idxY = list[0].length - 1;
						oldY = idxY;
					}
					focus();
				}
			});
		};
		this.hideList = function(){
			for(var i=0; i < list.length; i++){
				if(i > 2){
					_comp._list[i].setStyle({display:"none"});
				}
			}
		};
		this.showList = function(){
			for(var i=0; i < list.length; i++){
				_comp._list[i].setStyle({display:"block"});
			}
		};
		this.hasList = function(){
			for(var i=0; i < 4; i++){
				if(list[i] && list[i].length > 0){
					return true;
				}
			}
			return false;
		};
		this.operate = function(keyCode){
			oldX = idxX;
			oldY = idxY;
			switch (keyCode) {
			case W.KEY.RIGHT:
				for(var i=0; i < list.length; i++){
					idxX = (++idxX) % list.length;
					if(list[idxX].length > 0){
						break;
					}
				}
				if(list[idxX].length <= idxY){
					idxY = list[idxX].length - 1;
				}
				focus();
				break;
			case W.KEY.LEFT:
				for(var i=0; i < list.length; i++){
					idxX = (--idxX + list.length) % list.length;
					if(list[idxX].length > 0){
						break;
					}
				}
				if(list[idxX].length <= idxY){
					idxY = list[idxX].length - 1;
				}
				focus();
				break;
			case W.KEY.UP:
				if(idxY == 0){
					unFocus();
					isActived = false;
					_parent.changeState(1);
				}else{
					idxY--;
					focus();
				}
				break;
			case W.KEY.DOWN:
				if(list[idxX].length - 1 == idxY){
					idxY = 0;
				}else{
					idxY++;
				}
				focus();
				break;
			case W.KEY.ENTER:
				if(idxX < 3){
					var text;
					var isWithoutAdult = false;
					if(idxX == 0){
						text = list[idxX][idxY].keyword;
					}else if(idxX == 1){
						text = list[idxX][idxY].query;
					}else if(idxX == 2){
						text = list[idxX][idxY];
						isWithoutAdult = true;
					}
					_parent.search(text, undefined, undefined, undefined, isWithoutAdult);
				}else{
					W.log.info(list[idxX][idxY]);
                	if(!isClearPin && ((W.StbConfig.adultMenuUse && list[idxX][idxY].isAdult)
                        || (list[idxX][idxY].rating && util.getRating() && list[idxX][idxY].rating >= util.getRating()))) {
                		var _this = this;
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            childComp:_this
                        };
                        W.PopupManager.openPopup(popup);
                    } else {
                    	_parent.isAddedEntryPath = true;
    					W.entryPath.push("searchRec.index", idxX-1, "List");
    					var asset = {sassetId:list[idxX][idxY].superAssetId, seriesId:list[idxX][idxY].seriesId};
                    	W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type:list[idxX][idxY].seriesId ? "S" : "V", isClearPin:isClearPin},
                            backState: W.SceneManager.BACK_STATE_KEEPHIDE
                        });
                    }
				}
				break;
			case W.KEY.COLOR_KEY_G:
				if(idxX == 0 && list[idxX].length > 0){
					unFocus();
					deleteRecentKeyword();
				}
				break;
			}
		}
		
		this.onPopupClosed = function (popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	_parent.isAddedEntryPath = true;
                    	isClearPin = true;
    					W.entryPath.push("searchRec.index", idxX-1, "List");
    					var asset = {sassetId:list[idxX][idxY].superAssetId, seriesId:list[idxX][idxY].seriesId};
                    	W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type:list[idxX][idxY].seriesId ? "S" : "V", isClearPin:isClearPin},
                            backState: W.SceneManager.BACK_STATE_KEEPHIDE
                        });
                    }
                }
            }
        };
	};
	
 	return {
 		create: function(){
			var comp = new List();
			return comp;
		}
 	}
});