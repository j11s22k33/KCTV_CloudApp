W.defineModule("comp/home/AppList", ["mod/Util", "comp/Scroll"], function(util, Scroll) {
	function AppList(){
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");
	    var uimDataManager = W.getModule("manager/UiPlfDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var tops = [436, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];

	    var index = 0;
	    var _comp;

	    var apps;
	    var totalPage;
	    var totalLine;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	    };

	    var create = function(){
	        _this.mode = MODE_TYPE.LIST;
	        
	        var _area = new W.Div({x:163, y:131, width:"950px", height:"600px", overflow : "hidden"});
	        _comp.add(_area);
	        
	        _comp._list = new W.Div({x:0, y:0, width:"950px", height:"600px"});
	        _area.add(_comp._list);
	        
	        _comp._apps = [];
	        for(var i=0; i < apps.length; i++){
	        	_comp._apps[i] = new W.Div({x:(i%4) * 244, y:Math.floor(i/4) * 180, width:"214px", height:"164px"});
	        	_comp._list.add(_comp._apps[i]);
				_comp._apps[i]._banner = new W.Image({x:0, y:0, width:"214px", height:"120px", src:"img/10_data_df.png"});
	        	_comp._apps[i].add(_comp._apps[i]._banner);
	        	/*if(apps[i].banner){
	        		_comp._apps[i].add(new W.Image({x:0, y:0, width:"214px", height:"120px", src:apps[i].banner}));
	        	}*/
	        	_comp._apps[i]._foc = new W.Div({x:0, y:0, width:"206px", height:"112px", border:"solid 4px #FF0000", display:"none"});
	        	_comp._apps[i].add(_comp._apps[i]._foc);
	        	var title;
	        	if(_this.type == "DATA_APP"){
	        		title = apps[i].appName;
	        		if(apps[i].image){
		        		_comp._apps[i]._banner.setSrc(apps[i].image);
	        		}
	            }else{
	        		title = apps[i].title;
	            }
	        	_comp._apps[i]._text = new W.Span({x:0, y:130, width:"214px", height:"22px", textColor:"rgba(255,255,255,0.75)", 
	    			"font-size":"19px", className:"font_rixhead_light", textAlign:"center", text:title});
	        	_comp._apps[i].add(_comp._apps[i]._text);
	        }


			if(_this.posterList && _this.posterList.getTotalPage() > 1) {
				_this.scroll = new Scroll();
				_comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
				_comp._scroll.setStyle({x:49+5, y:270, display:mode==2 ? "block" : "none"});
				_comp.add(_comp._scroll);
			} else {
				_this.scroll = undefined;
			}

	        if(W.SceneManager.getCurrentScene().id.indexOf("AppListScene") > -1){
	            focus();
	        }
	        
	        W.visibleHomeScene();
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
	    	if(_this.type == "DATA_APP"){
	    		uimDataManager.getApplication(cbGetAssetsData);
            }else{
            	W.CloudManager.getApplicationList(cbGetAssetsData, param);
            }
	    };

	    var cbGetAssetsData = function(result, data) {
	        if(result) {
	        	if(_this.type == "DATA_APP"){
		    		apps = data.list;
	            }else{
	            	apps = result.data;
	            }
	        	
	        	totalPage = Math.floor(apps.length/12) + 1;
	            totalLine = Math.floor(apps.length/4) + 1;

				if(apps.length > 0) {
					create();
					if(_this.type == "TV_APP"){
						getBannerData(0);
		            }
				} else {

				}
	        } else {

	        }
	    };

		var getBannerData = function(param) {
			if(param < apps.length) {
				var appIds = [];
				for (var i=param; i<param+4 && i<apps.length; i++) {
					appIds.push(apps[i].package);
				}
				W.CloudManager.getApplicationBanner(cbGetBannerData, appIds, param);
			} else {

			}
		};

		var cbGetBannerData = function(result, param) {
			if(result) {
				for(var i in result.data){
					param++;
					for(var j in apps) {
						if(apps[j].package == result.data[i].package){
							if(result.data[i].banner) {
								apps[j].banner = "data:image/png;base64," + result.data[i].banner;
								_comp._apps[j]._banner.setSrc(apps[j].banner);
							}
							else continue;
						}
					}
				}
				getBannerData(param);
				//create();
			} else {

			}
		};

	    var scrollCallback = function(idx) {
	    	index = idx * 12;
	    	focus();
	    };
	    
	    var focus = function(){
	    	if(_this.mode == MODE_TYPE.LIST) {
	    		_comp._apps[index]._foc.setStyle({display:"block"});
	        	_comp._apps[index]._text.setStyle({textColor:"rgb(255,255,255)", className:"font_rixhead_medium"});
	    	}
	    	var page = Math.floor(index/12);
	    	_comp._list.setStyle({y:-page * 540});
	        if (_this.scroll) _this.scroll.setPage(page);
	    };
	    
	    var unFocus = function(){
	    	_comp._apps[index]._foc.setStyle({display:"none"});
	    	_comp._apps[index]._text.setStyle({textColor:"rgba(255,255,255,0.75)", className:"font_rixhead_light"});
	    };

	    this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            W.log.info("App List show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("App List hide");
        };
        this.create = function(_parentDiv, _parent, param) {
            W.log.info("create !!!!");
            W.log.info(param);
            _this = this;
            if(param.category.menuType == "MC0006"){
            	_this.type = "DATA_APP";
            }else if(param.category.menuType == "MC0007"){
            	_this.type = "TV_APP";
            }
            
            _comp = new W.Div({id:"app_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

			getAssetsData(param);

            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.scroll) _this.scroll.setActive();
                if(W.SceneManager.getCurrentScene().id.indexOf("AppListScene") == -1){
                    focus();
                }
            } else {
                if(_this.scroll) _this.scroll.deActive();
            }
        };
        this.hasList = function(){
        	if(apps && apps.length > 0) {
            	return true;
        	}else{
            	return false;
        	}
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                    	unFocus();
                    	if(index == apps.length - 1){
                    		index = 0;
                    	}else{
                    		index++;
                    	}
                    	focus();
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.mode = MODE_TYPE.LIST;
                    	focus();
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
                   	 	unFocus();
                        if(index%4 == 0) {
							if (_this.scroll) {
								_this.mode = MODE_TYPE.SCROLL;
								if (_this.scroll) _this.scroll.setFocus();
							} else {
								focus();
							}

                        } else {
                        	index--;
                            focus();
                        }
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                		unFocus();
                    	if(index > 3){
                    		index -= 4;
                    		focus();
                    		return true;
                    	}else{
                    		if(W.SceneManager.getCurrentScene().id.indexOf("AppListScene") > 0){
                    			if(apps.length > 4){
                    				index = (totalLine-1)*4 + index;
                    				if(index > apps.length - 1){
                    					index = apps.length - 1;
                    				}
                    			}
                    			focus();
                    			return true;
                    		}else{
								index = 0;
                    			return false;
                    		}
                    		
                    	}
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                    	if(apps.length < 5){
                    		return true;
                    	}else{
                    		unFocus();
                    		if(apps.length - 1 >= index + 4){
                    			index += 4;
                    		}else{
                    			var tmpLine = Math.floor(index/4);
                    			if(totalLine - 1 == tmpLine){
                    				index = index % 4;
                    			}else{
                    				if(apps.length - 1 >= index + 1){
                            			index = apps.length - 1;
                            		}
                    			}
                    		}
                    		focus();
                    	}
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	var data = {};
                	if(_this.type == "DATA_APP"){
	            		data = apps[index].link;
	                }else{
	                	data.linkType = "ap02";
	                	data.linkTarget = apps[index].package;
	                }
                	W.CloudManager.runApplication(undefined, data);
                    break;
                case W.KEY.BACK:
					if(_this.mode == MODE_TYPE.LIST) {
						unFocus();
						index = 0;
						var page = Math.floor(index/12);
						_comp._list.setStyle({y:-page * 540});
						if (_this.scroll) _this.scroll.setPage(page);
					}
                    break;
                case W.KEY.EXIT:
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
                    break;
                case W.KEY.KEY_OPTION:
                   break;
            }

        };
        this.destroy = function() {
            W.log.info("destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "AppList";
	};
    
	return {
		getNewComp: function(){
			return new AppList();
		}
	}
});