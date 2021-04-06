/**
 * popup/ResolutionConfirmPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("ResolutionConfirmPopup");
	var isList = true;
	var index = 0;
	var list;
	var _this;
	var _comp;
	var type;
	var title;
	var isCount;
	var countIdx = 10;
	var countInterval;

	function create(){
		_comp.add(new W.Div({x:360, y:206, width:"560px", height:"309px", className:"popup_comp_color popup_comp_border"}));
		_comp.add(new W.Div({x:390, y:291, width:"500px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp._countArea = new W.Div({x:390, y:292, width:500, height:95, display:"-webkit-flex", "-webkit-flex-direction":"column", "-webkit-align-items":"center","-webkit-justify-content":"center"});

		_comp._countArea.add(new W.Div({position:"relative", height:24, "white-space":"pre-line", width:"500px", text:W.Texts["popup_resolution_confirm_guide7"], textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px"}));
		_comp._countArea.add(new W.Div({position:"relative", height:24, "white-space":"pre-line", width:"500px", text:W.Texts["popup_resolution_confirm_guide8"], textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadM", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px"}));

		_comp._countArea._progressBg = new W.Div({x:426-390, y:398-292, width:395, height:3, color:"rgba(180,186,196,0.25)"});
		_comp._countArea.add(_comp._countArea._progressBg);
		_comp._countArea._progress = new W.Div({right:"69px", y:398-292, width:395, height:3, color:"rgba(254,252,247,1)"});
		_comp._countArea.add(_comp._countArea._progress);
		_comp._countArea._count = new W.Div({x:832-390, y:393-294, width:"50px", text:"10초", textColor:"rgba(181,181,181,1)", fontFamily:"RixHeadL", "font-size":"16px", "letter-spacing":"-0.8px"});
		_comp._countArea.add(_comp._countArea._count);

		_comp.add(_comp._countArea);

		_comp._title = new W.Span({x:360, y:233, width:"560px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px",
			className:"font_rixhead_medium", text:W.Texts["popup_resolution_confirm_title3"], textAlign:"center", "letter-spacing":"-1.7px"});
		_comp.add(_comp._title);


		_comp.btn = [];
		_comp.btn[0] = buttonComp.create(504, 454, W.Texts["ok"], 133);
		_comp.btn[1] = buttonComp.create(645, 454, W.Texts["cancel"], 133);

		_comp.add(_comp.btn[0].getComp());
		_comp.add(_comp.btn[1].getComp());

		_comp.btn[0].focus();

		setCount();

	};
	
	function focus(){
	};

	function setCount() {
		isCount = true;
		_comp._countArea._progress.setStyle({width:395});
		_comp._countArea._count.setText("10" + W.Texts["second"]);
		countIdx = 10;
		countInterval = setInterval(function(){
			if(countIdx == 1) {
				clearInterval(countInterval);
				countInterval = undefined;
				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
			} else {
				countIdx--;
				_comp._countArea._progress.setStyle({width:(395/10)*countIdx});
				_comp._countArea._count.setText(countIdx+W.Texts["second"]);
			}

		}, 1000);

	}

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ResolutionConfirmPopup onStart");
    		list = _param.list;
    		type = _param.type;
    		title = _param.title;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size popup_bg_color"});
    		this.add(_comp);
			create();
    	},
    	onStop: function() {
    		W.log.info("ResolutionConfirmPopup onStop");
    		index = 0;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("ResolutionConfirmPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
				if(index == 0){
					if(countInterval) {
						clearInterval(countInterval);
						countInterval = undefined;
					}
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
				}else{
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
				}
    			break;
    		case W.KEY.RIGHT:
				_comp.btn[index].unFocus();
				index = index+1 > 1 ? 0 : index+1;
				_comp.btn[index].focus();
    			break;
    		case W.KEY.LEFT:
				_comp.btn[index].unFocus();
				index = index-1 < 0 ? 1 : index-1;
				_comp.btn[index].focus();
    			break;
    		case W.KEY.UP:
    			break;
    		case W.KEY.DOWN:
    			break;
    		}
    	}
    });
});