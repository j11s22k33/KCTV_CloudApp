/**
 * manager/DataManager
 */
W.defineModule("manager/DataManager", function() {
	
	W.log.info("define DataManager");
	
	var xhr = W.getClass('XHRManager');

	var mediaCode = "mediaCode=qqq";
	var uk = "uk=aaa";
	var ip = "ip=ddd";

	var loadingQueue = [];
	var TYPE = {TVPAY : 0, USER : 1, PAY : 2};

	var send = function (options, loadingVisible, type) {
		// options property -> async, api, postData, callback,
		// reqType,
		// param,
		// delayLoading, excuteLoading

		var typ = "get";
		if (options.reqType)
			typ = options.reqType;
		try {

			xhr
				.send({
					type: typ,
					async: options.async,
					url: options.url,
					data: options.postData ? options.postData
						: {},
					timeout: W.Config.SERVER_TIMEOUT,
					successCallback: function (success,
											   result) {

						if(result) result = JSON.parse(result);
						if (options.callback) {
							options.callback(success,
								result, options.param, options.param2);
						}
					},
					errorCallback: function (success,
											 result) {
						if (options.callback) {
							options.callback(success,
								result, options.param, options.param2);
						}
					}
				});
		} catch (exception) {
			W.log.info("########### APIV4Handler ###########");
			W.log.info("## exception");
			W.log.info(exception);
			W.log.info("##########################################");

			if (options.callback) {
				options.callback(false, exception);
			}
		}
	};

	var loadingStart = function (delay, visible) {
		loadingStop();
		loading.prepare();
		delay = delay ? delay : 0;

		var obj = {
			timer: setTimeout(function () {
				loading.start(visible);
			}, delay),

			stop: function () {
				clearTimeout(this.timer);
				loading.stop();
			}
		}

		loadingQueue.push(obj);
	}
	var loadingStop = function () {
		var obj = loadingQueue.shift();
		if (obj) {
			loading.setLoadingText("loading..");
			obj.stop();
		}
	}

	return {
		getMain: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/home/menu.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},

		getSubMain: function (callback, param, param2) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/home/menu_" + param + (param2 ? "_"+param2 : "") + ".txt",
				callback: callback,
				param: param,
				param2: Number(param2)
			};

			return send(options);
		},

		getMainBanner: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/home/promo_" + param + ".txt",
				callback: callback,
				param: param
			};

			return send(options);
		},

		getMainNotice: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/home/notice.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getSearchRecentKeyword: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/search/recent_keyword.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getSearchFavoriteKeyword: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/search/favorit_keyword.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getSearchFavoritePerson: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/search/favorit_person.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getSearchFavoriteMovie: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/search/favorite_movie.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getSearchAutoList: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/search/auto_list.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getMyCoupon: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/coupon/myCoupon.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		search: function (callback, param) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "catalog/search/results.txt",
				callback: callback,
				param: param
			};

			return send(options);
		},
		
		getAssetDetail: function (callback, param, param2) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "contents/assets/mget_asset",
				callback: callback,
				param: param,
				param2: param2
			};

			return send(options);
		},
		
		
		
		
		
		
		
		
		

		getCategoryAssets: function (callback, param, param2) {
			var options = {
				async: true,
				url: W.Config.UIPLF_URL + "contents/sassets/category_sassets",
				callback: callback,
				param: param,
				param2: param2
			};

			return send(options);
		},

		getMainNew: function (flag, categoryCode, callback, param) {
			var ck = "ck=" + util.getCurrentDateTime();

			var delayLoading = flag == 4 ? 10 : 1000;

			flag = "flag=" + flag;
			var salesCate = categoryCode ? "&salesCateCode="+ categoryCode : "";
			categoryCode = categoryCode ? "&categoryCode=" + categoryCode : "";

			var needsLoading = (flag == 3 ? true : false);
			var options = {
				async: true,
				api: "main-info?" + flag + "&" + mediaCode
				+ "&" + uk + "&" + ck + "&" + ip
				+ categoryCode + salesCate
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: param,
				delayLoading: delayLoading
			};
			W.log.debug("needsLoading :: " + needsLoading);
			return send(options, needsLoading);
		},

		/**
		 * 01.07. - ?????? ?????? ?????? ??????
		 *
		 */
		getMainNotes: function (callback) {
			var ck = "ck=" + util.getCurrentDateTime();

			var api = "main-note?" + mediaCode + "&" + uk + "&"
				+ ck + "&" + ip;

			var options = {
				async: true,
				api: "main-note-list?" + mediaCode + "&" + uk + "&"
				+ ck + "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				excuteLoading: true
			};

			return send(options);
		},

		requestSmsAlert: function (mobileNo, startTime, goodsCode, goodsName, seqFrameNo, tapeSeqNo, callback, param) {
			var ck = "ck=" + util.getCurrentDateTime();

			var delayLoading = 10;

			mobileNo = mobileNo ? "&mobileNo=" + mobileNo : "";
			startTime = startTime ? "&startTime=" + startTime : "";
			goodsCode = goodsCode ? "&goodsCode=" + goodsCode : "";
			goodsName = goodsName ? "&goodsName=" + goodsName : "";
			seqFrameNo = seqFrameNo ? "&seqFrameNo=" + seqFrameNo : "";
			tapeSeqNo = tapeSeqNo ? "&tapeSeqNo=" + tapeSeqNo : "";
			var needsLoading = true;
			var options = {
				async: true,
				api: "sms-alert-insert?" + mediaCode
				+ "&" + uk + "&" + ck + "&" + ip + "&salesCateCode=EPG"
				+ mobileNo + startTime + goodsCode + goodsName + seqFrameNo + tapeSeqNo
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: param,
				delayLoading: delayLoading
			};
			W.log.debug("needsLoading :: " + needsLoading);
			return send(options, needsLoading);
		},

		/*
		 * TODO, [sj.myeong] ?????? ??????. ????????? ????????? ?????? ????????? ?????? ????????? ??????.
		 */
		getEventList: function (callback) {
			var ck = "ck=" + util.getCurrentDateTime();

			var options = {
				async: true,
				api: "event-list?" + mediaCode + "&" + uk
				+ "&" + ck + "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};

			return send(options);
		},

		/*
		 * TODO, [sj.myeong] ?????? ??????. ????????? ???????????? ?????? ????????? ?????? ????????? ??????.
		 */
		getEventView: function (eventCode, callback) {
			var ck = "ck=" + util.getCurrentDateTime();

			eventCode = eventCode ? "eventCode=" + eventCode
				: "";

			var options = {
				async: true,
				api: "event-view?" + eventCode + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};

			return send(options);
		},

		getTodayGoodsList: function (callback, param) {
			var ck = "ck=" + util.getCurrentDateTime();

			var options = {
				async: true,
				api: "today-goods-list?" + mediaCode
				+ "&" + uk + "&" + ck + "&" + ip + "&salesCateCode=EPG"
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: param
			};
			return send(options, true);
		},

		/**
		 * 02.01. ?????? ????????? ??????
		 */
		getGoodsList: function (goodsType, menuType,
								categoryCode, currentPage, callback, param) {
			var ck = "ck=" + util.getCurrentDateTime();

			goodsType = goodsType ? "goodsType=" + goodsType
				: "";
			menuType = menuType ? "menuType=" + menuType : "";
			var salesCate = categoryCode ? "salesCateCode="
			+ categoryCode : "";
			categoryCode = categoryCode ? "categoryCode="
			+ categoryCode : "";
			currentPage = currentPage ? "currentPage="
			+ currentPage : "";

			var options = {
				async: true,
				api: "goods-list?" + goodsType + "&"
				+ menuType + "&" + categoryCode + "&" + salesCate + "&"
				+ currentPage + "&" + mediaCode + "&"
				+ uk + "&" + ck + "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: param
			};

			return send(options);
		},

		/**
		 * 02.03. ?????? ???????????? ??????
		 */
		getGoodsDetail: function (goodsCode, salesCate, callback, _param) {
			var ck = "ck=" + util.getCurrentDateTime();

			goodsCode = goodsCode ? "goodsCode=" + goodsCode : "";
			salesCate = salesCate ? "salesCateCode=" + salesCate : "";

			var options = {
				async: true,
				api: "goods-detail?" + goodsCode + "&" + salesCate + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: _param
			};

			return send(options);
		},

		/**
		 * 03.01. ?????? ?????? ???????????? <br>
		 */
		getOrderGoodsInfo: function (goodsCode, salesCate, callback) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "prod/" + goodsCode,
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					prod_id : goodsCode,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback
			};

			return send(options, null, TYPE.TVPAY);
		},

		/**
		 * 01.010 ???????????? ?????? ?????? - ????????? ??????
		 *
		 */
		getOrderGoodsSum: function (seq, qty, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/qnty",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "qnty",
					type_val : qty,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},

		/**
		 * 01.010 ???????????? ?????? ?????? - ?????? ??????
		 *
		 */
		getOrderGoodsSumQty: function (seq, qty, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/qnty",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "qnty",
					type_val : qty,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 01.010 ???????????? ?????? ?????? - ?????? ??????
		 *
		 */
		getOrderGoodsSumOpt: function (seq, optn, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/optn",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "optn",
					type_val : optn,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 01.010 ???????????? ?????? ?????? - ????????????
		 *
		 */
		getOrderGoodsSumCoupon: function (seq, coupon, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/coupn",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "coupn",
					type_val : coupon,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
			/*
			 var ck = "ck=" + util.getCurrentDateTime();
			 applyCouponPromoNo = applyCouponPromoNo ? "applyCouponPromoNo="
			 + applyCouponPromoNo
			 : "";
			 applyCouponCartGoodsKey = applyCouponCartGoodsKey ? "applyCouponCartGoodsKey="
			 + applyCouponCartGoodsKey
			 : "";

			 var options = {
			 async: true,
			 api: "order-goods-sum?" + "flag=2&"
			 + applyCouponPromoNo + "&"
			 + applyCouponCartGoodsKey + "&"
			 + mediaCode + "&" + uk + "&" + ck + "&"
			 + ip,
			 callback: callback
			 };
			 loading.setLoadingText("?????????..");
			 return send(options);*/
		},

		/**
		 * 01.010 ???????????? ?????? ?????? - ??????????????????
		 *
		 */
		getOrderGoodsSumCouponCancel: function (seq, coupon, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/coupn",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "coupn",
					type_val : "",
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
			/*var ck = "ck=" + util.getCurrentDateTime();
			 applyCouponPromoNo = applyCouponPromoNo ? "applyCouponPromoNo="
			 + applyCouponPromoNo
			 : "";
			 applyCouponCartGoodsKey = applyCouponCartGoodsKey ? "applyCouponCartGoodsKey="
			 + applyCouponCartGoodsKey
			 : "";

			 var options = {
			 async: true,
			 api: "order-goods-sum?" + "flag=2&"
			 + applyCouponPromoNo + "&"
			 + applyCouponCartGoodsKey + "&"
			 + "method=cancel&" + mediaCode + "&" + uk
			 + "&" + ck + "&" + ip,
			 callback: callback
			 };
			 loading.setLoadingText("?????????..");
			 return send(options);*/
		},

		/**
		 * 01.010 ???????????? ?????? ?????? - ????????? ??????
		 *
		 */
		getOrderGoodsSumPoint: function (seq, saveAmt, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/point",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "point",
					type_val : saveAmt,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 01.010 ???????????? ?????? ?????? - ????????????
		 *
		 */
		getOrderGoodsSumFinal:  function (seq, settleGb, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/lmsmpy",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "lmsmpy",
					type_val : settleGb,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
			/*var ck = "ck=" + util.getCurrentDateTime();
			 settleGb = settleGb ? "settleGb=" + settleGb : "";
			 norestAllotMonths = norestAllotMonths ? "norestAllotMonths="
			 + norestAllotMonths
			 : "";

			 var options = {
			 async: true,
			 api: "order-goods-sum?" + "flag=5&" + settleGb
			 + "&" + norestAllotMonths + "&"
			 + mediaCode + "&" + uk + "&" + ck + "&"
			 + ip,
			 callback: callback
			 };
			 loading.setLoadingText("?????????..");
			 return send(options);*/
		},

		/**
		 * 03.02.01 ???????????? ?????? ?????? - ??????????????????
		 *
		 */
		getOrderGoodsSumDeliverRe: function (seq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "calculator/none",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					type_cd : "none",
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},

		/**
		 * 03.03. ???????????? add-cart
		 */
		addCart: function (directOrderYn, goodsCode,
						   goodsdtCode, orderQty, promoKey, salesCate,
						   callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			directOrderYn = directOrderYn ? "directOrderYn=" + directOrderYn : "";
			goodsCode = goodsCode ? "goodsCode=" + goodsCode : "";
			goodsdtCode = goodsdtCode ? "goodsdtCode="+ goodsdtCode : "";
			orderQty = orderQty ? "orderQty=" + orderQty : "";
			promoKey = promoKey ? "promoKey=" + promoKey : "";
			salesCate = salesCate ? "salesCateCode=" + salesCate : "";

			var options = {
				async: true,
				api: "add-cart?" + directOrderYn + "&"
				+ goodsCode + "&" + goodsdtCode + "&"
				+ orderQty + "&" + promoKey + "&" + salesCate + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options, false);
		},

		/**
		 * 03.04. ???????????? ?????? ??????
		 */
		smartOrder: function (phoneNo, goodsCode, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "smart-order",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO ? W.USERINFO.cust_no : null,
					ip : W.IP,
					ck : ck,
					phone_no : phoneNo,
					prod_id : goodsCode,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.PAY)
		},

		/**
		 * 03.05. ????????????(?????? ?????? ?????? ??????)
		 */
		/* getOrderCouponList: function (goodsCode, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();

		 goodsCode = goodsCode ? "goodsCode=" + goodsCode
		 : "";

		 var options = {
		 async: true,
		 api: "order-coupon-list?" + goodsCode + "&"
		 + mediaCode + "&" + uk + "&" + ck + "&"
		 + ip,
		 callback: callback
		 };

		 return send(options);
		 },*/
		getOrderCouponList: function (seq, salesCate, callback) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "coupn-point",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},


		/**
		 * 03.06. ????????? ??????
		 */
		getOrderSaveamt: function (callback) {
			var ck = "ck=" + util.getCurrentDateTime();

			var options = {
				async: true,
				api: "order-saveamt?" + mediaCode + "&" + uk
				+ "&" + ck + "&" + ip,
				callback: callback
			};

			return send(options);
		},
		getPayRestInfo: function (seq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "insl",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},
		requestTid: function (seq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "tid",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 03.07. ?????? ?????? ??????
		 */
		requestOrderSaveCard: function (settleGb, questAmt01,
										questAmt05, receiverSeq, cardNo, validYear,
										validMonth, cardPwd, residentNo, norestAllotYn,
										norestAllotMonths, salesCate, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			settleGb = settleGb ? "settleGb=" + settleGb : "";
			questAmt01 = questAmt01 ? "questAmt01="
			+ questAmt01 : "";
			questAmt05 = questAmt05 ? "questAmt05="
			+ questAmt05 : "";
			receiverSeq = receiverSeq ? "receiverSeq="
			+ receiverSeq : "";
			cardNo = cardNo ? "cardNo=" + cardNo : "";
			validYear = validYear ? "validYear=" + validYear
				: "";
			validMonth = validMonth ? "validMonth="
			+ validMonth : "";
			cardPwd = cardPwd ? "cardPwd=" + cardPwd : "";
			residentNo = residentNo ? "residentNo="
			+ residentNo : "";
			norestAllotYn = norestAllotYn ? "norestAllotYn="
			+ norestAllotYn : "";
			norestAllotMonths = norestAllotMonths ? "norestAllotMonths="
			+ norestAllotMonths
				: "";
			salesCate = salesCate ? "salesCateCode="
			+ salesCate : "";
			var options = {
				async: true,
				api: "order-save?" + settleGb + "&"
				+ questAmt01 + "&" + questAmt05 + "&"
				+ receiverSeq + "&" + cardNo + "&"
				+ validYear + "&" + validMonth + "&"
				+ cardPwd + "&" + residentNo + "&"
				+ norestAllotYn + "&"
				+ norestAllotMonths + "&"
				+ salesCate + "&" + mediaCode + "&"
				+ uk + "&" + ck + "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};

			return send(options);
		},
		/**
		 * 03.08. ????????? ?????? ??????
		 */
		requestOrderSaveDeposit: function (settleGb,
										   questAmt01, questAmt05, receiverSeq, bankCode,
										   receiverHp, salesCate, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			settleGb = settleGb ? "settleGb=" + settleGb : "";
			questAmt01 = questAmt01 ? "questAmt01="
			+ questAmt01 : "";
			questAmt05 = questAmt05 ? "questAmt05="
			+ questAmt05 : "";
			receiverSeq = receiverSeq ? "receiverSeq="
			+ receiverSeq : "";
			bankCode = bankCode ? "bankCode=" + bankCode : "";
			receiverHp = receiverHp ? "receiverHp="
			+ receiverHp : "";
			salesCate = salesCate ? "salesCateCode="
			+ salesCate : "";
			var options = {
				async: true,
				api: "order-save?" + settleGb + "&"
				+ questAmt01 + "&" + questAmt05 + "&"
				+ receiverSeq + "&" + bankCode + "&"
				+ receiverHp + "&" + salesCate
				+ "&" + mediaCode + "&" + uk + "&" + ck
				+ "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};

			return send(options);
		},
		/**
		 * 03.09. 0??? ???????????? ?????? ??????
		 */
		requestOrderSaveFreeGoods: function (flag, seq, salesCate, goodsCode, phoneNo, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "consulting-order",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO ? W.USERINFO.cust_no : null,
					ip : W.IP,
					ck : ck,
					phone_no : phoneNo,
					prod_id : goodsCode,
					salesCateCode : salesCate,
					flag : flag,
					seq : seq
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.PAY)
		},
		/**
		 * 03.10. ?????? ?????? ?????? ?????? ?????? ??????
		 */
		getOrderSaveEnd: function (seq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "fns",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},
		/*getOrderSaveEnd: function (orderNo, salesCateCode,
		 callback, _param) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 orderNo = orderNo ? "orderNo=" + orderNo : "";
		 salesCateCode = salesCateCode ? "salesCateCode="
		 + salesCateCode : "";
		 var options = {
		 async: true,
		 api: "order-save-end?" + orderNo + "&"
		 + salesCateCode + "&" + mediaCode + "&"
		 + uk + "&" + ck + "&" + ip,
		 callback: callback,
		 param: _param
		 };

		 return send(options);
		 },*/

		//???????????? ??????
		getMemberInfo: function (salesCate, callback, _param) {
			var ck = "ck=" + util.getCurrentDateTime();
			salesCate = salesCate ? "&salesCateCode=" + salesCate : "";
			var options = {
				async: true,
				api: "member-info?"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip + salesCate
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: _param
			};

			return send(options);
		},

		/**
		 * 04.01. ?????? ?????? ?????? Error Code 200 : ?????? 204 : ????????? ?????? ?????????
		 * ????????????. 599 : ????????? ???????????????.
		 */
		getTvSaidList: function (salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "list",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*getTvSaidList: function (callback, _param) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 var said = "said=" + W.STBID;

		 var options = {
		 async: true,
		 api: "tv-said-list?" + said + "&" + mediaCode
		 + "&" + uk + "&" + ck + "&" + ip,
		 callback: callback,
		 param: _param
		 };
		 return send(options);
		 },*/

		/**
		 * 04.02. ????????? ?????? ?????? Error Code 200 : ?????? 599 : ????????? ???????????????.
		 * ???????????? n??? ???????????????. \n??????????????? ?????? ?????? ????????? ????????????. \n5??? ?????? ?????? ???,
		 * ??????????????? ??????????????????. ???????????? 5??? ?????? ????????? ???????????? ???????????????. \n??????????????? ??????
		 * ????????????. \n???????????? : 080-258-8889 ?????? ????????????????????????
		 */
		loginProc: function (salesCate, custNo, pwd, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "login",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					cust_no : custNo,
					passwd : pwd,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*loginProc: function (custNo, pwd, callback, param) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 var said = "said=" + W.STBID;
		 custNo = custNo ? "custNo=" + custNo : "";
		 pwd = pwd ? "pwd=" + pwd : "";

		 var options = {
		 async: true,
		 api: "login-proc?" + said + "&" + custNo + "&"
		 + pwd + "&" + mediaCode + "&" + uk
		 + "&" + ck + "&" + ip,
		 callback: callback,
		 param: param
		 };
		 return send(options);
		 },*/

		/**
		 * 04.03. ???????????? ?????? ?????? <br>
		 * Error Code <br>
		 * 200 : ?????? <br>
		 * 599 : ????????? ???????????????. <br>
		 * ??? ???????????? ??? ???????????? ????????? ???????????? ????????????. <br>
		 * ?????? ????????????????????????. <br>
		 */
		/*changePw: function (custNo, pwd, rePwd, callback, _param) {
		 var ck = util.getCurrentDateTime();
		 var options = {
		 async: true,
		 api: "change_passwd",
		 reqType : "post",
		 postData : {
		 medi_cd : W.CONFIG.MEDIA_CODE,
		 uk : W.STBID,
		 ip : W.IP,
		 ck : ck,
		 cust_no : custNo,
		 passwd : pwd,
		 repasswd : rePwd
		 },
		 callback: callback,
		 param: _param
		 };

		 //loading.setLoadingText("?????????..");
		 return send(options, null, TYPE.USER)
		 },*/
		changePw: function (salesCate, cpwd, pwd, rePwd, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			cpwd = cpwd ? "pwd=" + cpwd : "";
			pwd = pwd ? "newPwd=" + pwd : "";
			rePwd = rePwd ? "newPwdOk=" + rePwd : "";
			salesCate = salesCate ? "salesCateCode=" + salesCate : "";
			var options = {
				async: true,
				api: "member-info-mod?dataUpdateFlag=1&"
				+ cpwd + "&" + pwd + "&" + rePwd + "&" + salesCate + "&" + mediaCode
				+ "&" + uk + "&" + ck + "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 04.04. ??????????????????
		 *
		 * flag <br>
		 * 1:?????????????????? <br>
		 * 2:???????????????????????? <br>
		 * 3:KMC ????????? ????????? ????????? <br>
		 * phoneNum : ??????????????? <br>
		 * phoneCorp : <br>
		 * ?????????(SKT, KTF, LGT, SKM, KTM) <br>
		 * name : ?????? <br>
		 * birthday : ???????????? <br>
		 * (ex 19990101) <br>
		 * gender : ?????? <br>
		 * (??????:0, ??????:1)<br>
		 * nation : ?????? <br>
		 * (?????????:0, ?????????:1) <br>
		 * Error Code <br>
		 * 200 : ??????, <br>
		 * 599 : ????????? ???????????????., ??????<br>
		 */
		requestOTP: function (salesCate, custNo, custName, phoneNo, phoneCorp, /*name,*/
							  birthYear, birthMonth, birthDay, gender, nation, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "hp-auth/phone-auth",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					hp : phoneNo,
					hp_corp : phoneCorp,
					birth_year : birthYear,
					birth_month : birthMonth,
					birth_day : birthDay,
					gender : gender,
					nation : nation,
					cust_no : custNo,
					cust_name : custName,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*requestOTP: function (phoneNo, phoneCorp, name,
		 birthday, gender, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 phoneNo = phoneNo ? "phoneNo=" + phoneNo : "";
		 phoneCorp = phoneCorp ? "phoneCorp=" + phoneCorp
		 : "";
		 name = name ? "name=" + encodeURIComponent(name) : "";
		 birthday = birthday ? "birthday=" + birthday : "";
		 gender = gender ? "gender=" + gender : "";
		 var options = {
		 async: true,
		 api: "hp-authentication?" + "flag=1&"
		 + phoneNo + "&" + phoneCorp + "&"
		 + phoneCorp + "&" + name + "&"
		 + birthday + "&" + gender + "&"
		 + "nation=0&" + mediaCode + "&" + uk
		 + "&" + ck + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 },*/

		/**
		 * 04.04. ????????????????????????
		 *
		 * flag <br>
		 * 1:?????????????????? <br>
		 * 2:???????????????????????? <br>
		 * 3:KMC ????????? ????????? ????????? <br>
		 * smsKey : SMS ????????? <br>
		 * sequenceKey : flag1 ??? ?????? res ???. <br>
		 * Error Code 200 : ?????? <br>
		 * 599 : ????????? ???????????????., ?????? <br>
		 */
		confirmOTP: function (salesCate, smsKey, sequenceKey, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "hp-auth/sms-auth",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					sms_key : smsKey,
					sequence_key : sequenceKey,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/* confirmOTP: function (smsKey, sequenceKey, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 smsKey = smsKey ? "smsKey=" + smsKey : "";
		 sequenceKey = sequenceKey ? "sequenceKey="
		 + sequenceKey : "";
		 var options = {
		 async: true,
		 api: "hp-authentication?" + "flag=2&" + smsKey
		 + "&" + sequenceKey + "&" + mediaCode
		 + "&" + uk + "&" + ck + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 },*/

		/**
		 * 04.04. ???????????????????????????
		 *
		 * @params flag 1:?????????????????? 2:???????????????????????? 3:KMC ????????? ????????? ?????????
		 *         smsKey : SMS ????????? sequenceKey : flag1 ??? ?????? res
		 *         ???. Error Code 200 : ??????, 599 : ????????? ???????????????., ??????
		 */
		reConfirmOTP: function (salesCate, smsKey, sequenceKey, retryData, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "hp-auth/sms-auth",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					sms_key : smsKey,
					sequence_key : sequenceKey,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*reConfirmOTP: function (smsKey, sequenceKey, retryData,
		 callback) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 smsKey = smsKey ? "smsKey=" + smsKey : "";
		 sequenceKey = sequenceKey ? "sequenceKey="
		 + sequenceKey : "";
		 retryData = retryData ? "retryData=" + retryData
		 : "";
		 var options = {
		 async: true,
		 api: "hp-authentication?" + "flag=2&" + smsKey
		 + "&" + sequenceKey + "&" + retryData
		 + "&" + mediaCode + "&" + uk + "&" + ck
		 + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 },*/

		/**
		 * 04.04. KMC ????????? ????????? ?????????
		 *
		 * flag <br>
		 * 1:?????????????????? <br>
		 * 2:???????????????????????? <br>
		 * 3:KMC ????????? ????????? ?????????<br>
		 * sequenceKey : flag1 ??? ?????? res ???.<br>
		 * Error Code<br>
		 * 200 : ?????? <br>
		 * 599 : ????????? ???????????????., ?????? <br>
		 */
		requestKMC: function (salesCate, sequenceKey, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "hp-auth/sms-retry",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					sequence_key : sequenceKey,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*requestKMC: function (sequenceKey, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 sequenceKey = sequenceKey ? "sequenceKey="
		 + sequenceKey : "";
		 var options = {
		 async: true,
		 api: "hp-authentication?" + "flag=3&"
		 + sequenceKey + "&" + mediaCode + "&"
		 + uk + "&" + ck + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 },*/

		/**
		 * 04.05. ?????? ?????? ??????
		 *
		 * flag = 1(Sky T ?????? TV ????????? ????????????) <br>
		 * flag = 2(Sky T?????? ???????????? ????????????) <br>
		 * flag = 3(?????????????????????_[???????????? ?????? ??????]) <br>
		 * flag = 4(?????????????????????_[?????????????????? ????????? ?????? ?????? ??????]) <br>
		 * flag = 5(?????????????????????_[????????? ??????????????????]) <br>
		 * flag = 6(?????????????????????_[????????? ???????????? ??????])<br>
		 * Error Code <br>
		 * 200 : ??????, 599 : ????????? ???????????????.<br>
		 */
		requestTermContents: function (salesCate, flag, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "agreement/"+flag,
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*requestTermContents: function (flag, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 flag = flag ? "flag=" + flag : "";
		 var options = {
		 async: true,
		 api: "provision?" + flag + "&" + mediaCode
		 + "&" + uk + "&" + ck + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 },*/

		/**
		 * 04.06. ????????? ?????? ?????? ??????
		 */
		requestSimpleJoin: function (salesCate, phoneNo, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "mobile-reg-sms",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					ip : W.IP,
					ck : ck,
					hp : phoneNo,
					salesCateCode : salesCate
				},
				callback: callback,
				param: _param
			};

			//loading.setLoadingText("?????????..");
			return send(options, null, TYPE.USER)
		},
		/*requestSimpleJoin: function (phoneNo, callback) {
		 var ck = util.getCurrentDateTime();
		 var options = {
		 async: true,
		 api: "mobile-reg-sms",
		 reqType : "post",
		 postData : {
		 medi_cd : W.CONFIG.MEDIA_CODE,
		 uk : W.STBID,
		 ip : W.IP,
		 ck : ck,
		 hp : phoneNo
		 },
		 callback: callback
		 };
		 return send(options, null, TYPE.USER)
		 },*/
		/**
		 * 04.07. ??????ID ?????? ??? ?????? ?????? ??????
		 */
		requestSaidProcess: function (callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			var said = "said=" + W.STBID;
			var options = {
				async: true,
				api: "said-process?" + said
				+ "&" + mediaCode + "&" + uk + "&" + ck
				+ "&" + ip,
				callback: callback
			};
			return send(options);
		},

		/**
		 * 05.03. ?????? ?????? ?????? ?????? (???????????????)
		 */
		changeOrderReceiverMod: function (orderNo, receiver,
										  receiverPost, receiverPostSeq, bldNum,
										  receiverEtcAddr, receiverHp1, receiverHp2,
										  receiverHp3, receiverUpdateYn, receiverSeq,
										  areaGb, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			orderNo = orderNo ? "orderNo=" + orderNo : "";
			receiver = receiver ? "receiver=" + receiver : "";
			receiverPost = receiverPost ? "receiverPost="
			+ receiverPost : "";
			receiverPostSeq = receiverPostSeq ? "receiverPostSeq="
			+ receiverPostSeq
				: "";
			bldNum = bldNum ? "bldNum=" + bldNum : "";
			receiverEtcAddr = receiverEtcAddr ? "receiverEtcAddr="
			+ receiverEtcAddr
				: "";
			receiverHp1 = receiverHp1 ? "receiverHp1="
			+ receiverHp1 : "";
			receiverHp2 = receiverHp2 ? "receiverHp2="
			+ receiverHp2 : "";
			receiverHp3 = receiverHp3 ? "receiverHp3="
			+ receiverHp3 : "";
			receiverUpdateYn = receiverUpdateYn ? "receiverUpdateYn="
			+ receiverUpdateYn
				: "";
			receiverSeq = receiverSeq ? "receiverSeq="
			+ receiverSeq : "";
			areaGb = areaGb ? "areaGb=" + areaGb : "";

			var options = {
				async: true,
				api: "order-receiver-mod?" + orderNo + "&"
				+ receiver + "&" + receiverPost + "&"
				+ receiverPostSeq + "&" + bldNum + "&"
				+ receiverEtcAddr + "&" + receiverHp1
				+ "&" + receiverHp2 + "&" + receiverHp3
				+ "&" + receiverUpdateYn + "&"
				+ receiverSeq + "&" + areaGb + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 05.04. ???????????? ??????
		 */
		getPostList: function (seq, dongName, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/find",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					q : dongName,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},
		/*getPostList: function (dongName, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();
		 dongName = dongName ? "dongName=" + encodeURIComponent(dongName) : "";
		 var options = {
		 async: true,
		 api: "post-list?" + dongName + "&" + mediaCode
		 + "&" + uk + "&" + ck + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 },*/

		/**
		 * 05.05. ?????? ?????? ????????? - ?????? ????????? ?????? <br>
		 */
		getRecentReceiverList: function (seq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/cust-recnt",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},

		/**
		 * 05.05. ?????? ?????? ????????? - ?????? ????????? ?????? <br>
		 */
		getDefaultReceiverList: function (seq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/cust-bas",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};

			loading.setLoadingText("?????????..");
			return send(options, null, TYPE.TVPAY)
		},

		/**
		 * 05.06. ?????? ????????? ????????? ?????? - <br>
		 */
		changeOrderAddressInfoNm: function (seq, name, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/rcvr/nm",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					amd_cd : "nm",
					amd_nm : name,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},
		changeOrderAddressInfoAdr: function (seq, zipCd, zipSeq, dtlAdr, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/rcvr/adr",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					amd_cd : "adr",
					amd_adr_zip_cd : zipCd,
					amd_adr_zip_seq : zipSeq,
					amd_adr_dtl_adr : dtlAdr,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},
		changeOrderAddressInfoTel: function (seq, tel1, tel2, tel3, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/rcvr/tel",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					amd_cd : "tel",
					amd_tel_01 : tel1,
					amd_tel_02 : tel2,
					amd_tel_03 : tel3,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},
		changeOrderAddressInfoRecnt: function (seq, dlvSeq, salesCate, callback, _param) {
			var ck = util.getCurrentDateTime();
			var options = {
				async: true,
				api: "dlvzn/rcvr/recnt",
				reqType : "post",
				postData : {
					medi_cd : W.CONFIG.MEDIA_CODE,
					uk : W.STBID,
					cust_no : W.USERINFO.cust_no,
					seq : seq,
					amd_cd : "recnt",
					amd_dlvzn_seq : dlvSeq,
					ip : W.IP,
					ck : ck,
					salesCateCode : salesCate
				},
				callback: callback,
				param : _param
			};
			return send(options, null, TYPE.TVPAY)
		},
		/*changeOrderAddressInfo: function (receiver, receiverPost, receiverPostSeq, receiverAddr,
		 receiverEtcAddr, bldNum, receiverHp1, receiverHp2, receiverHp3, callback) {
		 var ck = "ck=" + util.getCurrentDateTime();

		 receiver = receiver ? "&receiver=" + encodeURIComponent(receiver) : "";
		 receiverPost = receiverPost ? "&receiverPost=" + encodeURIComponent(receiverPost) : "";
		 receiverPostSeq = receiverPostSeq ? "&receiverPostSeq=" + encodeURIComponent(receiverPostSeq) : "";
		 receiverAddr = receiverAddr ? "&receiverAddr=" + encodeURIComponent(receiverAddr) : "";
		 receiverEtcAddr = receiverEtcAddr ? "&receiverEtcAddr=" + encodeURIComponent(receiverEtcAddr) : "";
		 bldNum = bldNum ? "&bldNum=" + bldNum : "";
		 receiverHp1 = receiverHp1 ? "&receiverHp1=" + receiverHp1 : "";
		 receiverHp2 = receiverHp2 ? "&receiverHp2=" + receiverHp2 : "";
		 receiverHp3 = receiverHp3 ? "&receiverHp3=" + receiverHp3 : "";

		 var options = {
		 async: true,
		 api: "my-receiver-mod?" + "flag=2"
		 + receiver + receiverPost + receiverPostSeq
		 + receiverAddr + receiverEtcAddr + receiverEtcAddr
		 + bldNum + receiverHp1 + receiverHp2 + receiverHp3 + "&receiverGb=10"
		 + "&" + mediaCode + "&" + uk + "&" + ck + "&" + ip,
		 callback: callback
		 };
		 return send(options);
		 var ck = util.getCurrentDateTime();
		 var options = {
		 async: true,
		 api: "dlvzn/cust-bas",
		 reqType : "post",
		 postData : {
		 medi_cd : W.CONFIG.MEDIA_CODE,
		 uk : W.STBID,
		 cust_no : W.USERINFO.cust_no,
		 seq : seq,
		 ip : W.IP,
		 ck : ck,
		 salesCateCode : salesCate
		 },
		 callback: callback,
		 param : _param
		 };
		 return send(options, null, TYPE.TVPAY)
		 },*/

		/**
		 * 05.11. ?????? ?????? ?????????
		 */
		getMyCouponList: function (_currentPage, _rowsPerPage, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			var currentPage = _currentPage ? "currentPage=" + _currentPage : "";
			var rowsPerPage = _rowsPerPage ? "rowsPerPage=" + _rowsPerPage : "";
			var options = {
				async: true,
				api: "my-coupon-list?" + currentPage + "&" + rowsPerPage + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 05.12. ????????? ?????? ??????
		 */
		getMySaveamtList: function (_currentPage, _rowsPerPage, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			var currentPage = _currentPage ? "currentPage=" + _currentPage : "";
			var rowsPerPage = _rowsPerPage ? "rowsPerPage=" + _rowsPerPage : "";
			var options = {
				async: true,
				api: "my-saveamt-list?" + currentPage + "&" + rowsPerPage + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 05.15. ????????? ?????? ?????? - ???/???
		 */
		getRoadPostListSiDo: function (selectGb, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			selectGb = selectGb ? "selectGb=" + selectGb : "";
			var options = {
				async: true,
				api: "road-post-list?" + selectGb + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 05.15. ????????? ?????? ?????? - ???/???/???
		 */
		getRoadPostListSiGunGu: function (selectGb, dataCode,
										  callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			selectGb = selectGb ? "selectGb=" + selectGb : "";
			dataCode = dataCode ? "dataCode=" + dataCode : "";
			var options = {
				async: true,
				api: "road-post-list?" + selectGb + "&"
				+ dataCode + "&" + mediaCode + "&" + uk
				+ "&" + ck + "&" + ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 05.15. ????????? ?????? ?????? - ??????
		 */
		getRoadPostListFullAddr: function (selectGb, cityName,
										   guName, roadName, bldNum, callback) {
			var ck = "ck=" + util.getCurrentDateTime();
			selectGb = selectGb ? "selectGb=" + selectGb : "";
			cityName = cityName ? "cityName=" + cityName : "";
			guName = guName ? "guName=" + guName : "";
			roadName = roadName ? "roadName=" + roadName : "";
			bldNum = bldNum ? "bldNum=" + bldNum : "";
			var options = {
				async: true,
				api: "road-post-list?" + selectGb + "&"
				+ cityName + "&" + guName + "&"
				+ roadName + "&" + bldNum + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};
			return send(options);
		},

		/**
		 * 06.01. ???????????? ????????? ?????? <br>
		 * 61 : ???????????? <br>
		 * 62 : ???????????? <br>
		 * 63 : ???????????? <br>
		 * 70 : ??????????????? <br>
		 * 71 : ????????????????????? <br>
		 * 66 : ???????????? <br>
		 * 72 : ???????????????????????? <br>
		 */
		getContentsList: function (salesCate, menuType, currentPage,
								   rowsPerPage, callback, param) {
			var ck = "ck=" + util.getCurrentDateTime();

			menuType = menuType ? "menuType=" + menuType : "";
			salesCate = salesCate ? "salesCateCode=" + salesCate : "";
			currentPage = currentPage ? "currentPage="
			+ currentPage : "";
			rowsPerPage = rowsPerPage ? "rowsPerPage="
			+ rowsPerPage : "";

			var options = {
				async: true,
				api: "notice-list?" + menuType + "&" + salesCate + "&"
				+ currentPage + "&" + rowsPerPage + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback,
				param: param
			};

			return send(options);
		},

		/**
		 * 06.01. ???????????? ???????????? ?????? <br>
		 */
		getContentsView: function (salesCate, noticeNo, callback) {
			var ck = "ck=" + util.getCurrentDateTime();

			noticeNo = noticeNo ? "noticeNo=" + noticeNo : "";
			salesCate = salesCate ? "salesCateCode=" + salesCate : "";

			var options = {
				async: true,
				api: "notice-view?" + noticeNo + "&" + salesCate + "&"
				+ mediaCode + "&" + uk + "&" + ck + "&"
				+ ip
				+ ((W.USERINFO && W.USERINFO.userInfo) ? ("&cust_no=" + W.USERINFO.userInfo.cust_no + "&membGb="+W.USERINFO.userInfo.membGb+"&custGb="+W.USERINFO.userInfo.custGb+"&emYn="+W.USERINFO.userInfo.emYn+"&firstOrderYn="+W.USERINFO.userInfo.firstOrderYn) : ""),
				callback: callback
			};

			return send(options);
		}

	};
});