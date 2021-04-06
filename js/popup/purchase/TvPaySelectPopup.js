/**
 * popup/TvPaySelectPopup
 */
W.defineModule(["comp/PopupButton", "manager/TvPayDataManager"], function(buttonComp, tvPayDataManager) {
	'use strict';
	W.log.info("TvPaySelectPopup");
	var bIndex = 0;
	var index = 0;
	var yIndex = 0;
	var sIndex = 0;
	var _this;
	var _comp;
	var desc;
	var billTypes;
	var titles;

	function create(){
		_comp.add(new W.Span({x:426-396, y:229-198, width:"868px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["select_payment2"], textAlign:"center"}));
		_comp.add(new W.Div({x:426-396, y:285-198, width:"868px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		_comp.add(new W.Span({x:426-396, y:311-198, width:"868px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_tvpay_select_guide"], textAlign:"center"}));
		
		_comp._area = new W.Div({x:29, y:355-198, width:"868px", height:"72px", textAlign:"center"});
		_comp.add(_comp._area);
		_comp._sel_btns = [];
		for(var i=0; i < titles.length; i++){
			_comp._sel_btns[i] = new W.Div({position:"relative", y:0, width:"211px", height:"72px", display:"inline-block"});
			_comp._area.add(_comp._sel_btns[i]);
			_comp._sel_btns[i].add(new W.Image({x:1, y:1, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
			_comp._sel_btns[i]._foc = new W.Image({x:0, y:0, width:"211px", height:"72px", src:"img/box_popup_w209_f.png", display:i==0 ? "" : "none"});
			_comp._sel_btns[i].add(_comp._sel_btns[i]._foc);
			_comp._sel_btns[i].add(new W.Image({x:440-425, y:380-355, width:"22px", height:"22px", src:"img/radio2_n.png"}));
			_comp._sel_btns[i]._sel = new W.Image({x:440-425, y:380-355, width:"22px", height:"22px", src:"img/radio_f.png", display:i==0 ? "" : "none"});
			_comp._sel_btns[i].add(_comp._sel_btns[i]._sel);
			_comp._sel_btns[i]._txt = new W.Span({x:469-425, y:383-355, width:"150px", height:"20px", textColor:i==0 ? "rgb(255,255,255)": "rgb(181,181,181)", 
				"font-size":"18px", className:"font_rixhead_light", text:titles[i], textAlign:"left"});
			_comp._sel_btns[i].add(_comp._sel_btns[i]._txt);
		}

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(327, 461-198, W.Texts["payment"], 133);
		_comp.btns[1] = buttonComp.create(467, 461-198, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("TvPaySelectPopup onStart");
    		desc = _param;
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:168, y:198, width:"928px", height:"324px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		index = 0;
    		sIndex = 0;
    		yIndex = 0;
    		tvPayDataManager.methodRequest(function(result, data){
    			W.log.info(data);
    			if(result && data && data.result == "0000"){
    				billTypes = data.qrType.split("|");
    				titles = data.resultMessage.split("|");
    				if(titles.length == 1){
    					W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, billType:billTypes[0]});
    				}else{
        	    		create();
    				}
    			}else{
    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    		}, {});
    	},
    	onStop: function() {
    		W.log.info("TvPaySelectPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("TvPaySelectPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				_comp._sel_btns[sIndex]._sel.setStyle({display:"none"});
    				sIndex = index;
    				_comp._sel_btns[sIndex]._sel.setStyle({display:"block"});
    				yIndex = 1;
    				bIndex = 0;
    				_comp._sel_btns[index]._foc.setStyle({display:"none"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(181,181,181)"});
    				_comp.btns[bIndex].focus();
    			}else{
    				if(bIndex == 0){
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, billType:billTypes[sIndex]});
    				}else{
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				_comp._sel_btns[index]._foc.setStyle({display:"none"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(181,181,181)"});
    				index = (--index + billTypes.length) % billTypes.length;
    				_comp._sel_btns[index]._foc.setStyle({display:"block"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(255,255,255)"});
    			}else{
        			_comp.btns[bIndex].unFocus();
    				bIndex = (++bIndex) % 2;
    				_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 0){
    				_comp._sel_btns[index]._foc.setStyle({display:"none"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(181,181,181)"});
    				index = (++index) % billTypes.length;
    				_comp._sel_btns[index]._foc.setStyle({display:"block"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(255,255,255)"});
    			}else{
        			_comp.btns[bIndex].unFocus();
    				bIndex = (++bIndex) % 2;
    				_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				_comp._sel_btns[index]._foc.setStyle({display:"none"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(181,181,181)"});
    				yIndex = 1;
    				_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 1){
    				_comp.btns[bIndex].unFocus();
    				yIndex = 0;
    				_comp._sel_btns[index]._foc.setStyle({display:"block"});
    				_comp._sel_btns[index]._txt.setStyle({textColor:"rgb(255,255,255)"});
    			}
    			break;
    		}
    	}
    });
});