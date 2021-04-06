/**
 * popup/AdultCheckPopup
 */
W.defineModule(["comp/PopupButton", "mod/Util"], function(buttonComp, util) {
	'use strict';
	W.log.info("AdultCheckPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var yIndex = 0;
	var pinNum;
	var wrongCount = 0;

	function create(){
		_comp.add(new W.Span({x:448-418, y:222-194, width:"384px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:desc.type == "purchase" ? W.Texts["popup_pin_purchase_title"] : W.Texts["popup_pin_adult_title"], textAlign:"center"}));

		_comp.add(new W.Div({x:448-418, y:279-194, width:"384px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));

		if(desc.type == "clear_setting") {
			_comp._normal = new W.Div({x:448-418, y:338-194, width:"384px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"16px",
				className:"font_rixhead_light", textAlign:"center", "letter-spacing" : "-0.8px"});
			_comp._normal.comp.innerHTML = "<span style='position:relative;color:rgba(237,168,2,0.75)'>" + W.Texts["popup_pin_adult"] +
				"</span> <span style='position:relative;color:rgba(181,181,181,0.75)'>" + W.Texts["popup_pin_ask"] + "</span>";
			_comp._normal.add(new W.Span({x:448-448, y:288-328, width:"384px", height:"20px", textColor:"rgba(255,255,255,1)", "font-size":"22px",
				className:"font_rixhead_medium", text:W.Texts["popup_pin_clear_setting"], textAlign:"center", "letter-spacing":"0.22px"}));
			_comp.add(_comp._normal);
		} else if(desc.type == "clear_purchase") {
			_comp._normal = new W.Div({x:448-418, y:338-194, width:"384px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"16px",
				className:"font_rixhead_light", textAlign:"center", "letter-spacing" : "-0.8px"});
			_comp._normal.comp.innerHTML = "<span style='position:relative;color:rgba(237,168,2,0.75)'>" + W.Texts["popup_pin_adult"] +
				"</span> <span style='position:relative;color:rgba(181,181,181,0.75)'>" + W.Texts["popup_pin_ask"] + "</span>";
			_comp._normal.add(new W.Span({x:448-448, y:288-328, width:"384px", height:"20px", textColor:"rgba(255,255,255,1)", "font-size":"22px",
				className:"font_rixhead_medium", text:W.Texts["reset_purchase_pin_popup"], textAlign:"center", "letter-spacing":"0.22px"}));
			_comp.add(_comp._normal);
		} else {
			_comp._normal = new W.Div({x:448-418, y:318-194, width:"384px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"22px",
				className:"font_rixhead_medium", textAlign:"center", "letter-spacing" : "-0.9px"});
			_comp._normal.comp.innerHTML = "<span style='position:relative;color:#EDA802'>" + (desc.type == "purchase" ? W.Texts["popup_pin_purchase"] : W.Texts["popup_pin_adult"]) +
				"</span> <span style='position:relative'>" + W.Texts["popup_pin_ask"] + "</span>";
			_comp.add(_comp._normal);
		}

		_comp._wrong = new W.Div({x:448-418, y:318-194, width:"384px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"22px",
			className:"font_rixhead_medium", textAlign:"center", "letter-spacing" : "-0.9px", display:"none"});
		_comp._wrong.comp.innerHTML = "<span style='position:relative;color:#EDA802'>" + (desc.type == "purchase" ? W.Texts["popup_pin_purchase"] : W.Texts["popup_pin_adult"]) +
			"</span> <span style='position:relative'>" + W.Texts["popup_pin_not_correct"] + "</span>";
		_comp._wrong.add(new W.Span({id:"wrong_guide_call", x:448-448, y:328-298, width:"384px", height:"20px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px",
			className:"font_rixhead_light", text:W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER, textAlign:"center", display:"none"}));
		_comp.add(_comp._wrong);

		_comp.add(new W.Image({x:518-418, y:375-194, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		_comp._foc = new W.Image({x:517-418, y:374-194, width:"246px", height:"58px", src:"img/box_set244_f.png"});
		_comp.add(_comp._foc);
		
		_comp._pin = new W.Span({x:518-418, y:395-194, width:"244px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_extrabold", text:"", textAlign:"center"});
		_comp.add(_comp._pin);
		
		var _btn_area = new W.Div({x:448-418, y:466-194, width:"384px", height:"41px", textAlign:"center"});
		_comp.add(_btn_area);

		_comp.btns = [];
		_comp._btns = [];
		_comp.btns[0] = buttonComp.create("relative", 0, W.Texts["ok"], 133, false, {display:"inline-block", opacity:0.4, marginRight:"3px"});
		_comp._btns[0] = _comp.btns[0].getComp();
		_comp.btns[1] = buttonComp.create("relative", 0, W.Texts["cancel"], 133, false, {display:"inline-block", marginLeft:"3px"});
		_comp._btns[1] = _comp.btns[1].getComp();
		
		_btn_area.add(_comp._btns[0]);
		_btn_area.add(_comp._btns[1]);
	};
	
	function setStar(){
		var tmp = "";
		for(var i=0; i < pinNum.length; i++){
			tmp += (i > 0 ? " " : "") + "*";
		}
		_comp._pin.setText(tmp);
	};

	function checkPin() {
		W.CloudManager.authPin(function(data){
			if(data && data.data == "OK") {
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, oldPIN:pinNum, type:desc.type, param : desc.param});
			} else {
				wrongCount++;
				if(wrongCount > 4){
					_comp._wrong.setStyle({y:318-194});
					document.getElementById("wrong_guide_call").style.display = "block";
				}
				_comp._normal.setStyle({display:"none"});
				_comp._wrong.setStyle({display:"block"});
				pinNum = "";
				setStar();
				_comp._btns[0].setStyle({opacity:0.4});
				_comp.btns[bIndex].unFocus();
				yIndex = 0;
				_comp._foc.setStyle({display:"block"});
				_comp._pin.setStyle({textColor:"rgb(255,255,255)"});
			}
		}, pinNum, desc.type == "purchase" ? false : true);
	};
	
	function focus(){
		if(bIndex == 0){
			_comp.btns[1].unFocus();
			_comp.btns[0].focus();
		}else{
			_comp.btns[0].unFocus();
			_comp.btns[1].focus();
		}
	}

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("AdultCheckPopup onStart");
    		desc = _param;
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:418, y:194, width:"444px", height:"333px", className:"popup_comp_color popup_comp_border"});

			W.CloudManager.addNumericKey();
    		this.add(_comp);
    		bIndex = 1;
    		yIndex = 0;
    		pinNum = "";
    		create();
    	},
    	onStop: function() {
    		W.log.info("AdultCheckPopup onStop");
			W.CloudManager.delNumericKey();
    	},
    	onKeyPressed : function(event) {
    		W.log.info("AdultCheckPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    			}else{
    				if(bIndex == 0){
    					checkPin();
    				}else{
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1){
    				if(pinNum.length == 4){
    					bIndex = bIndex ? 0 : 1;
    					focus();
    				}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 1){
    				if(pinNum.length == 4){
    					bIndex = bIndex ? 0 : 1;
    					focus();
    				}
    			}else{
    				pinNum = pinNum.substr(0, pinNum.length-1);
    				_comp._btns[0].setStyle({opacity:0.4});
    				setStar();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				_comp._foc.setStyle({display:"none"});
					_comp._pin.setStyle({textColor:"rgba(181,181,181,0.75)"});
					yIndex = 1;
					bIndex = pinNum.length == 4 ? 0 : 1;
					_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 1){
    				_comp.btns[bIndex].unFocus();
					yIndex = 0;
    				_comp._foc.setStyle({display:"block"});
					_comp._pin.setStyle({textColor:"rgb(255,255,255)"});
    			}
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
    			if(yIndex == 0){
					if(pinNum.length == 4) {
						pinNum = "";
					}
					
    				pinNum += String(event.keyCode - 48);
    				setStar();
    				if(pinNum.length == 4){
    					_comp._foc.setStyle({display:"none"});
        				_comp._btns[0].setStyle({opacity:1});
        				yIndex = 1;
						bIndex = 0;
						focus();
    				}
    			}
    			break;
    		}
    	}
    });
});