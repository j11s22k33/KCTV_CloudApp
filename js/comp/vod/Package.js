W.defineModule(["mod/Util", "comp/Button", "comp/list/Poster", "comp/vod/DetailModule"], function(util, buttonComp, Poster, DetailModule) {
	var STATE_PURCHASE = 0;
	var STATE_LIST = 1;
    var Package = function(_parent, _parentDiv) {
    	var data;
    	var list;
    	var expireAssetCount = 0;
    	var isList = false;
    	var state = STATE_PURCHASE;
    	var index = 0;
    	var oldIndex = 0;
    	var total = 0;
    	var keyTimeout;
    	var _this;
    	var isClearPin;

    	var _comp = new W.Div({className:"bg_size"});

    	var makePackage = function(){
    		W.log.info(data);
    		_comp._package = new W.Div({x:66, y:105, width:"800px", height:"270px"});
    		_comp.add(_comp._package);
        	var _title_area = new W.Div({x:0, y:0, width:"800px", height:"38px", textAlign:"left"});
        	_comp._package.add(_title_area);
        	_title_area.add(new W.Span({position:"relative", y:0, height:"38px", textColor:"rgb(255,255,255)", "font-size":"34px", 
    			className:"font_rixhead_medium", text:data.title + " "}));
        	_title_area.add(new W.Span({position:"relative", y:1, height:"28px", textColor:"rgba(255,255,255,0.75)", "font-size":"26px", 
    			className:"font_rixhead_light", text:W.Texts["total"] + " " + list.length + W.Texts["unit_vod"]}));
        	
        	_comp._package.add(new W.Span({x:0, y:45, height:"19px", width:"600px", textColor:"rgb(255,255,255)", "font-size":"17px", 
    			className:"font_rixhead_light", text:data.subtitle}));

        	_comp._package_info = new W.Div({x:66, y:188, width:"600px", height:"58px", textAlign:"left"});
        	_comp.add(_comp._package_info);
        	
        	_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
    			className:"font_rixhead_bold", text:list.length + W.Texts["unit_vod"] + ", "}));
        	
        	if(data.rentalPeriod.value == 999 || data.productType.indexOf("LF") > 0){
    			_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
        			className:"font_rixhead_bold", text:W.Texts["detail_rental_duration_lifetime"]}));
			}else{
				_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px", 
	    			className:"font_rixhead_bold", text:util.getExpireDuration(data)}));
			}
        	
        	
        	
        	if(data.purchase){
        		
        	}else{
        		var price = util.getPrice(data);
    			if(price == 0){
    				_comp._price = new W.Span({position:"relative", y:-2, height:"29px", textColor:"rgb(237,168,2)", "font-size":"26px", 
            			className:"font_rixhead_bold", text:W.Texts["price_free"], "padding-left":"10px", display:"inline-block"});
                	_comp._package_info.add(_comp._price);
    			}else{
    				var listPrice = util.vatPrice(data.listPrice);
    				var discountPrice = listPrice - price;
    				
    				_comp._package_info.add(new W.Span({position:"relative", y:-3, height:"18px", textColor:"rgb(188,188,188)", "font-size":"18px", 
    	    			className:"font_rixhead_light", text:W.Texts["vat"], "margin-left":"10px"}));
    				
    				
    				if(discountPrice){
    					_comp._listPrice = new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(181,181,181)", "font-size":"14px", display:"inline-block",
    	        			className:"font_rixhead_light strike", text:W.Util.formatComma(listPrice, 3) + W.Texts["price_unit"], "padding-right":"2px", "margin-left":"7px"});
    	            	_comp._package_info.add(_comp._listPrice);
            		}
    				
    				_comp._price = new W.Span({position:"relative", y:-2, height:"29px", textColor:"rgb(237,168,2)", "font-size":"26px", 
            			className:"font_rixhead_bold", text:W.Util.formatComma(price, 3), "padding-left":"10px", display:"inline-block"});
                	_comp._package_info.add(_comp._price);
                	_comp._price_unit = new W.Span({position:"relative", y:-3, height:"15px", textColor:"rgb(181,181,181)", "font-size":"14px", 
        				className:"font_rixhead_light", text:W.Texts["price_unit"], "padding-left":"3px", display:"inline-block"});
                	_comp._package_info.add(_comp._price_unit);

            		if(discountPrice){
            			_comp._discount = new W.Span({position:"relative", y:-3, height:"18px", textColor:"rgb(218,188,116)", "font-size":"16px", display:"inline-block",
            				className:"font_rixhead_light", text:W.Texts["discount"].replace("@price@", W.Util.formatComma(discountPrice, 3)), "padding-left":"10px"});
                    	_comp._package_info.add(_comp._discount);
            		}
    			}
        	}
        	_comp._package_desc = new W.Div({x:1, y:140, width:"530px", height:"84px"});
        	_comp._package.add(_comp._package_desc);
        	if(data.description){
            	var desc = util.geTxtArray(data.description, "RixHeadL", 19, 530);
            	for(var i=0; i < desc.length; i++){
            		if(i == 2){
            			_comp._package_desc.add(new W.Span({x:0, y:i*28, width:"530px", height:"21px", textColor:"rgba(181,181,181,0.75)", "font-size":"19px", 
                			className:"font_rixhead_light cut", text:desc[i]}));
                    	break;
            		}else{
            			_comp._package_desc.add(new W.Span({x:0, y:i*28, width:"570px", height:"21px", textColor:"rgba(181,181,181,0.75)", "font-size":"19px", 
                			className:"font_rixhead_light", text:desc[i]}));
            		}
            	}
            	
            	
        	}
        	
        	if(!data.purchase){
        		_comp.purchaseBtn = buttonComp.create(2, 510, W.Texts["purchase_package"], 111);
            	_comp._package.add(_comp.purchaseBtn.getComp());
            	_comp.purchaseBtn.focus();
        	}
        	
    		_comp._area = new W.Div({x:0, y:353, width:"1280px", height:"290px", overflow:"hidden"});
    		_comp.add(_comp._area);
    		_comp._list = new W.Div({x:67, y:15, width:(154 * list.length) + "px", height:"204px"});
    		_comp._area.add(_comp._list);

    		_comp.posters = [];
    		_comp._postersComp = [];
    		for(var i=0; i < list.length; i++){
    			_comp.posters[i] = new Poster({type:Poster.TYPE.W136, data:list[i], isPackage:true, textAlign: i%7 > 4 ? "right" : "left"});
    			_comp._postersComp[i] = _comp.posters[i].getComp();
                _comp._postersComp[i].setStyle({x:154*i});
                _comp._list.add(_comp._postersComp[i]);
    		}
    		
    		_comp._detail = new W.Div({x:66, y:206, width:"1280px", height:"130px", display:"none"});
    		_comp.add(_comp._detail);
    		_comp._detail._title = new W.Span({x:0, y:0, width:"900px", height:"26px", textColor:"rgb(255,255,255)", "font-size":"24px", 
    			className:"font_rixhead_medium", text:list[0].title});
    		_comp._detail.add(_comp._detail._title);
    		
    		var _info = new W.Div({x:2, y:245-206, width:"500px", height:"25px", textAlign:"left", display:"inline-flex"});
        	_comp._detail.add(_info);
        	_comp._detail._star = [];
        	_comp._detail._star_b = [];
        	
        	for(var i=0; i < 5; i++){
        		_comp._detail._star_b[i] = new W.Div({position:"relative", y:0, width:"10px", height:"12px", background:"url('img/info_star.png')", "padding-right":"3px"});
        		_comp._detail._star[i] = new W.Div({y:0, width:"0px", height:"12px", background:"url('img/info_star_f.png')", overflow:"hidden"});
        		_comp._detail._star_b[i].add(_comp._detail._star[i]);
        		_info.add(_comp._detail._star_b[i]);
        	}
        	
        	_comp._detail._star_point = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px",
    			className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info.add(_comp._detail._star_point);
        	_comp._detail._like_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info.add(_comp._detail._like_bar);
        	_comp._detail._like = new W.Image({position:"relative", y:2, width:"11px", height:"10px", src:"img/info_heart.png", "padding-right":"4px"});
        	_info.add(_comp._detail._like);
        	_comp._detail._like_point = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info.add(_comp._detail._like_point);
        	_comp._detail._open_date_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info.add(_comp._detail._open_date_bar);
        	_comp._detail._open_date = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info.add(_comp._detail._open_date);
        	_comp._detail._run_time_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info.add(_comp._detail._run_time_bar);
        	_comp._detail._run_time = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info.add(_comp._detail._run_time);
        	_comp._detail._genre_bar = new W.Span({"position":"relative", y:0, width:"1px", height:"13px", backgroundColor:"rgba(255,255,255,0.15)", 
    			display:"inline-block", "margin-right":"10px"});
        	_info.add(_comp._detail._genre_bar);
        	_comp._detail._genre = new W.Span({position:"relative", y:-2, height:"18px", textColor:"rgb(181,181,181)", "font-size":"16px", 
				className:"font_rixhead_light", text:"", "padding-right":"10px"});
        	_info.add(_comp._detail._genre);
        	
        	_comp._detail._casting = new W.Div({x:0, y:277-206, width:"1100px", height:"20px"});
        	_comp._detail.add(_comp._detail._casting);
        	
        	_comp._detail._synopsis = new W.Span({x:0, y:307-206, width:"1100px", height:"21px", textColor:"rgba(181,181,181,0.75)", "font-size":"19px", 
				className:"font_rixhead_light cut"});
        	_comp._detail.add(_comp._detail._synopsis);
        	
        	if(data.purchase){
        		state = STATE_LIST;
        		setDetail();
        		_comp.posters[index].setFocus();
        		_comp._package_info.setStyle({x:66, y:622});
        		_comp._package_desc.setStyle({display:"none"});
        		_comp._detail.setStyle({display:"block"});
        	}
    	};

    	this.setData = function(packageData){
    		_this = this;
    		_this.param = _parent.param;
            _this.detailModule = DetailModule.getNewComp(_this);
        	expireAssetCount = 0;
        	_comp._area = new W.Div({x:67, y:102, width:"1137px", height:"319px"});
        	_comp.add(_comp._area);
        	state = STATE_PURCHASE;
        	data = packageData;
        	index = 0;
        	
        	var assetIds = "";
        	var seriesIds = "";
        	var reqData = {};
        	if(data.configuration.assets){
        		_this.contentsType = "asset";
        		for(var i=0; i < data.configuration.assets.length; i++){
            		assetIds += (i > 0 ? "," : "") + data.configuration.assets[i].assetId;
            	}
        		reqData = {assetId:assetIds};
        		_parent.SdpDataManager.getDetailAsset(cbDetail, reqData);
        	}else{
        		if(data.configuration.series){
            		_this.contentsType = "series";
            		for(var i=0; i < data.configuration.series.length; i++){
            			seriesIds += (i > 0 ? "," : "") + data.configuration.series[i].seriesId;
                	}
            		reqData = {seriesId:seriesIds};
            		_parent.SdpDataManager.getSeriesDetail(cbDetail, reqData);
        		}
        	}
    	};
    	
    	function cbDetail(result, data){
    		if(result){
				var now = new Date();
				for(var i=0; i < data.data.length; i++){
					var licenseEnd = new Date(data.data[i].licenseEnd);
					if(licenseEnd <= now){
						expireAssetCount++;
					}
				}
				list = data.data;
				_parentDiv.add(_comp);
	    		makePackage();
				
	    		if(expireAssetCount == list.length){
	    			W.PopupManager.openPopup({
                        childComp:_this,
                        title:W.Texts["popup_zzim_info_title"],
                        popupName:"popup/AlertPopup",
                        boldText:W.Texts["no_purchas_product_guide1"],
                        thinText:W.Texts["no_purchas_product_guide2"] + "\n" + W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER,
                        type:"no_purchase"}
                    );
	    		}else{
					if(!list || list.length == 0){
						W.PopupManager.openPopup({
                            childComp:_this,
                            title:W.Texts["popup_zzim_info_title"],
                            popupName:"popup/AlertPopup",
                            boldText:W.Texts["no_purchas_product_guide1"],
                            thinText:W.Texts["no_purchas_product_guide2"] + "\n" + W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER,
                            type:"no_purchase"}
                        );
					}
	    		}
			}
    	}
    	
    	function setDetail(){
    		_comp._detail._title.setText(list[index].title);
    		
    		var starRating = list[index].starRating;
    		if(starRating && starRating.point > 0){
        		var point = starRating.point / 2;
        		for(var i=0; i < 5; i++){
        			_comp._detail._star_b[i].setStyle({display:""});
        			if(i+1 < point){
        				_comp._detail._star[i].setStyle({width:"10px"});
        			}else if(point > i+1){
        				_comp._detail._star[i].setStyle({width:"0px"});
        			}else{
        				_comp._detail._star[i].setStyle({width:(10*(point-i)) + "px"});
        			}
        		}
        		_comp._detail._star_point.setStyle({display:""});
        		_comp._detail._star_point.setText(starRating.point);
    		}else{
    			for(var i=0; i < 5; i++){
    				_comp._detail._star_b[i].setStyle({display:"none"});
        		}
        		_comp._detail._star_point.setStyle({display:"none"});
    		}
    		
    		if(list[index].isLiked){
    			_comp._detail._like_point.setText(W.Util.formatComma(list[index].likes > 9999 ? 9999 : list[index].likes,3));
    			_comp._detail._like_bar.setStyle({display:"inline-block"});
    			_comp._detail._like.setStyle({display:"inline-block"});
    			_comp._detail._like_point.setStyle({display:"inline-block"});
    		}else{
    			_comp._detail._like_bar.setStyle({display:"none"});
    			_comp._detail._like.setStyle({display:"none"});
    			_comp._detail._like_point.setStyle({display:"none"});
    			_comp._detail._like_point.setText(0);
    		}
    		
    		var releaseYear = list[index].releaseYear;
    		var runningTime = list[index].runningTime;
    		
    		if(releaseYear){
    			_comp._detail._open_date_bar.setStyle({display:"inline-block"})
    			_comp._detail._open_date.setText(releaseYear + " " + W.Texts["release_vod"]);
    		}else{
    			_comp._detail._open_date_bar.setStyle({display:"none"})
    			_comp._detail._open_date.setText("");
    		}
    		
    		if(runningTime){
    			if(runningTime.indexOf(":") > -1){
    				runningTime = util.getRunningTime(runningTime, true);
	    		}
    			_comp._detail._run_time_bar.setStyle({display:"inline-block"})
    			_comp._detail._run_time.setText(runningTime + W.Texts["minute"]);
    		}else{
    			_comp._detail._run_time_bar.setStyle({display:"none"})
    			_comp._detail._run_time.setText("");
    		}

    		_comp._detail._genre.setText(list[index].genre);
    		
    		if(_comp._detail._casting._area){
    			_comp._detail._casting.remove(_comp._detail._casting._area);
    		}
    		_comp._detail._casting._area = new W.Div({x:0, y:0, width:"1100px", height:"19px", textAlign:"left"});
    		_comp._detail._casting.add(_comp._detail._casting._area);
    		
    		if(list[index].director){
    			_comp._detail._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgb(173,173,173)", "font-size":"18px",
    				className:"font_rixhead_light", text:W.Texts["director"], "padding-right":"10px"}));
    			_comp._detail._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgba(255,255,255,0.8)", "font-size":"18px",
    				className:"font_rixhead_light", text:list[index].director, "padding-right":"35px"}));
    		}
    		
    		if(list[index].actor){
    			_comp._detail._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgb(173,173,173)", "font-size":"18px",
    				className:"font_rixhead_light", text:W.Texts["actors"], "padding-right":"10px"}));
    			
    			var actors = list[index].actor2;
    			if(!actors){
    				var texts = util.geTxtArray(list[index].actor, "RixHeadL", 18, 900, 1);
    				actors = texts[0];
    				if(texts.length > 1){
    					actors = actors.substr(0, actors.lastIndexOf(","))
    					actors += " ...";
    				}
    			}
    			
    			_comp._detail._casting._area.add(new W.Span({position:"relative", y:-2, height:"20px", textColor:"rgba(255,255,255,0.8)", "font-size":"18px",
    				className:"font_rixhead_light", text:actors}));
    		}
    		
    		_comp._detail._synopsis.setText(list[index].synopsis);
			
    	};

    	var focus = function(){
    		_comp.posters[oldIndex].unFocus();
    		_comp.posters[index].setFocus();
    		var page = Math.floor(index/7);
    		_comp._list.setStyle({x:67 - 1078*page});
    		

        	clearTimeout(keyTimeout);
        	keyTimeout = setTimeout(setDetail, W.Config.KEY_TIMEOUT_TIME);
    	};
    	
    	var unFocus = function(){
    		
    	};
    	
    	this.focus = function(){
    		focus();
    	};
    	
    	this.unFocus = function(){
    		_comp.posters[index].unFocus();
    		index = 0;
    		_comp._list.setStyle({x:67});
    	};
    	
    	function openCheckout(){
    		W.PopupManager.openPopup({
                popupName:"popup/ErrorPopup",
                code : "0501"
            });
		};
		
    	function openPurchasBlockAlert(){
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
		};
    	
    	this.operate = function(event){
    		W.log.info("state ============= " + state);
    		switch (event.keyCode) {
    		case W.KEY.BACK:
    			_parent.backScene();
    			break;
            case W.KEY.RIGHT:
            	if(state == STATE_LIST){
            		oldIndex = index;
                	index = (++index) % list.length;
                	focus();
            	}
                break;
            case W.KEY.LEFT:
            	if(state == STATE_LIST){
            		oldIndex = index;
            		index = (--index + list.length) % list.length;
                	focus();
            	}
                break;
            case W.KEY.UP:
            	if(state == STATE_PURCHASE){
            		_parent.couponInfo.showButton();
            		state = STATE_LIST;
            		setDetail();
            		_comp.posters[index].setFocus();
            		_comp.purchaseBtn.unFocus();
            		_comp._package_info.setStyle({x:200, y:622});
            		_comp._package_desc.setStyle({display:"none"});
            		_comp._detail.setStyle({display:"block"});
            	}
                break;
            case W.KEY.DOWN:
            	if(state == STATE_LIST && !data.purchase){
            		_parent.couponInfo.hideButton();
            		state = STATE_PURCHASE;
            		_comp.posters[index].unFocus();
            		_comp.purchaseBtn.focus();
            		_comp._package_info.setStyle({x:66, y:188});
            		_comp._package_desc.setStyle({display:"block"});
            		_comp._detail.setStyle({display:"none"});
            		index = 0;
            		var page = Math.floor(index/7);
            		_comp._list.setStyle({x:67 - 1078*page});
                }
                break;
            case W.KEY.ENTER:
            	if(state == STATE_PURCHASE){
            		if(W.StbConfig.cugType == "accommodation" && W.StbConfig.isCheckOut){
    					openCheckout();
    				}else if(W.StbConfig.blockPurchase){
    					openPurchasBlockAlert();
    				}else{
        				W.SceneManager.startScene({
        					sceneName:"scene/vod/PurchaseVodScene",
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE,
            				param:{type:"V", products:[data]}
            			});
    				}
                }else{
                	if(!isClearPin && ((W.StbConfig.adultMenuUse && list[index].isAdult) || (list[index].rating && util.getRating() && list[index].rating >= util.getRating()))) {
                        var popup = {
                            type:"",
                            popupName:"popup/AdultCheckPopup",
                            childComp:_this
                        };
                        W.PopupManager.openPopup(popup);
                    } else {
                    	if(_this.contentsType == "series"){
                        	W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
        	    				param:{data:{seriesId:list[index].seriesId}, type:"V"},
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}else{
                    		if(util.isWatchable(list[index])){
                	    		_this.detailModule.playVod(_this, list[index]);
                	    	}else{
                            	W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
            	    				param:{data:{assetId:list[index].assetId}, type:"V"},
            	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                	    	}
                    	}
                    }
                }
                break;
            case W.KEY.COLOR_KEY_Y:
            	if(state == STATE_LIST){
                	var popupData={options:[]};
                	popupData.options.push({
    					name: list[index].title,
    					param:"ZZIM",
    					subOptions: [//
    					   {type: "box", name: W.Texts["option_popup_add_zzim"]},
    					   {type: "box", name: W.Texts["popup_zzim_move_title"]}
    					]
    				});
        			var popup = {
        				popupName:"popup/sideOption/VodSideOptionPopup",
        				optionData:popupData,
        				childComp : _this
        			};
        			W.PopupManager.openPopup(popup);
            	}
                break;
    		}
    	};
    	
    	this.onPopupClosed = function(popup, desc) {
        	if (desc) {
        		if (desc.popupName.indexOf("VodSideOptionPopup") > 0) {
	        		if (desc.action == W.PopupManager.ACTION_OK) {
	            		if(desc.param.subOptions == 0){
	            			var popup = {
	            				popupName:"popup/my/ZzimAddPopup",
	            				param:{data:list[index], type:list[index].seriesId ? "series" : "asset"},
	            				childComp:_this
	            			};
	        	    		W.PopupManager.openPopup(popup);
	            		}else if(desc.param.subOptions == 1){
	            			var reqData = {menuType:"MC0001"};
	            			var sdpDataManager = W.getModule("manager/SdpDataManager");
	            			sdpDataManager.getChildMenuTree(function(result, menuData){
	                        	if(result && menuData.total > 0){
	                        		for(var i=0; i < menuData.data.length; i++){
	                        			if(menuData.data[i].categoryCode == "CC0103"){
	                        				W.SceneManager.startScene({
	                        					sceneName:"scene/home/CategoryListScene", 
	                        					param:{category:menuData.data[i]},
	                    	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
	                        				break;
	                        			}
	                        		}
	                        	}
	                        }, reqData);
	            		}
	        		}
        		}else if (desc.popupName == "popup/my/ZzimAddPopup"){
    				if (desc.action == W.PopupManager.ACTION_OK) {
                    	W.PopupManager.openPopup({
                            childComp:_this,
                            type:"2LINE",
                            popupName:"popup/FeedbackPopup",
                            title:desc.title,
                            desc:W.Texts["zzim_msg_add"].replace("@title@", desc.listTitle)}
                        );
                    }else{
                    	if(desc.error){
                    		if(desc.error.code == "C0501"){
                    			W.PopupManager.openPopup({
                    				childComp:_this,
                                    title:W.Texts["popup_zzim_info_title"],
                                    popupName:"popup/AlertPopup",
                                    boldText:W.Texts["popup_zzim_move_guide4"],
                                    thinText:W.Texts["popup_zzim_move_guide5"]}
            	                );
                    		}else{
                    			W.PopupManager.openPopup({
                                    childComp:_this,
                                    popupName:"popup/ErrorPopup",
                                    code:desc.error.code,
                					from : "SDP"}
                                );
                    		}
                    	}
                    }
    			}else if (desc.popupName == "popup/AlertPopup"){
    				if (desc.type == "no_purchase") {
                    	_parent.backScene();
                    }
    			}else if (desc.popupName == "popup/AdultCheckPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    	isClearPin = true;
                    	for(var i=0; i < list.length; i++){
                			_comp.posters[i].releaseRestrict();
                		}
                    	
                    	if(_this.contentsType == "series"){
                        	W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
        	    				param:{data:{seriesId:list[index].seriesId}, type:"V"},
        	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                    	}else{
                    		if(util.isWatchable(list[index])){
                	    		_this.detailModule.playVod(_this, list[index]);
                	    	}else{
                            	W.SceneManager.startScene({sceneName:"scene/vod/VodDetailScene", 
            	    				param:{data:{assetId:list[index].assetId}, type:"V"},
            	    				backState:W.SceneManager.BACK_STATE_KEEPHIDE});
                	    	}
                    	}
                    }
                }else if (desc.popupName == "popup/player/VodContinuePopup") {
    				if (desc.action == W.PopupManager.ACTION_OK) {
    					if(desc.idx < 2){
            				if(desc.idx == 1){
            					desc.desc.prepareInfo.resume.offset = 0;
            				}
            				var param = {data:desc.desc};
            				if(_this.seriesAssetEpisodes && _this.seriesAssetEpisodes.length > 0){
            					param.series = _this.seriesAssetEpisodes;
            					param.seriesIndex = _this.DetailComp.getEpisodeIndex();
            				}
            				W.startVod(W.SceneManager.BACK_STATE_HIDE, param);
    					}
        			}
    			}
			}
        };
    };
    
    return {
    	getComp : function(_parent, _parentDiv){
    		var packageComp = new Package(_parent, _parentDiv);
    		return packageComp;
    	}
    }
});