W.defineModule("comp/my/PlayList", ["mod/Util", "comp/list/PosterList", "comp/Scroll", "comp/setting/Button"], function(util, PosterList, Scroll, Button) {
	function PlayList(){    //찜목록
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var playMode = 0;
	    var tops = [445, 215, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var blankHeight = [180, 330, 570];
	    var isAddedEntryPath = false;

	    var index = 0;
	    var btnIdx = 0;
        var _playListDiv;
	    var _comp;
	    var _parent;

	    var assetsData;

	    var hasList;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1, BUTTON:2});
	    var PLAY_MODE_TYPE = Object.freeze({NORMAL:0, PLAY:1, EDIT:2});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        if(mode == 0.8){
	            W.Util.setStyle(_playListDiv, {y:tops[1]+40, opacity : opacity[1]});
	            if(!hasList && _comp && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[1]});
	        }else{
	            W.Util.setStyle(_playListDiv, {y:tops[mode], opacity : opacity[mode]});
	            if(!hasList &&  _comp && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
	        }
	    };

	    var create = function(_assetsData, bannerData){
            if(_comp) {
                _playListDiv.remove(_comp);
            }
            _comp = new W.Div({});
            W.log.info(_assetsData)
	        if(!_assetsData || _assetsData.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:140, width:1280, height:blankHeight[(mode == 0.8 ? 1 : mode)], display:"-webkit-flex", "-webkit-flex-direction":"column",
	                "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_zzim_list"], lineHeight:"22px", className:"cut",
	                "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);

	            _comp._blankMsg._span2 = new W.Div({position:"relative", height:26, text:W.Texts["zzim_guide"], "word-break":"break-all",
	                lineHeight:"21px", "white-space":"pre", textColor:"#828282", fontFamily:"RixHeadL", "font-size":"17px", textAlign:"center"});
	            _comp._blankMsg.add(_comp._blankMsg._span2);

				_comp._blankMsg._span2.comp.innerHTML =  W.Texts["zzim_guide"].replace("@img@",
					"<img style='position:relative;margin:-33px -25px -36px -18px' src='img/color_yellow_mini.png'>");
				_comp._blankMsg.add(_comp._blankMsg._span2);

				//_comp._blankMsg.add(new W.Image({position:"relative", x:-52, y:-40, src:"img/color_yellow_mini.png"}));

	            _comp.add(_comp._blankMsg);

                _this.changeMode(mode);
                _playListDiv.add(_comp);
	            return;
	        } else {
	            hasList = true;
	        }

	        _this.mode = MODE_TYPE.LIST;

	        _this.listMode = "text";

            _comp.desc = new W.Div({x:56, y:90, width:800, height:24, text:W.Texts["play_mode_desc"],textColor:"#B5B5B5", fontFamily:"RixHeadL",
                "font-size":"18px", display:"none", "letter-spacing":"-0.9px", opacity:0.6});
            _comp.add(_comp.desc);

	        _this.posterList = new PosterList({type:PosterList.TYPE.PLAYLIST, data:_assetsData, bannerData:bannerData, total : _assetsData.length, parent : _this,
                isClearPin : _this.isClearPin});
	        _comp._posterList = _this.posterList.getComp();
	        _comp._posterList.setStyle({x:115, y:151});
	        _comp.add(_comp._posterList);

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49+5, y: 270, display: mode == 2 ? "block" : "none"});
                _comp.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

	       // _comp.add(new W.Div({text:"현재", x:1032, y:321, width:100, textColor:"#C7C7C7", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"0.18px"}));
	       // _comp._selectedNumber = new W.Div({text:"", x:900, y:349, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"22px", textAlign:"Right", "letter-spacing":"-1.1px"});
	       // _comp.add(_comp._selectedNumber);
	        //_comp.add(new W.Div({text:"개 선택(최대 150개)", x:1004, y:354, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));


	        _comp.add(new W.Div({x:1004, y:161, width:1, height:496, color:"rgba(131,122,119,0.25)"}));

	        _comp._normalDiv = new W.Div({});
	        _comp._normalDiv.add(new W.Div({text:W.Texts["total"], x:1069, y:315, width:100, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"18px",
                textAlign:"left", "letter-spacing":"-0.7px"}));
	        _comp._normalDiv._selectedNumber = new W.Div({text:assetsData.length, x:1087, y:310, width:28, textColor:"#E53000", fontFamily:"RixHeadB",
                "font-size":"24px", textAlign:"center", "letter-spacing":"-1.1px"});
	        _comp._normalDiv.add(_comp._normalDiv._selectedNumber);
	        _comp._normalDiv.add(new W.Div({text:W.Texts["count_unit2"], x:1117, y:315, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"left", "letter-spacing":"-0.7px"}));
	        _comp.add(_comp._normalDiv);

	        _comp._playDiv = new W.Div({display:"none"});
	        _comp._playDiv._selectedNumber = new W.Div({text:0, x:958, y:236, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"24px",
                textAlign:"Right", "letter-spacing":"-1.1px"});
	        _comp._playDiv.add(_comp._playDiv._selectedNumber);
	        _comp._playDiv.add(new W.Div({text:W.Texts["count_unit2"] + " " + W.Texts["select"], x:1063, y:242, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
	        _comp._playDiv.add(new W.Div({text:"/ 40" + W.Texts["count_unit2"], x:1117, y:242, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
	        _comp._playDiv.add(new W.Div({text:W.Texts["select_20"].replace("20", "40"), x:1041, y:267, width:200, textColor:"#B9A799", fontFamily:"RixHeadL",
                "font-size":"17px", textAlign:"left", "letter-spacing":"-0.85px"}));
	        _comp.add(_comp._playDiv);

	        _comp._editDiv = new W.Div({display:"none"});
	        _comp._editDiv._selectedNumber = new W.Div({text:0, x:958, y:261, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"24px",
                textAlign:"Right", "letter-spacing":"-1.1px"});
	        _comp._editDiv.add(_comp._editDiv._selectedNumber);
	        _comp._editDiv.add(new W.Div({text:W.Texts["count_unit2"] + " " + W.Texts["select"], x:1063, y:267, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
	        _comp._editDiv.add(new W.Div({text:"/ "+assetsData.length + W.Texts["count_unit2"], x:1117, y:267, width:150, textColor:"#B5B5B5",
                fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"-0.9px"}));
	        _comp.add(_comp._editDiv);

	        _this.btn = [[],[],[]], _comp._btn = [[],[],[]];
	        _this.btn[PLAY_MODE_TYPE.NORMAL][0] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.NORMAL][0] = _this.btn[PLAY_MODE_TYPE.NORMAL][0].getComp({x:1043, y:347, text:W.Texts["play_mode"]});
	        _comp._normalDiv.add(_comp._btn[PLAY_MODE_TYPE.NORMAL][0]);
	        _this.btn[PLAY_MODE_TYPE.NORMAL][1] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.NORMAL][1] = _this.btn[PLAY_MODE_TYPE.NORMAL][1].getComp({x:1043, y:395, text:W.Texts["modify_mode"]});
	        _comp._normalDiv.add(_comp._btn[PLAY_MODE_TYPE.NORMAL][1]);

	        _this.btn[PLAY_MODE_TYPE.PLAY][0] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.PLAY][0] = _this.btn[PLAY_MODE_TYPE.PLAY][0].getComp({x:1043, y:299, text:W.Texts["select_all"]});
	        _comp._playDiv.add(_comp._btn[PLAY_MODE_TYPE.PLAY][0]);
	        _this.btn[PLAY_MODE_TYPE.PLAY][1] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.PLAY][1] = _this.btn[PLAY_MODE_TYPE.PLAY][1].getComp({x:1043, y:347, text:W.Texts["play"]});
	        _comp._playDiv.add(_comp._btn[PLAY_MODE_TYPE.PLAY][1]);
	        _this.btn[PLAY_MODE_TYPE.PLAY][2] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.PLAY][2] = _this.btn[PLAY_MODE_TYPE.PLAY][2].getComp({x:1043, y:395, text:W.Texts["play_repeat"]});
	        _comp._playDiv.add(_comp._btn[PLAY_MODE_TYPE.PLAY][2]);
	        _this.btn[PLAY_MODE_TYPE.PLAY][3] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.PLAY][3] = _this.btn[PLAY_MODE_TYPE.PLAY][3].getComp({x:1043, y:443, text:W.Texts["cancel"]});
	        _comp._playDiv.add(_comp._btn[PLAY_MODE_TYPE.PLAY][3]);

	        _this.btn[PLAY_MODE_TYPE.EDIT][0] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][0] = _this.btn[PLAY_MODE_TYPE.EDIT][0].getComp({x:1043, y:299, text:W.Texts["select_all"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][0]);
	        _this.btn[PLAY_MODE_TYPE.EDIT][1] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][1] = _this.btn[PLAY_MODE_TYPE.EDIT][1].getComp({x:1043, y:347, text:W.Texts["go_zzim"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][1]);
	        _this.btn[PLAY_MODE_TYPE.EDIT][2] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][2] = _this.btn[PLAY_MODE_TYPE.EDIT][2].getComp({x:1043, y:395, text:W.Texts["delete"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][2]);
	        _this.btn[PLAY_MODE_TYPE.EDIT][3] = new Button();
	        _comp._btn[PLAY_MODE_TYPE.EDIT][3] = _this.btn[PLAY_MODE_TYPE.EDIT][3].getComp({x:1043, y:443, text:W.Texts["cancel"]});
	        _comp._editDiv.add(_comp._btn[PLAY_MODE_TYPE.EDIT][3]);

	        //_this.posterList.setActive();
            _this.changeMode(mode);

            _playListDiv.add(_comp);
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
	        sdpDataManager.getViewingPins(cbGetAssetsData, param, null, null, true);
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
	            assetsData = result.data;
	        }else{
	        	if(mode == 2){
	        		if(_parent.showAll) _parent.showAll(true);
	        	}
	        }
	        if(assetsData.length == 0){
	        	if(mode == 2){
	        		if(_parent.showAll) _parent.showAll(true);
	        	}
	        }
            create(assetsData);
	    };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };

        var getSelectedAssetList = function() {
            var array = [];
            for(var i = 0; i < _this.selectedArray.length; i++) {
                array.push(assetsData[_this.selectedArray[i]]);
            }
            return array;
        };
        
        function goPlayScene(playList, isReplayZzim){
//        	if(playList.length > 1){
//            	playList = playList.sort(function (a, b) {
//                    return (new Date(a.pinnedAt)) - (new Date(b.pinnedAt));
//                });
//        	}
        	W.log.info(playList);
        	var param = {zzimList:playList, isReplayZzim:isReplayZzim};
        	var isAdult = false;
        	for(var i=0; i < playList.length; i++){
        		var asset = playList[i].target;
        		if((W.StbConfig.adultMenuUse && asset.isAdult)
                    || (asset.rating && util.getRating() && asset.rating >= util.getRating())) {
        			isAdult = true;
        			break;
                }
        	}

    		_this.playParam = param;
        	if(isAdult) {
                var popup = {
                    type:"play",
                    popupName:"popup/AdultCheckPopup",
                    childComp: _this
                };
                W.PopupManager.openPopup(popup);
            } else {
        		checkZzimAsset(param);
            }
        };
        
        function callbackPurchase(result){
        	W.log.info(result);
	    	if(result.result == "SUCCESS"){
	    		var asset = result.asset;

	    		setTimeout(function(){
   				 	var popup = {
         				popupName:"popup/purchase/PurchaseCompletePopup",
         				contents:asset
         			};
     	    		W.PopupManager.openPopup(popup);

            		isAddedEntryPath = true;
            		W.entryPath.push("zzimList", _this.playParam.zzimList[0].target.assetId, "PlayList");
     	    		W.startVod(W.SceneManager.BACK_STATE_HIDE, _this.playParam);
   			 	}, 300);
	    	}else if(result.result == "FAIL"){
	    		W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/ErrorPopup",
                    code:result.resultData.error.code,
					from : "SDP"}
                );
	    	}
        };
        
        function checkZzimAsset(param){
        	var reqData = {assetId:param.zzimList[0].target.assetId, selector:"@detail"};

    		
        	sdpDataManager.getDetailAsset(function(isSuccess, result){
				if(isSuccess){
					var asset = result.data[0];
					W.log.info(asset);
					if(util.isWatchable(asset)){
			    		isAddedEntryPath = true;
			    		W.entryPath.push("zzimList", asset.assetId, "PlayList");
						W.startVod(W.SceneManager.BACK_STATE_HIDE, _this.playParam);
					}else{
						if(asset.products && asset.products.length > 0){
				    		isAddedEntryPath = true;
				    		W.entryPath.push("zzimList", asset.assetId, "PlayList");
							var products = [];
							var assets = [];
							var isUhd = false;
							var purchaseType = "V";
							for(var i=0; i < asset.products.length; i++){
								if(asset.products[i].productType == "VDRVDT"){
    								products.push(asset.products[i]);
    								assets.push(asset);
    								isUhd = asset.resolution == "UHD" ? true : false;
								}
							}
							if(assets.length == 0){
								for(var i=0; i < asset.products.length; i++){
									if(asset.products[i].productType == "VDRVLF"){
	    								products.push(asset.products[i]);
	    								assets.push(asset);
	    								isUhd = asset.resolution == "UHD" ? true : false;
									}
								}
							}
							if(assets.length == 0){
								purchaseType = "M";
								products.push(asset.products[0]);
								assets.push(asset);
								isUhd = asset.resolution == "UHD" ? true : false;
							}

    						if(W.StbConfig.blockPurchase){
    			        		var msg;
    			        		if(W.StbConfig.cugType == "accommodation"){
    			        			msg = W.Texts["alert_block_message2"];
    			        		}else{
    			        			msg = W.Texts["alert_block_message1"].replace("@tel@", W.Config.CALL_CENTER_NUMBER);
    			        		}
    			        		
    			        		W.PopupManager.openPopup({
    			                    title:W.Texts["popup_zzim_info_title"],
    			                    popupName:"popup/AlertPopup",
    			                    boldText:W.Texts["alert_block_title"],
    			                    thinText:msg
    			                });
    			        	}else{
    			        		if(!W.StbConfig.isUHD && isUhd){
    			        			W.PopupManager.openPopup({
    	    			                title:W.Texts["popup_zzim_info_title"],
    	    			                popupName:"popup/AlertPopup",
    	    			                boldText:W.Texts["uhd_guide_popup"],
    	    			                thinText:W.Texts["uhd_guide_popup2"] 
    	    			            });
    			        		}else{
        			            	var param2 = {type:purchaseType, products:products, data:assets, callback:callbackPurchase};
        			    			W.SceneManager.startScene({
        			    				sceneName:"scene/vod/PurchaseVodScene", 
        			    				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
        			    				param:param2
        			    			});
    			        		}
    			        	}
						} else {
                            W.PopupManager.openPopup({
                                childComp:_this,
                                popupName:"popup/ErrorPopup",
                                code: (result && result.error && result.error.code) ? result.error.code : "1001",
                                message : (result && result.error && result.error.message) ? [result.error.message] : null,
            					from : "SDP"
                            });
                        }
					}
				} else {
                    W.PopupManager.openPopup({
                        childComp:_this,
                        popupName:"popup/ErrorPopup",
                        code: (result && result.error && result.error.code) ? result.error.code : null,
                        message : (result && result.error && result.error.message) ? [result.error.message] : null,
    					from : "SDP"
                    });
                }
			}, reqData);
        };

        var checkSelect = function() {
            if(playMode == PLAY_MODE_TYPE.PLAY) {
                _comp._playDiv._selectedNumber.setText(_this.selectedArray.length);
                if (_this.selectedArray.length == (assetsData.length < 40 ? assetsData.length : 40)) {
                    _this.btn[playMode][0].setText(W.Texts["unselect_all"]);
                } else {
                    _this.btn[playMode][0].setText(W.Texts["select_all"]);
                }
            } else {
                _comp._editDiv._selectedNumber.setText(_this.selectedArray.length);
                if(_this.selectedArray.length == assetsData.length) {
                    _this.btn[playMode][0].setText(W.Texts["unselect_all"]);
                } else {
                    _this.btn[playMode][0].setText(W.Texts["select_all"]);
                }
            }
            
            if(_this.selectedArray.length > 0){
                _comp._btn[playMode][1].setStyle({opacity:1});
                _comp._btn[playMode][2].setStyle({opacity:1});
            }else{
                _comp._btn[playMode][1].setStyle({opacity:0.4});
                _comp._btn[playMode][2].setStyle({opacity:0.4});
            }
        };

	    this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info(this.componentName + " show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info(this.componentName + " hide");
        };
        this.create = function(_parentDiv, _p, _param) {
            W.log.info(this.componentName + " create !!!!");
            //backCallbackFunc = callback;
            _this = this;
            _this.parentDiv = _parentDiv;
            _parent = _p;
            _this.isClearPin = false;
            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;
            _this.isClearPin = _param.isClearPin;
            getAssetsData({offset:0,limit:40, listId:_this.param.listId});

            _playListDiv = new W.Div({id:"play_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});

            return _playListDiv;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
            	if(_parent.couponInfo){
                	_parent.couponInfo.hideButton();
            	}
                if(_this.posterList) _this.posterList.setActive();
                if(_this.scroll) _this.scroll.setActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:549});
                    //_comp._posterList._poster.setStyle({y:0});
                }

                if(_comp && _comp.desc) _comp.desc.setDisplay("");
                
                var bg = document.getElementById("my_bg_img");
            	if(bg){
            		bg.style.display = "none";
            	}
            } else {
            	if(_parent.couponInfo){
                	_parent.couponInfo.showButton();
            	}
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
                if(_comp && _comp.desc) _comp.desc.setDisplay("none");
                
                var bg = document.getElementById("my_bg_img");
            	if(bg){
            		bg.style.display = "block";
            	}
            }
            W.visibleHomeScene();
        };
        this.hasList = function(){
            return hasList;
        };
        this.setScroll = function() {
            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(_this.posterList.operate(event)) {
                            _this.posterList.getPageIdx();
                            return true;
                        } else {
                            _this.posterList.deActive();
                            _this.mode = MODE_TYPE.BUTTON;

                            if(playMode != PLAY_MODE_TYPE.NORMAL) {
                                if(_this.selectedArray.length > 0) {
                                    if(playMode == PLAY_MODE_TYPE.EDIT) {
                                        btnIdx = 2;
                                    } else {
                                        btnIdx = 1;
                                    }
                                } else {
                                    btnIdx = 0;
                                }
                            } else {
                                btnIdx = 0;
                            }
                            _this.btn[playMode][btnIdx].setFocus();
                            return true;
                        }
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(_this.posterList.operate(event)) {
                            return true;
                        } else {
                            if (_this.scroll) {
                                _this.posterList.deActive();
                                _this.mode = MODE_TYPE.SCROLL;
                                if (_this.scroll) _this.scroll.setFocus();
                            } else {
                                _this.posterList.setActive();
                            }
                            return true;
                        }
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                    	if((playMode == PLAY_MODE_TYPE.EDIT || playMode == PLAY_MODE_TYPE.PLAY) && _this.selectedArray.length == 0){
                			_this.btn[playMode][btnIdx].unFocus();
                    		if(btnIdx == 3){
                                btnIdx = 0;
                    		}else{
                                btnIdx = 3;
                    		}
                            _this.btn[playMode][btnIdx].setFocus();
                    	}else{
                    		_this.btn[playMode][btnIdx].unFocus();
                            btnIdx = btnIdx-1 < 0 ? _this.btn[playMode].length-1 : btnIdx-1;
                            _this.btn[playMode][btnIdx].setFocus();
                    	}
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                    	if((playMode == PLAY_MODE_TYPE.EDIT || playMode == PLAY_MODE_TYPE.PLAY) && _this.selectedArray.length == 0){
                			_this.btn[playMode][btnIdx].unFocus();
                    		if(btnIdx == 0){
                                btnIdx = 3;
                    		}else{
                                btnIdx = 0;
                    		}
                            _this.btn[playMode][btnIdx].setFocus();
                    	}else{
                            _this.btn[playMode][btnIdx].unFocus();
                            btnIdx = btnIdx+1 > _this.btn[playMode].length-1 ? 0 : btnIdx+1;
                            _this.btn[playMode][btnIdx].setFocus();
                    	}
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                    if(playMode == PLAY_MODE_TYPE.NORMAL) {
                        if(_this.mode == MODE_TYPE.BUTTON) {
                            if(btnIdx == 0) {
                                _this.btn[playMode][btnIdx].unFocus();
                                playMode = PLAY_MODE_TYPE.PLAY;
                                _this.posterList.setSelectableMode(true);
                                _this.selectedArray = [];
                                _comp._playDiv._selectedNumber.setText(_this.selectedArray.length);
                                _comp._normalDiv.setStyle({display:"none"});
                                _comp._playDiv.setStyle({display:"block"});
                                btnIdx = 0;

                                _this.posterList.setPage(0, true);
                                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                                _this.posterList.setActive();
                                _this.mode = MODE_TYPE.LIST;
                                checkSelect();
                            } else if(btnIdx == 1) {
                                _this.btn[playMode][btnIdx].unFocus();
                                playMode = PLAY_MODE_TYPE.EDIT;
                                _this.posterList.setSelectableMode(true);
                                _this.selectedArray = [];
                                _comp._editDiv._selectedNumber.setText(_this.selectedArray.length);
                                _comp._normalDiv.setStyle({display:"none"});
                                _comp._editDiv.setStyle({display:"block"});
                                btnIdx = 0;

                                _this.posterList.setPage(0, true);
                                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                                _this.posterList.setActive();
                                _this.mode = MODE_TYPE.LIST;
                                checkSelect();
                            }

                        } else if(_this.mode == MODE_TYPE.LIST){
                            var asset = _this.posterList.getCurrentData().target;
                            if(!_this.isClearPin && ((W.StbConfig.adultMenuUse && asset.isAdult)
                                || (asset.rating && util.getRating() && asset.rating >= util.getRating()))) {
                                var popup = {
                                    type:"detail",
                                    popupName:"popup/AdultCheckPopup",
                                    childComp: _this
                                };
                                W.PopupManager.openPopup(popup);
                            } else {
                            	isAddedEntryPath = true;
                        		W.entryPath.push("zzimList", asset.assetId, "PlayList");
                                W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                    param:{data:{assetId:asset.assetId}}});
                            }
                        } else if(_this.mode == MODE_TYPE.SCROLL){
                            _this.posterList.setActive();
                            _this.mode = MODE_TYPE.LIST;
                            if (_this.scroll) _this.scroll.unFocus();
                            return true;
                        }
                    } else if(playMode == PLAY_MODE_TYPE.PLAY){
                        if(_this.mode == MODE_TYPE.BUTTON) {
                            if(btnIdx == 0) {
                                if(_this.selectedArray.length == (assetsData.length < 40 ? assetsData.length : 40)) {
                                    _this.selectedArray = _this.posterList.resetSelect();
                                    _this.posterList.setSelectableMode(true);
                                } else {
                                    _this.selectedArray = _this.posterList.resetSelect();
                                    _this.selectedArray = _this.posterList.setSelectAll(40);
                                }
                                checkSelect();
                            } else if(btnIdx == 1) {
                            	var playList = getSelectedAssetList();
                            	goPlayScene(playList)
                            } else if(btnIdx == 2) {
                            	var playList = getSelectedAssetList();
                            	goPlayScene(playList, true)
                            } else if(btnIdx == 3) {
                                _this.btn[playMode][btnIdx].unFocus();
                                playMode = PLAY_MODE_TYPE.NORMAL;
                                _this.posterList.setSelectableMode(false);
                                _this.selectedArray = _this.posterList.resetSelect();
                                _comp._playDiv.setStyle({display:"none"});
                                _comp._normalDiv.setStyle({display:"block"});
                                btnIdx = 0;

                                _this.btn[playMode][btnIdx].unFocus();
                                _this.posterList.setPage(0, true);
                                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                                _this.posterList.setActive();
                                _this.mode = MODE_TYPE.LIST;
                                //_this.btn[playMode][btnIdx].setFocus();
                            }
                            return true;

                        } else if(_this.mode == MODE_TYPE.LIST) {
                            _this.selectedArray = _this.posterList.setSelect();
                            checkSelect();
                            return true;
                        }
                    } else if(playMode == PLAY_MODE_TYPE.EDIT){
                        if(_this.mode == MODE_TYPE.BUTTON) {
                            if(btnIdx == 0) {
                                if(_this.selectedArray.length == assetsData.length) {
                                    _this.selectedArray = _this.posterList.resetSelect();
                                    _this.posterList.setSelectableMode(true);
                                } else {
                                    _this.selectedArray = _this.posterList.resetSelect();
                                    _this.selectedArray = _this.posterList.setSelectAll();
                                }
                                checkSelect();
                            } else if(btnIdx == 1) {
                                var popup = {
                                    popupName: "popup/my/ZzimMovePopup",
                                    data: {
                                        list : getSelectedAssetList(),
                                        idx : _this.param.listId,
                                    },
                                    childComp: _this
                                };
                                W.PopupManager.openPopup(popup);
                            } else if(btnIdx == 2) {
                                var popup = {
                                    popupName: "popup/my/ZzimRemovePopup",
                                    data: {
                                        list : getSelectedAssetList(),
                                        idx : _this.param.listId,
                                    },
                                    childComp: _this
                                };
                                W.PopupManager.openPopup(popup);
                            } else if(btnIdx == 3) {
                                _this.btn[playMode][btnIdx].unFocus();
                                playMode = PLAY_MODE_TYPE.NORMAL;
                                _this.posterList.setSelectableMode(false);
                                _this.selectedArray = _this.posterList.resetSelect();
                                _comp._editDiv.setStyle({display:"none"});
                                _comp._normalDiv.setStyle({display:"block"});
                                btnIdx = 0;

                                _this.btn[playMode][btnIdx].unFocus();
                                _this.posterList.setPage(0, true);
                                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                                _this.posterList.setActive();
                                _this.mode = MODE_TYPE.LIST;
                                //_this.btn[playMode][btnIdx].setFocus();
                            }

                        } else if(_this.mode == MODE_TYPE.LIST) {
                            _this.selectedArray = _this.posterList.setSelect();
                            checkSelect();
                        }
                    }
                    break;
                case W.KEY.BACK:
                    if(playMode == PLAY_MODE_TYPE.NORMAL) {
                        if(_this.mode == MODE_TYPE.BUTTON) {
                            _this.btn[playMode][btnIdx].unFocus();
                            _this.mode = MODE_TYPE.LIST;
                            _this.posterList.setPage(0, true);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                            return false;
                        } else {
                        	if (_this.posterList) _this.posterList.setPage(0, true);
                            if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                            return false;
                        }
                    } else if(playMode == PLAY_MODE_TYPE.PLAY){
                        _this.btn[playMode][btnIdx].unFocus();
                        playMode = PLAY_MODE_TYPE.NORMAL;
                        _this.mode = MODE_TYPE.LIST;
                        _this.posterList.setSelectableMode(false);
                        _this.selectedArray = _this.posterList.resetSelect();
                        _comp._playDiv.setStyle({display:"none"});
                        _comp._normalDiv.setStyle({display:"block"});
                        btnIdx = 0;

                        _this.btn[playMode][btnIdx].unFocus();
                        _this.posterList.setPage(0, true);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                    } else if(playMode == PLAY_MODE_TYPE.EDIT){
                        _this.btn[playMode][btnIdx].unFocus();
                        playMode = PLAY_MODE_TYPE.NORMAL;
                        _this.mode = MODE_TYPE.LIST;
                        _this.posterList.setSelectableMode(false);
                        _this.selectedArray = _this.posterList.resetSelect();
                        _comp._editDiv.setStyle({display:"none"});
                        _comp._normalDiv.setStyle({display:"block"});
                        btnIdx = 0;

                        _this.btn[playMode][btnIdx].unFocus();
                        _this.posterList.setPage(0, true);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                    }
                    return true;
                    break;
                case W.KEY.EXIT:
                    break;
                case W.KEY.MENU:
                case W.KEY.HOME:
                    break;
                case W.KEY.NUM_0:
                case W.KEY.NUM_1:
                case W.KEY.NUM_2:
                case W.KEY.NUM_3:
                case W.KEY.NUM_4:
                case W.KEY.NUM_5:
                case W.KEY.NUM_6:
                case W.KEY.NUM_7:
                case W.KEY.NUM_8:
                case W.KEY.NUM_9:
                    break;
                case W.KEY.KEY_OPTION:
                   break;
            }

        };
        this.destroy = function() {
            W.log.info(this.componentName + " destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.resume = function(){
        	W.log.info("destroy !!!!");
            if(isAddedEntryPath){
            	W.entryPath.pop();
            	isAddedEntryPath = false;
            }
        };
        this.getMode = function(){
            return mode;
        };
        this.onPopupClosed = function(popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                		W.log.info(desc.type);
                		_this.isClearPin = true;
                		if(_this.posterList && _this.posterList.releaseRestrict) _this.posterList.releaseRestrict();
                    	if(desc.type == "detail"){
                            var asset = _this.posterList.getCurrentData().target;
                    		isAddedEntryPath = true;
                    		W.entryPath.push("zzimList", asset.assetId, "PlayList");
                            W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene",
                                param:{data:{assetId:asset.assetId}}});
                    	}else if(desc.type == "play"){
                    		checkZzimAsset(_this.playParam);
                    	}
                    }
                } else if (desc.popupName == "popup/my/ZzimMovePopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                        var selectedArray = getSelectedAssetList();
                        var selectedString = [];
                        for(var i = 0; i < selectedArray.length; i++) {
                            selectedString.push(selectedArray[i].pinId);
                        }
                        sdpDataManager.movePin(function(isSuccess, result){
                            if(isSuccess) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["total"] + " " + result.total + W.Texts["count_unit2"],
                                    desc:W.Texts["zzim_list"] + " " + (desc.idx + 1) + W.Texts["zzim_move"],
                                    type:"2LINE"
                                });

                                playMode = PLAY_MODE_TYPE.NORMAL;
                                btnIdx = 0;
                                getAssetsData({offset:0,limit:40, listId:_this.param.listId});

                            } else {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/ErrorPopup",
                                    code: (result && result.error && result.error.code) ? result.error.code : "9999",
                                    message : (result && result.error && result.error.message) ? [result.error.message] : null,
                					from : "SDP"
                                });
                            }
                        }, {pinId : selectedString, srcListId : _this.param.listId, dstListId : desc.idx});
                    }
                } else if(desc.popupName == "popup/my/ZzimRemovePopup") {
                    if(desc.action == W.PopupManager.ACTION_OK) {
                        var selectedArray = getSelectedAssetList();
                        var selectedString = [];
                        for(var i = 0; i < selectedArray.length; i++) {
                            selectedString.push(selectedArray[i].pinId);
                        }
                        sdpDataManager.removeViewingPin(function(isSuccess, result) {
                            if(isSuccess) {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/FeedbackPopup",
                                    title:W.Texts["total"] + " " + result.total + W.Texts["count_unit2"],
                                    desc:W.Texts["zzim_list"] + " " + (_this.param.listId + 1) + W.Texts["zzim_remove"],
                                    type:"2LINE"
                                });

                                playMode = PLAY_MODE_TYPE.NORMAL;
                                btnIdx = 0;
                                getAssetsData({offset:0,limit:40, listId:_this.param.listId});
                                
                                var scenes = W.SceneManager.getSceneStack();
                                if(scenes[scenes.length - 1].id.indexOf("PlayListScene") > 0){
                                	if(scenes[scenes.length - 2].id.indexOf("CategoryListScene") > 0){
                                		scenes[scenes.length - 2].onRefresh();
                                    }
                                }
                            } else {
                                W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/ErrorPopup",
                                    code: (result && result.error && result.error.code) ? result.error.code : null,
                                    message : (result && result.error && result.error.message) ? [result.error.message] : null,
                					from : "SDP"
                                });
                            }
                        }, {pinId : selectedString});
                    }
                }
            }
        };
        this.componentName = "PlayList";
	}
    
	return {
		getNewComp : function(){
			return new PlayList();
		}
	}
});