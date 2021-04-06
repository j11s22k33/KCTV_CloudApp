W.defineModule(["mod/Util", "comp/Button", "comp/list/Poster"], function(util, buttonComp, Poster){
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
		var isClearPin = false;
		
		var recoDataManager = W.getModule("manager/RecommendDataManager");
		var sdpDataManager = W.getModule("manager/SdpDataManager");
		var times = [1000*60*1, 1000*60*3, 1000*60*5, 1000*60*10];
		var closeTimeout;
		
		var state = STATE_BTN;
		var bIndex = 0;
		var oldIndex = 0;
		var imgIndex = 0;
		var _this;
		
		var create = function(){
			_comp.add(new W.Span({x:56, y:94, width:"1000px", height:"37px", textColor:"rgb(255,255,255)", 
				"font-size":"34px", className:"font_rixhead_medium cut", text:data.title}));
			_comp._message = new W.Span({x:58, y:138, width:"400px", height:"22px", textColor:"rgba(196,196,196,0.75)", 
				"font-size":"20px", className:"font_rixhead_medium", text:""});
			_comp.add(_comp._message);
			
			_comp.add(new W.Image({x:74, y:248, width:"6px", height:"6px", src:"img/04_end_dot.png"}));
			_comp.add(new W.Image({x:74, y:266, width:"6px", height:"6px", src:"img/04_end_dot.png"}));
			_comp.add(new W.Image({x:74, y:317, width:"6px", height:"6px", src:"img/04_end_dot.png"}));
			_comp.add(new W.Image({x:74, y:335, width:"6px", height:"6px", src:"img/04_end_dot.png"}));
			_comp.add(new W.Image({x:71, y:289, width:"13px", height:"12px", src:"img/04_end_heart.png"}));
			_comp._like_num = new W.Span({x:92, y:287, width:"100px", height:"22px", textColor:"rgba(255,255,255,0.5)", 
				"font-size":"20px", className:"font_rixhead_medium", text:"0"});
			_comp.add(_comp._like_num);
			if(data.likes > 0){
				_comp._like_num.setText(W.Util.formatComma(data.likes > 9999 ? 9999 : data.likes,3));
			}

			_comp._text_unfoc = new W.Div({x:71, y:370, width:"1200px", height:"29px", display:list.length > 0 ? "block" : "none"});
			_comp.add(_comp._text_unfoc);
			_comp._text_unfoc.add(new W.Image({x:0, y:0, width:"13px", height:"15px", src:"img/arrow_navi_d2.png"}));
			_comp._text_unfoc._text = new W.Span({x:22, y:0, width:"400px", height:"22px", textColor:"rgb(196,196,196)", 
				"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["recommend_movie"]});
			_comp._text_unfoc.add(_comp._text_unfoc._text);
			_comp._text_unfoc._bar = new W.Div({x:427, y:9, width:"860px", height:"1px", backgroundColor:"rgba(255,255,255,0.12)"});
			_comp._text_unfoc.add(_comp._text_unfoc._bar);
			
			_comp._text_foc = new W.Div({x:69, y:358, width:"1200px", height:"29px", display:"none"});
			_comp.add(_comp._text_foc);
			_comp._text_foc._text = new W.Span({x:0, y:0, width:"400px", height:"22px", textColor:"rgb(196,196,196)", 
				"font-size":"20px", className:"font_rixhead_medium", text:W.Texts["recommend_movie"]});
			_comp._text_foc.add(_comp._text_foc._text);
			_comp._text_foc._bar = new W.Div({x:403, y:8, width:"834px", height:"1px", backgroundColor:"rgba(255,255,255,0.12)"});
			_comp._text_foc.add(_comp._text_foc._bar);
			
			
			var _area = new W.Div({x:0, y:397, width:"1280px", height:"322px", overflow:"hidden"});
			_comp.add(_area);
			_comp._list = new W.Div({x:0, y:14, width:"1280px", height:"322px"});
        	_area.add(_comp._list);
        	
        	_comp.posters = [];
        	_comp._postersComp = [];
        	_comp._dims = [];
    		for(var i=0; i < list.length; i++){
    			_comp.posters[i] = new Poster({type:Poster.TYPE.W136, data:list[i], isRecommend:true, textAlign: i%7 > 4 ? "right" : "left", isClearPin:isClearPin});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
    			_comp._postersComp[i].setStyle({x:67 + 154*i});
    			_comp._list.add(_comp._postersComp[i]);
    			_comp._dims[i] = new W.Div({x:67 + 154*i, y:0, width:"136px", height:"194px", backgroundColor:"rgba(0,0,0,0.6)"});
    			_comp._list.add(_comp._dims[i]);
    		}
		};
		
		function startTimeout(){
			if(isForce) return;
			clearTimeout(closeTimeout);
			closeTimeout = setTimeout(function(){
				W.log.info("[CloseTimer] time out !!");
				finish();
			}, times[W.StbConfig.menuDuration-1]);
		};
		
		var focusBtn = function(unFocus){
			if(unFocus){
				_comp._btns[bIndex].unFocus();
				_comp._text_unfoc.setStyle({display:"none"});
				_comp._text_foc.setStyle({display:"block"});
				for(var i=0; i < list.length; i++){
					_comp._dims[i].setStyle({display:"none"});
				}
			}else{
				for(var i=0; i < _comp._btns.length; i++){
					if(i == bIndex){
						_comp._btns[i].focus();
					}else{
						_comp._btns[i].unFocus();
					}
				}
			}
		};
		
		var focusList = function(unFocus){
			if(unFocus){
				_comp.posters[imgIndex].unFocus();
				_comp._text_unfoc.setStyle({display:"block"});
				_comp._text_foc.setStyle({display:"none"});
				for(var i=0; i < list.length; i++){
					_comp._dims[i].setStyle({display:"block"});
				}
			}else{
				_comp.posters[oldIndex].unFocus();
				_comp.posters[imgIndex].setFocus();
				_comp._list.setStyle({x:-Math.floor(imgIndex/7) * 1078});
			}
		};

		
		this.getComp = function(_p){
			_parent = _p;
			_this = this;
			state = STATE_BTN;
			bIndex = 0;
			hasNextVod = false;
			imgIndex = 0;
			data = _parent.asset;
			isClearPin = _parent.isClearPin;
			if(data.isSeries && data.nextEpisode){
				hasNextVod = true;
			}
			if(!_comp) {
				_comp = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.85)", display:"none"});
			};
			
			sdpDataManager.getBaseCategoryId(function(result, baseCategory){
				if(result){
					W.log.info(baseCategory);
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
			W.log.info("Vod Finish Show !!!!");
			isForce = isF;
			isDefaultChTune = isTune;
			if(isTrailer){
				_comp._message.setText(W.Texts["popup_vod_end_guide"]);
				_comp._text_foc._text.setText(W.Texts["popup_vod_end_guide2"]);
				_comp._text_unfoc._text.setText(W.Texts["popup_vod_end_guide2"]);
				_comp._text_foc._bar.setStyle({x:195});
				_comp._text_unfoc._bar.setStyle({x:215});
			}else{
				if(isForce){
					_comp._message.setText(W.Texts["vod_play_finish_question"]);
				}else{
					_comp._message.setText(W.Texts["vod_play_finish_message"]);
				}
				_comp._text_foc._text.setText(W.Texts["recommend_movie"]);
				_comp._text_unfoc._text.setText(W.Texts["recommend_movie"]);
				_comp._text_foc._bar.setStyle({x:403});
				_comp._text_unfoc._bar.setStyle({x:427});
			}
			
			if(_comp._btnsComp){
				for(var i=0; i < _comp._btnsComp.length; i++){
					_comp.remove(_comp._btnsComp[i]);
				}
			}
			
			var no = 0;
			var hasPurchaseBtn = false;
			var left = 57
			_comp._btns = [];
			_comp._btnsComp = [];
			
			_comp._btns[no] = buttonComp.create(left, 182, W.Texts["like"], 81);
			_comp._btnsComp[no] = _comp._btns[no].getComp();
			_comp.add(_comp._btnsComp[no]);
			_comp._btns[no].type = "like";
			no++;
			left += 81 + 8;
			
			if(isTrailer && !isPurchased){
				_comp._btns[no] = buttonComp.create(left, 182, W.Texts["purchase_vod"], 97);
				_comp._btnsComp[no] = _comp._btns[no].getComp();
				_comp.add(_comp._btnsComp[no]);
				_comp._btns[no].type = "purchase";
				no++;
				left += 100 + 8;
				hasPurchaseBtn = true;
			}			
			
			if(hasNextVod && !_parent.isTmpPlayer){
				_comp._btns[no] = buttonComp.create(left, 182, W.Texts["next_episode"], 97);
				_comp._btnsComp[no] = _comp._btns[no].getComp();
				_comp.add(_comp._btnsComp[no]);
				_comp._btns[no].type = "next";
				no++;
				left += 97 + 8;
			}
			_comp._btns[no] = buttonComp.create(left, 182, W.Texts["remote_control_button_12"], 66);
			_comp._btnsComp[no] = _comp._btns[no].getComp();
			_comp.add(_comp._btnsComp[no]);
			_comp._btns[no].type = "finish";
			
			if(hasPurchaseBtn){
				bIndex = 1;
			}else{
				bIndex = no;
			};
			no++;
			left += 66 + 8;
			
			if(isForce && !isTrailer){
				_comp._btns[no] = buttonComp.create(left, 182, W.Texts["cancel"], 66);
				_comp._btnsComp[no] = _comp._btns[no].getComp();
				_comp.add(_comp._btnsComp[no]);
				_comp._btns[no].type = "cancel";
			}
			focusBtn();
			_comp.setStyle({display:"block"});
			
			startTimeout();
		};
		
		this.hide = function(){
			W.log.info("Vod Finish Hide !!!!");
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
			var reqData = {};
			if(data.isSeries){
				reqData.targetType = "asset";
				reqData.targetId = data.assetId;
			}else{
				reqData.targetType = "sasset";
				reqData.targetId = data.sassetId;
			}
			
			if(data.isLiked){
				sdpDataManager.removeLike(function(result, resultData){
					if(result){
						W.log.info(resultData);
						data.isLiked = false;
						data.likes--;
						_comp._like_num.setText(W.Util.formatComma(data.likes > 9999 ? 9999 : data.likes,3));
					}
				}, reqData);
			}else{
				sdpDataManager.addLike(function(result, resultData){
					if(result){
						W.log.info(resultData);
						data.isLiked = true;
						data.likes++;
						_comp._like_num.setText(W.Util.formatComma(data.likes > 9999 ? 9999 : data.likes,3));
					}
				}, reqData);
			}
		};
		
		function nextEpisode(){
			_this.hide();
			_parent.checkSeriesAsset(data.nextEpisode.assetId);
		};
		
		function finish(){
			W.log.info("Vod Finish finish !!!!");
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
		
		function purchaseTrailer(){
			bIndex = 0;
			_this.hide();
			_parent.purchaseTrailer(isForce);
		};
		
		function cancel(){
			W.log.info("Vod Finish cancel !!!!");
			_parent.changeVodSpeed("reset", function(){
    		});
    		_parent.state = _parent.stateOld;
			bIndex = 0;
			_this.hide();
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
            		if(_comp._btns[bIndex].type == "like"){
            			setLikes();
            		}else if(_comp._btns[bIndex].type == "purchase"){
            			purchaseTrailer();
            		}else if(_comp._btns[bIndex].type == "next"){
            			nextEpisode();
            		}else if(_comp._btns[bIndex].type == "finish"){
            			finish();
            		}else if(_comp._btns[bIndex].type == "cancel"){
            			cancel();
            		}
            	}else{
            		if(!isClearPin && ((W.StbConfig.adultMenuUse && list[imgIndex].isAdult)
                        || (list[imgIndex].rating && util.getRating() && list[imgIndex].rating >= util.getRating()))) {
                		var _this = this;
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            childComp:_this
                        };
                        W.PopupManager.openPopup(popup);
                    } else {
                    	if(list[imgIndex].seriesId){
                    		W.entryPath.push("recVodEnd.seriesId", list[imgIndex].seriesId, "VodFinish");
                    	}else{
                    		W.entryPath.push("recVodEnd.sassetId", list[imgIndex].superAssetId, "VodFinish");
                    	}
                		var asset = {sassetId:list[imgIndex].superAssetId, seriesId:list[imgIndex].seriesId};
                    	W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type:list[imgIndex].seriesId ? "S" : "V"},
                            backState: W.SceneManager.BACK_STATE_DESTROY
                        });
                    }
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
        };
        
        this.onPopupClosed = function (popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	isClearPin = true;
                    	for(var i = 0; i < _comp.posters.length; i++) {
                            if(_comp.posters[i].releaseRestrict) {
                            	_comp.posters[i].releaseRestrict();
                            }
                        }
                    	
                    	if(list[imgIndex].seriesId){
                    		W.entryPath.push("recVodEnd.seriesId", list[imgIndex].seriesId, "VodFinish");
                    	}else{
                    		W.entryPath.push("recVodEnd.sassetId", list[imgIndex].superAssetId, "VodFinish");
                    	}
                		var asset = {sassetId:list[imgIndex].superAssetId, seriesId:list[imgIndex].seriesId};
                    	W.SceneManager.startScene({
                            sceneName: "scene/vod/VodDetailScene",
                            param: {data: asset, type:list[imgIndex].seriesId ? "S" : "V", isClearPin:isClearPin},
                            backState: W.SceneManager.BACK_STATE_DESTROY
                        });
                    }
                }
            }
        };
	};

	return VodFinish;
});