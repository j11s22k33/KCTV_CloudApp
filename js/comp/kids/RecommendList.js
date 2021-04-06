W.defineModule(["mod/Util", "comp/kids/Poster"], function(util, Poster) {
    var Recommend = function(_parentDiv, detailType) {
    	var list;
    	var index = 0;
    	var oldIndex = 0;
    	var _comp = new W.Div({className:"bg_size"});
    	var tmpHeight = 0;

		if(detailType == "series"){
    		tmpHeight = 25;
		}
		W.log.info("tmpHeight --------------------------- " + tmpHeight);
    	
    	var makeList = function(){
    		W.log.info("tmpHeight --------------------------- " + tmpHeight);
    		
    		_comp._area = new W.Div({x:0, y:520 + tmpHeight, width:"1280px", height:"310px", overflow:"hidden"});
    		_comp.add(_comp._area);
    		_comp._list = new W.Div({x:67, y:15, width:(180 * list.length) + "px", height:"204px"});
    		_comp._area.add(_comp._list);
    		_comp._dim = new W.Div({x:67, y:15, width:"1200px", height:"204px"});
    		_comp._area.add(_comp._dim);
    		
    		_comp.posters = [];
    		_comp._postersComp = [];
    		_comp._dimComp = [];
    		for(var i=0; i < list.length; i++){
    			_comp.posters[i] = new Poster({type:Poster.TYPE.W140, data:list[i], isRecommend:true, textAlign: i%6 > 3 ? "right" : "left"});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:180*i});
                _comp._list.add(_comp._postersComp[i]);
                
                if(i < 8){
                    _comp._dimComp[i] = new W.Div({x:180*i, y:0, width:"140px", height:"194px", backgroundColor:"rgba(0,0,0,0.6)"});
                    _comp._dim.add(_comp._dimComp[i]);
                }
    		}
    	};

    	this.setData = function(data){
    		_comp._bg = new W.Image({x:0, y:76, width:"1280px", height:"644px", src:"img/02_relvod_bg_kids.png", display:"none"});
    		_comp.add(_comp._bg);
    		
    		_comp._arr = new W.Div({x:65, y:489 + tmpHeight, width:"1205px", height:"29px"});
    		_comp.add(_comp._arr);
    		_comp._arr._img = new W.Image({x:65-65, y:500-489, width:"50px", height:"8px", src:"img/kids_title_bg.png"});
    		_comp._arr.add(_comp._arr._img);
    		_comp._arr._txt = new W.Span({x:70-65, y:485-489, height:"22px", width:"200px", textColor:"rgb(255,255,255)", "font-size":"20px",
    			className:"font_rixhead_medium", text:W.Texts["friends_watched"]});
    		_comp._arr.add(_comp._arr._txt);
    		_comp._arr._bar = new W.Image({x:276-65, y:495-489, width:"1034px", height:"1px", backgroundColor:"rgba(255,255,255,0.12)"});
    		_comp._arr.add(_comp._arr._bar);

    		_parentDiv.add(_comp);
    		list = data.resultList;

    		makeList();
    	};
    	
    	var focus = function(){
    		_comp.posters[oldIndex].unFocus();
    		_comp.posters[index].setFocus();
    		var page = Math.floor(index/6);
    		_comp._list.setStyle({x:67 - 1080*page});
    	};
    	
    	this.focus = function(){
    		_comp._bg.setStyle({display:""});
    		_comp._dim.setStyle({display:"none"});
    		//_comp._arr._img.setStyle({display:"none"});
    		_comp._arr._txt.setStyle({x:5, "font-size":"20px"});
    		_comp._area.setStyle({y:396});
    		_comp._arr.setStyle({y:360});
    		_comp.posters[index].setFocus();
    	};
    	
    	this.unFocus = function(){
    		_comp.posters[index].unFocus();
    		_comp._list.setStyle({x:67});
    		_comp._area.setStyle({y:520 + tmpHeight});
    		_comp._arr.setStyle({y:489 + tmpHeight});
    		_comp._arr._txt.setStyle({x:5, "font-size":"20px"});
    		//_comp._arr._img.setStyle({display:""});
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
				var asset = {sassetId:list[index].superAssetId, seriesId:list[index].seriesId};
            	W.SceneManager.startScene({sceneName:"scene/kids/KidsVodDetailScene",
					param:{data:asset, type:list[index].seriesId ? "S" : "V"},
    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                break;
    		}
    	};
    };
    
    return {
    	getComp : function(_parentDiv, detailType){
    		var recComp = new Recommend(_parentDiv, detailType);
    		return recComp;
    	}
    }
});