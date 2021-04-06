/**
 * popup/NoticePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("NoticePopup");
	var index = 0;
	var totalPage = 0;
	var _this;
	var _comp;
	var desc;
	var barLength = 0;
	var btnIndex = 0;
	
	function create(){
		if(desc.noticeType == "1")
			_this.isEmergency = true;

		_comp.add(new W.Span({x:29, y:41, width:"720px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px",
			className:"font_rixhead_medium", text:W.Texts["notice"], textAlign:"center"}));
		_comp.add(new W.Div({x:29, y:91, width:"720px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp.add(new W.Span({x:29, y:127, width:"720px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px",
			className:"font_rixhead_medium cut", text:desc.title, textAlign:"center"}));
		_comp.add(new W.Span({x:29, y:154, width:"720px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_medium", text:desc.startDate.substr(0,4) + "." + desc.startDate.substr(4,2) + "." + desc.startDate.substr(6,2), textAlign:"center"}));
		
		if(desc.uiType == "IMAGE"){
			_comp._img = new W.Image({x:29, y:198, width:"719px", height:"207px", src:desc.image});
			_comp.add(_comp._img);
		}else{
			_comp._scr = new W.Div({x:756, y:195, width:"3px", height:"210px", display:"none"});
			_comp.add(_comp._scr);
			_comp._scr.add(new W.Div({x:1, y:0, width:"1px", height:"210px", backgroundColor:"rgba(131,122,119,0.25)"}));
			_comp._bar = new W.Div({x:0, y:0, width:"3px", height:"90px", backgroundColor:"rgb(131,122,119)"});
			_comp._scr.add(_comp._bar);

			
			_comp._sysnop = new W.Div({x:29, y:192, width:"720px", height:"216px", overflow:"hidden"});
			_comp.add(_comp._sysnop);
			_comp._sysnop._text = new W.Span({x:0, y:0, width:"720px", "font-size":"19px", textColor:"rgb(181,181,181)", className:"font_rixhead_light",
				"white-space":"pre-wrap", "line-height":"27px"});
			_comp._sysnop.add(_comp._sysnop._text);
			_comp._sysnop._text.setText(desc.description);
			_comp._sysnop.height = _comp._sysnop._text.comp.offsetHeight;
			totalPage = Math.ceil(_comp._sysnop.height / 210);
			if(totalPage > 0){
				_comp._scr.setStyle({display:"block"});
				barLength = 214/totalPage;
				_comp._bar.setStyle({height:barLength + "px"});
			}
		}
		
		_comp.btns = [];
		_comp._btn_area = new W.Div({x:29, y:439, width:"720px", height:"38px", textAlign:"center"});
		_comp.add(_comp._btn_area);
		var no = 0;
		if(desc.link){
			_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["going"], 133, undefined, {display:"inline-block", "padding-right":"5px", "padding-left":"5px"});
			_comp._btn_area.add(_comp.btns[no].getComp());
			no++;
		}
		_comp.btns[no] = buttonComp.create("relative", 0, W.Texts["close"], 133, undefined, {display:"inline-block", "padding-right":"5px", "padding-left":"5px"});
		_comp._btn_area.add(_comp.btns[no].getComp());
		_comp.btns[0].focus();
		
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("NoticePopup onStart");
    		desc = _param.desc;
			_this = this;
			
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:251, y:100, width:"779px", height:"520px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		index = 0;
    		totalPage = 0;
    		barLength = 0;
			btnIndex = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("NoticePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("NoticePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(desc.link){
    				if(btnIndex == 0){
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
    				}else{
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}else{
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    			break;
    		case W.KEY.UP:
    			if(desc.type != "IMAGE"){
	    			index = (--index + totalPage) % totalPage;
	    			_comp._sysnop._text.setStyle({y:-index * 216});
	    			_comp._bar.setStyle({y:index * barLength});
    			}
    			break;
    		case W.KEY.DOWN:
    			if(desc.type != "IMAGE"){
        			index = (++index) % totalPage;
        			_comp._sysnop._text.setStyle({y:-index * 216});
        			_comp._bar.setStyle({y:index * barLength});
    			}
    			break;
    		case W.KEY.LEFT:
    		case W.KEY.RIGHT:
    			if(desc.link){
    				_comp.btns[btnIndex].unFocus();
    				btnIndex = btnIndex ? 0 : 1;
    				_comp.btns[btnIndex].focus();
    			}
    			break;
    		}
    	}
    });
});