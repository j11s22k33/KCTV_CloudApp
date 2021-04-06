/**
 * scene/SettingScene
 *
 */
W.defineModule([ "mod/Util", "comp/CouponInfo", "comp/vod/Detail", "comp/list/Poster"],
    function(util, couponInfoComp, detailComp, Poster) {
        var _thisScene = "ChannelVodScene";
        W.log.info("### Initializing " + _thisScene + " scene ###");
        
        var list;
        var _this;
        var _list;
        var totalPage;
        var index = 0;
        var oldIndex = 0;
        var keyTimeout;
        var isClearPin = false;
        
        var createList = function(){
        	W.log.info(list);
        	_list = new W.Div({x:0, y:124, width:"1280px", height:"323px"});
        	_this._parentDiv.add(_list);
        	_list.add(new W.Div({x:117, y:293, width:"1046px", height:"1px", backgroundColor:"rgb(57,57,57)"}));
        	if(list.length > 7){
        		_list._arr_l = new W.Image({x:61, y:126, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
        		_list._arr_r = new W.Image({x:1182, y:126, width:"41px", height:"41px", src:"img/arrow_navi_r.png", display:"block"})
        		_list.add(_list._arr_l);
        		_list.add(_list._arr_r);
        		_list._curr_page = new W.Span({x:1094, y:301, width:"30px", height:"18px", textColor:"rgb(213,213,213)", "font-size":"18px", 
    				className:"font_rixhead_bold", text:"01", textAlign:"right"});
        		_list.add(_list._curr_page);
        		_list.add(new W.Span({x:1127, y:301, width:"40px", height:"18px", textColor:"rgb(181,181,181)", "font-size":"18px", 
    				className:"font_rixhead_medium", text:"/ " + W.Util.changeDigit(totalPage,2), textAlign:"left"}));
        	}
        	var _area = new W.Div({x:103, y:0, width:"1068px", height:"288px", overflow:"hidden"});
        	_list.add(_area);
        	_list._list = new W.Div({x:0, y:40, width:"1060px", height:"283px"});
        	_area.add(_list._list);
        	
        	_list.posters = [];
        	_list._postersComp = [];
    		for(var i=0; i < list.length; i++){
    			_list.posters[i] = new Poster({type:Poster.TYPE.W136, data:list[i].content, textAlign: i%7 > 4 ? "right" : "left", isPackage:true, isClearPin:_this.param.releaseAdult});
    			_list._postersComp[i] = _list.posters[i].getComp();
    			_list._postersComp[i].setStyle({x:16 + 151*i});
    			_list._list.add(_list._postersComp[i]);
    		}
    		focus();
    		getDetail();
        };
        
        var focus = function(){
        	_list.posters[oldIndex].unFocus();
        	_list.posters[index].setFocus();
        	if(list.length > 7){
            	var page = Math.floor(index/7);
            	_list._list.setStyle({x:-page * 1058});
            	_list._curr_page.setText(W.Util.changeDigit(page+1,2));
            	
            	if(page == 0){
            		_list._arr_l.setStyle({display:"none"});
            		_list._arr_r.setStyle({display:"block"});
            	}else if(page == totalPage - 1){
            		_list._arr_l.setStyle({display:"block"});
            		_list._arr_r.setStyle({display:"none"});
            	}else{
            		_list._arr_l.setStyle({display:"block"});
            		_list._arr_r.setStyle({display:"block"});
            	}
        	}
        };
        
        var getDetail = function(){
			var linkType = "";
			if(list[index].link.linkType == "as02") linkType = "Sasset";
			else if(list[index].link.linkType == "sr01") linkType = "series";
			else if(list[index].link.linkType == "as01") linkType = "asset";
        	_this.Detail.setData(list[index].content, undefined, linkType);
    	};

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                index = 0;
                this.param = param;
                
                this.sdpDataManager = W.getModule("manager/SdpDataManager");
                this.uiPlfDataManager = W.getModule("manager/UiPlfDataManager");
                
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_R]);

                this.couponInfo = couponInfoComp.getNewComp();
                
                if(this._parentDiv){
                	this.remove(this._parentDiv);
                }
                
                this._parentDiv = new W.Div({className : "bg_size"});
                this._parentDiv._bg = new W.Div({className : "bg_size", backgroundColor:"rgba(0,0,0,0.88)"});
                this._parentDiv._bg.add(new W.Image({className : "bg_size", src:"img/ch_vod.jpg"}));
                this._parentDiv.add(this._parentDiv._bg);
                
                this.couponInfo.setData();
                this.couponInfo.hideOption();
        		this._parentDiv.add(this.couponInfo.getComp(592, 38));
        		
        		

                this._parentDiv._detail = new W.Div({className : "bg_size"});
                this._parentDiv.add(this._parentDiv._detail);
        		this.Detail = detailComp.getComp(this, this._parentDiv._detail, "Sasset", "channelVod");
        		
        		var reqData = {sourceId:param.sourceId, offset:0, limit:1000};
        		this.uiPlfDataManager.getChvodList(function(result, data){
        			var sAssetIds = "";
        			var seriesIds = "";
					var assetIds = "";
        			if(result && data.total > 0){
        				list = data.data;
        				totalPage = Math.ceil(list.length/7);
        				
        				_this._parentDiv.add(new W.Span({x:55, y:51, width:"600px", height:"30px", textColor:"rgb(255,255,255)", "font-size":"27px", 
                			className:"font_rixhead_medium", text:data.chnlNo + ". " + data.chnlNm}));
        				_this._parentDiv.add(new W.Span({x:56, y:91, width:"600px", height:"19px", textColor:"rgb(255,255,255)", "font-size":"17px", 
                			className:"font_rixhead_light", text:data.chnlDesc}));
        				
        				for(var i=0; i < data.total; i++){
        					if(list[i].link.linkType == "as02"){
        						sAssetIds += (sAssetIds ? "," : "") + list[i].link.linkTarget;
        					}else if(list[i].link.linkType == "sr01"){
        						seriesIds += (seriesIds ? "," : "") + list[i].link.linkTarget;
        					}else if(list[i].link.linkType == "as01"){
								assetIds += (assetIds ? "," : "") + list[i].link.linkTarget;
							}
        				}

        				if(sAssetIds){
        					var reqData = {selector:"@detail", sassetId:sAssetIds};
        					_this.sdpDataManager.getSAssetsDetail(function(result, data, seriesIds, assetIds){
        						for(var i=0; i < data.data.length; i++){
        							for(var j=0; j < list.length; j++){
        								if(data.data[i].sassetId == list[j].link.linkTarget){
        									list[j].content = data.data[i];
        								}
        							}
        						}
        						if(seriesIds){
                					var reqData = {selector:"@detail", seriesId:seriesIds};
                					_this.sdpDataManager.getSeriesDetail(function(result, data){
                						for(var i=0; i < data.data.length; i++){
                							for(var j=0; j < list.length; j++){
                								if(data.data[i].seriesId == list[j].link.linkTarget){
                									list[j].content = data.data[i];
                								}
                							}
                						}
										if(assetIds) {
											var reqData = {selector:"@detail", assetId:assetIds};
											_this.sdpDataManager.getDetailAsset(function(result, data){
												for(var i=0; i < data.data.length; i++){
													for(var j=0; j < list.length; j++){
														if(data.data[i].assetId == list[j].link.linkTarget){
															list[j].content = data.data[i];
														}
													}
												}
												createList();
											}, reqData);
										} else {
											createList();
										}
                					}, reqData);
            					}else{
            						createList();
            					}
        					}, reqData, seriesIds, assetIds);
        				}else if(seriesIds) {
        					var reqData = {selector:"@detail", seriesId:seriesIds};
        					_this.sdpDataManager.getSeriesDetail(function(result, data){
        						for(var i=0; i < data.data.length; i++){
        							for(var j=0; j < list.length; j++){
        								if(data.data[i].seriesId == list[j].link.linkTarget){
        									list[j].content = data.data[i];
        								}
        							}
        						}
								if(assetIds) {
									var reqData = {selector:"@detail", assetId:assetIds};
									_this.sdpDataManager.getDetailAsset(function(result, data){
										for(var i=0; i < data.data.length; i++){
											for(var j=0; j < list.length; j++){
												if(data.data[i].assetId == list[j].link.linkTarget){
													list[j].content = data.data[i];
												}
											}
										}
										createList();
									}, reqData);
								} else {
									createList();
								}
        					}, reqData);
        				}else if(assetIds) {
							var reqData = {selector:"@detail", assetId:assetIds};
							_this.sdpDataManager.getDetailAsset(function(result, data){
								for(var i=0; i < data.data.length; i++){
									for(var j=0; j < list.length; j++){
										if(data.data[i].assetId == list[j].link.linkTarget){
											list[j].content = data.data[i];
										}
									}
								}
								createList();
							}, reqData);
						}
        			}
        		}, reqData);

        		this.add(this._parentDiv);
            },
            onPause: function() {

            },
            onResume: function() {

            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");
                clearTimeout(keyTimeout);
            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
                switch (event.keyCode) {
        		case W.KEY.BACK:
        			W.CloudManager.changeChannel(function(){
        				W.log.info("Channel Changed !! " + sourceId);
        			}, -2);
        			break;
                case W.KEY.RIGHT:
                	oldIndex = index;
                	index = (++index) % list.length;
                	focus();
                	clearTimeout(keyTimeout);
                	keyTimeout = setTimeout(getDetail, 300);
                    break;
                case W.KEY.LEFT:
                	oldIndex = index;
            		index = (--index + list.length) % list.length;
                	focus();
                	clearTimeout(keyTimeout);
                	keyTimeout = setTimeout(getDetail, 300);
                    break;
                case W.KEY.ENTER:
                	if(!isClearPin && ((W.StbConfig.adultMenuUse && list[index].content.isAdult)
						|| (list[index].content.rating && util.getRating() && list[index].content.rating >= util.getRating()))) {
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            childComp:_this
                        };
                        W.PopupManager.openPopup(popup);
                    }else{
                    	W.entryPath.push("channelVod.sourceId", _this.param.sourceId, "ChannelVodScene");
                    	W.LinkManager.action("L", list[index].link, undefined, undefined, undefined, isClearPin);
//                    	_this.startScene({
//    						sceneName:"scene/vod/VodDetailScene",
//    						backState:W.SceneManager.BACK_STATE_KEEPHIDE,
//    						param:{data:list[index].content}
//    					});
                    }
                    break;
        		}
            },
            onPopupClosed : function (popup, desc) {
                if (desc) {
                    if (desc.popupName == "popup/AdultCheckPopup") {
                        if (desc.action == W.PopupManager.ACTION_OK) {
                        	isClearPin = true;
                        	W.entryPath.push("channelVod.sourceId", _this.param.sourceId, "ChannelVodScene");
                        	W.LinkManager.action("L", list[index].link, undefined, undefined, undefined, isClearPin);
//                        	_this.startScene({
//        						sceneName:"scene/vod/VodDetailScene",
//        						backState:W.SceneManager.BACK_STATE_KEEPHIDE,
//        						param:{data:list[index].content}
//        					});
                        	
                        	for(var i=0; i < list.length; i++){
                    			_list.posters[i].releaseRestrict();
                    		}
                        }
                    }
                }
    		}
        });
    });
