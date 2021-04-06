W.defineModule(["mod/Util", "comp/liveArrow/Contents"], function(util, Contents) {
    function ContentsList(_contentsData) {
        var _this = this;

        var backCallbackFunc;
        var mode = 0;
        var tops = [402, 188, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];
        var type;
        var posterType;
        var posterGapX, posterGapY;

        var index = 0;
        var _comp;

        var data, bannerData;

        var COLUMN_COUNT = 7;

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        var create = function(){

            data = _contentsData;

            _this.contentsIndex = 0;
            _this.pageIndex = 0;
            _this.isActive = false;
            _comp = new W.Div({x:0,y:0, width:314,height:data.length*136-8});
            _comp._innerDiv = new W.Div({x:0,y:0,width:314,height:data.length*136-8});

            _this.contents = [];
            _comp._contentsComp = [];


            var _x = 0;
            for(var i = 0; i < data.length; i++) {
                _this.contents[i] = new Contents(data[i], i);

                _comp._contentsComp[i] = _this.contents[i].getComp();
                _comp._contentsComp[i].setStyle({y:i*136});

                _comp._innerDiv.add(_comp._contentsComp[i]);
            }
            _comp.add(_comp._innerDiv);
        };

        var unFocus = function(idx) {
            if(_this.contents && _this.contents[idx]) _this.contents[idx].unFocus();
        };

        var setFocus = function(idx) {
            if(_this.contents && _this.contents[idx]) _this.contents[idx].setFocus();
        };

        var unFocusAll = function() {
            if(_this.contents && _this.contents.length > 0) {
                for(var i = 0; i < _this.contents.length; i++) {
                    unFocus(i);
                }
            }
        }

        var setActive = function() {
            _this.isActive = true;
            setFocus(_this.contentsIndex);
        };

        var deActive = function() {
            _this.isActive = false;
            unFocusAll();
        };

        var operateList = function(event) {
            switch (event.keyCode) {
                case W.KEY.RIGHT:
                    return false;
                    break;
                case W.KEY.LEFT:
                    return true;
                    break;
                case W.KEY.UP:
                    unFocus(_this.contentsIndex);
                    if(_this.contentsIndex == 0) {
                        return false;

                    } else {
                        _this.contentsIndex--;
                    }

                    setPage(Math.floor(_this.contentsIndex/4));
                    setFocus(_this.contentsIndex);
                    return true;
                    break;
                case W.KEY.DOWN:
                    unFocus(_this.contentsIndex);
                    if(_this.contentsIndex == _this.contents.length-1) {
                        return false;
                    } else {
                        _this.contentsIndex++;
                    }

                    setPage(Math.floor(_this.contentsIndex/4));
                    setFocus(_this.contentsIndex);
                    return true;
                    break;
            }
        };

        var setPage = function(idx, isForced) {
            if(isForced || _this.getPageIdx() != idx) {
                _this.pageIndex = idx;
                if(isForced) _this.contentsIndex = 0;
                _comp._innerDiv.setY(_this.pageIndex*-500);
            }
        }

        this.getLength = function() {
            return data.length;
        }

        this.setPage = function(idx, isForced) {
            setPage(idx, isForced);
        }

        this.setIdx = function(idx) {
            _this.contentsIndex = idx;
        }

        this.getPageIdx = function() {
            return _this.pageIndex;
        };

        this.getTotalPage = function() {
            return Math.floor((_this.contents.length-1)/4)+1;
        }

        this.setFocus = function(idx) {
            setFocus(idx);
        };

        this.unFocus = function(idx) {
            unFocus(idx);
        };

        this.unFocusAll = function() {
            unFocusAll();
        };

        this.setActive = function() {
            setActive();
        };

        this.deActive = function() {
            deActive();
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
                    break;
                case W.KEY.ENTER:
                    W.LinkManager.action("L", data[_this.contentsIndex].link, undefined, "liveRightContents", "ContentsList");
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
    return ContentsList;
});