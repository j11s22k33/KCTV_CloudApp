/**
 * popup/PurchaseCompletePopup
 */
W.defineModule(["comp/PopupButton"], function(Button) {
	'use strict';
	W.log.info("PurchaseCompletePopup");
	var _comp;
	var timeout;
	var _this;
	var type;
	var _data;
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("PurchaseCompletePopup onStart");
    		W.log.info(_param);
    		_this = this;
    		type = _param.type;
    		_data = _param;
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

    		_comp = new W.Div({className:"bg_size popup_bg_flex"});
    		this.add(_comp);

			_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
    		_comp.add(_comp._popup);

			_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:85, text:W.Texts["popup_purchase_complete_title"], lineHeight:"85px", className:"cut",
				"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"27px"});
			_comp._popup.add(_comp._popup._title);

			_comp._popup.add(new W.Div({x:0,y:84,width:"100%",height:1,color:"rgba(255,255,255,0.07)"}));
			
			var title ="";
			if(_param && _param.contents && _param.contents.title){
				title = _param.contents.title;
			}
			if(_param.popupTitle){
				title = _param.popupTitle;
			}

			_comp._popup._boldText = new W.Div({position:"relative", "max-width":"800px", text:title,
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadM", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", textColor:"#FFFFFF", "font-size":"24px", textAlign:"center", "letter-spacing":"-0.9px", marginBottom:"15px"});
			_comp._popup.add(_comp._popup._boldText);
			
			var text = W.Texts["popup_purchase_complete_guide"];
			if(_param.salesType && _param.salesType == "SS"){
				text += W.Texts["popup_purchase_complete_guide2"].replace("@price@", W.Util.formatComma(_param.totalAmt, 3));
			}
			

			_comp._popup._thinText = new W.Div({position:"relative", "max-width":"800px", text:text,
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", textColor:"rgba(181,181,181,0.8)", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px", marginBottom:"15px"});
			_comp._popup.add(_comp._popup._thinText);

			clearTimeout(timeout);
			timeout = setTimeout(function(){
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, type:type, contents:_data.contents});
			}, 5000);
    	},
    	onStop: function() {
    		W.log.info("PurchaseCompletePopup onStop");
			clearTimeout(timeout);
    	},
    	onKeyPressed : function(event) {
    		W.log.info("PurchaseCompletePopup onKeyPressed "+event.keyCode);
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    		case W.KEY.ENTER:
				clearTimeout(timeout);
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, type:type, contents:_data.contents});
				break;
    		}
    	}
    });
});