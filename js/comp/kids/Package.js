W.defineModule(["mod/Util", "comp/Button", "comp/list/Poster"], function(util, buttonComp, Poster) {
	var STATE_PURCHASE = 0;
	var STATE_LIST = 1;
	var STATE_BUTTONS = 2;
    var Package = function(_parent, _parentDiv) {
    	var data;
    	var list;
    	var isList = false;
    	var state = STATE_PURCHASE;
    	var index = 0;
    	var oldIndex = 0;
    	var total = 0;
    	var keyTimeout;

    	var _comp = new W.Div({className:"bg_size"});

    	var makePackage = function(){
    		_comp._package = new W.Div({x:66, y:105, width:"800px", height:"270px"});
    		_comp.add(_comp._package);
        	var _title_area = new W.Div({x:0, y:0, width:"800px", height:"38px", textAlign:"left"});
        	_comp._package.add(_title_area);
        	_title_area.add(new W.Span({position:"relative", y:0, height:"38px", textColor:"rgb(255,255,255)", "font-size":"34px", 
    			className:"font_rixhead_medium", text:data.title + " "}));
        	_title_area.add(new W.Span({position:"relative", y:5, height:"28px", textColor:"rgba(255,255,255,0.75)", "font-size":"26px", 
    			className:"font_rixhead_light", text:W.Texts["total"] + " " + list.length + W.Texts["unit_vod"]}));
        	
        	_comp._package.add(new W.Span({x:0, y:45, height:"19px", width:"600px", textColor:"rgb(255,255,255)", "font-size":"17px", 
    			className:"font_rixhead_light", text:data.subTitle}));

        	var _price = new W.Div({x:0, y:83, width:"400px", height:"58px", textAlign:"left"});
        	_comp._package.add(_price);
        	_comp._rental_duration = new W.Span({position:"relative", y:-3, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
    			className:"font_rixhead_bold", text:data.rentalPeriod.value + W.Texts["unit_date"] + " " + W.Texts["can_watch"]});
        	_price.add(_comp._rental_duration);
        	_comp._originPrice = new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(181,181,181)", "font-size":"14px",
    			className:"font_rixhead_light strike", text:W.Util.formatComma(data.listPrice, 3) + W.Texts["price_unit"], "padding-right":"2px", "margin-left":"7px"});
        	_price.add(_comp._originPrice);
        	_comp._price = new W.Span({position:"relative", y:-2, height:"29px", textColor:"rgb(237,168,2)", "font-size":"26px", 
    			className:"font_rixhead_bold", text:W.Util.formatComma(util.vatPrice(data.price), 3), "padding-left":"10px"});
        	_price.add(_comp._price);
        	_price.add(new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(181,181,181)", "font-size":"14px", 
				className:"font_rixhead_light", text:"원", "padding-left":"3px"}));
        	_comp._discount = new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(218,188,116)", "font-size":"14px", 
				className:"font_rixhead_light", text:W.Texts["discount"].replace("@price@", W.Util.formatComma(data.listPrice, 3)), "padding-left":"10px"});
        	_price.add(_comp._discount);
        	
        	_comp._package.add(new W.Span({x:0, y:130, width:"446px", height:"60px", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", 
    			className:"font_rixhead_light", text:data.synopsis}));
        	
        	_comp.purchaseBtn = buttonComp.create(2, 205, W.Texts["purchase_package"], 111);
        	_comp._package.add(_comp.purchaseBtn.getComp());
        	_comp.purchaseBtn.focus();
        	
        	_comp._package_info = new W.Div({x:71, y:397, width:"300px", height:"28px", textAlign:"left", display:"none"});
        	_comp.add(_comp._package_info);
        	_comp._package_info.add(new W.Image({position:"relative", y:0, width:"13px", height:"15px", src:"img/arrow_navi_u2.png", "padding-right":"10px"}));
        	_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"18px", textColor:"rgb(196,196,196)", "font-size":"16px", 
				className:"font_rixhead_medium", text:W.Texts["package_info"], "padding-right":"20px"}));
        	_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
				className:"font_rixhead_bold", text:W.Texts["total"] + " " + list.length + W.Texts["unit_vod"], "padding-right":"14px"}));
        	_comp._package_info.add(new W.Span({position:"relative", y:-2, height:"24px", textColor:"rgb(237,168,2)", "font-size":"22px", 
				className:"font_rixhead_bold", text:W.Util.formatComma(data.discountPrice, 3), "padding-right":"3px"}));
        	_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"14px", textColor:"rgb(181,181,181)", "font-size":"14px", 
				className:"font_rixhead_light", text:W.Texts["price_unit"]}));
        	
        	_comp._arr = new W.Div({x:71, y:429, width:"1205px", height:"28px"});
    		_comp.add(_comp._arr);
    		_comp._arr._img = new W.Image({x:0, y:0, width:"13px", height:"15px", src:"img/arrow_navi_d2.png"});
    		_comp._arr.add(_comp._arr._img);
    		_comp._arr._txt = new W.Span({x:22, y:-2, height:"22px", width:"200px", textColor:"rgb(196,196,196)", "font-size":"16px",
    			className:"font_rixhead_medium", text:W.Texts["package_watch_lise"]});
    		_comp._arr.add(_comp._arr._txt);
    		_comp._arr._bar = new W.Image({x:222, y:6, width:"983px", height:"1px", backgroundColor:"rgba(255,255,255,0.12)"});
    		_comp._arr.add(_comp._arr._bar);
    		
    		_comp._area = new W.Div({x:0, y:455, width:"1280px", height:"290px", overflow:"hidden"});
    		_comp.add(_comp._area);
    		_comp._list = new W.Div({x:67, y:15, width:(154 * list.length) + "px", height:"204px"});
    		_comp._area.add(_comp._list);
    		_comp._dim = new W.Div({x:67, y:15, width:"1200px", height:"204px"});
    		_comp._area.add(_comp._dim);
    		
    		_comp._dim.add(new W.Div({x:-154, y:0, width:"136px", height:"194px", backgroundColor:"rgba(0,0,0,0.6)"}));
    		
    		_comp.posters = [];
    		_comp._postersComp = [];
    		_comp._dimComp = [];
    		for(var i=0; i < list.length; i++){
    			_comp.posters[i] = new Poster({type:Poster.TYPE.W136, data:list[i], isPackage:true, textAlign: i%7 == 6 ? "right" : "left"});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:154*i});
                _comp._list.add(_comp._postersComp[i]);
                
                if(i < 8){
                    _comp._dimComp[i] = new W.Div({x:154*i, y:0, width:"136px", height:"194px", backgroundColor:"rgba(0,0,0,0.6)"});
                    _comp._dim.add(_comp._dimComp[i]);
                }
    		}
    	};

    	this.setData = function(packageData, listData){
        	_comp._area = new W.Div({x:67, y:102, width:"1137px", height:"319px"});
        	_comp.add(_comp._area);
        	
        	data = packageData;
        	list = listData;

    		_parentDiv.add(_comp);

    		makePackage();
    		getDetail();
    	};
    	
    	var getDetail = function(){
    		if(list[index].detailData){
    			_parent.Detail.setData(list[index].detailData);
    		}else{
    			_parent.dataManager.getAssetDetail(function(result, data, param){
    				data.data[0].title = list[index].title;
    				data.data[0].starRating = list[index].starRating;
    				list[index].detailData = data;
        			_parent.Detail.setData(list[index].detailData);
        		}, "assetId");
    		}
    		
    	};
    	
    	var focus = function(){
    		_comp.posters[oldIndex].unFocus();
    		_comp.posters[index].setFocus();
    		var page = Math.floor(index/7);
    		_comp._list.setStyle({x:67 - 1078*page});
    	};
    	
    	var unFocus = function(){
    		
    	};
    	
    	this.focus = function(){
    		focus();
    	};
    	
    	this.unFocus = function(){
    		_comp.posters[index].unFocus();
    		index = 0;
    		_comp._list.setStyle({x:67});
    	};
    	
    	this.operate = function(event){
    		W.log.info("state ============= " + state);
    		switch (event.keyCode) {
    		case W.KEY.BACK:
    			_parent.backScene();
    			break;
            case W.KEY.RIGHT:
            	if(state == STATE_LIST){
            		oldIndex = index;
                	index = (++index) % list.length;
                	focus();
                	clearTimeout(keyTimeout);
                	keyTimeout = setTimeout(getDetail, 300);
            	}else if(state == STATE_BUTTONS){
            		_parent.Detail.operate(event);
            	}
                break;
            case W.KEY.LEFT:
            	if(state == STATE_LIST){
            		oldIndex = index;
            		index = (--index + list.length) % list.length;
                	focus();
                	clearTimeout(keyTimeout);
                	keyTimeout = setTimeout(getDetail, 300);
            	}else if(state == STATE_BUTTONS){
            		_parent.Detail.operate(event);
            	}
                break;
            case W.KEY.UP:
            	if(state == STATE_LIST){
            		state = STATE_PURCHASE;
            		_comp._package_info.setStyle({display:"none"});
            		_comp._arr.setStyle({display:""});
            		_comp.posters[index].unFocus();
            		_comp.purchaseBtn.focus();
            		_comp._dim.setStyle({display:""});
            		_parent._parentDiv._area.setStyle({y:0});
            	}else if(state == STATE_BUTTONS){
            		state = STATE_LIST;
            		_parent.Detail.unFocus();
            		_comp.posters[index].setSelected();
            	}
                break;
            case W.KEY.DOWN:
            	if(state == STATE_PURCHASE){
            		state = STATE_LIST;
            		_comp._package_info.setStyle({display:""});
            		_comp._arr.setStyle({display:"none"});
            		_comp.posters[index].setFocus();
            		_comp.purchaseBtn.unFocus();
            		_comp._dim.setStyle({display:"none"});
            		_parent._parentDiv._area.setStyle({y:-344});
                }else if(state == STATE_LIST){
                	state = STATE_BUTTONS;
                	_comp.posters[index].unSelected();
            		_parent.Detail.focus();
                }
                break;
            case W.KEY.ENTER:
            	if(state == STATE_PURCHASE){
            		
                }else{
                	
                }
                break;
    		}
    	};
    };
    
    return {
    	getComp : function(_parent, _parentDiv){
    		var packageComp = new Package(_parent, _parentDiv);
    		return packageComp;
    	}
    }
});