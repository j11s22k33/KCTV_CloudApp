/**
 * popup/FeedbackPopup
 */
W.defineModule(["comp/PopupButton", "comp/kids/popup/InputBox"], function(Button, InputBox) {
	'use strict';
	W.log.info("FeedbackPopup");
	var _comp;
	var timeout;
	var _this;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("FeedbackPopup onStart");
    		_this = this;
    		W.log.info(_param);
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.ENTER, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size"});
    		this.add(_comp);
    		_comp.add(new W.Image({x:0, y:483, width:1280, height:237, src:"img/bg_alarm.png"}));
    		if(_param.type == "2LINE"){
				_comp.add(new W.Div({x:113, y:572, width:1054, height:105, color:"#3B3B3B"}));
    			_comp.add(new W.Span({x:113, y:613-20, width:1054, height:25, textColor:"rgba(237,168,2,1)", "font-size":"25px",
    				className:"font_rixhead_medium", text:_param.title, textAlign:"center", "letter-spacing":"-0.625px"}));
				var _div = new W.Div({x:113, y:649-20, width:1054, height:22, textAlign:"center"});
				_div.add(new W.Image({position:"relative", y:4, width:21, height:21, src:"img/icon_toast_popup.png", marginRight : "8px"}));
				_div.add(new W.Span({position:"relative", textColor:"rgb(255,255,255)", "font-size":"22px",
    				className:"font_rixhead_medium", text:_param.desc, textAlign:"center", "letter-spacing":"-0.55px"}));
				_comp.add(_div);
    		}else{
				_comp.add(new W.Div({x:113, y:609, width:1054, height:69, color:"#3B3B3B"}));
    			if(_param.title.indexOf("@") > -1){
    				var texts = _param.title.split("@");
    				var _div = new W.Div({x:113, y:649-20, width:1054, height:22, textAlign:"center"});
    				_comp.add(_div);
					_div.add(new W.Image({position:"relative", y:4, width:21, height:21, src:"img/icon_toast_popup.png", marginRight : "8px"}));
    				_div.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(255,255,255)", "font-size":"22px",
    					className:"font_rixhead_medium", text:texts[0], "letter-spacing":"-0.55px"}));
    				_div.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgba(237,168,2,1)", "font-size":"22px",
    					className:"font_rixhead_medium", text:texts[1], "letter-spacing":"-0.55px"}));
    				_div.add(new W.Span({position:"relative", y:0, height:"22px", textColor:"rgb(255,255,255)", "font-size":"22px",
    					className:"font_rixhead_medium", text:texts[2], "letter-spacing":"-0.55px"}));
    			}else{
					var _div = new W.Div({x:113, y:649-20, width:1054, height:22, textAlign:"center"});
					_comp.add(_div);
					_div.add(new W.Image({position:"relative", y:4, width:21, height:21, src:"img/icon_toast_popup.png", marginRight : "8px"}));
					_div.add(new W.Span({position:"relative",height:"22px", textColor:"rgb(255,255,255)", "font-size":"22px",
    					className:"font_rixhead_medium", text:_param.title, textAlign:"center", "letter-spacing":"-0.5px"}));
    			}
    		}
    		
    		clearTimeout(timeout);
    		timeout = setTimeout(function(){
    			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
    		}, 3000);
    	},
    	onStop: function() {
    		W.log.info("FeedbackPopup onStop");
    		clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("FeedbackPopup onKeyPressed "+event.keyCode);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    		case W.KEY.ENTER:
				clearTimeout(timeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				break;
    		}
    	}
    });
});