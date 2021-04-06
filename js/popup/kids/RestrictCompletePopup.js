/**
 * popup/RestrictCompletePopup
 */
W.defineModule([], function() {
	'use strict';
	W.log.info("RestrictCompletePopup");
	var index = 0;
	var optionIndex = 0;
	var buttonIndex = 0;
	var _this;
	var _comp;
	var type;
	var title;
	var data;
	var timeout;

	function create(){
		_comp.add(new W.Image({x:349, y:183, width:110, height:370, src:"img/kids_pop_bg3_l.png"}));
		_comp.add(new W.Image({x:821, y:183, width:110, height:370, src:"img/kids_pop_bg3_r.png"}));
		_comp.add(new W.Image({x:459, y:183, width:362, height:370, src:"img/kids_pop_bg3_m.png"}));

		_comp.add(new W.Image({x:467, y:217, width:346, height:68, src:"img/kids_pop_title.png"}));
		_comp._title = new W.Div({text:W.Texts["popup_kids_restrict_complete_title"], x:467, y:214, width:346, height:57, lineHeight:"57px", textColor:"rgba(255,233,43,1)", fontFamily:"RixHeadB",
			"font-size":"28px", textAlign:"center", "letter-spacing":"-1.4px"});
		_comp.add(_comp._title);


		_comp._innerArea = new W.Div({x:428, y:283, width:422, height:185});
		_comp.add(_comp._innerArea);

		_comp._innerArea.add(new W.Div({text:data.typeText ? data.typeText : "", x:0, y:324-283, width:422, height:24, lineHeight:"24px",
			textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadL", "font-size":"24px", textAlign:"center", "letter-spacing":"-1.2px"}));
		_comp._innerArea.add(new W.Div({text:data.optionText ? data.optionText : "", x:0, y:364-283, width:422, height:26, lineHeight:"26px",
			textColor:"rgba(192,87,30,1)", fontFamily:"RixHeadM", "font-size":"26px", textAlign:"center", "letter-spacing":"-1.3px"}));
		_comp._innerArea.add(new W.Div({text:W.Texts["popup_kids_restrict_complete_guide"], x:0, y:411-283, width:422, height:20, lineHeight:"20px",
			textColor:"rgba(104,72,46,1)", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"}));
	};
	
	function focus(){
	};

	function unFocus() {
	}

	var TYPE = Object.freeze({NONE:0, VOD:1, TIME:2});

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("RestrictCompletePopup onStart");
			_this = this;
			data = _param;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size", backgroundColor:"rgba(0,0,0,0.5)"});
    		this.add(_comp);
			create();

			clearTimeout(timeout);
			timeout = setTimeout(function(){
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
			}, 3000);
    	},
    	onStop: function() {
    		W.log.info("RestrictCompletePopup onStop");
    		index = 0;
			clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("RestrictCompletePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
				clearTimeout(timeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
				clearTimeout(timeout);
				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
    			break;
    		case W.KEY.RIGHT:
    			break;
    		case W.KEY.LEFT:
    			break;
    		case W.KEY.UP:
    			break;
    		case W.KEY.DOWN:
    			break;
    		}
    	}
    });
});