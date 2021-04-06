/**
 * popup/ZzimRemovePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("ZzimRemovePopup");
	var _this;
	var _comp;
	var index;
	var list;
	
	function create(){
		_comp = new W.Div({className:"bg_size", display:"-webkit-flex", "-webkit-flex-direction":"column",
			"-webkit-align-items":"center","-webkit-justify-content":"center"});
		_this.add(_comp);

		_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
		_comp.add(_comp._popup);

		_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:85, text:W.Texts["popup_zzim_remove_title"], lineHeight:"85px", className:"cut",
			"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"27px"});
		_comp._popup.add(_comp._popup._title);

		_comp._popup.add(new W.Div({x:0,y:84,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));


		var text = list[0].target.title;
		var text2 = "";
		if(list.length > 1){
			text2 = W.Texts["popup_zzim_remove_count"].replace("@title@", " ").replace("@count@", (list.length-1));
		}
		_comp._popup._boldText = new W.Div({position:"relative", "max-width":"800px",
			lineHeight:"24px", fontFamily:"RixHeadM", "-webkit-line-clamp":1, "-webkit-box-orient":"vertical",/* display:"-webkit-box",*/
			"white-space":"pre", textColor:"#FFFFFF", "font-size":"22px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"15px"});
		_comp._popup._boldText.add(new W.Div({position:"relative", "max-width":"323px", height:"24px", textColor:"rgb(255,255,255)", float:"left",
			className:"font_rixhead_medium cut", text:text}));
		_comp._popup._boldText.add(new W.Div({position:"relative", height:"24px", textColor:"rgb(255,255,255)", float:"left",
			className:"font_rixhead_medium cut", text:text2, marginLeft:"5px"}));
		_comp._popup.add(_comp._popup._boldText);

		_comp._popup._thinText = new W.Div({position:"relative", "max-width":"800px", text:W.Texts["popup_zzim_remove_info_guide2"],
			lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
			"white-space":"pre", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px", marginBottom:"15px"});
		_comp._popup.add(_comp._popup._thinText);

		var button = [W.Texts["delete"], W.Texts["cancel"]]
		if(button && button.length > 0) {
			_comp._popup._btns = new W.Div({position:"relative", "max-width":"800px", height:41, marginTop:"15px"});
			_comp.btns = [];
			for(var i = 0; i < button.length; i++) {
				_comp.btns[i] = buttonComp.create(0, 0, button[i], 133);

				_comp.btns[i].getComp().setStyle({position:"relative", "float":"left", marginLeft:"4px", marginRight:"4px"});

				_comp._popup._btns.add(_comp.btns[i].getComp());
			}
			_comp._popup.add(_comp._popup._btns);
			_comp.btns[index].focus();
		}

		/*_comp.add(new W.Span({x:479-449, y:261-231, width:"323px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px",
			className:"font_rixhead_medium", text:W.Texts["popup_zzim_remove_title"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:479-449, y:316-231, width:"323px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		var text = list[0].target.title;
		var text2 = "";
		if(list.length > 1){
			text2 = W.Texts["popup_zzim_remove_count"].replace("@title@ ", "").replace("@count@", (list.length-1));
		}
		_comp.add(new W.Span({x:479-449, y:342-231, width:"323px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium cut", text:text, textAlign:"center"}));
		
		_comp.add(new W.Span({x:479-449, y:379-231, width:"323px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_zzim_remove_info_guide2"], textAlign:"center"}));
		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(55, 429-231, W.Texts["delete"], 133);
		_comp.btns[1] = buttonComp.create(55 + 133 + 8, 429-231, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.btns[0].focus();*/
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ZzimRemovePopup onStart");
    		list = _param.data.list;
    		
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		//_comp = new W.Div({x:449, y:231, width:"383px", height:"259px", className:"popup_comp_color popup_comp_border"});
    		
    		//this.add(_comp);
    		index = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("ZzimRemovePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("ZzimRemovePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, idx:index});
    			break;
    		case W.KEY.ENTER:
    			if(index == 0){
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:index});
    			}else{
        			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, idx:index});
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