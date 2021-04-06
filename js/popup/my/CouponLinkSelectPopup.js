/**
 * popup/CouponLinkSelectPopup
 */
W.defineModule(["mod/Util", "comp/PopupButton"], function(util, buttonComp) {
	'use strict';
	W.log.info("CouponLinkSelectPopup");
	var _comp;
	var timeout;
	var _this;
	var btnIndex = 0;
	var isExpended = false;

	var STATE_BTNS = 0;
	var STATE_CONTENTS = 1;
	var STATE_CLOSE = 2;
	var state = STATE_CONTENTS;

	var index = 0;
	var total = 0;
	var page = 0;
	var cIdx = 0;

	return W.Popup.extend({
		onStart: function(_param) {
			W.log.info("CouponLinkSelectPopup onStart");
			btnIndex = 0;
			state = STATE_CONTENTS;
			cIdx = 0;
			index = 0;
			total = 0;
			page = 0;
			isExpended = false;
			_this = this;
			_this.param = _param;

			if(_comp){
				this.remove(_comp);
			}
			this.setKeys([W.KEY.UP, W.KEY.LEFT, W.KEY.DOWN, W.KEY.RIGHT, W.KEY.ENTER, W.KEY.KEY_ESC, W.KEY.EXIT, W.KEY.BACK,
				W.KEY.NUM_0, W.KEY.NUM_1, W.KEY.NUM_2, W.KEY.NUM_3, W.KEY.NUM_4, W.KEY.NUM_5, W.KEY.NUM_6, W.KEY.NUM_7, W.KEY.NUM_8, W.KEY.NUM_9]);

			_param.targetList = [
				{ItemId:"123123", ItemName:"슈퍼맨"},
				{ItemId:"123123", ItemName:"배트맨"},
				{ItemId:"123123", ItemName:"슈퍼맨"},
				{ItemId:"123123", ItemName:"배트맨"}
			];

			if(_param.targetList.length > 3) {
				isExpended = true;
			}

			_comp = new W.Div({className:"bg_size popup_bg_flex"});
			this.add(_comp);

			_comp._popup = new W.Div({className:"popup_comp_color popup_comp_border popup_comp_flex"});
			_comp.add(_comp._popup);

			_comp._popup._title = new W.Div({position:"relative", "max-width":"800px", height:65, text:_param.title, lineHeight:"95px", className:"cut",
				"white-space":"pre", textColor:"#EDA802", fontFamily:"RixHeadM", "font-size":"34px", textAlign:"center", "letter-spacing":"-1.7px", marginBottom:"0px"});
			_comp._popup.add(_comp._popup._title);

			_comp._popup._thinText = new W.Div({position:"relative", "max-width":"800px", text:W.Texts["popup_coupon_select_guide"],
				lineHeight:"24px", className:"cut", fontFamily:"RixHeadL", "-webkit-line-clamp":6, "-webkit-box-orient":"vertical", display:"-webkit-box",
				"white-space":"pre", textColor:"rgba(181,181,181,0.75)", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px", marginBottom:"21px"});
			_comp._popup.add(_comp._popup._thinText);

			_comp._popup.add(new W.Div({position:"relative",width:_param.targetList.length==2?430:651,height:1,color:"rgba(255,255,255,0.07)"}));

			_comp._popup._itemArea = new W.Div({position:"relative", float:"left"});
			_comp._popup.add(_comp._popup._itemArea);

			if(isExpended) {
				_comp._popup._itemArea._arr_l = new W.Image({position:"relative", float:"left", width:"41px", height:"41px", src:"img/arrow_navi_l.png",
					marginRight:"14px",marginTop:"24px",paddingTop:"15px",paddingBottom:"14px",marginBottom:"10px"});
				_comp._popup._itemArea.add(_comp._popup._itemArea._arr_l);
			}

			_comp._popup._itemArea._list = new W.Div({position:"relative", float:"left", width:_param.targetList.length==2?430:651, height:"72px",
				overflow:"hidden", marginTop:"24px", marginBottom:"10px"});
			_comp._popup._itemArea.add(_comp._popup._itemArea._list);
			_comp._popup._itemArea._list._inner = new W.Div({x:0, y:0});
			_comp._popup._itemArea._list.add(_comp._popup._itemArea._list._inner);

			_comp._popup._itemArea._list._inner._focs = [];
			for(var i=0; i < _param.targetList.length; i++){
				_comp._popup._itemArea._list._inner.add(new W.Image({x:219 * (i%3) + 1, y:85 * Math.floor(i/3) + 1, width:"209px", height:"70px", src:"img/box_popup_w209.png"}));
				_comp._popup._itemArea._list._inner._focs[i] = new W.Image({x:219 * (i%3), y:85 * Math.floor(i/3), width:"211px", height:"72px", src:"img/box_popup_w209_f.png", display:"none"});
				_comp._popup._itemArea._list._inner.add(_comp._popup._itemArea._list._inner._focs[i]);
				_comp._popup._itemArea._list._inner.add(new W.Span({x:219 * (i%3), y:85 * Math.floor(i/3) + 26, width:"211px", height:"20px", textColor:"rgb(255,255,255)", "font-size":"18px",
					className:"font_rixhead_light", text:_param.targetList[i].ItemName, textAlign:"center"}));
			}

			if(isExpended) {
				_comp._popup._itemArea._arr_r = new W.Image({position:"relative", float:"left",width:"41px", height:"41px", src:"img/arrow_navi_r.png",
					marginLeft:"14px",marginTop:"24px",paddingTop:"15px",paddingBottom:"14px",marginBottom:"10px"});
				_comp._popup._itemArea.add(_comp._popup._itemArea._arr_r);

				_comp._popup.add(new W.Div({position:"relative",width:_param.targetList.length==2?430:651,height:1,color:"rgba(255,255,255,0.07)", marginTop:"14px", marginBottom:"5px"}));

				_comp._popup._page = new W.Div({position:"relative",width:651, height:"17px", textAlign:"right"});
				_comp._popup.add(_comp._popup._page);
				_comp._popup._cPage = new W.Span({position:"relative", y:0, height:"16px", textColor:"rgb(254,254,254)", "font-size":"16px",
					className:"font_rixhead_bold", text:util.changeDigit(Math.floor(cIdx/3+1),2)});
				_comp._popup._tPage = new W.Span({position:"relative", y:0, height:"16px", textColor:"#837a77", "font-size":"16px",
					className:"font_rixhead_bold", text:" / " + util.changeDigit(Math.floor(_param.targetList.length/3+1),2)});
				_comp._popup._page.add(_comp._popup._cPage);
				_comp._popup._page.add(_comp._popup._tPage);

			}

			if(_param.button && _param.button.length > 0) {
				_comp._popup._btns = new W.Div({position:"relative", "max-width":"800px", height:41, marginTop:"15px"});
				_this.btn = [];
				for(var i = 0; i < _param.button.length; i++) {
					_this.btn[i] = buttonComp.create(0, 0, _param.button[i], 133);

					_this.btn[i].getComp().setStyle({position:"relative", "float":"left", marginLeft:"4px", marginRight:"4px"});

					_comp._popup._btns.add(_this.btn[i].getComp());
				}
				_comp._popup.add(_comp._popup._btns);
				//_this.btn[btnIndex].focus();
			}
			_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:""});
		},
		onStop: function() {
			W.log.info("CouponLinkSelectPopup onStop");
		},
		onKeyPressed : function(event) {
			W.log.info("CouponLinkSelectPopup onKeyPressed "+event.keyCode);
			switch(event.keyCode) {
				case W.KEY.BACK:
				case W.KEY.EXIT:
					W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
					break;
				case W.KEY.ENTER:
					if(state == STATE_CONTENTS){
						W.PopupManager.closePopup(this, {
							action:W.PopupManager.ACTION_OK,
							item:_this.param.targetList[cIdx]
						});
					}else if(state == STATE_CLOSE){
						W.PopupManager.closePopup(this, {action:W.PopupManager.ACTION_CLOSE});
					}
					break;
				case W.KEY.RIGHT:
					if(state == STATE_CONTENTS){
						_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:"none"});
						if(cIdx + 1 < _this.param.targetList.length){
							cIdx++;
						}else{
							cIdx = 0;
						}
						_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:""});
						_comp._popup._itemArea._list._inner.setStyle({y:-85 * Math.floor(cIdx/3)});
						_comp._popup._cPage.setText(util.changeDigit(Math.floor(cIdx/3+1),2));
					}
					break;
				case W.KEY.LEFT:
					if(state == STATE_CONTENTS){
						_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:"none"});

						if(cIdx == 0) {
							cIdx = _this.param.targetList.length-1;
						}else{
							cIdx--;
						}
						W.log.info("cIdx ========== " + cIdx);
						_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:""});
						_comp._popup._itemArea._list._inner.setStyle({y:-85 * Math.floor(cIdx/3)});
						_comp._popup._cPage.setText(util.changeDigit(Math.floor(cIdx/3+1),2));
					}
					break;
				case W.KEY.UP:
					if(state == STATE_CLOSE){
						state = STATE_CONTENTS;
						_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:""});
						if(isExpended){
							_comp._popup._page.setStyle({opacity:1});
							_comp._popup._itemArea._arr_l.setStyle({opacity:1});
							_comp._popup._itemArea._arr_r.setStyle({opacity:1});
						}

						_this.btn[0].unFocus();
					}
					break;
				case W.KEY.DOWN:
					if(state == STATE_CONTENTS){
						_comp._popup._itemArea._list._inner._focs[cIdx].setStyle({display:"none"});
						state = STATE_CLOSE;
						if(isExpended){
							_comp._popup._page.setStyle({opacity:0.4});
							_comp._popup._itemArea._arr_l.setStyle({opacity:0.3});
							_comp._popup._itemArea._arr_r.setStyle({opacity:0.3});
						}
						_this.btn[0].focus();
					}
				break;
			}
		}
	});
});