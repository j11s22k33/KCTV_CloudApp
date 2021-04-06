/**
 * scene/VodPackageScene
 *
 */
W.defineModule([ "mod/Util", "comp/CouponInfo", "comp/vod/Package"],
    function(util, couponInfoComp, packageComp) {
        var _thisScene = "VodPackageScene";
        var _this;
        var product;
        W.log.info("### Initializing " + _thisScene + " scene ###");
        
        function init(){
        	if(_this._parentDiv){
        		_this.remove(_this._parentDiv);
        	}
        	
        	_this.couponInfo = couponInfoComp.getNewComp();
            
        	_this._parentDiv = new W.Div({className : "bg_size"});
        	_this._parentDiv._bg = new W.Div({className : "bg_size", backgroundColor:"rgba(0,0,0,0.88)"});
        	_this._parentDiv.add(_this._parentDiv._bg);
            
        	_this._parentDiv._area = new W.Div({x:0, y:0, width:"1280px", height:"1100px"});
        	_this._parentDiv.add(_this._parentDiv._area);
            
        	_this._parentDiv._package = new W.Div({className : "bg_size"});
            _this._parentDiv._area.add(_this._parentDiv._package);
            
            _this._parentDiv._coupon_area = new W.Div({className : "bg_size"});
            _this._parentDiv.add(_this._parentDiv._coupon_area);

            _this.couponInfo.setData();
            _this.couponInfo.hideButton();
    		
            _this.Package = packageComp.getComp(_this, _this._parentDiv._package);
    		
    		var reqData = {productId: _this.param.product.productId};
    		_this.SdpDataManager.getProductDetail(function(result, data, _parent){
    			if(data.data[0].iframeUrl){
            		_this._parentDiv._bg.add(new W.Image({x:0, y:0, width:"1280px", height:"720px", src:W.Config.IMAGE_URL + "/" + data.data[0].iframeUrl}));
            	}

    			if(data.data[0].marketingMessageType == "01" || data.data[0].marketingMessageType == "02"){
    				_this._parentDiv._event = new W.Div({x:61, y:48, width:"600px", height:"44px"});
    				_this._parentDiv.add(_this._parentDiv._event);
    				_this._parentDiv._event.add(new W.Image({x:0, y:0, width:"52px", height:"44px", src:"img/icon_event_2.png"}));
    				_this._parentDiv._event.add(new W.Span({x:51, y:8, width:"540", height:"19px", textColor:"rgb(237,168,2)", "font-size":"17px",
            			className:"font_rixhead_light", text:_this.detail.marketingMessage}));
    			}
    			
    			_parent.Package.setData(data.data[0]);
    			_parent._parentDiv._coupon_area.add(_parent.couponInfo.getComp(592, 38));
    		}, reqData, _this);

    		_this.isPackage = true;

    		_this.add(_this._parentDiv);
        };

        return W.Scene.extend({
            onCreate : function(param) {
                W.log.info(_thisScene + " onCreate");
                _this = this;
                this.param = param;
                this.SdpDataManager = W.getModule("manager/SdpDataManager");
                
                this.setKeys([ W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
                    W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9, W.KEY.KEY_OPTION,
                    W.KEY.HOME, W.KEY.MENU, W.KEY.STAR, W.KEY.COLOR_KEY_B, W.KEY.COLOR_KEY_Y, W.KEY.COLOR_KEY_R]);

                init();
            },
            onPause: function() {

            },
            onResume: function(desc) {
            	W.log.info(_thisScene + " onResume !!!");
            	W.log.info(desc);
           	 	if(desc){
           	 		if(desc.command == "purchaseResult"){
           	 			if(desc.result){
               	 			var isExistDetailScene = false;
//               	 			var scenes = W.SceneManager.getSceneStack();
//               	 			for(var i=0; i < scenes.length; i++){
//               	 				if(scenes[i].id == "scene_vod/VodDetailScene"){
//    	           	 				isExistDetailScene = true;
//    	           	 				break;
//               	 				}
//               	 			}
               	 			
               	 			if(isExistDetailScene){
                   	 			_this.backScene(undefined, undefined, {command:desc.command, result:desc.result, asset:desc.asset, resultData:desc.resultData});
               	 			}else{
               	 				init();
    	                   		 
    	               			setTimeout(function(){
    	               				var popup = {
    	                     			popupName:"popup/purchase/PurchaseCompletePopup",
    	                     			contents:_this.param.product,
    	                     			childComp:_this
    	                     		};
    	                 	    	W.PopupManager.openPopup(popup);
    	               			}, 300);
               	 			}
	                	}else{
	                		W.PopupManager.openPopup({
	                			childComp:_this, 
	                            popupName:"popup/ErrorPopup",
	                            code:desc.resultData.error.code,
	        					from : "SDP"}
	                        );
	                	}
           	 		}
           	 	}     
            },
            onRefresh: function() {
            },
            onDestroy : function() {
                W.log.info(_thisScene + " onDestroy !!!");

            },
            onKeyPressed : function(event) {
                W.log.info(_thisScene + " onKeyPressed " + event.keyCode);
                this.Package.operate(event);
            }
        });
    });
