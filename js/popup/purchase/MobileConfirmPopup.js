/**
 * popup/MobileConfirmPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton", "manager/MobilePurchaseDataManager"], function(util, buttonComp, mobilePurchaseDataManager) {
	'use strict';
	W.log.info("MobileConfirmPopup");
	var yIndex = 0;
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var confirmNo = "";
	var timeInterval;
	var countdown = 0;
	
	function create(){
		_comp.add(new W.Span({x:30, y:30, width:"415px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_mobile_confirm_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:30, y:86, width:"415px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		_comp._guide = new W.Div({x:30, y:111, width:"415px", height:"50px"});
		_comp.add(_comp._guide);
		var guide1 = W.Texts["popup_mobile_confirm_guide1"].split("^");
		_comp._guide.add(new W.Span({x:0, y:0, width:"415px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide1[0], textAlign:"center"}));
		_comp._guide.add(new W.Span({x:0, y:24, width:"415px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide1[1], textAlign:"center"}));
		
		var guide2 = W.Texts["popup_mobile_confirm_guide2"].split("^");
		_comp._guide2 = new W.Div({x:30, y:111, width:"415px", height:"50px", display:"none"});
		_comp.add(_comp._guide2);
		_comp._guide2.add(new W.Span({x:0, y:0, width:"415px", height:"20px", textColor:"rgba(227,84,46,0.9)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide2[0], textAlign:"center"}));
		_comp._guide2.add(new W.Span({x:0, y:24, width:"415px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide2[1], textAlign:"center"}));
		
		var _time = new W.Div({x:30, y:165, width:"415px", height:"24px", textAlign:"center"});
		_comp.add(_time);
		_time.add(new W.Span({position:"relative", y:0, height:"17px", textColor:"rgb(181,181,181)", "font-size":"15px", 
			className:"font_rixhead_light", text:W.Texts["remain_tile"] + " "}));
		_comp._min = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(181,181,181)", "font-size":"22px", 
			className:"font_rixhead_bold", text:"3"});
		_time.add(_comp._min);
		_comp._unit1 = new W.Span({position:"relative", y:0, height:"17px", textColor:"rgb(181,181,181)", "font-size":"15px", 
			className:"font_rixhead_light", text:W.Texts["minute"] + " "});
		_time.add(_comp._unit1);
		_comp._sec = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(181,181,181)", "font-size":"22px", 
			className:"font_rixhead_bold", text:"3", display:"none"});
		_time.add(_comp._sec);
		_comp._unit2 = new W.Span({position:"relative", y:0, height:"17px", textColor:"rgb(181,181,181)", "font-size":"15px", 
			className:"font_rixhead_light", text:W.Texts["second"], display:"none"});
		_time.add(_comp._unit2);
		
		_comp.add(new W.Image({x:115, y:207, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		_comp._foc = new W.Image({x:114, y:206, width:"246px", height:"58px", src:"img/box_set244_f.png"});
		_comp.add(_comp._foc);
		
		_comp._num = new W.Span({x:115, y:225, width:"244px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp.add(_comp._num);
		
		_comp.btns = [];
		_comp._btns = [];
		_comp.btns[0] = buttonComp.create(30, 298, W.Texts["popup_mobile_confirm_button"], 133);
		_comp.btns[1] = buttonComp.create(171, 298, W.Texts["ok"], 133);
		_comp.btns[2] = buttonComp.create(312, 298, W.Texts["cancel"], 133);
		_comp._btns[0] = _comp.btns[0].getComp();
		_comp._btns[1] = _comp.btns[1].getComp();
		_comp._btns[2] = _comp.btns[2].getComp();
		_comp._btns[1].setStyle({opacity:0.4});
		_comp.add(_comp._btns[0]);
		_comp.add(_comp._btns[1]);
		_comp.add(_comp._btns[2]);
	};
	
	var checkComplete = function(){
		if(confirmNo.length == 6){
			_comp._btns[1].setStyle({opacity:1});
			return true;
		}else{
			_comp._btns[1].setStyle({opacity:0.4});
			return false;
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("MobileConfirmPopup onStart");
    		desc = _param;
    		_this = this;
    		
    		W.log.info("type ======== " + desc.type);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:403, y:181, width:"475px", height:"359px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		confirmNo = "";
    		yIndex = 0;
    		bIndex = 0;
    		countdown = 0;
    		create();
    		if(!util.isExistScene("PurchaseVodScene")){
    			W.CloudManager.addNumericKey();
    		}
    		
    		timeInterval = setInterval(function(){
    			countdown++;
    			
    			var min = Math.floor((180 - countdown) / 60);
    			_comp._min.setText(min);
    			var sec = (180 - countdown) % 60;
    			_comp._sec.setText(sec);
    			
    			if(countdown == 180){
    				clearInterval(timeInterval);
    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
    			}else{
    				if(countdown == 1){
    					_comp._min.setStyle({display:"inline"});
        				_comp._unit1.setStyle({display:"inline"});
        				_comp._sec.setStyle({display:"inline"});
        				_comp._unit2.setStyle({display:"inline"});
        			}
    				
    				if(countdown == 121){
        				_comp._min.setStyle({display:"none"});
        				_comp._unit1.setStyle({display:"none"});
        			}
    			}
    		}, 1000);
    	},
    	onStop: function() {
    		W.log.info("MobileConfirmPopup onStop");
    		clearInterval(timeInterval);
    		if(!util.isExistScene("PurchaseVodScene")){
    			W.CloudManager.delNumericKey();
    		}
    	},
    	onKeyPressed : function(event) {
    		W.log.info("MobileConfirmPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
    				if(confirmNo.length == 6){
        				_comp._foc.setStyle({display:"none"});
        				yIndex = 1;
        				bIndex = 1;
        				_comp.btns[bIndex].focus();
    				}else{
        				_comp._guide.setStyle({display:"none"});
        				_comp._guide2.setStyle({display:"block"});
    				}
    			}else{
    				if(bIndex == 0){
    					mobilePurchaseDataManager.requestCertification(function(result, data){
        					countdown = 0;
        				}, desc.reqData);
						_comp.btns[bIndex].unFocus();
        				yIndex = 0;
        				confirmNo = "";
        				_comp._num.setText(confirmNo);
        				_comp._foc.setStyle({display:"block"});
        				_comp._guide.setStyle({display:"block"});
        				_comp._guide2.setStyle({display:"none"});
    				}else if(bIndex == 1){
    					var reqData = {};
    					reqData.LGD_AMOUNT = desc.reqData.LGD_AMOUNT;
    					reqData.LGD_TID = desc.mobilePurchaseInfo.LGD_TID;
    					reqData.LGD_AUTHNUMBER = confirmNo;
    					
    					mobilePurchaseDataManager.requestOk(function(result, data){
    						W.PopupManager.closePopup(_this, {
            					action:W.PopupManager.ACTION_OK,
            					result:result,
            					data:data
            				});
        				}, reqData);
    				}else{
    					clearInterval(timeInterval);
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(yIndex == 1){
    				_comp.btns[bIndex].unFocus();
    				bIndex = (++bIndex) % 3;
    				if(bIndex == 1 && !checkComplete()){
    					bIndex = (++bIndex) % 3;
    				}
    				_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.LEFT:
    			if(yIndex == 0){
    				confirmNo = confirmNo.substr(0, confirmNo.length-1);
    				_comp._num.setText(confirmNo);
    				checkComplete();
    			}else{
    				_comp.btns[bIndex].unFocus();
    				bIndex = (--bIndex + 3) % 3;
    				if(bIndex == 1 && !checkComplete()){
    					bIndex = (--bIndex + 3) % 3;
    				}
    				_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 1){
    				_comp.btns[bIndex].unFocus();
    				bIndex = 0;
    				yIndex = 0;
    				_comp._foc.setStyle({display:"block"});
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
    				_comp._foc.setStyle({display:"none"});
    				bIndex = 0;
    				yIndex = 1;
    				_comp.btns[bIndex].focus();
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
    				confirmNo += String(event.keyCode - 48);
    				_comp._num.setText(confirmNo);
    				if(confirmNo.length == 6){
    					_comp._foc.setStyle({display:"none"});
    					checkComplete();
    					yIndex = 1;
        				bIndex = 1;
        				_comp.btns[bIndex].focus();
    				}
    			}
    			break;
    		}
    	}
    });
});