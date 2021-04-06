/**
 * @fileOverview (created on 15. 5. 26) Provides information about the entire file.
 *
 * Kids3depthList
 *
 * @class Kids3depthList
 * @extends W.Scene
 * @constructor
 * @author freelife
 * Copyright (c) 1997-2015 Alticast, Inc. All rights reserved.
 */
/* global W */
W.defineModule(['comp/kids/Poster', 'comp/kids/Circle', 'comp/kids/Keyword', "comp/CouponInfo"],
    function (Poster, Circle, Keyword, couponInfoComp) {
        'use strict';

        var _thisScene = "Kids3depthList";

        var backCallbackFunc;
        var mode = 0;
        var tops = [465, 255, 0];
        var opacity = [1, 1, 1];
        var fontSize = [18, 18, 24];
        var yPos = [72, 72, 55];

        var listHeight = [306,337,337,337,306,223];
        var rowCount = [4,5,5,5,4,3];
        var rowWidth = [210,180,180,180,210,264];

        var _comp;

        var _this;

        var couponInfo = couponInfoComp.getNewComp(true);

        var changeY = function(){
            W.log.info("changeY mode == " + mode);
            W.Util.setStyle(_comp, {y:tops[mode], opacity : opacity[mode]});
        };

        W.log.info("### Initializing " + _thisScene + " scene ###");

        var SAMPLE_DATA = {};

        SAMPLE_DATA.KIDS = [	//type 0 : character, 1 : poster-no see more, 2 : poster-have see more, 3: movies, 4 : channel, 5 : keyword
            {
                type: 0, title: "인기 캐릭터관",
                child: [
                    {id: 0, logo: "img/kids_cha_sample_01.png", title: "미니언즈"},
                    {id: 1, logo: "img/kids_cha_sample_02.png", title: "핑크퐁"},
                    {id: 2, logo: "img/kids_cha_sample_03.png", title: "꼬마버스 타요"},
                    {id: 3, logo: "img/kids_cha_sample_04.png", title: "코코몽과 친구들"},
                    {id: 4, logo: "img/kids_cha_sample_05.png", title: "뽀롱뽀롱 뽀로로"},
                    {id: 5, logo: "img/kids_cha_sample_06.png", title: "레인보우 루비"},
                ]
            },
            {
                type: 2, title: "최근 시청",
                child: [
                    {id: 0, logo: "img/kids_poster_sample_01.png", title: "메리다와 마법의 숲"},
                    {id: 1, logo: "img/kids_poster_sample_02.png", title: "쿵푸팬더"},
                    {id: 2, logo: "img/kids_poster_sample_03.png", title: "굿 다이노"},
                    {id: 3, logo: "img/kids_poster_sample_04.png", title: "월-E"},
                    {id: 4, logo: "img/kids_poster_sample_05.png", title: "라따뚜이"},
                    {id: 5, logo: "img/kids_poster_sample_06.png", title: "도리를 찾아서"},
                    {id: 0, logo: "img/kids_poster_sample_08.png", title: "쿵푸팬더 : 시크릿 오브 더 퓨리어스 파이브"},
                    {id: 1, logo: "img/kids_poster_sample_09.png", title: "발레리나"},
                    {id: 2, logo: "img/kids_poster_sample_10.png", title: "인사이드 아웃"},
                    {id: 3, logo: "img/kids_poster_sample_11.png", title: "정글북"},
                    {id: 4, logo: "img/kids_poster_sample_12.png", title: "라이온 킹"},
                    {id: 5, logo: "img/kids_poster_sample_13.png", title: "도리를 찾아서"},
                ]
            },
            {
                type: 5, title: "키즈 메뉴",
                child : [
                    {id: 0, title:"키즈 · 애니 TOP 50"},
                    {id: 1, title:"슈퍼키즈 통합 월정액"},
                    {id: 2, title:"'드림웍스' KCTV 독점 런칭"},
                    {id: 3, title:"슈퍼키즈 EBS 키즈 월정액"},
                    {id: 0, title:"키즈 · 애니 TOP 50"},
                    {id: 1, title:"슈퍼키즈 통합 월정액"},
                    {id: 2, title:"'드림웍스' KCTV 독점 런칭"},
                    {id: 3, title:"슈퍼키즈 EBS 키즈 월정액"},
                ]
            },
            {
                type: 2, title: "키즈 인기 콘텐츠",
                child: [
                    {id: 0, logo: "img/kids_poster_sample_08.png", title: "쿵푸팬더 : 시크릿 오브 더 퓨리어스 파이브"},
                    {id: 1, logo: "img/kids_poster_sample_09.png", title: "발레리나"},
                    {id: 2, logo: "img/kids_poster_sample_10.png", title: "인사이드 아웃"},
                    {id: 3, logo: "img/kids_poster_sample_11.png", title: "정글북"},
                    {id: 4, logo: "img/kids_poster_sample_12.png", title: "라이온 킹"},
                    {id: 5, logo: "img/kids_poster_sample_13.png", title: "도리를 찾아서"},
                    {id: 0, logo: "img/kids_poster_sample_01.png", title: "메리다와 마법의 숲"},
                    {id: 1, logo: "img/kids_poster_sample_02.png", title: "쿵푸팬더"},
                    {id: 2, logo: "img/kids_poster_sample_03.png", title: "굿 다이노"},
                    {id: 3, logo: "img/kids_poster_sample_04.png", title: "월-E"},
                    {id: 4, logo: "img/kids_poster_sample_05.png", title: "라따뚜이"},
                    {id: 5, logo: "img/kids_poster_sample_06.png", title: "도리를 찾아서"},
                ]
            },
            {
                type: 4, title: "키즈 채널관",
                child: [
                    {id: 0, logo: "img/kids_ch_sample_01.png", title: "투니버스", channelNum: "430"},
                    {id: 1, logo: "img/kids_ch_sample_02.png", title: "핑크퐁", channelNum: "432"},
                    {id: 2, logo: "img/kids_ch_sample_03.png", title: "디즈니 채널", channelNum: "433"},
                    {id: 3, logo: "img/kids_ch_sample_04.png", title: "챔프", channelNum: "435"},
                    {id: 4, logo: "img/kids_ch_sample_05.png", title: "BBC Cbeebies", channelNum: "436"},
                    {id: 5, logo: "img/kids_ch_sample_06.png", title: "ANIBOX", channelNum: "446"},
                ]
            },
        ];

        var _comp;

        var createList = function () {
            if(!_this.list) {
                var listObj = {};
                listObj.listArray = [];
                listObj._comp = new W.Div({});
            } else {
                var listObj = _this.list;
            }

            var _y = 174;
            var pageHeight = 65; var pageY = 174;
            listObj.pageY = [_y];
            var pageIdx = 0;
            for (var i = 0; i < SAMPLE_DATA.KIDS.length; i++) {
                if (SAMPLE_DATA.KIDS[i].type == 0 || SAMPLE_DATA.KIDS[i].type == 4) {
                    if(!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex+3)) {
                        listObj.listArray[i] = createCircleList(SAMPLE_DATA.KIDS[i], 0);
                        listObj.listArray[i]._comp.setY(_y);
                        listObj.listArray[i]._comp.y = (_y);
                        listObj._comp.add(listObj.listArray[i]._comp);

                        _this.listFocusIndex[i] = 0;
                        _this.listLeftIndex[i] = 0;
                    }
                } else if(SAMPLE_DATA.KIDS[i].type == 5){
                    if(!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex+3)) {
                        listObj.listArray[i] = createKeywordList(SAMPLE_DATA.KIDS[i], 0);
                        listObj.listArray[i]._comp.setY(_y);
                        listObj.listArray[i]._comp.y = (_y);
                        listObj._comp.add(listObj.listArray[i]._comp);

                        _this.listFocusIndex[i] = 0;
                        _this.listLeftIndex[i] = 0;
                    }
                } else {
                    if(!listObj.listArray[i] && (i >= _this.listIndex && i < _this.listIndex+3)) {
                        listObj.listArray[i] = createPosterList(SAMPLE_DATA.KIDS[i], 0);
                        listObj.listArray[i]._comp.setY(_y);
                        listObj.listArray[i]._comp.y = (_y);
                        listObj._comp.add(listObj.listArray[i]._comp);

                        _this.listFocusIndex[i] = 0;
                        _this.listLeftIndex[i] = 0;
                    }
                }
                _y+=listHeight[SAMPLE_DATA.KIDS[i].type];

                if(listObj.listArray[i] && listObj.listArray[i]._comp) {
                    pageHeight += listHeight[SAMPLE_DATA.KIDS[i].type];
                    if(pageHeight > 632) {
                        pageIdx++;
                        listObj.pageY[pageIdx] = listObj.listArray[i]._comp.y;
                        pageHeight = listHeight[SAMPLE_DATA.KIDS[i].type];
                    } else {
                    }

                    listObj.listArray[i].pageIdx = pageIdx;

                    if(i == SAMPLE_DATA.KIDS.length-1) {
                        listObj.pageY[pageIdx] = listObj.listArray[i]._comp.y - (643-listHeight[SAMPLE_DATA.KIDS[i].type]);
                    }
                }
                //comp.addObj("list_" + i, listComp);
            }

            return listObj;
        };

        var checkList = function (i) {
            if (SAMPLE_DATA.KIDS[i].type == 0 || SAMPLE_DATA.KIDS[i].type == 4) {
                createCircleList(SAMPLE_DATA.KIDS[i], _this.listLeftIndex[i], _this.list.listArray[i]);
            } else if(SAMPLE_DATA.KIDS[i].type == 5){
                createKeywordList(SAMPLE_DATA.KIDS[i], _this.listLeftIndex[i], _this.list.listArray[i]);
            } else {
                createPosterList(SAMPLE_DATA.KIDS[i], _this.listLeftIndex[i], _this.list.listArray[i]);
            }
        };

        var createCircleList = function (data, idx, existList) {
            if(existList) {
                var listObj = existList;
            } else {
                var listObj = {};
                listObj.itemArray = [];
                listObj._comp = new W.Div({x:66});
                listObj._comp._inner = new W.Div({x:0,y:0});
                listObj._comp._listTitle = new W.Div({x:0,y:0});
                listObj._comp._listTitle.add(new W.Image({x:51-66, y:416-444, src:"img/kids_title_bg.png"}));
                listObj._comp._listTitle.add(new W.Span({x:60-66, y:400-444, width:500, text:data.title, textColor:"rgba(255,255,255,0.5)", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left"}));
                listObj._comp.add(listObj._comp._listTitle);
                listObj._comp._listTitle_f = new W.Div({x:0,y:0, display:"none"});
                listObj._comp._listTitle_f.add(new W.Span({x:56-66, y:400-444, width:500, text:data.title, textColor:"rgba(0,231,234,1)", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left"}));
                if(data.isPinned) listObj._comp._listTitle_f.add(new W.Image({x:56-66, y:147-181, src:"img/07_title_acc.png"}));
                listObj._comp.add(listObj._comp._listTitle_f);
            }

            for (var i = idx; i < data.child.length && i < idx+6 && i < 20; i++) {
                if(!listObj.itemArray[i]) {
                    listObj.itemArray[i] = new Circle({type:data.type == 0 ? Circle.TYPE.CHARACTER : Circle.TYPE.CHANNEL, data:data.child[i], idx:i});
                    listObj.itemArray[i]._comp = listObj.itemArray[i].getComp();
                    listObj.itemArray[i]._comp.setStyle({x:210*i});
                    listObj._comp._inner.add(listObj.itemArray[i]._comp);
                }
            }

            if (data.child.length > 20 && !listObj._comp._seemore) {
                listObj._comp._seemore = new W.Div({x: 0 + 254 * 20});
                listObj._comp._seemore.add(new W.Image({width: "112px", height: "132px", x: 0, y: 272-236, src:"img/07_see_more.png"}));
                listObj._comp._inner.add(listObj._comp._seemore);
            }
            if(!existList) {
                listObj._comp.add(listObj._comp._inner);
                return listObj;
            }
        };

        var createPosterList = function (data, idx, existList) {
            if(existList) {
                var listObj = existList;
            } else {
                var listObj = {};
                listObj.itemArray = [];
                listObj._comp = new W.Div({x:66});
                listObj._comp._inner = new W.Div({x:0,y:0});
                listObj._comp._listTitle = new W.Div({x:0,y:0});
                listObj._comp._listTitle.add(new W.Image({x:51-66, y:65-109, src:"img/kids_title_bg.png"}));
                listObj._comp._listTitle.add(new W.Span({x:60-66, y:49-109, width:500, text:data.title, textColor:"rgba(255,255,255,0.5)", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left"}));
                listObj._comp.add(listObj._comp._listTitle);
                listObj._comp._listTitle_f = new W.Div({x:0,y:0, display:"none"});
                listObj._comp._listTitle_f.add(new W.Span({x:56-66, y:49-109, width:500, text:data.title, textColor:"rgba(0,231,234,1)", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left"}));
                if(data.isPinned) listObj._comp._listTitle_f.add(new W.Image({x:56-66, y:147-181, src:"img/07_title_acc.png"}));
                listObj._comp.add(listObj._comp._listTitle_f);
            }

            for (var i = idx; i < data.child.length && i < idx+7 && i < (data.type == 1 ? 10 : 20); i++) {
                if(!listObj.itemArray[i]) {
                    listObj.itemArray[i] = new Poster({type:Poster.TYPE.W140, data:data.child[i], idx:i});
                    listObj.itemArray[i]._comp = listObj.itemArray[i].getComp();
                    listObj.itemArray[i]._comp.setStyle({x:180*i});
                    listObj._comp._inner.add(listObj.itemArray[i]._comp);
                }
            }

            if (data.type != 1 && data.child.length > 20 && !listObj._comp._seemore) {
                listObj._comp._seemore = new W.Div({x: 0 + 254 * 20});
                listObj._comp._seemore.add(new W.Image({width: "112px", height: "132px", x: 0, y: 272-236, src:"img/07_see_more.png"}));
                listObj._comp._inner.add(listObj._comp._seemore);
            }
            if(!existList) {
                listObj._comp.add(listObj._comp._inner);
                return listObj;
            }
        };

        var createKeywordList = function (data, idx, existList) {
            if(existList) {
                var listObj = existList;
            } else {
                var listObj = {};
                listObj.itemArray = [];
                listObj._comp = new W.Div({x:66});
                listObj._comp._inner = new W.Div({x:0,y:0});
                listObj._comp._listTitle = new W.Div({x:0,y:0});
                listObj._comp._listTitle.add(new W.Image({x:51-66, y:416-446, src:"img/kids_title_bg.png"}));
                listObj._comp._listTitle.add(new W.Span({x:60-66, y:401-446, width:500, text:data.title, textColor:"rgba(255,255,255,0.5)", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left"}));
                listObj._comp.add(listObj._comp._listTitle);
                listObj._comp._listTitle_f = new W.Div({x:0,y:0, display:"none"});
                listObj._comp._listTitle_f.add(new W.Span({x:56-66, y:401-446, width:500, text:data.title, textColor:"rgba(0,231,234,1)", fontFamily:"RixHeadM", "font-size":"22px", textAlign:"left"}));
                if(data.isPinned) listObj._comp._listTitle_f.add(new W.Image({x:56-66, y:147-181, src:"img/07_title_acc.png"}));
                listObj._comp.add(listObj._comp._listTitle_f);
            }

            for (var i = idx; i < data.child.length && i < idx+5 && i < (data.type == 1 ? 10 : 20); i++) {
                if(!listObj.itemArray[i]) {
                    listObj.itemArray[i] = new Keyword({type:Keyword.TYPE.MENU, data:data.child[i], idx:i});
                    listObj.itemArray[i]._comp = listObj.itemArray[i].getComp();
                    listObj.itemArray[i]._comp.setStyle({x:264*i});
                    listObj._comp._inner.add(listObj.itemArray[i]._comp);
                }
            }

            if (data.type != 1 && data.child.length > 20 && !listObj._comp._seemore) {
                listObj._comp._seemore = new W.Div({x: 0 + 254 * 20});
                listObj._comp._seemore.add(new W.Image({width: "112px", height: "132px", x: 0, y: 272-236, src:"img/07_see_more.png"}));
                listObj._comp._inner.add(listObj._comp._seemore);
            }
            if(!existList) {
                listObj._comp.add(listObj._comp._inner);
                return listObj;
            }
        };

        var createTop = function () {
            var comp = new W.Div({x:0});
            comp.btn = [];

            comp.profile = new W.Div({x:62,y:59});
            comp.profile.add(new W.Image({x:62-62, y:59-59, width:"100px", height:"100px", src:"img/07_profile_acc.png"}));
            comp.profile.character = new W.Image({x:77-62, y:74-59, width:"70px", height:"70px", src:"img/profile_thum20.png"});
            comp.profile.add(comp.profile.character);
            comp.profile.name = new W.Div({x:177-62, y:98-59-24});
            comp.profile.name.add(new W.Span({position:"relative", width:"145px", text:"Christopher", textColor:"rgba(255,175,60,1)", fontFamily:"AxiataMedium", "font-size":"24px", textAlign:"left", "text-overflow": "ellipsis", overflow: "hidden", "white-space": "nowrap"}));
            comp.profile.name.add(new W.Span({position:"relative", text:"'s", textColor:"rgba(255,255,255,1)", fontFamily:"AxiataMedium", "font-size":"24px", textAlign:"left"}));
            comp.profile.add(comp.profile.name);
            comp.profile.add(new W.Span({x:178-62, y: 127-59-20, text:"world", textColor:"rgba(179,179,179,1)", fontFamily:"AxiataMedium", "font-size":"20px", textAlign:"left"}));
            comp.profile.btn = new W.Div({x:165-62, y:147-59, text:"Change Profile", width:"185px", height:"48px", lineHeight:"48px", backgroundImage:"url('img/07_bt_dim.png')", textColor:"rgba(254,254,254,0.8)", fontFamily:"AxiataMedium", "font-size":"16px", textAlign:"center"});
            comp.profile.btn.focus = new W.Div({x:0, y:0, opacity:0, text:"Change Profile", width:"185px", height:"48px", lineHeight:"48px", backgroundImage:"url('img/07_bt_foc.png')", textColor:"rgba(254,254,254,1)", fontFamily:"AxiataMedium", "font-size":"18px", textAlign:"center"});
            comp.profile.btn.add(comp.profile.btn.focus);
            comp.profile.add(comp.profile.btn);
            comp.add(comp.profile);
            comp.btn.push(comp.profile.btn);

            var character = [{image:"img/07_circle_character_02.png", name:"The Octonauts"},
                {image:"img/07_circle_character_03.png", name:"The Octonauts"},
                {image:"img/07_circle_character_10.png", name:"The Octonauts"}];

            comp.character = new W.Div({x:459,y:56});
            comp.character.add(new W.Span({x:459-459, y: 110-56-18, width:"150px", text:"My Favorite", textColor:"rgba(199,199,199,1)", fontFamily:"AxiataMedium", "font-size":"18px", textAlign:"left"}));
            comp.character.add(new W.Span({x:475-459, y: 133-56-18, text:"Character", textColor:"rgba(199,199,199,1)", fontFamily:"AxiataMedium", "font-size":"18px", textAlign:"left"}));
            comp.character.add(new W.Image({x:556-459, y:60-56, width:"23px", height:"23px", src:"img/07_acc01.png"}));
            comp.character.add(new W.Image({x:1144-459, y:71-56, width:"67px", height:"67px", src:"img/07_acc02.png"}));

            comp.character.btn = [];

            for(var i = 0; i < character.length; i++){
                comp.character.btn[i] = new W.Div({x:600-459 + 178*i, y:56-56, width:"150px", height:"150px"});
                comp.character.btn[i].add(new W.Image({x:0, y:0, width:"150px", height:"150px", src:"img/07_circle.png"}));
                comp.character.btn[i].add(new W.Image({x:0, y:0, width:"150px", height:"150px", src:character[i].image}));
                comp.character.btn[i].focus = new W.Div({x:0, y:0, width:"150px", height:"150px", opacity:0});
                comp.character.btn[i].focus.add(new W.Image({x:0, y:0, width:"150px", height:"150px", src:"img/07_list_foc_3.png"}));
                comp.character.btn[i].focus.add(new W.Span({x:0, y:228-56-20, text:character[i].name, width:"150px", textColor:"rgba(254,254,254,1)", fontFamily:"AxiataMedium", "font-size":"18px", textAlign:"center", "text-overflow": "ellipsis", overflow: "hidden", "white-space": "nowrap"}));
                comp.character.btn[i].add(comp.character.btn[i].focus);
                comp.character.add(comp.character.btn[i]);
                comp.btn.push(comp.character.btn[i]);
            }
            comp.add(comp.character);


            return comp;
        };

        return {
            getComp: function(callback) {
                if(callback) backCallbackFunc = callback;
                return _comp;
            },
            show: function() {
                //_comp.setVisible(true);
                W.log.info("Kids3depthList show");

                _comp.setDisplay("block");
            },
            hide: function() {
                _comp.setDisplay("none");
                W.log.info("Kids3depthList hide");
            },
            create: function(callback, param) {
                W.log.info("create !!!!");
                backCallbackFunc = callback;
                _this = this;

                _this.param = param;
                
                _this.listIndex = 0;
                _this.listFocusIndex = [];
                _this.listLeftIndex = [];

                _this.topFocusIndex = 0;

                _this.MODE_TOP = 0;
                _this.MODE_LIST = 1;
                _this.mode = this.MODE_LIST;

                _comp = new W.Div({x:0,y:0,width:1280,height:720});
                _comp._bg = new W.Image({x:0,y:0,width:1280, height:720, src:"img/kid_bg.png", display:"none"});
                _comp.add(_comp._bg);

                _comp._inner = new W.Div({x:0,y:0});
                _comp.add(_comp._inner);
                _comp._inner._couponInfo = couponInfo.getComp(592, 38);
                _comp._inner._couponInfo.setDisplay("none");
                _comp._inner.add(_comp._inner._couponInfo);

                _comp._inner._title = new W.Span({x:56, y:51, width:500, text:"키즈/애니", textColor:"rgba(255,255,255,1)", fontFamily:"RixHeadB", "font-size":"32px", textAlign:"left", "letter-spacing":"-1.6px", display:"none"});
                _comp._inner.add(_comp._inner._title);

                couponInfo.setData();

                _this.list = undefined;
                _this.list = createList();
                _comp._inner._list = _this.list._comp;
                _comp._inner.add(_comp._inner._list);

                _comp.bg_t = new W.Image({x:0,y:0,width:1280,height:78,src:"img/kids_bg_sh_t_width.png"});
                _comp.add(_comp.bg_t);
                _comp.bg_b = new W.Image({x:0,y:560,width:1280,height:160,src:"img/kids_bg_sh_b_width.png"});
                _comp.add(_comp.bg_b);

                _this.setListFocus();

                return _comp;
            },
            changeMode: function(data){
                mode = data;
                changeY();

                if(mode == 2){
                    if(_this.posterList) _this.posterList.setActive();
                    if(_this.scroll) _this.scroll.setActive();

                    if(_this.listMode == "text") {
                        _comp._posterList.setStyle({height:549});
                        _comp._posterList._poster.setStyle({y:0});
                    }
                    _comp._inner._couponInfo.setDisplay("block");
                    _comp._inner._title.setDisplay("block");
                    _comp._bg.setDisplay("block");
                } else {
                    if(_this.posterList) _this.posterList.deActive();
                    if(_this.scroll) _this.scroll.deActive();

                    if(_this.listMode == "text") {
                        _comp._posterList.setStyle({height:299});
                        _comp._posterList._poster.setStyle({y:-97});
                    }
                    _comp._inner._couponInfo.setDisplay("none");
                    _comp._inner._title.setDisplay("none");
                    _comp._bg.setDisplay("none");
                }
            },
            hasList: function(){
            },
            operate: function (evt) {
                W.log.info(this.componentName + " onKeyPressed " + event.keyCode);

                switch (evt.keyCode) {
                    case W.KEY.EXIT:
                    case W.KEY.KEY_ESC:
                        return true;
                    case W.KEY.MENU:
                    case W.KEY.HOME:
                        W.log.info("HOME");
                        return true;
                    case W.KEY.RIGHT:
                        if (this.mode == this.MODE_LIST) {
                            if (this.listFocusIndex[this.listIndex] == 19) {
                                this.showChildTile(this.CHILD_CATALOGUE, SAMPLE_DATA.KIDS[this.listIndex]);
                            } else {
                                this.setListFocus("RIGHT");
                            }
                        } else if (this.mode == this.MODE_TOP) {
                            this.setTopFocus("RIGHT");
                        }
                        break;
                    case W.KEY.LEFT:
                        if (this.mode == this.MODE_LIST) {
                            this.setListFocus("LEFT");
                        } else if (this.mode == this.MODE_TOP) {
                            this.setTopFocus("LEFT");
                        }
                        break;
                    case W.KEY.UP:
                        if (this.mode == this.MODE_LIST) {
                            if(this.listIndex == 0) {
                                this.mode = this.MODE_TOP;
                                this.setTopFocus("UP");
                            } else {
                                this.setListFocus("UP");
                            }
                        } else if (this.mode == this.MODE_TOP) {

                        }
                        break;
                    case W.KEY.DOWN:
                        if (this.mode == this.MODE_LIST) {
                            this.setListFocus("DOWN");
                        } else if (this.mode == this.MODE_TOP) {
                            this.mode = this.MODE_LIST;
                            this.setTopFocus("DOWN");
                            this.setListFocus();
                        }
                        break;
                    case W.KEY.ENTER:
                        if (this.mode == this.MODE_LIST) {
                            //this.ps.animate(_comp, {opacity : 1, scaleX:1, scaleY:1});
                            W.SceneManager.startScene({sceneName:"scene/kids/KidsVodDetailScene", param:{assetId:"2323", type:"S"},});
                            break;
                        } else if (this.mode == this.MODE_TOP) {
                            if (this.mFocusIndex == 0) {
                                this.openKidProfileSwitchPopup();
                            }
                        }

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
                        return true;
                    case W.KEY.BACK:
                        return;
                    default :
                } // end of switch()

                return true;
            },
            setListFocus: function (direction) {
                if (direction && (direction == "UP" || direction == "DOWN")) {

                    if (direction == "DOWN") {
                        if (this.listIndex + 1 > SAMPLE_DATA.KIDS.length - 1) return;
                    } else {
                        if (this.listIndex - 1 < 0) return;
                    }

                    var obj;

                    obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                    obj.unFocus();
                    _this.list.listArray[this.listIndex]._comp._listTitle_f.setDisplay("none");
                    _this.list.listArray[this.listIndex]._comp._listTitle.setDisplay("block");

                    if (direction == "DOWN") {
                        this.listIndex = ++this.listIndex % SAMPLE_DATA.KIDS.length;
                    } else {
                        this.listIndex = (--this.listIndex + SAMPLE_DATA.KIDS.length) % SAMPLE_DATA.KIDS.length;
                    }

                    createList();

                    obj = _this.list.listArray[this.listIndex];

                    if(this.listIndex == 0) {
                        _comp._inner.setY(-_this.list.pageY[obj.pageIdx] + 174);
                    } else {
                        _comp._inner.setY(-_this.list.pageY[obj.pageIdx] + 174 - 65);
                    }

                    obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                    obj.setFocus();
                    _this.list.listArray[this.listIndex]._comp._listTitle_f.setDisplay("block");
                    _this.list.listArray[this.listIndex]._comp._listTitle.setDisplay("none");
                    if(this.listIndex == 0) {
                    } else {
                    }
                } else {
                    if (direction && direction == "RIGHT") {
                        if (SAMPLE_DATA.KIDS[this.listIndex].type == 1) {
                            if (this.listFocusIndex[this.listIndex] + 1 > SAMPLE_DATA.KIDS[this.listIndex].child.length - 1) return;
                        } else {
                            if (this.listFocusIndex[this.listIndex] + 1 > (SAMPLE_DATA.KIDS[this.listIndex].child.length > 19 ? 19 : SAMPLE_DATA.KIDS[this.listIndex].child.length - 1)) return;
                        }
                    } else if (direction) {
                        if (this.listFocusIndex[this.listIndex] - 1 < 0) return;
                    }

                    var obj;
                    if (direction) {
                        obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                        obj.unFocus();

                        if (direction == "RIGHT") {
                            this.listFocusIndex[this.listIndex] = ++this.listFocusIndex[this.listIndex];

                            if(this.listLeftIndex[this.listIndex] + rowCount[SAMPLE_DATA.KIDS[this.listIndex].type] < this.listFocusIndex[this.listIndex]) {
                                this.listLeftIndex[this.listIndex]+=(rowCount[SAMPLE_DATA.KIDS[this.listIndex].type]+1);
                                checkList(this.listIndex);
                            }
                        } else {
                            this.listFocusIndex[this.listIndex] = --this.listFocusIndex[this.listIndex];

                            if(this.listLeftIndex[this.listIndex] > this.listFocusIndex[this.listIndex]) {
                                this.listLeftIndex[this.listIndex]-=(rowCount[SAMPLE_DATA.KIDS[this.listIndex].type]+1);
                                checkList(this.listIndex);
                            }
                        }
                    } else {
                        _this.list.listArray[this.listIndex]._comp._listTitle_f.setDisplay("block");
                        _this.list.listArray[this.listIndex]._comp._listTitle.setDisplay("none");
                    }

                    obj = _this.list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                    obj.setFocus();


                    _this.list.listArray[this.listIndex]._comp._inner.setX(-rowWidth[SAMPLE_DATA.KIDS[this.listIndex].type] * this.listLeftIndex[this.listIndex]);

                }
            },
            setTopFocus: function (direction) {
            	W.log.info("topfocus" + direction);

                if (W.Config.IS_ANI){
                    this.ps.makeGroup(W.Config.ANI_SPEED_300);
                    this.ps.setCurve("expo>");

                    this.ps.animate(_comp.inner.top.btn[this.topFocusIndex].focus, {opacity: 0});
                } else {
                    _comp.inner.top.btn[this.topFocusIndex].focus.setStyle({className : "ani_0"});
                    W.Util.setStyle(_comp.inner.top.btn[this.topFocusIndex].focus, {opacity : 0});
                }

                if (direction == "RIGHT") {
                    this.topFocusIndex = ++this.topFocusIndex % 4;
                } else if(direction == "LEFT") {
                    this.topFocusIndex = (--this.topFocusIndex + 4) % 4;
                }

                if (W.Config.IS_ANI){
                    if(direction != "DOWN")
                        this.ps.animate(_comp.inner.top.btn[this.topFocusIndex].focus, {opacity: 1});

                    if(direction == "UP") {
                        var obj = _comp.inner._list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                        this.ps.animate(obj.focus, {opacity: 0});
                        this.ps.animate(obj.title, {opacity: 1});
                    }

                    this.ps.start();
                    this.ps.reset();
                } else {
                    if(direction != "DOWN") {
                        _comp.inner.top.btn[this.topFocusIndex].focus.setStyle({className : "ani_0"});
                        W.Util.setStyle(_comp.inner.top.btn[this.topFocusIndex].focus, {opacity : 1});
                    }

                    if(direction == "UP") {
                        var obj = _comp.inner._list.listArray[this.listIndex].itemArray[this.listFocusIndex[this.listIndex]];
                        obj.focus.setStyle({className : "ani_0"});
                        W.Util.setStyle(obj.focus, {opacity : 0});
                        obj.title.setStyle({className : "ani_0"});
                        W.Util.setStyle(obj.title, {opacity : 1});
                    }
                }
            },
            openKidProfileSwitchPopup: function () {
                var _this = this;
                var desc = {};
                desc.onConfirm = function (name, img) {
                    __comp.inner.top.name.txt.setText(name + "'S ROOM");
                    __comp.inner.top.name.char.setImage(Rogers.Config.imgPathKids + img);
                    KidsProfileSwitchPopup.hide(true);
                };
                desc.onClose = function () {
                    KidsProfileSwitchPopup.hide();
                };

                KidsProfileSwitchPopup.initialize(this, desc);

            },
            openPinPopup: function () {
                var _this = this;
                var desc = {};
                desc.onConfirm = function () {
                    PinPopup.hide(true, function () {

                        if (_this.isPlayback) {
                            this.playbackKids.hideMenu(true);
                            _this.hidePlayback();
                        }

                        _this.hideAnimate();
                        _this.hide();

                    });

                };
                desc.onClose = function () {
                    PinPopup.hide();
                };

                PinPopup.initialize(this, desc);

            },
            destroy: function() {
                W.log.info("destroy !!!!");
            },
            getMode:function(){
                return mode;
            },
            componentName : "Kids3depthList",
        }
    });
