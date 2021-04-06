/**
 * manager/CloudPCData
 */
W.defineModule("manager/CloudPCData", function() {
	
	W.log.info("define CloudPCData");
	
	function CloudPCData(){
		function receive(obj){
			W.CloudManager.receive(JSON.stringify(obj));
		};
		
		this.sendMsg = function(obj, trId){
			setTimeout(function() {
				if(obj.cmd == "TOKEN") {
					receive({
						"cmd": "TOKEN",
						"key": "",
						"data": "00CEC088IG94FMI0VK7S3H2EGO",
						"trId": trId,
						"type": "res_stb"
					});
				}
				else if(obj.cmd == "GRID_EPG") {
					receive({
						"cmd": "GRID_EPG",
						"trId": trId,
						"type": "res_stb",
						"data": {
						"getUserChannel": {
							"favorite": {
								"sourceIds": [210]
							},
							"skipped": {
								"sourceIds": [],
									"skipUnsubscribed": false
							},
							"blocked": {
								"sourceIds": []
							}
						},
						"getReserveList": [
							"70|11541|배워봅서 관광영어\t  |1540222200000|1540222800000|0",
							"7530|11020|사사건건|1540191600000|1540195200000|0"
						],
							"getCurrentChannel": 70,
							"getCurrentPermission": "ok"
						}
					});
				}
				else if(obj.cmd == "AUTH_PIN") {
					if(obj.key == "PURCHASE") {
						if(obj.data == "1111") {
							receive({
								"cmd": "AUTH_PIN",
								"key": "PURCHASE",
								"data": "OK",
								"trId": trId,
								"type": "res_stb"
							});
						} else {
							receive({
								"cmd": "AUTH_PIN",
								"key": "PURCHASE",
								"data": "KO",
								"trId": trId,
								"type": "res_stb"
							});
						}
					} else if(obj.key == "ADULT") {
						if(obj.data == "0000") {
							receive({
								"cmd": "AUTH_PIN",
								"key": "ADULT",
								"data": "OK",
								"trId": trId,
								"type": "res_stb"
							});
						} else {
							receive({
								"cmd": "AUTH_PIN",
								"key": "ADULT",
								"data": "KO",
								"trId": trId,
								"type": "res_stb"
							});
						}
					}
				} else if(obj.cmd == "CHANGE_MODE") {
					if(obj.key == "NORMAL") {
						receive({
							"cmd": "CHANGE_MODE",
							"key": "NORMAL",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "KIDS") {
						receive({
							"cmd": "CHANGE_MODE",
							"key": "KIDS",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}
				} else if(obj.cmd == "KIDS_RESTRICT") {
					if(obj.key == "OFF") {
						receive({
							"cmd": "KIDS_RESTRICT",
							"key": "OFF",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "VOD") {
						receive({
							"cmd": "KIDS_RESTRICT",
							"key": "VOD",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "TIME") {
						receive({
							"cmd": "KIDS_RESTRICT",
							"key": "TIME",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}
				}
				if(obj.cmd == "GET_SETTING"){
					if(obj.key == "getPreview"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getPreview",
							"data": {
								"favorite": 15,
								"skipped" : 5,
								"blocked" : 5,
								"vodStyle" : 1,
								"VODContinuousPlay": 1,
								"menuTransparency" : 3,
								"audioOutput" : 1,
								"audioLanguage"  :  1,
								"menuDuration": 3,
								"startChannelOption": 1,
								"barkingAD": 1,
								"miniEpgDuration": 3,
								"visualImpaired": 1,
								"closedCaption": 1,
								"screenRatio" : 1,
								"menuLanguage" : 1,
								"autoStandby" : 1,
								"TVPower" : 1,
								"resolution": 1,
								"bluetooth": 1,
								"parentalRating" : 2
							},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getFavoriteChannel"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getFavoriteChannel",
							"data": {sourceIds : [ 40, 50, 60 ]},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getSkippedChannel"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getSkippedChannel",
							"data": {sourceIds : [ 70, 80, 90 ], skipUnsubscribed : false},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getBlockedChannel"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getBlockedChannel",
							"data": {sourceIds : [ 100, 110, 120 ]},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getUserChannel"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getUserChannel",
							"data": {
								"favorite": {sourceIds : [40, 50, 60]},
								"skipped": {sourceIds : [1300, 1310, 410, 430, 450, 510, 880, 890, 900, 930, 980], skipUnsubscribed : false},
								"blocked": {sourceIds : [100, 110, 120]}
							},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getParentalRating"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getParentalRating",
							"data": {
								"rating": 1,
								"adultMenu": 0
							},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getTimeRestricted"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getTimeRestricted",
							"data": {
								"repeat": 0,
								"startTime": "0000",
								"endTime": "0000"
							},
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getVODLookStyle"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getVODLookStyle",
							"data": 1, // 1: poster, 2: list
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getVODContinuousPlay"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getVODContinuousPlay",
							"data": 1, // 1: 사용, 2: 사용안함
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getMenuTransparency"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getMenuTransparency",
							"data": 1, // 1: -20, 2: -10, 3: 0, 4: 10, 5: 20
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getAudioOutput"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getAudioOutput",
							"data": 1, // TBD
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getAudioLanguage"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getAudioLanguage",
							"data": 1, // 1: 주음성, 2: 부음성
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getMenuDuration"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getMenuDuration",
							"data": 1, // 1: 10초, 2: 30초, 3: 1분
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getStartChannelOption"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getStartChannelOption",
							"data": 1, // 1: LCW, 2: default
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getMiniEpgBarking"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getMiniEpgBarking",
							"data": 1, // 1: 사용, 2: 사용 안함
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getMiniEpgDuration"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getMiniEpgDuration",
							"data": 3, // 1: 5초, 2: 3초, 3: 사용 안함
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getVisualImpaired"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getVisualImpaired",
							"data": 1, // 1: 사용, 3: 사용 안함
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getClosedCaptionService"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getClosedCaptionService",
							"data": 1,
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getScreenRatio"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getScreenRatio",
							"data": 1, // 1: 16:9 표준, 2: 16:9 와이드, 3: 16:9 줌, 4: 4:3 표준, 5: 4:3 전체, 6: 4:3 중앙
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getMenuLanguage"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getMenuLanguage",
							"data": 1, // 1: 한국어, 2: 영어, 3: 일본어, 4: 중국어
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getAutoStandby"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getAutoStandby",
							"data": 1, // 1: 사용, 2: 사용 안함
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getTVPowerControl"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getTVPowerControl",
							"data": {
								"option":1,
								"start":1700,
								"end":2130,
								"repeat":1
							}, // 1: 사용, 2: 사용 안함
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getResolution"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getResolution",
							"data": 1,
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getBluetooth"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getBluetooth",
							"data": 1,
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getSmartDevice"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getSmartDevice",
							"data": "TBD",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getSystemInfo"){
						receive({
							"cmd": "GET_SETTING",
							"key": "getSystemInfo",
							"data": {
								"HW Version" : "123",
								"Loader Version" : "123",
								"Main SW Version" : "123",
							},
							"trId": trId,
							"type": "res_stb"
						});
					}
				} else if(obj.cmd == "SET_SETTING"){
					if(obj.key == "setFavoriteChannel"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setFavoriteChannel",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setSkippedChannel"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setSkippedChannel",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setBlockedChannel"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setBlockedChannel",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setParentalRating"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setParentalRating",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setTimeRestricted"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setTimeRestricted",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setVODLookStyle"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setVODLookStyle",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setVODContinuousPlay"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setVODContinuousPlay",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setMenuTransparency"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setMenuTransparency",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setAudioOutput"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setAudioOutput",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setAudioLanguage"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setAudioLanguage",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setMenuDuration"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setMenuDuration",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setStartChannelOption"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setStartChannelOption",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setMiniEpgBarking"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setMiniEpgBarking",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setMiniEpgDuration"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setMiniEpgDuration",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setVisualImpaired"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setVisualImpaired",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setClosedCaptionService"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setClosedCaptionService",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setScreenRatio"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setScreenRatio",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setMenuLanguage"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setMenuLanguage",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setAutoStandby"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setAutoStandby",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setTVPowerControl"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setTVPowerControl",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setResolution"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setResolution",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setBluetooth"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setBluetooth",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "setSmartDevice"){
						receive({
							"cmd": "SET_SETTING",
							"key": "setSmartDevice",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "resetSystem"){
						receive({
							"cmd": "SET_SETTING",
							"key": "resetSystem",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}
				} else if(obj.cmd == "CLOSE_APP"){
					W.log.info("------------ the end -------------");
				} else if(obj.cmd == "CHANNEL"){
					if(obj.key == "addFavorite"){
						receive({
							"cmd": "CHANNEL",
							"key": "addFavorite",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "removeFavorite"){
						receive({
							"cmd": "CHANNEL",
							"key": "removeFavorite",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "getCurrentChannel"){
						receive({
							"cmd": "CHANNEL",
							"key": "getCurrentChannel",
							"data": 110,
							"trId": trId,
							"type": "res_stb"
						});
					}
				} else if(obj.cmd == "PROGRAM"){
					if(obj.key == "getReserveList") {
						receive({
							"cmd": "PROGRAM",
							"key": "getReserveList",
							"data": ["140|EPG000010022|금융|1534743300000|1534746600000|ALL|false"],
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "addReserve") {
						receive({
							"cmd": "PROGRAM",
							"key": "addReserve",
							"data": ["150|6558|위니아 김치냉장고 외 1건|1536806100000|1536810000000|0"],
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "removeReserve") {
						receive({
							"cmd": "PROGRAM",
							"key": "removeReserve",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}
				} else if(obj.cmd == "RESET"){
					setTimeout(function(){
						receive({
							"cmd": "RESET",
							"key": "system",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}, 2000);
				} else if(obj.cmd == "AUTH_PIN"){
					receive({
						"cmd": "AUTH_PIN",
						"key": "ADULT",
						"data": "OK",
						"trId": trId,
						"type": "res_stb"
					});
				} else if(obj.cmd == "VOD"){
					if(obj.key == "start"){
						receive({
							"cmd": "VOD",
							"key": "start",
							"data": {
								duration : 5612
							},
							"trId": trId,
							"type": "res_stb"
						});

						setTimeout(function(){
							receive({
								"cmd": "VOD",
								"key": "onAdStart",
								"trId": new Date().getTime(),
								"type": "req_stb"
							});

							setTimeout(function(){
								receive({
									"cmd": "VOD",
									"key": "onVodStart",
									"data": {position:0, duration:5612, scId:"12321321321"},
									"trId": new Date().getTime(),
									"type": "req_stb"
								});

//							setTimeout(function(){
//								receive({
//									"cmd": "VOD",
//									"key": "onVodEnd",
//									"trId": new Date().getTime(),
//									"type": "req_stb"
//								});
//							}, 1000);

							}, 1);
						}, 500);
					}else if(obj.key == "stop"){
						receive({
							"cmd": "VOD",
							"key": "stop",
							"data": 300,
							"trId": trId,
							"type": "res_stb"
						});
					}else if(obj.key == "seek"){
						receive({
							"cmd": "VOD",
							"key": "seek",
							"data": 60*20,
							"trId": trId,
							"type": "res_stb"
						});
					}else if(obj.key == "speed"){
						receive({
							"cmd": "VOD",
							"key": "speed",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}else if(obj.key == "curr_pos"){
						receive({
							"cmd": "VOD",
							"key": "curr_pos",
							"data": 32,
							"trId": trId,
							"type": "res_stb"
						});
					}else if(obj.key == "vodInfo"){
						var isVodAD = true;
						receive({
							"cmd": "VOD",
							"key": "vodInfo",
							"data": {
								"assetId" : "M4587515LFOA80260601",
								"isKidsPlayer" : false,
								"prepareInfo" : {"url":"M4587515.mpg","cookie":"1pqi0xkd7j"},
								"duration" : 634,
								"currPosition" : 0,
								"vodStartTime" : 1550118821914,
								"speed" : 1,
								"isVodAD" : isVodAD
							},
							"trId": trId,
							"type": "res_stb"
						});
						
						if(isVodAD){
							setTimeout(function(){
								receive({
									"cmd": "VOD",
									"key": "onVodStart",
									"data": {position:0, duration:5612, scId:"12321321321"},
									"trId": new Date().getTime(),
									"type": "req_stb"
								});
							}, 5000);
						}
					}
				} else if(obj.cmd == "DEL_KEYS"){
					receive({
						"cmd": "DEL_KEYS",
						"key": "KEY_SET",
						"data": 60*20,
						"trId": trId,
						"type": "res_stb"
					});
				} else if(obj.cmd == "SET_KEYS"){
					receive({
						"cmd": "SET_KEYS",
						"key": "KEY_SET",
						"data": 60*20,
						"trId": trId,
						"type": "res_stb"
					});
				} else if(obj.cmd == "BLUETOOTH"){
					if(obj.key == "startDiscovery") {
						receive({
							"cmd": "BLUETOOTH",
							"key": "startDiscovery",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});

						setTimeout(function() {
							receive({
								"cmd": "BLUETOOTH",
								"key": "deviceFound",
								"data": ["브리츠 BZ-TWS5","A30DE2","audio"],
								"trId": trId,
								"type": "req_stb"
							});
						}, 1000)
					} else if(obj.key == "startPairing") {
						receive({
							"cmd": "BLUETOOTH",
							"key": "startPairing",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});

						setTimeout(function() {
							receive({
								"cmd": "BLUETOOTH",
								"key": "pairingResult",
								"data": "OK",
								"trId": trId,
								"type": "req_stb"
							});
						}, 1000)
					} else if(obj.key == "audioOutput") {
						receive({
							"cmd": "BLUETOOTH",
							"key": "audioOutput",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "deleteDevice") {
						receive({
							"cmd": "BLUETOOTH",
							"key": "deleteDevice",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					} else if(obj.key == "deviceList") {
						receive({
							"cmd": "BLUETOOTH",
							"key": "deviceList",
							"data": [["브리츠 BZ-TWS5","A30DE2","audio"], ["브리츠 BZ-TWS5","A30DE2","audio"], ["브리츠 BZ-TWS5","A30DE2","audio"], ["브리츠 BZ-TWS5","A30DE2","audio"], ["브리츠 BZ-TWS5","A30DE2","audio"], ["브리츠 BZ-TWS5","A30DE2","audio"]],
							"trId": trId,
							"type": "res_stb"
						});
					}
				} else if(obj.cmd == "APPLICATION"){
					if(obj.key == "getList"){
						receive({
							"cmd": "APPLICATION",
							"key": "getList",
							"data": [
								{"package": "xxx.yyy.zzz", "title": "app 1"},
								{"package": "aaa.bbb.ccc", "title": "app 2"}
							],
							"trId": trId,
							"type": "res_stb"
						});
					}else if(obj.key == "runApp"){
						receive({
							"cmd": "APPLICATION",
							"key": "runApp",
							"data": "OK",
							"trId": trId,
							"type": "res_stb"
						});
					}else if(obj.key == "getBanner"){
						setTimeout(function(){
							receive({
								"cmd": "APPLICATION",
								"key": "getBanner",
								"data" : [
									{"package": "xxx.yyy.zzz", "banner": "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"}, // base64
									{"package": "aaa.bbb.ccc", "banner": "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"}, // base64
								],
								"trId": trId,
								"type": "res_stb"
							});
						}, 2000);
					}
				}
			}, 100);

		}
	};

    return new CloudPCData();
});