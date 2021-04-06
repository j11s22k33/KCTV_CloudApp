/**
 * popup/TrailerSelectPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("TrailerSelectPopup");
	var index = 0;
	var page = 0;
	var _comp;
	var list;
	var title;
	var isList;
	var totalPage = 0;
	
	function create(){
		if(list.length > 3){
			_comp._bg = new W.Div({x:324, y:111, width:"632px", height:"498px", className:"popup_comp_color popup_comp_border"});
			_comp.add(_comp._bg);
			
			_comp._bg.add(new W.Span({x:0, y:29, width:"632px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium", text:title, textAlign:"center"}));
			_comp._bg.add(new W.Span({x:0, y:71, width:"632px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
				className:"font_rixhead_light", text:W.Texts["popup_trailer_title"], textAlign:"center"}));
			
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
				className:"font_rixhead_medium", text:title, textAlign:"center"}));
			_comp._bg.add(new W.Span({x:0, y:71, width:"590px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
				className:"font_rixhead_light", text:W.Texts["popup_trailer_title"], textAlign:"center"}));
			
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
			
			_comp._products[i]._title = new W.Span({x:414-394, y:26, width:"440px", height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				className:"font_rixhead_medium cut", text:list[i].title});
			_comp._products[i].add(_comp._products[i]._title);
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
		}else{
			_comp.buttons.focus();
		}
	};
	
	function unFocus(){
		if(isList){
			_comp._products[page * 3 + index]._foc.setStyle({display:"none"});
			_comp._products[page * 3 + index]._title.setStyle({textColor:"rgba(255,255,255,0.75)"});
		}else{
			_comp.buttons.unFocus();
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SubscribedSelectPopup onStart");
    		list = _param.list;
    		title = _param.title;
    		
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
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:page * 3 + index});
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