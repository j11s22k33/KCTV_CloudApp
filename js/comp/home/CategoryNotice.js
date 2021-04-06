//@preDefine
W.defineModule("comp/home/CategoryNotice", [ "mod/Util"], function(util) {
	function CategoryNotice(){
		var noticeHideTimeout;
		var noticeShowTimeout;
		var _comp;
		var categoryIds = [];
		function show(category){
			for(var i=0; i < categoryIds.length; i++){
				if(categoryIds[i] == category.categoryId){
					hide();
					return;
				}
			}
			
			if(!_comp){
				_comp = new W.Div({id:"home_notice_area", x:0, y:483, width:"1280px", height:"237px", display:"none", "z-index":100});
				_comp.add(new W.Image({x:0, y:0, width:"1280px", height:"237px", src:"img/bg_alarm.png"}));
				W.root.add(_comp);
				
				
				_comp._title = new W.Div({x:0, y:665-483, width:"1280px", height:"20px", display:"none"});
				_comp.add(_comp._title);
				_comp._title.add(new W.Image({x:55, y:666-665, width:"11px", height:"8px", src:"img/icon_notice.png"}));
				_comp._title.add(new W.Span({x:70, y:0, width:"70px", height:"20px", textColor:"rgba(237,168,2,0.9)", "font-size":"18px", 
					className:"font_rixhead_medium", text:W.Texts["notice"]}));
				_comp._title._text = new W.Span({x:147, y:0, width:"1100px", height:"20px", textColor:"rgb(181,181,181)", "font-size":"18px", 
					className:"font_rixhead_light", text:""});
				_comp._title.add(_comp._title._text);
				
				_comp._desc = new W.Span({x:70, y:667-483, height:"18px", width:"1100px", textColor:"rgba(131,122,119,0.75)", "font-size":"16px", 
					className:"font_rixhead_light", text:"", display:"none"});
				_comp.add(_comp._desc);
			}
			
			_comp._title._text.setText(category.notice.noticeTitle);
			if(category.notice.noticeDescription){
				_comp._desc.setText(category.notice.noticeDescription);
				_comp._desc.setStyle({display:"block"});
				_comp._title.setStyle({y:640-483});
			}else{
				_comp._title.setStyle({y:665-483});
			}
			_comp._title.setStyle({display:"block"});
			_comp.setStyle({display:"block"});
			
			categoryIds.push(category.categoryId);
		};
		
		function hide(){
			if(_comp){
				_comp.setStyle({display:"none"});
				if(_comp._desc) _comp._desc.setStyle({display:"none"});
				if(_comp._title) _comp._title.setStyle({display:"none"});
			}
		};
		
		this.show = function(category){
			W.log.info(category);
			if(category.notice && category.notice.noticeTitle){
				clearTimeout(noticeHideTimeout);
				clearTimeout(noticeShowTimeout);
				noticeShowTimeout = setTimeout(function(category){
					show(category);
				}, W.Config.KEY_TIMEOUT_TIME, category);
				noticeHideTimeout = setTimeout(hide, 1000 * 10);
			}
		};
		
		this.hide = function(){
			clearTimeout(noticeHideTimeout);
			clearTimeout(noticeShowTimeout);
			hide();
		};
	}
 	
	return {
		getNewComp : function(){
			return new CategoryNotice();
		}
	}
});