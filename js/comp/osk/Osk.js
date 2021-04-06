"use strict";
/** 
 * @fileoverview OSK 
 * @author jean511
 * @version 1.0 
 * <p>Copyright (c) 1997-2012 Alticast, Inc. All rights reserved.
 */

W.defineModule(["comp/osk/OSKCore"], 
		function(OSKCore) {
	'use strict';
	var _this;
	var leftCallback = null;
	var downCallback = null;
	var modeChangeCallback = null;
	var endCallback = null;
	var keyDownCallback = null;
	var spanBox = null;
	var doubleClickTimeoutSec = 2000;
	var doubleClickTimeout = null;
	var self = this;
	var isShowing = false;
	var keyIndex = 0;
	var oldKeyIndex = 0;
	var oskMode = 0; //0:한글, 1-영문, 2-숫자
	var keyArrayLength = 20;
	var okTimeout = null;
	var okTimeoutSec = 500;
	var chrIndex = 1;
	var tmpChangeCount = 0;
	var keyNameArray = [
	    ["ㄱㄲ", "ㄴ", "ㄷㄸ", "ㅏㅑ", "ㄹ", "ㅁ", "ㅂㅃ", "ㅓㅕ", "ㅅㅆ", "ㅇ", "ㅈㅉ", "ㅗㅛ", "ㅊ", "ㅋ", "ㅌ", "ㅜㅠ", "ㅍ", "ㅎ", "ㅡ", "ㅣ"],
	    ["A B", "C D", "E F", "@", "G H", "I J", "K L", "- _", "M N", "O P", "Q R", ". ,", "S T", "U V", "W X", "/", "Y Z", ".com", ".co.kr", ".net"],
	    ["a b", "c d", "e f", "@", "g h", "i j", "k l", "- _", "m n", "o p", "q r", ". ,", "s t", "u v", "w x", "/", "y z", ".com", ".co.kr", ".net"],
	    ["1", "2", "3", ": ;", "4", "5", "6", "? !", "7", "8", "9", ". ,", "+", "0", "-", "/", "~", "=", "%", "* #"],
	    ["‘", "’", "“", "”", "(", ")", "<", ">", "[", "]", "{", "}", "&", "^", "|", "/", "￦", "$", "★", "♥"]
	];
	var keyFontSizeArray = [
	    [26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,  1,1,1,1],
	    [26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,  1,1,1,1],
	    [26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,   26, 26, 26, 26,  1,1,1,1],
	    [29, 29, 29, 28,   29, 29, 29, 26,   29, 29, 29, 34,   28, 29, 28, 26,   28, 26, 24, 26,  1,1,1,1],
	    [28, 28, 28, 28,   24, 24, 24, 24,   24, 24, 24, 24,   25, 25, 25, 24,   26, 24, 26, 26,  1,1,1,1]
	];
	var keyFontTopArray = [
	    [15, 15, 15, 15,    15, 15, 15, 15,    15, 15, 15, 15,    15, 15, 15, 15,    15, 15, 15, 15,   15,15,15,15],
	    [15, 15, 15, 16,    15, 15, 15, 11,    15, 15, 15, 8,    15, 15, 15, 17,    15, 15, 15, 15,   15,15,15,15],
	    [15, 15, 15, 16,    15, 15, 15, 11,    15, 15, 15, 8,    15, 15, 15, 17,    15, 15, 15, 15,   15,15,15,15],
	    [15, 15, 15, 15,    15, 15, 15, 16,    15, 15, 15, 8,    15, 15, 15, 15,    15, 15, 15, 15,   15,15,15,15],
	    [17, 17, 17, 17,    17, 17, 17, 17,    17, 17, 17, 17,    15, 17, 16, 17,    15, 15, 15, 15,   15,15,15,15]
	];
	var keyBGArray = [
	    [1,1,1,2,   1,1,1,2,   1,1,1,2,   1,1,1,2,   1,1,2,2,   3,3,3,3],
	    [1,1,1,2,   1,1,1,2,   1,1,1,2,   1,1,1,2,   1,2,2,2,   3,3,3,3],
	    [1,1,1,2,   1,1,1,2,   1,1,1,2,   1,1,1,2,   1,2,2,2,   3,3,3,3],
	    [1,1,1,2,   1,1,1,2,   1,1,1,2,   2,1,2,2,   2,2,2,2,   3,3,3,3],
	    [1,1,1,1,   1,1,1,1,   1,1,1,1,   1,1,1,1,   1,1,1,1,   3,3,3,3]
	];
	var keyDoubleArray = [
  	    [2,1,2,2,   1,1,2,2,   2,1,2,2,   1,1,1,2,   1,1,1,1],
  	    [2,2,2,1,   2,2,2,2,   2,2,2,2,   2,2,2,1,   2,1,1,1],
  	    [2,2,2,1,   2,2,2,2,   2,2,2,2,   2,2,2,1,   2,1,1,1],
  	    [1,1,1,2,   1,1,1,2,   1,1,1,2,   1,1,1,1,   1,1,1,2],
  	    [1,1,1,1,   1,1,1,1,   1,1,1,1,   1,1,1,1,   1,1,1,1]
  	];
	
	var topKeyTexts = ["한영특", "지우기", "입력완료", "띄어쓰기"];
	var topKeyTextLefts = [26, 107, 192, 258];
	var topKeyImgs = ["key_icon_03.png", "key_icon_01.png", "key_icon_04.png", "key_icon_02.png"];
	var topKeyImgLefts = [33, 124, 210, 307];
	var oskAreaBg = ["kt_osk.png", "kt_osk_eng.png", "kt_osk_eng.png"];
	var contextRoot;
	var oskArea;
	var oskInner;
	var keyBg = [];
	var keyText = [];
	var keyDiv = [];
	var keyIcon = [];
	
	var changeOskKey = function(){
		if(oskInner) oskArea.remove(oskInner);
		oskMode++;
		if(oskMode >= 3){
			oskMode = 0;
		}
		
		oskArea.setStyle({"background-image" : "url('"+contextRoot+oskAreaBg[oskMode]+"')", "background-position" : "4px 3px", "background-repeat" :"no-repeat"});
		oskInner = new W.Div({id:"osk_inner"});

		var htmlCode = "";
		var l, t = 0;
		var no = 0;
		var iconTop = [6, 3, 4, 3];
		
		for(var i=0; i < keyArrayLength; i++){
			l = (i%4)*99;
			t = Math.floor(i/4)*59;
			keyBg[no] = new W.Div({id:"key_bg_"+no});
			keyBg[no].setStyle({position:"absolute",width:"101px",height:"61px",left: l + "px",top: t + "px"});
			keyText[no] = new W.Span({id:"key_text_"+no, text :keyNameArray[oskMode][i]});
			keyText[no].setStyle({position:"absolute",width:"101px",height:"34px",textColor:"#FFFFFF","font-size":keyFontSizeArray[oskMode][no] + "px",font:"'윤고딕 530'",textAlign:"center",left: l + "px",top: (t+keyFontTopArray[oskMode][no]) + "px"});
			keyDiv[no] = new W.Div({id:"key_div_"+no});
			keyDiv[no].setStyle({position:"absolute",width:"101px",height:"61px",left: l + "px",top: t + "px"});
			
			oskInner.add(keyBg[no]);
			oskInner.add(keyText[no]);
			oskInner.add(keyDiv[no]);

			no++;
		}
		
		for(var i=0; i < topKeyTexts.length; i++){
			l = (i%4)*99;
			keyBg[no] = new W.Div({id:"key_bg_"+no});
			keyBg[no].setStyle({position:"absolute",width:"101px",height:"72px",left: l + "px",top: "295px"});

			keyText[no] = new W.Span({id:"key_text_"+no, text :topKeyTexts[i]});
			keyText[no].setStyle({position:"absolute",width:"101px",height:"34px",textColor:"#FFFFFF","font-size":"18px",font:"'윤고딕 530'",textAlign:"center",left: l + "px",top: "335px"});
			keyDiv[no] = new W.Div({id:"key_div_"+no});
			keyDiv[no].setStyle({position:"absolute",width:"101px",height:"72px",left: l + "px",top: "295px"});

			oskInner.add(keyBg[no]);
			oskInner.add(keyText[no]);
			oskInner.add(keyDiv[no]);
			no++;
		}
		
		oskInner.add(new W.Image({id:"key_icon", src : contextRoot + "kt_osk_key.png", x:33, y:299, position:"absolute"}));

		if(tmpChangeCount > 0){
			if(modeChangeCallback){
				modeChangeCallback(oskMode);
			}
		}
		tmpChangeCount++;

		chrIndex = 0;
		oskArea.add(oskInner);
	}
	
	var keyPress = function(idx){
		if(idx < 20){
			var chrIdx = idx;
			var chr = null;
			if((oskMode == 1 || oskMode == 2) && (chrIdx == 17 || chrIdx == 18 || chrIdx == 19)){
				chr = keyNameArray[oskMode][chrIdx];
			}else{
				if(keyNameArray[oskMode][chrIdx].length > 1){
					if(oldKeyIndex == chrIdx){
						chr = keyNameArray[oskMode][chrIdx].replace(" ", "").substr(chrIndex, 1);
						if(chrIndex == 0) chrIndex = 1; else chrIndex = 0;
					}else{
						chr = keyNameArray[oskMode][chrIdx].replace(" ", "").substr(0, 1);
						chrIndex = 1;
					}							
				}else{
					chrIndex = 0;
					chr = keyNameArray[oskMode][chrIdx].replace(" ", "").substr(chrIndex, 1);
				}
			}
			if(keyDoubleArray[oskMode][chrIdx] == 1){
				removeTimeout();
				inputChr(chr);
			}else if(keyDoubleArray[oskMode][chrIdx] == 2){
				if(doubleClickTimeout){
					deleteChr();
					removeTimeout();
				}
				doubleClickTimeout = setTimeout(moveCursor, doubleClickTimeoutSec);
				inputChr(chr);
			}
			
		}else if(idx == 23){
			removeTimeout();
			inputChr(" ");
		}else if(idx == 21){
			removeTimeout();
			deleteChr();
		}else if(idx == 20){
			removeTimeout();
			changeOskKey();
		}else if(idx == 22){
			removeTimeout();
			if(endCallback){
				endCallback(spanBox.getText());
			}
		}
		oldKeyIndex = idx;
	}
	
	var removeTimeout = function(){
		clearTimeout(doubleClickTimeout);
		doubleClickTimeout = null;
	}
	
	var moveCursor = function(){
		OSKCore.insertAtCaret(spanBox, '');
		doubleClickTimeout = null;
		chrIndex = 0;
	}
	
	var inputChr = function(chr){
		OSKCore.insertAtCaret(spanBox, chr);
		var d = OSKCore.deleteAtCaret(spanBox,2,0);
		var tmp = OSKCore.oData.composeHangul(d);
		OSKCore.insertAtCaret(spanBox, tmp);
	}
	
	var inputSpace = function(){
		OSKCore.insertAtCaret(spanBox, ' ');
	}
	
	var deleteChr = function(){
		var a = OSKCore.deleteAtCaret(spanBox, 1, 0);
		a = OSKCore.oData.decomposeHangul(a);
		if (a.length > 1) {
			OSKCore.insertAtCaret(spanBox, OSKCore.oData.composeHangul(a.slice(0, -1)))
		}
	}
	
	return{
		setOskMode : function(mode){
			if(mode == "KOR"){
				oskMode = -1;
			}else if(mode == "ENG"){
				oskMode = 0;
			}else if(mode == "eng"){
				oskMode = 1;
			}else{
				oskMode = 2;
			}
			changeOskKey(true);
			chrIndex = 0;
		},
		resetKeyIndex : function(){
			keyIndex = 0;
			return keyIndex;
		},
		create : function(appendComp, spanComp, left, top, cRoot){
			_this = this;
			//appendComp.comp.html("");
			contextRoot = cRoot;
			
			spanBox = spanComp;
			
			oskMode = -1;
			tmpChangeCount = 0;
			
			oskArea = new W.Div({id:"oskarea"});
			oskArea.setStyle({position:"absolute",width:"398px",height:"365px",display:"none",left:left + "px",top:top + "px"});
			appendComp.add(oskArea);
		},
		changeOskArea : function (spanComp, left, top) {
		    spanBox = spanComp;
		    oskArea.setStyle({position:"absolute",width:"398px",height:"365px",display:"none",left:left + "px",top:top + "px"});
		},
		show : function(){
			isShowing = true;
			changeOskKey();
			oskArea.setStyle({"display":"block"});
		},
		hide : function(){
			oskMode = -1;
			keyIndex = 0;
			oldKeyIndex = 0;
			isShowing = false;
			oskArea.setStyle({"display":"none"});
			spanBox.setText("");
		},
		destroy : function(){
			this.hide();
			oskArea.comp.remove();
		},
		moveLayer : function(left, top){
			oskArea.setStyle({left:left+"px", top:top+"px"});
		},
		setLeftCallback : function(func){
			leftCallback = func;
		},
		setDownCallback : function(func){
			downCallback = func;
		},
		setModeChangeCallback : function(func){
			modeChangeCallback = func;
		},
		setEndCallback : function(func){
			endCallback = func;
		},
		setKeyDownCallback : function(func){
			keyDownCallback = func;
		},
		focusKey : function(idx){
			if(!idx || idx == -1){
				idx = keyIndex;
			}
			if(idx < 20 ){
				keyBg[idx].setStyle({"background-image" : "url('"+contextRoot+"kt_osk_focus_a.png')"});
				//$("#key_bg_" + idx).attr("src", contextRoot + "key_01_f.png");
			}else{
				keyBg[idx].setStyle({"background-image" : "url('"+contextRoot+"kt_osk_focus_b.png')"});
				//$("#key_bg_" + idx).attr("src", contextRoot + "key_03_f.png");
				/*if(idx == 1){
					$("#key_icon_" + idx).attr("src", contextRoot + "key_icon_01_f.png");
				}else if(idx == 3){
					$("#key_icon_" + idx).attr("src", contextRoot + "key_icon_02_f.png");
				}*/
			}
			//$("#key_text_" + idx).css("color", "rgb(255,255,255)");
		},
		unFocusKey : function(idx){
			try{
				if(!idx || idx == -1){
					idx = keyIndex;
				}
				if(idx < 20 ){
					keyBg[idx].setStyle({"background-image" : "none"});
					//$("#key_text_" + idx).css("color", "rgb(50,50,50)");
					//$("#key_bg_" + idx).attr("src", contextRoot + "key_0" + keyBGArray[oskMode][idx] + ".png");
				}else{
					keyBg[idx].setStyle({"background-image" : "none"});
					//$("#key_text_" + idx).css("color", "rgb(242,242,242)");
					//$("#key_bg_" + idx).attr("src", contextRoot + "key_03.png");
					/*if(idx == 1){
						$("#key_icon_" + idx).attr("src", contextRoot + "key_icon_01.png");
					}else if(idx == 3){
						$("#key_icon_" + idx).attr("src", contextRoot + "key_icon_02.png");
					}*/
				}
				
				oldKeyIndex = idx - 4;
				removeTimeout();
			}catch(e){
				
			}
		},
		operate : function(keyCode, isForce){
			var isEmpty = false;
			if(isShowing || isForce){
				if(keyCode == 403 || keyCode == 127 || keyCode == 412){
					removeTimeout();
					deleteChr();
					var str = spanBox.getText();
					if(str.length == 0){
						isEmpty = true;
					}
					if(keyDownCallback){
						keyDownCallback(keyCode, isEmpty);
					}
					chrIndex = 0;
				}else if(keyCode == 122 || keyCode == 121){
					removeTimeout();
					changeOskKey(isForce);
					chrIndex = 0;
				}else if(keyCode == 406 || keyCode == 417){
					removeTimeout();
					inputChr(" ");
					if(keyDownCallback){
						keyDownCallback(keyCode, isEmpty);
					}
					chrIndex = 0;
				}else if(keyCode == 415){
					if(endCallback){
						endCallback(spanBox.getText());
					}
					
				}else if(keyCode == 13){
					//ok key
					keyPress(keyIndex);
					var str = spanBox.getText();
					if(str.length == 0){
						isEmpty = true;
					}
					if(keyDownCallback){
						keyDownCallback(keyIndex == 1 ? 403 : keyCode, isEmpty);
					}
				}else if(keyCode == 37){
					//left key
					if(keyIndex%4 == 0){
						if(leftCallback){
							this.unFocusKey(keyIndex);
							leftCallback();
						}
					}else{
						this.unFocusKey(keyIndex);
						keyIndex--;
						this.focusKey(keyIndex);
					}
					chrIndex = 0;
				}else if(keyCode == 39){
					//right key
					if(keyIndex%4 == 3){
						this.unFocusKey(keyIndex);
						keyIndex -= 3;
						this.focusKey(keyIndex);
					}else{
						this.unFocusKey(keyIndex);
						keyIndex++;
						this.focusKey(keyIndex);
					}
					chrIndex = 0;
				}else if(keyCode == 38){
					//up key
					if(keyIndex > 3){
						this.unFocusKey(keyIndex);
						keyIndex -= 4;
						this.focusKey(keyIndex);
					}
					chrIndex = 0;
				}else if(keyCode == 40){
					//down key
					if(keyIndex < 20){
						this.unFocusKey(keyIndex);
						keyIndex += 4;
						this.focusKey(keyIndex);
					}else{
						if(downCallback){
							downCallback();
						}
					}
					chrIndex = 0;
				}
				else if (keyCode >= 48 && keyCode <= 57) {
					removeTimeout();
					inputChr("" + (keyCode - 48));
					
					if(keyDownCallback){
						keyDownCallback(keyIndex == 1 ? 403 : keyCode, isEmpty);
					}
				}
			}
		}
	};

});