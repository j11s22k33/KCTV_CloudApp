/**
 * popup/BluetoothSearchPopup
 */
W.defineModule(["comp/PopupButton"], function(buttonComp) {
	'use strict';
	W.log.info("BluetoothSearchPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var desc;
	var index = 0;
	var yIndex = 0;
	var barLength = 0;
	var list = {};
	
	
	
	function create(){
		_comp.add(new W.Span({x:418-368, y:177-146, width:"444px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:W.Texts["popup_bluetooth_search_title"], textAlign:"center"}));
		_comp.add(new W.Span({x:418-368, y:223-146, width:"444px", height:"22px", textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
			className:"font_rixhead_light", text:W.Texts["popup_bluetooth_search_guide"], textAlign:"center"}));
		_comp.add(new W.Div({x:418-368, y:263-146, width:"444px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));
		
		_comp._scroll = new W.Div({x:890-368, y:263-146, width:"3px", height:"215px", display:"none"});
		_comp.add(_comp._scroll);
		_comp._scroll.add(new W.Div({x:1, y:0, width:"1px", height:"215px", backgroundColor:"rgba(131,122,119,0.25)"}));
		_comp._scroll._bar = new W.Div({x:0, y:0, width:"3px", height:"91px", backgroundColor:"rgb(131,122,119)"});
		_comp._scroll.add(_comp._scroll._bar);
		
		_comp._area = new W.Div({x:418-368, y:266-146, width:"444px", height:"212px", overflow:"hidden"});
		_comp.add(_comp._area);
		
		_comp.add(new W.Div({x:418-368, y:332, width:"444px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp.btns = [];
		_comp.btns[0] = buttonComp.create(503-368, 513-146, W.Texts["popup_bluetooth_search_button"], 133);
		_comp.btns[1] = buttonComp.create(644-368, 513-146, W.Texts["cancel"], 133);
		_comp.add(_comp.btns[0].getComp());
		_comp.add(_comp.btns[1].getComp());
	};
	
	function makeList(){
		W.log.info(list);
		_comp._devices = [];
		if(_comp._list){
			_comp._area.remove(_comp._list);
		}
		_comp._list = new W.Div({x:0, y:0, width:"444px", height:"212px"});
		_comp._area.add(_comp._list);
		
		if(Object.keys(list).length > 0){
			for(var i = 0; i < Object.keys(list).length; i++){
				_comp._devices[i] = new W.Div({x:0, y:53 * i , width:"444px", height:"53px"});
				_comp._list.add(_comp._devices[i]);
				_comp._devices[i]._name = new W.Span({x:10, y:20, width:"420px", height:"20px", textColor:"rgba(181,181,181,0.75)", "font-size":"18px", 
					className:"font_rixhead_light", text:list[Object.keys(list)[i]][0]});
				_comp._devices[i].add(_comp._devices[i]._name);
				if(i < Object.keys(list).length - 1){
					_comp._devices[i].add(new W.Div({x:0, y:52, width:"444px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
				}
				_comp._devices[i]._foc = new W.Image({x:0, y:0, width:"444px", height:"53px", src:"img/line_pop444_f.png", display:"none"});
				_comp._devices[i].add(_comp._devices[i]._foc);
			}
			
			if(Object.keys(list).length > 4){
				_comp._scroll.setStyle({display:"block"});
				barLength = 215 / Math.ceil(Object.keys(list).length / 4);
				_comp._scroll._bar.setStyle({height:barLength + "px"});
			}else{
				_comp._scroll.setStyle({display:"none"});
				barLength = 0;
			}
		}else{
			_comp._scroll.setStyle({display:"none"});
			barLength = 0;
			yIndex = 1;
			bIndex = 0;
			_comp.btns[0].focus();
		}
	};
	
	function focus(){
		if(yIndex == 0){
			_comp._devices[index]._name.setStyle({textColor:"rgb(255,255,255)"});
			_comp._devices[index]._foc.setStyle({display:"block"});
			if(Object.keys(list).length > 4){
				var page = Math.floor(index/4);
				_comp._list.setStyle({y:-page * 212});
				_comp._scroll._bar.setStyle({y:page * barLength});
			}
		}else{
			_comp.btns[bIndex].focus();
		}
	};
	
	function unFocus(){
		if(yIndex == 0){
			_comp._devices[index]._name.setStyle({textColor:"rgba(181,181,181,0.75)"});
			_comp._devices[index]._foc.setStyle({display:"none"});
		}else{
			_comp.btns[bIndex].unFocus();
		}
	};

	var bluetoothDeviceFound = function(data) {

		if(data && data.length > 0) {
			if(list[data[1]]) {
			} else {
				list[data[1]] = data;
				makeList();
			}
			unFocus();
			index = 0;
			yIndex = 0;
			focus();
		}
	}

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("BluetoothSearchPopup onStart");
    		desc = _param;
    		_this = this;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:368, y:146, width:"544px", height:"428px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		index = 0;
    		yIndex = 0;
    		barLength = 0;
			list = {};
    		create();
    		makeList();
    		focus();
			
			W.CloudManager.startDiscovery(function() {

				W.CloudManager.BluetoothCallback = bluetoothDeviceFound;

			});
    	},
    	onStop: function() {
    		W.log.info("BluetoothSearchPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("BluetoothSearchPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
				W.CloudManager.stopDiscovery(function() {});
				W.CloudManager.BluetoothCallback = undefined;
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(yIndex == 0){
					W.CloudManager.stopDiscovery(function() {});
					W.CloudManager.BluetoothCallback = undefined;
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, device:list[Object.keys(list)[index]]});
    			}else{
    				if(bIndex == 0){
    					unFocus();
    					list = {};
						W.CloudManager.startDiscovery(function() {
							W.CloudManager.BluetoothCallback = bluetoothDeviceFound;
						});

    					makeList();
    				}else{
    					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    				}
    			}
    			break;
    		case W.KEY.RIGHT:
    		case W.KEY.LEFT:
    			if(yIndex == 1){
        			unFocus();
    				bIndex = (++bIndex) % 2;
    				focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(yIndex == 0){
					unFocus();
    				if(index == Object.keys(list).length - 1){
    					yIndex = 1;
    				}else{
    					index++;
    				}
    				focus();
    			}
    			break;
    		case W.KEY.UP:
    			if(yIndex == 0){
					unFocus();
    				if(index > 0){
    					index--;
    				}else{
    					index = Object.keys(list).length - 1;
    				}
    				focus();
    			}else{
    				if(Object.keys(list).length > 0){
    					unFocus();
    					yIndex = 0;
    					focus();
    				}
    			}
    			break;
    		}
    	}
    });
});