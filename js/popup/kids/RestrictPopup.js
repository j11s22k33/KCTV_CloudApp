/**
 * popup/RestrictPopup
 */
W.defineModule(["comp/kids/popup/Button", "comp/kids/popup/SelectBox"], function(Button, SelectBox) {
	'use strict';
	W.log.info("RestrictPopup");
	var index = 0;
	var optionIndex = 0;
	var buttonIndex = 0;
	var _this;
	var _comp;
	var type;
	var title;

	var vodOption = [1,2,3,4,5];
	var timeOption = [30,60,90,120];

	function create(){
		_comp.add(new W.Image({x:259, y:123, width:110, height:500, src:"img/kids_pop_bg2_l.png"}));
		_comp.add(new W.Image({x:911, y:123, width:110, height:500, src:"img/kids_pop_bg2_r.png"}));
		_comp.add(new W.Image({x:369, y:123, width:542, height:500, src:"img/kids_pop_bg2_m.png"}));

		_comp.add(new W.Image({x:467, y:147, width:346, height:68, src:"img/kids_pop_title.png"}));
		_comp._title = new W.Div({text:W.Texts["limit_watch_setting"], x:467, y:144, width:346, height:57, lineHeight:"57px", textColor:"rgba(255,233,43,1)", fontFamily:"RixHeadB",
			"font-size":"28px", textAlign:"center", "letter-spacing":"-1.4px"});
		_comp.add(_comp._title);


		_comp._innerArea = new W.Div({x:326, y:210, width:625, height:330});
		_comp.add(_comp._innerArea);

		_comp._innerArea.add(new W.Div({text:W.Texts["popup_kids_restrict_guide1"], x:0, y:32, width:625, height:24, lineHeight:"24px",
			textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px"}));
		_comp._innerArea.add(new W.Div({text:W.Texts["popup_kids_restrict_guide2"], x:0, y:82, width:625, height:20, lineHeight:"20px",
			textColor:"rgba(192,87,30,1)", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"}));

		_this.selectBox = []; _comp._selectBox = [];
		_this.selectBox[0] = new SelectBox();
		_comp._selectBox[0] = _this.selectBox[0].getComp({x:343-326, y:330-210, text:W.Texts["popup_kids_restrict_box1"]});
		_comp._innerArea.add(_comp._selectBox[0]);
		_this.selectBox[1] = new SelectBox();
		_comp._selectBox[1] = _this.selectBox[1].getComp({x:545-326, y:330-210, text:W.Texts["popup_kids_restrict_box2"]});
		_comp._innerArea.add(_comp._selectBox[1]);
		_this.selectBox[2] = new SelectBox();
		_comp._selectBox[2] = _this.selectBox[2].getComp({x:747-326, y:330-210, text:W.Texts["popup_kids_restrict_box3"]});
		_comp._innerArea.add(_comp._selectBox[2]);

		_comp._optionBox = new W.Div({x:505-326, y:408-210, width:270, height:50});
		_comp._optionBox.add(new W.Image({x:0,y:0,width:270,height:50,src:"img/kids_op2.png"}));
		_comp._optionBox._focus = new W.Image({x:0,y:0,width:270,height:50,src:"img/kids_op2_foc.png", display:"none"});
		_comp._optionBox.add(_comp._optionBox._focus);
		_comp._optionBox._text = new W.Div({text:W.Texts["popup_kids_restrict_option1"], x:0,y:0,width:270,height:50,lineHeight:"50px", textColor:"#68482E",
			fontFamily:"RixHeadM", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
		_comp._optionBox.add(_comp._optionBox._text);
		_comp._innerArea.add(_comp._optionBox);

		_this.button = []; _comp._button = [];
		_this.button[0] = new Button();
		_comp._button[0] = _this.button[0].getComp({x:472-326, y:486-210, text:W.Texts["ok"]});
		_comp._innerArea.add(_comp._button[0]);
		_this.button[1] = new Button();
		_comp._button[1] = _this.button[1].getComp({x:646-326, y:486-210, text:W.Texts["cancel"]});
		_comp._innerArea.add(_comp._button[1]);

		focus();
		setOption();
	};
	
	function focus(){
		if(index == 0) {
			_this.selectBox[type].setFocus();
			_this.selectBox[type].setSelected();
			if(type == 0) _comp._optionBox.setStyle({display:"none"});
			else _comp._optionBox.setStyle({display:"block"});
		} else if(index == 1) {
			_comp._optionBox._text.setStyle({textColor:"#FFFFFF"});
			_comp._optionBox._focus.setStyle({display:"block"});
		} else if(index == 2) {
			_this.button[buttonIndex].setFocus();
		}
	};

	function unFocus() {
		if(index == 0) _this.selectBox[type].unSelected();
		_this.selectBox[type].unFocus();
		_comp._optionBox._text.setStyle({textColor:"#68482E"});
		_comp._optionBox._focus.setStyle({display:"none"});
		_this.button[buttonIndex].unFocus();
	}

	var TYPE = Object.freeze({NONE:0, VOD:1, TIME:2});

	function setOption() {
		if(type != TYPE.NONE) {
			_comp._optionBox._text.setText(type == TYPE.VOD ? W.Texts["popup_kids_restrict_option1"].replace("1", vodOption[optionIndex]) : W.Texts["popup_kids_restrict_option2"].replace("1", timeOption[optionIndex]));
		}
	}

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("RestrictPopup onStart");
    		type = _param.type ? _param.type : TYPE.NONE;
			_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.5)"});
    		this.add(_comp);

			if(W.StbConfig.isKidsRestriction) {
				if(W.StbConfig.kidsVodCountSet > 0) {
					type = TYPE.VOD;
					optionIndex = W.StbConfig.kidsVodCountSet-1;
				} else if(W.StbConfig.kidsTimeLimitSet > 0) {
					type = TYPE.TIME;
					optionIndex = timeOption.indexOf(W.StbConfig.kidsTimeLimitSet);
				}
				if(optionIndex < 0) optionIndex = 0;
			}

			create();
    	},
    	onStop: function() {
    		W.log.info("RestrictPopup onStop");
    		index = 0;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("RestrictPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
				if(index == 2) {
					if(buttonIndex == 0) {

						var key = "", option = "";
						var _typeText = "", _optionText = "";
						if(type == 0) {
							_typeText = W.Texts["limit_watch_setting"];
							_optionText = W.Texts["no_limit"];
							key = "OFF";
							option = -1;
						} else if(type == 1) {
							_typeText = W.Texts["popup_kids_restrict_type1"];
							_optionText = W.Texts["popup_kids_restrict_option1"].replace("1", vodOption[optionIndex]);
							key = "VOD";
							option = vodOption[optionIndex];
						} else if(type == 2) {
							_typeText = W.Texts["popup_kids_restrict_type2"];
							_optionText = W.Texts["popup_kids_restrict_option2"].replace("1", timeOption[optionIndex]);
							key = "TIME";
							option = timeOption[optionIndex];
						}

						W.CloudManager.setKidsRestrict(function(data){
							if(data && data.data && data.data =="OK") {
								if(key == "VOD") {
									W.StbConfig.isKidsRestriction = true;
									W.StbConfig.kidsLimitVodCount = option;
									W.StbConfig.kidsVodCountSet = option;
									W.StbConfig.kidsTimeLimitSet = undefined;
								} else if(key == "TIME") {
									W.StbConfig.isKidsRestriction = true;
									W.StbConfig.kidsLimitVodCount = -1;
									W.StbConfig.kidsVodCountSet = undefined;
									W.StbConfig.kidsTimeLimitSet = option;
								} else {
									W.StbConfig.isKidsRestriction = false;
									W.StbConfig.kidsLimitVodCount = -1;
									W.StbConfig.kidsVodCountSet = undefined;
									W.StbConfig.kidsTimeLimitSet = undefined;
								}
								W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, typeText:_typeText, optionText:_optionText});
							}
						}, key, option);
					} else {
						W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
					}
				} else {
					if(type == TYPE.NONE) {
						index = (index == 0 ? 2 : 0);
					} else {
						index = (index == 2 ? 0 : index+1);
					}
					if(index == 2) buttonIndex = 0;
					unFocus();
					focus();
				}
    			break;
    		case W.KEY.RIGHT:
				unFocus();
				if(index == 0) {
					type = (type == 2 ? 0 : type+1);
					optionIndex = 0;
					setOption();
				} else if(index == 1) {
					if(type == TYPE.VOD) {
						optionIndex = (optionIndex == vodOption.length-1 ? 0 : optionIndex+1);
					} else if(type == TYPE.TIME) {
						optionIndex = (optionIndex == timeOption.length-1 ? 0 : optionIndex+1);
					}
					setOption();
				} else if(index == 2) {
					buttonIndex = (buttonIndex == 1 ? 0 : buttonIndex+1);
				}
				focus();
    			break;
    		case W.KEY.LEFT:
				unFocus();
				if(index == 0) {
					type = (type == 0 ? 2 : type-1);
					optionIndex = 0;
					setOption();
				} else if(index == 1) {
					if(type == TYPE.VOD) {
						optionIndex = (optionIndex == 0 ? vodOption.length-1 : optionIndex-1);
					} else if(type == TYPE.TIME) {
						optionIndex = (optionIndex == 0 ? timeOption.length-1 : optionIndex-1);
					}
					setOption();
				} else if(index == 2) {
					buttonIndex = (buttonIndex == 0 ? 1 : buttonIndex-1);
				}
				focus();
    			break;
    		case W.KEY.UP:
				if(type == TYPE.NONE) {
					index = (index == 0 ? 2 : 0);
				} else {
					index = (index == 0 ? 2 : index-1);
				}
				if(index == 2) {
					buttonIndex = 0;
				}
				unFocus();
				focus();
    			break;
    		case W.KEY.DOWN:
				if(type == TYPE.NONE) {
					index = (index == 0 ? 2 : 0);
				} else {
					index = (index == 2 ? 0 : index+1);
				}
				if(index == 2) {
					buttonIndex = 0;
				}
				unFocus();
				focus();
    			break;
    		}
    	}
    });
});