/**
 * this framework is based on requireJS and wind3.
 * RequireJS is used for AMD.
 * Wind3 is for Class structure.(support extend.. etc)
 *   
 */

'use strict';
/**
 *  The base global object for tv app.
 *  @class W
 */
(function(){
	
	var global = Function('return this')();
    /* create W object to Window object */
    global.W = {};
    
    W.id = 0; //generated id by object creation. whenever object be created, number be increased .
    W.TEMPLET = {};
    var modules = {};
	var classGenerators = {};
    var classes = {};
	var op = Object.prototype;
	var toString = op.toString;
	
	/**
	 * Define a object using AMD(using requireJS)
	 * @method defineModule
	 * @param {String} name module name, if none, source file path is name
	 * @param {Array} deps dependency
	 * @param {function} callback callback function
	 */
	W.defineModule = function(name, deps, callback) {
		if (typeof(name) === 'string')
			W.log.info("defineModule " + name);
    	define(name, deps, callback);
    };

	Object.defineProperty(W, "define", {
        writable:false, configurable:false,
        value: function(name) {
            var dependency, generator;
            /* argument validation */
            if(arguments.length > 3) {
                throw "Wrong number of arguments, 2 or 3 is acceptable!";
            }
            for(var i = 1; i < arguments.length; i ++) {
                if(typeof(arguments[i]) === 'string') {
                    dependency = [arguments[i]];
                }
                if(typeof(arguments[i]) === 'object' &&
                    arguments[i] instanceof Array) {
                    dependency = arguments[i];
                }
                if(typeof(arguments[i]) === 'function') {
                    generator = arguments[i];
                    break;
                }
            }
            /* ensures array type of dependency */
            if(dependency === undefined) {
                dependency = [];
            }

            /* makes record data with dependency */
            var tuple = [dependency, generator];
            classGenerators[name] = tuple;

            Object.defineProperty(W, name, {
                configurable: false,
                get: function() {
                    return W.getClass(name);
                },
                set: function(value) {
                    throw new Error("set property is not allowed!");
                }
            });
        }
    });
	
	Object.defineProperty(W, "clone", {
		writable:false, configurable:false,
		value: function(obj) {
			//W.log.info("clone : start " + Date.now());
			var clone, property, value;
			  if (!obj || typeof obj !== 'object') {
			    return obj;
			  }
			  if (Object.prototype.toString.call(obj) !== '[object Array]') {
				  clone = {};
				  clone.__proto__ = obj.__proto__;
				  //W.log.inspect(obj);
				  for (property in obj) {
				    if (obj.hasOwnProperty(property)) {
				    	//W.log.info("W.clone key " + property);
				    	value = obj[property];
				      	//W.log.info("W.clone value " + (obj[property]));
				      if (value && typeof value === 'object' && value.toString().indexOf("HTML") == -1) {
				    	  //W.log.info("W.clone self call ");
				    	  clone[property] = W.clone(value);
				      } else {
				    	  clone[property] = obj[property];
				      }
				    }
				  }
			  } else {
				  clone = obj.slice(0);
				  for (var index in clone) {
					  clone[index] = W.clone(obj[index]);
				  }
			  }
			  //W.log.info("clone : end " + Date.now());
			  return clone;
		}
	})
	
    Object.defineProperty(W, "getClass", {
        writable:false, configurable:false,
        value: function(name) {
            var loadClass = function(name) {
                var tuple = classGenerators[name];
                if(tuple === undefined) {
                    throw "Class("+name+") does not exist!";
                }

                var dependencies = tuple[0];
                var generator = tuple[1];
                var cl = [];
                for(var i = 0; i < dependencies.length; i++) {
                    var dep = dependencies[i];
                    if(classes[dep] === undefined) {
                        W.getClass(dep);
                    }
                    cl.push(classes[dep]);
                }

                classes[name] = generator.apply(this, cl);
            }

            if(classes[name] === undefined) {
                loadClass(name);
            }
            return classes[name];
        }
    });
	
	/**
	 * create a new component from Templet
	 * @method createTemplet
	 * @param {String} name templet name
	 */
	Object.defineProperty(W, "createTemplet", {
        writable:false, configurable:false,
        value: function(name) {
            if (W.TEMPLET.hasOwnProperty("templet/"+name)) {
            	var obj = W.clone(W.TEMPLET["templet/"+name]);
            	if (obj.comp) {
            		obj.comp = obj.comp.cloneNode();
            	}
            	obj.pid = W.id++;
            	

            	if (obj && obj.templet)
            		obj.templet = undefined;
            	
            	/**
            	 *  children components
            	 */ 
            	 if (obj.children) {
            		 for (var i in obj.children.key) {
            			 obj.children.obj[i] = W.cloneComponent(obj.children.obj[i]);
            			 obj.comp.appendChild(obj.children.obj[i].comp);
            		 }
            	 }
            	
            	return obj;
            } else {
            	throw "TEMPLET(templet/"+name+") does not exist!";
            }
        }
    });
	
	/**
	 * return module
	 * @method getModule
	 * @param {String} name module name
	 */
	Object.defineProperty(W, "getModule", {
        writable:false, configurable:false,
        value: function(name) {
            if (modules.hasOwnProperty(name)) {
            	return modules[name];
            } else {
            	throw "MODULE("+name+") does not exist!";
            }
        }
    });
	Object.defineProperty(W, "setModule", {
        writable:false, configurable:false,
        value: function(name, module) {
            if (name, module)
            	modules[name] = module;
        }
    });
	
	/**
	 * create a new Component by Clone
	 * @method cloneComponent
	 * @param {Component} comp 
	 */
	Object.defineProperty(W, "cloneComponent", {
        writable:false, configurable:false,
        value: function(_comp) {
        	var obj;
        	obj = W.clone(_comp);
        	obj.pid = W.id++;
        	if (_comp.comp) {
        		obj.comp = _comp.comp.cloneNode();
        	}
        	if (_comp.comp.textContent && 
        			_comp.comp.textContent == _comp.comp.firstChild.textContent)
        		obj.comp.textContent = _comp.comp.textContent;
			
        	if (obj.children.length > 0) {
        		for (var i in obj.children.key) {
       			 	obj.children.obj[i] = W.cloneComponent(obj.children.obj[i]);
       			 	obj.comp.appendChild(obj.children.obj[i].comp);
       		 	}
        	}
        	return obj;
        }
    });
    
    /**
     * define Key Code
     * @class W.KEY
     */
    Object.defineProperty(W, 'KEY', {
        writable:false, configurable:false,
        value: {
        	/** 
        	 * @property BACK_SPACE 
        	 * @type NUMBER 
        	 * @static 
        	 */
            BACK_SPACE : 8,
            /** 
        	 * @property ENTER 
        	 * @type NUMBER 
        	 * @static 
        	 */
            ENTER : 10,
            /** 
        	 * @property PAGE_UP 
        	 * @type NUMBER 
        	 * @static 
        	 */
            PAGE_UP : 33,
            /** 
        	 * @property PAGE_DOWN 
        	 * @type NUMBER 
        	 * @static 
        	 */
            PAGE_DOWN : 34,
            /** 
        	 * @property HOME 
        	 * @type NUMBER 
        	 * @static 
        	 */
//            HOME : 36,
            HOME : 72,
            /** 
        	 * @property LEFT 
        	 * @type NUMBER 
        	 * @static 
        	 */
            LEFT : 37,
            /** 
        	 * @property UP 
        	 * @type NUMBER 
        	 * @static 
        	 */
            UP : 38,
            /** 
        	 * @property RIGHT 
        	 * @type NUMBER 
        	 * @static 
        	 */
            RIGHT : 39,
            /** 
        	 * @property DOWN 
        	 * @type NUMBER 
        	 * @static 
        	 */
            DOWN : 40,
            /** 
        	 * @property NUM_0 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_0 : 48,
            /** 
        	 * @property NUM_1 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_1 : 49,
            /** 
        	 * @property NUM_2 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_2 : 50,
            /** 
        	 * @property NUM_3 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_3 : 51,
            /** 
        	 * @property NUM_4 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_4 : 52,
            /** 
        	 * @property NUM_5 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_5 : 53,
            /** 
        	 * @property NUM_6 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_6 : 54,
            /** 
        	 * @property NUM_7 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_7 : 55,
            /** 
        	 * @property NUM_8 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_8 : 56,
            /** 
        	 * @property NUM_9 
        	 * @type NUMBER 
        	 * @static 
        	 */
            NUM_9 : 57,
            /** 
        	 * @property STAR 
        	 * @type NUMBER 
        	 * @static 
        	 */
            STAR : 122,
            /** 
        	 * @property DELETE 
        	 * @type NUMBER 
        	 * @static 
        	 */
            DELETE : 67,
            /** 
        	 * @property COLOR_KEY_R 
        	 * @type NUMBER 
        	 * @static 
        	 */
            COLOR_KEY_R : 403,
            /** 
        	 * @property COLOR_KEY_G 
        	 * @type NUMBER 
        	 * @static 
        	 */
            COLOR_KEY_G : 405,
            /** 
        	 * @property COLOR_KEY_Y 
        	 * @type NUMBER 
        	 * @static 
        	 */
            COLOR_KEY_Y : 404,
            /** 
        	 * @property COLOR_KEY_B 
        	 * @type NUMBER 
        	 * @static 
        	 */
            COLOR_KEY_B : 406,
            /** 
        	 * @property POWER 
        	 * @type NUMBER 
        	 * @static 
        	 */
            POWER : 409,
            /** 
        	 * @property STOP 
        	 * @type NUMBER 
        	 * @static 
        	 */
            STOP : 413,
            /** 
        	 * @property PLAY 
        	 * @type NUMBER 
        	 * @static 
        	 */
            PLAY : 415,
            /** 
        	 * @property FAST_FWD 
        	 * @type NUMBER 
        	 * @static 
        	 */
            FAST_FWD : 417,
            /** 
        	 * @property FAST_BWD 
        	 * @type NUMBER 
        	 * @static 
        	 */
            FAST_BWD : 412,
            /** 
        	 * @property CHANNEL_UP 
        	 * @type NUMBER 
        	 * @static 
        	 */
            CHANNEL_UP : 427,
            /** 
        	 * @property CHANNEL_DOWN 
        	 * @type NUMBER 
        	 * @static 
        	 */
            CHANNEL_DOWN : 428,
            /** 
        	 * @property VOLUME_UP 
        	 * @type NUMBER 
        	 * @static 
        	 */
//            VOLUME_UP : 447,
            VOLUME_UP : 81,
            /** 
        	 * @property VOLUME_DOWN 
        	 * @type NUMBER 
        	 * @static 
        	 */
//            VOLUME_DOWN : 448,
            VOLUME_DOWN : 65,
            /** 
        	 * @property MUTE_TOGGLE 
        	 * @type NUMBER 
        	 * @static 
        	 */
            MUTE_TOGGLE : 449,
            /** 
        	 * @property EXIT 
        	 * @type NUMBER 
        	 * @static 
        	 */
            //  OCAP
            EXIT : 601,
            /** 
        	 * @property MENU 
        	 * @type NUMBER 
        	 * @static 
        	 */
//            MENU : 602,
            MENU : 72,
            /** 
        	 * @property BACK 
        	 * @type NUMBER 
        	 * @static 
        	 */
            BACK :  607,
            //BACK : 27, 		//pc 테스트용
            /** 
        	 * @property FORWARD 
        	 * @type NUMBER 
        	 * @static 
        	 */
            FORWARD :  609,
            SWITCH_CHARSET : 95
        } 
    });
    
    Object.defineProperty(W, "startApp", {
        writable:false, configurable:false, 
        value: function(scene) {
        	W.body = document.getElementsByTagName("body")[0];
			W.frag = document.createDocumentFragment();
			W.root = new W.Div({width:1280, height:720, overflow:"hidden"});
			W.bg = new W.Div({width:1280, height:720, overflow:"hidden"});
			W.root.add(W.bg);
			W.body.appendChild(W.root.comp);
			
        	var _sceneManager = W.getClass("SceneManager");
        	var _keyHandler = W.getClass("KeyHandler");
        	document.addEventListener("keydown", _keyHandler.keyDown);
        	_sceneManager.init();
        	_sceneManager.startScene(scene);
        }
    });
    
	function isArray(it) {
	    return toString.call(it) === '[object Array]';
	}
	function tryCall(self, method /*,... */) {
        try {
            if (typeof(method)==='string')
                return self[method].apply(self, Array.prototype.slice.call(
                        arguments, 2));
            else if (typeof(method)==='function')
                return method.apply(self, Array.prototype.slice.call(
                        arguments, 2));
        } catch(e) {
            W.log.info('stack:' + e.stack);
        }
	}
})();

