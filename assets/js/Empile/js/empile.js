(function (win, doc) {
	// ### 1、通用方法
	var is = {
		str: function (a) {
			return typeof a === 'string';
		},
		und: function (a) {
			return a === void 0;
		},
		bol: function (a) {
			return typeof a === 'boolean';
		},
		true: function (a) {
			return a === true;
		},
		num: function (a) {
			return typeof a === 'number';
		},
		finite: function (a) {
			return this.num(a) && isFinite(a);
		},
		null: function (a) {
			return a === null;
		},
		fun: function (a) {
			return typeof a === 'function';
		},
		arr: function (a) {
			return Array.isArray(a);
		},
		obj: function (a) {
			return (a !== null && typeof a === 'object' && 'constructor' in a && a.constructor === Object);
		},
		emptyObj: function (a) {
			return this.obj(a) && a.length === 0;
		},
		emptyArr: function (a) {
			return this.arr(a) && a.length === 0;
		},
	}
	// 生成唯一标识符
	function uuid(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [],
			i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	}
	// 判断数据类型
	var toString = Object.prototype.toString;

	function typeOf(d) {
		return toString.call(d).slice(8, -1);
	}
	// 转成数组
	function toArray(el) {
		return [].slice.call(el);
	}
	// 获取HTMLElement元素的类名选择器
	function getClassSelector(el) {
		var arr = this.toArray(el.classList);
		return is.emptyArr(arr) ? '' : '.' + arr.join('.');
	}
	// 向上遍历（查找指定父级）closest
	function closest(ele, tar) {
		if (!Element.prototype.isPrototypeOf(ele)) throw new TypeError(ele + 'is not a Element!');
		var _this = this;
		var elArr = (function () {
			if (tar instanceof HTMLElement) return [tar];
			try {
				tar = doc.querySelectorAll(tar);
			} catch (err) {}
			var tarType = _this.typeOf(tar),
				tarTypeOptions = ['NodeList', 'HTMLCollection', 'Array', ];
			if (tarTypeOptions.indexOf(tarType) > -1) return _this.toArray(tar);
		})();
		do {
			if (elArr.indexOf(ele) > -1) return ele;
			ele = ele.parentElement;
		} while (ele !== null);
		return null;
	}
	// 扁平化数组：即Array.prototype.flat
	function flat(arr, d) {
		var _this = this;
		d = d || 1;
		return d > 0 ? arr.reduce(function (total, now) {
			return total.concat(Array.isArray(now) ? _this.flat(now, d - 1) : now);
		}, []) : arr.slice();
	}
	// 对数值数组：即Object.values
	function values(obj) {
		if (obj !== Object(obj)) throw new TypeError(obj + 'is a non-object');
		return Object.keys(obj).map(function (e) {
			return obj[e];
		});
	}
	// 即Array.prototype.find
	function find(arr, cb) {
		for (var i = 0, len = arr.length; i < len; i++) {
			var curItem = arr[i];
			if (cb(curItem, i, arr)) return curItem;
		}
	}

	function getPageVisibility() {
		var hiddenArr = ['hidden', 'webkitHidden', 'mozHidden', ],
			visibilityStateArr = ['visibilityState', 'webkitVisibilityState', 'mozVisibilityState', ];
		var values = [hiddenArr, visibilityStateArr].map(function (arr) {
			return find(arr, function (attr) {
				return attr in doc;
			});
		});
		return {
			hidden: values[0],
			visibilityState: values[1],
		}
	}
	// 获取元素的计算属性，参数：el元素、css属性、pseudoEl伪元素
	function computedStyle(el, css, pseudoEl) {
		pseudoEl = pseudoEl || null;
		return win.getComputedStyle(el, pseudoEl)[css];
	}
	// 获取元素translate值
	function getTranslate(el) {
		if (!el instanceof Element) throw new TypeError(el + 'is not a Element');
		var transformArr = this.computedStyle(el, 'transform').replace(/\(|\)/g, '').split(','),
			isThreeD = transformArr[0].indexOf('3d') > -1,
			translateArr = isThreeD ? transformArr.slice(12, 15) : transformArr.slice(4),
			result = {
				x: 0,
				y: 0,
				z: 0,
			};
		Object.keys(result).forEach(function (key, i) {
			// 对于transform为none未设置和translateY没有的情况，自动补充为0
			result[key] = parseFloat(translateArr[i]) || 0;
		});
		return result;
	}
	// 节流函数
	function throttle(fn, interval) {
		var prevTime = 0;
		return function () {
			var thisArg = this,
				now = performance.now();
			if (now - prevTime > interval) {
				fn.apply(thisArg, arguments);
				prevTime = now;
			}
		}
	}

	function extend(tarObj, initObj) {
		var _this = this;
		is.und(tarObj) && (tarObj = {});
		is.und(initObj) && (initObj = {});
		Object.keys(initObj).forEach(function (key) {
			if (is.und(tarObj[key])) {
				tarObj[key] = initObj[key];
			} else if (is.obj(initObj[key])) {
				_this.extend(tarObj[key], initObj[key]);
			}
		});
	}

	function getTransitionEndName() {
		var div = doc.createElement('div'),
			transitionendName = '';
		if ('onwebkittransitionend' in div && !('ontransitionend' in div)) {
			transitionendName = 'webkitTransitionEnd';
		} else {
			transitionendName = 'transitionend';
		}
		div = null;
		return transitionendName;
	}
	var _ = {
		uuid: uuid,
		flat: flat,
		find: find,
		values: values,
		typeOf: typeOf,
		extend: extend,
		throttle: throttle,
		closest: closest,
		toArray: toArray,
		computedStyle: computedStyle,
		getTranslate: getTranslate,
		getClassSelector: getClassSelector,
		pageVisibility: getPageVisibility(),
		transitionendName: getTransitionEndName()
	}
	// ### 2、参数中CSS样式对象的解析方法和类
	// 2.1 处理CSS样式对象工具类
	var CssUtils = {
		// 将小驼峰形式转成-连接符形式
		toConnectorForm: function (prop) {
			var rgep = /[A-Z]/g,
				res = null,
				matchedChar = '',
				replacedChar = function () {
					return '-' + matchedChar.toLowerCase();
				};
			while ((res = rgep.exec(prop)) !== null) {
				matchedChar = res[0];
				prop = prop.replace(matchedChar, replacedChar());
			};
			return prop;
		},
		// 将CSS对象的所有属性转成-连接符形式
		normalizeCssObj: function (cssObj) {
			var _this = this;
			Object.keys(cssObj).forEach(function (key) {
				var newKey = _this.toConnectorForm(key);
				if (newKey !== key) {
					cssObj[newKey] = cssObj[key];
					delete cssObj[key];
				}
			});
		},
		// 删除CSS对象的无用属性
		removeUselessKey: function (cssObj) {
			Object.keys(cssObj).forEach(function (key) {
				is.und(cssObj[key]) && (delete cssObj[key]);
			});
		},
		// 获取所有没有被禁用的style标签
		obtainAvailStyles: function () {
			var sheets = _.toArray(doc.styleSheets),
				availSheets = sheets.filter(function (sheetList) {
					return !sheetList.disabled && sheetList.ownerNode.tagName === 'STYLE';
				});
			return availSheets;
		},
		// 页面中添加CSS样式新规则，参数：[cssText,cssText,...]数组
		insertCssText: function (targetSheet, cssTextArr) {
			cssTextArr.forEach(function (text) {
				targetSheet.insertRule(text, targetSheet.cssRules.length);
			});
		},
		// 获取cssText样式规则
		cssText: function (cssObj, key) {
			var value = Object.keys(cssObj).map(function (key) {
				return key + ':' + cssObj[key] + '!important;';
			}).join('');
			return key + '{' + value + '}';
		},
	}
	// 2.2 EmpileCssParser解析类
	function EmpileCssParser(cssParam) {
		// if (!new.target) {
		//   throw new TypeError('The constructor ' + arguments.callee.name + ' cannot be invoked widthout "new"');
		// }
		var _this = this;
		this.cssParam = cssParam;
		this.sheets = this.obtainAvailStyles();
		this.lastSheet = this.getLastStyle();
		// 获取计算后的css对象
		this.computeCssObj = (function () {
			var typeOptions = ['Function', 'Object'],
				computeMethodFn = [_this.exeCssFnSelf, _this.generateCssObj],
				cssParamType = _.typeOf(_this.cssParam),
				typeIndex = typeOptions.indexOf(cssParamType);
			return function () {
				return computeMethodFn[typeIndex].apply(_this, arguments);
			}
		})();
		this.init();
	}
	// 创建EmpileCssParser原型对象，并将自定义的css工具方法添加至其原型
	var EmpileCssParserProto = Object.create(CssUtils);
	// 初始化
	EmpileCssParserProto.init = function () {
		var cssParam = this.cssParam;
		if (is.obj(cssParam)) {
			this.initCssParam();
		} else if (is.fun(cssParam)) {
			// 将要执行的cssParam函数形式的属性或其本身
			this.willExeCssFn = this.cssParam;
		}
	};
	EmpileCssParserProto.getLastStyle = function () {
		if (is.emptyArr(this.sheets)) {
			var style = doc.createElement('style');
			doc.head.appendChild(style);
			this.sheets = this.obtainAvailStyles();
		}
		return this.sheets[this.sheets.length - 1];
	};
	// 初始化cssParam对象
	EmpileCssParserProto.initCssParam = function () {
		var cssParam = this.cssParam;
		// 移除cssParam对象的无用属性
		this.removeUselessKey(cssParam);
		// 将cssParam对象属性名转成'-'连接符形式
		this.normalizeCssObj(cssParam);
	};
	// 执行css对象中的函数或其本身
	EmpileCssParserProto.exeCssFnSelf = function () {
		var cssObj = this.willExeCssFn.apply(this, arguments);
		this.normalizeCssObj(cssObj); // 再次标准化该css对象
		return cssObj;
	};
	// css为对象嵌套函数式时
	EmpileCssParserProto.generateCssObj = function () {
		var _this = this,
			cssObj = {},
			cssParam = this.cssParam,
			args = arguments;
		Object.keys(cssParam).forEach(function (key) {
			var item = cssParam[key];
			// 如果是函数，就获取其返回结果
			if (is.fun(item)) {
				_this.willExeCssFn = item;
				cssObj[key] = _this.willExeCssFn.apply(_this, args);
				return;
			}
			cssObj[key] = item;
		});
		return cssObj;
	};
	// 将EmpileCssParserProto绑定为EmpileCssParser的原型
	EmpileCssParser.prototype = EmpileCssParserProto;
	// ## 3、EventDispatcher，自定义事件类
	var EventDispatcher = {
		on: function (name, cb) {
			var stores = this.eventsListeners;
			if (is.und(stores[name])) {
				stores[name] = [cb];
			} else if (stores[name].indexOf(cb) === -1) {
				stores[name].push(cb);
			}
		},
		once: function (name, cb) {
			var stores = this.eventsListeners,
				_this = this;
			once = function () {
				cb.call(_this);
				_this.off(name, cb);
			}
			once.source = cb;
			this.on(name, once);
		},
		trigger: function (name) {
			var stores = this.eventsListeners,
				_this = this,
				resArgs = _.toArray(arguments).slice(1);
			if (!is.und(stores[name])) {
				stores[name].forEach(function (cb) {
					cb.apply(_this, resArgs);
				});
			}
		},
		off: function (name, cb) {
			var stores = this.eventsListeners,
				thisEvStore = stores[name];
			if (is.und(thisEvStore) || is.emptyArr(thisEvStore)) {
				return;
			}
			stores[name] = thisEvStore.filter(function (callback) {
				return callback !== cb || callback.source !== cb;
			});
		},
	}
	// ### 4、轮播图主体代码部分
	// 初始化slides配置信息
	function initSlidesInfo() {
		var empile = this,
			wrapper = empile.wrapper,
			params = empile.params,
			clickable = params.isClickSlide,
			originList = _.toArray(wrapper.children),
			length = originList.length,
			lastIndex = length - 1,
			mediant = Math.floor(lastIndex / 2),
			baseIndex = is.und(params.baseIndex) ? mediant : params.baseIndex,
			viewSplitIndex = length - baseIndex,
			list = originList.slice(viewSplitIndex).concat(originList.slice(0, viewSplitIndex)),
			dataSlideId = 'data-empile-slide-id',
			dataSlideIndex = 'data-empile-slide-index',
			dataAttrArr = list.map(function (item, index) {
				return {
					dataSlideId: _.uuid(14, 16),
					dataSlideIndex: index,
				}
			}),
			allTransitTime = originList.map(function (item) {
				var value = _.computedStyle(item, 'transition-duration');
				return Math.max.apply(null, value.split(',').map(function (val) {
					return parseFloat(val);
				}));
			}),
			maxTransitTime = Math.max.apply(null, allTransitTime),
			maxTransitTimeSlide = originList[allTransitTime.indexOf(maxTransitTime)],
			transitInterval = maxTransitTime * 1000;
		empile.slides = {
			list: list,
			originList: originList,
			length: length,
			lastIndex: lastIndex,
			mediant: mediant,
			baseIndex: baseIndex,
			dataSlideId: dataSlideId,
			dataSlideIndex: dataSlideIndex,
			clickable: clickable,
			dataAttrArr: dataAttrArr,
			maxTransitTime: maxTransitTime,
			transitInterval: transitInterval,
			maxTransitTimeSlide: maxTransitTimeSlide,
		}
	}
	// 初始化每张卡片要填入的css styleSheet的样式规则
	function initStyleRules() {
		var empile = this,
			params = empile.params,
			slides = empile.slides,
			slidesLen = slides.length,
			baseIndex = slides.baseIndex,
			dataAttrArr = slides.dataAttrArr,
			uidKey = slides.dataSlideId; // 卡片的'data-slide-id'属性名
		// 新建一个css规则解析类
		var empileCss = new EmpileCssParser(params.css),
			cssTextArr = [];
		// 插入需要计算的cssParam样式
		for (var index = 0; index < slidesLen; index++) {
			var coord = index - baseIndex, // 坐标系索引
				absCoord = Math.abs(coord); // 坐标系索引绝对值
			var uidVal = dataAttrArr[index].dataSlideId, // 卡片'data-slide-id'属性值
				selector = '[' + uidKey + '="' + uidVal + '"]'; // css规则选择器
			var cssObj = empileCss.computeCssObj(coord, absCoord, index), // 获取计算后的CssParam
				cssText = empileCss.cssText(cssObj, selector); // 生成cssText内容
			cssTextArr.push(cssText);
		}
		var lastSheet = empileCss.lastSheet;
		empileCss.insertCssText(lastSheet, cssTextArr); // 统一将cssText插入styleSheets中
	}

	function initEventHandlers() {
		var empile = this,
			params = empile.params,
			eventsHandlerConfig = ['on', 'once'].map(function (key) {
				return {
					type: key,
					value: params[key],
				}
			});

		function filterEventType(typeObj) {
			var events = null,
				eventsObj = typeObj.value,
				type = typeObj.type;
			if (is.obj(eventsObj)) {
				events = Object.keys(eventsObj);
				events.length > 0 && events.forEach(function (key) {
					empile[type](key, eventsObj[key]);
				});
			}
		}
		eventsHandlerConfig.forEach(filterEventType);
	}

	function initPagination() {
		var empile = this,
			params = empile.params,
			pagination = params.pagination,
			notPointBeginReg = /^[^.]+/, // 判断不是.开头且长度大于0的字符串
			el = null,
			bulletClass = '',
			bulletActiveClass = '';
		if (is.obj(pagination)) {
			el = pagination.el;
			bulletClass = pagination.bulletClass;
			bulletActiveClass = pagination.bulletActiveClass;
			if (notPointBeginReg.test(bulletActiveClass) && notPointBeginReg.test(bulletClass) &&
				el instanceof Element) {
				pagination.dots = _.toArray(el.querySelectorAll('.' + bulletClass));
				pagination.enable = true;
				pagination.click = true;
				return;
			}
		}
		params.pagination = {
			enable: false,
			click: false,
		}
	}
	var Init = {
		initSlidesInfo: initSlidesInfo,
		initStyleRules: initStyleRules,
		initEventHandlers: initEventHandlers,
		initPagination: initPagination
	}
	// Event Hooks
	var EMPILE_HOOKS = {
		toEdge: 'toEdge',
		slideChange: 'slideChange',
		transitionEnd: 'transitionEnd',
		transitionStart: 'transitionStart',
		toPrevTransitionEnd: 'toPrevTransitionEnd',
		toNextTransitionEnd: 'toNextTransitionEnd',
		toPrevTransitionStart: 'toPrevTransitionStart',
		toNextTransitionStart: 'toNextTransitionStart',
		clickPrevBtn: 'clickPrevBtn',
		clickNextBtn: 'clickNextBtn',
		clickSlide: 'clickSlide',
		clickPaginationBullet: 'clickPaginationBullet',
		pageHidden: 'pageHidden',
		pageVisible: 'pageVisible'
	}
	// slideTo
	function afterSlideTo() {
		var empile = this,
			interval = empile.slides.transitInterval;
		empile.trigger(EMPILE_HOOKS.transitionStart, empile);
		//等待过渡完成再触发transitionEnd
		clearTimeout(empile.afterSlideTo.transitionEndTimer);
		empile.afterSlideTo.transitionEndTimer = setTimeout(function () {
			empile.trigger(EMPILE_HOOKS.transitionEnd, empile);
		}, interval);
	}

	function slideToPrev() {
		var empile = this,
			dataAttrArr = empile.slides.dataAttrArr;
		dataAttrArr.push(dataAttrArr.shift());
		empile.update();
		empile.afterSlideTo();
	}

	function slideToNext() {
		var empile = this,
			dataAttrArr = empile.slides.dataAttrArr;
		dataAttrArr.unshift(dataAttrArr.pop());
		empile.update();
		empile.afterSlideTo();
	}

	function slideToClickedSlide(target) {
		var empile = this,
			slides = empile.slides,
			baseIndex = slides.baseIndex,
			dataAttrArr = slides.dataAttrArr;
		is.finite(+target) && (target = slides.originList[+target]);
		var index = +target.getAttribute(slides.dataSlideIndex),
			diffI = baseIndex - index;
		slides.dataAttrArr = dataAttrArr.splice(diffI).concat(dataAttrArr);
		empile.update();
		empile.afterSlideTo();
	}
	var SlideTo = {
		slideToPrev: slideToPrev,
		slideToNext: slideToNext,
		slideToClickedSlide: slideToClickedSlide,
		afterSlideTo: afterSlideTo
	}
	// update
	function updateSlideDataAttr() {
		var empile = this,
			slides = empile.slides,
			dataAttrArr = slides.dataAttrArr;
		slides.list.forEach(function (el, index) {
			el.setAttribute(slides.dataSlideId, dataAttrArr[index].dataSlideId);
			el.setAttribute(slides.dataSlideIndex, dataAttrArr[index].dataSlideIndex);
		});
	}

	function updateActiveIndex() {
		var empile = this,
			slides = empile.slides,
			originList = slides.originList,
			list = slides.list,
			lastIndex = slides.lastIndex,
			previousIndex = empile.previousIndex,
			dataSlideIndex = slides.dataSlideIndex,
			baseIndex = slides.baseIndex,
			activeSlide = null,
			activeIndex;
		if (is.und(previousIndex)) {
			previousIndex = 0;
		} else {
			previousIndex = empile.activeIndex;
		}
		activeSlide = _.find(originList, function (slide) {
			var i = +slide.getAttribute(dataSlideIndex),
				flag = i === baseIndex;
			return flag;
		});
		activeIndex = originList.indexOf(activeSlide);
		empile.activeIndex = activeIndex;
		empile.previousIndex = previousIndex;
		empile.trigger(EMPILE_HOOKS.slideChange, empile);
		if (activeIndex === previousIndex) {
			return;
		}
		if (activeIndex === 0 || activeIndex === lastIndex) {
			empile.trigger(EMPILE_HOOKS.toEdge, empile);
		}
	}
	var updateDotsCss = function () {
		var pagination = this.params.pagination;
		if (!pagination.enable) {
			return;
		}
		var bulletActiveClass = pagination.bulletActiveClass,
			dots = pagination.dots;
		// 找到之前的active圆点
		var activeDots = _.find(dots, function (dot) {
			return dot.classList.contains(bulletActiveClass);
		}) || dots[0];
		// 清除之前的active样式类
		activeDots.classList.remove(bulletActiveClass);
		// 给当前圆点添加active样式类
		dots[this.activeIndex].classList.add(bulletActiveClass);
	}

	function update() {
		this.updateSlideDataAttr();
		this.updateActiveIndex();
		this.updateDotsCss();
	}
	var Update = {
		updateSlideDataAttr: updateSlideDataAttr,
		updateActiveIndex: updateActiveIndex,
		updateDotsCss: updateDotsCss,
		update: update,
	}
	//Empile prototypes
	var prototypes = {
		Update: Update,
		SlideTo: SlideTo,
		EventDispatcher: EventDispatcher,
	}
	// Autoplay
	var Autoplay = {
		init: function () {
			var empile = this,
				autoplay = empile.params.autoplay,
				delay = 0;
			// 过滤筛选autoplay
			if (is.bol(autoplay)) {
				is.true(autoplay) && (delay = 4000);
			} else if (is.obj(autoplay)) {
				if (is.und(autoplay.delay)) throw new Error('autoplay.delay is not defined!')
				autoplay.delay = delay = parseFloat(autoplay.delay);
			}
			empile.params.autoplay = {
				delay: delay,
			}
			// 如果delay时间是有效的，就准许自动轮播
			if (is.num(delay) && delay !== 0) {
				setTimeout(function () {
					empile.autoplay.visibilityChange();
				}, 0);
				return function () {
					empile.autoplay.run();
				}
			}
			return function () {}
		},
		run: function () {
			var empile = this,
				delay = empile.params.autoplay.delay;
			empile.autoplay.stop();
			empile.autoplay.timer = setInterval(function () {
				empile.slideToNext();
			}, delay);
		},
		stop: function () {
			var empile = this,
				delay = empile.params.autoplay.delay;
			if (delay) {
				return function () {
					clearInterval(empile.autoplay.timer);
					empile.autoplay.timer = void 0;
				}
			}
			return function () {};
		},
		visibilityChange: function () {
			var empile = this,
				autoplay = empile.params.autoplay,
				docHiddenOff = autoplay.docHiddenOff,
				delay = 0;
			// 过滤筛选docHiddenOff
			if (is.bol(docHiddenOff)) {
				if (is.true(docHiddenOff)) delay = 2000;
				else return;
			} else if (is.obj(docHiddenOff)) {
				if (is.und(docHiddenOff.delay)) throw new Error('docHiddenOff.delay is not defined!');
				docHiddenOff.delay = delay = parseFloat(docHiddenOff.delay);
			}
			autoplay.docHiddenOff = {
				delay: delay,
			}
			return function () {
				var autoplay = empile.autoplay,
					visibleTimer = null,
					isPageHidden = false,
					pageHiddenAttr = _.pageVisibility.hidden,
					autoplayStop = autoplay.stop.bind(empile);
				doc.addEventListener('visibilitychange', function () {
					var pageHidden = doc[pageHiddenAttr];
					if (pageHidden) {
						isPageHidden = true;
						visibleTimer = setTimeout(autoplayStop, delay);
						empile.trigger(EMPILE_HOOKS.pageHidden, empile);
					} else {
						if (isPageHidden) {
							isPageHidden = false;
							clearTimeout(visibleTimer);
							autoplay.init();
						}
						empile.trigger(EMPILE_HOOKS.pageVisible, empile);
					}
				});
			}
		},
	}
	// Click
	var Click = {
		init: function () {
			var empile = this;
			empile.click.getCanClickEles();
			if (is.emptyArr(empile.click.canClickEles)) {
				return;
			}
			empile.click.run();
		},
		run: function () {
			var empile = this,
				wrapper = empile.wrapper,
				wrapperClickFun = empile.click.getClickFun();
			empile.on(EMPILE_HOOKS.transitionEnd, empile.autoplay.init);
			wrapper.parentElement.addEventListener('click', wrapperClickFun);
		},
		getClickFun: function () {
			var empile = this,
				slides = empile.slides,
				originList = slides.originList,
				canClickEles = empile.click.canClickEles,
				params = empile.params,
				navigation = params.navigation,
				pagination = params.pagination,
				paginationDots = pagination.dots,
				interval = slides.transitInterval,
				waitForTransition = params.waitForTransition;
			var wrapperClickFn = function (ev) {
				var willTar = _.find(canClickEles, function (e) {
						return e === _.closest(ev.target, e);
					}),
					activeIndex = empile.activeIndex,
					slideIndex = originList.indexOf(willTar);
				if (is.und(willTar)) {
					return;
				}
				if (willTar === navigation.prevEl) {
					empile.slideToPrev();
					empile.trigger(EMPILE_HOOKS.clickPrevBtn, ev);
				} else if (willTar === navigation.nextEl) {
					empile.slideToNext();
					empile.trigger(EMPILE_HOOKS.clickNextBtn, ev);
				} else if (slideIndex > -1) {
					if (slideIndex === activeIndex) {
						empile.trigger(EMPILE_HOOKS.clickSlide, ev);
						return;
					}
					empile.slideToClickedSlide(willTar);
					empile.trigger(EMPILE_HOOKS.clickSlide, ev);
				} else {
					var dotIndex = paginationDots.indexOf(willTar);
					if (dotIndex > -1) {
						empile.slideToClickedSlide(originList[dotIndex]);
						empile.trigger(EMPILE_HOOKS.clickPaginationBullet, ev);
					}
				}
			}
			return is.true(waitForTransition) ? _.throttle(wrapperClickFn, interval) : wrapperClickFn;
		},
		getCanClickEles: function () {
			var empile = this,
				slides = empile.slides,
				navigation = empile.params.navigation,
				canClickEles = empile.click.canClickEles,
				pagination = empile.params.pagination;
			Object.keys(navigation).forEach(function (key) {
				!is.null(navigation[key]) && canClickEles.push(navigation[key]);
			});
			is.true(slides.clickable) && canClickEles.push(slides.list);
			is.true(pagination.clickable) && pagination.dots.forEach(function (dot) {
				canClickEles.push(dot);
			});
			empile.click.canClickEles = _.flat(canClickEles, Infinity);
		},
	}
	var defaultParams = {
		isClickSlide: false,
		waitForTransition: false,
		autoplay: false,
		navigation: {
			nextEl: null,
			prevEl: null,
		},
		pagination: {
			el: null,
			bulletClass: '',
			bulletActiveClass: '',
			clickable: false,
			enable: false,
			dots: [],
		},
		css: {},
	}
	var Empile = function (wrapper, params) {
		_.extend(params, defaultParams); // 存储修正后的params
		this.params = params;
		this.wrapper = wrapper;
		_.extend(this, {
			eventsListeners: {},
			autoplay: {
				visibilityChange: Autoplay.visibilityChange.call(this),
				init: Autoplay.init.call(this),
				run: Autoplay.run.bind(this),
				stop: Autoplay.stop.call(this),
			},
			click: {
				canClickEles: [],
				init: Click.init.bind(this),
				run: Click.run.bind(this),
				getClickFun: Click.getClickFun.bind(this),
				getCanClickEles: Click.getCanClickEles.bind(this),
			},
		});
		this.init();
	}
	Empile.prototype.init = function () {
		var empile = this;
		Object.keys(Init).forEach(function (key) {
			Init[key].call(empile);
		});
		empile.update(); // 给卡片设置所需的data-属性
		empile.autoplay.init(); // 初始化定时器
		empile.click.init(); // 初始化点击事件
	}
	Object.keys(prototypes).forEach(function (group) {
		Object.keys(prototypes[group]).forEach(function (method) {
			!Empile.prototype[method] && (Empile.prototype[method] = prototypes[group][method]);
		});
	});
	console.log('Empile', Empile.prototype)
	win.EmpileCssParser = EmpileCssParser;
	win.Empile = Empile;
})(window, document);