//@preDefine
/**
 * mod/config
 *
 * Author :  Kingsae1@alticast.com
 *
 * This config is refered by properties file ( ./properties/app.properties)
 */
W.defineModule("mod/Config", function () {
	
	var uiVersion = "0.0.1";
	var serverTimeout = 5000;
	var tvHubTimeout = 10000;
	var purchaseTimeout = 8000;
	var keyTimeoutTime = 400;
	var logLevel = "INFO";
	var device = "BOX";
	var env = "LIVE";
	var isLog = true;

	try {
		W.log.info("read property file !!");
		uiVersion = UI_VERSION;
		env = HE_ENV == "TEST" ? "TEST" : env;
		isLog = LOG == false ? false : isLog;
		logLevel = LOG_LEVEL;
		if (logLevel == "WARN") {
			W.LOG_LEVEL = 1;
		} else if (logLevel == "INFO") {
			W.LOG_LEVEL = 2;
		} else if (logLevel == "DEBUG") {
			W.LOG_LEVEL = 3;
		} else if (logLevel == "TRACE") {
			W.LOG_LEVEL = 4;
		} else {
			W.LOG_LEVEL = 0;
		}

		W.UI_UPDATE_DATE = UI_UPDATE_DATE;

		device = DEVICE == "PC" ? "PC" : device;
	} catch (e) {
		W.log.error("Couldn't read a proerty file !!");
		W.log.error(e);
	}

	var sdpUrlDev = "http://192.168.152.80:18080/sdp/v1/";
	var sdpUrlLive = "http://192.168.32.246:18080/sdp/v1/";
	var uiPlfUrlDev = "http://192.168.152.80:5091/uipf/v1/";
	var uiPlfUrlLive = "http://192.168.32.243:5091/uipf/v1/";
	var searchUrlDev = "http://192.168.152.80:18080/kctv/search/v1/";
	var searchUrlLive = "http://192.168.32.246:18080/kctv/search/v1/";
	var couponUrlDev = "http://192.168.152.34:8800/";
	var couponUrlLive = "http://192.168.50.233:8800/";
	var recommendUrlDev = "http://192.168.152.40:8080/rec/api/v1/";
	var recommendUrlLive = "http://192.168.52.249:8080/rec/api/v1/";
	var imageUrlDev = "http://192.168.152.80:18080/static/images";
	var imageUrlLive = "http://192.168.32.246:18080/static/images";
	var weatherUrlDev = sdpUrlDev + "weather/";
	var weatherUrlLive = sdpUrlLive + "weather/";
	var tvpayUrlDev = "https://121.189.14.124:1443/KCTV-MOBILE-VOD-TEST/";
	var tvpayUrlLIVE = "https://payment.tvhub.co.kr/KCTV-MOBILE-VOD/";
	var tvpointUrlDev = "http://121.189.14.124/tmo/";
	var tvpointUrlLive = "http://121.189.14.105/tmo/";
	var mobilePurchaseUrlDev = "https://192.168.51.40:8081/wfs/paynow.jsp";
	var mobilePurchaseUrlLive = "https://192.168.51.100:8081/wfs/paynow.jsp";
	
	//var clientAppKey = "3P525QK0N66F6D1NNTVPNMLJ70";
	var clientAppKey = "AT02J4PG5EFIQF5CC3IHLFP034";
	var tvpointDeviceType = "T009001";
	var tvpointFranchiseeCode = "KCTV001";
	var tvpayPMidDev = "INIpayTest";
	var tvpayPMidLive = "INIpayTest";
	var tvpayStoreId = "MOBILEJV01";
	var vatRate = 0.1;
	var weatherAppUrl = "weather_1";

	var callCenterNumber = "741-7777";
    
    W.KEY_DELAY_MS = 50;

    return {
    	UI_VERSION: uiVersion,
		IS_LOG: isLog,
        SERVER_TIMEOUT: serverTimeout,
        PURCHASE_TIMEOUT : purchaseTimeout,
        TV_HUB_TIMEOUT: tvHubTimeout,
        SDP_URL: env == "TEST" ? sdpUrlDev : sdpUrlLive,
        UIPLF_URL: env == "TEST" ? uiPlfUrlDev : uiPlfUrlLive,
        SEARCH_URL: env == "TEST" ? searchUrlDev : searchUrlLive,
        COUPON_URL: env == "TEST" ? couponUrlDev : couponUrlLive,
        RECOMMEND_URL: env == "TEST" ? recommendUrlDev : recommendUrlLive,
        IMAGE_URL: env == "TEST" ? imageUrlDev : imageUrlLive,
        WEATHER_URL: env == "TEST" ? weatherUrlDev : weatherUrlLive,
        TV_PAY_URL: env == "TEST" ? tvpayUrlDev : tvpayUrlLIVE,
        TV_POINT_URL: env == "TEST" ? tvpointUrlDev : tvpointUrlLive,
        MOBILE_PURCHASE_URL: env == "TEST" ? mobilePurchaseUrlDev : mobilePurchaseUrlLive,
        KEY_TIMEOUT_TIME: keyTimeoutTime,
        DEVICE: device,
        ENV: env,
        CLIENT_APP_KEY:clientAppKey,
        TV_POINT_DEV_TYPE: tvpointDeviceType,
        TV_POINT_FRAN_CODE: tvpointFranchiseeCode,
        TV_PAY_PMID: env == "TEST" ? tvpayPMidDev : tvpayPMidLive,
        TV_PAY_STORE_ID: tvpayStoreId,
		CALL_CENTER_NUMBER: callCenterNumber,
		VAT_RATE : vatRate,
		WEATHER_APP_URL : weatherAppUrl,
		setENV : function(_env) {
			HE_ENV = _env;
			env = HE_ENV == "TEST" ? "TEST" : "LIVE";
			this.ENV = env;
			this.SDP_URL =  env == "TEST" ? sdpUrlDev : sdpUrlLive;
			this.UIPLF_URL = env == "TEST" ? uiPlfUrlDev : uiPlfUrlLive;
			this.SEARCH_URL = env == "TEST" ? searchUrlDev : searchUrlLive;
			this.COUPON_URL = env == "TEST" ? couponUrlDev : couponUrlLive;
			this.RECOMMEND_URL = env == "TEST" ? recommendUrlDev : recommendUrlLive;
			this.IMAGE_URL = env == "TEST" ? imageUrlDev : imageUrlLive;
			this.WEATHER_URL = env == "TEST" ? weatherUrlDev : weatherUrlLive;
			this.TV_PAY_URL = env == "TEST" ? tvpayUrlDev : tvpayUrlLIVE;
			this.TV_POINT_URL = env == "TEST" ? tvpointUrlDev : tvpointUrlLive;
			this.MOBILE_PURCHASE_URL = env == "TEST" ? mobilePurchaseUrlDev : mobilePurchaseUrlLive;
		}
    };
});