/**
 * Log class
 *
 * @class W.log
 * @static
 * @for W
 */
(function() {
    var ERROR = 0;
    var WARN = 1;
    var INFO = 2;
    var DEBUG = 3;
    var TRACE = 4;
    var funcs = ["error", "warn", "log", "log", "log"];
    var marks = ["!", "?", "#", " ", " "];

    var print = function (lvl) {
		return;
        return function (o) {
            if ((W.Config && !W.Config.IS_LOG) || this.level < lvl) return;
            var f = funcs[lvl] || "error";
            var prefix = marks[lvl] + " " + this.name+": ";
            console[f](prefix+o);
            if (typeof(o) !== "object") return;
            if (o.name) {
                console[f](prefix+"    name: "+o.name);
            }
            if (o.message) {
                console[f](prefix+"    message: "+o.message);
            }
            if (o.stack) {
                console[f](prefix+"    stack: "+o.stack);
            }
        };
    }

    var inspect = function(o) {
    	console.log(o);
//        var msg = "";
//        if (o instanceof Array ) {
//        	console.log(o);
//        } else {
//        	for (var k in o) {
//	            if (o.hasOwnProperty(k)) {
//	                msg+= k+" = "+o[k]+"\n";
//	            }
//	        }
//	        console.log(msg);
//        }
    }

    var logRoot = {
        /**
         * Log level constant.
         *
         * @property ERROR
         * @type Number
         * @default 0
         * @for W.log.info
         */
        ERROR: ERROR,
        /**
         * Log level constant.
         *
         * @property WARN
         * @type Number
         * @default 1
         * @for W.log.info
         */
        WARN: WARN,
        /**
         * Log level constant.
         *
         * @property INFO
         * @type Number
         * @default 2
         * @for W.log.info
         */
        INFO: INFO,
        /**
         * Log level constant.
         *
         * @property DEBUG
         * @type Number
         * @default 3
         * @for W.log.info
         */
        DEBUG: DEBUG,
        /**
         * Log level constant.
         *
         * @property TRACE
         * @type Number
         * @default 4
         * @for W.log.info
         */
        TRACE: TRACE,
        /**
         * This Log object's verbosity level. INFO by default.
         *
         * @property level
         * @type Number
         * @default INFO
         * @for W.log.info
         */
        level: INFO,
        name: "",
        /**
         * Creates another log object inherited from this.
         *
         * @method spawn
         * @param {String} mod Module name.
         * @param {log level constant} lvl Value for specifying log level.
         * @return {Log} Returns a new Log object.
         * @for W.log.info
         */
        spawn: function (mod, lvl) {
            var log = Object.create(this);
            log.name = this.name + mod;
            if (lvl) {
                log.level = lvl;
            }
			this.setLevel(log.level);
            return log;
        },
        /**
         * Prints log as ERROR log level.
         *
         * @method error
         * @param {String} o If not object type, return silently.
         * @for W.log.info
         */
        error: print(ERROR),
        /**
         * Prints log as WARN log level.
         *
         * @method warn
         * @param {String} o If not object type, return silently.
         * @for W.log.info
         */
        warn: print(WARN),
        /**
         * Prints log as INFO log level.
         *
         * @method info
         * @param {String} o If not object type, return silently.
         * @for W.log.info
         */
        info: print(INFO),
        /**
         * Prints log as DEBUG log level.
         *
         * @method debug
         * @param {String} o If not object type, return silently.
         * @for W.log.info
         */
        debug: print(DEBUG),
        /**
         * Prints log as TRACE log level.
         *
         * @method trace
         * @param {String} o If not object type, return silently.
         * @for W.log.info
         */
        trace: print(TRACE),
        /**
         * Returns details on the given object.
         *
         * @method inspect
         * @param {Object} o Object to be inspected.
         * @for W.log.info
         */
        inspect: inspect,
		setLevel : function(level){
			if(LOG == false) {
				level = -1;
			}
			this.level = level;
			level = level !=undefined ? level : INFO;
			this.error = (W.Config && !W.Config.IS_LOG) || (level < ERROR) ? function() {return;} : console.error;
			this.warn = (W.Config && !W.Config.IS_LOG) || (level < WARN) ? function() {return;} : console.warn;
			this.info = (W.Config && !W.Config.IS_LOG) || (level < INFO) ? function() {return;} : console.log;
			this.debug = (W.Config && !W.Config.IS_LOG) || (level < DEBUG) ? function() {return;} : console.log;
			this.trace = (W.Config && !W.Config.IS_LOG) || (level < TRACE) ? function() {return;} : console.log;
		}
    };
    Object.defineProperty(W, "log", {
        writable:false, configurable:false,
        value:logRoot.spawn("webtv", LOG_LEVEL)});
})();
/*
 *  A class for utility functions.
 *
 *  @class W.Util
 */
/* global W */
(function() {
    "use strict";
    W.define("Util", function() {
        var WUtil = {};
        /**
         *  Returns `true` if `n` is finite numeric value.
         *  @method isNumeric
         *  @param {?} n an object or primitive.
         *  @return {boolean} `true` if `n` is a finite `number`, `string` or
         *  `String` that represents a finite number or a finite `Number`
         *  object.
         *  @static
         *  @private
         */
        WUtil.isNumeric = function(n) {
            if (typeof n === "object" && n instanceof String)
                n = n.valueOf();
            if (typeof n === "string")
                return !isNaN(parseFloat(n)) && isFinite(n);

            if (typeof n === "object" && n instanceof Number)
                n = n.valueOf();
            else if (typeof n !== "number")
                return false;

            return !isNaN(n) && isFinite(n);
        };
        
        WUtil.changeDigit = function(num,digit) {
        	var _tmpStr = "";
    		if(num.toString().length<digit){
    			for(var i=0;i<(digit-num.toString().length);i++){
    				_tmpStr+="0";
    			}
    		}
    		return _tmpStr+num;
        };
        
        WUtil.getParameter = function(strParamName) {
        	var arrResult = null;
            if (strParamName)
                arrResult = location.search.match(new RegExp("[&?]" + strParamName
                        + "=(.*?)(&|$)"));
            return arrResult && arrResult[1] ? decodeURI(arrResult[1]) : null;
        };
        
        var stripComma = function(str) {
            var re = /,/g;
            return str.replace(re, "");
        }
        
        WUtil.formatComma = function(num, pos) {
        	if(!num){
                return num;
            }else{
                if (!pos) 
                    pos = 0;  //소숫점 이하 자리수
                var re = /(-?\d+)(\d{3}[,.])/;
           
                var strNum = stripComma(num.toString());
                var arrNum = strNum.split(".");
           
                arrNum[0] += ".";
           
                while (re.test(arrNum[0])) {
                    arrNum[0] = arrNum[0].replace(re, "$1,$2");
                }
           
                if (arrNum.length > 1) {
                    if (arrNum[1].length > pos) {
                        arrNum[1] = arrNum[1].substr(0, pos);
                    }
                    return arrNum.join("");
                } else {
                    return arrNum[0].split(".")[0];
                }    
            }
        };
        
        var padleft = function(src, length, str){
        	return src.length >= length ? src : (new Array(Math.ceil((length - src.length) / str.length) + 1).join(str)).substr(0, (length - src.length)) + src;
    	 };
    	 
    	WUtil.getLong = function(arr) {
    		var highBinary = arr[0] >> 32;
    	    var lowBinary = arr[1] >> 32;

    	    var binary = padleft((highBinary >>> 0).toString(2), 32, "0") +
    	    padleft((lowBinary >>> 0).toString(2), 32, "0");
    	    	
    	    return parseInt(binary, 2);
        };
         
        WUtil.getLongToArray = function(no) {
        	var highBinary = Math.floor(no/4294967296);
         	var lowBinary = no - (4294967296 * highBinary);
         	return [highBinary, lowBinary];
        };

        var STACK_SUPPORTED = (new Error()).stack !== undefined;
        var decorate = STACK_SUPPORTED ? function(msg) {
            return (new Error(msg)).stack;
        } : function(msg) {
            return "Error : " + msg;
        };

        /**
         *  Logs error message `msg` and return `true` if `expr` is `true`.
         *
         *      if (WUtil.error(isNaN(value), "not a number"))
         *          return;
         *
         *  Multiple `expr` and `msg` pair can passed.
         *
         *      if (WUtil.error(isNaN(value), "not a number",
         *              !isFinite(value), "infinite value"))
         *          return;
         *
         *  If single argument is passed, the function assumes the argument
         *  is `msg` and `expr` is `true`.
         *
         *      WUtil.error("shall not reach here.")
         *
         *  @method error
         *  @param {boolean} expr* a boolean expression.
         *  @param {string} msg* error message.
         *  @static
         *  @private
         */
        WUtil.error = function (/* expr, msg, expr, msg... */) {
            if (arguments.length===1) {
                W.log.error(decorate(arguments[0]));
                return true;
            }
            for (var i=0; i<arguments.length; i+=2) {
                if (arguments[i]) {
                    W.log.error(decorate(arguments[i+1]));
                    return true;
                }
            }
            return false;
        };

        WUtil.warn = function (msg) {
            W.log.warn(decorate(msg));
        };

        /**
         *  @method isFloat16
         *  @param {?} obj An array-like object.
         *  @static
         *  @private
         */
        WUtil.isFloat16 = function(obj) {
            var i=0, length=obj.length;
            if (length!==16)
                return false;
            for (i=0; i<length; ++i)
                if (!WUtil.isNumeric(obj[i]))
                    return false;
            return true;
        };

        WUtil.tryCall = function(self, method /*, ... */ ) {
            try {
                if (typeof(method)==='string')
                    return self[method].apply(self, Array.prototype.slice.call(
                            arguments, 2));
                else if (typeof(method)==='function')
                    return method.apply(self, Array.prototype.slice.call(
                            arguments, 2));
            } catch(e) {
                W.log.error('stack:' + e.stack);
            }
        };

        return WUtil;
    });
}());
/**
 * Base class for extendable classes.
 * this function is based on wind framework.
 *
 * @class W.Class
 * @constructor
 */
