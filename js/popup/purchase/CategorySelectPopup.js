/**
 * popup/CategorySelectPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("CategorySelectPopup");
	var pIdx = 0;
	var bIdx = 0;
	var sIdx = 0;
	var _comp;
	var list;
	var isCoupon;
	var title;
	var assetList;
	var isList;
	var totalPage = 0;
	
	function create(){
		_comp.buttons = [];
		
		if(list.length > 4){
			_comp.add(new W.Div({x:355, y:154, width:"570px", height:"413px", className:"popup_comp_color popup_comp_border"}));
			_comp.add(new W.Span({x:390, y:185, width:"500px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium cut", text:title, textAlign:"center"}));
			_comp.add(new W.Span({x:355, y:230, width:"570px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
				className:"font_rixhead_light", text:W.Texts["product_select_guide"], textAlign:"center"}));
			_comp.add(new W.Div({x:426, y:264, width:"428px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp.add(new W.Div({x:426, y:470, width:"428px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp._arr_l = new W.Image({x:370, y:347, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
			_comp._arr_r = new W.Image({x:869, y:347, width:"41px", height:"41px", src:"img/arrow_navi_r.png"});
			_comp.add(_comp._arr_l);
			_comp.add(_comp._arr_r);
			
			var _page_area = new W.Div({x:794, y:481, width:"60px", height:"18px", textAlign:"right"});
			_comp.add(_page_area);
			_comp._page = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgb(254,254,254)", "font-size":"16px", 
				className:"font_rixhead_bold", text:"01"});
			_page_area.add(_comp._page);
			_comp._total = new W.Span({position:"relative", y:0, height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
				className:"font_rixhead_bold", text:" / " + (totalPage > 9 ? "" : "0") + totalPage});
			_page_area.add(_comp._total);
			
			_comp.buttons[0] = buttonComp.create(504, 506, W.Texts["ok"], 133);
			_comp.buttons[1] = buttonComp.create(645, 506, W.Texts["cancel"], 133);
			
			_comp._info_area = new W.Div({x:425, y:289, width:"430px", height:"157px", overflow:"hidden"});
			_comp.add(_comp._info_area);
			_comp._info = new W.Div({x:0, y:0, width:"430px", height:"157px"});
			_comp._info_area.add(_comp._info);
		}else{
			_comp.add(new W.Div({x:396, y:167, width:"488px", height:"387px", className:"popup_comp_color popup_comp_border"}));
			_comp.add(new W.Span({x:440, y:198, width:"400px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
				className:"font_rixhead_medium cut", text:title, textAlign:"center"}));
			_comp.add(new W.Span({x:396, y:243, width:"488px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
				className:"font_rixhead_light", text:W.Texts["product_select_guide"], textAlign:"center"}));
			_comp.add(new W.Div({x:426, y:277, width:"428px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			
			_comp.buttons[0] = buttonComp.create(504, 493, W.Texts["ok"], 133);
			_comp.buttons[1] = buttonComp.create(645, 493, W.Texts["cancel"], 133);
			
			_comp._info_area = new W.Div({x:425, y:302, width:"430px", height:"157px"});
			_comp.add(_comp._info_area);
			_comp._info = new W.Div({x:0, y:0, width:"430px", height:"157px"});
			_comp._info_area.add(_comp._info);
		}
		
		_comp.add(_comp.buttons[0].getComp());
		_comp.add(_comp.buttons[1].getComp());
		
		_comp._products = [];
		var x=0; 
		var y=0;
		var xPos = [0, 219, 0, 219];
		for(var i=0; i < list.length; i++){
			if(i%4 > 1){
				y = 85
			}else{
				y = 0;
			}
			var p = Math.floor(i/4);
			
			x = xPos[i%4] + p * 438;

			_comp._products[i] = new W.Div({x:x, y:y, width:"211px", height:"72px"});
			_comp._info.add(_comp._products[i]);
			
			_comp._products[i].add(new W.Image({x:1, y:1, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
			_comp._products[i]._foc = new W.Image({x:0, y:0, width:"211px", height:"72px", src:"img/box_popup_w209_f.png", display:"none"});
			_comp._products[i].add(_comp._products[i]._foc);
			
			_comp._products[i].add(new W.Image({x:15, y:25, width:"22px", height:"22px", src:"img/radio2_n.png"}));
			_comp._products[i]._sel = new W.Image({x:15, y:25, width:"22px", height:"22px", src:"img/radio_f.png", display:i==0 ? "block" : "none"});
			_comp._products[i].add(_comp._products[i]._sel);
			
			var textArray = util.geTxtArray(isCoupon ? list[i].ItemName : list[i].title, "RixHeadM", 18, 130, 2);
			W.log.info(textArray);
			if(textArray.length > 1){
				_comp._products[i]._title = new W.Span({x:44, y:16, width:"160px", height:"20px", textColor:"rgba(255,255,255,0.75)", "font-size":"18px", 
					className:"font_rixhead_medium", text:textArray[0]});
				_comp._products[i].add(_comp._products[i]._title);
				_comp._products[i]._title2 = new W.Span({x:44, y:40, width:"160px", height:"20px", textColor:"rgba(255,255,255,0.75)", "font-size":"18px", 
					className:"font_rixhead_medium cut", text:textArray[1]});
				_comp._products[i].add(_comp._products[i]._title2);
			}else{
				_comp._products[i]._title = new W.Span({x:44, y:27, width:"160px", height:"20px", textColor:"rgba(255,255,255,0.75)", "font-size":"18px", 
					className:"font_rixhead_medium", text:textArray[0]});
				_comp._products[i].add(_comp._products[i]._title);
				_comp._products[i]._title2 = new W.Span({x:44, y:26, width:"160px", height:"20px", textColor:"rgba(255,255,255,0.75)", "font-size":"18px", 
					className:"font_rixhead_medium", text:""});
				_comp._products[i].add(_comp._products[i]._title2);
			}
		}
	};
	
	function focus(){
		if(isList){
			if(totalPage > 1){
				var p = Math.floor(pIdx / 4);
				_comp._page.setText(W.Util.changeDigit(p+1, 2));
				_comp._info.setStyle({x:- p * 438});
				
				if(p == 0){
					_comp._arr_l.setStyle({display:"none"});
					_comp._arr_r.setStyle({display:"block"});
            	}else if(p == totalPage - 1){
            		_comp._arr_l.setStyle({display:"block"});
            		_comp._arr_r.setStyle({display:"none"});
            	}else{
            		_comp._arr_l.setStyle({display:"block"});
            		_comp._arr_r.setStyle({display:"block"});
            	}
			}
			_comp._products[pIdx]._foc.setStyle({display:"block"});
			_comp._products[pIdx]._title.setStyle({textColor:"rgba(255,255,255,1)"});
			_comp._products[pIdx]._title2.setStyle({textColor:"rgba(255,255,255,1)"});
		}else{
			_comp.buttons[bIdx].focus();
		}
	};
	
	function unFocus(){
		if(isList){
			_comp._products[pIdx]._foc.setStyle({display:"none"});
			_comp._products[pIdx]._title.setStyle({textColor:"rgba(255,255,255,0.75)"});
			_comp._products[pIdx]._title2.setStyle({textColor:"rgba(255,255,255,0.75)"});
		}else{
			_comp.buttons[bIdx].unFocus();
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("CategorySelectPopup onStart");
    		list = _param.list;
    		title = _param.title;
    		if(_comp){
    			this.remove(_comp);
    		}
    		if(_param.type && _param.type == "coupon"){
    			isCoupon = true;
    		}
    		pIdx = 0;
    		bIdx = 0;
    		sIdx = 0;
    		isList = true;
    		totalPage = Math.ceil(list.length/4);
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size popup_bg_color"});
    		this.add(_comp);
    		create();
    		focus();
    	},
    	onStop: function() {
    		W.log.info("CategorySelectPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("CategorySelectPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(isList){
    				_comp._products[sIdx]._sel.setStyle({display:"none"});
    				sIdx = pIdx;
    				_comp._products[sIdx]._sel.setStyle({display:"block"});
    				unFocus();
    				isList = false;
    				bIdx = 0;
    				focus();
    			}else{
    				if(bIdx == 0){
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, category:list[sIdx]});
    				}else{
        				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
				unFocus();
    			if(isList){
	    			if(pIdx % 4 == 0 || pIdx % 4 == 2){
	    				if(pIdx + 1 < list.length){
	    					pIdx++;
	    				}else{
	    					if(pIdx % 4 > 1){
	        					pIdx = 2;
	        				}else{
	        					pIdx = 0;
	        				}
	    				}
	    			}else{
	    				if(pIdx + 3 < list.length){
	    					pIdx += 3;
	    				}else if(pIdx + 1 < list.length){
	    					pIdx++;
	    				}else{
	    					if(pIdx % 4 > 1){
	        					pIdx = 2;
	        				}else{
	        					pIdx = 0;
	        				}
	    				}
	    			}
    			}else{
    				bIdx = bIdx == 0 ? 1 : 0;
    			}
				focus();
    			break;
    		case W.KEY.LEFT:
    			unFocus();
    			if(isList){
	    			if(pIdx % 4 == 0 || pIdx % 4 == 2){
	    				if(pIdx == 0 || pIdx == 2){
	    					if(list.length % 4 == 0){
	    						pIdx = (totalPage-1) * 4 + (pIdx % 4 > 1 ? 3 : 1);
	    					}else if(list.length % 4 == 3){
	    						if(pIdx == 0){
	    							pIdx = (totalPage-1) * 4 + 1;
	    						}else{
	    							pIdx = list.length - 1;
	    						}
	    					}else{
	    						pIdx = list.length - 1;
	    					}
	    				}else{
	    					pIdx -= 3;
	    				}
	    			}else{
	    				pIdx--;
	    			}
    			}else{
    				bIdx = bIdx == 0 ? 1 : 0;
    			}
				focus();
    			break;
    		case W.KEY.UP:
				unFocus();
    			if(isList){
    				if(pIdx % 4 > 1){
    					pIdx -= 2;
    				}
    			}else{
    				isList = true;
    			}
				focus();
    			break;
    		case W.KEY.DOWN:
				unFocus();
    			if(isList){
    				if(pIdx % 4 > 1){
    					bIdx = 0;
        				isList = false;
    				}else{
    					if(pIdx + 2 < list.length){
    						pIdx += 2;
    					}else{
    						bIdx = 0;
            				isList = false;
    					}
    				}
    			}
				focus();
    			break;
    		}
    	}
    });
});