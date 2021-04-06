W.defineModule("comp/my/Subscribe", ["mod/Util", "comp/my/MyList", "comp/Scroll", "comp/setting/Button", "manager/ProductProcessManager", "manager/CouponDataManager"], 
		function(util, MyList, Scroll, Button, ProductProcessManager, couponDataManager) {
	function Subscribe(){
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");

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

	    var assetsData;

	    var hasList;

	    var MODE_TYPE = Object.freeze({LIST:0, SCROLL:1, BUTTON:2});
	    
	    var productProcessManager = ProductProcessManager.getManager(function(result){
	    	if(result.type == "subscribed_cancel"){
	    		getAssetsData({offset:0,limit:0});
	    	}
	    });

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
            if(mode == 0.8){
                W.Util.setStyle(_comp, {y:tops[1]+40, opacity : opacity[1]});
            }else{
                W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
            }
            if(!hasList && _comp._blankMsg) _comp._blankMsg.setStyle({height:blankHeight[mode]});
	    };

	    var create = function(_assetsData){
	    	if(_comp2){
	    		_comp.remove(_comp2);
	    	}
	    	_comp2 = new W.Div({x:0, y:0, width:"1280px", height:"720px"});
	    	_comp.add(_comp2);
	        if(!_assetsData || _assetsData.length < 1) {
	            hasList = false;
	            _comp._blankMsg = new W.Div({x:0, y:100, width:1280, height:blankHeight[(mode == 0.8 ? 1 : mode)], display:"-webkit-flex", "-webkit-flex-direction":"column",
	                "-webkit-align-items":"center","-webkit-justify-content":"center"});
	            _comp._blankMsg._span1 = new W.Div({position:"relative", height:38, text:W.Texts["no_subscribed_list"], lineHeight:"22px", className:"cut",
	                "white-space":"pre", textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-1.0px"});
	            _comp._blankMsg.add(_comp._blankMsg._span1);

	            _comp2.add(_comp._blankMsg);
	            return;
	        } else {
	            hasList = true;
	        }
	        
	        _this.mode = MODE_TYPE.LIST;

	        _this.listMode = "text";

	        _this.posterList = new MyList({type:_this.type, data:_assetsData, isLooping: _this.param.isLooping});
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

	       // _comp.add(new W.Div({text:"현재", x:1032, y:321, width:100, textColor:"#C7C7C7", fontFamily:"RixHeadL", "font-size":"18px", textAlign:"left", "letter-spacing":"0.18px"}));
	       // _comp._selectedNumber = new W.Div({text:"", x:900, y:349, width:100, textColor:"#E53000", fontFamily:"RixHeadB", "font-size":"22px", textAlign:"Right", "letter-spacing":"-1.1px"});
	       // _comp.add(_comp._selectedNumber);
	        //_comp.add(new W.Div({text:"개 선택(최대 150개)", x:1004, y:354, width:150, textColor:"#B5B5B5", fontFamily:"RixHeadL", "font-size":"14px", textAlign:"left", "letter-spacing":"-0.7px"}));


	        //_this.posterList.setActive();
            _this.changeMode(mode);
	    };

	    var unFocus = function() {
	    };

	    var setFocus = function() {
	    };

	    var getAssetsData = function(param) {
	    	if(_this.type == MyList.TYPE.SUBSCRIBE){
	    		sdpDataManager.getSubscriptionsList(cbGetAssetsData, param);
	    	}else if(_this.type == MyList.TYPE.PURCHASE_COIN){
	    		couponDataManager.queryCouponList(cbGetAssetsData, {UsableYN:"A", CouponGubun:"T"});
	    	}
	    };

	    var cbGetAssetsData = function(isSuccess, result) {
	        if(isSuccess) {
	        	if(_this.type == MyList.TYPE.SUBSCRIBE){
		            assetsData = result.data;
		    	}else if(_this.type == MyList.TYPE.PURCHASE_COIN){
		            assetsData = result.CouponList;
		    	}
	            W.log.info(assetsData);
	        }
	        create(assetsData);
	    };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
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
        this.create = function(callback, _parent, _param) {
            W.log.info(this.componentName + " create !!!!");
            backCallbackFunc = callback;
            _this = this;
            _this.param = _param ? _param : {};
            mode = _this.param.mode ? _this.param.mode : 0;

            if(_this.param.categoryCode && _this.param.categoryCode == "CC0110") {
                _this.type = MyList.TYPE.SUBSCRIBE;
            } else {
                _this.type = MyList.TYPE.PURCHASE_COIN;
            }
            
            _comp = new W.Div({id:"movie_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});
            getAssetsData({offset:0,limit:0});
            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();

            if(mode == 2){
                if(_this.posterList) _this.posterList.setActive();
                if(_this.scroll) _this.scroll.setActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:549});
                    //_comp._posterList._poster.setStyle({y:0});
                }
            } else {
                if(_this.posterList) _this.posterList.deActive();
                if(_this.scroll) _this.scroll.deActive();

                if(_this.listMode == "text") {
                    if(_comp._posterList) _comp._posterList.setStyle({height:299});
                    //_comp._posterList._poster.setStyle({y:-97});
                }
            }
            
            W.visibleHomeScene();
        };
        this.hasList = function(){
            return hasList;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                        if(_this.posterList.operate(event)) {
                            _this.posterList.getPageIdx();
                            return true;
                        } else {
                            _this.posterList.deActive();
                            _this.mode = MODE_TYPE.BUTTON;
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
                        if(!_this.posterList) return;
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
                    if(!_this.posterList) return;
                    if(_this.mode == MODE_TYPE.LIST) {
                        if(!_this.posterList) return;
                        var returnVal = _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return returnVal;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.decreaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        btnIdx = btnIdx-1 < 0 ? _this.btn[playMode].length-1 : btnIdx-1;
                        _this.btn[playMode][btnIdx].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(!_this.posterList) return;
                    if(_this.mode == MODE_TYPE.LIST) {
                        _this.posterList.operate(event);
                        if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
                        return true;
                    } else if(_this.mode == MODE_TYPE.SCROLL){
                        if (_this.scroll) _this.scroll.increaseIndex();
                        return true;
                    } else if(_this.mode == MODE_TYPE.BUTTON) {
                        _this.btn[playMode][btnIdx].unFocus();
                        btnIdx = btnIdx+1 > _this.btn[playMode].length-1 ? 0 : btnIdx+1;
                        _this.btn[playMode][btnIdx].setFocus();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                    if(!_this.posterList) return;
                    if(_this.type == MyList.TYPE.PURCHASE_COIN) {

                    } else {
                        var product = assetsData[_this.posterList.getIndex()];
                        if(product.productDetail){
                            product.productDetail.isCanCancel = product.productDetail.agreements ? false : true;
                            if(product.productDetail.purchase){
                                product.productDetail.isPurchased = true;
                            }
                            product.productDetail.fromMySubscribed = true;
                            productProcessManager.process(product.productDetail);
                        }else{
                            var reqData = {productId: product.productId, selector:"@detail"};
                            sdpDataManager.getProductDetail(function(result, data){
                                if(result){
                                    product.productDetail = data.data[0];
                                    product.productDetail.isCanCancel = product.productDetail.agreements ? false : true;
                                    if(product.productDetail.purchase){
                                        product.productDetail.isPurchased = true;
                                    }
                                    product.productDetail.fromMySubscribed = true;
                                    productProcessManager.process(product.productDetail);
                                }
                            }, reqData);
                        }
                    }
                    break;
                case W.KEY.BACK:
                    if(_this.posterList) _this.posterList.setPage(0, true);
                    if (_this.scroll) _this.scroll.setPage(_this.posterList.getPageIdx());
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
                case W.KEY.COLOR_KEY_Y:
                    /*if(!_this.posterList) return;
                    var popupData = {options:[
                        {name:undefined, subOptions : [
                            {type:"box", name:W.Texts["more_detail"]}
                        ]},
                        {name:W.Texts["option_watch"], subOptions : [
                            {type:"spinner", index:0, options:[W.Texts["can_watch"], W.Texts["purchase_mobile"], W.Texts["expired"]]}
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
                    W.PopupManager.openPopup(popup);*/
                    break;
            }

        };
        this.destroy = function() {
            W.log.info(this.componentName + " destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "Subscribe";
	}
    
	return {
		getNewComp : function(){
			return new Subscribe();
		}
	}
});