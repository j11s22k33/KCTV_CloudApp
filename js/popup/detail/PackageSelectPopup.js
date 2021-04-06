/**
 * popup/PackageSelectPopup
 */
W.defineModule(["comp/PopupButton", "comp/list/Poster"], function(buttonComp, Poster) {
	'use strict';
	W.log.info("PackageSelectPopup");
	var isList = true;
	var index = 0;
	var list;
	var assets;
	var _this;
	var _comp;
	var _list;
	var type;
	var title;
	var isMore = false;
	var totalPage = 0;
	
	function create(){
		totalPage = Math.ceil(list.length/4);
		var textL = W.Texts["package_select_pop_title"];
		var textS = W.Texts["package_select_pop_guide1"];
		if(type == "C"){
			textL = title;
			textS = W.Texts["package_select_pop_guide2"];
		}
		if(list.length > 4){
			isMore = true;
			_comp.add(new W.Div({x:302, y:106, width:"676px", height:"509px", className:"popup_comp_color popup_comp_border"}));
			_comp.add(new W.Div({x:381, y:527, width:"520px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp._curr_page = new W.Span({x:837, y:538, width:"30px", height:"16px", textColor:"rgb(254,254,254)", "font-size":"16px", 
				className:"font_rixhead_bold", text:"01", textAlign:"right"});
			_comp.add(_comp._curr_page);
			_comp.add(new W.Span({x:872, y:538, width:"32px", height:"16px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_medium", text:"/ " + W.Util.changeDigit(totalPage,2), textAlign:"right"}));
			_comp._arr_l = new W.Image({x:325, y:351, width:"41px", height:"41px", src:"img/arrow_navi_l.png", opacity:0});
			_comp._arr_r = new W.Image({x:916, y:351, width:"41px", height:"41px", src:"img/arrow_navi_r.png", opacity:1});
			_comp.add(_comp._arr_l);
			_comp.add(_comp._arr_r);
			_comp.add(new W.Div({x:381, y:215, width:"520px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp.btn = buttonComp.create(574, 554, W.Texts["cancel"], 133);
			
			
		}else{
			isMore = false;
			_comp.add(new W.Div({x:362, y:121, width:"556px", height:"479px", className:"popup_comp_color popup_comp_border"}));
			_comp.add(new W.Div({x:392, y:230, width:"496px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
			_comp.btn = buttonComp.create(574, 539, W.Texts["cancel"], 133);
		}
		
		_comp.add(_comp.btn.getComp());
		_comp.add(new W.Span({x:362, y:(isMore ? 106 : 121)+31, width:"556px", height:"38px", textColor:"rgb(237,168,2)", "font-size":"34px", 
			className:"font_rixhead_medium", text:textL, textAlign:"center"}));
		_comp.add(new W.Span({x:362, y:(isMore ? 106 : 121)+69, width:"556px", height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
			className:"font_rixhead_medium", text:textS, textAlign:"center"}));
		
		var _cont_title = new W.Div({x:362, y:(isMore ? 106 : 121)+132, width:"556px", height:"24px", textAlign:"center"});
		_comp.add(_cont_title);
		_comp._title = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(255,255,255)", "font-size":"22px", 
			className:"font_rixhead_medium", text:list[0].title});
		_cont_title.add(_comp._title);
		if(type == "P"){
			_comp._price = new W.Span({position:"relative", y:0, height:"24px", textColor:"rgb(181,181,181)", "font-size":"22px", 
				className:"font_rixhead_medium", text:"3,200", "padding-left":"9px"});
			_cont_title.add(_comp._price);
			_comp._price_unit = new W.Span({position:"relative", y:0, height:"16px", textColor:"rgb(181,181,181)", "font-size":"15px", 
				className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"4px"});
			_cont_title.add(_comp._price_unit);
		}

		_list = new W.Div({x:390, y:(isMore ? 106 : 121)+170, width:"500px", height:"244px", overflow:"hidden"});
		_comp.add(_list);
		_list._area = new W.Div({x:0, y:9, width:"500px", height:"244px"});
		_list.add(_list._area);
		_list.posters = [];
		_list._postersComp = [];
		for(var i=0; i < list.length; i++){
			_list.posters[i] = new Poster({type:Poster.TYPE.W113, data:list[i], isPackage:true});
			_list._postersComp[i] = _list.posters[i].getComp();
			_list._postersComp[i].setStyle({x:9+123*i});
			_list._area.add(_list._postersComp[i]);
		}
		_list.posters[0].setFocus();
	};
	
	function focus(){
		_list.posters[index].setFocus();
		_comp._title.setText(list[index].title);
		if(isMore){
			var page = Math.floor(index/4);
			_list._area.setStyle({x:-page * 491});
			if(page == 0){
				_comp._arr_l.setStyle({opacity:0});
				_comp._arr_r.setStyle({opacity:1});
			}else if(page == totalPage-1){
				_comp._arr_l.setStyle({opacity:1});
				_comp._arr_r.setStyle({opacity:0});
			}else{
				_comp._arr_l.setStyle({opacity:1});
				_comp._arr_r.setStyle({opacity:1});
			}
			_comp._curr_page.setText(W.Util.changeDigit(page+1,2));
		}
	};

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("PackageSelectPopup onStart");
    		list = _param.list;
    		assets = _param.assets;
    		type = _param.type;
    		title = _param.title;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className:"bg_size popup_bg_color"});
    		this.add(_comp);
    		
    		var prodIds = "";
        	for(var i=0; i < list.length; i++){
        		prodIds += (i > 0 ? "," : "") + list[i].productId;
        	}
        	
        	var sdpDataManager = W.getModule("manager/SdpDataManager");
        	sdpDataManager.getProductDetail(function(isSuccess, result){
        		W.log.info(result);
        		if(isSuccess){
        			for(var i=0; i < list.length; i++){
        				for(var j=0; j < result.data.length; j++){
        					if(list[i].productId == result.data[j].productId){
        						list[i].images = result.data[j].images;
        						list[i].posterUrl = result.data[j].posterUrl;
        						break;
        					}
        				}
                	}
        		}
        		create();
        	}, {productId:prodIds});
        	
    		
    	},
    	onStop: function() {
    		W.log.info("PackageSelectPopup onStop");
    		isList = true;
    		index = 0;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("PackageSelectPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(isList){
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, product:list[index], asset:assets[index]});
    			}else{
    				W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(isList){
        			if(index < list.length-1){
            			_list.posters[index].unFocus();
        				index++;
        				focus();
        			}
    			}
    			break;
    		case W.KEY.LEFT:
    			if(isList){
        			if(index > 0){
            			_list.posters[index].unFocus();
        				index--;
        				focus();
        			}
    			}
    			break;
    		case W.KEY.UP:
    			if(!isList){
    				_list.posters[index].setFocus();
    				isList = true;
    				_comp.btn.unFocus();
    			}
    			break;
    		case W.KEY.DOWN:
    			if(isList){
    				_list.posters[index].unFocus();
    				isList = false;
    				_comp.btn.focus();
    			}
    			break;
    		}
    	}
    });
});