/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function ScreenRatio() {
        var _this = this;

        var mode = 0;

        var index = 0;
        var btnIndex = 0;
        var selectedIndex = 0;
        var _comp;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["screen_ratio_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[1]);
            
            _this._sample = [];
            _this._sample[0] = new W.Div({x:242, y:237, width:591, height:204, display:"none"});
            _comp.add(_this._sample[0]);
            _this._sample[0].add(new W.Image({x:248-242, y:255-237, width:191, height:107, src:"img/img_set_tv_01.png"}));
            _this._sample[0].add(new W.Image({x:242-242, y:249-237, width:203, height:132, src:"img/img_set_tv_hd.png"}));
            _this._sample[0].add(new W.Image({x:623-242, y:255-237, width:191, height:107, src:"img/img_set_tv_02.png"}));
            _this._sample[0].add(new W.Image({x:617-242, y:249-237, width:203, height:132, src:"img/img_set_tv_hd.png"}));
            _this._sample[0].add(new W.Span({x:142-242, y:423-237, width:403, text:W.Texts["screen_ratio_broadcast_guide_1"],
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _this._sample[0].add(new W.Span({x:517-242, y:423-237, width:403, text:W.Texts["screen_ratio_broadcast_guide_2"],
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            
            _this._sample[1] = new W.Div({x:242, y:237, width:591, height:204, display:"none"});
            _comp.add(_this._sample[1]);
            _this._sample[1].add(new W.Image({x:272-242, y:255-237, width:143, height:107, src:"img/img_set_tv_01.png"}));
            _this._sample[1].add(new W.Image({x:242-242, y:249-237, width:203, height:132, src:"img/img_set_tv_hd.png"}));
            _this._sample[1].add(new W.Image({x:623-242, y:255-237, width:191, height:107, src:"img/img_set_tv_02.png"}));
            _this._sample[1].add(new W.Image({x:617-242, y:249-237, width:203, height:132, src:"img/img_set_tv_hd.png"}));
            _this._sample[1].add(new W.Span({x:242-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"], 
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _this._sample[1].add(new W.Span({x:617-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"], 
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            
            _this._sample[2] = new W.Div({x:242, y:237, width:591, height:204, display:"none"});
            _comp.add(_this._sample[2]);
            _this._sample[2].add(new W.Image({x:248-242, y:237-237, width:191, height:143, src:"img/img_set_tv_04.png"}));
            _this._sample[2].add(new W.Image({x:242-242, y:249-237, width:203, height:132, src:"img/img_set_tv_hd.png"}));
            _this._sample[2].add(new W.Image({x:623-242, y:255-237, width:191, height:107, src:"img/img_set_tv_02.png"}));
            _this._sample[2].add(new W.Image({x:617-242, y:249-237, width:203, height:132, src:"img/img_set_tv_hd.png"}));
            _this._sample[2].add(new W.Span({x:242-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_3"], 
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _this._sample[2].add(new W.Span({x:617-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"], 
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            
            _this._sample[3] = new W.Div({x:242, y:237, width:591, height:204, display:"none"});
            _comp.add(_this._sample[3]);
            _this._sample[3].add(new W.Image({x:272-242, y:255-237, width:143, height:107, src:"img/img_set_tv_03.png"}));
            _this._sample[3].add(new W.Image({x:266-242, y:249-237, width:155, height:132, src:"img/img_set_tv_sd.png"}));
            _this._sample[3].add(new W.Image({x:647-242, y:255-237, width:143, height:107, src:"img/img_set_tv_05.png"}));
            _this._sample[3].add(new W.Image({x:641-242, y:249-237, width:155, height:132, src:"img/img_set_tv_sd.png"}));
            _this._sample[3].add(new W.Span({x:242-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"], 
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _this._sample[3].add(new W.Span({x:617-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_4"], 
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));

            _this._sample[4] = new W.Div({x:242, y:237, width:591, height:204, display:"none"});
            _comp.add(_this._sample[4]);
            _this._sample[4].add(new W.Image({x:272-242, y:255-237, width:143, height:107, src:"img/img_set_tv_03.png"}));
            _this._sample[4].add(new W.Image({x:266-242, y:249-237, width:155, height:132, src:"img/img_set_tv_sd.png"}));
            _this._sample[4].add(new W.Image({x:647-242, y:268-237, width:143, height:81, src:"img/img_set_tv_05.png"}));
            _this._sample[4].add(new W.Image({x:641-242, y:249-237, width:155, height:132, src:"img/img_set_tv_sd.png"}));
            _this._sample[4].add(new W.Span({x:242-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"],
                textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _this._sample[4].add(new W.Span({x:617-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"],
                textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));

            _this._sample[5] = new W.Div({x:242, y:237, width:591, height:204, display:"none"});
            _comp.add(_this._sample[5]);
            _this._sample[5].add(new W.Image({x:272-242, y:255-237, width:143, height:107, src:"img/img_set_tv_03.png"}));
            _this._sample[5].add(new W.Image({x:266-242, y:249-237, width:155, height:132, src:"img/img_set_tv_sd.png"}));
            _this._sample[5].add(new W.Image({x:623-242, y:255-237, width:191, height:107, src:"img/img_set_tv_05.png"}));
            _this._sample[5].add(new W.Image({x:641-242, y:249-237, width:155, height:132, src:"img/img_set_tv_sd.png"}));
            _this._sample[5].add(new W.Span({x:242-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_2"],
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _this._sample[5].add(new W.Span({x:617-242, y:423-237, width:203, text:W.Texts["screen_ratio_broadcast_guide_5"],
            	textColor:"rgb(255,255,255)", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"center", "letter-spacing":"-0.8px"}));
            



            _comp.add(new W.Span({x:245-50, y:398, width:300, text:W.Texts["screen_ratio_broadcast_normal"], textColor:"rgb(131,122,119)", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _comp.add(new W.Span({x:620-50, y:398, text:W.Texts["screen_ratio_broadcast_hd"], width:300, textColor:"rgb(131,122,119)", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"center", "letter-spacing":"-0.8px"}));

            _comp.add(new W.Span({x:1050-100, y:282-15, text:W.Texts["screen_ratio_status"], width:200, textColor:"rgb(131,122,119)", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _comp._currentRatioText = new W.Span({x:1050-100, y:308-15, width:200, text:"", textColor:"rgb(237,168,2)",
                fontFamily:"RixHeadB", "font-size":"22px", textAlign:"center", "letter-spacing":"-1.0px"});
            _comp.add(_comp._currentRatioText);
                
            _this.box = [], _comp._box = [];
            _this.box[0] = new Box();
            _comp._box[0] = _this.box[0].getComp({x:159, y:460, width:244, boldText:"16:9", text:W.Texts["screen_ratio_btn_wide"]});
            _comp.add(_comp._box[0]);
            _this.box[1] = new Box();
            _comp._box[1] = _this.box[1].getComp({x:409, y:460, width:244, boldText:"16:9", text:W.Texts["screen_ratio_btn_standard"]});
            _comp.add(_comp._box[1]);
            _this.box[2] = new Box();
            _comp._box[2] = _this.box[2].getComp({x:659, y:460, width:244, boldText:"16:9", text:W.Texts["screen_ratio_btn_zoom"]});
            _comp.add(_comp._box[2]);
            _this.box[3] = new Box();
            _comp._box[3] = _this.box[3].getComp({x:159, y:530, width:244, boldText:"4:3", text:W.Texts["screen_ratio_btn_all"]});
            _comp.add(_comp._box[3]);
            _this.box[4] = new Box();
            _comp._box[4] = _this.box[4].getComp({x:409, y:530, width:244, boldText:"4:3", text:W.Texts["screen_ratio_btn_standard"]});
            _comp.add(_comp._box[4]);
            _this.box[5] = new Box();
            _comp._box[5] = _this.box[5].getComp({x:659, y:530, width:244, boldText:"4:3", text:W.Texts["screen_ratio_btn_center"]});
            _comp.add(_comp._box[5]);

        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            // 1: 16:9 표준, 2: 16:9 와이드, 3: 16:9 줌, 4: 4:3 표준, 5: 4:3 전체, 6: 4:3 중앙
            if(_data && _data.data) {
                selectedIndex = index = _data.data - 1;
            }

            _this.box[index].setFocus();
            _this.box[index].setSelected();
            var ratioText = "";
            if(selectedIndex == 0) ratioText = "16:9 " + W.Texts["screen_ratio_btn_wide"];
            else if(selectedIndex == 1) ratioText = "16:9 " + W.Texts["screen_ratio_btn_standard"];
            else if(selectedIndex == 2) ratioText = "16:9 " + W.Texts["screen_ratio_btn_zoom"];
            else if(selectedIndex == 3) ratioText = "4:3 " + W.Texts["screen_ratio_btn_all"];
            else if(selectedIndex == 4) ratioText = "4:3 " + W.Texts["screen_ratio_btn_standard"];
            else if(selectedIndex == 5) ratioText = "4:3 " + W.Texts["screen_ratio_btn_center"];
            _comp._currentRatioText.setText(ratioText);
            
            _this._sample[index].setStyle({display:"block"});
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                    	_this._sample[index].setStyle({display:"none"});
                        if(index%3 == 2) {
                            _this.box[index].unFocus();
                            mode = MODE_TYPE.BTN;
                            _this.btn[btnIndex].setFocus();
                        } else {
                            _this.box[index].unFocus();
                            _this.box[++index].setFocus();
                        }
                    	_this._sample[index].setStyle({display:"block"});
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index%3 != 0) {
                        	_this._sample[index].setStyle({display:"none"});
                            _this.box[index].unFocus();
                            _this.box[--index].setFocus();
                        	_this._sample[index].setStyle({display:"block"});
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        mode = MODE_TYPE.BOX;
                        _this.box[index].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        if(index>2) {
                        	_this._sample[index].setStyle({display:"none"});
                            _this.box[index].unFocus();
                            index -= 3;
                            _this.box[index].setFocus();
                        	_this._sample[index].setStyle({display:"block"});
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                        if(index<3) {
                        	_this._sample[index].setStyle({display:"none"});
                            _this.box[index].unFocus();
                            index += 3;
                            _this.box[index].setFocus();
                        	_this._sample[index].setStyle({display:"block"});
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[selectedIndex].unSelected();
                        selectedIndex = index;
                        _this.box[selectedIndex].setSelected();

                        _this.box[index].unFocus();
                        mode = MODE_TYPE.BTN;
                        _this.btn[btnIndex].setFocus();
                    } else {
                        if(btnIndex == 0) {
                            saveCallback(true, selectedIndex + 1);
                        } else {
                            saveCallback(false);
                        }
                    }
                    break;
                case W.KEY.BACK:
                    saveCallback(false);
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
            }
        }
        this.componentName = "ScreenRatio";
    }
    return ScreenRatio;
});