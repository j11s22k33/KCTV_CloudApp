/**
 * popup/SubscribedGuidePopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("SubscribedGuidePopup");
	var bIndex = 0;
	var bIndexOld = 0;
	var _this;
	var _comp;
	var desc;
	var barLength = 0;
	
	function create(){
		_comp.add(new W.Span({x:0, y:249-219, width:"490px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_subscribed_guide_title"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:425-395, y:304-219, width:"430px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		var period = 1 + W.Texts["unit_month_until"];
		if(desc){
			period = desc.value + "";
			if(desc.unit == "Y"){
				period += W.Texts["unit_year"]
			}else if(desc.unit == "D"){
				period += W.Texts["unit_date"]
			}else{
				period += W.Texts["unit_month_until"]
			}
		}

		var guides = W.Texts["popup_subscribed_guide_guide1"].replace("@period@", period).split("^");
		_comp.add(new W.Span({x:0, y:333-219, width:"490px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guides[0], textAlign:"center"}));
		_comp.add(new W.Span({x:0, y:333-219 + 24, width:"490px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guides[1], textAlign:"center"}));
		
		_comp.add(new W.Span({x:0, y:392-219, width:"490px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_subscribed_guide_guide2"], textAlign:"center"}));

		_comp._btn_area = new W.Div({x:0, y:441-219, width:"490px", height:"133px", textAlign:"center"});
		_comp.add(_comp._btn_area);
		
		_comp.btns = [];
		var no = 0;
		_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["ok"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
		_comp._btn_area.add(_comp.btns[no].getComp());
		no++;
		
		_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["cancel"], 133, undefined, {"padding":"3px", "display":"inline-flex"});
		_comp._btn_area.add(_comp.btns[no].getComp());

		_comp.btns[bIndex].focus();
	};

	
	var focusBtn = function(){
		_comp.btns[bIndexOld].unFocus();
		_comp.btns[bIndex].focus();
	};
	
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SubscribedGuidePopup onStart");
    		desc = _param.param;
    		W.log.info(_param);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:395, y:219, width:"490px", height:"283px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		
    		create();
    	},
    	onStop: function() {
    		W.log.info("SubscribedGuidePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SubscribedGuidePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(bIndex == 0){
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
    			}else{
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    			break;
    		case W.KEY.RIGHT:
    			bIndexOld = bIndex;
    			bIndex = (++bIndex) % _comp.btns.length;
    			focusBtn();
    			break;
    		case W.KEY.LEFT:
    			bIndexOld = bIndex;
    			bIndex = (--bIndex + _comp.btns.length) % _comp.btns.length;
    			focusBtn();
    			break;
    		}
    	}
    });
});