W.defineModule([ "mod/Util"], function(util) {
	function ResultChannel(){
	 	var _this;
		var _parent;
		var _parentDiv;
		var type;
		var _comp;
		var index = 0;
		var page = 0;
		var totalPage = 0;
		var barHeight = 0;
		var sortingIndex = 0;
		
		var getTimeBar = function(data, now, midnight, isReserved, idx){
			var _div;
			var sTime = new Date(data.startTime);
			var eTime = new Date(data.endTime);
			
			var sTxt = W.Util.changeDigit(sTime.getHours(), 2) + ":" + W.Util.changeDigit(sTime.getMinutes(), 2);
			var eTxt = W.Util.changeDigit(eTime.getHours(), 2) + ":" + W.Util.changeDigit(eTime.getMinutes(), 2);
			if(sTime.getTime() < now.getTime()){
				_div = new W.Div({x:209, y:50, width:"270px", height:"16px"});
				_div.add(new W.Span({x:0, y:0, width:"50px", height:"18px", textColor:"rgba(181,181,181,0.5)", 
					"font-size":"16px", className:"font_rixhead_medium", text:sTxt}));
				_div.add(new W.Span({x:223, y:0, width:"50px", height:"18px", textColor:"rgba(181,181,181,0.5)", 
					"font-size":"16px", className:"font_rixhead_medium", text:eTxt}));
				_div.add(new W.Div({x:55, y:8, width:"155px", height:"2px", backgroundColor:"rgba(180,186,196,0.25)"}));
				
				_div.add(new W.Div({x:55, y:8, width:((now.getTime() - sTime.getTime())*155/(eTime.getTime() - sTime.getTime())) + "px", 
					height:"2px", backgroundColor:"rgb(255,255,255)"}));
				_comp._programs[idx].isCurrent = true;
			}else{
				_div = new W.Div({x:209, y:50, width:"270px", height:"21px", textAlign:"left"});
				if(sTime.getTime() < midnight.getTime() + 24*60*60*1000){
					_div.add(new W.Span({position:"relative", y:-4, height:"18px", textColor:"rgba(181,181,181,0.5)", display:"inline-block",
						"font-size":"16px", className:"font_rixhead_medium", text:sTxt + " ~ " + eTxt}));
				}else if(sTime.getTime() < midnight.getTime() + 24*60*60*1000*2){
					_div.add(new W.Span({position:"relative", y:-4, height:"18px", textColor:"rgba(181,181,181,0.5)", display:"inline-block",
						"font-size":"16px", className:"font_rixhead_medium", text:W.Texts["tomorrow"] + " " + sTxt + " ~ " + eTxt}));
				}else{
					_div.add(new W.Span({position:"relative", y:-4, height:"18px", textColor:"rgba(181,181,181,0.5)", display:"inline-block",
						"font-size":"16px", className:"font_rixhead_medium", text:util.getCurrentDateTime("kor", sTime) + " ~ " + eTxt}));
				}
				_comp._programs[idx]._rev_icon = new W.Image({position:"relative", y:1, width:"61px", height:"21px", src:"img/info_resv.png", "padding-left":"10px", opacity:0});
				_div.add(_comp._programs[idx]._rev_icon);
				
				if(isReserved){
					_comp._programs[idx]._rev_icon.setStyle({opacity:1});
					var rsPr = util.findReserveProgram(_comp._programs[idx].sourceId, _comp._programs[idx].start_time, _comp._programs[idx].title);
					if(rsPr) {
						rsPr.icon = _comp._programs[idx]._rev_icon;
					}
				}
				_comp._programs[idx].isCurrent = false;
			}
			return _div;
		};
		
		var create = function(){
			_comp = new W.Div({x:389, y:188, width:"550px", height:"550px", display:"none"});
			_parentDiv.add(_comp);

			var _list_area = new W.Div({x:0, y:0, width:"500px", height:"550px", overflow:"hidden"});
			_comp.add(_list_area);
			_comp._list_area = new W.Div({x:0, y:0, width:"500px"});
			_list_area.add(_comp._list_area);

			_comp._programs = [];
			
			drawList(0);

			_comp._focus = new W.Image({x:0, y:0, width:"500px", height:"86px", src:"img/box_result_h86.png", display:"none"});
			_comp._list_area.add(_comp._focus);
			
			_comp._bar_area = new W.Div({x:926-389, y:1, width:"3px", height:"471px"});
			_comp.add(_comp._bar_area);
			_comp._bar_area.add(new W.Div({x:1, y:0, width:"1px", height:"471px", backgroundColor:"rgba(131,122,119,0.25)"}));
			_comp._bar = new W.Div({x:0, y:0, width:"3px", height:barHeight + "px", backgroundColor:"rgb(131,122,119)"});
			_comp._bar_area.add(_comp._bar);
		};
		
		function hasIcon(type, data, data2, data3){
			if(type == "fav"){
				for(var i=0; i < _parent.param.chInfo.data.getUserChannel.favorite.sourceIds.length; i++){
					if(_parent.param.chInfo.data.getUserChannel.favorite.sourceIds[i] == Number(data)){
						return true;
					}
				}
			}else if(type == "rev"){
				for(var i=0; i < _parent.param.chInfo.data.getReserveList.length; i++){
					var revProgram = _parent.param.chInfo.data.getReserveList[i].split("|");
					if(data == revProgram[0] && (new Date(data2).getTime()) == Number(revProgram[3]) && data3 == revProgram[2])
						return true;
				}
			}
			return false;
		};
		
		var drawList = function(startNo){
			W.log.info("startNo -=== " + startNo);
			
			var now = new Date();
			var midnight = new Date();
			midnight.setHours(0);
			midnight.setMinutes(0);
			midnight.setSeconds(0);
			
			W.log.info(_parent.param.chInfo);
			W.log.info(_parent.results[type].data);
			
			for(var i=startNo; i < startNo + 24;i++){
				if(i >= _parent.results[type].total){
					break;
				}
				
				if(i < _parent.results[type].total){
					_comp._list_area.add(new W.Div({x:6, y:1 + 83 * i, width:"487px", height:"1px", backgroundColor:"rgba(255,255,255,0.07)"}));
				}
				_comp._programs[i] = new W.Div({x:0, y:83 * i, width:"500px", height:"83px"});
				_comp._list_area.add(_comp._programs[i]);
				_comp._programs[i]._num = new W.Span({x:28, y:23, width:"60px", height:"40px", textColor:"rgba(181,181,181,0.3)", 
					"font-size":"35px", className:"font_rixhead_medium", text:W.Util.changeDigit(_parent.results[type].data[i].channelNum, 3)});
				_comp._programs[i].add(_comp._programs[i]._num);
				_comp._programs[i]._ch = new W.Span({x:95, y:34, width:"80px", height:"20px", textColor:"rgba(181,181,181,0.75)", 
					"font-size":"18px", className:"font_rixhead_medium cut", text:_parent.results[type].data[i].channelTitle});
				_comp._programs[i].add(_comp._programs[i]._ch);
				if(hasIcon("fav", _parent.results[type].data[i].sourceId)){
					_comp._programs[i]._fav = new W.Image({x:178, y:35, width:"17px", height:"17px", src:"img/favor_star.png"});
					_comp._programs[i].add(_comp._programs[i]._fav);
				}
				_comp._programs[i]._prog = new W.Span({x:208, y:20, width:"255px", height:"26px", textColor:"rgba(255,255,255,0.75)", 
					"font-size":"24px", className:"font_rixhead_light cut", text:_parent.results[type].data[i].title});
				
				var isReserved = hasIcon("rev", _parent.results[type].data[i].sourceId, _parent.results[type].data[i].startTime, _parent.results[type].data[i].title);
				_comp._programs[i].isReserved = isReserved;
				_comp._programs[i].add(_comp._programs[i]._prog);
				_comp._programs[i]._time = getTimeBar(_parent.results[type].data[i], now, midnight, isReserved, i);
				_comp._programs[i].add(_comp._programs[i]._time);
			}
			W.log.info(_comp._programs);
		};
		
		function addChannelInfo(reqData, param, isFoc){
			_parent.sdpDataManager.getChannelDetail(function(result, data, param, isFoc){
				W.log.info(data.data);
				for(var i=0; i < _parent.results[type].data.length; i++){
					for(var j=0; j < data.data.length; j++){
						if(_parent.results[type].data[i].sourceId == data.data[j].sourceId){
							_parent.results[type].data[i].channelTitle = data.data[j].title;
							_parent.results[type].data[i].channelNum = data.data[j].channelNum;
							break;
						}
					}
				}
				drawList(param);
				if(isFoc){
					focus();
				}
				_parent.isKeyLock = false;
			}, reqData, param, isFoc);
		};

		var focus = function(){
			if(_comp._programs[index]){
				_comp._programs[index]._num.setStyle({textColor:"rgba(255,255,255,0.75)"});
				_comp._programs[index]._ch.setStyle({textColor:"rgb(255,255,255)"});
				
				_comp._focus.setStyle({y:index*83});
				_comp._list_area.setStyle({y:-498*page});
				_comp._bar.setStyle({y:barHeight*page});
				
				if(index + 12 < _parent.results[type].total && !_comp._programs[index + 12]){
					var startIdx = Math.floor((index + 12)/24);
					_parent.isKeyLock = true;
					_parent.getList(type, startIdx * 24, startIdx * 24 + 24, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
						var reqData = {selector:"sourceId,title,channelNum"};
						reqData.sourceId = "";
						
						for(var i=0; i < data[type].data.length; i++){
							_parent.results[type].data[param + i] = data[type].data[i];
							reqData.sourceId += (i==0 ? "" : ",") + data[type].data[i].sourceId;
						}
						addChannelInfo(reqData, param);
					}, startIdx * 24);
				}
			}else{
				var startIdx = Math.floor(index/24);
				_parent.isKeyLock = true;
				_parent.getList(type, startIdx * 24,  startIdx * 24 + 24, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
					var reqData = {selector:"sourceId,title,channelNum"};
					reqData.sourceId = "";
					
					for(var i=0; i < data[type].data.length; i++){
						_parent.results[type].data[param + i] = data[type].data[i];
						reqData.sourceId += (i==0 ? "" : ",") + data[type].data[i].sourceId;
					}
					addChannelInfo(reqData, param, true);
				}, startIdx*24);
			}
		};
		
		var unFocus = function(){
			_comp._programs[index]._num.setStyle({textColor:"rgba(181,181,181,0.3)"});
			_comp._programs[index]._ch.setStyle({textColor:"rgba(181,181,181,0.75)"});
		};
		
		this.getSortingIdx = function(){
			return sortingIndex;
		};
		
		this.resetList = function(idx, isMenu){
			sortingIndex = idx;
			for(var i=0; i < _parent.results[type].total; i++){
				if(_comp._programs[i]){
					_comp._list_area.remove(_comp._programs[i]);
				}
			}
			_comp._programs = [];
			index = 0;
			page = 0;
			
			_parent.isKeyLock = true;
			_parent.getList(type, 0, 24, _parent.getSortingParam(type, sortingIndex), function(result, data, param){
				var reqData = {selector:"sourceId,title,channelNum"};
				reqData.sourceId = "";
				
				for(var i=0; i < data[type].data.length; i++){
					_parent.results[type].data[param + i] = data[type].data[i];
					reqData.sourceId += (i==0 ? "" : ",") + data[type].data[i].sourceId;
				}
				addChannelInfo(reqData, param, !isMenu);
			}, 0);
		};
		
		this.init = function(parent, div, data){
			_parent = parent;
			_parentDiv = div;
			type = data;
			index = 0;
			page = 0;
			sortingIndex = 0;
			
			totalPage = Math.ceil(_parent.results[type].total/6);
			barHeight = 471/totalPage;
			W.log.info("totalPage ==== " + totalPage);
			W.log.info("barHeight ==== " + barHeight);
			create();
			
			_comp._bar_area.setStyle({display:totalPage > 1 ? "block" : "none"});
		};
		
		this.focus = function(){
			_comp._focus.setStyle({display:""});
			focus();
		};
		
		this.unFocus = function(){
			_comp._focus.setStyle({display:"none"});
			unFocus();
			_comp._focus.setStyle({y:0});
			_comp._list_area.setStyle({y:0});
			_comp._bar.setStyle({y:0});
			index = 0;
			page = 0;
		};

		this.toggleReserve = function (currentPr, callback) {
			if(!currentPr) currentPr = _parent.results[type].data[index];
			W.log.info(currentPr);
			if(_comp._programs[index].isReserved){
				W.Loading.start();
				W.CloudManager.removeReserveProgram(function(result) {
					W.Loading.stop();
					if(result && result.data == "OK" ) {
						var reservedPr = util.findReserveProgram(currentPr.sourceId, currentPr.start_time, currentPr.title);
						W.StbConfig.ReserveProgramList.splice(W.StbConfig.ReserveProgramList.indexOf(reservedPr),1);
						reservedPr = undefined;
						_comp._programs[index]._rev_icon.setStyle({opacity:0});
						_comp._programs[index].isReserved = false;
						W.PopupManager.openPopup({
							childComp:_this,
							popupName:"popup/FeedbackPopup",
							title:W.Texts["program_reserve_removed"]}
						);
						if(callback) callback();
					} else {
						W.PopupManager.openPopup({
							childComp:_this,
							type:"error",
							popupName:"popup/FeedbackPopup",
							title:W.Texts["error_general"]}
						);
					}
				}, currentPr.sourceId, currentPr.eventId, currentPr.title, util.newDate(currentPr.startTime).getTime(),
				util.newDate(currentPr.endTime).getTime(), util.prRatingtoStb(currentPr.rating));
			}else{
				W.Loading.justLock();
				W.CloudManager.addReserveProgram(function(result) {
					W.Loading.justLockStop();
					if(result && result.data) {
						var oldList = W.StbConfig.ReserveProgramList;
						W.StbConfig.ReserveProgramList = undefined;
						W.StbConfig.ReserveProgramList = util.parseReserveProgramList(result.data);

						for(var i = 0; i < oldList.length; i++) {
							if(oldList[i].icon) {
								var rsPr = util.findReserveProgram(oldList[i].sourceId, oldList[i].startTime, oldList[i].title);
								if(rsPr) {
									rsPr.icon = oldList[i].icon;
									oldList[i].icon.setStyle({opacity:1});
								} else {
									oldList[i].icon.setStyle({opacity:0});
								}
							}
						}
						var curPr = util.findReserveProgram(currentPr.sourceId, util.newDate(currentPr.startTime).getTime(), currentPr.title);
						if(curPr) {
							if(_comp._programs[index]._rev_icon) {
								_comp._programs[index]._rev_icon.setStyle({opacity:1});
								curPr.icon = _comp._programs[index]._rev_icon;
							}
							_comp._programs[index].isReserved = true;
							W.PopupManager.openPopup({
								childComp:_this,
								popupName:"popup/FeedbackPopup",
								title:W.Texts["program_reserve_added"]}
							);
						}
						if(callback) callback();
					} else {
						W.PopupManager.openPopup({
							childComp:_this,
							type:"error",
							popupName:"popup/FeedbackPopup",
							title:W.Texts["error_general"]}
						);
					}
				}, currentPr.sourceId, currentPr.eventId, currentPr.title, util.newDate(currentPr.startTime).getTime(),
				util.newDate(currentPr.endTime).getTime(), util.prRatingtoStb(currentPr.rating));
			}
		};
		
		this.operate = function(event){
			var isConsume = false;
			switch (event.keyCode) {
			case W.KEY.UP:
				unFocus();
				if(index == 0) index = _parent.results[type].total - 1;
				else index--;
				page = Math.floor(index/6);
				focus();
				isConsume = true;
				break;
			case W.KEY.DOWN:
				unFocus();
				if(index == _parent.results[type].total - 1) index = 0;
				else index++;
				page = Math.floor(index/6);
				focus();
				isConsume = true;
				break;
			case W.KEY.ENTER:
				if(_comp._programs[index].isCurrent){
					if(W.state.isVod){
						W.PopupManager.openPopup({
		                    title:W.Texts["popup_zzim_info_title"],
		                    popupName:"popup/AlertPopup",
		                    boldText:W.Texts["vod_alert_msg"],
		                    thinText:W.Texts["vod_alert_msg2"]}
		                );
					}else{
						W.CloudManager.changeChannel(function(){
							W.log.info("Channel Changed !! " + _parent.results[type].data[index].sourceId);
						}, parseInt(_parent.results[type].data[index].sourceId));
					}
				}else{
					this.toggleReserve(_parent.results[type].data[index]);
				}
				break;
			}
			return isConsume;
		};
		
		this.show = function(){
			_comp.setStyle({display:"block"});
		};
		
		this.hide = function(){
			_comp.setStyle({display:"none"});
		};
		
		this.getType = function(){
			return type;
		};
	}

	return {
		getNewComp : function(){
			return new ResultChannel();
		}
	};
});