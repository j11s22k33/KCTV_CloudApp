/**
 * popup/ZzimMovePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("ZzimMovePopup");
	var sdpDataManager = W.getModule("manager/SdpDataManager");
	var _this;
	var _comp;
	var index;
	var yIndex;
	var cIndex;
	var sIndex;
	var bIndex = 0;
	var desc;
	var noSpace = false;
	var registedCount = 0;
	
	function create(){
		_comp.add(new W.Span({x:159, y:130, width:"647px", height:"38px", textColor:"rgb(255,255,255)", "font-size":"27px",
			className:"font_rixhead_medium", text:W.Texts["zzim_list"] + " " + W.Texts["move2"], textAlign:"left", "letter-spacing":"-1.35px"}));
		
		_comp.add(new W.Div({x:768, y:161, width:"1px", height:"496px", backgroundColor:"rgb(40,40,40)"}));
		
		_comp.add(new W.Span({x:988-314/2, y:289-20, width:"314px", height:"28px", textColor:"rgb(255,255,255)", "font-size":"24px",
			className:"font_rixhead_medium cut", text:desc.list[0].target.title, textAlign:"center"}));

		if(desc.list.length > 1) {
			_comp.add(new W.Span({x:988-314/2, y:289+28-20, width:"314px", height:"28px", textColor:"rgb(255,255,255)", "font-size":"24px",
				className:"font_rixhead_medium", text:" 외 " + (desc.list.length-1) + "개", textAlign:"center"}));
		}

		_comp.add(new W.Span({x:160, y:166, width:"647px", height:"24px", textColor:"rgb(181,181,181)", "font-size":"18px",
			className:"font_rixhead_light", text:W.Texts["popup_zzim_move_guide1"], textAlign:"left"}));
		_comp.add(new W.Span({x:160, y:166+24, width:"647px", height:"24px", textColor:"rgb(181,181,181)", "font-size":"18px",
			className:"font_rixhead_light", text:W.Texts["popup_zzim_move_guide3"], textAlign:"left"}));

		_comp.add(new W.Span({x:988-314/2, y:335, width:"314px", height:"24px", textColor:"rgb(132,122,119)", "font-size":"18px",
			className:"font_rixhead_medium", text:"※ VOD " + W.Texts["popup_zzim_move_guide2"], textAlign:"left"}));

		for(var i=0; i < 5; i++){
			if(cIndex == i) {
				registedCount++;
				continue;
			}
			if(_this.pinsList[i].count + desc.list.length > 40){
				registedCount++;
				continue;
			}
			if(_this.pinsList[i].isRegisted && desc.list.length == 1) {
				registedCount++;
				continue;
			}
			
			sIndex = i;
			index = sIndex;
			break;
		}
		
		_comp._list = [];
		for(var i=0; i < 5; i++){
			_comp._list[i] = new W.Div({x:159, y:245 + (67 * i), width:"371px", height:"58px",
				textColor: i==index ? "rgb(255,255,255)" : "rgb(181,181,181)"});
			_comp.add(_comp._list[i]);
			_comp._list[i].add(new W.Image({x:1, y:1, width:"369px", height:"56px", src:"img/box_set369.png"}));
			_comp._list[i]._foc = new W.Image({x:0, y:0, width:"371px", height:"58px", src:"img/box_set369_f.png", display:i==index ? "block" : "none"});
			_comp._list[i].add(_comp._list[i]._foc);

			//i == 3 은 임시로 사용 실제는 개수 초과 인 찜목록의 index
			if(_this.pinsList[i].count + desc.list.length > 40){
				_comp._list[i].add(new W.Image({x:174-159, y:263-245, width:"22px", height:"22px", src:"img/radio2_d.png"}));
				_comp._list[i].add(new W.Span({position:"relative", x:203-159, y:263-245, width:"150px", height:"20px", "font-size":"18px", textColor:"rgba(86,86,86,0.75)",
					className:"font_rixhead_medium", text:W.Texts["popup_zzim_move_text1"] + (i+1), "letter-spacing":"-1.0px"}));
				_comp._list[i].add(new W.Span({position:"relative", x:203-159, y:263-245, width:"150px", height:"20px", "font-size":"18px",
					className:"font_rixhead_medium", text:" (" + _this.pinsList[i].count + ")", "letter-spacing":"-1.0px", textColor:"rgba(255,80,80,0.75)"}));
				//_comp._list[i].add(new W.Span({x:203-159, y:37, width:"150px", height:"20px", "font-size":"18px",
				//	className:"font_rixhead_light", text:W.Texts["popup_zzim_move_text2"]}));
			}else if(cIndex == i){
				_comp._list[i].add(new W.Image({x:174-159, y:263-245, width:"22px", height:"22px", src:"img/radio2_d.png"}));

				_comp._list[i].add(new W.Span({position:"relative", x:203-159, y:263-245, width:"150px", height:"20px", "font-size":"18px", textColor:"rgba(86,86,86,0.75)",
					className:"font_rixhead_medium", text:W.Texts["popup_zzim_move_text1"] + (i+1) + " (" + _this.pinsList[i].count + ")", "letter-spacing":"-1.0px"}));
				_comp._list[i].add(new W.Span({x:506-159-150, y:263-245, width:"150px", height:"20px", "font-size":"18px", textAlign:"right",
					className:"font_rixhead_medium", text:W.Texts["now_list"], "letter-spacing":"-0.9px", textColor:"rgb(161,181,221)"}));
			}else if(_this.pinsList[i].isRegisted && desc.list.length == 1){
				_comp._list[i].add(new W.Image({x:174-159, y:263-245, width:"22px", height:"22px", src:"img/radio2_d.png"}));

				_comp._list[i].add(new W.Span({position:"relative", x:203-159, y:263-245, width:"150px", height:"20px", "font-size":"18px", textColor:"rgba(86,86,86,0.75)",
					className:"font_rixhead_medium", text:W.Texts["popup_zzim_move_text1"] + (i+1) + " (" + _this.pinsList[i].count + ")", "letter-spacing":"-1.0px"}));
				_comp._list[i].add(new W.Span({x:506-159-150, y:263-245, width:"150px", height:"20px", "font-size":"18px", textAlign:"right",
					className:"font_rixhead_medium", text:W.Texts["zzim_msg_registed"], "letter-spacing":"-0.9px", textColor:"rgb(161,181,221)"}));
			}else{
				_comp._list[i].add(new W.Image({x:174-159, y:263-245, width:"22px", height:"22px", src:"img/radio_n.png"}));
				_comp._list[i]._selected = new W.Image({x:174-159, y:263-245, width:"22px", height:"22px", src:"img/radio_f.png", display:i==sIndex ? "block" : "none"});
				_comp._list[i].add(_comp._list[i]._selected);

				_comp._list[i].add(new W.Span({position:"relative", x:203-159, y:263-245, width:"150px", height:"20px", "font-size":"18px",
					className:"font_rixhead_medium", text:W.Texts["popup_zzim_move_text1"] + (i+1) + " (" + _this.pinsList[i].count + ")", "letter-spacing":"-1.0px"}));
			}
		}
		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(926, 375, W.Texts["move2"], 123);
		_comp.btns[1] = buttonComp.create(926, 423, W.Texts["cancel"], 123);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());

		if(registedCount == 5){
			W.PopupManager.openPopup({
                childComp:_this,
                title:W.Texts["popup_zzim_info_title"],
                popupName:"popup/AlertPopup",
                boldText:W.Texts["popup_zzim_move_guide6"],
                thinText:W.Texts["popup_zzim_move_guide5"]}
            );
		}else{
			if(sIndex < 0) {
				yIndex = 1;
				noSpace = true;
				W.log.info(_comp.btns[0]);
				_comp.btns[0].getComp().setStyle({opacity:0.5});
				bIndex = 1;
				_comp.btns[bIndex].focus();
			}
		}
	};
	
	var focus = function(){
		if(yIndex == 0){
			_comp._list[index].setStyle({textColor:"rgb(255,255,255)"});
			_comp._list[index]._foc.setStyle({display:"block"});
		}else{
			_comp.btns[bIndex].focus();
		}
	};
	
	var unFocus = function(){
		if(yIndex == 0){
			_comp._list[index].setStyle({textColor:"rgb(181,181,181)"});
			_comp._list[index]._foc.setStyle({display:"none"});
		}else{
			_comp.btns[bIndex].unFocus();
		}
	};

	var getPinsList = function() {
		sdpDataManager.pinsList(cbGetPinsList, {});
	}

	var cbGetPinsList = function(isSuccess, result) {
		W.log.info(result);
		if(isSuccess) {
			_this.pinsList = result.data;
			for(var i=0; i < _this.pinsList.length; i++){
				var isRegisted = false;
				for(var j=0; j < _this.pinsList[i].count; j++){
					if(_this.pinsList[i].list[j] == desc.list[0].targetId){
						isRegisted = true;
						break;
					}
				}
				_this.pinsList[i].isRegisted = isRegisted;
			}
			
			create();
		}
	}

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ZzimMovePopup onStart");
			W.SceneManager.getCurrentScene().comp.style.display="none";
    		desc = _param.data;
    		//desc = {};
    		//desc.idx = 1;
    		//desc.list = [{title:"로봇이 아니야 12회"}, {title:"로봇이 아니야 12회"}, {title:"로봇이 아니야 12회"}, {title:"로봇이 아니야 12회"}, {title:"로봇이 아니야 12회"}, {title:"로봇이 아니야 12회"}];
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className : "bg_size"});
            _comp._bg = new W.Div({className : "bg_size", backgroundColor:"rgba(0,0,0,0.9)"});
            _comp.add(_comp._bg);
            _comp.add(new W.Div({x:770, y:0, width:"510px", height:"720px", backgroundColor:"rgba(0,0,0,0.4)"}));

    		this.add(_comp);
    		yIndex = 0;
    		cIndex = desc.idx;
			sIndex = -1;
    		index = -1;
    		bIndex = 0;
			noSpace = false;
    		//create();
			getPinsList();
    	},
    	onStop: function() {
    		W.log.info("ZzimMovePopup onStop");
			W.SceneManager.getCurrentScene().comp.style.display="block";
    	},
    	onKeyPressed : function(event) {
    		W.log.info("ZzimMovePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, idx:1});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				_comp._list[sIndex]._selected.setStyle({display:"none"});
					sIndex = index;
    				_comp._list[sIndex]._selected.setStyle({display:"block"});
    				unFocus();
    				bIndex = 0;
    				yIndex = 1;
    				focus();
    			}else{
        			if(bIndex == 0){
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:sIndex});
        			}else{
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, idx:sIndex});
        			}
    			}
    			break;
    		case W.KEY.LEFT:
				if(noSpace) {

				} else {
					unFocus();
					if(yIndex == 0){
					}else{
						index = sIndex;
						yIndex = 0;
					}
					focus();
				}
    			break;
    		case W.KEY.RIGHT:
				if(noSpace) {

				} else {
					unFocus();
					if(yIndex == 0){
						bIndex = 0;
						yIndex = 1;
					}else{
					}
					focus();
				}
    			break;
    		case W.KEY.DOWN:
				if(noSpace) {

				} else {
					if(yIndex == 0){
						unFocus();
						if(index < 5){
							index++;
						} else {
							index = 0;
						}
						
						for(var i = 0; i < 5; i++) {
							if(_this.pinsList[(i+index)%5].count + desc.list.length > 40 || cIndex == (i+index)%5 || (_this.pinsList[(i+index)%5].isRegisted && desc.list.length == 1)){
								continue;
							} else {
								index = (index + i)%5;
								break;
							}
						}
						focus();
					} else {
						unFocus();
						bIndex = bIndex == 0 ? 1 : 0;
						focus();
					}
				}
    			break;
    		case W.KEY.UP:
				if(noSpace) {

				} else {
					if(yIndex == 0){
						unFocus();
						if(index > 0){
							index--;
						} else {
							index = 4;
						}
						for(var i = 0; i < 5; i++) {
							if(_this.pinsList[(index-i+5)%5].count + desc.list.length > 40 || cIndex == (index-i+5)%5 || (_this.pinsList[(index-i+5)%5].isRegisted && desc.list.length == 1)){
								continue;
							} else {
								index = (index - i + 5)%5;
								break;
							}
						}
						focus();
					}else{
						unFocus();
						bIndex = bIndex == 0 ? 1 : 0;
						focus();
					}
				}
    			break;
    		}
    	},
        onPopupClosed : function (popup, desc) {
        	if (desc && desc.popupName == "popup/AlertPopup") {
        		W.PopupManager.closePopupAll();
        	}
        }
    });
});