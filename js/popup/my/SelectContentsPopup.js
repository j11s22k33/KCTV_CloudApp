/**
 * popup/SelectContentsPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("SelectContentsPopup");
	var _this;
	var _comp;
	var index;
	var yIndex;
	var bIndex;
	var sIndex;
	var desc;
	var isSameApply = false;
	
	function create(){
		_comp.add(new W.Span({x:426-396, y:202-172, width:"428px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_select_contents_title"], textAlign:"center"}));
		
		_comp.add(new W.Div({x:426-396, y:259-172, width:"428px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));	
		
		_comp.add(new W.Span({x:426-396, y:285-172, width:"428px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_select_contents_guide1"], textAlign:"center"}));
		
		_comp.add(new W.Image({x:484-396, y:313-172, width:"312px", height:"45px", src:"img/box_set312.png"}));
		_comp._foc = new W.Image({x:483-396, y:312-172, width:"314px", height:"47px", src:"img/box_set312_f.png", display:"none"});
		_comp.add(_comp._foc);
		
		
		
		_comp.add(new W.Image({x:513-396, y:324-172, width:"22px", height:"22px", src:"img/check_n2.png"}));
		_comp._check = new W.Image({x:513-396, y:324-172, width:"22px", height:"22px", src:"img/check__f.png", display:"none"});
		_comp.add(_comp._check);
		_comp._guide = new W.Span({x:541-396, y:327-172, width:"245px", height:"18px", textColor:"rgba(255,255,255,0.5)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_select_contents_guide2"]})
		_comp.add(_comp._guide);
		
		_comp._list = [];
		for(var i=0; i < 2; i++){
			_comp._list[i] = new W.Div({x:425-396 + (219 * i), y:382-172, width:"211px", height:"72px", 
				textColor: i==index ? "rgb(255,255,255)" : "rgb(181,181,181)"});
			_comp.add(_comp._list[i]);
			_comp._list[i].add(new W.Image({x:1, y:1, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
			_comp._list[i]._foc = new W.Image({x:0, y:0, width:"211px", height:"72px", src:"img/box_popup_w209_f.png", display:i==index ? "block" : "none"});
			_comp._list[i].add(_comp._list[i]._foc);
			_comp._list[i].add(new W.Image({x:331-316, y:366-341, width:"22px", height:"22px", src:"img/radio2_n.png"}));
			_comp._list[i]._selected = new W.Image({x:331-316, y:366-341, width:"22px", height:"22px", src:"img/radio_f.png", display:i==sIndex ? "block" : "none"});
			_comp._list[i].add(_comp._list[i]._selected);
			
			_comp._list[i].add(new W.Span({x:360-316, y:26, width:"150px", height:"20px", "font-size":"18px", 
				className:"font_rixhead_light", text:i == 0 ? W.Texts["closed_caption"] : W.Texts["dubbing"]}));
		}

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(504-396, 488-172, W.Texts["play"], 133);
		_comp.btns[1] = buttonComp.create(645-396, 488-172, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
	};
	
	var focus = function(){
		if(yIndex == 0){
			_comp._foc.setStyle({display:"block"});
			_comp._guide.setStyle({textColor:"rgba(255,255,255,0.75)"});
		}else if(yIndex == 1){
			_comp._list[index]._foc.setStyle({display:"block"});
			_comp._list[index].setStyle({textColor:"rgb(255,255,255)"});
		}else{
			_comp.btns[bIndex].focus();
		}
	};
	
	var unFocus = function(){
		if(yIndex == 0){
			_comp._foc.setStyle({display:"none"});
			_comp._guide.setStyle({textColor:"rgba(255,255,255,0.5)"});
		}else if(yIndex == 1){
			_comp._list[index]._foc.setStyle({display:"none"});
			_comp._list[index].setStyle({textColor:"rgb(181,181,181)"});
		}else{
			_comp.btns[bIndex].unFocus();
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SelectContentsPopup onStart");
    		desc = _param.desc;
    		_this = this;

    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:396, y:172, width:"488px", height:"377px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		isSameApply = false;
    		index = 0;
    		yIndex = 1;
    		bIndex = 0;
    		sIndex = 0;
    		create();
    	},
    	onStop: function() {
    		W.log.info("SelectContentsPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SelectContentsPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				isSameApply = isSameApply ? false : true;
    				_comp._check.setStyle({display: isSameApply ? "block" : "none"});
    			}else if(yIndex == 1){
    				_comp._list[sIndex]._selected.setStyle({display:"none"});
    				sIndex = index;
    				_comp._list[sIndex]._selected.setStyle({display:"block"});
    				
    				unFocus();
    				bIndex = 0;
    				yIndex = 2;
    				focus();
    			}else{
    				if(bIndex == 0){
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, isSameApply:isSameApply});
        			}else{
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
        			}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 1){
    				unFocus();
    				index = (--index + 2) % 2;
    				focus();
    			}else if(yIndex == 2){
    				unFocus();
    				bIndex = (--bIndex + 2) % 2;
    				focus();
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1){
    				unFocus();
    				index = (++index) % 2;
    				focus();
    			}else if(yIndex == 2){
    				unFocus();
    				bIndex = (++bIndex) % 2;
    				focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex < 2){
    				unFocus();
    				yIndex++;
    				focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex > 0){
    				unFocus();
    				yIndex--;
    				focus();
    			}
    			break;
    		}
    	}
    });
});