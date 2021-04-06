//@preDefine
W.defineModule("comp/EntryPath", function(){
	var PROTOCOL = "altiview";
	function EntryPath(){
		var list = [];
		
		function removeDisposableList(){
			var disposableFroms = ["VodFinish", "ProductList"];
			var data = list[list.length - 1];
			if(data){
				for(var i=0; i < disposableFroms.length; i++){
					if(data.from == disposableFroms[i]){
						list.pop();
					}
				}
			}
		};
		
		this.getAll = function(){
			return {list:list};
		};

		this.push = function(target, data, from){
			removeDisposableList();
			list.push({target:target, data:data, from:from});
		};
		
		this.pop = function(target){
			removeDisposableList();
			if(target){
				var data = list[list.length - 1];
				if(data.target.indexOf(target) > -1){
					list.pop();
				}
			}else{
				list.pop();
			}
		};
		
		this.getPath = function(){
			if(list && list.length > 0){
				var data = Object.assign(list[list.length - 1]);
				if(data){
					var categoryId;
					var path = PROTOCOL + "://";
					if(data.target.indexOf("menu") > -1 || data.target.indexOf("bookmark") > -1 || data.target.indexOf("category") > -1){
						if(data.from == "ForYouList"){
							path += "homeforyou/" + data.data.categoryCode;
						}else{
							if(data.target.indexOf("menu") > -1 && data.data.content && data.data.content.contentType == "rank"){
								path += "topN/" + data.data.categoryId;
							}else{
								path += data.target + "/" + data.data.categoryId;
							}
						}
						
						categoryId = data.data.categoryId;
					}else{
						path += data.target + "/" + data.data;
					}
					if(data.target.indexOf("recVodEnd") > -1){
						list.pop();
					}
					return {path:path, categoryId:categoryId};
				}
			}
			
			return {path:undefined, categoryId:undefined};
		};

		this.getCategoryPath = function(title){
			var path = "";
			if(list && list.length > 0){
				if(list[list.length - 1].target.indexOf("menu") > -1){
					for(var i=0; i < list.length; i++){
						if(list[i].target.indexOf("menu") > -1){
							path += (i == 0 ? "" : ">") + list[i].data.title;
						}
					}
				}
			}
			if(title){
				path += (path ? ">" : "") + title;
			}
			return path;
		};
		
		this.reset = function(){
			list = [];
		};
		
		this.getLastBaseId = function(){
			var baseId = undefined;
			var count = 0;
			if(list.length > 0){
				for(var i=list.length-1; i > -1; i--){
					if(count == 2){
						break;
					}
					if(list[i].target.indexOf("menu") > -1 || list[i].target.indexOf("category") > -1){
						baseId = list[i].data.baseId;
						count++;
					}else{
						break;
					}
				}
			}
			
			return baseId;
		};
		
		this.getCoupon = function(){
			var coupons;
			var now = new Date();

			if(list.length > 0 && list[list.length - 1].target.indexOf("menu") > -1){
				for(var i=list.length-1; i > -1; i--){
					if(list[i].target.indexOf("menu") == -1){
						break;
					}
					if(list[i].data.coupons && list[i].data.coupons.length > 0){
						for(var j=0; j < list[i].data.coupons.length; j++){
							if(now < new Date(list[i].data.coupons[j].expiresAt)){
								coupons = list[i].data.coupons;
							}
						}
						break;
					}
				}
			}
			return coupons;
		};
		
		this.isUsableCouponAll = function(coupons, asset, isMonthly){
			for(var i=0; i < coupons.length; i++){
				if(this.isUsableCoupon(coupons[i], asset, isMonthly)){
					return true;
				}
			}
			return false;
		};
		
		this.isUsableCoupon = function(coupon, asset, isMonthly){
			W.log.info(coupon);
			var value = true;
			if(coupon.ProductList){
				value = false;
				if(list.length > 0 && list[list.length - 1].target.indexOf("menu") > -1){
					for(var i=list.length-1; i > -1 ; i--){
						for(var j=0; j < coupon.ProductList.length; j++){
							if(list[i].data.baseId == coupon.ProductList[j].ProductCode){
								return true;
							}
						}
					}
				}
			}
			if(isMonthly){
				if(coupon.OfferGubun != "P"){
					return false;
				}
			}
			if(coupon.TargetGubun){
				value = false;
				if(coupon.TargetGubun == "ALL"){
					return true;
				}else if(coupon.TargetGubun == "SET"){
					if(coupon.TargetKind == "CTR"){
						if(list.length > 0 && (list[list.length - 1].target.indexOf("menu") > -1 || list[list.length - 1].target.indexOf("coupon") > -1)){
							for(var i=list.length-1; i > -1 ; i--){
								for(var j=0; j < coupon.TargetList.length; j++){
									if(list[i].data.baseId == coupon.TargetList[j].ItemID){
										return true;
									}
								}
							}
						}
					}else if(coupon.TargetKind == "CTN"){
						if(asset){
							for(var j=0; j < coupon.TargetList.length; j++){
								if(asset.assetId == coupon.TargetList[j].ItemID){
									return true;
								}
							}
						}
					}
				}
			}
			return value;
		};
	};

	return {
		getNewComp: function(){
			return new EntryPath();
		}
	};
});