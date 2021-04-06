W.defineModule(function(){

	var Button = function(xPos, yPos, txt, style){
		var _comp;
		if(xPos == "relative"){
			_comp = new W.Div({position:"relative", y:yPos, width:"142px", height:"40px"});
		}else{
			_comp = new W.Div({x:xPos, y:yPos, width:"142px", height:"40px"});
		}
		
		if(style){
			_comp.setStyle(style);
		}
		
		_comp._unfocus = new W.Div({x:0, y:0, width:"142px", height:"40px"});
		_comp.add(_comp._unfocus);
		_comp._unfocus.add(new W.Image({x:0, y:0, width:"142px", height:"40px", src:"img/kids_pop_bt_d_dim.png"}));
		_comp._unfocus._text = new W.Span({x:0, y:10, width:"142px", height:"20px", textColor:"rgb(79,68,59)",
			"font-size":"18px", className:"font_rixhead_medium", text:txt, textAlign:"center"});
		_comp._unfocus.add(_comp._unfocus._text);
		_comp._selected = new W.Div({x:0, y:0, width:"142px", height:"40px", display:"none"});
		_comp.add(_comp._selected);
		_comp._selected.add(new W.Image({x:0, y:0, width:"142px", height:"40px", src:"img/kids_pop_bt_d.png"}));
		_comp._selected._text = new W.Span({x:0, y:10, width:"142px", height:"20px", textColor:"rgb(255,255,255)",
			"font-size":"18px", className:"font_rixhead_medium", text:txt, textAlign:"center"});
		_comp._selected.add(_comp._selected._text);
		_comp._focus = new W.Div({x:0, y:0, width:"142px", height:"40px", display:"none"});
		_comp.add(_comp._focus);
		_comp._focus.add(new W.Image({x:0, y:0, width:"142px", height:"40px", src:"img/kids_pop_bt_d_f.png"}));
		_comp._focus._text = new W.Span({x:0, y:10, width:"142px", height:"20px", textColor:"rgb(255,255,255)",
			"font-size":"18px", className:"font_rixhead_medium", text:txt, textAlign:"center"});
		_comp._focus.add(_comp._focus._text);
		
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
	};

	return {
		create: function(xPos, yPos, txt, style){
			var comp = new Button(xPos, yPos, txt, style);
			return comp;
		}
	};
});