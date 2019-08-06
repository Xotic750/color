/*!
{
  "author": "Graham Fairweather",
  "copywrite": "Copyright (c) Graham Fairweather",
  "date": "2019-08-06T22:00:47.269Z",
  "describe": "",
  "description": "Color conversion and manipulation library",
  "file": "color.js",
  "hash": "e137bef8c18d6c6c472d",
  "license": "MIT",
  "version": "1.0.16"
}
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["color"] = factory();
	else
		root["color"] = factory();
})((function () {
  'use strict';

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return Function('return this')();
}()), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(10);
const route = __webpack_require__(19);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(9);
var swizzle = __webpack_require__(17);

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = (parseFloat(match[1]) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(23);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var baseHas = __webpack_require__(28),
    hasPath = __webpack_require__(29);

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(20),
    toNumber = __webpack_require__(11);

/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}

module.exports = clamp;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(21),
    isIterateeCall = __webpack_require__(22),
    toInteger = __webpack_require__(2);

/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function slice(array, start, end) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  }
  else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }
  return baseSlice(array, start, end);
}

module.exports = slice;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(4);

/**
 * Casts `value` as an array if it's not one.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Lang
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast array.
 * @example
 *
 * _.castArray(1);
 * // => [1]
 *
 * _.castArray({ 'a': 1 });
 * // => [{ 'a': 1 }]
 *
 * _.castArray('abc');
 * // => ['abc']
 *
 * _.castArray(null);
 * // => [null]
 *
 * _.castArray(undefined);
 * // => [undefined]
 *
 * _.castArray();
 * // => []
 *
 * var array = [1, 2, 3];
 * console.log(_.castArray(array) === array);
 * // => true
 */
function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}

module.exports = castArray;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(39);

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(9);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var createRound = __webpack_require__(24);

/**
 * Computes `number` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */
var round = createRound('round');

module.exports = round;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

module.exports = isNil;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var isInteger = __webpack_require__(40);

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
 * double precision number which isn't the result of a rounded unsafe integer.
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
 * @example
 *
 * _.isSafeInteger(3);
 * // => true
 *
 * _.isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isSafeInteger(Infinity);
 * // => false
 *
 * _.isSafeInteger('3');
 * // => false
 */
function isSafeInteger(value) {
  return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
}

module.exports = isSafeInteger;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hashedModelKeys", function() { return hashedModelKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Color; });
/* harmony import */ var color_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var color_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_string__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var color_convert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var color_convert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(color_convert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_clamp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var lodash_clamp__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_clamp__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_slice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var lodash_slice__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_slice__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_round__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var lodash_round__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_round__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash_castArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);
/* harmony import */ var lodash_castArray__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_castArray__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3);
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash_has__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash_isNil__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(14);
/* harmony import */ var lodash_isNil__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash_isNil__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var lodash_toInteger__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2);
/* harmony import */ var lodash_toInteger__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(lodash_toInteger__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var lodash_includes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8);
/* harmony import */ var lodash_includes__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(lodash_includes__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var lodash_isSafeInteger__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(15);
/* harmony import */ var lodash_isSafeInteger__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(lodash_isSafeInteger__WEBPACK_IMPORTED_MODULE_10__);
var _this = undefined;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }












/**
 * Test if a value is a counting number, 1 -> MAX_SAFE_INTEGER.
 *
 * @param {*} value - The value to be tested.
 * @returns {boolean} True if value is a counting number.
 */

var isCountingNumber = function isCountingNumber(value) {
  return lodash_isSafeInteger__WEBPACK_IMPORTED_MODULE_10___default()(value) && value > 0;
};

var EMPTY_STRING = '';
var ALPHA = 'alpha';
var RGB = 'rgb';
var HSL = 'hsl';
var HSV = 'hsv';
var HWB = 'hwb';
var HCG = 'hcg';
var XYZ = 'xyz';
var LAB = 'lab';
var CMYK = 'cmyk';
var AA = 'AA';
var AAA = 'AAA';
/** @type {ReadonlyArray<string>} */

var rgbKeys = Object.freeze(RGB.split(EMPTY_STRING));
/** @type {ReadonlyArray<string>} */

