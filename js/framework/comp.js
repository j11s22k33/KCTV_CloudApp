W.define("IComponent", "Class", function(WClass){
	
	var WFloatProperty = W.getClass("FloatProperty");
	
	var _iComponent = W.Class.extend({
		EVENT_POINT_BUTTON_PRESSED : 1024, 
		EVENT_POINT_BUTTON_RELEASED : 2048, 
		EVENT_POINT_BUTTON_DBLCLICK : 4096,
		EVENT_POINT_SCROLL_UP :  8192, 
		EVENT_POINT_SCROLL_DOWN : 16384, 
		EVENT_POINT_SCROLL_LEFT : 32768, 
		EVENT_POINT_SCROLL_RIGHT : 65536, 
		EVENT_POINT_IN : 131072, 
		EVENT_POINT_OUT : 262144, 
		EVENT_POINT_MOVE : 524288, 
		
		PROPERTY_X : 0, 
		PROPERTY_Y : 1, 
		PROPERTY_Z : 2, 
		PROPERTY_SCALE_X : 3, 
		PROPERTY_SCALE_Y : 4, 
		PROPERTY_ROTATION_DEGREE : 6, 
		PROPERTY_OPACITY : 9, 
		PROPERTY_WIDTH : 10, 
		PROPERTY_HEIGHT :11
	});
	
	var IComponent = new _iComponent();
	
	IComponent.properties = {
		x : new WFloatProperty(IComponent.PROPERTY_X),
        y : new WFloatProperty(IComponent.PROPERTY_Y),
        z : new WFloatProperty(IComponent.PROPERTY_Z),
        scaleX : new WFloatProperty(IComponent.PROPERTY_SCALE_X),
        scaleY : new WFloatProperty(IComponent.PROPERTY_SCALE_Y),
        rotationDegree : new WFloatProperty(IComponent.PROPERTY_ROTATION_DEGREE),
        opacity : new WFloatProperty(IComponent.PROPERTY_OPACITY),
        width: new WFloatProperty(IComponent.PROPERTY_WIDTH),
        height: new WFloatProperty(IComponent.PROPERTY_HEIGHT)
	};
	
	IComponent.transStyle = {
			position : "position",
			x : "left",
			y : "top",
			width:"width",
			height:"height",
			opacity:"opacity",
			fontSize : "font-size",
			font : "font-family",
			color: "background-color",
			textColor : "color",
			visible : "visibility",
			transform : "-webkit-transform",
			marginLeft : "margin-left",
			marginTop : "margin-top",
			marginRight : "margin-right",
			marginBottom : "margin-bottom",
			textAlign : "text-align",
			vAlign : "vertical-align",
			bgSrc : "background-image",
			fontWeight : "font-weight",
			lineHeight : "line-height",
			box : "border",
			textOverflow: "textOverflow"
	};
	IComponent.normalStyles = {
			"position" : 1,
			"opacity" : 1,
			"font-family" : 1,
			"background-color" : 1,
			"color" : 1,
			"visibility" : 1,
			"-webkit-transform" : 1,
			"text-align" : 1,
			"font-weight" : 1,
			"veritical-align" : 1,
			"overflow" : 1,
			"line-height" : 1
	};
	IComponent.numericStyles = {
			"width": 1,
			"height": 1,
			"left" : 1,
			"top" : 1,
			"font-size" : 1,
			"margin-left" : 1,
			"margin-top" : 1,
			"margin-right" : 1,
			"margin-bottom" : 1
	};
	IComponent.urlStyles = {
			"background-image": 1
	};
	IComponent.transAttr = {
			"id" : "id",
			"className" : "className",
			"src":"src",
			"text": "textContent",
			"attr":"attr"
	};
	return IComponent;
	
});

