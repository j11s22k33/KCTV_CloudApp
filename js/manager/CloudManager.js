//@preDefine
/**
 * manager/CloudManager
 */
W.defineModule("manager/CloudManager", ["comp/purchase/PurchaseComp"], function(purchaseComp) {
	
	W.log.info("define CloudManager");

	var callbackArray = [];
	var trIdArray = [];
	var paramArray = [];
	var objArray = [];
	var CloudPCData;

	var cloudPingTimer;
	var closeAppCount = 0;
	
	var sendMsg = function(cb, obj, param){

		var trId = new Date().getTime();
		for(var i=0; i < trIdArray.length; i++){
			if(trIdArray[i] == trId){
				trId++;
				break;
			}
		}
		var tmpId = "";
		if(obj instanceof Array){
			obj[0].trId = trId;
			obj[0].type = "req_web";
			tmpId = obj[0].cmd + "@" + obj[0].key;
		}else{
			obj.trId = trId;
			obj.type = "req_web";
			tmpId = obj.cmd + "@" + obj.key;
		}

		callbackArray.push(cb);
		trIdArray.push(trId);
		paramArray.push(param);
		objArray.push(tmpId)

		var msg = JSON.stringify(obj);
		W.log.info("send message :: " + msg);
		
		if(W.Config.DEVICE == "PC"){
			W.log.info(CloudPCData);
			if(!CloudPCData){
				require(["manager/CloudPCData"], function(pcData){
					CloudPCData = pcData;
					CloudPCData.sendMsg(obj, trId);
				});
			} else {
				CloudPCData.sendMsg(obj, trId);
			}

		}else{
			if(W.WebSocket) W.WebSocket.send(msg);
			else console.log("WebSocket Closed");
		}

		if(cloudPingTimer) {
			clearInterval(cloudPingTimer);
			cloudPingTimer = undefined;
		}
		cloudPingTimer = setInterval(pingTimer, 30*60*1000);
	};

	var pingTimer = function(){
		console.log("[PingTimer] sendPing :: " + (new Date()));
		W.CloudManager.sendPing(function(result){
			console.log("[PingTimer] sendPing Recevied :: " + (new Date().getTime() - result.trId) + (result));
		});
	};

	var receive = function(obj){
		if(obj.type == "req_stb"){
			//세탑에서 요청이 온 경우
			if(obj.cmd == "CHANNEL_EVENT"){
				if(obj.key == "channelChanged") {

					if(W.state.start == "CH_VOD" && W.StbConfig.sceneValue.sourceId != obj.data){
						W.state.start = undefined;
					}
					
					if(W.state.isChannelChangeSkip){
						W.state.isChannelChangeSkip = false;
					}else{
						if(W.state.isVod){

						}else{
							if(W.state.isGuide){
								if(W.SceneManager.getCurrentScene().channelChange){
									W.SceneManager.getCurrentScene().channelChange(obj.key, obj.data, obj.extra);
								}
							}else{
								W.CloudManager.closeApp();
							}
						}
					}
					

				} else if(obj.key == "permUpdated") {
					if(W.state.isGuide){
						if(W.SceneManager.getCurrentScene().channelChange){
							W.SceneManager.getCurrentScene().channelChange(obj.key, obj.data);
						}
					}
				}
			}else if(obj.cmd == "BLUETOOTH"){
				if(obj.key == "deviceFound") {
					if(W.CloudManager.BluetoothCallback) {
						W.CloudManager.BluetoothCallback(obj.data);
					}
				} else if(obj.key == "pairingResult"){
					if(W.CloudManager.BluetoothPairingCallback) {
						W.CloudManager.BluetoothPairingCallback(obj.data);
					}
				}
				
			}else if(obj.cmd == "BACK"){
				W.CloudManager.closeApp();
			}else if(obj.cmd == "VOD"){
				if(W.SceneManager.getCurrentScene().id == "scene_vod/VodPlayScene"){
					W.SceneManager.getCurrentScene().onVodEvent(obj);
				}else{
					if(W.SceneManager.vodPlayScene){
						W.SceneManager.vodPlayScene.onVodEvent(obj);
					}
				}
			}else if(obj.cmd == "HOME"){
				W.entryPath.reset();
				if((W.SceneManager.getCurrentScene().id == "scene_home/HomeScene" && W.SceneManager.getCurrentScene().state < 3) || 
					(W.StbConfig.isKidsMode && W.SceneManager.getCurrentScene().id.indexOf("KidsHomeScene") > 0)
				){
					W.SceneManager.destroyAll(true);
				}else{
					W.SceneManager.destroyAll(true, true);
				}
			}else if(obj.cmd == "PUSH"){
				W.LinkManager.action("P", obj.data, undefined, "push", "CloudManager");
			}else if(obj.cmd == "LINK"){
				W.LinkManager.action("L", obj.data, undefined, "link", "CloudManager");
			}else if(obj.cmd == "SCENE"){
				var sceneName;
				var param;
				var serverType = undefined;
				
				if(obj.key.indexOf("CC") > -1){
	    			serverType = "setting";
				}else{
					switch(obj.key) {
		    		case "1001":
		    			if(W.StbConfig.isKidsMode){
		    				sceneName = "scene/kids/KidsHomeScene";
		    			}else{
		    				sceneName = "scene/home/HomeScene";
		    			}
		    			serverType = "menu";
		    			break;
		    		case "1002":
		    			sceneName = "scene/home/ForYouScene";
		    			break;
		    		case "2001":
		    			sceneName = "scene/home/GuideScene";
						param = {category : obj.data};
		    			break;
		    		case "3001":
		    			sceneName = "scene/search/SearchScene";
		    			break;
		    		case "3002":
		    			sceneName = "scene/search/SearchResultScene";
		    			param = {keyword:obj.data.keyword, m_field:obj.data.m_field};
		    			break;
		    		case "4001":
		    			sceneName = "scene/vod/MovieScene";
						serverType = "category";
		    			param = {categoryId:obj.data};
		    			break;
		    		case "4002":
		    			sceneName = "scene/vod/VodDetailScene";
		    			param = {sassetId:obj.data.sassetId};
		    			if(obj.data.entry){
		        			W.entryPath.push(obj.data.entry + ".sassetId", obj.data.sassetId, "CloudManager");
		    			}
		    			break;
		    		case "4003":
		    			sceneName = "scene/vod/VodDetailScene";
		    			param = {assetId:obj.data.assetId};
		    			if(obj.data.entry){
		        			W.entryPath.push(obj.data.entry + ".assetId", obj.data.assetId, "CloudManager");
		    			}
		    			break;
		    		case "4004":
		    			sceneName = "scene/vod/VodDetailScene";
		    			param = {seriesId:obj.data.seriesId};
		    			if(obj.data.entry){
		        			W.entryPath.push(obj.data.entry + ".seriesId", obj.data.seriesId, "CloudManager");
		    			}
		    			break;
		    		case "4006":
		    			sceneName = "scene/vod/VodPackageScene";
		    			param = {product:{productId:obj.data.productId}, type:"P"};
		    			if(obj.data.entry){
		        			W.entryPath.push(obj.data.entry + ".productId", obj.data.productId, "CloudManager");
		    			}
		    			break;
					case "5001":
						if(W.SceneManager.getCurrentScene().id.indexOf("SearchScene") > 0){
							W.SceneManager.destroyAll();
						}else if(W.SceneManager.getCurrentScene().id.indexOf("SearchResultScene") > 0){
							W.SceneManager.getCurrentScene().backScene(undefined, undefined, {command:"refresh"});
						}else{
							sceneName = "scene/search/SearchScene";
						}
						break;
					case "5101":
						W.StbConfig.sceneValue.sourceId = obj.data.sourceId;
						W.StbConfig.sceneValue.releaseAdult = obj.data.releaseAdult;
						serverType = "chvod";
						break;
					case "6001":
		    			sceneName = "scene/channel/PurchaseChScene";
		    			param = {sourceId:obj.data};
		    			break;
		    		case "7001":
		    			sceneName = "scene/setting/SettingMainScene";
		    			serverType = "menu";
		    			break;
					case "8002":
						sceneName = "scene/my/NoticeScene";
						break;
					case "8003":
						sceneName = "scene/my/WatchedListScene";
						break;
					case "8004":
						sceneName = "scene/home/CategoryListScene";
						param = {category:{title:W.Texts["zzim_list"], categoryCode:"CC0103"}};
						break;
					case "8005":
						sceneName = "scene/my/BookmarkScene";
						break;
					case "8007":
						sceneName = "scene/my/PurchaseHistoryScene";
						break;
					case "8008":
						sceneName = "scene/my/CouponScene";
						break;
					case "9001":
						serverType = "link";
						param = {type:"L", data:obj.data};
						break;
					case "9002":
						serverType = "link";
						param = {type:"P", data:obj.data};
						break;
					case "9003":
						sceneName = "scene/home/AppListScene";
						param = {category:{title:"TV Application", menuType: "MC0007"}};
						break;
		    		}
				}
				
				if(serverType == "menu"){
					if(sceneName){

						var SdpDataManager = W.getModule("manager/SdpDataManager");
						SdpDataManager.getMenuTree(function(result, data, sceneName){
							var category;
							if(W.StbConfig.isKidsMode){
								for(var i=0; i < data.data.length; i++){
									if(data.data[i].menuType == "MC0004"){
										category = {category:data.data[i]};
										break;
									}
								}
							}else{
								if(sceneName.indexOf("SettingMainScene") > -1){
									for(var i=0; i < data.data.length; i++){
										if(data.data[i].menuType == "MC0010"){
											category = data.data[i].children;
											break;
										}
									}
								}else{
									category = {category:data.data};
								}
							}
							
							W.SceneManager.startScene({
								sceneName:sceneName,
								backState:W.SceneManager.BACK_STATE_KEEPHIDE,
								param:category
							});
						}, {selector:"@detail"}, sceneName);
					}
				}else if(serverType == "category"){
					if(sceneName){

						var SdpDataManager = W.getModule("manager/SdpDataManager");
						SdpDataManager.getMenuDetail(function(result, data, sceneName){
			    			W.entryPath.push("menu.categoryId", data.data[0], "CloudManager");
			    			W.SceneManager.startScene({
								sceneName:sceneName,
								backState:W.SceneManager.BACK_STATE_KEEPHIDE,
								param:data.data[0]
							});
						}, param, sceneName);
					}
				}else if(serverType == "link"){
					W.LinkManager.action(param.type, param.data);
				}else if(serverType == "setting"){
					var reqData = {menuType:"MC0010", selector:"title,categoryCode"};

					var SdpDataManager = W.getModule("manager/SdpDataManager");
					SdpDataManager.getChildMenuTree(function(result, data){
						for(var i=0; i < data.data.length; i++){
							if(data.data[i].categoryCode == obj.key){
								W.SceneManager.startScene({
									sceneName:"scene/setting/SettingScene", 
									backState:W.SceneManager.BACK_STATE_KEEPHIDE,
									param : {
										targetId: data.data[i].categoryCode,
										title : data.data[i].title
									}
								});
								break;
							}
						}
					}, reqData);
				}else if(serverType == "chvod"){
					W.SceneManager.destroyAll(undefined, undefined, true);
				}else{
					if(sceneName){
						W.SceneManager.startScene({
							sceneName:sceneName,
							backState:W.SceneManager.BACK_STATE_KEEPHIDE,
							param:param
						});
					}
				}
			}else if(obj.cmd == "ANDROID"){
				W.log.info("------------------------- ANDROID");
				if(obj.key == "updateNotiCount"){
					W.log.info("------------------------- updateNotiCount");
					W.StbConfig.androidNoti = obj.data;
					var scenes = W.SceneManager.getSceneStack();
					for(var i=0; i < scenes.length; i++){
						if(scenes[i].id.indexOf("scene_home/HomeScene") > -1){
							W.log.info("-============ " + W.StbConfig.androidNoti);
							scenes[i].resetTop();
						}
					}
				}
			}
		}else{
			//web이 요청 한 경우
			var stbTrId;
			if(obj instanceof Array){
				stbTrId = obj[0].trId;
			}else{
				stbTrId = obj.trId;
			}

			for(var i=0; i < trIdArray.length; i++){
				W.log.info(stbTrId);
				if(stbTrId == trIdArray[i]){
					if(callbackArray[i]){
						callbackArray[i](obj, paramArray[i]);
					}
					callbackArray.splice(i, 1);
					paramArray.splice(i, 1);
					trIdArray.splice(i, 1);
					objArray.splice(i, 1);
					i--;
					//break;
				}
				
			}
		}
	};

    return {
    	receiveTest : function(cmd, type, key, data){
    		var obj = {};
    		if(type) {
    			obj.type = type;
    		}else{
    			obj.type = "req_stb";
    		}
    		obj.cmd = cmd;
    		obj.key = key;
    		obj.data = data;
    		receive(obj);
    	},
    	getTotalArray : function(){
    		return {
    			callback : callbackArray,
    			param : paramArray,
    			trId : trIdArray,
    			obj : objArray
    		};
    	},
    	receive : function(str) {
    		W.log.info("receive message :: " + str);
    		var msg = JSON.parse(str);
    		receive(msg);
    	},
    	send : function(callback, obj, param) {
    		sendMsg(callback, obj, param);
    	},
    	getUp : function(callback, key, param){
    		var obj = {cmd:"GET_UP", key:key};
    		sendMsg(callback, obj, param);
    	},
    	setUp : function(callback, key, data, param){
    		var obj = {cmd:"SET_UP", key:key, data:data};
    		sendMsg(callback, obj, param);
    	},
    	closeCloudApp : function(callback, param){
    		var obj = {cmd:"BACK"};
    		sendMsg(callback, obj, param);
    	},
    	setKeySet : function(callback, keySetArray, param){
    		var obj = {cmd:"SET_KEYS", key:"KEY_SET", data:keySetArray};
    		sendMsg(callback, obj, param);
    	},
    	setKeyCode : function(callback, keyCodeArray, param){
    		var obj = {cmd:"SET_KEYS", key:"KEY_CODE", data:keyCodeArray};
    		sendMsg(callback, obj, param);
    	},
    	delKeySet : function(callback, keySetArray, param){
    		var obj = {cmd:"DEL_KEYS", key:"KEY_SET", data:keySetArray};
    		sendMsg(callback, obj, param);
    	},
    	delKeyCode : function(callback, keyCodeArray, param){
    		var obj = {cmd:"DEL_KEYS", key:"KEY_CODE", data:keyCodeArray};
    		sendMsg(callback, obj, param);
    	},
		requestToken : function(callback, errCode, param){
			var obj = {cmd:"TOKEN", key:"", data:errCode};
			sendMsg(callback, obj, param);
		},
    	authPin : function(callback, pin, isAdult, param){
    		var obj = {cmd:"AUTH_PIN", key:isAdult ? "ADULT" : "PURCHASE", data:pin};
    		sendMsg(callback, obj, param);
    	},
    	changePin : function(callback, pin, isAdult, param){
    		var obj = {cmd:"CHANGE_PIN", key:isAdult ? "ADULT" : "PURCHASE", data:pin};
    		sendMsg(callback, obj, param);
    	},
    	resetPin : function(callback, isAdult, param){
    		var obj = {cmd:"RESET_PIN", key:isAdult ? "ADULT" : "PURCHASE"};
    		sendMsg(callback, obj, param);
    	},
    	changeMode : function(callback, key, data, param){
    		var obj = {cmd:"CHANGE_MODE", key:key, data:data};
    		sendMsg(callback, obj, param);
    	},
    	setKidsRestrict : function(callback, key, data, param){
    		var obj = {cmd:"KIDS_RESTRICT", key:key, data:data};
    		sendMsg(callback, obj, param);
    	},
    	resizeVideo : function(callback, isFull, data, param){
    		var obj = {cmd:"RESIZE_VIDEO", key:isFull ? "FULL" : "PIG", data:data};
    		sendMsg(callback, obj, param);
    	},
    	addFavoriteCh : function(callback, sourceIds, param){
    		var obj = {cmd:"CHANNEL", key:"addFavorite", data:sourceIds};
    		sendMsg(callback, obj, param);
    	},
    	removeFavoriteCh : function(callback, sourceIds, param){
    		var obj = {cmd:"CHANNEL", key:"removeFavorite", data:sourceIds};
    		sendMsg(callback, obj, param);
    	},
    	changeChannel : function(callback, sourceId, param){
    		var obj = {cmd:"CHANNEL", key:"changeChannel", data:sourceId};
    		sendMsg(callback, obj, param);
    	},
    	getCurrentChannel : function(callback, param){
    		var obj = {cmd:"CHANNEL", key:"getCurrentChannel"};
    		sendMsg(callback, obj, param);
    	},
    	purchaseChannel : function(callback, sourceIds, param){
    		var obj = {cmd:"CHANNEL", key:"purchaseChannel", data:sourceIds};
    		sendMsg(callback, obj, param);
    	},
		addChChangeEvtListener : function(callback, param){
			var obj = {cmd:"CHANNEL", key:"addChChangeEvtListener"};
			sendMsg(callback, obj, param);
			this.isChannelChangeEvt = true;
		},
		removeChChangeEvtListener : function(callback, param){
			var obj = {cmd:"CHANNEL", key:"removeChChangeEvtListener"};
			sendMsg(callback, obj, param);
			this.isChannelChangeEvt = false;
		},
    	purchasedVod : function(callback, data, param){
    		var obj = {cmd:"VOD", key:"purchased", data:data};
    		sendMsg(callback, obj, param);
    	},
    	startVod : function(callback, url, vodType, cookie, offset, webAppData, param){
    		var data = {
    			url: url,
    			vodType: vodType,// VOD, LONGTAIL, PR_VOD, PR_UDP
    			cookie: cookie,
    			offset : offset,
    			webAppData : webAppData,
    			purchased : W.purchaseValue ? "KO" : "OK"
    		};
    		var obj = {cmd:"VOD", key:"start", data:data};
    		sendMsg(callback, obj, param);
    	},
    	stopVod : function(callback, data, param){
    		var obj = {cmd:"VOD", key:"stop", data:data};
    		sendMsg(callback, obj, param);
    	},
    	seekVod : function(callback, time, param){
    		var obj = {cmd:"VOD", key:"seek", data:Math.round(time)};
    		sendMsg(callback, obj, param);
    	},
    	speedVod : function(callback, speed, param){
    		var obj = {cmd:"VOD", key:"speed", data:speed};
    		sendMsg(callback, obj, param);
    	},
    	currentPosition : function(callback, param){
    		var obj = {cmd:"VOD", key:"curr_pos"};
    		sendMsg(callback, obj, param);
    	},
    	addReserveProgram : function(callback, sourceId, eventId, title, startTime, endTime, rating, auto, param){
    		var obj = {cmd:"PROGRAM", key:"addReserve", data:sourceId + "|" + eventId + "|" + (title ? title.trim() : undefined) + "|" + startTime + "|" + endTime + "|" + rating};
    		sendMsg(callback, obj, param);
    	},
    	removeReserveProgram : function(callback, sourceId, eventId, title, startTime, endTime, rating, auto, param){
    		var obj = {cmd:"PROGRAM", key:"removeReserve", data:sourceId + "|" + eventId + "|" + (title ? title.trim() : undefined) + "|" + startTime + "|" + endTime + "|" + rating};
    		sendMsg(callback, obj, param);
    	},
    	getReserveListProgram : function(callback, param){
    		var obj = {cmd:"PROGRAM", key:"getReserveList"};
    		sendMsg(callback, obj, param);
    	},
    	reset : function(callback, data, param){
    		var obj = {cmd:"RESET", key:"system", data : data};
    		sendMsg(callback, obj, param);
    	},
    	getPreview : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getPreview"};
    		sendMsg(callback, obj, param);
    	},
    	getFavoriteChannel : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getFavoriteChannel"};
    		sendMsg(callback, obj, param);
    	},
    	getSkippedChannel : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getSkippedChannel"};
    		sendMsg(callback, obj, param);
    	},
    	getBlockedChannel : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getBlockedChannel"};
    		sendMsg(callback, obj, param);
    	},
    	getUserChannel : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getUserChannel"};
    		sendMsg(callback, obj, param);
    	},
    	getParentalRating : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getParentalRating"};
    		sendMsg(callback, obj, param);
    	},
    	getTimeRestricted : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getTimeRestricted"};
    		sendMsg(callback, obj, param);
    	},
    	getVODLookStyle : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getVODLookStyle"};
    		sendMsg(callback, obj, param);
    	},
    	getVODContinuousPlay : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getVODContinuousPlay"};
    		sendMsg(callback, obj, param);
    	},
    	getMenuTransparency : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getMenuTransparency"};
    		sendMsg(callback, obj, param);
    	},
    	getAudioOutput : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getAudioOutput"};
    		sendMsg(callback, obj, param);
    	},
    	getAudioLanguage : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getAudioLanguage"};
    		sendMsg(callback, obj, param);
    	},
    	getMenuDuration : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getMenuDuration"};
    		sendMsg(callback, obj, param);
    	},
    	getStartChannelOption : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getStartChannelOption"};
    		sendMsg(callback, obj, param);
    	},
    	getMiniEpgBarking : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getMiniEpgBarking"};
    		sendMsg(callback, obj, param);
    	},
    	getMiniEpgDuration : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getMiniEpgDuration"};
    		sendMsg(callback, obj, param);
    	},
    	getVisualImpaired : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getVisualImpaired"};
    		sendMsg(callback, obj, param);
    	},
    	getClosedCaptionService : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getClosedCaptionService"};
    		sendMsg(callback, obj, param);
    	},
    	getScreenRatio : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getScreenRatio"};
    		sendMsg(callback, obj, param);
    	},
    	getMenuLanguage : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getMenuLanguage"};
    		sendMsg(callback, obj, param);
    	},
    	getAutoStandby : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getAutoStandby"};
    		sendMsg(callback, obj, param);
    	},
    	getTVPowerControl : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getTVPowerControl"};
    		sendMsg(callback, obj, param);
    	},
    	getResolution : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getResolution"};
    		sendMsg(callback, obj, param);
    	},
    	getBluetooth : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getBluetooth"};
    		sendMsg(callback, obj, param);
    	},
    	getSmartDevice : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getSmartDevice"};
    		sendMsg(callback, obj, param);
    	},
    	getSystemInfo : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"getSystemInfo"};
    		sendMsg(callback, obj, param);
    	},
    	setFavoriteChannel : function(callback, sourceIds, param){
    		var obj = {cmd:"SET_SETTING", key:"setFavoriteChannel", data:sourceIds};
    		sendMsg(callback, obj, param);
    	},
    	setSkippedChannel : function(callback, sourceIds, param){
    		var obj = {cmd:"SET_SETTING", key:"setSkippedChannel", data:sourceIds};
    		sendMsg(callback, obj, param);
    	},
    	setBlockedChannel : function(callback, sourceIds, param){
    		var obj = {cmd:"SET_SETTING", key:"setBlockedChannel", data:sourceIds};
    		sendMsg(callback, obj, param);
    	},
    	setParentalRating : function(callback, rating, adultMenu, param){
    		var obj = {cmd:"SET_SETTING", key:"setParentalRating", data:{rating:rating, adultMenu:adultMenu}};
    		sendMsg(callback, obj, param);
    	},
    	setTimeRestricted : function(callback, repeat, startTime, endTime, param){
    		var obj = {cmd:"SET_SETTING", key:"setTimeRestricted", data:{repeat:repeat, startTime:startTime, endTime:endTime}};
    		sendMsg(callback, obj, param);
    	},
    	setVODLookStyle : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setVODLookStyle", data:type}; // 1: poster, 2: list
    		sendMsg(callback, obj, param);
    	},
    	setVODContinuousPlay : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setVODContinuousPlay", data:type}; // 1: 한번더, 2:반복재생, 3: 사용안함
    		sendMsg(callback, obj, param);
    	},
    	setMenuTransparency : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setMenuTransparency", data:type}; // 1: -20, 2: -10, 3: 0, 4: 10, 5: 20
    		sendMsg(callback, obj, param);
    	},
    	setAudioOutput : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setAudioOutput", data:type}; 
    		sendMsg(callback, obj, param);
    	},
    	setAudioLanguage : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setAudioLanguage", data:type}; //1: 주음성, 2: 부음성
    		sendMsg(callback, obj, param);
    	},
    	setMenuDuration : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setMenuDuration", data:type}; //1: 10초, 2: 30초, 3: 1분
    		sendMsg(callback, obj, param);
    	},
    	setStartChannelOption : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setStartChannelOption", data:type}; //1: LCW, 2: default
    		sendMsg(callback, obj, param);
    	},
    	setMiniEpgBarking : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setMiniEpgBarking", data:type}; //1: 사용, 2: 사용 안함
    		sendMsg(callback, obj, param);
    	},
    	setMiniEpgDuration : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setMiniEpgDuration", data:type}; //1: 5초, 2: 3초, 3: 사용 안함
    		sendMsg(callback, obj, param);
    	},
    	setVisualImpaired : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setVisualImpaired", data:type}; //1: 사용, 3: 사용 안함
    		sendMsg(callback, obj, param);
    	},
    	setClosedCaptionService : function(callback, cc, dcc, param){
    		var obj = {cmd:"SET_SETTING", key:"setClosedCaptionService", data:{closedCaption:cc, digitalClosedCaption:dcc}};
    		sendMsg(callback, obj, param);
    	},
    	setScreenRatio : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setScreenRatio", data:type};// 0: 16:9 표준, 1: 16:9 와이드, 2: 16:9 줌, 3: 4:3 표준, 4: 4:3 전체, 5: 4:3 중앙
    		sendMsg(callback, obj, param);
    	},
    	setMenuLanguage : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setMenuLanguage", data:type};// 1: 한국어, 2: 영어, 3: 일본어, 4: 중국어
    		sendMsg(callback, obj, param);
    	},
    	setAutoStandby : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setAutoStandby", data:type};// 1: 사용, 2: 사용 안함
    		sendMsg(callback, obj, param);
    	},
    	setTVPowerControl : function(callback, type, param){
    		var obj = {cmd:"SET_SETTING", key:"setTVPowerControl", data:type};// 1: 사용, 2: 사용 안함
    		sendMsg(callback, obj, param);
    	},
    	setResolution : function(callback, data, param){
    		var obj = {cmd:"SET_SETTING", key:"setResolution", data:data};
    		sendMsg(callback, obj, param);
    	},
    	setBluetooth : function(callback, data, param){
    		var obj = {cmd:"SET_SETTING", key:"setBluetooth", data:data};
    		sendMsg(callback, obj, param);
    	},
    	setSmartDevice : function(callback, data, param){
    		var obj = {cmd:"GET_SETTING", key:"setSmartDevice", data:data};
    		sendMsg(callback, obj, param);
    	},
    	resetSystem : function(callback, param){
    		var obj = {cmd:"GET_SETTING", key:"resetSystem"};
    		sendMsg(callback, obj, param);
    	},
    	startDiscovery : function(callback, param){
    		var obj = {cmd:"BLUETOOTH", key:"startDiscovery"};
    		sendMsg(callback, obj, param);
    	},
    	stopDiscovery : function(callback, param){
    		var obj = {cmd:"BLUETOOTH", key:"stopDiscovery"};
    		sendMsg(callback, obj, param);
    	},
    	startPairing : function(callback, deviceId, param){
    		var obj = {cmd:"BLUETOOTH", key:"startPairing", data:deviceId};
    		sendMsg(callback, obj, param);
    	},
    	pairingPIN_BT : function(callback, pin, param){
    		var obj = {cmd:"BLUETOOTH", key:"pairingPIN", data:pin};
    		sendMsg(callback, obj, param);
    	},
    	audioOutput_BT : function(callback, data, param){
    		var obj = {cmd:"BLUETOOTH", key:"audioOutput", data:data};
    		sendMsg(callback, obj, param);
    	},
    	deviceList_BT : function(callback, param){
    		var obj = {cmd:"BLUETOOTH", key:"deviceList"};
    		sendMsg(callback, obj, param);
    	},
    	deleteDevice_BT : function(callback, deviceIds, param){
    		var obj = {cmd:"BLUETOOTH", key:"deleteDevice", data:deviceIds};
    		sendMsg(callback, obj, param);
    	},
    	addNumericKey : function(callback, param){
    		var obj = {cmd : "SET_KEYS", key: "KEY_SET", data:["NUMERIC_KEYS"]};
    		sendMsg(callback, obj, param);
			this.isNumericKey = true;
    	},
    	addExitKey : function(callback, param){
    		var obj = {cmd : "SET_KEYS", key: "KEY_SET", data:["EXIT_KEY"]};
    		sendMsg(callback, obj, param);
    	},
    	delNumericKey : function(callback, param){
    		var obj = {cmd : "DEL_KEYS", key: "KEY_SET", data:["NUMERIC_KEYS"]};
    		sendMsg(callback, obj, param);
			this.isNumericKey = false;
    	},
    	delExitKey : function(callback, param){
    		var obj = {cmd : "DEL_KEYS", key: "KEY_SET", data:["EXIT_KEY"]};
    		sendMsg(callback, obj, param);
    	},
		addPopupNumericKey : function(callback, param){
			if(this.isNumericKey) {
				this.isPopupNumericKey = true;
				return;
			} else if(this.isPopupNumericKey) {
				return;
			}
			this.isPopupNumericKey = true;
			var obj = {cmd : "SET_KEYS", key: "KEY_SET", data:["NUMERIC_KEYS"]};
			sendMsg(callback, obj, param);
		},
		delPopupNumericKey : function(callback, param){
			if(this.isNumericKey) {
				this.isPopupNumericKey = false;
				return;
			} else if(!this.isPopupNumericKey) {
				return;
			}
			this.isPopupNumericKey = false;
			var obj = {cmd : "DEL_KEYS", key: "KEY_SET", data:["NUMERIC_KEYS"]};
			sendMsg(callback, obj, param);
		},
    	closeApp : function(callback, isKidsLock, param){
    		if(W.purchaseValue){
    			var SdpDataManager = W.getModule("manager/SdpDataManager");
        		var purchaseComponent = new purchaseComp();
            	purchaseComponent.cancelPurchase(function(result, data){
            		//실패시에도 retry 하지 않음..
            		//기술팀에서 콜 받아서 처리한다고함..
            		W.log.info(result);
            		W.log.info(data);
            	}, W.purchaseValue);
            	
        		var reqData = {transactionId:W.purchaseValue.transactionId};
    			reqData.product = {productId:W.purchaseValue.product.productId};
    			reqData.commit = false;
            	W.CloudManager.sendLog("purchase", "puchase cancel ::close:: " + W.purchaseValue.transactionId);
            	SdpDataManager.buyCommit(function(result, data){
                	W.CloudManager.sendLog("purchase", "puchase cancel :close: " + W.purchaseValue.transactionId + result);
    				W.purchaseValue = undefined;
    			}, reqData);
        	}
    		
    		if(W.purchaseValue2){
    			var SdpDataManager = W.getModule("manager/SdpDataManager");
        		var purchaseComponent = new purchaseComp();
            	purchaseComponent.cancelPurchase(function(result, data){
            		//실패시에도 retry 하지 않음..
            		//기술팀에서 콜 받아서 처리한다고함..
            		W.log.info(result);
            		W.log.info(data);
            	}, W.purchaseValue2);
            	
        		var reqData = {transactionId:W.purchaseValue2.transactionId};
    			reqData.product = {productId:W.purchaseValue2.product.productId};
    			reqData.commit = false;
            	W.CloudManager.sendLog("purchase", "puchase cancel ::close:: " + W.purchaseValue2.transactionId);
            	SdpDataManager.buyCommit(function(result, data){
                	W.CloudManager.sendLog("purchase", "puchase cancel :close: " + W.purchaseValue2.transactionId + result);
    				W.purchaseValue2 = undefined;
    			}, reqData);
        	}
    		
    		
			if(W.state.isGuide) this.resizeVideo(function(){}, true);
			if(W.state.start == "CH_VOD"){
				W.SceneManager.historyBack(W.SceneManager.getSceneStack().length-2);
			}else{
				console.log("Close Cloud Application !!");
				var obj = {cmd : "CLOSE_APP"};
				if(isKidsLock){
					obj.key = "kids_lock";
				}
	    		sendMsg(callback, obj, param);
				if(cloudPingTimer) {
					clearInterval(cloudPingTimer);
					cloudPingTimer = undefined;
				}

				closeAppCount++;
				if(closeAppCount > 2) {
					if(W.WebSocket) {
						W.WebSocket.close();
						W.WebSocket = null;
						console.log("WebSocket Close");
					}
				}
			}
    	},
		getApplicationList : function(callback, param) {
			var obj = {cmd : "APPLICATION", key : "getList"};
			sendMsg(callback, obj, param);
		},
		getApplicationBanner : function(callback, data, param) {
			var obj = {cmd : "APPLICATION", key : "getBanner", data : data};
			sendMsg(callback, obj, param);
		},
		runApplication : function(callback, data, param) {
			if(W.state.isVod){
				W.PopupManager.openPopup({
                    title:W.Texts["popup_zzim_info_title"],
                    popupName:"popup/AlertPopup",
                    boldText:W.Texts["vod_alert_msg"],
                    thinText:W.Texts["vod_alert_msg2"]}
                );
			}else{
				var obj = {cmd : "APPLICATION", key : "runApp", data : data};
				sendMsg(callback, obj, param);
			}
		},
		getGridEpg : function(callback, param) {
			var obj = {cmd : "GRID_EPG"};
			sendMsg(callback, obj, param);
		},
		openAndroidNoti : function(callback, param) {
			var obj = {cmd : "ANDROID", key:"openNoti"};
			sendMsg(callback, obj, param);
		},
		openAndroidSetting : function(callback, param) {
			var obj = {cmd : "ANDROID", key:"openSetting"};
			sendMsg(callback, obj, param);
		},
    	sendLog : function(level, msg){
    		var obj = {cmd : "CLOUD_LOG", key:level, data:msg};
    		sendMsg(undefined, obj);
    	},
		sendPing : function(callback){
			var obj = {cmd : "CLOUD_PING"};
			sendMsg(callback, obj);
		},
		getVodInfo : function(callback, param) {
			var obj = {cmd : "VOD", key:"vodInfo"};
			sendMsg(callback, obj, param);
		}
    };
});