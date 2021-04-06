//@preDefine
/**
 * mod/Util
 */
W.defineModule("mod/Util", function() {
	/**
	숫자를 문자로 반환, length 값으로 앞에 '0'을 채운다.
	*/ 
	var changeDigit = function(num,digit){
		var _tmpStr = "";
		if(num.toString().length<digit){
			for(var i=0;i<(digit-num.toString().length);i++){
				_tmpStr+="0";
			}
		}
		return _tmpStr+num;
	};
	
	var getCurrentDateTime = function(lang, time){
		var cDate = time ? time : new Date();
		return 	changeDigit(cDate.getMonth()+1, 2)+"."+
		changeDigit(cDate.getDate(), 2)+" ("+
		transDay(cDate.getDay(), lang)+") "+
		changeDigit(cDate.getHours(),2)+":"+
		changeDigit(cDate.getMinutes(),2);
	};
	
	var getVodTime = function(t){
		var hh = Math.floor(t/3600);
		var mm = Math.floor((t - hh*3600)/60);
		var ss = t - hh*3600 - mm*60;
		return 	changeDigit(hh,2)+":"+
		changeDigit(mm,2)+":"+
		changeDigit(Math.round(ss),2);
	};
	
	var getCurrentDateTime2 = function(lang, time){
		var cDate = time ? time : new Date();
		var time = changeDigit(cDate.getMonth()+1, 2)+"."+
		changeDigit(cDate.getDate(), 2)+" ("+
		transDay(cDate.getDay(), lang)+") ";
		if(cDate.getHours() > 11){
			time = time + W.Texts["pm"].toLocaleUpperCase() + " ";
		}else{
			time = time + W.Texts["am"].toLocaleUpperCase() + " ";
		}
		if(cDate.getHours() > 12){
			time = time + changeDigit(cDate.getHours()-12,2)+":";
		}else{
			time = time + changeDigit(cDate.getHours(),2)+":";
		}

		time = time + changeDigit(cDate.getMinutes(),2);
		return time;
	};
	
	var getCurrentTime = function(){
		var cDate = new Date();
		return 	changeDigit(cDate.getHours(),2)+":"+
		changeDigit(cDate.getMinutes(),2);
	};
	
	var getDateFormat = function(format, time){
		var cDate = time ? time : new Date();
		format = format.replace("yyyy", cDate.getFullYear());
		format = format.replace("MM", changeDigit(cDate.getMonth()+1, 2));
		format = format.replace("dd", changeDigit(cDate.getDate(), 2));
		format = format.replace("HH", changeDigit(cDate.getHours(), 2));
		format = format.replace("mm", changeDigit(cDate.getMinutes(), 2));
		format = format.replace("ss", changeDigit(cDate.getSeconds(), 2));
		
		return format;
	};
	
	/**
	 * 서버 날짜형식을 모듈에 받게 변환
	 */
	function parseISO8601Date(dateString){
		// return new Date(dateString.replace(/-/g,"/").replace(/[TZ]/g," ").substring(0,dateString.indexOf("+")));
		return new Date(dateString.replace(/-/g,"/").replace(/[TZ]/g," "));	
	}
	/**
	 * 요일 변환 함수
	 */
	function transDay(day, lang){
		if(day == 1){
			return W.Texts["day_mon"].toLocaleUpperCase();
		}else if(day == 2){
			return W.Texts["day_tue"].toLocaleUpperCase();
		}else if(day == 3){
			return W.Texts["day_wed"].toLocaleUpperCase();
		}else if(day == 4){
			return W.Texts["day_thu"].toLocaleUpperCase();
		}else if(day == 5){
			return W.Texts["day_fri"].toLocaleUpperCase();
		}else if(day == 6){
			return W.Texts["day_sat"].toLocaleUpperCase();
		}else{
			return W.Texts["day_sun"].toLocaleUpperCase();
		}
	}
	/**
	 * 언어 타입을 해당 나라 언어명으로 변환
	 */
	function transLanguage(language){
		switch(language){
			case "chi" : language = "중국어"; break;
			case "eng" : language = "영어"; break;
			case "fre" : language = "불어"; break;
			case "ger" : language = "독일어"; break;
			case "jpn" : language = "일본어"; break;
			case "kor" : language = "한국어"; break;
			case "xko" : language = "한국어"; break;
			case "rus" : language = "러시아어"; break;
			case "spa" : language = "스페인어"; break;
			case "fil" : language = "필리핀어"; break;
			case "vie" : language = "베트남어"; break;
			case "mon" : language = "몽골어"; break;
			case "tha" : language = "태국어"; break;		 
		}
		return language;
	}

	var newDate = function(date) {
		var _date;
		if (date == undefined || date == null) {
			_date = new Date();
		} else {
			if(isNaN(date)) {
				if(date.split("+")[1]) {
					_date = new Date(date.split("+")[0]);
				} else {
					_date = new Date(date);
				}
			} else {
				_date = new Date(date);
			}
		}
		return _date;
	};

	var newISODate = function(date, needSeconds) {
		var _date = newDate(date);

		var yy = _date.getFullYear();
		var mm = _date.getMonth()+1;
		var dd = _date.getDate();

		return changeDigit(yy,4) + "-" + changeDigit(mm,2) + "-" + changeDigit(dd,2);
	}

	var newISODateTime = function(date, needSeconds) {
		var _date = newDate(date);

		var yy = _date.getFullYear();
		var mm = _date.getMonth()+1;
		var dd = _date.getDate();
		var h = _date.getHours();
		var m = _date.getMinutes();

		if(needSeconds) {
			var s = _date.getSeconds();
			var ms = _date.getMilliseconds();
			return changeDigit(yy,4) + "-" + changeDigit(mm,2) + "-" + changeDigit(dd,2) + "T"
				+ changeDigit(h,2) + ":" + changeDigit(m,2) + ":" + changeDigit(s,2) + "." + changeDigit(ms,3);
		} else {
			return changeDigit(yy,4) + "-" + changeDigit(mm,2) + "-" + changeDigit(dd,2) + "T"
				+ changeDigit(h,2) + ":" + changeDigit(m,2);
		}

	}
	
	function getCanvas() {
        var tag = document.getElementsByTagName("canvas");
        var element = null;
        if (tag.length > 0) {
            element = tag[0];
        } else {
            //$("body").append("<canvas id='tmpCanvas' style='display:none;'></canvas>");
            // ie 에서 HierarchyRequestError 발생하기 때문에 pure js code로 처리함
            //document.body.innerHTML += "<canvas id='tmpCanvas' style='display:none;'></canvas>";
            //jm.kang 위 코드처럼 추가하면 tstation-broadcastobj 의 shadow 영역의 size 가 변경되지 않음.
            element = document.createElement('canvas');
            element.id='tmpCanvas';
            element.style.display='none';
            document.getElementsByTagName("body")[0].appendChild(element);
        }
		
		return element.getContext('2d');
    }
	
	var geTxtArray = function(text, fontFamily, fontSize, width, maxLine, width2){
		var ctx = getCanvas();
		ctx.font = fontSize + "px '" + fontFamily + "'";
		var arr = [];
		var temp_text = "";
		var text_width = 0;
		var limitWidth = width;
		for (var i = 0; i < text.length; i++) {
			temp_text += text[i];
			text_width = ctx.measureText(temp_text).width;
			if(width2 && arr.length == maxLine - 1){
				limitWidth = width2;
			}
			if (limitWidth < text_width) {
				W.log.info("limitWidth === " + limitWidth, text_width);
				W.log.info("temp_text === " + temp_text);
				arr.push(temp_text);
				temp_text = "";
				if(arr.length == maxLine){
					if(i < text.length - 1){
						arr.push(text.substr(i+1));
					}
					temp_text = undefined;
					break;
				}
			}
		}
		if(temp_text){
			arr.push(temp_text);
		}
		return arr;
	};
	
	var geTxtLength = function(text, fontFamily, fontSize){
		var ctx = getCanvas();
		ctx.font = fontSize + "px '-0.03 " + fontFamily + "'";
		return ctx.measureText(text).width;
	};
	
	var createQrCode = function(targetElement, size, url){
		W.log.info("QR URL : " + url);
		var qrCodeArea = new W.Div({id:"qr_code", x:0, y:0, width:size+"px", height:size+"px", backgroundColor:"rgb(255,255,255)", position:"absolute"});
		targetElement.add(qrCodeArea);
		
		var qrCodeData = jQuery("#qr_code").qrcode({
			size: size-14,
		    text: url
		});
		jQuery("#qr_code > canvas").css({left:7, top:7});
	};

	var setCouponDate = function(dateString, str) {
		return dateString.slice(0,4) + str + dateString.slice(4,6) + str + dateString.slice(6,8);
	};

	var getPosterFilePath = function(_baseUrl, _width) {
		// 01 : original source
		// 02 : 630, 03 : 560, 04 : 490, 05 : 420, 06 : 350, 07 : 280, 08 : 210, 09 : 140, 10 : 70
		var fileName = "";
		if(_width <= 70) fileName = "/10.jpg";
		else if(_width <= 140) fileName = "/09.jpg";
		else if(_width <= 210) fileName = "/08.jpg";
		else if(_width <= 280) fileName = "/07.jpg";
		else if(_width <= 350) fileName = "/06.jpg";
		else if(_width <= 420) fileName = "/05.jpg";
		else if(_width <= 490) fileName = "/04.jpg";
		else if(_width <= 560) fileName = "/03.jpg";
		else if(_width <= 630) fileName = "/02.jpg";
		else if(_width) fileName  = "/01.jpg"

		return W.Config.IMAGE_URL + _baseUrl + fileName;
	};
	
	var getLangText = function(code){
		if(code == "KOR"){
			return W.Texts["asset_group_11"];
		}else if(code == "ENG"){
			return W.Texts["asset_group_12"];
		}else if(code == "JPN"){
			return W.Texts["asset_group_13"];
		}else if(code == "ZHO"){
			return W.Texts["asset_group_14"];
		}
	}
	
	var getAssetGroupCode = function(asset){
		var text = undefined;
		if(asset.isCaption){
			text = W.Texts["asset_group_2"];
			if(asset.captionLang){
				text += " - " + getLangText(asset.captionLang);
			}
		}else if(asset.isDubbing){
			text = W.Texts["asset_group_3"];
			if(asset.dubbingLang){
				text += " - " + getLangText(asset.dubbingLang);
			}
		}else{
			var code = asset.assetGroup;
			if(code == "010"){
				return W.Texts["asset_group_1"];
			}else if(code == "020"){
				return W.Texts["asset_group_2"];
			}else if(code == "030"){
				return W.Texts["asset_group_3"];
			}else if(code == "040"){
				return W.Texts["asset_group_4"];
			}else if(code == "050"){
				return W.Texts["asset_group_5"];
			}else if(code == "011"){
				return W.Texts["asset_group_6"];
			}else if(code == "021"){
				return W.Texts["asset_group_7"];
			}else if(code == "031"){
				return W.Texts["asset_group_8"];
			}else if(code == "041"){
				return W.Texts["asset_group_9"];
			}else if(code == "051"){
				return W.Texts["asset_group_10"];
			}
		}
		return text;
	};
	
	var getAgreementTitle = function(agreement){
		var text = "";
		if(agreement.code == "NONE"){
			text = W.Texts["none_agreement"];
		}else{
			if(agreement.period.unit == "M"){
				text += agreement.period.value + W.Texts["unit_month_until"];
			}else if(agreement.period.unit == "Y"){
				text += agreement.period.value + W.Texts["unit_year"];
			}else if(agreement.period.unit == "D"){
				text += agreement.period.value + W.Texts["unit_date"];
			}
			if(agreement.discountAmt){
				text += " (" + W.Texts["discount"].replace("@price@", W.Util.formatComma(agreement.discountAmt, 3)) + ")";
			}else if(agreement.discountRate){
				text += " (" + W.Texts["discount2"].replace("@price@", agreement.discountRate) + ")";
			}
		}
		return text;
	};

	var parseReserveProgram = function(string) {
		var obj = {};
		var pr = string.split("|");

		obj.sourceId =  pr[0] ? pr[0] : "";
		obj.eventId =  pr[1] ? pr[1] : "";
		obj.title =  pr[2] ? pr[2] : "";
		obj.startTime =  pr[3] ? pr[3] : "";
		obj.endTime =  pr[4] ? pr[4] : "";
		obj.rating =  pr[5] ? pr[5] : "";

		return obj;
	}

	var parseReserveProgramList = function(list) {
		var array = [];
		if(typeof list == "object") {
			for(var i = 0; i < list.length; i++) {
				array[i] = parseReserveProgram(list[i]);
			}
		}
		return array;
	}

	var findReserveProgram = function(_sourceId, _startTime, _title) {
		var obj;
		if(W.StbConfig.ReserveProgramList && W.StbConfig.ReserveProgramList.length > 0) {
			var obj = W.StbConfig.ReserveProgramList.find(function(event){
				if(event.sourceId == this.sourceId) {
					if(event.startTime == this.startTime) {
						if(event.title.trim() == this.title.trim()) {
							return true;
						}
					}
				}
			}, {sourceId : _sourceId, startTime : _startTime, title : _title ? _title.trim() : undefined});
		}
		return obj;
	};

	var findChannelbySrcId = function(srcId, chList) {
		if(!chList) chList = W.CH_LIST;
		var obj;
		if(chList && chList.length > 0) {
			var obj = chList.find(function(ch){
				if(ch.sourceId == this.srcId) {
					return true;
				}
			}, {srcId : srcId});
		}
		return obj;
	};
	
	var vatPrice = function(price){
		if(price){
			return price += Math.floor(price * W.Config.VAT_RATE);
		}else{
			return 0;
		}
	};
	
	var getPrice = function(data, discount){
		var price;
		if(typeof(data) == "object"){
			price = Math.floor(data.listPrice * (1 + W.Config.VAT_RATE));
			if(data.coupons){
				for(var i=0; i < data.coupons.length; i++){
					if(data.coupons[i]){
						if(data.coupons[i].amount.unit == "rate"){
							price -= price * (data.coupons[i].amount.value / 100); 
						}else{
							price -= data.coupons[i].discountAmt;
						}
					}
				}
			}else{
				if(data.discountPrice){
					price -= data.discountPrice;
				}
			}
		}else{
			price = Math.floor(data * (1 + W.Config.VAT_RATE));
			if(discount){
				price -= discount;
			}
		}
		if(price < 0){
			price = 0;
		}
		return Math.floor(price);
	};
	
	var getChThumbUrl = function(sourceId){
		return W.Config.IMAGE_URL + "/data_img/thumbnail/channel/" + sourceId + "/" + sourceId + ".jpg";
	};

	var prRatingtoStb = function(rating) {
		if(rating) {
			if(rating == "ALL") {
				return 0;
			} else if(rating == "7") {
				return 1;
			} else if(rating == "12") {
				return 2;
			} else if(rating == "15") {
				return 3;
			} else if(rating == "19") {
				return 4;
			}
		}
		return 0;
	}

	var setMarquee = function(_comp, delay, callback, isStock, paddingLeft, paddingRight) {
		W.log.info("setMarquee");
		W.log.info(_comp)
		var isRun = false;
		if(isStock) {
			_comp.comp.offsetWidth;
			delay = delay ? delay : 0;
			paddingLeft = paddingLeft ? paddingLeft : 0;
			paddingRight = paddingRight ? paddingRight : 0;
			var parent = _comp._super;
			if(parent.comp.offsetWidth - (paddingLeft + paddingRight) < _comp.comp.offsetWidth) {
				isRun = true;
			} else {
				isRun = false;
			}
		}
		//setTimeout(function(){
		_comp.comp.offsetWidth;
		delay = delay ? delay : 0;
		paddingLeft = paddingLeft ? paddingLeft : 0;
		paddingRight = paddingRight ? paddingRight : 0;
		var parent = _comp._super;
		_comp.setStyle({position:"absolute"});

		if(parent.comp.offsetWidth - (paddingLeft + paddingRight) < _comp.comp.offsetWidth) {
			var repeatAnimation = function() {
				var duration = (_comp.comp.offsetWidth + parent.comp.offsetWidth) * 28;
				_comp.ps.reset();
				_comp.ps.makeGroup(duration).
				//setCurve("linear").
				setCurve("steps("+parseInt(duration/120)+",end)").
				setTimeSpan(0,duration).
				animate(_comp, {x: [parent.comp.offsetWidth - paddingRight, -(_comp.comp.offsetWidth) + paddingLeft]}).start({repeat:2147483648});
			}

			_comp.comp.offsetWidth;
			var duration = _comp.comp.offsetWidth * 28;
			_comp.setStyle({position:"absolute", height : parent.comp.offsetHeight + "px", "backface-visibility" : "hidden"});
			_comp.ps = new W.AnimationSpec();
			_comp.ps.makeGroup(duration+delay);
			//_comp.ps.setCurve("linear");
			_comp.ps.setCurve("steps("+parseInt(duration/120)+",end)");
			_comp.ps.setTimeSpan(0,0);
			_comp.ps.animate(_comp, {x: 0});
			_comp.ps.setTimeSpan(delay,duration+delay);
			_comp.ps.animate(_comp, {x: [-0.5, -(_comp.comp.offsetWidth) + paddingLeft-5]});
			_comp.ps.setTimeSpan(duration+delay,duration+delay);
			_comp.ps.animate(_comp, {x: 0});
			_comp.ps.start({repeat:2147483648/*onTerm : callback ? callback : repeatAnimation*/});
		} else {
			_comp.setStyle({position:"relative"});
		}
		//})
		return isRun;
	};
	var stopMarquee = function(_comp){
		W.log.info("STOP MARQUEE")
		if(_comp && _comp.ps) {
			_comp.setStyle({position:"", height : "", "backface-visibility" : ""})
			_comp.comp.style.webkitTransitionDelay = "";
			_comp.comp.style.webkitTransitionDuration = "";
			_comp.comp.style.webkitTransitionTiming = "";
			_comp.comp.style.left = "";
			_comp.comp.style.webkitTransform = "";

			if(_comp.ps.onTerm) clearTimeout(_comp.ps.onTerm);
			if(_comp.ps.infinityTimer) clearInterval(_comp.ps.infinityTimer);
			_comp.ps.reset();
			_comp.ps.dispose();
		}
	};

	var getRating = function() {
		if(W.StbConfig.rating == 0) {
			return false;
		} else if(W.StbConfig.rating == 1) {
			return 19;
		} else if(W.StbConfig.rating == 2) {
			return 15;
		} else if(W.StbConfig.rating == 3) {
			return 12;
		} else if(W.StbConfig.rating == 4) {
			return 7;
		}
	};
	
	var isBlockedHotelMenu = function(category){
		if(W.StbConfig.cugType == "accommodation" && W.StbConfig.blockPurchase && category.tags){
			for(var i=0; i < category.tags.length; i++){
				if(category.tags[i] == "hotel_menu"){
					return true;
				}
			}
		}
		return false;
	};
	
	var isExistScene = function(sceneName){
		var scenes = W.SceneManager.getSceneStack();
		for(var i=0; i < scenes.length; i++){
			if(scenes[i].id.indexOf(sceneName) > -1){
				return true;
			}
		}
		return false;
	};
	
	var isWatchable = function(asset){
		if(asset.purchase || asset.originProduct == "FOD" || (asset.isWatchable && new Date() < new Date(asset.watchableUntil))){
			return true;
		}
		return false;
	};
	
	var getExpireDuration = function(product){
		if(product.purchase){
			var expireDate = newDate(product.purchase.expiresAt);
	        var today = newDate();

	        if(expireDate < today) {
	        	return W.Texts["expired_period"];
	        } else if(product.purchase.expiresAt == "9999-12-31T23:59:59") {
	            return W.Texts["popup_zzim_option_lifetime"];
	        } else {
	            today.setHours(0,0,0,0);
	            expireDate.setHours(0,0,0,0);
	            return W.Texts["detail_rental_duration"].replace("@date@", parseInt(newDate(expireDate-today).getTime()/(60*60*24*1000)));
	        }
		}else{
            return W.Texts["detail_rental_duration"].replace("@date@", product.rentalPeriod.value);
		}
	};
	
	var getRunningTime = function(rTime, isMinute, rTime2){
		var runTime = undefined;
		if(rTime){
			runTime = rTime;
		}else{
			if(rTime2){
				runTime = rTime2;
			}
		}
		if(runTime){
			var arr = runTime.split(":");
			if(isMinute){
				return parseInt(arr[0]) * 60 + parseInt(arr[1]);
			}else{
				if(arr.length == 3){
					return parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
				}else if(arr.length == 2){
					return parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60 + 59;
				}
			}
		}else{
			return 0;
		}
	};
	
	return {
		getCurrentDateTime : getCurrentDateTime,
		getCurrentDateTime2 : getCurrentDateTime2,
		getCurrentTime : getCurrentTime,
		changeDigit : changeDigit,
		newDate : newDate,
		newISODate : newISODate,
		newISODateTime : newISODateTime,
		transDay : transDay,
		geTxtArray : geTxtArray,
		geTxtLength : geTxtLength,
		getVodTime : getVodTime,
		createQrCode : createQrCode,
		setCouponDate : setCouponDate,
		getPosterFilePath : getPosterFilePath,
		getAssetGroupCode : getAssetGroupCode,
		getAgreementTitle : getAgreementTitle,
		parseReserveProgram : parseReserveProgram,
		parseReserveProgramList : parseReserveProgramList,
		findReserveProgram : findReserveProgram,
		findChannelbySrcId : findChannelbySrcId,
		getDateFormat : getDateFormat,
		vatPrice : vatPrice,
		getPrice : getPrice,
		getChThumbUrl : getChThumbUrl,
		prRatingtoStb : prRatingtoStb,
		setMarquee : setMarquee,
		stopMarquee : stopMarquee,
		getRating : getRating,
		isBlockedHotelMenu : isBlockedHotelMenu,
		isExistScene : isExistScene,
		isWatchable : isWatchable,
		getExpireDuration : getExpireDuration,
		getRunningTime : getRunningTime
	};
});