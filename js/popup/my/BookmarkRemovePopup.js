/**
 * popup/BookmarkRemovePopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("BookmarkRemovePopup");
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

		_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:85, text:W.Texts["remove_bookmark"], lineHeight:"85px", className:"cut",
			"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"27px"});
		_comp._popup.add(_comp._popup._title);

		_comp._popup.add(new W.Div({x:0,y:84,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));


		var text = list[0].targetName;
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

		_comp._popup._thinText = new W.Div({position:"relative", "max-width":"800px", text:W.Texts["remove_bookmark_confirm"],
			lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
			"white-space":"pre", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px", marginBottom:"15px"});
		_comp._popup.add(_comp._popup._thinText);

		var button = [W.Texts["unselect"], W.Texts["cancel"]]
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
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("BookmarkRemovePopup onStart");
    		list = _param.data.list;
			W.log.info(_param)
    		
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
    		W.log.info("BookmarkRemovePopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("BookmarkRemovePopup onKeyPressed "+event.keyCode);
    		
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