W.defineModule([ "mod/Util", "manager/ProductProcessManager"], function(util, ProductProcessManager) {
	function ResultText(){
		var _this;
		var _parent;
		var _parentDiv;
		var type;
		var _comp;
		var index = 0;
		var page = 0;
		var totalPage = 0;
		var barHeight = 0;
		var sortingIndex = 0;
		
		function purchaseCallback(result){
	    	W.log.info(result);
	    	if(result.result == "SUCCESS"){
	    		setTimeout(function(){
   				 	var popup = {
         				popupName:"popup/purchase/PurchaseCompletePopup",
         				contents:result.asset
         			};
     	    		W.PopupManager.openPopup(popup);
   			 	}, 300, asset);
	    	}else{
	    		W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/ErrorPopup",
                    code:result.resultData.error.code,
					from : "SDP"}
                );
	    	}
	    };
	    
		var productProcessManager = ProductProcessManager.getManager(purchaseCallback);
		
		var create = function(){
			_comp = new W.Div({x:389, y:0, width:"860px", height:"720px", display:"none"});
			_parentDiv.add(_comp);
			
			var _poster_area = new W.Div({x:979-389, y:0, width:"210px", height:"720px", overflow:"hidden"});
			_comp.add(_poster_area);
			_comp._poster_area = new W.Div({x:0, y:0, width:"210px"});
			_poster_area.add(_comp._poster_area);
			
			var _list_area = new W.Div({x:0, y:189, width:"500px", height:"558px", overflow:"hidden"});
			_comp.add(_list_area);
			_comp._list_area = new W.Div({x:0, y:0, width:"500px"});
			_list_area.add(_comp._list_area);
			
			_comp._posters = [];
			_comp._titles = [];
			
			drawList(0);
			
			_comp._focus = new W.Image({x:0, y:0, width:"500px", height:"59px", src:"img/box_result_h59.png", display:"none"});
			_comp._list_area.add(_comp._focus);
			
			_comp._bar_area = new W.Div({x:926-389, y:189, width:"3px", height:"471px"});
			_comp.add(_comp._bar_area);
			_comp._bar_area.add(new W.Div({x:1, y:0, width:"1px", height:"471px", backgroundColor:"rgba(131,122,119,0.25)"}));
			_comp._bar = new W.Div({x:0, y:0, width:"3px", height:barHeight + "px", backgroundColor:"rgb(131,122,119)"});
			_comp._bar_area.add(_comp._bar);
		};
		
		var drawList = function(startNo){
			W.log.info("startNo -=== " + startNo);
			W.log.info("type -=== " + type);
			for(var i=startNo; i < startNo + 27;i++){
				if(i >= _parent.results[type].total){
					break;
				}
				
				_comp._posters[i] = new W.Div({x:0, y:218 + 300 * i, width:"210px", height:"300px", display:"none"});
				_comp._poster_area.add(_comp._posters[i]);
				
				if(type == "product"){
					var posterUrl = undefined;
					if(_parent.results[type].data[i].images) {
	                    for (var j = 0; j < _parent.results[type].data[i].images.length; j++) {
	                        if (_parent.results[type].data[i].images[j].type == "02") {
	                            posterUrl = W.Config.IMAGE_URL + _parent.results[type].data[i].images[j].path;
	                            break;
	                        }
	                    }
	                }
					
					_comp._posters[i]._img = new W.Image({x:0, y:0, width:"210px", height:"300px", src:posterUrl, opacity:0.5});
				}else{
					_comp._posters[i]._img = new W.Image({x:0, y:0, width:"210px", height:"300px", src:util.getPosterFilePath(_parent.results[type].data[i].posterBaseUrl, 210), opacity:0.5});
				}
				
				
				
				_comp._posters[i].add(_comp._posters[i]._img);
				_comp._posters[i]._dim = new W.Div({x:0, y:0, width:"210px", height:"300px", backgroundColor:"rgba(0,0,0,0.6)", display:""});
				_comp._posters[i].add(_comp._posters[i]._dim);
				
				if(_parent.results[type].data[i].rating && util.getRating() && _parent.results[type].data[i].rating >= util.getRating()) {
					_comp._posters[i]._lock = new W.Image({x:156, y:13, width:"41px", height:"45px", src:"img/icon_age_lock.png"});
					_comp._posters[i].add(_comp._posters[i]._lock);
                }
				
				
				if(i < _parent.results[type].total){
					_comp._list_area.add(new W.Div({x:1, y:56 * i, width:"498px", height:"1px", backgroundColor:"rgba(131,122,119,0.25)"}));
				}
				
				var title = _parent.results[type].data[i].title;
				if(title.length > 24){
					title = title.substr(0,24) + "..";
				}
				
				var ratingImg = "info_all_2.png";
	            if(_parent.results[type].data[i].rating == "0" || _parent.results[type].data[i].rating == "00") ratingImg = "info_all_2.png";
	            else if(_parent.results[type].data[i].rating == "7") ratingImg = "info_7_2.png";
	            else if(_parent.results[type].data[i].rating == "12") ratingImg = "info_12_2.png";
	            else if(_parent.results[type].data[i].rating == "15") ratingImg = "info_15_2.png";
	            else if(_parent.results[type].data[i].rating == "19" || _parent.results[type].data[i].rating == "19+") ratingImg = "info_19_2.png";

				_comp._titles[i] = new W.Div({x:29, y:18 + 56 * i, width:"446px", height:"26px"});
				_comp._list_area.add(_comp._titles[i]);
				
				_comp._titles[i]._normal = new W.Div({x:0, y:0, width:"446px", height:"26px", textAlign:"left"});
				_comp._titles[i].add(_comp._titles[i]._normal);
				
				_comp._titles[i]._foc = new W.Div({x:0, y:0, width:"446px", height:"26px", textAlign:"left", display:"none"});
				_comp._titles[i].add(_comp._titles[i]._foc);
				
				_comp._titles[i]._normal.add(new W.Span({position:"relative", y:0, height:"26px", textColor:"rgba(181,181,181,0.9)", 
					"font-size":"24px", className:"font_rixhead_light", text:title, display:"inline-block", "padding-right":"10px"}));
				_comp._titles[i]._foc.add(new W.Span({position:"relative", y:0, height:"26px", textColor:"rgba(255,255,255,0.9)", 
					"font-size":"24px", className:"font_rixhead_medium", text:title, display:"inline-block", "padding-right":"10px"}));
				
				_comp._titles[i]._normal.add(new W.Image({position:"relative", y:4, width:"21px", height:"21px", src:"img/" + ratingImg, "padding-right":"5px"}));
				_comp._titles[i]._foc.add(new W.Image({position:"relative", y:4, width:"21px", height:"21px", src:"img/" + ratingImg, "padding-right":"5px"}));
				
				if(_parent.results[type].data[i].asset){
					if(_parent.results[type].data[i].asset.originProduct != "FOD"){
						_comp._titles[i]._normal.add(new W.Image({position:"relative", y:4, width:"21px", height:"21px", src:"img/info_pay_2.png", "padding-right":"5px"}));
						_comp._titles[i]._foc.add(new W.Image({position:"relative", y:4, width:"21px", height:"21px", src:"img/info_pay_2.png", "padding-right":"5px"}));
					}
				}
			}
		};

		var focus = function(){
			if(_comp._titles[index]){
				_comp._titles[index]._foc.setStyle({display:"block"});
				_comp._titles[index]._normal.setStyle({display:"none"});
				_comp._posters[index].setStyle({"display": "block"});
				_comp._posters[index]._img.setStyle({opacity:1});
				if(_parent.results[type].data[index].rating && util.getRating() && _parent.results[type].data[index].rating >= util.getRating()) {
					_comp._posters[index]._dim.setStyle({display:"block"});
                }else{
    				_comp._posters[index]._dim.setStyle({display:"none"});
                }
				
				_comp._focus.setStyle({y:index*56});
				_comp._poster_area.setStyle({y:-300*index});
				_comp._list_area.setStyle({y:-504*page});
				_comp._bar.setStyle({y:barHeight*page});
				
				if(index + 18 < _parent.results[type].total && !_comp._titles[index + 18]){
					var startIdx = Math.floor((index + 18)/27);
					_parent.isKeyLock = true;
					_parent.getList(type, startIdx * 27, startIdx * 27 + 27, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
						for(var i=0; i < data[type].data.length; i++){
							_parent.results[type].data[param + i] = data[type].data[i];
						}
						drawList(param);
						_parent.isKeyLock = false;
					}, startIdx * 27);
				}
			}else{
				var startIdx = Math.floor(index/27);
				_parent.isKeyLock = true;
				_parent.getList(type, startIdx * 27,  startIdx * 27 + 27, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
					for(var i=0; i < data[type].data.length; i++){
						_parent.results[type].data[param + i] = data[type].data[i];
					}
					drawList(param);
					focus();
					_parent.isKeyLock = false;
				}, startIdx*27);
			}
		};
		
		var unFocus = function(){
			_comp._titles[index]._foc.setStyle({display:"none"});
			_comp._titles[index]._normal.setStyle({display:"block"});
			_comp._titles[index].setStyle({textColor:"rgba(181,181,181,0.9)", className:"font_rixhead_light cut"});
			_comp._posters[index].setStyle({"display": "none"});
			_comp._posters[index]._img.setStyle({opacity:0.5});
			_comp._posters[index]._dim.setStyle({display:""});
		};
		
		this.getSortingIdx = function(){
			return sortingIndex; 
		};
		
		this.resetList = function(idx, isMenu){
			sortingIndex = idx;
			for(var i=0; i < _parent.results[type].total; i++){
				if(_comp._posters[i]){
					_comp._poster_area.remove(_comp._posters[i]);
				}
				if(_comp._titles[i]){
					_comp._list_area.remove(_comp._titles[i]);
				}
			}
			_comp._posters = [];
			_comp._titles = [];
			index = 0;
			page = 0;
			
			_parent.isKeyLock = true;
			_parent.getList(type, 0, 27, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
				for(var i=0; i < data[type].data.length; i++){
					_parent.results[type].data[param + i] = data[type].data[i];
				}
				drawList(param);
				if(!isMenu){
					focus();
				}
				_parent.isKeyLock = false;
			}, 0);
		};
		
		this.init = function(parent, div, data){
			_parent = parent;
			_parentDiv = div;
			type = data;
			index = 0;
			page = 0;
			sortingIndex = 1;
			_this = this;
			
			totalPage = Math.ceil(_parent.results[type].total/9);
			barHeight = 471/totalPage;
			W.log.info("totalPage ==== " + totalPage);
			W.log.info("barHeight ==== " + barHeight);
			create();
			_comp._bar_area.setStyle({display:totalPage > 1 ? "block" : "none"});
		};
		
		this.focus = function(){
			_comp._focus.setStyle({display:"block"});
			focus();
		};
		
		this.unFocus = function(){
			_comp._focus.setStyle({display:"none"});
			unFocus();
			_comp._focus.setStyle({y:0});
			_comp._poster_area.setStyle({y:0});
			_comp._list_area.setStyle({y:0});
			_comp._bar.setStyle({y:0});
			index = 0;
		};
		
		this.operate = function(event){
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.UP:
				unFocus();
				if(index == 0) index = _parent.results[type].total - 1;
				else index--;
				page = Math.floor(index/9);
				focus();
				isConsume = true;
				break;
			case W.KEY.DOWN:
				unFocus();
				if(index == _parent.results[type].total - 1) index = 0;
				else index++;
				page = Math.floor(index/9);
				focus();
				isConsume = true;
				break;
			case W.KEY.ENTER:
				if(type == "vod" || type == "vseries"){
            		if(!_parent.isClearPin && _parent.results[type].data[index].rating && util.getRating() && _parent.results[type].data[index].rating >= util.getRating()) {
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            childComp:_this
                        };
                        W.PopupManager.openPopup(popup);
                    }else{
                    	var sceneName = "scene/vod/VodDetailScene";
                    	if(_parent.results[type].data[index].contentCategory == "07"){
                    		sceneName = "scene/kids/KidsVodDetailScene";
                    	}
                    	W.SceneManager.startScene({sceneName:sceneName, 
            				param:{data:_parent.results[type].data[index]},
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
            	}else if(type == "product"){
            		productProcessManager.process(_parent.results[type].data[index]);
            	}
            	isConsume = true;
				break;
			}
			return isConsume;
		};
		
		this.onPopupClosed = function (popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	_parent.isClearPin = true;
                    	var sceneName = "scene/vod/VodDetailScene";
                    	if(_parent.results[type].data[index].contentCategory == "07"){
                    		sceneName = "scene/kids/KidsVodDetailScene";
                    	}
                    	W.SceneManager.startScene({sceneName:sceneName, 
            				param:{data:_parent.results[type].data[index]},
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
                }
            }
		};
		
		this.show = function(){
			_comp.setStyle({display:"block"});
		};
		
		this.hide = function(){
			_comp.setStyle({display:"none"});
		};
		
		this.getType = function(){
			return type;
		};
	}
 	

	return {
		getNewComp : function(){
			return new ResultText();
		}
	};
});