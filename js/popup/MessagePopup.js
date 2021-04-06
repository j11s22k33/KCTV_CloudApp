/**
 * popup/MessagePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("MessagePopup");
	var _comp;
	var timeout;
	var _this;
	var btnIndex = 0;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("MessagePopup onStart");
			btnIndex = 0;
    		_this = this;
			if(_param && _param.type) _this.type = _param.type;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size", display:"-webkit-flex", "-webkit-flex-direction":"column",
				"-webkit-align-items":"center","-webkit-justify-content":"center"});
    		this.add(_comp);

			_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
    		_comp.add(_comp._popup);

			_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:85, text:_param.title, lineHeight:"85px", className:"cut",
				"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"27px"});
			_comp._popup.add(_comp._popup._title);

			_comp._popup.add(new W.Div({x:0,y:84,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));

			if(_param.boldText) {
				_comp._popup._boldText = new W.Div({position:"relative", "max-width":"800px", text:_param.boldText,
					lineHeight:"24px", className:"cut", fontFamily:"RixHeadM", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
					"white-space":"pre", textColor:"#FFFFFF", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"15px"});
				_comp._popup.add(_comp._popup._boldText);
			}

			if(_param.thinText) {
				_comp._popup._thinText = new W.Div({position:"relative", "max-width":"800px", text:_param.thinText,
					lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
					"white-space":"pre", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px", marginBottom:"15px"});
				_comp._popup.add(_comp._popup._thinText);
			}

			if(_param.button && _param.button.length > 0) {
				_comp._popup._btns = new W.Div({position:"relative", "max-width":"800px", height:41, marginTop:"15px"});
				_this.btn = [];
				for(var i = 0; i < _param.button.length; i++) {
					_this.btn[i] = buttonComp.create(0, 0, _param.button[i], 133);

					_this.btn[i].getComp().setStyle({position:"relative", "float":"left", marginLeft:"4px", marginRight:"4px"});

					_comp._popup._btns.add(_this.btn[i].getComp());
				}
				_comp._popup.add(_comp._popup._btns);
				_this.btn[btnIndex].focus();
			}
    	},
    	onStop: function() {
    		W.log.info("MessagePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("MessagePopup onKeyPressed "+event.keyCode);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				break;
			case W.KEY.ENTER:
				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:btnIndex, type : this.type});
				break;
			case W.KEY.RIGHT:
				_this.btn[btnIndex].unFocus();
				btnIndex = btnIndex+1 > _this.btn.length-1  ? 0 : btnIndex+1;
				_this.btn[btnIndex].focus();
				break;
			case W.KEY.LEFT:
				_this.btn[btnIndex].unFocus();
				btnIndex = btnIndex-1 < 0 ? _this.btn.length-1 : btnIndex-1;
				_this.btn[btnIndex].focus();
				break;
			case W.KEY.UP:
				break;
			case W.KEY.DOWN:
				break;
    		}
    	}
    });
});