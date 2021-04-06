W.defineModule("comp/my/Coin", ["mod/Util", "comp/my/MyList", "comp/Scroll", "comp/setting/Button", "manager/CouponDataManager"], function(util, MyList, Scroll, Button, couponDataManager) {
	function Coin(){
		var _this;
	    var dataManager = W.getModule("manager/SdpDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var playMode = 0;
	    var tops = [465, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var blankHeight = [120, 310, 550];

	    var index = 0;
	    var btnIdx = 0;
	    var _comp;
	    var _comp2;
	    var isComplete = false;
		var isError = false;

	    var assetsData;

	    var hasList;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1, BUTTON:2, BLANK:3});

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	        if(!hasList && _comp && _comp._blankMsg){
	        	_comp._blankMsg.setStyle({height:blankHeight[mode]});
	        	
	        	if(mode == 2){
	        		_comp._blankMsg._normal.setStyle({display:"none"});
	        		_comp._blankMsg._focus.setStyle({display:"block"});
		            _this.mode = MODE_TYPE.BLANK;
	        	}else{
	        		_comp._blankMsg._normal.setStyle({display:"block"});
	        		_comp._blankMsg._focus.setStyle({display:"none"});
		            _this.mode = MODE_TYPE.LIST;
	        	}
	        } 
	    };

	    var create = function(_assetsData){
	    	if(_comp2){
	    		_comp.remove(_comp2);
	    	}
	    	_comp2 = new W.Div({x:0, y:0, width:"1280px", height:"720px"});
            _comp.add(_comp2);

            if(!_assetsData || !_assetsData.CouponList || _assetsData.CouponList.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[mode], display:"-webkit-flex", "-webkit-flex-direction":"column",
	                "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_coin"], lineHeight:"22px", className:"cut",
	                "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);
	            
	            _comp._blankMsg._normal = new W.Div({position:"relative", width:244, height:56, "white-space":"pre", textAlign:"center"});
	            _comp._blankMsg.add(_comp._blankMsg._normal);
	            _comp._blankMsg._normal.add(new W.Image({x:0, y:0, width:244, height:56, src:"img/box_set244.png"}));
	            _comp._blankMsg._normal.add(new W.Span({x:0, y:17, width:244, height:26, textColor:"rgba(181,181,181,0.75)", "font-size":"20px", 
					className:"font_rixhead_light", text:W.Texts["scene_coin_charge_title"], textAlign:"center"}));
	            
	            _comp._blankMsg._focus = new W.Div({position:"relative", width:246, height:58, "white-space":"pre", textAlign:"center", display:"none"});
	            _comp._blankMsg.add(_comp._blankMsg._focus);
	            _comp._blankMsg._focus.add(new W.Image({x:0, y:0, width:246, height:58, src:"img/box_set244_f.png"}));
	            _comp._blankMsg._focus.add(new W.Span({x:0, y:17, width:246, height:26, textColor:"rgb(255,255,255)", "font-size":"20px", 
					className:"font_rixhead_light", text:W.Texts["scene_coin_charge_title"], textAlign:"center"}));

	            _comp2.add(_comp._blankMsg);
	            
	            if(mode == 2){
	        		_comp._blankMsg._normal.setStyle({display:"none"});
	        		_comp._blankMsg._focus.setStyle({display:"block"});
		            _this.mode = MODE_TYPE.BLANK;
	        	}
	            
	            isComplete = true;
	            return;
	        } else {
	            hasList = true;
	        }

	        _this.mode = MODE_TYPE.LIST;

	        _this.listMode = "text";

	        _this.posterList = new MyList({type:MyList.TYPE.COIN, data:_assetsData.CouponList, isLooping: _this.param.isLooping});
	        _comp._posterList = _this.posterList.getComp();
	        _comp._posterList.setStyle({x:129, y:108});
	        _comp2.add(_comp._posterList);

            if(_this.posterList.getTotalPage() > 1) {
                _this.scroll = new Scroll();
                _comp._scroll = _this.scroll.getComp(_this.posterList.getTotalPage(), 0, scrollCallback);
                _comp._scroll.setStyle({x: 49+5, y: 270, display: mode == 2 ? "block" : "none"});
                _comp2.add(_comp._scroll);
            } else {
                _this.scroll = undefined;
            }

	        _comp._firstRow = new W.Div({x:874, y:108, width:279, height:45});
	        _comp._firstRow.add(new W.Div({x:0,y:42,width:279,height:3,color:"rgba(131,122,119,0.25)"}));
	        var comp = new W.Div({position:"relative", float:"left", height:45, lineHeight:"45px", paddingLeft:"28px", paddingRight:"28px",
	            width:279-56, text:W.Texts["coin_info"], textAlign:"center",
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"});
	        _comp._firstRow.add(comp);
	        _comp2.add(_comp._firstRow);

	        _comp._detailArea = new W.Div({x:919, y:172, width:234, height:481, display:"none"});
	        _comp._detailArea.add(new W.Div({x:0,y:0,width:234,height:481, color:"rgba(0,0,0,0.2)"}));
	        _comp._detailArea.add(new W.Image({x:1014-919, y:298-172, width:41, height:41, src:"img/icon_my_i.png"}));
	        _comp._detailArea.add(new W.Div({x:1004-919, y:353-172, width:150, text:W.Texts["coin_price"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));

	        _comp._detailArea._price_area = new W.Div({x:0, y:373-172, width:234, height:22, textAlign:"center"});
	        _comp._detailArea.add(_comp._detailArea._price_area);
	        _comp._detailArea._price = new W.Span({position:"relative", display:"inline", "padding-right":"3px",
                text:"", textColor:"rgba(237,168,2,1)", fontFamily:"RixHeadB", "font-size":"20px", "letter-spacing":"-1.0px"});
	        _comp._detailArea._price_area.add(_comp._detailArea._price);
	        _comp._detailArea._price_area.add(new W.Div({position:"relative", display:"inline", text:W.Texts["price_unit"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));

	        _comp._detailArea._price_area2 = new W.Div({x:0, y:421-172, width:234, height:22, textAlign:"center"});
	        _comp._detailArea.add(_comp._detailArea._price_area);
	        _comp._detailArea._price_area2.add(new W.Div({position:"relative", display:"inline", "padding-right":"2px",text:W.Texts["payment_price"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));
	        _comp._detailArea._remainPrice = new W.Span({position:"relative", display:"inline",
                text:"", textAlign:"right",
	            textColor:"rgba(181,181,181,1)", fontFamily:"RixHeadM", "font-size":"18px", "letter-spacing":"-0.9px"});
	        _comp._detailArea._price_area2.add(_comp._detailArea._remainPrice);
	        _comp._detailArea._price_area2.add(new W.Div({position:"relative", display:"inline", "padding-left":"3px",text:W.Texts["price_unit"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));

	        _comp._detailArea.add(new W.Div({x:955-919, y:443-172, width:150, text:W.Texts["coin_payment_date"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));
	        _comp._detailArea._date = new W.Span({x:1038-919, y:443-172, width:150, text:"",
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadM", "font-size":"18px", "letter-spacing":"-0.9px"});
	        _comp._detailArea.add(_comp._detailArea._date);

	        _this.btn = [], _comp._btn = [];
	        _this.btn[0] = new Button();
	        _comp._btn[0] = _this.btn[0].getComp({x:975-919, y:484-172, text:W.Texts["tv_coin_charge"]});
	        _comp._detailArea.add(_comp._btn[0]);

	        _comp2.add(_comp._detailArea);


	        _comp._detailSummaryArea = new W.Div({x:911, y:172, width:234, height:281});
	        _comp._detailSummaryArea.add(new W.Div({x:0,y:0,width:234,height:281, color:"rgba(0,0,0,0.2)"}));
	        _comp._detailSummaryArea.add(new W.Image({x:1014-919, y:455-417, width:41, height:41, src:"img/icon_my_i.png"}));
	        _comp._detailSummaryArea.add(new W.Div({x:994-919, y:510-417, width:150, text:W.Texts["usable_coin_amount"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));

	        _comp._detailSummaryArea._price_area = new W.Div({x:0, y:532-417, width:234, height:22, textAlign:"center"});
	        _comp._detailSummaryArea.add(_comp._detailSummaryArea._price_area);
	        _comp._detailSummaryArea._price = new W.Span({position:"relative", display:"inline", "padding-right":"3px", text:W.Util.formatComma(_assetsData.TotalBalanceAmount), textAlign:"right",
	            textColor:"rgba(237,168,2,1)", fontFamily:"RixHeadB", "font-size":"20px", "letter-spacing":"-1.0px"});
	        _comp._detailSummaryArea._price_area.add(_comp._detailSummaryArea._price);
	        _comp._detailSummaryArea._price_area.add(new W.Div({position:"relative", display:"inline", text:W.Texts["price_unit"],
	            textColor:"rgba(131,122,119,1)", fontFamily:"RixHeadL", "font-size":"18px", "letter-spacing":"-0.9px"}));

	        _comp._detailSummaryArea._btn = new Button().getComp({x:975-919, y:575-417, text:W.Texts["tv_coin_charge"]});
	        _comp._detailSummaryArea.add( _comp._detailSummaryArea._btn);

	        _comp2.add(_comp._detailSummaryArea);

            setDetail();
	       // _comp.add(new W.Div({text:"현재", x:1032, y:321, width:100, textColor:"#C7C7C7", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"0.18px"}));
	       // _comp._selectedNumber = new W.Div({text:"", x:900, y:349, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"22px", textAlign:"Right", "letter-spacing":"-1.1px"});
	       // _comp.add(_comp._selectedNumber);
	        //_comp.add(new W.Div({text:"개 선택(최대 150개)", x:1004, y:354, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));


	        //_this.posterList.setActive();
            _this.changeMode(mode);
            isComplete = true;
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {

            couponDataManager.queryCouponList(cbGetAssetsData, {UsableYN:"A", CouponGubun:"T"});
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
	        	isError = false;
	            assetsData = result;
	            create(assetsData);
	        }else{
	        	isError = true;
	        	W.PopupManager.openPopup({
                    title:W.Texts["popup_zzim_info_title"],
                    popupName:"popup/AlertPopup",
                    boldText:W.Texts["SDP_ERR_1"]}
                );
	        }
	    };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };

        var setDetail = function() {
            var currentCoupon =  assetsData.CouponList[_this.posterList.getIndex()];
            var prefix = "";
            if(currentCoupon.OfferGubun=="M") prefix = W.Texts["unit_month"] + " ";
            _comp._detailArea._price.setText(prefix + W.Util.formatComma(currentCoupon.OfferAmount));
            _comp._detailArea._remainPrice.setText(prefix + W.Util.formatComma(currentCoupon.SaleAmount));
            _comp._detailArea._date.setText(util.setCouponDate(currentCoupon.EffectiveStartDate,"."));
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
        this.create = function(callback, _param) {
            W.log.info(this.componentName + " create !!!!");
            backCallbackFunc = callback;
            _this = this;

            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;

            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[mode], width:"1280px", height:"720px", opacity : opacity[mode]});
            isComplete = false;
            getAssetsData(_param);
            return _comp;
        };
        this.reload = function(){
        	isComplete = false;
        	getAssetsData(_this.param);
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.posterList) _this.posterList.setActive();
                if(_this.scroll){
                	_this.scroll.setActive();
                	_this.scroll.unFocus();
                }

                if(_comp._detailSummaryArea) _comp._detailSummaryArea.setStyle({display:"none"});
                if(_comp._detailArea) _comp._detailArea.setStyle({display:"block"});

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:549});
                    //_comp._posterList._poster.setStyle({y:0});
                }
                
                _this.posterList.deActive();
                _this.mode = MODE_TYPE.BUTTON;
                _this.btn[btnIdx].setFocus();
            } else {
            	if(_this.mode == MODE_TYPE.BUTTON) _this.btn[btnIdx].unFocus();
                _this.mode = MODE_TYPE.LIST;
                if(_this.posterList) _this.posterList.setPage(0, true);
                if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_comp._detailSummaryArea) _comp._detailSummaryArea.setStyle({display:"block"});
                if(_comp._detailArea) _comp._detailArea.setStyle({display:"none"});

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
            }
            
            W.visibleHomeScene();
        };
        this.hasList = function(){
            return !isError;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode + " " + isComplete);
            if(!isComplete) return true;
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(_this.posterList.operate(event)) {
                            _this.posterList.getPageIdx();
                            return true;
                        } else {
                            _this.posterList.deActive();
                            _this.mode = MODE_TYPE.BUTTON;
                            _this.btn[btnIdx].setFocus();
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
                        _this.btn[btnIdx].unFocus();
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        return true;
                    }
                    break;
                case W.KEY.UP:
                	if(!assetsData || assetsData.length < 1) {
                		return true;
                	}
                    if(_this.mode == MODE_TYPE.LIST) {
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        setDetail();
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex()
                        setDetail();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                    }
                    break;
                case W.KEY.DOWN:
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        setDetail();
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        setDetail();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(_this.mode == MODE_TYPE.BUTTON || _this.mode == MODE_TYPE.BLANK) {
                		W.SceneManager.startScene({
        					sceneName:"scene/my/ChargeCoinScene", 
            				backState:W.SceneManager.BACK_STATE_KEEPHIDE
            			});
                        return true;
                    } else if(_this.mode == MODE_TYPE.LIST) {
                        var currentCoupon =  assetsData.CouponList[_this.posterList.getIndex()];

                        var popup;
                        var msg = currentCoupon.isExpired ? W.Texts["expire_guide"] : W.Texts["usable_price_amount"] + ": " + W.Util.formatComma(currentCoupon.BalanceAmount) + W.Texts["price_unit"];
                        if(currentCoupon.OfferGubun=="M"){
                        	msg = W.Texts["until_termination"];
                        }
                        popup = {
                            childComp:_this,
                            popupName:"popup/my/CouponInfoPopup",
                            title:currentCoupon.CouponName,
                            boldText:msg,
                            thinText:currentCoupon.DisplayMessage,
                            button:[W.Texts["ok"]]
                        };

                        W.PopupManager.openPopup(popup);
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        _this.posterList.setActive();
                        _this.mode = MODE_TYPE.LIST;
                        if (_this.scroll) _this.scroll.unFocus();
                        return true;
                    }
                    break;
                case W.KEY.BACK:
                	if(assetsData && assetsData.length > 0) {
                		_this.posterList.setPage(0, true);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                	}
                    return false;
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
                /*case W.KEY.COLOR_KEY_Y:
                    var popupData = {options:[
                            {name:undefined, subOptions : [
                                {type:"box", name:W.Texts["more_detail"]}
                            ]},
                            {name:undefined, subOptions : [
                                {type:"box", name:W.Texts["delete"]}
                            ]}
                        ]};
                    var popup = {
                        popupName:"popup/sideOption/GuideSideOptionPopup",
                        optionData:popupData,
                        childComp : _this
                    };
                    W.PopupManager.openPopup(popup);
                    break;*/
            }

        };
        this.destroy = function() {
            W.log.info(this.componentName + " destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.onPopupClosed = function(popup, desc) {
            if (desc) {
                if (desc.popupName == "popup/my/InputCouponNoPopup") {
                    if (desc.action == W.PopupManager.ACTION_OK) {
                    }
                } else if (desc.popupName == "popup/my/CouponInfoPopup") {
                    if(desc.action == W.PopupManager.ACTION_OK) {
                        var currentCoupon =  assetsData.CouponList[_this.posterList.getIndex()];
                        if(currentCoupon.TargetList && currentCoupon.TargetList.length > 0) {
                            if(desc.idx == 0) {
                                var popup = {
                                    childComp:_this,
                                    popupName:"popup/my/CouponLinkSelectPopup",
                                    title:currentCoupon.CouponName,
                                    targetList:currentCoupon.TargetList,
                                    button:[W.Texts["close"]]
                                };
                                W.PopupManager.openPopup(popup);
                            }
                        }
                    }
                } else if (desc.popupName == "popup/my/CouponLinkSelectPopup") {
                    if(desc.action == W.PopupManager.ACTION_OK) {

                    }
                }
            }
        };
        this.componentName = "Coin";
	}
    
	return {
		getNewComp : function(){
			return new Coin();
		}
	}
});