W.defineModule("comp/guide/ScheduleForyou", ["mod/Util", "comp/list/Poster"], function(util, Poster) {
	function ScheduleForyou(){
		var _this;
		var _parent;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");
		var recoDataManager = W.getModule("manager/RecommendDataManager");

	    var tmpNo = 0;

	    var backCallbackFunc;
	    var mode = 0;
	    var tops = [475, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var prodTops = [98, 98, 209];

	    var index = 0;
	    var isCategory = true;
	    var _comp;
	    var totalPage = 0;
	    var keyDelayTimeout;
	    var categories;
	    var oldIdx = 0;
	    var prodIdx = 0;
	    var categoryId;

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	    };

	    var createCategory = function(){
	    	_comp._category._bar = new W.Div({x:60, y:40, width:"1280px", height:"1px", className:"line_1px"});
	    	_comp._category.add(_comp._category._bar);

	    	var _area = new W.Div({x:0, y:0, width:"1280px", height:"50px", overflow:"hidden"});
	    	_comp._category.add(_area);
	    	_comp._title_list = new W.Div({x:0, y:0, width:"1280px", height:"50px"});
	    	_area.add(_comp._title_list);

	    	_comp._titles_dim = [];
	    	_comp._titles_foc = [];
	    	for(var i=0; i < categories.length; i++){
	    		_comp._titles_dim[i] = new W.Span({x:66 + 210*i, y:2, width:"200px", height:"22px", textColor:"rgba(205,205,205,0.84)",
	    			textAlign:"center", "font-size":"20px", className:"font_rixhead_light", text:categories[i].title});
	    		_comp._title_list.add(_comp._titles_dim[i]);

	    		_comp._titles_foc[i] = new W.Div({x:66 + 210*i, y:0, width:"200px", height:"27px", textAlign:"center", opacity:0});
	    		_comp._title_list.add(_comp._titles_foc[i]);

	    		_comp._titles_foc[i]._text = new W.Span({position:"relative", y:0, height:"27px", textColor:"rgb(255,255,255)",
	    			"font-size":"25px", className:"font_rixhead_medium", text:categories[i].title});
	    		_comp._titles_foc[i].add(_comp._titles_foc[i]._text);
	    		_comp._titles_foc[i]._bar = new W.Div({position:"relative", y:0, width:(_comp._titles_foc[i]._text.comp.offsetWidth + 20) + "px",
	    			height:"6px", backgroundColor:"rgb(229,48,0)", "border-radius":"3px", display:"inline-block"});
	    		_comp._titles_foc[i].add(_comp._titles_foc[i]._bar);
	    	}

	    	_comp._product = new W.Div({x:0, y:prodTops[mode], width:"1280px", height:"530px"});
	    	_comp.add(_comp._product);

	    	_comp._curr_page = new W.Span({x:1190-9, y:130, width:"25px", height:"17px", textColor:"rgb(255,255,255)",
				textAlign:"right", "font-size":"16px", className:"font_rixhead_medium", text:"", display:"none"});
			_comp.add(_comp._curr_page);
			_comp._total_page = new W.Span({x:1212, y:130, width:"30px", height:"17px", textColor:"rgb(122,122,122)",
				textAlign:"left", "font-size":"16px", className:"font_rixhead_medium", text:"", display:"none"});
			_comp.add(_comp._total_page);

			if(W.SceneManager.getCurrentScene().id.indexOf("ScheduleForyouScene") > 0){
				W.log.info(_comp);
				focus();
			}
	    };

	    var changeProduct = function(){
	    	W.log.info("changeProduct !!!!");
	    	_comp._curr_page.setText("1");
			if(index == 2) {
				totalPage = Math.floor((categories[index].list.length-1)/18) + 1;
			} else {
				totalPage = Math.floor((categories[index].list.length-1)/8) + 1;
			}
	    	_comp._total_page.setText("/ " + totalPage);

	    	if(_comp._product_list){
	    		_comp._product.remove(_comp._product_list);
	    	}
	    	_comp._product_list = new W.Div({x:0, y:index == 2 ? 0:29, height:"372px"});
	    	_comp._product.add(_comp._product_list);

	    	_comp._products = [];
			if(index == 2) {
				for(var i=0; i < categories[index].list.length; i++){
					//_comp._products[i] = new W.Div({x:59 + 297*Math.floor(i/2), y:i%2 == 0 ? 6 : 192, width:"279px", height:"168px"});

					_comp._products[i] = new Poster({type:Poster.TYPE.W113, data:categories[index].list[i], textAlign:i%18 > 14 ? "right":"",
						 isRecommend : true});

					_comp._product_list.add(_comp._products[i].getComp());
					_comp._products[i].getComp().setStyle({x:92 + 123*Math.floor(i/2), y:i%2 == 0 ? -4 : 249});
					//_x += posterGapX;
					//_comp._products[i].add(new W.Image({x:1, y:1, width:"277px", height:"166px", src:"img/box_pack_bg.png"}));
				}

			} else {
				for(var i=0; i < categories[index].list.length; i++){
					_comp._products[i] = new W.Div({x:59 + 297*Math.floor(i/2), y:i%2 == 0 ? 6 : 192, width:"279px", height:"168px"});
					_comp._product_list.add(_comp._products[i]);
					//_comp._products[i].add(new W.Image({x:1, y:1, width:"277px", height:"166px", src:"img/box_pack_bg.png"}));
					_comp._products[i].add(new W.Image({x:0, y:0, width:277, height:166, src:"img/default_ch_thumbnail.png"}));
					
					_comp._products[i]._img = new W.Image({x:0, y:0, width:"277px", height:"166px", src:util.getChThumbUrl(categories[index].list[i].channelSrcId)});
					_comp._products[i].add(_comp._products[i]._img);
					_comp._products[i]._img.comp.addEventListener('error', function(){this.style.visibility="hidden"});

					_comp._products[i]._normal = new W.Div({x:0, y:0, width:"277px", height:"166px"});
					_comp._products[i].add(_comp._products[i]._normal);
					_comp._products[i]._normal.add(new W.Div({x:0, y:0, width:"277px", height:"166px", color:"rgba(0,0,0,0.5)"}));
					_comp._products[i]._normal.add(new W.Image({x:0, y:0, width:"277px", height:"166px", src:"img/thumb_epg_foryou_sh.png"}));
					_comp._products[i]._normal.add(new W.Span({x:17, y:93, width:"240px", height:"16px", textColor:"rgba(160,160,160,1)",
						textAlign:"left", "font-size":"14px", className:"font_rixhead_medium cut", text:categories[index].list[i].channelName}));
					if(categories[index].list[i].schedule) {
						_comp._products[i]._normal.add(new W.Span({x:17, y:112, width:"240px", height:"20px", textColor:"rgba(255,255,255,0.75)",
							textAlign:"left", "font-size":"18px", className:"font_rixhead_medium cut", text:categories[index].list[i].schedule.title}));

						var endTime = util.newDate(categories[index].list[i].schedule.endTime);
						var startTime = util.newDate(categories[index].list[i].schedule.startTime);

						_comp._products[i]._normal.add(new W.Div({x:20, y:145, width:238, height:2, color:"rgba(180,186,196,0.25)"}));
						_comp._products[i]._normal._progressBar = new W.Div({x:20,y:145,
							width:(238/((endTime-startTime)/60/1000))*((new Date().getTime()-startTime)/60/1000), height:2, color:"rgb(193,165,115)"});
						_comp._products[i]._normal.add(_comp._products[i]._normal._progressBar);
					}

					_comp._products[i]._focus = new W.Div({x:0, y:0, width:"277px", height:"166px", display:"none"});
					_comp._products[i].add(_comp._products[i]._focus);
					_comp._products[i]._focus.add(new W.Div({x:0, y:0, width:"277px", height:"166px", color:"rgba(0,0,0,0.7)"}));
					_comp._products[i]._focus.add(new W.Image({x:0, y:0, width:"277px", height:"166px", src:"img/thumb_epg_foryou_sh.png"}));
					_comp._products[i]._focus.add(new W.Span({x:17, y:86, width:"240px", height:"18px", textColor:"rgba(255,255,255,0.9)",
						textAlign:"left", "font-size":"16px", className:"font_rixhead_medium cut", text:categories[index].list[i].channelName}));
					_comp._products[i]._focus.add(new W.Div({x:0, y:-6, width:"277px", height:"4px", color:"rgba(229,49,0,1)"}));
					_comp._products[i]._focus.add(new W.Div({x:0, y:168, width:"277px", height:"4px", color:"rgba(229,49,0,1)"}));
					if(categories[index].list[i].schedule) {
						_comp._products[i]._focus.add(new W.Span({x:17, y:108, width:"240px", height:"24px", textColor:"rgba(255,255,255,0.9)",
							textAlign:"left", "font-size":"22px", className:"font_rixhead_medium cut", text:categories[index].list[i].schedule.title}));

						_comp._products[i]._focus.add(new W.Div({x:17, y:139, textAlign:"left", width:"100px", "font-size":"14px", textColor:"rgb(181,181,181)", fontFamily:"RixHeadL",
							height:14, lineHeight:"14px", text:util.changeDigit(startTime.getHours(),2) + ":" + util.changeDigit(startTime.getMinutes(),2)}));
						_comp._products[i]._focus.add(new W.Div({x:225, y:139, textAlign:"left", width:"100px", "font-size":"14px", textColor:"rgb(181,181,181)", fontFamily:"RixHeadL",
							height:14, lineHeight:"14px", text:util.changeDigit(endTime.getHours(),2) + ":" + util.changeDigit(endTime.getMinutes(),2)}));

						var endTime = util.newDate(categories[index].list[i].schedule.endTime);
						var startTime = util.newDate(categories[index].list[i].schedule.startTime);

						_comp._products[i]._focus.add(new W.Div({x:62, y:145, width:160, height:2, color:"rgba(180,186,196,0.25)"}));
						_comp._products[i]._focus._progressBar = new W.Div({x:62,y:145,
							width:(160/((endTime-startTime)/60/1000))*((new Date().getTime()-startTime)/60/1000), height:2, color:"rgb(237,168,2)"});
						_comp._products[i]._focus.add(_comp._products[i]._focus._progressBar);
					}
				}
			}
	    };

	    var unFocus = function() {
	    	if(isCategory){
	    		if(_comp._titles_dim) _comp._titles_dim[index].setStyle({display:"block"});
	    		if(_comp._titles_foc) _comp._titles_foc[index].setStyle({opacity:0});
	    	}else{
				if(index == 2) {
					_comp._products[prodIdx].unFocus();
				} else {
					_comp._products[prodIdx]._normal.setStyle({display:"block"});
					_comp._products[prodIdx]._focus.setStyle({display:"none"});
				}

	    	}
	    };

	    function focus(isChange) {
	    	if(isCategory){
	    		_comp._titles_dim[index].setStyle({display:"none"});
	    		_comp._titles_foc[index].setStyle({opacity:1});
                _comp._titles_foc[index]._bar.setStyle({opacity:1});
	    		_comp._title_list.setStyle({x:-Math.floor(index/5) * 1050});

	    		if(isChange){
	        		clearTimeout(keyDelayTimeout);
	        		keyDelayTimeout = setTimeout(function(){
	        			if(categories[index].list){
	            			changeProduct();
	            		}else{
	            			var idx = index;
	            			getProducts(idx);
	            		}
	        		}, 300);
	    		}
	    	}else{
                _comp._titles_dim[index].setStyle({display:"none"});
                _comp._titles_foc[index].setStyle({opacity:1});
                _comp._titles_foc[index]._bar.setStyle({opacity:0});

				if(index == 2) {
					_comp._products[prodIdx].setFocus();

					_comp._product_list.setStyle({x:-Math.floor(prodIdx/18) * 1107});

					var currPage = Math.floor(prodIdx/18) + 1;
					_comp._curr_page.setText(currPage);
				} else {
					_comp._products[prodIdx]._focus.setStyle({display:"block"});
					_comp._products[prodIdx]._normal.setStyle({display:"none"});
					_comp._product_list.setStyle({x:-Math.floor(prodIdx/8) * 1188});

					var currPage = Math.floor(prodIdx/8) + 1;
					_comp._curr_page.setText(currPage);
				}
	    	}
	    };

	    function getProducts(idx){
	    	W.Loading.start();
			if(idx == 0) {
				recoDataManager.getChannelFavorite(cbGetProducts);
			} else if(idx == 1) {
				recoDataManager.getPopularChannel(cbGetProducts);
			} else if(idx == 2) {
				recoDataManager.getPopularVod(cbGetProducts);
			}
	    };

	    function cbGetProducts(isSuccess, result) {
	        if(isSuccess) {
				if(result && result.resultList && result.resultList.length > 0) {
					categories[index].list = result.resultList;
					if(index == 2) {
						if(categories[index].list.length > 36) {
							categories[index].list = categories[index].list.splice(0,36);
						}
						changeProduct();
						W.visibleHomeScene();
					} else {
						if(categories[index].list.length > 24) {
							categories[index].list = categories[index].list.splice(0,24);
						}
						var chArray = [];
						for(var i in categories[index].list){
							chArray.push(categories[index].list[i].channelSrcId);
						}
						sdpDataManager.getSchedulesNow(cbGetSchedule, {sourceId:chArray.toString()});
					}
				} else {
					W.PopupManager.openPopup({
						childComp:_this,
						popupName:"popup/ErrorPopup",
						code: (result && result.error && result.error.code) ? result.error.code : "1001",
						message : (result && result.error && result.error.message) ? [result.error.message] : null,
						from : "SDP"
					});
				}
	        } else {
				W.PopupManager.openPopup({
					childComp:_this,
					popupName:"popup/ErrorPopup",
					code: (result && result.error && result.error.code) ? result.error.code : null,
					message : (result && result.error && result.error.message) ? [result.error.message] : null,
					from : "SDP"
				});
	        }

	    	W.Loading.stop();
	    };

	    function cbGetSchedule(isSuccess, result) {
			if(isSuccess) {
				W.log.info(result)
				categories[index].schedule = result;
				for(var i in categories[index].list) {
					if(result[categories[index].list[i].channelSrcId]) {
						categories[index].list[i].schedule = result[categories[index].list[i].channelSrcId];
					}
				}
				W.log.info(categories[index])
				changeProduct();
			} else {

			}
			W.visibleHomeScene();
		};

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };

        this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info("ScheduleForyou show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("ScheduleForyou hide");
        };
        this.create = function(_parentDiv, _p, cateId, isClearPin) {
            W.log.info("create !!!!");
            _parent = _p;
            _this = this;
            index = 0;
            categoryId = cateId;
			_this.isClearPin = isClearPin;
            _comp = new W.Div({id:"product_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});
            _comp._category = new W.Div({x:0, y:125, width:"1280px", height:"50px", opacity:0});
	    	_comp.add(_comp._category);

	    	categories = [{title:W.Texts["customer_fav_ch"]}, {title:W.Texts["live_fav_ch"]}, {title:W.Texts["live_fav_vod"]}];
            setTimeout(createCategory);
			getProducts(index);
            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(_comp._product){
                _comp._product.setStyle({y:prodTops[mode]});
            }

            if(mode == 2){
            	if(_parent.couponInfo){
                	_parent.couponInfo.hideButton();
            	}
            	isCategory = true;
            	_comp._category.setStyle({opacity:1});
            	if(W.SceneManager.getCurrentScene().id.indexOf("HomeScene") > 0){
    				focus();
    			}
				if(_comp._curr_page) _comp._curr_page.setStyle({display:""});
				if(_comp._total_page) _comp._total_page.setStyle({display:""});
            }else{
            	if(_parent.couponInfo){
                	_parent.couponInfo.showButton();
            	}
            	clearTimeout(keyDelayTimeout);
            	if(_comp._category){
                	_comp._category.setStyle({opacity:0});
            	}
            	unFocus();
				if(_comp._curr_page) _comp._curr_page.setStyle({display:"none"});
				if(_comp._total_page) _comp._total_page.setStyle({display:"none"});
            }
        };
        this.hasList = function(){
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode){
                case W.KEY.RIGHT:
                    if(isCategory){
                		unFocus();
                    	index = (++index) % categories.length;
                    	prodIdx = 0;
                    	focus(true);
                        return true;
                    }else{
                    	unFocus();
                    	if(prodIdx + 2 >= categories[index].list.length){
                    		if(prodIdx % 2 == 0){
                    			prodIdx = 0;
                    		}else{
                    			if(categories[index].list.length == 1){
                    				prodIdx = 0;
                    			}else{
                    				prodIdx = 1;
                    			}
                    		}
                    	}else{
                    		prodIdx += 2;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                	if(isCategory){
                		unFocus();
                		index = (--index + categories.length) % categories.length;
                		prodIdx = 0;
                		focus(true);
                        return true;
                    }else{
                    	unFocus();
                    	if(prodIdx - 2 < 0){
                    		if(prodIdx == 0){
                    			if(categories[index].list.length-1 % 2 == 0){
                    				prodIdx = categories[index].list.length-1;
                    			}else{
                    				prodIdx = categories[index].list.length-2;
                    			}
                    		}else{
                    			if(categories[index].list.length-1 % 2 == 1){
                    				prodIdx = categories[index].list.length-1;
                    			}else{
                    				prodIdx = categories[index].list.length-2;
                    			}
                    		}
                    	}else{
                    		prodIdx -= 2;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(isCategory){
                        return true;
                    }else{
                    	unFocus();
                    	if(prodIdx % 2 == 0){
                    		isCategory = true;
                    	}else{
                    		prodIdx--;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(isCategory){
                    	unFocus();
                    	isCategory = false;
                    	focus();
                        return true;
                    }else{
                    	unFocus();
                    	if(prodIdx == categories[index].list.length - 1){
                    		prodIdx = 0;
                    	}else{
                    		prodIdx++;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(isCategory){
                    	unFocus();
                    	isCategory = false;
                    	focus();
                    }else{
                    	if(index == 2){
                    		if(!_this.isClearPin && categories[index].list[prodIdx].rating && util.getRating() && categories[index].list[prodIdx].rating >= util.getRating()) {
                                var popup = {
                                    type:"",
                                    popupName:"popup/AdultCheckPopup",
                                    childComp:_this
                                };
                                W.PopupManager.openPopup(popup);
                            }else{
                            	var param = {};
                        		if(categories[index].list[prodIdx].seriesId){
                        			param.seriesId = categories[index].list[prodIdx].seriesId;
                        		}else{
                        			param.sassetId = categories[index].list[prodIdx].superAssetId;
                        		}
                        		W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
        		    				param:param,
        		    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                            }
                    	}else{
							if(W.state.isVod){
								W.PopupManager.openPopup({
									title:W.Texts["popup_zzim_info_title"],
									popupName:"popup/AlertPopup",
									boldText:W.Texts["vod_alert_msg"],
									thinText:W.Texts["vod_alert_msg2"]}
								);
							} else {
								W.CloudManager.changeChannel(function () {

								}, parseInt(categories[index].list[prodIdx].channelSrcId));
							}
                    	}
                    }
                    return true;
                    break;
                case W.KEY.BACK:
					unFocus();
					prodIdx = 0;
					focus();
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
        this.componentName = "ScheduleForyou";
        
        this.onPopupClosed = function (popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {

						_this.isClearPin = true;
						if(_comp && _comp._products) {
							for(var i=0; i < _comp._products.length; i++){
								if(_comp._products[i].releaseRestrict) _comp._products[i].releaseRestrict();
							}
						}

                    	var param = {};
                		if(categories[index].list[prodIdx].seriesId){
                			param.seriesId = categories[index].list[prodIdx].seriesId;
                		}else{
                			param.sassetId = categories[index].list[prodIdx].superAssetId;
                		}
                		W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
		    				param:param,
		    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
                }
            }
		};
	}

	return {
		getNewComp: function(){
			return new ScheduleForyou();
		}
	}

});