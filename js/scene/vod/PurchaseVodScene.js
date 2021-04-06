/**
 * scene/PurchaseVodScene
 *
 */
W.defineModule(["mod/Util", "comp/purchase/SelectComp", "comp/purchase/PurchaseInfoComp", "comp/purchase/PurchaseComp", "manager/MobilePurchaseDataManager"],
    function(util, selectComp, purchaseInfoComp, purchaseComp, mobilePurchaseDataManager) {
        var _thisScene = "PurchaseVodScene";
        var depth = 0;
        var isSelectArea = true;
        var _this;
        var paymentOptions = [];

        W.log.info("### Initializing " + _thisScene + " scene ###");

        function getPaymentType(){
    		W.Loading.start();
        	W.getCoupon(function(){
        		_this.uiPlfDataManager.getPaymentList(function(result, data){
        			W.Loading.stop();
            		if(result && data.list && data.list.length > 0){
            			paymentOptions = [];
            			var dataList = data.list;
            			for(var i=0; i < dataList.length; i++){
            				if(dataList[i].type == "bill"){
            					paymentOptions.push(dataList.splice(i, 1)[0]);
            					break;
            				}
            			}
            			for(var i=0; i < dataList.length; i++){
            				paymentOptions.push(dataList[i]);
            			}

            			W.log.info(paymentOptions);
            			init();
                        _this.add(_this._parentDiv);
            		}else{
            			W.PopupManager.openPopup({
                            childComp:_this,
                            title:W.Texts["popup_zzim_info_title"],
                            type:"error",
                            popupName:"popup/AlertPopup",
                            boldText:W.Texts["no_data_payments"],
                            thinText:W.Texts["no_data_guide"] + " " + W.Texts["no_data_guide2"] + " " + W.Config.CALL_CENTER_NUMBER});
            		}
            	});
        	});
        	
        };
        
        function init(){
        	_this.infoComp = new purchaseInfoComp(_this);
			_this._parentDiv._right.add(_this.infoComp.getComp());
			_this.purchaseValue.type = _this.param.type;
			_this.purchaseValue.product = _this.param.products[0];
			_this.purchaseValue.paymentOption;

			_this.infoComp.changeTitle(_this.param.products[0].title);
			_this.infoComp.changeDuration(_this.param.type, _this.param.products[0]);

			if(_this.param.type == "M" || _this.param.type == "T"){
				for(var i=0; i < paymentOptions.length; i++){
					if(paymentOptions[i].type == "bill"){
						_this.purchaseValue.paymentOption = paymentOptions[i];
						_this.purchaseValue.paymentBill = paymentOptions[i];
					}
				}
				if(_this.param.data){
					_this.purchaseValue.asset = _this.param.data[0];
				}
			}else{
				if(_this.param.data){
					_this.purchaseValue.asset = _this.param.data[0];
					_this.infoComp.changeTitle(_this.param.data[0].title);
					var text = _this.purchaseValue.asset.resolution ? _this.purchaseValue.asset.resolution : "";
					if(_this.purchaseValue.asset.isLifetime){
						text += " " + W.Texts["popup_zzim_option_lifetime"]
					}
					if(_this.purchaseValue.asset.assetGroup != "010"){
						text += " " + util.getAssetGroupCode(_this.purchaseValue.asset);
					}
					
					_this.infoComp.changePurchaseOption(text);
				}else{
					
				}
			}
			_this.infoComp.changePrice();
			
			setStepComp();
        };
        
        function setStepComp(){
        	_this.comps = [];
        	var no = 0;
        	if(_this.param.type == "M"){
        		var hasAgreements = false;
        		if(_this.param.products[0].agreements && _this.param.products[0].agreements.length > 0){
        			var text = util.getAgreementTitle(_this.param.products[0].agreements[0]);
        			var list = Object.assign([], _this.param.products[0].agreements);
        			
        			if(!_this.param.products[0].isAgreementOnly){
            			list.unshift({code:"NONE"});
        			}
        			if(list[no].code == "NONE"){
            			_this.infoComp.changePurchaseOption(W.Texts["none_agreement"]);
        			}else{
            			_this.infoComp.changePurchaseOption(text.substr(0, text.indexOf("(")));
        			}
        			_this.comps[no] = new selectComp(_this, "agreements", list, no);
        			_this._parentDiv._left.add(_this.comps[no].getComp());
        			no++;
        			hasAgreements = true;
        		}

        		if(util.getPrice(_this.param.products[0]) > 0 && W.entryPath.isUsableCouponAll(W.Coupon.coupons, _this.purchaseValue.asset, true)){
        			for(var i=0; i < paymentOptions.length; i++){
            			if(paymentOptions[i].type == "bill" || paymentOptions[i].type == "coupon"){
            				
            			}else{
            				paymentOptions.splice(i, 1);
            				i--;
            			}
            		}
            		_this.comps[no] = new selectComp(_this, "paymentOptions", paymentOptions, no);
                	_this._parentDiv._left.add(_this.comps[no].getComp());
        		}

        		if(!hasAgreements && _this.param.products[0].coupons){
        			var popup = {
        				popupName:"popup/purchase/SubscribedGuidePopup",
        				param:_this.param.products[0].coupons[0].discountPeriod,
        				childComp:_this
        			};
    	    		W.PopupManager.openPopup(popup);
        		}else{
        			if(_this.comps.length == 0){
            			_this.infoComp.disablePurchaseOption();
            			_this._step_area.setStyle({display:"none"});
            			isSelectArea = false;
            			_this.infoComp.focus();
            		}else{
            			_this.comps[0].focus();
            		}
        		}
        	}else{
            	if(_this.param.data && _this.param.data.length > 1){
            		_this.comps[no] = new selectComp(_this, "products", _this.param.products, no, _this.param.data);
            		_this._parentDiv._left.add(_this.comps[no].getComp());
            		no++;
            	}
            	_this.comps[no] = new selectComp(_this, "paymentOptions", paymentOptions, no);
            	_this._parentDiv._left.add(_this.comps[no].getComp());
            	_this.comps[0].focus();
        	}
        	
        	if(_this.comps.length > 1){
        		_this.infoComp.changeInfoGuide();
        	}
        };

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                W.log.info(param);
                depth = 0;
                isSelectArea = true;
                _this = this;
                _this.param = param;
                _this.sdpDataManager = W.getModule("manager/SdpDataManager");
                _this.uiPlfDataManager = W.getModule("manager/UiPlfDataManager");
                _this.comps = [];
                _this.purchaseValue = {};
                _this.purchaseModule = new purchaseComp(_this);
                
                
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_R, W.KEY.DELETE]);
                _this._bg = new W.Div({className : "bg_size bg_color"});
                _this.add(_this._bg);
                _this._parentDiv = new W.Div({className : "bg_size"});
                _this._parentDiv.add(new W.Div({x:770, y:0, width:"510px", height:"720px", backgroundColor:"rgba(0,0,0,0.6)"}));
                
                _this._step_area = new W.Div({className : "bg_size"});
                _this._parentDiv.add(_this._step_area);
                _this._step_area.add(new W.Div({x:124, y:631, width:"540px", height:"1px", className:"line_1px"}));
                _this._step_area.add(new W.Span({x:123, y:643, width:"600px", height:"20px", textColor:"rgb(218,188,116)", 
                	"font-size":"18px", className:"font_rixhead_light", text:W.Texts["scene_purchase_guide"]}));
                _this._step_area._arr = new W.Image({x:55, y:340, width:"41px", height:"41px", src:"img/arrow_navi_l.png", display:"none"});
                _this._step_area.add(_this._step_area._arr);
                _this._step_area.add(new W.Div({x:124, y:90, width:"522px", height:"1px", className:"line_1px"})); 		
        		
        		
                
                _this._parentDiv._left = new W.Div({x:0, y:0, width:"760px", height:"720px", overflow:"hidden"});
                _this._parentDiv.add(_this._parentDiv._left);
                
                _this._parentDiv._right = new W.Div({x:829, y:0, width:"370px", height:"720px"});
                _this._parentDiv.add(_this._parentDiv._right);

                getPaymentType();

				W.CloudManager.addNumericKey();
				
				_this.goInfoComp = function(){
					_this.comps[depth].unFocus(true);
    				isSelectArea = false;
    				_this.infoComp.focus();
				};
            },
            onPause: function() {

            },
            onResume: function() {
            	if(isSelectArea){
                	_this.comps[depth].changeCoin();
            	}
            	W.CloudManager.addNumericKey();
            },
            onRefresh: function() {
            	
            },
            onDestroy : function() {
				W.CloudManager.delNumericKey();
                W.log.info(_thisScene + " onDestroy !!!");
            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
                W.log.info(isSelectArea + " ,, " + depth);
                
                var isResume = false;
                if(isSelectArea){
                	isResume = _this.comps[depth].operate(event);
            	}else{
            		isResume = _this.infoComp.operate(event);
            	}
                W.log.info("isResume == " + isResume);
                if(!isResume){
                	switch (event.keyCode) {
                	case W.KEY.ENTER:
                	case W.KEY.RIGHT:
                    	if(isSelectArea){
                    		if(depth < _this.comps.length - 1){
                    			_this.comps[depth].unFocus();
                    			depth++;
                    			_this.comps[depth].focus();
                    			_this._step_area._arr.setStyle({display:"block"});
                    		}else{
                    			_this.comps[depth].unFocus(true);
                				isSelectArea = false;
        	    				_this.infoComp.focus();
                    		}
                    	}
                    	break;
                	case W.KEY.LEFT:
                    	if(isSelectArea){
                    		if(depth == 1){
                    			_this.comps[depth].unFocus(false, true);
                    			depth--;
                    			_this.comps[depth].focus();
                    			_this._step_area._arr.setStyle({display:"none"});
                    			_this.infoComp.changeInfoGuide();
                    		}
                    	}else{
                    		if(_this.comps.length > 0){
                    			_this.infoComp.unFocus();
                    			isSelectArea = true;
                    			_this.comps[depth].focus();
                    		}
                    	}
                    	break;
                	case W.KEY.EXIT:
                		if(_this.param.callback){
                    		_this.param.callback({result:"BACK"});
                    	}
                		W.SceneManager.destroyAll();
                		break;
                	case W.KEY.BACK:
                    	if(isSelectArea){
                    		if(depth == 1){
                    			_this.comps[depth].unFocus(false, true);
                    			depth--;
                    			_this.comps[depth].focus();
                    			_this._step_area._arr.setStyle({display:"none"});
                    			_this.infoComp.changeInfoGuide();
                    		}else{
                    			_this.backScene();
                    			if(_this.param.callback){
                            		_this.param.callback({result:"BACK"});
                            	}
                    		}
                    	}else{
                    		if(_this.comps.length > 0){
                    			_this.infoComp.unFocus();
                    			isSelectArea = true;
                    			_this.comps[depth].focus();
                    		}else{
                    			if(_this.param.callback){
                            		_this.backScene();
                            		_this.param.callback({result:"BACK"});
                            	}else{
                        			_this.backScene();
                            	}
                    		}
                    	}
                    	break;
                	}
                }
            },
            purchase: function(){
                _this.purchaseModule.purchase(function(result, resultData){
                	W.log.info(resultData);
                	if(!result){
                		if(_this.purchaseValue.mobilePurchaseResult){
                			var reqData = {LGD_TID : _this.purchaseValue.mobilePurchaseInfo.LGD_TID};
                			mobilePurchaseDataManager.requestCancel(function(result, data){
        						W.log.info(data);
            				}, reqData);
                		}
                	}

                	if(result){
//						if(
//							_this.purchaseValue.product.productType == "VDCTSS" ||
//							_this.purchaseValue.product.productType == "BDCHSS" ||
//							_this.purchaseValue.product.productType == "BDCHDT" ||
//							_this.purchaseValue.product.productType == "BDNNSS" ||
//							_this.purchaseValue.product.productType == "BDNNDT" ||
//							_this.purchaseValue.product.productType == "VDCTDT" ||
//							_this.purchaseValue.product.productType == "VDSRDT" ||
//							_this.purchaseValue.product.productType == "VDSRLF" ||
//							_this.purchaseValue.product.productType == "VDASDT" ||
//							_this.purchaseValue.product.productType == "VDASLF"
//						){
//							// 월정액, 패키지인 경우는 buy_commit 하지 않음
//							W.CloudManager.sendLog("purchase", "puchase subscribed");
//						}else{
//							W.purchaseValue2 = _this.purchaseValue;
//							W.purchaseValue2.transactionId = resultData.transactionId;
//							
//							W.CloudManager.sendLog("purchase", "puchase :: " + resultData.transactionId);
//						}
//						
						if(_this.purchaseValue.product.productType == "VDRVDT" || _this.purchaseValue.product.productType == "VDRVLF"){
							W.purchaseValue2 = _this.purchaseValue;
							W.purchaseValue2.transactionId = resultData.transactionId;
							
							W.CloudManager.sendLog("purchase", "puchase :: " + resultData.transactionId);
						}else{
							W.CloudManager.sendLog("purchase", "puchase is not RVOD");
						}
                	}
					
                	var popupTitle = undefined;
                	if(_this.param.type == "M" || _this.param.type == "T"){
                		popupTitle = _this.purchaseValue.product.title;
                	}
                	
                	if(_this.param.callback){
                		W.log.info("purchase ended callback !!");
                		_this.backScene();
                		_this.param.callback({result:result ? "SUCCESS" : "FAIL",
							asset: _this.param.type == "M" ? _this.purchaseValue.product : _this.purchaseValue.asset, resultData:resultData, popupTitle:popupTitle});
                	}else{
                		W.log.info("purchase ended no callback !!");
            			_this.backScene(undefined, undefined, {command:"purchaseResult", result:result, asset:_this.purchaseValue.asset, resultData:resultData, popupTitle:popupTitle});
                	}
        		}, _this.purchaseValue, _this.infoComp.getPrice());
            },
            onPopupClosed : function(popup, desc) {
            	if (desc) {
            		if (desc.popupName == "popup/purchase/SubscribedGuidePopup") {
            			if (desc.action == W.PopupManager.ACTION_OK) {
            				W.log.info(_this.comps);
            				if(_this.comps.length == 0){
                    			_this.infoComp.disablePurchaseOption();
                    			_this._step_area.setStyle({display:"none"});
                    			isSelectArea = false;
                    			_this.infoComp.focus();
                    		}else{
                    			_this.comps[0].focus();
                    		}
            			}else{
            				_this.backScene();
    	    				if(_this.param.callback){
    	    					_this.param.callback({result:"BACK"});
                        	}
            			}
            		}else if (desc.popupName == "popup/AlertPopup") {
            			if(desc.type == "error"){
                			_this.backScene();
                        	if(_this.param.callback){
                        		_this.param.callback({result:"BACK"});
                        	}
            			}
            		}
            	}
            }
        });
    });