W.define('Component', 'Class', function(WClass) {
	
	var IComponent = new W.getClass("IComponent");
	
	/**
	 * Function will get element by id starting from specified node.
	 */
	function _getElementById( dNode, id ) {
		var dResult = null;
		if ( dNode.getAttribute('id') == id )
			return dNode;
		for ( var i in dNode.childNodes ) {
			if ( dNode.childNodes[i].nodeType == 1 ) {
				dResult = _getElementById( dNode.childNodes[i], id );
				if ( dResult != null )
					break;
			}
		}
		return dResult;
	};
	
	function _getElementById_xPath(path){
		return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	};

	var _transStyleName = function(_style) {
		var _newStyleObj = {};
		var _newAttrObj = {};
		var _key;
		for (var key in _style) {
			_key = IComponent.transStyle[key];
			if (_key) {
				if (_key in IComponent.normalStyles)
					_newStyleObj[_key]  = _style[key];
				else if (_key in IComponent.numericStyles) {
					_newStyleObj[_key]  = (_style[key]===""? "": (isNaN(_style[key]) ? _style[key] : _style[key] + "px"));
				}
				else if (_key in IComponent.urlStyles)
					_newStyleObj[_key]  = "url('"+_style[key] + "')";
				else if (_key === "border") {
					_newStyleObj["border"]  = _style[key].width?_style[key].width + "px":"1px";
					_newStyleObj["border-style"]  = _style[key].style?_style[key].style:"solid";
					_newStyleObj["border-color"]  = _style[key].color?_style[key].color:"black";
				}else if(_key === "textOverflow"){
					if(_style[key] === "ellipsis"){
						_newStyleObj["overflow"] = "hidden";
						_newStyleObj["white-space"] = "nowrap";
						_newStyleObj["text-overflow"] = "ellipsis";
					}else
						_newStyleObj["overflow"] = _style[key];
				} else 
					_newStyleObj[_key]  = _style[key];
				
				
			} else {
				_key = IComponent.transAttr[key];
				if (_key) {
					_newAttrObj[_key] = _style[key];
				} else
					_newStyleObj[key]  = _style[key];
			}
		}
		return [_newStyleObj, _newAttrObj];
	};
	
	var _createElement = function(type, id, desc) {
//		W.log.info("_createElement "+ type);
		var e = document.createElement(type);
		if (id) {
			e.setAttribute("id", id);
		}
		if (desc) {
			e.desc = desc;
			
			var newStyle = _transStyleName(desc);

			for (i in newStyle[0]) {
				e.style[i] = newStyle[0][i];
			}
			for (i in newStyle[1]) {
				if (i == "attr")
					e.setAttribute(newStyle[1][i].name, newStyle[1][i].value);
				else
					e[i] = newStyle[1][i];
			}
		}
		return e;
	};
	
	 var _getNumberFromPX = function(input) {
     	try {
     		if (input == undefined || input == null)
     			return 0;
     		
     		if (typeof(input) == "string" &&  input.indexOf("px") > -1)
     			return Number(input.substr(0,input.indexOf("px")));
     		else
     			return input;
     	} catch (err) {
     		return 0;
     	}
     };
     
	var _create = function(_type, _id, _desc) {
		//W.log.info("Component _create");
		return _createElement(_type, _id, _desc);
	};
	
	/**
	 * Represents a UI component
	 * @class W.Component
	 */
	var WComponent = W.Class.extend({
		
		/**
		 * id of element
		 * @attribute id
		 * @type NUMBER
		 */
		
		/**
		 * children of component
		 * @attribute children
		 * @type Object
		 */
		
		init : function(_type, _id, _desc) {
			//W.log.info("Component init");
			this.id = _id;
			//this.desc = _desc;
			this.visible = "";
			this.display = "";
			this.comp = _create(_type, _id, _desc);
			this.pid = W.id++;
			this.children = new W.Hash();
			
			this.storedClassName = _desc.className;
			this.storedStyle = _desc;
			delete this.storedStyle.id;
    		delete this.storedStyle.className;
    		delete this.storedStyle.text;
		},
		
		getClass: function() {
			return WClass;
		},
		
		/**
		 * This method returns css style value of the component element
         * @method getStyle
         * @param {String} _style The parameter to return css value with the parameter.
         * 
         *  **See also:**
         *  {{#crossLink "W.Component/setStyle:method"}}{{/crossLink}},
         */
		getStyle: function(_style){
			
			if (IComponent.transStyle[_style])
				return this.comp.style[IComponent.transStyle[_style]];
			else if (IComponent.transAttr[_style])
				return this.comp[IComponent.transAttr[_style]];
			else
				return this.comp[_style];
		},
		
		/**
		 * This method returns property value off the component element.
		 * @method getPropety
		 * @param {String} _propertyName The paramter to return property value 
		 */
		getProperty : function(_propertyName) {
			return this.comp[_propertyName];
		},
		
		/**
		 * This method apply css style to the component element
         * @method setStyle
         * @param {Object} _style The parameter being style to the component elements. 
         * @param {Integer} duration duration for animation effect
         * 
         * **See also:**
         *  {{#crossLink "W.Component/getStyle:method"}}{{/crossLink}},
         */
		setStyle: function(_style, duration) {
			if (duration == undefined) {
				this.comp.style.webkitTransitionDelay = "";
				this.comp.style.webkitTransitionDuration = "";
			} else {
				this.comp.style.webkitTransitionDelay = "";
				this.comp.style.webkitTransitionDuration = duration+"ms";
			}
			var newStyle = _transStyleName(_style);
			
			for (i in newStyle[0]) {
			    this.comp.style[i] = newStyle[0][i];
			}
			for (i in newStyle[1]) {
				if (i == "id")
					this.id = newStyle[1][i];
				
				if (i == "attr")
					this.comp.setAttribute(newStyle[1][i].name, newStyle[1][i].value);
				else
					this.comp[i] = newStyle[1][i];
			}
		},
		
		/**
		 * This method apply css style to same class name owned component elements in the scene.
         * @method setStyleByClass
         * @param {String} className name of attribute class
         * @param {Object} _style The parameter being style to the component elements. 
         * 
         * **See also:**
         *  {{#crossLink "W.Component/getStyle:method"}}{{/crossLink}},
         */
		setStyleByClass : function(className, _desc) {
			if ("id" in _desc)
				throw new Error("setStyleByClass : ID can not be changed !!!");
			
			var els = this.comp.getElementsByClassName(className);
			//W.log.inspect(els)
			//W.log.info("element count : " + els.length);
			var newStyle = _transStyleName(_desc);

			for( var i=0; i<els.length ; i++) {
				for (key in newStyle[0]) {
				    els[i].style[key] = newStyle[0][key];
				}
				for (key in newStyle[1]) {
					if (i == "attr")
						els[i].setAttribute(newStyle[1][i].name, newStyle[1][i].value);
					else
						els[i][key] = newStyle[1][key];
				}
			}
		},
		
		/**
		 * This method apply a image source to the component element
         * @method setSrc
         * @param {String/Number} value The value is a image source of the element. 
         * 
         */
		setSrc : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"src":value});
		},
		
		
		/**
		 * This method apply a text to the component element
         * @method setText
         * @param {String/Number} value The value is a text of the element. 
         * 
         */
		setText : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"text":value});
		},
		
		/**
		 * This method apply a font size to the component element
         * @method setFontSize
         * @param {String/Number} value The value is a font size of the element. 
         * 
         */
		setFontSize : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"fontSize":value});
		},
		
		/**
		 * This method apply a backgrond color to the component element
         * @method setColor
         * @param {String/Number} value The value is a backgrond color of the element. 
         * 
         */
		setColor : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"color":value});
		},
		
		/**
		 * This method apply a Text Color to the component element
         * @method setTextColor
         * @param {String/Number} value The value is a text color of the element. 
         * 
         */
		setTextColor : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"textColor":value});
		},

		/**
		 * This method apply a left to the component element
         * @method setX
         * @param {String/Number} value The value is a left of the element. 
         * 
         */
		setX : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"x":value});
		},
		
		/**
		 * This method apply a top to the component element
         * @method setY
         * @param {String/Number} value The value is a top of the element. 
         * 
         */
		setY : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"y":value});
		},
		
		/**
		 * This method apply a top to the component element
         * @method setXY
         *  @param {String/Number} X The value is a left of the element. 
         *  @param {String/Number} Y The value is a top of the element.
         * 
         */
		setXY : function(valueX,valueY){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"x":valueX,"y":valueY});
		},
		
		/**
		 * This method apply a visibility to the component element
         * @method setVisible
         * @param {String/Number} value The value is a visibility of the element. 
         * 
         */
		setVisible : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			if (value)
				this.setStyle({"visible":"inherit"});
			else
				this.setStyle({"visible":"hidden"});
		},
		
		/**
		 * This method apply a visibility to the component element
         * @method setOpaticy
         * @param {String/Boolean} value The value is a opacity of the element. 
         * 
         */
		setOpaticy : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"opacity":value});
		},
		setOpacity : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"opacity":value});
		},
		
		/**
		 * This method apply a rotaionDegree to the component element
         * @method setRotaionDegree
         * @param {String/Number} value The value is a rotaionDegree of the element. 
         * 
         */
		setRotaionDegree : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"rotaionDegree":value});
		},
		
		/**
		 * This method apply a marginLeft to the component element
         * @method setMarginLeft
         * @param {String/Number} value The value is a marginLeft of the element. 
         * 
         */
		setMarginLeft : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"marginLeft":value});
		},
		
		/**
		 * This method apply a marginTop to the component element
         * @method setMarginTop
         * @param {String/Number} value The value is a marginTop of the element. 
         * 
         */
		setMarginTop : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"marginTop":value});
		},
		
		/**
		 * This method apply a marginRight to the component element
         * @method setMarginRight
         * @param {String/Number} value The value is a marginRight of the element. 
         * 
         */
		setMarginRight : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"marginRight":value});
		},
		
		/**
		 * This method apply a marginBottom to the component element
         * @method setMarginBottom
         * @param {String/Number} value The value is a marginBottom of the element. 
         * 
         */
		setMarginBottom : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"marginBottom":value});
		},
		
		/**
		 * This method apply a overflow to the component element
         * @method setOverflow
         * @param {String/Number} value The value is a overflow of the element. 
         * 
         */
		setOverflow : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"overflow":value});
		},
		
		/**
		 * This method apply a dataType to the component element
         * @method setDataType
         * @param {String/Number} value The value is a dataType of the element. 
         * 
         */
		setDataType : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"dataType":value});
		},
		
		/**
		 * This method apply a background Src to the component element
         * @method setBgSrc
         * @param {String/Number} value The value is a background Src of the element. 
         * 
         */
		setBgSrc : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"bgSrc":value});
		},
		
		/**
		 * This method apply a width to the component element
         * @method setWidth
         * @param {String/Number} value The value is a width of the element. 
         * 
         */
		setWidth : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"width":value});
		},
		
		/**
		 * This method apply a height to the component element
         * @method setHeight
         * @param {String/Number} value The value is a height of the element. 
         * 
         */
		setHeight : function(value){
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"height":value});
		},
		
		/**
		 * This method apply a display to the component element
         * @method setDisplay
         * @param {String/Number} value The value is a display of the element. 
         * 
         */
		setDisplay : function(value) {
			if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
			this.setStyle({"display":value});
		},
		getText : function(){
			return this.getStyle("text");
		},
		
		getFont : function(){
			return this.getStyle("font");
		},
		getColor : function(){
			return this.getStyle("color");
		},
		getTextColor : function(){
			return this.getStyle("textColor");
		},
		getX : function(){
			return this.getStyle("x");
		},
		getY : function(){
			return this.getStyle("y");
		},
		getVisible : function(){
			return this.getStyle("visible");
		},
		getOpacity : function(){
			return this.getStyle("opacity");
		},
		getRotaionDegree : function(){
			return this.getStyle("rotationDegree");
		},
		getMarginLeft : function(){
			return this.getStyle("marginLeft");
		},
		getMarginTop : function(){
			return this.getStyle("marginTop");
		},
		getMarginRight : function(){
			return this.getStyle("marginRight");
		},
		getMarginBottom : function(){
			return this.getStyle("marginBottom");
		},
		getOverflow : function(){
			return this.getStyle("overflow");
		},
		getDataType : function(){
			return this.getStyle("dataType");
		},
		getBgSrc : function(){
			return this.getStyle("backgroundImage");
		},
		getWidth : function(){
			return this.getStyle("width");
		},
		getHeight : function(){
			return this.getStyle("height");
		},
		getElementById : function(id){
			return _getElementById(this.comp,id);
		},
		/**
		 * Add Component to Component(Parent)
         * @method add
         * @param {Component} _comp Component to be added
         * @param {Object} desc description to be added to style  
         * @param {Integer} order index for ordering
         * 
         */
		add : function(_comp, desc, order) {
			
			if (order == undefined)
				order = this.children.length;
			//W.log.info("Component add");
			if (desc) {
				//console.log("add desc ",desc);
				_comp.setStyle(desc);
			}
			
			if (_comp.templet)
				_comp.templet = undefined;
			if (_comp.id) {
				if (!this.children.get(_comp.id))
					this.children.insertAt(order, _comp.id,  _comp);
				else
					this.children.put(_comp.id,  _comp);
					//throw new Error("Same child id exist !!! ");
			} else
				this.children.insertAt(order, _comp.pid, _comp);
			
			//this.comp.appendChild(_comp.comp);
			this.comp.insertBefore( _comp.comp, this.comp.children[order]);
			_comp._super = this;
			
			//_comp.comp.desc = W.clone(_comp.comp.desc);
			//W.log.inspect(_comp);
			//W.log.inspect(_comp.comp.desc);
			//W.log.inspect(this);
			//W.log.inspect(this.children);
			//W.log.info("this.children "+this.children);
		},
		remove : function(_comp) {
			if (_comp.id)
				this.children.remove(_comp.id);
			else
				this.children.remove(_comp.pid);
			
			_comp.comp.parentNode.removeChild(_comp.comp);
			_comp._super = undefined;
//			_comp.comp.remove();			
		},
		getChildren : function() {
			return this.children;
		},
		requestFocus : function(scene) {
			scene.setFocusObject(this);
			this._onFocusGained();
		},
		releaseFocus : function(scene) {
			scene.setFocusObject(null);
			this._onFocusLosted();
		},
		destroy : function() {
			//TODO 
		},
		_onKeyPressed: function(evt) {
        	this.onKeyPressed(evt);
            return false;
        },
