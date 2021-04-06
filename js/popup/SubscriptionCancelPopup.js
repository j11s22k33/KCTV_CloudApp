/**
 * popup/SubscriptionCancelPopup
 */
W.defineModule(["comp/PopupButton", "mod/Util"], function(buttonComp, util) {
	'use strict';
	W.log.info("SubscriptionCancelPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var yIndex = 0;
	var pinNum;

	function create(){
		_comp.add(new W.Span({x:448-418, y:222-194, width:"384px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_pin_close_subscription"], textAlign:"center"}));

		_comp.add(new W.Div({x:448-418, y:279-194, width:"384px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp._normal = new W.Div({x:448-418, y:308-194, width:"384px", height:"48px", textColor:"rgb(255,255,255)", "font-size":"18px",
			className:"font_rixhead_medium", textAlign:"center", "letter-spacing" : "-0.9px", lineHeight:"24px"});
		_comp._normal.add(new W.Div({position:"relative", width:"384px", height:"24px", text:W.Texts["popup_pin_close_subscription_guide1"]}));
		_comp._normal.add(new W.Div({position:"relative", width:"384px", height:"24px", text:W.Texts["popup_pin_close_subscription_guide2"]}));
		_comp.add(_comp._normal);

		_comp._wrong = new W.Div({x:448-418, y:308-194, width:"384px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px",
			className:"font_rixhead_medium", textAlign:"center", "letter-spacing" : "-0.9px", display:"none"});
		_comp._wrong.comp.innerHTML = "<span style='position:relative'>" + "구매인증" +
			"</span> <span style='position:relative'>" + W.Texts["popup_pin_not_correct"] + "</span>";
		_comp._wrong.add(new W.Span({x:448-448, y:328-298, width:"384px", height:"20px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px",
			className:"font_rixhead_light", text:W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER, textAlign:"center"}));
		_comp.add(_comp._wrong);

		_comp.add(new W.Image({x:518-418, y:375-194, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		_comp._foc = new W.Image({x:517-418, y:374-194, width:"246px", height:"58px", src:"img/box_set244_f.png"});
		_comp.add(_comp._foc);
		
		_comp._pin = new W.Span({x:518-418, y:395-194, width:"244px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_extrabold", text:"", textAlign:"center"});
		_comp.add(_comp._pin);

		_comp.btns = [];
		_comp._btns = [];
		_comp.btns[0] = buttonComp.create(503-418, 466-194, W.Texts["ok"], 133);
		_comp.btns[1] = buttonComp.create(644-418, 466-194, W.Texts["close"], 133);
		_comp._btns[0] = _comp.btns[0].getComp();
		_comp._btns[1] = _comp.btns[1].getComp();
		_comp._btns[0].setStyle({opacity:0.4});
		_comp.add(_comp._btns[0]);
		_comp.add(_comp._btns[1]);
	};
	
	function setStar(){
		var tmp = "";
		for(var i=0; i < pinNum.length; i++){
			tmp += (i > 0 ? " " : "") + "*";
		}
		if(pinNum.length == 4){
			_comp._btns[0].setStyle({opacity:1});
		}else{
			_comp._btns[0].setStyle({opacity:0.4});
		}
		_comp._pin.setText(tmp);
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ProductTerminationPopup onStart");
    		desc = _param;
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK, 8,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:418, y:194, width:"444px", height:"333px", className:"popup_comp_color popup_comp_border"});

			W.CloudManager.addNumericKey();
    		this.add(_comp);
    		bIndex = 0;
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
    		case 8:
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				if(pinNum.length == 4){
    					_comp._foc.setStyle({display:"none"});
    					_comp._pin.setStyle({textColor:"rgba(181,181,181,0.75)"});
    					yIndex = 1;
    					bIndex = 0;
    					_comp.btns[bIndex].focus();
    				}
    			}else{
        			if(bIndex == 0){
						W.CloudManager.authPin(function(data){
							if(data && data.data == "OK") {
								W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK});
							} else {
								_comp._normal.setStyle({display:"none"});
								_comp._wrong.setStyle({display:"block"});
								pinNum = "";
								setStar();
								_comp.btns[bIndex].unFocus();
								yIndex = 0;
								_comp._foc.setStyle({display:"block"});
								_comp._pin.setStyle({textColor:"rgb(255,255,255)"});
							}
						}, pinNum, false);
        			}else{
        				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
        			}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1){
    				if(pinNum.length == 4){
    	    			_comp.btns[bIndex].unFocus();
    					bIndex = (++bIndex) % 2;
    					_comp.btns[bIndex].focus();
    				}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 1){
    				if(pinNum.length == 4){
    	    			_comp.btns[bIndex].unFocus();
    					bIndex = (++bIndex) % 2;
    					_comp.btns[bIndex].focus();
    				}
    			}else{
    				pinNum = pinNum.substr(0, pinNum.length-1);
    				setStar();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				_comp._foc.setStyle({display:"none"});
					_comp._pin.setStyle({textColor:"rgba(181,181,181,0.75)"});
					yIndex = 1;
					if(pinNum.length == 4){
						bIndex = 0;
					}else{
						bIndex = 1;
					}
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
    				pinNum += String(event.keyCode - 48);
    				setStar();
    				if(pinNum.length == 4){
    					_comp._foc.setStyle({display:"none"});
    					_comp._pin.setStyle({textColor:"rgba(181,181,181,0.75)"});
    					yIndex = 1;
    					bIndex = 0;
    					_comp.btns[bIndex].focus();
    				}
    			}
    			break;
    		}
    	}
    });
});