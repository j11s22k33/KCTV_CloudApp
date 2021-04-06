W.defineModule("comp/home/ProductList", ["mod/Util", "manager/ProductProcessManager"], function(util, ProductProcessManager) {
	function ProductList(){
		var _this;
	    var sdpDataManager = W.getModule("manager/SdpDataManager");
	    var uiPlfDataManager = W.getModule("manager/UiPlfDataManager");

	    var backCallbackFunc;
	    var mode = 0;
	    var tops = [475, 255, 0];
	    var opacity = [1, 1, 1];
	    var fontSize = [18, 18, 24];
	    var yPos = [72, 72, 55];
	    var prodTops = [127, 127, 238];

	    var index = 0;
	    var isCategory = true;
	    var _comp;
	    var totalPage = 0;
	    var keyDelayTimeout;
	    var categories;
	    var oldIdx = 0;
	    var prodIdx = 0;
	    var baseId;
	    
	    function purchaseCallback(result){
	    	W.log.info(result);
	    	if(result.result == "SUCCESS"){
	    		categories[index].list = null;
	    		getProducts(index, true);
	    		
	    		setTimeout(function(){
   				 	var popup = {
   		                childComp:_this, 
         				popupName:"popup/purchase/PurchaseCompletePopup",
         				contents:result.asset ? result.asset : categories[index].list[prodIdx]
         			};
     	    		W.PopupManager.openPopup(popup);
   			 	}, 300);
	    	}else if(result.result == "BACK"){
	    		if(result.type == "subscribed_cancel"){
	    			categories[index].list = null;
		    		getProducts(index, true);
	    		}
	    	}else{
	    		W.PopupManager.openPopup({
                    childComp:_this,
                    popupName:"popup/ErrorPopup",
                    code:result.resultData.error.code,
					from : "SDP"}
                );
	    	}
	    	W.log.info("----------------------------");
	    	W.log.info("----------------------------");
	    	W.log.info("----------------------------");
	    	W.log.info(categories[index].list[prodIdx].product);
	    };
	    
	    var productProcessManager = ProductProcessManager.getManager(purchaseCallback);

	    var changeY = function(){
	        W.log.info("changeY mode == " + mode);
	        W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
	    };
	    
	    var createCategory = function(){
	    	_comp._category._bar = new W.Div({x:60, y:40, width:"1280px", height:"1px", className:"line_1px"});
	    	_comp._category.add(_comp._category._bar);
	    	
	    	var _area = new W.Div({x:0, y:0, width:"1280px", height:"50px", overflow:"hidden"});
	    	_comp._category.add(_area);
	    	_comp._title_list = new W.Div({x:0, y:0, width:"1280px", height:"50px"});
	    	_area.add(_comp._title_list);
	    	
	    	_comp._titles_dim = [];
	    	_comp._titles_foc = [];

	    	for(var i=0; i < categories.length; i++){
	    		_comp._titles_dim[i] = new W.Span({x:66 + 210*i, y:2, width:"180px", height:"22px", textColor:"rgba(205,205,205,0.84)", 
	    			textAlign:"center", "font-size":"20px", className:"font_rixhead_light", text:categories[i].tabName});
	    		_comp._title_list.add(_comp._titles_dim[i]);
	    		
	    		_comp._titles_foc[i] = new W.Div({x:66 + 210*i, y:0, width:"180px", height:"27px", textAlign:"center", opacity:0});
	    		_comp._title_list.add(_comp._titles_foc[i]);
	    		
	    		_comp._titles_foc[i]._text = new W.Span({position:"relative", y:0, height:"27px", textColor:"rgb(255,255,255)", 
	    			"font-size":"25px", className:"font_rixhead_medium", text:categories[i].tabName});
	    		_comp._titles_foc[i].add(_comp._titles_foc[i]._text);
	    		
	    		var barX = (180 - _comp._titles_foc[i]._text.comp.offsetWidth)/2 - 10;
	    		_comp._titles_foc[i]._bar = new W.Div({x:barX, y:38, width:(_comp._titles_foc[i]._text.comp.offsetWidth + 20) + "px", 
	    			height:"6px", backgroundColor:"rgb(229,48,0)", "border-radius":"3px", display:"inline-block"});
	    		_comp._titles_foc[i].add(_comp._titles_foc[i]._bar);
	    	}

	    	_comp._product = new W.Div({x:0, y:prodTops[mode], width:"1280px", height:"360px", overflow:"hidden"});
	    	_comp.add(_comp._product);
	    	
	    	_comp._curr_page = new W.Span({x:608, y:644, width:"25px", height:"17px", textColor:"rgb(255,255,255)", 
				textAlign:"right", "font-size":"16px", className:"font_rixhead_medium", text:"1"});
			_comp.add(_comp._curr_page);
			_comp._total_page = new W.Span({x:638, y:644, width:"30px", height:"17px", textColor:"rgb(122,122,122)", 
				textAlign:"left", "font-size":"16px", className:"font_rixhead_medium", text:"/ 5"});
			_comp.add(_comp._total_page);
			
			if(W.SceneManager.getCurrentScene().id.indexOf("ProductListScene") > 0){
				W.log.info(_comp);
				focus();
			}
	    };

	    var changeProduct = function(isFocus){
	    	W.log.info("changeProduct !!!!");
	    	W.log.info(categories[index]);
	    	_comp._curr_page.setText("1");
	    	totalPage = Math.ceil(categories[index].list.length/8);
	    	_comp._total_page.setText("/ " + totalPage);
	    	
	    	if(_comp._product_list){
	    		_comp._product.remove(_comp._product_list);
	    	}
	    	_comp._product_list = new W.Div({x:0, y:0, width:"1280px", height:"360px"});
	    	_comp._product.add(_comp._product_list);
	    	
	    	_comp._products = [];
	    	var x=59;
	    	var y=0;
	    	var page = 0;
	    	for(var i=0; i < categories[index].list.length; i++){
	    		page = Math.floor(i/8);
	    		if(i%4 == 0){
	    			x = page * 1188 + 59;
	    		}
	    		
	    		_comp._products[i] = new W.Div({x:x, y:Math.floor(i/4) % 2 == 0 ? 0 : 186, width:"279px", height:"168px"});
	    		_comp._product_list.add(_comp._products[i]);
	    		_comp._products[i].add(new W.Image({x:1, y:1, width:"277px", height:"166px", src:"img/box_pack_bg.png"}));
				if(categories[index].list[i].image){
					_comp._products[i].add(new W.Image({x:1, y:1, width:"277px", height:"166px", src:categories[index].list[i].image}));
				}else{
		    		_comp._products[i].add(new W.Span({x:0, y:75, width:"279px", height:"24px", textColor:"rgba(255,255,255,0.75)",
		    			textAlign:"center", "font-size":"22px", className:"font_rixhead_light", text:categories[index].list[i].title ? categories[index].list[i].title : ""}));
				}
				
				var dcText = undefined; 
    			if(categories[index].list[i].product.coupons){
    				W.log.info(categories[index].list[i].product.coupons);
					if(categories[index].list[i].product.coupons[0].amount.unit == "rate"){
						dcText = W.Texts["discount2"].replace("@price@", categories[index].list[i].product.coupons[0].amount.value);
					}else{
						dcText = W.Texts["discount"].replace("@price@", categories[index].list[i].product.coupons[0].amount.value);
					}
				}
    			W.log.info(dcText);
    			if(dcText){
    				_comp._products[i]._dc_icon = new W.Div({x:1, y:15, width:"277px", height:"31px", textAlign:"right"});
    				_comp._products[i].add(_comp._products[i]._dc_icon);
    				_comp._products[i]._dc_icon.add(new W.Span({position:"relative", y:0, height:"31px", textColor:"rgb(255,255,255)",
    	    			"font-size":"17px", className:"font_rixhead_light", text:dcText, backgroundColor:"rgb(224,134,4)",
    	    			"padding-left":"10px", "padding-right":"10px", "padding-top":"7px", "padding-bottom":"7px"}));
    			}
    			
	    		_comp._products[i]._foc = new W.Image({x:0, y:0, width:"279px", height:"168px", src:"img/box_pack_bg_f.png", display:"none"});
	    		_comp._products[i].add(_comp._products[i]._foc);
    			_comp._products[i]._icon = new W.Image({x:-13, y:5, width:"60px", height:"53px", src:"img/icon_sub.png", display:"none"});
    			_comp._products[i].add(_comp._products[i]._icon);

				
    			
    			
	    		if(categories[index].list[i].product.isPurchased){
	    			_comp._products[i]._icon.setStyle({display:"block"});
	    		}
	    		
	    		x += 297;
	    	}
	    	if(isFocus){
	    		focus();
	    	}
	    	W.visibleHomeScene();
	    };

	    var unFocus = function() {
	    	if(isCategory){
	    		if(_comp._titles_dim) _comp._titles_dim[index].setStyle({display:"block"});
	    		if(_comp._titles_foc) _comp._titles_foc[index].setStyle({opacity:0});
	    	}else{
	    		_comp._products[prodIdx]._foc.setStyle({display:"none"});
	    	}
	    };

	    function focus(isChange) {
	    	if(isCategory){
	    		_comp._titles_dim[index].setStyle({display:"none"});
	    		_comp._titles_foc[index].setStyle({opacity:1});
	    		_comp._title_list.setStyle({x:-Math.floor(index/5) * 1050});

	    		if(isChange){
	        		clearTimeout(keyDelayTimeout);
	        		keyDelayTimeout = setTimeout(function(){
	        			if(categories[index].list){
	            			changeProduct();
	            		}else{
	            			var idx = index;
	            			getProducts(idx);
	            		}
	        		}, 300);
	    		}
	    	}else{
	    		_comp._products[prodIdx]._foc.setStyle({display:"block"});
	    		_comp._product_list.setStyle({x:-Math.floor(prodIdx/8) * 1188});
	    		
	    		var currPage = Math.floor(prodIdx/8) + 1;
	        	_comp._curr_page.setText(currPage);
	    	}
	    };

	    function getProducts(idx, isFocus){
	    	if(categories && categories[idx].list){
	    		changeProduct(isFocus);
	    	}else{
	    		var reqData = {targetId:baseId, tabIndex:idx};
		    	uiPlfDataManager.getProductAreaList(function(result, data){
		    		if(result){
		    			if(!categories){
		    				categories = data.tabList;
		    				createCategory();
		    			}
		    			categories[idx].list = data.data;
		    			var productIds = "";
		    			for(var i=0; i < data.data.length; i++){
		    				productIds += (i > 0 ? "," : "") + data.data[i].link.linkTarget;
		    			}
		    			var reqData = {productId: productIds, selector:"@detail"};
		    			sdpDataManager.getProductDetail(function(result, data){
		    				var bundles = [];
		    				if(result){
		    					for(var j=0; j < categories[idx].list.length; j++){
		    						for(var i=0; i < data.data.length; i++){
		    							if(categories[idx].list[j].link.linkTarget == data.data[i].productId){
	    									categories[idx].list[j].product = data.data[i];
	    									if(data.data[i].purchase){
	    										categories[idx].list[j].product.isPurchased = true;
	    										categories[idx].list[j].product.isCanCancel = categories[idx].list[j].product.agreements ? false : true;
	    									}
	    									
	    									if(categories[idx].list[j].product.bundles && categories[idx].list[j].product.bundles.length > 0){
	        									var isExist = false;
	        									for(var k=0; k < bundles.length; k++){
	        										if(bundles[k] == categories[idx].list[j].product.bundles[0]){
	        											isExist = true;
	        											break;
	        										}
	        									}
	        									if(!isExist){
	        										bundles.push(categories[idx].list[j].product.bundles[0]);
	        									}
	    									}
	    								}
		    						}
		    					}

		    					for(var j=0; j < categories[idx].list.length; j++){
		    						if(!categories[idx].list[j].product){
			    						categories[idx].list.splice(j,1);
			    						j--;
		    						}
		    					}
		    				}
		    				
		    				if(bundles.length > 0){
		    					var reqData2 = {productId: bundles.toString(), selector:"@detail"};
		    					sdpDataManager.getProductDetail(function(result, data){
		    						if(result){
		    							for(var i=0; i < data.data.length; i++){
		    								for(var j=0; j < categories[idx].list.length; j++){
		    									if(categories[idx].list[j].product.bundles && 
		    										categories[idx].list[j].product.bundles.length > 0 &&
		    										categories[idx].list[j].product.bundles[0] == data.data[i].productId
		    									){
		    										categories[idx].list[j].product.bundleProduct = data.data[i];
		    									}
		    								}
			    						}
		    						}
		    						changeProduct(isFocus);
		    					}, reqData2);
		    				}else{
			    				changeProduct(isFocus);
		    				}
		    				W.log.info(categories);
		    			}, reqData);
		    		}
		    	}, reqData);
	    	}
	    };

	    var scrollCallback = function(idx) {
	        _this.posterList.setPage(idx);
	    };
	    
	    function isSubscribedProduct(product){
	    	if(
	    		product.productType == "CHTRSS" ||
	    		product.productType == "CHNMSS" ||
	    		product.productType == "VDCTSS" ||
	    		product.productType == "BDCHSS" ||
	    		product.productType == "BDNNSS"
	    	){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    		
	    };

        this.getComp = function(callback) {
            if(callback) backCallbackFunc = callback;
            return _comp;
        };
        this.show = function() {
            //_comp.setVisible(true);
            W.log.info("ProductList show");

            _comp.setDisplay("block");
        };
        this.hide = function() {
            _comp.setDisplay("none");
            W.log.info("ProductList hide");
        };
        this.create = function(_parentDiv, _parent, bId) {
            W.log.info("create !!!!");
            _this = this;
            index = 0;
            baseId = bId;
            _comp = new W.Div({id:"product_list_area", x:0, y:tops[0], width:"1280px", height:"720px", opacity : opacity[0]});
            _comp._category = new W.Div({x:0, y:125, width:"1280px", height:"50px", opacity:0});
	    	_comp.add(_comp._category);
	    	
	    	getProducts(0);
            return _comp;
        };
        this.changeMode = function(data){
            mode = data;
            changeY();
            
            if(_comp._product){
                _comp._product.setStyle({y:prodTops[mode]});
            }
            
            if(mode == 2){
            	isCategory = true;
            	_comp._category.setStyle({opacity:1});
            	if(W.SceneManager.getCurrentScene().id.indexOf("HomeScene") > 0){
    				focus();
    			}
            }else{
            	clearTimeout(keyDelayTimeout);
            	if(_comp._category){
                	_comp._category.setStyle({opacity:0});
            	}
            	unFocus();
            }
        };
        this.hasList = function(){
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode){
                case W.KEY.RIGHT:
                    if(isCategory){
                		unFocus();
                    	index = (++index) % categories.length;
                    	prodIdx = 0;
                    	focus(true);
                        return true;
                    }else{
                    	unFocus();
                    	if(prodIdx%4 == 3){
                    		var currPage = Math.floor(prodIdx/8);
                			if(currPage == totalPage - 1){
                				if(Math.floor(prodIdx/4) % 2 == 0){
                    				prodIdx = 0;
                            	}else{
                            		prodIdx = 4;
                            	}
                			}else{
                				if(Math.floor(prodIdx/4) % 2 == 0){
                    				prodIdx += 5;
                            	}else{
                            		if(prodIdx + 5 < categories[index].list.length){
                            			prodIdx += 5;
                            		}else{
                            			prodIdx++;
                            		}
                            	}
                			}
                    	}else{
                    		if(prodIdx + 1 < categories[index].list.length){
                    			prodIdx++;
                    		}else{
                    			if(Math.floor(prodIdx/4) % 2 == 0){
                    				prodIdx = 0;
                            	}else{
                            		prodIdx = 4;
                            	}
                    		}
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.LEFT:
                	if(isCategory){
                		unFocus();
                		index = (--index + categories.length) % categories.length;
                		prodIdx = 0;
                		focus(true);
                        return true;
                    }else{
                    	unFocus();
                    	if(prodIdx % 4 == 0){
                    		if(prodIdx == 0){
                    			var tmp = categories[index].list.length % 8;
                    			if(tmp == 0){
                    				prodIdx = (totalPage - 1) * 8 + 3;
                    			}else{
                        			if(tmp > 4){
                        				prodIdx = (totalPage - 1) * 8 + 3;
                        			}else{
                        				prodIdx = (totalPage - 1) * 8 + tmp-1;
                        			}
                    			}
                    		}else if(prodIdx == 4){
                    			prodIdx = categories[index].list.length-1;
                    		}else{
                    			prodIdx -= 5;
                    		}
                    	}else{
                    		prodIdx--;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.UP:
                    if(isCategory){
                        return true;
                    }else{
                    	unFocus();
                    	if(Math.floor(prodIdx/4) % 2 == 0){
                    		isCategory = true;
                    	}else{
                    		prodIdx -= 4;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.DOWN:
                    if(isCategory){
                    	unFocus();
                    	isCategory = false;
                    	focus();
                        return true;
                    }else{
                    	unFocus();
                    	if(Math.floor(prodIdx/4) % 2 == 0){
                    		if(prodIdx + 4 < categories[index].list.length){
                    			prodIdx += 4;
                    		}else{
                    			var tmp = categories[index].list.length % 8;
                        		if(tmp > 4){
                        			prodIdx = categories[index].list.length-1;
                        		}
                    		}
                    	}else{
                    		prodIdx -= 4;
                    	}
                    	focus();
                        return true;
                    }
                    break;
                case W.KEY.ENTER:
                	if(isCategory){
                    	unFocus();
                    	isCategory = false;
                    	focus();
                    }else{
                		if(W.StbConfig.cugType == "normal" || W.StbConfig.cugType == "community"){
                			W.entryPath.push("product.productId", categories[index].list[prodIdx].product.productId, "ProductList");
                        	W.log.info(categories[index].list[prodIdx].product);
                        	productProcessManager.process(categories[index].list[prodIdx].product);
                		}else{
                			var isSubscribed = isSubscribedProduct(categories[index].list[prodIdx].product);
                			if(isSubscribed){
                				W.PopupManager.openPopup({
		                            childComp:_this,
		                            title:W.Texts["popup_zzim_info_title"],
		                            popupName:"popup/AlertPopup",
		                            boldText:W.Texts["no_purchas_product_guide1"],
		                            thinText:W.Texts["no_purchas_product_guide2"] + "\n" + W.Texts["popup_pin_ask_callcenter"] +" "+ W.Config.CALL_CENTER_NUMBER}
		                        );
                			}else{
                    			W.entryPath.push("product.productId", categories[index].list[prodIdx].product.productId, "ProductList");
                            	W.log.info(categories[index].list[prodIdx].product);
                            	productProcessManager.process(categories[index].list[prodIdx].product);
                			}
                		}
                    }
                    return true;
                    break;
                case W.KEY.BACK:
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
                case W.KEY.KEY_OPTION:
                   break;
            }

        };
        this.destroy = function() {
            W.log.info("destroy !!!!");
        };
        this.getMode = function(){
            return mode;
        };
        this.componentName = "ProductList";
        this.onPopupClosed = function(popup, desc){
        	if (desc) {
        		if (desc.popupName == "popup/purchase/PurchaseCompletePopup") {
        			if(categories[index].list[prodIdx].product.configuration && categories[index].list[prodIdx].product.configuration.channels){
        				var sourceIds = [];
        				for(var i=0; i < categories[index].list[prodIdx].product.configuration.channels.length; i++){
        					sourceIds.push(parseInt(categories[index].list[prodIdx].product.configuration.channels[i].sourceId));
        				}
            			W.CloudManager.purchaseChannel(function(){
            				
            			}, sourceIds);
        			}
        		}
        	}
        }
	}
	
	return {
		getNewComp: function(){
			return new ProductList();
		}
	}
    
});