var skippedModels = Object.freeze([
/* to be honest, I don't really feel like keyword belongs in color convert, but eh. */
'keyword',
/* gray conflicts with some method names, and has its own method defined. */
'gray',
/* shouldn't really be in color-convert either... */
'hex']);
/** @type {Readonly<string>} */

var hashedModelKeys = Object.freeze(Object.keys(color_convert__WEBPACK_IMPORTED_MODULE_1___default.a).reduce(function (hashed, model) {
  _newArrowCheck(this, _this);

  var prop = lodash_slice__WEBPACK_IMPORTED_MODULE_3___default()(color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[model].labels).sort().join(EMPTY_STRING);
  hashed[prop] = model;
  return hashed;
}.bind(undefined), Object.create(null)));
/**
 * The minimum values for WCAG rating.
 *
 * @type {Readonly}
 * @property {number} aa - AA minimum value.
 * @property {number} aaa - AAA minimum value.
 * @property {number} aaaLarge - AAA Large minimum value.
 * @property {number} aaLarge - AA Large minimum value.
 */

var minimums = Object.freeze({
  aa: 4.5,
  aaa: 7,
  aaaLarge: 4.5,
  aaLarge: 3
});
/**
 * Create a bound function that clamps the value to between 0 and max inclusive.
 *
 * @param {number} max - The maximum value.
 * @returns {function({value: number}): number} - The bound clamp function.
 */

var maxfn = function maxfn(max) {
  return function boundMaxfn(value) {
    // noinspection JSCheckFunctionSignatures
    return lodash_clamp__WEBPACK_IMPORTED_MODULE_2___default()(value, 0, max);
  };
};
/**
 * Partially zeros an array to a specified length.
 *
 * @param {Array} array - The array to be partially zeroed.
 * @param {number} [length=0] - The length to zero to.
 * @returns {Array<*>} - The partially zeroed array.
 */


var zeroArray = function zeroArray(array) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  for (var index = 0; index < length; index += 1) {
    if (typeof array[index] !== 'number') {
      array[index] = 0;
    }
  }

  return array;
};
/**
 * Test if a value is a possible model.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} - Indicates if value is a possible model.
 */


var isModel = function isModel(value) {
  return typeof value === 'string' && Boolean(value.trim());
};
/**
 * Convert value to appropriate number for rounding places.
 *
 * @param {*} value - The value to convert.
 * @param {number} [defaultTo=1] - The value to use if value is not a number.
 * @returns {number} - The number of places.
 */


var getPlaces = function getPlaces(value) {
  var defaultTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return typeof value === 'number' ? lodash_toInteger__WEBPACK_IMPORTED_MODULE_8___default()(value) || 0 : defaultTo;
};
/**
 * Convert a color object to an array.
 *
 * @param {Color} colorObject - The color object.
 * @returns {Array<number>} - The array from the color object.
 */


var getColorArray = function getColorArray(colorObject) {
  var color = colorObject.color,
      valpha = colorObject.valpha; // noinspection JSIncompatibleTypesComparison

  return valpha === 1 ? color : [].concat(_toConsumableArray(color), [valpha]);
};
/**
 * Get the model.
 *
 * @param {*} value - The value provided as the model.
 * @returns {null|string} - The model.
 * @throws {Error} - If model is invalid.
 */


var getModel = function getModel(value) {
  if (isModel(value)) {
    if (lodash_includes__WEBPACK_IMPORTED_MODULE_9___default()(skippedModels, value)) {
      return null;
    }

    if (!lodash_has__WEBPACK_IMPORTED_MODULE_6___default()(color_convert__WEBPACK_IMPORTED_MODULE_1___default.a, value)) {
      throw new Error("Unknown model: ".concat(value));
    }
  }

  return value;
};
/**
 * @type {Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}
 * */


var instanceLockDescription = Object.freeze({
  configurable: false,
  enumerable: true,
  writable: false
});
/**
 *
 * @type {Readonly<{color: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, model: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, valpha: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}>}
 */

