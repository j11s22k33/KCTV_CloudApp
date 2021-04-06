/**
 * popup/OptionSelectPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("OptionSelectPopup");
	var list;
	var isList = true;
	var oIdx = 0;
	var bIdx = 0;
	var sIdx = 0;
	var _comp;
	
	function create(){
		_comp.add(new W.Div({x:396, y:186, width:"488px", height:"348px", className:"popup_comp_color popup_comp_border"}));
		_comp.add(new W.Span({x:396, y:216, width:"488px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["select_option"], textAlign:"center"}));
		_comp.add(new W.Div({x:426, y:273, width:"426px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		_comp.add(new W.Span({x:396, y:299, width:"488px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["option_popup_text1"], textAlign:"center"}));
		_comp.add(new W.Span({x:396, y:323, width:"488px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["option_popup_text2"], textAlign:"center"}));
		
		_comp.add(new W.Image({x:426, y:368, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
		_comp.add(new W.Image({x:645, y:368, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
		_comp.add(new W.Image({x:440, y:392, width:"22px", height:"22px", src:"img/radio2_n.png"}));
		_comp.add(new W.Image({x:659, y:392, width:"22px", height:"22px", src:"img/radio2_n.png"}));
		
		_comp._txts = [];
		_comp._options = [];
		_comp._focs = [];
		_comp.buttons = [];
		_comp.idxList = [];
		var no = 0;
		for(var i=0; i < list.length; i++){
			if(util.isWatchable(list[no])){
				var title = list[i].resolution ? list[i].resolution : "";
				if(list[i].isLifetime){
					title += " " + W.Texts["popup_zzim_option_lifetime"]
				}
				if(list[i].assetGroup != "010"){
					title += " " + util.getAssetGroupCode(list[i]);
				}
				
				_comp._txts[no] = new W.Span({x:no*219 + 469, y:395, width:"150px", height:"20px", textColor:"rgb(181,181,181)", 
					"font-size":"18px", className:"font_rixhead_light", text:title});
				_comp.add(_comp._txts[no]);
				_comp._options[no] = new W.Image({x:no*219 + 440, y:392, width:"22px", height:"22px", src:"img/radio_f.png", display:no == 0 ? "block" : "none"});
				_comp.add(_comp._options[no]);
				_comp._focs[no] = new W.Image({x:no*219 + 425, y:367, width:"211px", height:"72px", src:"img/box_popup_w209_f.png", display:no == 0 ? "block" : "none"});
				_comp.add(_comp._focs[no]);
				
				no++;
			}
		}
		_comp.buttons[0] = buttonComp.create(504, 473, W.Texts["ok"], 133);
		_comp.add(_comp.buttons[0].getComp());
		_comp.idxList[0] = 0;
		_comp.buttons[1] = buttonComp.create(644, 473, W.Texts["cancel"], 133);
		_comp.add(_comp.buttons[1].getComp());
		_comp.idxList[1] = 1;
		
		focus();
	};
	
	function focus(inUnfocus){
		if(isList){
			if(inUnfocus){
				_comp._txts[oIdx].setStyle({textColor:"rgb(181,181,181)"});
				_comp._focs[oIdx].setStyle({display:"none"});
			}else{
				_comp._txts[oIdx].setStyle({textColor:"rgb(255,255,255)"});
				_comp._focs[oIdx].setStyle({display:"block"});
			}
		}else{
			if(bIdx == 0){
				_comp.buttons[0].focus();
				_comp.buttons[1].unFocus();
			}else{
				_comp.buttons[1].focus();
				_comp.buttons[0].unFocus();
			}
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("OptionSelectPopup onStart");
    		if(_comp){
    			this.remove(_comp);
    		}
    		isList = true;
    		list = _param.list;
    		oIdx = 0;
    		bIdx = 0;
    		sIdx = 0;
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size popup_bg_color"});
    		this.add(_comp);
    		create();
    	},
    	onStop: function() {
    		W.log.info("OptionSelectPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("OptionSelectPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(isList){
    				_comp._options[sIdx].setStyle({display:"none"});
    				sIdx = oIdx;
    				_comp._options[sIdx].setStyle({display:"block"});
    				
    				_comp._txts[oIdx].setStyle({textColor:"rgb(181,181,181)"});
    				_comp._focs[oIdx].setStyle({display:"none"});
    				isList = false;
    				focus();
    			}else{
    				if(bIdx == 0){
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:_comp.idxList[sIdx]});
    				}else{
        				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(isList){
    				focus(true);
    				oIdx = (++oIdx) % _comp._txts.length;
    			}else{
    				bIdx = bIdx == 0 ? 1 : 0;
    			}
				focus();
    			break;
    		case W.KEY.LEFT:
    			if(isList){
    				focus(true);
    				oIdx = (--oIdx + _comp._txts.length) % _comp._txts.length;
    			}else{
    				bIdx = bIdx == 0 ? 1 : 0;
    			}
				focus();
    			break;
    		case W.KEY.UP:
    			if(!isList){
    				_comp.buttons[bIdx].unFocus();
    				bIdx = 0;
    				isList = true;
    				focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(isList){
    				_comp._txts[oIdx].setStyle({textColor:"rgb(181,181,181)"});
    				_comp._focs[oIdx].setStyle({display:"none"});
    				isList = false;
    				focus();
    			}
    			break;
    		}
    	}
    });
});