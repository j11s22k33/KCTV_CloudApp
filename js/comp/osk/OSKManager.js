"use strict";
/** 
 * @fileoverview OSK 
 * @author jean511
 * @version 1.0 
 * <p>Copyright (c) 1997-2012 Alticast, Inc. All rights reserved.
 */

W.defineModule(["comp/osk/OSKCore"], 
		function(oskManager) {
	'use strict';
	
	var OSKManager = function(){
		var _this;
		var _comp;
		var spanBox;
		var endCallback;
		var keyDownCallback;
		var unfocusCallback = null;
		var index = 6;
		var oldIndex = 6;
		var isActive = false;
		var isEnglish = false;
		var isNumber = false;
		var doubleClickTimeout = null;
		var doubleClickTimeoutSec = 1500;
		var chrIndex = 0;
		var OSKCore = oskManager.create();
		
		var keyMappingNum = [14, 1, 2, 3, 5, 6, 7, 9, 10, 11];

		var keys_kor = [
		    [], ["ㄱ", "ㅁ", "ㄲ"],  ["ㅅ", "ㅈ", "ㅋ"],  ["ㅓ", "ㅕ"],
		    [], ["ㄴ", "ㄷ", "ㄸ"],  ["ㅇ", "ㅎ", "ㅌ"],  ["ㅣ", "ㅛ", "ㅠ"],
		    [], ["ㄹ", "ㅂ", "ㅃ"],  ["ㅗ", "ㅆ", "ㅍ"],  ["ㅏ", "ㅜ", "ㅑ"],
		    [], [],  ["ㅡ", "ㅊ", "ㅉ"],  []
		];
		
		var keys_eng = [
		    [], ["E", "W", "Q"],  ["T", "F", "Y"],  ["O", "P"],
		    [], ["A", "D", "Z"],  ["R", "G", "V"],  ["I", "L", "J"],
		    [], ["S", "C", "X"],  ["H", "U", "B"],  ["N", "M", "K"],
		    [], [],  [],  []
		];

		var keys_num = [
		    [], ["1"],  ["2"],  ["3"],
		    [], ["4"],  ["5"],  ["6"],
		    [], ["7"],  ["8"],  ["9"],
		    [], [],  ["0"],  []
		];

		var getStr = function(arr){
			var str = "";
			for(var i=0; i < arr.length; i++){
				if(i == 0){
					str = arr[i];
				}else{
					str = str + " " + arr[i];
				}
			}
			return str;
		};
		
		var create = function(_div){
			_comp = new W.Div({x:0, y:0, width:"482px", height:"224px"});
			_div.add(_comp);
			
			for(var i=0; i < 16; i++){
				_comp.add(new W.Image({x:10 + (i%4) * 120, y:3 + Math.floor(i/4) * 52, width:"112px", height:"45px", src:"img/box_osk.png"}));
				if(keys_num[i].length == 1){
					_comp.add(new W.Span({x:22 + (i%4) * 120, y:13 + Math.floor(i/4) * 52, width:"20px", height:"22px", 
						textColor:"rgba(131,122,119,0.4)", "font-size":"22px", className:"font_rixhead_medium", 
						text:keys_num[i][0], textAlign:"center"}));
				}
			}
			_comp.add(new W.Image({x:0, y:0, width:"68px", height:"68px", src:"img/color_red.png"}));
			_comp.add(new W.Image({x:0, y:231-179, width:"68px", height:"68px", src:"img/color_yellow.png"}));
			_comp.add(new W.Image({x:0, y:283-179, width:"68px", height:"68px", src:"img/color_green.png"}));
			_comp.add(new W.Image({x:0, y:335-179, width:"68px", height:"68px", src:"img/color_blue.png"}));
			
			_comp._kor = new W.Div({x:0, y:0, width:"482px", height:"224px"});
			_comp.add(_comp._kor);
			_comp._kor.add(new W.Span({x:51, y:17, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"검색"}));
			_comp._kor.add(new W.Span({x:51, y:69, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"띄어쓰기"}));
			_comp._kor.add(new W.Span({x:51, y:121, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"삭제"}));
			_comp._kor.add(new W.Span({x:51, y:173, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"다시검색"}));
			_comp._kor.add(new W.Span({x:130, y:173, width:"112px", height:"15px", textColor:"rgba(255,255,255,0.9)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"한/영", textAlign:"center"}));
			_comp._kor.add(new W.Span({x:368, y:173, width:"112px", height:"15px", textColor:"rgba(255,255,255,0.9)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"숫자", textAlign:"center"}));
			
			_comp._eng = new W.Div({x:0, y:0, width:"482px", height:"224px", display:"none"});
			_comp.add(_comp._eng);
			_comp._eng.add(new W.Span({x:51, y:17, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"Search"}));
			_comp._eng.add(new W.Span({x:51, y:69, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"Space"}));
			_comp._eng.add(new W.Span({x:51, y:121, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"Delete"}));
			_comp._eng.add(new W.Span({x:51, y:173, width:"70px", height:"15px", textColor:"rgba(255,255,255,0.75)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"Reset"}));
			_comp._eng.add(new W.Span({x:130, y:173, width:"112px", height:"15px", textColor:"rgba(255,255,255,0.9)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"KOR/ENG", textAlign:"center"}));
			_comp._eng.add(new W.Span({x:368, y:173, width:"112px", height:"15px", textColor:"rgba(255,255,255,0.9)", 
				"font-size":"15px", className:"font_rixhead_medium", text:"Number", textAlign:"center"}));
			
			_comp._kor_keyboard = new W.Div({x:0, y:0, width:"482px", height:"224px"});
			_comp.add(_comp._kor_keyboard);
			_comp._eng_keyboard = new W.Div({x:0, y:0, width:"482px", height:"224px", display:"none"});
			_comp.add(_comp._eng_keyboard);
			_comp._num_keyboard = new W.Div({x:0, y:0, width:"482px", height:"224px", display:"none"});
			_comp.add(_comp._num_keyboard);
			for(var i=0; i < 16; i++){
				if(keys_kor[i].length > 0){
					_comp._kor_keyboard.add(new W.Span({x:22 + (i%4) * 120, y:17 + Math.floor(i/4) * 52, width:"112px", height:"17px", 
						textColor:"rgba(255,255,255,0.9)", "font-size":"17px", className:"font_rixhead_bold", 
						text:getStr(keys_kor[i]), textAlign:"center"}));
				}
				if(keys_eng[i].length > 0){
					_comp._eng_keyboard.add(new W.Span({x:20 + (i%4) * 120, y:16 + Math.floor(i/4) * 52, width:"112px", height:"17px", 
						textColor:"rgba(255,255,255,0.9)", "font-size":"17px", className:"font_rixhead_bold", 
						text:getStr(keys_eng[i]), textAlign:"center"}));
				}
				if(keys_num[i].length > 0){
					_comp._num_keyboard.add(new W.Span({x:20 + (i%4) * 120, y:16 + Math.floor(i/4) * 52, width:"112px", height:"17px", 
						textColor:"rgba(255,255,255,0.9)", "font-size":"17px", className:"font_rixhead_bold", 
						text:getStr(keys_num[i]), textAlign:"center"}));
				}
			}
			
			_comp._focus = new W.Image({x:9 + (index%4) * 120, y:2 + Math.floor(index/4) * 52, width:"114px", height:"47px", src:"img/box_osk_f.png"});
			_comp.add(_comp._focus);
		};
		
		var focus = function(){
			W.log.info("focus " + index);
			_comp._focus.setStyle({x:9 + (index%4) * 120, y:2 + Math.floor(index/4) * 52, display:""});
			isActive = true;
		};
		
		var unFocus = function(){
			W.log.info("unFocus");
			_comp._focus.setStyle({x:9 + (index%4) * 120, y:2 + Math.floor(index/4) * 52, display:"none"});
			isActive = false;
		};
		
		var changeBoard = function(){
			W.log.info("isNumber ==== " + isNumber);
			W.log.info("isEnglish ==== " + isEnglish);
			
			if(isNumber){
				_comp._kor_keyboard.setStyle({display:"none"});
				_comp._eng_keyboard.setStyle({display:"none"});
				_comp._num_keyboard.setStyle({display:""});
			}else{
				if(isEnglish){
					_comp._kor_keyboard.setStyle({display:"none"});
					_comp._eng_keyboard.setStyle({display:""});
					_comp._num_keyboard.setStyle({display:"none"});
					_comp._kor.setStyle({display:"none"});
					_comp._eng.setStyle({display:""});
				}else{
					_comp._kor_keyboard.setStyle({display:""});
					_comp._eng_keyboard.setStyle({display:"none"});
					_comp._num_keyboard.setStyle({display:"none"});
					_comp._kor.setStyle({display:""});
					_comp._eng.setStyle({display:"none"});
				}
			}
			moveCursor();
		};
		
		var inputChr = function(chr){
			var spanText = spanBox.getText();
			if(spanText.length < 12){
				var korChars = OSKCore.toKorChars(spanText);
				W.log.info(korChars);
				OSKCore.insertAtCaret(spanBox, chr);
				var d = OSKCore.deleteAtCaret(spanBox,2,0);
				if(chr == "ㅅ" && korChars[2] && korChars[2] == "ㅅ"){
					OSKCore.insertAtCaret(spanBox, d);
				}else{
					var tmp = OSKCore.oData.composeHangul(d);
					OSKCore.insertAtCaret(spanBox, tmp);
				}
			}
		};
		
		var deleteChr = function(){
			var a = OSKCore.deleteAtCaret(spanBox, 1, 0);
			a = OSKCore.oData.decomposeHangul(a);
			if (a.length > 1) {
				OSKCore.insertAtCaret(spanBox, OSKCore.oData.composeHangul(a.slice(0, -1)))
			}
		};
		
		var moveCursor = function(){
			OSKCore.insertAtCaret(spanBox, '');
			clearTimeout(doubleClickTimeout);
			doubleClickTimeout = undefined;
			chrIndex = 0;
		};
		
		var oldText = undefined;
		var keyPress = function(idx){
			var keys;
			var isKor = false;
			if(isNumber){
				keys = keys_num;
			}else{
				if(isEnglish){
					keys = keys_eng;
				}else{
					keys = keys_kor;
					isKor = true;
				}
			}
			

			if(isKor && (oldIndex != idx || !doubleClickTimeout)){
				oldText = spanBox.getText();
			}
			

			if(keys[idx].length > 0){
				if(isNumber){
					inputChr(keys[idx][0]);
				}else{
					if(oldIndex != idx){
						moveCursor();
					}else{
						if(isKor && !doubleClickTimeout){
							moveCursor();
						}
					}
					if(doubleClickTimeout){
						if(isKor && oldText){
							spanBox.setText(oldText);
						}else{
							deleteChr();
						}
						clearTimeout(doubleClickTimeout);
						doubleClickTimeout = undefined;
					}
					var chr = keys[idx][chrIndex];
					chrIndex++;
					if(chrIndex == keys[idx].length) chrIndex = 0;
					doubleClickTimeout = setTimeout(function(){
						moveCursor();
						oldText = undefined;
					}, doubleClickTimeoutSec);
					inputChr(chr);
				}
			}
			oldIndex = idx;
		};

		this.create = function(appendComp, spanComp){
			_this = this;
			index = 6;
			isEnglish = false;
			isNumber = false;
			create(appendComp);
			spanBox = spanComp;
		};
		this.setEndCallback = function(func){
			endCallback = func;
		};
		this.resetKeyword = function(){
			spanBox.setText("");
			keyDownCallback(spanBox.getText());
			moveCursor();
			index = 6;
			focus();
		};
		this.setKeyDownCallback = function(func){
			keyDownCallback = func;
		};
		this.setUnfocusCallback = function(func){
			unfocusCallback = func;
		};
		this.focus = function(idx){
			if(idx){
				index = idx;
			}
			focus();
		};
		this.unFocus = function(){
			unFocus();
		};
		this.delChar = function(){
			deleteChr();
			moveCursor();
			keyDownCallback(spanBox.getText());
		};
		this.addBlank = function(){
			inputChr(" ");
			moveCursor();
		};
		this.operate = function(keyCode){
			switch (event.keyCode) {
			case W.KEY.UP:
				if(index > 3){
					index -= 4;
					focus();
				}else{
					if(spanBox.getText().length == 0){
						index += 12;
						focus();
					}else{
						unFocus();
						unfocusCallback("U");
					}
				}
				moveCursor();
				break;
			case W.KEY.DOWN:
				if(index < 12){
					index += 4;
					focus();
				}else{
					if(W.StbConfig.cugType == "accommodation"){
						index = index % 4;
						focus();
					}else{
						unFocus();
						index = 14;
						unfocusCallback("D");
					}
				}
				moveCursor();
				break;
			case W.KEY.RIGHT:
				if(index%4 == 3){
					if(unfocusCallback("R")){
						unFocus();
					}else{
						if(index == 15){
							index = 0;
						}else{
							index++;
						}
						focus();
					}
				}else{
					if(index == 15){
						index = 0;
					}else{
						index++;
					}
					focus();
				}
				moveCursor();
				break;
			case W.KEY.LEFT:
				if(index == 0){
					index = 15;
				}else{
					index--;
				}
				focus();
				moveCursor();
				break;
			case W.KEY.ENTER:
				if(index == 13){
					isEnglish = !isEnglish;
					isNumber = false;
					changeBoard();
					moveCursor();
				}else if(index == 15){
					isNumber = !isNumber;
					changeBoard();
					moveCursor();
				}else if(index == 0){
					if(endCallback){
						endCallback();
					}
					moveCursor();
				}else if(index == 4){
					inputChr(" ");
					moveCursor();
				}else if(index == 8){
					deleteChr();
					moveCursor();
					keyDownCallback(spanBox.getText());
				}else if(index == 12){
					spanBox.setText("");
					keyDownCallback(spanBox.getText());
					moveCursor();
					index = 6;
					focus();
				}else{
					if(isEnglish && !isNumber && index == 14){
						moveCursor();
					}else{
						keyPress(index);
						keyDownCallback(spanBox.getText());
					}
				}
				break;
			case W.KEY.SWITCH_CHARSET:
				if(isNumber){
					isNumber = false;
					isEnglish = false;
				}else{
					if(isEnglish){
						isNumber = true;
					}else{
						isEnglish = true;
					}
				}
				changeBoard();
				moveCursor();
				index = 13;
				focus();
				break;
			case W.KEY.COLOR_KEY_R:
				if(endCallback){
					endCallback();
				}
				moveCursor();
				index = 0;
				focus();
				break;
			case W.KEY.COLOR_KEY_B:
				spanBox.setText("");
				keyDownCallback(spanBox.getText());
				moveCursor();
				index = 6;
				focus();
				break;
			case W.KEY.COLOR_KEY_G:
			case W.KEY.DELETE:
				deleteChr();
				moveCursor();
				keyDownCallback(spanBox.getText());
				index = 8;
				focus();
				break;
			case W.KEY.COLOR_KEY_Y:
				inputChr(" ");
				moveCursor();
				index = 4;
				focus();
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
				index = keyMappingNum[event.keyCode-48];					
				keyPress(index);
				keyDownCallback(spanBox.getText());
				focus();
				break;
			}
		}
	};
	
	return {
		create: function(){
			var comp = new OSKManager();
			return comp;
		}
	}
});