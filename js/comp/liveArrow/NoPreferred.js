W.defineModule(["mod/Util", "comp/setting/Button"], function(util, Button) {
    function NoPreferred() {
        var _this = this;

        var backCallbackFunc;
        var _comp;

        var create = function(){
            _comp = new W.Div({x:57-42, y:114-113});

            _comp.add(new W.Div({x:0, y:0, color:"#FFFFFF", opacity:0.07, width:477, height:1}));
            _comp.add(new W.Div({x:185-57, y:327-114, width:350, height:27, text:W.Texts["no_fav_channel"], textColor:"#FFFFFF", opacity:1, fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left", "letter-spacing":"0.22px"}));

            var registFavGuide = W.Texts["regist_fav_guide2"].split("^");
            
            _comp.add(new W.Div({x:309-125-57, y:364-114, width:250, height:21, text:registFavGuide[0], textColor:"#B5B5B5", opacity:0.75, fontFamily:"RixHeadL", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px"}));
            _comp.add(new W.Div({x:309-125-57, y:388-114, width:250, height:21, text:registFavGuide[1], textColor:"#B5B5B5", opacity:0.75, fontFamily:"RixHeadL", "font-size":"16px", textAlign:"center", "letter-spacing":"-0.8px"}));

            _this.btn = new Button();
            _comp._btn = _this.btn.getComp({x:248-57, y:436-114, text:W.Texts["regist_fav_ch"]});
            _this.btn.setFocus();
            _comp.add(_comp._btn);
        };

        var setActive = function() {
            _this.isActive = true;
        };

        var deActive = function() {
            _this.isActive = false;
        };

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    return true;
                    break;
                case W.KEY.LEFT:
                    return false;
                    break;
                case W.KEY.UP:
                    return true;
                    break;
                case W.KEY.DOWN:
                    return true;
                    break;
            }
        };


        this.setPage = function(idx, isForced) {
        }

        this.getPageIdx = function() {
        };

        this.getTotalPage = function() {
        }

        this.setFocus = function(idx) {
        };

        this.unFocus = function(idx) {
        };

        this.unFocusAll = function() {
        };

        this.setActive = function() {
        };

        this.deActive = function() {
        };

        this.getComp = function() {
            if(!_comp) create();
            return _comp;
        };
        this.operate = function(event) {
            W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

            switch (event.keyCode) {
                case W.KEY.RIGHT:
                case W.KEY.LEFT:
                case W.KEY.UP:
                case W.KEY.DOWN:
                    return operateList(event);
                case W.KEY.ENTER:
                    W.SceneManager.startScene({
                        sceneName:"scene/setting/SettingScene",
                        backState:W.SceneManager.BACK_STATE_DESTROYALL,
                        param:{targetId : "CC1001"}
                    });
                    break;
                case W.KEY.BACK:
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
                case W.KEY.KEY_OPTION:
                    break;
            }

        }
    }
    return NoPreferred;
});