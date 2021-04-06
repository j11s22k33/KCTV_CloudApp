//@preDefine
W.defineModule("comp/CouponInfo", [ "mod/Util"], function(util) {

	var couponInfo = function(isKids){
		var _this = this;
		var _comp;
		var xPos;
		var yPos;
		var btnTypes = [false, false, false];
		var create = function(){
			_comp = new W.Div({x:0, y:0, width:"650px", height:"68px", textAlign:"right"});
			
			_comp._color = [];
			_comp._txt = [];

			_comp.add(new W.Div({"position":"relative", y:0, width:"68px", height:"68px", display:"inline-block", "margin-right":"-17px", "margin-left":"-10px"}));
			_comp._color[0] = new W.Image({"position":"relative", y:0, width:"68px", height:"68px", "src":"img/color_yellow.png", 
				display:"none", "margin-right":"-17px", "margin-left":"-10px"});
			_comp.add(_comp._color[0]);
			_comp._txt[0] = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				display:"none", className:"font_rixhead_medium", text:W.Texts["optionMenu"]});
			_comp.add(_comp._txt[0]);

			_comp._color[1] = new W.Image({"position":"relative", y:0, width:"68px", height:"68px", "src":"img/color_yellow.png",
				display:"none", "margin-right":"-17px", "margin-left":"-10px"});
			_comp.add(_comp._color[1]);
			_comp._txt[1] = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				display:"none", className:"font_rixhead_medium", text:W.Texts["optionMenu"]});
			_comp.add(_comp._txt[1]);
			
			_comp._color[2] = new W.Image({"position":"relative", y:0, width:"68px", height:"68px", "src":"img/color_yellow.png", 
				display:"none", "margin-right":"-17px", "margin-left":"-10px"});
			_comp.add(_comp._color[2]);
			_comp._txt[2] = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				display:"none", className:"font_rixhead_medium", text:W.Texts["optionMenu"]});
			_comp.add(_comp._txt[2]);

			_comp._kids = new W.Div({"position":"relative", y:-32, width:"52px", height:"21px",/* "src":"img/08_mode_off.png",*/
				display:"none", "margin-right":"-12px", "margin-left":"8px"});
			_comp.add(_comp._kids);
			
			_comp._couponI = new W.Image({"position":"relative", y:-34, width:"25px", height:"17px", "src":"img/icon_top_coupon.png", 
				className:"coupon_countI", display:"none", "margin-left":"28px"});
			_comp._couponT = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				className:"font_rixhead_medium coupon_countT", text:W.Texts["coupon"], "padding-left":"7px", display:"none"});
			_comp._coupon = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgb(237,168,2)", "font-size":"20px", 
				className:"font_rixhead_medium coupon_count", text:"", "padding-left":"13px", display:"none"});
			_comp.add(_comp._couponI);
			_comp.add(_comp._couponT);
			_comp.add(_comp._coupon);
			
			_comp._coninB = new W.Span({"position":"relative", y:-34, width:"2px", height:"17px", backgroundColor:"rgba(255,255,255,0.15)", 
				className:"coin_amountB", display:"none", "margin-left":"10px"});
			_comp._coninI = new W.Image({"position":"relative", y:-33, width:"19px", height:"19px", "src":"img/icon_top_coin.png", 
				className:"coin_amountI", display:"none", "margin-left":"10px"});
			_comp._coninT = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgba(255,255,255,0.75)", "font-size":"20px", 
				className:"font_rixhead_medium coin_amountT", text:W.Texts["coin"], "padding-left":"5px", display:"none"});
			_comp._coin = new W.Span({"position":"relative", y:-38, height:"22px", textColor:"rgb(237,168,2)", "font-size":"20px", 
				className:"font_rixhead_medium coin_amount", text:"", "padding-left":"13px", display:"none"});
			_comp.add(_comp._coninB);
			_comp.add(_comp._coninI);
			_comp.add(_comp._coninT);
			_comp.add(_comp._coin);
		};
		
		var setCoupon = function(){
			if(W.StbConfig.cugType == "accommodation" || W.Coupon.isError){
				_comp._couponI.setStyle({display:"none"});
				_comp._couponT.setStyle({display:"none"});
				_comp._coupon.setStyle({display:"none"});
				_comp._coninB.setStyle({display:"none"});
				_comp._coninI.setStyle({display:"none"});
				_comp._coninT.setStyle({display:"none"});
				_comp._coin.setStyle({display:"none"});
			}else{
				if(W.Coupon.coupons.length){
					_comp._couponI.setStyle({display:"inline-block", "margin-left":"28px"});
					_comp._couponT.setStyle({display:"inline-block"});
					_comp._coupon.setText(W.Coupon.coupons.length + W.Texts["count_unit"]);
					_comp._coupon.setStyle({display:"inline-block"});
				}else{
					_comp._couponI.setStyle({display:"none"});
					_comp._couponT.setStyle({display:"none"});
					_comp._coupon.setStyle({display:"none"});
				}
				
				if(W.Coupon.totalBalanceAmount){
					if(W.Coupon.coupons.length){
						_comp._coninB.setStyle({display:"inline-block"});
						_comp._coninI.setStyle({display:"inline-block", "margin-left":"10px"});
					}else{
						_comp._coninI.setStyle({display:"inline-block", "margin-left":"28px"});
					}
					
					_comp._coninT.setStyle({display:"inline-block"});
					_comp._coin.setText(W.Util.formatComma(W.Coupon.totalBalanceAmount, 3) + W.Texts["price_unit"]);
					_comp._coin.setStyle({display:"inline-block"});
				}else{
					_comp._coninB.setStyle({display:"none"});
					_comp._coninI.setStyle({display:"none"});
					_comp._coninT.setStyle({display:"none"});
					_comp._coin.setStyle({display:"none"});
				}
			}
		};
		
		this.setButton = function(buttons){
			if(W.StbConfig.cugType == "accommodation") return;
			btnTypes = [false, false, false];
			
			var i=0;
			for(; i < buttons.length; i++){
				if(buttons[i].color == "Y"){
					_comp._color[i].setStyle({display:"inline-block", "src":"img/color_yellow.png"});
					btnTypes[i] = true;
				}else if(buttons[i].color == "R"){
					_comp._color[i].setStyle({display:"inline-block", "src":"img/color_red.png"});
					btnTypes[i] = true;
				}else if(buttons[i].color == "B"){
					_comp._color[i].setStyle({display:"inline-block", "src":"img/color_blue.png"});
					btnTypes[i] = true;
				}
				_comp._txt[i].setText(buttons[i].text);
				_comp._txt[i].setStyle({display:""});
			}
			for(;i < 3; i++){
				_comp._color[i].setStyle({display:"none"});
				_comp._txt[i].setStyle({display:"none"});
			}
		};
		
		this.hideButton = function(){
			for(var i=0; i < btnTypes.length; i++){
				W.log.info("btnTypes[i] == " + btnTypes[i]);
				if(btnTypes[i]){
					_comp._color[i].setStyle({visibility:"hidden"});
					_comp._txt[i].setStyle({visibility:"hidden"});
				}
			}
		};
		
		this.showButton = function(){
			for(var i=0; i < btnTypes.length; i++){
				if(btnTypes[i]){
					_comp._color[i].setStyle({visibility:"visible"});
					_comp._txt[i].setStyle({visibility:"visible"});
				}
			}
		};
		
		this.setData = function(isForced, buttons, hasNoButton){
			if(W.Coupon && !isForced){
				setCoupon();
			}else{
				W.getCoupon(setCoupon);
			}
			
			if(isKids && W.StbConfig.cugType == "accommodation") return;
			if(isKids) {
				if(W.StbConfig.isKidsMode) {
					_comp._kids.setStyle({display:"inline-block", "background":"url('img/08_mode_on.png')"});
				} else {
					_comp._kids.setStyle({display:"inline-block", "background":"url('img/08_mode_off.png')"});
				}
			} else {
				_comp._kids.setStyle({display:"none"});
				}
			if(buttons){
				for(var i=0; i < buttons.length; i++){
					if(buttons[i].color == "Y"){
						_comp._color[i].setStyle({display:"inline-block", "background":"url('img/color_yellow.png')"});
						btnTypes[i] = true;
					}else if(buttons[i].color == "R"){
						_comp._color[i].setStyle({display:"inline-block", "background":"url('img/color_red.png')"});
						btnTypes[i] = true;
					}else if(buttons[i].color == "B"){
						_comp._color[i].setStyle({display:"inline-block", "background":"url('img/color_blue.png')"});
						btnTypes[i] = true;
					}
					_comp._txt[i].setText(buttons[i].text);
					_comp._txt[i].setStyle({display:""});
				}
			}else{
				if(!hasNoButton){
					_comp.setStyle({x:xPos, y:yPos});
					_comp._color[0].setStyle({display:"inline-block"});
					_comp._txt[0].setText(W.Texts["optionMenu"]);
					_comp._txt[0].setStyle({display:""});
					btnTypes[0] = true;
				}
			}
		};
		
		this.getComp = function(xp, yp, w){
			xPos = xp;
			yPos = yp;
			_comp.setStyle({x:xPos, y:yPos});
			if(w){
				_comp.setStyle({width:w});
			}
			return _comp;
		};
		
		this.hideOption = function(){
			for(var i=0;i < 3; i++){
				_comp._color[i].setStyle({display:"none"});
				_comp._txt[i].setStyle({display:"none"});
			}
		};
		
		this.showOption = function(){
			for(var i=0; i < btnTypes.length; i++){
				if(btnTypes[i]){
					_comp._color[i].setStyle({display:"inline-block"});
					_comp._txt[i].setStyle({display:"inline-block"});
				}
			}
		};
		
		create();
	};

	return {
		getNewComp: function(isKids){
			return new couponInfo(isKids);
		}
	};
});