//        onKeyPressed: function(evt) {
//            return false;
//        },
        __getProperty : function(name) {
        	return IComponent.properties[name]; 
        },
        /**
		 * setting style for focused component or unfocused component
         * @method setFocusedStyle
         * @param {Object} _desc style description
         * 
         * Ex)
         * comp.setFocusedStyle({on:{textColor:"yellow", x:48, width:110, transform:"scale(1.2)"}}); // Animation OK
         * comp.setFocusedStyle({on:{textColor:"yellow", x:48, width:110, transform:"scale(1.2)"}, // Animation OK
         * 						 off: {textColor:"black", x:18, width:110, transform:"scale(1)"},}}); 
         * comp.setFocusedStyle({on:"foc_className",off:"unfoc_className"}); // NO Animation 
         * comp.setFocusedStyle("foc_className");  // NO Animation
         * 
         */
        setFocusedStyle : function(_desc) {
        	this.focusedStyle = {};
        	this.unFocusedStyle = {};
        	
        	if(typeof(_desc)=="object" || typeof(_desc.on)=="object"){
        		if(_desc.on){
        			this.focusedStyle = _desc.on;
            	}
        		if(_desc.off){
            		this.unFocusedStyle = _desc.off;
            	}else{
            		var _tempKeys = Object.keys(this.focusedStyle);
            		this.unFocusedStyle = this.storedStyle;

            		for(var i=0; i<_tempKeys.length; i++){
            			if(!this.unFocusedStyle[_tempKeys[i]]){
            				this.unFocusedStyle[_tempKeys[i]] = "";
            			}
            		}
            	}
    		}else{
    			if(typeof(_desc)=="object"){
    				this.focusedStyle = _desc.on;
    				
    				if(_desc.off){
        				if(typeof(_desc.off)=="string")
        					this.unFocusedStyle = _desc.off;
        				else
        					throw new Error("Not equal type [On/Off]"); 
        			}else{
        				this.unFocusedStyle = this.storedClassName;
        			}
    			}else{
    				this.focusedStyle = _desc;
    				this.unFocusedStyle = this.storedClassName;
    				return;
    			}
    		}
        },

        _onFocusGained : function(duration) {
        	if(this.focusedStyle){
        		if(typeof(this.focusedStyle)== "object"){
        			this.setStyle(this.focusedStyle, duration);
        		}else{
            		this.comp.className = this.focusedStyle;
        		}
        	}
        	
        	this.onFocusGained();
        	
        	for (var key in this.children.key) {
        		this.children.obj[key]._onFocusGained(duration);
        	}
    	},
    	/**
		 * called when a component get focus
         * @method onFocusGained
         * 
         */
    	onFocusGained : function() {
    	},
    	_onFocusLosted : function(duration) {
    		if(this.unFocusedStyle){
        		if(typeof(this.unFocusedStyle)== "object"){
        			this.setStyle(this.unFocusedStyle, duration);
        		}else{
            		this.comp.className = this.unFocusedStyle;
        		}
        	}
    		
    		this.onFocusLosted();
    		
    		for (var key in this.children.key) {
        		this.children.obj[key]._onFocusLosted(duration);
        	}
    	},
    	/**
		 * called when a component lost focus
         * @method onFocusLosted
         * 
         */
    	onFocusLosted : function() {
    	},
    	/**
		 * called when popup opened on component
         * @method onPopupOpened
         * 
         */
    	_onPopupOpened : function(popup, desc) {
    		if (this.onPopupOpened)
    			this.onPopupOpened(popup, desc);
    	},
    	/**
		 * called when popup closed on component
         * @method onPopupClosed
         * 
         */
    	_onPopupClosed : function(popup, desc) {
    		if (this.onPopupClosed)
    			this.onPopupClosed(popup, desc);
    	}
	});
	
	return WComponent;
});

W.define('Div', function() {
    'use strict';

    var WComponent = W.getClass('Component');
    
    /**
	 * Represents a UI Div
	 * @class W.Div
	 */
    var WDiv = WComponent.extend({

    	init: function(desc) {
    		//W.log.info("Div init");
    		this._super("init", "div", desc.id, desc);
    	}
      
    });
    return WDiv;
});

W.define('Image', function() {
    'use strict';

    var WComponent = W.getClass('Component');
    
    /**
	 * Represents a UI Image
	 * @class W.Image
	 */
    var WImage = WComponent.extend({

    	init: function(desc) {
    		//W.log.info("WImage init");
    		this._super("init", "img", desc.id, desc);
    	}
      
    });
    return WImage;
});

W.define('Span', function() {
    'use strict';

    var WComponent = W.getClass('Component');
    
    /**
	 * Represents a UI Span
	 * @class W.Span
	 */
    var WSpan = WComponent.extend({

    	init: function(desc) {
    		//W.log.info("WSpan init");
    		this._super("init", "span", desc.id, desc);
    	}
      
    });
    return WSpan;
});

