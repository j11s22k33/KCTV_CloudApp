/**
 * popup/ErrorPopup
 */
W.defineModule(["comp/PopupButton"], function(Button) {
	'use strict';
	W.log.info("ErrorPopup");
	var _comp;
	var _this;
	var code;
	var from;
	var type;
	var timeout;
	var isVodError = false;
	var index = 0;
	var paramData;
	
	function getMessage(){
		var messages = [];
		var type = "";
		if(!isNaN(code[0])){
			if(from == "SDP"){
				type = "C";
			}else if(from == "VOD"){
				type = "V";
			}else if(from == "COUPON"){
				type = "CP";
			}else if(from == "MOBILE"){
				type = "M";
			}else if(from == "TVPOINT"){
				type = "T";
			}else if(from == "SEARCH"){
				type = "SC";
			}else{
				type = "W";
			}
		}
		
		if(type == "C" || type == "V" || type == "W"){
			switch(code){
			case "200":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)];
				break;
			case "201":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg3"]];
				break;
			case "202":
			case "203":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)];
				break;
			case "302":
			case "303":
			case "304":
			case "305":
			case "306":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg4"]];
				break;
			case "307":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)];
				break;
			case "308":
			case "309":
			case "310":
			case "311":
			case "312":
			case "322":
			case "323":
			case "324":
			case "325":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg4"]];
				break;
			case "327":
				messages = [W.Texts["vod_error_msg5"], W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)];
				if(isVodError){
					messages.push(W.Texts["vod_error_msg8"]);
				}
				break;
			case "328":
			case "329":
				messages = [W.Texts["vod_error_msg6"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg4"]];
				break;
			case "330":
			case "335":
			case "336":
			case "400":
			case "401":
			case "402":
			case "403":
			case "406":
			case "407":
			case "408":
			case "409":
			case "410":
			case "411":
			case "413":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg4"]];
				break;
			case "414":
				messages = [W.Texts["vod_error_msg5"], W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)];
				if(isVodError){
					messages.push(W.Texts["vod_error_msg8"]);
				}
				break;
			case "415":
			case "416":
			case "417":
			case "418":
			case "419":
			case "500":
			case "501":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg4"]];
				break;
			case "502":
				messages = [W.Texts["vod_error_msg7"]];
				isVodError = false;
				break;
			case "901":
				messages = [W.Texts["vod_error_msg1"], isVodError ? W.Texts["vod_error_msg8"] : W.Texts["vod_error_msg4"]];
				break;
			case "0001":
				messages = [W.Texts["error_msg2"]];
				if(isVodError){
					messages.push(W.Texts["vod_error_msg8"]);
				}
				break;
			case "0501":
				messages = [isVodError ? W.Texts["vod_error_msg8"] : W.Texts["error_msg4"]];
				break;
			case "0701":
				messages = [W.Texts["no_data_contents"], W.Texts["vod_error_msg2"].replace("@tel@", W.Config.CALL_CENTER_NUMBER)];
				break;
			case "1001":
				messages = [W.Texts["error_msg1"]];
				if(isVodError){
					messages.push(W.Texts["vod_error_msg8"]);
				}
				break;
			case "2001":
				messages = [W.Texts["error_general"]];
				if(isVodError){
					messages.push(W.Texts["vod_error_msg8"]);
				}
				break;
			case "9999":
				messages = [W.Texts["error_general"]];
				if(isVodError){
					messages.push(W.Texts["vod_error_msg8"]);
				}
				break;
			case "C0101":
			case "C0102":
				messages = [W.Texts["SDP_ERR_1"]];
				break;
			case "C0201":
			case "C0202":
				messages = [W.Texts["SDP_ERR_2"]];
				break;
			case "C0203":
			case "C0204":
			case "C0205":
				messages = [W.Texts["SDP_ERR_1"]];
				break;
			case "C0501":
				messages = [W.Texts["SDP_ERR_3"]];
				break;
			case "C9990":
			case "C9991":
			case "C9992":
			case "C9993":
			case "C9994":
			case "C9999":
				messages = [W.Texts["SDP_ERR_1"]];
				break;
			case "N9200":
				messages = [W.Texts["SDP_ERR_4"]];
				break;
			case "N9400":
				messages = [W.Texts["SDP_ERR_5"]];
				break;
			case "N9410":
				messages = [W.Texts["SDP_ERR_6"]];
				break;
			case "P0100":
				messages = [W.Texts["SDP_ERR_7"]];
				break;
			case "P0101":
				messages = [W.Texts["SDP_ERR_2"]];
				break;
			case "P0200":
				messages = [W.Texts["SDP_ERR_8"]];
				break;
			case "P0201":
				messages = [W.Texts["SDP_ERR_9"]];
				break;
			case "P0202":
				messages = [W.Texts["SDP_ERR_10"]];
				break;
			case "P0203":
				messages = [W.Texts["SDP_ERR_11"]];
				break;
			case "P0204":
				messages = [W.Texts["SDP_ERR_12"]];
				break;
			case "P0205":
				messages = [W.Texts["SDP_ERR_13"]];
				break;
			case "P0206":
				messages = [W.Texts["SDP_ERR_14"]];
				break;
			case "P0211":
				messages = [W.Texts["SDP_ERR_20"]];
				break;
			case "P0212":
				messages = [W.Texts["SDP_ERR_21"]];
				break;
			case "P0213":
				messages = [W.Texts["SDP_ERR_22"]];
				break;
			case "P0214":
				messages = [W.Texts["SDP_ERR_23"]];
				break;
			case "P0221":
				messages = [W.Texts["SDP_ERR_24"]];
				break;
			case "P0300":
				messages = [W.Texts["SDP_ERR_15"]];
				break;
			case "P0301":
				messages = [W.Texts["SDP_ERR_16"]];
				break;
			case "P0302":
				messages = [W.Texts["SDP_ERR_17"]];
				break;
			case "P0303":
			case "P0304":
				messages = [W.Texts["SDP_ERR_18"]];
				break;
			case "P0305":
				messages = [W.Texts["SDP_ERR_1"]];
				break;
			case "P0306":
				messages = [W.Texts["SDP_ERR_19"]];
				break;
			case "P0310":
				messages = [W.Texts["SDP_ERR_25"]];
				break;
			case "P0311":
				messages = [W.Texts["SDP_ERR_26"]];
				break;
			case "P0400":
				messages = [W.Texts["SDP_ERR_1"]];
				break;
			case "U0101":
			case "U0102":
				messages = [W.Texts["SDP_ERR_2"]];
				break;
			}
		}
			
		return {type:type, msg : messages};
	};
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ErrorPopup onStart");
    		W.log.info(_param);
    		_this = this;
    		if(_comp){
    			this.remove(_comp);
    		}
    		
    		var title = _param.title;
    		code = _param.code;
    		from = _param.from;
    		
    		if(!code){
    			code = "9999";
    		}
    		type = _param.type;
    		isVodError = _param.isVodError;
    		var messages = _param.message;
    		paramData = _param.paramData;
    		
    		if(!title){
    			title = W.Texts["popup_zzim_info_title"];
    		}
    		
    		if(code){
    			var codeMsg = getMessage();
    			title += " (ID : " + codeMsg.type + code + ")";
    			
    			if(codeMsg.msg.length > 0){
    				messages = codeMsg.msg;
    			}else{
    				if(!messages || messages.length == 0){
    					messages = [W.Texts["SDP_ERR_1"]];
    				}
    			}
    		}else{
    			title += " (ID : W9999)";
    			if(!messages || messages.length == 0){
					messages = [W.Texts["SDP_ERR_1"]];
				}
    		}
    		
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size popup_bg_color popup_bg_flex"});
    		this.add(_comp);

			_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
    		_comp.add(_comp._popup);

			_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:85, text:title, lineHeight:"85px", className:"cut",
				"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"27px"});
			_comp._popup.add(_comp._popup._title);

			_comp._popup.add(new W.Div({x:0,y:84,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));

			for(var i=0; i < messages.length; i++){
				_comp._popup.add(new W.Div({position:"relative", "max-width":"800px", text:messages[i],
					lineHeight:"24px", className:"cut", fontFamily:"RixHeadM", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
					"white-space":"pre-line", textColor:"#FFFFFF", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"15px"}));
			}
			
			var _btn_area = new W.Div({position:"relative", width:"100%", marginTop:"15px", textAlign:"center"});
			_comp._popup.add(_btn_area);
			
			_comp.button = [];
			
			_comp.button[0] = Button.create("relative", 0, W.Texts["ok"], 133, undefined, {padding:"5px", display:"inline-block"});
			_btn_area.add(_comp.button[0].getComp());
			
			if(isVodError){
				_comp.button[1] = Button.create("relative", 0, W.Texts["cancel"], 133, undefined, {padding:"5px", display:"inline-block"});
				_btn_area.add(_comp.button[1].getComp());
			}
			
			_comp.button[0].focus();
			
//			if(!isVodError){
//				clearTimeout(timeout);
//				timeout = setTimeout(function(){
//					W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, code:code, type:type, data:paramData});
//				}, 5000);
//			}
    	},
    	onStop: function() {
    		W.log.info("ErrorPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("ErrorPopup onKeyPressed "+event.keyCode);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    		case W.KEY.ENTER:
    			if(isVodError){
    				if(index == 0){
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, code:code, type:type, data:paramData});
        			}else{
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, code:code, type:type, data:paramData});
        			}
    			}else{
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, code:code, type:type, data:paramData});
    			}
				break;
    		case W.KEY.LEFT:
    			if(isVodError){
    				_comp.button[index].unFocus();
        			index = (--index + 2) % 2;
        			_comp.button[index].focus();
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(isVodError){
	    			_comp.button[index].unFocus();
	    			index = (++index) % 2;
	    			_comp.button[index].focus();
    			}
    			break;
    		}
    	}
    });
});