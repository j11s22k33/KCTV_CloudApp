W.defineModule("comp/RightTimer", [ "mod/Util"], function(util) {
	var changeIntervalTime = 10 * 1000;
	var rightTimer = function(){
		var interval;
		var _time;
		var changeTime = function(){
			_time.setText(util.getCurrentDateTime2("kor"));
		};

		this.stop = function(){
			clearInterval(interval);
		};
		
		this.start = function(_div){
			_time = new W.Span({x:0, y:0, width:"200px", height:"22px", textColor:"rgba(255,255,255,0.5)", "font-size":"20px", 
				className:"font_rixhead_medium", text:util.getCurrentDateTime2("kor"), textAlign:"right"});
			_div.add(_time);
			
			clearInterval(interval);
			interval = setInterval(changeTime, changeIntervalTime);
		};
	};

	return {
		getComp: function(){
			var timer = new rightTimer();
			return timer;
		}
	};
});