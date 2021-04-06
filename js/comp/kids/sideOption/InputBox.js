/**
 * Created by yj.yoon on 2018-03-20.
 */
W.defineModule(["mod/Util", "comp/kids/sideOption/Button"], function(util, Button) {
    function InputBox() {
        var _this = this;

        var _comp;
        
        var onButton = false;

        var create = function(data){
            W.log.info(data)
            _this.type = data.type; //0:password 1:time
            _this.value = data.text ? data.text : "";
            _this.data = data;
            _comp = new W.Div({position:"relative", marginTop:"8px", x:data.x, y:data.y, width:270, height:155});
            _comp.add(new W.Image({x:0, y:0, width:270, height:58, src:"img/kids_op_bt.png"}));
            _comp._focus = new W.Image({x:-1, y:-1, width:270, height:58, src:"img/kids_op_bt_f.png", display:"none"});
            _comp.add(_comp._focus);

            _comp._placeHolder = new W.Div({x:10, y:0, width:248, height:58, text:W.Texts["series_input_guide"],
                textColor:"#4F5C70", "font-size":"16px", "letter-spacing":"-0.8px", lineHeight:"58px", fontFamily:"RixHeadM", textAlign:"center"});
            _comp.add(_comp._placeHolder);
            _comp._text = new W.Div({x:10, y:0, width:248, height:58, textColor:"#FFFFFF", "font-size":"18px",
                "letter-spacing":"-0.8px", lineHeight:"58px", fontFamily:"RixHeadB", textAlign:"center"});
            _comp.add(_comp._text);

            var tmpText = W.Texts["series_total_count_guide"];
            var tmpArr = tmpText.split("@");
            _comp._countText = new W.Div({x:-20, width:306, y:68, "font-size":"20px", textColor:"#000000", fontFamily:"RixHeadM", "letter-spacing":"-1.0px", textAlign:"center"});
            
            var lastEpiNo = 0;
            for(var i=0; i < data.episodeList.length; i++){
            	var epiNo = Number(data.episodeList[i].episodeNum);
            	if(lastEpiNo < epiNo){
            		lastEpiNo = epiNo;
            	}
            }
            
            for(var i=0; i < tmpArr.length; i++){
            	if(tmpArr[i] == "total_count"){
            		_comp._countText._count = new W.Span({text:lastEpiNo, textColor:"#3B78B7", position:"relative", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left"});
                    _comp._countText.add(_comp._countText._count);
            	}else{
            		_comp._countText.add(new W.Span({text:tmpArr[i], position:"relative", fontFamily:"RixHeadL", "font-size":"20px", textAlign:"left"}));
            	}
            }
            _comp.add(_comp._countText);

            _comp._errorText = new W.Div({x:-20, width:306, y:68, "font-size":"20px", textColor:"#E3542E", "letter-spacing":"-1.5px", opacity:0.9, textAlign:"center", display:"none"});
            _comp._errorText.add(new W.Span({text:W.Texts["series_input_guide2"], position:"relative", fontFamily:"RixHeadM", "font-size":"20px", textAlign:"left"}));
            _comp.add(_comp._errorText);


            _this.button = new Button();
            _comp._button = _this.button.getComp({x:56, y:113, text:data.button});
            _comp.add(_comp._button);

            setText();
            _this.focusedFlag = false;
        };

        var setText = function() {
            if(_this.value.length > 0) {
            	var isExist = false;
            	for(var i=0; i < _this.data.episodeList.length; i++){
            		if(_this.value == _this.data.episodeList[i].episodeNum){
            			isExist = true;
            			break;
            		}
            	}
        		_comp._placeHolder.setStyle({display:"none"});
            	if(isExist){
            		_this.button.setAble();
            		_comp._errorText.setStyle({display:"none"});
            		_comp._countText.setStyle({display:"block"});
            	}else{
            		_this.value = "";
            		setText();
            		_this.button.setDisable();
            		_comp._errorText.setStyle({display:"block"});
            		_comp._countText.setStyle({display:"none"});
            	}
            } else {
                _comp._placeHolder.setStyle({display:"block"});
                _comp._errorText.setStyle({display:"none"});
                _comp._countText.setStyle({display:"block"});
                _this.button.setDisable();
            }
            _comp._text.setText(_this.value);
        };

        var setValue = function(data) {
            _this.value = data;
            setText();
        }

        var inputValue = function(data) {
            if(_this.focusedFlag) {
                _this.value = "";
                _this.focusedFlag = false;
            }
            if(_this.value.length < 10) {
                _this.value += data;
                setText();
            }
        };

        var deleteValue = function(length) {
            if(_this.value.length > 0) {
                _this.value = _this.value.substr(0, _this.value.length-1);
                setText();
            }
        };

        var resetValue = function() {
            _this.value = "";
            setText();
        };

        var unFocus = function() {
            if(onButton) {
                _this.button.unFocus();
            } else {
                _comp._placeHolder.setStyle({textColor:"#4F5C70"});
                _comp._focus.setDisplay("none");
                _comp._text.setStyle({textColor:"#B5B5B5", opacity:0.75});
            }
        };

        var setFocus = function(from) {
            if(from) {
                if(from == "UP") {
                    if(_this.button.getAble()) {
                        unFocus();
                        onButton = true;
                        setFocus();
                    } else {
                        unFocus();
                        onButton = false;
                        setFocus();
                    }
                } else {
                    unFocus();
                    onButton = false;
                    setFocus();
                }
            } else {
                _comp._placeHolder.setStyle({textColor:"#4F5C70"});
                if(onButton) {
                    _this.button.setFocus();
                } else {
                    _comp._placeHolder.setStyle({textColor:"#FFFFFF"});
                    _comp._focus.setDisplay("block");
                    _comp._text.setStyle({textColor:"#FFFFFF", opacity:1});
                    _this.focusedFlag = true;
                }
            }
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    return true;
                    break;
                case W.KEY.LEFT:
                    deleteValue(1);
                    return true;
                    break;
                case W.KEY.UP:
                    if(onButton) {
                        unFocus();
                        onButton = false;
                        setFocus();
                        return true;
                    } else {
                        return false;
                    }
                    return true;
                    break;
                case W.KEY.DOWN:
                    if(onButton) {
                        return false;
                    } else {
                        if(_this.button.getAble()) {
                            unFocus();
                            onButton = true;
                            setFocus();
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return true;
                    break;
                case W.KEY.ENTER:
                    if(onButton) {
                    	return false;
                    } else {
                        if(_this.button.getAble()) {
                            unFocus();
                            onButton = true;
                            setFocus();
                        }
                    }
                    return true;
                    break;
                case W.KEY.BACK:
                    return true;
                    break;
                case W.KEY.EXIT:
                    return true;
                    break;
                return true;
            }
        }

        this.setValue = function(_data) {
            setValue(_data);
        };

        this.inputValue = function(_data) {
            inputValue(_data);
        };

        this.deleteValue = function(_length) {
            deleteValue(_length);
        };

        this.resetValue = function() {
            resetValue();
        };

        this.getValue = function() {
            return _this.value;
        };

        this.setFocus = function(from) {
            setFocus(from);
        };

        this.unFocus = function() {
            unFocus();
        };

        this.isOnButton = function() {
            return onButton;
        }

        this.getComp = function(_data) {
            if(!_comp) create(_data);
            return _comp;
        };
    }
    return InputBox;
});