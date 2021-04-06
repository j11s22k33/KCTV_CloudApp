W.defineModule([ "mod/Util", "comp/Button"], function(util, buttonComp) {

	function ZzimAddInfoComp(_parent){
		var _comp;
		var buttons = [];
		var index = 0;
		
		this.getComp = function(){
			_comp = new W.Div({x:0, y:0, width:"370px", height:"480px"});
			var txts;
			if(_parent.type == "series"){
				txts = util.geTxtArray(_parent.selectedSeries.title, "RixHeadM", 31, 250, 1);
			}else{
				txts = util.geTxtArray(_parent.selectedAsset.title, "RixHeadM", 31, 250, 1);
			}
			W.log.info(txts);

			_comp._title1 = new W.Span({x:0, y:0, width:"330px", height:"33px", textColor:"rgb(255,255,255)", 
    			"font-size":"30px", className:"font_rixhead_medium", text:txts[0]});
			_comp.add(_comp._title1);
			_comp._title2 = new W.Span({x:0, y:35, width:"300px", height:"33px", textColor:"rgb(255,255,255)", 
    			"font-size":"30px", className:"font_rixhead_medium cut", text:txts.length > 1 ? txts[1] : ""});
			_comp.add(_comp._title2);

			_comp.add(new W.Image({x:1, y:82, width:"298px", height:"2px", src:"img/pay_dashed_line.png"}));
			_comp.add(new W.Image({x:1, y:216, width:"298px", height:"2px", src:"img/pay_dashed_line.png"}));
			
			
			_comp.add(new W.Span({x:0, y:116, width:"85px", height:"20px", textColor:"rgb(181,181,181)", 
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["product"]}));
			_comp.add(new W.Span({x:0, y:166, width:"85px", height:"20px", textColor:"rgb(181,181,181)", 
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_zzim_option_selected_list"]}));

			_comp._product = new W.Span({x:81, y:116, width:"220px", height:"20px", textColor:"rgb(161,181,221)", textAlign:"right",
    			"font-size":"18px", className:"font_rixhead_light", text:""});
			_comp.add(_comp._product);
			_comp._selected_list = new W.Span({x:81, y:166, width:"220px", height:"20px", textColor:"rgba(161,181,221,0.4)", textAlign:"right",
    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_zzim_option_selected_list2"]});
			_comp.add(_comp._selected_list);

			_comp.add(new W.Span({x:1, y:244, width:"298px", height:"20px", textColor:"rgba(131,122,119,0.75)",
				"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_zzim_move_guide2"], textAlign:"center"}));

			_comp.btn1 = buttonComp.create(86, 366, W.Texts["regist"], 133);
			_comp._btn1 = _comp.btn1.getComp();
			_comp._btn1.setStyle({opacity:0.6});
			_comp.add(_comp._btn1);
			
			_comp.btn2 = buttonComp.create(86, 414, W.Texts["cancel"], 133);
			_comp._btn2 = _comp.btn2.getComp();
			_comp.add(_comp._btn2);

			return _comp;
		};
		
		this.setRegistBtn = function(isActive){
			this.isActive = isActive;
			W.log.info("this.isActive ====== " + this.isActive);
			index = 0;
			if(this.isActive){
				_comp._btn1.setStyle({opacity:1});
			}else{
				_comp._btn1.setStyle({opacity:0.6});
			}
		};

		this.changeListTitle = function(zzimTitle){
			
			if(zzimTitle){
				_comp._selected_list.setText(zzimTitle);
				_comp._selected_list.setStyle({textColor:"rgb(161,181,221)"});
			}else{
				_comp._selected_list.setText(W.Texts["popup_zzim_option_selected_list"]);
				_comp._selected_list.setStyle({textColor:"rgba(161,181,221,0.4)"});
			}
		};
		
		this.changeProductTitle = function(title){
			_comp._product.setText(title);
		};
		
		this.changeAsset = function(){
			var txts = util.geTxtArray(_parent.selectedAsset.title, "RixHeadM", 30, 300, 1);
			_comp._title1.setText(txts[0]);
			if(txts.length > 1){
				_comp._title2.setText(txts[1]);
				_comp._title2.setStyle({display:"block"});
			}else{
				_comp._title2.setStyle({display:"none"});
			}
			
			_comp._product.setText(_parent.selectedAsset.buttonTitle);
		};
		
		this.changeList = function(){
			_parent.selectedList;
			_comp._price._price.setText(W.Util.formatComma(product.price, 3));
			if(type == "monthly"){
				var txts = util.geTxtArray(product.title, "RixHeadM", 30, 300, 1);
				_comp._title1.setText(txts[0]);
				if(txts.length > 1){
					_comp._title2.setText(txts[1]);
					_comp._title2.setStyle({display:"block"});
				}else{
					_comp._title2.setStyle({display:"none"});
				}
				
				_comp._duration.setText(W.Texts["unit_subscribed"]);
			}else{
				_comp._duration.setText(product.rentalPeriod.value + W.Texts["unit_date"]);
			}
		};
		
		
		
		this.changePurchaseOption = function(text){
			_comp._purchase_option.setText(text);
		};

		this.changePurchaseType = function(opt){
			option = opt;
			if(option.type == "bill" || option.type == "coin" || option.type == "coupon"){
				isPinMode = true;
				_comp._phone_purchase.setStyle({display:"none"});
				_comp._pin.setStyle({display:"block"});
			}else{
				isPinMode = false;
				_comp._phone_purchase.setStyle({display:"block"});
				_comp._pin.setStyle({display:"none"});
				_comp._phone_purchase.btn.focus();
			}

			if(option.name){
				_comp._purchase_type.setText(option.name);
				_comp._purchase_type.setStyle({textColor:"rgb(181,181,181)"});
			}else{
				_comp._purchase_type.setText(W.Texts["select_payment"]);
				_comp._purchase_type.setStyle({textColor:"rgba(131,122,119,0.75)"});
			}
		};
		

		this.operate = function(event){
			switch (event.keyCode) {
            case W.KEY.UP:
            case W.KEY.DOWN:
            	if(this.isActive){
    				unFocus();
                	index = index == 0 ? 1 : 0;
    				focus();
            	}
            	break;
			}
		};

		this.focus = function(isReset){
			index = this.isActive ? 0 : 1;
			focus();
		};
		
		this.unFocus = function(isShow, isReset){
			unFocus();
			index = 0;
		};
		
		this.select = function(){
			return index;
		};
		
		function focus(){
			if(index == 0){
				_comp.btn1.focus();
			}else{
				_comp.btn2.focus();
			}
		};
		
		function unFocus(){
			if(index == 1){
				_comp.btn2.unFocus();
			}else{
				_comp.btn1.unFocus();
			}
		};
	};

	return ZzimAddInfoComp;
});