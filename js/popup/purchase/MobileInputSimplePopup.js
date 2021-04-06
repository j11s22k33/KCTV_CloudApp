/**
 * popup/MobileInputSimplePopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("MobileInputSimplePopup");
	var yIndex = 0;
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var phoneTxt = "";
	
	function create(){
		_comp.add(new W.Span({x:30, y:29, width:"415px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium cut", text:W.Texts["popup_mobile_input_simple_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:30, y:85, width:"415px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		_comp.add(new W.Span({x:23, y:111, width:"430px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:W.Texts["popup_mobile_input_simple_guide"], textAlign:"center"}));
		
		_comp.add(new W.Span({x:36, y:171, width:"85px", height:"19px", textColor:"rgba(255,255,255,0.75)", "font-size":"17px", 
			className:"font_rixhead_light", text:W.Texts["mobile_number"]}));

		_comp.add(new W.Image({x:127, y:157, width:"100px", height:"45px", src:"img/box_set100.png"}));
		_comp.add(new W.Image({x:233, y:157, width:"100px", height:"45px", src:"img/box_set100.png"}));
		_comp.add(new W.Image({x:339, y:157, width:"100px", height:"45px", src:"img/box_set100.png"}));

		_comp._phone1 = new W.Span({x:127, y:172, width:"100px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._phone1);
		_comp._phone2 = new W.Span({x:233, y:172, width:"100px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._phone2);
		_comp._phone3 = new W.Span({x:339, y:172, width:"100px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._phone3);

		_comp._foc_phone1 = new W.Image({x:126, y:156, width:"102px", height:"47px", src:"img/box_set100_f.png", display:"none"});
		_comp.add(_comp._foc_phone1);
		_comp._foc_phone2 = new W.Image({x:232, y:156, width:"102px", height:"47px", src:"img/box_set100_f.png", display:"none"});
		_comp.add(_comp._foc_phone2);
		_comp._foc_phone3 = new W.Image({x:338, y:156, width:"102px", height:"47px", src:"img/box_set100_f.png", display:"none"});
		_comp.add(_comp._foc_phone3);

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(101, 237, W.Texts["ok"], 133);
		_comp.btns[1] = buttonComp.create(242, 237, W.Texts["cancel"], 133);
		_comp._btn = _comp.btns[0].getComp();
		_comp._btn.setStyle({opacity:0.4});
		_comp.add(_comp._btn);
		_comp.add(_comp.btns[1].getComp());
		
		focus();
	};

	var checkComplete = function(){
		if(phoneTxt.length > 9){
			_comp._btn.setStyle({opacity:1});
			return true;
		}else{
			_comp._btn.setStyle({opacity:0.4});
			return false;
		}
	};
	
	var focus = function(isBack){
		if(yIndex == 0){
			if(phoneTxt.length < 4){
				_comp._foc_phone1.setStyle({display:"block"});
				_comp._foc_phone2.setStyle({display:"none"});
				_comp._foc_phone3.setStyle({display:"none"});
			}else if(phoneTxt.length < 7){
				_comp._foc_phone1.setStyle({display:"none"});
				_comp._foc_phone2.setStyle({display:"block"});
				_comp._foc_phone3.setStyle({display:"none"});
			}else{
				_comp._foc_phone1.setStyle({display:"none"});
				_comp._foc_phone2.setStyle({display:"none"});
				_comp._foc_phone3.setStyle({display:"block"});
			}
			
			_comp._phone1.setText(phoneTxt.substr(0,3));
			if(phoneTxt.length == 11){
				_comp._phone2.setText(phoneTxt.substr(3,4));
				_comp._phone3.setText(phoneTxt.substr(7,4));
				if(!isBack){
					unFocus();
					yIndex++;
					focus();
				}
			}else{
				_comp._phone2.setText(phoneTxt.substr(3,3));
				_comp._phone3.setText(phoneTxt.substr(6,4));
			}
		}else if(yIndex == 1){
			if(bIndex == 0){
				_comp.btns[0].focus();
				_comp.btns[1].unFocus();
			}else{
				_comp.btns[1].focus();
				_comp.btns[0].unFocus();
			}
		}
		checkComplete();
	};
	
	var unFocus = function(){
		if(yIndex == 0){
			_comp._foc_phone1.setStyle({display:"none"});
			_comp._foc_phone2.setStyle({display:"none"});
			_comp._foc_phone3.setStyle({display:"none"});
		}else if(yIndex == 1){
			_comp.btns[bIndex].unFocus();
		}
	};
	
	
    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("MobileInputSimplePopup onStart");
    		desc = _param.contents;
    		W.log.info(desc);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		_comp = new W.Div({x:403, y:211, width:"475px", height:"298px", className:"popup_comp_color popup_comp_border"});

    		if(!util.isExistScene("PurchaseVodScene")){
    			W.CloudManager.addNumericKey();
    		}
    		this.add(_comp);
    		yIndex = 0;
    		bIndex = 0;
    		phoneTxt = "";
    		
    		create();
    	},
    	onStop: function() {
    		W.log.info("MobileInputSimplePopup onStop");
    		if(!util.isExistScene("PurchaseVodScene")){
    			W.CloudManager.delNumericKey();
    		}
    	},
    	onKeyPressed : function(event) {
    		W.log.info(yIndex + " MobileInputSimplePopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				if(phoneTxt.length >= 10){
    					unFocus();
        				yIndex = 2;
        				focus(true);
    				}
    			}else if(yIndex == 1){
    				W.PopupManager.closePopup(this, {
    					action:bIndex == 0 ? W.PopupManager.ACTION_OK : W.PopupManager.ACTION_CLOSE,
    					phoneNum:phoneTxt
    				});
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1){
    				if(checkComplete()){
    					bIndex = bIndex ? 0 : 1;
    					focus();
    				}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				phoneTxt = phoneTxt.substr(0, phoneTxt.length-1);
    				focus();
    			}else if(yIndex == 1){
    				if(checkComplete()){
    					bIndex = bIndex ? 0 : 1;
    					focus();
    				}
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 1){
    				unFocus();
    				yIndex = 0;
    				focus(true);
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				if(phoneTxt.length >= 10){
    					unFocus();
        				yIndex++;
        				if(checkComplete()){
        					bIndex = 0;
        				}else{
        					bIndex = 1;
        				}
        				focus(true);
    				}
    			}
    			break;
    		case W.KEY.NUM_0:
    		case W.KEY.NUM_1:
    		case W.KEY.NUM_2:
    		case W.KEY.NUM_3:
    		case W.KEY.NUM_4:
    		case W.KEY.NUM_5:
    		case W.KEY.NUM_6:
    		case W.KEY.NUM_7:
    		case W.KEY.NUM_8:
    		case W.KEY.NUM_9:
    			if(yIndex == 0){
    				phoneTxt += String(event.keyCode - 48);
    				focus();
    			}
    			break;
    		}
    		checkComplete();
    	}
    });
});