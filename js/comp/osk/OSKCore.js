/**
 * osk/OSKCore
 */
W.defineModule(function() {
	'use strict';

	var OSKCore = function(){
		var getSelectionStart = function(inputBox) {
			//inputBox.focus();
			if (inputBox.selectionStart !== undefined) {
				return inputBox.selectionStart;
			} else {
				if (document.selection) {
					var range = document.selection.createRange();
					if (range == null) {
						return 0;
					}
					var tRange = inputBox.createTextRange();
					var dupl = tRange.duplicate();
					tRange.moveToBookmark(range.getBookmark());
					dupl.setEndPoint("EndToStart", tRange);
					return dupl.text.length;
				}
			}
			return 0;
		};

		var getSelectionEnd = function(inputBox) {
			//inputBox.focus();
			if (inputBox.selectionEnd !== undefined) {
				return inputBox.selectionEnd;
			} else {
				if (document.selection) {
					var range = document.selection.createRange();
					if (range == null) {
						return 0;
					}
					var tRange = inputBox.createTextRange();
					var dupl = tRange.duplicate();
					tRange.moveToBookmark(range.getBookmark());
					dupl.setEndPoint("EndToStart", tRange);
					return dupl.text.length + range.text.length;
				}
			}
			return inputBox.value.length;
		};

		var setCaretPosition = function(d, f, c) {
			var a = d.value.length;
			if (f > a) {
				f = a;
			}
			if (f + c > a) {
				c = a - c;
			}
			//d.focus();
			if (d.setSelectionRange) {
				d.setSelectionRange(f, f + c);
			} else {
				if (d.createTextRange) {
					var b = d.createTextRange();
					b.collapse(true);
					b.moveEnd("character", f + c);
					b.moveStart("character", f);
					b.select();
				}
			}
			//d.focus();
		}

		var indexOf = function(d, f) {
			var c = d.length;
			for ( var e = 0; e < c; e++) {
				if (d[e] == f) {
					return e;
				}
			}
			return -1;
		};

		this.toKorChars = function(str){
			var chars = [];
			if(str.length > 0){
				str = str[str.length - 1];
				var cCho = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ], 
					cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ], 
					cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ], 
					cho, jung, jong; 

				var cCode = str.charCodeAt(i); 
				if (cCode != 32) { 
					// 한글이 아닌 경우  
					if (cCode < 0xAC00 || cCode > 0xD7A3) { 
						
					}else{
						cCode = str.charCodeAt(i) - 0xAC00; 
						jong = cCode % 28; // 종성  
						jung = ((cCode - jong) / 28 ) % 21 // 중성  
						cho = (((cCode - jong) / 28 ) - jung ) / 21 // 초성  
						chars.push(cCho[cho], cJung[jung]); 
						if (cJong[jong] !== '') { 
							chars.push(cJong[jong]); 
						}
					}
				} 
			}
			return chars;
		};
		this.insertAtCaret = function(spanBox, chr) {
			var str = spanBox.getText() + chr;
			spanBox.setText(str);
			$(".search_input_text").last().html(str.replace(/ /g, "&nbsp;&nbsp;"));
		};
		this.deleteAtCaret = function(spanBox, delLength) {
			var str = spanBox.getText();
			var strDel = "";
			
			if (str.length > 0) {
				if (delLength > str.length) {
					delLength = str.length;
				}
				
				strDel = str.substring(str.length - delLength);
				str = str.substring(0, str.length - delLength);
				
				spanBox.setText(str);
				$(".search_input_text").last().html(str.replace(/ /g, "&nbsp;&nbsp;"));
			}
			
			return strDel;
		};
		this.oData = {
			initial : [ 12593, 12594, 12596, 12599, 12600, 
			            12601, 12609, 12610, 12611, 12613, 
			            12614, 12615, 12616, 12617, 12618, 
			            12619, 12620, 12621, 12622 ],
			finale : [ 0, 12593, 12594, 12595, 12596, 
			           12597, 12598, 12599, 12601, 12602, 
			           12603, 12604, 12605, 12606, 12607, 
			           12608, 12609, 12610, 12612, 12613, 
			           12614, 12615, 12616, 12618, 12619, 
			           12620, 12621, 12622 ],
			dMedial : [ 0, 0, 0, 0, 0, 
			            0, 0, 0, 0, 800, 
			            801, 820, 0, 0, 1304, 
			            1305, 1320, 0, 0, 1820 ],
			dFinale : [ 0, 0, 0, 119, 0, 
			            422, 427, 0, 0, 801, 
			            816, 817, 819, 825, 826, 
			            827, 0, 0, 1719, 0, 1919 ],
			jungsung : [12623, 12624, 12625, 12626, 12627,
			            12628, 12629, 12630, 12631, 12632,
			            12633, 12634, 12635, 12636, 12637,
			            12638, 12639, 12640, 12641, 12642,
			            12643],
			shiftJung : [12623, 12625, 12627, 12629, 12632, 12637],
			shiftJungFinale : [1, 3, 5, 7, 10, 15],
			SBase : 44032, //가
			LBase : 4352, //ㄱ
			VBase : 12623, //ㅏ
			TBase : 4519,
			LCount : 19, //초성 자음 갯수, initial 
			VCount : 21, //중성 갯수
			TCount : 28, //자음 받침 갯수, finale
			NCount : 588,
			SCount : 11172,
			PChar : 12643,
			composeHangul : function(d) {
				var h = d.length;
				if (h == 0) {
					return "";
				}
				var n = d.charCodeAt(0);
				var o = String.fromCharCode(n);

				var e, k, l, j, f, c, m;
				for ( var g = 1; g < h; ++g) {
					e = d.charCodeAt(g); //중성
					
					if(e == this.PChar){
						var result = this.searchJungSung(n);
						if(result.result){
							k = indexOf(this.shiftJung, result.jungChar);
							if(k != -1){
								var word = this.makeWord(result.cho, this.shiftJungFinale[k], result.jong);
								o = String.fromCharCode(word);
								return o;
							}
						}
					}

					k = indexOf(this.initial, n);
					if (k != -1) {
						l = e - this.VBase;
						if (0 <= l && l < this.VCount) {
							n = this.SBase + (k * this.VCount + l) * this.TCount;
							o = o.slice(0, o.length - 1) + String.fromCharCode(n);
							continue;
						}
					}
					m = n - this.SBase; // 글자에서 '가'를 뺀다.
					if (0 <= m && m < 11145 && (m % this.TCount) == 0) {
						f = indexOf(this.finale, e);
						if (f != -1) {
							n += f;
							o = o.slice(0, o.length - 1) + String.fromCharCode(n);
							continue;
						}
						l = (m % this.NCount) / this.TCount;
						j = indexOf(this.dMedial, (l * 100) + (e - this.VBase));
						if (j > 0) {
							n += (j - l) * this.TCount;
							o = o.slice(0, o.length - 1) + String.fromCharCode(n);
							continue;
						}
					}
					if (0 <= m && m < 11172 && (m % this.TCount) != 0) {
						f = m % this.TCount;
						l = e - this.VBase;
						if (0 <= l && l < this.VCount) {
							k = indexOf(this.initial, this.finale[f]);
							if (0 <= k && k < this.LCount) {
								o = o.slice(0, o.length - 1) + String.fromCharCode(n - f);
								n = this.SBase + (k * this.VCount + l) * this.TCount;
								o = o + String.fromCharCode(n);
								continue;
							}
							if (f < this.dFinale.length && this.dFinale[f] != 0) {
								o = o.slice(0, o.length - 1) + String.fromCharCode(n - f + Math.floor(this.dFinale[f] / 100));
								n = this.SBase + (indexOf( this.initial, this.finale[(this.dFinale[f] % 100)]) * this.VCount + l) * this.TCount;
								o = o + String.fromCharCode(n);
								continue;
							}
						}
						c = indexOf(this.dFinale, (f * 100) + indexOf(this.finale, e));
						if (c > 0) {
							n = n + c - f;
							o = o.slice(0, o.length - 1) + String.fromCharCode(n);
							continue;
						}
					}
					n = e;
					o = o + String.fromCharCode(e);
				}
				return o;
			},
			decomposeHangul : function(c) {
				var h = c.length;
				var l = "";
				var d, k, j, e, f;
				for ( var g = 0; g < h; g++) {
					var d = c.charCodeAt(g);
					k = d - this.SBase;
					if (k < 0 || k >= this.SCount) {
						l = l + String.fromCharCode(d);
						continue;
					}
					j = this.initial[Math.floor(k / this.NCount)];
					e = this.VBase + (k % this.NCount) / this.TCount;
					f = this.finale[k % this.TCount];
					l = l + String.fromCharCode(j, e);
					if (f != 0) {
						/*
						 * 자음 : 유니코드에서 지원되는 자음 조합은 총 30개로 다음 표와 같다.
									12593 ㄱ 12599 ㄷ 12605 ㄽ 12611 ㅃ 12617 ㅉ
									12594 ㄲ 12600 ㄸ 12606 ㄾ 12612 ㅄ 12618 ㅊ
									12595 ㄳ 12601 ㄹ 12607 ㄿ 12613 ㅅ 12619 ㅋ
									12596 ㄴ 12602 ㄺ 12608 ㅀ 12614 ㅆ 12620 ㅌ
									12597 ㄵ 12603 ㄻ 12609 ㅁ 12615 ㅇ 12621 ㅍ
									12598 ㄶ 12604 ㄼ 12610 ㅂ 12616 ㅈ 12622 ㅎ
							위의 내용중에서 KT OSK특성상 단/쌍자음 문자 입력을 고려해서 아래와 같이
							한글자음을 쪼개서 return하게 수정함
						 */
						switch (f) {
							case 12595 :	//ㄳ
								l = l + String.fromCharCode(12593)+String.fromCharCode(12613);
								break;
							case 12597 :	// ㄵ
								l = l + String.fromCharCode(12596)+String.fromCharCode(12616);
								break;
							case 12602 :	// ㄺ
								l = l + String.fromCharCode(12601)+String.fromCharCode(12593);
								break;
							case 12604 :	// ㄼ
								l = l + String.fromCharCode(12601)+String.fromCharCode(12610);
								break;
							case 12605 :	// ㄽ
								l = l + String.fromCharCode(12601)+String.fromCharCode(12613);
								break;
							case 12612 :	// ㅄ
								l = l + String.fromCharCode(12610)+String.fromCharCode(12613);
								break;
							default:
								l = l + String.fromCharCode(f);
								break;
						}
					}
				}
				return l;
			},
			searchJungSung : function(chrCode){
				var result = new Object();
				var uni = chrCode - this.SBase;
				var jong = uni % this.TCount;
				if(jong > 0){
					result.result = false;
					return result;
				}
				var jung = ((uni - jong)/this.TCount)%this.VCount;
				var cho = parseInt(((uni - jong)/this.TCount)/this.VCount);
				var jungChar = this.jungsung[jung]
				result.result = true;
				result.jungChar = jungChar;
				result.cho = cho;
				result.jung = jung;
				result.jong = jong;
				return result;
			},
			makeWord : function(a, b, c){
				return this.SBase + (a * this.NCount) + (b * this.TCount) + c;
			}
		}
	}
	return {
		create: function(){
			var comp = new OSKCore();
			return comp;
		}
	};
});
