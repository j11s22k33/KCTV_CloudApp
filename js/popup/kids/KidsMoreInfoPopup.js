/**
 * popup/KidsMoreInfoPopup
 */
W.defineModule(["comp/KidsTabButton", "mod/Util"], function(buttonComp, util) {
	'use strict';
	W.log.info("KidsMoreInfoPopup");
	var STATE_BTNS = 0;
	var STATE_CONTENTS = 1;
	var STATE_CLOSE = 2;
	var state = STATE_BTNS;
	var selectIndex = 0;
	var index = 0;
	var total = 0;
	var oldIndex = 0;
	var _this;
	var _comp;
	var page = 0;
	var cIdx = 0;
	var cIdxOld = 0;
	var detail;
	var btnTimeout;
	var synopsisNo = 0;
	var awardsNo = 0;
	var selectedIdx = 0;
	var selectedIdxOld = 0;

	function makeSynopsis(btnNo){
		_comp.areas[btnNo] = new W.Div({x:344, y:265, width:"595px", height:"224px", overflow:"hidden", opacity:0});
		_comp.add(_comp.areas[btnNo]);
		_comp.areas[btnNo]._text = new W.Span({x:0, y:0, width:"595px", "font-size":"20px", textColor:"rgb(73,64,57)", 
			className:"font_rixhead_medium", "white-space":"pre-line", "line-height" : "1.4em"});
		_comp.areas[btnNo].add(_comp.areas[btnNo]._text);
		if(detail.contentType == "series"){
			_comp.areas[btnNo]._text.setText(detail.members[0].synopsis);
		}else{
			_comp.areas[btnNo]._text.setText(detail.synopsis);
		}
	};
	
	function makeAward(btnNo){
		var awardInfoList = "";
		for(var i=0; i < detail.awardInfoList.length; i++){
			if(i > 0){
				awardInfoList += "\n\r";
			}
			awardInfoList += detail.awardInfoList[i];
		}
		_comp.areas[btnNo] = new W.Div({x:344, y:265, width:"595px", height:"224px", overflow:"hidden", opacity:0});
		_comp.add(_comp.areas[btnNo]);
		_comp.areas[btnNo]._text = new W.Span({x:0, y:0, width:"592px", "font-size":"20px", textColor:"rgb(73,64,57)", 
			className:"font_rixhead_medium", "white-space":"pre-line", "line-height" : "1.4em"});
		_comp.areas[btnNo].add(_comp.areas[btnNo]._text);
		_comp.areas[btnNo]._text.setText(awardInfoList);
	};
	
	function makeCasting(btnNo, actors){
		_comp.areas[btnNo] = new W.Div({x:343, y:295, width:"622px", height:"170px", overflow:"hidden", opacity:0});
		_comp.add(_comp.areas[btnNo]);
		_comp.areas[btnNo]._list = new W.Div({x:0, y:0, width:"622px"});
		_comp.areas[btnNo].add(_comp.areas[btnNo]._list);
		
		_comp.areas[btnNo].names = [];

		for(var i=0; i < actors.length; i++){
			_comp.areas[btnNo].names.push(actors[i]);
		}

		_comp.areas[btnNo]._focs = [];
		for(var i=0; i < _comp.areas[btnNo].names.length; i++){
			_comp.areas[btnNo]._list.add(new W.Image({x:201 * (i%3) + 1, y:93 * Math.floor(i/3) + 1, width:"190px", height:"70px", src:"img/kids_op2_more.png"}));
			_comp.areas[btnNo]._list.add(new W.Span({x:201 * (i%3), y:93 * Math.floor(i/3) + 26, width:"192px", height:"22px", textColor:"rgb(104,72,46)", "font-size":"20px", 
				className:"font_rixhead_medium", text:_comp.areas[btnNo].names[i], textAlign:"center"}));
			_comp.areas[btnNo]._focs[i] = new W.Div({x:201 * (i%3), y:93 * Math.floor(i/3), width:"192px", height:"75px", display:"none"});
			_comp.areas[btnNo]._list.add(_comp.areas[btnNo]._focs[i]);
			_comp.areas[btnNo]._focs[i].add(new W.Image({x:0, y:0, width:"192px", height:"75px", src:"img/kids_op2_more_foc.png"}));
			_comp.areas[btnNo]._focs[i].add(new W.Span({x:0, y:26, width:"192px", height:"22px", textColor:"rgb(255,255,255)", "font-size":"20px", 
				className:"font_rixhead_medium", text:_comp.areas[btnNo].names[i], textAlign:"center"}));
			
		}
		_comp.btnObjs[btnNo].total = Math.ceil(_comp.areas[btnNo].names.length / 6);
	};
	
	function makePhoto(btnNo){
		_comp.areas[btnNo] = new W.Div({x:394, y:274, width:"494px", height:"207px", overflow:"hidden", opacity:0, textAlign:"center"});
		_comp.add(_comp.areas[btnNo]);
		_comp.areas[btnNo]._photos = [];
		
		for(var i=0; i < detail.stillcutCount; i++){
			var imgPath = W.Config.IMAGE_URL + detail.stillcutBaseUrl + "/" + util.changeDigit(i, 2) + ".jpg";
			_comp.areas[btnNo]._photos[i] = new W.Image({position:"relative", width:"auto", height:"207px", src:imgPath, display:i==0 ? "" : "none"});
			_comp.areas[btnNo].add(_comp.areas[btnNo]._photos[i]);
		}
		
		_comp.btnObjs[btnNo].total = detail.stillcutCount;
	}
	
	function create(){
		_comp.add(new W.Image({x:467, y:97, width:"346px", height:"68px", src:"img/kids_pop_title.png"}));
		_comp.add(new W.Span({x:488, y:114, width:"304px", height:"28px", textColor:"rgb(255,233,43)", "font-size":"26px",
			className:"font_rixhead_bold cut", text:detail.title, textAlign:"center"}));

		_comp.btns = [];
		_comp.btnObjs = [];
		_comp.areas = [];
		_comp.areas = [];
		var btnNo = 0;
		var _btn_area = new W.Div({x:341, y:196, width:"600px", height:"40px", textAlign:"center"});
		_comp.add(_btn_area);
		var btnStyle = {display:"inline-block", padding:"3px"};
		
		if(detail.contentType == "Sasset" && detail.awardInfoList && detail.awardInfoList.length > 0){
			_comp.btns[btnNo] = buttonComp.create("relative", 0, W.Texts["award_info_list"], btnStyle);
			_btn_area.add(_comp.btns[btnNo].getComp());
			_comp.btnObjs[btnNo] = {type:"award"};
			awardsNo = btnNo;
			makeAward(btnNo);
			btnNo++;
		}
		
		_comp.btns[btnNo] = buttonComp.create("relative", 0, W.Texts["total_synopsis"], btnStyle);
		_btn_area.add(_comp.btns[btnNo].getComp());
		_comp.btnObjs[btnNo] = {type:"synopsis"};
		synopsisNo = btnNo;
		makeSynopsis(btnNo);
		btnNo++;
		
		if(detail.contentType == "Sasset" && detail.stillcutCount){
			_comp.btns[btnNo] = buttonComp.create("relative", 0, W.Texts["photo"], btnStyle);
			_btn_area.add(_comp.btns[btnNo].getComp());
			_comp.btnObjs[btnNo] = {type:"photo"};
			makePhoto(btnNo);
			btnNo++;
		}
		
		
		var actors = [];
		if(detail.contentType == "series"){
			if(detail.members[0]){
				if(detail.members[0].actor && detail.members[0].actor != "-"){
        			actors = actors.concat(detail.members[0].actor.split(","));
        		}
				if(detail.members[0].director && detail.members[0].director != "-"){
					actors = actors.concat(detail.members[0].director);
        		}
    		}
		}else{
			if(detail.director && detail.director != "-"){
				actors = actors.concat(detail.director);
			}
			if(detail.actor && detail.actor != "-"){
				actors = actors.concat(detail.actor.split(","));
			}
		}
		if(actors.length > 0){
			_comp.btns[btnNo] = buttonComp.create("relative", 0, W.Texts["actors_info"], btnStyle);
			_btn_area.add(_comp.btns[btnNo].getComp());
			_comp.btnObjs[btnNo] = {type:"actor"};
			makeCasting(btnNo, actors);
		}
		
		
		_comp.add(new W.Div({x:343, y:252, width:"594px", height:"2px", backgroundColor:"rgb(221,207,191)"}));
		_comp.add(new W.Div({x:343, y:502, width:"594px", height:"2px", backgroundColor:"rgb(221,207,191)"}));
		
		_comp._foc_syno1 = new W.Div({x:343, y:251, width:"594px", height:"4px", display:"none"});
		_comp._foc_syno1.add(new W.Image({x:0, y:0, width:"3px", height:"4px", src:"img/line_f_l.png"}));
		_comp._foc_syno1.add(new W.Div({x:3, y:0, width:"588px", height:"4px", backgroundColor:"#E53000"}));
		_comp._foc_syno1.add(new W.Image({x:591, y:0, width:"3px", height:"4px", src:"img/line_f_r.png"}));
		_comp.add(_comp._foc_syno1);
		_comp._foc_syno2 = new W.Div({x:343, y:501, width:"594px", height:"4px", display:"none"});
		_comp._foc_syno2.add(new W.Image({x:0, y:0, width:"3px", height:"4px", src:"img/line_f_l.png"}));
		_comp._foc_syno2.add(new W.Div({x:3, y:0, width:"588px", height:"4px", backgroundColor:"#E53000"}));
		_comp._foc_syno2.add(new W.Image({x:591, y:0, width:"3px", height:"4px", src:"img/line_f_r.png"}));
		_comp.add(_comp._foc_syno2);
		
		_comp._page = new W.Div({x:877, y:517, width:"60px", height:"17px", textAlign:"right", opacity:0});
		_comp.add(_comp._page);
		_comp._cPage = new W.Span({position:"relative", y:0, height:"16px", textColor:"rgb(31,25,20)", "font-size":"16px", 
			className:"font_rixhead_bold", text:""});
		_comp._tPage = new W.Span({position:"relative", y:0, height:"16px", textColor:"#857B72", "font-size":"16px", 
			className:"font_rixhead_bold", text:""});
		_comp._page.add(_comp._cPage);
		_comp._page.add(_comp._tPage);
		
		_comp._arr_l = new W.Image({x:273, y:347, width:"50px", height:"50px", src:"img/kids_arr_l.png", opacity:0});
		_comp.add(_comp._arr_l);
		_comp._arr_r = new W.Image({x:957, y:347, width:"50px", height:"50px", src:"img/kids_arr_r.png", opacity:0});
		_comp.add(_comp._arr_r);
		
		_comp._close_btn_dim = new W.Div({x:559, y:516, width:"162px", height:"51px"});
		_comp.add(_comp._close_btn_dim);
		_comp._close_btn_dim.add(new W.Image({x:0, y:0, width:"162px", height:"51px", src:"img/kids_pop_bt.png"}));
		_comp._close_btn_dim.add(new W.Span({x:0, y:13, width:"162px", height:"22px", textColor:"rgb(255,255,255)", "font-size":"20px", 
			className:"font_rixhead_medium", text:W.Texts["close"], textAlign:"center"}));
		
		_comp._close_btn_foc = new W.Div({x:559, y:516, width:"162px", height:"51px", display:"none"});
		_comp.add(_comp._close_btn_foc);
		_comp._close_btn_foc.add(new W.Image({x:0, y:0, width:"167px", height:"57px", src:"img/kids_pop_bt_f.png"}));
		_comp._close_btn_foc.add(new W.Span({x:0, y:13, width:"162px", height:"22px", textColor:"rgb(255,255,255)", "font-size":"20px", 
			className:"font_rixhead_medium", text:W.Texts["close"], textAlign:"center"}));

		_comp.btnObjs[awardsNo].height = _comp.areas[awardsNo]._text.comp.offsetHeight;
		_comp.btnObjs[awardsNo].total = Math.ceil(_comp.btnObjs[awardsNo].height / 224);
		W.log.info("--------------------------- " + _comp.btnObjs[awardsNo].height);
		
		_comp.btnObjs[synopsisNo].height = _comp.areas[synopsisNo]._text.comp.offsetHeight;
		_comp.btnObjs[synopsisNo].total = Math.ceil(_comp.btnObjs[synopsisNo].height / 224);
		W.log.info("--------------------------- " + _comp.btnObjs[synopsisNo].height);

	};

	var focusBtn = function(){
		_comp.btns[oldIndex].unFocus();
		_comp.btns[index].focus();
		clearTimeout(btnTimeout);
		btnTimeout = setTimeout(function(){
			selectedIdxOld = selectedIdx;
			selectedIdx = index;
			showContents();
			btnTimeout = undefined;
		}, 300);
	};
	
	function showContents(){
		if(_comp.btnObjs[selectedIdxOld].type == "award"){
			_comp.areas[selectedIdxOld]._text.setStyle({y:0});
		}else if(_comp.btnObjs[selectedIdxOld].type == "synopsis"){
			_comp.areas[selectedIdxOld]._text.setStyle({y:0});
		}else if(_comp.btnObjs[selectedIdxOld].type == "photo"){
			
		}else if(_comp.btnObjs[selectedIdxOld].type == "actor"){
			_comp.areas[selectedIdxOld]._list.setStyle({y:0});
		}
		_comp.areas[selectedIdxOld].setStyle({opacity:0});
		_comp.areas[selectedIdx].setStyle({opacity:1});

		cIdx = 0;
		
		_comp._cPage.setText("01 ");
		_comp._tPage.setText("/ " + W.Util.changeDigit(_comp.btnObjs[index].total, 2));
		
		if(_comp.btnObjs[index].total > 1){
			_comp._page.setStyle({opacity:0.4});
			_comp._arr_l.setStyle({opacity:0.3});
			_comp._arr_r.setStyle({opacity:0.3});
		}else{
			_comp._page.setStyle({opacity:0});
			_comp._arr_l.setStyle({opacity:0});
			_comp._arr_r.setStyle({opacity:0});
		}
	};
	
	function focusContents(){
		state = STATE_CONTENTS;
		if(_comp.btnObjs[selectedIdx].type == "actor"){
			_comp.areas[selectedIdx]._focs[cIdx].setStyle({display:""});
		}else{
			_comp._foc_syno1.setStyle({display:"block"});
			_comp._foc_syno2.setStyle({display:"block"});
		}
		if(_comp.btnObjs[selectedIdx].total > 1){
			_comp._page.setStyle({opacity:1});
			_comp._arr_l.setStyle({opacity:1});
			_comp._arr_r.setStyle({opacity:1});
		}
	};
	
	function unFocusContents(){
		if(_comp.btnObjs[selectedIdx].type == "actor"){
			_comp.areas[selectedIdx]._focs[cIdx].setStyle({display:"none"});
		}else{
			_comp._foc_syno1.setStyle({display:"none"});
			_comp._foc_syno2.setStyle({display:"none"});
		}
		if(_comp.btnObjs[selectedIdx].total > 1){
			_comp._page.setStyle({opacity:0.4});
			_comp._arr_l.setStyle({opacity:0.3});
			_comp._arr_r.setStyle({opacity:0.3});
		}
	};
	
	function focusClose(){
		state = STATE_CLOSE;
		_comp._close_btn_foc.setStyle({display:"block"});
		_comp._close_btn_dim.setStyle({display:"none"});
	};
	
	function unFocusClose(){
		_comp._close_btn_foc.setStyle({display:"none"});
		_comp._close_btn_dim.setStyle({display:"block"});
	};
	
	function focus(){
		W.log.info(cIdx);
		if(_comp.btnObjs[selectedIdx].type == "award"){
			_comp.areas[selectedIdx]._text.setStyle({y:-cIdx * 224});
			_comp._cPage.setText(util.changeDigit((cIdx+1), 2) + " ");
		}else if(_comp.btnObjs[selectedIdx].type == "synopsis"){
			_comp.areas[selectedIdx]._text.setStyle({y:-cIdx * 224});
			_comp._cPage.setText(util.changeDigit((cIdx+1), 2) + " ");
		}else if(_comp.btnObjs[selectedIdx].type == "photo"){
			_comp.areas[selectedIdx]._photos[cIdxOld].setStyle({display:"none"});
			_comp.areas[selectedIdx]._photos[cIdx].setStyle({display:""});
			_comp._cPage.setText(util.changeDigit((cIdx+1), 2) + " ");
		}else if(_comp.btnObjs[selectedIdx].type == "actor"){
			_comp.areas[selectedIdx]._focs[cIdxOld].setStyle({display:"none"});
			_comp.areas[selectedIdx]._focs[cIdx].setStyle({display:"block"});
			_comp.areas[selectedIdx]._list.setStyle({y:-93 * Math.floor(cIdx/6) * 2});
			_comp._cPage.setText(util.changeDigit((Math.floor(cIdx/6) + 1), 2) + " ");
		}
	};
	
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("KidsMoreInfoPopup onStart");
    		detail = _param.data;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		
    		var _bg = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.5)"});
    		_bg.add(new W.Image({x:179, y:73, width:"110px", height:"590px", src:"img/kids_pop_bg4_l.png"}));
    		_bg.add(new W.Image({x:289, y:73, width:"702px", height:"590px", src:"img/kids_pop_bg4_m.png"}));
    		_bg.add(new W.Image({x:991, y:73, width:"110px", height:"590px", src:"img/kids_pop_bg4_r.png"}));
    		this.add(_bg);
    		_comp = new W.Div({className:"bg_size"});
    		this.add(_comp);
    		state = STATE_BTNS;
    		cIdx = 0;
    		index = 0;
    		oldIndex = 0;
    		total = 0;
    		page = 0;
    		selectedIdxOld = 0;
    		selectedIdx = 0;
    		create();
    		_comp.btns[0].focus();
    		showContents();
    	},
    	onStop: function() {
    		W.log.info("KidsMoreInfoPopup onStop");
    		state = STATE_BTNS;
    		cIdx = 0;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("KidsMoreInfoPopup onKeyPressed "+event.keyCode);
    		if(btnTimeout && state != STATE_BTNS) return;
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(state == STATE_BTNS){
    				_comp.btns[index].selected();
    				focusContents();
    			}else if(state == STATE_CONTENTS){
    				if(_comp.btnObjs[selectedIdx].type == "actor"){
    					W.PopupManager.closePopup(this, {
    						action:W.PopupManager.ACTION_OK,
    						keyword:_comp.areas[selectedIdx].names[cIdx],
    						m_field: cIdx == 0 ? "director" : "actor"
    					});
    				}
    			}else if(state == STATE_CLOSE){
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(state == STATE_BTNS){
    	    		oldIndex = index;
    				index = (++index) % _comp.btns.length;
    				focusBtn();
    			}else if(state == STATE_CONTENTS){
    				cIdxOld = cIdx;
    				if(_comp.btnObjs[selectedIdx].type == "award" || _comp.btnObjs[selectedIdx].type == "synopsis" || _comp.btnObjs[selectedIdx].type == "photo"){
    					cIdx = (++cIdx) % _comp.btnObjs[selectedIdx].total;
    				}else{
    					if(cIdx%6 == 2 || cIdx%6 == 5){
    						if(cIdx + 4 < _comp.areas[selectedIdx].names.length){
    							cIdx += 4;
    						}else{
    							if(cIdx%6 == 5){
    								if(cIdx + 1 < _comp.areas[selectedIdx].names.length){
    									cIdx++;
    								}else{
    									if(_comp.areas[selectedIdx].names.length > 3){
    										cIdx = 2;
    									}else{
    										cIdx = _comp.areas[selectedIdx].names.length - 1;
    									}
    								}
    							}else{
    								cIdx = 0;
    							}
    						}
    					}else{
    						if(cIdx + 1 < _comp.areas[selectedIdx].names.length){
    							cIdx++;
    						}else{
    							cIdx = 0;
    						}
    					}
    				}
    				focus();
    			}
    			break;
    		case W.KEY.LEFT:
    			if(state == STATE_BTNS){
    	    		oldIndex = index;
    				index = (--index + _comp.btns.length) % _comp.btns.length;
    				focusBtn();
    			}else if(state == STATE_CONTENTS){
    				cIdxOld = cIdx;
    				if(_comp.btnObjs[selectedIdx].type == "award" || _comp.btnObjs[selectedIdx].type == "synopsis" || _comp.btnObjs[selectedIdx].type == "photo"){
    					cIdx = (--cIdx + _comp.btnObjs[selectedIdx].total) % _comp.btnObjs[selectedIdx].total;
    				}else{
    					if(cIdx%3 == 0){
    						if(cIdx - 4 > 0){
    							cIdx -= 4;
    						}else{
    							var tmp = (_comp.areas[selectedIdx].names.length-1) % 6;
    							if(cIdx%6 == 3){
    								cIdx = _comp.areas[selectedIdx].names.length-1;
    							}else{
    								if(tmp > 2){
    									cIdx = (_comp.btnObjs[selectedIdx].total-1) * 6 + 2;
    								}else{
    									cIdx = _comp.areas[selectedIdx].names.length-1;
    								}
    							}
    						}
    					}else{
    						cIdx--;
    					}
    				}
    				focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(state == STATE_CONTENTS){
    				if(_comp.btnObjs[selectedIdx].type == "award" || _comp.btnObjs[selectedIdx].type == "synopsis" || _comp.btnObjs[selectedIdx].type == "photo"){
    					unFocusContents();
						state = STATE_BTNS;
						_comp.btns[index].focus();
    				}else if(_comp.btnObjs[selectedIdx].type == "actor"){
    					if(cIdx%6 > 2){
    						cIdxOld = cIdx;
							cIdx -= 3;
    						focus();
    					}else{
    						unFocusContents();
    						state = STATE_BTNS;
    						_comp.btns[index].focus();
    					}
    				}
    			}else if(state == STATE_CLOSE){
    				unFocusClose();
    				focusContents();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(state == STATE_BTNS){
    				_comp.btns[index].selected();
    				focusContents();
    			}else if(state == STATE_CONTENTS){
    				if(_comp.btnObjs[selectedIdx].type == "award" || _comp.btnObjs[selectedIdx].type == "synopsis" || _comp.btnObjs[selectedIdx].type == "photo"){
    					unFocusContents();
						focusClose();
    				}else if(_comp.btnObjs[selectedIdx].type == "actor"){
    					if(cIdx%6 > 2){
    						cIdxOld = cIdx;
    						unFocusContents();
    						focusClose();
    					}else{
    						if(cIdx + 3 < _comp.areas[selectedIdx].names.length){
    							cIdxOld = cIdx;
    							cIdx += 3;
        						focus();
    						}else{
    							unFocusContents();
        						focusClose();
    						}
    					}
    				}
    			}
    			break;
    		}
    	}
    });
});