W.define("TextBox", function() {
	"use strict";
	
	var WComponent = W.getClass("Component");
	
	/**
	 * Represents a UI TextBox <br>
	 * 
	 * @example 
	 * new W.TextBox({id:"textbox", line:"5", fontSize:18, lineHeight:1.5 });
	 * @class W.TextBox
	 * @constructor
	 */
	var WTextBox = WComponent.extend({

    	init: function(desc) {
    		W.log.info("WTextBox init");
    		
    		if (!("line" in desc))
    			throw new Error("Error!!! Need line(line number)(not supported css file)");
    		if (!("fontSize" in desc))
    			throw new Error("Error!!! Need fontSize(not supported css file)");
    		if (!("lineHeight" in desc))
    			throw new Error("Error!!! Need lineHeight(not supported css file)");
    		if (("text" in desc))
    			throw new Error("Error!!! You can set Text to component after creation");
    		
    		this.line = desc.line;
    		this.fontSize = desc.fontSize;
    		this.lineHeight = desc.lineHeight;

			var pxIdx;
    		if (typeof(this.lineHeight) == "string") {
	    		var pctIdx = this.lineHeight.indexOf("%");
	    		if ( pctIdx != -1)
	    			this.lineHeight = parseInt(this.lineHeight.substr(0, pctIdx))/100;

				pxIdx = this.lineHeight.indexOf("px");
				if ( pxIdx != -1)
					this.lineHeight = parseInt(this.lineHeight.substr(0, pxIdx));
    		}
			if(pxIdx) this.pageHeight = parseInt(this.lineHeight*parseInt(this.line));
    		else this.pageHeight = parseInt(parseInt(this.fontSize)*this.lineHeight*parseInt(this.line));
    		W.log.info("TextBox pageHeight " + this.pageHeight);
    		
    		desc.overflow = "hidden";
    		this._super("init", "div", desc.id, desc);

    		delete desc["height"];
    		desc.id = "";
    		desc.x = "0";
    		desc.y = "0";
    		desc.width = "100%";
    		desc.overflow = "";
    		desc.visibility = "inherit";
    		desc.position = "absolute";
    		desc["white-space"] = "pre-wrap";
    		var _textbox = new W.Span(desc);
    		this.add(_textbox);
    	},
    	setStyle: function(_style, duration) {
    		if ("text" in _style)
    			throw new Error("SetStyle of TextBox can not has text value");
    		
    		this._super("setStyle", _style, duration);
		},
    	setText : function(value) {
    		if(value==null || value==undefined){
				W.log.error("Not found the value of method.");
				return;
			}
    		this.totalPage = 0;
    		this.pageNo = 0;
			this.children.elementAt(0).setStyle({"text":value});
			this.getTotalPage();
    	},
    	/**
		 * returns total page of TextBox
         * @method getTotalPage
         * 
         */
    	getTotalPage : function() {
    		if (this.totalPage)
    			return this.totalPage;
    		var _height = this.children.elementAt(0).comp.offsetHeight;
    		var _boxHeight = this.comp.offsetHeight;
    		
    		W.log.info("getTotalPage real " + _height);
    		W.log.info("getTotalPage box " + _boxHeight);
    		
    		return this.totalPage = Math.ceil(_height / _boxHeight);
    	},
    	setPage : function() {
    		if (this.pageNo +1 > this.totalPage )
    			throw new Error("Exceed total Page ");
    		
    		this.children.elementAt(0).setStyle({"y": -this.pageNo*this.pageHeight});
    	},
    	/**
		 * scroll page up of textbox
         * @method pageUp
         * 
         */
    	pageUp :function() {
    		W.log.info("TextBox pageUp ");
    		if (this.pageNo > 0) {
	    		this.setPage(--this.pageNo);
    		}
    	},
    	/**
		 * scroll page up of textbox
         * @method pageDown
         * 
         */
    	pageDown : function() {
    		W.log.info("TextBox pageDown ");
    		if (this.pageNo < this.totalPage-1) {
	    		this.setPage(++this.pageNo);
    		}
    	}
	});
	
	return WTextBox;
});

W.define("IList", "Class", function(WClass){
	
	var _iList = W.Class.extend({
		BIND_PREFIX_TEXT : "txt_", 
		BIND_PREFIX_IMG : "img_",
		BIND_PREFIX_IMG_SRC : "imgsrc_",
		
		SCROLL_TYPE_ROLLING_EDGE : "rolling_edge",
		SCROLL_TYPE_ROLLING_CENTER : "rolling_center",
		SCROLL_TYPE_PAGE : "page"
	});
	
	var IList = new _iList();
	return IList;
});

