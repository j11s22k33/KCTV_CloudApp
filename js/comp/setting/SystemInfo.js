/**
 * Created by yj.yoon on 2018-03-19.
 */
W.defineModule(["mod/Util", "comp/setting/Templete", "comp/setting/Button"], function(util, Templete, Button) {
    function SystemInfo() {
        var _this = this;

        var mode = 0;

        var index = 0;
        var btnIndex = 0;
        var _comp;

        var data;

        var saveCallback;

        var MODE_TYPE = Object.freeze({BOX:0, BTN:1});

        var create = function(title){
            mode = MODE_TYPE.BOX;
            _comp = new W.Div({});
            _this.templete = new Templete();
            _comp._templete = _this.templete.getComp({title:title, desc:W.Texts["system_info_guide"]});
            _comp.add(_comp._templete);

            _this.btn = [], _comp._btn = [];
            _this.btn[0] = new Button();
            _comp._btn[0] = _this.btn[0].getComp({x:988, y:402, text:W.Texts["ok"]});
            _comp.add(_comp._btn[0]);
            _this.btn[0].setFocus();


            _this.box = new W.TextBox({id:"messagebox", line:"12", x:159, y:247, width:744, height:336, fontSize:16, lineHeight:"28px",
                textColor:"rgba(84,70,66,1)", opacity:1, fontFamily:"RixHeadL", "font-size":"19px", textAlign:"left", "letter-spacing":"-0.95px"});
            _comp._box = _this.box;
            _comp.add(_comp._box);

            _comp._scroll = new W.Div({x:948, y: 227, width:3, height:0, color:"#837A77"});
            _comp.add(_comp._scroll);
        };

        this.getComp = function(_saveCallback, title) {
            saveCallback = _saveCallback;
            if(!_comp) create(title);
            return _comp;
        };

        this.setData = function(_data) {
            // 1: 5초, 2: 3초, 3: 사용 안함
            if(_data && _data.data) {
                //_comp._box.setText(_data.data);
                var infoString = "";
                for(var key in _data.data) {
                    infoString += key + ": " + _data.data[key] + "\n";
                }
                infoString += "Home Version: " + W.Config.UI_VERSION + " (" + W.UI_UPDATE_DATE + ")";
                _comp._box.setText(infoString);

                setTimeout(function(){
                	if (_this.box.getTotalPage() > 1) {
                		_comp._scroll.setStyle({height:391/_this.box.getTotalPage(), y:227+(391/_this.box.getTotalPage())*(_this.box.pageNo)});
                	}else{
                		_comp._scroll.setStyle({display:"none"});
                	}
                });
            }
        };

        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                    break;
                case W.KEY.UP:
                	if (_this.box.getTotalPage() > 1) {
                        _this.box.pageUp();
                        _comp._scroll.setStyle({y:227+(391/_this.box.getTotalPage())*(_this.box.pageNo)});
                    }
                    break;
                case W.KEY.DOWN:
                	if (_this.box.getTotalPage() > 1) {
                        _this.box.pageDown();
                        _comp._scroll.setStyle({y:227+(391/_this.box.getTotalPage())*(_this.box.pageNo)});
                    }
                    break;
                case W.KEY.ENTER:
                	saveCallback(false);
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
        this.componentName = "SystemInfo";
    }
    return SystemInfo;
});