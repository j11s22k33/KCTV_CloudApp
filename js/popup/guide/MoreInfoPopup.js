/**
 * popup/MoreInfoPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("MoreInfoPopup");
	var STATE_BTNS = 0;
	var STATE_CONTENTS = 1;
	var state = STATE_BTNS;
	var selectIndex = 0;
	var index = 0;
	var total = 0;
	var _this;
	var _comp;
	var page = 0;
	var cIdx = 0;
	var detail;
	
	function create(){
		var maxWidth = 812;
		_comp._title = new W.Div({x:410.5-203, y:390-324, width:"812px", height:"38px", textAlign:"center", float:"left"});
		_comp._title._span = new W.Span({display:"inline-block", position:"relative", textColor:"rgb(237,168,2)", "font-size":"30px",
			className:"font_rixhead_medium cut", text:detail.pr.title, textAlign:"left"});
		_comp._title.add(_comp._title._span);
		if(detail.pr.rating) {
			_comp._title.add(new W.Image({display:"inline-block", position:"relative", src:"img/info_"+detail.pr.rating.toLocaleLowerCase()+".png",
				width:23, height:23, y:-4, marginRight:"5px", marginLeft:"6px"}));
			maxWidth -= 34;
		}
		_comp._title._span.setStyle({"max-width":maxWidth+"px"});
		_comp.add(_comp._title);
		
		_comp.btns = [];
		if((detail.pr.seriesId || detail.pr.assetId) && W.StbConfig && W.StbConfig.cugType != "accommodation") {
			_comp.btns[0] = buttonComp.create(574-26.5, 579-324, W.Texts["watching"], 133, null, null, 18);
			_comp.btns[1] = buttonComp.create(715-26.5, 579-324, W.Texts["cancel"], 133, null, null, 18);
			_comp.btns[2] = buttonComp.create(433-26.5, 579-324, W.Texts["relation_vod"], 133, null, null, 18);
			_comp.add(_comp.btns[0].getComp());
			_comp.add(_comp.btns[1].getComp());
			_comp.add(_comp.btns[2].getComp());
		} else {
			_comp.btns[0] = buttonComp.create(502-26.5, 579-324, W.Texts["watching"], 133, null, null, 18);
			_comp.btns[1] = buttonComp.create(644-26.5, 579-324, W.Texts["cancel"], 133, null, null, 18);
			_comp.add(_comp.btns[0].getComp());
			_comp.add(_comp.btns[1].getComp());
		}

		if(detail.pr.summary) detail.pr.summary = detail.pr.summary.trim();

		var synopsis = detail.pr.summary ? detail.pr.summary : W.Texts["no_sysnopsis"];

		_comp._sysnop = new W.Div({x:265-26.5, y:510-324, width:"750px", height:"52px", overflow:"hidden",
			display:"-webkit-flex", "-webkit-flex-direction":"column", "-webkit-align-items":"center","-webkit-justify-content":"center"});
		_comp.add(_comp._sysnop);
		_comp._sysnop._text = new W.Div({x:0, y:0, position:"relative", textAlign:"center", width:"750px", "font-size":"20px", textColor:"rgba(181,181,181,0.75)", className:"cut",
			fontFamily:"RixHeadL", /*height:52, */lineHeight:"26px", "-webkit-line-clamp":2, "-webkit-box-orient":"vertical", display:"-webkit-box", "white-space":"normal"});
		_comp._sysnop.add(_comp._sysnop._text);
		_comp._sysnop._text.setText(synopsis);

		var startTime = util.newDate(detail.pr.start_time);
		var endTime = util.newDate(detail.pr.end_time);
		_comp._startTime = new W.Div({x:385-26.5, y:438-324, textAlign:"left", width:"100px", "font-size":"17px", textColor:"rgba(181,181,181,0.5)", fontFamily:"RixHeadM",
			height:14, lineHeight:"14px", text:util.changeDigit(startTime.getHours(),2) + ":" + util.changeDigit(startTime.getMinutes(),2)});
		_comp.add(_comp._startTime);
		_comp._endTime = new W.Div({x:854-26.5, y:438-324, textAlign:"left", width:"100px", "font-size":"17px", textColor:"rgba(181,181,181,0.5)", fontFamily:"RixHeadM",
			height:14, lineHeight:"14px", text:util.changeDigit(endTime.getHours(),2) + ":" + util.changeDigit(endTime.getMinutes(),2)});
		_comp.add(_comp._endTime);

		_comp._progressBarBg = (new W.Div({x:441-26.5, y:444-324, width:398, height:2, color:"rgba(101,104,109,0.56)"}));
		_comp.add(_comp._progressBarBg);

		_comp._progressBar = new W.Div({x:451-26.5,y:443-324,width:0, height:4, color:"rgb(158,142,133)"});
		_comp._progressBar.add(new W.Image({x:-10, y:0, width:10, height:4, src:"img/guide_p_bar_l.png"}));
		_comp._progressBar.add(new W.Image({right:"-10px", y:0, width:10, height:4, src:"img/guide_p_bar_r.png"}));
		_comp.add(_comp._progressBar);


		_comp._progressBar.setStyle({width:(378/((endTime-startTime)/60/1000))*((new Date().getTime()-startTime)/60/1000)});

		_comp._casting = new W.Div({x:138.5, y:469-324, width:"950px", height:"34px", textAlign:"center", overflow:"hidden"});
		_comp.add(_comp._casting);

		_comp._casting._list = new W.Div({x:0, y:0, position:"relative", display:"inline-block"});
		_comp._casting.add(_comp._casting._list);

		_this._offsetLeft = 0;
		_this.overflow = false;
		_comp._casting._focs = [];
		_comp._castingData = [];
		if(detail.pr.director && detail.pr.director.split(",").length > 0) {
			_comp._casting.director = detail.pr.director.split(",");

			_comp._casting._list._directorDesc = new W.Div({position:"relative", height:26, lineHeight:"27px", float:"left", textColor:"rgb(255,255,255)",
				"font-size":"17px", "letter-spacing":"-0.85px",
				className:"font_rixhead_light", text:W.Texts["director"], textAlign:"center", marginLeft:"5px", marginRight:"5px"});
			_comp._casting._list.add(_comp._casting._list._directorDesc);

			_this._offsetLeft = _comp._casting._list._directorDesc.comp.offsetLeft + _comp._casting._list._directorDesc.comp.offsetWidth;

			var comp;
			for(var i=0; i < _comp._casting.director.length; i++){
				comp = new W.Div({position:"relative", height:26, lineHeight:"26px", float:"left", textColor:"rgba(255,255,255,0.75)",
					"font-size":"17px", "letter-spacing":"-0.85px",
					className:"font_rixhead_light", text:_comp._casting.director[i], textAlign:"center", backgroundImage:"url('img/02_person_m.png')",
					marginLeft:"14px", marginRight:"14px"});
				comp.add(new W.Image({x:-10, width:10, height:26, src:"img/02_person_l.png"}));
				comp.add(new W.Image({right:"-10px", width:10, height:26, src:"img/02_person_r.png"}));
				_comp._casting._list.add(comp);

				if(_this._offsetLeft > comp.comp.offsetLeft) {
					_comp._casting._list.remove(comp);
					if(i == 0) _comp._casting._list.remove(_comp._casting._list._castingDesc);
					_this.overflow = true;
					break;
				} else {
					_this._offsetLeft = comp.comp.offsetLeft + comp.comp.offsetWidth;
				}

				_comp._casting._focs[i] = new W.Div({x:-9, y:0, width:"100%", height:"20px", paddingRight:"13px",
					border: "3px solid rgb(230, 48, 0)", display:"none"});
				comp.add(_comp._casting._focs[i]);
				_comp._castingData.push({keyword : _comp._casting.director[i], m_field:"director"});
			}
		}

		if(!_this.overflow && detail.pr.cast && detail.pr.cast.split(",").length > 0) {
			_comp._casting.cast = detail.pr.cast.split(",");

			_comp._casting._list._castingDesc = new W.Div({position:"relative", height:26, lineHeight:"26px", float:"left", textColor:"rgb(255,255,255)",
				"font-size":"17px", "letter-spacing":"-0.85px",
				className:"font_rixhead_light", text:W.Texts["actors"], textAlign:"center", marginLeft:"55px", marginRight:"5px"});
			_comp._casting._list.add(_comp._casting._list._castingDesc);

			_this._offsetLeft = _comp._casting._list._castingDesc.comp.offsetLeft + _comp._casting._list._castingDesc.comp.offsetWidth;

			var comp;
			for(var i=0; i < _comp._casting.cast.length; i++){
				_comp._castingData.push({keyword : _comp._casting.cast[i], m_field:"actor"});
				comp = new W.Div({position:"relative", height:26, lineHeight:"26px", float:"left", textColor:"rgba(255,255,255,0.75)",
					"font-size":"17px", "letter-spacing":"-0.85px",
					className:"font_rixhead_light", text:_comp._casting.cast[i], textAlign:"center", backgroundImage:"url('img/02_person_m.png')",
					marginLeft:"14px", marginRight:"14px"});
				comp.add(new W.Image({x:-10, width:10, height:26, src:"img/02_person_l.png"}));
				comp.add(new W.Image({right:"-10px", width:10, height:26, src:"img/02_person_r.png"}));
				_comp._casting._list.add(comp);

				if(_this._offsetLeft > comp.comp.offsetLeft) {
					_comp._casting._list.remove(comp);
					if(i == 0) _comp._casting._list.remove(_comp._casting._list._castingDesc);
					break;
				} else {
					_this._offsetLeft = comp.comp.offsetLeft + comp.comp.offsetWidth;
				}

				_comp._casting._focs[(_comp._casting.director ? _comp._casting.director.length : 0)+i] = new W.Div({x:-9, y:0, width:"100%", height:"20px", paddingRight:"13px",
					border: "3px solid rgb(230, 48, 0)", display:"none"});
				comp.add(_comp._casting._focs[(_comp._casting.director ? _comp._casting.director.length : 0)+i]);
			}
		}

		if(_comp._castingData.length < 1) {
			_comp._sysnop._text.setText(detail.pr.summary ? detail.pr.summary : W.Texts["no_sysnopsis_director"]);

			_comp._title.setStyle({y:390-324+13});
			_comp._progressBarBg.setStyle({y:444-324+13});
			_comp._progressBar.setStyle({y:443-324+13});
			_comp._startTime.setStyle({y:438-324+13});
			_comp._endTime.setStyle({y:438-324+13});
			_comp._sysnop.setStyle({y:510-324-35});
			if(_comp.btns[0]) _comp.btns[0].getComp().setStyle({y:579-324-40});
			if(_comp.btns[1]) _comp.btns[1].getComp().setStyle({y:579-324-40});
			if(_comp.btns[2]) _comp.btns[2].getComp().setStyle({y:579-324-40});
		}

		_comp._sysnop.height = _comp._sysnop._text.comp.offsetHeight;
		W.log.info("--------------------------- " + _comp._sysnop.height);
	};
	
	var focusBtn = function(){
		if(_comp.btns[0]) _comp.btns[0].unFocus();
		if(_comp.btns[1]) _comp.btns[1].unFocus();
		if(_comp.btns[2]) _comp.btns[2].unFocus();

		_comp.btns[index].focus();
	};

    return W.Popup.extend({
    	onStart: function(_param) {
			_this = this;
			W.log.info(_param)
    		W.log.info("MoreInfoPopup onStart");
    		detail = _param.data;
    		
    		if(_comp){
    			this.remove(_comp);
    		}
    		this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK]);
    		this.add(new W.Div({className:"bg_size"}));
    		_comp = new W.Div({x:53, y:324, width:"1227px", height:"396px"});
			_comp.add(new W.Div({x:0,y:286-324,  width:"1227px", height:"434px", backgroundColor:"#14151B"}));
    		this.add(_comp);
    		state = STATE_BTNS;
    		cIdx = 0;
    		index = 0;
    		total = 0;
    		page = 0;
    		create();
    		_comp.btns[0].focus();
    		
    	},
    	onStop: function() {
    		W.log.info("MoreInfoPopup onStop");
    		state = STATE_BTNS;
    		cIdx = 0;
    	},
    	onKeyPressed : function(event) {
    		W.log.info("MoreInfoPopup onKeyPressed "+event.keyCode);
    		
    		switch(event.keyCode) {
    		case W.KEY.BACK:
    		case W.KEY.EXIT:
    			W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
    			break;
    		case W.KEY.ENTER:
    			if(state == STATE_BTNS){
					if(index == 0) {
						W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, type:"tune", data:detail});
					} else if(index == 1) {
						W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
					} else if(index == 2) {
						W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, type:"vod", data:detail});
					}
    			}else if(state == STATE_CONTENTS){
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_OK, type:"search", data : _comp._castingData[cIdx]});
    			}
    			break;
    		case W.KEY.RIGHT:
    			if(state == STATE_BTNS){
    				index = index == _comp.btns.length-1 ? 0 : index+1;
    				focusBtn();
    			} else if(state == STATE_CONTENTS){
					_comp._casting._focs[cIdx].setStyle({display:"none"});
					cIdx = cIdx == _comp._casting._focs.length-1 ? 0 : cIdx+1;
					_comp._casting._focs[cIdx].setStyle({display:"block"});
    			}
    			break;
    		case W.KEY.LEFT:
    			if(state == STATE_BTNS){
    				index = index == 0 ? _comp.btns.length-1 : index-1;
    				focusBtn();
    			} else if(state == STATE_CONTENTS){
					_comp._casting._focs[cIdx].setStyle({display:"none"});
					cIdx = cIdx == 0 ? _comp._casting._focs.length-1 : cIdx-1;
					_comp._casting._focs[cIdx].setStyle({display:"block"});
    			}
    			break;
    		case W.KEY.UP:
    			if(state == STATE_BTNS){
					if(_comp._castingData.length > 0) {
						state = STATE_CONTENTS;
						_comp.btns[index].unFocus();
						cIdx = 0;
						_comp._casting._focs[cIdx].setStyle({display:"block"});
					}

    			}
    			break;
    		case W.KEY.DOWN:
    			if(state == STATE_BTNS){

    			} else if(state == STATE_CONTENTS){
					state = STATE_BTNS;
					index = 0;
					_comp.btns[index].focus();
					_comp._casting._focs[cIdx].setStyle({display:"none"});
    			}
    			break;
    		}
    	}
    });
});