W.define('List', function() {
    'use strict';

    var WComponent = W.getClass('Component');
    var IList = W.getClass("IList");
    
    var _getNumberFromPX = function(input) {
     	try {
     		if (input == undefined || input == null)
     			return 0;
     		
     		if (typeof(input) == "string" &&  input.indexOf("px") > -1)
     			return Number(input.substr(0,input.indexOf("px")));
     		else
     			return input;
     	} catch (err) {
     		return 0;
     	}
     };
     
     var _dataBind = function(data, el, key, curIndex, totalNum) {
    	 if (key.indexOf(IList.BIND_PREFIX_TEXT) == 0) {
 			if (curIndex >= totalNum) {
 				if (el.parentElement)
 					el.parentElement.style["visibility"] = "hidden";
 			} else {
 				if (el.parentElement)
 					el.parentElement.style["visibility"] = "inherit";
 				el.textContent = data[key];
 			}
    	 } else if (key.indexOf(IList.BIND_PREFIX_IMG) == 0) {
				if (curIndex >= totalNum) {
				el.style["visibility"] = "hidden";
			} else {
					if (data[key])
						el.style["visibility"] = "inherit";
					else
						el.style["visibility"] = "hidden";
			}
    	 } else if (key.indexOf(IList.BIND_PREFIX_IMG_SRC) == 0) {
				if (curIndex >= totalNum) {
				el.style["visibility"] = "hidden";
			} else {
					if (data[key])
						el.src = data[key];
					else
						el.src = "";
			}
		}
     };
    /**
	 * Represents a UI List
	 * 
	 * @example 
	 * 	//Definition List Component 
	 * 	var list = new W.List({x:0, y:0, width:200, height:200});
	 * 
	 * 	//Definition List Cell. List have only one cell.
	 *		// but Cell can has multi components.
	 * 	var cell = new W.Div({x:0, y:0, width:200, height:40});
	 * 
	 * 	//Definition Components in Cell
	 * 	// _tmpIcon1 is always visible.
	 * 	var _tmpIcon1	= new W.Image({id:"ch_icon1",src:"img/icon_fav.png", x:0, y:0});
	 * 	// _tmpIcon2 is visible after binding data if value of data named attr.name is true 
	 * 	var _tmpIcon2	= new W.Image({id:"ch_icon2",src:"img/icon_fav_f.png", x:0, y:0, 
	 * 		attr:{name:IList.BIND_PREFIX_IMG+"icon", value:""}});
	 * 
	 * 	var _tmpLine_1 = new W.Image({id:"line",src:"img/line_dca_01.png",x:35,y:-10});
	 * 	// textContent of _tmpText is visible after binding data by value of data named attr.name  
	 * 	var _tmpText = new W.Span({id:"ch_name",text:"",overflow:"ellipsis",
	 * 		attr:{name:IList.BIND_PREFIX_TEXT+"name", value:""},
	 * 		fontSize:17, textColor:"white", width:160, height:20});
	 * 
	 * 	cell.add(_tmpIcon1);
	 * 	cell.add(_tmpIcon2);
	 * 	cell.add(_tmpLine_1);
	 * 	cell.add(_tmpText);
	 * 
	 * 	this.list.setListConf( {
	 * 		//animationEffect:{duration:300},
	 * 		scrollType : IList.SCROLL_TYPE_ROLLING_EDGE,
	 * 		cell : cell,
	 * 		rowHeight : 40,	
	 * 		rows : 5
	 * 	});
	 * 	
	 * 	//Adding List to Scene
	 * 	parent.add(list);
	 * 
	 * 	//data binding 
	 * 	//Data must be Array
	 * 	var chData = [];
	 * 	//Item of Array must be Object
	 * 	//And item must have properties named attribute name in list cell component.
	 * 	for(var i=0;i<list.length;i++){
	 * 		chData[i] = {};
	 * 		chData[i].IList.BIND_PREFIX_TEXT + "name" = "xxx";
	 * 		chData[i].IList.BIND_PREFIX_IMG + "icon" = true;
	 * 	}
	 * 	list.setData(chData);
	 * 
	 * @class W.List
	 * @constructor
	 */
    var WList = WComponent.extend({

    	init: function(desc) {
    		//W.log.info("WSpan init");
    		this.rows = 0;
    		this.data = null;
    		this.focusIndex = 0;
    		this.dataIndex = 0;
    		this.startIndex = 0;
    		this.animationEffect = null;
    		this.isRendered = false;
    		this.moveH = 0;
        	
    		desc.overflow = "hidden";
    		this._super("init", "div", desc.id, desc);
    	},
    	_add : function(_comp, desc, order) {
    		this._super("add", _comp, desc, order);
    	},
    	add : function() {
    		throw new Error("Can not call add method on List Component");
    	},
    	getSelectedData : function() {
    		if (this.data)
    			return this.data[this.dataIndex];
    		else
    			return null;
    	},
    	getFocusIndex : function() {
    		if (this.data)
    			return this.focusIndex;
    		else
    			return -1;
    	},
    	/**
    	 * Setting data to list.
    	 * If list was rendered. list data will be visible.
    	 * @method setData
    	 * @param {Array} _data Object Array
    	 * 		[
    	 * 		{ bind_id0:data0, bind_id1:data1, ...},
    	 * 		{ bind_id0:data0, bind_id1:data1, ...},
    	 * 		...
    	 * 		]
    	 */
    	setData : function(_data) {
    		this.data = _data;
    		
    		if (this.isRendered) {
    			this._onFocusLosted(this.focusIndex);
    			this._setDataBinding(0);
    			this._onFocusGained(this.focusIndex);
    		}
    	},
    	/**
    	 * setting config of list
    	 * @method setListConf
    	 * @param {Object} conf Configuration
    	 * 	@param {Integer} conf.rows row count of list
    	 * 	@param {String} conf.scrollType "rolling" or "paging"
    	 * 	@param {Component} conf.cell Component
    	 * 	@param {Integer} conf.rowHeight
    	 * 	@param {Object} conf.animationEffect animation effect 
    	 * 		@param {Integer} conf.animationEffect.duration duration
    	 */
    	setListConf : function(conf) {
    		if (this.isRendered)
    			throw new Error("Can not set config After rendering");

    		this.animationEffect = conf.animationEffect;
    		this.rows = conf.rows;
    		this.scrollType = conf.scrollType;
    		this.rowHeight = conf.rowHeight;
    		this.cellComp = conf.cell;
    		
    		if (this.scrollType == IList.SCROLL_TYPE_PAGE && conf.animationEffect)
    			this.animationEffect = undefined;
    		    		
    		if (this.scrollType == IList.SCROLL_TYPE_ROLLING_CENTER)
    			throw new Error("Center rolling list is not implemented yet !!");
    		this.data = [];
    		this.focusIndex = 0;
    		this.dataIndex = 0;
    		this.isRendered = false;
    	},
    	
    	reset : function() {
    		this.isRendered = false;
    		while(this.comp.firstChild)
				this.comp.removeChild(this.comp.firstChild);
    		
    		this.rows = 0;
    		this.scrollType = undefined;
    		this.rowHeight = 0;
    		this.cellComp = undefined;
    		this.data = [];
    	},
    	/**
    	 * rendering of list 
    	 * @method render
    	 */
    	render : function() {
    		
    		if (!this.cellComp)
    			throw new Error("Cell Component does not assigned !!");
    		if (!this.scrollType)
    			throw new Error("List scroll type does not defined !!");
    		if (!this.rows)
    			throw new Error("List size does not defined !!");
    		
    		this.isRendered = true;
    		this.focusIndex = 0;
    		this.dataIndex = 0;
    		this.moveH = 0;
    		this.children = new W.Hash();
			while(this.comp.firstChild)
				this.comp.removeChild(this.comp.firstChild);
			
			var child;
			
			if (this.animationEffect && this.scrollType != IList.SCROLL_TYPE_PAGE) {
				child = W.cloneComponent(this.cellComp);
				child.comp.wcomp = child;
				this._add(child, {id:"list_-1", y:(this.rowHeight)*-1});
			}
			
			for (var i=0; i<this.rows; i++) {
				child = W.cloneComponent(this.cellComp);
				child.comp.wcomp = child;
				this._add(child, {id:"list_"+i, y:(this.rowHeight)*i});
			}
			if (this.animationEffect && this.scrollType != IList.SCROLL_TYPE_PAGE) {
				child = W.cloneComponent(this.cellComp);
				child.comp.wcomp = child;
				this._add(child, {id:"list_"+this.rows, y:(this.rowHeight)*this.rows});
			}
			
			if (this.data)
				this._setDataBinding(0);
    		
    	},
    	_onFocusGained : function(index) {
    		var duration = this.animationEffect ? this.animationEffect.duration:undefined;
    		if (index != undefined)
    			this.children.get("list_"+index)._onFocusGained(duration);
    		else
    			this.children.get("list_"+this.focusIndex)._onFocusGained(duration);
    	}, 
    	_onFocusLosted : function(index) {
    		var duration = this.animationEffect ? this.animationEffect.duration:undefined;
    		if (index != undefined)
    			this.children.get("list_"+index)._onFocusLosted(duration);
    		else
    			this.children.get("list_"+this.focusIndex)._onFocusLosted(duration);
    	},
    	_setDataBinding : function() {
    		this.startIndex = 0;
    		this.focusIndex = 0;
    		this.dataIndex = 0;
    		if (this.animationEffect && this.scrollType != IList.SCROLL_TYPE_PAGE) {
    			if (this.scrollType == IList.SCROLL_TYPE_ROLLING_CENTER) {
    				
    			}
    			this.__setDataBindingAni();
    		} else {
    			this.__setDataBindingNoAni();
    		}
    		
    	},
    	__setDataBindingAni : function() {
    		
    		if (this.data && this.data.length > 0) {
    			//for (var key in this.children)
				//	this.children[key].setVisible(true);
	    		var _keys = this.data[0];
	    		this._rowComps = {};
	    		for (var key in _keys) {
	    			//W.log.info("_setDataBinding key " + key);
					this._rowComps[key] = this.comp.querySelectorAll("["+key+"]");
					
					//case of  index is zero.
					if (this.data.length > this.rows) {
						_dataBind(this.data[this.data.length-1], this._rowComps[key][0], key, this.data.length-1, this.data.length);
						
						_dataBind(this.data[this.rows], this._rowComps[key][this.rows+1], 
								key, this.rows, this.data.length);
					}
					
					for (var i=this.startIndex,j=1; i<this.rows; i++,j++) {
						_dataBind(this.data[i], this._rowComps[key][j], key, i, this.data.length);
		    		}	
				}
    		} else {
    			if (this._rowComps) {
    				for (var key in this.children.key)
    					this.children.obj[key].setVisible(false);
    			}
    		}
    		
    	},
    	__setDataBindingNoAni : function() {
    		if (this.data && this.data.length > 0) {
    			for (var key in this.children.key)
					this.children.obj[key].setVisible(true);
	    		var _keys = this.data[0];
	    		this._rowComps = {};
	    		for (var key in _keys) {
	    			W.log.info("_setDataBinding key " + key);
					this._rowComps[key] = this.comp.querySelectorAll("["+key+"]");
					
					for (var i=this.startIndex,j=0; i<this.rows; i++,j++) {
						
						if (key.indexOf(IList.BIND_PREFIX_TEXT) == 0) {
			    			if (i >= this.data.length) {
			    				this.children.get("list_"+j).setVisible(false);//at least one text data exists
			    			} else {
			    				this.children.get("list_"+j).setVisible(true);
			    				this._rowComps[key][j].textContent = this.data[i][key];
			    			}
						} else if (key.indexOf(IList.BIND_PREFIX_IMG) == 0) {
							if (i >= this.data.length) {
			    				this._rowComps[key][j].style["visibility"] = "hidden";
			    			} else {
								if (this.data[i][key])
									this._rowComps[key][j].style["visibility"] = "inherit";
								else
									this._rowComps[key][j].style["visibility"] = "hidden";
			    			}
						} else if (key.indexOf(IList.BIND_PREFIX_IMG_SRC) == 0) {
							if (i >= this.data.length) {
								this._rowComps[key][j].style["visibility"] = "hidden";
							} else {
									if (this.data[i][key]){
										this._rowComps[key][j].style["visibility"] = "inherit";
										this._rowComps[key][j].src = this.data[i][key];
									}
									else
										this._rowComps[key][j].style["visibility"] = "hidden";
							}
						}
		    		}
				}
    		} else {
    			if (this._rowComps) {
    				for (var key in this.children.key)
    					this.children.obj[key].setVisible(false);
    			}
    		}
    	},
    	/**
    	 * list be scrolled to up / down
    	 * @method scroll
    	 * @param {Integer} direction direction is presented keyCode. (W.KEY.UP or W.KEY.DOWN) 
    	 */
    	scroll : function(direction) {
    		var _this = this;
    		if (this.animationEffect && this.data.length > this.rows) {
//    			W.log.info("aniTimer " + this.aniTimer);
//    			W.log.info("startScrollContsKey " + this.startScrollContsKey);
//    			W.log.info("continueTimer " + this.continueTimer);
    			
    			if (this.aniTimer && !this.startScrollContsKey) {
    				this.startScrollContsKey = true;
    				
    				var children = this.comp.children;
        			for (var i=0; i<children.length; i++) {
        				children[i].style.webkitTransitionDuration = "0ms";
        			}
        			clearTimeout(this.aniTimer);
        			if (this.aniTimerFunction)
        				this.aniTimerFunction();
        			//W.log.info("animation timer forced running!! ");
    			}
    			if (!this.aniTimer && this.continueTimer) {
    				this.startScrollContsKey = true;
    				var _keys = this.data[0];
					for (var key in _keys) {
						this._rowComps[key] = [].slice.call(this.comp.querySelectorAll("["+key+"]"));
						this._rowComps[key].shift();
						this._rowComps[key].pop();
					}
    				clearTimeout(this.continueTimer);
    				//W.log.info("continueTimer runnining ");
    			}
    			
    			if (this.startScrollContsKey) {

					this._scrollNoAni(direction);
					
    				//clearTimeout(this.continueTimer);
    				this.continueTimer = 
    					setTimeout( function() {
    						_this.startScrollContsKey = false;
    						_this.continueTimer = undefined;
    						//W.log.info("continueTimer complete !!! ");
    						//set data on first and last hidden Cell
    						var _keys = _this.data[0];
    						for (var key in _keys) {
	    						//last 
		        				var _childComp = [].slice.call(_this.comp.children[_this.rows+1].querySelectorAll("["+key+"]"));
		        				//W.log.inspect(_childComp[0]);
		        				_dataBind(_this.data[(_this.startIndex+_this.rows)%_this.data.length], _childComp[0], key,
		        						(_this.startIndex+_this.rows)%_this.data.length, _this.data.length);
		        				
		        				//first
		        				_childComp = [].slice.call(_this.comp.children[0].querySelectorAll("["+key+"]"));
		        				//W.log.inspect(_childComp[0]);
		        				_dataBind(_this.data[(_this.startIndex-1+_this.data.length)%_this.data.length], _childComp[0], key,
		        						(_this.startIndex-1+_this.data.length)%_this.data.length, _this.data.length);
    						}
    						
    					}, this.animationEffect.duration);
    				
    				return;
    			}
    			this._scrollAni(direction);
    		} else {
    			this._scrollNoAni(direction);
    		}
    		
    	},
    	_scrollAni : function(direction) {
    		
    		var _this = this;
    		var move = false;
    		var prevIndex = this.focusIndex;
    		if (this.scrollType != IList.SCROLL_TYPE_PAGE) {
    			if (direction == W.KEY.UP) {
    				this.dataIndex = (--this.dataIndex + this.data.length)%this.data.length;
    				if (this.focusIndex > 0)
    					--this.focusIndex;
    				else {
    					this.startIndex = (--this.startIndex + this.data.length)%this.data.length;
    					move = true;
    				}
        		} else {
        			this.dataIndex = ++this.dataIndex%this.data.length;
        			
        			if (this.data.length > this.rows) {
	        			if (this.focusIndex < this.rows-1)
	        				++this.focusIndex;
	        			else {
	        				this.startIndex = ++this.startIndex%this.data.length;
	        				move = true;
	        			}
        			} else {
        				if (this.focusIndex < this.data.length-1)
        					++this.focusIndex;
        			}
        		}
    		}
    		
    		if (!move) {
    			this._onFocusLosted(prevIndex);
        		this._onFocusGained(this.focusIndex);
    			return;
    		}
    		
    		if (direction == W.KEY.UP) {
    			var children = this.comp.children;
    			var top = 0;
    			for (var i=0; i<children.length; i++) {
    				children[i].style.webkitTransitionDuration = this.animationEffect.duration + "ms";
    				top = _getNumberFromPX(children[i].style.top);
    				children[i].style.top = (top+this.rowHeight) + "px";
    				
    				if (i == children.length-1) {
    					children[i].remove();
    				} else {
	    				children[i].id = "list_"+i;
	    				if (this.children.get("list_"+i))
	    					this.children.put("list_"+i, children[i].wcomp);
    				}
    			}
    			this.aniTimerFunction = function() {
    				var child = W.cloneComponent(_this.cellComp);
    				child.comp.wcomp = child;
    				_this._add(child, {id:"list_-1", y:(_this.rowHeight)*-1}, 0);
        			
        			var _keys = _this.data[0];
        			for (var key in _keys) {
        				var _childComp = [].slice.call(child.comp.querySelectorAll("["+key+"]"));
        				//W.log.inspect(_childComp[0]);
        				_dataBind(_this.data[(_this.startIndex-1+_this.data.length)%_this.data.length], _childComp[0], key,
        						(_this.startIndex-1+_this.data.length)%_this.data.length, _this.data.length);
        			}
        			_this.aniTimer = undefined;
        			_this.aniTimerFunction = undefined;
    			}
    			this.aniTimer = setTimeout( 
    				this.aniTimerFunction
        		, this.animationEffect.duration);
    			this._onFocusLosted((this.focusIndex+1)%this.rows);
        		this._onFocusGained(this.focusIndex);
    		} else {
    			var children = this.comp.children;
    			children[0].remove();
    			for (var i=0; i<children.length; i++) {
    				children[i].style.webkitTransitionDuration = this.animationEffect.duration + "ms";
    				top = _getNumberFromPX(children[i].style.top);
    				children[i].style.top = (top-this.rowHeight) + "px";
    				children[i].id = "list_"+(i-1);
    				if (this.children.get("list_"+(i-1)))
    					this.children.put("list_"+(i-1), children[i].wcomp);
    			}
    			this.aniTimerFunction = function() {
    				var child = W.cloneComponent(_this.cellComp);
    				child.comp.wcomp = child;
    				_this._add(child, {id:"list_"+_this.rows, y:(_this.rowHeight)*(_this.rows)});
    				
        			var _keys = _this.data[0];
        			for (var key in _keys) {
        				var _childComp = [].slice.call(child.comp.querySelectorAll("["+key+"]"));
        				_dataBind(_this.data[(_this.startIndex+_this.rows)%_this.data.length], _childComp[0], key,
        						(_this.startIndex+_this.rows)%_this.data.length, _this.data.length);
        			}
        			_this.aniTimer = undefined;
        			_this.aniTimerFunction = undefined;
        			//}
        		}
    			this.aniTimer = setTimeout( this.aniTimerFunction, this.animationEffect.duration);
    			this._onFocusLosted((this.focusIndex-1+this.rows)%this.rows);
        		this._onFocusGained(this.focusIndex);
    		}
    	},
    	_scrollNoAni : function(direction) {
    		//W.log.info("scrollNoAni");
    		var move = false;
    		var prevIndex = this.focusIndex;
    		if (this.scrollType != IList.SCROLL_TYPE_PAGE && this.data.length > this.rows) {
    			if (this.scrollType == IList.SCROLL_TYPE_ROLLING_EDGE) {
	    			if (direction == W.KEY.UP) {
	    				this.dataIndex = (--this.dataIndex + this.data.length)%this.data.length;
	    				if (this.focusIndex > 0)
	    					--this.focusIndex;
	    				else {
	    					this.startIndex = (--this.startIndex + this.data.length)%this.data.length;
	    					move = true;
	    				}
	        			
	        		} else {
	        			this.dataIndex = ++this.dataIndex%this.data.length;
	        			
	        			if (this.data.length > this.rows) {
		        			if (this.focusIndex < this.rows-1)
		        				++this.focusIndex;
		        			else {
		        				this.startIndex = ++this.startIndex%this.data.length;
		        				move = true;
		        			}
	        			} else {
	        				if (this.focusIndex < this.data.length-1)
	        					++this.focusIndex;
	        			}
	        		}
    			} else {
    				//IList.SCROLL_TYPE_ROLLING_CENTER
    				if (direction == W.KEY.UP) {
    					this.dataIndex = (--this.dataIndex + this.data.length)%this.data.length;
    					this.startIndex = (--this.startIndex + this.data.length)%this.data.length;
    				} else {
    					this.dataIndex = ++this.dataIndex%this.data.length;
    					this.startIndex = ++this.startIndex%this.data.length;
    				}
    			}
    		} else {
    			var prevStartIndex = this.startIndex;
    			if (direction == W.KEY.UP) {
    				this.dataIndex = (--this.dataIndex + this.data.length)%this.data.length;
        		} else {
        			this.dataIndex = ++this.dataIndex%this.data.length;
        		}
    			this.focusIndex = this.dataIndex%this.rows;
    			this.startIndex = parseInt(this.dataIndex / this.rows) * this.rows;
    			if (prevStartIndex != this.startIndex)
    				move = true;
    		}
    		if (!move) {
    			this._onFocusLosted(prevIndex);
        		this._onFocusGained(this.focusIndex);
    			return;
    		}
    		var _keys = this.data[0];
    		for (var key in _keys) {
    			var i=this.startIndex;
				for (var j=0; j<this.rows; i++,j++) {
					
					if (key.indexOf(IList.BIND_PREFIX_TEXT) == 0) {
						if (this.scrollType != IList.SCROLL_TYPE_PAGE && 
								this.data.length > this.rows && i >= this.data.length)
							i = 0;
						else if (this.scrollType === IList.SCROLL_TYPE_PAGE
								&& i >= this.data.length ) {
							this._rowComps[key][j].textContent = "";
							continue;
						} else if (this.data.length <= this.rows && i >= this.data.length) {
							this._rowComps[key][j].textContent = "";
							continue;
						}
						this._rowComps[key][j].textContent = this.data[i][key];
					} else if (key.indexOf(IList.BIND_PREFIX_IMG) == 0) {
						if (this.scrollType != IList.SCROLL_TYPE_PAGE 
								&& this.data.length > this.rows && i >= this.data.length)
							i = 0;
						else if (this.scrollType === IList.SCROLL_TYPE_PAGE
								&& i >= this.data.length ) {
							this._rowComps[key][j].style["visibility"] = "hidden";
							continue;
						} else if (this.data.length <= this.rows && i >= this.data.length) {
							this._rowComps[key][j].style["visibility"] = "hidden";
							continue;
						} 
						if (this.data[i][key])
							this._rowComps[key][j].style["visibility"] = "inherit";
						else
							this._rowComps[key][j].style["visibility"] = "hidden";
						
					} else if (key.indexOf(IList.BIND_PREFIX_IMG_SRC) == 0) {
						if (this.scrollType != IList.SCROLL_TYPE_PAGE 
								&& this.data.length > this.rows && i >= this.data.length)
							i = 0;
						else if (this.scrollType === IList.SCROLL_TYPE_PAGE
								&& i >= this.data.length ) {
							this._rowComps[key][j].style["visibility"] = "hidden";
							continue;
						} else if (this.data.length <= this.rows && i >= this.data.length) {
							this._rowComps[key][j].style["visibility"] = "hidden";
							continue;
						} 
						if (this.data[i][key]){
							this._rowComps[key][j].style["visibility"] = "inherit";
							this._rowComps[key][j].src = this.data[i][key];
						}
						else
							this._rowComps[key][j].style["visibility"] = "hidden";
						
					}
	    		}	
			}
    		if (prevIndex != this.focusIndex) {
	    		this._onFocusLosted(prevIndex);
	    		this._onFocusGained(this.focusIndex);
    		}
    	}
    	
    });
    return WList;
});


