W.defineModule(function(){

	var Button = function(xPos, yPos, txt, width){
		var _comp;
		
		_comp = new W.Div({x:xPos, y:yPos, width:width + "px", height:"45px"});
		_comp._unfocus = new W.Div({x:0, y:0, width:width + "px", height:"45px"});
		_comp.add(_comp._unfocus);
		_comp._unfocus.add(new W.Image({x:0, y:0, width:"162px", height:"45px", src:"img/kids_cha_title.png"}));
		_comp._unfocus.add(new W.Span({x:0, y:9, width:width + "px", height:"24px", textColor:"rgba(255,255,255,0.75)",
			"font-size":"22px", className:"font_rixhead_medium", text:txt, textAlign:"center"}));
		_comp._selected = new W.Div({x:0, y:0, width:width + "px", height:"41px", display:"none"});
		_comp.add(_comp._selected);
		_comp._selected.add(new W.Image({x:0, y:0, width:"162px", height:"45px", src:"img/kids_cha_title.png"}));
		_comp._selected.add(new W.Span({x:0, y:9, width:width + "px", height:"24px", textColor:"rgb(255,255,255)",
			"font-size":"22px", className:"font_rixhead_medium", text:txt, textAlign:"center"}));
		_comp._focus = new W.Div({x:0, y:0, width:width + "px", height:"53px", display:"none"});
		_comp.add(_comp._focus);
		_comp._focus.add(new W.Image({x:-1, y:-1, width:"168px", height:"53px", src:"img/kids_cha_title_f.png"}));
		_comp._focus.add(new W.Span({x:0, y:9, width:width + "px", height:"24px", textColor:"rgb(255,255,255)",
			"font-size":"22px", className:"font_rixhead_medium", text:txt, textAlign:"center"}));
		
		_comp._event = new W.Image({x:13, y:-16, width:"53px", height:"29px", src:"img/detail_icon_event.png", display:"none"});
		_comp.add(_comp._event);
		_comp._dc = new W.Image({x:13, y:-16, width:"53px", height:"29px", src:"img/detail_icon_dc.png", display:"none"});
		_comp.add(_comp._dc);
		
		this.showEventIcon = function(){
			_comp._dc.setStyle({display:"none"});
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

		this.setX = function(pos){
			_comp.setX(pos);
		};
	};

	return {
		create: function(xPos, yPos, txt, width){
			var comp = new Button(xPos, yPos, txt, width);
			return comp;
		}
	};
});