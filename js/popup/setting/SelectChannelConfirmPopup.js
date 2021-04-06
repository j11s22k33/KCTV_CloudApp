/**
 * popup/SelectChannelConfirmPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("SelectChannelConfirmPopup");
	var isList = true;
	var index = 1;
	var page = 0;
	var list;
	var _this;
	var _comp;
	var _list;
	var type;
	var title;
	var isMore = false;
	var totalPage = 0;
	
	function create(){
		W.log.info(list);
		totalPage = Math.ceil(list.length/4);
		var textL = W.Texts["popup_select_channel_confirm_title"];
		_comp.add(new W.Div({x:368, y:135, width:"544px", height:"450px", className:"popup_comp_color popup_comp_border"}));
		_comp.add(new W.Div({x:418, y:222, width:"444px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));


		_comp.add(new W.Div({x:418, y:486, width:"444px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp.add(new W.Span({x:368, y:165, width:"544px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px",
			className:"font_rixhead_medium", text:textL, textAlign:"center", "letter-spacing":"-1.7px"}));

		_comp.btn = [];
		_comp.btn[0] = buttonComp.create(433, 524, W.Texts["popup_select_channel_confirm_button"], 133);
		_comp.btn[1] = buttonComp.create(574, 524, W.Texts["save"], 133);
		_comp.btn[2] = buttonComp.create(715, 524, W.Texts["cancel"], 133);

		if(list.length > 10){
			isMore = true;

			_comp.add(new W.Div({x:891, y:222, width:1, height:267, color:"rgba(131,122,119,0.25)"}));

			_comp._scroll = new W.Div({x:890, y:222, width:3, height:(267/Math.ceil(list.length/10)), color:"rgba(131,122,119,1)"});
			_comp.add(_comp._scroll);
		}else{
			isMore = false;
		}
		
		_comp.add(_comp.btn[0].getComp());
		_comp.add(_comp.btn[1].getComp());
		_comp.add(_comp.btn[2].getComp());

		_list = new W.Div({x:418, y:227, width:"444px", height:"259px", overflow:"hidden"});
		_comp.add(_list);
		_list._area = new W.Div({x:0, y:0, width:"444px"});
		_list.add(_list._area);

		_list._postersComp = [];

		if(list.length == 0) {
			_list._area.add(new W.Div({x:0, y:102, lineHeight:"52px", textColor:"rgba(181,181,181,0.75)", text:W.Texts["popup_select_channel_confirm_noselect"],
				width:444, textAlign:"center", "font-size":"18px", className:"font_rixhead_light", "letter-spacing":"-0.9px"}));
		} else {
			for(var i=0; i < list.length; i++){
				_list._postersComp[i] = new W.Div({x:i%2==0?0:230,y:Math.floor(i/2)*52, width:214, height:52});
				_list._postersComp[i].add(new W.Div({x:8, y:0, lineHeight:"52px", textColor:"rgba(181,181,181,0.75)", text:util.changeDigit(list[i].channelNum,3),
					"font-size":"18px", className:"font_rixhead_bold", "letter-spacing":"-0.9px"}));
				_list._postersComp[i].add(new W.Div({x:48, y:0, lineHeight:"52px", textColor:"rgba(181,181,181,0.75)", text:list[i].title,
					"font-size":"18px", className:"font_rixhead_light", "letter-spacing":"-0.9px"}));
				_list._postersComp[i].add(new W.Div({x:0, y:51, width:214, height:1, color:"rgba(255,255,255,0.07)"}));
				_list._area.add(_list._postersComp[i]);
			}

		}
		_comp.btn[1].focus();

	};
	
	function focus(){
		if(isMore){
			_comp._scroll.setStyle({y:222+(267/Math.ceil(list.length/10))*page});
			_list._area.setStyle({y:-page * 260});
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("SelectChannelConfirmPopup onStart");
    		list = _param.list;
    		type = _param.type;
    		title = _param.title;
			page = 0;
			index = 1;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size popup_bg_color"});
    		this.add(_comp);
			create();
    	},
    	onStop: function() {
    		W.log.info("SelectChannelConfirmPopup onStop");
    		index = 1;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("SelectChannelConfirmPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(index == 1){
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
    			}else{
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE, idx: index});
    			}
    			break;
    		case W.KEY.RIGHT:
				_comp.btn[index].unFocus();
				index = index+1 > 2 ? 0 : index+1;
				_comp.btn[index].focus();
    			break;
    		case W.KEY.LEFT:
				_comp.btn[index].unFocus();
				index = index-1 < 0 ? 2 : index-1;
				_comp.btn[index].focus();
    			break;
    		case W.KEY.UP:
    			if(page == 0) break;
				else {
					page--;
					focus();
				}
    			break;
    		case W.KEY.DOWN:
				if(page == Math.floor((list.length-1)/10)) break;
				else {
					page++;
					focus();
				}
    			break;
    		}
    	}
    });
});