W.define('Scene', function() {
    'use strict';

    var _sceneManager = W.getClass("SceneManager");
    var WComponent = W.getClass('Component');

    /**
     * Represents a UI scene.
     *
     * @class W.Scene
     */
    var WScene = WComponent.extend({

    	_keys: [],
    	_exclusiveKeys: [],
    	_state: "",
    	_focusedObj:null,
    	init: function(desc) {
    		W.log.info("Scene init");
    		//W.log.info(desc);
    		var sceneName = desc.sceneName.replace("/","_");
    		this._super("init", "div", sceneName, desc);
			this.onInit(desc);
			this._state = "initialize";
			this.sceneName = sceneName;
    	},
    	
    	log: function(msg){
    		W.log.info("[" + this.sceneName + "]" + msg);
    	},
    	
    	error: function(msg){
    		W.log.error("[" + this.sceneName + "]" + msg);
    	},

		/**
		 * called on initializing
		 * @method onInit
		 * @param {W.Scene} scene Scene Component
		 */
		onInit: function(desc) {
		},
        
        _onCreate: function(desc) {
        	//this.addStyleSheet({position:"absolute"});
			if (!this.comp.parentNode)
				W.root.add(this);

        	this.onCreate(desc);
			this._state = "start";
			this.setDisplay("");
        },
        /**
         * called on scene start
         * @method onCreate
         * @param {W.Scene} scene Scene Component
         */
        onCreate: function(desc) {
        },
        /**
         * 
         */
        _onDestroy: function() {
        	//W.log.info("_onDestroy Scene");
        	this.onDestroy();
        	this._state = "destroyed";
        	W.root.remove(this);
        	//this.comp.remove();
        },
        onDestroy: function() {
        },
		_onPause: function() {
        	W.log.info("_onPause Scene");
        	this.onPause();
        	this._state = "pause";
        	this.setDisplay("none");
        },
        /**
         *  Called on scene pause.
         *  @method onPause
         */
		onPause: function() {
        	//W.log.info("onPause Scene");
        },
		_onResume: function(desc) {
			W.log.info("_onResume Scene");
			W.CloseTimer.start();
			this.onResume(desc);
			this._state = "start";
			this.setDisplay("");
		},
		/**
		 *  Called on scene pause.
		 *  @method onPause
		 */
		onResume: function() {
			//W.log.info("onResume Scene");
		},
		_onRefresh: function(desc) {
			W.log.info("_onRefresh Scene");
			this.onRefresh(desc);
		},
		/**
		 *  Called on scene pause.
		 *  @method onPause
		 */
		onRefresh: function() {
			//W.log.info("onRefresh Scene");
		},
        _onKeyPressed: function(evt) {
        	if(evt.keyCode == W.KEY.EXIT){
            	if(W.SceneManager.getCurrentScene().id.indexOf("VodPlayScene") > 0 || (W.state.isVod && W.SceneManager.getCurrentScene().id.indexOf("PurchaseVodScene") > 0)){
            		this.onKeyPressed(evt);
            	}else{
            		W.SceneManager.destroyAll();
            	}
        	}else{
        		this.onKeyPressed(evt);
        	}
        },
        /**
         * Called on key pressed
         * @method onKeyPressed
         * @param {Event} evt KeyEvent
         */
        onKeyPressed: function(evt) {
        },
        /**
         * 
         */
        _onKeyReleased: function(evt) {
        	onKeyReleased(evt);
        },
        onKeyReleased: function(evt) {
        },

        /**
         * start scene
         * @method startScene
         * @param {Object} desc scene start description
         * 	@param {String} desc.sceneName scene name for starting
         * 	@param {Number} desc.option option for scene instance creation
         * 	@param {Number} desc.backState state for previous scene
         */
        startScene : function(desc) {
        	_sceneManager.startScene(desc);
        },
        /**
         * pause scene
         * @method pauseScene
         * @param {Object} desc scene start description
         * 	@param {String} desc.sceneName scene name for pause
         * 
         * named scene will be paused. this scene will be keeped in scene stack.
         */
        pauseScene : function(desc) {
        	if (this._state == "start")
        		_sceneManager.pauseScene(desc);
        },
		/**
		 * resume scene
		 * @method resumeScene
		 * @param {Object} desc scene start description
		 * 	@param {String} desc.sceneName scene name for resume
		 *
		 * named scene will be resumed.
		 */
		resumeScene : function(desc) {
			if (this._state == "pause")
				_sceneManager.resumeScene(desc);
		},
        /**
         * goto history scene
         * @method backScene
         * @param {Number} depth scene history count for history back
         * 
         */
        backScene : function(depth, needRefresh, desc) {
        	if (this._state == "start")
        		_sceneManager.historyBack(depth, needRefresh, desc);
        },

        /**
         * key setting for key event
         * @method setKeys
         * @param {Array} keys array of key(defined on W.KEY)
         */
        setKeys: function(keys) {
        	this._keys = keys;
        },
        /**
         * exclusive key setting for key event
         * @method setExclusiveKeys
         * @param {Array} keys array of key(defined on W.KEY)
         */
        setExclusiveKeys: function(keys) {
        	this._exclusiveKeys = keys;
        	this.addKeys(keys);
        },
        /**
         * key adding for key event
         * @method addKeys
         * @param {Array} keys array of key(defined on W.KEY)
         */
        addKeys: function(keys) {
        	this._keys = this._keys.concat(keys);
        },
        /**
         * exclusive key adding for key event
         * @method addExclusiveKeys
         * @param {Array} keys array of key(defined on W.KEY)
         */
        addExclusiveKeys: function(keys) {
        	this._exclusiveKeys = this._exclusiveKeys.concat(keys);
        	this.addKeys(keys);
        },

        hasKey: function(evt) {
        	if (this._keys.indexOf(evt.keyCode) > -1)
        		return true;
        	else
        		return false;
        },
        hasExclusiveKey: function(evt) {
        	if (this._exclusiveKeys.indexOf(evt.keyCode) > -1)
        		return true;
        	else
        		return false;
        },
        setFocusObject: function(comp) {
        	this._focusedObj = comp;
        }
    });
    return WScene;
});

