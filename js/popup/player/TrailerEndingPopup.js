/**
 * popup/TrailerEndingPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("TrailerEndingPopup");
	var index = 0;
	var _this;
	var _comp;
	var title;
	var isForce;
	var isPurchased;
	var isDefaultChTune;
	
	function create(){
		_comp.add(new W.Image({x:0, y:0, width:"1280px", height:"368px", src:"img/bg_player.png"}));
		_comp.add(new W.Span({x:0, y:195, width:"1280px", height:"37px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:title, textAlign:"center"}));
		_comp.add(new W.Span({x:0, y:241, width:"1280px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
			className:"font_rixhead_light", text:W.Texts["popup_trailer_finish_title"], textAlign:"center"}));
		
		_comp.btns = [];
		_comp.btnsType = [];
		
		if(isPurchased){
			_comp.btns[0] = buttonComp.create(570, 289, W.Texts["remote_control_button_12"], 66);
			_comp.btnsType[0] = "FINISH";
			_comp.btns[1] = buttonComp.create(678, 289, W.Texts["cancel"], 66);
			_comp.btnsType[1] = "CLOSE";
			_comp.add(_comp.btns[0].getComp());
			_comp.add(_comp.btns[1].getComp());
		}else{
			if(W.StbConfig.blockPurchase){
				_comp.btns[0] = buttonComp.create(624, 289, W.Texts["remote_control_button_12"], 66);
				_comp.btnsType[0] = "FINISH";
				_comp.btns[1] = buttonComp.create(698, 289, W.Texts["cancel"], 66);
				_comp.btnsType[1] = "CLOSE";
				_comp.add(_comp.btns[0].getComp());
				_comp.add(_comp.btns[1].getComp());
			}else{
				_comp.btns[0] = buttonComp.create(516, 289, W.Texts["purchase_vod"], 100);
				_comp.btnsType[0] = "PURCHASE";
				_comp.btns[1] = buttonComp.create(624, 289, W.Texts["remote_control_button_12"], 66);
				_comp.btnsType[1] = "FINISH";
				_comp.btns[2] = buttonComp.create(698, 289, W.Texts["cancel"], 66);
				_comp.btnsType[2] = "CLOSE";
				_comp.add(_comp.btns[0].getComp());
				_comp.add(_comp.btns[1].getComp());
				_comp.add(_comp.btns[2].getComp());
			}
			
		}
	};
	
	var focus = function(){
		for(var i=0; i < _comp.btns.length; i++){
			if(i == index){
				_comp.btns[i].focus();
			}else{
				_comp.btns[i].unFocus();
			}
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("TrailerEndingPopup onStart");
    		title = _param.title;
    		isForce = _param.isForce;
    		isPurchased = _param.isPurchased;
    		isDefaultChTune = _param.isDefaultChTune;
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		_comp = new W.Div({x:0, y:352, width:"1280px", height:"368px"});
    		this.add(_comp);
    		index = 0;
    		create();
    		focus();
    	},
    	onStop: function() {
    		W.log.info("TrailerEndingPopup onStop");
    		index = 0;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("TrailerEndingPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, idx:index, isForce:isForce, btnType:_comp.btnsType[index], isDefaultChTune:isDefaultChTune});
    			break;
    		case W.KEY.RIGHT:
    			index = (++index) % _comp.btns.length;
    			focus();
    			break;
    		case W.KEY.LEFT:
    			index = (--index + _comp.btns.length) % _comp.btns.length;
    			focus();
    			break;
    		}
    	}
    });
});