var colorDescription = Object.freeze({
  color: instanceLockDescription,
  model: instanceLockDescription,
  valpha: instanceLockDescription
});
var limiters = Object.create(null);
/**
 * The Color class.
 *
 * @class Color
 * @type {object}
 * @property {Array<number>} color - The color represented in the model array.
 * @property {string} model - The color model.
 * @property {number} valpha - The alpha value of the color.
 */

var Color =
/*#__PURE__*/
function () {
  /**
   * @param {*} obj - The color definition.
   * @param {string} [modelOption] - The model.
   */
  function Color(obj, modelOption) {
    var _this2 = this;

    _classCallCheck(this, Color);

    var model = getModel(modelOption);

    if (lodash_isNil__WEBPACK_IMPORTED_MODULE_7___default()(obj)) {
      this.model = RGB;
      this.color = [0, 0, 0];
      this.valpha = 1;
    } else if (obj instanceof Color) {
      this.model = obj.model;
      this.color = _toConsumableArray(obj.color);
      this.valpha = obj.valpha;
    } else if (typeof obj === 'string') {
      var result = color_string__WEBPACK_IMPORTED_MODULE_0___default.a.get(obj);

      if (result === null) {
        throw new Error("Unable to parse color from string: ".concat(obj));
      }

      this.model = result.model;
      var channels = color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model].channels;
      this.color = result.value.slice(0, channels);
      this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
    } else if (isCountingNumber(obj.length)) {
      this.model = model || RGB;
      var _channels = color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model].channels;
      var newArr = lodash_slice__WEBPACK_IMPORTED_MODULE_3___default()(obj, 0, _channels);
      this.color = zeroArray(newArr, _channels);
      this.valpha = typeof obj[_channels] === 'number' ? obj[_channels] : 1;
    } else if (typeof obj === 'number') {
      /* this is always RGB - can be converted later on. */
      this.model = RGB;
      /* eslint-disable-next-line no-bitwise */

      var number = obj & 0xffffff;
      /* eslint-disable-next-line no-bitwise */

      this.color = [number >> 16 & 0xff, number >> 8 & 0xff, number & 0xff];
      this.valpha = 1;
    } else {
      this.valpha = 1;
      var keys = Object.keys(obj);

      if (lodash_has__WEBPACK_IMPORTED_MODULE_6___default()(obj, ALPHA)) {
        keys.splice(keys.indexOf(ALPHA), 1);
        this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
      }

      var hashedKeys = keys.sort().join(EMPTY_STRING);

      if (!lodash_has__WEBPACK_IMPORTED_MODULE_6___default()(hashedModelKeys, hashedKeys)) {
        throw new Error("Unable to parse color from object: ".concat(JSON.stringify(obj)));
      }

      this.model = hashedModelKeys[hashedKeys];
      var color = color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model].labels.split(EMPTY_STRING).map(function (label) {
        _newArrowCheck(this, _this2);

        return obj[label];
      }.bind(this));
      this.color = zeroArray(color);
    }
    /* perform limitations (clamping, etc.) */


    if (limiters[this.model]) {
      var _channels2 = color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model].channels;
      var limiter = limiters[this.model];

      for (var index = 0; index < _channels2; index += 1) {
        var limit = limiter[index];

        if (limit) {
          this.color[index] = limit(this.color[index]);
        }
      }
    }

    this.valpha = lodash_clamp__WEBPACK_IMPORTED_MODULE_2___default()(this.valpha, 0, 1);
    Object.freeze(this.color);
    Object.defineProperties(this, colorDescription);
  }
  /**
   * @returns {string} - The string representation.
   */


  _createClass(Color, [{
    key: "toString",
    value: function toString() {
      return this.string();
    } // toJSON() {
    //   return this[this.model]();
    // }

    /**
     * @param {number} [places] - The number of places to round to.
     * @returns {string} - The string representation.
     */

  }, {
    key: "string",
    value: function string(places) {
      var colorObject = (lodash_has__WEBPACK_IMPORTED_MODULE_6___default()(color_string__WEBPACK_IMPORTED_MODULE_0___default.a.to, this.model) ? this : this.rgb()).round(getPlaces(places));
      var args = getColorArray(colorObject);
      return color_string__WEBPACK_IMPORTED_MODULE_0___default.a.to[colorObject.model](args);
    }
    /**
     * @param {number} [places] - The number of places to round to.
     * @returns {string} - The string representation.
     */

  }, {
    key: "percentString",
    value: function percentString(places) {
      var colorObject = this.rgb().round(getPlaces(places));
      var args = getColorArray(colorObject);
      return color_string__WEBPACK_IMPORTED_MODULE_0___default.a.to.rgb.percent(args);
    }
    /**
     * @returns {Array<number>} - An array representation of the model.
     */

  }, {
    key: "array",
    value: function array() {
      return getColorArray(this);
    }
    /**
     * @returns {object} - The plain object representation of the model.
     */

  }, {
    key: "object",
    value: function object() {
      var _this3 = this;

      var labels = color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model].labels;
      var result = labels.split(EMPTY_STRING).reduce(function (obj, key, index) {
        _newArrowCheck(this, _this3);

        obj[key] = this.color[index];
        return obj;
      }.bind(this), {});

      if (this.valpha !== 1) {
        result.alpha = this.valpha;
      }

      return result;
    }
    /**
     * @returns {Array<number>} - An rgb array representation.
     */

  }, {
    key: "unitArray",
    value: function unitArray() {
      var _this4 = this;

      var rgb = this.rgb().color.map(function (value) {
        _newArrowCheck(this, _this4);

        return value / 255;
      }.bind(this));

      if (this.valpha !== 1) {
        rgb.push(this.valpha);
      }

      return rgb;
    }
    /**
     * @returns {object} - The rgb plain object representation.
     */

  }, {
    key: "unitObject",
    value: function unitObject() {
      var _this5 = this;

      var rgb = rgbKeys.reduce(function (object, key) {
        _newArrowCheck(this, _this5);

        object[key] /= 255;
        return object;
      }.bind(this), this.rgb().object());

      if (this.valpha !== 1) {
        rgb.alpha = this.valpha;
      }

      return rgb;
    }
    /**
     * @param {number} [places] - The number of places to round to.
     * @returns {Color} - A new Color object that has been rounded as specified.
     */

  }, {
    key: "round",
    value: function round(places) {
      var _this6 = this;

      var placesMax = Math.max(getPlaces(places, 0), 0); // noinspection JSCheckFunctionSignatures

      return new Color([].concat(_toConsumableArray(this.color.map(function (value) {
        _newArrowCheck(this, _this6);

        return lodash_round__WEBPACK_IMPORTED_MODULE_4___default()(value, placesMax);
      }.bind(this))), [this.valpha]), this.model);
    }
    /**
     * @param {number} [val] - The value to modify by.
     * @returns {number|Color} - A new Color object if val is specified, or the current alpha.
     */

  }, {
    key: "alpha",
    value: function alpha(val) {
      if (arguments.length) {
        return new Color([].concat(_toConsumableArray(this.color), [lodash_clamp__WEBPACK_IMPORTED_MODULE_2___default()(val, 0, 1)]), this.model);
      }

      return this.valpha;
    }
    /**
     * @param {*} [val] - A new color definition.
     * @returns {string|Color} - A new Color object if val is specified, or the current keyword.
     */

  }, {
    key: "keyword",
    value: function keyword(val) {
      if (arguments.length) {
        return new Color(val);
      }

      return color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model].keyword(this.color);
    }
    /**
     * @param {*} [val] - A new color definition.
     * @returns {string|Color} - A new Color object if val is specified, or the current hex.
     */

  }, {
    key: "hex",
    value: function hex(val) {
      if (arguments.length) {
        return new Color(val);
      }

      return color_string__WEBPACK_IMPORTED_MODULE_0___default.a.to.hex(this.rgb().round().color);
    }
    /**
     * @returns {number} - The current RGB value.
     */

  }, {
    key: "rgbNumber",
    value: function rgbNumber() {
      var rgb = this.rgb().color;
      /* eslint-disable-next-line no-bitwise */

      return (rgb[0] & 0xff) << 16 | (rgb[1] & 0xff) << 8 | rgb[2] & 0xff;
    }
    /**
     * @returns {number} - The current luminosity value.
     */

  }, {
    key: "luminosity",
    value: function luminosity() {
      var _this7 = this;

      /** @see {http://www.w3.org/TR/WCAG20/#relativeluminancedef} */
      var rgb = this.rgb().color;
      var lum = rgb.map(function (channel) {
        _newArrowCheck(this, _this7);

        var chan = channel / 255;
        return chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
      }.bind(this));
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    }
    /**
     * @param {Color} color2 - The color object to contrast this color with.
     * @returns {number} - The contrast value.
     */

  }, {
    key: "contrast",
    value: function contrast(color2) {
      if (!(color2 instanceof Color)) {
        throw new Error("Argument to \"contrast\" was not a Color instance, but rather an instance of ".concat(_typeof(color2)));
      }
      /** @see {http://www.w3.org/TR/WCAG20/#contrast-ratiodef} */


      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();

      if (lum1 > lum2) {
        return (lum1 + 0.05) / (lum2 + 0.05);
      }

      return (lum2 + 0.05) / (lum1 + 0.05);
    }
    /**
     * @param {Color} color2 - The color object to contrast this color with.
     * @returns {string} - The WCAG contrast level.
     */

  }, {
    key: "level",
    value: function level(color2) {
      if (!(color2 instanceof Color)) {
        throw new Error("Argument to \"level\" was not a Color instance, but rather an instance of ".concat(_typeof(color2)));
      }

      var contrastRatio = this.contrast(color2);

      if (contrastRatio >= minimums.aaa) {
        return AAA;
      }

      return contrastRatio >= minimums.aa ? AA : EMPTY_STRING;
    }
    /**
     * @returns {boolean} - True if color is considered dark.
     */

  }, {
    key: "isDark",
    value: function isDark() {
      var rgb = this.rgb().color;
      /**
       * YIQ equation.
       *
       * @see {http://24ways.org/2010/calculating-color-contrast}
       */

      var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return yiq < 128;
    }
    /**
     * @returns {boolean} - True if color is considered light.
     */

  }, {
    key: "isLight",
    value: function isLight() {
      return !this.isDark();
    }
    /**
     * @returns {Color} - The new negated color.
     */

  }, {
    key: "negate",
    value: function negate() {
      var _this8 = this;

      var rgb = rgbKeys.reduce(function (object, key) {
        _newArrowCheck(this, _this8);

        object[key] = 255 - object[key];
        return object;
      }.bind(this), this.rgb().object());

      if (this.valpha !== 1) {
        rgb.alpha = this.valpha;
      }

      return new Color(rgb, this.model);
    }
    /**
     * @param {number} ratio - The ratio to lighten by.
     * @returns {Color} - The new lightened color.
     */

  }, {
    key: "lighten",
    value: function lighten(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2] + color[2] * ratio,
        s: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to darken by.
     * @returns {Color} - The new darkened color.
     */

  }, {
    key: "darken",
    value: function darken(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2] - color[2] * ratio,
        s: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to saturate by.
     * @returns {Color} - The new saturated color.
     */

  }, {
    key: "saturate",
    value: function saturate(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2],
        s: color[1] + color[1] * ratio
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to desaturate by.
     * @returns {Color} - The new desaturated color.
     */

  }, {
    key: "desaturate",
    value: function desaturate(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2],
        s: color[1] - color[1] * ratio
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to whiten by.
     * @returns {Color} - The new whitened color.
     */

  }, {
    key: "whiten",
    value: function whiten(ratio) {
      var color = _toConsumableArray(this.hwb().color);

      var obj = {
        b: color[2],
        h: color[0],
        w: color[1] + color[1] * ratio
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to blacken by.
     * @returns {Color} - The new blackened color.
     */

  }, {
    key: "blacken",
    value: function blacken(ratio) {
      var color = _toConsumableArray(this.hwb().color);

      var obj = {
        b: color[2] + color[2] * ratio,
        h: color[0],
        w: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @returns {Color} - The new greyscale color.
     */

  }, {
    key: "grayscale",
    value: function grayscale() {
      /** @see {http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale} */
      var rgb = this.rgb().color;
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      return Color.rgb(val, val, val);
    }
    /**
     * @param {number} ratio - The ratio to fade by.
     * @returns {Color} - The new faded color.
     */

  }, {
    key: "fade",
    value: function fade(ratio) {
      return this.alpha(this.valpha - this.valpha * ratio);
    }
    /**
     * @param {number} ratio - The ratio to modify opacity by.
     * @returns {Color} - The new opacity modified color.
     */

  }, {
    key: "opaquer",
    value: function opaquer(ratio) {
      return this.alpha(this.valpha + this.valpha * ratio);
    }
    /**
     * @param {number} degrees - The number of degrees to rotate by.
     * @returns {Color} - The new rotated color.
     */

  }, {
    key: "rotate",
    value: function rotate(degrees) {
      var color = _toConsumableArray(this.hsl().color);

      var _color = _slicedToArray(color, 1),
          hue = _color[0];

      var hueAngle = (hue + degrees) % 360;
      color[0] = hueAngle < 0 ? 360 + hueAngle : hueAngle;
      var obj = {
        h: color[0],
        l: color[2],
        s: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {Color} mixinColor - The color to mix in.
     * @param {number} [weight=0.5] - The mixing weight.
     * @returns {Color} - The new mixed color.
     * @throws {Error} If mixinColor is not a Color object.
     */

  }, {
    key: "mix",
    value: function mix(mixinColor, weight) {
      /**
       * Ported from sass implementation in C.
       *
       * @see {https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209}
       */
      if (!(mixinColor instanceof Color)) {
        throw new Error("Argument to \"mix\" was not a Color instance, but rather an instance of ".concat(_typeof(mixinColor)));
      }

      var color1 = mixinColor.rgb();
      var color2 = this.rgb();
      var p = arguments.length >= 2 ? weight : 0.5;
      var w = 2 * p - 1;
      var a = color1.alpha() - color2.alpha();
      var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
      var w2 = 1 - w1;
      return Color.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue(), color1.alpha() * p + color2.alpha() * (1 - p));
    }
  }]);

  return Color;
}();


var maxfn100 = maxfn(100);
var maxfn255 = maxfn(255);
/**
 * @param {string|Array<string>} model - The model(s).
 * @param {number} channel - The channel number.
 * @param {Function} [modifier] - The modifier function.
 * @returns {Function} - The bound getset function.
 */

var getset = function getset(model, channel, modifier) {
  var _this9 = this;

  var modelArray = lodash_castArray__WEBPACK_IMPORTED_MODULE_5___default()(model);
  modelArray.forEach(function (m) {
    _newArrowCheck(this, _this9);

    if (!Array.isArray(limiters[m])) {
      limiters[m] = [];
    }

    limiters[m][channel] = modifier;
  }.bind(this));

  var _modelArray = _slicedToArray(modelArray, 1),
      modelValue = _modelArray[0];

  return function boundGetset(value) {
    var _this10 = this;

    if (arguments.length) {
      var val = modifier ? modifier(value) : value;
      /* eslint-disable-next-line babel/no-invalid-this */

      var colorInstance = this[modelValue]();

      var color = _toConsumableArray(colorInstance.color);

      color[channel] = val;
      var object = modelValue.split(EMPTY_STRING).reduce(function (obj, key, index) {
        _newArrowCheck(this, _this10);

        obj[key] = color[index];
        return obj;
      }.bind(this), {});
      /* eslint-disable-next-line babel/no-invalid-this */

      if (this.valpha !== 1) {
        /* eslint-disable-next-line babel/no-invalid-this */
        object.alpha = this.valpha;
      }

      return new Color(object, modelValue);
    }
    /* eslint-disable-next-line babel/no-invalid-this */


    var colorChannel = this[modelValue]().color[channel];
    return modifier ? modifier(colorChannel) : colorChannel;
  };
};

Object.defineProperties(Color.prototype, {
  a: {
    value: getset(LAB, 1)
  },
  b: {
    value: getset(LAB, 2)
  },
  black: {
    value: getset(CMYK, 3, maxfn100)
  },
  blue: {
    value: getset(RGB, 2, maxfn255)
  },
  chroma: {
    value: getset(HCG, 1, maxfn100)
  },
  cyan: {
    value: getset(CMYK, 0, maxfn100)
  },
  gray: {
    value: getset(HCG, 2, maxfn100)
  },
  green: {
    value: getset(RGB, 1, maxfn255)
  },
  hue: {
    value: getset([HSL, HSV, HWB, HCG], 0, function (val) {
      _newArrowCheck(this, _this);

      return (val % 360 + 360) % 360;
    }.bind(undefined))
  },
  l: {
    value: getset(LAB, 0, maxfn100)
  },
  lightness: {
    value: getset(HSL, 2, maxfn100)
  },
  magenta: {
    value: getset(CMYK, 1, maxfn100)
  },

  /* rgb */
  red: {
    value: getset(RGB, 0, maxfn255)
  },
  saturationl: {
    value: getset(HSL, 1, maxfn100)
  },
  saturationv: {
    value: getset(HSV, 1, maxfn100)
  },
  value: {
    value: getset(HSV, 2, maxfn100)
  },
  wblack: {
    value: getset(HWB, 2, maxfn100)
  },
  white: {
    value: getset(HWB, 1, maxfn100)
  },
  x: {
    value: getset(XYZ, 0, maxfn100)
  },
  y: {
    value: getset(XYZ, 1, maxfn100)
  },
  yellow: {
    value: getset(CMYK, 2, maxfn100)
  },
  z: {
    value: getset(XYZ, 2, maxfn100)
  }
});
/* model conversion methods and static constructors */

Object.keys(color_convert__WEBPACK_IMPORTED_MODULE_1___default.a).forEach(function (model) {
  _newArrowCheck(this, _this);

  if (lodash_includes__WEBPACK_IMPORTED_MODULE_9___default()(skippedModels, model)) {
    return;
  }

  var channels = color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[model].channels;
  /* conversion methods */

  Object.defineProperty(Color.prototype, model, {
    value: function conversionMethod() {
      if (this.model === model) {
        return new Color(this);
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length) {
        return new Color(args, model);
      }

      var newAlpha = typeof args[channels] === 'number' ? channels : this.valpha;
      return new Color([].concat(_toConsumableArray(lodash_castArray__WEBPACK_IMPORTED_MODULE_5___default()(color_convert__WEBPACK_IMPORTED_MODULE_1___default.a[this.model][model].raw(this.color))), [newAlpha]), model);
    }
  });
  /* 'static' construction methods */

  Object.defineProperty(Color, model, {
    enumerable: true,
    value: function constructionMethod() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var color = args[0];
      var col = typeof color === 'number' ? zeroArray(args, channels) : color;
      return new Color(col, model);
    }
  });
}.bind(undefined));



/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(18);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(10);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

module.exports = baseClamp;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(25),
    toInteger = __webpack_require__(2),
    toNumber = __webpack_require__(11),
    toString = __webpack_require__(12);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = root.isFinite,
    nativeMin = Math.min;

/**
 * Creates a function like `_.round`.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
function createRound(methodName) {
  var func = Math[methodName];
  return function(number, precision) {
    number = toNumber(number);
    precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
    if (precision && nativeIsFinite(number)) {
      // Shift with exponential notation to avoid floating-point issues.
      // See [MDN](https://mdn.io/round#Examples) for more details.
      var pair = (toString(number) + 'e').split('e'),
          value = func(pair[0] + 'e' + (+pair[1] + precision));

      pair = (toString(value) + 'e').split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }
    return func(number);
  };
}

module.exports = createRound;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(26);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(27)))

/***/ }),
/* 27 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(30),
    isArguments = __webpack_require__(35),
    isArray = __webpack_require__(4),
    isIndex = __webpack_require__(36),
    isLength = __webpack_require__(37),
    toKey = __webpack_require__(38);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(4),
    isKey = __webpack_require__(31),
    stringToPath = __webpack_require__(33),
    toString = __webpack_require__(12);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(4),
    isSymbol = __webpack_require__(32);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(34);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(2);

/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */
function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}

module.exports = isInteger;


/***/ })
/******/ ]);
});
//# sourceMappingURL=color.js.map