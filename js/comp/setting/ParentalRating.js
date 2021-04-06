/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button", "comp/setting/Box"], function(util, Templete, Button, Box) {
    function ParentalRating() {
        var _this = this;

        var mode = 0;

        var index = [0,0];
        var btnIndex = 0;
        var selectedIndex = [0,0];
        var boxIndex = 0;
        var _comp;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["parental_rating_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:378, text:W.Texts["save"]});
            _comp.add(_comp._btn[0]);
            _this.btn[1] = new Button();
            _comp._btn[1] = _this.btn[1].getComp({x:988, y:426, text:W.Texts["cancel"]});
            _comp.add(_comp._btn[1]);

            _comp.add(new W.Div({text:W.Texts["parental_rating_title"], x:159, y:240, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM",
                "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
            //_comp.add(new W.Div({text:W.Texts["parental_rating_guide"], x:159, y:274, width:500, textColor:"rgb(84, 70, 66)", fontFamily:"RixHeadL",
            //    "font-size":"18px", textAlign:"left", "letter-spacing":"-0.8px"}));
            _comp.add(new W.Div({text:W.Texts["parental_rating_guide2"], x:159, y:297, width:700, textColor:"rgb(84, 70, 66)", fontFamily:"RixHeadL",
                "font-size":"18px", textAlign:"left", "letter-spacing":"-0.8px"}));

            _this.box = [[],[]], _comp._box = [[],[]];
            _this.box[0][0] = new Box();
            _comp._box[0][0] = _this.box[0][0].getComp({x:159, y:328, width:144, text:W.Texts["no_limit"]});
            _comp.add(_comp._box[0][0]);
            _this.box[0][1] = new Box();
            _comp._box[0][1] = _this.box[0][1].getComp({x:309, y:328, width:144, text:W.Texts["parental_rating_under"].replace("19", "19")});
            _comp.add(_comp._box[0][1]);
            _this.box[0][2] = new Box();
            _comp._box[0][2] = _this.box[0][2].getComp({x:459, y:328, width:144, text:W.Texts["parental_rating_under"].replace("19", "15")});
            _comp.add(_comp._box[0][2]);
            _this.box[0][3] = new Box();
            _comp._box[0][3] = _this.box[0][3].getComp({x:609, y:328, width:144, text:W.Texts["parental_rating_under"].replace("19", "12")});
            _comp.add(_comp._box[0][3]);
            _this.box[0][4] = new Box();
            _comp._box[0][4] = _this.box[0][4].getComp({x:759, y:328, width:144, text:W.Texts["parental_rating_under"].replace("19", "7")});
            _comp.add(_comp._box[0][4]);

            if(W.StbConfig.cugType != "accommodation"){
            	_comp.add(new W.Div({x:159, y:407, width:743, height:1, color:"#837A77", opacity:0.25}));

                _comp.add(new W.Div({text:W.Texts["parental_rating_methode"], x:159, y:428, width:300, textColor:"#FFFFFF", opacity:0.75, fontFamily:"RixHeadM",
                    "font-size":"20px", textAlign:"left", "letter-spacing":"-1.0px"}));
                var texts = W.Texts["parental_rating_methode_guide"].split("^");
                _comp.add(new W.Div({text:texts[0], x:161, y:458, width:800, textColor:"rgb(84, 70, 66)", fontFamily:"RixHeadL", "font-size":"18px",
                    textAlign:"left", "letter-spacing":"-0.8px"}));
                _comp.add(new W.Div({text:texts[1], x:161, y:480, width:800, textColor:"rgb(84, 70, 66)", fontFamily:"RixHeadL", "font-size":"18px",
                    textAlign:"left", "letter-spacing":"-0.8px"}));
                _comp.add(new W.Div({text:W.Texts["parental_rating_methode_guide2"], x:161, y:502, width:800, textColor:"rgb(84, 70, 66)", fontFamily:"RixHeadL",
                    "font-size":"18px", textAlign:"left", "letter-spacing":"-0.8px"}));

                _this.box[1][0] = new Box();
                _comp._box[1][0] = _this.box[1][0].getComp({x:159, y:535, width:244, text:W.Texts["parental_rating_methode_button1"]});
                _comp.add(_comp._box[1][0]);
                _this.box[1][1] = new Box();
                _comp._box[1][1] = _this.box[1][1].getComp({x:409, y:535, width:244, text:W.Texts["parental_rating_methode_button2"]});
                _comp.add(_comp._box[1][1]);
                _this.box[1][2] = new Box();
                _comp._box[1][2] = _this.box[1][2].getComp({x:659, y:535, width:244, text:W.Texts["parental_rating_methode_button3"]});
                _comp.add(_comp._box[1][2]);
            }
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            if(_data && _data.data) {
                selectedIndex[0] = index[0] = _data.data.rating;
                selectedIndex[1] = index[1] = _data.data.adultMenu;
                if(W.StbConfig.cugType != "accommodation"){
	                if(selectedIndex[0] == 0){
                        _comp._box[1][0].setStyle({opacity:1});
	                }else{
                        _comp._box[1][0].setStyle({opacity:0.5});
	                	if(selectedIndex[1] == 0){
	                        selectedIndex[1] = index[1] = 1;
	                	}
	                }
                }
            }

            _this.box[0][index[0]].setSelected();
            if(W.StbConfig.cugType == "accommodation"){
            	selectedIndex[1] = index[1] = 1;
            }else{
            	_this.box[1][index[1]].setSelected();
            }
            _this.box[boxIndex][index[boxIndex]].setFocus();
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index[boxIndex] == (boxIndex==0?4:2)) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            mode = MODE_TYPE.BTN;
                            _this.btn[btnIndex].setFocus();
                        } else {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            _this.box[boxIndex][++index[boxIndex]].setFocus();
                        }
                    } else {

                    }
                    break;
                case W.KEY.LEFT:
                    if(mode == MODE_TYPE.BOX) {
                        if(index[boxIndex] != 0) {
                        	if(boxIndex == 1 && selectedIndex[0] > 0 && index[1] == 1){
                        		//skip
                            }else{
                        		_this.box[boxIndex][index[boxIndex]].unFocus();
                                _this.box[boxIndex][--index[boxIndex]].setFocus();
                            }
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        mode = MODE_TYPE.BOX;
                        _this.box[boxIndex][index[boxIndex]].setFocus();
                    }
                    break;
                case W.KEY.UP:
                    if(mode == MODE_TYPE.BOX) {
                        if(boxIndex == 1) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            boxIndex = 0;
                            index[boxIndex] = selectedIndex[boxIndex];
                            _this.box[boxIndex][index[boxIndex]].setFocus();
                        }
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.DOWN:
                    if(mode == MODE_TYPE.BOX) {
                    	if(W.StbConfig.cugType != "accommodation"){
                            if(boxIndex == 0) {
                                _this.box[boxIndex][index[boxIndex]].unFocus();
                                boxIndex = 1;
                                if(selectedIndex[0] > 0){
                                	if(selectedIndex[1] == 0){
                                		selectedIndex[1] = 1;
                                	}
                                }
                                index[boxIndex] = selectedIndex[boxIndex];
                                _this.box[boxIndex][index[boxIndex]].setFocus();
                            }
                    	}
                    } else {
                        _this.btn[btnIndex].unFocus();
                        btnIndex = ++btnIndex%2;
                        _this.btn[btnIndex].setFocus();
                    }
                    break;
                case W.KEY.ENTER:
                    if(mode == MODE_TYPE.BOX) {
                        _this.box[boxIndex][selectedIndex[boxIndex]].unSelected();
                        selectedIndex[boxIndex] = index[boxIndex];
                        _this.box[boxIndex][selectedIndex[boxIndex]].setSelected();
                        if(boxIndex == 0) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            if(W.StbConfig.cugType == "accommodation"){
                            	mode = MODE_TYPE.BTN;
                                _this.btn[btnIndex].setFocus();
                            }else{
                                boxIndex = 1;
                                if(selectedIndex[0] > 0){
                                	_comp._box[1][0].setStyle({opacity:0.5});
                                	if(selectedIndex[1] == 0){
                                		_this.box[boxIndex][selectedIndex[boxIndex]].unSelected();
                                		selectedIndex[1] = 1;
                                        _this.box[boxIndex][selectedIndex[boxIndex]].setSelected();
                                	}
                                }else{
                                	_comp._box[1][0].setStyle({opacity:1});
                                }
                                
                                index[boxIndex] = selectedIndex[boxIndex];
                                _this.box[boxIndex][index[boxIndex]].setFocus();
                            }
                        } else if(boxIndex == 1) {
                            _this.box[boxIndex][index[boxIndex]].unFocus();
                            mode = MODE_TYPE.BTN;
                            _this.btn[btnIndex].setFocus();
                        }
                    } else {
                        if(btnIndex == 0) {
                            saveCallback(true, {rating : selectedIndex[0], adultMenu : selectedIndex[1]});
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
        this.componentName = "ParentalRating";
    }
    return ParentalRating;
});