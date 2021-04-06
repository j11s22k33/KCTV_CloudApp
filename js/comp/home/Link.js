W.defineModule("comp/home/Link", [ "mod/Util"], function(util) {
	function Link(){
		var _this;
	 	var _parent;
	 	var _comp;
	 	var isMain;
	 	var menu;
	 	var type;
	 	
	 	function getSingleImage(platform){
	 		W.log.info(menu);
	 		var img;
	 		if(menu.custom){
	 			img = menu.custom.image;
	 			if(platform == "S"){
	 				img = W.Config.IMAGE_URL + img;
	 			}
	 		}
	 		var _link = new W.Image({x:89, y:isMain?526:576, width:"1102px", src:img});
	 		return _link;
	 	};
	 	
	 	function getFavChannel(){
	 		var _link = new W.Div({x:0, y:isMain?526:576, width:"1280px", height:"300px"});
	 		_link.add(new W.Span({x:0, y:0, width:"1280px", height:"22px", textColor:"rgb(255,255,255)", textAlign:"center",
				"font-size":"20px", className:"font_rixhead_light", text:W.Texts["no_fav_ch_guide"]}));
	 		_link.add(new W.Span({x:0, y:62, width:"1280px", height:"22px", textColor:"rgb(237,168,2)", textAlign:"center",
				"font-size":"20px", className:"font_rixhead_light", text:W.Texts["regist_fav_guide"]}));
			if(W.StbConfig.isUHD) {
				_link.add(new W.Image({x:495, y:95, width:"290px", height:"158px", src:"img/image_home_remote_uhd.png"}));
			} else {
				_link.add(new W.Image({x:495, y:95, width:"290px", height:"158px", src:"img/image_home_remote.png"}));
			}

	 		var regist_fav_key_guide1 = W.Texts["regist_fav_key_guide1"].split("^");
	 		var regist_fav_key_guide2 = W.Texts["regist_fav_key_guide2"].split("^");

	 		var no = 0;
	 		for(var i=0; i < regist_fav_key_guide1.length; i++){
	 			if(regist_fav_key_guide1[i].indexOf("@img@") > -1){
	 				var _tmpDiv = new W.Div({x:248, y:135, width:"250px", height:"19px", textAlign:"right"});
	 				_link.add(_tmpDiv);
	 				var mixedArr = regist_fav_key_guide1[i].split("@");
	 				for(var j=0; j < mixedArr.length; j++){
	 					if(mixedArr[j] == "img"){
	 						_tmpDiv.add(new W.Image({position:"relative", y:7, width:"65px", height:"65px", src:"img/color_yellow_mini.png",
	 							"margin":"-22px"}));
	 					}else{
	 						_tmpDiv.add(new W.Span({position:"relative", y:-7, height:"19px", textColor:"rgba(255,255,255,0.7)",
	 		 					"font-size":"17px", className:"font_rixhead_light", text:mixedArr[j]}));
	 					}
	 				}
	 			}else{
					_link.add(new W.Span({x:0, y:163, width:"498px", height:"19px", textColor:"rgba(255,255,255,0.7)",
						"font-size":"17px", className:"font_rixhead_light", text:regist_fav_key_guide1[i], textAlign:"right"}));
	 			}
	 			no++;
	 		}
			_link.add(new W.Span({x:786, y:138, width:"350px", height:"19px", textColor:"rgba(255,255,255,0.7)",
				"font-size":"17px", className:"font_rixhead_light", text:regist_fav_key_guide2[0]}));
			_link.add(new W.Span({x:786, y:163, width:"550px", height:"19px", textColor:"rgba(255,255,255,0.7)",
				"font-size":"17px", className:"font_rixhead_light", text:regist_fav_key_guide2[1]}));
	 		return _link;
	 	};

	 	this.isFixed = function(){
			if(isMain) return true;
			return false;
		};
		this.create = function(parent, isM, m){
			_parent = parent;
			isMain = isM;
			menu = m;
			
			_comp = new W.Div({id:"home_link", className:"bgSize", opacity:0.8});
			W.log.info(menu);
			if(menu.menuType == "MC0009"){
				var uimDataManager = W.getModule("manager/UiPlfDataManager");
				uimDataManager.getPromotionList(function(result, data){
					if(result){
						menu.custom = data.custom;
						_comp._link = getSingleImage("U");
						_comp.add(_comp._link);
					}
					W.visibleHomeScene();
				}, {targetId:menu.baseId, offset:0, limit:1});
			}else{
				_comp._link = getSingleImage("S");
				_comp.add(_comp._link);
				W.visibleHomeScene();
			}
			
			return _comp;
		};
		this.getComp = function(){
			return _comp;
		};
		this.destroy = function() {
			
		};
		this.changeMode = function(mode){
			W.log.info("mode --------------------------------------------============== " + mode);
			if(mode == 0){
				_comp.setY(32);
			}else{
				_comp.setY(-190 * mode);
			}
		};
		this.hasData = function(){
			return true;
		};
		this.hasList = function(){
			return true;
		};
		this.focus = function(isFirst){

		};
		this.unFocus = function(currState){

		};
		this.operate = function(event){
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.UP:
				isConsume = true;
				break;
			case W.KEY.ENTER:
				W.log.info(menu);
				W.LinkManager.action("L", menu.custom ? menu.custom.link : menu.link);
				isConsume = true;
				break;
			}
			return isConsume;
		};
	}
 	
	return {
		getNewComp : function(){
			return new Link();
		}
	}
});