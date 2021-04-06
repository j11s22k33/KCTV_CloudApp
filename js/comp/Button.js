W.defineModule("comp/Button", function(){

	var Button = function(xPos, yPos, txt, width, isFocusRed, style, fontS){
		var _comp;
		
		if(xPos == "relative"){
			_comp = new W.Div({position:"relative", y:yPos, width:width + "px", height:"41px"});
		}else{
			_comp = new W.Div({x:xPos, y:yPos, width:width + "px", height:"41px"});
		}
		
		var fontHeight = "18px";
		var fontSize = "20px";
		if(fontS){
			fontSize = fontS + "px";
		}
		var fontTop = 0;
		if(width == 143){
			fontHeight = "21px";
			fontSize = "19px";
			fontTop = 0;
		} else if(width == 158) {
			fontHeight = "21px";
			fontSize = "18px";
		} else if(width == 133.5) {
			fontTop = 0;
		}
		
		
		if(style){
			_comp.setStyle(style);
		}
		_comp._unfocus = new W.Div({x:0, y:0, width:width + "px", height:"41px"});
		_comp.add(_comp._unfocus);
		_comp._unfocus.add(new W.Image({x:0, y:0, width:"20px", height:"41px", src:"img/btn_l.png"}));
		_comp._unfocus.add(new W.Image({x:20, y:0, width:(width - 40) + "px", height:"41px", src:"img/btn_m.png"}));
		_comp._unfocus.add(new W.Image({x:(width - 20), y:0, width:"20px", height:"41px", src:"img/btn_r.png"}));
		_comp._unfocus._text = new W.Span({x:0, y:fontTop, width:width + "px", height:fontHeight, lineHeight:"41px", textColor:"rgba(255,255,255,0.75)",
			"font-size":fontSize, className:"font_rixhead_medium", text:txt, textAlign:"center"});
		_comp._unfocus.add(_comp._unfocus._text);
		_comp._selected = new W.Div({x:0, y:0, width:width + "px", height:"41px", display:"none"});
		_comp.add(_comp._selected);
		_comp._selected.add(new W.Image({x:0, y:0, width:"20px", height:"41px", src:"img/btn2_l_s.png"}));
		_comp._selected.add(new W.Image({x:20, y:0, width:(width - 40) + "px", height:"41px", src:"img/btn2_m_s.png"}));
		_comp._selected.add(new W.Image({x:(width - 20), y:0, width:"20px", height:"41px", src:"img/btn2_r_s.png"}));
		_comp._selected._text = new W.Span({x:0, y:fontTop, width:width + "px", height:fontHeight, lineHeight:"41px", textColor:"rgb(255,255,255)",
			"font-size":fontSize, className:"font_rixhead_medium", text:txt, textAlign:"center"});
		_comp._selected.add(_comp._selected._text);
		_comp._focus = new W.Div({x:0, y:0, width:width + "px", height:"41px", display:"none"});
		_comp.add(_comp._focus);
		_comp._focus.add(new W.Image({x:0, y:0, width:"20px", height:"41px", src:"img/btn_l_f.png"}));
		_comp._focus.add(new W.Image({x:20, y:0, width:(width - 40) + "px", height:"41px", src:"img/btn_m_f.png"}));
		_comp._focus.add(new W.Image({x:(width - 20), y:0, width:"20px", height:"41px", src:"img/btn_r_f.png"}));
		if(isFocusRed){
			_comp._focus._text = new W.Span({x:0, y:fontTop, width:width + "px", height:fontHeight, lineHeight:"41px", textColor:"rgb(213,45,1)",
				"font-size":fontSize, className:"font_rixhead_medium", text:txt, textAlign:"center"});

		}else{
			_comp._focus._text = new W.Span({x:0, y:fontTop, width:width + "px", height:fontHeight, lineHeight:"41px", textColor:"rgb(255,255,255)",
				"font-size":fontSize, className:"font_rixhead_medium", text:txt, textAlign:"center"});
		}
		_comp._focus.add(_comp._focus._text);
		
		_comp._event = new W.Image({x:13, y:-16, width:"53px", height:"29px", src:"img/detail_icon_event.png", display:"none"});
		_comp.add(_comp._event);
		_comp._dc = new W.Image({x:13, y:-16, width:"53px", height:"29px", src:"img/detail_icon_dc.png", display:"none"});
		_comp.add(_comp._dc);
		
		this.showEventIcon = function(){
			_comp._event.setStyle({display:"block"});
		};
		
		this.showDcIcon = function(){
			_comp._dc.setStyle({display:"block"});
		};
		
		
		this.getComp = function(){
			return _comp;
		};
		
		this.focus = function(){
			_comp._unfocus.setStyle({display:"none"});
			_comp._selected.setStyle({display:"none"});
			_comp._focus.setStyle({display:""});
		};
		
		this.unFocus = function(){
			_comp._unfocus.setStyle({display:""});
			_comp._focus.setStyle({display:"none"});
			_comp._selected.setStyle({display:"none"});
		};
		
		this.selected = function(){
			_comp._unfocus.setStyle({display:"none"});
			_comp._focus.setStyle({display:"none"});
			_comp._selected.setStyle({display:""});
		};

		this.setText = function(_text) {
			_comp._unfocus._text.setText(_text);
			_comp._selected.setText(_text);
			_comp._focus.setText(_text);
		};
		
		this.setX = function(pos){
			_comp.setX(pos);
		};
	};

	return {
		create: function(xPos, yPos, txt, width, isFocusRed, style, fontS){
			var comp = new Button(xPos, yPos, txt, width, isFocusRed, style, fontS);
			return comp;
		}
	};
});