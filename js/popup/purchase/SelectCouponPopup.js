/**
 * popup/SelectCouponPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("SelectCouponPopup");
	var index = 0;
	var totalPage = 0;
	var bIndex = 0;
	var sIndex = -1;
	var page = 0;
	var _this;
	var _comp;
	var desc;
	var isList = true;
	var hasPage = false;
	
	
	function create(){
		_comp.add(new W.Span({x:30 + (hasPage ? 60 : 0), y:31, width:"647px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_select_coupon_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:30 + (hasPage ? 60 : 0), y:87, width:"647px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		var text = W.Texts["popup_select_coupon_title"] + " " + desc.coupons.length + W.Texts["count_unit2"] + " / " +
			 W.Texts["popup_select_coupon_guide2"] + " " + W.Coupon.usableCouponNumber + W.Texts["count_unit2"];
		_comp.add(new W.Span({x:30 + (hasPage ? 60 : 0), y:113, width:"647px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:text, textAlign:"center"}));
		_comp.add(new W.Span({x:30 + (hasPage ? 60 : 0), y:150, width:"647px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_select_coupon_guide1"], textAlign:"center"}));
		
		_comp._coupons = [];
		_comp.isUsables = [];
		var _list = new W.Div({x:30 + (hasPage ? 60 : 0), y:189, width:"649px", height:"94px", overflow:"hidden"});
		_comp.add(_list);
		_comp._list = new W.Div({x:0, y:0, width:"649px", height:"94px"});
		_list.add(_comp._list);
		for(var i=0; i < desc.coupons.length; i++){
			_comp._coupons[i] = new W.Div({x:219 * i, y:0, width:"211px", height:"94px"});
			_comp._list.add(_comp._coupons[i]);
			_comp._coupons[i].add(new W.Image({x:1, y:1, width:"209px", height:"92px", src:"img/box_popup_w209.png"}));
			_comp._coupons[i]._foc = new W.Image({x:0, y:0, width:"211px", height:"94px", src:"img/box_popup_w209_f.png", display:"none"});
			_comp._coupons[i].add(_comp._coupons[i]._foc);
			
			if(desc.coupons[i].DCGubun == "R"){
				_comp._coupons[i]._available = new W.Span({x:44, y:14, width:"160px", height:"22px", textColor:"rgb(181,181,181)", "font-size":"20px", 
					className:"font_rixhead_medium cut", text:W.Texts["usable_price_amount4"].replace("@rate@", desc.coupons[i].DCValue)});
			}else{
				if(desc.coupons[i].DCGubun){
					_comp._coupons[i]._available = new W.Span({x:44, y:14, width:"160px", height:"22px", textColor:"rgb(181,181,181)", "font-size":"20px", 
						className:"font_rixhead_medium cut", text:W.Texts["usable_price_amount3"].replace("@price@", W.Util.formatComma(desc.coupons[i].DCValue, 3))});
				}else{
					_comp._coupons[i]._available = new W.Span({x:44, y:14, width:"160px", height:"22px", textColor:"rgb(181,181,181)", "font-size":"20px", 
						className:"font_rixhead_medium cut", text:W.Texts["usable_price_amount3"].replace("@price@", W.Util.formatComma(desc.coupons[i].BalanceAmount, 3))});
				}
			}
			
			_comp._coupons[i].add(_comp._coupons[i]._available);
			_comp._coupons[i].add(new W.Span({x:44, y:44, width:"160px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_light cut", text:desc.coupons[i].CouponName}));
			if(desc.coupons[i].DCGubun != "R"){
				if(desc.coupons[i].DCGubun){
					_comp._coupons[i].add(new W.Span({x:44, y:64, width:"160px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
						className:"font_rixhead_light", text:W.Util.formatComma(desc.coupons[i].DCValue, 3) + W.Texts["price_unit"]}));
				}else{
					_comp._coupons[i].add(new W.Span({x:44, y:64, width:"160px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
						className:"font_rixhead_light", text:W.Util.formatComma(desc.coupons[i].OfferAmount, 3) + W.Texts["price_unit"]}));
				}
			}
			_comp._coupons[i].add(new W.Image({x:15, y:36, width:"22px", height:"22px", src:"img/radio2_n.png"}));
			_comp._coupons[i]._select = new W.Image({x:15, y:36, width:"22px", height:"22px", src:"img/radio_f.png", display:i == sIndex ? "block" : "none"});
			_comp._coupons[i].add(_comp._coupons[i]._select);
		}
		

		
		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(217 + (hasPage ? 60 : 0), 317, W.Texts["apply"], 133);
		_comp.btns[1] = buttonComp.create(358 + (hasPage ? 60 : 0), 317, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
		_comp.btns[0].getComp().setStyle({opacity:0.4});
		
		index = 0;
		focus();
	};

	
	var focus = function(){
		if(isList){
			for(var i=0; i < _comp._coupons.length; i++){
				if(i == index){
					_comp._coupons[i]._foc.setStyle({display:"block"});
					_comp._coupons[i]._available.setStyle({textColor:"rgb(255,255,255)"});
				}else{
					_comp._coupons[i]._foc.setStyle({display:"none"});
					_comp._coupons[i]._available.setStyle({textColor:"rgb(181,181,181)"});
				}
			}
			_comp._list.setStyle({x:-Math.floor(index/3) * 657});
			if(totalPage > 1){
				page = Math.floor(index/3) + 1;
				_comp._page.setText(W.Util.changeDigit(page, 2));
				
				if(page == 1){
					_comp._arr_l.setStyle({display:"none"});
					_comp._arr_r.setStyle({display:"block"});
            	}else if(page == totalPage){
            		_comp._arr_l.setStyle({display:"block"});
            		_comp._arr_r.setStyle({display:"none"});
            	}else{
            		_comp._arr_l.setStyle({display:"block"});
            		_comp._arr_r.setStyle({display:"block"});
            	}
			}
		}else{
			if(bIndex == 0){
				_comp.btns[0].focus();
				_comp.btns[1].unFocus();
			}else{
				_comp.btns[1].focus();
				_comp.btns[0].unFocus();
			}
		}
	};
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SelectCouponPopup onStart");
    		desc = _param;
    		W.log.info(_param);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		

    		totalPage = Math.ceil(desc.coupons.length/3);
    		if(desc.coupons.length > 3){
    			hasPage = true;
        		_comp = new W.Div({x:227, y:171, width:"827px", height:"378px", className:"popup_comp_color popup_comp_border"});
        		_comp._arr_l = new W.Image({x:27, y:213, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
        		_comp._arr_r = new W.Image({x:759, y:213, width:"41px", height:"41px", src:"img/arrow_navi_r.png"});
        		_comp.add(_comp._arr_l);
    			_comp.add(_comp._arr_r);
    			_comp.add(new W.Div({x:30 + (hasPage ? 60 : 0), y:290, width:"647px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
    			var _page_area = new W.Div({x:677, y:295, width:"60px", height:"18px", textAlign:"right"});
    			_comp.add(_page_area);
    			_comp._page = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(254,254,254)", "font-size":"16px", 
    				className:"font_rixhead_bold", text:"01"});
    			_page_area.add(_comp._page);
    			_comp._total = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
    				className:"font_rixhead_bold", text:" / " + (totalPage > 9 ? "" : "0") + totalPage});
    			_page_area.add(_comp._total);
    		}else{
        		_comp = new W.Div({x:287, y:171, width:"707px", height:"378px", className:"popup_comp_color popup_comp_border"});
    		}
    		
    		this.add(_comp);
    		index = 0;
    		bIndex = 0;
    		sIndex = -1;
    		isList = true;
    		create();
    	},
    	onStop: function() {
    		W.log.info("SelectCouponPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SelectCouponPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, type:desc.type});
    			break;
    		case W.KEY.ENTER:
    			if(isList){
    				sIndex = index;
    				for(var i=0; i < desc.coupons.length; i++){
    					if(sIndex == i){
    						_comp._coupons[i]._select.setStyle({display:"block"});
    					}else{
    						_comp._coupons[i]._select.setStyle({display:"none"});
    					}
    				}
    				_comp._coupons[index]._foc.setStyle({display:"none"});
					_comp._coupons[index]._available.setStyle({textColor:"rgb(181,181,181)"});
    				isList = false;
    				bIndex = 0;
    				_comp.btns[0].getComp().setStyle({opacity:1});
    				focus();
    			}else{
    				if(sIndex == -1){
            			W.PopupManager.closePopup(this, {
        					action:W.PopupManager.ACTION_CLOSE,
        					idx: sIndex, 
        					coupon: desc.coupons[sIndex]
        				});
    				}else{
            			W.PopupManager.closePopup(this, {
        					action:bIndex == 0 ? W.PopupManager.ACTION_OK : W.PopupManager.ACTION_CLOSE,
        					idx: sIndex, 
        					needFeedback: desc.needFeedback,
        					coupon: desc.coupons[sIndex]
        				});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(isList){
    				index = (++index) % desc.coupons.length;
    			}else{
    				if(sIndex > -1){
    					bIndex = bIndex == 0 ? 1 : 0;
    				}
    			}
				focus();
    			break;
    		case W.KEY.LEFT:
    			if(isList){
    				index = (--index + desc.coupons.length) % desc.coupons.length;
    			}else{
    				if(sIndex > -1){
    					bIndex = bIndex == 0 ? 1 : 0;
    				}
    			}
				focus();
    			break;
    		case W.KEY.UP:
    			if(!isList && index > -1){
    				isList = true;
    				_comp.btns[bIndex].unFocus();
    				bIndex = 0;
    				focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(isList){
    				_comp._coupons[index]._foc.setStyle({display:"none"});
					_comp._coupons[index]._available.setStyle({textColor:"rgb(181,181,181)"});
//					index = sIndex;
//					_comp._list.setStyle({x:-Math.floor(index/3) * 657});
    				isList = false;
    				if(sIndex > -1){
    					bIndex = 0;
    				}else{
    					bIndex = 1;
    				}
    				focus();
    			}
    			break;
    		}
    	}
    });
});