W.defineModule(["mod/Util", "comp/Button", "comp/kids/Poster"], function(util, buttonComp, Poster){
	var STATE_BTN = 0;
	var STATE_LIST = 1;
	
	function VodFinish(){
		var _parent;
		var _comp;
		var totalPage;
		var _icons;
		var data;
		var list;
		var hasNextVod = false;
		var isForce = false;
		var isDefaultChTune = false;
		
		var recoDataManager = W.getModule("manager/RecommendDataManager");
		var sdpDataManager = W.getModule("manager/SdpDataManager");
		var times = [1000*60*1, 1000*60*3, 1000*60*5, 1000*60*10];
		var closeTimeout;
		
		var state = STATE_BTN;
		var bIndex = 0;
		var oldIndex = 0;
		var imgIndex = 0;
		var _this;
		
		function startTimeout(){
			if(isForce) return;
			clearTimeout(closeTimeout);
			closeTimeout = setTimeout(function(){
				W.log.info("[CloseTimer] time out !!");
				finish();
			}, times[W.StbConfig.menuDuration-1]);
		};
		
		var create = function(){
			var btnTitle;
			if(hasNextVod && !_parent.isTmpPlayer){
				btnTitle = [W.Texts["current_episode"], W.Texts["watch_repeat"]];
        		bIndex = 2;
			}else{
				btnTitle = [W.Texts["watch_repeat"]];
        		bIndex = 1;
			}
			
			var buttons = [
          	    {img:"img/07_icon_play_close.png", text:[W.Texts["remote_control_button_12"]]}, 
          	    {img:"img/07_icon_play_again.png", text:btnTitle}, 
          	    {img:"img/07_icon_play_next.png", text:[W.Texts["next_episode"], W.Texts["watch"]]}
          	];
			
			if(!hasNextVod || _parent.isTmpPlayer){
				buttons.pop();
			}
			
			var _btn_area = new W.Div({x:0, y:104, width:"1280px", height:"176px", textAlign:"center"});
			_comp.add(_btn_area);
			_comp._btns = [];
			for(var i=0; i < buttons.length; i++){
				_comp._btns[i] = new W.Div({position:"relative", y:0, width:"176px", height:"176px", display:"inline-block"});
				_btn_area.add(_comp._btns[i]);
				_comp._btns[i]._dim = new W.Image({x:0, y:0, width:"176px", height:"176px", src:"img/07_end_bt.png"});
				_comp._btns[i].add(_comp._btns[i]._dim);
				_comp._btns[i]._foc = new W.Image({x:0, y:0, width:"176px", height:"176px", src:"img/07_end_bt_foc.png", display:"none"});
				_comp._btns[i].add(_comp._btns[i]._foc);
				_comp._btns[i].add(new W.Image({x:0, y:0, width:"176px", height:"176px", src:buttons[i].img}));
				if(buttons[i].text.length == 2){
					_comp._btns[i].add(new W.Span({x:0, y:100, width:"176px", height:"21px", textColor:"rgb(45,53,58)", 
						"font-size":"19px", className:"font_rixhead_medium", text:buttons[i].text[0], textAlign:"center"}));
					_comp._btns[i].add(new W.Span({x:0, y:122, width:"176px", height:"21px", textColor:"rgb(45,53,58)", 
						"font-size":"19px", className:"font_rixhead_medium", text:buttons[i].text[1], textAlign:"center"}));
				}else{
					_comp._btns[i].add(new W.Span({x:0, y:110, width:"176px", height:"21px", textColor:"rgb(45,53,58)", 
						"font-size":"19px", className:"font_rixhead_medium", text:buttons[i].text[0], textAlign:"center"}));
				}
			}
			
			_comp.add(new W.Image({x:65, y:377, width:"50px", height:"8px", src:"img/kids_title_bg.png", display:list.length > 0 ? "block" : "none"}));
			_comp.add(new W.Span({x:70, y:362, width:"200px", height:"22px", textColor:"rgb(255,255,255)", 
				"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["friends_watched"], display:list.length > 0 ? "block" : "none"}));
			

			var _area = new W.Div({x:0, y:397, width:"1280px", height:"322px", overflow:"hidden"});
			_comp.add(_area);
			_comp._list = new W.Div({x:0, y:17, width:"1280px", height:"322px"});
        	_area.add(_comp._list);
        	
        	_comp.posters = [];
        	_comp._postersComp = [];
        	_comp._dims = [];
    		for(var i=0; i < list.length; i++){
    			_comp.posters[i] = new Poster({type:Poster.TYPE.W140, data:list[i], isRecommend:false, textAlign: i%7 > 4 ? "right" : "left", isClearPin:true});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
    			_comp._postersComp[i].setStyle({x:66 + 180*i});
    			_comp._list.add(_comp._postersComp[i]);
    		}
		};
		
		var focusBtn = function(unFocus){
			if(unFocus){
				_comp._btns[bIndex]._dim.setStyle({display:"block"});
				_comp._btns[bIndex]._foc.setStyle({display:"none"});
			}else{
				for(var i=0; i < _comp._btns.length; i++){
					if(i == bIndex){
						_comp._btns[i]._dim.setStyle({display:"none"});
						_comp._btns[i]._foc.setStyle({display:"block"});
					}else{
						_comp._btns[i]._dim.setStyle({display:"block"});
						_comp._btns[i]._foc.setStyle({display:"none"});
					}
				}
			}
		};
		
		var focusList = function(unFocus){
			if(unFocus){
				_comp.posters[imgIndex].unFocus();
			}else{
				_comp.posters[oldIndex].unFocus();
				_comp.posters[imgIndex].setFocus();
				_comp._list.setStyle({x:-Math.floor(imgIndex/6) * 1080});
			}
		};

		
		this.getComp = function(_p){
			_parent = _p;
			_this = this;
			list;
			state = STATE_BTN;
			bIndex = 0;
			hasNextVod = false;
			imgIndex = 0;
			data = _parent.asset;
			if(data.isSeries && data.nextEpisode){
				hasNextVod = true;
			}
			if(!_comp) {
				_comp = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.85)", display:"none"});
			};
			
			sdpDataManager.getBaseCategoryId(function(result, baseCategory){
				if(result){
					var baseId = baseCategory.baseId[0];
					if(baseCategory.baseId.length > 1){
						baseId = baseCategory.baseId[baseCategory.baseId.length - 2];
					}
					recoDataManager.getVodEnd(function(result, dd, param){
						W.log.info(dd);
						if(result){
							list = dd.resultList;
						}else{
							list = [];
						}
		    			totalPage = Math.ceil(list.length/7);
		    			create();
		    		}, data.assetId, baseId);
				}else{
					list = [];
					totalPage = Math.ceil(list.length/7);
	    			create();
				}
			}, {assetId:data.assetId});
			
            return _comp;
		};
		
		this.isForce = function(){
			return isForce;
		};
		
		this.show = function(isF, isTune, isTrailer, isPurchased){
			isForce = isF;
			isDefaultChTune = isTune;

			focusBtn();
			_comp.setStyle({display:"block"});
			
			startTimeout();
		};
		
		this.hide = function(){
			clearTimeout(closeTimeout);
			_comp.setStyle({display:"none"});
			if(state == STATE_LIST){
				_comp.posters[imgIndex].unFocus();
				imgIndex = 0;
        		focusList(true);
        		state = STATE_BTN;
        		focusBtn();
				_comp._list.setStyle({x:-Math.floor(imgIndex/7) * 1078});
        	}
		};
		
		function setLikes(){
			
		};
		
		function nextEpisode(){
			_this.hide();
			_parent.checkSeriesAsset(data.nextEpisode.assetId);
		};
		
		function finish(){
			if(W.StbConfig.isKidsMode && W.StbConfig.kidsLimitVodCount == 0){
				W.CloudManager.closeApp(undefined, true);
				return;
			}
			
			if(isForce){
				if(!isDefaultChTune){
					W.state.isChannelChangeSkip = true;
				}
				W.CloudManager.stopVod(function(obj){
					_parent.sendVodEndApi(obj.data, undefined, function(){
						W.state.isVod = false;
						if(_parent.isTmpPlayer && W.SceneManager.getSceneStack().length < 3){
							W.SceneManager.getSceneStack()[0].showHome(true);
						}else{
							_parent.backScene();
						}
					});
				}, -1);
			}else{
				W.state.isVod = false;
				if(_parent.isTmpPlayer && W.SceneManager.getSceneStack().length < 3){
					W.SceneManager.getSceneStack()[0].showHome(true);
				}else{
					_parent.backScene();
				}
			}
		};
		
		function cancel(){
			_parent.changeVodSpeed("reset", function(){
        		
    		});
			
			_parent.state = _parent.stateOld;
			_this.hide();
		};
		
		function rePlay(){
			if(W.StbConfig.isKidsMode && W.StbConfig.kidsLimitVodCount == 0){
				W.CloudManager.closeApp(undefined, true);
				return;
			}
			
			if(isForce){
				_parent.changeVodSpeed("reset", function(){
	        		_parent.state = 2;
	        		bIndex = 0;
	        		focusBtn();
	    			_this.hide();
	    			W.CloudManager.seekVod(function(obj){
	    				_parent.playBar.show();
	    			}, 0);
	    		});
			}else{
				_parent.state = 2;
        		bIndex = 0;
        		focusBtn();
    			_this.hide();
				_parent.replay();
			}
		};
		
		this.onKeyPressed = function(event) {
			startTimeout();
            switch (event.keyCode) {
            case W.KEY.DOWN:
            	if(state == STATE_BTN && list.length > 0){
            		focusBtn(true);
            		focusList();
            		state = STATE_LIST;
            	}
                break;
            case W.KEY.UP:
            	if(state == STATE_LIST){
            		focusBtn();
            		focusList(true);
            		state = STATE_BTN;
            	}
                break;
            case W.KEY.LEFT:
            	if(state == STATE_BTN){
            		bIndex = (--bIndex + _comp._btns.length) % _comp._btns.length;
            		focusBtn();
            	}else{
            		oldIndex = imgIndex;
            		imgIndex = (--imgIndex + list.length) % list.length;
            		focusList();
            	}
                break;
            case W.KEY.RIGHT:
            	if(state == STATE_BTN){
            		bIndex = (++bIndex) % _comp._btns.length;
            		focusBtn();
            	}else{
            		oldIndex = imgIndex;
            		imgIndex = (++imgIndex) % list.length;
            		focusList();
            	}
                break;
            case W.KEY.ENTER:
            	clearTimeout(closeTimeout);
            	if(state == STATE_BTN){
            		if(bIndex == 0){
            			finish();
            		}else if(bIndex == 1){
            			rePlay();
            		}else if(bIndex == 2){
            			nextEpisode();
            		}
            	}else{
            		if(list[imgIndex].seriesId){
                		W.entryPath.push("recVodEnd.seriesId", list[imgIndex].seriesId, "VodFinish");
                	}else{
                		W.entryPath.push("recVodEnd.sassetId", list[imgIndex].superAssetId, "VodFinish");
                	}
            		
            		var asset = {sassetId:list[imgIndex].superAssetId, seriesId:list[imgIndex].seriesId};
                	W.SceneManager.startScene({
                        sceneName: "scene/kids/KidsVodDetailScene",
                        param: {data: asset, type:list[imgIndex].seriesId ? "S" : "V"},
                        backState: W.SceneManager.BACK_STATE_DESTROY
                    });
            	}
                break;
            case W.KEY.BACK:
            case W.KEY.EXIT:
            	if(isForce){
            		cancel();
    			}else{
    				W.state.isVod = false;
    				_parent.backScene();
    			}
                break;
            }
        }
	};

	return VodFinish;
});