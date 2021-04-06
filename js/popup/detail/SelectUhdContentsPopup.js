/**
 * popup/SelectUhdContentsPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("SelectUhdContentsPopup");
	var _this;
	var _comp;
	var index;
	var yIndex;
	var bIndex;
	var sIndex;
	var list;
	
	function create(){
		_comp.add(new W.Span({x:426-396, y:174-144, width:"428px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_select_contents_title"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:426-396, y:231-144, width:"428px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));	
		
		_comp.add(new W.Span({x:426-396, y:260-144, width:"428px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_select_contents_uhd_guide1"], textAlign:"center"}));
		_comp.add(new W.Span({x:426-396, y:260-144 + 24, width:"428px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_select_contents_uhd_guide2"], textAlign:"center"}));
		
		_comp._list = [];
		for(var i=0; i < 4; i++){
			var title = "";
			var time = "";
			W.log.info(list);
			if(list[i]){
				title = list[i].resolution ? list[i].resolution : "";
				if(list[i].isLifetime){
					title += " " + W.Texts["popup_zzim_option_lifetime"]
				}
				if(list[i].assetGroup != "010"){
					title += " " + util.getAssetGroupCode(list[i]);
				}
				
				if(list[i].purchase){
					var eDate = new Date(list[i].purchase.expiresAt);
					time = (eDate.getMonth()+1) + W.Texts["unit_month"] + " ";
					time += eDate.getDate() + W.Texts["unit_date"] + " ";
					time += util.changeDigit(eDate.getHours(),2)+":"+util.changeDigit(eDate.getMinutes(),2);
					time = W.Texts["until"].replace("@until@", time);
				}else{
					if(list[i].rentalPeriod.unit == "D"){
						if(list[i].rentalPeriod.value == 999){
							time = W.Texts["detail_rental_duration_lifetime"];
						}else{
							time = W.Texts["detail_rental_duration"].replace("@date@", list[i].rentalPeriod.value);
						}
	        		}else if(list[i].rentalPeriod.unit == "M"){
						if(list[i].rentalPeriod.value == 999){
							time = W.Texts["detail_rental_duration_lifetime"];
						}else{
							time = W.Texts["detail_rental_duration2"].replace("@month@", list[i].rentalPeriod.value);
						}
	        		}
				}
			}
			
			
			
			if(list[i]){
				_comp._list[i] = new W.Div({x:425-396 + (219 * (i%2)), y:325-144 + (i > 1 ? 85:0), width:"211px", height:"72px"});
				_comp.add(_comp._list[i]);
				_comp._list[i].add(new W.Image({x:1, y:1, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
				_comp._list[i]._foc = new W.Image({x:0, y:0, width:"211px", height:"72px", src:"img/box_popup_w209_f.png", display:i==index ? "block" : "none"});
				_comp._list[i].add(_comp._list[i]._foc);
				_comp._list[i].add(new W.Image({x:331-316, y:366-341, width:"22px", height:"22px", src:"img/radio2_n.png"}));
				_comp._list[i]._selected = new W.Image({x:331-316, y:366-341, width:"22px", height:"22px", src:"img/radio_f.png", display:i==sIndex ? "block" : "none"});
				_comp._list[i].add(_comp._list[i]._selected);
				
				_comp._list[i]._name = new W.Span({x:360-316, y:17, width:"150px", height:"20px", "font-size":"18px", 
					className:"font_rixhead_light cut", text:title, 
					textColor: i==index ? "rgb(255,255,255)" : "rgb(181,181,181)"});
				_comp._list[i].add(_comp._list[i]._name);
				_comp._list[i]._date = new W.Span({x:360-316, y:41, width:"150px", height:"17px", "font-size":"15px", 
					className:"font_rixhead_light", text:time, textColor: "rgb(181,181,181)"});
				_comp._list[i].add(_comp._list[i]._date);
			}else{
				_comp._list[i] = new W.Div({x:425-396 + (219 * (i%2)), y:325-144 + (i > 1 ? 85:0), width:"211px", height:"72px", opacity:0.5});
				_comp.add(_comp._list[i]);
				_comp._list[i].add(new W.Image({x:1, y:1, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
			}
		}

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(504-396, 516-144, W.Texts["play"], 133);
		_comp.btns[1] = buttonComp.create(645-396, 516-144, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
	};
	
	var focus = function(){
		if(yIndex == 0){
			_comp._list[index]._foc.setStyle({display:"block"});
			_comp._list[index]._name.setStyle({textColor:"rgb(255,255,255)"});
		}else{
			_comp.btns[bIndex].focus();
		}
	};
	
	var unFocus = function(){
		if(yIndex == 0){
			_comp._list[index]._foc.setStyle({display:"none"});
			_comp._list[index]._name.setStyle({textColor:"rgb(181,181,181)"});
		}else{
			_comp.btns[bIndex].unFocus();
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SelectUhdContentsPopup onStart");
    		list = [];
    		_this = this;
    		W.log.info(list);
    		
    		for(var i=0; i < _param.list.length; i++){
        		if(util.isWatchable(_param.list[i]) || (_param.listProduct && _param.listProduct[i] && _param.listProduct[i].listPrice == 0)){
        			list.push(_param.list[i]);
        		}
    		}

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:396, y:144, width:"488px", height:"433px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		index = 0;
    		yIndex = 0;
    		bIndex = 0;
    		sIndex = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("SelectUhdContentsPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SelectUhdContentsPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				_comp._list[sIndex]._selected.setStyle({display:"none"});
    				sIndex = index;
    				_comp._list[sIndex]._selected.setStyle({display:"block"});
    				
    				unFocus();
    				bIndex = 0;
    				yIndex = 1;
    				focus();
    			}else{
    				if(bIndex == 0){
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, asset:list[sIndex]});
    				}else{
        				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				unFocus();
    				index = (--index + 4) % 4;
    				if(!list[index]){
    					index = list.length - 1;
    					if(index > 3) index = 3;
    				}
    				focus();
    			}else{
    				unFocus();
    				bIndex = (--bIndex + 2) % 2;
    				focus();
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 0){
    				unFocus();
    				index = (++index) % 4;
    				if(!list[index]){
    					index = 0;
    				}
    				focus();
    			}else{
    				unFocus();
    				bIndex = (++bIndex) % 2;
    				focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				unFocus();
    				if(index < 2){
    					index += 2;
    					if(!list[index]){
        					index -= 2;
        					yIndex++;
    					}
    				}else{
    					yIndex++;
    				}
    				focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 0){
    				if(index > 1){
        				unFocus();
        				index -= 2;
        				focus();
    				}
    			}else{
    				unFocus();
    				yIndex--;
    				focus();
    			}
    			break;
    		}
    	}
    });
});