W.define("IPopup", "Class", function(WClass){
	
	var _iPopup = W.Class.extend({
		TYPE_CONFIRM : 0,
		TYPE_INFO : 1
	});
	var IPopup = new _iPopup();
	return IPopup;
});

W.define('Popup', function() {
    'use strict';

    var _popupManager = W.getClass("PopupManager");
    var WComponent = W.getClass('Component');

    /**
     * Represents a UI popup.
     *
     * @class W.Popup
     */
    var WPopup = WComponent.extend({

    	_keys: [],
    	_state: "",
    	
    	init: function(desc) {
    		W.log.info("Popup init");
    		//W.log.info(desc);
    		var popupName = desc.popupName.replace("/","_");
    		this._super("init", "div", popupName, desc);
			this.onInit(desc);
			this._state = "initialize";
    	},

		/**
		 * called on initializing
		 * @method onInit
		 * @param {W.Scene} scene Scene Component
		 */
		onInit: function(desc) {
		},
        
        _onStart: function(param) {
        	W.log.info("_onStart Popup");
        	
        	if (!this.comp.parentNode){
        		this.setStyle({"z-index":100});
        		W.root.add(this);
        	}
        		

        	this.onStart(param);
        	this._state = "start";
        	this.setDisplay(true);
        },
        /**
         *  Called on popup start.
         *  @method onStart
         *  @param {object} param When popup be called, parameter can be sent.
         */
        onStart: function(param) {
        	W.log.info("onStart Popup");
        },
        _onStop: function() {
        	W.log.info("_onStop Popup");
        	this.onStop();
        	this._state = "stop";
        	
        	this.comp.parentNode.removeChild(this.comp);
//        	this.comp.remove();
        },
        /**
         *  Called on popup stop.
         *  @method onStop
         */
        onStop: function() {
        	//W.log.info("onStop Popup");
        },

		_onPause: function() {
			W.log.info("_onPause Popup");
			this.onPause();
			this._state = "pause";
			this.setDisplay("none");
		},
		/**
		 *  Called on scene pause.
		 *  @method onPause
		 */
		onPause: function() {
			//W.log.info("onPause Popup");
		},
		_onResume: function() {
			W.log.info("_onResume Popup");
			this.onResume();
			this._state = "start";
			this.setDisplay("");
		},
		/**
		 *  Called on scene pause.
		 *  @method onPause
		 */
		onResume: function() {
			//W.log.info("onResume Popup");
		},
		_onRefresh: function() {
			W.log.info("_onRefresh Popup");
			this.onRefresh();
		},
		/**
		 *  Called on scene pause.
		 *  @method onPause
		 */
		onRefresh: function() {
			//W.log.info("onRefresh Popup");
		},

        _onKeyPressed: function(evt) {
        	this.onKeyPressed(evt);
        },
        /**
         * Called on key pressed
         * @method onKeyPressed
         * @param {Event} evt KeyEvent
         */
        onKeyPressed: function(evt) {
        },
        /**
         * 
         */
        _onKeyReleased: function(evt) {
        	onKeyReleased(evt);
        },
        onKeyReleased: function(evt) {
        },

		/**
		 * goto history scene
		 * @method backScene
		 * @param {Number} depth scene history count for history back
		 *
		 */
		backPopup : function(depth, needRefresh, desc) {
			if (this._state == "start")
				_popupManager.historyBack(depth, needRefresh, desc);
		},

        /**
         * key setting for key event
         * @method setKeys
         * @param {Array} keys array of key(defined on W.KEY)
         */
        setKeys: function(keys) {
        	this._keys = keys;
        },
        
        /**
         * key adding for key event
         * @method addKeys
         * @param {Array} keys array of key(defined on W.KEY)
         */
        addKeys: function(keys) {
        	this._keys = this._keys.concat(keys);
        },
       
        hasKey: function(evt) {
        	if (this._keys.indexOf(evt.keyCode) > -1 || (evt.keyCode >= W.KEY.NUM_0 && evt.keyCode <= W.KEY.NUM_9))
        		return true;
        	else
        		return false;
        }
    });
    return WPopup;
});