W.defineModule("comp/home/PinCheck", [ "mod/Util"], function(util) {
	function PinCheck(){
		var _this;
	 	var _parent;
	 	var _comp;
	 	var isMain;
	 	var pin;
	 	var wrongCount = 0;

		var create = function(){
			wrongCount = 0;
			_comp = new W.Div({id:"home_pin_check", className:"bgSize", opacity:0.8});
			W.log.info("isMain ================== " + isMain);
			if(isMain){
				_comp._text = new W.Span({x:270, y:546, width:"740px", height:"22px", textColor:"rgba(255,255,255,0.7)", textAlign:"center", 
					"font-size":"20px", className:"font_rixhead_light", text:W.Texts["adult_pin_guide1"] + ". " + W.Texts["adult_pin_guide2"]});
				_comp.add(_comp._text);
				_comp._text_wrong = new W.Span({x:270, y:546, width:"740px", height:"22px", textColor:"rgba(255,255,255,0.7)", textAlign:"center", 
					"font-size":"20px", className:"font_rixhead_light", text:W.Texts["adult_pin_guide1"] + ". " + W.Texts["adult_pin_guide2"], display:"none"});
				_comp.add(_comp._text_wrong);
				_comp._text_wrong.comp.innerHTML = "<span style='position:relative;color:#EDA802'>" + (W.Texts["popup_pin_adult"]) +
				"</span> <span style='position:relative'>" + W.Texts["popup_pin_not_correct"] + ". " + W.Texts["adult_pin_guide2"] + "</span>";
				
				_comp._text2 = new W.Span({x:320, y:546, width:"640px", height:"22px", textColor:"rgba(255,255,255,0.7)", textAlign:"center", 
					"font-size":"20px", className:"font_rixhead_light", text:W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER, display:"none"});
				_comp.add(_comp._text2);
				_comp._box = new W.Image({x:518, y:591, width:"244px", height:"56px", src:"img/box_set244_input.png"});
				_comp.add(_comp._box);
				_comp._box_f = new W.Image({x:517, y:590, width:"246px", height:"58px", src:"img/box_set244_f.png", display:"none"});
				_comp.add(_comp._box_f);
				_comp._stars = new W.Span({x:518, y:614, width:"244px", height:"24px", textColor:"rgb(255,255,255)", textAlign:"center", 
					"font-size":"22px", className:"font_rixhead_extrabold", text:""});
				_comp.add(_comp._stars);
			}else{
				_comp._text = new W.Span({x:270, y:596, width:"740px", height:"22px", textColor:"rgba(255,255,255,0.7)", textAlign:"center", 
					"font-size":"20px", className:"font_rixhead_light", text:W.Texts["adult_pin_guide1"]});
				_comp.add(_comp._text);
				_comp._text_wrong = new W.Span({x:270, y:626, width:"740px", height:"22px", textColor:"rgba(255,255,255,0.7)", textAlign:"center", 
					"font-size":"20px", className:"font_rixhead_light", text:W.Texts["adult_pin_guide1"] + ". " + W.Texts["adult_pin_guide2"], display:"none"});
				_comp.add(_comp._text_wrong);
				_comp._text_wrong.comp.innerHTML = "<span style='position:relative;color:#EDA802'>" + (W.Texts["popup_pin_adult"]) +
				"</span> <span style='position:relative'>" + W.Texts["popup_pin_not_correct"] + ". " + W.Texts["adult_pin_guide2"] + "</span>";
				_comp._text2 = new W.Span({x:320, y:626, width:"640px", height:"22px", textColor:"rgba(255,255,255,0.7)", textAlign:"center", 
					"font-size":"20px", className:"font_rixhead_light", text:W.Texts["adult_pin_guide2"]});
				_comp.add(_comp._text2);
				_comp._box = new W.Image({x:518, y:681, width:"244px", height:"56px", src:"img/box_set244_input.png"});
				_comp.add(_comp._box);
				_comp._box_f = new W.Image({x:517, y:680, width:"246px", height:"58px", src:"img/box_set244_f.png", display:"none"});
				_comp.add(_comp._box_f);
				_comp._stars = new W.Span({x:518, y:704, width:"244px", height:"24px", textColor:"rgb(255,255,255)", textAlign:"center", 
					"font-size":"22px", className:"font_rixhead_extrabold", text:""});
				_comp.add(_comp._stars);
			}
			return _comp;
		};
		
		var focus = function(isFirst){
			W.log.info("PinCheck focus !!!!!");
			_comp._box_f.setStyle({display:"block"});
			_comp._box.setStyle({display:"none"});
			_comp.setStyle({opacity:1});
		};
		
		var unFocus = function(currState){
			W.log.info("PinCheck unFocus !!!!!");
			_comp._box_f.setStyle({display:"none"});
			_comp._box.setStyle({display:"block"});
			_comp.setStyle({opacity:0.8});
		};
		
		function checkPin(){
			W.CloudManager.authPin(function(data){
				if(data.data == "OK"){
					_parent.clearAdult();
				}else{
					if(wrongCount >= 4){
						if(isMain){
							_comp._text_wrong.setStyle({y:527, display:"block"});
							_comp._text.setStyle({display:"none"});
							_comp._text2.setStyle({display:"block", y:554});
						}else{
							_comp._text_wrong.setStyle({display:"block", y:626-40});
							_comp._text.setStyle({display:"none"});
							_comp._text2.setText(W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER);
							_comp._text2.setStyle({display:"block"});
						}
					}else{
						if(isMain){
							_comp._text_wrong.setStyle({display:"block"});
							_comp._text.setStyle({display:"none"});
							_comp._text2.setStyle({display:"none"});
						}else{
							_comp._text_wrong.setStyle({display:"block"});
							_comp._text.setStyle({display:"none"});
							_comp._text2.setStyle({display:"none"});
						}
					}
					pin = "";
					_comp._stars.setText("");
					wrongCount++;
				}
			}, pin, true);
		};
		this.name = "pinCheckComp";
		this.isFixed = function(){
			if(isMain) return true;
			return false;
		};
		this.create = function(parent, isM){
			W.CloudManager.addNumericKey();
			_parent = parent;
			isMain = isM;
			pin = "";
			return create();
		};
		this.getComp = function(){
			return _comp;
		};
		this.destroy = function() {
			W.CloudManager.delNumericKey();
		};
		this.changeMode = function(mode){
			W.log.info("mode --------------------------------------------============== " + mode);
			_comp.setY(-174 * mode);
		};
		this.hasData = function(){
			return true;
		};
		this.focus = function(isFirst){
			focus(isFirst);
			pin = "";
		};
		this.unFocus = function(currState){
			unFocus(currState);
			_comp._stars.setText("");
		};
		this.operate = function(event){
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.NUM_0:
			case W.KEY.NUM_1:
			case W.KEY.NUM_2:
			case W.KEY.NUM_3:
			case W.KEY.NUM_4:
			case W.KEY.NUM_5:
			case W.KEY.NUM_6:
			case W.KEY.NUM_7:
			case W.KEY.NUM_8:
			case W.KEY.NUM_9:
				pin += (event.keyCode - 48)+"";
				var stars = "";
				for(var i=0; i < pin.length; i++){
					if(i == 0){
						stars += "*";
					}else{
						stars += " *";
					}
				}
				_comp._stars.setText(stars);
				if(pin.length == 4){
					checkPin();
				}
				isConsume = true;
				break;
            case W.KEY.DELETE:
			case W.KEY.LEFT:
				if(pin.length > 0){
					pin = pin.substr(0, pin.length-1);
					var stars = "";
					for(var i=0; i < pin.length; i++){
						if(i == 0){
							stars += "*";
						}else{
							stars += " *";
						}
					}
					_comp._stars.setText(stars);
				}
				isConsume = true;
				break;
			case W.KEY.RIGHT:
				isConsume = true;
				break;
			case W.KEY.ENTER:
				checkPin();
				isConsume = true;
				break;
			}
			return isConsume;
		};
	}
 	
	return {
		getNewComp: function(){
			return new PinCheck();
		}
	}
});