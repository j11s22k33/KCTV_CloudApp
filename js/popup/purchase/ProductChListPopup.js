/**
 * popup/ProductChListPopup
 */
W.defineModule(["comp/PopupButton", "mod/Util"], function(buttonComp, util) {
	'use strict';
	W.log.info("ProductChListPopup");
	var bIndex = 0;
	var _this;
	var _comp;
	var product;
	var index = 0;
	var barLength = 0;
	var totalPage = 0;
	var subscribedChannels;
	
	function create(){
		var price = util.getPrice(product);
		_comp.add(new W.Span({x:303-253, y:128-98, width:"674px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:product.title, textAlign:"center"}));
		_comp.add(new W.Span({x:303-253, y:183-98, width:"674px", height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:W.Texts["unit_month"] + " " + W.Util.formatComma(price, 3) + W.Texts["price_unit"], textAlign:"center"}));
		_comp.add(new W.Span({x:303-253, y:219-98, width:"674px", height:"18px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
			className:"font_rixhead_light", text:W.Texts["popup_product_join_title"], textAlign:"center"}));

		_comp.add(new W.Div({x:303-253, y:260-98, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp._scroll = new W.Div({x:1005-253, y:260-98, width:"3px", height:"267px", display:"none"});
		_comp.add(_comp._scroll);
		_comp._scroll.add(new W.Div({x:1, y:0, width:"1px", height:"267px", backgroundColor:"rgba(131,122,119,0.25)"}));
		_comp._scroll._bar = new W.Div({x:0, y:0, width:"3px", height:"91px", backgroundColor:"rgb(131,122,119)"});
		_comp._scroll.add(_comp._scroll._bar);
		
		_comp._area = new W.Div({x:303-253, y:262-98, width:"674px", height:"264px", overflow:"hidden"});
		_comp.add(_comp._area);
		_comp._list = new W.Div({x:0, y:0, width:"674px", height:"265px"});
		_comp._area.add(_comp._list);
		
		_comp._channels = [];
		var channelList = [];
		for(var i=0; i < product.configuration.channels.length; i++){
			var isExist = false;
			for(var j=0; j < subscribedChannels.length; j++){
				if(product.configuration.channels[i].sourceId == subscribedChannels[j].sourceId){
					isExist = true;
					break;
				}
			}
			if(!isExist){
				channelList.push({num : util.changeDigit(product.configuration.channels[i].channelNum, 3), title:product.configuration.channels[i].title});
			}
		}
		channelList = channelList.sort(function (a, b) {
            return a.num - b.num;
        });

		for(var i=0; i < channelList.length; i++){
			_comp._channels[i] = new W.Div({x:230 * (i%3), y:53 * Math.floor(i/3) , width:"214px", height:"53px"});
			_comp._list.add(_comp._channels[i]);
			_comp._channels[i].add(new W.Span({x:8, y:20, width:"40px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
				"font-size":"18px", className:"font_rixhead_bold", text:channelList[i].num}));
			_comp._channels[i].add(new W.Span({x:48, y:20, width:"160px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
				"font-size":"18px", className:"font_rixhead_light cut", text:channelList[i].title}));
			_comp._channels[i].add(new W.Div({x:0, y:52, width:"214px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
		}
		
		if(product.configuration.channels.length > 15){
			_comp._scroll.setStyle({display:"block"});
			barLength = 265 / Math.ceil(product.configuration.channels.length / 15);
			_comp._scroll._bar.setStyle({height:barLength + "px"});
			totalPage = Math.floor(product.configuration.channels.length / 15);
		}else{
			_comp._scroll.setStyle({display:"none"});
			barLength = 0;
			totalPage = 0;
		}

		_comp.add(new W.Div({x:303-253, y:428, width:"674px", height:"3px", backgroundColor:"rgba(255,255,255,0.07)"}));

		_comp.btns = [];
		if(product.purchase){
			_comp.btns[0] = buttonComp.create(573-253, 562-98, W.Texts["cancel"], 133);
			_comp.add(_comp.btns[0].getComp());
		}else{
			_comp.btns[0] = buttonComp.create(503-253, 562-98, W.Texts["join"], 133);
			_comp.btns[1] = buttonComp.create(644-253, 562-98, W.Texts["cancel"], 133);
			_comp.add(_comp.btns[0].getComp());
			_comp.add(_comp.btns[1].getComp());
		}
		
		_comp.btns[0].focus();
	};

	function focus(){
		if(yIndex == 0){
			_comp._devices[index]._name.setStyle({textColor:"rgb(255,255,255)"});
			_comp._devices[index]._foc.setStyle({display:"block"});
			
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

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ProductChListPopup onStart");
    		product = _param.product;
    		_this = this;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
    		              W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9
    		]);
    		this.add(new W.Div({className:"bg_size popup_bg_color"}));
    		
    		_comp = new W.Div({x:253, y:98, width:"774px", height:"525px", className:"popup_comp_color popup_comp_border"});
    		
    		this.add(_comp);
    		bIndex = 0;
    		index = 0;
    		totalPage = 0;
    		barLength = 0;
    		subscribedChannels = [];
    		
    		var sdpDataManager = W.getModule("manager/SdpDataManager");
    		sdpDataManager.getSubscribedChannels(function(result, data){
    			if(result){
    				subscribedChannels = data.data;
    			}
        		create();
    		}, {offset:0, limit:0});
    	},
    	onStop: function() {
    		W.log.info("ProductChListPopup onStop");
    	},
    	onKeyPressed : function(event) {
    		W.log.info("ProductChListPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(product.purchase){
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}else{
        			if(bIndex == 0){
        				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK});
        			}else{
        				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
        			}
    			}
    			break;
    		case W.KEY.RIGHT:
    		case W.KEY.LEFT:
    			if(!product.purchase){
        			_comp.btns[bIndex].unFocus();
    				bIndex = (++bIndex) % 2;
    				_comp.btns[bIndex].focus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(product.configuration.channels.length > 15){
    				index = (++index) % totalPage;
					_comp._list.setStyle({y:-index * 265});
					_comp._scroll._bar.setStyle({y:index * barLength});
				}
    			break;
    		case W.KEY.UP:
    			if(product.configuration.channels.length > 15){
    				index = (--index + totalPage) % totalPage;
					_comp._list.setStyle({y:-index * 265});
					_comp._scroll._bar.setStyle({y:index * barLength});
				}
    			break;
    		}
    	}
    });
});