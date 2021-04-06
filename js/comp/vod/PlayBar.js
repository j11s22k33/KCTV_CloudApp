W.defineModule(["mod/Util", "comp/Button"], function(util, buttonComp){
	var STATE_BAR = 0;
	var STATE_TITLE = 1;
	var STATE_IMG = 2;
	
	var STATE_NONE= 0;
    var STATE_AD_PLAY = 1;
    var STATE_VOD_PLAY = 2;
    var STATE_VOD_END = 3;
    var STATE_VOD_ERROR = 4;
    
    var VOD_BAR_HIDE_TIME = 5000;
    
	function PlayBar(){
		var _parent;
		var _comp;
		var _icons;
		var _playbar;
		var barLength = 0;
		var imgLength = 0;
		var data;
		var state = STATE_BAR;
		var oldIndex = 0;
		var imgIndex = 0;
		var showTimeout;
		var _this;
		var bIndex = 1;
		var totalDuration = 0;
		var currPosInterval;
		var iconTimeout;
		
		var create = function(){
			var icons = ["img/icon_play.png", "img/icon_pause.png", "img/icon_ffx1_2.png", "img/icon_ffx2.png", "img/icon_ffx8.png",
			             "img/icon_ffx32.png", "img/icon_ffx64.png", "img/icon_ffx0_8.png", "img/icon_play.png", "img/icon_rewindx2.png", "img/icon_rewindx8.png", 
			             "img/icon_rewindx32.png", "img/icon_rewindx64.png"];
			_comp = new W.Div({className:"bg_size"});
			_icons = new W.Div({x:31, y:22, width:"110px", height:"110px", display:"none"});
			_comp.add(_icons);
			_icons.add(new W.Image({x:0, y:0, width:"110px", height:"110px", src:"img/control_bg_s.png"}));
			_icons._icon = [];
			for(var i=0; i < icons.length; i++){
				_icons._icon[i] = new W.Image({x:0, y:0, width:"110px", height:"110px", src:icons[i], display:""});
				_icons.add(_icons._icon[i]);
			}
			
			_playbar = new W.Div({x:0, y:305, width:"1280px", height:"415px", display:"none"});
			_comp.add(_playbar);
			_playbar.add(new W.Image({x:0, y:47, width:"1280px", height:"368px", src:"img/bg_player.png"}));
			
			_playbar._option_btn = new W.Div({x:1128, y:343, width:"180px", height:"100px", display:"none"});
			_playbar.add(_playbar._option_btn);
			_playbar._option_btn.add(new W.Image({x:0, y:0, width:"68px", height:"68px", src:"img/color_yellow.png"}));
			_playbar._option_btn.add(new W.Span({x:51, y:17, width:"60px", height:"17px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:W.Texts["optionMenu"]}));
			
			_playbar._bar = new W.Div({x:53, y:270, width:"1233px", height:"25px"});
			_playbar.add(_playbar._bar);
			_playbar._bgs = [];
			_playbar._nums = [];
			_playbar._curr_bars = [];
			for(var i=0; i < 10; i++){
				_playbar._bgs[i] = new W.Div({x:88 + 100*i, y:8, width:"98px", height:"2px", backgroundColor:"rgb(101,104,109)"});
				_playbar._bar.add(_playbar._bgs[i]);
				if(i > 0){
					_playbar._nums[i] = new W.Span({x:83 + 100*i, y:-13, width:"10px", height:"20px", textColor:"rgba(180,180,180,0.5)", 
						"font-size":"18px", className:"font_rixhead_bold", text:i, textAlign:"center"});
					_playbar._bar.add(_playbar._nums[i]);
				}
				_playbar._curr_bars[i] = new W.Div({x:88 + 100*i, y:7, width:"0px", height:"4px", backgroundColor:"rgb(229, 48,0)", 
					"border-radius":"2px"});
				_playbar._bar.add(_playbar._curr_bars[i]);
			}
			
			_playbar._start_time = new W.Span({x:0, y:1, width:"80px", height:"20px", textColor:"rgb(237,168,2)", 
				"font-size":"18px", className:"font_rixhead_medium", text:"00:00:00"});
			_playbar._bar.add(_playbar._start_time);
			_playbar._end_time = new W.Span({x:1101, y:1, width:"80px", height:"20px", textColor:"rgb(180,180,180)", 
				"font-size":"18px", className:"font_rixhead_medium", text:""});
			_playbar._bar.add(_playbar._end_time);
			
			_playbar._title = new W.Span({x:441, y:317, width:"400px", height:"34px", textColor:"rgba(255,255,255,0.5)", 
				"font-size":"28px", className:"font_rixhead_medium cut", text:data.title, textAlign:"center"});
			_playbar.add(_playbar._title);
			
			var _title_foc = new W.Div({x:441, y:346, width:"400px", height:"6px", textAlign:"center"});
			_playbar.add(_title_foc);
			_playbar._title_foc = new W.Div({position:"relative", y:-11, width:"160px", height:"6px", backgroundColor:"rgb(229, 48,0)", 
				"border-radius":"3px", display:"none"});
			_title_foc.add(_playbar._title_foc);
			
			_playbar._detail_btn = new W.Div({x:578, y:342, width:"110px", height:"70px", display:"none"});
			_playbar.add(_playbar._detail_btn);
			_playbar._detail_btn.add(new W.Image({x:0, y:0, width:"70px", height:"70px", src:"img/btn_ok.png"}));
			_playbar._detail_btn.add(new W.Span({x:52, y:19, width:"55px", height:"16px", textColor:"rgba(255,255,255,0.7)", 
				"font-size":"15px", className:"font_rixhead_medium", text:W.Texts["more_detail"]}));
			
			
			
			_playbar.prevBtnComp = buttonComp.create(309, 309, W.Texts["prev_episode"], 133, undefined, undefined, 20);
			_playbar._prev_btn = _playbar.prevBtnComp.getComp();
			
			_playbar.nextBtnComp = buttonComp.create(839, 309, W.Texts["next_episode"], 133, undefined, undefined, 20);
			_playbar._next_btn = _playbar.nextBtnComp.getComp();
			
			if(_parent.hasPrevEpisode){
				_playbar.add(_playbar._prev_btn);
			}
			if(_parent.hasNextEpisode){
				_playbar.add(_playbar._next_btn);
			}
			
			_playbar.btnTypes = [];
			if(_parent.hasPrevEpisode){
				_playbar.btnTypes.push("P");
			}
			_playbar.btnTypes.push("T");
			if(_parent.hasNextEpisode){
				_playbar.btnTypes.push("N");
			}
			
			if(data.thumbList.length > 0){
				_playbar._thumb_dim = new W.Div({x:284, y:176, width:"713px", height:"64px", opacity:0.5});
				_playbar.add(_playbar._thumb_dim);
				for(var i=0; i < 6; i++){
					_playbar._thumb_dim.add(new W.Image({x:120*i, y:0, width:"113px", height:"64px", src:data.thumbList[i].fileName}));
					_playbar._thumb_dim.add(new W.Div({x:120*i, y:0, width:"113px", height:"64px", backgroundColor:"rgba(0,0,0,0.15)"}));
				}
				
				_playbar._thumb_area = new W.Div({x:0, y:136, width:"1280px", height:"160px", display:"none", overflow:"hidden"});
				_playbar.add(_playbar._thumb_area);

				_playbar._dot = new W.Image({x:134, y:134, width:"20px", height:"20px", src:"img/p_bar_dot_f.png"});
				_playbar._thumb_area.add(_playbar._dot);
				
				_playbar._thumb_list = new W.Div({x:0, y:0, width:"1280px", height:"113px"});
				_playbar._thumb_area.add(_playbar._thumb_list);

				_playbar._thumb_focs = [];
				for(var i=0; i < data.thumbList.length; i++){
					var _item = new W.Div({x:122 + 174*i, y:10, width:"167px", height:"94px"});
					_playbar._thumb_list.add(_item);
					_item.add(new W.Image({x:0, y:0, width:"167px", height:"94px", src:data.thumbList[i].fileName}));
					_item.add(new W.Div({x:0, y:0, width:"167px", height:"94px", backgroundColor:"rgba(0,0,0,0.3)"}));
					_item.add(new W.Div({x:90, y:68, width:"71px", height:"20px", backgroundColor:"rgba(0,0,0,0.8)", "border-radius":"10px"}));
					_item.add(new W.Span({x:90, y:70, width:"71px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
						"font-size":"14px", className:"font_rixhead_medium", text:util.getVodTime(data.thumbList[i].position), textAlign:"center"}));
				}

				_playbar._thumb_focs = [];
				for(var i=0; i < data.thumbList.length; i++){
					_playbar._thumb_focs[i] = new W.Div({x:115 + 174*i, y:0, width:"181px", height:"113px", display:"none"});
					_playbar._thumb_list.add(_playbar._thumb_focs[i]);
					_playbar._thumb_focs[i].add(new W.Image({x:0, y:5, width:"181px", height:"103px", src:data.thumbList[i].fileName}));
					_playbar._thumb_focs[i].add(new W.Div({x:0, y:0, width:"181px", height:"4px", backgroundColor:"rgb(229,48,0)"}));
					_playbar._thumb_focs[i].add(new W.Div({x:0, y:109, width:"181px", height:"4px", backgroundColor:"rgb(229,48,0)"}));
					_playbar._thumb_focs[i].add(new W.Div({x:104, y:82, width:"71px", height:"20px", backgroundColor:"rgba(0,0,0,0.8)", "border-radius":"10px"}));
					_playbar._thumb_focs[i].add(new W.Span({x:104, y:84, width:"71px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
						"font-size":"14px", className:"font_rixhead_medium", text:util.getVodTime(data.thumbList[i].position), textAlign:"center"}));
				}
			}
			
			_playbar._icons = new W.Div({x:584, y:0, width:"110px", height:"110px", display:"none"});
			_playbar.add(_playbar._icons);
			_playbar._icons.add(new W.Image({x:0, y:0, width:"110px", height:"110px", src:"img/control_bg.png"}));
			_playbar._icons._icon = [];
			for(var i=0; i < icons.length; i++){
				_playbar._icons._icon[i] = new W.Image({x:0, y:0, width:"110px", height:"110px", src:icons[i], display:"none"});
				_playbar._icons.add(_playbar._icons._icon[i]);
			} 
			
		};

		this.setCurrTime = function(time){
			W.log.info("time === " + time);
			var tmp = Math.ceil(time/barLength);
			for(var i=0; i < 10; i++){
				if(i < tmp-1){
					_playbar._curr_bars[i].setStyle({width:"98px"});
				}else if(i == tmp-1){
					_playbar._curr_bars[i].setStyle({width:((time%barLength) * 98 / barLength) + "px"});
				}else{
					_playbar._curr_bars[i].setStyle({width:"0px"});
				}
			}
			_playbar._start_time.setText(util.getVodTime(time));
		};
		
		this.onStart = function(duration){
			totalDuration = duration;
			barLength = totalDuration / 10;
			imgLength = totalDuration / data.thumbList.length;
			W.log.info("totalDuration == " + totalDuration);
			W.log.info("barLength == " + barLength);
			W.log.info("imgLength == " + imgLength);
			
			_playbar._end_time.setText(util.getVodTime(totalDuration));
		};
		
		this.getComp = function(_p, d){
			_parent = _p;
			_this = this;
			data = d;
			if(!_comp) create();
            return _comp;
		};
		
		this.isShow = false;

		var focusBtn = function(isUnfoc){
			if(isUnfoc){
				if(_playbar.btnTypes[bIndex] == "P"){
					_playbar.prevBtnComp.unFocus();
				}else if(_playbar.btnTypes[bIndex] == "N"){
					_playbar.nextBtnComp.unFocus();
				}else{
		    		_playbar._title_foc.setStyle({display:"none"});
		    		_playbar._detail_btn.setStyle({display:"none"});
		    		_playbar._title.setStyle({textColor:"rgba(255,255,255,0.5)"});
				}
			}else{
				if(_playbar.btnTypes[bIndex] == "P"){
					_playbar.prevBtnComp.focus();
				}else if(_playbar.btnTypes[bIndex] == "N"){
					_playbar.nextBtnComp.focus();
				}else{
					if(!data.titleLength){
		    			data.titleLength = util.geTxtLength(data.title, "RixHeadM", 28) + 16;
		    			if(data.titleLength > 400){
		    				data.titleLength = 400;
		    			}
		    			_playbar._title_foc.setStyle({width:data.titleLength+"px"});
		    		}
		    		_playbar._title_foc.setStyle({display:"inline-block"});
		    		_playbar._detail_btn.setStyle({display:"block"});
		    		_playbar._title.setStyle({textColor:"rgb(255,255,255)"});
				}
			}
		};
		
		var focusBar = function(isUnfoc){
			_playbar._bar.setStyle({opacity:isUnfoc ? 0.5 : 1});
    		for(var i=0; i < 10; i++){
    			_playbar._curr_bars[i].setStyle({backgroundColor:isUnfoc ? "rgb(158,142,133)" : "rgb(229, 48,0)"});
    		}
		};
		
		var focusImg = function(isUnfoc){
			clearInterval(currPosInterval);
			currPosInterval = null;
			
			_playbar._thumb_dim.setStyle({display:isUnfoc ? "block" : "none"});
			_playbar._thumb_area.setStyle({display:isUnfoc ? "none" : "block"});
			if(isUnfoc){
				_playbar._thumb_focs[imgIndex].setStyle({display:"none"});
				imgIndex = 0;
				_playbar._thumb_list.setStyle({x:0});
			}
			focusThumbNail();
		};
		
		var focusThumbNail = function(){
			_playbar._thumb_focs[oldIndex].setStyle({display:"none"});
			_playbar._thumb_focs[imgIndex].setStyle({display:"block"});
			_playbar._thumb_list.setStyle({x:imgIndex > 5 ? -1050 : 0});

			W.log.info("data.thumbList[imgIndex].position ======= " + data.thumbList[imgIndex].position);
			W.log.info("totalDuration ======= " + totalDuration);
			var left = (data.thumbList[imgIndex].position * 998) / totalDuration;
			_playbar._dot.setStyle({x:134 + left});
			
		};
		
		this.hideIcon = function(){
			clearTimeout(iconTimeout);
			_icons.setStyle({display:"none"});
		};
		
		function startIconTimeout(){
			clearTimeout(iconTimeout);
			_icons.setStyle({display:"block"});
			iconTimeout = setTimeout(_this.hideIcon, 10* 1000);
		};
		
		this.hide = function(){
			if(state == STATE_TITLE){
				focusBtn(true);
        	}else if(state == STATE_IMG){
        		focusImg(true);
        	}
    		state = STATE_BAR;
    		focusBar();
			
    		_playbar._icons.setStyle({display:"none"});
    		_playbar._option_btn.setStyle({display:"none"});
			_playbar.setStyle({display:"none"});
			if(_parent.vodSpeed != 1){
				startIconTimeout();
			}
			
			clearTimeout(showTimeout);
			this.isShow = false;
		};

		this.changeSpeedIcon = function(type){
			W.log.info("_parent.vodSpeed ========== " + _parent.vodSpeed);
			var iconIdx = 0;
			if(_parent.vodSpeed == 0) iconIdx = 1;
			if(_parent.vodSpeed == 1) iconIdx = type == "pp" ? 0 : 8;
			if(_parent.vodSpeed == 1.2) iconIdx = 2;
			if(_parent.vodSpeed == 2) iconIdx = 3;
			if(_parent.vodSpeed == 8) iconIdx = 4;
			if(_parent.vodSpeed == 32) iconIdx = 5;
			if(_parent.vodSpeed == 64) iconIdx = 6;
			if(_parent.vodSpeed == 0.8) iconIdx = 7;
			if(_parent.vodSpeed == -2) iconIdx = 9;
			if(_parent.vodSpeed == -8) iconIdx = 10;
			if(_parent.vodSpeed == -32) iconIdx = 11;
			if(_parent.vodSpeed == -64) iconIdx = 12;
			
			for(var i=0; i < _playbar._icons._icon.length; i++){
				_playbar._icons._icon[i].setStyle({display:"none"});
				_icons._icon[i].setStyle({display:"none"});
			}
			
			_playbar._icons._icon[iconIdx].setStyle({display:"block"});
			_icons._icon[iconIdx].setStyle({display:"block"});
			
			if(this.isShow){
				_playbar._icons.setStyle({display:"block"});
				_this.hideIcon();
			}else{
				_playbar._icons.setStyle({display:"none"});
				if(_parent.vodSpeed == 1){
					_this.hideIcon();
				}else{
					startIconTimeout();
				}
			}
		};
		
		this.show = function(speedType){
			_playbar.setStyle({display:"block"});
			_this.hideIcon();
			if((speedType && speedType != "reset") || _parent.vodSpeed != 1){
				_playbar._icons.setStyle({display:"block"});
			}
			
			W.CloudManager.currentPosition(function(obj){
				_this.setCurrTime(obj.data);
			});
			
			clearTimeout(showTimeout);
			showTimeout = setTimeout(function(){
				_this.hide();
			}, VOD_BAR_HIDE_TIME);
			this.isShow = true;
			
			if(!currPosInterval){
				currPosInterval = setInterval(function(){
					if(_this.isShow){
						W.CloudManager.currentPosition(function(obj){
							_this.setCurrTime(obj.data);
						});
					}else{
						clearInterval(currPosInterval);
						currPosInterval = null;
					}
				}, 1000);
			}
			
		};
		
		this.onKeyPressed = function(event) {
			clearTimeout(showTimeout);
            showTimeout = setTimeout(function(){
				_this.hide();
			}, VOD_BAR_HIDE_TIME);

            W.log.info("_parent.state ====== " + _parent.state);
            var isResume = false;
            switch (event.keyCode) {
            case W.KEY.DOWN:
            	if(_parent.state != STATE_VOD_PLAY) return;
            	if(!this.isShow) return false;
            	if(state == STATE_BAR){
            		if(_parent.isTmpPlayer){
            			return false;
            		}
            		focusBar(true);
            		for(var i=0; i < _playbar.btnTypes.length; i++){
            			if(_playbar.btnTypes[i] == "T"){
            				bIndex = i;
            			}
            		}
            		focusBtn();
            		state = STATE_TITLE;
            		_playbar._option_btn.setStyle({display:"block"});
            	}else if(state == STATE_IMG){
            		focusBar();
            		focusImg(true);
            		state = STATE_BAR;
            		_playbar._option_btn.setStyle({display:"none"});
            	}
            	isResume = true;
                break;
            case W.KEY.UP:
            	if(_parent.state != STATE_VOD_PLAY) return;
            	if(this.isShow){
            		if(state == STATE_TITLE){
                		focusBar();
                		focusBtn(true);
                		state = STATE_BAR;
                		_playbar._option_btn.setStyle({display:"none"});
                	}else if(state == STATE_BAR){
                		if(data.thumbList.length > 0){
                    		W.CloudManager.currentPosition(function(obj){
    	                		oldIndex = imgIndex;
                    			var tmpIdx = -1;
                    			for(var i=0; i < data.thumbList.length; i++){
                    				if(obj.data < imgLength * i){
                    					tmpIdx = i-1;
                    					break;
                    				}
                    			}
                    			if(tmpIdx == -1){
                    				imgIndex = data.thumbList.length - 1;
                    			}else{
                    				imgIndex = tmpIdx;
                    			}
                    			focusBar(true);
                        		focusImg();
                        		state = STATE_IMG;
                        		_playbar._option_btn.setStyle({display:"block"});
                			});
                		}
                	}
            	}else{
            		this.show();
            		_parent.changeVodSpeed("pp", function(){
            			
            		});
            	}
            	isResume = true;
                break;
            case W.KEY.LEFT:
            	if(_parent.state != STATE_VOD_PLAY) return;
            	if(this.isShow){
            		if(state == STATE_IMG){
            			if(imgIndex > 0){
                    		oldIndex = imgIndex;
                    		imgIndex = (--imgIndex + data.thumbList.length) % data.thumbList.length;
                    		focusThumbNail();
            			}
                	}else if(state == STATE_TITLE){
                		focusBtn(true);
                		bIndex = (--bIndex + _playbar.btnTypes.length) % _playbar.btnTypes.length;
                		focusBtn();
                	}else if(state == STATE_BAR){
                		if(_parent.state == STATE_VOD_PLAY){
                    		_parent.changeVodSpeed("rw", function(){
                    		});
                    	}
                	}
            	}else{
            		if(_parent.state == STATE_VOD_PLAY){
                		_parent.changeVodSpeed("rw", function(){
                			_this.show("rw");
                		});
                	}
            	}
            	isResume = true;
                break;
            case W.KEY.RIGHT:
            	if(_parent.state != STATE_VOD_PLAY) return;
            	if(this.isShow){
            		if(state == STATE_IMG){
            			if(imgIndex < data.thumbList.length - 1){
	                		oldIndex = imgIndex;
	                		imgIndex = (++imgIndex) % data.thumbList.length;
	                		focusThumbNail();
            			}
                	}else if(state == STATE_TITLE){
                		focusBtn(true);
                		bIndex = (++bIndex) % _playbar.btnTypes.length;
                		focusBtn();
                	}else if(state == STATE_BAR){
                		if(_parent.state == STATE_VOD_PLAY){
                    		_parent.changeVodSpeed("ff", function(){
                    		});
                    	}
                	}
            	}else{
            		if(_parent.state == STATE_VOD_PLAY){
                		_parent.changeVodSpeed("ff", function(){
                			_this.show("ff");
                		});
                	}
            	}
            	isResume = true;
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
            	if(_parent.state != STATE_VOD_PLAY) return;
				W.log.info("Num == " + (event.keyCode-48));
				W.log.info("seek position == " + ((event.keyCode-48) * barLength));
            	if(_parent.vodSpeed != 1){
    				_parent.changeVodSpeed("reset", function(){
    					W.CloudManager.seekVod(function(obj){
            				_this.setCurrTime((event.keyCode-48) * barLength);
            				if(!_this.isShow){
            					_this.show();
            				}
            			}, (event.keyCode-48) * barLength);
            		});
    			}else{
    				W.CloudManager.seekVod(function(obj){
        				_this.setCurrTime((event.keyCode-48) * barLength);
        				if(!_this.isShow){
        					_this.show();
        				}
        			}, (event.keyCode-48) * barLength);
    			}
            	isResume = true;
            	break;
            case W.KEY.BACK:
            	if(_parent.state != STATE_VOD_PLAY){
            		_parent.backScene(undefined, undefined, {command:"fromVodPlay"});
            	}else{
                	if(this.isShow){
                		this.hide();
                	}else{
                		clearTimeout(showTimeout);
                		_parent.backScene(undefined, undefined, {command:"fromVodPlay"});
                	}
            	}
            	isResume = true;
                break;
            case W.KEY.ENTER:
            	if(_parent.state != STATE_VOD_PLAY) return;
            	W.log.info(this.isShow);
            	if(!this.isShow){
            		this.show();
            	}else{
            		if(state == STATE_IMG){
            			if(_parent.vodSpeed != 1){
            				_parent.changeVodSpeed("reset", function(){
            					W.CloudManager.seekVod(function(obj){
                    				_this.setCurrTime(data.thumbList[imgIndex].position);
                    			}, data.thumbList[imgIndex].position);
                    		});
            			}else{
            				W.CloudManager.seekVod(function(obj){
                				_this.setCurrTime(data.thumbList[imgIndex].position);
                			}, data.thumbList[imgIndex].position);
            			}
            		}else if(state == STATE_TITLE){
            			this.hide();
            			if(_playbar.btnTypes[bIndex] == "T"){
//            				_parent.backScene(undefined, undefined, {command:"backFromVodPlay"});

    		    			W.SceneManager.startScene({
								sceneName:"scene/vod/VodDetailScene",
								backState:W.SceneManager.BACK_STATE_DESTROYALL,
								param:{assetId:_parent.asset.assetId}
							});
        				}else{
                        	if(_playbar.btnTypes[bIndex] == "N"){
                        		_parent.checkSeriesAsset(_parent.nextAssetId);
                        	}else{
                        		_parent.checkSeriesAsset(_parent.prevAssetId);
                        	}
        				}
            		}else{
            			if(this.isShow){
                    		this.hide();
                    	}
            		}
            	}
            	isResume = true;
                break;
            case W.KEY.COLOR_KEY_R: //rew
            	if(_parent.state == STATE_VOD_PLAY){
            		_parent.changeVodSpeed("rw", function(){
            			_this.show("rw");
            		});
            	}
            	break;
            case W.KEY.EXIT: //stop
            	if(this.isShow){
            		this.hide();
            	}else{
            		if(_parent.state == STATE_VOD_PLAY){
    	            	_parent.changeVodSpeed("pause", function(){
    	            		
    	        		});
                	}

        			W.log.info("Vod play bar !!!!");
                	_this.hide();
            		_parent.stateOld = _parent.state;
            		_parent.state = STATE_VOD_END;
            		
            		W.CloudManager.currentPosition(function(obj){
            			_parent.vodInfo.offset = obj.data;
    				});
            		
            		if(_parent.asset.isTrailer){
            			_parent.vodFinish.show(true, undefined, true, _parent.asset.isPurchased);
    				}else{
    					_parent.vodFinish.show(true);
    				}
            	}
            	break;
            case W.KEY.COLOR_KEY_G: //stop
            	if(_parent.state == STATE_VOD_PLAY){
	            	_parent.changeVodSpeed("pause", function(){
	            		
	        		});
            	}

    			W.log.info("Vod play bar !!!!");
            	_this.hide();
        		_parent.stateOld = _parent.state;
        		_parent.state = STATE_VOD_END;
        		
        		W.CloudManager.currentPosition(function(obj){
        			_parent.vodInfo.offset = obj.data;
        		});
        		
        		if(_parent.asset.isTrailer){
        			_parent.vodFinish.show(true, undefined, true, _parent.asset.isPurchased);
				}else{
					_parent.vodFinish.show(true);
				}
            	break;
            case W.KEY.COLOR_KEY_Y: //play/pause
            	if(this.isShow && (state == STATE_TITLE || state == STATE_IMG)){
            		var popupData={options:[]};
            		popupData.options.push({
						name: W.Texts["play_repeat"],
						subOptions: [
						    {type: "spinner", index:_parent.isReplaySingle ? 0 : 1, options: [W.Texts["setting"], W.Texts["no_setting"]]}
						]
					});
            		if(_parent.series){
                		popupData.options.push({
    						name: W.Texts["play_repeat_series"],
    						subOptions: [
    						    {type: "spinner", index:_parent.replaySeriesType, options: [W.Texts["time_restricted_option1"], W.Texts["play_repeat"], W.Texts["no_setting"]]}
    						]
    					});
            		}
            		
            		var popup = {
        				popupName:"popup/sideOption/VodSideOptionPopup",
        				optionData:popupData,
        				childComp : _parent
        			};
        			W.PopupManager.openPopup(popup);
            	}else{
            		if(_parent.state == STATE_VOD_PLAY){
                		_parent.changeVodSpeed("pp", function(){
                			_this.show("pp");
                		});
                	}
            	}
            	break;
            case W.KEY.COLOR_KEY_B: //ff
            	if(_parent.state == STATE_VOD_PLAY){
            		_parent.changeVodSpeed("ff", function(){
            			_this.show("ff");
            		});
            	}
            	break;
            }
            return isResume;
        }
	};

	return PlayBar;
});