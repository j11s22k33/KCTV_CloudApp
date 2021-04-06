/**
 * popup/BluetoothConnectCompletePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("BluetoothConnectCompletePopup");
	var _this;
	var _comp;
	var desc;
	var index = 0;
	
	function create(){
		_comp.add(new W.Span({x:426-396, y:240-210, width:"429px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_bluetooth_complete_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:426-396, y:297-210, width:"429px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		_comp.add(new W.Span({x:426-396, y:323-210, width:"429px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_bluetooth_complete_guide1"], textAlign:"center"}));
		_comp.add(new W.Span({x:426-396, y:323-210+24, width:"429px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_bluetooth_complete_guide2"], textAlign:"center"}));
		
		_comp._btns = [];
		_comp._btns[0] = new W.Div({x:425-396, y:388-210, width:"211px", height:"94px"});
		_comp.add(_comp._btns[0]);
		_comp._btns[0].add(new W.Image({x:1, y:1, width:"209px", height:"92px", src:"img/box_popup_w209.png"}));
		var btn1 = W.Texts["popup_bluetooth_complete_btn1"].split("^");
		_comp._btns[0].add(new W.Span({x:0, y:432-388, width:"211px", height:"16px", textColor:"rgba(181,181,181,0.75)", 
			"font-size":"15px", className:"font_rixhead_light", text:btn1[0], textAlign:"center"}));
		_comp._btns[0].add(new W.Span({x:0, y:432-388+19, width:"211px", height:"16px", textColor:"rgba(181,181,181,0.75)", 
			"font-size":"15px", className:"font_rixhead_light", text:btn1[1], textAlign:"center"}));
		_comp._btns[0]._text = new W.Span({x:0, y:405-388, width:"211px", height:"20px", textColor:"rgb(255,255,255)", 
			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_bluetooth_complete_text1"], textAlign:"center"});
		_comp._btns[0].add(_comp._btns[0]._text);
		_comp._btns[0]._foc = new W.Image({x:0, y:0, width:"211px", height:"94px", src:"img/box_popup_w209_f.png"});
		_comp._btns[0].add(_comp._btns[0]._foc);
		
		_comp._btns[1] = new W.Div({x:645-396, y:388-210, width:"211px", height:"94px"});
		_comp.add(_comp._btns[1]);
		_comp._btns[1].add(new W.Image({x:1, y:1, width:"209px", height:"92px", src:"img/box_popup_w209.png"}));
		var btn2 = W.Texts["popup_bluetooth_complete_btn2"].split("^");
		_comp._btns[1].add(new W.Span({x:0, y:432-388, width:"211px", height:"16px", textColor:"rgba(181,181,181,0.75)", 
			"font-size":"15px", className:"font_rixhead_light", text:btn2[0], textAlign:"center"}));
		_comp._btns[1].add(new W.Span({x:0, y:432-388+19, width:"211px", height:"16px", textColor:"rgba(181,181,181,0.75)", 
			"font-size":"15px", className:"font_rixhead_light", text:btn2[1], textAlign:"center"}));
		_comp._btns[1]._text = new W.Span({x:0, y:405-388, width:"211px", height:"20px", textColor:"rgba(255,255,255,0.75)", 
			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_bluetooth_complete_text2"], textAlign:"center"});
		_comp._btns[1].add(_comp._btns[1]._text);
		_comp._btns[1]._foc = new W.Image({x:0, y:0, width:"211px", height:"94px", src:"img/box_popup_w209_f.png", display:"none"});
		_comp._btns[1].add(_comp._btns[1]._foc);
		

	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("BluetoothConnectCompletePopup onStart");
    		desc = _param;
    		_this = this;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:396, y:210, width:"489px", height:"301px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		index = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("BluetoothConnectCompletePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("BluetoothConnectCompletePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CANCEL, idx:0});
    			break;
    		case W.KEY.ENTER:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:index});
    			break;
    		case W.KEY.RIGHT:
    		case W.KEY.LEFT:
    			_comp._btns[index]._text.setStyle({textColor:"rgba(255,255,255,0.75)"});
    			_comp._btns[index]._foc.setStyle({display:"none"});
				index = (++index) % 2;
				_comp._btns[index]._text.setStyle({textColor:"rgb(255,255,255)"});
    			_comp._btns[index]._foc.setStyle({display:"block"});
    			break;
    		}
    	}
    });
});