W.define("Class", function() {
    "use strict";
    var initializing = false;
    var WClass = function(){};

    function extend(prop) {
        var superClass = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        var superImpl = function(name) {
            var superProp = superClass[name];
            return typeof(superProp)==='function' ?
                    superProp.apply(this,
                    Array.prototype.slice.call(arguments, 1)) :
                    superProp;
        };

        for (var name in prop) {
            if (typeof(prop[name])==='function') {
                prototype[name] = (function(name) {
                    return function() {
                        var tmp = this._super;
                        this._super = superImpl;
                        //W.log.info("prop[name]" + prop[name]);
                        var ret = prop[name].apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    }
                })(name);
            } else {
                prototype[name] = prop[name];
            }
        }

        function Class() {
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Object.defineProperty(Class, "extend", {
            enumerable:false, writable:false, configurable:false, value:extend
        });
        return Class;
    }
    
    function tryCall(self, method /*,... */) {
        try {
            if (typeof(method)==='string')
                return self[method].apply(self, Array.prototype.slice.call(
                        arguments, 2));
            else if (typeof(method)==='function')
                return method.apply(self, Array.prototype.slice.call(
                        arguments, 2));
        } catch(e) {
            W.log.info('stack:' + e.stack);
        }
	}

    /**
     * Returns extended class from this class.
     *
     * @example
     *      //Simple extention.
     *
     *      var Extended = WClass.extend({
     *              init: function() {},
     *              test: function(value) { W.log.info("test" + value); }
     *          });
     *
     *      //Simple construction.
     *
     *      var Extended = WClass.extend({
     *              init: function(test) { W.log.info(test); },
     *          });
     *      new Extended("test string");
     *
     *      //Calling with _super.
     *
     *      var Extended2 = Extended.extend({
     *              init: function() { this._super("init"); },
     *              test: function(value) {
     *                  W.log.info("test2" + value);
     *                  this._super("test", value);
     *              }
     *          });
     * @method extend
     * @param {Object} desc The property description.
     * Note that `init` property is used for initialization.
     * @static
     */
    Object.defineProperty(WClass, 'extend', {
        enumerable:false, writable:false, configurable: false, value:extend });
    
    Object.defineProperty(WClass, 'tryCall', {
        enumerable:false, writable:false, configurable: false, value:tryCall });
    
    return WClass;
});

/*
 *  represents an animatable float array property of length 16.
 *  @class W.Float16Property
 *  @constructor
 *  @private
 */
/* global W */
W.define("Float16Property", function() {
    "use strict";
    var WUtil = W.getClass("Util");
    var WClass = W.getClass("Class");
    return WClass.extend({
        __type: "F",
        __size: 16,
        init: function(id) {
            this.__id = id;
        },
        __normalizeConf: function(value) {
            if (value.length===2 && WUtil.isFloat16(value[0]) &&
                    WUtil.isFloat16(value[1]))
                return [value[0], value[1]];
            else if (value.length===1 && WUtil.isFloat16(value[0]))
                return [null, value[0]];
            else if (WUtil.isFloat16(value))
                return [null, value];
            WUtil.error("Wrong conf value: " + value);
            return null;
        },
        __normalizeParam: function(args) {
            if (args.length===2 && WUtil.isFloat16(args[0]) &&
                    WUtil.isFloat16(args[1]))
                return [args[0], args[1]];
            else if (args.length===1 && WUtil.isFloat16(args[0]))
                return [null, args[0]];
            WUtil.error("Wrong arg from:" + args[0] + " to:" + args[1]);
            return null;
        }
    });
});
/*
 *  Represents an animatable float property.
 *
 *  @class W.FloatProperty
 *  @constructor
 *  @private
 */
/* global W */
W.define("FloatProperty", function() {
    "use strict";
    var WUtil = W.getClass("Util");
    var WClass = W.getClass("Class");
    return WClass.extend({
        __type: "F",
        __size: 1,
        init: function(id) {
            this.__id = id;
        },
        __normalizeConf: function(value) {
            if (value.length===2 && WUtil.isNumeric(value[0]) &&
                    WUtil.isNumeric(value[1]))
                return [[value[0]], [value[1]]];
            else if (value.length===1 && WUtil.isNumeric(value[0]))
                return [null, [value[0]]];
            else if (WUtil.isNumeric(value))
                return [null, [value]];
            WUtil.error("Wrong conf value: " + value);
            return null;
        },
        __normalizeParam: function(args) {
            if (args.length===2 && WUtil.isNumeric(args[0]) &&
                    WUtil.isNumeric(args[1]))
                return [args[0], args[1]];
            else if (args.length===1 && WUtil.isNumeric(args[0]))
                return [null, args[0]];
            WUtil.error("Wrong arg from:" + args[0] + " to:" + args[1]);
            return null;
        }
    });
});

W.define('Hash', function() {
	
	var WClass = W.getClass("Class");
	return WClass.extend({

		init : function() {
			this.length = 0;
			this.key = [];
			this.obj = [];
		},
		
	    type : "hash",
	    
		put : function( _key, _obj ) {
		    try {
		    		var ret = this.get(_key);
				if (ret) {
					for (var i = 0 ; i < this.length; i++ ) {
			        		if ( _key == this.key[i]) {
			        			this.obj[i] = _obj;
			        			//W.log.info("W.Hash Exist same id object " + _key);
			        			return;
			        		}
					}
					return;
				}
		        this.key.push( _key);
		        this.obj.push( _obj );
		        this.length++;   
		    } catch( e ) {
		    	W.log.error( e );
		    }
		},

		elementAt : function( i ) {
		    var ret = null;
		    try {
		        i = parseInt( i, 10 );
		        if ( i >= 0 && i < this.length ) {
		            ret = this.obj[i];
		        }
		    } catch( e ) {
		    	W.log.error( e );
		    }
		    return ret;
		},

		get : function( _key ) {
		    var ret = null;
		    try {
		        for (var i = 0 ; i < this.length; i++ ) {
		        		if (_key == this.key[i])
		        			ret = this.obj[i];
		        }
		    } catch( e ) {
		    		W.log.error( e );
		    }
		    return ret;
		},

		insertAt : function( i , _key, _obj) {
		    try {
		        i = parseInt( i, 10 );
		        if( i == this.length ) {
		            this.put( _key , _obj);
		            return;
		        }
		        this.key.splice( i, 0, _key );
		        this.obj.splice( i, 0, _obj );
		        this.length++;
		    } catch( e ) {
		    	W.log.error( e );
		    }
		},

		remove : function( _key ) {
		    var ret = null;
		    try {
		        for (var i = 0 ; i < this.length; i++ ) {
		        		if ( _key == this.key[i]) {
			            ret = this.obj[i];
			            this.key.splice( i, 1 );
			            this.obj.splice( i, 1 );
			            this.length--;
		        		}
		        }
		    } catch( e ) {
		    	W.log.error( e );
		    }
		    return ret;
		},

		clear : function() {
			try {
		        this.key = [];
		        this.obj = [];
		        this.length = 0;
		    } catch( e ) {
		    	W.log.error( e );
		    }
		},

		size : function() {
		    return this.length;
		},


		set : function( i, _key, _obj ) {
		    var ret = null;
		    try {
		        i = parseInt( i, 10 );
		        if ( i >= 0 && i < this.length ) {
		            this.key[i] = _key;
		            this.obj[i] = _obj;
		        }
		    } catch( e ) {
		    	W.log.error( e );
		    }
		    return ret;
		}
	});
});

W.define('AppContext', 'Class', function(WClass) {

	var appData = {};
	var tmpData = {};
	
	/**
	 * Singleton Class
	 * @example 
	 * W.AppContext.setAppData(key, value);
	 * W.AppContext.getAppData(key);
	 * @class W.AppContext
	 */
	var _appContext = WClass.extend({
		
		/**
		 * @method setTmpData
		 * @param {String} key key of data
		 * @param {Object} value value of data 
		 */
		setTmpData : function(key, value) {
			if (!tmpData.hasOwnProperty(key)) {
				tmpData[key] = value;
			}
		},
		
		/**
		 * After called getTmpData, key and value will be deleted.
		 * @method getTmpData
		 * @param {String} key key of data
		 * @return {Object}
		 */
		getTmpData : function(key) {
			if (tmpData.hasOwnProperty(key)) {
				var res = tmpData[key];
				delete tmpData[key];
				return res;
			}
		},
		
		/**
		 * @method setAppData
		 * @param {String} key key of data
		 * @param {Object} value value of data 
		 */
		setAppData : function(key, value) {
			if (!appData.hasOwnProperty(key)) {
				appData[key] = value;
			}
		},
		
		/**
		 * Even called getAppData, key and value will be keeped.
		 * @method getAppData
		 * @param {String} key key of data
		 * @return {Object}
		 */
		getAppData : function(key) {
			if (appData.hasOwnProperty(key)) {
				return appData[key];
			}
		},
		
		/**
		 * @method removeAppData
		 * @param {String} key key of data
		 */
		removeAppData : function(key) {
			if (appData.hasOwnProperty(key)) {
				delete appData[key];
			}
		}
	});
	var WAppContext = new _appContext();
	return WAppContext;
});

W.define("ICurve", "Class", function(WClass){
	
	var _iCurve = WClass.extend({
		BASE_LINEAR : 0, 
    	BASE_SINE : 1, 
    	BASE_QUAD : 2, 
    	BASE_CUBIC : 3, 
    	BASE_QUART : 4, 
    	BASE_QUINT : 5,
    	BASE_EXPO : 6,
    	BASE_CIRCLE : 7,
    	BASE_ELASTIC : 8,
    	BASE_BACK : 9,
    	BASE_BOUNCE : 10,
    	BASE_END : 11,
    	EASE_IN : 0,
    	EASE_OUT : 1,
    	EASE_IN_OUT : 2, 
    	EASE_OUT_IN : 3, 
    	EASE_END : 4, 
    	SYSTEM_CURVE_ID_START : 0, 
    	SYSTEM_CURVE_ID_END : 44
	});
	var ICurve = new _iCurve();
	return ICurve;
});
W.define("Curve", function() {
    "use strict";

    var WClass = W.getClass("Class");
    var error = W.getClass("Util").error;
    var ICurve = W.getClass("ICurve");

    var bases = {
        "linear"    : ICurve.BASE_LINEAR,
        "sine"      : ICurve.BASE_SINE,
        "quad"      : ICurve.BASE_QUAD,
        "cubic"     : ICurve.BASE_CUBIC,
        "quart"     : ICurve.BASE_QUART,
        "quint"     : ICurve.BASE_QUINT,
        "expo"      : ICurve.BASE_EXPO,
        "circle"    : ICurve.BASE_CIRCLE,
        "elastic"   : ICurve.BASE_ELASTIC,
        "back"      : ICurve.BASE_BACK,
        "bounce"    : ICurve.BASE_BOUNCE
    };

    var easings = {
        ""              : ICurve.EASE_OUT,
        ">"             : ICurve.EASE_OUT,
        "<"             : ICurve.EASE_IN,
        "><"            : ICurve.EASE_OUT_IN,
        "<>"            : ICurve.EASE_IN_OUT,
        "-ease-in"      : ICurve.EASE_IN,
        "-ease-out"     : ICurve.EASE_OUT,
        "-ease-in-out"  : ICurve.EASE_IN_OUT,
        "-ease-out-in"  : ICurve.EASE_OUT_IN
    };

    var PREDEFINED_START = 0;
    var PREDEFINED_END = 44;

    function makeID(name) {
        var result = name.match(
        /^([a-z]+)(<>|><|<|>|-ease-in-out|-ease-out-in|-ease-in|-ease-out)$/);
        //if (error(!result, "Bad curve:"+name))
		if (!result)
            return -1;
        var base = result[1];
        if (base==="linear")
            return ICurve.BASE_LINEAR;
        var easing = result[2];
        //console.log("result : " + JSON.stringify(result));
        //console.log("WCurve makeID : "+(bases[base]*ICurve.EASE_END + easings[easing]))
        return bases[base]*ICurve.EASE_END+ easings[easing];
    }

    var nextID = 0;

    /*
     *  Represents a curve for an animation.
     *  @class W.Curve
     *  @constructor
     *  @param {number|WMap} An arg ID number or WMap instance.
     *  @private
     */
    var WCurve = WClass.extend({
        
        init: function(arg) {
            if (typeof arg === "number" && PREDEFINED_START<= arg &&
                    arg < PREDEFINED_END)
                this.__id = arg;
            else
                this.__id = nextID++;
        }
    });

    /**
     *  @method __from
     *  @param {W.Curve|string} arg A WCurve instance or curve name string.
     *  @return arg if arg is a WCurve instance.
     *          matching WCurve if arg is curve name string.
     *          expo curve otherwise.
     *  @static
     *  @private
     */
    WCurve.__from = function(arg) {
        if (arg instanceof WCurve)
            return arg;
        var id = makeID(arg);
        return id>=0 ? new WCurve(id) : null;
    };
    return WCurve;
});

W.define("IAnimation", "Class", function(WClass){
	
	var _iAnimation = WClass.extend({
    	REASON_ENDED : 0,
    	REASON_STOPPED : 1,
    	INFINITY : 2147483647
	});
	
	var IAnimation = new _iAnimation();
	return IAnimation;
});

/* global W */
W.define("Animation", function() {
    "use strict";
    var WClass = W.getClass("Class");
    var WUtil = W.getClass("Util");
    var error = WUtil.error;
    var IAnimation = W.getClass("IAnimation");
    var IComponent = W.getClass("IComponent");
    
    var nextID = 0;

    /**
     * 
     * @class W.Animation
     * @constructor
     */
    var WAnimation = WClass.extend({
    	
        init: function() {
            this.__id = nextID++;
            this.__running = false;
        },
        __start: function(spec, conf) {
            //  TODO: check argument
            var repeat = 1,
                startPos = 0,
                name = "",
                onTerm;
            if (conf) {
                if (conf.repeat!==undefined)
                    repeat = conf.repeat;
                if (conf.startPos!==undefined)
                    startPos = conf.startPos;
                if (conf.name!==undefined)
                    name = conf.name;
                if (conf.onTerm!==undefined) {
                    onTerm = {
                        onTermination : function(id, reason) {
                            conf.onTerm();
                        }
                    };
                }
            }
            if (repeat>=IAnimation.INFINITY)
                repeat = IAnimation.INFINITY;
            this._start(spec, repeat, startPos, name, onTerm);
            this.__running = true;
        },
        /**
         *  Stops this animation. 
         *  @method stop
         */
        stop: function() {
            if (error(this.__running===false, "not running"))
                return;
            this._stop();
            
            this.__running=false;
        },
        /**
         *  @method end
         *  @private
         */
        end: function() {
            if (error(this.__running===false, "not running"))
                return;
            this._end();
            
            this.__running=false;
        },
        
    	_start : function(aSpec, repeat, startPos, name, onTerm) {
    		
    		W.log.info("Animation _start");
    		var totalDuration = 0;
    		
    		if (repeat == IAnimation.INFINITY) {
    			//this.__spec = {};
    			//this.__spec.__group = [];
    			var duration  = 0;
    			for (var i=0; i<aSpec.__group.length; i++)  {
    				duration += aSpec.__group[i].duration;
    				//this.__spec.__group[i] = W.__web.clone(aSpec.__group[i]);	
    			}
    			
    			this.__spec = {};
    			this._startAnimation(aSpec);
    			if (duration) {
    				var _this = this;
    				this.__spec.infinityTimer = setInterval(function() {
    					if(aSpec.__state == "HAS_GROUP"){
    						_this._startAnimation(aSpec);
    					}
    					else {
    						if(_this.__spec.infinityTimer) clearInterval(_this.__spec.infinityTimer);
    					}
    				}, duration);
    				aSpec.infinityTimer = this.__spec.infinityTimer;
    				this.__spec.onTerm = onTerm;
    				
    				W.log.info("program start inifinity ");
    			}
    			
    			return;
    		}
    		
    		if (this.paused) {
//    			for (var i =0; i<stack.length; i++) {
    //
//    			}
    			this.paused = false;
    			return;
    		}
    		
    		totalDuration = this._startAnimation(aSpec);
    		
    		//console.log("Program start END ");
    		//}, 1);
    		//TODO In case of repeat inifinity, run onTerm  
    		W.log.info("start onTerm " + repeat);
    		if (onTerm && repeat != "Infinity") {
    			aSpec.onTerm = setTimeout(function(term) {
    				term.onTermination();
    			}, totalDuration, onTerm); 
    		}
    	},
    	
    	_stop : function() {
    		W.log.info("Animation stop : ");
    		
    		
    		if (this.__spec.infinityTimer) {
    			clearInterval(this.__spec.infinityTimer);
    			if (this.__spec.onTerm && this.__spec.onTerm.onTermination) {
    				this.__spec.onTerm.onTermination();
    				W.log.info("Animation Stop onTerm ")
    			}
    		}
    		W.log.info("Animation stop end");
    		//this.paused = true;
    	},
    	
    	_end : function() {
    		
    		this.stop();
    		
    		W.log.info("Animation end");
    	},
    	
    	_startAnimation : function(aSpec) {
    		var _this = this;
    		var domStack;
    		var totalDuration = 0;
    		
    		W.log.info("aSpec.__group ");
    		
    		// stack.dom.style.webkitTransform reset
    		for(var a=0; a<aSpec.__group.length; a++) {
    			var ps = aSpec.__group[a];
    			for (var i =0; i<ps.stack.length; i++) {
    				for (var j=0; j<ps.stack[i].ids.length; j++) {
    					domStack = ps.stack[i].stacks[j];
    					for (var k=0; k<domStack.length; k++) {
    						domStack[k].dom.style.webkitTransform = "";
    						domStack[k].dom.style.webkitTranstion = "";
    					}
    				}
    			}
    		}
    		for(var a=0; a<aSpec.__group.length; a++) {
    			var ps = aSpec.__group[a];
    			
    			for (var i =0; i<ps.stack.length; i++) {
    				
    				for (var j=0; j<ps.stack[i].ids.length; j++) {
    					domStack = ps.stack[i].stacks[j];
    					
    					////////////////////////////////////////////////////////////////////////////////////////////////////
    					setTimeout(  function(stack) {
    						var hasFrom = false;
    						var transformFrom = "";
    						stack[0].dom.style.webkitTransitionDelay = "0ms";
    						for (var k=0; k<stack.length; k++) {
    							if (stack[k].from != null) {
    								hasFrom = true;
    								//W.log.info("has From");
    								if (stack[k].id == IComponent.PROPERTY_ROTATION_DEGREE) {
    									transformFrom += "rotate("+(-parseInt(stack[k].from[0])) +"deg)";
    								}else if (stack[k].id == IComponent.PROPERTY_SCALE_X) {
    									transformFrom += "scaleX("+stack[k].from[0] +")";
    								}else if (stack[k].id == IComponent.PROPERTY_SCALE_Y) {
    									transformFrom += "scaleY("+stack[k].from[0] +")";
    								}else if (stack[k].id == IComponent.PROPERTY_TRANSLATE_X) {
    									transformFrom += "translateX("+stack[k].from[0] +"px)";
    								}else if (stack[k].id == IComponent.PROPERTY_TRANSLATE_Y) {
    									transformFrom += "translateY("+stack[k].from[0] +"px)";
    								}else {
    									_this._setAnimationStyle(stack[k], stack[k].id, stack[k].from, true);
    								}
    							}
    						}
    						if (transformFrom) 
    							_this._setAnimationStyle(stack[0], 
    									IComponent.PROPERTY_ROTATION_DEGREE,  "", true, transformFrom);
    							
    						if (hasFrom) {
    							stack[0].dom.style.webkitTransitionDuration = "0ms";
    							stack[0].dom.clientHeight; //媛���� repaint
    						}
    							
    						if (!stack[0].duration || stack[0].duration == 0)
    							stack[0].dom.style.webkitTransitionDuration = "0ms";
    						else {
    							stack[0].dom.style.webkitTransitionDuration = stack[0].duration+"ms";
    						}
    						
    						var transformTo = "";
    						for (var k=0; k<stack.length; k++) {
    							if (stack[k].id == IComponent.PROPERTY_ROTATION_DEGREE) {
    								transformTo += "rotate("+(-parseInt(stack[k].to[0])) +"deg)";
    							}else if (stack[k].id == IComponent.PROPERTY_SCALE_X) {
    								transformTo += "scaleX("+stack[k].to[0] +")";
    							}else if (stack[k].id == IComponent.PROPERTY_SCALE_Y) {
    								transformTo += "scaleY("+stack[k].to[0] +")";
    							}else if (stack[k].id == IComponent.PROPERTY_TRANSLATE_X) {
    								transformTo += "translateX("+stack[k].to[0] +"px)";
    							}else if (stack[k].id == IComponent.PROPERTY_TRANSLATE_Y) {
    								transformTo += "translateY("+stack[k].to[0] +"px)";
    							}else {
    								_this._setAnimationStyle(stack[k], stack[k].id, stack[k].to, false);
    							}
    						}
    						if (transformTo) {
    							_this._setAnimationStyle(stack[0], 
    									IComponent.PROPERTY_ROTATION_DEGREE,  "", false, transformTo);
    						}
    							
    					}, domStack[0].delay, domStack);
    					////////////////////////////////////////////////////////////////////////////////////////////////////
    					totalDuration = domStack[0].delay + domStack[0].duration;
    				}
    			}
    		}
    		return totalDuration;
    	},
    	
    	_setAnimationStyle : function(stack, id, value, isFrom, transform) {
    		switch(id) {
    		case IComponent.PROPERTY_X :
    			var left;
    			if (isFrom && stack.dom.style.left == value[0]+"px")
					left = (value[0]+1) + "px";
				else
					left = value[0] + "px";
    			
    			stack.dom.style.left = left;
    			break;
    		case IComponent.PROPERTY_Y :
    			var top;
    			if (isFrom && stack.dom.style.top == value[0]+"px")
					top = (value[0]+1) + "px";
				else
					top = value[0] + "px";
    			
    			stack.dom.style.top = top;
    			break;
    		case IComponent.PROPERTY_SCALE_X : 
    		case IComponent.PROPERTY_SCALE_Y :
    		case IComponent.PROPERTY_TRANSLATE_X : 
    		case IComponent.PROPERTY_TRANSLATE_Y :
    		case IComponent.PROPERTY_ROTATION_DEGREE :
    			stack.dom.style.webkitTransform = transform;
    			break;
    		case IComponent.PROPERTY_OPACITY:
    			var opacity;
    			if (isFrom && stack.dom.style.opacity == "" && value[0] == 1) {
					opacity = 0.99;
				} else if (isFrom && stack.dom.style.opacity == ""+value[0] && value[0] == 0) {
					opacity = 0.01;
				} else if (isFrom && stack.dom.style.opacity == ""+value[0] && value[0] == 1) {
					opacity = 0.99;
				} else if (isFrom && stack.dom.style.opacity == ""+value[0]){
					opacity = Number(value[0]+0.01);
				} else {
					stack.dom.style.opacity = value[0];
				}
    			
    			stack.dom.style.opacity = opacity;
    			break;
    		case IComponent.PROPERTY_WIDTH :
    			var width;
    			if (isFrom && stack.dom.style.width == value[0]+"px") {
					width = (value[0]+1)+"px";
				} else {
					width = value[0]+"px";
				}
    			stack.dom.style.width = width;
    			if (!isFrom)
    				stack.dom.desc["width"] = width;
    			break;
    		case IComponent.PROPERTY_HEIGHT :
    			var height;
    			if (isFrom && stack.dom.style.height == value[0]+"px") {
					height = (value[0]+1)+"px";
				} else {
					height = value[0]+"px";
				}
    			stack.dom.style.height = height;
    			break;
    		}
    	},
    	paused : false
    });
    return WAnimation;
});
W.define("AnimationSpec", function() {
    "use strict";

    var WClass = W.getClass("Class");
    var WComponent = W.getClass("Component");
    var WAnimation = W.getClass("Animation");
    var WUtil = W.getClass("Util");
    var WCurve = W.getClass("Curve");
    var error = WUtil.error;
    
    var nextID = 0;

    /**
     *  Represents a AnimationSpec
     *
     *  @class W.AnimationSpec
     */
    var WAnimationSpec = WClass.extend({
    	
        init: function() {
        	
        	W.log.info("AnimationSpec init");
        	
            this.__id = nextID++;
            this.__state = "NO_GROUP";
            this.__curve = WCurve.__from("expo>");
            this.__rcurve = this.__curve;
            
            this.__group = [];
        },
        __isDisposed: function() {
            return this.__state==="DISPOSED";
        },
        __hasGroup: function() {
            return this.__state==="HAS_GROUP";
        },
        /**
         *  Disposes resources and puts the object in the pool if the pool is not full.
         *
         *  @method dispose
         */
        dispose: function() {
            if (this.__isDisposed())
                return;
            this.__group = [];
            this.__state = "DISPOSED";
        },
        /**
         *  Removes all the groups and resets curve, time span and default actor
         *  settings.
         *
         *  @method reset
         */
        reset: function() {
            if (this.__isDisposed())
                return;
            this.__group = [];
            this.__state = "NO_GROUP";
            return this;
        },
        
        /**
         *  Sets curve of `W.Animation` object.
         *
         *  @method setCurve
         *  @param {String} curve Curve with variously combined properties.
         *
         *  **Curve string expression is 'curve name' + 'easing'.**
         *  <pre>
         *  curve = Curves && Easings
         *  Curves = "linear" | "sine" | "quad" | "cubin" | "quint" | "expo" |
         *  "circle" | "elastic" | "back" | "bounce"
         *  Easings = "&lt;" | "-ease-in" | "&gt;" | "-ease-out" | "&gt;&lt;" |
         *  "-ease-in-out" | "&lt;&gt;" | "-ease-out-in"
         *  </pre>
         *
         *  **Easings meaning**
         *
         *  * Easing in : beginning of high acceleration. "&lt;" | "-ease-in"
         *  * Easing out : ending of high acceleration. "&gt;" | "-ease-out"
         *  * Easing in/out : "&gt;&lt;" | "-ease-in-out"
         *  * Easing out/in : "&lt;&gt;" | "-ease-out-in"
         *  @example
         *       ps.setCurve("sine<");
         *
         *       ps.makeGroup(3000)
         *         .setCurve("expo<>")
         *         .animate(image, {
         *             x : [0, 100]
         *         })
         *         .setCurve("bounce>")
         *         .animate(image, {
         *             y : [0, 100]
         *         });
         */
        setCurve: function(curve) {
            var c = WCurve.__from(curve);
            if (this.__isDisposed())
                return this;
            this.__curve = curve;
            return this;
        },
        
        /**
         *  Creates and adds a group in the spec. The following animate calls
         *  until another makeGroup call or reset call add property animation
         *  in the group.
         *
         *  @method makeGroup
         *  @param  {Number} duration Duration of group in milliseconds.
         *  @return {W.ProgramSpec} 
         */
        makeGroup: function(duration) {
        	if (error(this.__isDisposed(), "disposed",
                    !WUtil.isNumeric(duration)||duration<0,
                    "bad duration "+duration))
                return this;

        	var start = 0;
			var dur = 0;
			for (var i=0; i<this.__group.length; i++) {
				start += this.__group[i].duration;
			}
			dur  = start + duration;
			//W.log.info("AnimationSpec makeGroup dur " + dur);
			var obj = {};
    		obj.timeSpan = {"start":start, "duration":dur};
    		obj.stack = [];
    		obj.duration = dur;
    		obj.start = start;
    		obj.prevStart = -1;
    		obj.prevDuration = 0;

    		this.__group.push(obj);
    		
            this.__duration = duration;
            this.__state = "HAS_GROUP";
            this.__start = 0;
            this.__end = duration;
            return this;
        },
        
        /*
        __setRemoteTimeSpan: function(start, end) {
            if (this.__rstart===start && this.__rend===end)
                return;
            this.__rstart = start;
            this.__rend = end;

            this.__group[this.__group.length-1].timeSpan = {};
	    	this.__group[this.__group.length-1].timeSpan.start = this.__group[this.__group.length-1].start + start;
	    	this.__group[this.__group.length-1].timeSpan.duration = (end-start);
        },
        */
        /**
         *  Sets time span for property animations.
         *
         *  @method setTimeSpan
         *  @param {Number} start Offset from the start of group in milliseconds.
         *  The value shall be 0 or positive.
         *  @param {Number} end Offset from the start of group in milliseconds.
         *  @return {WProgramSpec}
         */
        setTimeSpan: function(start, end) {
        	if (error(!this.__hasGroup(),"bad state "+this.__state,
                    !WUtil.isNumeric(start), "bad start "+start,
                    !start<0, "bad start "+start,
                    !WUtil.isNumeric(end), "bad end "+end,
                    !end<0, "bad end "+end))
                return this;
            this.__start = Math.max(start, 0);
            this.__end = Math.min(end, this.__duration);
            
            this.__group[this.__group.length-1].timeSpan = {};
	    	this.__group[this.__group.length-1].timeSpan.start = this.__group[this.__group.length-1].start + start;
	    	this.__group[this.__group.length-1].timeSpan.duration = (end-start);
	    	
            return this;
        },
        /**
         *  Adds animation in the spec.
         *
         *      spec.animate(actor, {
         *          x : 10,
         *          y : [20, 40],
         *          curve : 'expo>'
         *      })
         *  @method animate
         *  @param {W.Component} [comp] Component for this animation. If
         *          specified, target actor is 'actor' otherwise, the target
         *          actor is the default actor of this program spec.
         *  @param {Object} config Animation configuration.
         *      @param {&lt;value type of property&gt; | Array} config.<actorProperty> Property of target actor.
         *
         *  @chainable
         */
        animate: function(/* [va], conf */) {
            if (error(!this.__hasGroup(), "animate:bad state "+this.__state))
                return this;
            var comp,
                conf, c, s, e, name, prop, range;
            if (arguments[0] instanceof WComponent) {
            	comp = arguments[0];
                conf = arguments[1];
            }
            var items = [];
            for (name in conf) {
            	
                if (!conf.hasOwnProperty(name))
                    continue;
                prop = comp.__getProperty(name);
                if (error(!prop,
                        "Unknow property "+name+" of comp "+comp))
                    continue;
                range = prop.__normalizeConf(conf[name]);
                
                if (error(!range, "Wrong value "+conf[name]+
                        " for property "+ name+" of actor "+comp))
                    continue;
                items.push({ prop:prop, range:range });
            }
            //W.log.("items");
            //W.log.inspect(items);
            var length = items.length;
            if (length===0)
                return this;
            for (var i=0; i<length; ++i) {
                prop = items[i].prop;
                range = items[i].range;
                this._addEffect(comp, prop.__id, range[0], range[1]);
            }
            return this;
        },
        //  TODO: make options flag.
        /**
         *  Launches this program spec.
         *
         *  @method start
         *  @param {Object} config Configuration for program start.
         *      @param {number} config.repeat Number of repetition.
         *      @param {number} config.startPos Starting animation time in
         *      milli-sceonds.
         *      @param {string} config.name Animation debug name.
         *      @param {function(string reason)} config.onTerm Termination
         *      callback.
         *
         *  - **Reason Codes:**
         *      * **end** All animation ended.
         *      * **stop** The animation is stopped in the middle of execution.
         *
         *  @return {W.Program} A newly started program.
         */
        start: function(conf) {
        	W.log.info("AnimationSpec start");
            if (error(this.__isDisposed(), "disposed"))
                return undefined;
            var ani = new WAnimation();
            ani.ps = this.__ps;
            ani.__start( this, conf);
            return ani;
        },
        
        _addEffect : function(comp, __id, from, to) {
        	
    		var ps = this.__group[this.__group.length-1];

			if (comp.comp) {
				var el = comp.comp;
				if(this.__curve) el.style.webkitTransitionTimingFunction = this.__curve;
				else el.style.webkitTransitionTimingFunction = "ease-out";
	    		
	    		if (ps.prevStart == ps.timeSpan.start && ps.prevDuration == ps.timeSpan.duration) {
	    			var index = ps.stack[ps.prevIndex].ids.indexOf(comp.pid);
	    			if ( index != -1) {
	    				ps.stack[ps.prevIndex].stacks[index].push({dom:el, id:__id, 
	    					from : from, to:to, delay:ps.timeSpan.start, duration:ps.timeSpan.duration});
	    			} else {
	    				ps.stack[ps.prevIndex].ids.push(comp.pid);
	    				
	    				ps.stack[ps.prevIndex].stacks[ps.stack[ps.prevIndex].ids.length-1] = 
	    					[{dom:el, id:__id, from : from, to:to, 
	    						delay:ps.timeSpan.start, duration:ps.timeSpan.duration}];
	    			}
	    		} else {
	    			ps.stack[ps.stack.length] = { ids: [comp.pid], 
	    			                                            stacks : [[{dom:el, id:__id, 
	    			                                            	from : from, to:to, delay:ps.timeSpan.start, 
	    			                                            	duration:ps.timeSpan.duration}]] };
	    			ps.prevIndex = ps.stack.length -1;
	    		}

	    		ps.prevStart = ps.timeSpan.start;
	    		ps.prevDuration = ps.timeSpan.duration;
			}
        }
    });
    return WAnimationSpec;
});

W.define("KeyHandler", function() {
	"use strict";
	
	var WClass = W.getClass('Class');
	var _sceneManager = W.getClass("SceneManager");
	var _popupManager = W.getClass("PopupManager");
	var IComponent = W.getClass("IComponent");
	
	//var _sceneStack;
	var preventDefault;

	var lastInputTime = Date.now();

	var keyPressed = function(evt) {
		lastInputTime = Date.now();

		if(W.Loading.KEY_LOCK || W.Loading.JUST_KEY_LOCK || W.isRequireWorking) {
			evt.preventDefault();
			evt.stopPropagation();
			return;
		}


		preventDefault = false;
		var keyConsumed = false;
		var _popupStack = _popupManager.getPopupStack();
		var curPopup = _popupStack[_popupStack.length -1];

		if (curPopup && curPopup._state === "start" && curPopup.hasKey(evt)) {
			if (curPopup.onKeyPressed) {
				curPopup._onKeyPressed(evt);
			}else {
				curPopup._onKeyPressed(evt);
			}
			keyConsumed = true;
		}

		var _sceneStack = _sceneManager.getSceneStack();
		var lastIndex = _sceneStack.length-1;
		if (!keyConsumed && lastIndex > -1 && _sceneStack) {
			var curScene =_sceneStack[lastIndex];

			if ((curScene._state === "start" && curScene.hasKey(evt)) ||
				(curScene._state === "start" && curScene.hasExclusiveKey(evt))	) {
				if (curScene._focusedObj && curScene._focusedObj.onKeyPressed) {
					curScene._focusedObj._onKeyPressed(evt);
				}else {
					curScene._onKeyPressed(evt);
				}
				keyConsumed = true;
			}

			for (var i=_sceneStack.length-2; i >=0; i--) {
				curScene =_sceneStack[i];

				if (!keyConsumed &&
					(curScene._state === "start" && curScene.hasKey(evt))||
					(curScene._state === "start" && curScene.hasExclusiveKey(evt))) {
					if (curScene._focusedObj && curScene._focusedObj.onKeyPressed) {
						curScene._focusedObj._onKeyPressed(evt);
					}else {
						curScene._onKeyPressed(evt);
					}
					keyConsumed = true;
				}
			}
		}
		if (keyConsumed)
			preventDefault = true;

		if (preventDefault) {
			evt.preventDefault();
			evt.stopPropagation();
		} else {
			W.log.info("keyDown preventDefault false [keyCode:" + evt.keyCode + "]");
		}
	}
	
	/**
	 * KeyEvent and Point Event handling
	 * Singleton class
	 * @class W.KeyHandler
	 */
	var _keyHandler = WClass.extend({
		
		/**
		 * @method keyDown
		 * @param {Event} evt 
		 */
		keyDown : function(evt) {
			if (W.KEY_DELAY_MS == 0) {
				keyPressed(evt);
			} else {
				var now = Date.now();
				if ((now-lastInputTime) > W.KEY_DELAY_MS) {
					keyPressed(evt);
				}
			}
			
			if(W.CloseTimer){
				W.CloseTimer.start();
			}
		},
		keyUp : function(evt) {
		},
		
		/*
		 * TODO event bubbling��� 醫����瑜� ��대�산�� ���寃���몄�� ..
		 */
		bubblePointEvent : function(type, evt, src) {
			//W.log.info("bubblePointEvent ");
			var srcElement;
			if (src)
				srcElement = src.parentElement;
			else
				srcElement = evt.srcElement.parentElement;
			
			//W.log.info(srcElement);
			
			if (srcElement && srcElement.comp) {
	
				var _comp = srcElement.comp; 
				
				if (_comp && _comp.grapedPointer)
					evt.cancelBubble = true;
				
				switch(type) {
				case IComponent.EVENT_POINT_BUTTON_PRESSED:
					if (_comp.onPointButtonPressed)
						_comp.onPointButtonPressed(evt);
					break;
				case IComponent.EVENT_POINT_BUTTON_RELEASED:
					if ( _comp.onPointButtonReleased)
						_comp.onPointButtonReleased(evt);
					break;
				case IComponent.EVENT_POINT_BUTTON_DBLCLICK:
					if (_comp.onPointButtonDblClicked)
						_comp.onPointButtonDblClicked(evt);
					break;
				case IComponent.EVENT_POINT_MOVE:
					if (_comp.onPointMove)
						_comp.onPointMove(evt);
					break;
				case IComponent.EVENT_POINT_IN:
					if (_comp.onPointIn)
						_comp.onPointIn(evt);
					break;
				case IComponent.EVENT_POINT_OUT:
					if (_comp.onPointOut)
						_comp.onPointOut(evt);
					break;
				case IComponent.EVENT_POINT_SCROLL_UP:
					/*
					 * TODO target scroll 媛� 議곗��    
					 *	evt.vscroll = evt.target.scrollTop;
					 *	evt.hscroll = evt.target.scrollLeft;
					 */
					if (_comp.onPointScroll)
						_comp.onPointScroll(evt);
					break;
				}
				
				if (evt.cancelBubble != true)
					bubblePointEvent(type, evt, srcElement);
			}
		},
		
		pointButtonPressed : function(evt) {
			var _comp = evt.srcElement.comp;
			
			//W.log.info(getWindEvent(evt));
			
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			if (_comp.onPointButtonPressed) {
				_comp.onPointButtonPressed(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_BUTTON_PRESSED, evt);
			}
		},
		
		pointButtonReleased : function(evt) {
			var _comp = evt.srcElement.comp;
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			
			if (_comp.onPointButtonReleased) {
				
				_comp.onPointButtonReleased(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_BUTTON_RELEASED, evt);
			}
		},
		
		pointButtonDblClicked : function(evt) {
			var _comp = evt.srcElement.comp;
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			
			if (_comp.onPointButtonDblClicked) {
				_comp.onPointButtonDblClicked(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_BUTTON_DBLCLICK, evt);
			}
		},
		
		pointMove : function(evt) {
			var _comp = evt.srcElement.comp;
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			
			if (_comp.onPointMove) {
				_comp.onPointMove(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_MOVE, evt);
			}
		},
		
		pointIn : function(evt) {
			var _comp = evt.srcElement.comp;
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			
			if (_comp.onPointIn) {
				_comp.onPointIn(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_IN, evt);
			}
		},
		
		pointOut : function(evt) {
			var _comp = evt.srcElement.comp;
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			
			if (_comp.onPointOut) {
				_comp.onPointOut(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_OUT, evt);
			}
		},
		
		pointScroll : function(evt) {
			var _comp = evt.srcElement.comp;
			if (_comp.grapedPointer)
				evt.cancelBubble = true;
			
			if (_comp.onPointScroll) {
				evt.vscroll = evt.target.scrollTop;
				evt.hscroll = evt.target.scrollLeft;
				_comp.onPointScroll(evt);
			} else {
				bubblePointEvent(IComponent.EVENT_POINT_SCROLL_UP, evt);
			}
		}
	});
	
	var WKeyHandler = new _keyHandler();
	return WKeyHandler;

});

W.define('SceneManager', function() {
    'use strict';

    var WClass = W.getClass('Class');
    
    /**
     * object of Scene Modules 
     */
    //var sceneModules = {};
    var sceneStack = [];
    
    var _loadScene = function(name, sStack, desc) {
    	var _name = name.replace("_","/");
		W.isRequireWorking = true;
    	require([_name], function(Module) {
    		W.log.info("_loadScene " + _name);
    		
    		var _module = new Module(desc);
    		_module.name = _name;
			sStack.push(_module);
    		//sceneModules[_name] = _module;
    		
    		if (desc && desc.onload)
    			WClass.tryCall(sStack[sStack.length-1], desc.onload, desc.param);

			W.isRequireWorking = false;
			W.bg.setDisplay("none");
    	}, function(err){
			console.error("[ERR] Not load js ",err);
			require.undef(_name);
		});

		if(W.CloseTimer) W.CloseTimer.start();
    };
    
    var _pauseScene = function(scene) {
    	W.log.info("_stopScene ")
    	if (scene) {
    		scene._onPause();
    	}
    };

	var _resumeScene = function(scene) {
		W.log.info("_resumeScene ")
		if (scene) {
			scene._onResume();
		}
	};

	var _refreshScene = function(scene, param) {
		W.log.info("_refreshScene ")
		if (scene) {
			scene._onRefresh(param);
		}
	};

    var _destroyScene = function(scene) {
    	//W.log.info("_destroyScene ")
    	if (scene) {
    		scene._onDestroy();
    	}
    };

    /**
     * manage scenes
     * @class W.SceneManager
     * @constructor
     */
    var _sceneManager = WClass.extend({
    	
    	 //OPTION_KEEP : "0",
    	 //OPTION_NEW : "1",
    		
    	 BACK_STATE_KEEPSHOW : "0",
    	 BACK_STATE_KEEPHIDE : "1",
    	 BACK_STATE_DESTROY : "2",
    	 BACK_STATE_DESTROYALL : "3",
    	    
    	init: function() {
    	},
    	//_getSceneModule : function() {
    	//	return sceneModules;
    	//},
    	getSceneStack : function() {
    		return sceneStack;
    	},
    	removeSceneStack : function(sceneName){
    		for(var i=0; i < sceneStack.length; i++){
    			if(sceneStack[i].id.indexOf(sceneName) > 0){
    				sceneStack.splice(i,1);
    				break;
    			}
    		}
    	},
    	keepVodScene : function(){
    		if(sceneStack[sceneStack.length - 1].id.indexOf("VodPlayScene") > 0){
				this.vodPlayScene = sceneStack.pop();
				_pauseScene(this.vodPlayScene);
			}
    	},
    	getCurrentScene : function() {
    		return sceneStack[sceneStack.length-1];
    	},
    	destroyAll : function(isFromCloudManager, isShowHome, isForce){
			var _popupManager = W.getClass("PopupManager");
			_popupManager.closePopupAll();

			var hasHomeScene = false;
			for(var i=0; i < sceneStack.length; i++){
				if(sceneStack[i].id.indexOf("HomeScene") > -1){
					hasHomeScene = true;
					break;
				}
			}
			
			if(isFromCloudManager){
				var isBreak = false;
				for (var i=sceneStack.length-1; i >=1; i--) {
					if(sceneStack[i].id.indexOf("ChannelVodScene") > 0){
						isBreak = true;
    					break;
    				}else if(sceneStack[i].id.indexOf("VodPlayScene") > 0){
    					this.vodPlayScene = sceneStack.pop();
        				_pauseScene(this.vodPlayScene);
    				}else{
    					_destroyScene(sceneStack[i]);
    					sceneStack.pop();
    				}
				}
				if(!isBreak){
					if(isShowHome && (hasHomeScene || W.state.start == "CH_VOD")){
						sceneStack[0].showHome(true);
					}else{
						if(W.state.isVod){
							_pauseScene(sceneStack[sceneStack.length-1]);
		    				sceneStack.push(Object.assign(this.vodPlayScene));
		    				_resumeScene(sceneStack[sceneStack.length-1]);
		    				this.vodPlayScene = null;
		    				if(isShowHome){
		    					if(sceneStack[1].id.indexOf("VodPlayScene") > 0){
		        					this.vodPlayScene = sceneStack.pop();
		            				_pauseScene(this.vodPlayScene);
		        				}
		    					sceneStack[0].showHome(true);
		    				}
						}else{
							_resumeScene(sceneStack[sceneStack.length-1]);
						}
					}
				}else{
					if(isShowHome && (hasHomeScene || W.state.start == "CH_VOD")){
						sceneStack[0].showHome(true);
					}
				}
			}else{
				if(W.state.isVod){
					if(sceneStack[sceneStack.length-1].id.indexOf("PurchaseVodScene") > 0){
						_destroyScene(sceneStack[sceneStack.length-1]);
    					sceneStack.pop();
					}else{
						_pauseScene(sceneStack[sceneStack.length-1]);
					}
					var hasVodPlayScene = false;
					for(var i=0; i < sceneStack.length; i++){
						if(sceneStack[i].id.indexOf("VodPlayScene") > -1){
							hasVodPlayScene = true;
							break;
						}
					}
					if(hasVodPlayScene){
						for (var i=sceneStack.length-1; i >=1; i--) {
							if(sceneStack[i].id.indexOf("VodPlayScene") > 0){
		    					break;
		    				}else{
		    					_destroyScene(sceneStack[i]);
		    					sceneStack.pop();
		    				}
						}
					}else{
						if(sceneStack[sceneStack.length-1].id.indexOf("VodPlayScene") == -1){
							if(this.vodPlayScene){
			    				sceneStack.push(Object.assign(this.vodPlayScene));
							}
						}
					}
					
    				_resumeScene(sceneStack[sceneStack.length-1]);
    				this.vodPlayScene = null;
				}else{
					for (var i=sceneStack.length-1; i >=1; i--) {
						if(sceneStack[i].id.indexOf("ChannelVodScene") > 0 && !isForce){
	    					break;
	    				}else{
	    					_destroyScene(sceneStack[i]);
	    					sceneStack.pop();
	    				}
					}
					_resumeScene(sceneStack[sceneStack.length-1]);
				}
			}
		},
    	/**
    	 * start scene 
    	 * @method startScene
    	 * @param {object} desc scene description
    	 * 	@param {String} desc.sceneName scene name
    	 * 	@param {Number} desc.option  if OPTION_KEEP, loaded module will be used. 
    	 * 			if OPTION_NEW, New one will be created.  
    	 * 	@param {Number} desc.backState 
    	 * 			default backState is BACK_STATE_KEEPHIDE
    	 * 		
    	 */
    	startScene: function(desc) {
    		W.log.info("startScene " + desc.sceneName);
    		//if(desc.sceneName.indexOf("/")!=-1)
    		//	desc.sceneName = desc.sceneName.replace("/","_");
    		if(desc.sceneName.indexOf("RootScene") == -1 && sceneStack.length > 1){
				W.bg.setDisplay("");
    		}
    		if(desc.sceneName.indexOf("VodPlayScene") > 0){
    			if(this.vodPlayScene){
        			W.vodTmpInfo = this.vodPlayScene.getVodInfo();
    			}
    			this.vodPlayScene = null;
    			for(var i=0; i < sceneStack.length; i++){
    				if(sceneStack[i].id.indexOf("VodPlayScene") > 0){
    					W.log.info("startScene has VodPlayScene");
    					var expireScene = sceneStack.splice(i, 1);
    					if(expireScene && expireScene[0] && expireScene[0].expire){
        					expireScene[0].expire();
    					}
    					break;
    				}
    			}
    		}
    		if(desc.sceneName.indexOf("SearchScene") > 0){
    			var SearchSceneCount = 0;
    			for(var i=0; i < sceneStack.length; i++){
    				if(sceneStack[i].id.indexOf("SearchScene") > 0){
    					SearchSceneCount++;
    				}
    			}
    			if(SearchSceneCount > 0){
    				desc.sceneName = desc.sceneName + SearchSceneCount;
    			}
    		}
//    		if(desc.sceneName.indexOf("SearchResultScene") > 0){
//    			var SearchResultSceneCount = 0;
//    			for(var i=0; i < sceneStack.length; i++){
//    				if(sceneStack[i].id.indexOf("SearchResultScene") > 0){
//    					SearchResultSceneCount++;
//    				}
//    			}
//    			if(SearchResultSceneCount > 0){
//    				desc.sceneName = desc.sceneName + SearchResultSceneCount;
//    			}
//    		}
    		
    		if (desc.backState && desc.backState == this.BACK_STATE_KEEPSHOW) {
    			//do not anything
    		} else if (desc.backState && desc.backState == this.BACK_STATE_DESTROY) {
    			//prev scene will be destroyed
    			if (sceneStack.length > 1) {
    				if(W.state.isVod){
    					this.vodPlayScene = sceneStack[sceneStack.length-1];
        				_pauseScene(this.vodPlayScene);
    				}else{
    	    			_destroyScene(sceneStack[sceneStack.length-1]);
    	    			sceneStack.pop();
    				}
    			}
    		} else if (desc.backState && desc.backState == this.BACK_STATE_DESTROYALL) {
    			//all prev scenes will be destroyed 
    			for (var i=sceneStack.length-1; i >=1; i--) {
    				if(W.state.isVod && sceneStack[i].id.indexOf("VodPlayScene") > 0){
    					this.vodPlayScene = sceneStack.pop();
        				_pauseScene(this.vodPlayScene);
    				}else{
        				_destroyScene(sceneStack[i]);
        				sceneStack.pop();
    				}
    			}
    			
    		} else {
    			//All prev scenes will be hidden
    			for (var i=sceneStack.length-1; i >=1; i--) {
    				_pauseScene(sceneStack[i]);
    			}
    		}
    		
			W.log.info("SCENE START");
			desc.onload = "_onCreate";
			_loadScene(desc.sceneName, sceneStack, desc);

    	},
    	/**
    	 * pause scene
    	 * @method pauseScene
    	 * @param {object} desc scene description
    	 * 	@param {String} desc.sceneName scene name for pause
    	 * 
    	 * named scene will be paused. this scene will be keeped in scene stack.
    	 */
		pauseScene: function(desc) {
    		for (var i=sceneStack.length-1; i>=0; i--) {
    			if (sceneStack[i].name === desc.sceneName) {
    				_pauseScene(sceneStack[i]);
    				break;
    			}
			}
    	},
		/**
		 * resume scene
		 * @method resumeScene
		 * @param {object} desc scene description
		 * 	@param {String} desc.sceneName scene name for resume
		 *
		 * named scene will be resume.
		 */
		resumeScene: function(desc) {
			for (var i=sceneStack.length-1; i>=0; i--) {
				if (sceneStack[i].name === desc.sceneName) {
					_resumeScene(sceneStack[i]);
					break;
				}
			}
		},

		/**
		 * refresh scene
		 * @method refreshScene
		 * @param {object} desc scene description
		 * 	@param {String} desc.sceneName scene name for refresh
		 *
		 * named scene will be refresh.
		 */
		refreshScene: function(desc, param) {
			for (var i=sceneStack.length-1; i>=0; i--) {
				if (sceneStack[i].name === desc.sceneName) {
					_refreshScene(sceneStack[i], param);
					break;
				}
			}
		},

    	/**
    	 * destroy scene 
    	 * @method destroyScene
    	 * @param {object} desc scene description
    	 * 	@param {String} desc.sceneName scene name for destroy
    	 * 
    	 * named scene will be destroyed. this scene will be deleted in scene stack. 
    	 */
    	destroyScene: function(desc) {
    		for (var i=sceneStack.length-1; i>=0; i--) {
    			//W.log.info(sceneStack[i].name);
    			if (sceneStack[i].name === desc.sceneName) {
    				_destroyScene(sceneStack[i]);
    				sceneStack.splice(i,1);
    				break;
    			}
			}
    	},
    	
    	destroySceneByObj: function(scene) {
    		for (var i=sceneStack.length-1; i>=0; i--) {
    			//W.log.info(sceneStack[i]);
    			if (sceneStack[i] === scene) {
    				_destroyScene(sceneStack[i]);
    				sceneStack.splice(i,1);
    				break;
    			}
			}
    	},

    	/**
    	 * history back by depth 
    	 * @method historyBack
    	 * @param {Number} depth stack count for history back
    	 * 
    	 * if zero or null. apply one 
    	 */
    	historyBack: function(depth, needRefresh, desc) {
    		var count = 0;
    		if (!depth){
    			count = 1;
    		}else{
    			count = depth;
    		}
    		var isVodScene = false;	
    		
    		for (var i=sceneStack.length-1; i>=1 && count>0 ; i--, count--) {
    			if(W.state.isVod && sceneStack[i].id.indexOf("VodPlayScene") > -1){
    				this.vodPlayScene = sceneStack.pop();
    				_pauseScene(this.vodPlayScene);
    				isVodScene = true;
    			}else{
    				if(sceneStack[i].id.indexOf("ChannelVodScene") == -1){
        				_destroyScene(sceneStack[i]);
        				sceneStack.pop();
    				}
    			}
			}
    		
    		if (sceneStack.length > 0 && sceneStack[sceneStack.length-1]) {
    			if(W.state.isVod){
    				if(sceneStack[sceneStack.length-1].id.indexOf("ChannelVodScene") > 0){
    					if(isVodScene){
        					sceneStack[0].showHome();
    					}else{
    						sceneStack.push(Object.assign(this.vodPlayScene));
    	    				_resumeScene(sceneStack[sceneStack.length-1]);
    	    				this.vodPlayScene = null;
    					}
    				}else{
    					if(sceneStack.length == 1){
    						if(isVodScene){
            					sceneStack[0].showHome();
        					}else{
        	    				sceneStack.push(Object.assign(this.vodPlayScene));
        	    				_resumeScene(sceneStack[sceneStack.length-1]);
        	    				this.vodPlayScene = null;
        					}
    	    			}else{
    	    				if(needRefresh) sceneStack[sceneStack.length-1]._onRefresh(desc);
    	        			sceneStack[sceneStack.length-1]._onResume(desc);
    	    			}
    				}
    			}else{
    				if(needRefresh) sceneStack[sceneStack.length-1]._onRefresh(desc);
        			sceneStack[sceneStack.length-1]._onResume(desc);
    			}
    		}
    	},
    	
    	resumeVodPlayer: function(){
    		W.log.info("resumeVodPlayer");
    		for (var i=sceneStack.length-1; i >=1; i--) {
				if(sceneStack[i].id.indexOf("PurchaseVodScene") > 0){
					var expiredScene = sceneStack.splice(i, 1);
					_destroyScene(expiredScene[0]);
	    		}
			}
		
			for (var i=sceneStack.length-1; i >=1; i--) {
				W.log.info("pause scene == " + sceneStack[i].id);
				_pauseScene(sceneStack[i]);
			}
			
			sceneStack.push(Object.assign(this.vodPlayScene));
			_resumeScene(sceneStack[sceneStack.length-1]);
			this.vodPlayScene = null;
    	}
    	
    });
    
    var WSceneManager = new _sceneManager();
    
    return WSceneManager;
});

W.define('PopupManager', function() {
    'use strict';

    var WClass = W.getClass('Class');
	var _sceneManager = W.getClass("SceneManager");
    
    var popupStack = [];
    
    var _loadPopup = function(name, sStack, desc, comp) {
    	var _name = name.replace("_","/");
		W.isRequireWorking = true;
    	require([_name], function(Module) {
    		W.log.info("_loadPopup " + _name);
    		
    		var _module = new Module(desc);
    		_module.__name = _name;
    		_module.__comp =  comp;
			if(desc && desc.childComp) _module.__childComp = desc.childComp;
    			
			sStack.push(_module);
    		
    		if (desc && desc.onload)
    			WClass.tryCall(sStack[sStack.length-1], desc.onload, desc);

			if(desc && desc.childComp && desc.childComp.onPopupOpened)
    			desc.childComp.onPopupOpened(_module, desc);
			else if (comp && comp._onPopupOpened)
    			comp._onPopupOpened(_module, desc);

			W.isRequireWorking = false;
    	}, function(err){
			console.error("[ERR] Not load js ",err);
			require.undef(_name);
		});
    };

	var _pausePopup = function(popup) {
		W.log.info("_stopPopup ")
		if (popup) {
			popup._onPause();
		}
	};

	var _resumePopup = function(popup) {
		W.log.info("_resumePopup ")
		if (popup) {
			popup._onResume();
		}
	};

	var _refreshPopup = function(popup, desc) {
		W.log.info("_refreshPopup ")
		if (popup) {
			popup._onRefresh(desc);
		}
	};
    

    var _stopPopup = function(popup, desc) {
    	if (popup) {
    		popup._onStop();
			if(popup.__childComp && popup.__childComp && popup.__childComp.onPopupClosed) {
				if(desc) desc.popupName = popup.__name;
				popup.__childComp.onPopupClosed(popup, desc);
			}
			else if (popup.__comp && popup.__comp._onPopupClosed) {
				if(desc) desc.popupName = popup.__name;
    			popup.__comp._onPopupClosed(popup, desc);
    		}
    		popup = undefined;
    	}
    };
    
    /**
     * manage popup
     * @class W.PopupManager
     * @constructor
     */
    var _popupManager = WClass.extend({
    	
    	 TYPE_BLOCK : "0",
    	 TYPE_UNBLOCK : "1",
    	 
    	 ACTION_OK : "1",
    	 ACTION_CANCEL : "0",
    	 ACTION_CLOSE : "2",
    	 ACTION_FAIL : "3",

		BACK_STATE_KEEPSHOW : "0",
		BACK_STATE_KEEPHIDE : "1",
		BACK_STATE_DESTROY : "2",
		BACK_STATE_DESTROYALL : "3",
    	 
    	init: function() {
    	},
    	
    	getPopupStack : function() {
    		return popupStack;
    	},
    	/**
    	 * request popup to open  
    	 * @method openPopup
    	 * @param {Component} comp based component
    	 * @param {Object} desc popup description
    	 */
    	openPopup : function(desc) {
    		//if (!(comp instanceof W.Component))
    		//	throw new Error("Error! Popup must run on component");
//    		console.log(desc);
			if (desc.backState && desc.backState == this.BACK_STATE_KEEPSHOW) {
				//do not anything
			} else if (desc.backState && desc.backState == this.BACK_STATE_DESTROY) {
				//prev scene will be destroyed
				if (popupStack.length > 0) {
					_stopPopup(popupStack[popupStack.length-1]);
					popupStack.pop();
				}
			} else if (desc.backState && desc.backState == this.BACK_STATE_DESTROYALL) {
				//all prev scenes will be destroyed 
				for (var i=popupStack.length-1; i >=0; i--) {
					_stopPopup(popupStack[i]);
					popupStack.pop();
				}

			} else {
				//All prev scenes will be hidden
				for (var i=popupStack.length-1; i >=0; i--) {
					_pausePopup(popupStack[i]);
				}
			}
			
			if(W.CloudManager) {
				W.CloudManager.addPopupNumericKey();
			}
    		
    		desc.onload = "_onStart";
			_loadPopup(desc.popupName, popupStack, desc, _sceneManager.getCurrentScene());
    	},
		/**
		 * request popup to close
		 * @method closePopup
		 * @param {Popup} popup based popup
		 * @param {Object} desc popup description
		 */
		pausePopup : function(popup) {
			for (var i=popupStack.length-1; i>=0; i--) {
				W.log.info("pausePopup " + popupStack[i].__name);
				if (popupStack[i] === popup) {
					_pausePopup(popup);
					break;
				}
			}
			if(W.CloudManager) {
				W.CloudManager.delPopupNumericKey();
			}
		},
		/**
		 * request popup to close
		 * @method closePopup
		 * @param {Popup} popup based popup
		 * @param {Object} desc popup description
		 */
		resumePopup : function(popup) {
			for (var i=popupStack.length-1; i>=0; i--) {
				W.log.info("resumePopup " + popupStack[i].__name);
				if (popupStack[i] === popup) {
					_resumePopup(popup);
					break;
				}
			}
			if(W.CloudManager) {
				W.CloudManager.addPopupNumericKey();
			}
		},
		/**
		 * request popup to close
		 * @method closePopup
		 * @param {Popup} popup based popup
		 * @param {Object} desc popup description
		 */
		refreshPopup : function(popup, desc) {
			for (var i=popupStack.length-1; i>=0; i--) {
				W.log.info("refreshPopup " + popupStack[i].__name);
				if (popupStack[i] === popup) {
					_refreshPopup(popup, desc);
					break;
				}
			}
		},
    	/**
    	 * request popup to close  
    	 * @method closePopup
    	 * @param {Popup} popup based popup
    	 * @param {Object} desc popup description
    	 */
    	closePopup : function(popup, desc) {
    		for (var i=popupStack.length-1; i>=0; i--) {
    			W.log.info("closePopup " + popupStack[i].__name);
    			if (popupStack[i] === popup) {
    				popupStack.splice(i,1);
					_stopPopup(popup, desc);
    				break;
    			}
			}
			if(W.CloudManager) {
				W.CloudManager.delPopupNumericKey();
			}
    	},
    	/**
    	 * request all popup to close  
    	 * @method closePopup
    	 * @param {Object} desc popup description
    	 */
    	closePopupAll : function() {
    		for (var i=popupStack.length-1; i>=0; i--) {
				if(popupStack[i]) {
					W.log.info("closePopup " + popupStack[i].__name);
					var popup = popupStack[i];
					popupStack.splice(i,1);
					_stopPopup(popup, {});
				}
			}
			if(W.CloudManager) {
				W.CloudManager.delPopupNumericKey();
			}
    	},
		historyBack: function(depth, needRefresh, desc) {
			var count = 0;
			if (!depth)
				count = 1;
			else
				count = depth;

			for (var i=popupStack.length-1; i>=0 && count>0 ; i--, count--) {
				_stopPopup(popupStack[i]);
				popupStack.splice(i,1);
			}

			if (popupStack.length > 0 && popupStack[popupStack.length-1]) {
				if(needRefresh) popupStack[popupStack.length-1]._onRefresh();
				popupStack[popupStack.length-1]._onResume(desc);
				if(W.CloudManager) {
					W.CloudManager.addPopupNumericKey();
				}
			} else {
				if(W.CloudManager) {
					W.CloudManager.delPopupNumericKey();
				}
			}
		}
    });
    
    var WPopupManager = new _popupManager();
    
    return WPopupManager;
});
W.define('Loading', function() {
	'use strict';

	var WClass = W.getClass('Class');

	var loadingTimer;
	var loadingDelay;
	var lockTimer;
	var _this;

	/**
	 * manage popup
	 * @class W.PopupManager
	 * @constructor
	 */
	var _loading = WClass.extend({
		TYPE_NORMAL : 0,
		TYPE_TEXT : 1,
		TYPE_KIDS : 2,
		KEY_LOCK : false,
		JUST_KEY_LOCK : false,
		isLoading : false,
		init: function() {
			W.log.info("loading init");
			_this = this;
			_this.loading = new W.Div({id:"loading", display : "none"});
			_this.loading.add(new W.Div({id:"loading_img"}));
			W.root.add(_this.loading);
			_this.loadingText = new W.Div({id:"loading_type_text", display : "none"});
			_this.loadingText.add(new W.Div({id:"loading_type_text_img"}));
			_this.loadingText._text1 = new W.Div({id:"loading_type_text_text1"});
			_this.loadingText.add(_this.loadingText._text1);
			_this.loadingText._text2 = new W.Div({id:"loading_type_text_text2"});
			_this.loadingText.add(_this.loadingText._text2);
			W.root.add(_this.loadingText);
			_this.loadingKids = new W.Div({id:"loading_type_kids", display : "none"});
			_this.loadingKids.add(new W.Div({id:"loading_kids_img"}));
			W.root.add(_this.loadingKids);
		},
		start: function(_param, callback) {
			if(W.Loading.isLocked){
				return;
			}
			_this.param = _param ? _param : {};
			W.log.info("loading start duration : " + _this.param.duration);
			var delay = _this.param.delay != undefined && _this.param.delay != null ? _this.param.delay : 1000;
			var type = _this.param.type ? _this.param.type : 0;
			_this.KEY_LOCK = true;
			_this.isLoading = true;
			if(callback) _this.callback = callback;
			if(loadingDelay) clearTimeout(loadingDelay);
			if(loadingTimer) clearTimeout(loadingTimer);
			if(type == this.TYPE_NORMAL) {
				loadingDelay = setTimeout(function(){
					_this.loading.setDisplay("block");
				}, delay);
			} else if(type == this.TYPE_TEXT) {
				_this.loadingText._text1.setText(_this.param.text1 ? _this.param.text1 : "");
				_this.loadingText._text2.setText(_this.param.text2 ? _this.param.text2 : "");
				loadingDelay = setTimeout(function(){
					_this.loadingText.setDisplay("block");
				}, delay);
			} else if(type == this.TYPE_KIDS) {
				loadingDelay = setTimeout(function(){
					_this.loadingKids.setDisplay("block");
				}, delay);
			}
			loadingTimer = setTimeout(_this.timeout, _this.param.duration ? _this.param.duration : 30000);
		},
		stop: function() {
			W.log.info("loading stop");
			_this.loading.setDisplay("none");
			_this.loadingText.setDisplay("none");
			_this.loadingKids.setDisplay("none");
			_this.KEY_LOCK = false;
			_this.isLoading = false;
			if(_this.callback) _this.callback();
			if(loadingDelay) clearTimeout(loadingDelay);
			if(loadingTimer) clearTimeout(loadingTimer);
		},
		justLock : function(duration, callback) {
			W.log.info("loading justlock");
			_this.JUST_KEY_LOCK = true;
			if(lockTimer) clearTimeout(lockTimer);
			lockTimer = setTimeout(_this.justLockStop, duration ? duration : 30000);
		},
		justLockStop: function() {
			W.log.info("loading justlock stop");
			_this.JUST_KEY_LOCK = false;
			if(lockTimer) clearTimeout(lockTimer);
		},
		timeout : function(){
			W.log.info("loading timeout");
			_this.stop();
		}
	});

	var WLoading = new _loading();

	return WLoading;
});


W.define('XHRManager', function() {
	'use strict';

	var WClass = W.getClass('Class');

	/**
	 * manage xhr
	 * @class W.XHRManager
	 * @constructor
	 */
	var _xhrManager = WClass.extend({
		send : function(desc) {

			W.log.info("###### XHRManager ###################");
			W.log.info("@@@@@@@ request start time : " + (new Date()));
			W.log.info(" url " + desc.url);
			W.log.info(" type " + desc.type);
			W.log.info(" async " + desc.async);
			W.log.info(" dataType " + desc.dataType);
			if (typeof (desc.data) == "object") {
				W.log.info(" data ");
				W.log.info(JSON.stringify(desc.data));
			} else {
				W.log.info(" data " + desc.data);
			}
			W.log.info(" timeout " + desc.timeout);
			W.log.info(" mimeType " + desc.mimeType);

			var xhr = new XMLHttpRequest();

			// xhr.withCredentials = true;

			xhr.open(desc.type, desc.url, desc.async ? true : false);
			for ( var property in desc.requestHeader) {
				W.log.info(" requestHeader " + property + ", "
					+ desc.requestHeader[property]);
				xhr.setRequestHeader(property, desc.requestHeader[property]);
			}
			xhr.withCredentials = true;

			W.log.info("###### XHRManager ###################");
			if (desc.mimeType)
				xhr.overrideMimeType(desc.mimeType);

//			if (desc.type.toLowerCase() == "post") {
//				xhr.setRequestHeader("Content-type","application/json");
//				xhr.setRequestHeader("charset","utf-8");
//			}
			//xhr.setRequestHeader("Content-type",
			//		"application/x-www-form-urlencoded");

			if (desc.timeout) {
				if (xhr.timeout != undefined) {
					xhr.timeout = desc.timeout;

					xhr.ontimeout = function() {
						W.log.error("XHRManager timeout ");
						xhr.abort();
						desc.successCallback = undefined;
						if (desc.errorCallback)
							desc.errorCallback(false, '{"erroeMessage": "'
								+ desc.timeout
								+ ' seconds passed. Timeout..."}');
						desc.errorCallback = undefined;
					};
				} else {
					xhr.xhrTimeout = setTimeout(function() {
						W.log.error("XHRManager timeout ");
						xhr.abort();
						desc.successCallback = undefined;
						if (desc.errorCallback)
							desc.errorCallback(false, '{"erroeMessage": "'
								+ desc.timeout
								+ ' seconds passed. Timeout..."}');
						desc.errorCallback = undefined;
					}, desc.timeout);
				}
			}

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					W.log.info("@@@@@@@ request end time : " + (new Date()));
					clearTimeout(xhr.xhrTimeout);
					xhr.ontimeout = undefined;
					if (xhr.status == 200) {
						W.log.info("XHRManager status 200 ");
						W.log.debug(xhr.getAllResponseHeaders());
						// console.log(xhr.getResponseHeader("Set-Cookie"));
						//W.log.info("XHRManager responseText ");
						//W.log.info(xhr.responseText);
						if (desc.successCallback) {
							desc.successCallback(true, xhr.responseText);
						}
					} else {
						W.log.error("XHRManager status " + xhr.status);
						W.log.info(xhr.responseText);
						if (desc.errorCallback){
							if(xhr.status === 0){
								var errorObj = {error:{code:"0001"}};
								desc.errorCallback(false, JSON.stringify(errorObj));
							}else{
								desc.errorCallback(false, xhr.responseText);
							}
						}else if (desc.successCallback){
							desc.successCallback(false, xhr.responseText);
						}
					}
				} else {
					// W.log.error("XHRManager readyState " + xhr.readyState);
				}
			};

			if (desc.data)
				xhr.send(JSON.stringify(desc.data));
			else
				xhr.send();
		}
	});

	var WXHRManager = new _xhrManager();

	return WXHRManager;
});