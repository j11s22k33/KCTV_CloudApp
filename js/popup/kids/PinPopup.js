/**
 * popup/PinPopup
 */
W.defineModule(["comp/kids/popup/Button", "comp/kids/popup/InputBox"], function(Button, InputBox) {
	'use strict';
	W.log.info("PinPopup");
	var index = 0;
	var optionIndex = 0;
	var buttonIndex = 0;
	var _this;
	var _comp;
	var type;
	var title;

	var kidsModeOn;

	function create(){
		var title = "";
		if(type == "restrict") {
			title = W.Texts["limit_watch_setting"];
		} else if(type == "adult") {
			title = W.Texts["popup_pin_adult_title"];
		} else if(kidsModeOn) {
			title = W.Texts["popup_kids_mode_off"];
		} else {
			title = W.Texts["popup_kids_mode_on"];
		}
		_comp.add(new W.Image({x:279, y:123, width:110, height:500, src:"img/kids_pop_bg1_l.png"}));
		_comp.add(new W.Image({x:891, y:123, width:110, height:500, src:"img/kids_pop_bg1_r.png"}));
		_comp.add(new W.Image({x:389, y:123, width:502, height:500, src:"img/kids_pop_bg1_m.png"}));

		_comp.add(new W.Image({x:467, y:157, width:346, height:68, src:"img/kids_pop_title.png"}));
		_comp._title = new W.Div({text:title, x:467, y:160, width:346, height:57, lineHeight:"57px", textColor:"rgba(255,233,43,1)", fontFamily:"RixHeadB",
			"font-size":"28px", textAlign:"center", "letter-spacing":"-1.4px"});
		_comp.add(_comp._title);


		_comp._innerArea = new W.Div({x:355, y:222, width:570, height:315});
		_comp.add(_comp._innerArea);


		if(type == "restrict") {
			_comp._innerArea.add(new W.Div({position:"relative", text:W.Texts["popup_kids_guide1"], x:0,width:570, height:24, lineHeight:"24px",
				textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px", marginTop:"40px", marginBottom:"40px"}));
		} else if(type == "adult") {
			_comp._innerArea.add(new W.Div({position:"relative", text:"", x:0, width:570, height:24, lineHeight:"24px",
				textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px", marginBottom:"40px"}));
		} else if(kidsModeOn) {
			_comp._innerArea.add(new W.Div({position:"relative", text:W.Texts["popup_kids_guide2"], x:0, width:570, height:24, lineHeight:"24px",
				textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px", marginTop:"40px", marginBottom:"40px"}));
		} else {
			var tmpArr = W.Texts["popup_kids_guide3"].split("^");
			_comp._innerArea.add(new W.Div({position:"relative", text:tmpArr[0], x:0, width:570, height:30, lineHeight:"24px",
				textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px", marginTop:"35px"}));
			_comp._innerArea.add(new W.Div({position:"relative", text:tmpArr[1], x:0, width:570, height:24, lineHeight:"24px",
				textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px", marginBottom:"35px"}));
		}

		if(type == "adult") {
			_comp._innerArea._desc = new W.Div({position:"relative", text:W.Texts["adult_pin_guide2"], x:0, width:570, height:20, lineHeight:"20px", marginBottom : "40px",
				textColor:"rgba(192,87,30,1)", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
		} else {
			_comp._innerArea._desc = new W.Div({position:"relative", text:W.Texts["adult_pin_guide2"], x:0, width:570, height:20, lineHeight:"20px",
				textColor:"rgba(192,87,30,1)", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
		}

		_comp._innerArea.add(_comp._innerArea._desc);

		_this.box = [], _comp._box = [];
		_this.box[0] = new InputBox();
		_comp._box[0] = _this.box[0].getComp({x:507-355});
		_comp._box[0].setStyle({position:"relative", y:0,  marginTop:"20px"});
		_comp._innerArea.add(_comp._box[0]);

		_this.button = []; _comp._button = [];
		_this.button[0] = new Button();
		_comp._button[0] = _this.button[0].getComp({x:472-355, y:476-222, text:W.Texts["ok"]});
		_comp._innerArea.add(_comp._button[0]);
		_this.button[1] = new Button();
		_comp._button[1] = _this.button[1].getComp({x:646-355, y:476-222, text:W.Texts["cancel"]});
		_comp._innerArea.add(_comp._button[1]);

		focus();
	};
	
	function focus(){
		if(index == 0) {
			_this.box[0].setFocus();
		} else if(index == 1) {
			_this.button[buttonIndex].setFocus();
		}
	};

	function unFocus() {
		_this.box[0].unFocus();
		_this.button[buttonIndex].unFocus();
	}

	function checkPin() {
		var pinNum = _this.box[0].getValue();
		W.CloudManager.authPin(function(data){
			if(data && data.data == "OK") {
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, oldPIN:pinNum, param : _this.param.param});
			} else {
				_comp._innerArea._desc.setText(W.Texts["popup_pin_not_correct"]);
				_this.box[0].resetValue();
				index = 0;
				unFocus();
				focus();
			}
		}, pinNum, true);
	};


    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("PinPopup onStart");
    		type = _param.type ? _param.type : "kids";
			kidsModeOn = _param.kidsModeOn;
			_this = this;
			_this.param = _param;
			W.CloudManager.addNumericKey();
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.5)"});
    		this.add(_comp);
			create();
    	},
    	onStop: function() {
    		W.log.info("PinPopup onStop");
    		index = 0;
			W.CloudManager.delNumericKey();
    	},
    	onDestroy: function(){
			W.CloudManager.delNumericKey();
    	},
    	onKeyPressed : function(event) {
    		W.log.info("PinPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
				if(buttonIndex == 0) {
					checkPin();
					//W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
				} else {
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				}
    			break;
    		case W.KEY.RIGHT:
				unFocus();
				if(index == 0) {
				} else if(index == 1) {
					if(_this.box[0].getValue().length == 4) {
						buttonIndex = (buttonIndex == 0 ? 1 : buttonIndex+1);
					} else {
						buttonIndex = 1;
					}
				}
				focus();
    			break;
    		case W.KEY.LEFT:
				unFocus();
				if(index == 0) {
					_this.box[0].deleteValue();
				} else if(index == 1) {
					if(_this.box[0].getValue().length == 4) {
						buttonIndex = (buttonIndex == 0 ? 1 : buttonIndex-1);
					} else {
						buttonIndex = 1;
					}
				}
				focus();
    			break;
    		case W.KEY.UP:
				index = (index == 0 ? 1 : 0);
				if(index == 1) {
					if(_this.box[0].getValue().length == 4) {
						buttonIndex = 0;
					} else {
						buttonIndex = 1;
					}
				}
				unFocus();
				focus();
    			break;
    		case W.KEY.DOWN:
				index = (index == 0 ? 1 : 0);
				if(index == 1) {
					if(_this.box[0].getValue().length == 4) {
						buttonIndex = 0;
					} else {
						buttonIndex = 1;
					}
				}
				unFocus();
				focus();
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
				if(index == 0) {
					_this.box[0].inputValue(event.keyCode-48);
					if(_this.box[0].getValue().length == 4) {
						index = 1;
						buttonIndex = 0;
						unFocus();
						focus();
					}
				}
				break;
    		}
    	}
    });
});