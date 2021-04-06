W.defineModule([ "mod/Util", "manager/SearchDataManager"], function(util, searchDataManager) {
	var AutoList = function(){
		var _this;
		var _parent;
		var _parentDiv;
		var list = [];
		var _comp;
		var index = 0;
		var page = 0;
		var oldIndex = 0;
		var totalPage = 0;
		
		var create = function(){
			_comp = new W.Div({x:0, y:0, width:"334px", height:"720px", backgroundColor:"rgba(0,0,0,0.5)", display:"none"});
			_parentDiv.add(_comp);

			_comp._title = new W.Span({x:35, y:159, width:"230px", height:"33px", textColor:"rgba(131,122,119,0.25)", 
				"font-size":"30px", className:"font_rixhead_medium", text:W.Texts["auto_completion"]});
			_comp.add(_comp._title);
		};

		var setData = function(){
			totalPage = Math.ceil(list.length/10);
			
			if(_comp._area){
				_comp.remove(_comp._area);
				_comp._area = undefined;
			}

			_comp._area = new W.Div({x:0, y:0, width:"334px", height:"720px"});
			_comp.add(_comp._area);
			
			if(list.length > 0){
				_comp._list_area = new W.Div({x:35, y:207, width:"233px", height:"433px", overflow:"hidden"});
				_comp._area.add(_comp._list_area);
				_comp._list = new W.Div({x:0, y:0, width:"231px", height:(43*list.length) + "px"});
				_comp._list_area.add(_comp._list);
				
				_comp._items = [];
				for(var i=0; i < list.length; i++){
					_comp._list.add(new W.Div({x:0, y:43*i, width:"231px", height:"1px", backgroundColor:"rgba(131,122,119,0.25)"}));
					_comp._items[i] = new W.Span({x:12, y:15 + 43*i, width:"210px", height:"18px", textColor:"rgba(181,181,181,0.75)", 
						"font-size":"16px", className:"font_rixhead_medium cut", text:list[i].suggestion});
					_comp._list.add(_comp._items[i]);
				}
				_comp._focus = new W.Image({x:0, y:0, width:"233px", height:"46px", src:"img/box_autoword_f.png", display:"none"});
				_comp._list.add(_comp._focus);
				
				if(totalPage > 1){
					_comp._arr = new W.Image({x:147, y:643, width:"41px", height:"41px", src:"img/arrow_navi_d.png"});
					_comp._area.add(_comp._arr);
				}
			}else{
				_comp._area.add(new W.Span({x:38, y:220, width:"230px", height:"18px", textColor:"rgba(181,181,181,0.75)", 
					"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["no_auto_completion"]}));
				_comp._area.add(new W.Span({x:38, y:250, width:"230px", height:"18px", textColor:"rgba(181,181,181,0.75)", 
					"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["no_auto_completion2"]}));
			}
			_comp.setStyle({display:""});
		};
		
		var getData = function(keyword){
			list = [];
			index = 0;
			page = 0;
			searchDataManager.complete(function(result, data){
				if(result && data.data.length > 0){
					list = data.data;
				}else{
					list = [];
				}
				setData();
			}, keyword, 20);
			setData();
		};
		
		var focus = function(){
			_comp._focus.setStyle({y:index*43, display:""});
			if(_comp._items[oldIndex]){
				_comp._items[oldIndex].setStyle({textColor:"rgba(181,181,181,0.75)"});
			}
			_comp._items[index].setStyle({textColor:"rgba(255,255,255,0.9)"});
			_comp._list.setStyle({y:-430 * (Math.floor(index/10))});
		};
		
		var unFocus = function(){
			_comp._focus.setStyle({display:"none"});
			_comp._items[index].setStyle({textColor:"rgba(181,181,181,0.75)"});
			_comp._list.setStyle({y:0});
			_comp._title.setStyle({textColor:"rgba(131,122,119,0.25)"});
		};

		this.init = function(parent, div){
			_parent = parent;
			_parentDiv = div;
			index = 0;
			list = [];
			create();
		};
		this.search = function(keyword){
			getData(keyword);
		};
		this.hasList = function(){
			return list.length > 0 ? true : false;
		};
		this.focus = function(){
			if(list.length > 0){
				_comp._title.setStyle({textColor:"rgb(237,168,2)"});
				index = 0;
				page = 0;
				focus();
				return true;
			}else{
				_comp._title.setStyle({textColor:"rgba(131,122,119,0.25)"});
				return false;
			}
		};
		this.unFocus = function(){
			index = 0;
			page = 0;
			unFocus();
		};
		this.clear = function(){
			if(_comp._area){
				_comp.remove(_comp._area);
				_comp._area = undefined;
			}
			_comp.setStyle({display:"none"});
		};
		this.operate = function(keyCode){
			oldIndex = index;
			switch (keyCode) {
			case W.KEY.LEFT:
				unFocus();
				_parent.changeState(1);
				break;
			case W.KEY.UP:
				if(index == 0) index = list.length - 1;
				else index--;
				focus();
				break;
			case W.KEY.DOWN:
				if(index == list.length - 1) index = 0;
				else index++;
				focus();
				break;
			case W.KEY.ENTER:
				_parent.search(list[index].suggestion, undefined, undefined, true, undefined, true);
				break;
			}
		};
	};
	
 	return {
 		create: function(){
			var comp = new AutoList();
			return comp;
		}
 	}
});