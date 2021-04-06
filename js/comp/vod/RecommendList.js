W.defineModule(["mod/Util", "comp/list/Poster"], function(util, Poster) {
    var Recommend = function(_parentDiv, detailType, isClearPin) {
    	var list;
    	var index = 0;
    	var oldIndex = 0;
    	var _comp = new W.Div({className:"bg_size"});
    	var tmpHeight = 0;

		if(detailType == "series"){
    		tmpHeight = 25;
		}
		W.log.info("tmpHeight --------------------------- " + tmpHeight);
		W.log.info("isClearPin --------------------------- " + isClearPin);
    	
    	var makeList = function(){
    		W.log.info("tmpHeight --------------------------- " + tmpHeight);
    		
    		_comp._area = new W.Div({x:0, y:520 + tmpHeight, width:"1280px", height:"290px", overflow:"hidden"});
    		_comp.add(_comp._area);
    		_comp._list = new W.Div({x:67, y:15, width:(154 * list.length) + "px", height:"204px"});
    		_comp._area.add(_comp._list);
    		_comp._dim = new W.Div({x:67, y:15, width:"1200px", height:"204px"});
    		_comp._area.add(_comp._dim);
    		
    		_comp.posters = [];
    		_comp._postersComp = [];
    		_comp._dimComp = [];
    		for(var i=0; i < list.length; i++){
    			_comp.posters[i] = new Poster({type:Poster.TYPE.W136, data:list[i], isRecommend:true, textAlign: i%7 > 4 ? "right" : "left", isClearPin:isClearPin});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:154*i});
                _comp._list.add(_comp._postersComp[i]);
                
                if(i < 8){
                    _comp._dimComp[i] = new W.Div({x:154*i, y:0, width:"136px", height:"194px", backgroundColor:"rgba(0,0,0,0.6)"});
                    _comp._dim.add(_comp._dimComp[i]);
                }
    		}
    	};

    	this.setData = function(data){
    		_comp._bg = new W.Image({x:0, y:103, width:"1280px", height:"617px", src:"img/02_relvod_bg.png", display:"none"});
    		_comp.add(_comp._bg);
    		
    		_comp._arr = new W.Div({x:69, y:489 + tmpHeight, width:"1205px", height:"29px"});
    		_comp.add(_comp._arr);
    		_comp._arr._img = new W.Image({x:2, y:0, width:"13px", height:"15px", src:"img/arrow_navi_d2.png"});
    		_comp._arr.add(_comp._arr._img);
    		_comp._arr._txt = new W.Span({x:24, y:-2, height:"22px", width:"420px", textColor:"rgb(196,196,196)", "font-size":"20px",
    			className:"font_rixhead_medium", text:W.Texts["recommend_movie"]});
    		_comp._arr.add(_comp._arr._txt);
    		_comp._arr._bar = new W.Image({x:428, y:9, width:"794px", height:"1px", backgroundColor:"rgba(255,255,255,0.12)"});
    		_comp._arr.add(_comp._arr._bar);

    		_parentDiv.add(_comp);
    		list = data.resultList;

    		makeList();
    	};
    	
    	var focus = function(){
    		_comp.posters[oldIndex].unFocus();
    		_comp.posters[index].setFocus();
    		var page = Math.floor(index/7);
    		_comp._list.setStyle({x:67 - 1078*page});
    	};
    	
    	this.focus = function(){
    		_comp._bg.setStyle({display:""});
    		_comp._dim.setStyle({display:"none"});
    		_comp._arr._img.setStyle({display:"none"});
    		_comp._arr._txt.setStyle({x:0, "font-size":"20px"});
    		_comp._area.setStyle({y:396});
    		_comp._arr.setStyle({y:360});
    		_comp.posters[index].setFocus();
    	};
    	
    	this.unFocus = function(){
    		_comp.posters[index].unFocus();
    		_comp._list.setStyle({x:67});
    		_comp._area.setStyle({y:520 + tmpHeight});
    		_comp._arr.setStyle({y:489 + tmpHeight});
    		_comp._arr._txt.setStyle({x:24, "font-size":"20px"});
    		_comp._arr._img.setStyle({display:""});
    		_comp._dim.setStyle({display:""});
    		_comp._bg.setStyle({display:"none"});
    		index = 0;
    	};
    	
    	this.operate = function(event){
    		switch (event.keyCode) {
            case W.KEY.RIGHT:
            	oldIndex = index;
            	index = (++index) % list.length;
            	focus();
                break;
            case W.KEY.LEFT:
            	oldIndex = index;
            	index = (--index + list.length) % list.length;
            	focus();
                break;
            case W.KEY.UP:
            	this.unFocus();
            	return true;
                break;
            case W.KEY.ENTER:
            	W.log.info(list[index]);
            	if(!isClearPin && ((W.StbConfig.adultMenuUse && list[index].isAdult)
                    || (list[index].rating && util.getRating() && list[index].rating >= util.getRating()))) {
            		var _this = this;
                    var popup = {
                        type:"",
                        popupName:"popup/AdultCheckPopup",
                        childComp:_this
                    };
                    W.PopupManager.openPopup(popup);
                } else {
                	var asset;
                	if(list[index].seriesId){
                		W.entryPath.push("recDetail.seriesId", list[index].seriesId, "RecommendList");
                		asset = {seriesId:list[index].seriesId};
                	}else{
                		W.entryPath.push("recDetail.sassetId", list[index].superAssetId, "RecommendList");
                		asset = {sassetId:list[index].superAssetId};
                	}
                	
                	W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
        				param:{data:asset, type:list[index].seriesId ? "S" : "V", isClearPin:isClearPin},
        				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                }
                break;
    		}
    	};
    	
    	this.onPopupClosed = function (popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	isClearPin = true;
                    	for(var i = 0; i < _comp.posters.length; i++) {
                            if(_comp.posters[i].releaseRestrict) {
                            	_comp.posters[i].releaseRestrict();
                            }
                        }
                    	
                    	var asset;
                    	if(list[index].seriesId){
                    		W.entryPath.push("recDetail.seriesId", list[index].seriesId, "RecommendList");
                    		asset = {seriesId:list[index].seriesId};
                    	}else{
                    		W.entryPath.push("recDetail.sassetId", list[index].superAssetId, "RecommendList");
                    		asset = {sassetId:list[index].superAssetId};
                    	}
                    	
                    	W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
            				param:{data:asset, type:list[index].seriesId ? "S" : "V", isClearPin:isClearPin},
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    }
                }
            }
        };
    };
    
    
    
    return {
    	getComp : function(_parentDiv, detailType, isClearPin){
    		var recComp = new Recommend(_parentDiv, detailType, isClearPin);
    		return recComp;
    	}
    }
});