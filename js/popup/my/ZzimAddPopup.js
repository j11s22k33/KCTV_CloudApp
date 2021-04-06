/**
 * popup/ZzimAddPopup
 */
W.defineModule(["mod/Util", "comp/my/ZzimAddStepComp", "comp/my/ZzimAddInfoComp"], function(util, zzimAddStepComp, zzimAddInfoComp) {
	'use strict';
	W.log.info("ZzimAddPopup");
	var depth = 0;
	var _comp;
    var _this;
    var isSelectArea;
    
    function create(){
    	_comp._step = new W.Div({x:124, y:60, width:"522px", height:"35px"});
    	_comp._step.add(new W.Div({x:0, y:30, width:"522px", height:"1px", className:"line_1px"}));
    	_comp._step._bar = new W.Image({x:0, y:28, width:"261px", height:"4px", src:"img/pay_step_f.png"});
    	_comp._step.add(_comp._step._bar);
		
    	_comp._step._txt1 = new W.Span({x:104, y:1, width:"45px", height:"18px", textColor:"rgba(255,255,255,0.5)", 
        	"font-size":"16px", className:"font_rixhead_medium", text:"STEP"});
    	_comp._step.add(_comp._step._txt1);
    	_comp._step._no1 = new W.Span({x:149, y:0, width:"20px", height:"25px", textColor:"rgba(255,255,255,0.7)", 
        	"font-size":"24px", className:"font_rixhead_bold", text:"1"});
    	_comp._step.add(_comp._step._no1);
		
		if(_this.stepComps.length > 1){
			_comp._step._txt2 = new W.Span({x:363, y:1, width:"45px", height:"18px", textColor:"rgba(131,122,119,0.25)", 
	        	"font-size":"16px", className:"font_rixhead_medium", text:"STEP", display:"block"});
			_comp._step.add(_comp._step._txt2);
			_comp._step._no2 = new W.Span({x:409, y:0, width:"20px", height:"25px", textColor:"rgba(131,122,119,0.25)", 
	        	"font-size":"24px", className:"font_rixhead_bold", text:"2", display:"block"});
			_comp._step.add(_comp._step._no2);
		}
		_comp.add(_comp._step);
		
		
		_this.infoComp = new zzimAddInfoComp(_this);
		_comp._right.add(_this.infoComp.getComp());
		
		for(var i=0; i < _this.stepComps.length; i++){
			_comp._left.add(_this.stepComps[i].getComp());
		}
		if(_this.type != "series"){
			var title = _this.selectedAsset.resolution ? _this.selectedAsset.resolution : "";
			if(_this.selectedAsset.isLifetime){
				title += " " + W.Texts["popup_zzim_option_lifetime"]
			}
			if(_this.selectedAsset.assetGroup != "010"){
				title += " " + util.getAssetGroupCode(_this.selectedAsset);
			}
			_this.selectedAsset.buttonTitle = title;
			_this.infoComp.changeAsset();
		}
		
		if(_this.stepComps.length > 1){
			_this.stepComps[0].select(true);
		}
		_this.stepComps[0].focus();
    };
    
    function getZzimList(){
    	_this.searchCount = 0;
    	for(var i=0; i < 5; i++){
    		var reqData = {offset:0, limit:40, listId:i};
    		_this.sdpDataManager.getViewingPins(function(result, data, idx){
    			W.log.info("idx ==== " + idx);
    			_this.searchCount++;
    			_this.zzimList[idx] = {idx : idx};
        		if(result){
        			_this.zzimList[idx].list = data.data;
        		}else{
        			_this.zzimList[idx].list = [];
        		}
        	
        		if(_this.searchCount == 5){
        			var totalCount = 0;
                    for(var j=0; j < 5; j++){
                    	_this.zzimList[j].title = W.Texts["popup_zzim_list"] + " " + (_this.zzimList[j].idx + 1);

                    	if(_this.type == "sasset"){
                    		_this.stepComps[1] = new zzimAddStepComp(_this, "list", _this.zzimList);
                    	}else{
                    		_this.stepComps[0] = new zzimAddStepComp(_this, "list", _this.zzimList);
                        	totalCount += _this.zzimList[j].list.length;
                    	}
                    }

                    W.log.info("totalCount == " + totalCount);

                    if(totalCount == 200){
                    	W.PopupManager.openPopup({
                            childComp:_this,
                            title:W.Texts["popup_zzim_info_title"],
                            popupName:"popup/AlertPopup",
                            boldText:W.Texts["popup_zzim_move_guide4"],
                            thinText:W.Texts["popup_zzim_move_guide5"]}
                        );
                    }
                    create();
        		}
        	}, reqData, i);
    	}
    };
    
    function init(){
    	if(_this.type == "sasset"){
        	var reqData = {sassetId:_this.data.sassetId, offset:0, limit:0};
        	_this.sdpDataManager.getSAssetAssetList(function(result, data){
        		if(result && data){
    				_this.selectedAsset = data.data[0];
        			if(data.total == 1){
        				_this.type = "asset";
        			}else{
        				_this.stepComps[0] = new zzimAddStepComp(_this, "asset", data.data);
        			}
        		}else{
    				_this.type = "asset";
        			_this.selectedAsset = _this.data.asset;
        		}
            	getZzimList();
        	}, reqData);
        }else if(_this.type == "asset"){
        	_this.selectedAsset = _this.data;
        	getZzimList();
        }else if(_this.type == "series"){
        	_this.selectedSeries = _this.data;
        	getZzimList();
        }else if(_this.type == "link"){
        	if(_this.data.linkType == "as01"){
        		var reqData = {assetId:_this.data.linkTarget};
				_this.sdpManager.getDetailAsset(function(result,resultData){
					if(result && resultData.data && resultData.data.length > 0){
						_this.type = "asset";
						_this.selectedAsset = resultData.data[0];
			        	getZzimList();
					}else{
						W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
					}
				}, reqData);
        	}else if(_this.data.linkType == "as02"){
        		_this.type = "sasset";
        		_this.data.sassetId = _this.data.linkTarget;
        		init();
        	}else if(_this.data.linkType == "sr01"){
        		var reqData = {seriesId:data.linkTarget};
				_this.sdpManager.getSeriesDetail(function(result,resultData){
					if(result && resultData.data && resultData.data.length > 0){
						_this.type = "series";
						_this.selectedSeries = _this.data;
			        	getZzimList();
					}else{
						W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE});
					}
				}, reqData);
        	}
        }
    };

    return W.Popup.extend({
    	onStart: function(_param) {
    		W.log.info("ZzimAddPopup onStart");
    		W.SceneManager.getCurrentScene().comp.style.display="none";
    		_this = this;
    		isSelectArea = true;
    		depth = 0;
    		this.type = _param.param.type;
            this.data = _param.param.data;
            this.sdpDataManager = W.getModule("manager/SdpDataManager");
            this.zzimList = [];
            W.log.info(_param);
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);

    		_comp = new W.Div({className : "bg_size"});
            _comp._bg = new W.Div({className : "bg_size", backgroundColor:"rgba(0,0,0,0.9)"});
            _comp.add(_comp._bg);
            _comp.add(new W.Div({x:770, y:0, width:"510px", height:"720px", backgroundColor:"rgba(0,0,0,0.4)"}));
            
            _comp._left = new W.Div({x:158, y:130, width:"600px", height:"480px", overflow:"hidden"});
            _comp.add(_comp._left);
            
            _comp._right = new W.Div({x:829, y:136, width:"370px", height:"480px", overflow:"hidden"});
            _comp.add(_comp._right);
            
            _comp._arr = new W.Image({x:55, y:340, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
            _comp.add(_comp._arr);

            this.stepComps = [];
            
            init();
    		this.add(_comp);
    		
    		this.chageStep = function(isBack){
    	    	if(isBack){
    				_this.stepComps[depth].unFocus(true);
    				depth--;
    				_this.stepComps[depth].focus();
    				_comp._arr.setStyle({display:"none"});
    				_comp._step._txt1.setStyle({textColor:"rgba(255,255,255,0.5)"});
    				_comp._step._no1.setStyle({textColor:"rgba(255,255,255,0.7)"});
    				_comp._step._txt2.setStyle({textColor:"rgba(131,122,119,0.25)"});
    				_comp._step._no2.setStyle({textColor:"rgba(131,122,119,0.25)"});
    				_comp._step._bar.setStyle({x:261*depth});
    	    	}else{
    	    		_this.stepComps[depth].unFocus();
    				depth++;
    				_this.stepComps[depth].focus();
    				
    				_comp._arr.setStyle({display:"block"});
    				_comp._step._txt1.setStyle({textColor:"rgba(131,122,119,0.25)"});
    				_comp._step._no1.setStyle({textColor:"rgba(131,122,119,0.25)"});
    				_comp._step._txt2.setStyle({textColor:"rgba(255,255,255,0.5)"});
    				_comp._step._no2.setStyle({textColor:"rgba(255,255,255,0.7)"});
    				_comp._step._bar.setStyle({x:261*depth});
    	    	}
    	    };
    	},
    	onStop: function() {
    		W.log.info("ZzimAddPopup onStop");
    		W.SceneManager.getCurrentScene().comp.style.display="block";
    	},
    	onKeyPressed : function(event) {
            W.log.info("ZzimAddPopup onKeyPressed " + event.keyCode);
            W.log.info(isSelectArea + " ,, " + depth);
            switch (event.keyCode) {
            case W.KEY.UP:
            	if(isSelectArea){
            		_this.stepComps[depth].operate(event);
            	}else{
            		_this.infoComp.operate(event);
            	}
            	break;
            case W.KEY.DOWN:
            	if(isSelectArea){
            		_this.stepComps[depth].operate(event);
            	}else{
            		_this.infoComp.operate(event);
            	}
            	break;
            case W.KEY.RIGHT:
            	if(isSelectArea){
            		if(depth == 0 && _this.type == "sasset"){
            			this.chageStep();
        			}else{
        				_this.stepComps[depth].unFocus();
        				isSelectArea = false;
	    				_this.infoComp.focus();
        			}
            	}
            	break;
            case W.KEY.LEFT:
            	if(isSelectArea){
            		if(depth == 1){
            			this.chageStep(true);
            		}
            	}else{
            		_this.infoComp.unFocus();
            		isSelectArea = true;
            		_this.stepComps[depth].focus();
            	}
            	break;
            case W.KEY.ENTER:
            	if(isSelectArea){
            		if(depth == 0 && _this.type == "sasset"){
                		_this.stepComps[depth].select();
        			}else{
                		_this.stepComps[depth].select();
                		_this.stepComps[depth].unFocus();
        				isSelectArea = false;
	    				_this.infoComp.focus();
        			}
            	}else{
            		var idx = _this.infoComp.select();
            		if(idx == 1){
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
            		}else{
            			var reqData = {listId:_this.selectedList.idx, targetType:_this.type == "series" ? "series" : "asset"};//targetType, targetId, listId
            			if(_this.type == "asset" || _this.type == "sasset"){
            				reqData.targetId = _this.selectedAsset.assetId;
            			}else{
            				reqData.targetId = _this.selectedSeries.seriesId;
            			}
            			this.sdpDataManager.addViewingPin(function(result, data){
            				W.log.info(result);
            				W.log.info(data);

                    		if(result){
                    			if(_this.type == "asset" || _this.type == "sasset"){
                        			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, title:_this.selectedAsset.title, listTitle:_this.selectedList.title});
                    			}else{
                    				W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_OK, title:_this.selectedSeries.title, listTitle:_this.selectedList.title});
                    			}
                    		}else{
                    			W.PopupManager.closePopup(_this, {action:W.PopupManager.ACTION_CLOSE, error:data.error});
                    		}
                    	}, reqData);
            		}
            	}
            	break;
            case W.KEY.BACK:
            	if(isSelectArea){
            		if(depth == 1){
            			_this.stepComps[depth].unFocus(true);
        				depth--;
        				_this.stepComps[depth].focus(true);
        				_comp._arr.setStyle({display:"none"});
            		}else{
            			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
            		}
            	}else{
            		isSelectArea = true;
            		_this.stepComps[depth].focus();
            		_this.infoComp.unFocus();
            	}
            	break;
            case W.KEY.EXIT:
            	W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
            	break;
			}
        },
        onPopupClosed : function (popup, desc) {
        	if (desc && desc.popupName == "popup/AlertPopup") {
        		W.PopupManager.closePopupAll();
        	}
        }
    });
});