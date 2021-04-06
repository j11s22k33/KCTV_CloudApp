/**
 * popup/SmartDeviceRegistPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("SmartDeviceRegistPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var confirmNo = "";
	var step = 1;

	var sdpDataManager = W.getModule("manager/SdpDataManager");
	
	function create(){
		_comp.add(new W.Span({x:449-419, y:223-194, width:"383px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_smart_device_regist_title"], textAlign:"center"}));
		_comp.add(new W.Div({x:449-419, y:279-194, width:"383px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		_comp._step1 = new W.Div({x:0, y:0, width:"443px", height:"331px"});
		_comp.add(_comp._step1);
		var guide1 = W.Texts["popup_smart_device_regist_guide1"].split("^");
		_comp._step1.add(new W.Span({x:449-419, y:309-194, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide1[0], textAlign:"center"}));
		_comp._step1.add(new W.Span({x:449-419, y:309-194+24, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide1[1], textAlign:"center"}));
		var guide2 = W.Texts["popup_smart_device_regist_guide2"].split("^");
		_comp._step1.add(new W.Span({x:449-419, y:309-194+48, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide2[0], textAlign:"center"}));
		_comp._step1.add(new W.Span({x:449-419, y:309-194+72, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:guide2[1], textAlign:"center"}));
		_comp._step1.add(new W.Span({x:449-419, y:414-194, width:"383px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_smart_device_regist_guide3"], textAlign:"center"}));
		
		_comp._step1.btns = [];
		_comp._step1._btns = [];
		_comp._step1.btns[0] = buttonComp.create(503-419, 464-194, W.Texts["popup_smart_device_regist_button"], 133);
		_comp._step1.btns[1] = buttonComp.create(644-419, 464-194, W.Texts["close"], 133);
		_comp._step1._btns[0] = _comp._step1.btns[0].getComp();
		_comp._step1._btns[1] = _comp._step1.btns[1].getComp();
		_comp._step1.add(_comp._step1._btns[0]);
		_comp._step1.add(_comp._step1._btns[1]);
		_comp._step1.btns[0].focus();
		
		_comp._step2 = new W.Div({x:0, y:0, width:"443px", height:"331px", display:"none"});
		_comp.add(_comp._step2);
		_comp._step2.add(new W.Span({x:449-419, y:309-194, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_smart_device_regist_guide4"], textAlign:"center"}));
		_comp._step2.add(new W.Span({x:449-419, y:309-194+24, width:"383px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:W.Texts["popup_smart_device_regist_guide5"], textAlign:"center"}));
		
		_comp._step2.add(new W.Image({x:518-419, y:373-194, width:"244px", height:"56px", src:"img/box_set244_input.png"}));
		
		_comp._step2._num = new W.Span({x:518-419, y:394-194, width:"244px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
			className:"font_rixhead_medium", text:"", textAlign:"center"});
		_comp._step2.add(_comp._step2._num);

		_comp._step2.btns = [];
		_comp._step2._btns = [];
		_comp._step2.btns[0] = buttonComp.create(503-419, 464-194, W.Texts["popup_smart_device_regist_button2"], 133, undefined, undefined, 18);
		_comp._step2.btns[1] = buttonComp.create(644-419, 464-194, W.Texts["close"], 133);
		_comp._step2._btns[0] = _comp._step2.btns[0].getComp();
		_comp._step2._btns[1] = _comp._step2.btns[1].getComp();
		_comp._step2.add(_comp._step2._btns[0]);
		_comp._step2.add(_comp._step2._btns[1]);
		_comp._step2.btns[0].focus();
	};

	function getAutoCode() {
		sdpDataManager.getMobileIssueAuthcode(function(isSuccess, result){
			if(isSuccess) {
				if(result && result.authCode) {
					confirmNo = result.authCode;
					_comp._step2._num.setText(confirmNo);
					_comp._step1.setStyle({display:"none"});
					_comp._step2.setStyle({display:"block"});
					step = 2;

					bIndex = 0;
				}
			} else {
				W.PopupManager.openPopup({
					childComp:_this,
					popupName:"popup/ErrorPopup",
					code: (result && result.error && result.error.code) ? result.error.code : null,
					message : (result && result.error && result.error.message) ? [result.error.message] : null,
					from : "SDP"
				});
			}
		});
	}

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SmartDeviceRegistPopup onStart");
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
    		
    		_comp = new W.Div({x:419, y:194, width:"443px", height:"331px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		confirmNo = "";
    		bIndex = 0;
    		step = 1;
    		create();

    	},
    	onStop: function() {
    		W.log.info("SmartDeviceRegistPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SmartDeviceRegistPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(step == 1){
    				if(bIndex == 0){

						getAutoCode();

    				}else{
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}else{
    				if(bIndex == 0){

						getAutoCode();

    				}else{
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    		case W.KEY.LEFT:
    			if(step == 1){
        			_comp._step1.btns[bIndex].unFocus();
    				bIndex = (++bIndex) % 2;
    				_comp._step1.btns[bIndex].focus();
    			}else{
    				_comp._step2.btns[bIndex].unFocus();
    				bIndex = (++bIndex) % 2;
    				_comp._step2.btns[bIndex].focus();
    			}
    			break;
    		}
    	},
		onPopupClosed : function (popup, desc) {
			W.log.info("onPopupClosed ");
			W.log.info(desc.popupName, desc.action);
			if (desc.popupName == "popup/ErrorPopup") {
				this._state = "start";
				this.setDisplay("");
			}
		}
    });
});