W.defineModule(["mod/Util", "comp/Button"], function(util, buttonComp) {
	var STATE_BTN = 0;
	var STATE_MORE = 1;
	var STATE_CASTING = 2;
	var STATE_EPISODE = 3;
	var BTN_TYPE_TRAILER = 0;
	var BTN_TYPE_UHD = 1;
	var BTN_TYPE_HD = 2;
	var BTN_TYPE_SUBSCRIBED = 3;
	var BTN_TYPE_TERM = 4;
	var BTN_TYPE_LIFETIME = 5;
	var BTN_TYPE_PACKAGE = 6;
    var Detail = function(_parent, _parentDiv, contentsType, sceneType) {
    	var self = this;
    	var detail;
    	var bIdx = 0;
    	var cIdx = 0;
    	var eIdx = 0;
    	var hasMore = false;
    	var totalPage = 0;
    	var seriesEpisode;
    	var state = STATE_BTN;
    	var _comp;
    	var series;
    	var keyTimeout = undefined;
    	var isPurchased;
		var lastIndex = -1;

    	W.log.info("contentsType -------------------------------- " + contentsType);
    	W.log.info("sceneType -------------------------------- " + sceneType);

    	var xPosition = 0;
    	if(sceneType == "channelVod"){
    		_comp = new W.Div({x:117, y:451, width:"1046px", height:"270px"});
        	xPosition = 0;
    	}else{
    		if(contentsType == "Sasset" || contentsType == "asset"){
        		_comp = new W.Div({x:67, y:102, width:"1137px", height:"319px"});
            	xPosition = 265;
    		}else if(contentsType == "series"){
            	_comp = new W.Div({x:67, y:102, width:"1157px", height:"350px"});
            	xPosition = 289;
            	state = STATE_EPISODE;
    		}else if(contentsType == "package"){
            	_comp = new W.Div({x:67, y:206, width:"1046px", height:"270px"});
            	xPosition = 0;
    		}
    	}
		_parentDiv.add(_comp);
		
    	var unfocusStyle = {position:"relative", y:0, height:"19px", textColor:"rgba(255,255,255,0.7)", "font-size":"17px",
    			className:"font_rixhead_light", "padding-right":"10px", "padding-left":"10px", "padding-top":"1px", "padding-bottom":"3px",
    			backgroundColor:"rgb(33,33,33)", border:"1px solid rgb(48,48,48)"};

    	function drawDetail(sceneType, contentsType, _comp, xPosition){
			if(sceneType != "channelVod"){
    			if(contentsType == "Sasset"){
        			_comp._poster = new W.Image({x:0, y:1, width:"224px", height:"318px"});
        			_comp.add(_comp._poster);
        			_comp._poster2 = new W.Image({x:0, y:1, width:"224px", height:"318px", display:"none"});
        			_comp.add(_comp._poster2);
        		}else if(contentsType == "series"){
        			_comp._poster = new W.Image({x:0, y:1, width:"246px", height:"350px"});
        			_comp.add(_comp._poster);
        			_comp._poster2 = new W.Image({x:0, y:1, width:"246px", height:"350px", display:"none"});
        			_comp.add(_comp._poster2);
        		}
    			
    			_comp._poster2.comp.addEventListener('error', function(){
    				_comp._poster.setStyle({display:"block"});
    				_comp._poster2.setStyle({display:"none"});
    			});
        	}
    		
    		_comp._title_area = new W.Div({x:xPosition, y:0, width:"800px", height:"40px", textAlign:"left"});
        	_comp.add(_comp._title_area);
        	
        	
        	var _info1 = new W.Div({x:xPosition, y:52, width:"870px", height:"23px", textAlign:"left", display:"inline-flex"});
        	_comp.add(_info1);
        	var _info12 = new W.Div({id:"detail_icon", position:"relative", y:0, height:"23px", textAlign:"left"});
        	_info1.add(_info12);
        	var _info13 = new W.Div({id:"detail_price", position:"relative", y:0, height:"23px", textAlign:"left"});
        	_info1.add(_info13);
        	_comp._age = new W.Image({position:"relative", y:1, width:"21px", height:"21px", src:"img/info_12_2.png", "padding-right":"5px"});
        	_info12.add(_comp._age);
        	_comp._resolution_sd = new W.Image({position:"relative", y:1, width:"35px", height:"21px", src:"img/info_sd.png", "padding-right":"5px", display:"none"});
        	_info12.add(_comp._resolution_sd);
        	_comp._resolution_hd = new W.Image({position:"relative", y:1, width:"35px", height:"21px", src:"img/info_hd.png", "padding-right":"5px"});
        	_info12.add(_comp._resolution_hd);
        	_comp._resolution_uhd = new W.Image({position:"relative", y:1, width:"44px", height:"21px", src:"img/info_uhd.png", "padding-right":"5px", display:"none"});
        	_info12.add(_comp._resolution_uhd);
        	_comp._hdr = new W.Image({position:"relative", y:1, width:"44px", height:"21px", src:"img/info_hdr.png", "padding-right":"5px"});
        	_info12.add(_comp._hdr);
        	_comp._dub = new W.Image({position:"relative", y:1, width:"41px", height:"21px", src:"img/info_dub.png", "padding-right":"5px"});
        	_info12.add(_comp._dub);
        	_comp._exp = new W.Image({position:"relative", y:1, width:"62px", height:"21px", src:"img/info_explanation.png", "padding-right":"5px"});
        	_info12.add(_comp._exp);
        	_comp._3d = new W.Image({position:"relative", y:1, width:"35px", height:"21px", src:"img/info_3d.png", "padding-right":"5px"});
        	_info12.add(_comp._3d);
        	_comp._streo = new W.Image({position:"relative", y:1, width:"57px", height:"21px", src:"img/info_streo.png", "padding-right":"5px"});
        	_info12.add(_comp._streo);
        	_comp._subTit = new W.Image({position:"relative", y:1, width:"41px", height:"21px", src:"img/info_subtitle.png", "padding-right":"5px"});
        	_info12.add(_comp._subTit);
        	_comp._51 = new W.Image({position:"relative", y:1, width:"35px", height:"21px", src:"img/info_5.png", "padding-right":"5px"});
        	_info12.add(_comp._51);
        	_comp._mobile = new W.Image({position:"relative", y:1, width:"96px", height:"21px", src:"img/info_mobile.png", "padding-right":"5px"});
        	_info12.add(_comp._mobile);
        	_comp._rental_duration = new W.Span({position:"relative", y:-3, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
    			className:"font_rixhead_bold", text:"", "padding-left":"20px"});
        	_info13.add(_comp._rental_duration);
        	_comp._listPrice = new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(181,181,181)", "font-size":"14px",
    			className:"font_rixhead_light strike", text:"", "padding-right":"2px", "margin-left":"7px"});
        	_info13.add(_comp._listPrice);
        	_comp._vat = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
    			className:"font_rixhead_light", text:W.Texts["vat"], "padding-left":"10px"});
        	_info13.add(_comp._vat);
        	_comp._rental_duration2 = new W.Span({position:"relative", y:-3, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
    			className:"font_rixhead_bold", text:"", "padding-left":"20px"});
        	_info13.add(_comp._rental_duration2);
        	_comp._price = new W.Span({position:"relative", y:-2, height:"29px", textColor:"rgb(237,168,2)", "font-size":"26px", 
    			className:"font_rixhead_bold", text:"", "padding-left":"10px"});
        	_info13.add(_comp._price);
        	_comp._price_unit = new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(181,181,181)", "font-size":"14px", 
				className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"3px"})
        	_info13.add(_comp._price_unit);
        	_comp._discount = new W.Span({position:"relative", y:-3, height:"18px", textColor:"rgb(218,188,116)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-left":"10px"});
        	_info13.add(_comp._discount);
        	_comp._rental_guide = new W.Span({position:"relative", y:-2, height:"29px", textColor:"rgb(237,168,2)", "font-size":"26px", 
    			className:"font_rixhead_bold", text:"", "padding-left":"10px"});
        	_info13.add(_comp._rental_guide);
        	
        	var _info2 = new W.Div({x:xPosition+2, y:88, width:"800px", height:"25px", textAlign:"left", display:"inline-flex"});
        	_comp.add(_info2);
        	_comp._star = [];
        	_comp._star_b = [];
        	
        	for(var i=0; i < 5; i++){
        		_comp._star_b[i] = new W.Div({position:"relative", y:0, width:"10px", height:"12px", background:"url('img/info_star.png')", "padding-right":"3px"});
        		_comp._star[i] = new W.Div({y:0, width:"0px", height:"12px", background:"url('img/info_star_f.png')", overflow:"hidden"});
        		_comp._star_b[i].add(_comp._star[i]);
        		_info2.add(_comp._star_b[i]);
        	}
        	
        	_comp._star_point = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px",
    			className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._star_point);
        	_comp._like_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info2.add(_comp._like_bar);
        	_comp._like = new W.Image({position:"relative", y:2, width:"11px", height:"10px", src:"img/info_heart.png", "padding-right":"4px"});
        	_info2.add(_comp._like);
        	_comp._like_point = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._like_point);
        	_comp._open_date_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info2.add(_comp._open_date_bar);
        	_comp._open_date = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._open_date);
        	_comp._run_time_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info2.add(_comp._run_time_bar);
        	_comp._run_time = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._run_time);
        	_comp._genre_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info2.add(_comp._genre_bar);
        	_comp._genre = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._genre);
        	
        	_comp._production_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info2.add(_comp._production_bar);
        	_comp._production = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._production);
        	_comp._aduience_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info2.add(_comp._aduience_bar);
        	_comp._aduience = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info2.add(_comp._aduience);
        	
        	_comp._casting = new W.Div({x:xPosition, y:131 - (contentsType == "series" ? 10 : contentsType == "package" ? 15 : 0), width:"800px", height:"26px"});
        	_comp.add(_comp._casting);
        	
        	_comp._one_line = new W.Span({x:xPosition, y:181, width:"872px", height:"20px", textColor:"rgb(218,188,116)", "font-size":"18px",
        		className:"font_rixhead_light", display:"none"});
        	_comp.add(_comp._one_line);
        	_comp._one_line2 = new W.Span({x:xPosition, y:210, width:"872px", height:"20px", textColor:"rgb(218,188,116)", "font-size":"18px",
        		className:"font_rixhead_light", display:"none"});
        	_comp.add(_comp._one_line2);
        	
        	_comp._synopsis = new W.Div({x:xPosition, y:181 - (contentsType == "series" ? 10 : contentsType == "package" ? 30 : 0), width:"872px", height:"74px"});
        	_comp.add(_comp._synopsis);
        	
        	_comp._series = new W.Div({x:288, y:227, width:"867px", height:"97px", overflow:"hidden"});
    		_comp.add(_comp._series);
    		_comp._series._items = new W.Div({id:"111", x:0, y:0, width:"867px", height:"97px"});
    		_comp._series.add(_comp._series._items);
    		
    		_comp._series._page_info = new W.Div({x:1073, y:293, width:"80px", height:"18px", textAlign:"right", opacity:0.7, display:"none"});
    		_comp.add(_comp._series._page_info);
    		_comp._series._curr_page = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(254,254,254)", "font-size":"18px", 
    			className:"font_rixhead_bold", text:"01 "});
    		_comp._series._total_page = new W.Span({position:"relative", y:0, height:"18px", textColor:"#837a77", "font-size":"18px", 
    			className:"font_rixhead_bold", text:""});
    		_comp._series._page_info.add(_comp._series._curr_page);
    		_comp._series._page_info.add(_comp._series._total_page);
    		
    		_comp._buttons = new W.Div({x:xPosition-1, y:278 + (contentsType == "series" ? 35 : contentsType == "package" ? -50 : 0), width:"839px", height:"41px"});
        	_comp.add(_comp._buttons);
		};
		drawDetail(sceneType, contentsType, _comp, xPosition);
    	
    	var focus = function(isNotChange){
    		if(sceneType == "channelVod") return;
    		W.log.info("focus !!! " + state);
    		if(state == STATE_BTN){
    			if(_comp.btnObjs.length > 0){
        			_parent.detailModule.setPrice(_comp, bIdx);
        			_comp.btnObjs[bIdx].btnComp.focus();
    			}
            }else if(state == STATE_MORE){
            	_comp._more_btnF.setStyle({display:""});
            }else if(state == STATE_EPISODE){
            	if(seriesEpisode.length > 7){
    				_parent.couponInfo.setButton([{color:"R", text:W.Texts["prev_page"]}, {color:"Y", text:W.Texts["optionMenu"]}, {color:"B", text:W.Texts["next_page"]}]);
    			}
            	
            	var page = Math.floor(eIdx/7);
            	_comp._series._curr_page.setText(W.Util.changeDigit(page+1, 2)+ " ");
				_comp._series._items.setStyle({x:-875*page});
            	_comp._series._foc[eIdx]._dim.setStyle({display:"none"});
            	_comp._series._foc[eIdx]._foc.setStyle({display:""});
            	_comp._series._txt[eIdx].setStyle({className:"font_rixhead_medium", textColor:"rgb(255,255,255)"});
            	
            	if(!isNotChange){
            		_parent.episodeKeyLock = true;
                	clearTimeout(keyTimeout);
                	keyTimeout = setTimeout(function(){
                		_parent.setEpisode(eIdx);
                	}, W.Config.KEY_TIMEOUT_TIME);
            	}

            	if(_parent.seriesAssetList[eIdx]){
            		if(_parent.seriesAssetList[eIdx].resume){
                		if(_parent.seriesAssetList[eIdx].resume.offset > 0){
            				_comp._series._foc[eIdx]._prog.setStyle({display:""});
            			}else{
                        	_comp._series._foc[eIdx]._prog.setStyle({display:"none"});
            			}
                	}else{
                		_parent.sdpDataManager.getViewingOffset(function(result, data){
                			if(result && data.data[0]){
                				_parent.seriesAssetList[eIdx].resume = data.data[0].resume;
                			}else{
                				_parent.seriesAssetList[eIdx].resume = {offset:0};
                			}
                			
                			if(_parent.seriesAssetList[eIdx].resume.offset == 0){
                				_comp._series._foc[eIdx]._prog.setStyle({display:"none"});
                			}else{
                    			var duration = util.getRunningTime(_parent.seriesAssetList[eIdx].runtime, false, _parent.seriesAssetList[eIdx].runningTime);
                    			if(_parent.seriesAssetList[eIdx].resume.offset > duration){
                    				_parent.seriesAssetList[eIdx].resume.offset = duration;
        	    				}
                                var width = 97 * (_parent.seriesAssetList[eIdx].resume.offset/duration)
                                
        						_comp._series._foc[eIdx]._prog.add(new W.Image({x:0, y:0, width:"2px", height:"3px", src:"img/02_epi_pr_l.png"}));
        						_comp._series._foc[eIdx]._prog.add(new W.Div({x:2, y:0, width:width, height:"3px", backgroundColor:"rgb(237,168,2)"}));
        						_comp._series._foc[eIdx]._prog.add(new W.Image({x:2+width, y:0, width:"2px", height:"3px", src:"img/02_epi_pr_r.png"}));
                            	_comp._series._foc[eIdx]._prog.setStyle({display:""});
                			}
                		}, {assetId:_parent.seriesAssetList[eIdx].assetId});
                	}
            	}
            }else if(state == STATE_CASTING){
            	_comp._actor[cIdx].setStyle({border:"3px solid rgb(230,48,0)", "padding-right":"8px", "padding-left":"8px"});
            }
    	};
    	
    	var unFocus = function(isReset){
    		W.log.info("unFocus !!!!! " + state);
    		if(state == STATE_BTN){
    			if(_comp.btnObjs[bIdx]){
        			_comp.btnObjs[bIdx].btnComp.unFocus();
    			}
    			if(isReset){
            		bIdx = 0;
    			}
            }else if(state == STATE_MORE){
            	_comp._more_btnF.setStyle({display:"none"});
            }else if(state == STATE_EPISODE){
            	_parent.couponInfo.setButton([{color:"Y", text:W.Texts["optionMenu"]}]);
            	_comp._series._foc[eIdx]._prog.setStyle({display:"none"});
            	if(isReset){
                	_comp._series._foc[eIdx]._dim.setStyle({display:""});
            	}else{
                	_comp._series._foc[eIdx]._dim.setStyle({display:"none"});
            	}
            	_comp._series._foc[eIdx]._foc.setStyle({display:"none"});
            	_comp._series._txt[eIdx].setStyle({className:"font_rixhead_light", textColor:"rgba(205,205,205,0.84)"});
            }else if(state == STATE_CASTING){
            	_comp._actor[cIdx].setStyle({border:"1px solid rgb(48,48,48)", "padding-right":"10px", "padding-left":"10px"});
            	if(isReset){
            		cIdx = 0;
    			}
            }
    	};
    	
    	var setData = function(){
    		isPurchased = false;
    		W.log.info(sceneType);
    		if(sceneType != "channelVod"){
	    		if(contentsType == "Sasset" || contentsType == "series"){
	    		    _comp._poster.setSrc(util.getPosterFilePath(detail.posterBaseUrl, contentsType == "Sasset" ? 224 : 246));
	    		    
	    		    var description = undefined;
	    			var posterUrl = undefined;
	    			
	    			if(_parent.detail.events && _parent.detail.events.length > 0){
	    				description = _parent.detail.events[0].description;
	    				posterUrl = W.Config.IMAGE_URL + _parent.detail.events[0].posterUrl;
	    			}else{
	    				if(_parent.detail.coupons && _parent.detail.coupons.length > 0){
	    					description = _parent.detail.coupons[0].description;
	        				posterUrl = W.Config.IMAGE_URL + _parent.detail.coupons[0].posterUrl;
	        			}
	    			}
	    			
	    			if(description){
	    				_parent._parentDiv._event._text.setText(description);
						_parent._parentDiv._event.setStyle({display:"block"});
	    			}else{
	    				_parent._parentDiv._event.setStyle({display:"none"});
	    			}
	    			
	    			if(_comp._poster){
	    				if(posterUrl){
	            			_comp._poster2.setSrc(posterUrl);
	            			_comp._poster2.setStyle({display:"block"});
	            			_comp._poster.setStyle({display:"none"});
	        			}else{
	            			_comp._poster2.setStyle({display:"none"});
	            			_comp._poster.setStyle({display:"block"});
	        			}
	    			}
	    		}
    		}
    		W.log.info(detail);
			detail.oneLineReviewLength = 0;

    		var hasAward = false;
    		if(detail.contentType == "Sasset"){
    			if(detail.awardInfoList && detail.awardInfoList.length > 0){
    				hasAward = true;
    			}
    			if(detail.oneLineReview){
    				var txts = util.geTxtArray(detail.oneLineReview, "RixHeadL", 18, 800, 2);
    				if(txts.length > 1){
    					_comp._one_line.setText(txts[0]);
        				_comp._one_line.setStyle({display:"block"});
        				_comp._one_line2.setText(txts[1]);
        				_comp._one_line2.setStyle({display:"block"});
        				_comp._synopsis.setStyle({y:181 + 60});
        				detail.oneLineReviewLength = 2;
    				}else{
    					_comp._one_line.setText(txts[0]);
        				_comp._one_line.setStyle({display:"block"});
        				_comp._one_line2.setText("");
        				_comp._one_line2.setStyle({display:"none"});
        				_comp._synopsis.setStyle({y:181 + 30});
        				detail.oneLineReviewLength = 1;
    				}
    			}else{
    				_comp._one_line.setText("");
    				_comp._one_line.setStyle({display:"none"});
    				_comp._one_line2.setText("");
    				_comp._one_line2.setStyle({display:"none"});
    				_comp._synopsis.setStyle({y:181});
    				detail.oneLineReviewLength = 0;
    			}
    		}
    		

    		
    		
    		var title;
    		var isPinned = false;
    		if(detail.contentType == "series"){
    			var tmpTitle = util.geTxtArray(detail.members[0].title, "RixHeadM", 36, 730, 1);
    			if(tmpTitle.length > 1){
        			title = tmpTitle[0] + "... ";
    			}else{
        			title = tmpTitle[0] + " ";
    			}
    			if(detail.members[0].isPinned){
    				isPinned = true;
    			}
    		}else{
    			var tmpTitle = util.geTxtArray(detail.title, "RixHeadM", 36, 730, 1);
    			if(tmpTitle.length > 1){
        			title = tmpTitle[0] + "... ";
    			}else{
        			title = tmpTitle[0] + " ";
    			}
    			if(detail.isPinned){
    				isPinned = true;
    			}
    		}

    		if(_comp._title) _comp._title_area.remove(_comp._title);
    		if(_comp._winner) _comp._title_area.remove(_comp._winner);
    		if(_comp._favorite) _comp._title_area.remove(_comp._favorite);

    		_comp._title = new W.Span({position:"relative", y:1, height:"39px", textColor:"rgb(255,255,255)", "font-size":"36px", 
    			className:"font_rixhead_medium", text:title});
			_comp._title_area.add(_comp._title);
			if(hasAward){
				_comp._winner = new W.Image({position:"relative", y:6, width:"24px", height:"32px", src:"img/icon_winner.png", display:"inline"});
				_comp._title_area.add(_comp._winner);
			}
			if(isPinned){
				_comp._favorite = new W.Image({position:"relative", y:-9, width:"17px", height:"17px", src:"img/favor_star.png", "padding-left":"10px", display:"inline"});
        		_comp._title_area.add(_comp._favorite);
        	}
    		
    		if(detail.isProductSuwha){
        		_comp._exp.setStyle({display:"inline"});
    		}else{
        		_comp._exp.setStyle({display:"none"});
    		}
    		
    		if(Number(detail.rating) == 0){
    			_comp._age.setSrc("img/info_all_2.png");
    		}else if(Number(detail.rating) == 7){
    			_comp._age.setSrc("img/info_7_2.png");
    		}else if(Number(detail.rating) == 12){
    			_comp._age.setSrc("img/info_12_2.png");
    		}else if(Number(detail.rating) == 15){
    			_comp._age.setSrc("img/info_15_2.png");
    		}else{
    			_comp._age.setSrc("img/info_19_2.png");
    		}

    		_comp._hdr.setStyle({display:"none"});
			_comp._resolution_sd.setStyle({display:"none"});
			_comp._resolution_hd.setStyle({display:"none"});
			_comp._resolution_uhd.setStyle({display:"none"});
			
			if(detail.isHDR){
    			_comp._hdr.setStyle({display:"inline"});
    		}else if(detail.isSD){
    			_comp._resolution_sd.setStyle({display:"inline"});
    		}else if(detail.isHD){
    			_comp._resolution_hd.setStyle({display:"inline"});
    		}else if(detail.isUHD){
    			_comp._resolution_uhd.setStyle({display:"inline"});
    		}
    		
    		if(detail.isProductDubbing){
    			_comp._dub.setStyle({display:"inline"});
    		}else{
    			_comp._dub.setStyle({display:"none"});
    		}
    		if(detail.isProductDVS){
    			_comp._exp.setStyle({display:"inline"});
    		}else{
    			_comp._exp.setStyle({display:"none"});
    		}
    		

    		if(detail.is3D){
    			_comp._3d.setStyle({display:"inline"});
    		}else{
    			_comp._3d.setStyle({display:"none"});
    		}
    		if(detail.isAudioStereo){
    			_comp._streo.setStyle({display:"inline"});
    		}else{
    			_comp._streo.setStyle({display:"none"});
    		}
    		if(detail.isProductCaption){
    			_comp._subTit.setStyle({display:"inline"});
    		}else{
    			_comp._subTit.setStyle({display:"none"});
    		}
    		if(detail.isAudioDolby51){
    			_comp._51.setStyle({display:"inline"});
    		}else{
    			_comp._51.setStyle({display:"none"});
    		}

    		if(detail.isNscreen){
    			_comp._mobile.setStyle({display:"inline"});
    		}else{
    			_comp._mobile.setStyle({display:"none"});
    		}
    		
    		var starRating = detail.starRating;
    		if(detail.contentType == "series"){
    			starRating = detail.members[0].starRating;
    		}

    		if(starRating && starRating.point > 0){
        		var point = starRating.point / 2;
        		for(var i=0; i < 5; i++){
        			if(i+1 < point){
        				_comp._star[i].setStyle({width:"10px"});
        			}else if(point > i+1){
        				_comp._star[i].setStyle({width:"0px"});
        			}else{
        				_comp._star[i].setStyle({width:(10*(point-i)) + "px"});
        			}
    				_comp._star_b[i].setStyle({display:""});
        		}
        		_comp._star_point.setText(starRating.point);
        		_comp._star_point.setStyle({display:""});
    		}else{
    			for(var i=0; i < 5; i++){
    				_comp._star_b[i].setStyle({display:"none"});
        		}
        		_comp._star_point.setStyle({display:"none"});
    		}
    		
    		if(detail.likes){
    			_comp._like_bar.setStyle({display:"inline-block"});
    			_comp._like.setStyle({display:"inline-block"});
    			_comp._like_point.setStyle({display:"inline-block"});
    			_comp._like_point.setText(W.Util.formatComma(detail.likes > 9999 ? 9999 : detail.likes,3));
    		}else{
    			_comp._like_bar.setStyle({display:"none"});
    			_comp._like.setStyle({display:"none"});
    			_comp._like_point.setStyle({display:"none"});
    		}
    		
    		if(detail.contentType == "Sasset"){
    			for(var i=0; i < detail.members.length; i++){
        			detail.members[i].isLiked = detail.isLiked;
        			detail.members[i].likes = detail.likes;
    			}
    		}
    		var releaseYear = undefined;
    		if(detail.members){
    			releaseYear = detail.members[0].releaseYear;
    		}
    		var runningTime;
    		
    		if(detail.contentType == "series"){
    			runningTime = detail.members[0].runningTime;
    		}else{
    			if(detail.asset){
        			runningTime = detail.asset.runningTime;
    			}
    		}
    		if(releaseYear){
    			if(!starRating && !detail.isLiked){
	    			_comp._open_date_bar.setStyle({display:"none"});
				}else{
	    			_comp._open_date_bar.setStyle({display:"inline-block"});
				}
    			_comp._open_date.setStyle({display:"inline-block"});
    			_comp._open_date.setText(releaseYear + " " + W.Texts["release_vod"]);
    		}else{
    			_comp._open_date_bar.setStyle({display:"none"});
    			_comp._open_date.setStyle({display:"none"});
    			_comp._open_date.setText("");
    		}
    		
    		if(runningTime){
        		if(runningTime.indexOf(":") > -1){
        			runningTime = util.getRunningTime(runningTime, true);
        		}
    			_comp._run_time_bar.setStyle({display:"inline-block"});
    			_comp._run_time.setStyle({display:"inline-block"});
    			_comp._run_time.setText(runningTime + W.Texts["minute"]);
    		}else{
    			_comp._run_time_bar.setStyle({display:"none"});
    			_comp._run_time.setStyle({display:"none"});
    			_comp._run_time.setText("");
    		}

    		_comp._genre.setText(detail.genre);
    		
    		_comp._production_bar.setStyle({display:"none"});
			_comp._production.setStyle({display:"none"});
			_comp._aduience_bar.setStyle({display:"none"});
			_comp._aduience.setStyle({display:"none"});
    		if(detail.contentType == "Sasset"){
    			if(detail.productionList && detail.productionList.length > 0){    				
    				var txt = detail.productionList.toString();
    				var arr = util.geTxtArray(txt, "RixHeadL", 16, 300, 1);
    				if(arr.length > 1){
    					txt = arr[0].substr(0, arr[0].lastIndexOf(","))
    					txt += " ...";
    				}
    				
    				_comp._production.setText(W.Texts["production"] + " " + txt);
    				_comp._production_bar.setStyle({display:"inline-block"});
    				_comp._production.setStyle({display:"inline-block"});
    			}

    			if(detail.audienceCount){
    				if(detail.audienceCount >= 1000000){
    					_comp._aduience.setStyle({textColor:"rgb(237,168,2)"});
    				}
    				_comp._aduience.setText(W.Texts["aduience_count"].replace("@count@", W.Util.formatComma(detail.audienceCount, 3)));
    				_comp._aduience_bar.setStyle({display:"inline-block"});
    				_comp._aduience.setStyle({display:"inline-block"});
    			}
    		}

    		if(_comp._casting._area){
    			_comp._casting.remove(_comp._casting._area);
    		}
			_comp._actor = [];
		    _comp._name = [];
    		var tmpNo = 0;
    		_comp._casting._area = new W.Div({x:0, y:0, width:sceneType == "channelVod" ? 1100 : 800, height:"26px", textAlign:"left"});
    		_comp._casting.add(_comp._casting._area);
    		
    		if(sceneType == "package" || sceneType == "channelVod"){
    			if(detail.director){
    				_comp._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgba(173,173,173,0.8)", "font-size":"18px",
        				className:"font_rixhead_light", text:W.Texts["director"], "padding-right":"10px"}));
    				_comp._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgba(255,255,255,0.8)", "font-size":"18px",
        				className:"font_rixhead_light", text:detail.director, "padding-right":"35px"}));
    				_comp._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgba(173,173,173,0.8)", "font-size":"18px",
        				className:"font_rixhead_light", text:W.Texts["actors"], "padding-right":"10px"}));
    				var texts = util.geTxtArray(detail.actor, "RixHeadL", 18, 800, 1);
    				var actors = texts[0];
    				if(texts.length > 1){
    					actors = actors.substr(0, actors.lastIndexOf(","))
    					actors += " ...";
    				}
    				
    				
    				_comp._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgba(255,255,255,0.8)", "font-size":"18px",
        				className:"font_rixhead_light", text:actors}));
    			}
    		}else{
    			hasMore = false;
    			var _tmp = new W.Span(unfocusStyle);
        		_tmp.setText("123");
        		_tmp.setStyle({"display":"none"});
        		_comp._casting._area.add(_tmp);
        		
        		var actors = [];
        		var director = undefined;
        		if(detail.contentType == "series"){
        			if(detail.members[0]){
        				if(detail.members[0].actor && detail.members[0].actor != "-"){
                			actors = detail.members[0].actor.split(",");
                		}
        				if(detail.members[0].director && detail.members[0].director != "-"){
        					director = detail.members[0].director;
                		}
            		}
        		}else{
        			if(detail.director && detail.director != "-"){
        				director = detail.director;
        			}
        			if(detail.actor && detail.actor != "-"){
        				actors = detail.actor.split(",");
        			}
        		}

        		if(director){
        			hasMore = true;
        			_comp._directorT = new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px",
        				className:"font_rixhead_light", text:W.Texts["director"], "padding-right":"10px"});
        			_comp._casting._area.add(_comp._directorT);
        			_comp._actor[tmpNo] = new W.Span(unfocusStyle);
        			_comp._actor[tmpNo].setStyle({y:-2, className:"font_rixhead_light", "margin-right":"35px", "padding":"5px 10px 5px"});
        			_comp._casting._area.add(_comp._actor[tmpNo]);
        			_comp._actor[tmpNo].setText(director);
        			_comp._name[tmpNo] = {type:"director", text:director};
        			tmpNo++;
        		}

        		if(actors.length > 0){
        			hasMore = true;
            		_comp._actorT = new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgb(255,255,255)", className:"font_rixhead_light", "font-size":"18px",
            			text:W.Texts["actors"], "padding":"5px 10px 5px"});
            		_comp._casting._area.add(_comp._actorT);

            		var firstActorLeft = 0;
            		
            		for(var i=0; i < actors.length; i++){
            			if(i == 3) break;
            			_comp._actor[tmpNo] = new W.Span(unfocusStyle);
            			_comp._actor[tmpNo].setStyle({y:-2, className:"font_rixhead_light", "margin-right":"8px", "padding":"5px 10px 5px"});
            			_comp._actor[tmpNo].setText(actors[i]);
            			_comp._casting._area.add(_comp._actor[tmpNo]);
            			_comp._name[tmpNo] = {type:"actor", text:actors[i]};
            			
            			if(_comp._actor[tmpNo].comp.offsetLeft + _comp._actor[tmpNo].comp.offsetWidth > 800){
            				_comp._casting._area.remove(_comp._actor[tmpNo]);
            				_comp._name.pop();
            				_comp._actor.pop();
            				break;
            			}
            			
            			var offsetLeft = _comp._actor[tmpNo].comp.offsetLeft;
            			
            			if(i == 0){
            				firstActorLeft = offsetLeft;
            			}else{
            				if(offsetLeft <= firstActorLeft){
            					_comp._casting._area.remove(_comp._actor[tmpNo]);
            					_comp._actor.pop();
                    			_comp._name.pop();
                    			break;
            				}
            			}
            			tmpNo++;
            		}	
        		}
    		}
    		
    		if(_comp._synopsis._text && _comp._synopsis._text.length > 0){
    			for(var i=0; i < _comp._synopsis._text.length; i++){
    				_comp._synopsis.remove(_comp._synopsis._text[i]);
    			}
    		}
    		_comp._synopsis._text = [];		
    		W.log.info("contentsType ================= " + contentsType);
    		
    		
    		if(detail.synopsis){
    			hasMore = true;
    		}
    		if(detail.contentType == "Sasset"){
				if((detail.awardInfoList && detail.awardInfoList.length > 0) || detail.stillcutCount){
					hasMore = true;
				}
			}
    		
    		var synopsis = detail.synopsis;
    		if(detail.contentType == "series"){
    			synopsis = detail.members[0].synopsis;
    		}
    		if(!synopsis){
    			synopsis = "";
    		}

    		var synopsisLineCount = (contentsType == "Sasset" && !detail.oneLineReview) ? 3 : 2;
    		if(sceneType == "channelVod"){
    			synopsisLineCount = 2;
    		}
    		
    		if(detail.oneLineReviewLength == 2){
    			synopsisLineCount = 1;
    		}

    		var txts = util.geTxtArray(synopsis, "RixHeadL", 19, 850, synopsisLineCount);
    		W.log.info("synopsisLineCount ===== " + synopsisLineCount);
    		W.log.info(txts);
    		for(var i=0; i < txts.length; i++){
    			var width = 0;
    			var className = "font_rixhead_light";
				var textAlign = "justify";
    			if(i < synopsisLineCount-1){
    				width = 872;
    			}else{
        			if(contentsType == "series"){
        				width = 750;
        			}else if(sceneType == "package" || sceneType == "channelVod"){
        				width = 800;
        			}else{
        				width = 750;
        			}
        			className = "font_rixhead_light cut";
					textAlign = "left";
    			}
    			//if(i == 0){
    			//	width += 20;
    			//}
    			
    			var synob = txts[i];
    			//if(i == synopsisLineCount - 1){
    			//	synob += "...";
    			//}
    			if(sceneType == "package" || sceneType == "channelVod"){
        			_comp._synopsis._text[i] = new W.Span({x:0, y:i*28, width:width + "px", height:"21px", 
        				textColor:"rgba(181,181,181,0.5)", "font-size":"19px", textAlign:textAlign, className:className, text:synob});
    			}else{
        			_comp._synopsis._text[i] = new W.Span({x:0, y:i*28, width:width + "px", height:"21px", 
        				textColor:"rgb(181,181,181)", "font-size":"19px", textAlign:textAlign, className:className, text:synob});
    			}
				_comp._synopsis.add(_comp._synopsis._text[i]);
    			if(i == synopsisLineCount - 1){
    				break;
    			}
    		}

    		if(sceneType != "package" && sceneType != "channelVod"){
	    		if(_comp._more_btn){
	    			_comp.remove(_comp._more_btn);
	    		}
	    		var btnY = synopsisLineCount == 3 ? 51 : synopsisLineCount == 2 ? 23 : 5;
	    		_comp._more_btnF = new W.Image({x:782 - (contentsType == "series" ? 24 : 0), y:btnY, width:"78px", height:"27px", src:"img/deatail_plus_f.png", display:"none"});
	    		_comp._synopsis.add(_comp._more_btnF);
	    		
	    		if(contentsType == "series"){
//	    			hasMore = txts.length > synopsisLineCount ? true : false;
	    			_comp._more_btn = new W.Image({x:782 - (contentsType == "series" ? 24 : 0)+3, y:btnY+3, width:"66px", height:"21px", src:"img/deatail_plus.png", display:hasMore ? "" : "none"});
	    		}else{
//	    			hasMore = txts.length > synopsisLineCount ? true : false;
//	    			if(detail.contentType == "Sasset"){
//	    				if((detail.awardInfoList && detail.awardInfoList.length > 0) || detail.stillcutCount){
//	    					hasMore = true;
//	    				}
//	    			}
	    			_comp._more_btn = new W.Image({x:782 - (contentsType == "series" ? 24 : 0)+3, y:btnY+3, width:"66px", height:"21px", src:"img/deatail_plus.png", display:hasMore ? "" : "none"});
	    		}
	    		_comp._synopsis.add(_comp._more_btn);
	    		
    		}

    		if(_comp.btnObjs){
    			for(var i=0; i < _comp.btnObjs.length; i++){
        			_comp._buttons.remove(_comp.btnObjs[i].btnComp.getComp());
        		}
    		}
    		W.log.info(detail);
    		_comp.btnObjs = [];
    		
    		if(sceneType == "channelVod"){
				_comp._rental_duration.setStyle({display:"none"});
        		_comp._listPrice.setStyle({display:"none"});
        		_comp._price.setStyle({display:"none"});
        		_comp._price_unit.setStyle({display:"none"});
        		_comp._discount.setStyle({display:"none"});
        		_comp._rental_guide.setStyle({display:"none"});
        		_comp._vat.setStyle({display:"none"});
    			if(detail.asset){
    				_comp._vat.setStyle({display:"inline-block"});
            		if(detail.asset.rentalPeriod){
                		if(detail.asset.rentalPeriod.unit == "D"){
                			if(detail.asset.rentalPeriod.value == 999){
                    			_comp._rental_duration.setText(W.Texts["detail_rental_duration_lifetime"]);
                			}else{
                    			_comp._rental_duration.setText(W.Texts["detail_rental_duration"].replace("@date@", detail.asset.rentalPeriod.value));
                			}
                		}else if(detail.asset.rentalPeriod.unit == "M"){
                			if(detail.asset.rentalPeriod.value == 999){
                    			_comp._rental_duration.setText(W.Texts["detail_rental_duration_lifetime"]);
                			}else{
                    			_comp._rental_duration.setText(W.Texts["detail_rental_duration2"].replace("@month@", detail.asset.rentalPeriod.value));
                			}
                		}
            			_comp._rental_duration.setStyle({display:"inline-block"});
            		}

            		var targetObject = detail.asset;
            		if(detail.asset.products && detail.asset.products[0]){
            			targetObject = detail.asset.products[0];
            			if(targetObject.coupons && targetObject.coupons.length > 0){
            				var coupons = [];
            				var couponNos = [];
            				for(var i=0; i < targetObject.coupons.length; i++){
            					if(couponNos.indexOf(targetObject.coupons[i].couponNo) == -1){
            						couponNos.push(targetObject.coupons[i].couponNo);
            						coupons.push(targetObject.coupons[i]);
            					}
            				}
            				targetObject.coupons = coupons;
            			}
            		}
            		var price = util.getPrice(targetObject);

        			if(price == 0 || util.isWatchable(detail.asset)){
        				_comp._price.setText(W.Texts["price_free"]);
            			_comp._price.setStyle({display:"inline-block"});
        			}else{
        				var listPrice = util.vatPrice(targetObject.listPrice);
        				var discountPrice = listPrice - price;
        				
        				_comp._price.setText(W.Util.formatComma(price, 3));
            			_comp._price.setStyle({display:"inline-block"});
                		_comp._price_unit.setStyle({display:"inline-block"});
                		
                		if(discountPrice){
                			_comp._listPrice.setText(W.Util.formatComma(listPrice, 3) + W.Texts["price_unit"]);
                    		_comp._discount.setText(W.Texts["discount"].replace("@price@", W.Util.formatComma(discountPrice, 3)));
                    		
                    		_comp._listPrice.setStyle({display:"inline-block"});
                    		_comp._discount.setStyle({display:"inline-block"});
                		}
        			}
    			}
    		}else{
    			var products = _parent.detailModule.setProduct(detail);
        		var btnNames = [
        		    W.Texts["detail_button_watch1"], 
        		    W.Texts["detail_button_purchase1"], 
        		    W.Texts["detail_button_purchase2"], 
        		    W.Texts["detail_button_purchase3"], 
        		    W.Texts["detail_button_purchase4"], 
        		    W.Texts["detail_button_purchase5"], 
        		    W.Texts["detail_button_purchase6"]
        		];
        		var btnNames2 = [
        		    W.Texts["detail_button_watch1"], 
        		    W.Texts["detail_button_watch2"], 
        		    W.Texts["detail_button_watch2"], 
        		    W.Texts["detail_button_watch7"],  
        		    W.Texts["detail_button_watch2"],
        		    W.Texts["detail_button_watch3"], 
        		    W.Texts["detail_button_watch4"]
        		];

        		for(var i=0; i < products.length; i++){
        			if(products[i].assets.length > 0){
        				var hasEventIcon = false;
        				if(products[i].isPurchasedCount > 0){
        					var buttonName = btnNames2[i];
        					if(i == 1){
        						buttonName = "UHD " + W.Texts["watching"];
        					}else if(i == 2){
        						if(products[i].assets[0].resolution == "SD"){
        							buttonName = "SD " + W.Texts["watching"];
            					}else{
            						buttonName = "HD " + W.Texts["watching"];
            					}
        					}
        					if(i == 0 && products[i].assets.length > 1){
        						products[i].btnComp = buttonComp.create(0, 0, buttonName + "(" + products[i].assets.length + ")", 163, undefined, undefined, 19);
        					}else{
            					if(products[i].isFod){
            						if(i == 1){
            							buttonName = W.Texts["detail_button_watch6"];
            						}else{
            							buttonName = W.Texts["detail_button_watch5"];
            						}
            					}else if(products[i].isZeroPrice){
            						buttonName = W.Texts["detail_button_watch5"];
            					}

                				products[i].btnComp = buttonComp.create(0, 0, buttonName, 143);
        					}
        				}else{
        					var btnName = btnNames[i];
        					if(i == 2 && products[i].assets[0].resolution == "SD"){
        						btnName = btnName.replace("HD", "SD");
        					}
        					W.log.info("================================");
        					W.log.info(products[i]);
        					if(products[i].products.length > 1){
        						var zeroPriceCount = 0;
        						for(var k=0; k < products[i].products.length; k++){
        							if(products[i].products && products[i].products[k] && products[i].products[k].listPrice == 0){
        								zeroPriceCount++;
        							}
        						}
        						var buttonName = btnName;
        						if(zeroPriceCount == products[i].products.length){
        							products[i].isZeroPrice = true;
        							buttonName = W.Texts["detail_button_watch5"];
        						}
        						if(i == 5){
        							products[i].btnComp = buttonComp.create(btnLeft, 0, buttonName + "(" + products[i].products.length + ")", 163, undefined, undefined, 19);
        						}else{
        							products[i].btnComp = buttonComp.create(btnLeft, 0, buttonName + "(" + products[i].products.length + ")", 143);
        						}
        					}else{
        						if(products[i].products && products[i].products[0] && products[i].products[0].listPrice == 0){
        							products[i].isZeroPrice = true;
            						products[i].btnComp = buttonComp.create(btnLeft, 0, W.Texts["detail_button_watch5"], 143);
        						}else{
            						products[i].btnComp = buttonComp.create(btnLeft, 0, btnName, 143);
        						}
        					}
        					
            				for(var j=0; j < products[i].assets.length; j++){
            					if(products[i].assets[j] && products[i].assets[j].events){
                					products[i].btnComp.showEventIcon();
                					hasEventIcon = true;
                					products[i].event = products[i].assets[j].events[0];
                					break;
                				}
            				}
        				}
        				
        				if(!hasEventIcon && products[i].isPurchasedCount == 0){
        					for(var j=0; j < products[i].products.length; j++){
            					if(products[i].products[j].discountPrice && products[i].products[j].discountPrice > 0){
                					products[i].btnComp.showDcIcon();
                					break;
                				}
            				}
        					for(var j=0; j < products[i].assets.length; j++){
            					if(products[i].assets[j] && products[i].assets[j].coupons){
                					products[i].coupon = products[i].assets[j].coupons[0];
                					break;
                				}
            				}
        				}
        			}else{
        				products[i] = null;
        			}
        		}
        		var btnLeft = 0;
        		var no = 0;
        		//?��?��?��?��  ?��?���? 보여�?�?
        		if(products[0]){
        			_comp.btnObjs[no] = products[0];
        			_comp.btnObjs[no].type = 0;
        			_comp.btnObjs[no].btnComp.setX(btnLeft);
        			no++;
        			btnLeft += 151;
        			if(products[0].assets.length > 1){
    					btnLeft += 20;
    				}
        		}
        		
        		if(products[1]){
        			if(
        				(products[3] && products[3].isPurchasedCount > 0) || 
        				(products[4] && products[4].isPurchasedCount > 0)
        			){
        				//HD ?��?�� ?���? 곳에?�� 구매�? ?�� 경우 ?�� 보여�?�?
        			}else{
        				_comp.btnObjs[no] = products[1];
            			_comp.btnObjs[no].type = 1;
            			_comp.btnObjs[no].btnComp.setX(btnLeft);
            			no++;
            			btnLeft += 151;
        			}
        		}
        		if(products[2]){
        			if(
        				(products[1] && products[1].isPurchasedCount > 0) || 
        				(products[3] && products[3].isPurchasedCount > 0) || 
        				(products[4] && products[4].isPurchasedCount > 0)
        			){
        				//?���? 곳에?�� 구매�? ?��?�� ?��?���? ?�� 보여�?�?
        			}else{
        				_comp.btnObjs[no] = products[2];
            			_comp.btnObjs[no].type = 2;
            			_comp.btnObjs[no].btnComp.setX(btnLeft);
            			no++;
            			btnLeft += 151;
        			}
        		}
        		//?��?��?�� ?��?���? 보여�?�?
        		if(products[3]){
        			_comp.btnObjs[no] = products[3];
        			_comp.btnObjs[no].type = 3;
        			_comp.btnObjs[no].btnComp.setX(btnLeft);
        			no++;
        			btnLeft += 151;
        		}
        		
        		if(products[4]){
        			_comp.btnObjs[no] = products[4];
        			_comp.btnObjs[no].type = 4;
        			_comp.btnObjs[no].btnComp.setX(btnLeft);
        			no++;
        			btnLeft += 151;
        		}
        		
        		if(products[5]){
        			if((products[3] && products[3].isPurchasedCount > 0) || (products[4] && products[4].isPurchasedCount > 0)){
        				//?��?��?�� 구매?��?��?�� ?�� 보여�?�?
        			}else{
        				_comp.btnObjs[no] = products[5];
            			_comp.btnObjs[no].type = 5;
            			_comp.btnObjs[no].btnComp.setX(btnLeft);
            			no++;
            			btnLeft += 151;
        				if(products[5].assets.length > 1){
        					btnLeft += 20;
        				}
        			}
        		}
        		
        		//?��?���? ?��?���? 보여�?�?
        		if(products[6]){
        			_comp.btnObjs[no] = products[6];
        			_comp.btnObjs[no].type = 6;
        			_comp.btnObjs[no].btnComp.setX(btnLeft);
        			no++;
        			btnLeft += 151;
        		}

        		if(_comp.btnObjs.length > 0){
        			bIdx = 0;
            		if(state == STATE_BTN){
            			bIdx = _parent.detailModule.getBtnIndex(_comp.btnObjs);
            		}
            		
            		for(var i=0; i < _comp.btnObjs.length; i++){
            			_comp._buttons.add(_comp.btnObjs[i].btnComp.getComp());
            		}
            		if(contentsType != "series"){
                		_comp.btnObjs[bIdx].btnComp.focus();
        			}
            		W.log.info(products);
            		
            		if(contentsType == "series"){
            			if(_comp.btnObjs.length > 0){
                			_parent.detailModule.setPrice(_comp, bIdx);
            			}else{
            				_comp._rental_duration.setStyle({display:"none"});
            	    		_comp._listPrice.setStyle({display:"none"});
            	    		_comp._price.setStyle({display:"none"});
            	    		_comp._price_unit.setStyle({display:"none"});
            	    		_comp._discount.setStyle({display:"none"});
            	    		_comp._rental_guide.setStyle({display:"none"});
            			}
            		}
        		}
    		}
    		
    		if(_parent.episodeKeyLock){
    			_parent.episodeKeyLock = false;
    		}
    	};

    	function setSeries(){
    		W.log.info(series);
    		_comp._series._txt = [];
			_comp._series._foc = [];

    		if(_comp._series._items){
    			_comp._series.remove(_comp._series._items);
    		}

    		_comp._series._items = new W.Div({x:0, y:0, width:"867px", height:"97px"});
    		_comp._series.add(_comp._series._items);
    		
			for(var i=0; i < seriesEpisode.length; i++){
				_comp._series._items.add(new W.Image({x:125*i, y:12, width:"117px", height:"48px", src:"img/02_epi_bg.png"}));
				_comp._series._txt[i] = new W.Span({x:125*i, y:24, width:"117px", height:"24px", textColor:"rgba(205,205,205,0.84)", 
					"font-size":"22px", className:"font_rixhead_light", text:seriesEpisode[i].episodeNum, textAlign:"center"});
				_comp._series._items.add(_comp._series._txt[i]);
				_comp._series._foc[i] = new W.Div({x:125*i, y:12, width:"117px", height:"48px"});
				_comp._series._items.add(_comp._series._foc[i]);
				
				_comp._series._foc[i]._foc = new W.Image({x:0, y:0, width:"117px", height:"48px", src:"img/02_epibg__f.png", display:"none"});
				_comp._series._foc[i].add(_comp._series._foc[i]._foc);
				_comp._series._foc[i]._dim = new W.Image({x:0, y:0, width:"117px", height:"48px", src:"img/02_epibg__f_d.png", display:"none"});
				_comp._series._foc[i].add(_comp._series._foc[i]._dim);
				
				_comp._series._foc[i]._prog = new W.Div({x:8, y:38, width:"101px", height:"3px", display:"none"});
				_comp._series._foc[i].add(_comp._series._foc[i]._prog);
				_comp._series._foc[i]._prog.add(new W.Image({x:0, y:0, width:"101px", height:"3px", src:"img/02_epi_pr_bg.png"}));
				_comp._series._foc[i]._prog.add(new W.Image({x:0, y:0, width:"2px", height:"3px", src:"img/02_epi_pr_l_d.png"}));
				_comp._series._foc[i]._prog.add(new W.Div({x:2, y:0, width:"97px", height:"3px", backgroundColor:"rgb(114,114,114)"}));
				_comp._series._foc[i]._prog.add(new W.Image({x:99, y:0, width:"2px", height:"3px", src:"img/02_epi_pr_r_d.png"}));
				
				if(series[i] && series[i].resume){
					if(series[i].resume.offset == 0){
	    				_comp._series._foc[i]._prog.setStyle({display:"none"});
	    			}else{
	    				var duration = util.getRunningTime(series[i].runtime, false, series[i].runningTime);
	    				
	    				if(series[i].resume.offset > duration){
	    					series[i].resume.offset = duration;
	    				}
	                    
	                    var width = 97 * (series[i].resume.offset/duration)
	                    
						_comp._series._foc[i]._prog.add(new W.Image({x:0, y:0, width:"2px", height:"3px", src:"img/02_epi_pr_l.png"}));
						_comp._series._foc[i]._prog.add(new W.Div({x:2, y:0, width:width, height:"3px", backgroundColor:"rgb(237,168,2)"}));
						_comp._series._foc[i]._prog.add(new W.Image({x:2+width, y:0, width:"2px", height:"3px", src:"img/02_epi_pr_r.png"}));
	                	_comp._series._foc[i]._prog.setStyle({display:"none"});
	    			}
				}
			}
			
			if(lastIndex > -1){
				_comp._series._last = new W.Image({x:125*lastIndex + 76, y:0, width:"72px", height:"56px", src:"img/icon_last.png"});
				_comp._series._items.add(_comp._series._last);
			}
			
			if(totalPage > 1){
				_comp._series._page_info.setStyle({display:""});
				_comp._series._total_page.setText("/ " + W.Util.changeDigit(Math.ceil(seriesEpisode.length / 7), 2));
			}else{
				_comp._series._page_info.setStyle({display:"none"});
			}

			var page = Math.floor(eIdx/7);
        	_comp._series._curr_page.setText(W.Util.changeDigit(page+1, 2)+ " ");
			_comp._series._items.setStyle({x:-875*page});
    	};
    	
    	this.changeRecentIcon = function(){
    		if(lastIndex != eIdx && contentsType == "series"){
        		lastIndex = eIdx;
    			if(_comp._series._last){
    				_comp._series._last.setStyle({x:125*lastIndex + 76});
    			}else{
    				_comp._series._last = new W.Image({x:125*lastIndex + 76, y:0, width:"72px", height:"56px", src:"img/icon_last.png"});
					_comp._series._items.add(_comp._series._last);
    			}
    		}
    	};

    	this.setData = function(data, isNotFocus, cType){
    		if(cType){
    			contentsType = cType;
    		}
    		detail = data;
    		setData();
    		if(contentsType != "package" && !isNotFocus){
    			if(_comp.btnObjs.length == 0){
    				if(contentsType == "series"){
            			state = STATE_EPISODE;
            		}else{
            			state = STATE_CASTING;
            		}
    			}
    			focus();
    		}
    	};
    	
    	this.setSeries = function(seriesData, list, startIndex){
    		series = seriesData;
    		seriesEpisode = list;
    		W.log.info(series);
    		W.log.info("------------------------------------------");
    		W.log.info(seriesEpisode);
    		totalPage = Math.ceil(seriesEpisode.length/7);
    		if(startIndex > -1){
    			eIdx = startIndex;
    		}
    		W.log.info("------------------------------------------");
    		W.log.info("------------------------------------------");
    		W.log.info(_parent.detail.lastWatchEpisodeIndex);
    		if(_parent.detail.lastWatchEpisodeIndex > -1){
    			lastIndex = _parent.detail.lastWatchEpisodeIndex;
    		}
    		setSeries();
    		_comp._series._foc[eIdx]._dim.setStyle({display:""});
    	};
    	
    	this.focus = function(){
    		focus();
    	};
    	
    	this.unFocus = function(){
    		unFocus();
    	};
    	
    	this.purchaseTrailer = function(){
    		unFocus();
    		bIdx = 1;
    		focus();
    		W.SceneManager.startScene({
				sceneName:"scene/vod/PurchaseVodScene", 
				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
				param:{data:_comp.btnObjs[bIdx].assets, type:"package", products:_comp.btnObjs[bIdx].products}
			});
    	};

    	this.operate = function(event){
    		switch (event.keyCode) {
            case W.KEY.RIGHT:
            	unFocus();
                if(state == STATE_BTN){
                	bIdx = (++bIdx) % _comp.btnObjs.length;
                }else if(state == STATE_CASTING){
                	cIdx = (++cIdx) % _comp._actor.length;
                }else if(state == STATE_EPISODE){
                	eIdx = (++eIdx) % seriesEpisode.length;
                }
            	focus();
                break;
            case W.KEY.LEFT:
            	unFocus();
            	if(state == STATE_BTN){
            		bIdx = (--bIdx + _comp.btnObjs.length) % _comp.btnObjs.length;
                }else if(state == STATE_CASTING){
                	cIdx = (--cIdx + _comp._actor.length) % _comp._actor.length;
                }else if(state == STATE_EPISODE){
                	eIdx = (--eIdx + seriesEpisode.length) % seriesEpisode.length;
                }
            	focus();
                break;
            case W.KEY.UP:
        		if(_parent.episodeKeyLock) return;
        		if(state != STATE_CASTING){
	        		unFocus(true);
	            	if(state == STATE_BTN){
	            		if(contentsType == "series"){
	            			state = STATE_EPISODE;
	            		}else{
	                		if(hasMore){
	                			state = STATE_MORE;
	                		}else{
	                			if(_comp._actor.length > 0){
		                			state = STATE_CASTING;
	                			}
	                		}
	            		}
	                }else if(state == STATE_EPISODE){
	                	if(hasMore){
	            			state = STATE_MORE;
	            		}else{
	            			if(_comp._actor.length > 0){
	                			state = STATE_CASTING;
                			}
	            		}
	                }else if(state == STATE_MORE){
	                	if(_comp._actor.length > 0){
                			state = STATE_CASTING;
            			}
	                }
	        		focus(true);
        		}
	            break;
            case W.KEY.DOWN:
        		if(_parent.episodeKeyLock) return;
        		unFocus(true);
            	if(state == STATE_BTN){
            		return true;
                }else if(state == STATE_MORE){
            		if(contentsType == "series"){
            			state = STATE_EPISODE;
            		}else{
            			if(_comp.btnObjs.length == 0){
            				return true;
            			}else{
                			state = STATE_BTN;
            			}
            		}
                }else if(state == STATE_EPISODE){
                	if(_comp.btnObjs.length == 0){
        				return true;
        			}else{
            			state = STATE_BTN;
        			}
                }else if(state == STATE_CASTING){
                	if(hasMore){
            			state = STATE_MORE;
            		}else{
            			if(contentsType == "series"){
                			state = STATE_EPISODE;
                		}else{
                			if(_comp.btnObjs.length == 0){
                				return true;
                			}else{
                    			state = STATE_BTN;
                			}
                		}
            		}
                }
    			focus(true);
                break;
            case W.KEY.COLOR_KEY_B:
            	if(state == STATE_EPISODE && totalPage > 1){
            		unFocus();
            		var page = Math.floor(eIdx/7);
            		page = (++page) % totalPage;
            		eIdx = page * 7;
            		focus();
                }
            	break;
            case W.KEY.COLOR_KEY_R:
            	if(state == STATE_EPISODE && totalPage > 1){
            		unFocus();
            		var page = Math.floor(eIdx/7);
            		page = (--page + totalPage) % totalPage;
            		eIdx = page * 7;
            		focus();
                }
            	break;
			case W.KEY.COLOR_KEY_Y:
				 if(W.StbConfig.cugType != "accommodation"){
					 _parent.detailModule.openSideOption(self, contentsType, detail, seriesEpisode, _comp.btnObjs[bIdx]);
				 }
				break;
            case W.KEY.ENTER:
            	if(_parent.episodeKeyLock) return;
            	if(state == STATE_BTN){
            		W.log.info(_comp.btnObjs);
            		_parent.detailModule.buttonAction(self, _comp.btnObjs[bIdx], detail, _comp.btnObjs);
                }else if(state == STATE_EPISODE){
                	if(_comp.btnObjs && _comp.btnObjs.length > 0){
                    	unFocus(true);
                    	state = STATE_BTN;
                    	focus(true);
                	}
                }else if(state == STATE_MORE){
                	var popup = {
	    				popupName:"popup/detail/MoreInfoPopup",
	    				data : detail,
        				childComp:self
	    			};
	    			W.PopupManager.openPopup(popup);
                }else if(state == STATE_CASTING){
                	W.SceneManager.startScene({
    					sceneName:"scene/search/SearchResultScene", 
        				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
        				param:{
        					keyword:_comp._name[cIdx].text,
        					m_field:_comp._name[cIdx].type
        				}
        			});
                }
                break;
    		}
    	};
    	this.onPopupClosed = function(popup, desc) {
        	if (desc) {
        		_parent.detailModule.onPopupClosed(self, desc, _comp.btnObjs[bIdx], detail, eIdx, _comp.btnObjs);
			}
        };
        this.jumpEpisode = function(episodeNum){
        	for(var i=0; i < seriesEpisode.length; i++){
    			if(episodeNum == seriesEpisode[i].episodeNum){
    				if(!_parent.isDetail){
    					_parent.Recommend.unFocus();
    					_parent.isDetail = true;
    				}else{
    					_comp._series._foc[eIdx]._dim.setStyle({display:"none"});
    					_comp._series._foc[eIdx]._foc.setStyle({display:"none"});
    					if(state != STATE_EPISODE){
    						unFocus(true);
    					}
    				}
    				state = STATE_EPISODE;
    				eIdx = i;
    				focus();
    				break;
    			}
    		}
        };
        this.getEpisodeIndex = function(){
        	return eIdx;
        };
        this.setButtonIndex = function(idx){
        	var tmpIndex = -1;
        	unFocus();
    		for(var i=0; i < _comp.btnObjs.length; i++){
				if(_comp.btnObjs[i].type == BTN_TYPE_HD){
					tmpIndex = i;
					break;
				}
			}
			if(tmpIndex == -1){
				for(var i=0; i < _comp.btnObjs.length; i++){
					if(_comp.btnObjs[i].type == BTN_TYPE_UHD){
						tmpIndex = i;
						break;
					}
				}
			}
			if(tmpIndex == -1){
				for(var i=0; i < _comp.btnObjs.length; i++){
					if(_comp.btnObjs[i].type == BTN_TYPE_LIFETIME){
						tmpIndex = i;
						break;
					}
				}
			}
        	bIdx = tmpIndex;
        	unFocus();
        };
    };
    
    return {
    	getComp : function(_parent, _parentDiv, contentsType, sceneType){
    		var detailComp = new Detail(_parent, _parentDiv, contentsType, sceneType);
    		return detailComp;
    	}
    }
});