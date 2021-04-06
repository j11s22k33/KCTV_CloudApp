W.defineModule("comp/Scroll", [ "mod/Util"], function(util) {
    function Scroll(type, data) {
        var _this;
        var log = {
            info : function(txt){
                if(W.Config.IS_LOG)
                    W.log.info("[Scroll] " + txt);
            }
        };
        var _comp;
        var _outerComp;

        var index = 0;
        var curPageIdx = 0;
        var totalPage;
        var callback;

        var create = function(_totalPage, _initialPageIdx, _callback){
            totalPage = _totalPage;
            curPageIdx = _initialPageIdx;
            callback = _callback;

            _outerComp = new W.Div({x:0,y:0});
            _comp = new W.Div({x:0, y:-46, width:36, height:273});

            _comp._firstPage = new W.Div({text:"1", x:0, y:0, width:35, height:35, lineHeight:"35px", textColor:"#837A77", opacity:0.3,
                fontFamily:"RixHeadB", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px"});
            _comp.add(_comp._firstPage);
            _comp._lastPage = new W.Div({text:totalPage, x:0, y:236, width:35, height:35, lineHeight:"35px", textColor:"#837A77", opacity:0.3,
                fontFamily:"RixHeadB", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px"});
            _comp.add(_comp._lastPage);

            _comp._line = new W.Div({x:17, y:35, width:1, height:201, color:"#837A77", opacity:0.3});
            _comp.add(_comp._line);

            _comp._focusArea = new W.Div({x:0, y:0, width:35, height:35});
            _comp._focusArea._normal = new W.Div({x:0, y:0, width:35, height:35, lineHeight:"35px", text:curPageIdx+1, textColor:"#000000",
                fontFamily:"RixHeadB", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", backgroundImage:"url('img/scr_d.png')"});
            _comp._focusArea.add(_comp._focusArea._normal);
            _comp._focusArea._focus = new W.Div({x:0, y:0, width:35, height:35, lineHeight:"35px", text:curPageIdx+1, textColor:"#FFFFFF",
                fontFamily:"RixHeadB", "font-size":"18px", textAlign:"center", "letter-spacing":"-0.9px", backgroundImage:"url('img/scr_f.png')", display:"none"});
            _comp._focusArea.add(_comp._focusArea._focus);
            _comp.add(_comp._focusArea);
            _outerComp.add(_comp);
        };

        var setFocus = function() {
            _comp._firstPage.setOpacity(1);
            _comp._lastPage.setOpacity(1);
            _comp._line.setOpacity(0.5);
            _comp._focusArea._normal.setDisplay("none");
            _comp._focusArea._focus.setDisplay("block");
        };

        var unFocus = function() {
            _comp._firstPage.setOpacity(0.5);
            _comp._lastPage.setOpacity(0.5);
            _comp._line.setOpacity(0.3);
            _comp._focusArea._normal.setDisplay("block");
            _comp._focusArea._focus.setDisplay("none");
        };

        var setActive = function() {
            _outerComp.setDisplay("block");
        };

        var deActive = function() {
            _outerComp.setDisplay("none");
        };

        var setPage = function(idx, needCallback) {
            if(curPageIdx == idx) return;
            if(idx > totalPage-1) curPageIdx = totalPage-1;
            else if(idx < 0) curPageIdx = 0;
            else curPageIdx = idx;

            var _y = 0; //height range 0~140

            if(idx == 0) {
                _y = 0;
            } else if(idx == totalPage-1) {
                _y = 236;
            } else {
                if(totalPage > 10) {
                    var yGap = 195/7;
                    if(curPageIdx < 5) {
                        _y = (curPageIdx-1) * yGap;
                    } else if(curPageIdx > totalPage-4) {
                        _y = (8 - (totalPage-1-(curPageIdx-1))) * yGap;
                    } else {
                        _y = 4 * yGap;
                    }
                    _y+=35;
                } else if(totalPage > 4){
                    var yGap = 166/(totalPage-3);
                    _y = (curPageIdx-1) * yGap;
                    _y+=35;
                } else {
                    _y = 238/(totalPage-1) * (curPageIdx);
                }
            }

            _comp._focusArea.setY(_y);
            _comp._focusArea._normal.setText(curPageIdx+1);
            _comp._focusArea._focus.setText(curPageIdx+1);
            if(needCallback && callback) callback(curPageIdx);
        };

        var increaseIndex = function() {
            if(curPageIdx < totalPage-1) {
                setPage(curPageIdx+1, true);
            }/* else if(curPageIdx == totalPage-1) {
                setPage(0, true);
            }*/
        }
        var decreaseIndex = function() {
            if(curPageIdx > 0) {
                setPage(curPageIdx-1, true);
            }/* else if(curPageIdx == 0) {
                setPage(totalPage-1, true);
            }*/
        }

        this.getComp = function(_totalPage, _initialPageIdx, _callback) {
            if(!_outerComp) create(_totalPage, _initialPageIdx, _callback);
            return _outerComp;
        };

        this.setFocus = function() {
            setFocus();
        };

        this.unFocus = function() {
            unFocus();
        }

        this.setActive = function() {
            setActive();
        };

        this.deActive = function() {
            deActive();
        }

        this.setPage = function(idx, needCallback) {
            setPage(idx, needCallback);
        }

        this.increaseIndex = function() {
            increaseIndex();
        }

        this.decreaseIndex = function() {
            decreaseIndex();
        }
    }

    return Scroll;
});