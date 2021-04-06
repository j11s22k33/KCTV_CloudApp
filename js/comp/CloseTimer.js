//@preDefine
W.defineModule("comp/CloseTimer", function(){

	var closeTimeout;
	var times = [1000*60*1, 1000*60*3, 1000*60*5, 1000*60*10];
	function CloseTimer(){
		this.startTime;
		this.isPurchasePopup = false;
		this.start = function(){
			
			clearTimeout(closeTimeout);
			this.startTime = new Date();
			
			var timeoutTime = times[W.StbConfig.menuDuration-1];
			if(this.isPurchasePopup){
				timeoutTime = 1000*60*10;
			}

			W.log.info("[CloseTimer] start :: " + this.startTime + " :: " + timeoutTime);
			
			closeTimeout = setTimeout(function(){
				var duration = (new Date().getTime()) - W.CloseTimer.startTime.getTime();
				W.log.info("[CloseTimer] time out :: " + duration);
				closeTimeout = undefined;
				if(W.SceneManager.getCurrentScene().id.indexOf("VodPlayScene") < 0 && 
					W.SceneManager.getCurrentScene().id.indexOf("ChannelVodScene") < 0){
					W.SceneManager.destroyAll();
				}
			}, timeoutTime);
		};
		
		this.skip = function(){
			clearTimeout(closeTimeout);
		};
		
		this.setPurchasePopup = function(data){
			this.isPurchasePopup = data;
			this.start();
		};
	};
	
	return {
		getNewComp : function(){
			return new CloseTimer();
		}
	}
});