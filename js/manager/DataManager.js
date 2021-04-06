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
		 * 01.07. - 메인 화면 공지 조회
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
		 * TODO, [sj.myeong] 삭제 예정. 이벤트 리스트 조회 고도화 이후 제거될 예정.
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
		 * TODO, [sj.myeong] 삭제 예정. 이벤트 상세정보 조회 고도화 이후 제거될 예정.
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
		 * 02.01. 상품 리스트 조회
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
		 * 02.03. 상품 상세정보 조회
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
		 * 03.01. 주문 상품 정보요청 <br>
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
		 * 01.010 선택상품 가격 계산 - 진입시 계산
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},

		/**
		 * 01.010 선택상품 가격 계산 - 수량 계산
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 01.010 선택상품 가격 계산 - 옵션 계산
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 01.010 선택상품 가격 계산 - 쿠폰계산
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

			loading.setLoadingText("계산중..");
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
			 loading.setLoadingText("계산중..");
			 return send(options);*/
		},

		/**
		 * 01.010 선택상품 가격 계산 - 쿠폰계산취소
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

			loading.setLoadingText("계산중..");
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
			 loading.setLoadingText("계산중..");
			 return send(options);*/
		},

		/**
		 * 01.010 선택상품 가격 계산 - 포인트 계산
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 01.010 선택상품 가격 계산 - 할부선택
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

			loading.setLoadingText("계산중..");
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
			 loading.setLoadingText("계산중..");
			 return send(options);*/
		},

		/**
		 * 03.02.01 선택상품 가격 계산 - 배송비재계산
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
		 * 03.03. 바로구매 add-cart
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
		 * 03.04. 스마트폰 구매 요청
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
		 * 03.05. 쿠폰조회(상품 적용 가능 쿠폰)
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},


		/**
		 * 03.06. 포인트 조회
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

			loading.setLoadingText("계산중..");
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},
		/**
		 * 03.07. 카드 결제 요청
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
		 * 03.08. 무통장 결제 요청
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
		 * 03.09. 0원 상담상품 결제 요청
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
		 * 03.10. 주문 결제 요청 처리 결과 조회
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

			//loading.setLoadingText("계산중..");
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

		//개인정보 조회
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
		 * 04.01. 계정 목록 요청 Error Code 200 : 성공 204 : 요하신 계정 목록이
		 * 없습니다. 599 : 시스템 오류입니다.
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

			//loading.setLoadingText("계산중..");
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
		 * 04.02. 로그인 인증 요청 Error Code 200 : 성공 599 : 시스템 오류입니다.
		 * 비밀번호 n회 오류입니다. \n비밀번호를 다시 한번 확인해 주십시오. \n5회 이상 오류 시,
		 * 고객센터로 문의바랍니다. 비밀번호 5회 이상 오류로 로그인이 제한됩니다. \n고객센터로 문의
		 * 바랍니다. \n고객센터 : 080-258-8889 실패 시스템오류입니다
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

			//loading.setLoadingText("계산중..");
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
		 * 04.03. 비밀번호 변경 요청 <br>
		 * Error Code <br>
		 * 200 : 성공 <br>
		 * 599 : 시스템 오류입니다. <br>
		 * 새 비밀번호 와 비밀번호 확인이 일치하지 않습니다. <br>
		 * 실패 시스템오류입니다. <br>
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

		 //loading.setLoadingText("계산중..");
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
		 * 04.04. 인증번호요청
		 *
		 * flag <br>
		 * 1:인증번호요청 <br>
		 * 2:인증번호확인요청 <br>
		 * 3:KMC 핸드폰 인증키 재요청 <br>
		 * phoneNum : 휴대폰번호 <br>
		 * phoneCorp : <br>
		 * 통신사(SKT, KTF, LGT, SKM, KTM) <br>
		 * name : 이름 <br>
		 * birthday : 생년월일 <br>
		 * (ex 19990101) <br>
		 * gender : 성별 <br>
		 * (남자:0, 여자:1)<br>
		 * nation : 국적 <br>
		 * (내국인:0, 외국인:1) <br>
		 * Error Code <br>
		 * 200 : 성공, <br>
		 * 599 : 시스템 오류입니다., 실패<br>
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

			//loading.setLoadingText("계산중..");
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
		 * 04.04. 인증번호확인요청
		 *
		 * flag <br>
		 * 1:인증번호요청 <br>
		 * 2:인증번호확인요청 <br>
		 * 3:KMC 핸드폰 인증키 재요청 <br>
		 * smsKey : SMS 인증키 <br>
		 * sequenceKey : flag1 에 대한 res 값. <br>
		 * Error Code 200 : 성공 <br>
		 * 599 : 시스템 오류입니다., 실패 <br>
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

			//loading.setLoadingText("계산중..");
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
		 * 04.04. 인증번호확인재요청
		 *
		 * @params flag 1:인증번호요청 2:인증번호확인요청 3:KMC 핸드폰 인증키 재요청
		 *         smsKey : SMS 인증키 sequenceKey : flag1 에 대한 res
		 *         값. Error Code 200 : 성공, 599 : 시스템 오류입니다., 실패
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

			//loading.setLoadingText("계산중..");
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
		 * 04.04. KMC 핸드폰 인증키 재요청
		 *
		 * flag <br>
		 * 1:인증번호요청 <br>
		 * 2:인증번호확인요청 <br>
		 * 3:KMC 핸드폰 인증키 재요청<br>
		 * sequenceKey : flag1 에 대한 res 값.<br>
		 * Error Code<br>
		 * 200 : 성공 <br>
		 * 599 : 시스템 오류입니다., 실패 <br>
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

			//loading.setLoadingText("계산중..");
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
		 * 04.05. 가입 약관 조회
		 *
		 * flag = 1(Sky T 쇼핑 TV 방송용 이용약관) <br>
		 * flag = 2(Sky T쇼핑 개인정보 취급방침) <br>
		 * flag = 3(휴대폰본인인증_[개인정보 이용 동의]) <br>
		 * flag = 4(휴대폰본인인증_[고유식별정보 처리에 관한 사항 동의]) <br>
		 * flag = 5(휴대폰본인인증_[통신사 이용약관동의]) <br>
		 * flag = 6(휴대폰본인인증_[서비스 이용약관 동의])<br>
		 * Error Code <br>
		 * 200 : 성공, 599 : 시스템 오류입니다.<br>
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

			//loading.setLoadingText("계산중..");
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
		 * 04.06. 모바일 간편 가입 요청
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

			//loading.setLoadingText("계산중..");
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
		 * 04.07. 셋탑ID 변환 및 매핑 정보 조회
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
		 * 05.03. 배송 정보 수정 요청 (출하지시전)
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
		 * 05.04. 지번주소 검색
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
		 * 05.05. 배송 주소 리스트 - 최근 배송지 조회 <br>
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
		 * 05.05. 배송 주소 리스트 - 기본 배송지 조회 <br>
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

			loading.setLoadingText("계산중..");
			return send(options, null, TYPE.TVPAY)
		},

		/**
		 * 05.06. 주문 에서의 배송지 수정 - <br>
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
		 * 05.11. 보유 쿠폰 리스트
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
		 * 05.12. 포인트 내역 조회
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
		 * 05.15. 도로명 주소 검색 - 시/도
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
		 * 05.15. 도로명 주소 검색 - 시/군/구
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
		 * 05.15. 도로명 주소 검색 - 전체
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
		 * 06.01. 고객센터 리스트 조회 <br>
		 * 61 : 공지사항 <br>
		 * 62 : 이용안내 <br>
		 * 63 : 이용약관 <br>
		 * 70 : 내정보보기 <br>
		 * 71 : 청소년보호정책 <br>
		 * 66 : 입점문의 <br>
		 * 72 : 개인정보보호정책 <br>
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
		 * 06.01. 고객센터 상세정보 조회 <br>
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