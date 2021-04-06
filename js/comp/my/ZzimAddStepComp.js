W.defineModule([ "mod/Util"], function(util) {

	function ZzimAddStepComp(_parent, type, list){
		var _comp;
		var buttons = [];
		var index = 0;
		var sIndex = -1;
		W.log.info("type ============ " + type);
		var registedCount = 0;
		this.getComp = function(){
			_comp = new W.Div({x:0, y:0, width:"600px", height:"480px", display:"none"});
			if(type == "asset"){
				_comp.add(new W.Span({x:1, y:0, width:"500px", height:"33px", textColor:"rgb(255,255,255)", 
	    			"font-size":"30px", className:"font_rixhead_medium", text:W.Texts["popup_zzim_add_step1_title"]}));
				_comp.add(new W.Span({x:1, y:40, width:"500px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
	    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_zzim_add_step1_guide"]}));
			}else if(type == "list"){
				_comp.add(new W.Span({x:1, y:0, width:"500px", height:"33px", textColor:"rgb(255,255,255)", 
	    			"font-size":"30px", className:"font_rixhead_medium", text:W.Texts["popup_zzim_add_step2_title"]}));
				_comp.add(new W.Span({x:1, y:40, width:"500px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
	    			"font-size":"18px", className:"font_rixhead_light", text:W.Texts["popup_zzim_add_step2_guide"]}));
			}

			if(!list || list.length == 0) return _comp;
			
			var top = 80 + (6 - list.length) * 33.5;
			for(var i=0; i < list.length; i++){
				buttons[i] = new W.Div({x:0, y:top + (67 * i), width:"371px", height:"58px"});
				_comp.add(buttons[i]);

				buttons[i].add(new W.Image({x:1, y:1, width:"369px", height:"56px", src:"img/box_set369.png"}));
				buttons[i]._foc = new W.Image({x:0, y:0, width:"371px", height:"58px", src:"img/box_set369_f.png", display:"none"});
				buttons[i].add(buttons[i]._foc);
				if(type == "asset"){
					var title = list[i].resolution ? list[i].resolution : "";
					if(list[i].isLifetime){
						title += " " + W.Texts["popup_zzim_option_lifetime"]
					}
					if(list[i].assetGroup != "010"){
						title += " " + util.getAssetGroupCode(list[i]);
					}
					list[i].buttonTitle = title;
					buttons[i]._text = new W.Span({x:45, y:20, width:"300px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
		    			"font-size":"20px", className:"font_rixhead_light cut", text:title});
				}else if(type == "list"){
					if(_parent.type != "series"){
						W.log.info("_parent.selectedAsset.assetId =============== " + _parent.selectedAsset.assetId);
						for(var j=0; j < list[i].list.length; j++){
							if(list[i].list[j].targetId == _parent.selectedAsset.assetId){
								list[i].isRegisted = true;
								registedCount++;
								break;
							}
						}
					}
					
					var btnTitle = list[i].title + "(" + list[i].list.length + ")";
					if(list[i].isRegisted){
						btnTitle += " [" + W.Texts["zzim_msg_registed"] + "]";
					}
					buttons[i]._text = new W.Span({x:45, y:20, width:"230px", height:"22px", textColor:"rgba(181,181,181,0.75)", 
		    			"font-size":"20px", className:"font_rixhead_light", text:btnTitle});
					
					if(list[i].isRegisted || list[i].list.length == 40){
						buttons[i].setStyle({opacity:0.5});
					}
				}
				buttons[i].add(buttons[i]._text);
				
				buttons[i].add(new W.Image({x:16, y:18, width:"22px", height:"22px", src:"img/radio_n.png"}));
				buttons[i]._radio_f = new W.Image({x:16, y:18, width:"22px", height:"22px", src:"img/radio_f.png", display:"none"});
				buttons[i].add(buttons[i]._radio_f);
			}
			
			
			if(registedCount == 5){
				W.PopupManager.openPopup({
                    childComp:_parent,
                    title:W.Texts["popup_zzim_info_title"],
                    popupName:"popup/AlertPopup",
                    boldText:W.Texts["popup_zzim_move_guide4"],
                    thinText:W.Texts["popup_zzim_move_guide5"]}
                );
			}
			return _comp;
		};
		
		this.changeList = function(){
			if(_parent.type != "series"){
				for(var i=0; i < list.length; i++){
					list[i].isRegisted = false;
					for(var j=0; j < list[i].list.length; j++){
						if(list[i].list[j].targetId == _parent.selectedAsset.assetId){
							list[i].isRegisted = true;
							break;
						}
					}
					var btnTitle = list[i].title + "(" + list[i].list.length + ")";
					if(list[i].isRegisted){
						btnTitle += " [" + W.Texts["zzim_msg_registed"] + "]";
					}
					W.log.info(btnTitle);
					buttons[i]._text.setText(btnTitle);
					
					if(list[i].isRegisted || list[i].list.length == 40){
						buttons[i].setStyle({opacity:0.5});
					}else{
						buttons[i].setStyle({opacity:1});
					}
				}
			}
		};
		
		this.reset = function(){
			if(sIndex > -1){
				buttons[sIndex]._radio_f.setStyle({display:"none"});
			}
			_parent.infoComp.setRegistBtn(false);
		};
		
		this.operate = function(event){
			unFocus();
			switch (event.keyCode) {
            case W.KEY.UP:
            	if(type == "list"){
            		for(var i=0; i < 5; i++){
            			index = (--index + list.length) % list.length;
                		if(!list[index].isRegisted && list[index].list.length < 40){
                			break;
                		}
                	}
            	}else{
                	index = (--index + list.length) % list.length;
            	}
            	
            	
            	break;
            case W.KEY.DOWN:
            	if(type == "list"){
            		for(var i=0; i < 5; i++){
            			index = (++index) % list.length;
                		if(!list[index].isRegisted && list[index].list.length < 40){
                			break;
                		}
                	}
            	}else{
                	index = (++index) % list.length;
            	}
            	break;
			}
			focus();
		};
		
		this.select = function(isFirst){
			if(sIndex > -1){
				buttons[sIndex]._radio_f.setStyle({display:"none"});
			}
			sIndex = index;
			buttons[sIndex]._radio_f.setStyle({display:"block"});
			W.log.info(isFirst);
			if(type == "asset"){
				if(!isFirst){
					_parent.stepComps[1].reset();
				}
				_parent.selectedAsset = list[sIndex];
				
				_parent.stepComps[1].changeList();
				
				_parent.infoComp.changeAsset();
				if(!isFirst){
					_parent.chageStep();
				}
			}else{
				_parent.selectedList = list[sIndex];
				_parent.infoComp.changeListTitle(list[sIndex].title);
				_parent.infoComp.setRegistBtn(true);
			}
		};
		
		this.getSelectedIndex = function(){
			return sIndex;
		};
		
		this.focus = function(){
			_comp.setStyle({display:"block"});
			if(type == "list"){
        		for(var i=0; i < 5; i++){
            		if(!list[index].isRegisted && list[index].list.length < 40){
            			break;
            		}
            		index = (++index) % list.length;
            	}
        	}
			focus();
		};
		
		this.unFocus = function(isBack){
			unFocus();
			if(isBack){
				index = 0;
				_comp.setStyle({display:"none"});
			}else{
				if(type != "list"){
					_comp.setStyle({display:"none"});
				}
			}
		};

		function focus(){
			W.log.info(type);
			if(type == "asset"){
				_parent.infoComp.changeProductTitle(list[index].buttonTitle);
			}else{
				_parent.infoComp.changeListTitle(list[index].title);
			}
			
			buttons[index]._text.setStyle({textColor:"rgb(255,255,255)"});
			buttons[index]._foc.setStyle({display:"block"});
		};
		
		function unFocus(){
			buttons[index]._text.setStyle({textColor:"rgba(181,181,181,0.75)"});
			buttons[index]._foc.setStyle({display:"none"});
		};
	};

	return ZzimAddStepComp;
});