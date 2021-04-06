W.defineModule([ "mod/Util", "comp/list/Poster", "manager/ProductProcessManager"], function(util, Poster, ProductProcessManager) {
	function ResultPoster(){
		var _this;
		var _parent;
		var _parentDiv;
		var type;
		var _comp;
		var index = 0;
		var page = 0;
		var oldIndex = 0;
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
	    	}else if(result.result == "BACK"){
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
			_comp = new W.Div({x:313, y:180, width:"967px", height:"540px", overflow:"hidden", display:"none"});
			_parentDiv.add(_comp);
			_comp._list = new W.Div({x:0, y:0, width:"967px", height:"540px"});
			_comp.add(_comp._list);
			_comp.posters = [];
			_comp._postersComp = [];
			
			drawList(0);
			
			_comp._bar_area = new W.Div({x:1208-313, y:9, width:"3px", height:"471px"});
			_comp.add(_comp._bar_area);
			_comp._bar_area.add(new W.Div({x:1, y:0, width:"1px", height:"471px", backgroundColor:"rgba(131,122,119,0.25)"}));
			_comp._bar = new W.Div({x:0, y:0, width:"3px", height:barHeight + "px", backgroundColor:"rgb(131,122,119)"});
			_comp._bar_area.add(_comp._bar);
		};
		
		var drawList = function(startNo){
			W.log.info("startNo -=== " + startNo);
			for(var i=startNo; i < startNo + 28;i++){
				if(i >= _parent.results[type].total){
					break;
				}
				if(type == "product"){
					_comp.posters[i] = new Poster({type:Poster.TYPE.W113, data:_parent.results[type].data[i], textAlign: i%7 > 4 ? "right" : "left", isSearchProduct:true});
				}else{
					_comp.posters[i] = new Poster({type:Poster.TYPE.W113, data:_parent.results[type].data[i], textAlign: i%7 > 4 ? "right" : "left"});
				}
    			_comp._postersComp[i] = _comp.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:7 + 123*(i%7), y:9 + 247 * Math.floor(i/7)});
                _comp._list.add(_comp._postersComp[i]);
			}
		};
		
		this.getSortingIdx = function(){
			return sortingIndex;
		};
		
		this.resetList = function(idx, isMenu){
			sortingIndex = idx;
			index = 0;
			page = 0;
			
			for(var i=0; i < _parent.results[type].total; i++){
				if(_comp._postersComp[i]){
					_comp._list.remove(_comp._postersComp[i]);
				}
			}

			_comp.posters = [];
			_comp._postersComp = [];
			index = 0;
			page = 0;
			
			_parent.isKeyLock = true;
			_parent.getList(type, 0, 28, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
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
			
			totalPage = Math.ceil(_parent.results[type].total/7);
			barHeight = 471/Math.ceil(totalPage/2);

			W.log.info("totalPage ==== " + totalPage);
			W.log.info("barHeight ==== " + barHeight);

			create();
			_comp._bar_area.setStyle({display:totalPage > 2 ? "block" : "none"});
		};
		
		function focus(){
			W.log.info("index === " + index);
			page = Math.floor(index / 7);
			
			if(_comp.posters[index]){
				_comp.posters[index].setFocus();
				_comp._list.setStyle({y: -(247 * 2 * Math.floor(page/2))});
				_comp._bar.setStyle({y:barHeight * Math.floor(page/2)});
				
				if(index + 14 < _parent.results[type].total && !_comp.posters[index + 14]){
					var startIdx = Math.floor((index + 14)/28);
					_parent.isKeyLock = true;
					_parent.getList(type, startIdx * 28, startIdx * 28 + 28, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
						for(var i=0; i < data[type].data.length; i++){
							_parent.results[type].data[param + i] = data[type].data[i];
						}
						drawList(param);
						_parent.isKeyLock = false;
					}, startIdx * 28);
				}
			}else{
				var startIdx = Math.floor(index/28);
				_parent.isKeyLock = true;
				_parent.getList(type, startIdx * 28,  startIdx * 28 + 28, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
					for(var i=0; i < data[type].data.length; i++){
						_parent.results[type].data[param + i] = data[type].data[i];
					}
					drawList(param);
					focus();
					_parent.isKeyLock = false;
				}, startIdx*28);
			}
		};
		
		function unFocus(){
			_comp.posters[index].unFocus();
		};
		
		this.focus = function(){
			focus();
		};
		
		this.unFocus = function(){
			unFocus();
			_comp._list.setStyle({y: 0});
			_comp._bar.setStyle({y: 9});
			index = 0;
		};
		
		this.operate = function(event){
			var isConsume = false;
			switch (event.keyCode) {
            case W.KEY.RIGHT:
        		unFocus();
            	if(index + 1 < _parent.results[type].total){
            		index++;
            	}else{
            		index = 0;
            	}
        		focus();
            	isConsume = true;
                break;
            case W.KEY.LEFT:
            	if(index % 7 > 0){
            		unFocus();
            		index--;
            		focus();
                	isConsume = true;
            	}
                break;
            case W.KEY.UP:
            	if(totalPage > 1){
            		unFocus();
            		if(page > 0){
                		index -= 7;
                	}else{
                		W.log.info(totalPage + " @@ " + ((totalPage - 1)*7 + index) + " ,, " + _parent.results[type].total);
            			if((totalPage - 1)*7 + index < _parent.results[type].total){
            				index = (totalPage - 1)*7 + index;
            			}else{
            				index = _parent.results[type].total - 1;
            			}
                	}
            		focus();
            	}
            	isConsume = true;
                break;
            case W.KEY.DOWN:
            	if(totalPage > 1){
            		unFocus();
            		if(index + 7 < _parent.results[type].total){
                		index += 7;
                	}else{
                		if(page < totalPage -1){
                    		index = _parent.results[type].total - 1;
                		}else{
                			index = index % 7;
                		}
                	}
            		focus();
            	}
            	isConsume = true;
                break;
            case W.KEY.ENTER:
            	if(type == "vod" || type == "vseries"){
            		if(!_parent.isClearPin && ((W.StbConfig.adultMenuUse && _parent.results[type].data[index].isAdult) ||
						(_parent.results[type].data[index].rating && util.getRating() && _parent.results[type].data[index].rating >= util.getRating()))) {
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
		getNewComp: function(){
			return new ResultPoster();
		}
	};
});