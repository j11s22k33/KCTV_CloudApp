/**
 * popup/SubscribedSelectPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("SubscribedSelectPopup");
	var index = 0;
	var page = 0;
	var _comp;
	var list;
	var assetList;
	var isList;
	var totalPage = 0;
	
	function create(){
		if(list.length > 3){
			_comp._bg = new W.Div({x:324, y:111, width:"632px", height:"498px", className:"popup_comp_color popup_comp_border"});
			_comp.add(_comp._bg);
			
			_comp._bg.add(new W.Span({x:0, y:29, width:"632px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium", text:W.Texts["popup_select_subscribed_title"], textAlign:"center"}));
			_comp._bg.add(new W.Span({x:0, y:71, width:"632px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
				className:"font_rixhead_light", text:W.Texts["popup_select_subscribed_guide"], textAlign:"center"}));
			
			_comp._bg.add(new W.Div({x:395-324, y:220-111, width:"490px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp._bg.add(new W.Div({x:395-324, y:512-111, width:"490px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp._arr_l = new W.Image({x:339-324, y:346-111, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
			_comp._arr_r = new W.Image({x:900-324, y:346-111, width:"41px", height:"41px", src:"img/arrow_navi_r.png"});
			_comp._bg.add(_comp._arr_l);
			_comp._bg.add(_comp._arr_r);
			
			var _page_area = new W.Div({x:825-324, y:523-111, width:"60px", height:"18px", textAlign:"right"});
			_comp._bg.add(_page_area);
			_comp._page = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(254,254,254)", "font-size":"16px", 
				className:"font_rixhead_bold", text:"01"});
			_page_area.add(_comp._page);
			_comp._total = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_bold", text:" / " + (totalPage > 9 ? "" : "0") + totalPage});
			_page_area.add(_comp._total);
			
			_comp.buttons = buttonComp.create(574-324, 548-111, W.Texts["close"], 133);
			
			var _list_area = new W.Div({x:394-324, y:245-111, width:"524px", height:"243px", overflow:"hidden"});
			_comp._bg.add(_list_area);
			_comp._list_area = new W.Div({x:0, y:0, width:"524px", height:"243px"});
			_list_area.add(_comp._list_area);
		}else{
			_comp._bg = new W.Div({x:345, y:124, width:"590px", height:"472px", className:"popup_comp_color popup_comp_border"});
			_comp.add(_comp._bg);
			
			_comp._bg.add(new W.Span({x:0, y:30, width:"590px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium", text:W.Texts["popup_select_subscribed_title"], textAlign:"center"}));
			_comp._bg.add(new W.Span({x:0, y:71, width:"590px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
				className:"font_rixhead_light", text:W.Texts["popup_select_subscribed_guide"], textAlign:"center"}));
			
			_comp._bg.add(new W.Div({x:394-345, y:233-124, width:"490px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp.buttons = buttonComp.create(574-345, 535-124, W.Texts["close"], 133);
			
			var _list_area = new W.Div({x:394-345, y:258-124, width:"524px", height:"243px", overflow:"hidden"});
			_comp._bg.add(_list_area);
			_comp._list_area = new W.Div({x:0, y:0, width:"524px", height:"243px"});
			_list_area.add(_comp._list_area);
		}
		
		_comp._bg.add(_comp.buttons.getComp());
		
		_comp._products = [];
		for(var i=0; i < list.length; i++){
			_comp._products[i] = new W.Div({x:0, y:85 * i, width:"524px", height:"72px"});
			_comp._list_area.add(_comp._products[i]);
			
			_comp._products[i].add(new W.Image({x:1, y:1, width:"490px", height:"70px", src:"img/box_popup_w490.png"}));
			_comp._products[i]._foc = new W.Image({x:0, y:0, width:"490px", height:"72px", src:"img/box_popup_w490_f.png", display:"none"});
			_comp._products[i].add(_comp._products[i]._foc);
			
			_comp._products[i]._title = new W.Span({x:414-394, y:list[i].subtitle ? 15 : 27, width:"290px", height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				className:"font_rixhead_medium cut", text:list[i].title});
			_comp._products[i].add(_comp._products[i]._title);
			
			_comp._products[i]._sub_title = new W.Span({x:414-394, y:40, width:"290px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_light cut", text:list[i].subtitle ? list[i].subtitle : ""});
			_comp._products[i].add(_comp._products[i]._sub_title);
			
			var price = util.getPrice(list[i]);
			var listPrice = util.vatPrice(list[i].listPrice);
			W.log.info(price + " ,,, " + listPrice);
			if(price == listPrice){
				var y = 23;
				if(list[i].events){
					y = 38;
					_comp._products[i].add(new W.Image({x:814-394, y:13, width:"51px", height:"18px", src:"img/icon_popup_event.png", "padding-right":"6px"}));
				}
				var _price = new W.Div({x:665-394, y:y, width:"200", height:"20px", textAlign:"right"});
				_comp._products[i].add(_price);
				_price.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(131,122,119)", "font-size":"16px", 
					className:"font_rixhead_light", text:W.Texts["vat"], "padding-left":"3px"}));
				_price.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(255,255,255)", "font-size":"16px", 
					className:"font_rixhead_light", text:W.Texts["unit_month"], "padding-left":"6px"}));
				_price.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
					className:"font_rixhead_medium", text:W.Util.formatComma(listPrice, 3), "padding-left":"5px"}));
				_price.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgba(255,255,255,0.75)", "font-size":"16px", 
					className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"2px"}));
			}else{
				var _price = new W.Div({x:565-394, y:11, width:"300", height:"20px", textAlign:"right"});
				_comp._products[i].add(_price);W.Texts["discount"]
				if(list[i].events){
					_price.add(new W.Image({position:"relative", y:4, width:"51px", height:"18px", src:"img/icon_popup_event.png", "padding-right":"6px"}));
				}
				_price.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(218,188,116)", "font-size":"16px", 
					className:"font_rixhead_medium", text:W.Texts["discount"].replace("@price@", W.Util.formatComma(listPrice-price, 3)), "padding-right":"6px"}));
				_price.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
					className:"font_rixhead_light strike", text:W.Util.formatComma(listPrice, 3) + W.Texts["price_unit"]}));
				
				var _price2 = new W.Div({x:665-394, y:38, width:"200", height:"20px", textAlign:"right"});
				_comp._products[i].add(_price2);
				if(price == 0){
					if(list[i].coupons){
    					var period = 1 + W.Texts["unit_month_until"];
    					if(list[i].coupons[0].discountPeriod){
    						period = list[i].coupons[0].discountPeriod.value + "";
    						if(list[i].coupons[0].discountPeriod.unit == "Y"){
    							period += W.Texts["unit_year"]
    						}else if(list[i].coupons[0].discountPeriod.unit == "D"){
    							period += W.Texts["unit_date"]
    						}else{
    							period += W.Texts["unit_month_until"]
    						}
    					}
    				}
					period += " " + W.Texts["price_free"];
					_price2.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
						className:"font_rixhead_medium", text:period}));
				}else{
					_price2.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(131,122,119)", "font-size":"16px", 
						className:"font_rixhead_light", text:W.Texts["vat"], "padding-left":"3px"}));
					_price2.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(255,255,255)", "font-size":"16px", 
						className:"font_rixhead_light", text:W.Texts["unit_month"], "padding-left":"6px"}));
					_price2.add(new W.Span({position:"relative", y:0, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
						className:"font_rixhead_medium", text:W.Util.formatComma(price, 3), "padding-left":"5px"}));
					_price2.add(new W.Span({position:"relative", y:0, height:"18px", textColor:"rgba(255,255,255,0.75)", "font-size":"16px", 
						className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"2px"}));
				}
			}
		}
		
		for(var i=0; i < 3; i++){
			var idx = list.length + i;
			_comp._products[idx] = new W.Div({x:0, y:85 * idx, width:"524px", height:"72px"});
			_comp._list_area.add(_comp._products[idx]);
			
			_comp._products[idx].add(new W.Image({x:1, y:1, width:"490px", height:"70px", src:"img/box_popup_w490.png", opacity:0.5}));
		}
		
		
		
	};
	
	function focus(){
		if(isList){
			if(totalPage > 1){
				_comp._page.setText(W.Util.changeDigit(page+1, 2));
				_comp._list_area.setStyle({y:- page * 85*3});
				
				if(page == 0){
					_comp._arr_l.setStyle({display:"none"});
					_comp._arr_r.setStyle({display:"block"});
            	}else if(page == totalPage - 1){
            		_comp._arr_l.setStyle({display:"block"});
            		_comp._arr_r.setStyle({display:"none"});
            	}else{
            		_comp._arr_l.setStyle({display:"block"});
            		_comp._arr_r.setStyle({display:"block"});
            	}
			}
			_comp._products[page * 3 + index]._foc.setStyle({display:"block"});
			_comp._products[page * 3 + index]._title.setStyle({textColor:"rgba(255,255,255,1)"});
			_comp._products[page * 3 + index]._sub_title.setStyle({textColor:"rgba(181,181,181,1)"});
		}else{
			_comp.buttons.focus();
		}
	};
	
	function unFocus(){
		if(isList){
			_comp._products[page * 3 + index]._foc.setStyle({display:"none"});
			_comp._products[page * 3 + index]._title.setStyle({textColor:"rgba(255,255,255,0.75)"});
			_comp._products[page * 3 + index]._sub_title.setStyle({textColor:"rgba(181,181,181,0.75)"});
		}else{
			_comp.buttons.unFocus();
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SubscribedSelectPopup onStart");
    		list = _param.list;
    		assetList = _param.assets;
    		if(_comp){
    			this.remove(_comp);
    		}
    		index = 0;
    		page = 0;
    		isList = true;
    		totalPage = Math.ceil(list.length/3);
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size popup_bg_color"});
    		this.add(_comp);
    		create();
    		focus();
    	},
    	onStop: function() {
    		W.log.info("SubscribedSelectPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SubscribedSelectPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(isList){
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, product:list[page * 3 + index], asset:assetList ? assetList[page * 3 + index] : null});
    			}else{
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(isList && totalPage > 1){
    				unFocus();
    				page = (++page) % totalPage;
    				index = 0;
    				focus();
    			}
    			break;
    		case W.KEY.LEFT:
    			if(isList && totalPage > 1){
    				unFocus();
    				page = (--page + totalPage) % totalPage;
    				index = 0;
    				focus();
    			}
    			break;
    		case W.KEY.UP:
				unFocus();
    			if(isList){
    				if(index > 0){
    					index--;
    				}
    			}else{
    				isList = true;
    			}
				focus();
    			break;
    		case W.KEY.DOWN:
				unFocus();
    			if(isList){
    				if(page * 3 + index == list.length - 1 || index == 2){
    					isList = false;
    				}else{
    					index++;
    				}
    			}
				focus();
    			break;
    		}
    	}
    });
});