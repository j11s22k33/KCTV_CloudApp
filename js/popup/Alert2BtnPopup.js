/**
 * popup/Alert2BtnPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("Alert2BtnPopup");
	var _this;
	var _comp;
	var index;
	var desc;
	
	function create(){
		W.log.info(desc);
		_comp.add(new W.Span({x:449-419, y:248-219, width:"383px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:desc.title, textAlign:"center"}));
		_comp.add(new W.Div({x:449-419, y:304-219, width:"383px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		_comp.add(new W.Span({x:433-403, y:336-219, width:"415px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:desc.info1, textAlign:"center"}));
		_comp.add(new W.Span({x:433-403, y:336-219 + 24, width:"415px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:desc.info2, textAlign:"center"}));
		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(504-419, 441-219, desc.btn1, 133);
		_comp.btns[1] = buttonComp.create(645-419, 441-219, desc.btn2, 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.btns[0].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("Alert2BtnPopup onStart");
    		desc = _param;
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:419, y:219, width:"443px", height:"283px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		index = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("Alert2BtnPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("Alert2BtnPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(index == 0){
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
    			}else{
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    			break;
    		case W.KEY.LEFT:
    			_comp.btns[index].unFocus();
    			index = (--index + 2) % 2;
    			_comp.btns[index].focus();
    			break;
    		case W.KEY.RIGHT:
    			_comp.btns[index].unFocus();
    			index = (++index) % 2;
    			_comp.btns[index].focus();
    			break;
    		}
    	}
    });
});